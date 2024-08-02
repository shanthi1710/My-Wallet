import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import DashboardPage from "../../../components/dashboard";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className=" h-screen overflow-hidden">
      <DashboardPage />
    </div>
  );
}
