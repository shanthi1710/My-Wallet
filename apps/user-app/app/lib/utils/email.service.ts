import nodemailer from "nodemailer";
import { Welcome_Email } from "@repo/constants/email";

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

export async function sendEmail(to: string, username: string) {
  try {
    const emailTemplate = Welcome_Email(username);

    await transporter.sendMail({
      to,
      from: "er.shanthi20@gmail.com",
      subject: "Welcome to ReadBite!",
      html: emailTemplate,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
