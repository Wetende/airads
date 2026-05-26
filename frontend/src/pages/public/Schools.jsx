import { Head, Link } from "@inertiajs/react";
import { ArrowForward, CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import Footer from "../../components/common/AIRADSFooter";
import MainNavbar from "../../components/common/MainNavbar";
import TopNavbar from "../../components/common/TopNavbar";
import { FONT_HEADING, FONT_BODY } from "../../config";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import { trainingPathways } from "./schools/pathwayData";

const Schools = () => {
  const brand = usePublicBrand();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <Head title="AIRADS Schools & Courses - AIRADS College" />
      <TopNavbar />
      <MainNavbar />

      <Box component="main" sx={{ flexGrow: 1, mt: { xs: 8, md: 12 } }}>
        <Box
          component="section"
          sx={{
            py: { xs: 7, md: 10 },
            color: "white",
            backgroundImage: "linear-gradient(90deg, rgba(15,23,42,0.92), rgba(30,58,138,0.78)), url(/static/course-12.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="overline"
              sx={{
                display: "block",
                color: brand.accent,
                fontFamily: FONT_BODY,
                fontWeight: 800,
                letterSpacing: 1.8,
                mb: 1.5,
              }}
            >
              Programmes and course families
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontFamily: FONT_HEADING,
                fontWeight: 900,
                fontSize: { xs: "2.4rem", md: "4rem" },
                lineHeight: 1.08,
                letterSpacing: 0,
                maxWidth: 820,
                mb: 3,
              }}
            >
              AIRADS Schools & Courses
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 760, color: "rgba(255,255,255,0.88)", lineHeight: 1.75, fontWeight: 400 }}>
              Choose the AIRADS school or course area that matches your goal. TVET/CDACC now brings the individual schools together, while professional, trade, digital, and driving options remain easy to find.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.85fr 1.15fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "start",
              mb: { xs: 6, md: 8 },
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ fontFamily: FONT_HEADING, fontWeight: 900, color: brand.secondary, mb: 2, fontSize: { xs: "1.9rem", md: "2.55rem" } }}>
                Find the right starting point
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
                Explore AIRADS schools and course areas the way students actually search: technical TVET programmes, professional qualifications, trade skills, short courses, computer packages, and driving school.
              </Typography>
            </Box>
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {["TVET/CDACC groups the AIRADS schools in one detailed page", "NITA stays as a dedicated practical trade pathway", "Short courses, computer packages, KASNEB, and driving school each get their own page"].map((item) => (
                <Box key={item} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <CheckCircle sx={{ color: brand.primary, fontSize: 22, flexShrink: 0 }} />
                  <Typography sx={{ fontWeight: 700, color: brand.neutralText }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
              gap: 3,
            }}
          >
            {trainingPathways.map((pathway) => (
              <Card
                key={pathway.title}
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid rgba(148, 163, 184, 0.24)",
                  boxShadow: "0 16px 34px rgba(15, 23, 42, 0.08)",
                }}
              >
                <CardActionArea component={Link} href={pathway.href} sx={{ height: "100%", display: "block" }}>
                  <Box
                    sx={{
                      height: 190,
                      backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.58)), url(${pathway.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Chip label={pathway.eyebrow} size="small" sx={{ fontWeight: 800, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontFamily: FONT_HEADING, fontWeight: 900, color: brand.secondary, mb: 1 }}>
                      {pathway.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
                      {pathway.description}
                    </Typography>
                    <Button
                      component="span"
                      endIcon={<ArrowForward />}
                      sx={{
                        color: brand.accent,
                        p: 0,
                        fontWeight: 900,
                        textTransform: "none",
                        "&:hover": { bgcolor: "transparent", color: brand.accentHover },
                      }}
                    >
                      Explore pathway
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Schools;
