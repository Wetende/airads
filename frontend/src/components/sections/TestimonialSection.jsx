import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Container, Typography, Grid, IconButton, Paper, Avatar } from '@mui/material';

const testimonials = [
  {
    id: 1,
    quote: "I studied in AIRADS Kericho Campus in 2016. Indeed it is where my dreams were hatched and ultimately I am who I am today because of this institution.",
    author: "Janeth Chepkorir",
    details: "Class of 2016, Kericho Campus",
    course: "Business Administration",
    image: "👩‍🎓"
  },
  {
    id: 2,
    quote: "AIRADS College provided me with the practical skills and knowledge I needed to excel in my career. The lecturers were supportive and the learning environment was exceptional.",
    author: "David Kimani",
    details: "Class of 2018, Nairobi Campus",
    course: "Information Technology",
    image: "👨‍💻"
  },
  {
    id: 3,
    quote: "The hands-on approach to learning at AIRADS prepared me for the real world. I'm now running my own successful business thanks to the entrepreneurship skills I gained here.",
    author: "Mary Wanjiku",
    details: "Class of 2019, Eldoret Campus",
    course: "Entrepreneurship",
    image: "👩‍💼"
  },
  {
    id: 4,
    quote: "AIRADS College changed my life completely. The quality education and mentorship I received here opened doors to opportunities I never imagined possible.",
    author: "James Mwangi",
    details: "Class of 2020, Mombasa Campus",
    course: "Hospitality Management",
    image: "👨‍🍳"
  }
];

const partners = [
  { id: 1, name: "KATTI", logo: "/static/katti-logo.png" },
  { id: 2, name: "KNEC", logo: "/static/logo_knec_new.png" },
  { id: 3, name: "Ministry of Education", logo: "/static/MOE-logo.jpg" },
  { id: 4, name: "NITA", logo: "/static/NITA-Logo.png" },
  { id: 5, name: "TVET CDACC", logo: "/static/TVET-CDACC-logo.png" },
  { id: 6, name: "TVETA", logo: "/static/TVETA-web-Logo.png" }
];

