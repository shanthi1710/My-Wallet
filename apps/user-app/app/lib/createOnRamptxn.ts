"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import db from "@repo/db/client";
interface hdfcresponse {
  message: string;
}
export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  const token = Math.random().toString();

  if (!session?.user?.email) {
    return {
      success: false,
      message: "User not logged in",
    };
  }

  const user = await db.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  await db.onRampTransaction.create({
    data: {
      userId: Number(user.id),
      amount: amount,
      status: "Processing",
      startTime: new Date(),
      provider,
      token: token,
    },
  });

  const shanthi = process.env.HDFC_SECRET;

  try {
    const res = await axios.post<hdfcresponse>(
      "http://localhost:3003/hdfcWebhook",
      {
        token: token,
        user_identifier: user.id.toString(),
        amount: amount.toString(),
      },

      {
        headers: {
          SECRET: process.env.HDFC_SECRET || "mysecret",
        },
      }
    );

    if (res.data.message === "Captured") {
      await db.notification.create({
        data: {
          message: `You have successfully added ₹${amount} to your wallet.`,
          type: "AddFunds",
          userId: Number(user.id),
        },
      });

      return {
        success: true,
        message: "Transaction Success",
      };
    } else {
      return {
        success: false,
        message: "Transaction Failed",
      };
    }
  } catch (error) {
    console.error("Error during transaction:", error);
    return {
      success: false,
      message: "Transaction Failed",
    };
  }
}
