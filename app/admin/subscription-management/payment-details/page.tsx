'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SearchInput from '../../components/SearchInput';
import ActionButton from '../../components/ActionButton';
import Pagination from '../../components/Pagination';
import GcashPaymentDetailsModal from '../../components/modals/GcashPaymentDetailsModal';
import EditQRCodeModal from '../../components/modals/EditQRCodeModal';
import printContent from '../../components/printReport'; // Import printContent function

interface GcashPayment {
  id: string;
  userId: string;
  subscriptionId: string;
  plan: string;
  billingPeriod: string;
  receiptFile: string;
  referenceNo: string;
  price: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    customerId: string;
  };
  subscription: {
    id: string;
    title: string;
  };
}

const GcashPaymentList = () => {
  const [gcashPayments, setGcashPayments] = useState<GcashPayment[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<GcashPayment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false); // New state for QR Code modal

  const router = useRouter();

  useEffect(() => {
    fetchGcashPayments();
  }, []);

  const fetchGcashPayments = () => {
    axios
      .get('/api/admin/subscriptions/payments/gcash')
      .then((response) => {
        setGcashPayments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Gcash payments:', error);
      });
  };

  const openModal = (payment: GcashPayment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    fetchGcashPayments();
    setSelectedPayment(null);
    setIsModalOpen(false);
  };

  // Filtering payments by status and search query
  const filteredPayments = gcashPayments
    .filter(
      (payment) =>
        payment.id.includes(searchQuery) ||
        payment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalItems = filteredPayments.length;

  // Pagination logic
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleEditQRCode = () => {
    setIsQRCodeModalOpen(true); // Open the QR Code modal
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
      <h1>GCash Payments Report</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Plan</th>
            <th>Billing Period</th>
            <th>Customer ID</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          ${gcashPayments
        .map(
          (payment) => `
              <tr>
                <td>${payment.id}</td>
                <td>${payment.user.name}</td>
                <td>${payment.plan}</td>
                <td>${payment.billingPeriod}</td>
                <td>${payment.user.customerId}</td>
                <td>${payment.price}</td>
                <td>${payment.status}</td>
                <td>${new Date(payment.createdAt).toLocaleDateString()}</td>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Payment Management / GCash Payments</h2>
        <button
          onClick={handlePrint}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Print Report
        </button>
      </div>

      {/* Search Input and Edit QR Code Button */}
      <div className="flex justify-between mb-4">
        <button
          onClick={handleEditQRCode}
          className="bg-sky-900 hover:bg-sky-950 text-white px-4 py-2 rounded-md"
        >
          Edit QR Code
        </button>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">User</th>
              <th className="px-4 py-2 border-b text-left">Plan</th>
              <th className="px-4 py-2 border-b text-left whitespace-nowrap">Billing Period</th>
              <th className="px-4 py-2 border-b text-left">Customer ID</th> {/* Changed column header */}
              <th className="px-4 py-2 border-b text-left">Price</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Created At</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No payments found.
                </td>
              </tr>
            ) : (
              paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{payment.id}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{payment.user.name}</td>
                  <td className="px-4 py-2 border-b">{payment.plan}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{payment.billingPeriod}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">{payment.user.customerId}</td> {/* Display Subscription ID */}
                  <td className="px-4 py-2 border-b whitespace-nowrap">{payment.price}</td>
                  <td className="px-4 py-2 border-b">{payment.status}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <ActionButton
                      itemId={payment.id}
                      actions={[
                        {
                          label: 'View',
                          onClick: () => openModal(payment),
                        },
                        // {
                        //   label: 'Block',
                        //   onClick: (id) => alert(`Blocking payment...`),
                        // },
                      ]}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          setCurrentPage(1);
        }}
      />

      {/* Gcash Payment Details Modal */}
      <GcashPaymentDetailsModal
        isOpen={isModalOpen}
        payment={selectedPayment}
        onClose={closeModal}
      />

      <EditQRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)} // Close the QR Code modal
      />
    </div>
  );
};

export default GcashPaymentList;
