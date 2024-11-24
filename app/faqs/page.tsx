"use client";

import { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { BiSolidMessageRoundedCheck } from "react-icons/bi";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How to book a CaviteNest property?",
      answer: (
        <>
          Bookings can only be made through this link:{" "}
          <a
            href="https://cavite-nest.vercel.app"
            className="text-green-600 underline hover:text-green-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://cavite-nest.vercel.app
          </a>
          .
        </>
      ),
    },
    {
      question:
        "What payment methods are available to complete a booking transaction?",
      answer: (
        <>
          CaviteNest, as a platform for rental properties, does not handle or
          process payments directly between lessees and lessors. All payment
          arrangements for property rentals should be made directly between both
          parties.
        </>
      ),
    },
    {
      question: "Where can I find the property address?",
      answer: (
        <>
          On the listing page, the property address is displayed below the
          property image. In the property view section, however, it appears
          above the property image.
        </>
      ),
    },
    {
      question: "What should I prepare for check-in?",
      answer: (
        <>
          Please prepare the following for a smooth check-in process:
          <ul className="list-disc ml-6 mt-2">
            <li>
              Sufficient funds to cover any deposits or fees required at
              check-in.
            </li>
            <li>A night deposit if applicable to the specific property.</li>
            <li>
              Review each property&apos;s individual policies, which are
              available on our website when inquiring about the property.
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "What is the maximum capacity per room?",
      answer: (
        <>
          The maximum occupancy per room varies by property. If you wish to
          bring additional guests, please contact the lessor to make
          arrangements.
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-96"
        style={{ backgroundImage: `url('/images/book.jpg')` }}
      >
        <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
          <h2 className="flex items-center justify-center text-3xl md:text-5xl font-bold text-white text-center">
            Your Questions? Answered
            <BiSolidMessageRoundedCheck className="ml-1 mb-12 text-emerald-600" />
          </h2>
        </div>
      </section>

      {/* FAQ Section */}
      <div id="faqs" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="flex text-center justify-center text-4xl font-bold text-gray-800 mb-8">
          <FaQuestionCircle className="mr-4" />
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Find answers to your most common questions about booking, payments,
          and more.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <button
                className={`w-full text-left bg-gray-100 text-gray-800 px-6 py-4 font-medium focus:outline-none flex justify-between items-center ${
                  activeIndex === index
                    ? "rounded-t-lg rounded-b-none"
                    : "rounded-lg"
                }`}
                onClick={() => toggleDropdown(index)}
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform ${
                    activeIndex === index ? "rotate-180" : ""
                  } transition-transform duration-300`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeIndex === index && (
                <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg text-justify">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add more space after the final question */}
        <div className="mt-10"></div>
      </div>

      <footer id="contact" className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 pt-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center justify-center">
            {/* Telephone Icon from React Icons */}
            <FaPhoneAlt size={12} className="w-6 h-6 text-white mr-3" />
            Contact Us
          </h3>
          <p className="text-gray-400 mb-12">
            Have more questions? Reach out to us via email at{" "}
            <span className="text-blue-400 underline">
              cavitenest.platform2024@gmail.com
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
