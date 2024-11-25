import { useState } from "react";
import Image from "next/image";

interface RentImageUploadProps {
  images: string[]; // Receive the current image list from the parent
  onImageUpload: (updatedImages: string[]) => void; // Callback to update the parent state
}

const RentImageUpload: React.FC<RentImageUploadProps> = ({
  images,
  onImageUpload,
}) => {
  const [uploading, setUploading] = useState<boolean>(false);

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

    // Update parent state with the new images
    onImageUpload([...images, ...uploadedUrls]);

    setUploading(false);
  };

  // Function to remove an image
  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImageUpload(updatedImages); // Update parent state with the updated image list
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
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "150px",
              height: "150px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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

export default RentImageUpload;
