'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
      await axios.put('/api/admin/archiving/unarchive', {
        type,
        id,
      });
      fetchArchiveItems(); // Refresh the list after unarchiving
      toast.success('Item successfully unarchived!');
    } catch (error) {
      console.error('Error performing unarchive action:', error);
      toast.error('Failed to unarchive the item.');
    }
  };

  const handleAction = async (action: 'archive' | 'unarchive' | 'delete', item: ArchiveItem) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center">
          <p className="text-gray-800">
            {action === 'unarchive'
              ? 'Unarchive this item?'
              : action === 'delete'
                ? 'Delete this item? This action cannot be undone.'
                : 'Archive this item?'}
          </p>
          <div className="flex justify-between gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  if (action === 'unarchive') {
                    await handleUnarchive(item.type, item.id);
                  } else {
                    const endpoint = `/api/admin/archiving/${action}`;
                    await axios.post(endpoint, { id: item.id, type: item.type });
                    fetchArchiveItems(); // Refresh the list after the action
                    toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
                  }
                } catch (error) {
                  console.error(`Error performing ${action} action:`, error);
                  toast.error(`Failed to ${action} the item.`);
                }
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
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
