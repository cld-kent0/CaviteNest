import React from 'react';

interface ArchiveButtonProps {
  type: 'listing' | 'lessor' | 'lessee';
  id: string;
  action: 'archive' | 'unarchive' | 'delete'; // Action can be archive, unarchive, or delete
  onActionSuccess: () => void; // Callback for success
}

const ArchiveButton: React.FC<ArchiveButtonProps> = ({ type, id, action, onActionSuccess }) => {
  const handleAction = async () => {
    const confirmMessage =
      action === 'unarchive'
        ? 'Are you sure you want to unarchive this item?'
        : action === 'delete'
        ? 'Are you sure you want to delete this item? This action cannot be undone.'
        : 'Are you sure you want to archive this item?';

    // Show confirmation dialog
    const isConfirmed = window.confirm(confirmMessage);
    if (!isConfirmed) return;

    let method: string;
    let endpoint: string;

    if (action === 'archive') {
      method = 'POST';
      endpoint = '/api/admin/archiving/archive';
    } else if (action === 'unarchive') {
      method = 'PUT';
      endpoint = '/api/admin/archiving/unarchive';
    } else if (action === 'delete') {
      method = 'DELETE';
      endpoint = '/api/admin/archiving/delete';
    } else {
      throw new Error('Invalid action');
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        onActionSuccess(); // Trigger success callback
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <button
      onClick={handleAction}
      className={`p-2 rounded ${action === 'archive' ? 'bg-red-500' : action === 'unarchive' ? 'bg-emerald-700' : 'bg-gray-500'}`}
    >
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </button>
  );
};

export default ArchiveButton;
