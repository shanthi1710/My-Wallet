import React, { Suspense } from "react";
import { Inter } from "next/font/google";
import { SidebarClient } from "../../components/SidebarClient";
import { AppbarClient } from "../../components/AppbarClient";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className={`${inter.className} flex flex-col h-screen bg-[#ebe6e6] overflow-hidden`}
    >
      <AppbarClient />
      <div className="flex flex-1 overflow-hidden">
        <SidebarClient />
        <Suspense
          fallback={<div className="p-4 text-center">Loading content...</div>}
        >
          <main className="flex-grow overflow-auto">{children}</main>
        </Suspense>
      </div>
    </div>
  );
}
