import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Button } from "@mui/material";
import { ArrowForward, Lightbulb, FitnessCenter, Shield, Star, Public, Visibility, RocketLaunch } from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";
import { usePublicBrand } from "../../hooks/usePublicBrand";

const Mission = () => {
  const brand = usePublicBrand();

  const coreValues = [
    {
      title: "Innovative thinking",
      description: "Fostering creativity and new ideas that drive technological advancement and educational excellence.",
      icon: <Lightbulb />,
    },
    {
      title: "Hard work",
      description: "Commitment and dedication to tasks with unwavering determination and perseverance.",
      icon: <FitnessCenter />,
    },
    {
      title: "Integrity",
      description: "Upholding honesty and strong moral principles in all our educational endeavors.",
      icon: <Shield />,
    },
    {
      title: "Excellence",
      description: "Striving for the highest standards in all endeavors and continuous improvement.",
      icon: <Star />,
    },
    {
      title: "Corporate Social Responsibility",
      description: "Contributing positively to society and the environment through sustainable practices.",
      icon: <Public />,
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Mission & Vision - AIRADS College" />
      <TopNavbar />
      <MainNavbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: brand.secondary,
            color: 'white',
            pt: { xs: 15, md: 20 },
            pb: { xs: 10, md: 15 }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="overline"
                sx={{
                  display: 'inline-block',
                  px: 3, py: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontWeight: 600,
                  letterSpacing: 2,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Our Foundation
              </Typography>
            </Box>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 4, color: 'white', fontSize: { xs: '3.5rem', md: '5rem', lg: '6rem' }, lineHeight: 1.1 }}>
              Mission & Vision
            </Typography>
            <Typography variant="h5" sx={{ color: brand.softBlue, maxWidth: 800, mx: 'auto', fontWeight: 300, lineHeight: 1.8 }}>
              Shaping the future through knowledge, innovation, and excellence in
              <Box component="span" sx={{ fontWeight: 600, color: 'white' }}> technical education</Box>
            </Typography>
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: 120, height: 4, bgcolor: 'white', borderRadius: 2 }} />
            </Box>
          </Container>
        </Box>

        {/* Vision & Mission Section */}
        <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'white', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 8, bgcolor: brand.primary }} />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
            <Grid container spacing={6}>
              {/* Vision Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    p: { xs: 4, md: 6 },
                    borderRadius: 6,
                    height: '100%',
                    border: `1px solid ${brand.borderBlue}`,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.5s',
                    '&:hover': { transform: 'translateY(-12px)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                    <Box sx={{ width: 80, height: 80, bgcolor: brand.primary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)' }}>
                      <Visibility fontSize="large" />
                    </Box>
                    <Box sx={{ ml: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: brand.neutralText }}>
                        Our Vision
                      </Typography>
                      <Box sx={{ width: 60, height: 4, bgcolor: brand.primary, borderRadius: 2, mt: 1 }} />
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ color: brand.mutedText, lineHeight: 1.8, fontWeight: 500 }}>
                    To be a <Box component="span" sx={{ fontWeight: 900, color: brand.primary }}>World class Centre of Excellence</Box> and
                    Innovation in Technical, Research and <Box component="span" sx={{ fontWeight: 900, color: brand.secondary }}>Entrepreneurship Training</Box>
                  </Typography>
                  <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', color: brand.mutedText }}>
                    <Box sx={{ width: 32, height: 32, bgcolor: brand.softBlue, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, p: 1 }}>
                      <Star fontSize="small" sx={{ color: brand.primary }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Excellence  Innovation  Leadership</Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Mission Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    p: { xs: 4, md: 6 },
                    borderRadius: 6,
                    height: '100%',
                    border: `1px solid ${brand.borderBlue}`,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.5s',
                    '&:hover': { transform: 'translateY(-12px)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                    <Box sx={{ width: 80, height: 80, bgcolor: brand.secondary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)' }}>
                      <RocketLaunch fontSize="large" />
                    </Box>
                    <Box sx={{ ml: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: brand.neutralText }}>
                        Our Mission
                      </Typography>
                      <Box sx={{ width: 60, height: 4, bgcolor: brand.secondary, borderRadius: 2, mt: 1 }} />
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ color: brand.mutedText, lineHeight: 1.8, fontWeight: 500 }}>
                    To provide <Box component="span" sx={{ fontWeight: 900, color: brand.primary }}>Quality Technical and Entrepreneurship Training</Box> and
                    Cutting Edge Research that will ensure developmental <Box component="span" sx={{ fontWeight: 900, color: brand.secondary }}>Transformation of individuals</Box> and
                    communities in the world
                  </Typography>
                  <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', color: brand.mutedText }}>
                    <Box sx={{ width: 32, height: 32, bgcolor: brand.softBlue, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, p: 1 }}>
                      <Star fontSize="small" sx={{ color: brand.primary }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Quality  Research  Transformation</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Core Values Section */}
        <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" sx={{ display: 'inline-block', px: 3, py: 1, bgcolor: brand.primary, color: 'white', borderRadius: 8, fontWeight: 600, letterSpacing: 1.5 }}>
                  What Drives Us
                </Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, color: brand.neutralText, fontSize: { xs: '3rem', md: '4rem' } }}>
                Our Core Values
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                These fundamental principles guide every decision we make and every action we take
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: 100, height: 4, bgcolor: brand.primary, borderRadius: 2 }} />
              </Box>
            </Box>

            <Grid container spacing={4}>
              {coreValues.map((value, index) => (
                <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 5,
                      borderRadius: 6,
                      height: '100%',
                      border: `1px solid ${brand.borderBlue}`,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.5s',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                        '& .icon-container': {
                          transform: 'rotate(12deg) scale(1.1)'
                        }
                      }
                    }}
                  >
                    <Box className="icon-container" sx={{ width: 80, height: 80, bgcolor: brand.primary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)', transition: 'transform 0.5s' }}>
                      {value.icon}
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: brand.neutralText }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: brand.mutedText, lineHeight: 1.7, fontWeight: 500 }}>
                      {value.description}
                    </Typography>

                    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 4, bgcolor: brand.primary, borderRadius: 2 }} />
                      <Box sx={{ width: 8, height: 4, bgcolor: '#e2e8f0', borderRadius: 2, ml: 1 }} />
                      <Box sx={{ width: 8, height: 4, bgcolor: '#e2e8f0', borderRadius: 2, ml: 0.5 }} />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Call to Action Section */}
        <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: brand.secondary, color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="overline" sx={{ display: 'inline-block', px: 3, py: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 8, fontWeight: 600, letterSpacing: 2, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                Join Our Community
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 4, lineHeight: 1.2, fontSize: { xs: '3rem', md: '4.5rem' } }}>
              Ready to Shape <br/>
              <Box component="span" sx={{ color: 'white' }}>
                Your Future?
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: brand.softBlue, mb: 8, fontWeight: 300, lineHeight: 1.8 }}>
              Join thousands of students who have transformed their lives through quality technical education at
              <Box component="span" sx={{ fontWeight: 700, color: 'white' }}> AIRADS College</Box>. Your journey to excellence starts here.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Button
                component="a"
                href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: brand.accent,
                  color: 'white',
                  px: 6,
                  py: 2,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  borderRadius: 8,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                  '&:hover': { bgcolor: brand.accentHover, transform: 'translateY(-4px)' },
                  transition: 'all 0.3s'
                }}
              >
                Apply Now
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Mission;
