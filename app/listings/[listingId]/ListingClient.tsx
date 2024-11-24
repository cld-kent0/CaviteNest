"use client";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listing/ListingHead";
import ListingInfo from "@/app/components/listing/ListingInfo";
import ListingReservation from "@/app/components/listing/ListingReservation";
import { categories } from "@/app/constants/cetegories";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import axios from "axios";
import { Range } from "react-date-range";
import toast from "react-hot-toast";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

type Profile = {
  id: string;
  userId: string;
  contactNo: string | null;
  description: string | null;
  interest: string[];
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser; // Host user information
  };
  currentUser?: SafeUser | null;
  profile?: Profile | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
  profile,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations
      .filter(
        (reservation) =>
          reservation.listingId === listing.id &&
          reservation.status === "confirmed" // Only include reservations for this listing with "confirmed" status
      )
      .forEach((reservation) => {
        const range = eachDayOfInterval({
          start: new Date(reservation.startDate),
          end: new Date(reservation.endDate),
        });

        dates = [...dates, ...range];
      });

    return dates;
  }, [reservations, listing.id]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onReservationSubmit = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen(); // Open login modal if user is not logged in
    }

    setIsLoading(true);

    try {
      await axios.post(`/api/reservations`, {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      });
      toast.success("Listing reserved!");
      setDateRange(initialDateRange);
      router.push("/trips");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  const isOwner = currentUser?.id === listing.user.id;

  const agreementData = {
    id: listing.user.id,
  };

  const conversationId = listing.user.id; // Use the host's user ID as conversationId

  // Determine if the user is logged in
  const isLoggedIn = !!currentUser;

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto my-16">
        <div className="flex flex-col gap-6">
          <ListingHead
            id={listing.id}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            title={listing.title}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 mt-6 md:grid-cols-7 md:gap-10">
            <ListingInfo
              user={listing.user}
              ownerContactNum={profile?.contactNo}
              bathroomCount={listing.bathroomCount}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              locationValue={listing.locationValue}
              category={category}
              description={listing.description}
              amenities={listing.amenities}
            />
            <div className="mb-10 md:order-list md:col-span-3">
              <ListingReservation
                price={listing.price ?? 0}
                totalPrice={totalPrice ?? 0}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onReservationSubmit={onReservationSubmit}
                disabled={isLoading}
                disabledDates={disabledDates}
                isOwner={isOwner}
                rentalType={listing.rentalType || "booking"}
                conversationId={conversationId}
                isLoggedIn={isLoggedIn}
                rentalAddress={listing.rentalAddress ?? ""}
                rentalAmount={listing.rentalAmount}
                rentalSecurityDeposit={listing.rentalSecurityDeposit ?? 0}
                utilitiesAndMaintenance={listing.utilitiesMaintenance ?? ""}
                bookingAddress={listing.bookingAddress ?? ""}
                bookingFee={listing.bookingFee ?? 0}
                bookingSecurityDeposit={listing.bookingSecurityDeposit ?? 0}
                cancellationPolicy={listing.cancellationPolicy ?? ""}
                paymentMethod={listing.paymentMethod ?? ""}
                listingId={listing.id}
                listingOwner={listing.user.id}
                listingImg={listing.imageSrc}
                currentUser={currentUser?.id ?? null}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
