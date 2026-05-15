import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from '@inertiajs/react';

const HeroSection = () => {
  const images = [
    '/static/63.JPG',
    '/static/68.JPG',
    '/static/6.7.JPG',
    '/static/7.1.JPG',
    '/static/11.jpg',
    '/static/14 (2).jpg',
    '/static/17.jpg',
    '/static/31.jpg',
    '/static/image33.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {images.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transition: 'opacity 1s ease-in-out',
            opacity: index === currentIndex ? 1 : 0
          }}
        >
          <Box
            component="img"
            src={image}
            alt={`Slide ${index + 1}`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ))}

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '0.875rem', md: '1rem' },
                mb: 2
              }}
            >
              Centre of Excellence with 18 years of consistent KNEC excellence and 90-100% pass rate in KNEC, NITA, ICM & KASNEB Exams.
            </Typography>
            <Button
              component={Link}
              href="/admissions"
              variant="contained"
              sx={{
                bgcolor: '#dc2626',
                color: 'white',
                '&:hover': { bgcolor: '#b91c1c', transform: 'scale(1.05)' },
                fontWeight: 600,
                fontSize: '1rem',
                px: 4,
                py: 1.5,
                transition: 'all 0.3s ease',
                boxShadow: 2,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HeroSection;