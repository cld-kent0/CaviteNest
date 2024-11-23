// components/Footer.js
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex z-20 items-center justify-between p-4 bg-white border-t border-gray-300 shadow-md">
      <div className="flex items-center">
        <Image
          src="/images/cavitenest.png" // Replace with your image path
          alt="Footer Logo"
          width={100} // Adjust width as needed
          height={100} // Adjust height as needed
          className="ml-8" // Adds right margin to the logo
        />
        <span className="text-gray-700">CaviteNest</span>
      </div>
    </footer>
  );
};

export default Footer;
