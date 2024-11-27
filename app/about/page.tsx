"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import toast from "react-hot-toast";
import ClientLayout from "../client-layout";

const About = () => {
  const router = useRouter(); // Initialize the router
  const [vision, setVision] = useState<string>(""); // Default empty string if no value
  const [mission, setMission] = useState<string>(""); // Default empty string if no value
  const [heroImageSrc, setHeroImageSrc] = useState<string>(""); // Default empty string if no image URL
  const [heroTitle, setHeroTitle] = useState<string>(""); // Default empty string if no title
  const [heroDescription, setHeroDescription] = useState<string>(""); // Default empty string if no description
  const [error, setError] = useState<string>(""); // Error message state

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await axios.get("/api/about-us");
        const data = response.data;

        // Set values, fallback to defaults if values are missing
        setVision(data.vision || "Default vision content goes here.");
        setMission(data.mission || "Default mission content goes here.");
        setHeroImageSrc(data.heroImageSrc || "/images/default-hero-image.jpg"); // Default image if none exists
        setHeroTitle(data.heroTitle || "Default Hero Title");
        setHeroDescription(data.heroDescription || "Default Hero Description");
      } catch (error) {
        toast.error("Failed to load About Us. Please try again later.");
        console.error("Error fetching About Us data:", error);
      }
    };

    fetchAboutUs();
  }, []);

  const handleSupportClick = () => {
    router.push("/faqs"); // Navigate to the Support Center
  };

  return (
    <ClientLayout>
      <div>
        <hr className="md:w-[100px] md:h-[8px] w-[70px] h-[8px] bg-emerald-700 rounded ml-[35px] md:ml-[85px] mt-16 md:mt-24 mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold ml-[35px] md:ml-[85px] mb-9">
          About Us
        </h2>

        {/* Error message */}
        {error && <div className="text-red-600 text-lg mb-4">{error}</div>}

        {/* Hero Section */}
        <section className="relative h-[65vh]">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroImageSrc})`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-start items-start h-full p-[60px] md:p-[110px] pt-[80px] md:pt-[150px]">
            {/* Title */}
            <h1 className="text-2xl md:text-7xl font-bold text-white">
              {heroTitle}
            </h1>

            {/* Description */}
            <p
              className="mt-6 text-sm md:text-lg text-white text-justify"
              style={{ textIndent: "2em" }}
            >
              {heroDescription}
            </p>
          </div>
        </section>

        {/* WHAT IS & WHAT DO Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* WHAT IS CaviteNest? */}
            <div className="mb-16 flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-left">
                <Image
                  src="/images/vision.png"
                  alt="WHAT CaviteNest IS? Icon"
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h2 className="text-3xl font-bold text-gray-900">
                  WHAT CaviteNest IS?
                </h2>
                <div
                  className="mt-4 md:mr-4 text-gray-600 text-justify p-4"
                  style={{ textIndent: "2em" }}
                >
                  {vision}
                </div>
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-8 flex justify-center lg:justify-end">
                <Image
                  src="/images/ourvision.png"
                  alt="WHAT IS CaviteNest?"
                  width={1000}
                  height={400}
                  className="w-full h-100 max-w-3xl object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* WHAT CaviteNest DOES? */}
            <div className="flex flex-col items-center lg:flex-row-reverse">
              <div className="lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-right">
                <Image
                  src="/images/mission.png"
                  alt="WHAT does CaviteNest DO? Icon"
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h2 className="text-3xl font-bold text-gray-900">
                  WHAT CaviteNest DOES?
                </h2>
                <div
                  className="mt-4 md:ml-4 text-gray-600 text-justify p-4"
                  style={{ textIndent: "2em" }}
                >
                  {mission}
                </div>
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pr-8 flex justify-center lg:justify-start">
                <Image
                  src="/images/ourmission.png"
                  alt="WHAT does CaviteNest DO?"
                  width={1000}
                  height={400}
                  className="w-full h-100 max-w-3xl object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>

            <hr className="mt-20 -mb-9" />
            {/* Support Section */}
            <div className="mt-28 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Need help with your questions?
              </h3>
              <p className="mt-4 text-gray-600 px-4">
                If you have any questions or need support, feel free to visit
                our{" "}
                <button
                  onClick={handleSupportClick}
                  className="text-green-600 underline cursor-pointer"
                >
                  FAQs
                </button>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
};

export default About;
