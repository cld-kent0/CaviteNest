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

interface Transaction {
  createdAt: string; 
  price: number; 
  status: string; 
}

interface ChartData {
  date: string; 
  total: number; 
}

const SalesRevenueGraph = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-11-21');

  const processChartData = (data: Transaction[]) => {
    const filteredData = data.filter(
      (transaction) =>
        new Date(transaction.createdAt) >= new Date(startDate) &&
        new Date(transaction.createdAt) <= new Date(endDate) &&
        (transaction.status === 'COMPLETED' || transaction.status === 'ACTIVE')
    );

    const groupedData: Record<string, number> = filteredData.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.createdAt)
          .toISOString()
          .split('T')[0];
        acc[date] = (acc[date] || 0) + transaction.price;
        return acc;
      },
      {} as Record<string, number>
    );

    const chartData: ChartData[] = Object.entries(groupedData)
      .map(([date, total]) => ({
        date,
        total,
      }))
      .reverse();

    setChartData(chartData);
  };

  useEffect(() => {
    axios
      .get<Transaction[]>('/api/admin/subscriptions/transaction-history')
      .then((response) => {
        setTransactions(response.data);
        processChartData(response.data);
      })
      .catch((error) =>
        console.error('Error fetching transactions:', error)
      );
  }, []); // Empty dependency array ensures this only runs on mount

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sales/Revenue</h2>
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
              strokeWidth={3}
              dot={{ r: 5, fill: '#82ca9d' }}
              activeDot={{ r: 8 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesRevenueGraph;
