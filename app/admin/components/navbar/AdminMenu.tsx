"use client";

import Avatar from "@/app/components/Avatar";
import MenuItem from "@/app/components/navbar/MenuItem";
import { getSession, signOut } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

const AdminMenu: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        if (session.user.role === "ADMIN") {
          setIsAdmin(true);
        }
      }
    };

    fetchSession();
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleMainPageClick = () => {
    window.location.href = "/"; // Perform a full page reload by setting `window.location.href`
  };

  if (!currentUser) {
    return null;
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
             border-[1px]
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
                <MenuItem onClick={handleMainPageClick} label="Main Page" />
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
