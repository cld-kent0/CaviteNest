"use client";

import React, { useRef, useState } from "react";
import Modal from "./Modal"; // Adjust the import path as necessary

const PrivacyPolicyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}> = ({ isOpen, onClose, onAgree }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setCanProceed(true);
      } else {
        setCanProceed(false);
      }
    }
  };

  const privacyPolicyContent = (
    <div>
      <h1 className="text-xl font-bold mb-2">Privacy Policy</h1>
      <p className="mb-4">Effective Date: October 22, 2024</p>
      <p>
        At CaviteNest, we are committed to protecting your privacy. This Privacy
        Policy outlines how we collect, use, and protect your information when
        you use our rental and booking platform.
      </p>

      <h2 className="font-semibold mt-4">1. Information We Collect</h2>
      <p>
        We may collect personal information such as your name, email address,
        phone number, and payment information when you register and use our
        services.
      </p>

      <h2 className="font-semibold mt-4">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc list-inside ml-6">
        <li>Provide and manage our services.</li>
        <li>Communicate with you regarding your bookings.</li>
        <li>Improve our platform and services.</li>
      </ul>

      <h2 className="font-semibold mt-4">3. Data Security</h2>
      <p>
        We implement reasonable security measures to protect your information
        from unauthorized access, use, or disclosure.
      </p>

      <h2 className="font-semibold mt-4">4. Sharing Your Information</h2>
      <p>
        We do not sell or rent your personal information to third parties. We
        may share your information with trusted partners to facilitate our
        services.
      </p>

      <h2 className="font-semibold mt-4">5. Your Rights</h2>
      <p>
        You have the right to access, update, or delete your personal
        information. You may also have the right to withdraw consent to
        processing your data.
      </p>

      <h2 className="font-semibold mt-4">6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy on this page.
      </p>

      <h2 className="font-semibold mt-4">7. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at cavitenest@gmail.com.
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      title="Privacy Policy"
      actionLabel={
        canProceed ? "Agree to Privacy Policy" : "Please Scroll to Read"
      }
      onClose={onClose}
      onSubmit={() => {
        if (canProceed) {
          onAgree();
          onClose();
        }
      }}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-96 overflow-y-auto px-4 py-2"
        aria-live="polite" // Announce changes for screen readers
        role="document"
      >
        {privacyPolicyContent}
      </div>
    </Modal>
  );
};

export default PrivacyPolicyModal;
