'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    // Confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to change your password?");
    if (!isConfirmed) return;

    // Call the API to change the password
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-md rounded-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>

      {/* Old Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Old Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword.old ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input-field w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:border-emerald-500"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            onClick={() => setShowPassword((prev) => ({ ...prev, old: !prev.old }))}
          >
            {showPassword.old ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword.new ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:border-emerald-500"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
          >
            {showPassword.new ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword.confirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:border-emerald-500"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
          >
            {showPassword.confirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {/* Submit Button */}
      <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 focus:outline-none focus:bg-emerald-700">
        Change Password
      </button>
    </form>
  );
};

export default ChangePassword;
