"use server";

import { getServerSession } from "next-auth";
import authOptions from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dash");
  } else {
    redirect("/userAuth");
  }
}
