import React from 'react';
import { Head } from '@inertiajs/react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Build, Map, Lightbulb, CheckCircle } from '@mui/icons-material';
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const StudyAirads = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Why Study at AIRADS - AIRADS College" />
      <TopNavbar />
      <MainNavbar />

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, mt: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, color: '#1d4ed8', fontSize: { xs: '3rem', md: '4rem' } }}>
              Why Study at AIRADS?
            </Typography>
            <Typography variant="h5" sx={{ color: '#475569', fontWeight: 400 }}>
              Your Gateway to a Successful Career in Technical Education
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#dc2626', mb: 4, display: 'inline-block', borderBottom: '4px solid #f87171', pb: 1 }}>
              The Leading TVET Institution in Kenya
            </Typography>
            <Typography variant="h6" sx={{ color: '#334155', lineHeight: 1.8, maxWidth: 1000, mx: 'auto', fontWeight: 400 }}>
              AIRADS College is proud to be one of Kenya’s top TVET-accredited institutions, with six campuses strategically located across the country. We are dedicated to delivering Competency-Based Education and Training (CBET) in alignment with Kenya Vision 2030, equipping learners with practical skills for the modern workforce.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mb: { xs: 10, md: 14 } }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', borderLeft: '4px solid #3b82f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Build sx={{ fontSize: 48, color: '#3b82f6', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1d4ed8' }}>Hands-On Training</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  We provide state-of-the-art workshops, science laboratories, and catering labs to ensure students receive quality, practical learning experiences.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', borderLeft: '4px solid #ef4444', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Map sx={{ fontSize: 48, color: '#ef4444', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#b91c1c' }}>National Presence</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  With campuses in major towns, AIRADS offers access to quality education wherever you are.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, height: '100%', borderLeft: '4px solid #3b82f6', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Lightbulb sx={{ fontSize: 48, color: '#3b82f6', mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1d4ed8' }}>Skills for Today, Careers for Tomorrow</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  Our courses are designed to match industry needs and prepare students for real-world opportunities.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1d4ed8', mb: 4, display: 'inline-block', borderBottom: '4px solid #60a5fa', pb: 1 }}>
              Why Choose AIRADS College?
            </Typography>
            <Typography variant="h6" sx={{ color: '#334155', mb: 6, fontWeight: 400 }}>
              At African Institute of Research and Development Studies (AIRADS), we are committed to delivering world-class technical and professional education. Here’s why thousands of students choose us:
            </Typography>
            
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ fontSize: 32, color: '#22c55e', mr: 2, flexShrink: 0, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>Outstanding Exam Success</Typography>
                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>We consistently achieve excellent pass rates (90–100%) in KNEC, NITA, ICM, and KASNEB examinations — a track record we’ve maintained for over 18 years.</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ fontSize: 32, color: '#22c55e', mr: 2, flexShrink: 0, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>Qualified & Experienced Trainers</Typography>
                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>Our teaching team comprises highly trained and industry-experienced professionals dedicated to student success.</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ fontSize: 32, color: '#22c55e', mr: 2, flexShrink: 0, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>Adequate Learning Resources</Typography>
                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>Our libraries, laboratories, and digital resources are fully equipped to support effective learning and research.</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ fontSize: 32, color: '#22c55e', mr: 2, flexShrink: 0, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>Free Internet & Wi-Fi</Typography>
                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>Stay connected with our complimentary internet access across campus.</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default StudyAirads;
