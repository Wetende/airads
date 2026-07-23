import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import useLogout from "@/hooks/useLogout";
import { AIRADS_PORTAL_COLORS } from "./portalDesign";

const StudentPortalHeader = ({ studentName, studentEmail, onOpenNavigation }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const closeMenu = () => setMenuAnchor(null);
    const logout = useLogout({ onBefore: closeMenu });
    const initial = studentName?.trim()?.[0]?.toUpperCase() || "S";

    return (
        <AppBar
            position="sticky"
            elevation={0}
            color="inherit"
            sx={{
                bgcolor: "rgba(255,255,255,0.94)",
                backdropFilter: "blur(16px)",
                borderBottom: `1px solid ${AIRADS_PORTAL_COLORS.line}`,
            }}
        >
            <Toolbar sx={{ minHeight: { xs: 68, md: 76 }, px: { xs: 2, md: 3.5 } }}>
                <IconButton
                    aria-label="Open portal navigation"
                    onClick={onOpenNavigation}
                    sx={{ display: { md: "none" }, mr: 1, color: AIRADS_PORTAL_COLORS.navy }}
                >
                    <MenuRoundedIcon />
                </IconButton>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: AIRADS_PORTAL_COLORS.red,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: 1.4,
                            textTransform: "uppercase",
                        }}
                    >
                        Student portal
                    </Typography>
                    <Typography
                        sx={{
                            color: AIRADS_PORTAL_COLORS.ink,
                            fontFamily: '"Bookman Old Style", Georgia, serif',
                            fontSize: { xs: "1rem", md: "1.15rem" },
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        My Airads
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={{ xs: 0.5, sm: 1.25 }}
                    sx={{ alignItems: "center" }}
                >
                    <Tooltip title="Notifications">
                        <IconButton
                            aria-label="View notifications, 2 unread"
                            sx={{ color: AIRADS_PORTAL_COLORS.navy }}
                        >
                            <Badge badgeContent={2} color="error">
                                <NotificationsNoneRoundedIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" }, mx: 0.5 }} />
                    <Box
                        component="button"
                        type="button"
                        onClick={(event) => setMenuAnchor(event.currentTarget)}
                        aria-label="Open student account menu"
                        aria-haspopup="menu"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            border: 0,
                            p: 0.5,
                            borderRadius: 1.5,
                            bgcolor: "transparent",
                            color: AIRADS_PORTAL_COLORS.ink,
                            cursor: "pointer",
                            "&:hover": { bgcolor: AIRADS_PORTAL_COLORS.blueSoft },
                            "&:focus-visible": { outline: `2px solid ${AIRADS_PORTAL_COLORS.blue}` },
                        }}
                    >
                        <Avatar sx={{ width: 36, height: 36, bgcolor: AIRADS_PORTAL_COLORS.blue, fontWeight: 800 }}>
                            {initial}
                        </Avatar>
                        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, maxWidth: 170 }} noWrap>
                                {studentName}
                            </Typography>
                            <Typography sx={{ color: AIRADS_PORTAL_COLORS.muted, fontSize: "0.7rem" }}>
                                Applicant
                            </Typography>
                        </Box>
                        <KeyboardArrowDownRoundedIcon sx={{ display: { xs: "none", sm: "block" }, fontSize: 20 }} />
                    </Box>
                </Stack>
            </Toolbar>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem disabled>
                    <Typography variant="body2" sx={{ maxWidth: 230 }} noWrap>
                        {studentEmail}
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem component={Link} href="/student/profile/">
                    <ListItemIcon><PersonOutlineRoundedIcon fontSize="small" /></ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={() => logout()}>
                    <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
                    Sign out
                </MenuItem>
            </Menu>
        </AppBar>
    );
};

StudentPortalHeader.propTypes = {
    studentName: PropTypes.string.isRequired,
    studentEmail: PropTypes.string,
    onOpenNavigation: PropTypes.func.isRequired,
};

export default StudentPortalHeader;
