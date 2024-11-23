"use client";

import HeroSection from "./home/HeroSection";
import CategoriesSection from "./home/CategoriesSection";
import GetStarted from "./home/GetStarted";
import OptionSection from "./home/OptionSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <hr />
      <CategoriesSection />
      <hr />
      <GetStarted />
      <hr />
      <OptionSection />
    </>
  );
};

export default Home;
