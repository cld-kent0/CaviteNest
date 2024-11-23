import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// Define types for the transactions and chart data
interface Transaction {
  createdAt: string; // ISO date string
  price: number; // Revenue amount
  status: string; // Transaction status (e.g., "COMPLETED", "ACTIVE")
}

interface ChartData {
  date: string; // Formatted date
  total: number; // Total revenue for the date
}

const SalesRevenueGraph = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Transaction data
  const [chartData, setChartData] = useState<ChartData[]>([]); // Data for the graph
  const [startDate, setStartDate] = useState('2024-11-01'); // Start date for filtering
  const [endDate, setEndDate] = useState('2024-11-21'); // End date for filtering

  useEffect(() => {
    axios
      .get<Transaction[]>('/api/admin/subscriptions/transaction-history') // Define API response type
      .then((response) => {
        setTransactions(response.data);
        processChartData(response.data);
      })
      .catch((error) =>
        console.error('Error fetching transactions:', error)
      );
  }, []);

  const processChartData = (data: Transaction[]) => {
    // Filter transactions based on the selected date range and the status (COMPLETED or ACTIVE)
    const filteredData = data.filter(
      (transaction) =>
        new Date(transaction.createdAt) >= new Date(startDate) &&
        new Date(transaction.createdAt) <= new Date(endDate) &&
        (transaction.status === 'COMPLETED' || transaction.status === 'ACTIVE')
    );
  
    // Group transactions by date and calculate total revenue
    const groupedData: Record<string, number> = filteredData.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.createdAt)
          .toISOString()
          .split('T')[0]; // Format date as YYYY-MM-DD
        acc[date] = (acc[date] || 0) + transaction.price; // Add up prices for each date
        return acc;
      },
      {} as Record<string, number> // Explicitly cast the accumulator type
    );
  
    // Convert grouped data into an array for Recharts and reverse the order
    const chartData: ChartData[] = Object.entries(groupedData)
      .map(([date, total]) => ({
        date,
        total,
      }))
      .reverse(); // Reverse the order of the data so the latest date is first
  
    setChartData(chartData);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales/Revenue</h2>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => processChartData(transactions)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#82ca9d"
              strokeWidth={3} // Thicker line
              dot={{ r: 5, fill: '#82ca9d' }} // Larger dots
              activeDot={{ r: 8 }} // Active dots on hover
              connectNulls // Line will continue even if there's missing data
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesRevenueGraph;
