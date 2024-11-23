"use client";

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
  return (
    <div className="fixed z-30 w-full bg-white shadow-sm">
      <div className="py-4 border-b-[1px]">
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
