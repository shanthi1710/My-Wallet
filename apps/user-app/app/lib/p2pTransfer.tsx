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

      // Update the sender's balance
      await tx.balance.update({
        where: { userId: Number(fromUser.id) },
        data: {
          amount: { decrement: amount },
          locked: { increment: amount / 10 },
        },
      });

      // Update or create the recipient's balance
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

      // Log the successful p2p transfer
      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(fromUser.id),
          toUserId: Number(toUser.id),
          amount,
          timestamp: new Date(),
          status: "Success",
        },
      });
      // Notification for the sender (fromUser)
      await tx.notification.create({
        data: {
          message: `You have successfully sent ₹${amount} to ${toUser.number}.`,
          type: "SendMoney",
          userId: fromUser.id,
        },
      });

      // Notification for the recipient (toUser)
      await tx.notification.create({
        data: {
          message: `You have received ₹${amount} from ${fromUser.number}.`,
          type: "ReceiveMoney",
          userId: toUser.id,
        },
      });
    });

    return {
      message: "Transfer successful",
    };
  } catch (error) {
    console.error(error);

    // Log the failed transfer
    await prisma.p2pTransfer.create({
      data: {
        fromUserId: Number(fromUser.id),
        toUserId: Number(toUser.id),
        amount,
        timestamp: new Date(),
        status: "Failure",
      },
    });

    // Optionally: Create a notification for failed transfers (sender only)
    await prisma.notification.create({
      data: {
        message: `Your attempt to send $${amount} to ${toUser.number} failed due to insufficient funds.`,
        type: "SendMoney",
        userId: fromUser.id,
      },
    });

    return {
      message: "Insufficient funds",
    };
  }
}
