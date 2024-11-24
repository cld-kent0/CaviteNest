"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  return (
    <Image
      onClick={() => router.push("/")}
      alt="logo"
      className="hidden cursor-pointer md:block -ml-5"
      height={90}
      width={150}
      src="/images/cavitenest.png"
    />
  );
};

export default Logo;
