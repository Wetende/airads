import { Box } from "@mui/material";
import VirtualNavbar from "../components/common/VirtualNavbar";
import AIRADSFooter from "../components/common/AIRADSFooter";

export default function VirtualCampusLayout({ children, homepage = false }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: homepage ? '#ffffff' : '#f8fafc' }}>
      <VirtualNavbar homepage={homepage} />
      <Box component="main" sx={{ flexGrow: 1, pt: homepage ? 0 : { xs: 8, md: 10 } }}>
        {children}
      </Box>
      <AIRADSFooter />
    </Box>
  );
}
