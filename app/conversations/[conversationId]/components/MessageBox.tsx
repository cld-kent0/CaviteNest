import Profile from "@/app/components/Profile";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format, differenceInDays } from "date-fns"; // Import date-fns for date difference
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import Modal from "@/app/components/modals/Modal";
import toast from "react-hot-toast";
import { FieldValues, SubmitHandler } from "react-hook-form";
import Heading from "@/app/components/Heading";
import { read } from "fs";

enum STEPS {
  LISTING_INFO = 0,
  RESERVATION_DETAILS = 1,
  LESSEE_INFO = 2,
}

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  listingId: string | null;
  listingOwner: string | null;
  currentUserId: string | undefined;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  isLast,
  listingId,
  listingOwner,
  currentUserId,
}) => {
  const { data: session } = useSession();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<any>({});
  const [loading, setLoading] = useState(true); // Loading state

  const [step, setStep] = useState(STEPS.LISTING_INFO);

  const isOwn = session?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const isOwnerOfListing = currentUserId === listingOwner;

  const container = clsx("flex gap-3 p-4", isOwn ? "justify-end" : "");

  const profile = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2", isOwn ? "items-end" : "items-start");

  const messageStyle = clsx(
    "text-md py-2 px-5 rounded-2xl",
    isOwn ? "bg-emerald-600 text-white" : "bg-gray-100 text-black",
    data.listingId ? "w-full" : "" // Full width if listingId exists
  );

  const wrapperStyle = "flex justify-center"; // Center-align the messages

  // Calculate the total price based on the startDate, endDate, and price per night
  const calculateTotalPrice = () => {
    const startDate = reservationDetails?.startDate
      ? new Date(reservationDetails.startDate)
      : null;
    const endDate = reservationDetails?.endDate
      ? new Date(reservationDetails.endDate)
      : null;
    const pricePerNight = reservationDetails?.listing?.price || 0;

    if (startDate && endDate) {
      const numberOfNights = differenceInDays(endDate, startDate);
      return numberOfNights * pricePerNight;
    }
    return 0;
  };

  const totalPrice = calculateTotalPrice();

  const handleConfirmReservationStatus = async () => {
    try {
      if (!reservationDetails?.id) {
        console.error("Reservation details are not available.");
        return;
      }

      const response = await fetch("/api/reservations/confirmReservation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: reservationDetails.id,
          listingId,
          status: "confirmed",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      toast.success("Reservation confirmed successfully!");

      const deleteResponse = await deleteMessage();
      if (deleteResponse) {
        toast.success("Message deleted successfully.");
      } else {
        toast.error("Failed to delete message.");
      }

      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Error confirming reservation:", error);
      toast.error("Failed to confirm reservation");
    }
  };

  const deleteMessage = async () => {
    try {
      if (!listingId || !data.id) {
        console.error("Listing ID or Message ID is missing.");
        return false;
      }

      const response = await fetch("/api/reservations/deleteMessage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: data.id,
          listingId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to delete message", response);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  };

  useEffect(() => {
    if (listingId && isConfirmModalOpen) {
      const fetchReservationDetails = async () => {
        setLoading(true); // Start loading
        try {
          const response = await fetch(
            `/api/reservations/getReservation?listingId=${listingId}`
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`);

          const reservationDetails = await response.json();
          setReservationDetails(reservationDetails || {});
        } catch (error) {
          console.error("Failed to fetch reservation details:", error);
        } finally {
          setLoading(false); // Stop loading once data is fetched
        }
      };

      fetchReservationDetails();
    }
  }, [isConfirmModalOpen, listingId]);

  const onBack = () => {
    setStep((value) => (value > STEPS.LISTING_INFO ? value - 1 : value));
  };

  const onNext = () => {
    setStep((prevStep) =>
      prevStep < STEPS.LESSEE_INFO ? prevStep + 1 : prevStep
    );
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step === STEPS.LESSEE_INFO) {
      await handleConfirmReservationStatus();
    } else {
      onNext();
    }
  };

  const actionLabel = useMemo(() => {
    return step === STEPS.LESSEE_INFO ? "Confirm Reservation" : "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.LISTING_INFO ? undefined : "Back";
  }, [step]);

  const onClose = () => {
    setStep(STEPS.LISTING_INFO);
    setIsConfirmModalOpen(false);
  };

  const progressPercentage =
    ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

  const renderBodyContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full py-20">
          <p className="text-xl text-gray-500">
            Please wait a moment, while we fetch the details...
          </p>{" "}
          {/* Centered Loading */}
        </div>
      );
    }

    switch (step) {
      case STEPS.LISTING_INFO:
        return (
          <div className="flex flex-col gap-8 p-5">
            <Heading
              title="Listing Information"
              subTitle="Currently viewing this certain property's information:"
            />
            <p>
              <strong>Title:</strong>{" "}
              {reservationDetails?.listing?.title || "N/A"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {reservationDetails?.listing?.description || "N/A"}
            </p>
            <p>
              <strong>Listing Images:</strong>
              {reservationDetails?.listing?.imageSrc?.length > 0 ? (
                <div className="flex gap-2">
                  <div className="w-24 h-24 flex justify-center items-center">
                    <Image
                      src={reservationDetails?.listing?.imageSrc[0]}
                      alt="Listing Image"
                      width={100}
                      height={100}
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              ) : (
                "No images available"
              )}
            </p>
          </div>
        );

      case STEPS.RESERVATION_DETAILS:
        return (
          <div className="flex flex-col gap-8 p-5">
            <Heading
              title="Reservation Details"
              subTitle="Currently viewing this lessee's reservation details:"
            />

            {/* Ideal Start Date */}
            {/* Dates - Start Date and End Date displayed side by side */}
            <p className="flex flex-row">
              <span>
                <strong>Date(s):</strong>{" "}
                {reservationDetails?.startDate
                  ? format(
                      new Date(reservationDetails?.startDate),
                      "MM/dd/yyyy"
                    )
                  : "N/A"}{" "}
              </span>

              {/* End Date - Render only if it's not the Unix Epoch (1970-01-01) */}
              {reservationDetails?.endDate &&
                new Date(reservationDetails?.endDate).getTime() !== 0 && (
                  <span>
                    -{" "}
                    {format(
                      new Date(reservationDetails?.endDate),
                      "MM/dd/yyyy"
                    )}
                  </span>
                )}
            </p>
            {/* Total Amount - Render only if there's rentalAmount and endDate is valid */}
            {reservationDetails?.listing?.price &&
              reservationDetails?.endDate &&
              new Date(reservationDetails?.endDate).getTime() !== 0 && (
                <p>
                  <strong>Total Amount:</strong> ₱{totalPrice}
                </p>
              )}

            {/* Rental Amount - Render only if rentalAmount exists and endDate is 1/1/1970 */}
            {reservationDetails?.listing?.rentalAmount &&
              reservationDetails?.endDate &&
              new Date(reservationDetails?.endDate).getTime() === 0 && (
                <p>
                  <strong>Rental Amount:</strong> ₱
                  {reservationDetails?.listing?.rentalAmount}
                </p>
              )}
          </div>
        );

      case STEPS.LESSEE_INFO:
        return (
          <div className="flex flex-col gap-8 p-5">
            <Heading
              title="Lessee Information"
              subTitle="Currently viewing this lessee's contact information:"
            />
            <div className="flex flex-row justify-center gap-9 mx-auto">
              <Image
                src={reservationDetails?.user?.image}
                alt="Listing Image"
                width={100}
                height={100}
                className="object-cover rounded-full shadow-md"
              />
              <div className="flex flex-col gap-3 justify-center">
                <p>
                  <strong>Name:</strong>{" "}
                  {reservationDetails?.user?.name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {reservationDetails?.user?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Unknown Step</p>;
    }
  };

  return (
    <div className={container}>
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={onClose}
        title="Latest Reservation Summary"
        onSubmit={onSubmit}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.LISTING_INFO ? undefined : onBack}
      >
        <div className="flex flex-col gap-2">
          <div className="w-full bg-gray-200 h-2 rounded-lg mb-4">
            <div
              className="h-2 rounded-lg"
              style={{
                width: `${progressPercentage}%`,
                background:
                  "linear-gradient(to right, #a5d6a7, #66bb6a, #388e3c)",
                transition: "width 0.3s ease-in-out",
              }}
            />
          </div>
          {renderBodyContent()}
        </div>
      </Modal>
      <div className={profile}>
        <Profile user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>

        <div className={messageStyle}>
          <div
            dangerouslySetInnerHTML={{
              __html: data.body || "No message content available",
            }}
          />
          {isOwnerOfListing && (
            <div className="mb-3 text-center">
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Confirm Reservation
              </button>
            </div>
          )}
        </div>
        {isLast && isOwn && seenList && (
          <div className="flex items-center gap-2 text-xs font-light text-gray-500 mt-2">
            {data.seen
              .filter((user) => user.email !== data?.sender?.email)
              .map((user, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span>Seen by {user.name}</span>
                  {index !== data.seen.length - 1 && <span></span>}
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={`${user.name}'s profile`}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
