// app/layouts/AdminLayout.tsx

import React from 'react';
import { Nunito } from 'next/font/google'; // Import fonts as needed
import getCurrentUser from '../actions/getCurrentUser';
import AdminNavbar from './components/navbar/AdminNavbar';
import AdminSidebar from './components/Submenu/AdminSidebar';
import ClientOnly from '../components/ClientOnly';
import Header from './components/NavbarHeader';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NavbarHeader from './components/NavbarHeader';

const font = Nunito({
  subsets: ['latin'],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Fetch the current user
    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.role === 'ADMIN'; // Check if the user is an admin
   
    return (
 
      <html lang="en">
      <body className={`${font.className} bg-gray-100`}>
        <NavbarHeader /> {/* Use the Header component */}

        <div className="flex flex-row mb-10">
          <Sidebar /> {/* Use the Sidebar component */}
          
          <MainContent>{children}</MainContent> {/* Use the MainContent component */}
        </div>
      </body>
    </html>
    );
}

// {/* AdminNavbar stays at the top */}
// <AdminNavbar />

// <div className="flex flex-row">
//   {/* AdminSidebar stays fixed on the left */}
//   <AdminSidebar />

//   {/* Main content area */}
//   <div className="flex-1 p-6 ml-2 mt-28">
//     {children}
//   </div>
// </div>
