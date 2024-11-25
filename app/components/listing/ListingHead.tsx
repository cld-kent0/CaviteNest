"use client"; // Ensure client-side rendering

import { useState } from "react";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Image from "next/image";
import Heading from "../Heading";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
  title: string;
  imageSrc: string[];
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

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mainImage, setMainImage] = useState<string>(imageSrc[0]);

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % imageSrc.length;
    setCurrentIndex(nextIndex);
    setMainImage(imageSrc[nextIndex]);
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + imageSrc.length) % imageSrc.length;
    setCurrentIndex(prevIndex);
    setMainImage(imageSrc[prevIndex]);
  };

  const handleImageClick = (src: string, index: number) => {
    setCurrentIndex(index);
    setMainImage(src);
  };

  return (
    <>
      <Heading
        title={title}
        subTitle={
          location
            ? `${location.label}, ${location.region}`
            : "Location Not Available"
        }
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl shadow-lg shadow-gray-400 relative group image-container">
        <Image
          alt="image"
          src={mainImage}
          fill
          className="object-cover w-full h-full transition-all ease-in-out duration-500 rounded-xl shadow-2xl"
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>

        {/* Carousel Navigation Buttons (appear on hover only if more than one image) */}
        {imageSrc.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-5 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
            >
              &#8592;
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-5 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
            >
              &#8594;
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Preview (only if more than 1 image) */}
      {imageSrc.length > 1 && (
        <div className="mt-6 flex gap-4">
          {imageSrc.map((src, index) => (
            <div
              key={index}
              className={`relative w-24 h-24 cursor-pointer transition-all transform hover:scale-110 ${
                currentIndex === index
                  ? "border-4 border-emerald-600"
                  : "border-2 border-gray-400"
              } rounded-xl`}
              onClick={() => handleImageClick(src, index)}
            >
              <Image
                src={src}
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover rounded-md transition-all duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ListingHead;
