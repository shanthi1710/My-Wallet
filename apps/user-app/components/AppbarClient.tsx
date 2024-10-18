"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "./Appbar";
import { useEffect, useState } from "react";

export function AppbarClient() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
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
    return null;
  }
  // console.log(session?.user);
  return (
    <Appbar
      onSignin={handleSignIn}
      onSignout={handleSignOut}
      user={session?.user}
    />
  );
}
