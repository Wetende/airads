import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    Box,
    Button,
    Drawer,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import AdmissionJourney from "../components/AdmissionJourney";
import StudentPortalHeader from "../components/StudentPortalHeader";
import StudentPortalSidebar from "../components/StudentPortalSidebar";
import StudentPortalSummary from "../components/StudentPortalSummary";
import { AIRADS_PORTAL_COLORS } from "../components/portalDesign";

const SIDEBAR_WIDTH = 280;

const StudentDashboard = () => {
    const { auth } = usePage().props;
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const studentName = auth?.user?.fullName || auth?.user?.firstName || "Mary Wanjiku";
    const studentEmail = auth?.user?.email || "student@airads.ac.ke";
    const firstName = studentName.split(" ")[0];
    const currentPath = typeof window === "undefined" ? "/college/portal/" : window.location.pathname;

    const sidebar = (
        <StudentPortalSidebar
            currentPath={currentPath}
            onNavigate={() => setMobileNavigationOpen(false)}
        />
    );

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: AIRADS_PORTAL_COLORS.canvas }}>
            <Head title="Student Portal" />

            <Box component="nav" aria-label="Student portal navigation" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileNavigationOpen}
                    onClose={() => setMobileNavigationOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, border: 0 },
                    }}
                >
                    {sidebar}
                </Drawer>
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, border: 0 },
                    }}
                >
                    {sidebar}
                </Drawer>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <StudentPortalHeader
                    studentName={studentName}
                    studentEmail={studentEmail}
                    onOpenNavigation={() => setMobileNavigationOpen(true)}
                />

                <Box
                    component="main"
                    sx={{
                        minHeight: "calc(100vh - 76px)",
                        px: { xs: 2, sm: 3, lg: 4 },
                        py: { xs: 2.5, md: 3.5 },
                        background: `radial-gradient(circle at 90% 3%, rgba(12,90,166,0.08), transparent 26%), ${AIRADS_PORTAL_COLORS.canvas}`,
                    }}
                >
                    <Box sx={{ maxWidth: 1440, mx: "auto" }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            sx={{
                                mb: 2.5,
                                alignItems: { xs: "flex-start", sm: "center" },
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography variant="h4" sx={{ color: AIRADS_PORTAL_COLORS.ink, fontWeight: 800 }}>
                                    Dashboard
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.35, color: AIRADS_PORTAL_COLORS.muted }}>
                                    Wednesday, 22 July 2026
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: AIRADS_PORTAL_COLORS.muted }}>
                                Application ID: <Box component="span" sx={{ color: AIRADS_PORTAL_COLORS.blue, fontWeight: 800 }}>AIR-2026-01482</Box>
                            </Typography>
                        </Stack>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 340px" },
                                gap: 2.5,
                                alignItems: "start",
                            }}
                        >
                            <Stack spacing={2.5}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        minHeight: { xs: 260, md: 285 },
                                        p: { xs: 2.5, sm: 3.5, md: 4 },
                                        display: "flex",
                                        alignItems: "center",
                                        color: "white",
                                        position: "relative",
                                        overflow: "hidden",
                                        background: `linear-gradient(122deg, ${AIRADS_PORTAL_COLORS.navyDeep} 0%, ${AIRADS_PORTAL_COLORS.navy} 55%, ${AIRADS_PORTAL_COLORS.blueBright} 100%)`,
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            inset: "0 auto 0 0",
                                            width: 7,
                                            bgcolor: AIRADS_PORTAL_COLORS.red,
                                        },
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            width: 330,
                                            height: 330,
                                            border: "58px solid rgba(255,255,255,0.055)",
                                            borderRadius: "50%",
                                            right: -100,
                                            top: -180,
                                        },
                                    }}
                                >
                                    <Box sx={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ mb: 2, alignItems: "center" }}
                                        >
                                            <VerifiedUserOutlinedIcon sx={{ color: "#9DD0FF" }} />
                                            <Typography sx={{ color: "#B9DEFF", fontSize: "0.75rem", fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase" }}>
                                                Application received
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            component="h1"
                                            sx={{
                                                fontFamily: '"Bookman Old Style", Georgia, serif',
                                                fontSize: { xs: "2rem", md: "2.65rem" },
                                                fontWeight: 800,
                                                lineHeight: 1.1,
                                            }}
                                        >
                                            Welcome back, {firstName}.
                                        </Typography>
                                        <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.76)", fontSize: { xs: "0.92rem", md: "1rem" }, lineHeight: 1.7, maxWidth: 580 }}>
                                            Your Airads journey has started. We are reviewing your application and will keep every update, request, and next step together here.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            endIcon={<ArrowForwardRoundedIcon />}
                                            href="#admission"
                                            sx={{
                                                mt: 2.5,
                                                bgcolor: AIRADS_PORTAL_COLORS.red,
                                                px: 2.25,
                                                fontWeight: 800,
                                                "&:hover": { bgcolor: AIRADS_PORTAL_COLORS.redDark },
                                            }}
                                        >
                                            Continue application
                                        </Button>
                                    </Box>
                                </Paper>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
                                        gap: 1.5,
                                    }}
                                >
                                    {[
                                        ["Current stage", "Application review", "Admissions"],
                                        ["Documents", "3 of 4 received", "1 action needed"],
                                        ["Preferred intake", "September 2026", "Eldoret Campus"],
                                    ].map(([label, value, note], index) => (
                                        <Paper key={label} elevation={0} sx={{ p: 2.25, border: `1px solid ${AIRADS_PORTAL_COLORS.line}`, borderTop: `3px solid ${index === 1 ? AIRADS_PORTAL_COLORS.red : AIRADS_PORTAL_COLORS.blue}` }}>
                                            <Typography sx={{ color: AIRADS_PORTAL_COLORS.muted, fontSize: "0.69rem", fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</Typography>
                                            <Typography sx={{ mt: 0.8, color: AIRADS_PORTAL_COLORS.ink, fontWeight: 800 }}>{value}</Typography>
                                            <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: index === 1 ? AIRADS_PORTAL_COLORS.redDark : AIRADS_PORTAL_COLORS.muted }}>{note}</Typography>
                                        </Paper>
                                    ))}
                                </Box>

                                <AdmissionJourney />
                            </Stack>

                            <StudentPortalSummary />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default StudentDashboard;
