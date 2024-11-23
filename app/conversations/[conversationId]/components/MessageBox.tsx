import Profile from "@/app/components/Profile";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ImageModal from "./ImageModal";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/modals/Modal";
import toast from "react-hot-toast";

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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<any>({});
  const router = useRouter();

  const isOwn = session?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const isOwnerOfListing = currentUserId === listingOwner;

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const profile = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-emerald-600 text-white" : "bg-gray-100 text-black",
    data.image ? "rounded-md p-0" : "rounded-lg py-2 px-3"
  );

  const handleConfirmReservationStatus = async () => {
    try {
      // Ensure reservationDetails is available
      if (!reservationDetails.id) {
        console.error("Reservation details are not available.");
        return;
      }

      // Make the API call to confirm the reservation
      const response = await fetch("/api/reservations/confirmReservation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservationDetails.id,
          listingId: listingId,
          status: "confirmed",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      // Optionally, show a success message or toast notification
      toast.success("Reservation confirmed successfully!");

      // Close the modal after confirming
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Error confirming reservation:", error);
      toast.error("Failed to confirm reservation");
    }
  };

  useEffect(() => {
    if (listingId && isConfirmModalOpen) {
      const fetchReservationDetails = async () => {
        try {
          console.log("Fetching reservation details for listingId:", listingId); // Debugging
          const response = await fetch(
            `/api/reservations/getReservation?listingId=${listingId}`
          );

          if (!response.ok) {
            console.error("API call failed:", response.status);
            throw new Error(`Error: ${response.status}`);
          }

          const reservationDetails = await response.json();
          console.log("Fetched reservation details:", reservationDetails); // Debugging

          if (reservationDetails && reservationDetails.id) {
            setReservationDetails(reservationDetails); // Set the object directly, no need for checking length
          } else {
            setReservationDetails({}); // No reservation details found
          }
        } catch (error) {
          console.error("Failed to fetch reservation details:", error);
        }
      };

      fetchReservationDetails();
    }
  }, [isConfirmModalOpen, listingId]);

  // Handle the button click and navigate to ReservationsClient (for now, opening modal instead)
  const handleConfirmReservation = () => {
    setIsConfirmModalOpen(true); // Open the confirm reservation modal
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  // HTML content to be injected (without the button)
  const messageBody = `${data.body || "null"}`;

  return (
    <div className={container}>
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
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: messageBody, // Inject the formatted text here
              }}
            />
          )}
          <div className="text-center">
          {isOwnerOfListing && (
            <button
              onClick={handleConfirmReservation} // Open the confirm reservation modal
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Confirm Reservation
            </button>
          )}
          </div>
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>

      {/* Confirm Reservation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleModalClose}
        title="Latest Reservation Summary"
        body={
          reservationDetails &&
          reservationDetails.listing &&
          reservationDetails.user ? (
            <div>
              {/* Listing Information */}
              <p>
                <strong>Listing Information:</strong>
              </p>
              <p>Title: {reservationDetails?.listing?.title || "N/A"}</p>
              <p>
                Description: {reservationDetails?.listing?.description || "N/A"}
              </p>
              <p>
                Listing Image:{" "}
                {reservationDetails?.listing?.imageSrc ? (
                  <Image
                    src={reservationDetails?.listing?.imageSrc}
                    alt="Listing Image"
                    width={100}
                    height={100}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No image available"
                )}
              </p>

              {/* Reservation Information */}
              <p>
                <strong>Reservation Details:</strong>
              </p>
              <p>
                Start Date:{" "}
                {reservationDetails?.startDate
                  ? format(
                      new Date(reservationDetails?.startDate),
                      "MM/dd/yyyy"
                    )
                  : "N/A"}
              </p>
              <p>
                End Date:{" "}
                {reservationDetails?.endDate &&
                new Date(reservationDetails?.endDate).getTime() !== 0
                  ? format(new Date(reservationDetails?.endDate), "MM/dd/yyyy")
                  : "Not Applicable"}
              </p>
              <p>Total Price: ${reservationDetails?.totalPrice || "N/A"}</p>

              {/* Lesse Information */}
              <p className="mt-2">
                <strong>Lessee Information:</strong>
              </p>
              <p>Name: {reservationDetails?.user?.name || "N/A"}</p>
              <p>Email Address: {reservationDetails?.user?.email || "N/A"}</p>
              <p className="mt-3 -mb-6">
                <strong>Reservation Status:</strong>{" "}
                {reservationDetails?.status || "N/A"}
              </p>
            </div>
          ) : (
            <p>Loading reservation details...</p>
          )
        }
        onSubmit={handleConfirmReservationStatus} // Confirm the reservation
        actionLabel="Confirm Reservation"
        secondaryActionLabel="Not Now"
        secondaryAction={handleModalClose}
      />
    </div>
  );
};

export default MessageBox;
