import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from "@mui/material";
import { LocationOn, Phone, ArrowForward } from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const Campuses = () => {
  const campuses = [
    {
      name: "KERICHO TOWN CAMPUS",
      phone: "0729-976-885",
      location: "Kericho Town",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      description: "Located in the heart of Kericho, our campus offers comprehensive technical programs in a conducive learning environment."
    },
    {
      name: "ELDORET TOWN CAMPUS",
      phone: "0715-696-979", 
      location: "Eldoret Town",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      description: "Modern facilities in Eldoret serving the Rift Valley region with state-of-the-art equipment and qualified trainers."
    },
    {
      name: "BUNGOMA TOWN CAMPUS",
      phone: "0715-771-316",
      location: "Bungoma Town", 
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
      description: "Strategic location in Bungoma with excellent infrastructure for technical and vocational training."
    },
    {
      name: "LODWAR TOWN CAMPUS",
      phone: "0723-555-999",
      location: "Lodwar Town",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b", 
      description: "Serving the Turkana region, bringing quality technical education to Northern Kenya."
    },
    {
      name: "KISUMU CITY CAMPUS", 
      phone: "0715-505-262",
      location: "Kisumu City",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      description: "Located in the vibrant lakeside city, offering diverse programs for students across Western Kenya."
    },
    {
      name: "NAKURU CAMPUS",
      phone: "N/A",
      location: "Nakuru Town",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
      description: "Centrally located campus serving students from across Kenya with excellent connectivity."
    },
    {
      name: "MARALAL CAMPUS", 
      phone: "0723-555-999",
      location: "Maralal Town",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      description: "Bringing quality technical education to Northern Kenya and surrounding communities."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Campuses - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, mt: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 4, background: 'linear-gradient(to right, #1e40af, #2563eb, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '3rem', md: '4rem' } }}>
                Our Campuses
              </Typography>
              <Box sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, borderRadius: 2, background: 'linear-gradient(to right, #2563eb, #dc2626)', opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 300, lineHeight: 1.6 }}>
              With 7 strategically located campuses across Kenya, we bring quality technical education closer to you.
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
                    borderRadius: 4,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '60%', overflow: 'hidden' }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, left: 0, width: '100%', height: '100%', 
                        backgroundImage: `url(${campus.image})`, 
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
                        background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.4), rgba(185, 28, 28, 0.6))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3
                      }}
                    >
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {campus.name}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Chip 
                        icon={<LocationOn sx={{ fontSize: '1rem !important' }} />} 
                        label={campus.location} 
                        size="small" 
                        sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600, px: 1 }} 
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8, flexGrow: 1 }}>
                      {campus.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#1e40af' }}>
                        <Phone sx={{ mr: 1, fontSize: '1.25rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {campus.phone}
                        </Typography>
                      </Box>
                      <Button 
                        endIcon={<ArrowForward />} 
                        sx={{ color: '#dc2626', fontWeight: 600, '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.05)' } }}
                      >
                        Visit
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Campuses;
