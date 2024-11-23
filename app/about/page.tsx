"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import toast from "react-hot-toast";

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
    router.push("/supportcenter"); // Navigate to the Support Center
  };

  return (
    <div>
      <hr className="md:w-[100px] md:h-[8px] w-[70px] h-[8px] bg-emerald-700 rounded ml-[35px] md:ml-[85px] mt-16 mb-6" />
      <h2 className="text-4xl md:text-5xl font-bold ml-[35px] md:ml-[85px] mb-9">
        About CaviteNest
      </h2>

      {/* Error message */}
      {error && <div className="text-red-600 text-lg mb-4">{error}</div>}

      {/* Hero Section */}
      <section className="relative h-[65vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImageSrc})`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-start items-start h-full text-left pl-[100px] pt-[120px]">
          <h1 className="text-7xl font-bold text-white">{heroTitle}</h1>
          <p className="mt-6 text-lg text-white">{heroDescription}</p>
        </div>
      </section>

      {/* WHAT IS CaviteNest? and WHAT does CaviteNest DO? Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* WHAT IS CaviteNest? */}
          <div className="mb-16 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-left">
              <Image
                src="/images/vision.png"
                alt="WHAT IS CaviteNest? Icon"
                width={50}
                height={50}
                className="mb-4"
              />
              <h2 className="text-3xl font-bold text-gray-900">
                WHAT IS CaviteNest?
              </h2>
              <p className="mt-4 mr-5 text-gray-600 text-center">{vision}</p>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-8 flex justify-center lg:justify-end">
              <Image
                src="/images/ourvision.png"
                alt="WHAT IS CaviteNest?"
                width={1000}
                height={400}
                className="w-full h-100 max-w-3xl object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* WHAT does CaviteNest DO? */}
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
                WHAT does CaviteNest DO?
              </h2>
              <p className="mt-4 ml-5 text-gray-600 text-center">{mission}</p>
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pr-8 flex justify-center lg:justify-start">
              <Image
                src="/images/ourmission.png"
                alt="WHAT does CaviteNest DO?"
                width={1000}
                height={400}
                className="w-full h-100 max-w-3xl object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-28 text-center">
            <h3 className="text-2xl font-bold text-gray-900">Need Support?</h3>
            <p className="mt-4 text-gray-600">
              If you have any questions or need assistance, feel free to visit
              our{" "}
              <button
                onClick={handleSupportClick}
                className="text-green-600 underline cursor-pointer"
              >
                Support Center
              </button>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
