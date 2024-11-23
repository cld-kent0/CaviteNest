// app/reset-password/page.tsx
"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import ResetPasswordModal from "../components/modals/ResetPasswordModal"; // Adjust the path as necessary
import { useSearchParams } from "next/navigation"; // Use this for query parameters

const ResetPasswordPage = () => {
  const searchParams = useSearchParams(); // Get search parameters from the URL
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null); // State for the token

  // Show the modal if the token is present
  useEffect(() => {
    if (searchParams) {
      const tokenFromParams = searchParams.get("token");
      if (tokenFromParams) {
        setToken(tokenFromParams); // Set the token state
        setIsOpen(true); // Open modal if token exists
      }
    }
    
  }, [searchParams]);

  return (
    <>
      <h1>Reset Your Password</h1>
      {/* Render the ResetPasswordModal if the token is present */}
      {token && (
        <ResetPasswordModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)} // Close modal function
          token={token} // Pass the token to the modal
        />
      )}
    </>
  );
};

export default ResetPasswordPage;
