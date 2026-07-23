import { Link } from "@inertiajs/react";
import {
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

import { AIRADS_PORTAL_COLORS, PORTAL_NOTICES } from "./portalDesign";

const DetailRow = ({ label, value }) => (
    <Box>
        <Typography sx={{ color: AIRADS_PORTAL_COLORS.muted, fontSize: "0.68rem", fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase" }}>
            {label}
        </Typography>
        <Typography sx={{ mt: 0.35, color: AIRADS_PORTAL_COLORS.ink, fontSize: "0.86rem", fontWeight: 700 }}>
            {value}
        </Typography>
    </Box>
);

const StudentPortalSummary = () => (
    <Stack spacing={2.25}>
        <Paper elevation={0} sx={{ border: `1px solid ${AIRADS_PORTAL_COLORS.line}`, overflow: "hidden" }}>
            <Box sx={{ px: 2.5, py: 2, bgcolor: AIRADS_PORTAL_COLORS.navy, color: "white" }}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                        <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
                            Application
                        </Typography>
                        <Typography sx={{ mt: 0.25, fontWeight: 800 }}>AIR-2026-01482</Typography>
                    </Box>
                    <Chip label="Under review" size="small" sx={{ bgcolor: AIRADS_PORTAL_COLORS.red, color: "white", fontWeight: 800 }} />
                </Stack>
            </Box>
            <Stack spacing={2} sx={{ p: 2.5 }}>
                <DetailRow label="Programme" value="Diploma in Information Communication Technology" />
                <Divider />
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <DetailRow label="Campus" value="Eldoret" />
                    <DetailRow label="Intake" value="September 2026" />
                </Box>
            </Stack>
        </Paper>

        <Paper id="notices" elevation={0} sx={{ p: 2.5, border: `1px solid ${AIRADS_PORTAL_COLORS.line}` }}>
            <Stack
                direction="row"
                sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}
            >
                <Typography variant="h6" sx={{ color: AIRADS_PORTAL_COLORS.ink, fontWeight: 800 }}>Notices</Typography>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon />} sx={{ color: AIRADS_PORTAL_COLORS.blue }}>View all</Button>
            </Stack>
            <Stack spacing={2}>
                {PORTAL_NOTICES.map((notice) => (
                    <Stack
                        key={notice.title}
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "flex-start" }}
                    >
                        <Box sx={{ width: 48, flexShrink: 0, py: 0.7, textAlign: "center", bgcolor: AIRADS_PORTAL_COLORS.blueSoft, color: AIRADS_PORTAL_COLORS.blue, borderRadius: 1 }}>
                            <EventNoteRoundedIcon sx={{ fontSize: 17 }} />
                            <Typography sx={{ fontSize: "0.62rem", fontWeight: 800 }}>{notice.date}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ color: AIRADS_PORTAL_COLORS.ink, fontSize: "0.84rem", fontWeight: 800, lineHeight: 1.35 }}>
                                {notice.title}
                            </Typography>
                            <Typography sx={{ mt: 0.35, color: AIRADS_PORTAL_COLORS.redDark, fontSize: "0.68rem", fontWeight: 700 }}>
                                {notice.category}
                            </Typography>
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </Paper>

        <Paper
            id="help"
            elevation={0}
            sx={{
                p: 2.5,
                color: "white",
                background: `linear-gradient(135deg, ${AIRADS_PORTAL_COLORS.redDark}, ${AIRADS_PORTAL_COLORS.red})`,
                position: "relative",
                overflow: "hidden",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.1)",
                    right: -38,
                    bottom: -58,
                },
            }}
        >
            <HeadsetMicRoundedIcon sx={{ fontSize: 30 }} />
            <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 800 }}>Need help?</Typography>
            <Typography variant="body2" sx={{ mt: 0.6, color: "rgba(255,255,255,0.8)", maxWidth: 260 }}>
                The Admissions team is available to guide you through your application.
            </Typography>
            <Button
                id="messages"
                sx={{ mt: 2, bgcolor: "white", color: AIRADS_PORTAL_COLORS.redDark, fontWeight: 800, "&:hover": { bgcolor: "#FFF1F1" } }}
                variant="contained"
            >
                Message Admissions
            </Button>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, border: `1px solid ${AIRADS_PORTAL_COLORS.line}`, bgcolor: AIRADS_PORTAL_COLORS.blueSoft }}>
            <SchoolRoundedIcon sx={{ color: AIRADS_PORTAL_COLORS.blue }} />
            <Typography sx={{ mt: 1, color: AIRADS_PORTAL_COLORS.ink, fontWeight: 800 }}>Learning Platform</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: AIRADS_PORTAL_COLORS.muted }}>
                Your courses will appear in the LMS once onboarding is complete.
            </Typography>
            <Button component={Link} href="/dashboard/" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 1.25, px: 0, color: AIRADS_PORTAL_COLORS.blue, fontWeight: 800 }}>
                Open LMS
            </Button>
        </Paper>
    </Stack>
);

export default StudentPortalSummary;
