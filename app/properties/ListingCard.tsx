"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Button from "../components/Button";
import DeleteButton from "../properties/DeleteButton";
import HeartButton from "../components/HeartButton";

// Helper function to format the price with commas and two decimal places
const formatPrice = (price: number): string => {
  return `₱ ${price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (listingUnique: string) => void; // Action for general property actions (delete, archive)
  onArchive?: (listingUnique: string) => void; // Action specifically for archiving
  actionLabel?: string;
  actionId?: string;
  disabled?: boolean;
  currentUser?: SafeUser | null;
  archiveLabel?: string; // archiveLabel should be here
  editLabel?: string;
  onEdit?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  onArchive,
  actionLabel,
  actionId = "",
  disabled,
  currentUser,
  archiveLabel, // archiveLabel should be received as a prop
  editLabel,
  onEdit,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location =
    typeof data.locationValue === "string"
      ? getByValue(data.locationValue)
      : null;

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId); // Pass 'listingUnique' to the onAction handler
    },
    [onAction, actionId, disabled]
  );

  const handleArchive = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onArchive?.(actionId); // Pass 'listingUnique' to the onArchive handler
    },
    [onArchive, actionId, disabled]
  );

  // Updated price logic with fallback to 0 if null
  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice ?? 0; // Default to 0 if totalPrice is null
    }

    return data.price ?? 0; // Default to 0 if data.price is null
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)} // 'id' here is fine since it’s the listingUnique
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col w-full gap-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <Image
            fill
            src={data.imageSrc || "/public/images/noImgEx.png"} // Provide a fallback image URL
            alt="Listing"
            className="object-cover w-full h-full transition group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="text-lg font-semibold">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">{formatPrice(price)}</div>
          {!reservation && <div className="font-semibold">/ Night</div>}
        </div>
        {onEdit && editLabel && (
          <Button
            disabled={disabled}
            small
            label={editLabel}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
        )}
        {onArchive && archiveLabel && (
          <Button
            disabled={disabled}
            label={disabled ? "Archiving..." : archiveLabel} // archiveLabel should be passed and used here
            onClick={handleArchive}
            small
          />
        )}
        {onAction && actionLabel && (
          <DeleteButton
            disabled={disabled}
            label={actionLabel}
            onClick={handleCancel}
            small
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
