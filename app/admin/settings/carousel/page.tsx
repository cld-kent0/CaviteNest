'use client';

import ImageUpload from "@/app/components/inputs/ImageUpload";
import { useEffect, useState } from "react";

const MAX_ITEMS = 6; // Maximum number of carousel items

const CarouselAdmin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>(""); // Holds URL
  const [carouselItems, setCarouselItems] = useState<any[]>([]); // Store carousel items
  const [isEditing, setIsEditing] = useState<boolean>(false); // Track editing state
  const [currentItemId, setCurrentItemId] = useState<string | null>(null); // Current item being edited
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Message for max items

  useEffect(() => {
    // Fetch existing carousel items from the database
    const fetchCarouselItems = async () => {
      const response = await fetch("/api/carousel");
      if (response.ok) {
        const data = await response.json();
        setCarouselItems(data);
      } else {
        console.error("Failed to fetch carousel items:", response.statusText);
      }
    };

    fetchCarouselItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the number of carousel items exceeds the limit
    if (carouselItems.length >= MAX_ITEMS && !isEditing) {
      setErrorMessage(`You can only upload a maximum of ${MAX_ITEMS} carousel items.`);
      return;
    }

    if (isEditing && currentItemId) {
      // Confirm before updating
      const confirmed = window.confirm("Are you sure you want to update this carousel item?");
      if (!confirmed) {
        return; // Exit if the user cancels
      }

      // Update an existing carousel item
      const response = await fetch(`/api/carousel/${currentItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, image }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setCarouselItems((prev) =>
          prev.map((item) => (item.id === currentItemId ? updatedItem : item))
        );
        resetForm();
      } else {
        console.error("Failed to update carousel item:", response.statusText);
      }
    } else {
      // Confirm before creating
      const confirmed = window.confirm("Are you sure you want to add this new carousel item?");
      if (!confirmed) {
        return; // Exit if the user cancels
      }

      // Create a new carousel item
      const response = await fetch("/api/carousel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, image }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setCarouselItems((prev) => [...prev, newItem]); // Add new item to the list
        resetForm();
      } else {
        console.error("Failed to add carousel item:", response.statusText);
      }
    }
  };

  const handleDelete = async (id: string) => {
    // Display a confirmation prompt to the user
    const confirmed = window.confirm("Are you sure you want to delete this carousel item?");

    if (!confirmed) {
      // If the user clicks "Cancel", do nothing
      return;
    }

    // If the user confirms, proceed with the delete action
    const response = await fetch(`/api/carousel/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the deleted item from the carouselItems state
      setCarouselItems((prev) => prev.filter((item) => item.id !== id));
      console.log(`Item ${id} deleted successfully.`);
    } else {
      console.error("Failed to delete item:", response.statusText);
    }
  };

  const handleEdit = (item: any) => {
    setTitle(item.title);
    setDescription(item.description);
    setImage(item.image);
    setIsEditing(true);
    setCurrentItemId(item.id);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setIsEditing(false);
    setCurrentItemId(null);
    setErrorMessage(null); // Clear error message
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings / Carousel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="border p-2 w-full"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="border p-2 w-full"
        />
        <ImageUpload onChange={setImage} value={image} />

        {/* Display title and description above the preview */}
        <h3 className="text-2xl font-semibold">Title: {title || "Your Title Here"}</h3>
        <p className="text-lg text-gray-600">Description: {description || "Your Description Here"}</p>

        {/* Preview of the uploaded image, title, and description */}
        {image && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold">Preview:</h3>

            {/* Hero Section Preview (similar to About Us) */}
            <section className="relative h-[50vh] mt-6 rounded-md overflow-hidden shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
              <div className="relative z-10 flex flex-col justify-center items-start h-full text-left p-8 bg-black bg-opacity-50">
                <h1 className="text-4xl font-bold text-white">
                  {title || "Your Carousel Title Here"}
                </h1>
                <p className="mt-4 text-lg text-white">
                  {description || "Your Carousel Description Here"}
                </p>
              </div>
            </section>
          </div>
        )}

        <div className="space-x-4">
          <button
            type="submit"
            className={`bg-emerald-800 text-white p-2 rounded ${carouselItems.length >= MAX_ITEMS && !isEditing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={carouselItems.length >= MAX_ITEMS && !isEditing}
          >
            {isEditing ? "Update Carousel Item" : "Add Carousel Item"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Display error message if max items exceeded */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>

      {/* Displaying existing carousel items */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Carousel Items</h2>
        <ul className="space-y-4">
          {carouselItems.map((item) => (
            <li key={item.id} className="border rounded-md shadow-lg overflow-hidden">
              <h3 className="font-semibold">{item.title}</h3>
              <p>{item.description}</p>
              {/* Hero Section Style for Each Item */}
              <section className="relative h-[50vh] rounded-md overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                />
                <div className="relative z-10 flex flex-col justify-center items-start h-full text-left p-8 bg-black bg-opacity-50">
                  <h1 className="text-4xl font-bold text-white">{item.title}</h1>
                  <p className="mt-4 text-lg text-white">{item.description}</p>
                </div>
              </section>

              {/* Buttons for Edit and Delete */}
              <div className="p-4 flex space-x-4">
                <button
                  className="bg-emerald-700 text-white p-2 rounded w-24"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded w-24"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarouselAdmin;
