// SidebarItem.tsx
import React from "react";
import { useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  path: string; // Define where the user should navigate
  activePath: string; // Pass the current active path
  setActivePath: (path: string) => void; // Setter to update the active path
  children?: React.ReactNode; // Add children prop to accept arrow icons
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isOpen,
  path,
  activePath,
  setActivePath,
  children, // Destructure children
}) => {
  const router = useRouter(); // Initialize router

  const handleClick = () => {
    router.push(path); // Navigate to the specified path
    setActivePath(path); // Set the active path to the current item's path
  };

  const isActive = activePath === path; // Check if the current path is active

  return (
    <div
      onClick={handleClick} // Trigger handleClick on click
      className={`flex items-center space-x-4 px-4 py-2 cursor-pointer w-full rounded-2xl 
        ${isActive ? "bg-emerald-800 text-white" : "hover:bg-emerald-800"}`} // Apply active styles if active
    >
      <span>{icon}</span>
      {isOpen && <span className="ml-4">{label}</span>}
      {children} {/* Render arrow icon or any other children */}
    </div>
  );
};

export default SidebarItem;
