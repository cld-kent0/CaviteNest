"use client";

import { interests } from "@/app/constants/interests";
import useEditProfileModal from "@/app/hooks/useEditProfileModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CategoryInput from "../CategoryInput";
import Heading from "../Heading";
import CountrySelect from "../inputs/CountrySelect";
import Input from "../inputs/Input";
import Modal from "./Modal";

enum STEPS {
  INTERESTS = 0,
  DESCRIPTION = 1,
  LOCATION = 2,
  CONTACTNO = 3,
}

interface Profile {
  userId: string;
  interest: string[] | null;
  description: string | null;
  location:
    | string
    | { latlng: { lat: number; lng: number }; city: string }
    | null;
  contactNo: string | null;
}

interface EditProfileModalProps {
  profile: Profile | null; // profile can be null if not available yet
}

// EditProfileModal Function
const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile }) => {
  const router = useRouter();
  const editProfileModal = useEditProfileModal();
  const [step, setStep] = useState(STEPS.INTERESTS);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with current profile data
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      interest: profile?.interest || [],
      description: profile?.description || "",
      location: profile?.location || "",
      contactNo: profile?.contactNo || "",
    },
  });

  const description = watch("description");
  const interest = watch("interest");
  const location = watch("location");
  const contactNo = watch("contactNo");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    if (profile) {
      console.log("Profile data before reset:", profile);
      reset({
        interest: profile?.interest || [],
        description: profile?.description || "",
        location: profile?.location || "",
        contactNo: profile?.contactNo || "",
      });
    }
  }, [profile, reset]);

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };
  // na dadag ni claud
  const progressPercentage =
    ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.CONTACTNO) {
      return onNext();
    }

    setIsLoading(true);

    data.userId = profile?.userId;
    data.location = data.location || null;
    data.imageSrc = data.imageSrc || null;

    axios
      .put(`/api/profiles/editProfile`, data)
      .then(() => {
        router.refresh();
        toast.success("Profile updated successfully!");
        reset();
        setStep(STEPS.INTERESTS);
        editProfileModal.onClose();
      })
      .catch((error) => {
        console.error("Error during update:", error);
        toast.error("Something went wrong while updating");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.CONTACTNO) {
      return "Save Changes";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.INTERESTS) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading title="What are you into?" subTitle="Please pick a category" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {interests.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(clickedInterest: string) => {
                const currentInterests = watch("interest") as string[]; // Ensure it's typed as string[]
                // Add or remove interest depending on whether it's already selected
                const updatedInterests = currentInterests.includes(
                  clickedInterest
                )
                  ? currentInterests.filter(
                      (item: string) => item !== clickedInterest
                    ) // Remove if selected
                  : [...currentInterests, clickedInterest]; // Add if not selected
                setCustomValue("interest", updatedInterests);
              }}
              selected={interest.includes(item.label)} // Check if the interest is selected
              label={item.label} // Pass the interest label
              icon={item.icon} // Pass the icon
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="About you"
          subTitle="Just little something about yourself"
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where do you live?"
          subTitle="Place you're currently at"
        />
        <CountrySelect
          onChange={(value) => setCustomValue("location", value)}
          value={location}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.CONTACTNO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Contact Number"
          subTitle="Please do insert a working number"
        />
        <hr />
        <Input
          id="contactNo"
          label="Phone Number"
          type="text" // Use "text" to allow control over character filtering
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          maxLength={11}
          onInput={(e) => {
            const value = e.currentTarget.value;
            const numericValue = value.replace(/\D/g, ""); // Remove any non-numeric characters
            if (value !== numericValue) {
              toast.error("Only numbers are allowed");
              e.currentTarget.value = numericValue; // Update the input to show only numbers
            }
          }}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={editProfileModal.isOpen}
      onClose={editProfileModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.INTERESTS ? undefined : onBack}
      title="Create your Profile!"
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

export default EditProfileModal;
