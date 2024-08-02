"use client";

import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import { Overview } from "../@/components/ui/overview";
import { RecentSales } from "../@/components/ui/recent-sales";
import { useEffect, useState } from "react";
import axios from "axios";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

interface UserResponse {
  balance: number;
}

interface SentTransferResponse {
  result: number;
}

export default function DashboardPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [spent, setSpent] = useState<number | null>(null);

  useEffect(() => {
    async function balanceData() {
      try {
        const response = await axios.get<UserResponse>("/api/user");
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    }
    balanceData();
  }, []);

  useEffect(() => {
    async function transactionData() {
      try {
        const response =
          await axios.get<SentTransferResponse>("/api/senttransfer");
        setSpent(response.data.result);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    }
    transactionData();
  }, []);

  return (
    <div className="flex-1  p-4 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full ">
        <div className="flex flex-col space-y-4 min-h-full">
          <div className="flex justify-between space-x-4">
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Balance
                </CardTitle>

                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs {balance}</div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs {spent}</div>
              </CardContent>
            </Card>
          </div>
          <Card className="flex-1 pt-8 overflow-hidden">
            <CardContent className="pl-2 h-full">
              <Overview />
            </CardContent>
          </Card>
        </div>
        <div className="min-h-full" style={{ width: "590px" }}>
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <CardTitle>Recent transaction</CardTitle>
              <CardDescription>
                You made 5 transaction this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full overflow-auto">
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
