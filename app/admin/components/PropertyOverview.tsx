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
    return (
      <div className="flex justify-center items-center h-64 bg-red-100 text-red-600 rounded-md shadow-md">
        {error}
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 text-gray-600 rounded-md shadow-md">
        Loading...
      </div>
    );
  }

  // Convert the propertyData object to an array for Recharts
  const chartData = Object.entries(propertyData).map(([category, count]) => ({
    category,
    count,
  }));

  // Define different colors for the pie slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5722'];

  // Calculate total properties and category breakdown
  const totalProperties = chartData.reduce((total, item) => total + item.count, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Categories</h2>
      <p className="text-gray-600 mb-6">
        Breakdown of properties categorized by their types.
      </p>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row bg-gray-50 rounded-lg p-6 shadow">
        {/* Statistics Summary Section */}
        <div className="w-full md:w-1/3 pr-6 mb-6 md:mb-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Statistics</h3>
          <p className="text-gray-800">
            <strong>Total Properties:</strong> {totalProperties}
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            {chartData.map(({ category, count }) => (
              <li key={category}>
                <strong>{category}:</strong> {count} properties ({((count / totalProperties) * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>

        {/* Chart Section */}
        <div className="w-full md:w-2/3">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ category, percent }) =>
                  `${category}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value) => <span className="text-gray-700">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;
