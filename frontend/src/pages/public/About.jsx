import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { EmojiEvents, School, Public } from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";
import { usePublicBrand } from "../../hooks/usePublicBrand";

const About = () => {
  const brand = usePublicBrand();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="About - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: brand.secondary, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
              About AIRADS College
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 'normal', lineHeight: 1.6 }}>
              African Institute of Research and Development Studies (AIRADS) College is a leading TVET institution 
              committed to providing quality technical education and training.
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
            <Grid item xs={12} lg={6}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: brand.secondary, mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
                To provide quality, relevant, and accessible technical and vocational education and training 
                that empowers learners with practical skills for sustainable development.
              </Typography>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: brand.secondary, mb: 3, mt: 4 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                To be the leading centre of excellence in technical and vocational education and training, 
                producing competent and innovative graduates for national and regional development.
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  borderRadius: 4, 
                  bgcolor: brand.softBlue
                }}
              >
                <Box 
                  component="img"
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                  alt="Students learning"
                  sx={{ 
                    width: '100%', 
                    height: 256, 
                    objectFit: 'cover', 
                    borderRadius: 2,
                    boxShadow: 3
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ bgcolor: brand.softBlue, p: { xs: 4, md: 6 }, borderRadius: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: brand.secondary, mb: 6, textAlign: 'center' }}>
              Why Study at AIRADS?
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <EmojiEvents sx={{ fontSize: 64, color: brand.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: brand.secondary }}>Excellence</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>90-100% pass rate for 18 years consistently</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <School sx={{ fontSize: 64, color: brand.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: brand.secondary }}>Expert Faculty</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>Qualified and experienced trainers</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Public sx={{ fontSize: 64, color: brand.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: brand.secondary }}>Accessibility</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>7 campuses across Kenya</Typography>
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

export default About;
