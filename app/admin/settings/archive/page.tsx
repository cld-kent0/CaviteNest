'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchInput from '../../components/SearchInput';
import ActionButton from '../../components/ActionButton';
import Pagination from '../../components/Pagination';

interface Listing {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
  category: string;
  is_archived: boolean;
  type: 'listing';
}

interface User {
  id: string;
  name: string;
  email: string;
  is_archived: boolean;
  type: 'lessor' | 'lessee';
}

type ArchiveItem = Listing | User;

const ArchivePage = () => {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [showArchived, setShowArchived] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchArchiveItems();
  }, []);

  const fetchArchiveItems = () => {
    axios
      .all([
        axios.get('/api/admin/property'),
        axios.get('/api/admin/users/lessors'),
        axios.get('/api/admin/users/lessees'),
      ])
      .then(
        axios.spread((listingsRes, lessorsRes, lesseesRes) => {
          const listings: Listing[] = listingsRes.data.map((item: Listing) => ({
            ...item,
            type: 'listing',
          }));
          const lessors: User[] = lessorsRes.data.map((item: User) => ({
            ...item,
            type: 'lessor',
          }));
          const lessees: User[] = lesseesRes.data.map((item: User) => ({
            ...item,
            type: 'lessee',
          }));
          setItems([...listings, ...lessors, ...lessees]);
        })
      )
      .catch((error) => console.error('Error fetching archived items:', error));
  };

  const handleUnarchive = async (type: string, id: string) => {
    try {
      const response = await axios.put('/api/admin/archiving/unarchive', {
        type,
        id,
      });
      console.log('Unarchive success:', response.data);
      fetchArchiveItems(); // Refresh the list after unarchiving
    } catch (error) {
      console.error('Error performing unarchive action:', error);
    }
  };

  const handleAction = async (action: 'archive' | 'unarchive' | 'delete', item: ArchiveItem) => {
    const confirmed = window.confirm(
      action === 'unarchive'
        ? 'Are you sure you want to unarchive this item?'
        : action === 'delete'
        ? 'Are you sure you want to delete this item? This action cannot be undone.'
        : 'Are you sure you want to archive this item?'
    );
    if (!confirmed) return;

    try {
      if (action === 'unarchive') {
        await handleUnarchive(item.type, item.id);
      } else {
        const endpoint = `/api/admin/archiving/${action}`;
        await axios.post(endpoint, { id: item.id, type: item.type });
        fetchArchiveItems(); // Refresh the list after performing the action
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  // Filter items based on search query and archive state
  const filteredItems = items
    .filter((item) => item.is_archived === showArchived)
    .filter(
      (item) =>
        item.id.includes(searchQuery) ||
        ('name' in item && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('title' in item && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('email' in item && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Paginate filtered results
  const totalItems = filteredItems.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings / Archive History</h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="bg-sky-900 hover:bg-sky-950 text-white px-4 py-2 rounded-md"
        >
          {showArchived ? 'Show Active Items' : 'Show Archived Items'}
        </button>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div className=" bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Type</th>
              <th className="px-4 py-2 border-b text-left">Title/Name</th>
              <th className="px-4 py-2 border-b text-left">Email/User ID</th>
              <th className="px-4 py-2 border-b text-left">Category</th>
              <th className="px-4 py-2 border-b text-left">Created At</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No items found.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{item.id}</td>
                  <td className="px-4 py-2 border-b">{item.type}</td>
                  <td className="px-4 py-2 border-b">{'title' in item ? item.title : item.name}</td>
                  <td className="px-4 py-2 border-b">{'email' in item ? item.email : item.userId}</td>
                  <td className="px-4 py-2 border-b">{'category' in item ? item.category : '-'}</td>
                  <td className="px-4 py-2 border-b">{'createdAt' in item ? item.createdAt : '-'}</td>
                  <td className="px-4 py-2 border-b">
                    <ActionButton
                      itemId={item.id}
                      actions={[ 
                        {
                          label: showArchived ? 'Unarchive' : 'Archive',
                          onClick: () => handleAction(showArchived ? 'unarchive' : 'archive', item),
                        },
                        ...(showArchived
                          ? [
                              {
                                label: 'Delete',
                                onClick: () => handleAction('delete', item),
                              },
                            ]
                          : []),
                      ]}
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
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default ArchivePage;
