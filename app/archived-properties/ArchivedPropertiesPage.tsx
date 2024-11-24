// app/archived-properties/ArchivedPropertiesPage.tsx (Client Component)

"use client";

import { SafeListing, SafeUser } from "@/app/types";
import { useState, useEffect } from "react";
import axios from "axios";
import Container from "../components/Container";
import ListingCard from "../properties/ListingCard";
import Heading from "../properties/Heading";
import Button from "../components/Button";
import BackButton from "../archived-properties/BackButton";
import { useRouter } from "next/navigation";

interface ArchivedPropertiesPageProps {
  currentUser: SafeUser | null;
  onUnarchiveSuccess?: (unarchivedListing: SafeListing) => void;
}

const ArchivedPropertiesPage: React.FC<ArchivedPropertiesPageProps> = ({
  currentUser,
  onUnarchiveSuccess,
}) => {
  const router = useRouter();
  const [archivedListings, setArchivedListings] = useState<SafeListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("/api/listings/archived")
      .then((response) => {
        setArchivedListings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching archived properties:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onUnarchive = (listingId: string) => {
    axios
      .patch(`/api/listings/${listingId}`, { action: "unarchive" })
      .then((response) => {
        const unarchivedListing = response.data;

        setArchivedListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== listingId)
        );

        if (onUnarchiveSuccess) {
          onUnarchiveSuccess(unarchivedListing);
        }
      })
      .catch((error) => {
        console.error("Error unarchiving the property:", error);
      });
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
          onClick={() => {
            router.push("/properties");
            router.refresh();
          }}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : archivedListings.length === 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-xl text-gray-500">
          No archived properties found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {archivedListings.map((listing) => (
            <div key={listing.id} className="relative">
              <ListingCard
                data={listing}
                currentUser={currentUser}
                disabled={true}
              />
              <Button
                label="Restore Property"
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
