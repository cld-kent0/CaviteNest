'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

function BackupRestoreComponent() {
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  // Handle Backup
  const handleBackup = async () => {
    setBackupStatus('Processing...');
    const response = await fetch('/api/admin/backup-restore/backup', { method: 'POST' });
    if (response.ok) {
      setBackupStatus('Backup created successfully!');
      toast.success('Backup created successfully!');
    } else {
      setBackupStatus('Backup failed!');
      toast.error('Backup failed!');
    }
  };

  // Handle Restore
  const handleRestore = async (file: File) => {
    setRestoreStatus('Processing...');
    const formData = new FormData();
    formData.append('backupFile', file);

    const response = await fetch('/api/admin/backup-restore/restore', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      setRestoreStatus('Database restored successfully!');
      toast.success('Database restored successfully!');
    } else {
      setRestoreStatus('Restore failed!');
      toast.error('Restore failed!');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings / Security</h2>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-6">Backup & Restore</h1>

          {/* Backup Section */}
          <div className="backup-section mb-6">
            <h2 className="text-xl font-medium mb-2">Backup</h2>
            <button
              onClick={handleBackup}
              className="w-full bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-600 transition duration-200"
            >
              Create Backup
            </button>
            {backupStatus && <p className="mt-2 text-center text-emerald-600">{backupStatus}</p>}
          </div>

          {/* Restore Section */}
          <div className="restore-section">
            <h2 className="text-xl font-medium mb-2">Restore</h2>
            <input
              type="file"
              onChange={(e) => e.target.files && handleRestore(e.target.files[0])}
              className="border border-gray-300 rounded-lg py-2 px-3 w-full mb-2"
            />
            {restoreStatus && <p className="mt-2 text-center text-emerald-600">{restoreStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackupRestoreComponent;
