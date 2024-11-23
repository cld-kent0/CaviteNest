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

enum STEPS {
  RENTAL_TYPE = 0,
  LOCATION = 1,
  DATE = 2,
  INFO = 3,
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
  const [rentalType, setRentalType] = useState<string>(""); // State for rental type

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
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
      rentalType, // Add rentalType to query
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION); // Move to location step after rental type
    searchModal.onClose();

    router.push(url);
  }, [
    bathroomCount,
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
          className={`w-full p-4 text-left ${
            rentalType === "rent" ? "bg-green-500 text-white" : "bg-white"
          }`}
        >
          Rent
        </button>
        <button
          onClick={() => setRentalType("booking")}
          className={`w-full p-4 text-left ${
            rentalType === "booking" ? "bg-green-500 text-white" : "bg-white"
          }`}
        >
          Booking
        </button>
        <button
          onClick={() => setRentalType("both")}
          className={`w-full p-4 text-left ${
            rentalType === "both" ? "bg-green-5   00 text-white" : "bg-white"
          }`}
        >
          Both
        </button>
      </div>
    </div>
  );

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
        <Heading title="More information" subTitle="Find your perfect place" />
        <Counter
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
          title="Guests"
          subtitle="How many guests are coming?"
        />
        <Counter
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
          title="Rooms"
          subtitle="How many rooms do you need?"
        />
        <Counter
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
        />
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
