"use client";

import React, { useRef, useState } from "react";
import Modal from "./Modal"; // Adjust the import path as necessary
import Button from "../Button";

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

  const privacyPolicy = (
    <div>
      <h1 className="text-xl font-bold mb-2">Privacy Policy</h1>
      <p className="mb-4">Effective Date: October 22, 2024</p>
      <p>
        At CaviteNest, we value your privacy and are committed to protecting
        your personal information. This Privacy Policy outlines how we collect,
        use, and safeguard your data.
      </p>

      <h2 className="font-semibold mt-4">1. Information We Collect</h2>
      <p>
        We may collect personal information such as your name, email address,
        phone number, and payment details when you use our services.
      </p>

      <h2 className="font-semibold mt-4">2. How We Use Your Information</h2>
      <p>
        Your information is used to provide our services, process payments, and
        communicate with you regarding your bookings or inquiries.
      </p>

      <h2 className="font-semibold mt-4">3. Data Sharing</h2>
      <p>
        We do not sell or share your personal information with third parties,
        except as required to provide our services or comply with legal
        obligations.
      </p>

      <h2 className="font-semibold mt-4">4. Security</h2>
      <p>
        We implement industry-standard security measures to protect your
        information from unauthorized access, disclosure, or misuse.
      </p>

      <h2 className="font-semibold mt-4">5. Your Rights</h2>
      <p>
        You have the right to access, update, or delete your personal
        information. Please contact us if you wish to exercise these rights.
      </p>

      <h2 className="font-semibold mt-4">6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        effective upon posting the revised policy on our website.
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
      actionLabel={canProceed ? "Agree to Privacy Policy" : "Proceed"}
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
        className="max-h-96 overflow-y-auto"
      >
        {privacyPolicy}
      </div>
    </Modal>
  );
};

export default PrivacyPolicyModal;
