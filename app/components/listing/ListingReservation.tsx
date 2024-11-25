import React, { useState } from "react";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import axios from "axios";
import useLoginModal from "@/app/hooks/useLoginModal";

import Button from "../Button";
import Calendar from "../inputs/Calendar";
import RentalAgreementModal from "../modals/RentalAgreementModal";
import BookingAgreementModal from "../modals/BookingAgreementModal";
import toast from "react-hot-toast";

interface ListingReservationProps {
  price: number;
  totalPrice: number;
  dateRange: Range;
  onChangeDate: (value: Range) => void;
  disabled: boolean;
  disabledDates?: Date[];
  isOwner: boolean;
  rentalType: "rent" | "booking" | "both" | unknown;
  conversationId: string;
  onReservationSubmit: () => Promise<void>;
  isLoggedIn: boolean;
  rentalAddress: string;
  rentalAmount: number | null;
  rentalSecurityDeposit: number;
  utilitiesAndMaintenance: string;
  bookingAddress: string;
  bookingFee: number;
  bookingSecurityDeposit: number;
  cancellationPolicy: string;
  paymentMethod: string;
  listingId: string;
  listingOwner: string;
  listingImg: string[];
  currentUser: string | null;
}

const formatPrice = (price: number): string => {
  return `₱ ${price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  totalPrice,
  onChangeDate,
  dateRange,
  disabled,
  disabledDates,
  isOwner,
  rentalType,
  rentalAddress,
  rentalAmount,
  rentalSecurityDeposit,
  utilitiesAndMaintenance,
  bookingAddress,
  bookingFee,
  bookingSecurityDeposit,
  cancellationPolicy,
  isLoggedIn,
  paymentMethod,
  conversationId,
  listingId,
  listingOwner,
  listingImg,
  currentUser,
}) => {
  const initialType: "rent" | "booking" =
    rentalType === "both" ? "booking" : (rentalType as "rent" | "booking");
  const [currentType, setCurrentType] = useState<"rent" | "booking">(
    initialType
  );
  const [isRentalModalOpen, setRentalModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>("14:00");
  const [checkOutTime, setCheckOutTime] = useState<string>("12:00");

  const router = useRouter();
  const loginModal = useLoginModal();

  const handleToggle = () => {
    setCurrentType((prevType) => (prevType === "rent" ? "booking" : "rent"));
  };

  const handleInquireClick = async () => {
    // Check if the user is logged in, if not open the login modal
    if (!isLoggedIn) {
      return loginModal.onOpen();
    }

    // Early exit if user or listingId is missing
    if (!currentUser || !listingId) {
      toast.error("User ID or Listing ID is missing.");
      console.error("Missing userId or listingId");
      return;
    }

    console.log("Checking reservation for user:", currentUser);
    console.log("Listing ID:", listingId);

    try {
      // Send the POST request to check for a pending reservation
      const response = await axios.post("/api/reservations/checkReservation", {
        userId: currentUser, // Current user ID
        listingId: listingId, // Listing ID
      });

      console.log("Response from server:", response.data);

      // Check if the server response indicates a pending reservation
      if (
        response.data &&
        response.data.message ===
          "You already have a reservation (pending or confirmed) for this property."
      ) {
        console.log("Pending reservation detected.");
        toast.error(
          "You already have an existing reservation for this property. Check your 'My Trips'."
        );
        return; // Do not proceed further
      }

      // If no pending reservation, open the appropriate modal based on the inquiry type
      if (currentType === "rent") {
        setRentalModalOpen(true); // Open the rental modal
      } else if (currentType === "booking") {
        setBookingModalOpen(true); // Open the booking modal
      }
    } catch (error) {
      // Log error and display a toast error message
      console.error("Error checking reservation:", error);
      toast.error(
        "An error occurred while checking for your reservation. Please try again."
      );
    }
  };

  const handleAcceptAndInquire = async (modalData: any) => {
    try {
      // Replace any missing or undefined values with 'Not Specified'
      const sanitizedModalData = {
        rentalType,
        listingId, // Add listingId to the data being sent
        listingOwner, // Add listingId to the data being sent
        rentalAddress: modalData.rentalAddress || "Not Specified",
        rentalAmount: modalData.rentalAmount ?? "Not Specified",
        rentalSecurityDeposit:
          modalData.rentalSecurityDeposit ?? "Not Specified",
        utilitiesAndMaintenance:
          modalData.utilitiesAndMaintenance || "Not Specified",
        bookingAddress: modalData.bookingAddress || "Not Specified",
        bookingFee: modalData.bookingFee ?? "Not Specified",
        bookingSecurityDeposit:
          modalData.bookingSecurityDeposit ?? "Not Specified",
        cancellationPolicy: modalData.cancellationPolicy || "Not Specified",
        // Updated to display only the date and use checkInTime and checkOutTime separately
        checkInDate: modalData.checkInDate
          ? `${new Date(modalData.checkInDate).toLocaleDateString()} at ${
              modalData.checkInTime || "Not Specified"
            }`
          : "Not Specified",
        checkOutDate: modalData.checkOutDate
          ? `${new Date(modalData.checkOutDate).toLocaleDateString()} at ${
              modalData.checkOutTime || "Not Specified"
            }`
          : "Not Specified",
        startDate: modalData.startDate
          ? `${new Date(modalData.startDate).toLocaleDateString()} at ${
              modalData.startDate || "Not Specified"
            }`
          : "Not Specified",
        checkInTime: modalData.checkInTime || "Not Specified",
        checkOutTime: modalData.checkOutTime || "Not Specified",
        paymentMethod: modalData.paymentMethod || "Not Specified",
        listingImg: modalData.listingImg[0] || "Not Specified", // Use only the first image or default
      };

      // Send the sanitized modal data to the API to create a conversation or message
      const response = await axios.post(`/api/conversations`, {
        userId: conversationId, // Existing conversation ID
        modalData: sanitizedModalData, // Data passed from the modals
      });

      const reservationDetails = {
        listingId, // Use the listing ID from props
        listingOwner,
        totalPrice: modalData.rentalAmount || modalData.bookingFee || 0, // Use the rental amount or booking fee

        // Add condition for rentalType
        ...(modalData.rentalType === "booking"
          ? {
              startDate: modalData.checkInDate ?? null, // Use checkInDate for booking
              endDate: modalData.checkOutDate ?? null, // Use checkOutDate for booking
            }
          : {
              startDate: modalData.startDate ?? null, // Use startDate for rent
              endDate: modalData.endDate ?? null, // Use startDate for rent
            }),
      };

      // Assuming the response contains a new conversation ID
      const newConversationId = response.data.id;

      // Push to the conversation page
      router.push(`/conversations/${newConversationId}`);

      // Conditional message generation based on modal type
      let tailwindStyledMessage = "";

      if (sanitizedModalData.rentalAmount !== "Not Specified") {
        // Rental Inquiry Message
        tailwindStyledMessage = `
          Hi, I'm interested in this property
          <div class="px-12 py-4">
          <img 
            src="${sanitizedModalData.listingImg}" 
            alt="Listing Image" 
            style="
              height: 200px; 
              width: auto;
              object-fit: cover; 
              vertical-align: middle;
              margin-right: 8px;
              border-radius: 4px;" 
          />
          <h2 class="mt-2 text-xl font-semibold text-blue-600">Rental Inquiry Details</h2>
          <p class="text-lg"><strong class="font-bold">Address:</strong> ${sanitizedModalData.rentalAddress}</p>
          <p class="text-lg"><strong class="font-bold">Total Amount:</strong> ₱${sanitizedModalData.rentalAmount}</p>
          <p class="text-lg"><strong class="font-bold">Security Deposit:</strong> ₱${sanitizedModalData.rentalSecurityDeposit}</p>
          <p class="text-lg"><strong class="font-bold">Utilities and Maintenance:</strong> ${sanitizedModalData.utilitiesAndMaintenance}</p>
          </div>
        `;
      } else if (sanitizedModalData.bookingFee !== "Not Specified") {
        // Booking Inquiry Message
        tailwindStyledMessage = `
          Hi, I'm interested in this property
          <div class="px-12 py-4">
          <img 
            src="${sanitizedModalData.listingImg}" 
            alt="Listing Image" 
            style="
              height: 200px; 
              width: auto;
              object-fit: cover; 
              vertical-align: middle;
              margin-right: 8px;
              border-radius: 4px;"
          />
          <h2 class="mt-2 text-xl font-semibold text-blue-600">Booking Inquiry Details</h2>
          <p class="text-lg"><strong class="font-bold">Address:</strong> ${sanitizedModalData.bookingAddress}</p>
          <p class="text-lg"><strong class="font-bold">Amount:</strong> ₱${sanitizedModalData.bookingFee}</p>
          <p class="text-lg"><strong class="font-bold">Check-In:</strong> ${sanitizedModalData.checkInDate}</p>
          <p class="text-lg"><strong class="font-bold">Check-Out:</strong> ${sanitizedModalData.checkOutDate}</p>
          <p class="text-lg"><strong class="font-bold">Payment Method:</strong> ${sanitizedModalData.paymentMethod}</p>
          <p class="text-lg"><strong class="font-bold">Cancellation Policy:</strong> ${sanitizedModalData.cancellationPolicy}</p>
        `;
      }

      // Send the Tailwind styled message to the API
      await axios.post(`/api/messages`, {
        conversationId: newConversationId,
        message: tailwindStyledMessage, // Send the HTML message with Tailwind classes
        handleAcceptAndInquire: true, // Flag to trigger reservation creation
        reservationDetails, // Pass reservation details to the backend
      });
    } catch (error) {
      console.error("Error creating conversation or sending message:", error);
    }
  };

  const handleCloseRentalModal = () => setRentalModalOpen(false);
  const handleCloseBookingModal = () => setBookingModalOpen(false);

  return (
    <div className="sticky top-36 self-start">
      <div className="bg-white rounded-xl shadow-xl border-[1px] border-neutral-200 overflow-hidden">
        {/* Rental Type - Rent */}
        {rentalType === "rent" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl font-semibold">
                {formatPrice(rentalAmount ?? 0)}
              </div>
              <div className="text-neutral-600">a Month</div>
            </div>
            <hr className="mb-4" />
            <h3 className="text-xl font-bold mb-4">Long-term Rental Details</h3>
            <p className="text-neutral-600">
              Property Address: <strong>{rentalAddress}</strong>
            </p>
            <hr className="mt-4 mb-4" />
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-neutral-700 font-medium mb-2"
              >
                <strong>Ideal start date</strong>
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                onChange={(e) =>
                  onChangeDate({
                    ...dateRange,
                    startDate: new Date(e.target.value),
                  })
                } // Replace with your event handler
              />
            </div>
            <hr className="mt-4 mb-4" />
            <p className="text-neutral-600 text-justify">
              Click the <strong>&quot;Inquire&quot;</strong> button below to see
              the full details of the property and the agreement set by the
              owner!
            </p>
            <br></br>
            <Button
              disabled={isOwner || !isLoggedIn} // Disabled if owner or not logged in
              label="Inquire"
              onClick={handleInquireClick}
            />
          </div>
        )}

        {/* Rental Type - Booking */}
        {rentalType === "booking" && (
          <div className="p-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">{formatPrice(price)}</div>
              <div className="text-neutral-600">Per Night</div>
            </div>
            <hr className="mt-4" />
            <Calendar
              value={dateRange}
              disabledDates={disabledDates}
              onChange={(value) => onChangeDate(value.selection)}
            />
            <hr className="mb-4" />
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2">Check-In Time</label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Check-Out Time</label>
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <p className="text-neutral-600 text-justify">
                Click the <strong>&quot;Reserve&quot;</strong> button below to
                see the full details of the property and the agreement set by
                the owner!
              </p>
              <br></br>
              <Button
                disabled={disabled || isOwner || !isLoggedIn} // Disabled if any condition is true
                label="Reserve"
                onClick={handleInquireClick}
              />
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <div>Total Per Night</div>
              <div>{formatPrice(totalPrice)}</div>
            </div>
          </div>
        )}

        {/* Rental Type - Both Rent & Booking */}
        {rentalType === "both" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {currentType === "rent"
                  ? "Long-term Rent"
                  : "Short-term Booking"}
              </h3>
              <button
                className="p-3 bg-gray-200 rounded-lg text-sm"
                onClick={handleToggle}
              >
                Switch to {currentType === "rent" ? "Booking" : "Rent"}
              </button>
            </div>

            {currentType === "rent" ? (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl font-semibold">
                    {formatPrice(rentalAmount ?? 0)}
                  </div>
                  <div className="text-neutral-600">a Month</div>
                </div>
                <hr className="mb-4" />
                <h3 className="text-xl font-bold mb-4">
                  Long-term Rental Details
                </h3>
                <p className="text-neutral-600">
                  Property Address: <strong>{rentalAddress}</strong>
                </p>
                <hr className="mt-4 mb-4" />
                <div className="mb-4">
                  <label
                    htmlFor="startDate"
                    className="block text-neutral-700 font-medium mb-2"
                  >
                    <strong>Ideal start date</strong> (defaults to date today)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="startDate"
                      value={
                        // Always display today's date by default if no date is selected
                        dateRange.startDate
                          ? dateRange.startDate.toISOString().split("T")[0] // Display the selected date
                          : new Date().toISOString().split("T")[0] // Default to today's date
                      }
                      className="w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-neutral-400"
                      onChange={(e) =>
                        onChangeDate({
                          ...dateRange,
                          startDate: new Date(e.target.value), // Update the state when user selects a date
                        })
                      }
                      onFocus={(e) =>
                        e.target.classList.remove("text-neutral-400")
                      }
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.classList.add("text-neutral-400");
                        }
                      }}
                    />

                    {/* Custom placeholder text */}
                    {!dateRange.startDate && (
                      <span className="absolute left-3 top-2 text-neutral-400">
                        Select a date
                      </span>
                    )}
                  </div>
                </div>
                <hr className="mt-4 mb-4" />
                <p className="text-neutral-600 text-justify">
                  Click the <strong>&quot;Inquire&quot;</strong> button below to
                  see the full details of the property and the agreement set by
                  the owner!
                </p>
                <br></br>
                <Button
                  disabled={isOwner || !isLoggedIn} // Disabled if owner or not logged in
                  label="Inquire"
                  onClick={handleInquireClick}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-2xl font-semibold">
                    {formatPrice(price)}
                  </div>
                  <div className="text-neutral-600">Per Night</div>
                </div>
                <hr className="mt-4" />
                <Calendar
                  value={dateRange}
                  disabledDates={disabledDates}
                  onChange={(value) => onChangeDate(value.selection)}
                />
                <hr className="mb-4" />
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block mb-2">Check-In Time</label>
                      <input
                        type="time"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        className="border rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Check-Out Time</label>
                      <input
                        type="time"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                        className="border rounded p-2 w-full"
                      />
                    </div>
                  </div>
                  <Button
                    disabled={disabled || isOwner || !isLoggedIn} // Disabled if any condition is true
                    label="Inquire"
                    onClick={handleInquireClick}
                  />
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <div>Total Amount</div>
                  <div>{formatPrice(totalPrice)}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rental Agreement Modal */}
      <RentalAgreementModal
        isOpen={isRentalModalOpen}
        onClose={handleCloseRentalModal}
        onAcceptAndInquire={() => {
          const rentalModalData = {
            rentalType: "rent",
            conversationId,
            rentalAddress,
            rentalAmount: rentalAmount ?? 0,
            startDate: dateRange.startDate ?? null,
            rentalSecurityDeposit,
            utilitiesAndMaintenance,
            listingImg,
          };
          handleAcceptAndInquire(rentalModalData);
        }}
        conversationId={conversationId}
        rentalAddress={rentalAddress}
        rentalAmount={rentalAmount ?? 0}
        rentalSecurityDeposit={rentalSecurityDeposit}
        utilitiesAndMaintenance={utilitiesAndMaintenance}
        startDate={dateRange.startDate ?? null}
      />

      {/* Booking Agreement Modal */}
      <BookingAgreementModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onAcceptAndInquire={() => {
          const bookingModalData = {
            rentalType: "booking",
            conversationId,
            bookingAddress,
            bookingFee,
            bookingSecurityDeposit,
            cancellationPolicy,
            checkInDate: dateRange.startDate ?? null,
            checkOutDate: dateRange.endDate ?? null,
            checkInTime,
            checkOutTime,
            paymentMethod,
            listingImg,
          };
          handleAcceptAndInquire(bookingModalData);
        }}
        conversationId={conversationId}
        bookingAddress={bookingAddress}
        bookingFee={bookingFee}
        bookingSecurityDeposit={bookingSecurityDeposit}
        cancellationPolicy={cancellationPolicy}
        checkInDate={dateRange.startDate ?? null}
        checkOutDate={dateRange.endDate ?? null}
        checkInTime={checkInTime}
        checkOutTime={checkOutTime}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default ListingReservation;
