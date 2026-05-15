import React from 'react';
import { Head } from "@inertiajs/react";
import { Box } from "@mui/material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import HeroSection from "../../components/sections/HeroSection";
import WelcomeSection from "../../components/sections/WelcomeSection";
import CoursesSection from "../../components/sections/CoursesSection";
import CampusesSection from "../../components/sections/CampusesSection";
import TestimonialSection from "../../components/sections/TestimonialSection";
import Footer from "../../components/common/AIRADSFooter";

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Home - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection />
        <WelcomeSection />
        <CoursesSection />
        <CampusesSection />
        <TestimonialSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
