"use client";

// Imports
import useConfirmReservationModal from "@/app/hooks/useConfirmReservationModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Heading from "../Heading";
import Modal from "./Modal";

// Profile Function
const ConfirmReservationModal = () => {
  // Declarations
  const router = useRouter();
  const confirmReservationModal = useConfirmReservationModal();

  const handleProceed = () => {
    confirmReservationModal.onClose();
    router.push("/profile");
  };

  const handleNotNow = () => {
    confirmReservationModal.onClose();
  };

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Inquiry"
        subTitle="Description"
      />
    </div>
  );

  // Return
  return (
    <Modal
      title="Latest Reservation Summary"
      isOpen={confirmReservationModal.isOpen}
      onClose={handleNotNow}
      actionLabel="Confirm"
      onSubmit={handleProceed}
      secondaryActionLabel="Not Now"
      secondaryAction={handleNotNow}
      body={bodyContent}
    />
  );
};

export default ConfirmReservationModal;
