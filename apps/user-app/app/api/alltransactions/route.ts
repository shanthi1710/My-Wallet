import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    include: {
      sentTransfers: true,
      OnRampTransaction: true,
      receivedTransfers: true,
    },
  });

  if (!user) {
    return { Message: "User Not Exist" };
  }

  const allTransactions = [
    //----------------------------------------------------------------------------------------------------------------------------
    ...user.OnRampTransaction.map((item) => ({
      ...item,
      type: `Added to your wallet <-------> ${item.startTime.toLocaleString()} <-------> ${item.status} -----------------> `,
      timestamp: item.startTime.toISOString(),
    })),
    //----------------------------------------------------------------------------------------------------------------------------
    ...(await Promise.all(
      user.sentTransfers.map(async (item) => {
        const toUser = await db.user.findUnique({
          where: {
            id: item.toUserId,
          },
        });
        return {
          ...item,
          type: `Sent to ${toUser?.name} <-------> ${item.timestamp.toLocaleString()}`,
          timestamp: item.timestamp.toISOString(),
        };
      })
    )),
    //----------------------------------------------------------------------------------------------------------------------------
    ...(await Promise.all(
      user.receivedTransfers.map(async (item) => {
        const fromUser = await db.user.findUnique({
          where: {
            id: item.fromUserId,
          },
        });
        return {
          ...item,
          type: `received form ${fromUser?.name}`,
          timestamp: item.timestamp.toISOString(),
        };
      })
    )),
    //----------------------------------------------------------------------------------------------------------------------------
  ];

  allTransactions.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return NextResponse.json({
    allTransactions,
  });
}
