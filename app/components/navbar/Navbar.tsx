"use client";

import { useState, useEffect } from "react";
import { SafeUser } from "@/app/types";
import Container from "../Container";
/*import Categories from "./Categories";*/
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import NavLinks from "./NavLinks";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
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
      className={`fixed z-30 w-full bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="p-4 md:p-0 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center">
            {/* Left section with Logo and Search */}
            <div className="flex items-center gap-3">
              <Logo />
              <Search />
            </div>
            {/* Center section for NavLinks */}
            <div className="flex-grow flex justify-center">
              <NavLinks />
            </div>
            {/* UserMenu on the right */}
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
