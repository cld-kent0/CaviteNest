// app/client-layout.tsx (Client-Side Layout)

"use client"; // Mark this component as a client-side component
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer/Footer"; // Import Footer component

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get current pathname
  const [showFooter, setShowFooter] = useState(true);

  // Conditionally hide the footer on specific pages (e.g., /messages or /conversations)
  useEffect(() => {
    console.log("Current Pathname:", pathname); // Log the pathname to check it
    if (
      pathname?.startsWith("/messages") ||
      pathname?.startsWith("/conversations") //||
      //pathname?.startsWith("/browse")
    ) {
      setShowFooter(false); // Hide footer on these pages
    } else {
      setShowFooter(true); // Show footer on other pages
    }
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
        {/* Conditionally render Footer based on the state */}
        {showFooter && <Footer />}
      </main>
    </div>
  );
}
