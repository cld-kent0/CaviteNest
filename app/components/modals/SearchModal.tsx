"use client";

import { formatISO } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useState } from "react";

import useSearchModal from "@/app/hooks/useSearchModal";
import { CountrySelectValue } from "@/app/types/categories";
import { Range } from "react-date-range";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import Modal from "./Modal";
import CategoryInput from "../CategoryInput";
import { categories } from "@/app/constants/categories";

enum STEPS {
  RENTAL_TYPE = 0,
  CATEGORY = 1,
  LOCATION = 2,
  DATE = 3,
  INFO = 4,
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.RENTAL_TYPE);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [rentalType, setRentalType] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    []
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);
  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      bathroomCount,
      roomCount,
      rentalType,
      category, // Add category to query
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/browse",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION); // Move to location step after rental type
    searchModal.onClose();

    router.push(url);
  }, [
    bathroomCount,
    category,
    dateRange,
    guestCount,
    location,
    onNext,
    params,
    roomCount,
    rentalType,
    router,
    searchModal,
    step,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.RENTAL_TYPE) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="What type of rental are you looking for?"
        subTitle="Choose your preferred rental type"
      />
      {/* Rental Type Options */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setRentalType("rent")}
          className={`w-full p-4 flex items-center justify-start text-left rounded-xl transition-all duration-300 ${
            rentalType === "rent"
              ? "bg-[#12264d] text-white"
              : "bg-gray-100 text-black"
          } hover:bg-[#456fb3] hover:text-white`}
        >
          <i className="mr-2 fas fa-home"></i>
          Monthly Rent
        </button>
        <button
          onClick={() => setRentalType("booking")}
          className={`w-full p-4 flex items-center justify-start text-left rounded-xl transition-all duration-300 ${
            rentalType === "booking"
              ? "bg-[#12264d] text-white"
              : "bg-gray-100 text-black"
          } hover:bg-[#456fb3] hover:text-white`}
        >
          <i className="mr-2 fas fa-calendar-check"></i>
          Daily Booking
        </button>
        <button
          onClick={() => setRentalType("both")}
          className={`w-full p-4 flex items-center justify-start text-left rounded-xl transition-all duration-300 ${
            rentalType === "both"
              ? "bg-[#12264d] text-white"
              : "bg-gray-100 text-black"
          } hover:bg-[#456fb3] hover:text-white`}
        >
          <i className="mr-2 fas fa-home"></i>
          Both
        </button>
      </div>
    </div>
  );

  if (step === STEPS.CATEGORY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Choose a category for your property"
          subTitle="Select a category that best describes your desired property"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          {categories.map((item) => (
            <div key={item.label} className="col-span-1">
              <CategoryInput
                onClick={(category) => setCategory(item.label)}
                selected={category === item.label}
                label={item.label}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where do you want to go?"
          subTitle="Find the perfect location!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setLocation(value)}
        />
        <hr />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subTitle="Make sure everyone is free"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subTitle="What amenities do you have?"
        />

        {/* Dynamically render fields based on the selected category */}
        {category === "House" && (
          <>
            <Counter
              title="Guests"
              subtitle="How many guests do you allow?"
              value={guestCount}
              onChange={(value) => setGuestCount(value)}
            />
            <hr />
            <Counter
              title="Rooms"
              subtitle="How many rooms do you have?"
              value={roomCount}
              onChange={(value) => setRoomCount(value)}
            />
            <hr />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms do you have?"
              value={bathroomCount}
              onChange={(value) => setBathroomCount(value)}
            />
          </>
        )}

        {category === "Apartment" && (
          <>
            <Counter
              title="Guests"
              subtitle="How many guests can your apartment accommodate?"
              value={guestCount}
              onChange={(value) => setGuestCount(value)}
            />
            <hr />
            <Counter
              title="Bedrooms"
              subtitle="How many bedrooms does your apartment have?"
              value={roomCount}
              onChange={(value) => setRoomCount(value)}
            />
            <hr />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms are there?"
              value={bathroomCount}
              onChange={(value) => setBathroomCount(value)}
            />
          </>
        )}

        {category === "Room" && (
          <>
            <Counter
              title="Guests"
              subtitle="How many guests can stay in this room?"
              value={guestCount}
              onChange={(value) => setGuestCount(value)}
            />
            <hr />
            <Counter
              title="Beds"
              subtitle="How many beds are in this room?"
              value={roomCount}
              onChange={(value) => setRoomCount(value)}
            />
            <hr />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms are accessible to this room?"
              value={bathroomCount}
              onChange={(value) => setBathroomCount(value)}
            />
          </>
        )}

        {category === "Events Place" && (
          <>
            <Counter
              title="Guests"
              subtitle="How many guests can the events place accommodate?"
              value={guestCount}
              onChange={(value) => setGuestCount(value)}
            />
            <hr />
            <Counter
              title="Rooms"
              subtitle="How many event rooms are available?"
              value={roomCount}
              onChange={(value) => setRoomCount(value)}
            />
            <hr />
            {/* Optional: Add event-specific fields, e.g., event capacity, facilities */}
          </>
        )}

        {category === "Resort" && (
          <>
            <Counter
              title="Guests"
              subtitle="How many guests can your resort accommodate?"
              value={guestCount}
              onChange={(value) => setGuestCount(value)}
            />
            <hr />
            <Counter
              title="Rooms"
              subtitle="How many rooms does your resort have?"
              value={roomCount}
              onChange={(value) => setRoomCount(value)}
            />
            <hr />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms are available?"
              value={bathroomCount}
              onChange={(value) => setBathroomCount(value)}
            />
            <hr />
            {/* Add resort-specific fields, like pool or amenities */}
          </>
        )}
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.RENTAL_TYPE ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default SearchModal;
