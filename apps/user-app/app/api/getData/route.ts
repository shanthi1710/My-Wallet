import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client"; //
import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import { PDFDocument, rgb } from "pdf-lib";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const exportPDF = searchParams.get("export") === "pdf";

    const user = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        sentTransfers: {
          where: {
            timestamp: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          },
          include: {
            fromUser: {
              select: {
                number: true,
              },
            },
            toUser: {
              select: {
                number: true,
              },
            },
          },
        },
        receivedTransfers: {
          where: {
            timestamp: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          },
          include: {
            fromUser: {
              select: {
                number: true,
              },
            },
            toUser: {
              select: {
                number: true,
              },
            },
          },
        },
        OnRampTransaction: {
          where: {
            startTime: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const p2pTransfers = [...user.sentTransfers, ...user.receivedTransfers].map(
      (transfer) => ({
        amount: transfer.amount,
        status: transfer.status,
        timestamp: transfer.timestamp,
        fromUserNumber: transfer.fromUser.number,
        toUserNumber: transfer.toUser.number,
      })
    );

    const onRampTransactions = user.OnRampTransaction;

    const data = {
      p2pTransfers,
      onRampTransactions,
    };

    if (exportPDF) {
      const pdfBytes = await generatePDF(data);
      return new NextResponse(pdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=transactions.pdf",
        },
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generatePDF(data: any) {
  const { p2pTransfers, onRampTransactions } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([900, 600]);
  const { height } = page.getSize();
  const fontSize = 12;

  let yPosition = height - 50;

  page.drawText(`Person to Person Transactions:`, {
    x: 50,
    y: yPosition,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  yPosition -= 20;

  const headers = ["From", "To", "Amount", "Status", "Timestamp"];
  headers.forEach((header, index) => {
    page.drawText(header, {
      x: 50 + index * 150,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  });
  yPosition -= 20;

  p2pTransfers.forEach((transfer: any) => {
    const rowData = [
      transfer.fromUserNumber,
      transfer.toUserNumber,
      transfer.amount.toString(),
      transfer.status,
      new Date(transfer.timestamp).toLocaleString(),
    ];

    rowData.forEach((cell, index) => {
      page.drawText(cell, {
        x: 50 + index * 150,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });
    yPosition -= 20;
  });

  yPosition -= 40;

  page.drawText(`Fund Add Transactions:`, {
    x: 50,
    y: yPosition,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  yPosition -= 20;

  const fundHeaders = ["Provider", "Amount", "Status", "Start Time"];
  fundHeaders.forEach((header, index) => {
    page.drawText(header, {
      x: 50 + index * 150,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  });
  yPosition -= 20;

  onRampTransactions.forEach((transaction: any) => {
    const rowData = [
      transaction.provider,
      transaction.amount.toString(),
      transaction.status,
      new Date(transaction.startTime).toLocaleString(),
    ];

    rowData.forEach((cell, index) => {
      page.drawText(cell, {
        x: 50 + index * 150,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });
    yPosition -= 20;
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
