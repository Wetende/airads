import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Card, CardContent, Paper } from "@mui/material";
import { 
  EmojiObjects, Home, DirectionsBus, SportsSoccer, Work, Wifi,
  MenuBook, Computer, AccountBalance, Restaurant, FormatQuote
} from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const Students = () => {
  const brand = usePublicBrand();

  const studentServices = [
    {
      title: "Student Mentoring and Leadership Programs (LAMP)",
      description: "Comprehensive programs designed to develop leadership skills and provide guidance throughout your academic journey.",
      icon: <EmojiObjects fontSize="large" sx={{ color: brand.primary }} />
    },
    {
      title: "Students Hostels",
      description: "Modern male and female hostels providing safe and comfortable accommodation for our students.",
      icon: <Home fontSize="large" sx={{ color: brand.primary }} />
    },
    {
      title: "Academic Trips & Tours",
      description: "Educational excursions and field trips to enhance practical learning and industry exposure.",
      icon: <DirectionsBus fontSize="large" sx={{ color: brand.primary }} />
    },
    {
      title: "Sports and Talent Development",
      description: "Various sports activities and talent development initiatives to nurture holistic growth.",
      icon: <SportsSoccer fontSize="large" sx={{ color: brand.primary }} />
    },
    {
      title: "Industrial Attachment Placements",
      description: "Guaranteed placement opportunities in leading companies for hands-on experience.",
      icon: <Work fontSize="large" sx={{ color: brand.primary }} />
    },
    {
      title: "Free Internet & WiFi",
      description: "Unlimited internet access across all campuses for research and academic purposes.",
      icon: <Wifi fontSize="large" sx={{ color: brand.primary }} />
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Student Life - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, mt: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 4, color: brand.secondary, fontSize: { xs: '3rem', md: '4rem' } }}>
              Student Life
            </Typography>
            <Typography variant="h6" sx={{ color: brand.mutedText, maxWidth: 800, mx: 'auto', fontWeight: 300, lineHeight: 1.6 }}>
              At AIRADS College, we provide comprehensive support and services to ensure your academic success 
              and personal development.
            </Typography>
          </Box>

          {/* Student Services */}
          <Grid container spacing={4} sx={{ mb: { xs: 10, md: 14 } }}>
            {studentServices.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 4,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ mb: 3, p: 2, bgcolor: brand.softBlue, borderRadius: 3, display: 'inline-flex', alignSelf: 'flex-start' }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: brand.secondary, mb: 2, lineHeight: 1.3 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brand.mutedText, lineHeight: 1.6, flexGrow: 1 }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Student Testimonial */}
          <Box sx={{ mb: { xs: 10, md: 14 } }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 4, md: 8 }, 
                borderRadius: 6, 
                bgcolor: brand.secondary,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)'
              }}
            >
              <FormatQuote sx={{ position: 'absolute', top: { xs: 10, md: 20 }, left: { xs: 10, md: 40 }, fontSize: '8rem', color: 'rgba(255, 255, 255, 0.1)', transform: 'rotate(180deg)' }} />
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Typography variant="h5" component="blockquote" sx={{ fontWeight: 300, fontStyle: 'italic', lineHeight: 1.8, maxWidth: 800, mx: 'auto', mb: 6, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  "I studied in AIRADS Kericho Campus in 2016. Indeed it is where my dreams were hatched and 
                  ultimately I am who I am today because of this institution. I will live to remember this college."
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, borderTop: '1px solid rgba(255,255,255,0.2)', maxWidth: 400, mx: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Janeth Chepkorir
                  </Typography>
                  <Typography variant="body2" sx={{ color: brand.borderBlue, mt: 0.5 }}>
                    Class of 2016, Kericho Campus
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Student Resources */}
          <Box sx={{ bgcolor: brand.softBlue, p: { xs: 4, md: 8 }, borderRadius: 6 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 900, color: brand.secondary, mb: 6, textAlign: 'center' }}>
              Student Resources
            </Typography>
            <Grid container spacing={4}>
              {[
                { title: 'Well-furnished Libraries', desc: 'Modern libraries with extensive collections', icon: <MenuBook fontSize="large" sx={{ color: brand.primary }} /> },
                { title: 'Computer Labs', desc: 'State-of-the-art computer laboratories', icon: <Computer fontSize="large" sx={{ color: brand.primary }} /> },
                { title: 'Lecture Halls', desc: 'Modern lecture halls with AV equipment', icon: <AccountBalance fontSize="large" sx={{ color: brand.primary }} /> },
                { title: 'Cafeteria', desc: 'Affordable meals and refreshments', icon: <Restaurant fontSize="large" sx={{ color: brand.primary }} /> }
              ].map((resource, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      borderRadius: 4,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        borderColor: brand.borderBlue,
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{resource.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: brand.neutralText }}>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brand.mutedText }}>
                      {resource.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Students;
