import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

const DashboardPage = dynamic(() => import("../../../components/dashboard"), {
  ssr: false,
  loading: () => <div>Loading dashboard...</div>,
});

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div className="h-screen overflow-hidden">
      <Suspense fallback={<div>Loading content...</div>}>
        <DashboardPage />
      </Suspense>
    </div>
  );
}
