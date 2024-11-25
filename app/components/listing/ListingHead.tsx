"use client"; // Ensure client-side rendering

import { useState } from "react";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Image from "next/image";
import Heading from "../Heading";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
  title: string;
  imageSrc: string[]; // Modify to accept an array of image sources
  locationValue: string;
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  id,
  imageSrc,
  title,
  locationValue,
  currentUser,
}) => {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);

  const [currentIndex, setCurrentIndex] = useState<number>(0); // Index of the current image
  const [mainImage, setMainImage] = useState<string>(imageSrc[0]); // Set the first image as the default

  // Function to go to the next image in the carousel
  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % imageSrc.length; // Loop back to the first image after the last
    setCurrentIndex(nextIndex);
    setMainImage(imageSrc[nextIndex]);
  };

  // Function to go to the previous image in the carousel
  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + imageSrc.length) % imageSrc.length; // Loop to the last image if we go backward from the first
    setCurrentIndex(prevIndex);
    setMainImage(imageSrc[prevIndex]);
  };

  // Function to handle clicking on a thumbnail to set as the main image
  const handleImageClick = (src: string, index: number) => {
    setCurrentIndex(index);
    setMainImage(src);
  };

  return (
    <>
      <Heading
        title={title}
        subTitle={`${location?.region}, ${location?.label}`}
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          alt="image"
          src={mainImage}
          fill
          className="object-cover w-full transition-all ease-in-out duration-500 rounded-xl shadow-lg"
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-5 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          &#8592;
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-5 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          &#8594;
        </button>
      </div>

      {/* Thumbnails Preview */}
      <div className="mt-6 flex gap-4 overflow-x-auto">
        {imageSrc.map((src, index) => (
          <div
            key={index}
            className={`relative w-24 h-24 cursor-pointer transition-all transform hover:scale-105 ${
              currentIndex === index
                ? "border-4 border-white"
                : "border-2 border-gray-300"
            } rounded-xl`}
            onClick={() => handleImageClick(src, index)}
          >
            <Image
              src={src}
              alt={`Thumbnail ${index}`}
              fill
              className="object-cover rounded-xl transition-all duration-300"
            />
            {/* Current Image Indicator (small white dot below active thumbnail) */}
            {currentIndex === index && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ListingHead;
