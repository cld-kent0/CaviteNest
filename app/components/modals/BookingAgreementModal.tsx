import React from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

interface BookingAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  onAcceptAndInquire: (conversationId: string) => void;
  bookingAddress: string;
  bookingFee: number;
  bookingPrice: number;
  bookingSecurityDeposit: number;
  cancellationPolicy: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  checkInTime: string;
  checkOutTime: string;
  paymentMethod: string;
}

const formatPrice = (price: number): string => {
  return `₱${price.toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const BookingAgreementModal: React.FC<BookingAgreementModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  onAcceptAndInquire,
  bookingAddress,
  bookingFee,
  bookingPrice,
  bookingSecurityDeposit,
  cancellationPolicy,
  checkInDate,
  checkOutDate,
  checkInTime,
  checkOutTime,
  paymentMethod,
}) => {
  const router = useRouter();

  const handleAcceptAndInquire = () => {
    onAcceptAndInquire(conversationId);
    router.push(`/conversations/${conversationId}`);
  };

  const formatDate = (date: Date | null) => {
    return date ? new Date(date).toLocaleDateString("en-PH") : "Not Specified";
  };

  const content = (
    <div className="mr-4">
      <h2 className="font-bold text-lg mb-2">BOOKING AGREEMENT</h2>
      <div className="text-justify">
        <p className="mb-4">
          The Lessor agrees to book the property located at{" "}
          <strong>{bookingAddress || "Not Specified"}</strong>, to the Lessee
          for the agreed booking period. The Lessee will have access to the
          entire property, including all amenities listed within this Agreement,
          from the agreed check-in date and time of{" "}
          <strong>
            {formatDate(checkInDate)} {checkInTime}
          </strong>{" "}
          until the check-out date and time of{" "}
          <strong>
            {formatDate(checkOutDate)} {checkOutTime}
          </strong>
          .
        </p>
        <p className="mb-4">
          <strong>Booking Fees and Security Deposit:</strong>
          <br />
          The total amount for this accommodation is{" "}
          <strong>
            {" "}
            {bookingPrice ? formatPrice(bookingPrice) : "Not Specified"}
          </strong>{" "}
          , which is payable by{" "}
          <strong>{paymentMethod || "Not Specified"}</strong>. A security
          deposit of{" "}
          <strong>
            {" "}
            {bookingSecurityDeposit
              ? formatPrice(bookingSecurityDeposit)
              : "Not Specified"}
          </strong>{" "}
          will also be required and held by the Lessor for the duration of the
          booking to cover any damages. This security deposit will be refundable
          upon checkout, minus any deductions for damages or unpaid amounts, as
          necessary.
        </p>
        <p className="mb-4">
          <strong>Cancellation Policy:</strong>
          <br />
          If the Lessee cancels the booking, a{" "}
          <strong> {cancellationPolicy || "Not Specified"}</strong> policy will
          apply. If the Lessor needs to cancel the booking, the Lessee will be
          provided with a full refund and assistance in securing alternative
          accommodation if desired.
        </p>
        <p className="mb-4">
          <strong>Propery Rules and Regulation:</strong>
          <br />
          The Lessee agrees to maintain the property in good condition and to be
          responsible for any damages beyond normal wear and tear. At the end of
          the booking period, the Lessee shall return the property in the same
          condition as it was provided upon check-in, allowing for reasonable
          use.
        </p>
        <p className="mb-4">
          <strong>Liability and Indemnity:</strong>
          <br />
          The Lessor will not be responsible for any loss or damage to the
          Lessee’s personal belongings. The Lessee agrees to indemnify and hold
          harmless the Host from any claims, damages, or liabilities arising
          from the Lessee’s use of the property.
        </p>
        <p className="mb-4">
          <strong>Governing Law:</strong>
          <br />
          This agreement shall be governed by and construed in accordance with
          the laws of the Republic of the Philippines, Republic Act No. 7394,
          this Act shall be known as the “Consumer Act of the Philippines.”
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAcceptAndInquire}
      actionLabel="Accept and Inquire"
      title="Booking Agreement Details"
    >
      <div className="p-4 max-h-[400px] overflow-y-auto">{content}</div>
    </Modal>
  );
};

export default BookingAgreementModal;
