"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@repo/ui/card";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import { Center } from "../@/components/ui/Center";

const PayPage: React.FC = () => {
  const router = useRouter();
  const [recipient, setRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (router.isReady) {
      const { recipient } = router.query;
      setRecipient(recipient as string);
    }
  }, [router.isReady, router.query]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/qrtransfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: recipient, amount: parseFloat(amount) }),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error while processing transfer", error);
    }
  };

  if (!recipient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <Center>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">Pay</CardTitle>
            <CardDescription>Send money to {recipient}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </form>
          </CardContent>
        </Card>
      </Center>
    </div>
  );
};

export default PayPage;
