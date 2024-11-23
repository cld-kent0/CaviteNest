"use client";

import { useState } from "react";
import Image from "next/image";

export default function SupportCenter() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0); // State to track the selected rating

  const handleRatingClick = (index: number) => {
    setRating(index + 1); // index is zero-based, so we add 1
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <hr className="w-[100px] h-[8px] bg-emerald-800 rounded ml-[60px] mt-16 mb-6" />
      <h2 className="text-5xl font-bold ml-[50px] mb-16">Support Center</h2>

      {/* Header Section */}
      <div className="text-center mb-36">
        <p className="text-4xl font-medium text-gray-600 mb-12">
          Hi, User! How can we help?
        </p>
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your inquiry"
              className="w-full p-4 rounded-full shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* FAQs and Report an Issue Section */}
      <div className="flex justify-center items-center mb-28">
        <div
          className="flex w-full max-w-7xl shadow-lg rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url('/images/option.jpg')`,
            backgroundSize: "cover",
            height: "500px", // Adjust the height here
          }}
        >
          {/* FAQ Section */}
          <div className="w-1/2 p-8 flex flex-col items-center justify-center bg-opacity-70">
            <Image
              src="/images/ask.png"
              alt="Error Icon"
              width={50}
              height={50}
              className="mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">FAQs</h2>
            <p className="text-gray-600 text-center mb-6">
              Find answers to the most common questions you may have.
            </p>
            <button className="bg-emerald-800 text-white px-6 py-2 rounded-full">
              Ask now
            </button>
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-300"></div>

          {/* Report an Issue Section */}
          <div className="w-1/2 p-8 flex flex-col items-center justify-center bg-opacity-70">
            <Image
              src="/images/error.png"
              alt="Error Icon"
              width={50}
              height={50}
              className="mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Report an Issue
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We will start with some questions to get you to the right place.
            </p>
            <button className="bg-emerald-800 text-white px-6 py-2 rounded-full">
              Reach out to us
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="text-center mb-12">
        <hr className="w-[100px] h-[5px] bg-emerald-800 rounded mx-auto my-4" />
        <h2 className="text-4xl font-bold mb-6">Send us your feedback!</h2>
        <p className="text-gray-600 mb-6">How did we do? Rate us!</p>

        {/* Star Rating */}
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-10 h-10 cursor-pointer ${
                index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
              onClick={() => handleRatingClick(index)}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>

        {/* Feedback form */}
        <div className="max-w-lg mx-auto">
          <textarea
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-800 mb-4"
            placeholder="Write your feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button className="bg-emerald-800 text-white px-6 py-2 rounded-full">
            Publish Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
