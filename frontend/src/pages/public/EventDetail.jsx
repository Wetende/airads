import { useMemo } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import DOMPurify from "dompurify";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  CalendarMonth,
  CheckCircleOutlined,
  Launch,
  LocationOn,
  Schedule,
} from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";
import { usePublicBrand } from "../../hooks/usePublicBrand";

const formatEventDate = (value, options) => {
  if (!value) return "To be confirmed";
  return new Intl.DateTimeFormat(undefined, options).format(new Date(value));
};

const EventFact = ({ icon: Icon, label, children, color }) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        color,
        bgcolor: `${color}12`,
        flexShrink: 0,
      }}
    >
      <Icon fontSize="small" />
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25, lineHeight: 1.5 }}>
        {children}
      </Typography>
    </Box>
  </Stack>
);

export default function EventDetail({ event, isRegistered = false }) {
  const brand = usePublicBrand();
  const { auth } = usePage().props;
  const safeDescription = useMemo(
    () => DOMPurify.sanitize(event.description || ""),
    [event.description],
  );
  const safeOutcomes = useMemo(
    () => DOMPurify.sanitize(event.what_you_learn_html || ""),
    [event.what_you_learn_html],
  );
  const startsAt = new Date(event.start_date);
  const hasStarted = Number.isFinite(startsAt.getTime()) && startsAt <= new Date();

  const handleRegistration = () => {
    router.post(`/events/${event.slug}/join/`, {}, { preserveScroll: true });
  };

  const registrationAction = () => {
    if (isRegistered) {
      return (
        <Button fullWidth variant="outlined" startIcon={<CheckCircleOutlined />} disabled>
          You are registered
        </Button>
      );
    }

    if (event.external_url) {
      return (
        <Button
          fullWidth
          component="a"
          href={event.external_url}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          endIcon={<Launch />}
        >
          Open registration
        </Button>
      );
    }

    if (!auth?.user) {
      return (
        <Button
          fullWidth
          component={Link}
          href={`/login/?next=${encodeURIComponent(`/events/${event.slug}/`)}`}
          variant="contained"
        >
          Sign in to register
        </Button>
      );
    }

    return (
      <Button fullWidth variant="contained" onClick={handleRegistration}>
        Register for this event
      </Button>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Head title={`${event.title} - Events`} />
      <TopNavbar />
      <MainNavbar />

      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 13, md: 16 }, pb: { xs: 7, md: 11 } }}>
        <Container maxWidth="lg">
          <Button component={Link} href="/events/" startIcon={<ArrowBack />} sx={{ mb: 3 }}>
            All events
          </Button>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Chip
                label={hasStarted ? "Event details" : "Upcoming event"}
                size="small"
                sx={{ bgcolor: brand.softBlue, color: brand.primary, fontWeight: 700, mb: 2 }}
              />
              <Typography
                component="h1"
                sx={{
                  color: brand.secondary,
                  fontWeight: 900,
                  fontSize: { xs: "2.2rem", md: "3.5rem" },
                  lineHeight: 1.08,
                  letterSpacing: "-0.035em",
                  maxWidth: 820,
                }}
              >
                {event.title}
              </Typography>

              <Box
                component="img"
                src={event.image || "/static/images/course-placeholder.jpg"}
                alt=""
                sx={{
                  width: "100%",
                  aspectRatio: { xs: "4 / 3", sm: "16 / 9" },
                  objectFit: "cover",
                  borderRadius: 3,
                  mt: 4,
                  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.14)",
                }}
              />

              {safeDescription && (
                <Box
                  sx={{
                    mt: 5,
                    color: "text.primary",
                    fontSize: "1.05rem",
                    lineHeight: 1.8,
                    "& p": { mb: 2 },
                    "& img": { maxWidth: "100%", borderRadius: 2 },
                    "& a": { color: brand.primary },
                  }}
                  dangerouslySetInnerHTML={{ __html: safeDescription }}
                />
              )}

              {(safeOutcomes || event.what_you_learn?.length > 0) && (
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h4" component="h2" sx={{ color: brand.secondary, fontWeight: 800, mb: 2 }}>
                    What to expect
                  </Typography>
                  {safeOutcomes ? (
                    <Box
                      sx={{
                        lineHeight: 1.75,
                        color: "text.secondary",
                        "& ul, & ol": { pl: 3 },
                        "& li": { mb: 1 },
                      }}
                      dangerouslySetInnerHTML={{ __html: safeOutcomes }}
                    />
                  ) : (
                    <Stack component="ul" spacing={1} sx={{ pl: 3, color: "text.secondary" }}>
                      {event.what_you_learn.map((item) => <li key={item}>{item}</li>)}
                    </Stack>
                  )}
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                component="aside"
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 3,
                  position: { md: "sticky" },
                  top: { md: 124 },
                  borderColor: brand.borderBlue,
                  boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
                }}
              >
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: brand.secondary, mb: 3 }}>
                  Event information
                </Typography>
                <Stack spacing={2.5}>
                  <EventFact icon={CalendarMonth} label="DATE" color={brand.primary}>
                    {formatEventDate(event.start_date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </EventFact>
                  <EventFact icon={Schedule} label="TIME" color={brand.primary}>
                    {formatEventDate(event.start_date, { hour: "numeric", minute: "2-digit" })}
                    {event.end_date ? ` – ${formatEventDate(event.end_date, { hour: "numeric", minute: "2-digit" })}` : ""}
                  </EventFact>
                  <EventFact icon={LocationOn} label="LOCATION" color={brand.primary}>
                    {event.location || "To be confirmed"}
                  </EventFact>
                </Stack>
                <Divider sx={{ my: 3 }} />
                {registrationAction()}
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, textAlign: "center" }}>
                  {event.external_url
                    ? "Registration continues on the organiser’s website."
                    : "Your registration is saved to your account."}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
