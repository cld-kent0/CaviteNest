// components/ClientProvider.tsx
"use client"; // Mark this file as a client component

import { SessionProvider } from "next-auth/react";
import Navbar from "./navbar/Navbar";
import ClientOnly from "./ClientOnly";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
import RentModal from "./modals/RentModal";
import SearchModal from "./modals/SearchModal";
import ToasterProvider from "../providers/ToasterProvider";
import ActiveStatus from "./ActiveStatus";

interface ClientProviderProps {
  children: React.ReactNode;
  currentUser: any;
}

// Client-side wrapper for providing session context and other client-side logic
const ClientProvider = ({ children, currentUser }: ClientProviderProps) => {
  return (
    <SessionProvider>
      <ClientOnly>
        <ToasterProvider />
        <SearchModal />
        <RentModal user={currentUser} />
        <LoginModal />
        <RegisterModal />
        <Navbar currentUser={currentUser} />
        <ActiveStatus />
        <main className="flex-grow pt-20">{children}</main>
      </ClientOnly>
    </SessionProvider>
  );
};

export default ClientProvider;
