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
    ...user.OnRampTransaction.map((item) => ({
      ...item,
      type: `Added to your wallet <-------> ${item.startTime.toLocaleString()} <-------> ${item.status} -----------------> `, // add status also
      timestamp: item.startTime.toISOString(),
    })),
    ...user.sentTransfers.map((item) => ({
      ...item,
      type: "sent",
      timestamp: item.timestamp.toISOString(),
    })),
    ...user.receivedTransfers.map((item) => ({
      ...item,
      type: "received",
      timestamp: item.timestamp.toISOString(),
    })),
  ];
  allTransactions.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return NextResponse.json({
    allTransactions,
  });
}
