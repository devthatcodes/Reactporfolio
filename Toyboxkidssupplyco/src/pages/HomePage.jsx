import React from 'react';
import Hero from '../components/Hero';
import BrandRibbon from '../components/BrandRibbon';
import NewArrivals from '../components/NewArrivals';
import TopSelling from '../components/TopSelling';
import BrowseStyle from '../components/BrowseStyle';
import Testimonials from '../components/Testimonials';

const HomePage = () => {
  return (
    <>
      <Hero />
      <BrandRibbon />
      <NewArrivals />
      <TopSelling />
      <BrowseStyle />
      <Testimonials />
    </>
  );
};

export default HomePage;
