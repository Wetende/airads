import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, EmojiEvents, Public, School } from '@mui/icons-material';
import { Avatar, Box, Container, Grid, IconButton, Typography } from '@mui/material';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { FONT_ARCHIVO, FONT_FIGTREE } from '../../config';

const testimonials = [
  {
    id: 1,
    quote: "I studied in AIRADS Kericho Campus in 2016. Indeed it is where my dreams were hatched and ultimately I am who I am today because of this institution.",
    author: "Janeth Chepkorir",
    details: "Class of 2016, Kericho Campus",
    course: "Business Administration",
    initials: "JC",
  },
  {
    id: 2,
    quote: "AIRADS College provided me with the practical skills and knowledge I needed to excel in my career. The lecturers were supportive and the learning environment was exceptional.",
    author: "David Kimani",
    details: "Class of 2018, Nairobi Campus",
    course: "Information Technology",
    initials: "DK",
  },
  {
    id: 3,
    quote: "The hands-on approach to learning at AIRADS prepared me for the real world. I am now running my own successful business thanks to the entrepreneurship skills I gained here.",
    author: "Mary Wanjiku",
    details: "Class of 2019, Eldoret Campus",
    course: "Entrepreneurship",
    initials: "MW",
  },
  {
    id: 4,
    quote: "AIRADS College changed my life completely. The quality education and mentorship I received here opened doors to opportunities I never imagined possible.",
    author: "James Mwangi",
    details: "Class of 2020, Mombasa Campus",
    course: "Hospitality Management",
    initials: "JM",
  },
];

const partners = [
  { id: 1, name: "KATTI", logo: "/static/katti-logo.png" },
  { id: 2, name: "KNEC", logo: "/static/logo_knec_new.png" },
  { id: 3, name: "Ministry of Education", logo: "/static/MOE-logo.jpg" },
  { id: 4, name: "NITA", logo: "/static/NITA-Logo.png" },
  { id: 5, name: "TVET CDACC", logo: "/static/TVET-CDACC-logo.png" },
  { id: 6, name: "TVETA", logo: "/static/TVETA-web-Logo.png" },
];

const stats = [
  { label: "Graduates", value: "5000+", icon: School },
  { label: "Pass Rate", value: "90-100%", icon: EmojiEvents },
  { label: "Campuses", value: "7", icon: Public },
];

