import ImageUpload from '@/app/components/inputs/ImageUpload';
import { FC, useState } from 'react';

interface EditQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeId?: number; // Optional: If updating an existing QR code, pass the ID
}

const EditQRCodeModal: FC<EditQRCodeModalProps> = ({ isOpen, onClose, qrCodeId }) => {
  const [qrCodeData, setQrCodeData] = useState<string>(''); // QR Code Data state
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(''); // Uploaded QR Code Image state
  const [accountNumber, setAccountNumber] = useState<string>(''); // Account number state
  const [accountName, setAccountName] = useState<string>(''); // Account name state
  const [isSaving, setIsSaving] = useState<boolean>(false); // Saving state
  const [step, setStep] = useState<number>(1); // Step tracker state (1 for input, 2 for image upload)

  const [errors, setErrors] = useState({
    qrCodeData: '',
    accountNumber: '',
    accountName: ''
  });

  const handleSave = async () => {
    // Basic validation
    if (!qrCodeData || !accountNumber || !accountName || !qrCodeImage) {
      setErrors({
        qrCodeData: qrCodeData ? '' : 'QR Code Data is required.',
        accountNumber: accountNumber ? '' : 'Account Number is required.',
        accountName: accountName ? '' : 'Account Name is required.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/subscriptions/payments/qrcode/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCodeData,
          qrCodeImage,
          accountNumber,
          accountName,
          id: qrCodeId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save QR Code');
      }

      const data = await response.json();
      alert('QR Code saved successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error saving QR Code');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit QR Code</h2>

        {step === 1 && (
          <div>
            {/* Step 1: Input for QR Code Data, Account Number, and Account Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">QR Code Data</label>
              <textarea
                value={qrCodeData}
                onChange={(e) => setQrCodeData(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter the data for the QR code"
              />
              {errors.qrCodeData && (
                <p className="text-sm text-red-500 mt-1">{errors.qrCodeData}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter the account number"
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Enter the account name"
              />
              {errors.accountName && (
                <p className="text-sm text-red-500 mt-1">{errors.accountName}</p>
              )}
            </div>

            {/* Action buttons for Step 1 */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)} // Move to Step 2
                disabled={!qrCodeData || !accountNumber || !accountName} // Disable button if fields are not filled
                className="bg-sky-900 hover:bg-sky-950 text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Step 2: Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload QR Code Image</label>
              <ImageUpload
                onChange={(url) => setQrCodeImage(url)} // Set the uploaded image URL
                value={qrCodeImage || ""}
              />
              {qrCodeImage && (
                <p className="mt-2 text-sm text-green-500">
                  Uploaded Image: {qrCodeImage}
                </p>
              )}
              {!qrCodeImage && (
                <p className="text-sm text-red-500 mt-1">QR Code Image is required.</p>
              )}
            </div>

            {/* Action buttons for Step 2 */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setStep(1)} // Go back to Step 1
                className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !qrCodeImage} // Disable button if saving or no image
                className="bg-sky-900 hover:bg-sky-950 text-white px-4 py-2 rounded-md"
              >
                {isSaving ? 'Saving...' : 'Save QR Code'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditQRCodeModal;
