"use client";

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

// Transaction and ChartData interfaces
interface Transaction {
  createdAt: string;
  price: string | number;
  status: string;
}

interface ChartData {
  date: string;
  total: number;
  count: number;
}

// Helper function to format a date as YYYY-MM-DD
const formatDate = (date: Date) => date.toISOString().split("T")[0];

// Modular DatePicker Component
interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
}

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: DateRangePickerProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={onApply}
        className="bg-sky-900 text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
};

const SalesRevenueGraph = () => {
  const today = new Date();

  // Set default start date to November 24 of the current year
  const defaultStartDate = new Date(today.getFullYear(), 10, 24); // November is month 10 (0-based)
  const formattedStartDate = formatDate(defaultStartDate);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = formatDate(tomorrow);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [startDate, setStartDate] = useState(formattedStartDate);
  const [endDate, setEndDate] = useState(formattedTomorrow);

  // Process chart data
  const processChartData = useCallback(
    (data: Transaction[]) => {
      const convertPriceToNumber = (price: string | number): number => {
        if (typeof price === "string") {
          return parseFloat(price.replace("₱", "").replace(",", "").trim());
        }
        return price;
      };

      const filteredData = data.filter(
        (transaction) =>
          new Date(transaction.createdAt) >= new Date(startDate) &&
          new Date(transaction.createdAt) <= new Date(endDate) &&
          transaction.status === "ACTIVE" || transaction.status === "COMPLETED"
      );

      const groupedData: Record<string, { total: number; count: number }> =
        filteredData.reduce((acc, transaction) => {
          const date = new Date(transaction.createdAt)
            .toISOString()
            .split("T")[0];

          if (!acc[date]) {
            acc[date] = { total: 0, count: 0 };
          }

          const price = convertPriceToNumber(transaction.price);

          if (price) acc[date].total += price;
          acc[date].count += 1;

          return acc;
        }, {} as Record<string, { total: number; count: number }>);

      const allDates: string[] = [];
      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      while (currentDate <= end) {
        allDates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const chartData: ChartData[] = allDates.map((date) => ({
        date,
        total: groupedData[date]?.total || 0,
        count: groupedData[date]?.count || 0,
      }));

      setChartData(chartData);
    },
    [startDate, endDate]
  );

  useEffect(() => {
    axios
      .get<Transaction[]>("/api/admin/subscriptions/transaction-history")
      .then((response) => {
        setTransactions(response.data);
        processChartData(response.data);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, [processChartData]);

  const totalSubscribers = chartData.reduce((acc, data) => acc + data.count, 0);
  const totalPayments = chartData.reduce((acc, data) => acc + data.total, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Revenue & Subscriptions Overview
      </h2>

      {/* Date Range Filters */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApply={() => processChartData(transactions)}
      />

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-2 items-center">
            <span className="font-medium">Total Subscribers :</span>
            <span className="font-bold text-lg">{totalSubscribers}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-medium">Total Payments :</span>
            <span className="font-bold text-lg">
              ₱{totalPayments.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Subscribed Users Graph */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4">Subscribed Users</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => `Date: ${value}`}
              formatter={(value, name) => {
                if (name === "count") {
                  return [value, "Subscribers"];
                }
                return [value, name];
              }}
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

      {/* Payment Accumulated Graph */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-xl font-semibold mb-4">Payment Accumulated</h3>
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesRevenueGraph;
