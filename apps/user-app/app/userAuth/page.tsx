"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import walletImage from "../../public/wallet.png";
import { useState } from "react";

export const AuthTabs = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
} as const;

export type AuthTabValues = (typeof AuthTabs)[keyof typeof AuthTabs];

export default function login() {
  const [authTab, setAuthTab] = useState<AuthTabValues>(AuthTabs.LOGIN);

  const handleSetAuthTab = (tab: AuthTabValues) => {
    setAuthTab(tab);
  };

  return (
    <div className="h-screen justify-center flex items-center flex-col">
      <Image src={walletImage} width={190} height={190} alt="logo" />
      <Tabs value={authTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value={AuthTabs.LOGIN}
            onClick={() => handleSetAuthTab(AuthTabs.LOGIN)}
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value={AuthTabs.REGISTER}
            onClick={() => handleSetAuthTab(AuthTabs.REGISTER)}
          >
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value={AuthTabs.LOGIN}>
          <Card>
            <Login />
          </Card>
        </TabsContent>
        <TabsContent value={AuthTabs.REGISTER}>
          <Card>
            <Register setAuthTab={handleSetAuthTab} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
