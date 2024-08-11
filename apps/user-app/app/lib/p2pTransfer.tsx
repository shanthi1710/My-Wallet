"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

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
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromUser.id} FOR UPDATE`;

      const fromBalance = await tx.balance.findFirst({
        where: { userId: Number(fromUser.id) },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      await tx.balance.update({
        where: { userId: Number(fromUser.id) },
        data: {
          amount: { decrement: amount },
          locked: { increment: amount / 10 },
        },
      });

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

      await tx.p2pTransfer.create({
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
    await prisma.p2pTransfer.create({
      data: {
        fromUserId: Number(fromUser.id),
        toUserId: Number(toUser.id),
        amount,
        timestamp: new Date(),
        status: "Failure",
      },
    });

    return {
      message: "Insufficient funds",
    };
  }
}
