"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/components/modals/Modal";
import Heading from "../Heading";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import toast from "react-hot-toast";

enum STEPS {
  DETAILS = 0,
  QR_CODE = 1,
  UPLOAD = 2,
}

interface GcashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
  billingPeriod: string | null;
  price: string;
  subscriptionId: string;
  onSubmit: (receiptUrl: string | null) => void;
}

const GcashPaymentModal: React.FC<GcashPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  billingPeriod,
  price,
  onSubmit,
}) => {
  const [step, setStep] = useState(STEPS.DETAILS);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [referenceNo, setReferenceNo] = useState<string | null>(null); // State for reference number
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [qrCodeData, setQrCodeData] = useState<QRCode | null>(null); // QRCode state

  // Define the QRCode type based on your Prisma model
  interface QRCode {
    qrCodeImage: string | null;
    accountNumber: string;
    accountName: string;
  }

  // Fetch QR code data from the API
  useEffect(() => {
    if (isOpen) {
      const fetchQRCode = async () => {
        try {
          const response = await fetch("/api/admin/subscriptions/payments/qrcode");
          if (!response.ok) {
            const errorMessage = await response.text(); // Log server error response
            console.error("Error fetching QR Code:", errorMessage);
            throw new Error("Failed to fetch QR Code data");
          }
          const data = await response.json();
          setQrCodeData(data);
        } catch (error) {
          console.error("Error fetching QR code data:", error);
          setQrCodeData(null); // Ensure it handles errors gracefully
        }
      };
  
      fetchQRCode();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!receiptUrl) {
      setErrorMessage("Please upload your payment receipt before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/subscription/gcash-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          billingPeriod: billingPeriod || "One-time",
          receiptFile: receiptUrl,
          referenceNo: referenceNo?.trim() || null, // Include the reference number if provided
          price: price,
        }),
      });

      if (response.status === 409) {
        const errorData = await response.json();
        toast.error(errorData.message); // Display server's error message
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save Gcash payment");
      }

      const data = await response.json();
      console.log("Gcash payment saved:", data);
      onSubmit(receiptUrl);
      toast.success("Submitted Successfully");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error submitting Gcash payment:", error);
    }
  };

  const onNext = () => {
    setStep((prevStep) => prevStep + 1);
    setErrorMessage(null); // Clear error message when moving steps
  };

  const onBack = () => {
    setStep((prevStep) => prevStep - 1);
    setErrorMessage(null); // Clear error message when moving steps
  };

  const progressPercentage = ((step + 1) / (Object.keys(STEPS).length / 2)) * 100;

  let bodyContent = (
    <div className="p-4">
      <Heading title="Gcash Payment Details" subTitle="Review the details of your payment" />
      <div className="mt-4">
        <p>
          <strong>Selected Plan:</strong> {selectedPlan}
        </p>
        <p>
          <strong>Billing Period:</strong> {billingPeriod}
        </p>
        <p>
          <strong>Price:</strong> {price}
        </p>
      </div>
    </div>
  );

  if (step === STEPS.QR_CODE) {
    bodyContent = (
      <div className="p-4 mt-24">
        <Heading title="Step 2: GCash QR Code" subTitle="Scan the QR code below to make your payment" />
        <div className="flex justify-center my-4">
          {qrCodeData ?
            qrCodeData.qrCodeImage ? (
              <img
                src={qrCodeData.qrCodeImage}
                alt="Gcash QR Code"
                className="w-auto h-auto"
              />
            ) : (
              <p>No QR code image available</p>
            )
           : (
            <p>Loading QR code...</p>
          )}
        </div>
        <p>
          GCash Information: <strong>{qrCodeData?.accountNumber || "Loading..."}</strong>
        </p>
        <p>
          Account Name: <strong>{qrCodeData?.accountName || "Loading..."}</strong>
        </p>
      </div>
    );
  }
  

  if (step === STEPS.UPLOAD) {
    bodyContent = (
      <div className="p-4">
        <Heading title="Step 3: Upload Payment Receipt" subTitle="Please upload your payment receipt" />
        <ImageUpload onChange={(url) => setReceiptUrl(url)} value={receiptUrl || ""} />
        {receiptUrl && (
          <p className="mt-2 text-sm text-green-500 overflow-hidden">
            Uploaded File: {receiptUrl}
          </p>
        )}
        <h3 className="mt-4 text-gray-400"> Reference Number :</h3>
        <input
          type="text"
          placeholder="Enter Reference Number (Optional)"
          className="w-full p-2 mt-1 border rounded-lg"
          value={referenceNo || ""}
          onChange={(e) => setReferenceNo(e.target.value)}
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  const actionLabel = step === STEPS.UPLOAD ? "Submit" : "Next";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={step === STEPS.UPLOAD ? handleSubmit : onNext}
      actionLabel={actionLabel}
      title="Gcash Payment"
      secondaryAction={step > STEPS.DETAILS ? onBack : undefined} // Add the Back button action
      secondaryActionLabel={step > STEPS.DETAILS ? "Back" : undefined} // Add the Back button label
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

export default GcashPaymentModal;
