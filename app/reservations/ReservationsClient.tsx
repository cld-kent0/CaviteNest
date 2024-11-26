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

  // Group reservations by rentalType
  const groupedReservations = reservations.reduce((acc, reservation) => {
    const { rentalType } = reservation.listing;
    const type = rentalType ?? "Unknown";

    if (!acc[type]) acc[type] = [];
    acc[type].push(reservation);

    return acc;
  }, {} as Record<string, SafeReservation[]>);

  // Calculate the total reservation count
  const totalReservations = reservations.length;

  // Calculate the number of reservations per status
  const reservationStatusCount = reservations.reduce((acc, reservation) => {
    const status = reservation.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Container>
      <div className="flex items-center justify-between">
        <div className="space-x-4 ml-4">
          <Heading
            title="Reservations"
            subTitle="Bookings on your properties"
          />
        </div>
        {/* Dashboard Summary */}
        <div className="mt-16 ml-8 sm:ml-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto px-4 sm:px-0">
          {/* Total Reservations Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Total Reservations
            </h2>
            <p className="text-3xl font-bold text-gray-600">
              {totalReservations}
            </p>
          </div>

          {/* Reservations by Status Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Reservations by Status
            </h2>
            <ul className="space-y-2 text-gray-600">
              {Object.entries(reservationStatusCount).map(([status, count]) => (
                <li key={status} className="flex justify-between">
                  <span className="capitalize">{status}:</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reservations by Rental Type Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Reservations by Rental Type
            </h2>
            <ul className="space-y-2 text-gray-600">
              {Object.entries(groupedReservations).map(
                ([rentalType, reservations]) => (
                  <li key={rentalType} className="flex justify-between">
                    <span className="capitalize">{rentalType}:</span>
                    <span>{reservations.length} reservations</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Reservations List - Retained Original Design */}
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
