"use client"; // Ensure client-side rendering

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import Button from "../Button";
import HeartButton from "../HeartButton";
import { usePathname } from "next/navigation";

const formatPrice = (price: number): string => {
  return `₱ ${price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

interface ListingCardProps {
  data: SafeListing | null;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  actionLabel?: string;
  actionId?: string;
  disabled?: boolean;
  currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  actionLabel,
  actionId = "",
  disabled,
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  const pathname = usePathname(); // Get the current route
  const isTripsPage = pathname === "/trips"; // Check if the page is /trips
  const isReservationsPage = pathname === "/reservations"; // Check if the page is /reservations

  // Default to an empty array if imageSrc is undefined
  const images = data?.imageSrc ?? []; // Fallback to an empty array

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Track current image index

  const location = useMemo(() => {
    if (!data?.locationValue) return null;
    return getByValue(data.locationValue);
  }, [data, getByValue]);

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice ?? 0;
    }
    return data?.price ?? 0;
  }, [reservation, data?.price]);

  const reservationDate = useMemo(() => {
    if (!reservation || !reservation.startDate) {
      return null;
    }
    const start = new Date(reservation.startDate);
    let end = null;

    if (reservation.endDate) {
      end = new Date(reservation.endDate);
      // Check if the endDate is equal to 1/1/1970
      if (end.getTime() === new Date("1970-01-01T00:00:00Z").getTime()) {
        end = null; // Ignore end date if it's 1/1/1970
      }

      if (isNaN(start.getTime()) || (end && isNaN(end.getTime()))) {
        return "Invalid Date Range";
      }

      if (end) {
        return `${format(start, "PP")} - ${format(end, "PP")}`;
      }
    }

    if (isNaN(start.getTime())) {
      return "Invalid Date Range";
    }

    return `${format(start, "PP")}`;
  }, [reservation]);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  // Function to go to the next image
  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening the listing
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening the listing
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Function to set the current image when a dot is clicked
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col w-full gap-2">
        {/* Image Carousel */}
        <div className="relative w-full overflow-hidden aspect-square rounded-xl group-hover:opacity-100 opacity-90 transition-all duration-300 shadow-md shadow-gray-500">
          {/* Fallback image */}
          <Image
            fill
            src={images[currentImageIndex] || "/images/no-img-placeholder.jpg"}
            alt="Listing"
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>

          {/* Carousel Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPreviousImage}
                className="absolute top-1/2 left-5 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                &#8592;
              </button>
              <button
                onClick={goToNextImage}
                className="absolute top-1/2 right-5 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                &#8594;
              </button>
            </>
          )}

          {/* Dot Indicators Inside the Image */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-black shadow-md shadow-gray-700"
                      : "bg-neutral-300 shadow-inner shadow-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {/* Listing Info */}
        <div className="text-lg font-semibold mt-1 -mb-2">
          {location
            ? `${location.label}, ${location.region}`
            : "Location Not Available"}
        </div>
        <div className="font-light text-neutral-600">
          {reservationDate || data?.category || "No category available"}
          {!isTripsPage && !isReservationsPage && (
            <>
              {" ("}
              {data?.rentalType === "rent"
                ? "Rental"
                : data?.rentalType === "booking"
                ? "Booking"
                : data?.rentalType === "both"
                ? "Both"
                : "Unknown"}
              {")"}
            </>
          )}
          {/* Price and Rental Type Inline */}
          <div className="flex flex-row items-center gap-1 mt-1">
            <div className="font-bold text-black">{formatPrice(price)}</div>

            {/* Display per night or per month inline */}
            {!reservation && data?.rentalType && (
              <div className="font-normal text-neutral-500">
                {data?.rentalType === "rent"
                  ? "/ month"
                  : data?.rentalType === "booking"
                  ? "/ night"
                  : data?.rentalType === "both"
                  ? "/ night"
                  : "Unknown"}
              </div>
            )}

            {/* Display Rental Type inline on /trips page beside the price */}
            {(isTripsPage || isReservationsPage) && data?.rentalType && (
              <div className="font-normal text-neutral-500">
                {data?.rentalType === "rent"
                  ? "/ month"
                  : data?.rentalType === "booking"
                  ? "/ night"
                  : data?.rentalType === "both"
                  ? "/ night"
                  : "Unknown"}
              </div>
            )}
          </div>
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
