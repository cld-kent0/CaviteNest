import React from "react";
import Image from "next/image";

// Image constants
const backgroundImage = "/images/bg.png";
const iconImage1 = "/images/home.png";
const iconImage2 = "/images/message.png";
const iconImage3 = "/images/calendar.png";

const GetStarted = () => {
  return (
    <section className="relative py-12 md:py-16 bg-white my-8">
      {/* Background Image Container */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="relative w-full h-[900px] md:h-[600px]">
          <Image
            src={backgroundImage}
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="rounded-2xl shadow-lg"
            priority
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 md:p-20">
          <div className="mb-16">
            <hr className="w-[60px] h-[5px] bg-emerald-800 rounded mx-auto mb-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-black-800">
              Get Started
            </h2>
            <p className="text-gray-600 mt-2">
              Just a few steps to rent or book a property.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-4 w-20 h-20 md:w-24 md:h-24 bg-[#ece5d9] rounded-lg shadow-md">
                <Image
                  src={iconImage1}
                  alt="Find Property Icon"
                  layout="intrinsic"
                  width={48}
                  height={48}
                  quality={100}
                  className="absolute inset-0 m-auto"
                />
                <div className="absolute top-1 right-1 bg-white text-xs font-semibold text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow">
                  01
                </div>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">
                Find a Property
              </h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base px-8 md:px-0">
                Browse available properties and filter by your preferences for
                long-term rent or short-term bookings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-4 w-20 h-20 md:w-24 md:h-24 bg-[#ece5d9] rounded-lg shadow-md">
                <Image
                  src={iconImage2}
                  alt="Check Reviews Icon"
                  layout="intrinsic"
                  width={48}
                  height={48}
                  quality={100}
                  className="absolute inset-0 m-auto"
                />
                <div className="absolute top-1 right-1 bg-white text-xs font-semibold text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow">
                  02
                </div>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">
                Communicate with the Lessor
              </h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base px-8 md:p-0">
                Reach out to the property owner to inquire about availability or
                ask for more details on long-term rental or short-term
                reservations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4 w-20 h-20 md:w-24 md:h-24 bg-[#ece5d9] rounded-lg shadow-md">
                <Image
                  src={iconImage3}
                  alt="Acquire Icon"
                  layout="intrinsic"
                  width={48}
                  height={48}
                  quality={100}
                  className="absolute inset-0 m-auto"
                />
                <div className="absolute top-1 right-1 bg-white text-xs font-semibold text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow">
                  03
                </div>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">
                Book or Rent
              </h3>
              <p className="text-gray-600 mt-2 text-sm ssmd:text-base px-8 md:p-0">
                Secure your booking or finalize your rental with CaviteNest and
                get ready to move in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
