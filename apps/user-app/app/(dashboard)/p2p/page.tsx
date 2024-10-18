import dynamic from "next/dynamic";
import { Suspense } from "react";

const SendCard = dynamic(
  () => import("../../../components/SendCard").then((mod) => mod.SendCard),
  {
    ssr: false,
    loading: () => <div>Loading SendCard...</div>,
  }
);

export default function Page() {
  return (
    <div className="w-full">
      <Suspense fallback={<div>Loading content...</div>}>
        <SendCard />
      </Suspense>
    </div>
  );
}
