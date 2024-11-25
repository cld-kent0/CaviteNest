import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  createdAt: string;
  price: number;
  status: string;
}

interface ChartData {
  date: string;
  total: number;
  count: number; // Added count for subscribed users
}

const SalesRevenueGraph = () => {
  // Calculate today's date and the next day's date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Format dates as YYYY-MM-DD
  const formattedToday = today.toISOString().split("T")[0];
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedTomorrow);

  const processChartData = useCallback(
    (data: Transaction[]) => {
      console.log("Processing chart data...");
      console.log("Transactions Data: ", data);

      // Filter data for the specified date range and status (active or completed)
      const filteredData = data.filter(
        (transaction) =>
          new Date(transaction.createdAt) >= new Date(startDate) &&
          new Date(transaction.createdAt) <= new Date(endDate) &&
          (transaction.status === "COMPLETED" ||
            transaction.status === "ACTIVE")
      );
      console.log("Filtered Data: ", filteredData);

      // Create an object to track revenue and user count by date
      const groupedData: Record<string, { total: number; count: number }> =
        filteredData.reduce((acc, transaction) => {
          const date = new Date(transaction.createdAt)
            .toISOString()
            .split("T")[0]; // Get the date in YYYY-MM-DD format

          console.log(
            `Processing transaction: ${transaction.createdAt} -> Date: ${date}, Price: ${transaction.price}`
          );

          // Initialize the entry for this date if it doesn't exist
          if (!acc[date]) {
            acc[date] = { total: 0, count: 0 };
          }

          // If the transaction is a subscription, check if the price is valid
          if (transaction.price) {
            // Add the price to the total for valid subscriptions
            acc[date].total += transaction.price;
          }

          // Increment the user count for any valid transaction (both active and completed)
          acc[date].count += 1;

          return acc;
        }, {} as Record<string, { total: number; count: number }>);

      console.log("Grouped Data by Date: ", groupedData);

      // Convert the grouped data into an array to be used for charting
      const chartData: ChartData[] = Object.entries(groupedData)
        .map(([date, { total, count }]) => ({
          date,
          total,
          count,
        }))
        .reverse(); // Reversing for chronological order
      console.log("Chart Data to be displayed: ", chartData);

      setChartData(chartData);
    },
    [startDate, endDate]
  );

  useEffect(() => {
    console.log("Fetching transaction history...");
    axios
      .get<Transaction[]>("/api/admin/subscriptions/transaction-history")
      .then((response) => {
        console.log("Fetched Transactions: ", response.data);
        setTransactions(response.data);
        processChartData(response.data);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, [processChartData]); // Add processChartData as a dependency

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">History Chart</h2>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            console.log("Start Date changed:", e.target.value);
            setStartDate(e.target.value);
          }}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            console.log("End Date changed:", e.target.value);
            setEndDate(e.target.value);
          }}
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            console.log("Applying date filter...");
            processChartData(transactions);
          }}
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
            <Tooltip
              labelFormatter={(value) => `Date: ${value}`}
              formatter={(value, name) => {
                if (name === "total") {
                  return [`₱${value}`, "Payments Accumulated"];
                } else if (name === "count") {
                  return [value, "Subscribers"];
                }
                return [value, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#82ca9d"
              strokeWidth={3}
              dot={{ r: 5, fill: "#82ca9d" }}
              activeDot={{ r: 8 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ r: 5, fill: "#8884d8" }}
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
