import { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Box, Button, Container, Grid, InputBase, Typography } from "@mui/material";
import {
  Groups as GroupsIcon,
  LaptopMac as LaptopMacIcon,
  Public as PublicIcon,
  WorkspacePremium as WorkspacePremiumIcon,
} from "@mui/icons-material";
import { useCurrency } from "../../../hooks/useCurrency";
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { FONT_BODY } from "../../../config";
import { resolvePriceDisplay } from "../../../utils/priceDisplay";

const fallbackPrograms = [
  {
    id: "virtual-digital-skills",
    name: "Computer Packages & Digital Skills",
    category: "ICT & Computer Studies",
    thumbnail: "/static/ict.webp",
    publicUrl: "/courses/",
    priceDisplay: { cardDisplay: "free" },
  },
  {
    id: "virtual-business",
    name: "Business Management Online Pathway",
    category: "Business & Management",
    thumbnail: "/static/course-4.webp",
    publicUrl: "/courses/",
    priceDisplay: { cardDisplay: "free" },
  },
  {
    id: "virtual-technical",
    name: "Technical Skills Foundation",
    category: "Engineering & Technical",
    thumbnail: "/static/electrical-1.webp",
    publicUrl: "/courses/",
    priceDisplay: { cardDisplay: "free" },
  },
  {
    id: "virtual-career",
    name: "Career Readiness Short Course",
    category: "Professional Short Courses",
    thumbnail: "/static/course-12.webp",
    publicUrl: "/courses/",
    priceDisplay: { cardDisplay: "free" },
  },
];

const updates = [
  {
    day: "30",
    month: "Jun",
    title: "How to choose a flexible online programme",
    excerpt:
      "Match your schedule, entry level and career target before you commit to a virtual learning pathway.",
    category: "Virtual Campus",
  },
  {
    day: "18",
    month: "Jun",
    title: "Building practical skills from home",
    excerpt:
      "AIRADS virtual learners combine guided content, tutor support and applied assignments for steady progress.",
    category: "Student Support",
  },
  {
    day: "06",
    month: "Jun",
    title: "What to prepare before online registration",
    excerpt:
      "Keep your academic documents, contact details and preferred programme ready for a smoother admission process.",
    category: "Admissions",
  },
];

function getProgramTitle(program) {
  return program?.name || program?.title || "Virtual course";
}

function normalizeProgram(program, fallbackHref) {
  return {
    ...program,
    name: getProgramTitle(program),
    publicUrl: program?.publicUrl || (program?.slug ? `/programs/${program.slug}/` : fallbackHref),
  };
}

function formatPriceLabel(program, formatCurrency) {
  const priceDisplay = resolvePriceDisplay(program);

  if (priceDisplay.showPrice) {
    return priceDisplay.hasDiscount
      ? `${formatCurrency(priceDisplay.price)} ${formatCurrency(priceDisplay.originalPrice)}`
      : formatCurrency(priceDisplay.price);
  }

  if (priceDisplay.showFree) return "Free";

  return "View course";
}

