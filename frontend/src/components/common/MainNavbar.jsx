import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Menu,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, ExpandMore, ExpandLess } from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import { FONT_ARCHIVO, FONT_FIGTREE } from "../../config";

const MainNavbar = () => {
  const brand = usePublicBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  const [anchorEl, setAnchorEl] = useState({
    about: null,
    admissions: null,
    campuses: null,
    schools: null,
    news: null,
    contact: null,
  });

  const handleMenuOpen = (event, menu) => {
    setAnchorEl({ ...anchorEl, [menu]: event.currentTarget });
  };

  const handleMenuClose = (menu) => {
    setAnchorEl({ ...anchorEl, [menu]: null });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileDropdownOpen(null);
  };

  const toggleMobileDropdown = (dropdown) => {
    setMobileDropdownOpen(mobileDropdownOpen === dropdown ? null : dropdown);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  };

  const menuItems = {
    about: [
      { text: "Mission and Vision", href: "/about/mission/" },
      { text: "Our History", href: "/about/history/" },
    ],
    admissions: [
      { text: "Application Procedure", href: "/admissions/procedure/" },
      { text: "Application Forms", href: "/admissions/forms/" },
      { text: "Apply Online", href: "https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded", external: true },
      { text: "Career Guide & Prospectus", href: "/admissions/career-guide/" },
    ],
    campuses: [
      { text: "Bungoma", href: "/campuses/bungoma/" },
      { text: "Kericho", href: "/campuses/kericho/" },
      { text: "Eldoret", href: "/campuses/eldoret/" },
      { text: "Kisumu", href: "/campuses/kisumu/" },
      { text: "Nakuru", href: "/campuses/nakuru/" },
      { text: "Lodwar", href: "/campuses/lodwar/" },
      { text: "Maralal", href: "/campuses/maralal/" },
      { text: "Virtual Campus", href: "/campuses/virtual/" },
    ],
    schools: [
      { text: "School of Engineering and ICT", href: "/schools/engineering-ict/" },
      { text: "School of Hospitality and Tourism MGT", href: "/schools/hospitality-tourism/" },
      { text: "School of Health and Social Sciences", href: "/schools/health-social/" },
      { text: "School of Beauty and Hair dressing", href: "/schools/beauty-hairdressing/" },
      { text: "School of Media", href: "/schools/media/" },
      { text: "NITA courses & Short Courses", href: "/schools/nita-courses/" },
    ],
    news: [{ text: "Events & News", href: "/news/latest/" }],
    contact: [{ text: "Our Contacts", href: "/contact/" }],
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(4px)",
          color: "text.primary",
          top: { xs: 24, sm: 28 },
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: { xs: "flex", lg: "none" } }}>
            <IconButton onClick={toggleMobileMenu} sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" }, borderRadius: 2 }}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box component={Link} href="/" onClick={closeMobileMenu} sx={{ display: "flex", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <Box component="img" src="/static/airads-logo.png" alt="AIRADS College Logo" sx={{ height: { xs: 60, md: 80 }, width: "auto" }} />
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  color: brand.accent,
                  lineHeight: 1.1,
                  fontSize: { xs: "1.25rem", md: "1.5rem", lg: "1.8rem" },
                  fontFamily: FONT_ARCHIVO,
                  letterSpacing: "0.5px",
                  fontWeight: 400,
                }}
              >
                AFRICAN INSTITUTE <br />
                <Typography
                  component="span"
                  sx={{
                    color: brand.primary,
                    fontSize: { xs: "1rem", md: "1.25rem", lg: "1.5rem" },
                    fontFamily: FONT_FIGTREE,
                    fontWeight: 400,
                  }}
                >
                  Of Research and Development Studies
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5 }}>
            <Button component={Link} href="/" sx={{ color: "text.primary", textTransform: "none", fontWeight: 400 }}>
              Home
            </Button>

            {Object.keys(menuItems).map((menu) => (
              <React.Fragment key={menu}>
                <Button onClick={(e) => handleMenuOpen(e, menu)} endIcon={<ExpandMore />} sx={{ color: "text.primary", textTransform: "none", fontWeight: 400 }}>
                  {menu === "news" ? "Events" : menu === "about" ? "About Us" : menu.charAt(0).toUpperCase() + menu.slice(1).replace("-", " ")}
                </Button>
                <Menu
                  anchorEl={anchorEl[menu]}
                  open={Boolean(anchorEl[menu])}
                  onClose={() => handleMenuClose(menu)}
                  MenuListProps={{ onMouseLeave: () => handleMenuClose(menu) }}
                  elevation={2}
                >
                  {menuItems[menu].map((item, idx) =>
                    item.external ? (
                      <MenuItem key={idx} component="a" href={item.href} target="_blank" onClick={() => handleMenuClose(menu)}>
                        {item.text}
                      </MenuItem>
                    ) : (
                      <MenuItem key={idx} component={Link} href={item.href} onClick={() => handleMenuClose(menu)}>
                        {item.text}
                      </MenuItem>
                    )
                  )}
                </Menu>
              </React.Fragment>
            ))}

            <Button component={Link} href="/students/" sx={{ color: "text.primary", textTransform: "none", fontWeight: 400 }}>
              Students
            </Button>
          </Box>
          <Box sx={{ display: { xs: "flex", lg: "none" }, width: 44 }} />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280, bgcolor: "background.paper", height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, bgcolor: brand.secondary, color: "white" }}>
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={closeMobileMenu} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/" onClick={closeMobileMenu}>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            {Object.keys(menuItems).map((menu) => (
              <React.Fragment key={menu}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => toggleMobileDropdown(menu)}>
                    <ListItemText primary={menu === "news" ? "Events" : menu === "about" ? "About Us" : menu.charAt(0).toUpperCase() + menu.slice(1).replace("-", " ")} />
                    {mobileDropdownOpen === menu ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={mobileDropdownOpen === menu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menuItems[menu].map((item, idx) => (
                      <ListItemButton key={idx} sx={{ pl: 4 }} component={item.external ? "a" : Link} href={item.href} target={item.external ? "_blank" : undefined} onClick={closeMobileMenu}>
                        <ListItemText primary={item.text} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}

            <ListItem disablePadding>
              <ListItemButton component={Link} href="/students/" onClick={closeMobileMenu}>
                <ListItemText primary="Students" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MainNavbar;
