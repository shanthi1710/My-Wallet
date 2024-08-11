import { NextResponse } from "next/server";
import { qrPay } from "../../lib/qrPay";

export async function POST(req: Request) {
  const { to, amount } = await req.json();
  try {
    const result = await qrPay(to, parseFloat(amount));
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
