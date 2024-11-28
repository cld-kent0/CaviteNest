"use client";

import useRentModal from "@/app/hooks/useRentModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CategoryInput from "../CategoryInput";
import Heading from "../Heading";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { categories } from "@/app/constants/cetegories";
import { amenities } from "@/app/constants/amenities";
import AmenityInput from "../AmenityInput";
import RentImageUpload from "../inputs/RentImageUpload";

enum STEPS {
  RENTAL_TYPE = 0,
  CATEGORY = 1,
  LOCATION = 2,
  INFO = 3,
  AMENITIES = 4,
  IMAGES = 5,
  DESCRIPTION = 6,
  AGREEMENT = 7,
  PRICE = 8,
}

// Import user values
type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  emailVerified: Date | null;
  idVerified: boolean | null;
  profileCreated: boolean | null;
  role: string;
  plan: string;
  Subscription: { plan: string };
};

interface RentModalProps {
  user: User | null;
}

const RentModal: React.FC<RentModalProps> = ({ user }) => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.RENTAL_TYPE);
  const [isLoading, setIsLoading] = useState(false);
  const [existingListings, setExistingListings] = useState(0); // State to store the number of existing listings
  const [allowSecurityDeposit, setAllowSecurityDeposit] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      rentalType: "",
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      rentalPrice: "",
      bookingPrice: "",
      title: "",
      description: "",
      amenities: [],
      rentalAddress: "",
      rentalAmount: "",
      rentalSecurityDeposit: "",
      utilitiesMaintenance: "",
      paymentMethod: "",
      bookingAddress: "",
      bookingFee: "",
      bookingSecurityDeposit: "",
      cancellationPolicy: "",
    },
  });

  const rentalType = watch("rentalType");
  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  const [showAgreementTab, setShowAgreementTab] = useState(rentalType);

  const onClose = () => {
    reset({
      rentalType: "",
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      rentalPrice: "",
      bookingPrice: "",
      title: "",
      description: "",
      amenities: [],
      rentalAddress: "",
      rentalAmount: "",
      rentalSecurityDeposit: "",
      utilitiesMaintenance: "",
      paymentMethod: "",
      bookingAddress: "",
      bookingFee: "",
      bookingSecurityDeposit: "",
      cancellationPolicy: "",
    });
    setStep(STEPS.RENTAL_TYPE); // Reset the step to the first one
    rentModal.onClose(); // Close the modal
  };

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

  const handleImageUpload = (newImages: string[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
    //    console.log("Uploaded images:", [...images, ...newImages]);
  };

  // Fetch existing listings and set the limit based on the user's subscription plan
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;

      //      //console.log("Fetching listings for userId:", user.id); // Add this log
      try {
        // Get the number of listings the user already has
        const response = await axios.get(
          `/api/listings/count?userId=${user.id}`
        );
        const listingsCount = response?.data?.count;

        if (listingsCount !== undefined) {
          // Log current exisiting listings
          //          console.log("Listing Count:", listingsCount);
          setExistingListings(listingsCount); // Set the number of existing listings
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchUserListings();
  }, [user]);

  // Determine the property limit based on user role
  const getPropertyLimit = () => {
    if (user?.plan === "free") return 2;
    if (user?.plan === "premium") return 5;
    if (user?.plan === "business") return Infinity; // No limit for business
    return 0;
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.RENTAL_TYPE && !rentalType) {
      toast.error("Please select a rental type before proceeding.");
      return;
    }
    if (step === STEPS.CATEGORY && !category) {
      toast.error("Please select a category before proceeding.");
      return;
    }
    if (step === STEPS.LOCATION && !location) {
      toast.error("Please select a location before proceeding.");
      return;
    }
    if (step === STEPS.IMAGES) {
      if (images.length === 0) {
        toast.error("Please upload at least one image before proceeding.");
        return;
      }
      setCustomValue("imageSrc", images); // Persist images before proceeding
    }
    setStep((prevStep) => prevStep + 1); // Proceed to next step
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    const propertyLimit = getPropertyLimit();

    // Check if user has exceeded the property limit
    if (existingListings >= propertyLimit) {
      toast.error(
        `You cannot list more than ${propertyLimit} properties with your current plan.`
      );
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/listings", data);
      toast.success("Listing Created!");
      window.location.reload();
      reset();
      setStep(STEPS.RENTAL_TYPE);
      rentModal.onClose();

      // Log the property limit and current listings
      //      console.log(`Current Plan: ${user?.plan}`);
      //      console.log(`Property Limit: ${propertyLimit}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    return step === STEPS.PRICE ? "Create" : "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.RENTAL_TYPE ? undefined : "Back";
  }, [step]);

  const progressPercentage =
    ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

  let bodyContent;

  const renderBodyContent = () => {
    switch (step) {
      case STEPS.RENTAL_TYPE:
        return (
          <div className="flex flex-col gap-8 p-6">
            <Heading
              title="What type of property listing is this?"
              subTitle="Choose the rental option that best fits your property."
            />
            <div className="flex flex-wrap gap-6 justify-center">
              {["rent", "booking", "both"].map((type) => (
                <div
                  key={type}
                  className={`flex-1 max-w-xs p-6 rounded-lg cursor-pointer transition-transform duration-200 border-2
                    ${
                      rentalType === type
                        ? "bg-green-600 text-white border-green-600 shadow-lg"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-green-50 hover:border-green-400 hover:shadow-md"
                    } 
                    transform hover:scale-105`}
                  onClick={() => setCustomValue("rentalType", type)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCustomValue("rentalType", type);
                    }
                  }}
                  aria-pressed={rentalType === type}
                  aria-label={`Select ${
                    type === "both"
                      ? "Both Rental and Booking Options"
                      : type === "rent"
                      ? "Long-term Rent"
                      : "Short-term Booking"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold">
                      {type === "both"
                        ? "Both Options"
                        : type === "rent"
                        ? "Long-term Rent"
                        : "Short-term Booking"}
                    </h3>
                    <p className="text-sm">
                      {type === "rent"
                        ? "Ideal for long-term rentals. Rent out your property on a monthly basis."
                        : type === "booking"
                        ? "Perfect for short-term stays. Allow guests to book for a few nights or weeks."
                        : "Maximize flexibility by offering both rental and booking options."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case STEPS.CATEGORY:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Choose a category for your property"
              subTitle="Select a category that best describes your property"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
              {categories.map((item) => (
                <div key={item.label} className="col-span-1">
                  <CategoryInput
                    onClick={(category) => setCustomValue("category", category)}
                    selected={category === item.label}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case STEPS.LOCATION:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Where is your place located?"
              subTitle="Help guests find you!"
            />
            <CountrySelect
              onChange={(value) => setCustomValue("location", value)}
              value={location}
            />
            <Map center={location?.latlng} />
          </div>
        );

      case STEPS.INFO:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Share some basics about your place"
              subTitle="What amenities do you have?"
            />
            <Counter
              title="Guests"
              subtitle="How many guests do you allow?"
              value={guestCount}
              onChange={(value) => setCustomValue("guestCount", value)}
            />
            <hr />
            <Counter
              title="Rooms"
              subtitle="How many rooms do you have?"
              value={roomCount}
              onChange={(value) => setCustomValue("roomCount", value)}
            />
            <hr />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms do you have?"
              value={bathroomCount}
              onChange={(value) => setCustomValue("bathroomCount", value)}
            />
          </div>
        );

      case STEPS.AMENITIES:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Select the amenities available"
              subTitle="What can your guests enjoy?"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
              {amenities.map((item) => (
                <div key={item.label} className="col-span-1">
                  <AmenityInput
                    onClick={() => {
                      const currentAmenities = watch("amenities") || [];
                      const newAmenities = currentAmenities.includes(item.label)
                        ? currentAmenities.filter(
                            (amenity: string) => amenity !== item.label
                          )
                        : [...currentAmenities, item.label];
                      setCustomValue("amenities", newAmenities);
                    }}
                    selected={watch("amenities")?.includes(item.label)}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case STEPS.IMAGES:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Upload images of your property"
              subTitle="Showcase your place"
            />
            {/* RentImageUpload Component */}
            <RentImageUpload
              images={images} // Pass the current images state
              onImageUpload={(updatedImages) => {
                setImages(updatedImages); // Update the local images state
                setCustomValue("imageSrc", updatedImages); // Update the form value with the new image list
              }}
            />
          </div>
        );

      case STEPS.DESCRIPTION:
        const toSentenceCase = (text: string): string => {
          if (!text) return "";
          return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        };

        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Describe your property"
              subTitle="Highlight your property’s unique features!"
            />
            <Input
              id="title"
              label="Title"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              value={watch("title")}
              onChange={(e) =>
                setValue("title", toSentenceCase(e.target.value))
              }
            />
            <hr />
            <Input
              id="description"
              label="Description"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              value={watch("description")}
              onChange={(e) =>
                setValue("description", toSentenceCase(e.target.value))
              }
            />
          </div>
        );

      case STEPS.AGREEMENT:
        return (
          <div className="flex flex-col gap-8 p-6 bg-white rounded-lg shadow-md">
            <Heading
              title="Set up the Agreement"
              subTitle="Specify terms based on rental type."
            />

            {rentalType === "both" && (
              <div className="flex gap-4 justify-center mb-8">
                <button
                  className={`px-6 py-3 rounded-lg text-sm font-semibold ${
                    showAgreementTab === "rent"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } transition duration-300 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400`}
                  onClick={() => setShowAgreementTab("rent")}
                >
                  Long-term Rent
                </button>
                <button
                  className={`px-6 py-3 rounded-lg text-sm font-semibold ${
                    showAgreementTab === "booking"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } transition duration-300 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400`}
                  onClick={() => setShowAgreementTab("booking")}
                >
                  Short-term Booking
                </button>
              </div>
            )}

            {(rentalType === "rent" || showAgreementTab === "rent") &&
              rentalType !== "booking" && (
                <div className="space-y-6">
                  <Input
                    id="rentalAddress"
                    label="Complete Address"
                    register={register}
                    errors={errors}
                    value={watch("rentalAddress")}
                    onChange={(e) => setValue("rentalAddress", e.target.value)}
                    required
                  />
                  <Input
                    id="rentalAmount"
                    label="Rental Amount"
                    required
                    formatPrice={true}
                    register={register}
                    errors={errors}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      // Validate numeric input
                      if (/[^\d]/.test(inputValue)) {
                        toast.error(
                          "Only numbers are allowed in the rental amount."
                        );
                      }

                      // Clean numeric value
                      const numericValue = inputValue.replace(/[^\d]/g, "");

                      // Update field value
                      setValue("rentalAmount", numericValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });

                      // Auto-calculate security deposit if allowed
                      if (allowSecurityDeposit) {
                        const amount = parseFloat(numericValue);
                        if (!isNaN(amount)) {
                          setValue("rentalSecurityDeposit", amount * 2);
                        }
                      }
                    }}
                  />

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        allowSecurityDeposit
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      } transition duration-300 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400`}
                      onClick={() =>
                        setAllowSecurityDeposit(!allowSecurityDeposit)
                      }
                    >
                      {allowSecurityDeposit
                        ? "Disable Auto Calculation"
                        : "Enable Security Deposit"}
                    </button>
                  </div>

                  <Input
                    id="rentalSecurityDeposit"
                    label="Security Deposit (optional)"
                    formatPrice={true}
                    register={register}
                    errors={errors}
                    value={watch("rentalSecurityDeposit")}
                    disabled={!allowSecurityDeposit}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      // Allow empty or numeric values
                      const numericValue = inputValue.replace(/[^\d]/g, "");
                      setValue("rentalSecurityDeposit", numericValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                  <Input
                    id="utilitiesMaintenance"
                    label="Utilities and Maintenance"
                    register={register}
                    errors={errors}
                  />
                  <Input
                    id="rentalLaw"
                    label="Governing Law"
                    disabled
                    register={register}
                    errors={errors}
                    value="Republic Act No. 9653"
                  />
                </div>
              )}

            {(rentalType === "booking" || showAgreementTab === "booking") &&
              rentalType !== "rent" && (
                <div className="space-y-6">
                  <Input
                    id="bookingAddress"
                    label="Complete Address"
                    required
                    register={register}
                    errors={errors}
                    value={watch("bookingAddress")}
                    onChange={(e) => setValue("bookingAddress", e.target.value)}
                  />
                  <Input
                    id="bookingFee"
                    label="Booking Fee"
                    required
                    formatPrice={true}
                    register={register}
                    errors={errors}
                    value={watch("bookingFee")}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      // Validate numeric input
                      if (/[^\d]/.test(inputValue)) {
                        toast.error(
                          "Only numbers are allowed in the booking fee."
                        );
                      }

                      // Clean numeric value
                      const numericValue = inputValue.replace(/[^\d]/g, "");

                      // Update field value
                      setValue("bookingFee", numericValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                      {...register("paymentMethod")}
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="GCash">GCash</option>
                      <option value="Paypal">Paypal</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <Input
                    id="bookingSecurityDeposit"
                    label="Booking Security Deposit (optional)"
                    formatPrice={true}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    id="cancellationPolicy"
                    label="Cancellation Policy"
                    register={register}
                    errors={errors}
                  />
                  <Input
                    id="bookingLaw"
                    label="Governing Law"
                    disabled
                    register={register}
                    errors={errors}
                    value="Republic Act No. 7394"
                  />
                </div>
              )}
          </div>
        );

      case STEPS.PRICE:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Set your price"
              subTitle="What do you want to charge?"
            />

            {/* Only show the rental price if rentalType is 'rent' or 'both' and rent tab is selected */}
            {(rentalType === "rent" || rentalType === "both") && (
              <Input
                id="rentalPrice"
                label="Rental Price per Month"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                formatPrice={true}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Check if non-numeric characters are present
                  if (/[^\d]/.test(inputValue)) {
                    toast.error(
                      "Only numbers are allowed in the rental price."
                    );
                  }

                  // Use a regular expression to allow only numeric input
                  const numericValue = inputValue.replace(/[^\d]/g, "");

                  // Update the field value with only numbers
                  setValue("rentalPrice", numericValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            )}

            {/* Only show the booking price if rentalType is 'booking' or 'both' and booking tab is selected */}
            {(rentalType === "booking" || rentalType === "both") && (
              <Input
                id="bookingPrice"
                label="Booking Price per Night"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                formatPrice={true}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Check if non-numeric characters are present
                  if (/[^\d]/.test(inputValue)) {
                    toast.error(
                      "Only numbers are allowed in the booking price."
                    );
                  }

                  // Use a regular expression to allow only numeric input
                  const numericValue = inputValue.replace(/[^\d]/g, "");

                  // Update the field value with only numbers
                  setValue("bookingPrice", numericValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  bodyContent = renderBodyContent();

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Rent Your Property"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.RENTAL_TYPE ? undefined : onBack}
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

export default RentModal;
