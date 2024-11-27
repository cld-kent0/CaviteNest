"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const AdminLogo = () => {
  const router = useRouter();

  return (
    <Image
      alt="Logo"
      className="hidden md:block cursor-pointer"
      height="90"
      width="150"
      src="/images/cavitenestLogo.png"
    />
  );
};

export default AdminLogo;
