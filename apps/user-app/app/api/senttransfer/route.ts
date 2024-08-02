import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import { NextResponse } from "next/server";
import sentTransfer from "../../lib/actions/rTransfer";

export async function GET() {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    include: {
      sentTransfers: true,
    },
  });

  if (!user) {
    return { Message: "User Not Exist" };
  }
  const sorttransactions = user.sentTransfers;
  user.sentTransfers.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const sum = user.sentTransfers.map((item) => {
    return item.amount;
  });
  const result = sum.reduce((arr, cur) => arr + cur, 0);

  return NextResponse.json({
    sorttransactions,
    result,
  });
}
