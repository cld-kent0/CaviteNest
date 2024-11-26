"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { FiHome, FiKey, FiInfo } from "react-icons/fi";
import { MdOutlineVilla } from "react-icons/md"; // New icons for Airbnb theme

const NavLinks = () => {
  const router = useRouter(); // Initialize useRouter

  const handlePropertiesClick = () => {
    router.push("/browse"); // Navigate to properties page on click
  };

  return (
    <div className="flex space-x-8 md:space-x-20">
      {/* Home Link */}
      <Link href="/" className="group flex flex-col items-center text-center">
        <FiHome className="text-xl md:text-2xl group-hover:text-emerald-600 transition duration-300 transform group-hover:scale-105" />
        <span className="text-[10px] md:text-xs mt-1 hidden sm:block group-hover:text-emerald-600 transition duration-300">
          Home
        </span>
      </Link>

      {/* Properties Link with onClick */}
      <div
        onClick={handlePropertiesClick} // Use onClick instead of href
        className="group flex flex-col items-center text-center cursor-pointer" // Add cursor-pointer to show it's clickable
      >
        <MdOutlineVilla className="text-xl md:text-2xl group-hover:text-emerald-600 transition duration-300 transform group-hover:scale-105" />
        <span className="text-[10px] md:text-xs mt-1 hidden sm:block group-hover:text-emerald-600 transition duration-300">
          Properties
        </span>
      </div>

      {/* About Link */}
      <Link
        href="/about"
        className="group flex flex-col items-center text-center"
      >
        <FiInfo className="text-xl md:text-2xl group-hover:text-emerald-600 transition duration-300 transform group-hover:scale-105" />
        <span className="text-[10px] md:text-xs mt-1 hidden sm:block group-hover:text-emerald-600 transition duration-300">
          About
        </span>
      </Link>
    </div>
  );
};

export default NavLinks;
