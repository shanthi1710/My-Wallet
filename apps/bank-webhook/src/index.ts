import express, { Request, Response } from "express";
import db from "@repo/db/client";
import { z } from "zod";
import dotenv from "dotenv";
const app = express();
app.use(express.json());
dotenv.config();
const paymentSchema = z.object({
  token: z.string(),
  user_identifier: z.string(),
  amount: z.string(),
});

const SECRET = process.env.SECRET;
console.log("secret:----->", SECRET);
app.post("/hdfcWebhook", async (req: Request, res: Response) => {
  const receivedSecret = req.headers["hdfcsecret"];
  if (receivedSecret !== SECRET) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  const result = paymentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: result.error.errors,
    });
  }
  const { token, user_identifier, amount } = result.data;
  const paymentInformation = {
    token,
    userId: user_identifier,
    amount,
  };
  try {
    await db.$transaction([
      db.balance.upsert({
        where: { userId: Number(paymentInformation.userId) },
        update: {
          amount: { increment: Number(paymentInformation.amount) },
          locked: { increment: Number(paymentInformation.amount) / 10 },
        },
        create: {
          amount: Number(paymentInformation.amount),
          userId: Number(paymentInformation.userId),
          locked: Number(paymentInformation.amount) / 10,
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.json({
      message: "Captured",
    });
  } catch (error) {
    console.error("Database transaction error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
