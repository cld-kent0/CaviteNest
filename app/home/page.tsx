"use client";

import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";
import GetStarted from "./GetStarted";
import OptionSection from "./OptionSection";

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
