import Modal from '@/app/components/modals/Modal';
import axios from 'axios';
import React, { useState } from 'react';

interface LesseeDetailsModalProps {
  isOpen: boolean;
  lessee: any;
  onClose: () => void;
}

enum STEPS {
  DETAILS = 0,
  ID_VERIFICATION = 1,
}

const LesseeDetailsModal: React.FC<LesseeDetailsModalProps> = ({ isOpen, lessee, onClose }) => {
  const [step, setStep] = useState(STEPS.DETAILS);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!lessee) {
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
      setIsVerifying(true);

      const response = await axios.post('/api/admin/users/lessees/verify', {
        id: lessee.id,
        idStatus: newStatus,
        role: newStatus === 'verified' ? 'LESSOR' : lessee.role,
        idFront: lessee.idFront,
        idBack: lessee.idBack,
        idType: lessee.idType,
      });

      if (response.data) {
        lessee.idStatus = newStatus;
        lessee.role = newStatus === 'verified' ? 'LESSOR' : lessee.role;

        alert(
          `Lessee has been ${
            newStatus === 'verified'
              ? 'verified and promoted to Lessor'
              : newStatus === 'rejected'
              ? 'rejected'
              : 'unverified'
          }.`
        );
      }
    } catch (error) {
      console.error('Failed to update verification status:', error);
      alert('An error occurred while updating the verification status.');
    } finally {
      setIsVerifying(false);
      onClose();
    }
  };

  let bodyContent = (
    <div className="space-y-4">
      <div className="flex justify-center">
        <img
          src={lessee.image}
          alt={lessee.name}
          className="w-24 h-24 rounded-full"
        />
      </div>
      <p><strong>ID:</strong> {lessee.id}</p>
      <p><strong>Name:</strong> {lessee.name}</p>
      <p><strong>Email:</strong> {lessee.email}</p>
      <p><strong>Created At:</strong> {new Date(lessee.createdAt).toLocaleDateString()}</p>

      {/* Updated ID Verification Fields */}
      <p><strong>ID Status:</strong> {lessee.idStatus}</p>
      <p><strong>ID Type:</strong> {lessee.idType}</p>
    </div>
  );

  if (step === STEPS.ID_VERIFICATION) {
    bodyContent = (
      <div className="space-y-4">
        <div className="flex justify-center">
          {lessee.idFront ? (
            <img
              src={lessee.idFront}
              alt="ID Front"
              className="max-w-full h-auto"
            />
          ) : (
            <p>No Front ID Image Available</p>
          )}
        </div>
        <div className="flex justify-center">
          {lessee.idBack ? (
            <img
              src={lessee.idBack}
              alt="ID Back"
              className="max-w-full h-auto"
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
      onClose={handleClose}
      onSubmit={step === STEPS.ID_VERIFICATION ? () => toggleVerification(lessee.idStatus === 'verified' ? 'unverified' : 'verified') : onNext}
      title="Lessee Details"
      actionLabel={
        step === STEPS.ID_VERIFICATION
          ? isVerifying
            ? 'Updating...'
            : lessee.idStatus === 'verified'
            ? 'Unverified'
            : lessee.idStatus === 'rejected'
            ? 'Verify'
            : 'Verify'
          : 'View ID Verification'
      }
      actionDisabled={step === STEPS.ID_VERIFICATION && isVerifying}
      secondaryActionLabel={step === STEPS.DETAILS ? undefined : 'Back'}
      secondaryAction={step === STEPS.DETAILS ? undefined : onBack}
    >
      {bodyContent}

      {/* Added Rejected button */}
      {step === STEPS.ID_VERIFICATION && lessee.idStatus !== 'rejected' && (
        <button
          onClick={() => toggleVerification('rejected')}
          disabled={isVerifying}
          className="w-full mt-4 p-2 bg-red-500 text-white rounded-lg"
        >
          Reject
        </button>
      )}
    </Modal>
  );
};

export default LesseeDetailsModal;
