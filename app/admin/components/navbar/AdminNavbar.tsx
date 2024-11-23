'use client';

import Container from "@/app/components/Container";
import { SafeUser } from "@/app/types"
import AdminLogo from "./AdminLogo";
import AdminSearch from "./AdminSearch";
import AdminMenu from "./AdminMenu";
import RealTimeClock from "./RealTimeClock";


interface NavbarProps {
    currentUser?: SafeUser | null;
  }

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
    return(
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div
                className="
                    py-4
                    border-b-[2px]
                "
                >
                {/* container from imported componets */}
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
                        <RealTimeClock />
                        <AdminSearch />
                        <AdminMenu />
                        
                        
                    </div>
                    
                </Container>
            </div>
            
        </div>
    );
}

export default Navbar;