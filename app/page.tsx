"use client";

import HeroSection from "./home/HeroSection";
import CategoriesSection from "./home/CategoriesSection";
import GetStarted from "./home/GetStarted";
import OptionSection from "./home/OptionSection";
import ClientLayout from "./client-layout";

const Home = () => {
  return (
    <>
      <ClientLayout>
        <HeroSection />
        <hr />
        <CategoriesSection />
        <hr />
        <GetStarted />
        <hr />
        <OptionSection />
      </ClientLayout>
    </>
  );
};

export default Home;
