'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SearchInput from '../../components/SearchInput';
import ActionButton from '../../components/ActionButton';
import Pagination from '../../components/Pagination';

interface Property {
  id: string;
  title: string;
  category: string;
  locationValue: string;
  is_archived: boolean;
}

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    axios.get('/api/admin/property')
      .then(response => setProperties(response.data))
      .catch(error => console.error('Error fetching properties:', error));
  };

  const archiveProperty = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to archive this property?");
    if (confirmed) {
      axios.post(`/api/admin/archiving/archive`, { id, type: 'listing' })
        .then(() => fetchProperties())
        .catch(error => console.error('Error archiving property:', error));
    }
  };

  const unarchiveProperty = (id: string) => {
    axios.post(`/api/admin/archiving/unarchive`, { id, type: 'listing' })
      .then(() => fetchProperties())
      .catch(error => console.error('Error unarchiving property:', error));
  };

  const filteredProperties = properties
    .filter(property => property.is_archived === showArchived)
    .filter(property => 
      property.id.includes(searchQuery) ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.locationValue.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalItems = filteredProperties.length;
  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page whenever items per page changes
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Property Management / Property Listings</h2>
      <div className="flex justify-between mb-4">
        <button 
          onClick={() => setShowArchived(!showArchived)} 
          className="bg-sky-900 hover:bg-sky-950 text-white px-4 py-2 rounded-md"
        >
          {showArchived ? 'Show Active Properties' : 'Show Archived Properties'}
        </button>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div className=" bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Title</th>
              <th className="px-4 py-2 border-b text-left">Category</th>
              <th className="px-4 py-2 border-b text-left">Location</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProperties.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">No properties found.</td>
              </tr>
            ) : (
              currentProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{property.id}</td>
                  <td className="px-4 py-2 border-b">{property.title}</td>
                  <td className="px-4 py-2 border-b">{property.category}</td>
                  <td className="px-4 py-2 border-b">{property.locationValue}</td>
                  <td className="px-4 py-2 border-b">
                    <ActionButton
                      itemId={property.id}
                      actions={
                        showArchived
                          ? [
                              {
                                label: 'Unarchive',
                                onClick: unarchiveProperty,
                              },
                            ]
                          : [
                              {
                                label: 'Archive',
                                onClick: archiveProperty,
                              },
                              {
                                label: 'View',
                                onClick: () => router.push(`/admin/property/${property.id}`),
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

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default PropertyList;
