"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Heading from "../Heading";
import Modal from "./Modal";
import IdUpload from "../inputs/IdUpload";
import useUploadIdModal from "@/app/hooks/useUploadIdModal";


enum STEPS {
  IDTYPE = 0,
  UPLOAD = 1,
}

const UploadIdModal = () => {
  const router = useRouter();
  const uploadIdModal = useUploadIdModal();
  const [step, setStep] = useState(STEPS.IDTYPE);
  const [isLoading, setIsLoading] = useState(false);
  const [idImages, setIdImages] = useState({ front: "", back: "" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      idtype: "",
      upload: "",
    },
  });

  const idtype = watch("idtype");

  const handleImageChange = (imageType: "front" | "back", url: string) => {
    setIdImages((prevState) => ({
      ...prevState,
      [imageType]: url,
    }));
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.IDTYPE && !idtype) {
      toast.error("Please select an ID type before proceeding.");
      return;
    }
    setStep((value) => value + 1);
  };

  const progressPercentage = ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    if (step !== STEPS.UPLOAD) {
      return onNext();
    }

    if (!idImages.front || !idImages.back) {
      toast.error("Please upload both front and back images of your ID.");
      return;
    }

    setIsLoading(true);
    try {
      // Log the payload to ensure it's correct
      const payload = {
        idtype: idtype,
        front: idImages.front,
        back: idImages.back
      };
      console.log("Sending request with payload:", payload);

      // Send the request to the backend
      await axios.put(`/api/profiles/uploadId`, payload, { withCredentials: true });

      toast.success("ID images uploaded successfully!");
      router.refresh(); // Refresh the page if necessary
      reset(); // Reset form state
      setStep(STEPS.IDTYPE); // Reset the step
      uploadIdModal.onClose(); // Close the modal
    } catch (error) {
      console.error("Error in Axios request:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = step === STEPS.UPLOAD ? "Submit" : "Next";
  const secondaryActionLabel = step === STEPS.IDTYPE ? undefined : "Back";

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="Select your ID type" subTitle="Please choose the type of ID you want to upload" />
      <div className="flex flex-col gap-4 ml-4">
        <label className="cursor-pointer">
          <input type="radio" value="passport" {...register("idtype")} className="mr-2" />
          Passport
        </label>
        <label className="cursor-pointer">
          <input type="radio" value="drivers_license" {...register("idtype")} className="mr-2" />
          Driver&apos;s License
        </label>
        <label className="cursor-pointer">
          <input type="radio" value="identity" {...register("idtype")} className="mr-2" />
          National ID
        </label>
        <label className="cursor-pointer">
          <input type="radio" value="other_identification" {...register("idtype")} className="mr-2" />
          Other Identification
        </label>
        {errors.idtype && <p className="text-red-500">ID type is required.</p>}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-.01m1.01 0a9 9 0 11-9 9c5 0 9-4 9-9z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-blue-700 ml-2">Verification Notice</h3>
        </div>
        <div className="mt-2 text-sm text-blue-700">
          <p>
            To complete your registration, your account must be <strong>verified</strong>. This process helps ensure the security and authenticity of our platform.
          </p>
          <p className="mt-1">
            Once you submit the required information, your verification status will remain <strong>pending</strong> until reviewed and approved by the admin.
          </p>
          {/* <p className="mt-1">
            You will receive a confirmation email once your account has been successfully verified.
          </p> */}
          <p className="mt-1 font-medium">
            Please allow up to 24–48 hours for the verification process to be completed.
          </p>
        </div>
      </div>

    </div>
  );

  if (step === STEPS.UPLOAD) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Upload your ID" subTitle="Please upload a clear image of your selected ID type" />
        <IdUpload value={idImages} onChange={handleImageChange} />
        <div className="text-gray-500 text-sm">You can upload images in JPEG, PNG, or SVG formats. Max size: 5 MB.</div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={uploadIdModal.isOpen}
      onClose={uploadIdModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.IDTYPE ? undefined : onBack}
      title="Upload a Valid ID"
    >
      <div className="flex flex-col gap-2">
        <div className="w-full bg-gray-200 h-2 rounded-lg mb-4">
          <div
            className="h-2 rounded-lg"
            style={{
              width: `${progressPercentage}%`,
              background: `linear-gradient(to right, #a5d6a7, #66bb6a, #388e3c)`,
              transition: "width 0.3s ease-in-out",
            }}
          />
        </div>
        {bodyContent}
      </div>
    </Modal>
  );
};

export default UploadIdModal;
