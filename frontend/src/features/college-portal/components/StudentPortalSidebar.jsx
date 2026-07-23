import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import FolderCopyRoundedIcon from "@mui/icons-material/FolderCopyRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

import {
    AIRADS_PORTAL_COLORS,
    PORTAL_NAVIGATION,
} from "./portalDesign";

const NAVIGATION_ICONS = {
    dashboard: DashboardRoundedIcon,
    admission: AssignmentIndRoundedIcon,
    documents: FolderCopyRoundedIcon,
    messages: ForumRoundedIcon,
    notices: CampaignRoundedIcon,
    help: HelpRoundedIcon,
};

const StudentPortalSidebar = ({ currentPath, onNavigate }) => (
    <Box
        sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            color: AIRADS_PORTAL_COLORS.white,
            background: `linear-gradient(165deg, ${AIRADS_PORTAL_COLORS.navyDeep} 0%, ${AIRADS_PORTAL_COLORS.navy} 64%, #0A477E 100%)`,
        }}
    >
        <Box
            component={Link}
            href="/"
            aria-label="Airads College home"
            sx={{
                minHeight: 84,
                px: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 1.4,
                color: "inherit",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.13)",
            }}
        >
            <Avatar
                src="/static/airads-logo.webp"
                alt="Airads College crest"
                variant="rounded"
                sx={{ width: 48, height: 48, bgcolor: "white", p: 0.45 }}
            />
            <Box>
                <Typography
                    sx={{
                        fontFamily: '"Bookman Old Style", Georgia, serif',
                        fontSize: "1rem",
                        fontWeight: 800,
                        letterSpacing: 0.3,
                    }}
                >
                    AIRADS COLLEGE
                </Typography>
                <Typography
                    sx={{
                        mt: 0.15,
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: "uppercase",
                    }}
                >
                    Student portal
                </Typography>
            </Box>
        </Box>

        <Box sx={{ px: 1.5, py: 2.25 }}>
            <Typography
                variant="overline"
                sx={{ px: 1.5, color: "rgba(255,255,255,0.5)", letterSpacing: 1.4 }}
            >
                My Airads
            </Typography>
            <List disablePadding sx={{ mt: 0.75 }}>
                {PORTAL_NAVIGATION.map((item) => {
                    const Icon = NAVIGATION_ICONS[item.icon];
                    const isActive = item.href === currentPath;

                    return (
                        <ListItemButton
                            key={item.label}
                            component={item.href.startsWith("#") ? "a" : Link}
                            href={item.href}
                            onClick={onNavigate}
                            selected={isActive}
                            sx={{
                                minHeight: 48,
                                px: 1.5,
                                mb: 0.55,
                                borderRadius: 1.5,
                                color: isActive ? "white" : "rgba(255,255,255,0.78)",
                                borderLeft: `3px solid ${isActive ? AIRADS_PORTAL_COLORS.red : "transparent"}`,
                                bgcolor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                                transition: "background-color 180ms ease, color 180ms ease",
                                "&.Mui-selected": {
                                    bgcolor: "rgba(255,255,255,0.12)",
                                },
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.1)",
                                    color: "white",
                                },
                                "&:focus-visible": {
                                    outline: "2px solid white",
                                    outlineOffset: -2,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                                <Icon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                slotProps={{
                                    primary: {
                                        fontSize: "0.93rem",
                                        fontWeight: isActive ? 700 : 500,
                                    },
                                }}
                            />
                            {item.badge ? (
                                <Chip
                                    label={item.badge}
                                    size="small"
                                    sx={{
                                        height: 21,
                                        minWidth: 21,
                                        bgcolor: AIRADS_PORTAL_COLORS.red,
                                        color: "white",
                                        fontWeight: 800,
                                        "& .MuiChip-label": { px: 0.7 },
                                    }}
                                />
                            ) : null}
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>

        <Box sx={{ mt: "auto", p: 2 }}>
            <Box
                sx={{
                    p: 2,
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.07)",
                }}
            >
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                    <SchoolRoundedIcon sx={{ color: "#8EC5FF" }} />
                    <Box>
                        <Typography sx={{ fontSize: "0.82rem", fontWeight: 800 }}>
                            Learning Platform
                        </Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.58)" }}>
                            Available after enrollment
                        </Typography>
                    </Box>
                </Stack>
                <Button
                    component={Link}
                    href="/dashboard/"
                    endIcon={<ArrowOutwardRoundedIcon />}
                    fullWidth
                    sx={{
                        mt: 1.5,
                        color: "white",
                        borderColor: "rgba(255,255,255,0.26)",
                        bgcolor: "rgba(255,255,255,0.06)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.13)" },
                    }}
                    variant="outlined"
                >
                    Open LMS
                </Button>
            </Box>
            <Typography
                sx={{ mt: 2, textAlign: "center", color: "rgba(255,255,255,0.46)", fontSize: "0.68rem" }}
            >
                © 2026 Airads College
            </Typography>
        </Box>
    </Box>
);

StudentPortalSidebar.propTypes = {
    currentPath: PropTypes.string.isRequired,
    onNavigate: PropTypes.func,
};

export default StudentPortalSidebar;
