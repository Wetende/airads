import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Phone,
  School,
  Send,
} from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";
import { getFlashMessages } from "../../utils/userMessages";

export default function ApplicationApply({
  campuses = [],
  programmes = [],
  educationLevels = [],
  intakes = [],
  applicationContext = {},
}) {
  const brand = usePublicBrand();
  const { props } = usePage();
  const flashMessages = getFlashMessages(props.flash);
  const successMessage = flashMessages.find((message) => message.type === "success")?.message;
  const errorMessage = flashMessages.find((message) => message.type === "error")?.message;
  const isVirtual = applicationContext?.isVirtual;
  const defaultCampus = isVirtual ? campuses[0] : null;

  const { data, setData, post, processing, reset, wasSuccessful } = useForm({
    fullName: "",
    phone: "",
    whatsapp: "",
    email: "",
    campusId: defaultCampus?.id || "",
    programId: "",
    preferredCampus: defaultCampus?.name || "",
    preferredProgramme: "",
    intake: intakes[0] || "",
    educationLevel: "",
    studyMode: applicationContext?.studyMode || "on_campus",
    message: "",
    source: applicationContext?.source || "main_website",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    post(applicationContext?.submitUrl || "/admissions/apply/submit/", {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Head title="Apply Online - AIRADS College" />
      <TopNavbar />
      <MainNavbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ pt: { xs: 15, md: 20 }, pb: { xs: 6, md: 8 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Grid container spacing={5} alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={3}>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 900,
                      color: brand.secondary,
                      fontSize: { xs: "2.4rem", md: "4rem" },
                      lineHeight: 1.05,
                    }}
                  >
                    Apply Online
                  </Typography>
                  <Typography variant="h5" sx={{ color: brand.mutedText, maxWidth: 720, fontWeight: 400 }}>
                    Submit your AIRADS admission request directly to our admissions team.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: brand.secondary }}>
                      <CheckCircle />
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>Stored securely in AIRADS</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: brand.secondary }}>
                      <Phone />
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>Admissions follow-up</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4, bgcolor: "white" }}>
                  <Stack spacing={2}>
                    <School sx={{ color: brand.accent, fontSize: 42 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: brand.neutralText }}>
                      May/June intake is open
                    </Typography>
                    <Typography variant="body1" sx={{ color: brand.mutedText }}>
                      {isVirtual
                        ? "Apply to study through AIRADS Virtual Campus. The team will contact you using the phone number provided."
                        : "Choose your preferred campus and programme. The team will contact you using the phone number provided."}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "white" }}>
          <Container maxWidth="md">
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: brand.neutralText, mb: 1 }}>
                    Applicant Details
                  </Typography>
                  <Typography variant="body1" sx={{ color: brand.mutedText }}>
                    Fields marked with * are required.
                  </Typography>
                </Box>

                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {wasSuccessful && !successMessage && (
                  <Alert severity="success">
                    Your application has been received. Our admissions team will contact you soon.
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Full name *"
                      value={data.fullName}
                      onChange={(event) => setData("fullName", event.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Phone number *"
                      value={data.phone}
                      onChange={(event) => setData("phone", event.target.value)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="WhatsApp number"
                      value={data.whatsapp}
                      onChange={(event) => setData("whatsapp", event.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Email address"
                      type="email"
                      value={data.email}
                      onChange={(event) => setData("email", event.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {isVirtual ? (
                      <TextField
                        label="Campus"
                        value={applicationContext?.lockedCampus || "Virtual Campus"}
                        fullWidth
                        disabled
                      />
                    ) : (
                      <TextField
                        select
                        label="Preferred campus *"
                        value={data.campusId}
                        onChange={(event) => {
                          const selectedCampus = campuses.find((campus) => String(campus.id) === String(event.target.value));
                          setData({
                            ...data,
                            campusId: event.target.value,
                            preferredCampus: selectedCampus?.name || "",
                          });
                        }}
                        required
                        fullWidth
                      >
                        {campuses.map((campus) => (
                          <MenuItem key={campus.id} value={campus.id}>
                            {campus.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Preferred intake"
                      value={data.intake}
                      onChange={(event) => setData("intake", event.target.value)}
                      fullWidth
                    >
                      {intakes.map((intake) => (
                        <MenuItem key={intake} value={intake}>
                          {intake}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Preferred programme *"
                      value={data.programId}
                      onChange={(event) => {
                        if (event.target.value === "__not_sure__") {
                          setData({
                            ...data,
                            programId: "__not_sure__",
                            preferredProgramme: "Not Sure Yet",
                          });
                          return;
                        }
                        const selectedProgramme = programmes.find((programme) => String(programme.id) === String(event.target.value));
                        setData({
                          ...data,
                          programId: event.target.value,
                          preferredProgramme: selectedProgramme?.name || "",
                        });
                      }}
                      required
                      fullWidth
                    >
                      {programmes.map((programme) => (
                        <MenuItem key={programme.id} value={programme.id}>
                          {programme.name}
                        </MenuItem>
                      ))}
                      <MenuItem value="__not_sure__">
                        Not Sure Yet
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      label="Education level"
                      value={data.educationLevel}
                      onChange={(event) => setData("educationLevel", event.target.value)}
                      fullWidth
                    >
                      {educationLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Message"
                      value={data.message}
                      onChange={(event) => setData("message", event.target.value)}
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={processing}
                    startIcon={<Send />}
                    sx={{
                      bgcolor: brand.accent,
                      fontWeight: 800,
                      px: 4,
                      py: 1.5,
                      "&:hover": { bgcolor: brand.accentHover },
                    }}
                  >
                    {processing ? "Submitting..." : "Submit Application"}
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
