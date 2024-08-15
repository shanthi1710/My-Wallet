"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback } from "./avatar";
import { useSession } from "next-auth/react";

interface Transaction {
  id: string;
  name: string;
  type: string;
  amount: number;
}

export function RecentSales1() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  useEffect(() => {
    axios
      .get<{ lastTenTransactions: Transaction[] }>("/api/recentTransactions")
      .then((res) => {
        const data = res.data.lastTenTransactions;
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch transactions");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-8">
      {transactions?.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {session.data?.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.type}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +RS.{transaction.amount.toFixed(2)}
            </div>
          </div>
        ))
      ) : (
        <p>No transactions available.</p>
      )}
    </div>
  );
}
