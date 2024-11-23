// app/admin/components/Graph.tsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SubscriptionData {
  name: string;
  value: number; // Use 'number' since it should be a count or metric
}

const Graph = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData[]>([]); // Specify the type for state

  useEffect(() => {
    const fetchSubscriptionStats = async () => {
      const response = await fetch('/api/admin/subscriptions/stats');
      const data = await response.json();
      setSubscriptionData([{ name: 'Active Subscriptions', value: data.activeSubscriptions }]);
    };

    fetchSubscriptionStats();
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-4 mb-6">
      <h3 className="text-lg font-bold">Subscription Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={subscriptionData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
