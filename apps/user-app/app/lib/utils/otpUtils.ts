import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendOtp(phoneNumber: string) {
  if (!process.env.TWILIO_SERVICE_ID) {
    throw new Error("TWILIO_SERVICE_ID is not defined");
  }

  return client.verify.v2
    .services(process.env.TWILIO_SERVICE_ID)
    .verifications.create({
      to: phoneNumber,
      channel: "sms",
    });
}

export async function verifyOtp(phoneNumber: string, otp: string) {
  if (!process.env.TWILIO_SERVICE_ID) {
    throw new Error("TWILIO_SERVICE_ID is not defined");
  }

  return client.verify.v2
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks.create({
      code: otp,
      to: phoneNumber,
    });
}
