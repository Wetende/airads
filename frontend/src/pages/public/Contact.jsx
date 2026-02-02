import { Head, Link } from "@inertiajs/react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    Card,
    useTheme,
} from "@mui/material";
import {
    IconBrandTabler,
    IconMapPin,
    IconPhone,
    IconMail,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { getBackgroundDots } from "../../utils/getBackgroundDots";
import PublicNavbar from "../../components/common/PublicNavbar";

// --- Helper Components ---
function GraphicsCard({ children, sx = {} }) {
    return (
        <Card
            sx={{
                borderRadius: { xs: 6, sm: 8 },
                border: "1px solid",
                borderColor: "grey.200",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                overflow: "hidden",
                ...sx,
            }}
        >
            {children}
        </Card>
    );
}

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
};

export default function Contact() {
    const theme = useTheme();

    return (
        <>
            <Head title="Contact Us - Crossview LMS" />

            <Box sx={{ minHeight: "100vh", bgcolor: "background.default", overflowX: "hidden" }}>
                {/* Navbar */}
                <PublicNavbar activeLink="/contact/" />

                {/* Hero Section */}
                <Box sx={{ position: "relative", pt: { xs: 16, md: 20 }, pb: { xs: 8, md: 12 } }}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: getBackgroundDots(theme.palette.grey[300], 2, 30),
                            zIndex: -1,
                            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                        }}
                    />
                    <Container maxWidth="lg">
                        <motion.div {...fadeInUp}>
                            <Typography variant="h1" textAlign="center" gutterBottom>
                                Contact Us
                            </Typography>
                            <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ maxWidth: 600, mx: "auto", mb: 8 }}>
                                Have questions? Reach out to us through any of the channels below. Our AI assistant is also available to help you 24/7.
                            </Typography>
                        </motion.div>
                    </Container>
                </Box>

                {/* Content Section */}
                <Container maxWidth="md" sx={{ pb: 16 }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <GraphicsCard sx={{ p: { xs: 4, md: 6 } }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "primary.lighter", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <IconMail size={24} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={700}>Email</Typography>
                                            <Typography variant="body2" color="text.secondary">Our friendly team is here to help.</Typography>
                                            <Typography variant="body1" color="primary.main" fontWeight={600} sx={{ mt: 0.5 }}>hello@crossview.co.ke</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "primary.lighter", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <IconMapPin size={24} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={700}>Office</Typography>
                                            <Typography variant="body2" color="text.secondary">Come say hello at our office.</Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>Westlands, Nairobi, Kenya</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "primary.lighter", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <IconPhone size={24} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={700}>Phone</Typography>
                                            <Typography variant="body2" color="text.secondary">Mon-Fri from 8am to 5pm.</Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>+254 700 000 000</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </GraphicsCard>
                    </motion.div>
                </Container>

                {/* Footer */}
                <Box sx={{ bgcolor: "grey.900", color: "grey.400", py: 8 }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={8}>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: "white" }}>
                                    <IconBrandTabler size={32} />
                                    <Typography variant="h5" fontWeight={700}>Crossview</Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ maxWidth: 300 }}>
                                    Empowering Kenyan institutions with modern, flexible, and reliable educational technology.
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Typography variant="subtitle2" color="white" gutterBottom>Platform</Typography>
                                <Stack spacing={1}>
                                    <Link href="/programs/" style={{ color: "inherit", textDecoration: "none" }}>Programs</Link>
                                    <Link href="/about/" style={{ color: "inherit", textDecoration: "none" }}>About</Link>
                                </Stack>
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Typography variant="subtitle2" color="white" gutterBottom>Support</Typography>
                                <Stack spacing={1}>
                                    <Link href="/contact/" style={{ color: "inherit", textDecoration: "none" }}>Contact</Link>
                                    <Link href="/verify-certificate/" style={{ color: "inherit", textDecoration: "none" }}>Verify Certificate</Link>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 8, pt: 4, borderTop: 1, borderColor: "grey.800", textAlign: "center" }}>
                            <Typography variant="caption">© 2025 Crossview LMS. All rights reserved.</Typography>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
}
