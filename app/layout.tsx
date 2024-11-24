// app/layout.tsx
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import getCurrentUser from "./actions/getCurrentUser";
// import ClientOnly from "./components/ClientOnly";
// import LoginModal from "./components/modals/LoginModal";
// import RegisterModal from "./components/modals/RegisterModal";
// import RentModal from "./components/modals/RentModal";
// import SearchModal from "./components/modals/SearchModal";
// import Navbar from "./components/navbar/Navbar";
import "./globals.css";
// import ToasterProvider from "./providers/ToasterProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ActiveStatus from "./components/ActiveStatus";
// import Footer from "./Footer/Footer";
import ClientProvider from "./components/ClientProvider";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CaviteNest | Rental & Booking Platform in Cavite City",
  description: "A platform for rental properties in Cavite City",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${font.className} flex flex-col min-h-screen`}>
        {/* <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
          <ActiveStatus />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </ClientOnly> */}
        <ClientProvider currentUser={currentUser}>{children}</ClientProvider>
      </body>
    </html>
  );
}
