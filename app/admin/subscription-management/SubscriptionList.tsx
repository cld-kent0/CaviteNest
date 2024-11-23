import React, { useEffect, useState } from "react";
import axios from "axios";
import SubscriptionActions from "./SubscriptionActions";

interface Subscription {
  id: string;
  plan: string;
  period: string;
  endDate: string;
}

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await axios.get("/api/admin/subscriptions");
      setSubscriptions(response.data);
    };

    fetchSubscriptions();
  }, []);

  const handleView = (id: string) => {
    console.log(`Viewing subscription ${id}`);
    // Implement logic to view the subscription details
  };

  const handleCancel = (id: string) => {
    console.log(`Cancelling subscription ${id}`);
    // Implement logic to cancel the subscription
  };

  return (
    <div>
      <h1>Subscriptions</h1>
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub.id} className="border-b p-4">
            <p>Plan: {sub.plan}</p>
            <p>Period: {sub.period}</p>
            <p>End Date: {new Date(sub.endDate).toLocaleDateString()}</p>
            <SubscriptionActions
              itemId={sub.id}
              actions={[
                { label: "View", onClick: handleView },
                { label: "Cancel", onClick: handleCancel },
              ]}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionList;
