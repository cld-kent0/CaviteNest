"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { useSession } from "next-auth/react"; // Import next-auth session hook
import optionImage from "@/public/images/option.jpg"; // Import the background image
import useLoginModal from "@/app/hooks/useLoginModal"; // Import necessary hooks
import useRentModal from "@/app/hooks/useRentModal"; // Import necessary hooks
import useGetVerifiedModal from "@/app/hooks/useGetVerifiedModal"; // Import GetVerified modal hook

const OptionSection: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const loginModal = useLoginModal(); // Initialize login modal
  const rentModal = useRentModal(); // Initialize rent modal
  const getVerifiedModal = useGetVerifiedModal(); // Initialize GetVerified modal

  const { data: session } = useSession(); // Get session data using next-auth

  const handleFindPropertyClick = () => {
    router.push("/browse"); // Navigate to the browse page
  };

  const onRent = async () => {
    console.log("Session User Email:", session?.user?.email);

    if (!session) {
      loginModal.onOpen(); // Open login modal if no session exists
      return;
    }

    try {
      // Fetch the user verification status from the backend
      const response = await fetch("/api/check-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }), // Send the email from the session
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch verification status");
      }

      // Check the user's verification status
      if (data.idStatus === "verified") {
        rentModal.onOpen(); // Open Rent Modal if verified
      } else if (
        data.idStatus === "unverified" ||
        data.idStatus === "pending"
      ) {
        getVerifiedModal.onOpen(); // Open Get Verified Modal if unverified or pending
      } else {
        console.error("User status is not valid.");
      }
    } catch (error) {
      console.error(error);
      // Optionally handle error (e.g., show a toast message)
    }
  };

  return (
    <div className="relative mt-28 mb-28 flex flex-col md:flex-row justify-center items-center p-4">
      {/* Background image container with shadow effect */}
      <div className="absolute inset-0 z-0 flex justify-center items-center">
        <div
          className="bg-center bg-no-repeat w-full h-[700px] md:h-[120%] bg-cover shadow-lg"
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
          Renting a property offers flexibility and reduces the responsibilities
          of homeownership, making it an attractive option for those seeking
          convenience.
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
          Listing a property for rent online provides a convenient platform to
          reach potential tenants, simplify the rental process, and efficiently
          manage inquiries and bookings.
        </p>

        <button
          onClick={onRent} // Use onRent to handle verification and open modals
          className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 text-sm md:text-base"
        >
          List a property
        </button>
      </div>
    </div>
  );
};

export default OptionSection;
