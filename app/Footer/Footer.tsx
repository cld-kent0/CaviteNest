// components/Footer.js
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex z-20 items-center justify-between bg-white border-t border-gray-300 shadow-md">
      <div className="flex items-center">
        <Image
          src="/images/cavitenest.png" // Replace with your image path
          alt="Footer Logo"
          width={150} // Adjust width as needed
          height={100} // Adjust height as needed
          className="ml-16 -mt-2" // Adds right margin to the logo
        />
        <span className="text-gray-700">© 2024 CaviteNest</span>
      </div>
    </footer>
  );
};

export default Footer;
