import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Search as SearchIcon, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import AiradsLogoLockup from "./AiradsLogoLockup";
import { usePublicBrand } from "../../hooks/usePublicBrand";

export default function VirtualNavbar() {
  const brand = usePublicBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/campuses/virtual/courses/", { search, category: category !== "all" ? category : "" }, { preserveState: true });
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1, minHeight: { xs: 72, md: 80 } }}>
            {/* Left: Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AiradsLogoLockup
                href="/campuses/virtual/"
                gap={{ xs: 1, sm: 1.25 }}
                crestHeight={{ xs: 46, sm: 54 }}
                headlineColor={brand.accent}
                subheadColor={brand.primary}
                taglineColor={brand.accent}
              />
            </Box>

            {/* Middle: Search Pill (Desktop) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, flex: 1, maxWidth: 600, mx: 4 }}>
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  bgcolor: "grey.100",
                  borderRadius: 8,
                  p: 0.5,
                  border: "1px solid",
                  borderColor: "grey.200",
                  transition: "all 0.2s",
                  "&:focus-within": {
                    borderColor: brand.primary,
                    bgcolor: "white",
                    boxShadow: "0 0 0 4px rgba(30, 58, 138, 0.1)",
                  },
                }}
              >
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    variant="standard"
                    disableUnderline
                    sx={{
                      pl: 2,
                      py: 1,
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: "0.9rem",
                      "& .MuiSelect-select": { py: 0.5 },
                      borderRight: "1px solid",
                      borderColor: "grey.300",
                      mr: 1,
                    }}
                  >
                    <MenuItem value="all">All Courses</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="IT">IT & Tech</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Health">Health</MenuItem>
                  </Select>
                </FormControl>
                <InputBase
                  placeholder="Search virtual courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ ml: 1, flex: 1, fontSize: "0.95rem" }}
                />
                <IconButton type="submit" sx={{ p: "8px", bgcolor: brand.primary, color: "white", "&:hover": { bgcolor: brand.secondary }, borderRadius: "50%" }}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Right: Links & CTA */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <Button component={Link} href="/" sx={{ color: "text.primary", fontWeight: 600, "&:hover": { color: brand.primary } }}>
                Main Site
              </Button>
              <Button component={Link} href="/campuses/virtual/courses/" sx={{ color: "text.primary", fontWeight: 600, "&:hover": { color: brand.primary } }}>
                Catalog
              </Button>
              <Button component={Link} href="/login/" variant="outlined" sx={{ borderRadius: 8, px: 3, borderColor: brand.primary, color: brand.primary, fontWeight: 600 }}>
                Login
              </Button>
              <Button component={Link} href="/admissions/apply/" variant="contained" sx={{ borderRadius: 8, px: 3, bgcolor: brand.accent, "&:hover": { bgcolor: "#9a1818" }, fontWeight: 600, boxShadow: "none" }}>
                Get Started
              </Button>
            </Box>

            {/* Mobile Menu Toggle */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={toggleMobileMenu} sx={{ color: brand.primary }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280, bgcolor: "background.paper", height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <AiradsLogoLockup crestHeight={36} headlineColor={brand.accent} />
            <IconButton onClick={closeMobileMenu} sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ p: 2 }}>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/" onClick={closeMobileMenu}>
                <ListItemText primary="Main Site" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/campuses/virtual/courses/" onClick={closeMobileMenu}>
                <ListItemText primary="Virtual Catalog" />
              </ListItemButton>
            </ListItem>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <Button component={Link} href="/login/" variant="outlined" fullWidth sx={{ borderRadius: 8 }}>
                Login
              </Button>
              <Button component={Link} href="/admissions/apply/" variant="contained" fullWidth sx={{ borderRadius: 8, bgcolor: brand.accent }}>
                Get Started
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
