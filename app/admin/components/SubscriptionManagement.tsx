// app/admin/components/Submenu/SubscriptionManagement.tsx
interface SubscriptionManagementProps {
    lessorId: string; // Add prop for lessor ID
  }
  
  const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ lessorId }) => {
    const subscribeLessor = async () => {
      await fetch('/api/admin/subscriptions/subscribe', {
        method: 'POST',
        body: JSON.stringify({ lessorId }),
        headers: { 'Content-Type': 'application/json' },
      });
      // Optionally, refresh data or provide feedback
    };
  
    const unsubscribeLessor = async () => {
      await fetch('/api/admin/subscriptions/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ lessorId }),
        headers: { 'Content-Type': 'application/json' },
      });
      // Optionally, refresh data or provide feedback
    };
  
    return (
      <div className="bg-white shadow-md rounded p-4">
        <h3 className="text-lg font-bold">Manage Subscription</h3>
        <button onClick={subscribeLessor} className="mt-2 mr-2 bg-emerald-700 text-white p-2 rounded">
          Subscribe Lessor
        </button>
        <button onClick={unsubscribeLessor} className="mt-2 bg-red-500 text-white p-2 rounded">
          Unsubscribe Lessor
        </button>
      </div>
    );
  };
  
  export default SubscriptionManagement;
  