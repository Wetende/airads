
import { Head } from "@inertiajs/react";
import { Box } from "@mui/material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import NewsTicker from "../../components/common/NewsTicker";
import HeroSection from "../../components/sections/HeroSection";
import ProgrammesCatalogueSection from "../../components/sections/ProgrammesCatalogueSection";
import AtAGlanceSection from "../../components/sections/AtAGlanceSection";
import SchoolsGridSection from "../../components/sections/SchoolsGridSection";
import NoticesNewsSection from "../../components/sections/NoticesNewsSection";
import QuickLinksAdmissionSection from "../../components/sections/QuickLinksAdmissionSection";
import WelcomeSection from "../../components/sections/WelcomeSection";
import TestimonialSection from "../../components/sections/TestimonialSection";
import Footer from "../../components/common/AIRADSFooter";

/**
 * Homepage — MUT-inspired structural layout:
 *
 * 1. TopNavbar (utility bar with contact + social icons)
 * 2. MainNavbar (sticky white mega-menu)
 * 3. HeroSection (full-width carousel with left-aligned text)
 * 4. NewsTicker (scrolling updates banner)
 * 5. ProgrammesCatalogueSection (3-4 card grid)
 * 6. AtAGlanceSection (tabbed info panel)
 * 7. SchoolsGridSection (image card grid)
 * 8. QuickLinksAdmissionSection (study links + apply banner)
 * 9. NoticesNewsSection (notices board + news feed)
 * 10. WelcomeSection (CEO message + Why Join)
 * 11. TestimonialSection
 * 12. Footer
 */
const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Home - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection />
        <NewsTicker />
        <ProgrammesCatalogueSection />
        <AtAGlanceSection />
        <SchoolsGridSection />
        <QuickLinksAdmissionSection />
        <NoticesNewsSection />
        <WelcomeSection />
        <TestimonialSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
