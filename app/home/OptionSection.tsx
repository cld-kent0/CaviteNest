"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import optionImage from "@/public/images/option.jpg"; // Import the background image
import useLoginModal from "@/app/hooks/useLoginModal"; // Import necessary hooks
import useRentModal from "@/app/hooks/useRentModal"; // Import necessary hooks
import { SafeUser } from "@/app/types"; // Import SafeUser type

interface OptionSectionProps {
  currentUser?: SafeUser | null; // Define the type for currentUser
}

const OptionSection: React.FC<OptionSectionProps> = ({ currentUser }) => {
  const router = useRouter(); // Initialize the router
  const loginModal = useLoginModal(); // Initialize login modal
  const rentModal = useRentModal(); // Initialize rent modal

  const handleFindPropertyClick = () => {
    router.push("/"); // Navigate to the home page
  };

  const onRent = () => {
    if (!currentUser) {
      loginModal.onOpen(); // Open login modal if user is not logged in
    } else {
      rentModal.onOpen(); // Open rent modal if user is logged in
    }
  };

  return (
    <div className="relative mt-28 mb-28 flex flex-col md:flex-row justify-center items-center p-4 rounded-lg">
      {/* Background image container */}
      <div className="absolute inset-0 z-0 flex justify-center items-center">
        <div
          className="bg-center bg-no-repeat w-full h-[700px] md:h-[120%] bg-cover"
          style={{
            backgroundImage: `url(${optionImage.src})`,
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center md:max-w-md md:mr-4 p-4 mb-8">
        <div className="relative">
          <Image
            src="/images/square.png"
            alt="Square Background"
            width={100}
            height={100}
            className="w-[80px] md:w-[100px]"
          />
          <Image
            src="/images/key.png"
            alt="Key Icon"
            width={40}
            height={40}
            className="absolute inset-0 m-auto"
          />
        </div>
        <h3 className="text-xl font-bold mt-4 text-center">Rent a property</h3>
        <p className="text-center text-gray-600 my-2 text-sm md:text-base">
          Renting a property presents a convenient option by affording
          flexibility and alleviating the obligations associated with ownership.
        </p>
        <button
          onClick={handleFindPropertyClick} // Use onClick to handle navigation
          className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-800 text-sm md:text-base"
        >
          Find a property
        </button>
      </div>

      {/* Vertical separator line */}
      <div className="hidden md:block z-10 h-5 w-px bg-gray-300 mx-8"></div>

      {/* Become a Host */}
      <div className="relative z-10 flex flex-col items-center md:max-w-lg md:ml-4 p-4 mb-8">
        <div className="relative">
          <Image
            src="/images/square.png"
            alt="Square Background"
            width={100}
            height={100}
            className="w-[80px] md:w-[100px]"
          />
          <Image
            src="/images/home.png"
            alt="House Icon"
            width={40}
            height={40}
            className="absolute inset-0 m-auto"
          />
        </div>
        <h3 className="text-xl font-bold mt-4 text-center">Become a Host</h3>
        <p className="text-center text-gray-600 my-2 text-sm md:text-base">
          Listing a property for rent on a website offers convenience by
          providing a platform to reach potential tenants, streamline the rental
          process, and manage inquiries and bookings efficiently.
        </p>
        <button
          onClick={onRent} // Use onRent to handle navigation
          className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 text-sm md:text-base"
        >
          List a property
        </button>
      </div>
    </div>
  );
};

export default OptionSection;
