"use client";
import React from "react";
import QRCode from "qrcode.react";
import { Card } from "@repo/ui/card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Center } from "./Center";

interface QRCodeComponentProps {
  value: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ value }) => {
  const handleScan = () => {
    // Simulate QR code scan and redirect
    const scannedValue = value; // Assume the scanned value is the same as `value`
    window.location.href = `/pay?recipient=${scannedValue}`;
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <Center>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">QR SCAN</CardTitle>
            <CardDescription>Send Money in one-scan.</CardDescription>
          </CardHeader>
          <CardContent>
            <QRCode value={value} onClick={handleScan} />
          </CardContent>
        </Card>
      </Center>
    </div>
  );
};

export default QRCodeComponent;
