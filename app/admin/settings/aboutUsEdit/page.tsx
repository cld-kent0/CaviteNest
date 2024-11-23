'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import Image from 'next/image';
import ImageUpload from '@/app/components/inputs/ImageUpload';

const AboutUsEdit = () => {
  const { data: session } = useSession();
  const [vision, setVision] = useState<string>('');
  const [mission, setMission] = useState<string>('');
  const [heroImageSrc, setHeroImageSrc] = useState<string>('');
  const [heroTitle, setHeroTitle] = useState<string>('');
  const [heroDescription, setHeroDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await axios.get('/api/about-us');
        setVision(response.data.vision || ''); // Default to empty string if null
        setMission(response.data.mission || ''); // Default to empty string if null
        setHeroImageSrc(response.data.heroImageSrc || ''); // Default to empty string if null
        setHeroTitle(response.data.heroTitle || ''); // Default to empty string if null
        setHeroDescription(response.data.heroDescription || ''); // Default to empty string if null
      } catch (error) {
        setError('Failed to load About Us data. Please upload data');
        console.error('Error fetching About Us data:', error);
      }
    };

    fetchAboutUs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors before submitting
  
    // Confirm before proceeding with the update
    const isConfirmed = window.confirm('Are you sure you want to update the About Us content?');
    if (!isConfirmed) return;
  
    try {
      // Include heroImageSrc in the payload
      await axios.put('/api/about-us', { vision, mission, heroImageSrc, heroTitle, heroDescription });
      alert('About Us content updated successfully!');
    } catch (err) {
      setError('Failed to update About Us content');
      console.error('Error updating About Us content:', err);
    }
  };
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings / About Us</h2>
      
      {/* Error message if there's an error */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Use ImageUpload for Hero Image */}
        <div>
          <label className="block text-sm font-medium">Image</label>
          <ImageUpload
            value={heroImageSrc}
            onChange={(url) => setHeroImageSrc(url)} // Pass the URL to setHeroImageSrc
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">WHAT IS CaviteNest?</label>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">WHAT does CaviteNest DO?</label>
          <textarea
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
        >
          Update About Us
        </button>
      </form>

      {/* Preview Section */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold">Preview</h2>

        {/* Hero Section Preview */}
        <section className="relative h-[65vh] mt-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImageSrc || '/images/default-hero.jpg'})`, // Use default image if no URL
            }}
          />
          <div className="relative z-10 flex flex-col justify-start items-start h-full text-left pl-[100px] pt-[120px]">
            <h1 className="text-7xl font-bold text-white">
              {heroTitle || 'Your Hero Title Here'}
            </h1>
            <p className="mt-6 text-lg text-white">
              {heroDescription || 'Your Hero Description Here'}
            </p>
          </div>
        </section>

        {/* Vision and Mission Preview */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* WHAT IS CaviteNest? */}
            <div className="mb-16 flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-left">
                <Image
                  src="/images/vision.png"
                  alt="WHAT IS CaviteNest? Icon"
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h2 className="text-3xl font-bold text-gray-900">WHAT IS CaviteNest?</h2>
                <p className="mt-4 mr-5 text-gray-600 text-center">
                  {vision || 'WHAT IS CaviteNest? Statement Here'}
                </p>
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-8 flex justify-center lg:justify-end">
                <Image
                  src="/images/ourvision.png"
                  alt="WHAT IS CaviteNest?"
                  width={1000}
                  height={400}
                  className="w-full h-100 max-w-3xl object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* WHAT does CaviteNest DO? */}
            <div className="flex flex-col items-center lg:flex-row-reverse">
              <div className="lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-right">
                <Image
                  src="/images/mission.png"
                  alt="WHAT does CaviteNest DO? Icon"
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h2 className="text-3xl font-bold text-gray-900">WHAT does CaviteNest DO?</h2>
                <p className="mt-4 ml-5 text-gray-600 text-center">
                  {mission || 'WHAT does CaviteNest DO? Statement Here'}
                </p>
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pr-8 flex justify-center lg:justify-start">
                <Image
                  src="/images/ourmission.png"
                  alt="WHAT does CaviteNest DO?"
                  width={1000}
                  height={400}
                  className="w-full h-100 max-w-3xl object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsEdit;
