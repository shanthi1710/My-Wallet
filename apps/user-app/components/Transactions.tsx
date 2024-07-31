" use client";
import { RecentSales } from "@/components/ui/recent-sales";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";

export default function Transactions() {
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Transactions History</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
