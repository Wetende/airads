import { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import { Link } from '@inertiajs/react';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { FONT_ARCHIVO } from '../../config';

const slides = [
  {
    image: '/static/63.JPG',
    title: 'Centre of Excellence',
    subtitle: '18 Years of Consistent KNEC Excellence',
    description: 'AIRADS College — A Centre of Excellence with 90-100% pass rate in KNEC, NITA, ICM & KASNEB Exams.',
    cta: { text: 'Read More', href: '/about/' },
  },
  {
    image: '/static/68.JPG',
    title: 'May/June Intake',
    subtitle: 'Enrollment in Progress',
    description: 'Register now for Diploma, Certificate, Artisan and Short Courses across all our campuses.',
    cta: { text: 'Apply Now', href: '/admissions/procedure/' },
  },
  {
    image: '/static/6.7.JPG',
    title: 'Practical Skills Training',
    subtitle: 'TVET Education for Real-World Impact',
    description: 'Empowering trainees with practical skills for a competitive job market through hands-on training.',
    cta: { text: 'View Courses', href: '/admissions/career-guide/' },
  },
  {
    image: '/static/7.1.JPG',
    title: '8 Campuses Nationwide',
    subtitle: 'Bringing Education Closer to You',
    description: 'Study at Bungoma, Kericho, Eldoret, Kisumu, Nakuru, Lodwar, Maralal or our Virtual Campus.',
    cta: { text: 'Our Campuses', href: '/campuses/bungoma/' },
  },
];

const HeroSection = () => {
  const brand = usePublicBrand();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = slides[currentIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '80vh' },
        maxHeight: 700,
        overflow: 'hidden',
      }}
    >
      {/* Background images (crossfade) */}
      {slides.map((s, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            inset: 0,
            transition: 'opacity 1s ease-in-out',
            opacity: i === currentIndex ? 1 : 0,
          }}
        >
          <Box
            component="img"
            src={s.image}
            alt={s.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ))}

      {/* Dark gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.5) 50%, rgba(15,23,42,0.2) 100%)',
          zIndex: 2,
        }}
      />

      {/* Content — left-aligned like MUT */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: { xs: '100%', md: '55%' }, color: 'white' }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontFamily: FONT_ARCHIVO,
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              lineHeight: 1.15,
              mb: 2,
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            {slide.title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.25rem' },
              mb: 2,
              opacity: 0.9,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            {slide.subtitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9rem', md: '1rem' },
              lineHeight: 1.7,
              mb: 4,
              maxWidth: 520,
              opacity: 0.85,
            }}
          >
            {slide.description}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
            <Button
              component={Link}
              href={slide.cta.href}
              variant="contained"
              sx={{
                bgcolor: brand.accent,
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 4,
                py: 1.5,
                borderRadius: 1,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(220,37,37,0.3)',
                '&:hover': {
                  bgcolor: brand.accentHover,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(220,37,37,0.4)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              {slide.cta.text} ›
            </Button>

            {/* Contact info below CTA */}
            <Box sx={{ display: 'flex', gap: 3, opacity: 0.85 }}>
              <Typography variant="body2" component="a" href="tel:+254723555999" sx={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: brand.primary } }}>
                <span role="img" aria-label="phone">📞</span> +254 723 555 999
              </Typography>
              <Typography variant="body2" component="a" href="mailto:info@airads.ac.ke" sx={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: brand.primary } }}>
                <span role="img" aria-label="email">✉️</span> info@airads.ac.ke
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Navigation arrows */}
      <IconButton
        onClick={goPrev}
        aria-label="Previous slide"
        sx={{
          position: 'absolute',
          left: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          bgcolor: 'rgba(255,255,255,0.15)',
          color: 'white',
          backdropFilter: 'blur(4px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
        }}
      >
        <ChevronLeftIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={goNext}
        aria-label="Next slide"
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          bgcolor: 'rgba(255,255,255,0.15)',
          color: 'white',
          backdropFilter: 'blur(4px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
        }}
      >
        <ChevronRightIcon fontSize="large" />
      </IconButton>

      {/* Slide indicator dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex',
          gap: 1,
        }}
      >
        {slides.map((_, i) => (
          <Box
            key={i}
            onClick={() => setCurrentIndex(i)}
            sx={{
              width: i === currentIndex ? 32 : 10,
              height: 10,
              borderRadius: 5,
              bgcolor: i === currentIndex ? brand.accent : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { bgcolor: i === currentIndex ? brand.accent : 'rgba(255,255,255,0.8)' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSection;
