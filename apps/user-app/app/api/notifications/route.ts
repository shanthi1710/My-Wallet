import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import prisma from "@repo/db/client";

export async function GET(req: Request) {
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

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify({ notifications }), {
    status: 200,
  });
}
