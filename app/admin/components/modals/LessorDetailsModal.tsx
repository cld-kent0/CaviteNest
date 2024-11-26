'use client';

import Modal from '@/app/components/modals/Modal';
import axios from 'axios';
import React, { useState } from 'react';
import Image from 'next/image'; // Import the Next.js Image component
import toast from 'react-hot-toast';

interface LessorDetailsModalProps {
  isOpen: boolean;
  lessor: any;
  onClose: () => void;
}

enum STEPS {
  DETAILS = 0,
  ID_VERIFICATION = 1,
}

const LessorDetailsModal: React.FC<LessorDetailsModalProps> = ({ isOpen, lessor, onClose }) => {
  const [step, setStep] = useState(STEPS.DETAILS); // Track the current step
  const [isUpdating, setIsUpdating] = useState(false); // General updating state

  if (!lessor) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const onNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const onBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const toggleVerification = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await axios.post('/api/admin/users/lessors/verify', {
        id: lessor.id,
        idStatus: newStatus,
        idFront: lessor.idFront,
        idBack: lessor.idBack,
        idType: lessor.idType,
      });

      if (response.data) {
        lessor.idStatus = newStatus;
        // alert(`Lessor has been ${newStatus}.`);
        toast.success(`Lessor has been ${newStatus}.`);
      }
    } catch (error) {
      console.error('Failed to update verification status:', error);
      // alert('An error occurred while updating the verification status.');
      toast.error("No Image Available")
    } finally {
      setIsUpdating(false);
      onClose(); // Close the modal
    }
  };

  const convertToLessee = async () => {
    try {
      setIsUpdating(true);
      const response = await axios.post('/api/admin/users/lessors/convert-to-lessee', {
        id: lessor.id,
        role: 'LESSEE',
      });

      if (response.data) {
        // alert('Lessor has been successfully converted to Lessee.');
        toast.success('Lessor has been successfully converted to Lessee.')
        onClose();
      }
    } catch (error) {
      console.error('Failed to convert Lessor to Lessee:', error);
      // alert('An error occurred while converting to Lessee.');
      toast.error('Failed to convert Lessor to Lessee')
    } finally {
      setIsUpdating(false);
    }
  };

  // Body content based on step
  let bodyContent = (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Image
          src={lessor.image ? lessor.image : '/images/placeholder.jpg'}
          alt={lessor.name}
          className="rounded-full"
          width={96} // Profile picture width
          height={96} // Profile picture height
          priority // Ensure quick loading
        />
      </div>
      <p>
        <strong>ID:</strong> {lessor.id}
      </p>
      <p>
        <strong>ID Status:</strong> {lessor.idStatus}
      </p>
      <p>
        <strong>Name:</strong> {lessor.name}
      </p>
      <p>
        <strong>Email:</strong> {lessor.email}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(lessor.createdAt).toLocaleDateString()}
      </p>

      {/* Subscription Details */}
      {lessor.Subscription ? (
        <div>
          <p>
            <strong>Subscription Plan:</strong> {lessor.Subscription.plan}
          </p>
          <p>
            <strong>Period:</strong> {lessor.Subscription.period}
          </p>
          <p>
            <strong>Status:</strong> {lessor.Subscription.status}
          </p>
          <p>
            <strong>Start Date:</strong> {new Date(lessor.Subscription.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong> {new Date(lessor.Subscription.endDate).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>
          <strong>No Subscription</strong>
        </p>
      )}
    </div>
  );

  if (step === STEPS.ID_VERIFICATION) {
    bodyContent = (
      // <div className="space-y-4">
      //   <p>
      //     <strong>ID Type:</strong> {lessor.idType}
      //   </p>
      //   <div className="flex gap-4">
      //     <div>
      //       <p>
      //         <strong>ID Front:</strong>
      //       </p>
      //       <Image
      //         src={lessor.idFront}
      //         alt="ID Front"
      //         className="rounded border border-gray-300"
      //         width={300}
      //         height={400}
      //         objectFit="contain" // Prevent cropping
      //       />
      //     </div>
      //     <div>
      //       <p>
      //         <strong>ID Back:</strong>
      //       </p>
      //       <Image
      //         src={lessor.idBack}
      //         alt="ID Back"
      //         className="rounded border border-gray-300"
      //         width={300}
      //         height={400}
      //         objectFit="contain"
      //       />
      //     </div>
      //   </div>
      // </div>
      <div className="space-y-4">
        <p>
          <strong>ID Type:</strong> {lessor.idType}
        </p>
        <p>
          <strong>ID Front:</strong>
        </p>
        <div className="flex justify-center">
          {lessor.idFront ? (
            <Image
              src={lessor.idFront}
              alt="ID Front"
              className="rounded-lg"
              width={300}
              height={400}
              objectFit="contain" // Adjust to prevent cropping
            />
          ) : (
            <p>No Front ID Image Available</p>
          )}
        </div>
        <p>
          <strong>ID Back:</strong>
        </p>
        <div className="flex justify-center">
          {lessor.idBack ? (
            <Image
              src={lessor.idBack}
              alt="ID Back"
              className="rounded-lg"
              width={300}
              height={400}
              objectFit="contain"
            />
          ) : (
            <p>No Back ID Image Available</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={
        step === STEPS.ID_VERIFICATION
          ? () => toggleVerification(lessor.idStatus === 'verified' ? 'unverified' : 'verified')
          : onNext
      }
      title="Lessor Details"
      actionLabel={
        step === STEPS.ID_VERIFICATION
          ? isUpdating
            ? 'Updating...'
            : lessor.idStatus === 'verified'
              ? 'Unverify'
              : lessor.idStatus === 'rejected'
                ? 'Verify'
                : 'Verify'
          : 'View ID Verification'
      }
      actionDisabled={isUpdating}
      secondaryActionLabel={step === STEPS.DETAILS ? undefined : 'Back'}
      secondaryAction={step === STEPS.DETAILS ? undefined : onBack}
    >
      {bodyContent}

      {step === STEPS.DETAILS && (
        <button
          onClick={convertToLessee}
          disabled={isUpdating}
          className="w-full mt-4 p-2 bg-sky-900 text-white rounded-lg"
        >
          {isUpdating ? 'Converting...' : 'Convert to Lessee'}
        </button>
      )}

      {step === STEPS.ID_VERIFICATION && lessor.idStatus !== 'rejected' && (
        <button
          onClick={() => toggleVerification('rejected')}
          disabled={isUpdating}
          className="w-full mt-4 p-2 bg-red-500 text-white rounded-lg"
        >
          Reject
        </button>
      )}
    </Modal>
  );
};

export default LessorDetailsModal;
