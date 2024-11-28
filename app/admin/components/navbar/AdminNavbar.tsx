"use client";

import Container from "@/app/components/Container";
import { SafeUser } from "@/app/types";
import AdminLogo from "./AdminLogo";
import AdminSearch from "./AdminSearch";
import AdminMenu from "./AdminMenu";
import RealTimeClock from "./RealTimeClock";
import { useState, useEffect } from "react";
import ClientLayout from "@/app/client-layout";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect hook to detect page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true); // Add shadow when scrolled down
      } else {
        setIsScrolled(false); // Remove shadow when at top
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed z-30 w-full bg-white transition-shadow duration-300 ${isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
    >
      <div className="p-4 md:p-0 border-b-[1px]">
        <Container>
          <div
            className="
              flex
              flex-row
              items-center
              justify-between
              gap-3
              md:gap-0
            "
          >
            <AdminLogo />
            <div className="bg-gray-300 rounded-full px-3 py-1 shadow-md inset-shadow">
              <RealTimeClock />
            </div>

            <AdminSearch />
            <AdminMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
