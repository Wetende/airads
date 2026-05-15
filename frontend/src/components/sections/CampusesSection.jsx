import React from 'react';
import { Link } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import { Phone as PhoneIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const CampusesSection = () => {
  const campuses = [
    {
      name: "KERICHO TOWN CAMPUS",
      phone: "0729976885",
      image: "/static/static/kericho-campus.jpg",
      description: "Located in the heart of Kericho, offering comprehensive technical programs."
    },
    {
      name: "ELDORET TOWN CAMPUS",
      phone: "0715696979",
      image: "/static/eldoret.jpg",
      description: "Modern facilities in Eldoret serving the Rift Valley region."
    },
    {
      name: "BUNGOMA TOWN CAMPUS",
      phone: "0715771316",
      image: "/static/eldoret.jpg",
      description: "Strategic location in Bungoma with state-of-the-art equipment."
    },
    {
      name: "LODWAR TOWN CAMPUS",
      phone: "0723555999",
      image: "/static/lodwar-campus.jpg",
      description: "Serving the Turkana region with quality technical education."
    },
    {
      name: "KISUMU CITY CAMPUS",
      phone: "0715505262",
      image: "/static/kisumu-campus.jpg",
      description: "Located in the lakeside city, offering diverse programs."
    },
    {
      name: "NAKURU CAMPUS",
      phone: "0711488302",
      image: "/static/nakuru-campus.jpg",
      description: "Central location serving students across Kenya."
    },
    {
      name: "MARALAL CAMPUS",
      phone: "0723555999",
      image: "/static/nakuru.jpg",
      description: "Bringing quality education to Northern Kenya."
    }
  ];

  return (
    <Box component="section" sx={{ py: 10, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
            Our Campuses
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 'normal', lineHeight: 1.6 }}>
            With 6 National campuses across the country, we bring quality technical education closer to you.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {campuses.map((campus, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }
                }}
              >
                <Box 
                  sx={{ 
                    height: 200, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.3), rgba(185, 28, 28, 0.2)), url(${campus.image})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h5" component="h3" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', px: 2, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {campus.name}
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6, flexGrow: 1 }}>
                    {campus.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#1e40af' }}>
                      <PhoneIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {campus.phone}
                      </Typography>
                    </Box>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIcon fontSize="small" />} 
                      sx={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: 'transparent', color: '#b91c1c' } }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Special Offer Section */}
        <Box sx={{ mt: 10 }}>
          <Paper 
            sx={{ 
              p: { xs: 4, md: 6 }, 
              borderRadius: 4, 
              background: 'linear-gradient(to right, #dc2626, #1e40af)', 
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              SPECIAL OFFER ON 14 COMPUTER PACKAGES
            </Typography>
            <Typography variant="h6" sx={{ mb: 5, maxWidth: 900, mx: 'auto', fontWeight: 'normal', lineHeight: 1.6, opacity: 0.9 }}>
              We offer special offers on 14 computer packages and partial sponsorship for the same if you pursue 
              Artisan, Certificate or Diploma Course at AIRADS College.
            </Typography>
            <Button
              component={Link}
              href="/admissions/procedure/"
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: '#1e40af', 
                fontWeight: 'bold', 
                fontSize: '1.1rem',
                px: 6, 
                py: 2, 
                borderRadius: 2,
                '&:hover': { bgcolor: 'grey.100' },
                textTransform: 'none'
              }}
            >
              Learn More About Offers
            </Button>
          </Paper>
        </Box>

      </Container>
    </Box>
  );
};

export default CampusesSection;