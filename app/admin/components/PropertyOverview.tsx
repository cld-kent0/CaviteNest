import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PropertyOverview = () => {
  const [propertyData, setPropertyData] = useState<{ [key: string]: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyOverview = async () => {
      try {
        const response = await axios.get('/api/admin/property/overview');
        setPropertyData(response.data.propertyCountByCategory); // Set the property count data
      } catch (error) {
        console.error('Error fetching property overview data:', error);
        setError('Failed to fetch property overview data.');
      }
    };

    fetchPropertyOverview();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!propertyData) {
    return <div>Loading...</div>;
  }

  // Convert the propertyData object to an array for Recharts
  const chartData = Object.entries(propertyData).map(([category, count]) => ({
    category,
    count,
  }));

  // Define different colors for the pie slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5722'];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Property Overview</h2>

      {/* Render Recharts PieChart */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label
          >
            {/* Render a different color for each slice */}
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PropertyOverview;
