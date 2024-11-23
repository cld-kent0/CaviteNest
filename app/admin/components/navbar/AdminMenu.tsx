// import React, { useState } from 'react'
// import { FaUserCircle } from 'react-icons/fa'

// const AdminMenu = () => {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const toggleMenu = () => {
//         setMenuOpen(!menuOpen);
//     };
//   return (
//       <div className="flex items-center space-x-4">
//       <div className="relative">
//         <FaUserCircle
//           className="text-3xl cursor-pointer"
//           onClick={toggleMenu}
//         />
//         {menuOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
//             <a href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//               Dashboard
//             </a>
//             <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//               Settings
//             </a>
//             <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//               Logout
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
 
//   )
// }

// export default AdminMenu


'use client';

import Avatar from "@/app/components/Avatar";
import MenuItem from "@/app/components/navbar/MenuItem";
import { getSession, signOut } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

const AdminMenu: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null); // State for current user
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch the session to check the user's role
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession(); // Fetch the current session
      if (session?.user) {
        setCurrentUser(session.user); // Set the user object
        if (session.user.role === 'ADMIN') {
          setIsAdmin(true); // Set admin state to true if user is admin
        }
      }
    };

    fetchSession();
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  if (!currentUser) {
    return null; // Avoid rendering if the session hasn't loaded yet
  }

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
            className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    
                "
            >

                {currentUser.role}
        </div>
        <div
          onClick={toggleOpen}
          className="
            p-4
            md:py-1
            md:px-2
            border-neutral-200
            flex
            flex-row
            items-center
            gap-3
            rounded-full
            cursor-pointer
            hover:shadow-md
            transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="
            absolute
            rounded-xl
            shadow-md
            w-[40vw]
            md:w-3/4
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {isAdmin ? (
              <>
                <MenuItem
                  onClick={() => router.push("/admin/profile")}
                  label="Profile"
                />
                <MenuItem
                  onClick={() => router.push("/admin/settings")}
                  label="Settings"
                />
                <hr />
                <MenuItem onClick={signOut} label="Logout" />
              </>
            ) : (
              <MenuItem onClick={() => router.push("/login")} label="Login" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
