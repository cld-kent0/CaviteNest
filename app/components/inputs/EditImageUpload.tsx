import { useState, useEffect } from "react";
import Image from "next/image";

interface EditImageUploadProps {
  onImageUpload: (newImages: string[]) => void;
  currentImages: string[]; // Prop to receive current images
}

const EditImageUpload: React.FC<EditImageUploadProps> = ({
  onImageUpload,
  currentImages,
}) => {
  const [imageSrc, setImageSrc] = useState<string[]>(currentImages); // Initialize with currentImages
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setImageSrc(currentImages); // Update state if currentImages prop changes
  }, [currentImages]);

  // Function to handle image file upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "CaviteNest"); // Use your Cloudinary preset
    formData.append("cloud_name", "deokz2tnt"); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/deokz2tnt/image/upload`, // Replace with your Cloudinary URL
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  // Function to handle the image selection and upload
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploading(true);

    const files = Array.from(event.target.files || []);
    const uploadedUrls: string[] = [];

    // Upload each selected file to Cloudinary
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    // Update local state and send URLs to the parent component
    const newImageSrc = [...imageSrc, ...uploadedUrls];
    setImageSrc(newImageSrc);
    onImageUpload(newImageSrc);

    setUploading(false);
  };

  // Function to remove an image
  const handleRemoveImage = (index: number) => {
    const newImageSrc = [...imageSrc];
    newImageSrc.splice(index, 1); // Remove the image at the specified index
    setImageSrc(newImageSrc);
    onImageUpload(newImageSrc); // Update the parent with the updated list
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      {uploading && <p>Uploading images...</p>}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {imageSrc.map((src, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "150px",
              height: "150px",
              border: "2px solid #ccc", // Add border around each image
              borderRadius: "8px", // Optional: Add rounded corners for better aesthetics
              overflow: "hidden", // Ensure the image doesn't overflow the container
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add subtle shadow for depth
            }}
          >
            <Image
              src={src}
              alt={`Preview ${index}`}
              layout="fill"
              objectFit="cover"
            />
            {/* "X" Button */}
            <button
              onClick={() => handleRemoveImage(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditImageUpload;
