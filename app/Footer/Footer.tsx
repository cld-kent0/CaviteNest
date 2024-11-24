import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGithub, FaGlobeAmericas, FaEnvelope } from "react-icons/fa"; // Import the GitHub, Globe, and Envelope (Gmail) icons

const Footer = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom
      const isBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight;
      setIsAtBottom(isBottom);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer
      className={`flex z-20 items-center justify-between bg-white border-t border-gray-300 transition-shadow duration-300 ${
        isAtBottom
          ? "shadow-[0_15px_25px_5px_rgba(0,0,0,0.2)]" // Custom stronger shadow when at the bottom
          : "shadow-md" // Default shadow
      } p-4`}
    >
      {/* Left Section (Logo and Links) */}
      <div className="flex items-center">
        <Image
          src="/images/cavitenest.png" // Replace with your image path
          alt="Footer Logo"
          width={150} // Adjust width as needed
          height={100} // Adjust height as needed
          className="ml-16 -mt-2" // Adds right margin to the logo
        />
        <span className="text-gray-700 ml-4">© 2024 CaviteNest</span>
        {/* Privacy Policy Link */}
        <span className="mx-2 text-gray-700">•</span>
        <a
          href="/terms" // Replace with your actual Terms URL
          className="text-gray-600 hover:text-black hover:underline transition-colors duration-300"
        >
          Terms
        </a>

        <span className="mx-2 text-gray-700">•</span>
        <a
          href="/privacy-policy" // Replace with your actual Privacy Policy URL
          className="text-gray-600 hover:text-black hover:underline transition-colors duration-300"
        >
          Privacy
        </a>

        <span className="mx-2 text-gray-700">•</span>
        <a
          href="/faqs" // Replace with your actual Privacy Policy URL
          className="text-gray-600 hover:text-black hover:underline transition-colors duration-300"
        >
          FAQs
        </a>
      </div>

      {/* Right Section for Language, GitHub Source Code, and Contact Us */}
      <div className="flex items-center gap-6 ml-auto mr-16">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <FaGlobeAmericas size={20} className="text-gray-600" />
          <span className="text-gray-600 text-sm">English (US) only</span>
        </div>

        {/* Contact Us with Gmail Icon */}
        <a
          href="mailto:cavitenest.platform2024@gmail.com"
          className="flex items-center gap-2 text-gray-600 hover:text-black hover:underline transition-colors duration-300"
        >
          <FaEnvelope size={20} className="text-gray-600" />
          <span className="text-sm group relative">
            Mail Us
            <span className="absolute left-0 top-8 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              cavitenest.platform2024@gmail.com
            </span>
          </span>
        </a>

        {/* GitHub Source Code Link */}
        <a
          href="https://github.com/cld-kent0/CaviteNest" // Replace with your actual GitHub URL
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-black hover:underline transition-colors duration-300"
        >
          <FaGithub size={24} />
          <span className="text-sm">GitHub Source Code</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