function SpotlightCourseCard({ program }) {
  const brand = usePublicBrand();
  const { formatCurrency } = useCurrency();
  const image = String(program.thumbnail || "/static/images/course-placeholder.svg").replace(/"/g, "%22");
  const priceLabel = formatPriceLabel(program, formatCurrency);

  return (
    <Box
      component={Link}
      href={program.publicUrl}
      sx={{
        position: "relative",
        minHeight: 230,
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        p: 2,
        color: "white",
        textDecoration: "none",
        borderRadius: 1,
        backgroundImage: `linear-gradient(180deg, rgba(8, 18, 38, 0.05) 0%, rgba(8, 18, 38, 0.9) 100%), url("${image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 20px 38px rgba(10, 24, 54, 0.24)",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 26px 48px rgba(10, 24, 54, 0.3)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          px: 1,
          py: 0.35,
          bgcolor: brand.accent,
          color: "white",
          borderRadius: 0.5,
          fontFamily: FONT_BODY,
          fontSize: "0.67rem",
          fontWeight: 900,
          textTransform: "uppercase",
        }}
      >
        Online
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography sx={{ mb: 0.45, color: "rgba(255,255,255,0.72)", fontSize: "0.75rem", fontWeight: 700 }}>
          {program.category || "Virtual Campus"}
        </Typography>
        <Typography
          component="h3"
          sx={{
            mb: 0.75,
            color: "white",
            fontFamily: FONT_BODY,
            fontSize: "0.95rem",
            fontWeight: 900,
            lineHeight: 1.16,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {program.name}
        </Typography>
        <Typography sx={{ color: priceLabel === "Free" ? "#ffffff" : "#60a5fa", fontSize: "0.8rem", fontWeight: 900 }}>
          {priceLabel}
        </Typography>
      </Box>
    </Box>
  );
}

export default function VirtualHomepageStorySections({ programs = [] }) {
  const brand = usePublicBrand();
  const { siteContext = {} } = usePage().props;
  const routes = siteContext.routes || {};
  const coursesHref = routes.virtualCourses || "/courses/";
  const applyHref = routes.virtualApply || "/apply/";

  const featuredPrograms = useMemo(() => {
    const normalized = Array.isArray(programs)
      ? programs.filter((program) => getProgramTitle(program)).slice(0, 4).map((program) => normalizeProgram(program, coursesHref))
      : [];

    return [...normalized, ...fallbackPrograms.map((program) => normalizeProgram({ ...program, publicUrl: coursesHref }, coursesHref))].slice(0, 4);
  }, [coursesHref, programs]);

  const stats = [
    { icon: PublicIcon, value: "6", label: "Campus networks" },
    { icon: LaptopMacIcon, value: "24/7", label: "Online access" },
    { icon: GroupsIcon, value: "12k+", label: "Learners supported" },
    { icon: WorkspacePremiumIcon, value: "TVETA", label: "Approved training" },
  ];

  return (
    <>
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 13 },
          color: "white",
          backgroundImage:
            "linear-gradient(90deg, rgba(15,23,42,0.76), rgba(15,23,42,0.64)), url('/static/achievement-hero.webp')",
          backgroundAttachment: { md: "fixed" },
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mx: "auto", mb: { xs: 5, md: 7 }, maxWidth: 760, textAlign: "center" }}>
            <Typography
              component="h2"
              sx={{
                mb: 2,
                color: "white",
                fontFamily: FONT_BODY,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              Virtual Campus Achievements
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: { xs: "0.98rem", md: "1.05rem" } }}>
              Practical digital learning backed by AIRADS trainers, admissions support and career-focused programmes.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 5 }}>
            {stats.map(({ icon: Icon, value, label }) => (
              <Grid key={label} size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Icon sx={{ mb: 2, color: "rgba(255,255,255,0.86)", fontSize: { xs: 38, md: 52 } }} />
                  <Typography sx={{ color: brand.accent, fontFamily: FONT_BODY, fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 900, lineHeight: 1 }}>
                    {value}
                  </Typography>
                  <Typography sx={{ mt: 1.25, color: "rgba(255,255,255,0.72)", fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase" }}>
                    {label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 7, md: 8 },
          bgcolor: "#0a162e",
          color: "white",
          "&::before": {
            content: '""',
            position: "absolute",
            right: { xs: -120, md: 20 },
            top: { xs: 40, md: 30 },
            width: { xs: 260, md: 460 },
            height: { xs: 180, md: 320 },
            background:
              `linear-gradient(135deg, transparent 0%, transparent 34%, rgba(255,255,255,0.06) 34%, rgba(255,255,255,0.06) 40%, transparent 40%, transparent 54%, ${brand.accent} 54%, ${brand.accent} 60%, transparent 60%, transparent 100%)`,
            opacity: 0.9,
            transform: "rotate(-8deg)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "inline-flex", mb: 2, px: 1.2, py: 0.55, bgcolor: brand.accent, color: "white", fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase" }}>
                Virtual mentor spotlight
              </Box>
              <Typography
                component="h2"
                sx={{
                  mb: 1,
                  fontFamily: FONT_BODY,
                  fontSize: { xs: "2rem", md: "3.1rem" },
                  fontWeight: 900,
                  lineHeight: 1.08,
                }}
              >
                AIRADS Online Learning Team
              </Typography>
              <Typography sx={{ mb: 3, fontWeight: 900, color: "#ff6b6b" }}>
                Guided support for flexible study
              </Typography>
              <Typography sx={{ maxWidth: 580, color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
                Our virtual campus connects learners with programme guidance, course support and practical assessment pathways, so online study still feels personal and accountable.
              </Typography>
              <Button
                component={Link}
                href={applyHref}
                variant="contained"
                sx={{
                  mt: 3.5,
                  bgcolor: brand.accent,
                  borderRadius: 999,
                  px: 4,
                  py: 1.25,
                  fontWeight: 900,
                  textTransform: "none",
                  boxShadow: "0 10px 24px rgba(220, 37, 37, 0.35)",
                  "&:hover": { bgcolor: brand.accentHover },
                }}
              >
                Start Application
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                loading="lazy"
                src="/static/ceo-min.webp"
                alt="AIRADS virtual learning team support"
                sx={{
                  width: "100%",
                  maxHeight: 460,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: { xs: 5, md: 6 } }}>
            <Typography sx={{ mb: 2, color: "rgba(255,255,255,0.92)", fontSize: "0.76rem", fontWeight: 900, textTransform: "uppercase" }}>
              Featured virtual courses:
            </Typography>
            <Grid container spacing={2}>
              {featuredPrograms.map((program) => (
                <Grid key={program.id || program.name} size={{ xs: 12, sm: 6, md: 3 }}>
                  <SpotlightCourseCard program={program} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 4, md: 5 }, bgcolor: brand.primary, color: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ mb: 1, fontFamily: FONT_BODY, fontSize: { xs: "1.35rem", md: "1.65rem" }, fontWeight: 900 }}>
                Subscribe to virtual campus updates
              </Typography>
              <Typography sx={{ maxWidth: 620, color: "rgba(255,255,255,0.76)", fontSize: "0.95rem" }}>
                Get admissions reminders, online-course updates and student support notices from AIRADS.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="form"
                onSubmit={(event) => event.preventDefault()}
                sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 0 }}
              >
                <InputBase
                  type="email"
                  placeholder="Enter your E-mail"
                  inputProps={{ "aria-label": "Email address" }}
                  sx={{
                    flex: 1,
                    minHeight: 48,
                    px: 2,
                    bgcolor: "white",
                    color: brand.neutralText,
                    borderRadius: { xs: 1, sm: "8px 0 0 8px" },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    minHeight: 48,
                    px: 3,
                    bgcolor: brand.secondary,
                    borderRadius: { xs: 1, sm: "0 8px 8px 0" },
                    fontWeight: 900,
                    textTransform: "uppercase",
                    boxShadow: "none",
                    "&:hover": { bgcolor: brand.accent },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: { xs: 5, md: 8 }, textAlign: "center" }}>
            <Typography
              component="h2"
              sx={{
                mb: 1.5,
                color: brand.neutralText,
                fontFamily: FONT_BODY,
                fontSize: { xs: "1.9rem", md: "2.45rem" },
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              Virtual Campus Blog
            </Typography>
            <Box sx={{ mx: "auto", width: 78, height: 3, bgcolor: brand.accent }} />
          </Box>

          <Grid container spacing={{ xs: 4, md: 5 }}>
            {updates.map((update) => (
              <Grid key={update.title} size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: "flex", gap: 2.25, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: 54,
                      flexShrink: 0,
                      border: `2px solid ${brand.accent}`,
                      color: brand.accent,
                      textAlign: "center",
                      borderRadius: 0.5,
                      overflow: "hidden",
                    }}
                  >
                    <Typography sx={{ py: 0.45, fontSize: "1.25rem", fontWeight: 900, lineHeight: 1 }}>
                      {update.day}
                    </Typography>
                    <Typography sx={{ py: 0.35, bgcolor: brand.accent, color: "white", fontSize: "0.67rem", fontWeight: 900, textTransform: "uppercase" }}>
                      {update.month}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      component={Link}
                      href="/news/"
                      sx={{
                        display: "block",
                        mb: 1,
                        color: brand.neutralText,
                        fontFamily: FONT_BODY,
                        fontSize: "1rem",
                        fontWeight: 900,
                        lineHeight: 1.25,
                        textDecoration: "none",
                        "&:hover": { color: brand.primary },
                      }}
                    >
                      {update.title}
                    </Typography>
                    <Typography sx={{ mb: 1.2, color: brand.mutedText, fontSize: "0.9rem", lineHeight: 1.6 }}>
                      {update.excerpt}
                    </Typography>
                    <Typography sx={{ color: brand.primary, fontSize: "0.76rem", fontWeight: 800 }}>
                      Posted in: {update.category}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
