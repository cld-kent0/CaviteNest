"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Button from "../Button";
import HeartButton from "../HeartButton";

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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col w-full gap-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <Image
            fill
            src={data?.imageSrc || "/placeholder.jpg"}
            alt="Listing"
            className="object-cover w-full h-full transition group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="text-lg font-semibold">
          {location
            ? `${location.region}, ${location.label}`
            : "Location Not Available"}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data?.category || "No category available"}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">{formatPrice(price)}</div>
          {!reservation && <div className="font-semibold">/ Night</div>}
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
