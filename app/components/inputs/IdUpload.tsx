"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

interface IdUploadProps {
  onChange: (imageType: "front" | "back", url: string) => void; // Callback to handle image upload for front/back
  value: { front: string | null; back: string | null }; // Value represents idFront and idBack (nullable)
}

const IdUpload: React.FC<IdUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: any, imageType: "front" | "back") => {
      onChange(imageType, result.info.secure_url); // Update only the relevant image field (front/back)
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Front Image Upload */}
      <CldUploadWidget
        onSuccess={(result) => handleUpload(result, "front")}
        uploadPreset="CaviteNest"
        options={{ maxFiles: 1 }}
      >
        {({ open }) => (
          <div
            onClick={() => open()}
            className="relative flex flex-col items-center justify-center gap-4 p-10 transition border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600"
          > 
            <TbPhotoPlus size={50} />
            <div className="text-lg font-semibold">Upload Front Image</div>
            {value.front ? (
              <div className="relative w-full h-64">
                <Image
                  alt="Front Image"
                  src={value.front}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ) : (
              <div className="text-sm text-neutral-500 mt-2">No front image uploaded</div>
            )}
          </div>
        )}
      </CldUploadWidget>

      {/* Back Image Upload */}
      <CldUploadWidget
        onSuccess={(result) => handleUpload(result, "back")}
        uploadPreset="fsvzne6s"
        options={{ maxFiles: 1 }}
      >
        {({ open }) => (
          <div
            onClick={() => open()}
            className="relative flex flex-col items-center justify-center gap-4 p-10 transition border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="text-lg font-semibold">Upload Back Image</div>
            {value.back ? (
              <div className="relative w-full h-64">
                <Image
                  alt="Back Image"
                  src={value.back}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ) : (
              <div className="text-sm text-neutral-500 mt-2">No back image uploaded</div>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default IdUpload;
