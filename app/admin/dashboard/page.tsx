'use client';

import { useEffect, useState } from "react";
import Graph from "../components/Graph";
import SubscriptionManagement from "../components/SubscriptionManagement";
import DashboardCard from "../components/DashboradCard";
import { SubscribedUser } from "@/app/types";
import PropertyOverview from '../components/PropertyOverview'; // Import the PropertyOverview component
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
        const response = await fetch('/api/admin/admin-dashboard-data');
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
      <div className="grid grid-cols-4 gap-4 mb-6"> {/* Updated to 4 columns to fit the new card */}
        <DashboardCard title="Total Lessors" value={dashboardData.totalLessors} />
        <DashboardCard title="Total Lessees" value={dashboardData.totalLessees} />
        <DashboardCard title="Active Subscriptions" value={dashboardData.activeSubscriptions} />
        <DashboardCard title="Total Properties" value={dashboardData.totalProperties} /> {/* New card for total properties */}
      </div>

      {/* <h3 className="text-xl font-semibold mb-4">Subscribed Users</h3>
      <div className="overflow-auto bg-white shadow-md rounded-lg p-4 mb-6">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.subscribedUsers.length > 0 ? (
              dashboardData.subscribedUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.name || "N/A"}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role.toLowerCase()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">No subscribed users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

      {/* Add the Property Overview section */}
      <h3 className="text-xl font-semibold mb-4">Property Overview</h3>
      <PropertyOverview />  {/* Insert the PropertyOverview component */}

      <SalesRevenueGraph />

      {/* <Graph /> */}
      {/* <SubscriptionManagement lessorId={"Lessor"} /> */}
    </div>
  );
};

export default AdminDashboard;


