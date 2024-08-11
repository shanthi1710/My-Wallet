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

  const handleTransfer = async () => {
    setLoading(true); // Disable the button
    try {
      await p2pTransfer(number, Number(amount));
    } catch (error) {
      console.error("Transfer failed", error);
    } finally {
      setLoading(false); // Enable the button again
    }
  };

  return (
    <div className="h-[90vh]">
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
    </div>
  );
}
