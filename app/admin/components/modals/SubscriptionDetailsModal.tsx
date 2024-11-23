import Modal from '@/app/components/modals/Modal';
import React from 'react';

interface Subscription {
    id: string;
    userId: string;
    plan: string;
    period: string;
    subscriptionStatus: string;
    startDate: string | Date;
    endDate: string | Date;
  }

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  subscription: Subscription | null; // Selected subscription details
  onClose: () => void; // Function to close the modal
}

const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  isOpen,
  subscription,
  onClose,
}) => {
  if (!subscription) return null; // Return null if no subscription is selected

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscription Details"
      actionLabel="Close"
      onSubmit={onClose}
    >
      <div className="space-y-4">
        <p><strong>Subscription ID:</strong> {subscription.id}</p>
        <p><strong>User ID:</strong> {subscription.userId}</p>
        <p><strong>Plan:</strong> {subscription.plan}</p>
        <p><strong>Period:</strong> {subscription.period}</p>
        <p><strong>Status:</strong> {subscription.subscriptionStatus}</p>
        <p><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
      </div>
    </Modal>
  );
};

export default SubscriptionDetailsModal;
