import { Head, Link } from "@inertiajs/react";
import {
  ArrowForward,
  CheckCircle,
  MailOutlined,
  Phone,
  WhatsApp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Footer from "../../../components/common/AIRADSFooter";
import MainNavbar from "../../../components/common/MainNavbar";
import TopNavbar from "../../../components/common/TopNavbar";
import { FONT_HEADING, FONT_BODY } from "../../../config";
import { usePublicBrand } from "../../../hooks/usePublicBrand";

const applyHref = "/admissions/procedure/";

const DetailCard = ({ item }) => {
  const content = (
    <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
        <Chip label={item.meta} size="small" sx={{ fontWeight: 700 }} />
      </Stack>
      <Typography variant="h6" sx={{ fontFamily: FONT_HEADING, fontWeight: 800, mb: 1 }}>
        {item.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, flexGrow: 1 }}>
        {item.description}
      </Typography>
    </CardContent>
  );

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid rgba(148, 163, 184, 0.24)",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      {item.href ? (
        <CardActionArea component={Link} href={item.href} sx={{ height: "100%" }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};

const SchoolCard = ({ school }) => (
  <Card
    id={school.anchor}
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: 2,
      overflow: "hidden",
      border: "1px solid rgba(148, 163, 184, 0.22)",
      boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)",
    }}
  >
    <CardActionArea component={Link} href={school.href} sx={{ height: "100%", display: "block" }}>
      <Box sx={{ height: 168, position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.58)), url(${school.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform 0.4s ease",
            ".MuiCardActionArea-root:hover &": { transform: "scale(1.06)" },
          }}
        />
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontFamily: FONT_HEADING, fontWeight: 800, mb: 1 }}>
          {school.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          {school.description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {school.programmes.map((programme) => (
            <Chip key={programme} label={programme} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

const PathwayPageLayout = ({ page }) => {
  const brand = usePublicBrand();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <Head title={page.headTitle} />
      <TopNavbar />
      <MainNavbar />

      <Box
        component="section"
        sx={{
          mt: { xs: 8, md: 12 },
          minHeight: { xs: 420, md: 500 },
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          color: "white",
          backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.86), rgba(15,23,42,0.48)), url(${page.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ maxWidth: 820 }}>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                mb: 1.5,
                fontFamily: FONT_BODY,
                fontWeight: 800,
                letterSpacing: 1.8,
                color: brand.accent,
              }}
            >
              {page.kicker}
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontFamily: FONT_HEADING,
                fontSize: { xs: "2.45rem", md: "4rem" },
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: 0,
                mb: 3,
              }}
            >
              {page.title}
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 760, lineHeight: 1.75, fontWeight: 400, color: "rgba(255,255,255,0.9)" }}>
              {page.summary}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
              gap: { xs: 4, md: 7 },
              alignItems: "start",
              mb: { xs: 6, md: 9 },
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 900,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  color: brand.secondary,
                  mb: 2,
                }}
              >
                {page.introTitle}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85, fontSize: "1.02rem" }}>
                {page.intro}
              </Typography>
            </Box>
            <Box
              sx={{
                borderLeft: { md: `4px solid ${brand.accent}` },
                pl: { md: 3 },
                display: "grid",
                gap: 1.5,
              }}
            >
              {page.highlights.map((highlight) => (
                <Box key={highlight} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <CheckCircle sx={{ color: brand.primary, fontSize: 22, flexShrink: 0 }} />
                  <Typography sx={{ fontWeight: 700, color: brand.neutralText }}>{highlight}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONT_HEADING,
                fontWeight: 900,
                color: brand.secondary,
                mb: 1,
              }}
            >
              {page.cardsTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.7, maxWidth: 780 }}>
              {page.cardsIntro}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
              gap: 3,
              mb: page.schoolCards ? { xs: 7, md: 10 } : { xs: 6, md: 8 },
            }}
          >
            {page.cards.map((item) => (
              <DetailCard key={item.title} item={item} />
            ))}
          </Box>

          {page.schoolCards ? (
            <Box sx={{ mb: { xs: 7, md: 10 } }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 900,
                    color: brand.secondary,
                    mb: 1,
                  }}
                >
                  Schools under TVET/CDACC
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.7, maxWidth: 820 }}>
                  The individual schools now sit here, where learners can compare technical pathways before opening a detailed school page.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
                  gap: 3,
                }}
              >
                {page.schoolCards.map((school) => (
                  <SchoolCard key={school.title} school={school} />
                ))}
              </Box>
            </Box>
          ) : null}

          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid rgba(148, 163, 184, 0.22)",
              p: { xs: 3, md: 5 },
              mb: { xs: 6, md: 8 },
            }}
          >
            <Typography variant="h5" sx={{ fontFamily: FONT_HEADING, fontWeight: 900, color: brand.secondary, mb: 3 }}>
              {page.outcomesTitle}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                gap: 2,
              }}
            >
              {page.outcomes.map((outcome) => (
                <Box key={outcome} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
                  <CheckCircle sx={{ color: brand.accent, fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                  <Typography sx={{ fontWeight: 700, color: brand.neutralText }}>{outcome}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: brand.secondary,
              color: "white",
              borderRadius: 2,
              p: { xs: 3, md: 5 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontFamily: FONT_HEADING, fontWeight: 900, mb: 1.5 }}>
                {page.ctaTitle}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.86)", lineHeight: 1.7, maxWidth: 760 }}>
                {page.ctaText}
              </Typography>
              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.18)" }} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone fontSize="small" />
                  <Typography variant="body2">+254 723 555 999</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WhatsApp fontSize="small" />
                  <Typography variant="body2">WhatsApp admissions</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MailOutlined fontSize="small" />
                  <Typography variant="body2">info@airads.ac.ke</Typography>
                </Stack>
              </Stack>
            </Box>
            <Button
              component={Link}
              href={applyHref}
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: brand.accent,
                color: "white",
                fontWeight: 900,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: brand.accentHover },
              }}
            >
              {page.ctaLabel}
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default PathwayPageLayout;
