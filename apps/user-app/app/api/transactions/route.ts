import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import { NextResponse } from "next/server";
import { format, startOfMonth } from "date-fns";

// Define types
interface Transaction {
  timestamp: Date;
  amount: number;
}

interface MonthlyData {
  [key: string]: number;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      sentTransfers: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 404 }
    );
  }

  const transactions: Transaction[] = user.sentTransfers;

  // Group transactions by month
  const monthlyData: MonthlyData = transactions.reduce((acc, transaction) => {
    const monthKey = format(
      startOfMonth(new Date(transaction.timestamp)),
      "yyyy-MM"
    );

    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }

    acc[monthKey] += transaction.amount;

    return acc;
  }, {} as MonthlyData);

  // Convert monthlyData to an array of objects
  const monthlyDataArray = Object.keys(monthlyData).map((month) => ({
    month,
    totalAmount: monthlyData[month],
  }));

  return NextResponse.json(monthlyDataArray);
}
