"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";

interface ProfileProps {
  user?: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) != -1;
  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
        <Image
          alt="Profile"
          src={user?.image || "/images/placeholder.jpg"}
          fill
        />
      </div>
      {isActive && (
        <span className="absolute block rounded-full bg-emerald-700 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3"></span>
      )}
    </div>
  );
};

export default Profile;
