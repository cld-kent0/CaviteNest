"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../reservations/Heading";
import ListingCard from "../components/listing/ListingCard";
import { SafeReservation, SafeUser } from "../types";

interface ReservationsClientProps {
  reservations: SafeReservation[];
  currentUser: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation cancelled");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading title="Reservations" subTitle="Bookings on your properties" />
      <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="p-2 rounded-lg">
            <ListingCard
              key={reservation.id}
              data={reservation.listing}
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
              {/* Assuming users is an array and the first element is the user who made the reservation */}
              <p>
                <strong>Lessee:</strong>{" "}
                {reservation.users[0]?.name || "Unknown"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {reservation?.status
                  ? reservation.status.charAt(0).toUpperCase() +
                    reservation.status.slice(1).toLowerCase()
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
