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
  const [selectedListingData, setSelectedListingData] = useState<SafeListing | null>(null); // To hold the data of the listing to be edited
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
    const isConfirmed = window.confirm("Are you sure you want to delete this property?");
    
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

  return (
    <Container>
      <Heading
        title="My Properties"
        subTitle="Where you've been and where you're going"
      />
      <div className="relative">
        <Button
          label="View Archived Properties"
          onClick={() => router.push("/archived-properties")}
        />
      </div>
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
