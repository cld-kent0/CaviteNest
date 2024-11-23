"use client";

import React, { useState } from "react";
import { SafeListing, SafeUser } from "@/app/types";
import Container from "../components/Container";
import ListingCard from "../properties/ListingCard";
import Heading from "../properties/Heading";
import Button from "../components/Button";
import BackButton from "../archived-properties/BackButton";
import { useRouter } from "next/navigation";
import axios from "axios";


interface ArchivedPropertiesPageProps {
  currentUser: SafeUser | null;
  initialArchivedListings: SafeListing[];
}

const ArchivedPropertiesPage: React.FC<ArchivedPropertiesPageProps> = ({
  currentUser,
  initialArchivedListings,
}) => {
  const router = useRouter();
  const [archivedListings, setArchivedListings] = useState<SafeListing[]>(
    initialArchivedListings
  );

  const onUnarchive = async (listingId: string) => {
    try {
      const response = await axios.patch(`/api/listings/${listingId}`, {
        action: "unarchive",
      });
      const unarchivedListing = response.data;

      // Update local state
      setArchivedListings((prev) =>
        prev.filter((listing) => listing.id !== listingId)
      );
    } catch (error) {
      console.error("Error unarchiving property:", error);
    }
  };

  return (
    <Container>
      <Heading
        title="Archived Properties"
        subTitle="View your archived properties"
      />
      <div className="relative">
        <BackButton
          label="Back to Properties"
          onClick={() => router.push("/properties")}
        />
      </div>

      {archivedListings.length === 0 ? (
        <div className="text-center text-xl text-gray-500">
          No archived properties found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {archivedListings.map((listing) => (
            <div key={listing.id}>
              <ListingCard
                data={listing}
                currentUser={currentUser}
                disabled
              />
              <Button
                label="Unarchive"
                onClick={() => onUnarchive(listing.id)}
                small
              />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ArchivedPropertiesPage;
