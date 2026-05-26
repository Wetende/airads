import React, { useState, useRef } from "react";
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
  Typography,
  Button,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  Divider,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore,
  ExpandLess,
  Search as SearchIcon,
} from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import AiradsLogoLockup from "./AiradsLogoLockup";

const NAV_RADIUS = 1;

/**
 * MUT-style Mega-Menu navigation data.
 * Each top-level item can have `groups` (multi-column mega-menu)
 * or `items` (simple dropdown).
 */
const getMenuData = () => ({
  home: { label: "Home", href: "/" },
  about: {
    label: "About Us",
    groups: [
      {
        title: "Profile",
        items: [
          { text: "About AIRADS", href: "/about/" },
          { text: "Mission and Vision", href: "/about/mission/" },
          { text: "Our History", href: "/about/history/" },
          { text: "Contact Us", href: "/contact/" },
        ],
      },
      {
        title: "Leadership",
        items: [
          { text: "CEO Message", href: "/about/" },
          { text: "Board of Directors", href: "/about/" },
        ],
      },
    ],
  },
  academics: {
    label: "Academics",
    groups: [
      {
        title: "AIRADS Schools & Courses",
        items: [
          { text: "All Schools & Courses", href: "/schools/" },
          { text: "Courses We Offer", href: "/courses/" },
          { text: "TVET/CDACC Courses", href: "/schools/tvet-cdacc-courses/" },
          { text: "KASNEB Courses", href: "/schools/kasneb-courses/" },
          { text: "NITA Courses", href: "/schools/nita-courses/" },
          { text: "Professional Short Courses", href: "/schools/professional-short-courses/" },
          { text: "Computer Packages", href: "/schools/computer-packages/" },
          { text: "Driving School", href: "/schools/driving-school/" },
        ],
      },
      {
        title: "Schools Under TVET/CDACC",
        items: [
          { text: "TVET/CDACC Overview", href: "/schools/tvet-cdacc-courses/" },
          { text: "School of Engineering & ICT", href: "/schools/engineering-ict/" },
          { text: "School of Hospitality & Tourism MGT", href: "/schools/hospitality-tourism/" },
          { text: "School of Health & Social Sciences", href: "/schools/health-social/" },
          { text: "School of Beauty & Hair Dressing", href: "/schools/beauty-hairdressing/" },
          { text: "School of Media", href: "/schools/media/" },
          { text: "School of Business MGT", href: "/schools/tvet-cdacc-courses/#business-management" },
        ],
      },
    ],
  },
  admissions: {
    label: "Admissions",
    groups: [
      {
        title: "Apply",
        items: [
          { text: "How to Apply", href: "/admissions/procedure/" },
          { text: "Application Forms", href: "/admissions/forms/" },
          {
            text: "Apply Online",
            href: "/admissions/apply/",
          },
          { text: "Career Guide & Prospectus", href: "/admissions/career-guide/" },
        ],
      },
      {
        title: "Information",
        items: [
          { text: "Fees Structure", href: "/admissions/procedure/" },
          { text: "Reporting Dates", href: "/admissions/procedure/" },
          { text: "Accommodation", href: "/admissions/procedure/" },
        ],
      },
    ],
  },
  campuses: {
    label: "Campuses",
    groups: [
      {
        title: "Our Campuses",
        items: [
          { text: "Bungoma Campus", href: "/campuses/bungoma/" },
          { text: "Kericho Campus", href: "/campuses/kericho/" },
          { text: "Eldoret Campus", href: "/campuses/eldoret/" },
          { text: "Kisumu Campus", href: "/campuses/kisumu/" },
          { text: "Nakuru Campus", href: "/campuses/nakuru/" },
          { text: "Lodwar Campus", href: "/campuses/lodwar/" },
          { text: "Maralal Campus", href: "/campuses/maralal/" },
          { text: "Virtual Campus", href: "/campuses/virtual/" },
        ],
      },
    ],
  },
  students: {
    label: "Students Life",
    groups: [
      {
        title: "Student Affairs",
        items: [
          { text: "Student Portal", href: "/students/" },
          { text: "Industrial Attachment", href: "/students/" },
          { text: "Events & News", href: "/news/latest/" },
        ],
      },
      {
        title: "Downloads",
        items: [
          { text: "Student Forms", href: "/students/" },
          { text: "Timetables", href: "/students/" },
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    href: "/contact/",
  },
});

/* ───────────────────── Desktop Mega-Menu Dropdown ───────────────────── */
const MegaMenuDropdown = ({ groups, anchorEl, open, onClose, brand }) => (
  <Popper
    open={open}
    anchorEl={anchorEl}
    placement="bottom-start"
    transition
    disablePortal
    sx={{ zIndex: 1300 }}
  >
    {({ TransitionProps }) => (
      <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
        <Paper
          elevation={8}
          onMouseLeave={onClose}
          sx={{
            mt: 0.5,
            borderRadius: NAV_RADIUS,
            overflow: "hidden",
            borderTop: `3px solid ${brand.primary}`,
            minWidth: groups.length > 1 ? 480 : 240,
          }}
        >
          <Box sx={{ display: "flex", p: 2, gap: 3 }}>
            {groups.map((group, gi) => (
              <Box key={gi} sx={{ flex: 1, minWidth: 180 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: brand.primary,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    mb: 1,
                    display: "block",
                    fontSize: "0.7rem",
                  }}
                >
                  {group.title}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {group.items.map((item, ii) =>
                  item.external ? (
                    <Typography
                      key={ii}
                      component="a"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      sx={{
                        display: "block",
                        py: 0.75,
                        px: 1,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                        textDecoration: "none",
                        borderRadius: 1,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": {
                          bgcolor: brand.softBlue,
                          color: brand.primary,
                          pl: 2,
                        },
                      }}
                    >
                      {item.text}
                    </Typography>
                  ) : (
                    <Typography
                      key={ii}
                      component={Link}
                      href={item.href}
                      onClick={onClose}
                      sx={{
                        display: "block",
                        py: 0.75,
                        px: 1,
                        fontSize: "0.85rem",
                        color: "text.secondary",
                        textDecoration: "none",
                        borderRadius: 1,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": {
                          bgcolor: brand.softBlue,
                          color: brand.primary,
                          pl: 2,
                        },
                      }}
                    >
                      {item.text}
                    </Typography>
                  )
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      </Grow>
    )}
  </Popper>
);

/* ───────────────────── Main Component ───────────────────── */
const MainNavbar = () => {
  const brand = usePublicBrand();
  const menuData = getMenuData();

  // Desktop mega-menu state
  const [openMenu, setOpenMenu] = useState(null);
  const anchorRefs = useRef({});

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  const handleDesktopOpen = (key, event) => {
    anchorRefs.current[key] = event.currentTarget;
    setOpenMenu(key);
  };
  const handleDesktopClose = () => setOpenMenu(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileDropdownOpen(null);
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  };
  const toggleMobileDropdown = (key) => {
    setMobileDropdownOpen(mobileDropdownOpen === key ? null : key);
  };

  return (
    <>
      {/* ─── Sticky Desktop AppBar ─── */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(8px)",
          color: "text.primary",
          top: { xs: 24, sm: 28 },
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, lg: 4 } }}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              py: { xs: 0.5, lg: 0 },
              minHeight: { xs: 72, sm: 80, lg: 86 },
              px: { xs: 0 },
            }}
          >
            {/* Hamburger — mobile only */}
            <Box sx={{ display: { xs: "flex", lg: "none" }, py: 1 }}>
              <IconButton
                onClick={toggleMobileMenu}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                  borderRadius: NAV_RADIUS,
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo + Institution Name */}
            <AiradsLogoLockup
              href="/"
              onClick={closeMobileMenu}
              gap={{ xs: 1, sm: 1.25 }}
              crestHeight={{ xs: 46, sm: 54, md: 62, lg: 72 }}
              headlineColor={brand.accent}
              subheadColor={brand.primary}
              taglineColor={brand.accent}
              headlineFontSize={{ xs: "0.9rem", sm: "1.25rem", md: "1.6rem", lg: "1.9rem" }}
              subheadFontSize={{ xs: "0.5rem", sm: "0.72rem", md: "0.92rem", lg: "1.05rem" }}
              taglineFontSize={{ xs: "0.36rem", sm: "0.5rem", md: "0.62rem", lg: "0.72rem" }}
              taglineMt={{ xs: 0.2, sm: 0.25, md: 0.35 }}
              alignItemsXs="flex-start"
              alignItemsSm="center"
            />

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0 }}>
              {Object.entries(menuData).map(([key, data]) => {
                // Simple link (no dropdown)
                if (data.href) {
                  return (
                    <Button
                      key={key}
                      component={Link}
                      href={data.href}
                      sx={{
                        color: "text.primary",
                        textTransform: "capitalize",
                        fontWeight: 700,
                        fontSize: "15px",
                        px: "10px",
                        py: "28px",
                        borderRadius: 0,
                        position: "relative",
                        "&:hover": {
                          bgcolor: "transparent",
                          color: brand.accent,
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: "4px",
                          bgcolor: "#70993B", // MUT Green
                          borderRadius: "3px 3px 0 0",
                          transition: "width 0.2s",
                        },
                        "&:hover::after": { width: "100%" },
                      }}
                    >
                      {data.label}
                    </Button>
                  );
                }

                // Mega-menu dropdown
                return (
                  <React.Fragment key={key}>
                    <Button
                      onMouseEnter={(e) => handleDesktopOpen(key, e)}
                      onClick={(e) => handleDesktopOpen(key, e)}
                      endIcon={
                        <ExpandMore
                          sx={{
                            fontSize: "1.1rem !important",
                            transition: "transform 0.2s",
                            transform: openMenu === key ? "rotate(180deg)" : "rotate(0)",
                          }}
                        />
                      }
                      sx={{
                        color: openMenu === key ? brand.accent : "text.primary",
                        textTransform: "capitalize",
                        fontWeight: 700,
                        fontSize: "15px",
                        px: "10px",
                        py: "28px",
                        borderRadius: 0,
                        position: "relative",
                        "&:hover": { bgcolor: "transparent", color: brand.accent },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: openMenu === key ? "100%" : 0,
                          height: "4px",
                          bgcolor: "#70993B", // MUT Green
                          borderRadius: "3px 3px 0 0",
                          transition: "width 0.2s",
                        },
                        "&:hover::after": { width: "100%" },
                      }}
                    >
                      {data.label}
                    </Button>
                    {data.groups && (
                      <ClickAwayListener onClickAway={handleDesktopClose}>
                        <Box>
                          <MegaMenuDropdown
                            groups={data.groups}
                            anchorEl={anchorRefs.current[key]}
                            open={openMenu === key}
                            onClose={handleDesktopClose}
                            brand={brand}
                          />
                        </Box>
                      </ClickAwayListener>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Search icon */}
              <IconButton sx={{ ml: 1, color: "text.secondary" }}>
                <SearchIcon />
              </IconButton>
            </Box>

            {/* Spacer for mobile */}
            <Box sx={{ display: { xs: "flex", lg: "none" }, width: 44 }} />
          </Toolbar>
        </Container>
      </AppBar>

      {/* ─── Mobile Drawer ─── */}
      <Drawer anchor="left" open={mobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 300, bgcolor: "background.paper", height: "100%" }}>
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              bgcolor: brand.primary,
              color: "white",
            }}
          >
            <AiradsLogoLockup
              gap={1}
              crestHeight={42}
              headlineColor="white"
              subheadColor="rgba(255,255,255,0.92)"
              taglineColor="white"
              headlineFontSize="0.92rem"
              subheadFontSize="0.58rem"
              taglineFontSize="0.48rem"
              taglineMt={0.2}
              alignItems="center"
            />
            <IconButton onClick={closeMobileMenu} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drawer Links */}
          <List sx={{ pt: 0 }}>
            {Object.entries(menuData).map(([key, data]) => {
              // Simple link
              if (data.href) {
                return (
                  <ListItem key={key} disablePadding>
                    <ListItemButton component={Link} href={data.href} onClick={closeMobileMenu}>
                      <ListItemText
                        primary={data.label}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              }

              // Collapsible dropdown
              return (
                <React.Fragment key={key}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => toggleMobileDropdown(key)}>
                      <ListItemText
                        primary={data.label}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      {mobileDropdownOpen === key ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={mobileDropdownOpen === key} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {data.groups &&
                        data.groups.map((group, gi) => (
                          <React.Fragment key={gi}>
                            <Typography
                              variant="overline"
                              sx={{
                                display: "block",
                                pl: 4,
                                pt: 1.5,
                                pb: 0.5,
                                color: brand.primary,
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                letterSpacing: 1,
                              }}
                            >
                              {group.title}
                            </Typography>
                            {group.items.map((item, ii) => (
                              <ListItemButton
                                key={ii}
                                sx={{ pl: 5 }}
                                component={item.external ? "a" : Link}
                                href={item.href}
                                target={item.external ? "_blank" : undefined}
                                onClick={closeMobileMenu}
                              >
                                <ListItemText
                                  primary={item.text}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    color: "text.secondary",
                                  }}
                                />
                              </ListItemButton>
                            ))}
                          </React.Fragment>
                        ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MainNavbar;
