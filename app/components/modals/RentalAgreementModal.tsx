import React from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

interface RentalAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  onAcceptAndInquire: (conversationId: string) => void;
  rentalAddress: string; // New prop to pass the rental address
  rentalAmount: number | null; // New prop to pass the rental amount
  startDate: Date | null;
  rentalSecurityDeposit: number; // New prop to pass the security deposit
  utilitiesAndMaintenance: string; // New prop for utilities and maintenance
}

const formatPrice = (price: number): string => {
  return `₱${price.toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const RentalAgreementModal: React.FC<RentalAgreementModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  onAcceptAndInquire,
  rentalAddress,
  rentalAmount,
  rentalSecurityDeposit,
  utilitiesAndMaintenance,
  startDate,
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
      <h2 className="font-bold text-lg mb-2">RENTAL AGREEMENT</h2>
      <div className="text-justify">
        <p className="mb-4">
          The Lessor hereby agrees to rent the house located at{" "}
          <strong>{rentalAddress || "Not Specified"}</strong> to the Lessee, and
          the Lessee agrees to rent the same under the terms specified in this
          Agreement.
        </p>
        <p className="mb-4">
          The monthly rental amount is{" "}
          <strong>
            {rentalAmount ? formatPrice(rentalAmount) : "Not Specified"}
          </strong>
          , payable on or before each month to the Lessor by cash. Your ideal
          start date is <strong>{formatDate(startDate)}</strong>, that might be
          changed based on your agreement with the owner of the property.
        </p>
        <p className="mb-4">
          {rentalSecurityDeposit ? (
            <>
              The Lessee shall pay a one month advance and one month deposit. In
              total, an amount of{" "}
              <strong>{formatPrice(rentalSecurityDeposit)}</strong> shall be
              paid. This deposit will be held by the Lessor as security for
              damages, unpaid rent, or other expenses incurred due to the
              Lessee&quot;s occupancy. The security deposit will not be
              refundable to the Lessee upon the termination of this Agreement,
              subject to deductions for any damages or unpaid amounts.
            </>
          ) : (
            <>
              The Lessee shall only pay the agreed monthly rental amount of{" "}
              <strong>
                {rentalAmount ? formatPrice(rentalAmount) : "Not Specified"}
              </strong>{" "}
              without the need for an advance or deposit.
            </>
          )}
        </p>
        <p className="mb-4">
          <strong>Additional Utilities and Maintenance:</strong>{" "}
          {utilitiesAndMaintenance || "Not Specified"}
        </p>
        <p className="mb-4">
          <strong>Breach of Contract:</strong>
          <br />
          If the Lessee fails to comply with any of the terms of this Agreement,
          the Lessor may terminate this contract, and the Lessee shall forfeit
          the security deposit.
        </p>
        <p className="mb-4">
          <strong>Governing Law:</strong>
          <br />
          This agreement shall be governed by and construed in accordance with
          the laws of the Republic of the Philippines, Republic Act No. 7394,
          also known as the &quot;Rent Control Act of 2009&quot;.
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
      title="Rental Agreement Details"
    >
      <div className="p-4 max-h-[400px] overflow-y-auto">{content}</div>
    </Modal>
  );
};

export default RentalAgreementModal;
