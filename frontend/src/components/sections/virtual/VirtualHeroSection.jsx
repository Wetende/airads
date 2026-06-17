import React from "react";
import { usePage } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Button, Chip, Card, CardContent } from "@mui/material";
import { ArrowForward, CheckCircle, WorkOutlined } from "@mui/icons-material";
import { usePublicBrand } from "../../../hooks/usePublicBrand";

export default function VirtualHeroSection() {
  const brand = usePublicBrand();
  const { siteContext = {} } = usePage().props;
  const routes = siteContext.routes || {};
  const coursesHref = routes.virtualCourses || "/courses/";
  const applyHref = routes.virtualApply || "/apply/";

  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 10 },
        overflow: 'hidden',
        bgcolor: '#fefefe',
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: `linear-gradient(135deg, ${brand.softBlue} 0%, rgba(255,255,255,0) 100%)`,
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <Chip
                label="Virtual Campus"
                sx={{
                  bgcolor: brand.accent,
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: 0.5,
                  borderRadius: 1.5,
                }}
              />
              <Chip
                label="Learn & Grow"
                sx={{
                  bgcolor: brand.primary,
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: 0.5,
                  borderRadius: 1.5,
                }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: 1.1,
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              <Box component="span" sx={{ color: brand.secondary }}>
                Flexible Learning &<br />
              </Box>
              <Box component="span" sx={{ color: brand.accent }}>
                Upskilling
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 5,
                fontWeight: 400,
                lineHeight: 1.8,
                maxWidth: 540,
              }}
            >
              Learning is easy with us, learn any course and stack it up to your dream career and qualification from anywhere, anytime.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                href={coursesHref}
                sx={{
                  bgcolor: brand.primary,
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)',
                  '&:hover': { bgcolor: brand.secondary, transform: 'translateY(-1px)' },
                  transition: 'all 0.2s',
                }}
              >
                Explore Courses
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                href={applyHref}
                sx={{
                  color: brand.secondary,
                  borderColor: brand.secondary,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: brand.softBlue, borderColor: brand.primary },
                }}
              >
                Apply Now
              </Button>
            </Box>

            <Box sx={{ mt: 5, display: 'flex', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: brand.accent, fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>TVETA Approved</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: brand.accent, fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>CDACC Certified</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Content */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img" loading="lazy"
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Virtual class student studying"
                sx={{
                  width: '100%',
                  height: 480,
                  objectFit: 'cover',
                  borderRadius: 6,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              />
              
              {/* Floating Card */}
              <Card
                elevation={4}
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -40,
                  width: 280,
                  borderRadius: 4,
                  display: { xs: 'none', sm: 'block' },
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                    '100%': { transform: 'translateY(0px)' },
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: brand.softBlue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <WorkOutlined sx={{ color: brand.primary }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brand.secondary, lineHeight: 1.2 }}>
                        Are you looking for a job or internship?
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.5 }}>
                    Check out what we have for you in our career and jobs portal
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    sx={{
                      bgcolor: brand.secondary,
                      borderRadius: 8,
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Decorative Elements */}
              <Box sx={{ position: 'absolute', top: 40, right: -20, width: 64, height: 64, bgcolor: brand.accent, borderRadius: '20px', opacity: 0.2, transform: 'rotate(15deg)' }} />
              <Box sx={{ position: 'absolute', bottom: 80, right: -40, width: 96, height: 96, bgcolor: brand.primary, borderRadius: '50%', opacity: 0.1 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
