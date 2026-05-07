import type { Metadata } from "next";

import { MasterDashboard } from "@/features/staff/components/master-dashboard";
import { getMasterDashboardData } from "@/features/staff/queries";

export const metadata: Metadata = {
  title: "Master Dashboard",
  description: "Upcoming bookings, services, and schedule settings.",
};

export default async function DashboardPage() {
  const data = await getMasterDashboardData();

  return <MasterDashboard data={data} />;
}
