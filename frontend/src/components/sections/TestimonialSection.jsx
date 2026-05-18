import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Container, Typography, Grid, IconButton, Paper, Avatar } from '@mui/material';
import { School, EmojiEvents, Public } from '@mui/icons-material';
import { usePublicBrand } from '../../hooks/usePublicBrand';

const testimonials = [
  { id: 1, quote: "I studied in AIRADS Kericho Campus in 2016. Indeed it is where my dreams were hatched and ultimately I am who I am today because of this institution.", author: "Janeth Chepkorir", details: "Class of 2016, Kericho Campus", course: "Business Administration", initials: "JC" },
  { id: 2, quote: "AIRADS College provided me with the practical skills and knowledge I needed to excel in my career. The lecturers were supportive and the learning environment was exceptional.", author: "David Kimani", details: "Class of 2018, Nairobi Campus", course: "Information Technology", initials: "DK" },
  { id: 3, quote: "The hands-on approach to learning at AIRADS prepared me for the real world. I'm now running my own successful business thanks to the entrepreneurship skills I gained here.", author: "Mary Wanjiku", details: "Class of 2019, Eldoret Campus", course: "Entrepreneurship", initials: "MW" },
  { id: 4, quote: "AIRADS College changed my life completely. The quality education and mentorship I received here opened doors to opportunities I never imagined possible.", author: "James Mwangi", details: "Class of 2020, Mombasa Campus", course: "Hospitality Management", initials: "JM" },
];

const partners = [
  { id: 1, name: "KATTI", logo: "/static/katti-logo.png" },
  { id: 2, name: "KNEC", logo: "/static/logo_knec_new.png" },
  { id: 3, name: "Ministry of Education", logo: "/static/MOE-logo.jpg" },
  { id: 4, name: "NITA", logo: "/static/NITA-Logo.png" },
  { id: 5, name: "TVET CDACC", logo: "/static/TVET-CDACC-logo.png" },
  { id: 6, name: "TVETA", logo: "/static/TVETA-web-Logo.png" },
];

const scrollKeyframes = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const TestimonialSection = () => {
  const brand = usePublicBrand();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToPrevious = () => setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  const goToNext = () => setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <>
      <style>{scrollKeyframes}</style>
      <Box
        component="section"
        sx={{
          py: 10,
          bgcolor: brand.secondary,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: 'white', fontSize: { xs: '2rem', md: '3rem' } }}>
              Student Success Stories
            </Typography>
            <Box sx={{ height: 4, width: 80, bgcolor: brand.accent, borderRadius: 2, mx: 'auto' }} />
          </Box>

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
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 24,
                color: 'white',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  transition: 'transform 0.7s ease-in-out',
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {testimonials.map((testimonial) => (
                  <Box key={testimonial.id} sx={{ width: '100%', flexShrink: 0, p: { xs: 4, md: 6 } }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                      <Box sx={{ flexShrink: 0 }}>
                        <Avatar
                          sx={{
                            width: { xs: 80, md: 100 },
                            height: { xs: 80, md: 100 },
                            bgcolor: brand.accent,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            boxShadow: 4,
                          }}
                        >
                          {testimonial.initials}
                        </Avatar>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h6" sx={{ mb: 3, lineHeight: 1.6, fontStyle: 'italic', color: 'grey.100', fontWeight: 'normal' }}>
                          "{testimonial.quote}"
                        </Typography>
                        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', pt: 3 }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            {testimonial.author}
                          </Typography>
                          <Typography variant="body2" sx={{ color: brand.borderBlue, fontWeight: 500, mb: 1 }}>
                            {testimonial.details}
                          </Typography>
                          <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: brand.borderBlue, fontWeight: 600 }}>
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

            <IconButton
              onClick={goToPrevious}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: brand.accent,
                color: 'white',
                p: 1.5,
                boxShadow: 4,
                '&:hover': { bgcolor: brand.accentHover, transform: 'translateY(-50%) scale(1.1)' },
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={goToNext}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: brand.accent,
                color: 'white',
                p: 1.5,
                boxShadow: 4,
                '&:hover': { bgcolor: brand.accentHover, transform: 'translateY(-50%) scale(1.1)' },
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight />
            </IconButton>
          </Box>

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
                  bgcolor: index === currentIndex ? brand.accent : 'rgba(255, 255, 255, 0.4)',
                  transform: index === currentIndex ? 'scale(1.25)' : 'scale(1)',
                  '&:hover': { bgcolor: index === currentIndex ? brand.accent : 'rgba(255, 255, 255, 0.6)' },
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </Box>

          <Grid container spacing={3} sx={{ mt: 8, textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', borderRadius: 3, p: 4, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, color: 'white' }}>
                <School sx={{ fontSize: '3rem', mb: 2, color: brand.accent }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>5000+</Typography>
                <Typography variant="body2" sx={{ color: brand.borderBlue }}>Graduates</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', borderRadius: 3, p: 4, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, color: 'white' }}>
                <EmojiEvents sx={{ fontSize: '3rem', mb: 2, color: brand.accent }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>90-100%</Typography>
                <Typography variant="body2" sx={{ color: brand.borderBlue }}>Pass Rate</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', borderRadius: 3, p: 4, border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, color: 'white' }}>
                <Public sx={{ fontSize: '3rem', mb: 2, color: brand.accent }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>7</Typography>
                <Typography variant="body2" sx={{ color: brand.borderBlue }}>Campuses</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: brand.primary, fontSize: { xs: '2rem', md: '3rem' } }}>
              Our Partners
            </Typography>
            <Box sx={{ height: 4, width: 80, bgcolor: brand.primary, borderRadius: 2, mx: 'auto' }} />
          </Box>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                animation: 'scroll 30s linear infinite',
                '&:hover': { animationPlayState: 'paused' },
              }}
            >
              {partners.map((partner) => (
                <Box key={`first-${partner.id}`} sx={{ flexShrink: 0, width: 200, height: 120, mx: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box component="img" src={partner.logo} alt={partner.name} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'all 0.3s' }} />
                </Box>
              ))}
              {partners.map((partner) => (
                <Box key={`second-${partner.id}`} sx={{ flexShrink: 0, width: 200, height: 120, mx: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box component="img" src={partner.logo} alt={partner.name} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'all 0.3s' }} />
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
