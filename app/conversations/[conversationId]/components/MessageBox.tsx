import Profile from "@/app/components/Profile";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<any>({});

  const isOwn = session?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const isOwnerOfListing = currentUserId === listingOwner;

  const container = clsx(
    "flex gap-3 p-4",
    isOwn ? "justify-end" : "justify-start" // Align message to the right for owner, left otherwise
  );
  const profile = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  // Apply conditional width modification based on the presence of listingId and ownership
  const messageStyle = clsx(
    "text-md py-2 px-5 text-justify rounded-2xl",
    isOwn ? "bg-emerald-600 text-white" : "bg-gray-100 text-black",
    // Apply max-width only if listingId is not available or if the current user is not the owner
    !listingId && !isOwnerOfListing ? "max-w-[40%]" : "max-w-full"
  );

  const handleConfirmReservationStatus = async () => {
    try {
      if (!reservationDetails.id) {
        console.error("Reservation details are not available.");
        return;
      }

      // Confirm the reservation status first
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

      // Now, delete the message immediately after confirming
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

      console.log("Deleting message:", { messageId: data.id, listingId }); // Log to check values

      // Make the DELETE request to the deleteMessage API
      const response = await fetch("/api/reservations/deleteMessage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: data.id,
          listingId: listingId,
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
        try {
          const response = await fetch(
            `/api/reservations/getReservation?listingId=${listingId}`
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`);

          const reservationDetails = await response.json();
          setReservationDetails(reservationDetails || {});
        } catch (error) {
          console.error("Failed to fetch reservation details:", error);
        }
      };

      fetchReservationDetails();
    }
  }, [isConfirmModalOpen, listingId]);

  return (
    <div className={container}>
      {/* Profile Section */}
      <div className={profile}>
        <Profile user={data.sender} />
      </div>

      {/* Message Section */}
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>

        {/* Message Content */}
        <div className={messageStyle}>
          <div
            dangerouslySetInnerHTML={{
              __html: data.body || "No message content available",
            }}
          />
          {/* Reservation Button for Listing Owners, inside the message */}
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

        {/* Seen Status */}
        {isLast && isOwn && seenList && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>

      {/* Confirm Reservation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Latest Reservation Summary"
        body={
          reservationDetails?.listing && reservationDetails?.user ? (
            <div>
              <p>
                <strong>Listing Information:</strong>
              </p>
              <p>Title: {reservationDetails.listing.title || "N/A"}</p>
              <p>
                Description: {reservationDetails.listing.description || "N/A"}
              </p>
              <p>
                Listing Images:{" "}
                {reservationDetails?.listing?.imageSrc?.length > 0 ? (
                  <div className="flex gap-2">
                    {reservationDetails?.listing?.imageSrc.map(
                      (image: string, index: number) => (
                        <div key={index} className="flex justify-center">
                          <Image
                            src={image}
                            alt={`Listing Image ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  "No images available"
                )}
              </p>
              <p>
                <strong>Reservation Details:</strong>
              </p>
              <p>
                Start Date:{" "}
                {reservationDetails.startDate
                  ? format(new Date(reservationDetails.startDate), "MM/dd/yyyy")
                  : "N/A"}
              </p>
              <p>
                End Date:{" "}
                {reservationDetails.endDate
                  ? format(new Date(reservationDetails.endDate), "MM/dd/yyyy")
                  : "N/A"}
              </p>
              <p>Total Price: ${reservationDetails.totalPrice || "N/A"}</p>
              <p>
                <strong>Lessee Information:</strong>
              </p>
              <p>Name: {reservationDetails.user.name || "N/A"}</p>
              <p>Email: {reservationDetails.user.email || "N/A"}</p>
              <p className="mt-3 -mb-6">
                <strong>Reservation Status:</strong>{" "}
                {reservationDetails?.status || "N/A"}
              </p>
            </div>
          ) : (
            <p>Loading reservation details...</p>
          )
        }
        onSubmit={handleConfirmReservationStatus}
        actionLabel="Confirm Reservation"
        secondaryActionLabel="Not Now"
        secondaryAction={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default MessageBox;
