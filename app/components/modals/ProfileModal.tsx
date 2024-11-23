"use client";

// Imports
import { interests } from "@/app/constants/interests";
import useProfileModal from "@/app/hooks/useProfileModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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

// Profile Function
const ProfileModal = () => {
  // Declarations
  const router = useRouter();
  const profileModal = useProfileModal();
  const [step, setStep] = useState(STEPS.INTERESTS);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      interest: [],
      description: "",
      location: null,
      contactNo: "",
    },
  });

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

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const setCustomValue2 = (id: string, value: any) => {
    const currentValues = watch(id) as string[];

    if (currentValues.includes(value)) {
      setValue(
        id,
        currentValues.filter((item) => item !== value)
      ); // Remove value
    } else {
      setValue(id, [...currentValues, value]); // Add value
    }
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.LOCATION && !location) {
      toast.error("Please select a location before proceeding.");
      return;
    }

    setStep((value) => value + 1);
  };

  const progressPercentage =
    ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.CONTACTNO) {
      return onNext();
    }

    setIsLoading(true);
    axios
      .post("/api/profiles/createProfile", data)
      .then(() => {
        router.refresh();
        toast.success("Success!");
        reset();
        setStep(STEPS.INTERESTS);
        profileModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.CONTACTNO) {
      return "Create";
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
      <div className="flex flex-row">
        <Heading title="What are you into?" subTitle="Please pick a category" />
        <h1 className="mx-4 my-1">(optional)</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {interests.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={() => setCustomValue2("interest", item.label)}
              selected={interest.includes(item.label)}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
        ;
      </div>
    </div>
  );

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="flex flex-row">
          <Heading
            title="About you"
            subTitle="Just little something about yourself"
          />
          <h1 className="-ml-28 my-1">(optional)</h1>
        </div>
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

  // Return
  return (
    <Modal
      isOpen={profileModal.isOpen}
      onClose={profileModal.onClose}
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

export default ProfileModal;
