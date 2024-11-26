"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ClientLayout from "../client-layout";

const TermsAndConditions: React.FC = () => {
  const router = useRouter();

  return (
    <ClientLayout>
      <div className="max-w-3xl mx-auto text-justify py-16">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-gray-500">Effective Date: October 22, 2024</p>
        <p className="mt-4">
          Welcome to CaviteNest. By accessing or using our platform for rental
          and booking services, you agree to comply with and be bound by the
          following terms and conditions. Please read them carefully.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using our services, you acknowledge that you have
          read, understood, and agree to be bound by these Terms and Conditions.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          2. Changes to Terms
        </h2>
        <p>
          We reserve the right to modify these Terms and Conditions at any time.
          Any changes will be effective immediately upon posting the revised
          terms on our website. Your continued use of our services after any
          changes indicates your acceptance of the new terms.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          3. User Responsibilities
        </h2>
        <p>
          Users are responsible for maintaining the confidentiality of their
          account information and for all activities that occur under their
          account.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          4. Limitation of Liability
        </h2>
        <p>
          CaviteNest shall not be liable for any direct, indirect, incidental,
          special, consequential, or punitive damages arising out of or relating
          to your use of our services.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the
          laws of the Philippines.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Privacy Policy</h2>
        <p>
          Please refer to our <a href="/privacy-policy">Privacy Policy</a> for
          information on how we collect, use, and protect your information.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          7. Contact Information
        </h2>
        <p>
          If you have any questions about these Terms and Conditions, please
          contact us at cavitenest@gmail.com.
        </p>
        <button
          onClick={() => router.back()} // Go back to the previous page
          className="text-blue-600 hover:underline mt-10 -mb-11"
        >
          Back
        </button>
      </div>
    </ClientLayout>
  );
};

export default TermsAndConditions;
