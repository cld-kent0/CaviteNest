// app/admin/page.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '../hooks/userRole';
import AdminSidebar from './components/Submenu/AdminSidebar';
import Loading from '../loading';


const AdminPage = () => {
    const router = useRouter();
    const { role, isAdmin, isLessor, isLessee } = useRole(); // Destructure the role property

    useEffect(() => {
        // Your effect logic here
        if (!isAdmin) {
            // router.push('/admin/dashboard');
            // Redirect or handle non-admin users
            router.push('/'); // Example redirection
        }else {
            router.push('/admin/dashboard');
            router.refresh
        }
    }, 
    [isAdmin, router]);

    if (!isAdmin) {
    //     // Redirect or show an error if not an admin
        return (
            <Loading />
        );
      }
    

    return (
        <Loading />
    );
};

export default AdminPage;
