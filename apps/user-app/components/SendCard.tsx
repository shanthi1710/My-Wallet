"use client";
import { Button } from "../@/components/ui/button";
import { Center } from "../@/components/ui/Center";
import { Input } from "../@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/p2pTransfer";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const response = await p2pTransfer(number, Number(amount));
      if (response?.message === "Transfer successful") {
        setMessage("Successfully transferred");
      } else {
        setMessage(response?.message || "Transfer failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage("Transfer failed: " + error.message);
      } else {
        setMessage("Transfer failed: An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage(""); // Close the pop-up
    setNumber("");
    setAmount("");
  };

  return (
    <div className="h-[90vh] relative">
      <Center>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Send Money</CardTitle>
            <CardDescription>Send Money in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Mobile No.</Label>
                  <Input
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value);
                    }}
                    id="name"
                    placeholder="Mobile No. of Receiver"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    id="amount"
                    placeholder="Amount to be Sent"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleTransfer} disabled={loading}>
              {loading ? "Processing..." : "Send"}
            </Button>
          </CardFooter>
        </Card>
      </Center>

      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="mb-4 text-lg font-semibold">{message}</div>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
