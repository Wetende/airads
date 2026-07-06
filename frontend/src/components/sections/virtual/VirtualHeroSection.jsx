import { useEffect, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Box, Button, Container, Grid, IconButton, Typography } from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  ArrowForward as ArrowForwardIcon,
  BusinessCenter as BusinessCenterIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Computer as ComputerIcon,
  Engineering as EngineeringIcon,
  MenuBook as MenuBookIcon,
  Videocam as VideocamIcon,
} from "@mui/icons-material";
import { FONT_BODY } from "../../../config";

const HERO_CATEGORIES = [
  "Engineering & ICT",
  "Business Management",
  "Hospitality & Tourism",
  "Medical Health & Social Sciences",
  "Beauty & Hairdressing",
  "Media Studies",
];

const categoryColors = ["#10c45c", "#1ec1d9", "#307ad5", "#eab830", "#d94da6", "#7c3aed"];
const HERO_ACCENT = "#E53935";
const categoryIcons = [
  ComputerIcon,
  BusinessCenterIcon,
  EngineeringIcon,
  AccountBalanceIcon,
  MenuBookIcon,
  VideocamIcon,
];

const heroSlides = [
  {
    kicker: "Learn Anytime, Anywhere With",
    title: "AIRADS Virtual Campus",
    body: "Self-paced online courses with dedicated trainers and 20 years of excellence.",
    image: "/static/computer-virtual-hero.webp",
    position: "center 38%",
  },
  {
    kicker: "AIRADS Is Kenya's",
    title: "Trusted Virtual Campus",
    body: "Flexible online learning and practical skills designed for career-ready professionals.",
    image: "/static/airads-virtual.webp",
    position: "center 18%",
  },
  {
    kicker: "Your Journey To Success",
    title: "Starts Here",
    body: "Study online at your own pace with practical, career-ready TVET programs.",
    image: "/static/health1-main-hero.webp",
    position: "center 46%",
  },
];

function splitCategoryLabel(label) {
  const parts = String(label || "").split("&");
  if (parts.length < 2) return label;
  return `${parts[0].trim()} & ${parts.slice(1).join("&").trim()}`;
}

