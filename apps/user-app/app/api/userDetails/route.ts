"use server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        message: "You are not logged in",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const userData = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        Balance: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      email: userData.email,
      name: userData.name,
      number: userData.number,
      isVerified: userData.isVerified,
      profileImg: userData.profileImg,
      balance: userData.Balance.map((item) => item.amount),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching user details",
        error,
      },
      {
        status: 500,
      }
    );
  }
};
