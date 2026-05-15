import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, Paper } from "@mui/material";
import { ArrowForward, Event, AccessTime, LocationOn } from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const News = () => {
  const newsItems = [
    {
      title: "January 2026 INTAKE ONGOING",
      date: "January 5th, 2026",
      category: "Admissions",
      excerpt: "Applications are now open for the July 2026 intake across all our campuses. Join us for quality technical education.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
    },
    {
      title: "Special Computer Packages Offer",
      date: "June 10, 2026", 
      category: "Programs",
      excerpt: "Take advantage of our special offer on 14 computer packages with partial sponsorship opportunities.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      title: "New Campus Opening in Maralal",
      date: "May 20, 2026",
      category: "Campus News",
      excerpt: "We are excited to announce the opening of our newest campus in Maralal, bringing quality education to Northern Kenya.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    }
  ];

  const events = [
    {
      title: "Career Guidance Workshop",
      date: "July 5, 2026",
      time: "10:00 AM - 3:00 PM",
      location: "All Campuses",
      description: "Free career guidance workshop for prospective students and parents."
    },
    {
      title: "Industrial Attachment Fair",
      date: "July 12, 2026", 
      time: "9:00 AM - 4:00 PM",
      location: "Nakuru Campus",
      description: "Meet with industry partners and secure attachment opportunities."
    },
    {
      title: "Annual Sports Day",
      date: "July 20, 2026",
      time: "8:00 AM - 5:00 PM", 
      location: "Eldoret Campus",
      description: "Inter-campus sports competitions and talent showcase."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="News & Events - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, mt: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 4, background: 'linear-gradient(to right, #1e40af, #2563eb, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '3rem', md: '4rem' } }}>
                News & Events
              </Typography>
              <Box sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, borderRadius: 2, background: 'linear-gradient(to right, #2563eb, #dc2626)', opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 300, lineHeight: 1.6 }}>
              Stay updated with the latest news, announcements, and upcoming events at AIRADS College.
            </Typography>
          </Box>

          {/* Latest News Section */}
          <Box sx={{ mb: { xs: 10, md: 12 } }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: '#1e40af', mb: 6, display: 'flex', alignItems: 'center' }}>
              Latest News
              <Box sx={{ height: 4, width: 60, bgcolor: '#dc2626', ml: 3, borderRadius: 2 }} />
            </Typography>
            
            <Grid container spacing={4}>
              {newsItems.map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
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
                    <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 0, left: 0, width: '100%', height: '100%', 
                          backgroundImage: `url(${item.image})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center',
                          transition: 'transform 0.5s ease',
                          '&:hover': { transform: 'scale(1.05)' }
                        }} 
                      />
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 0, left: 0, width: '100%', height: '100%', 
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                          display: 'flex',
                          alignItems: 'flex-end',
                          p: 2
                        }}
                      >
                        <Chip 
                          label={item.category} 
                          size="small" 
                          sx={{ bgcolor: '#dc2626', color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }} 
                        />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                        {item.date}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 2, lineHeight: 1.3 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6, flexGrow: 1 }}>
                        {item.excerpt}
                      </Typography>
                      <Button 
                        endIcon={<ArrowForward />} 
                        sx={{ alignSelf: 'flex-start', color: '#dc2626', fontWeight: 600, px: 0, '&:hover': { bgcolor: 'transparent', color: '#b91c1c' } }}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Upcoming Events Section */}
          <Box>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: '#1e40af', mb: 6, display: 'flex', alignItems: 'center' }}>
              Upcoming Events
              <Box sx={{ height: 4, width: 60, bgcolor: '#dc2626', ml: 3, borderRadius: 2 }} />
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {events.map((event, index) => (
                <Paper 
                  key={index}
                  elevation={0}
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 4, 
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#eff6ff',
                      borderColor: '#bfdbfe',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8} lg={9}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 1 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                        {event.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 4 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <Event sx={{ fontSize: '1.2rem', mr: 1, color: '#2563eb' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{event.date}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <AccessTime sx={{ fontSize: '1.2rem', mr: 1, color: '#2563eb' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{event.time}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                          <LocationOn sx={{ fontSize: '1.2rem', mr: 1, color: '#2563eb' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{event.location}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4} lg={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Button 
                        variant="contained" 
                        sx={{ 
                          bgcolor: '#1e40af', 
                          fontWeight: 'bold',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': { bgcolor: '#1d4ed8' }
                        }}
                      >
                        Register Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default News;
