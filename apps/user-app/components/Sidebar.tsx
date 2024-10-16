"use client";
import Link from "next/link";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { AiOutlineTransaction } from "react-icons/ai";
import { RiP2pFill } from "react-icons/ri";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MdQrCodeScanner } from "react-icons/md";
import { Button } from "@repo/ui/button";
import { IoIosLogOut } from "react-icons/io";
import { BiMoneyWithdraw } from "react-icons/bi";
interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

export const Sidebar: React.FC<AppbarProps> = ({
  user,
  onSignin,
  onSignout,
}) => {
  const pathname = usePathname();
  const [selectedMenu, setSelectedMenu] = useState("");

  const menus = [
    { name: "Dashboard", link: "/dash", icon: RiDashboardHorizontalLine },
    { name: "Add Money", link: "/transfer", icon: FaMoneyBillTransfer },
    { name: "withdraw money", link: "/withdraw", icon: BiMoneyWithdraw },
    {
      name: "Transactions History",
      link: "/transactions",
      icon: AiOutlineTransaction,
    },

    { name: "P2P", link: "/p2p", icon: RiP2pFill },
    { name: "Qr-Scan", link: "/qr-scan", icon: MdQrCodeScanner },
  ];

  useEffect(() => {
    const currentMenu = menus.find((menu) => menu.link === pathname);
    if (currentMenu) {
      setSelectedMenu(currentMenu.name);
    } else {
      setSelectedMenu("Dashboard");
    }
  }, [pathname]);

  return (
    <div className="bg-white w-72 text-black font-semibold border-r-2 px-2 flex justify-between flex-col pb-2">
      <div className="mt-4 flex flex-col gap-4 relative p-1">
        {menus.map((menu, i) => (
          <Link
            className={`flex items-center gap-3.5 p-2.5 rounded-lg ${selectedMenu === menu.name ? "bg-purple-700 text-white font-semibold" : ""}`}
            href={menu.link}
            key={i}
            onClick={() => setSelectedMenu(menu.name)}
          >
            <div>{React.createElement(menu.icon, { size: 26 })}</div>
            <h2
              className={`whitespace-pre ${selectedMenu === menu.name ? "" : ""}`}
            >
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="mt-auto p-4">
        <div className="flex justify-center items-center bg-purple-700 rounded-lg p-2.5">
          <Button
            className="font-semibold text-white flex items-center"
            onClick={user ? onSignout : onSignin}
          >
            {user ? (
              <>
                <IoIosLogOut
                  className="mr-2 font-semibold"
                  style={{ fontSize: "1.5rem" }}
                />
                Logout
              </>
            ) : (
              " "
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
