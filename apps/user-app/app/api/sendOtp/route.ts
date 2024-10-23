import db from "@repo/db/client";
import { sendOtp } from "../../lib/utils/otpUtils";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, "IN");

  if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
    return NextResponse.json(
      { message: "Invalid phone number format" },
      { status: 400 }
    );
  }

  const formattedPhoneNumber = parsedPhoneNumber.format("E.164");

  const plainPhoneNumber = formattedPhoneNumber.slice(-10);

  const user = await db.user.findUnique({
    where: { number: plainPhoneNumber },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const twilioResponse = await sendOtp(formattedPhoneNumber);
    console.log(twilioResponse);
    if (twilioResponse.status === "pending") {
      return NextResponse.json({ message: "OTP sent" }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
