"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import the Next.js Image component
import SearchInput from "../../components/SearchInput";
import ActionButton from "../../components/ActionButton";
import Pagination from "../../components/Pagination";
import LesseeDetailsModal from "../../components/modals/LesseeDetailsModal";

interface Lessee {
  id: string;
  name: string;
  email: string;
  is_archived: boolean;
  idStatus: string;
  image: string; // New field for image URL
  createdAt: string; // New field for creation date
}

const LesseeList = () => {
  const [lessees, setLessees] = useState<Lessee[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLessee, setSelectedLessee] = useState<Lessee | null>(null); // Track selected Lessee
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const router = useRouter();

  useEffect(() => {
    fetchLessees();
  }, []);

  const fetchLessees = () => {
    axios
      .get("/api/admin/users/lessees")
      .then((response) => setLessees(response.data))
      .catch((error) => console.error("Error fetching lessees:", error));
  };

  const archiveLessee = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this lessee?"
    );
    if (confirmed) {
      axios
        .post(`/api/admin/archiving/archive`, { id, type: "lessee" })
        .then(() => fetchLessees())
        .catch((error) => console.error("Error archiving lessee:", error));
    }
  };

  const unarchiveLessee = (id: string) => {
    axios
      .post(`/api/admin/archiving/unarchive`, { id, type: "lessee" })
      .then(() => fetchLessees())
      .catch((error) => console.error("Error unarchiving lessee:", error));
  };

  const openModal = (lessee: Lessee) => {
    setSelectedLessee(lessee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLessee(null);
    setIsModalOpen(false);
  };

  // Filter lessees based on search query and archive status
  const filteredLessees = lessees
    .filter((lessee) => lessee.is_archived === showArchived)
    .filter(
      (lessee) =>
        lessee.id.includes(searchQuery) ||
        lessee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lessee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Paginate filtered results
  const totalItems = filteredLessees.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLessees = filteredLessees.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Users Management / Lessee
      </h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="bg-sky-900 hover:bg-sky-950 text-white px-4 py-2 rounded-md"
        >
          {showArchived ? "Show Active Lessees" : "Show Archived Lessees"}
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
              <th className="px-4 py-2 border-b text-left">ID Verified</th>
              <th className="px-4 py-2 border-b text-left">Created At</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLessees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No lessees found.
                </td>
              </tr>
            ) : (
              paginatedLessees.map((lessee) => (
                <tr key={lessee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    <Image
                      src={
                        lessee.image ? lessee.image : "/images/placeholder.jpg"
                      }
                      alt={lessee.name}
                      className="rounded-full"
                      width={48} // Adjust width as needed
                      height={48} // Adjust height as needed
                      priority={true} // Ensure quick loading
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{lessee.id}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">
                    {lessee.name}
                  </td>
                  <td className="px-4 py-2 border-b">{lessee.email}</td>
                  <td className="px-4 py-2 border-b whitespace-nowrap">
                    {lessee.idStatus
                      ? lessee.idStatus
                          .toLowerCase() // Convert all to lowercase
                          .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
                      : ""}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {new Date(lessee.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <ActionButton
                      itemId={lessee.id}
                      actions={
                        showArchived
                          ? [
                              {
                                label: "Unarchive",
                                onClick: unarchiveLessee,
                              },
                            ]
                          : [
                              {
                                label: "View",
                                onClick: () => openModal(lessee), // Open modal when View is clicked
                              },
                              {
                                label: "Archive",
                                onClick: archiveLessee,
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
          setCurrentPage(1); // Reset to first page when items per page change
        }}
      />

      {/* Lessee Details Modal */}
      <LesseeDetailsModal
        isOpen={isModalOpen}
        lessee={selectedLessee}
        onClose={closeModal}
      />
    </div>
  );
};

export default LesseeList;
