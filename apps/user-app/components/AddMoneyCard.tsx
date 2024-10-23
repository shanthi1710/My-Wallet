"use client";
import { Button } from "../@/components/ui/button";
import { Card } from "@repo/ui/card";
import * as React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOnRampTransaction } from "../app/lib/createOnRamptxn";
import { Input } from "../@/components/ui/input";
import { Label } from "@/components/ui/label";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [amount, setAmount] = useState("0");
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");

  const handleSelectChange = (value: string) => {
    const selectedBank = SUPPORTED_BANKS.find((bank) => bank.name === value);

    if (selectedBank) {
      setRedirectUrl(selectedBank.redirectUrl);
      setProvider(selectedBank.name);
    }
  };

  const handleAddMoney = async () => {
    try {
      const result = await createOnRampTransaction(Number(amount), provider);
      window.location.href = redirectUrl || "";
      if (result.success) {
        alert("Transaction Succeeded");
      }
    } catch (error) {
      console.error("Error creating on-ramp transaction:", error);
    }
  };

  return (
    <Card title="Add Money">
      <div className="w-full">
        <div className="py-3">
          <Label className="text-md">Amount</Label>
          <Input
            className="mt-3"
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        <div className="text-left">Bank</div>
        <div className="w-full mb-4 py-1">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Banks</SelectLabel>
                {SUPPORTED_BANKS.map((bank) => (
                  <SelectItem key={bank.name} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center pt-4">
          <Button onClick={handleAddMoney}>Add Money</Button>
        </div>
      </div>
    </Card>
  );
};
