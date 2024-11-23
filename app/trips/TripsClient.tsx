"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../trips/Heading";
import { SafeReservation, SafeUser } from "../types";
import ListingCard from "../components/listing/ListingCard";

interface TripsClientProps {
  reservations: SafeReservation[]; // Initial reservations passed as props
  currentUser?: SafeUser | null;
  userId: string; // The selected user's ID for filtering reservations
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
  userId,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string>("");
  const [userReservations, setUserReservations] =
    useState<SafeReservation[]>(reservations);

  // Fetch user reservations from the API
  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        const response = await axios.get(`/api/reservations?userId=${userId}`);
        setUserReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchUserReservations();
    const intervalId = setInterval(fetchUserReservations, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [userId]);

  // Cancel reservation handler
  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation cancelled");
          setUserReservations(
            userReservations.filter((reservation) => reservation.id !== id)
          ); // Update local state
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "Something went wrong");
        })
        .finally(() => {
          setDeletingId(""); // Reset deleting state
        });
    },
    [userReservations]
  );

  return (
    <Container>
      <Heading
        title="Trips"
        subTitle="Where you've been and where you're going"
      />
      <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {userReservations.length > 0 ? (
          userReservations
            .slice()
            .reverse()
            .map((reservation) => (
              <div key={reservation.id}>
                <ListingCard
                  data={reservation.listing} // Each reservation has a listing
                  reservation={reservation}
                  actionId={reservation.id}
                  onAction={onCancel}
                  disabled={deletingId === reservation.id}
                  actionLabel="Cancel reservation"
                  currentUser={currentUser}
                />
                <hr className="mt-4" />
                {/* User Name and Reservation Status */}
                <div className="mt-4">
                  <p>
                    <strong>Status:</strong>{" "}
                    {reservation?.status
                      ? reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1).toLowerCase()
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
    </Container>
  );
};

export default TripsClient;
