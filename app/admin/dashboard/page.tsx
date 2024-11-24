"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboradCard";
import { SubscribedUser } from "@/app/types";
import PropertyOverview from "../components/PropertyOverview"; // Import the PropertyOverview component
import SalesRevenueGraph from "./SalesRevenueGraph";

// Define the type for dashboard data
type DashboardData = {
  totalLessors: number;
  totalLessees: number;
  activeSubscriptions: number;
  totalProperties: number; // Add total properties count
  subscribedUsers: SubscribedUser[]; // Use the SubscribedUser type
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalLessors: 0,
    totalLessees: 0,
    activeSubscriptions: 0,
    totalProperties: 0,
    subscribedUsers: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/admin-dashboard-data");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {" "}
        {/* Updated to 4 columns to fit the new card */}
        <DashboardCard
          title="Total Lessors"
          value={dashboardData.totalLessors}
        />
        <DashboardCard
          title="Total Lessees"
          value={dashboardData.totalLessees}
        />
        <DashboardCard
          title="Active Subscriptions"
          value={dashboardData.activeSubscriptions}
        />
        <DashboardCard
          title="Total Properties"
          value={dashboardData.totalProperties}
        />{" "}
      </div>
      <hr />
      <h3 className="mt-6 text-2xl font-bold mb-6">Property Overview</h3>
      <PropertyOverview />
      <hr className="mt-8" />
      <SalesRevenueGraph />
    </div>
  );
};

export default AdminDashboard;
