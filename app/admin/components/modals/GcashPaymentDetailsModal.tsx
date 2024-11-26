import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io'; // Assuming you are using react-icons

export interface GcashPayment {
  id: string;
  userId: string;
  //subscriptionId: string;
  plan: string;
  billingPeriod: string;
  receiptFile: string;
  referenceNo: string;
  price: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    customerId: string;
  };
  subscription: {
    id: string;
    title: string;
  };
}


export interface GcashPaymentDetailsModalProps {
  isOpen: boolean;
  payment: GcashPayment | null;
  onClose: () => void;
}

const GcashPaymentDetailsModal: React.FC<GcashPaymentDetailsModalProps> = ({
  isOpen,
  payment,
  onClose,
}) => {
  const [step, setStep] = useState(0);
  const [newReferenceNo, setNewReferenceNo] = useState<string>(String(payment?.referenceNo || ''));

  if (!payment) return null;

  const handleClose = () => {
    onClose();
  };

  const goToNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleReferenceNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewReferenceNo(event.target.value);
  };

  async function handleApprove() {
    if (!payment) {
      console.error("Payment data is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/subscriptions/payments/gcash/${payment.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referenceNo: newReferenceNo, // Send the updated referenceNo if any
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error approving payment:", errorData.error);
        return;
      }

      const result = await response.json();
      console.log("Payment approved successfully:", result);
      handleClose(); // Close modal after declining
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  }

  const handleDecline = async () => {
    try {
      const response = await fetch(`/api/admin/subscriptions/payments/gcash/${payment.id}/decline`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to decline payment");
      // alert("Payment declined successfully");
      toast.success("Payment declined successfully");
      handleClose(); // Close modal after declining
    } catch (error) {
      console.error("Error declining payment:", error);
      // alert("Failed to decline payment. Please try again.");
      toast.error("Failed to decline payment. Please try again.");
    }
  };

  const handleUpdatePlan = async () => {
    if (!payment) {
      console.error("Payment data is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/subscriptions/payments/gcash/${payment.id}/upgrade-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: payment.id, // Include paymentId
          userId: payment.userId,
          plan: payment.plan, // Send the updated plan
          referenceNo: newReferenceNo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating plan:", errorData.error);
        // alert("Failed to update the plan. Please try again.");
        toast.error("Failed to update the plan. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Plan updated successfully:", result);
      // alert("Plan updated successfully!");
      toast.success("Plan updated successfully!");
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error updating plan:", error);
      // alert("An error occurred while updating the plan. Please try again.");
      toast.error("An error occurred while updating the plan. Please try again.");
    }
  };


  const bodyContent = (
    <div className="space-y-4">
      {step === 0 && (
        <div>
          <p><strong>Payment ID:</strong> {payment.id}</p>
          <p><strong>User ID:</strong> {payment.userId}</p>
          <p><strong>Customer ID:</strong> {payment.user.customerId}</p>
          <p><strong>Reference Number:</strong> {payment.referenceNo || 'N/A'}</p> {/* Added Reference Number */}
          <p><strong>Plan:</strong> {payment.plan}</p>
          <p><strong>Billing Period:</strong> {payment.billingPeriod}</p>
          <p><strong>Price:</strong> {payment.price}</p>
          <p><strong>Status:</strong> {payment.status}</p>
          <p><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="mb-4">
            <strong>Receipt:</strong> <span className="text-gray-600">Available</span>
          </div>
          <div className="flex justify-center mb-4">
            <Image
              src={payment.receiptFile}
              alt="Receipt"
              className="w-50 h-80 border rounded-lg"
            />
          </div>
          <div className="mb-4 mt-8 flex">
            <strong className='mt-2'>Reference Number:</strong>
            {payment.referenceNo !== null ? (
              <p className='flex ml-2 mt-2'> {payment.referenceNo || 'N/A'}</p>
            ) : (
              <input
                type="text"
                value={newReferenceNo}
                onChange={handleReferenceNoChange}
                className="p-2 ml-2 border rounded-lg"
              />
            )

            }

          </div>
        </div>
      )}
    </div>
  );

  const actionButtons = (
    <div className="flex gap-4 w-full h-14">
      {step === 0 && (
        <button
          onClick={goToNextStep}
          className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Next
        </button>
      )}
      {step === 1 && (
        <>
          <button
            onClick={goToPreviousStep}
            className="w-1/3 p-2 bg-sky-900 text-white rounded-lg hover:bg-sky-950"
          >
            Back
          </button>
          {payment.status === "PENDING" && payment.user.customerId ? (
            <button
              onClick={handleUpdatePlan}
              className="w-1/3 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Update Plan
            </button>
          ) : (
            <button
              onClick={handleApprove}
              className={`w-1/3 p-2 rounded-lg text-white ${payment.status === "COMPLETED"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
              disabled={payment.status === "COMPLETED"}
            >
              Approve
            </button>
          )}
          <button
            onClick={handleDecline}
            className={`w-1/3 p-2 rounded-lg text-white ${payment.status === "COMPLETED"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
              }`}
            disabled={payment.status === "COMPLETED"}
          >
            Decline
          </button>
        </>
      )}
    </div>
  );

  // Modal animation & transition based on `isOpen` prop
  const modalClasses = isOpen
    ? 'translate-y-0 opacity-100'
    : 'translate-y-full opacity-0';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/70 ${modalClasses} transition-all duration-300`}>
      <div className="relative w-full h-full mx-auto my-6 md:w-4/6 lg:w-3/6 xl:w-2/5 lg:h-auto md:h-auto">
        <div className="relative flex flex-col w-full h-full bg-white border-0 rounded-lg shadow-lg">
          {/* HEADER */}
          <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
            <button
              onClick={handleClose}
              className="absolute p-1 transition border-0 hover:opacity-70 right-9"
            >
              <IoMdClose size={18} />
            </button>
            <div className="text-lg font-semibold">Gcash Payment Details</div>
          </div>

          {/* BODY */}
          <div className="relative flex-auto p-6">
            {bodyContent}
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-2 p-6">
            <div className="flex flex-row items-center w-full gap-4">
              {actionButtons}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GcashPaymentDetailsModal;
