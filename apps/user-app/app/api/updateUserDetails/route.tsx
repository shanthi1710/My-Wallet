"use server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";

export const POST = async (request: Request) => {
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

  const { name, email, profileImg } = await request.json();

  try {
    const updatedUser = await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
        email,
        profileImg,
      },
    });

    return NextResponse.json({
      message: "User details updated successfully",
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        profileImg: updatedUser.profileImg,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred while updating user details",
        error,
      },
      {
        status: 500,
      }
    );
  }
};
