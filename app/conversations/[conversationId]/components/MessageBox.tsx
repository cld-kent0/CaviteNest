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
      if (!reservationDetails.id) {
        console.error("Reservation details are not available.");
        return;
      }

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

      toast.success("Reservation confirmed successfully!");
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

  const handleImageClick = (src: string) => {
    setImageModalOpen(true);
  };

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
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image[0]}
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
                onClick={() => setIsConfirmModalOpen(true)}
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
        onClose={() => setIsConfirmModalOpen(false)}
        title="Latest Reservation Summary"
        body={
          reservationDetails?.listing && reservationDetails?.user ? (
            <div>
              <p>
                <strong>Listing Information:</strong>
              </p>
              <p>Title: {reservationDetails?.listing?.title || "N/A"}</p>
              <p>
                Description: {reservationDetails?.listing?.description || "N/A"}
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
        onSubmit={handleConfirmReservationStatus}
        actionLabel="Confirm Reservation"
        secondaryActionLabel="Not Now"
        secondaryAction={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default MessageBox;