const scrollKeyframes = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes pulseLight {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .7; transform: scale(1.05); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <style>{scrollKeyframes}</style>
      <Box 
        component="section" 
        sx={{ 
          py: 10, 
          background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #7f1d1d)', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        {/* Background Animation */}
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <Box sx={{ position: 'absolute', top: 40, left: 40, width: 80, height: 80, bgcolor: '#ef4444', borderRadius: '50%', animation: 'pulseLight 4s infinite' }} />
          <Box sx={{ position: 'absolute', top: 80, right: 80, width: 64, height: 64, bgcolor: '#60a5fa', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }} />
          <Box sx={{ position: 'absolute', bottom: 40, left: '25%', width: 48, height: 48, bgcolor: '#f87171', borderRadius: '50%', animation: 'pulseLight 3s infinite' }} />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, background: 'linear-gradient(to right, #bfdbfe, white, #fecaca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '3rem' } }}>
              Student Success Stories
            </Typography>
            <Box sx={{ height: 4, width: 80, background: 'linear-gradient(to right, #3b82f6, #ef4444)', borderRadius: 2, mx: 'auto' }} />
          </Box>

          {/* Testimonial Slider */}
          <Box 
            sx={{ maxWidth: 900, mx: 'auto', position: 'relative' }}
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            <Paper 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: 4, 
                background: 'linear-gradient(to right, rgba(30, 58, 138, 0.4), rgba(127, 29, 29, 0.4))', 
                backdropFilter: 'blur(16px)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                boxShadow: 24,
                color: 'white'
              }}
            >
              {/* Sliding Container */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  transition: 'transform 0.7s ease-in-out', 
                  transform: `translateX(-${currentIndex * 100}%)` 
                }}
              >
                {testimonials.map((testimonial) => (
                  <Box key={testimonial.id} sx={{ width: '100%', flexShrink: 0, p: { xs: 4, md: 6 } }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                      {/* Avatar Section */}
                      <Box sx={{ flexShrink: 0 }}>
                        <Box 
                          sx={{ 
                            width: { xs: 80, md: 100 }, 
                            height: { xs: 80, md: 100 }, 
                            background: 'linear-gradient(to bottom right, #3b82f6, #ef4444)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: { xs: '2.5rem', md: '3rem' }, 
                            boxShadow: 4,
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.1)' }
                          }}
                        >
                          {testimonial.image}
                        </Box>
                      </Box>

                      {/* Content Section */}
                      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        {/* Quote */}
                        <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6, fontStyle: 'italic', color: 'grey.100', fontWeight: 'normal' }}>
                          "{testimonial.quote}"
                        </Typography>
                        
                        {/* Author Info */}
                        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', pt: 3 }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', background: 'linear-gradient(to right, #bfdbfe, #fecaca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                            {testimonial.author}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#bfdbfe', fontWeight: 500, mb: 1 }}>
                            {testimonial.details}
                          </Typography>
                          <Box sx={{ display: 'inline-block', px: 2, py: 0.5, background: 'linear-gradient(to right, rgba(239, 68, 68, 0.3), rgba(59, 130, 246, 0.3))', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: '#fecaca', fontWeight: 600 }}>
                              Course: {testimonial.course}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Navigation Arrows */}
            <IconButton
              onClick={goToPrevious}
              sx={{ 
                position: 'absolute', 
                left: -20, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: 'linear-gradient(to right, #2563eb, #dc2626)', 
                color: 'white', 
                p: 1.5, 
                boxShadow: 4,
                '&:hover': { background: 'linear-gradient(to right, #3b82f6, #ef4444)', transform: 'translateY(-50%) scale(1.1)' } 
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </IconButton>
            
            <IconButton
              onClick={goToNext}
              sx={{ 
                position: 'absolute', 
                right: -20, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: 'linear-gradient(to right, #dc2626, #2563eb)', 
                color: 'white', 
                p: 1.5, 
                boxShadow: 4,
                '&:hover': { background: 'linear-gradient(to right, #ef4444, #3b82f6)', transform: 'translateY(-50%) scale(1.1)' } 
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </IconButton>
          </Box>

          {/* Dots Indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1.5 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: index === currentIndex ? 'linear-gradient(to right, #60a5fa, #f87171)' : 'rgba(255, 255, 255, 0.4)',
                  transform: index === currentIndex ? 'scale(1.25)' : 'scale(1)',
                  '&:hover': { background: index === currentIndex ? 'linear-gradient(to right, #60a5fa, #f87171)' : 'rgba(255, 255, 255, 0.6)' }
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </Box>

          {/* Statistics Section */}
          <Grid container spacing={3} sx={{ mt: 8, textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ background: 'linear-gradient(to bottom right, rgba(30, 58, 138, 0.3), rgba(127, 29, 29, 0.3))', backdropFilter: 'blur(16px)', borderRadius: 3, p: 4, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, color: 'white' }}>
                <Typography variant="h3" sx={{ mb: 2 }}>🎓</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(to right, #bfdbfe, #fecaca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5000+</Typography>
                <Typography variant="body2" sx={{ color: '#bfdbfe' }}>Graduates</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ background: 'linear-gradient(to bottom right, rgba(127, 29, 29, 0.3), rgba(30, 58, 138, 0.3))', backdropFilter: 'blur(16px)', borderRadius: 3, p: 4, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, color: 'white' }}>
                <Typography variant="h3" sx={{ mb: 2 }}>🏆</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(to right, #fecaca, #bfdbfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>90-100%</Typography>
                <Typography variant="body2" sx={{ color: '#fecaca' }}>Pass Rate</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ background: 'linear-gradient(to bottom right, rgba(30, 58, 138, 0.3), rgba(127, 29, 29, 0.3))', backdropFilter: 'blur(16px)', borderRadius: 3, p: 4, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, color: 'white' }}>
                <Typography variant="h3" sx={{ mb: 2 }}>🌍</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, background: 'linear-gradient(to right, #bfdbfe, #fecaca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7</Typography>
                <Typography variant="body2" sx={{ color: '#bfdbfe' }}>Campuses</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Partners Section */}
      <Box component="section" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#2563eb', fontSize: { xs: '2rem', md: '3rem' } }}>
              Our Partners
            </Typography>
            <Box sx={{ height: 4, width: 80, bgcolor: '#2563eb', borderRadius: 2, mx: 'auto' }} />
          </Box>
          {/* Sliding Logos */}
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                animation: 'scroll 30s linear infinite',
                '&:hover': { animationPlayState: 'paused' }
              }}
            >
              {/* First set of logos */}
              {partners.map((partner) => (
                <Box
                  key={`first-${partner.id}`}
                  sx={{ flexShrink: 0, width: 200, height: 120, mx: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Box
                    component="img"
                    src={partner.logo}
                    alt={partner.name}
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'all 0.3s' }}
                  />
                </Box>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner) => (
                <Box
                  key={`second-${partner.id}`}
                  sx={{ flexShrink: 0, width: 200, height: 120, mx: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Box
                    component="img"
                    src={partner.logo}
                    alt={partner.name}
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'all 0.3s' }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TestimonialSection;