"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SearchInput from "../../components/SearchInput";
import ActionButton from "../../components/ActionButton";
import Pagination from "../../components/Pagination";
import LessorDetailsModal from "../../components/modals/LessorDetailsModal";
import Image from "next/image"; // Import Image component
import printContent from "../../components/printReport"; // Import the print utility

interface Lessor {
  id: string;
  name: string;
  email: string;
  is_archived: boolean;
  idStatus: string;
  image: string;
  createdAt: string;
  Subscription?: {
    plan: string;
    period: string;
    subscriptionStatus: string;
    startDate: string;
    endDate: string;
  };
}

const LessorList = () => {
  const [lessors, setLessors] = useState<Lessor[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLessor, setSelectedLessor] = useState<Lessor | null>(null); // Track selected Lessor
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const router = useRouter();

  useEffect(() => {
    fetchLessors();
  }, []);

  const fetchLessors = () => {
    axios
      .get("/api/admin/users/lessors")
      .then((response) => setLessors(response.data))
      .catch((error) => console.error("Error fetching lessors:", error));
  };

  const archiveLessor = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this lessor?"
    );
    if (confirmed) {
      axios
        .post(`/api/admin/archiving/archive`, { id, type: "lessor" })
        .then(() => fetchLessors())
        .catch((error) => console.error("Error archiving lessor:", error));
    }
  };

  const unarchiveLessor = (id: string) => {
    axios
      .post(`/api/admin/archiving/unarchive`, { id, type: "lessor" })
      .then(() => fetchLessors())
      .catch((error) => console.error("Error unarchiving lessor:", error));
  };

  const openModal = (lessor: Lessor) => {
    setSelectedLessor(lessor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    fetchLessors(); // Refresh the list after closing the modal
    setSelectedLessor(null);
    setIsModalOpen(false);
  };

  const filteredLessors = lessors
    .filter((lessor) => lessor.is_archived === showArchived)
    .filter(
      (lessor) =>
        lessor.id.includes(searchQuery) ||
        lessor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lessor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination logic
  const totalItems = filteredLessors.length;
  const paginatedLessors = filteredLessors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // Print report logic with all lessor data
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
    <h1>Lessor Management Report</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>ID Verified</th>
          <th>Created At</th>
          <th>Subscription Plan</th>
          <th>Subscription Period</th>
          <th>Subscription Status</th>
          <th>Subscription Start</th>
          <th>Subscription End</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${paginatedLessors
        .map(
          (lessor) => `
              <tr>
                <td>${lessor.id}</td>
                <td>${lessor.name}</td>
                <td>${lessor.email}</td>
                <td>${lessor.idStatus}</td>
                <td>${new Date(lessor.createdAt).toLocaleDateString()}</td>
                <td>${lessor.Subscription ? lessor.Subscription.plan : 'N/A'}</td>
                <td>${lessor.Subscription ? lessor.Subscription.period : 'N/A'}</td>
                <td>${lessor.Subscription ? lessor.Subscription.subscriptionStatus : 'N/A'}</td>
                <td>${lessor.Subscription ? new Date(lessor.Subscription.startDate).toLocaleDateString() : 'N/A'}</td>
                <td>${lessor.Subscription ? new Date(lessor.Subscription.endDate).toLocaleDateString() : 'N/A'}</td>
                <td>${lessor.is_archived ? 'Archived' : 'Active'}</td>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Users Management / Lessor
        </h2>
        <button
          onClick={handlePrint}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Print Report
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="bg-sky-900 hover:bg-sky-950 text-white px-4 py-2 rounded-md"
        >
          {showArchived ? "Show Active Lessors" : "Show Archived Lessors"}
        </button>
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">Image</th>
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                ID Verified
              </th>
              <th className="px-4 py-2 border-b text-left">Created At</th>
              <th className="px-4 py-2 border-b text-left">Subscription</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLessors.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No lessors found.
                </td>
              </tr>
            ) : (
              paginatedLessors.map((lessor) => (
                <tr key={lessor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {/* Replace <img> with <Image> component */}
                    <Image
                      src={
                        lessor.image ? lessor.image : "/images/placeholder.jpg"
                      }
                      alt={lessor.name}
                      className="rounded-full"
                      width={48} // Adjust width as needed
                      height={48} // Adjust height as needed
                      priority={true} // Ensure quick loading
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{lessor.id}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">
                    {lessor.name}
                  </td>
                  <td className="px-4 py-2 border-b">{lessor.email}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">
                    {lessor.idStatus
                      ? lessor.idStatus
                        .toLowerCase() // Convert all to lowercase
                        .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
                      : ""}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {new Date(lessor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">
                    {lessor.Subscription ? (
                      <>
                        <p>
                          <strong>Plan:</strong> {lessor.Subscription.plan}
                        </p>
                        <p>
                          <strong>Period:</strong> {lessor.Subscription.period}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {lessor.Subscription.subscriptionStatus}
                        </p>
                        <p>
                          <strong>Start:</strong>{" "}
                          {new Date(
                            lessor.Subscription.startDate
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>End:</strong>{" "}
                          {new Date(
                            lessor.Subscription.endDate
                          ).toLocaleDateString()}
                        </p>
                      </>
                    ) : (
                      "No Subscription"
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <ActionButton
                      itemId={lessor.id}
                      actions={
                        showArchived
                          ? [
                            {
                              label: "Unarchive",
                              onClick: unarchiveLessor,
                            },
                          ]
                          : [
                            {
                              label: "View",
                              onClick: () => openModal(lessor),
                            },
                            {
                              label: "Archive",
                              onClick: archiveLessor,
                            },
                          ]
                      }
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

      {/* Lessor Details Modal */}
      <LessorDetailsModal
        isOpen={isModalOpen}
        lessor={selectedLessor}
        onClose={closeModal}
      />
    </div>
  );
};

export default LessorList;