export default function VirtualHeroSection({ categories = [] }) {
  const { siteContext = {} } = usePage().props;
  const routes = siteContext.routes || {};
  const coursesHref = routes.virtualCourses || "/courses/";
  const applyHref = routes.virtualApply || "/apply/";
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = heroSlides[activeSlide];

  const categoryTiles = useMemo(() => {
    return HERO_CATEGORIES.map((name, index) => {
      const Icon = categoryIcons[index % categoryIcons.length];
      return {
        name,
        Icon,
        color: categoryColors[index % categoryColors.length],
        href: `${coursesHref}?category=${encodeURIComponent(name)}`,
      };
    });
  }, [coursesHref]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % heroSlides.length);
    }, 6200);

    return () => window.clearInterval(timer);
  }, []);

  const goToPreviousSlide = () => {
    setActiveSlide((slide) => (slide - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((slide) => (slide + 1) % heroSlides.length);
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: 720, md: 780 },
        display: "flex",
        alignItems: "center",
        overflow: "visible",
        color: "white",
        bgcolor: "#08142c",
        zIndex: 1,
        mb: { xs: 0, md: 12 },
      }}
    >
      {heroSlides.map((slide, index) => {
        const isActive = index === activeSlide;

        return (
          <Box
            key={slide.title}
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: "opacity 1000ms ease",
              backgroundImage: `linear-gradient(90deg, rgba(8, 20, 44, 0.68) 0%, rgba(12, 30, 62, 0.46) 45%, rgba(8, 20, 44, 0.66) 100%), url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: slide.position,
              transform: isActive ? "scale(1.10)" : "scale(1)",
              transformOrigin: "center",
              animation: isActive ? "virtualHeroKenBurns 6.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" : "none",
              "@keyframes virtualHeroKenBurns": {
                "0%": { transform: "scale(1)" },
                "100%": { transform: "scale(1.10)" },
              },
            }}
          />
        );
      })}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(6, 18, 40, 0.06)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 46%, rgba(8,20,44,0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: { xs: "relative", md: "static" },
          zIndex: 1,
          pt: { xs: 16, md: 15 },
          pb: { xs: 14, md: 18 },
        }}
      >
        <Box
          key={currentSlide.title}
          sx={{
            maxWidth: 980,
            mx: "auto",
            textAlign: "center",
            /* Unique animations per slide */
            "@keyframes kickerDrop": {
              "0%": { opacity: 0, transform: "translateY(-30px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes titleExpand": {
              "0%": { opacity: 0, transform: "scale(0.88)", letterSpacing: "-0.04em" },
              "100%": { opacity: 1, transform: "scale(1)", letterSpacing: "-0.01em" },
            },
            "@keyframes kickerSlideLeft": {
              "0%": { opacity: 0, transform: "translateX(-480px)" },
              "100%": { opacity: 1, transform: "translateX(0)" },
            },
            "@keyframes titleSlideLeft": {
              "0%": { opacity: 0, transform: "translateX(-640px)" },
              "100%": { opacity: 1, transform: "translateX(0)" },
            },
            "@keyframes bodySlideLeft": {
              "0%": { opacity: 0, transform: "translateX(-520px)" },
              "100%": { opacity: 1, transform: "translateX(0)" },
            },
            "@keyframes btnSlideUp": {
              "0%": { opacity: 0, transform: "translateY(75px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes kickerScaleDown": {
              "0%": { opacity: 0, transform: "scale(1.28)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
            "@keyframes titleSpringUp": {
              "0%": { opacity: 0, transform: "translateY(50px) scale(0.92)" },
              "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
            },
            "@keyframes bodyGlideUp": {
              "0%": { opacity: 0, transform: "translateY(22px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
            "@keyframes btnPopIn": {
              "0%": { opacity: 0, transform: "scale(0.85)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          <Typography
            component="p"
            sx={{
              mb: 1.5,
              color: HERO_ACCENT,
              fontFamily: FONT_BODY,
              fontSize: { xs: "1.15rem", sm: "1.65rem", md: "2.35rem" },
              fontWeight: 900,
              lineHeight: 1.15,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              textShadow: "0 10px 26px rgba(0,0,0,0.32)",
              animation:
                activeSlide === 0
                  ? "kickerDrop 650ms cubic-bezier(0.16, 1, 0.3, 1) both"
                  : activeSlide === 1
                  ? "kickerSlideLeft 950ms cubic-bezier(0.16, 1, 0.3, 1) both"
                  : "kickerScaleDown 650ms cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            {currentSlide.kicker}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              mb: 3,
              color: "white",
              fontFamily: FONT_BODY,
              fontSize:
                currentSlide.title === "Trusted Virtual Campus"
                  ? { xs: "2.2rem", sm: "3.2rem", md: "4.2rem" }
                  : { xs: "2.25rem", sm: "3.6rem", md: "4.95rem" },
              fontWeight: 900,
              lineHeight: { xs: 1.08, md: 1.02 },
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              whiteSpace: { md: currentSlide.title === "Trusted Virtual Campus" ? "nowrap" : "normal" },
              textShadow: "0 10px 30px rgba(0,0,0,0.35)",
              animation:
                activeSlide === 0
                  ? "titleExpand 800ms cubic-bezier(0.16, 1, 0.3, 1) 140ms both"
                  : activeSlide === 1
                  ? "titleSlideLeft 1100ms cubic-bezier(0.16, 1, 0.3, 1) 140ms both"
                  : "titleSpringUp 900ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both",
            }}
          >
            {currentSlide.title}
          </Typography>

          <Typography
            sx={{
              mb: 4.5,
              mx: "auto",
              maxWidth: 720,
              color: "rgba(255,255,255,0.88)",
              fontFamily: FONT_BODY,
              fontSize: { xs: "1rem", md: "1.15rem" },
              lineHeight: 1.65,
              animation:
                activeSlide === 1
                  ? "bodySlideLeft 1000ms cubic-bezier(0.16, 1, 0.3, 1) 280ms both"
                  : "bodyGlideUp 700ms cubic-bezier(0.16, 1, 0.3, 1) 280ms both",
            }}
          >
            {currentSlide.body}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2.5,
              flexWrap: "wrap",
              animation:
                activeSlide === 1
                  ? "btnSlideUp 850ms cubic-bezier(0.16, 1, 0.3, 1) 420ms both"
                  : "btnPopIn 650ms cubic-bezier(0.34, 1.56, 0.64, 1) 400ms both",
            }}
          >
            <Button
              component={Link}
              href={coursesHref}
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{
                minHeight: 54,
                px: { xs: 3.5, md: 4.5 },
                color: "white",
                border: "2px solid rgba(255,255,255,0.88)",
                borderRadius: 999,
                fontFamily: FONT_BODY,
                fontSize: "1rem",
                fontWeight: 800,
                textTransform: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: HERO_ACCENT,
                  bgcolor: HERO_ACCENT,
                  color: "white",
                  boxShadow: "0 14px 28px rgba(229,57,53,0.32)",
                },
              }}
            >
              Explore Courses
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: { md: "50%" },
            left: { md: 4 },
            right: { md: 4 },
            display: { xs: "none", md: "flex" },
            justifyContent: "space-between",
            transform: "translateY(-40%)",
            pointerEvents: "none",
          }}
        >
          {[
            { label: "Previous slide", onClick: goToPreviousSlide, Icon: KeyboardArrowLeftIcon },
            { label: "Next slide", onClick: goToNextSlide, Icon: KeyboardArrowRightIcon },
          ].map(({ label, onClick, Icon }) => (
            <IconButton
              key={label}
              aria-label={label}
              onClick={onClick}
              sx={{
                width: 46,
                height: 46,
                color: "white",
                border: "2px solid rgba(255,255,255,0.54)",
                bgcolor: "rgba(5, 15, 34, 0.18)",
                pointerEvents: "auto",
                "&:hover": {
                  bgcolor: HERO_ACCENT,
                  borderColor: HERO_ACCENT,
                },
              }}
            >
              <Icon />
            </IconButton>
          ))}
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: { xs: 118, md: 110 },
            display: "flex",
            gap: 1.25,
            transform: "translateX(-50%)",
            zIndex: 4,
          }}
        >
          {heroSlides.map((slide, index) => (
            <Box
              key={slide.title}
              component="button"
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              sx={{
                width: index === activeSlide ? 34 : 10,
                height: 10,
                p: 0,
                border: 0,
                borderRadius: 999,
                bgcolor: index === activeSlide ? HERO_ACCENT : "rgba(255,255,255,0.72)",
                cursor: "pointer",
                transition: "width 240ms ease, background-color 240ms ease",
              }}
            />
          ))}
        </Box>

        <Grid
          container
          spacing={{ xs: 1.5, md: 2 }}
          sx={{
            position: { xs: "relative", md: "absolute" },
            left: { md: "50%" },
            right: { md: "auto" },
            bottom: { md: -92 },
            width: { md: "calc(100% - 48px)" },
            maxWidth: { md: 1170 },
            transform: { md: "translateX(-50%)" },
            mt: { xs: 7, md: 0 },
            zIndex: 5,
          }}
        >
          {categoryTiles.map(({ name, Icon, color, href }) => (
            <Grid key={name} size={{ xs: 6, sm: 4, md: 2 }}>
              <Box
                component={Link}
                href={href}
                sx={{
                  height: "100%",
                  minHeight: { xs: 140, md: 184 },
                  p: { xs: 2, md: 2.5 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  bgcolor: color,
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 2.5,
                  boxShadow: "0 16px 32px rgba(15, 23, 42, 0.22)",
                  transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 24px 44px rgba(15, 23, 42, 0.32)",
                  },
                }}
              >
                <Icon sx={{ fontSize: { xs: 36, md: 44 }, strokeWidth: 1 }} />
                <Typography
                  component="h3"
                  sx={{
                    maxWidth: 140,
                    color: "white",
                    fontFamily: FONT_BODY,
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    fontWeight: 800,
                    lineHeight: 1.25,
                    textAlign: "center",
                  }}
                >
                  {splitCategoryLabel(name)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
