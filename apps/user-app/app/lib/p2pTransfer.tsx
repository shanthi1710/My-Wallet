"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
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
      number: to,
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

      await tx.balance.update({
        where: { userId: Number(fromUser.id) },
        data: {
          amount: { decrement: amount },
          locked: amount / 10,
        },
      });

      await tx.balance.upsert({
        where: { userId: Number(toUser.id) },
        update: {
          amount: { decrement: amount },
          locked: amount / 10,
        },
        create: {
          userId: toUser.id,
          amount: amount,
          locked: amount / 10,
        },
      });

      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(fromUser.id),
          toUserId: toUser.id,
          amount,
          timestamp: new Date(),
        },
      });
    });

    return {
      message: "Transfer successful",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error while processing transfer",
    };
  }
}
