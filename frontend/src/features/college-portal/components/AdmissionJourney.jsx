import {
    Box,
    Button,
    Chip,
    LinearProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { ADMISSION_STEPS, AIRADS_PORTAL_COLORS } from "./portalDesign";

const AdmissionJourney = () => (
    <Paper
        id="admission"
        component="section"
        elevation={0}
        sx={{
            border: `1px solid ${AIRADS_PORTAL_COLORS.line}`,
            overflow: "hidden",
        }}
    >
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
                px: { xs: 2.25, md: 3 },
                py: 2.5,
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                borderBottom: `1px solid ${AIRADS_PORTAL_COLORS.line}`,
            }}
        >
            <Box>
                <Typography variant="h5" sx={{ color: AIRADS_PORTAL_COLORS.ink, fontWeight: 800 }}>
                    Admission journey
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.4, color: AIRADS_PORTAL_COLORS.muted }}>
                    Follow your application from submission to onboarding.
                </Typography>
            </Box>
            <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ color: AIRADS_PORTAL_COLORS.blue, fontWeight: 800 }}>
                View application
            </Button>
        </Stack>

        <Box sx={{ p: { xs: 2.25, md: 3 } }}>
            <Stack direction="row" sx={{ mb: 1, justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Application progress</Typography>
                <Typography variant="body2" sx={{ color: AIRADS_PORTAL_COLORS.blue, fontWeight: 800 }}>50%</Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={50}
                aria-label="Application progress: 50 percent"
                sx={{
                    height: 7,
                    borderRadius: 99,
                    bgcolor: AIRADS_PORTAL_COLORS.blueSoft,
                    "& .MuiLinearProgress-bar": { bgcolor: AIRADS_PORTAL_COLORS.blue, borderRadius: 99 },
                }}
            />

            <Box sx={{ mt: 3 }}>
                {ADMISSION_STEPS.map((step, index) => {
                    const isComplete = step.state === "complete";
                    const isCurrent = step.state === "current";
                    return (
                        <Box
                            key={step.label}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "36px minmax(0, 1fr)",
                                gap: 1.5,
                                minHeight: index === ADMISSION_STEPS.length - 1 ? 52 : 76,
                                position: "relative",
                            }}
                        >
                            {index < ADMISSION_STEPS.length - 1 ? (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: 17,
                                        top: 34,
                                        bottom: -2,
                                        width: 2,
                                        bgcolor: isComplete ? AIRADS_PORTAL_COLORS.blue : AIRADS_PORTAL_COLORS.line,
                                    }}
                                />
                            ) : null}
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    display: "grid",
                                    placeItems: "center",
                                    zIndex: 1,
                                    bgcolor: isComplete
                                        ? AIRADS_PORTAL_COLORS.blue
                                        : isCurrent
                                          ? AIRADS_PORTAL_COLORS.redSoft
                                          : AIRADS_PORTAL_COLORS.canvas,
                                    border: `2px solid ${isCurrent ? AIRADS_PORTAL_COLORS.red : isComplete ? AIRADS_PORTAL_COLORS.blue : AIRADS_PORTAL_COLORS.line}`,
                                    color: isComplete ? "white" : isCurrent ? AIRADS_PORTAL_COLORS.red : AIRADS_PORTAL_COLORS.muted,
                                    fontWeight: 800,
                                }}
                            >
                                {isComplete ? <CheckRoundedIcon fontSize="small" /> : index + 1}
                            </Box>
                            <Box sx={{ pt: 0.1 }}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    useFlexGap
                                    sx={{ alignItems: "center", flexWrap: "wrap" }}
                                >
                                    <Typography sx={{ color: AIRADS_PORTAL_COLORS.ink, fontWeight: 800, fontSize: "0.92rem" }}>
                                        {step.label}
                                    </Typography>
                                    {isCurrent ? <Chip label="In progress" size="small" sx={{ bgcolor: AIRADS_PORTAL_COLORS.redSoft, color: AIRADS_PORTAL_COLORS.redDark, fontWeight: 800 }} /> : null}
                                </Stack>
                                <Typography variant="body2" sx={{ mt: 0.25, color: AIRADS_PORTAL_COLORS.muted }}>
                                    {step.detail}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <Box
                id="documents"
                sx={{
                    mt: 1.5,
                    p: 2,
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1.5,
                    bgcolor: "#FFF8F8",
                    borderLeft: `4px solid ${AIRADS_PORTAL_COLORS.red}`,
                }}
            >
                <DescriptionOutlinedIcon sx={{ color: AIRADS_PORTAL_COLORS.red }} />
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 800, color: AIRADS_PORTAL_COLORS.ink }}>
                        One document still needs attention
                    </Typography>
                    <Typography variant="body2" sx={{ color: AIRADS_PORTAL_COLORS.muted }}>
                        Upload a clear copy of your national ID or birth certificate.
                    </Typography>
                </Box>
                <Button variant="outlined" sx={{ color: AIRADS_PORTAL_COLORS.redDark, borderColor: "#E9A8AB" }}>
                    Review documents
                </Button>
            </Box>
        </Box>
    </Paper>
);

export default AdmissionJourney;
