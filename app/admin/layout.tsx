import React from "react";
import { Nunito } from "next/font/google";
import getCurrentUser from "../actions/getCurrentUser";
import NavbarHeader from "./components/NavbarHeader";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

const font = Nunito({
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the current user
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <body className={`${font.className} bg-gray-100`}>
      <div className="flex flex-col">
        {/* Navbar */}
        <NavbarHeader />

        {/* Main Layout */}
        <div className="flex flex-row">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </body>
  );
}
