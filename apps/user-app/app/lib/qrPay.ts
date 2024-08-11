"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "@repo/db/client";

export async function qrPay(to: string, amount: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      message: "User not authenticated",
    };
  }

  const fromUser = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!fromUser) {
    return {
      message: "Sender not found",
    };
  }

  const toUser = await prisma.user.findFirst({
    where: {
      email: to,
    },
  });

  if (!toUser) {
    return {
      message: "Recipient not found",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Lock the balance row for the fromUser
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromUser.id} FOR UPDATE`;

      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(fromUser.id) },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      // Decrement the balance and set the locked amount in a single query
      await tx.balance.update({
        where: { userId: Number(fromUser.id) },
        data: {
          amount: { decrement: amount },
          locked: { increment: amount / 10 },
        },
      });

      // Upsert the balance for the toUser
      await tx.balance.upsert({
        where: { userId: Number(toUser.id) },
        update: {
          amount: { increment: amount },
          locked: { increment: amount / 10 },
        },
        create: {
          userId: Number(toUser.id),
          amount: amount,
          locked: amount / 10,
        },
      });

      // Create the transfer record
      await tx.qrTransfer.create({
        data: {
          fromUserId: Number(fromUser.id),
          toUserId: Number(toUser.id),
          amount,
          timestamp: new Date(),
          status: "Success",
        },
      });
    });

    return {
      message: "Transfer successful",
    };
  } catch (error) {
    console.error(error);

    // Create a failure transfer record outside of the main transaction to ensure it is recorded even if the main transaction fails
    await prisma.qrTransfer.create({
      data: {
        fromUserId: Number(fromUser.id),
        toUserId: Number(toUser.id),
        amount,
        timestamp: new Date(),
        status: "Failure",
      },
    });

    return {
      message: "Error while processing transfer",
    };
  }
}
