"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import {} from "./Appbar";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

export function SidebarClient() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensures that the component is marked as client-side rendered
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return null; // Render nothing on the server-side to avoid mismatches
  }

  return (
    <Sidebar
      onSignin={handleSignIn}
      onSignout={handleSignOut}
      user={session?.user}
    />
  );
}
