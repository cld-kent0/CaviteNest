'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import printContent from '../../components/printReport';

interface Transaction {
  id: string;
  type: string;
  user: string;
  plan: string;
  billingPeriod?: string;
  period?: string;
  price?: string;
  status: string;
  createdAt: string;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/admin/subscriptions/transaction-history')
      .then((response) => setTransactions(response.data))
      .catch((error) => console.error('Error fetching transactions:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prev) =>
      prev?.key === key && prev.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' }
    );
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig || !sortConfig.key) return 0; // Check for undefined sortConfig and key
    const { key, direction } = sortConfig;

    const order = direction === 'asc' ? 1 : -1;

    // Safely compare values, considering `undefined` cases
    const valueA = a[key] ?? '';
    const valueB = b[key] ?? '';

    if (valueA > valueB) return order;
    if (valueA < valueB) return -order;
    return 0; // Equal case
  });

  const filteredTransactions = sortedTransactions.filter((transaction) => {
    return (
      (!filterStatus || transaction.status === filterStatus) &&
      (transaction.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.plan.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalItems = filteredTransactions.length;

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrint = () => {
    const tableContent = `
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          line-height: 1.6;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
          white-space: nowrap;
        }
        th {
          background-color: #f4f4f4;
          color: #333;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
      </style>
      <h1>Transaction History Report</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>User</th>
            <th>Plan</th>
            <th>Billing Period</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
        .map(
          (transaction) => `
              <tr>
                <td>${transaction.id}</td>
                <td>${transaction.type}</td>
                <td>${transaction.user}</td>
                <td>${transaction.plan}</td>
                <td>${transaction.billingPeriod || transaction.period || '-'}</td>
                <td>${transaction.price || '-'}</td>
                <td>${transaction.status}</td>
                <td>${new Date(transaction.createdAt).toLocaleDateString()}</td>
              </tr>`
        )
        .join('')}
        </tbody>
      </table>
    `;
    printContent(tableContent);
  };

  return (
    <div className="p-6">
      <div className='flex justify-between items-center'>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Transaction History</h2>
        <button
          onClick={handlePrint}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Print Report
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">

        <select
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="DECLINED">Declined</option>
        </select>

        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {['ID', 'Type', 'User', 'Plan', 'Billing Period', 'Price', 'Status', 'Created At'].map(
                (header, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 border-b text-left cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase().replace(' ', '') as keyof Transaction)}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{transaction.id}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{transaction.type}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{transaction.user}</td>
                  <td className="px-4 py-2 border-b">{transaction.plan}</td>
                  <td className="px-4 py-2 border-b">{transaction.billingPeriod || transaction.period}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">
                    {transaction.price ? `${transaction.price}` : '-'}
                  </td>
                  <td className="px-4 py-2 border-b">{transaction.status}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
      {/* <div className='flex'>
        <div className="mt-4 text-gray-500 ">
          Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
          className="border p-2 rounded mt-2 ml-auto"
        >
          {[10, 25, 50].map((count) => (
            <option key={count} value={count}>
              {count} per page
            </option>
          ))}
        </select>
      </div> */}
    </div>
  );
};

export default TransactionHistory;
