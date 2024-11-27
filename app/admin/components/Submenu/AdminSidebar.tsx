"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BiMenu } from "react-icons/bi";
import SidebarItem from "../navbar/SidebarItem";
import UserManagementSubmenu from "./UserManagementSubmenu";
import SettingsSubmenu from "./SettingsSubmenu";
import PropertyListingsSubmenu from "./PropertyListingsSubmenu";
import SubscriptionSubmenu from "./SubscriptionSubmenu";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // This controls whether the sidebar and submenus are open
  const [activePath, setActivePath] = useState<string | null>(null);
  const { data: session } = useSession();

  const userName = session?.user?.name || "Admin Name";
  const userRole = session?.user?.role || "Administrator";
  const userImage = session?.user?.image || "/images/placeholder.jpg";

  useEffect(() => {
    const savedActivePath = localStorage.getItem("activePath");
    if (savedActivePath) {
      setActivePath(savedActivePath);
    }
  }, []);

  useEffect(() => {
    if (activePath) {
      localStorage.setItem("activePath", activePath);
    }
  }, [activePath]);

  const handleItemClick = (path: string) => {
    setActivePath(path);
  };

  return (
    <div
      className={`relative ${
        isOpen ? "w-64" : "w-18"
      } duration-300 bg-sky-950 text-white rounded-md min-h-full shadow-sky-900 shadow-xl`}
    >
      {/* Hamburger Menu */}
      <div className="absolute left-5 mt-11">
        <BiMenu
          className="cursor-pointer"
          size={24}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {/* Sidebar Content */}
      <div className="mt-24 flex flex-col space-y-4">
        {/* Admin Profile Section */}
        <div className="flex flex-col items-center mb-6 mt-36">
          <Image
            src={userImage}
            alt="User Profile"
            className="rounded-full"
            width={isOpen ? 48 : 32}
            height={isOpen ? 48 : 32}
          />
          {isOpen && (
            <div className="text-center mt-2">
              <p className="text-sm">{userName}</p>
              <p className="text-xs text-gray-400">{userRole}</p>
            </div>
          )}
        </div>

        {/* Sidebar Items */}
        <div className="flex flex-col space-y-4 items-start px-2">
          <SidebarItem
            icon={<BiMenu />}
            label="Dashboard"
            isOpen={isOpen}
            path="/admin/dashboard"
            activePath={activePath || ""}
            setActivePath={handleItemClick}
          />

          {/* Submenus - These will always be expanded if isOpen is true */}
          <UserManagementSubmenu
            isOpen={isOpen} // This prop controls whether the submenu is expanded or not
            activePath={activePath || ""}
            setActivePath={handleItemClick}
          />

          <PropertyListingsSubmenu
            isOpen={isOpen} // This prop controls whether the submenu is expanded or not
            activePath={activePath || ""}
            setActivePath={handleItemClick}
          />

          <SubscriptionSubmenu
            isOpen={isOpen} // This prop controls whether the submenu is expanded or not
            activePath={activePath || ""}
            setActivePath={handleItemClick}
          />

          <SettingsSubmenu
            isOpen={isOpen} // This prop controls whether the submenu is expanded or not
            activePath={activePath || ""}
            setActivePath={handleItemClick}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
