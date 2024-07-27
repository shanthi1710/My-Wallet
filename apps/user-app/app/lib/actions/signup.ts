"use server";

import db from "@repo/db/client";
import bcrypt from "bcrypt";

async function signup(
  email: string,
  name: string,
  password: string,
  number: string
): Promise<boolean | { Message: string }> {
  try {
    const existingUser = await db.user.findFirst({
      where: {
        number: number,
      },
    });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await db.user.create({
        data: {
          email,
          name,
          number,
          password: hashedPassword,
        },
      });
      console.log("user created successfully", newUser);
      return true;
    } else {
      console.warn("User already exists with this number:", number);
      return false;
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return { Message: "It's Us Not You" };
  }
}

export default signup;
