"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Sidebar } from "./Sidebar";

export function SidebarClient() {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "http://localhost:3001/userAuth" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (status === "loading") return <div>Loading sidebar...</div>;
  return (
    <Sidebar
      onSignin={handleSignIn}
      onSignout={handleSignOut}
      user={session?.user}
    />
  );
}
