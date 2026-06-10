import React from "react";
import { Box } from "@mui/material";
import VirtualNavbar from "../components/common/VirtualNavbar";
import AIRADSFooter from "../components/common/AIRADSFooter";

export default function VirtualCampusLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <VirtualNavbar />
      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 8, md: 10 } }}>
        {children}
      </Box>
      <AIRADSFooter />
    </Box>
  );
}
