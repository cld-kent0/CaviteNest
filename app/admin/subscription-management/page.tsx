'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionActions from './SubscriptionActions';
import Pagination from '../components/Pagination';
import axios from 'axios';
import SubscriptionDetailsModal from '../components/modals/SubscriptionDetailsModal';
import printContent from '../components/printReport'; // Import the print utility


interface Subscription {
  id: string;
  userId: string;
  plan: string;
  period: string;
  startDate: string;
  endDate: string;
  customerId: string;
  subscriptionStatus: string;
}

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null); // Modal subscription state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const router = useRouter();

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const response = await fetch(
          `/api/admin/subscriptions?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch subscriptions: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptions(data);
        setTotalItems(data.length); // Replace with `data.totalItems` if your API provides total count
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setSubscriptions([]);
      }
    }

    fetchSubscriptions();
  }, [currentPage, itemsPerPage]);

  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      await axios.post(`/api/admin/subscriptions/${subscriptionId}/unsubscribe`);
      alert('Unsubscribed successfully');
      setSubscriptions(subscriptions.filter((sub) => sub.id !== subscriptionId));
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Failed to unsubscribe. Please try again.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const openModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSubscription(null);
    setIsModalOpen(false);
  };

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
      <h1>Subscription Management Report</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Plan</th>
            <th>Period</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${subscriptions
        .map(
          (sub) => `
                <tr>
                  <td>${sub.id}</td>
                  <td>${sub.userId}</td>
                  <td>${sub.plan}</td>
                  <td>${sub.period}</td>
                  <td>${new Date(sub.startDate).toLocaleDateString()}</td>
                  <td>${new Date(sub.endDate).toLocaleDateString()}</td>
                  <td>${sub.subscriptionStatus}</td>
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Subscription Management</h1>
        <button
          onClick={handlePrint}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Print Report
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">User ID</th>
              <th className="px-4 py-2 border-b text-left">Plan</th>
              <th className="px-4 py-2 border-b text-left">Period</th>
              <th className="px-4 py-2 border-b text-left">Start Date</th>
              <th className="px-4 py-2 border-b text-left">End Date</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{subscription.userId}</td>
                <td className="px-4 py-2 border-b">{subscription.plan}</td>
                <td className="px-4 py-2 border-b">{subscription.period}</td>
                <td className="px-4 py-2 border-b whitespace-nowrap">{subscription.startDate}</td>
                <td className="px-4 py-2 border-b whitespace-nowrap">{subscription.endDate}</td>
                <td
                  className={`px-4 py-2 border-b ${subscription.subscriptionStatus === 'CANCELLED'
                    ? 'text-red-500'
                    : 'text-green-500'
                    }`}
                >
                  {subscription.subscriptionStatus}
                </td>
                <td className="px-4 py-2 border-b">
                  <SubscriptionActions
                    itemId={subscription.id}
                    actions={[
                      {
                        label: 'View',
                        onClick: () => openModal(subscription),
                      },
                      {
                        label: 'Cancel Subscription',
                        onClick: () => handleUnsubscribe(subscription.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Subscription Details Modal */}
      <SubscriptionDetailsModal
        isOpen={isModalOpen}
        subscription={selectedSubscription}
        onClose={closeModal}
      />
    </div>
  );
};

export default SubscriptionManagement;
