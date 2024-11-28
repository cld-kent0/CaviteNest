"use client";

import Image from "next/image";

const AdminLogo = () => {
  return (
    <Image
      alt="Logo"
      className="hidden md:block cursor-pointer"
      height="90"
      width="150"
      src="/images/cavitenestLogo.png"
      onClick={() => (window.location.href = "/")} // Navigate to "/" and trigger a refresh
    />
  );
};

export default AdminLogo;
