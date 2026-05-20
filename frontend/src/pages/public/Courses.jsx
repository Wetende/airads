import { Head } from "@inertiajs/react";
import { Box } from "@mui/material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import CoursesSection from "../../components/sections/CoursesSection";
import Footer from "../../components/common/AIRADSFooter";

const Courses = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
    <Head title="Courses We Offer - AIRADS College" />
    <TopNavbar />
    <MainNavbar />
    <Box component="main" sx={{ flexGrow: 1, pt: { xs: 7, md: 9 } }}>
      <CoursesSection />
    </Box>
    <Footer />
  </Box>
);

export default Courses;
