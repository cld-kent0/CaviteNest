// app/archived-properties/page.tsx
import React from "react";
import axios from "axios";
import ArchivedPropertiesPage from "../components/ArchivedPropertiesPage";
import { SafeUser } from "@/app/types";

// Fetch data for the page
async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const response = await axios.get("/api/auth/current-user");
    return response.data || null;
  } catch {
    return null; // Default to null if fetch fails
  }
}

async function getArchivedListings() {
  try {
    const response = await axios.get("/api/listings/archived");
    return response.data || [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const currentUser = await getCurrentUser();
  const archivedListings = await getArchivedListings();

  return (
    <ArchivedPropertiesPage
      currentUser={currentUser}
      initialArchivedListings={archivedListings}
    />
  );
}