const scrollKeyframes = `
  @keyframes partner-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const TestimonialSection = () => {
  const brand = usePublicBrand();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => (
        previousIndex === testimonials.length - 1 ? 0 : previousIndex + 1
      ));
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };
  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <>
      <style>{scrollKeyframes}</style>
      <Box
        component="section"
        sx={{
          py: { xs: 7, md: 10 },
          bgcolor: '#111827',
          color: 'white',
          overflow: 'hidden',
          borderTop: `6px solid ${brand.accent}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: brand.accent,
                      fontFamily: FONT_ARCHIVO,
                      fontWeight: 800,
                      letterSpacing: 1.2,
                    }}
                  >
                    Student Outcomes
                  </Typography>
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontFamily: FONT_ARCHIVO,
                      fontWeight: 800,
                      fontSize: { xs: '2rem', md: '2.65rem' },
                      lineHeight: 1.05,
                      mt: 1.5,
                      mb: 2.5,
                    }}
                  >
                    Student Success Stories
                  </Typography>
                  <Typography
                    sx={{
                      color: '#cbd5e1',
                      fontFamily: FONT_FIGTREE,
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      maxWidth: 360,
                    }}
                  >
                    Real student progress from practical training, campus support and career-focused learning.
                  </Typography>
                </Box>

                <Grid container spacing={1.5} sx={{ mt: { xs: 4, md: 6 } }}>
                  {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Grid key={item.label} size={{ xs: 4 }}>
                        <Box
                          sx={{
                            border: '1px solid rgba(255,255,255,0.12)',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            p: { xs: 1.5, md: 2 },
                            minHeight: 132,
                          }}
                        >
                          <Icon sx={{ color: brand.accent, fontSize: '1.6rem', mb: 1.5 }} />
                          <Typography sx={{ fontFamily: FONT_ARCHIVO, fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.55rem' } }}>
                            {item.value}
                          </Typography>
                          <Typography sx={{ color: '#94a3b8', fontFamily: FONT_FIGTREE, fontSize: '0.82rem' }}>
                            {item.label}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
                sx={{
                  position: 'relative',
                  height: '100%',
                  minHeight: { xs: 430, md: 500 },
                  border: '1px solid rgba(255,255,255,0.12)',
                  bgcolor: '#0b1220',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    transition: 'transform 0.7s ease',
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial) => (
                    <Box
                      key={testimonial.id}
                      sx={{
                        width: '100%',
                        flexShrink: 0,
                        p: { xs: 3, sm: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: brand.accent,
                            fontFamily: FONT_ARCHIVO,
                            fontWeight: 800,
                            fontSize: { xs: '3.5rem', md: '5rem' },
                            lineHeight: 0.75,
                            mb: 2,
                          }}
                        >
                          &ldquo;
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#f8fafc',
                            fontFamily: FONT_FIGTREE,
                            fontWeight: 500,
                            fontSize: { xs: '1.25rem', md: '1.55rem' },
                            lineHeight: 1.55,
                            maxWidth: 760,
                          }}
                        >
                          {testimonial.quote}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2,
                          pt: 4,
                          mt: 5,
                          borderTop: '1px solid rgba(255,255,255,0.12)',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 68,
                            height: 68,
                            bgcolor: brand.accent,
                            color: 'white',
                            fontFamily: FONT_ARCHIVO,
                            fontWeight: 800,
                          }}
                        >
                          {testimonial.initials}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily: FONT_ARCHIVO, fontWeight: 800, fontSize: '1.15rem' }}>
                            {testimonial.author}
                          </Typography>
                          <Typography sx={{ color: '#cbd5e1', fontFamily: FONT_FIGTREE, fontSize: '0.95rem', mt: 0.4 }}>
                            {testimonial.details}
                          </Typography>
                          <Typography sx={{ color: brand.accent, fontFamily: FONT_FIGTREE, fontWeight: 700, fontSize: '0.88rem', mt: 0.8 }}>
                            {testimonial.course}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ position: 'absolute', right: { xs: 18, md: 28 }, bottom: { xs: 18, md: 28 }, display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={goToPrevious}
                    sx={{
                      width: 44,
                      height: 44,
                      border: '1px solid rgba(255,255,255,0.18)',
                      bgcolor: 'rgba(255,255,255,0.06)',
                      color: 'white',
                      '&:hover': { bgcolor: brand.accent },
                    }}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={goToNext}
                    sx={{
                      width: 44,
                      height: 44,
                      border: '1px solid rgba(255,255,255,0.18)',
                      bgcolor: 'rgba(255,255,255,0.06)',
                      color: 'white',
                      '&:hover': { bgcolor: brand.accent },
                    }}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>

                <Box sx={{ position: 'absolute', left: { xs: 24, md: 48 }, bottom: { xs: 28, md: 40 }, display: 'flex', gap: 1 }}>
                  {testimonials.map((testimonial, index) => (
                    <Box
                      key={testimonial.id}
                      onClick={() => setCurrentIndex(index)}
                      sx={{
                        width: index === currentIndex ? 26 : 8,
                        height: 8,
                        borderRadius: 999,
                        bgcolor: index === currentIndex ? brand.accent : 'rgba(255,255,255,0.32)',
                        cursor: 'pointer',
                        transition: 'width 0.2s ease, background-color 0.2s ease',
                      }}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 9 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontFamily: FONT_ARCHIVO,
                fontWeight: 800,
                mb: 1.5,
                color: brand.primary,
                fontSize: { xs: '2rem', md: '2.65rem' },
              }}
            >
              Our Partners
            </Typography>
            <Box sx={{ height: 4, width: 80, bgcolor: brand.accent, borderRadius: 2, mx: 'auto' }} />
          </Box>

          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                animation: 'partner-scroll 30s linear infinite',
                '&:hover': { animationPlayState: 'paused' },
              }}
            >
              {[...partners, ...partners].map((partner, index) => (
                <Box
                  key={`${partner.id}-${index}`}
                  sx={{
                    flexShrink: 0,
                    width: 200,
                    height: 120,
                    mx: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src={partner.logo}
                    alt={partner.name}
                    sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
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
