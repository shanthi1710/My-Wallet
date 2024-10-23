// /app/api/notifications/markAsRead.ts
import { getServerSession } from "next-auth";

import prisma from "@repo/db/client";
import authOptions from "../../../lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  return new Response(
    JSON.stringify({ message: "Notifications marked as read" }),
    {
      status: 200,
    }
  );
}
