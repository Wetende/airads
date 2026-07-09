import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  PhoneInTalk as PhoneInTalkIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import AiradsLogoLockup from "./AiradsLogoLockup";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import useLogout from "../../hooks/useLogout";

export default function VirtualNavbar({ homepage = false }) {
  const brand = usePublicBrand();
  const { siteContext = {}, auth } = usePage().props;
  const isAuthenticated = !!auth?.user;
  const triggerLogout = useLogout();
  const routes = siteContext.routes || {};
  const mainHomeHref = routes.mainHome || "/";
  const homeHref = routes.virtualHome || "/";
  const coursesHref = routes.virtualCourses || "/courses/";
  const applyHref = routes.virtualApply || "/apply/";
  const registerHref = routes.register || "/register/";
  const mainWebsiteLabel = "AIRADS College";
  const mobileMainWebsiteLabel = "Visit AIRADS College";
  const applyLabel = "Apply Now";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(coursesHref, { search }, { preserveState: true });
  };

  const homepageNavItems = [
    { label: "Home", href: homeHref, internal: true },
    { label: "Courses", href: coursesHref, internal: true },
    { label: "Admissions", href: applyHref, internal: true },
    { label: mainWebsiteLabel, href: mainHomeHref, internal: false },
    { label: applyLabel, href: applyHref, internal: true, isButton: true },
  ];

  return (
    <>
      <AppBar
        position={homepage ? "absolute" : "fixed"}
        elevation={homepage ? 0 : 1}
        sx={{
          bgcolor: homepage ? "transparent" : "rgba(255, 255, 255, 0.98)",
          backdropFilter: homepage ? "none" : "blur(10px)",
          color: homepage ? "white" : "text.primary",
          borderBottom: homepage ? 0 : "1px solid",
          borderColor: homepage ? "transparent" : "divider",
          boxShadow: "none",
        }}
      >
        {homepage && (
          <Box sx={{ bgcolor: brand.primary, color: "white", fontSize: 13 }}>
            <Container maxWidth="lg">
              <Box
                sx={{
                  minHeight: { xs: 36, md: 38 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 3 }, minWidth: 0 }}>
                  <Typography sx={{ display: { xs: "none", sm: "inline-flex" }, alignItems: "center", gap: 0.75, fontSize: 13, fontWeight: 700 }}>
                    Virtual Campus
                  </Typography>
                  <Typography sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: 13, whiteSpace: "nowrap" }}>
                    <PhoneInTalkIcon sx={{ fontSize: 16 }} />
                    0723 555 999
                  </Typography>
                  <Typography sx={{ display: { xs: "none", md: "inline-flex" }, alignItems: "center", gap: 0.75, fontSize: 13, whiteSpace: "nowrap" }}>
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    Mon - Sat 8.00 - 18.00
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0 }}>
                  {isAuthenticated ? (
                    <>
                      <Button component={Link} href="/dashboard/" startIcon={<AccountCircleIcon />} sx={{ minWidth: "auto", px: 0, color: "white", fontSize: 13, fontWeight: 700, textTransform: "none" }}>
                        My Account
                      </Button>
                      <Typography sx={{ display: { xs: "none", sm: "block" }, opacity: 0.55 }}>|</Typography>
                      <Button onClick={() => triggerLogout()} startIcon={<LogoutIcon />} sx={{ display: { xs: "none", sm: "inline-flex" }, minWidth: "auto", px: 0, color: "white", fontSize: 13, fontWeight: 700, textTransform: "none" }}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button component={Link} href="/login/" startIcon={<LoginIcon />} sx={{ minWidth: "auto", px: 0, color: "white", fontSize: 13, fontWeight: 700, textTransform: "none" }}>
                        Login
                      </Button>
                      <Typography sx={{ display: { xs: "none", sm: "block" }, opacity: 0.55 }}>|</Typography>
                      <Button component={Link} href={registerHref} sx={{ display: { xs: "none", sm: "inline-flex" }, minWidth: "auto", px: 0, color: "white", fontSize: 13, fontWeight: 700, textTransform: "none" }}>
                        Register
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Container>
          </Box>
        )}

        <Container maxWidth={homepage ? "lg" : "xl"}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              py: homepage ? { xs: 1.5, md: 2.25 } : 1,
              px: { xs: 0 },
              minHeight: homepage ? { xs: 84, md: 110 } : { xs: 78, md: 92 },
              borderBottom: homepage ? "1px solid rgba(255,255,255,0.16)" : 0,
            }}
          >
            {/* Left: Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AiradsLogoLockup
                href={homeHref}
                gap={{ xs: 1.25, sm: 1.5 }}
                crestHeight={homepage ? { xs: 58, sm: 74, md: 82 } : { xs: 54, sm: 66 }}
                headlineColor={homepage ? "white" : brand.accent}
                subheadColor={homepage ? "rgba(255,255,255,0.86)" : brand.primary}
                taglineColor={homepage ? brand.accent : brand.accent}
                headlineFontSize={homepage ? { xs: "1.05rem", sm: "1.3rem", md: "1.45rem" } : { xs: "1rem", sm: "1.2rem" }}
                subheadFontSize={homepage ? { xs: "0.72rem", sm: "0.9rem", md: "1.05rem" } : { xs: "0.75rem", sm: "0.85rem" }}
                taglineFontSize={homepage ? { xs: "0.5rem", sm: "0.65rem", md: "0.72rem" } : { xs: "0.5rem", sm: "0.6rem" }}
              />
            </Box>

            {/* Middle: Search Pill (Desktop) */}
            <Box sx={{ display: { xs: "none", md: homepage ? "none" : "flex" }, flex: 1, maxWidth: 600, mx: 4 }}>
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
                <InputBase
                  placeholder="Search courses, certificates, or short programs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ px: 2, py: 0.5, flex: 1, fontSize: "0.95rem" }}
                />
                <IconButton type="submit" sx={{ p: "8px", bgcolor: brand.primary, color: "white", "&:hover": { bgcolor: brand.secondary }, borderRadius: "50%" }}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>

            {homepage && (
              <Box
                component="nav"
                aria-label="Virtual campus navigation"
                sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3.5, ml: "auto", mr: 3 }}
              >
                {homepageNavItems.map((item) => (
                  <Button
                    key={item.label}
                    component={item.internal ? Link : "a"}
                    href={item.href}
                    variant={item.isButton ? "contained" : "text"}
                    sx={{
                      position: "relative",
                      minWidth: "auto",
                      px: item.isButton ? 2.5 : 0,
                      py: item.isButton ? 0.7 : 0,
                      borderRadius: item.isButton ? 999 : 0,
                      bgcolor: item.isButton ? brand.accent : "transparent",
                      color: "white",
                      fontSize: item.isButton ? "0.82rem" : "0.86rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      boxShadow: item.isButton ? "0 4px 14px rgba(220,37,37,0.35)" : "none",
                      "&:hover": {
                        bgcolor: item.isButton ? "#b81c1c" : "transparent",
                        color: item.isButton ? "white" : brand.accent,
                      },
                      "&::after": item.isButton
                        ? { display: "none" }
                        : {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: -14,
                            height: item.label === "Home" ? 3 : 0,
                            bgcolor: brand.accent,
                          },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right: Links & CTA */}
            <Box sx={{ display: { xs: "none", md: homepage ? "none" : "flex" }, alignItems: "center", gap: 2 }}>
              <Button component="a" href={mainHomeHref} sx={{ color: "text.primary", fontWeight: 600, "&:hover": { color: brand.primary } }}>
                {mainWebsiteLabel}
              </Button>
              <Button component={Link} href={coursesHref} sx={{ color: "text.primary", fontWeight: 600, "&:hover": { color: brand.primary } }}>
                Courses
              </Button>
              {isAuthenticated ? (
                <>
                  <Button component={Link} href="/dashboard/" variant="outlined" sx={{ borderRadius: 8, px: 3, borderColor: brand.primary, color: brand.primary, fontWeight: 600 }}>
                    My Account
                  </Button>
                  <Button onClick={() => triggerLogout()} variant="outlined" sx={{ borderRadius: 8, px: 3, borderColor: brand.primary, color: brand.primary, fontWeight: 600 }}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button component={Link} href="/login/" variant="outlined" sx={{ borderRadius: 8, px: 3, borderColor: brand.primary, color: brand.primary, fontWeight: 600 }}>
                  Login
                </Button>
              )}
              <Button component={Link} href={applyHref} variant="contained" sx={{ borderRadius: 8, px: 3, bgcolor: brand.accent, "&:hover": { bgcolor: "#9a1818" }, fontWeight: 600, boxShadow: "none" }}>
                {applyLabel}
              </Button>
            </Box>

            {homepage && (
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                <IconButton
                  component={Link}
                  href={coursesHref}
                  aria-label="Search courses"
                  sx={{
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.85)",
                    width: 44,
                    height: 44,
                    borderRadius: 0,
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.15)", borderColor: "white" },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            )}

            {/* Mobile Menu Toggle */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton onClick={toggleMobileMenu} sx={{ color: homepage ? "white" : brand.primary }}>
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
              <ListItemButton component="a" href={mainHomeHref} onClick={closeMobileMenu}>
                <ListItemText primary={mobileMainWebsiteLabel} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href={coursesHref} onClick={closeMobileMenu}>
                <ListItemText primary="Courses" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href={applyHref} onClick={closeMobileMenu}>
                <ListItemText primary="Apply Now" />
              </ListItemButton>
            </ListItem>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <Button component={Link} href="/dashboard/" variant="outlined" fullWidth sx={{ borderRadius: 8 }} onClick={closeMobileMenu}>
                    My Account
                  </Button>
                  <Button onClick={() => { closeMobileMenu(); triggerLogout(); }} variant="outlined" fullWidth sx={{ borderRadius: 8 }}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button component={Link} href="/login/" variant="outlined" fullWidth sx={{ borderRadius: 8 }} onClick={closeMobileMenu}>
                  Login
                </Button>
              )}
              <Button component={Link} href={applyHref} variant="contained" fullWidth sx={{ borderRadius: 8, bgcolor: brand.accent }} onClick={closeMobileMenu}>
                {applyLabel}
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
