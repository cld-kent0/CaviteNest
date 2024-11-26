"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ClientLayout from "../client-layout";

const PrivacyPolicy: React.FC = () => {
  const router = useRouter();

  return (
    <ClientLayout>
      <div className="max-w-3xl mx-auto text-justify py-16">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Effective Date: October 22, 2024</p>

        <p className="mt-4">
          At CaviteNest, we are committed to protecting your privacy. This
          Privacy Policy outlines how we collect, use, and protect your
          information when you use our rental and booking platform.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p>
          We may collect personal information such as your name, email address,
          phone number, and payment information when you register and use our
          services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <p>We use your information to:</p>
        <ul className="list-disc list-inside ml-6">
          <li>Provide and manage our services.</li>
          <li>Communicate with you regarding your bookings.</li>
          <li>Improve our platform and services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information
          from unauthorized access, use, or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          4. Sharing Your Information
        </h2>
        <p>
          We do not sell or rent your personal information to third parties. We
          may share your information with trusted partners to facilitate our
          services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information. You may also have the right to withdraw consent to
          processing your data.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          6. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at cavitenest@gmail.com.
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

export default PrivacyPolicy;
