"use client";

import { categories } from "@/app/constants/categories";
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
import EditImageUpload from "../inputs/EditImageUpload";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { amenities } from "@/app/constants/amenities";
import AmenityInput from "../AmenityInput";
import { SafeListing } from "@/app/types";

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

interface EditPropertyModalProps {
  listingData: SafeListing | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  listingData,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]); // Define images state
  const [step, setStep] = useState(STEPS.RENTAL_TYPE);
  const [isLoading, setIsLoading] = useState(false);
  const [allowSecurityDeposit, setAllowSecurityDeposit] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: listingData || {
      rentalType: "",
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      rentalPrice: 1,
      price: "",
      bookingPrice: 1,
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

  useEffect(() => {
    // Sync rentalAmount with rentalPrice in PRICE step
    if (watch("rentalAmount") !== undefined) {
      setValue("rentalPrice", watch("rentalAmount"));
    }

    // Sync bookingFee with bookingPrice in PRICE step
    if (watch("bookingFee") !== undefined) {
      setValue("bookingPrice", watch("bookingFee"));
    }
  }, [watch("rentalAmount"), watch("bookingFee")]);

  const [showAgreementTab, setShowAgreementTab] = useState(rentalType);

  // Dynamically load the map component only when location is available
  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    []
  );

  // Update the state with the form's imageSrc when the component mounts
  useEffect(() => {
    if (listingData?.imageSrc) {
      setImages(listingData.imageSrc); // Set images from the listing data when the modal opens
    }
  }, [listingData]);

  useEffect(() => {
    if (listingData) {
      console.log("Listing data is available:", listingData); // Debug listing data
      reset(listingData);
    } else {
      console.log("Listing data is not available yet.");
    }
  }, [listingData, reset]);

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => setStep((prevStep) => prevStep - 1);
  const onNext = () => setStep((prevStep) => prevStep + 1);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);
    try {
      const updatedData = { ...data, listingId: listingData?.id };
      await axios.put(`/api/listings/editListing`, updatedData);
      toast.success("Property Updated!");
      router.refresh();
      onClose();
      reset();
    } catch (error: any) {
      // Log the error for debugging
      console.error("Error updating property:", error);
      if (error.response) {
        // Backend responded with a status code outside of 2xx range
        toast.error(
          `Error: ${error.response.data.error || "Something went wrong."}`
        );
      } else {
        // Network or other error
        toast.error("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    return step === STEPS.PRICE ? "Save Changes" : "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.RENTAL_TYPE ? undefined : "Back";
  }, [step]);

  const progressPercentage =
    ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

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
                      ? "Both Monthly Rent and Daily Booking Options"
                      : type === "rent"
                      ? "Monthly Rent"
                      : "Daily Booking"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold">
                      {type === "both"
                        ? "Both Options"
                        : type === "rent"
                        ? "Monthly Rent"
                        : "Daily Booking"}
                    </h3>
                    <p className="text-sm">
                      {type === "rent"
                        ? "Offer your property for long-term rental. Tenants pay a fixed amount every month and can stay as long as they choose, based on your agreement."
                        : type === "booking"
                        ? "Perfect for short-term stays. Guests can book your property for a few days or weeks at a time."
                        : "Cater to all needs by allowing both long-term monthly rentals and short-term daily bookings."}
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
              onChange={(value) => {
                // Check if the selected value is different from the current location
                if (value !== location) {
                  setCustomValue("location", value); // Only update if there's a change
                }
              }}
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

            {/* Conditionally render fields based on the selected category */}
            {category === "House" && (
              <>
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
              </>
            )}

            {category === "Apartment" && (
              <>
                <Counter
                  title="Guests"
                  subtitle="How many guests can your apartment accommodate?"
                  value={guestCount}
                  onChange={(value) => setCustomValue("guestCount", value)}
                />
                <hr />
                <Counter
                  title="Bedrooms"
                  subtitle="How many bedrooms does your apartment have?"
                  value={roomCount}
                  onChange={(value) => setCustomValue("roomCount", value)}
                />
                <hr />
                <Counter
                  title="Bathrooms"
                  subtitle="How many bathrooms are there?"
                  value={bathroomCount}
                  onChange={(value) => setCustomValue("bathroomCount", value)}
                />
              </>
            )}

            {category === "Room" && (
              <>
                <Counter
                  title="Guests"
                  subtitle="How many guests can stay in this room?"
                  value={guestCount}
                  onChange={(value) => setCustomValue("guestCount", value)}
                />
                <hr />
                <Counter
                  title="Beds"
                  subtitle="How many beds are in this room?"
                  value={roomCount}
                  onChange={(value) => setCustomValue("roomCount", value)}
                />
                <hr />
                <Counter
                  title="Bathrooms"
                  subtitle="How many bathrooms are accessible to this room?"
                  value={bathroomCount}
                  onChange={(value) => setCustomValue("bathroomCount", value)}
                />
              </>
            )}

            {category === "Events Place" && (
              <>
                <Counter
                  title="Guests"
                  subtitle="How many guests can the events place accommodate?"
                  value={guestCount}
                  onChange={(value) => setCustomValue("guestCount", value)}
                />
                <hr />
                <Counter
                  title="Rooms"
                  subtitle="How many event rooms are available?"
                  value={roomCount}
                  onChange={(value) => setCustomValue("roomCount", value)}
                />
                <hr />
                {/* Optional: Add event-specific fields, e.g., event capacity, facilities, etc. */}
              </>
            )}

            {category === "Resort" && (
              <>
                <Counter
                  title="Guests"
                  subtitle="How many guests can your resort accommodate?"
                  value={guestCount}
                  onChange={(value) => setCustomValue("guestCount", value)}
                />
                <hr />
                <Counter
                  title="Rooms"
                  subtitle="How many rooms does your resort have?"
                  value={roomCount}
                  onChange={(value) => setCustomValue("roomCount", value)}
                />
                <hr />
                <Counter
                  title="Bathrooms"
                  subtitle="How many bathrooms are available?"
                  value={bathroomCount}
                  onChange={(value) => setCustomValue("bathroomCount", value)}
                />
                <hr />
                {/* Additional fields for Resort properties (like pool, amenities) can be added here */}
              </>
            )}
          </div>
        );

      case STEPS.AMENITIES:
        // Filter amenities based on the selected category
        const filteredAmenities = amenities.filter((amenity) =>
          amenity.categories.includes(category)
        );

        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Select the amenities available"
              subTitle="What can your guests enjoy?"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
              {filteredAmenities.map((item) => (
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
            <EditImageUpload
              onImageUpload={(newImages) => {
                // Update images in local state and the form with the new ones
                setImages(newImages); // Set the images in local state
                setCustomValue("imageSrc", newImages); // Set the images in the form state
                console.log("Updated images:", newImages);
              }}
              currentImages={images} // Pass current images to the RentImageUpload component
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
              subTitle='Highlight your property"s unique features!'
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

            {/* Check if rentalType is correctly set */}
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

            {/* Render long-term rent agreement */}
            {(rentalType === "rent" || showAgreementTab === "rent") &&
              rentalType !== "booking" && (
                <div className="space-y-6">
                  <Input
                    id="rentalAddress"
                    label="Complete Address"
                    required
                    register={register}
                    errors={errors}
                    value={watch("rentalAddress")}
                    onChange={(e) => setValue("rentalAddress", e.target.value)}
                  />
                  <Input
                    id="rentalAmount"
                    label="Rental Price"
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

            {/* Render short-term booking agreement */}
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
                    label="Booking Price"
                    required
                    formatPrice={true}
                    register={register}
                    errors={errors}
                    value={watch("bookingFee")}
                    onChange={(e) => setValue("bookingFee", e.target.value)}
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
              title="Review your Pricing"
              subTitle="This is what you've set based on the previous step"
            />

            {/* Only show the rental price if rentalType is 'rent' or 'both' and rent tab is selected */}
            {(rentalType === "rent" || rentalType === "both") && (
              <Input
                id="rentalPrice"
                label="Rental Price"
                disabled={true}
                register={register}
                errors={errors}
                required
                value={watch("rentalAmount")} // Correct the field to watch "rentalPrice"
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Check if non-numeric characters are present
                  if (/[^\d]/.test(inputValue)) {
                    toast.error(
                      "Only numbers are allowed in the rental price."
                    );
                  }

                  // Allow only numeric characters in the value
                  const numericValue = inputValue.replace(/[^\d]/g, "");

                  // Update the rentalPrice in the form state with only numeric values
                  setValue("price", numericValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            )}
            {(rentalType === "booking" || rentalType === "both") && (
              <Input
                id="bookingPrice"
                label="Booking Price"
                disabled={true}
                register={register}
                errors={errors}
                required
                value={watch("bookingFee")}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, ""); // Only allow numbers

                  // Check if the input contains any non-digit characters
                  if (e.target.value !== value) {
                    toast.error(
                      "Only numbers are allowed in the booking price."
                    ); // Display a toast message if the value contains non-numeric characters
                  }

                  setValue("price", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            )}
          </div>
        );
      default:
        return <div></div>;
    }
  };

  const bodyContent = renderBodyContent();

  return (
    <Modal
      disabled={isLoading}
      isOpen={isOpen}
      title="Editing your Property"
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

export default EditPropertyModal;
