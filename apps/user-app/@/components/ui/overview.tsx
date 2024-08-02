"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Define types
interface MonthlyData {
  month: string;
  totalAmount: number;
}

const generateAllMonths = (): MonthlyData[] => {
  const months: MonthlyData[] = [];
  const startDate = new Date();
  startDate.setMonth(0, 1); // Set to January 1st of the current year

  for (let i = 0; i < 12; i++) {
    const month = new Date(startDate);
    month.setMonth(startDate.getMonth() + i);
    months.push({
      month: month.toLocaleString("en-US", { month: "short" }),
      totalAmount: 0,
    });
  }
  return months;
};

export function Overview() {
  const [data, setData] = useState<MonthlyData[]>(generateAllMonths());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (response.ok) {
          const result: MonthlyData[] = await response.json();

          // Convert month from yyyy-MM to a short month name
          const formattedData = result.map((item) => ({
            month: new Date(item.month + "-01").toLocaleString("en-US", {
              month: "short",
            }),
            totalAmount: item.totalAmount,
          }));

          // Create a map for quick lookup
          const dataMap = new Map(
            formattedData.map((item) => [item.month, item.totalAmount])
          );

          // Update state with the combined data
          const allMonthsData = generateAllMonths().map((month) => ({
            month: month.month,
            totalAmount: dataMap.get(month.month) || 0,
          }));

          setData(allMonthsData);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("An error occurred while fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Bar
          dataKey="totalAmount"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
