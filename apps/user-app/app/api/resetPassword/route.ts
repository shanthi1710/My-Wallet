import db from "@repo/db/client";
import { NextResponse } from "next/server";
import { verifyOtp } from "../../lib/utils/otpUtils";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  const { phoneNumber, otp, newPassword } = await request.json();

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
    const twilioResponse = await verifyOtp(formattedPhoneNumber, otp);
    console.log("verify otp twilioResponse:->", twilioResponse);

    if (twilioResponse.status === "approved") {
      const hashedPassword = await hash(newPassword, 10);
      await db.user.update({
        where: { number: plainPhoneNumber },
        data: {
          password: hashedPassword,
        },
      });

      return NextResponse.json(
        { message: "OTP verified and password updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid OTP or verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("OTP verification failed:", error);
    return NextResponse.json(
      { message: "Verification failed due to an error" },
      { status: 500 }
    );
  }
}
