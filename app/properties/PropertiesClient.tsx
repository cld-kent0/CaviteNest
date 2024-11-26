"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../properties/Heading";
import ListingCard from "../properties/ListingCard";
import Button from "../properties/Button";
import { SafeListing, SafeUser } from "../types";
import EditPropertyModal from "../components/modals/EditPropertyModal";

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [archivingId, setArchivingId] = useState("");
  const [selectedListingData, setSelectedListingData] =
    useState<SafeListing | null>(null); // To hold the data of the listing to be edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To control the visibility of the modal

  // Edit Property
  const onEdit = useCallback(
    (id: string) => {
      const listingToEdit = listings.find((listing) => listing.id === id);
      if (listingToEdit) {
        setSelectedListingData(listingToEdit);
        setIsEditModalOpen(true); // Open the modal
        console.log("Editing listing: ", listingToEdit); // Debugging
      }
    },
    [listings]
  );

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedListingData(null); // Clear the selected listing data when modal closes
  };

  // Archive Property
  const onArchive = useCallback(
    (listingId: string) => {
      setArchivingId(listingId);

      axios
        .patch(`/api/listings/${listingId}`, {
          action: "archive",
        })
        .then(() => {
          toast.success("Listing archived");
          router.refresh(); // Refresh the page to reflect the changes
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.error || "Failed to archive listing"
          );
        })
        .finally(() => {
          setArchivingId("");
        });
    },
    [router]
  );

  // Delete Property
  const onCancel = useCallback(
    (id: string) => {
      // Show a confirmation prompt before proceeding with the deletion
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this property?"
      );

      if (isConfirmed) {
        setDeletingId(id);

        axios
          .delete(`/api/listings/${id}`)
          .then(() => {
            toast.success("Listing Deleted");
            window.location.reload();
            router.refresh();
          })
          .catch((error) => {
            toast.error(error?.response?.data?.error);
          })
          .finally(() => {
            setDeletingId("");
          });
      } else {
        toast.error("Deletion cancelled");
      }
    },
    [router]
  );

  // Filter out archived listings
  const activeListings = listings.filter((listing) => !listing.is_archived);

  // Dashboard summary (total properties and rental type)
  const totalProperties = activeListings.length;
  const rentalTypeCount = activeListings.reduce((acc, listing) => {
    const rentalType = listing.rentalType || "Unknown"; // Assuming rental_type exists
    acc[rentalType] = (acc[rentalType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Container>
      {/* Three-column layout: Title, Dashboard, Archived Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center">
        {/* Column 1: Title */}
        <div className="md:col-span-1">
          <Heading
            title="My Properties"
            subTitle="Where you've been and where you're going"
          />
        </div>

        {/* Column 2: Dashboard Summary */}
        <div className="sm:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-12">
          {/* Total Properties Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Total Properties
            </h2>
            <p className="text-3xl font-bold text-gray-600">
              {totalProperties}
            </p>
          </div>

          {/* Reservations by Rental Type Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Rental Types
            </h2>
            <ul className="space-y-2 text-gray-600">
              {Object.entries(rentalTypeCount).map(([rentalType, count]) => (
                <li key={rentalType} className="flex justify-between">
                  <span className="capitalize">{rentalType}:</span>
                  <span>{count} properties</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: View Archived Properties Button */}
        <div className="sm:col-span-1 flex justify-center sm:justify-start mt-28 md:mt-28 relative">
          <Button
            label="View Archived Properties"
            onClick={() => router.push("/archived-properties")}
          />
        </div>
      </div>

      {/* Properties List */}
      <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {activeListings.length > 0 ? (
          activeListings.map((item) => (
            <ListingCard
              currentUser={currentUser}
              key={item.id}
              data={item}
              actionId={item.id}
              editLabel="Edit Property"
              archiveLabel="Archive Property"
              actionLabel="Delete Property"
              onAction={onCancel}
              onArchive={onArchive}
              onEdit={() => onEdit(item.id)}
              disabled={deletingId === item.id || archivingId === item.id}
            />
          ))
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-xl text-gray-500">
            No properties found
          </div>
        )}
      </div>

      {/* Render EditPropertyModal if a listing is selected */}
      {isEditModalOpen && selectedListingData && (
        <EditPropertyModal
          listingData={selectedListingData} // Pass the selected listing data to the modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal} // Close modal function
        />
      )}
    </Container>
  );
};

export default PropertiesClient;
