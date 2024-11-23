"use client";

// Imports
import useGetVerified from "@/app/hooks/useGetVerifiedModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Heading from "../Heading";
import Modal from "./Modal";

// Profile Function
const GetVerifiedModal = () => {
  // Declarations
  const router = useRouter();
  const getVerifiedModal = useGetVerified();

  const handleProceed = () => {
    getVerifiedModal.onClose();
    router.push("/profile");
  };

  const handleNotNow = () => {
    getVerifiedModal.onClose();
  };

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Get Verified Now!"
        subTitle="Your identity must be verified to be able to host a property."
      />
    </div>
  );

  // Return
  return (
    <Modal
      title="Hosting Notice"
      isOpen={getVerifiedModal.isOpen}
      onClose={handleNotNow}
      actionLabel="Proceed"
      onSubmit={handleProceed}
      secondaryActionLabel="Not Now"
      secondaryAction={handleNotNow}
      body={bodyContent}
    />
  );
};

export default GetVerifiedModal;
