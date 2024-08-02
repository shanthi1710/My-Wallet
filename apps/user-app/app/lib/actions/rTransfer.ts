"use server";

import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import authOptions from "./../auth";

export default async function sentTransfer() {
  const session = await getServerSession(authOptions);

  const user = db.user.findUnique({
    where: {
      email: session?.user?.email || undefined,
    },
    include: {
      receivedTransfers: true,
    },
  });

  if (!user) {
    return { Message: "User Not Exist" };
  }

  return {
    sentTransfer: user.receivedTransfers,
  };
}
