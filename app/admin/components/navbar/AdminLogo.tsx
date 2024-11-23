'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const AdminLogo = () => {
    const router = useRouter();

    return(
        <Image
            onClick={() => router.push("/admin/dashboard")}
            alt="Logo"
            className="hidden md:block cursor-pointer"
            height="100"
            width="100"
            src="/images/cavitenestLogo.png"
        />
    )
}

export default AdminLogo;