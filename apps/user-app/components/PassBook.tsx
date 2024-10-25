"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PassBook() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchData = async (exportPDF = false) => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setError("");

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(exportPDF && { export: "pdf" }),
      });
      const response = await fetch(`/api/getData?${params.toString()}`);
      if (exportPDF) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "transactions.pdf";
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        const result = await response.json();
        setData(result);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(90vh-4rem)] overflow-hidden">
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex space-x-2 justify-between ">
              <Button onClick={() => fetchData(false)}>Fetch Data</Button>
              <Button onClick={() => fetchData(true)}>Export as PDF</Button>
            </div>
          </div>
        </CardContent>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto p-6">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <h2 className="text-lg font-bold">
                Person to Person Transactions
              </h2>
              <table className="min-w-full mt-2 border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">From</th>
                    <th className="px-4 py-2 border">To</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.p2pTransfers.map((transfer: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">
                        {transfer.fromUserNumber}
                      </td>
                      <td className="px-4 py-2 border">
                        {transfer.toUserNumber}
                      </td>
                      <td className="px-4 py-2 border">{transfer.amount}</td>
                      <td className="px-4 py-2 border">{transfer.status}</td>
                      <td className="px-4 py-2 border">
                        {new Date(transfer.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="mt-6 text-lg font-bold">Fund Add Transactions</h2>
              <table className="min-w-full mt-2 border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Provider</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Start Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.onRampTransactions.map(
                    (transaction: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">
                          {transaction.provider}
                        </td>
                        <td className="px-4 py-2 border">
                          {transaction.amount}
                        </td>
                        <td className="px-4 py-2 border">
                          {transaction.status}
                        </td>
                        <td className="px-4 py-2 border">
                          {new Date(transaction.startTime).toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
