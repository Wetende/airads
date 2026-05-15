import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const Schools = () => {
  const schools = [
    {
      name: "School of Engineering & ICT",
      description: "Offering cutting-edge programs in electrical, electronic, and information technology fields.",
      programs: ["Electrical Engineering", "Electronic Engineering", "Information Technology", "Computer Science"],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      name: "School of Hospitality & Tourism Management",
      description: "Comprehensive training in hospitality, tourism, and customer service excellence.",
      programs: ["Hotel Management", "Tourism Management", "Catering Services", "Event Management"],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    },
    {
      name: "School of Health & Social Sciences",
      description: "Preparing healthcare professionals and social workers for community service.",
      programs: ["Community Health", "Social Work", "Counseling", "Public Health"],
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
    },
    {
      name: "School of Beauty & Hair Dressing",
      description: "Professional training in beauty therapy, cosmetology, and hair styling.",
      programs: ["Beauty Therapy", "Hair Dressing", "Cosmetology", "Nail Technology"],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    },
    {
      name: "School of Media Studies",
      description: "Modern media training covering journalism, broadcasting, and digital media.",
      programs: ["Journalism", "Broadcasting", "Digital Media", "Film Production"],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      name: "School of Business Management",
      description: "Comprehensive business training for entrepreneurship and corporate leadership.",
      programs: ["Business Administration", "Project Management", "Entrepreneurship", "Finance"],
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Schools - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, mt: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 4, background: 'linear-gradient(to right, #1e40af, #2563eb, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '3rem', md: '4rem' } }}>
                Our Schools
              </Typography>
              <Box sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, borderRadius: 2, background: 'linear-gradient(to right, #2563eb, #dc2626)', opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 300, lineHeight: 1.6 }}>
              AIRADS College offers diverse academic programs through specialized schools, each designed to provide 
              industry-relevant skills and knowledge.
            </Typography>
          </Box>

          <Grid container spacing={5}>
            {schools.map((school, index) => (
              <Grid item xs={12} lg={6} key={index}>
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
                  <Box sx={{ position: 'relative', pt: '40%', overflow: 'hidden' }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, left: 0, width: '100%', height: '100%', 
                        backgroundImage: `url(${school.image})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        transition: 'transform 0.5s ease',
                        '&:hover': { transform: 'scale(1.1)' }
                      }} 
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, left: 0, width: '100%', height: '100%', 
                        background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.6), rgba(185, 28, 28, 0.4))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {school.name}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
                      {school.description}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 2 }}>
                      Key Programs:
                    </Typography>
                    
                    <Grid container spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                      {school.programs.map((program, programIndex) => (
                        <Grid item xs={12} sm={6} key={programIndex}>
                          <Box sx={{ bgcolor: '#eff6ff', color: '#1e40af', px: 2, py: 1.5, borderRadius: 2, fontSize: '0.875rem', fontWeight: 500, height: '100%', display: 'flex', alignItems: 'center' }}>
                            {program}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      endIcon={<ArrowForward />}
                      sx={{ 
                        py: 2, 
                        bgcolor: '#1e40af', 
                        fontWeight: 'bold', 
                        fontSize: '1rem',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#1d4ed8' }
                      }}
                    >
                      Explore Programs
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 10, p: { xs: 4, md: 8 }, borderRadius: 6, background: 'linear-gradient(to right, #1e40af, #dc2626)', color: 'white', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              Ready to Start Your Journey?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 5, fontWeight: 300 }}>
              Choose your path and join thousands of successful graduates
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#1e40af', 
                fontWeight: 800, 
                px: 6, 
                py: 2, 
                fontSize: '1.25rem',
                borderRadius: 2,
                '&:hover': { bgcolor: 'grey.100', transform: 'scale(1.05)' },
                transition: 'all 0.3s'
              }}
            >
              APPLY TODAY
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Schools;
