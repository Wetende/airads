import { Link } from '@inertiajs/react';
import { Box, Container, Grid, Typography, Button, Paper } from '@mui/material';
import { WhatsApp, Phone, Language, School, Public, BusinessCenter, Facebook } from '@mui/icons-material';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { FONT_ARCHIVO, FONT_FIGTREE } from '../../config';

const WhyJoinLifeCard = ({ item, brand }) => (
  <Box
    sx={{
      position: 'relative',
      minHeight: { xs: 320, md: 430 },
      borderRadius: 1.5,
      overflow: 'hidden',
      boxShadow: '0 18px 36px rgba(15, 23, 42, 0.16)',
      isolation: 'isolated',
      '&:hover .why-join-image': {
        transform: 'scale(1.08)',
      },
      '&:hover .why-join-overlay': {
        background:
          'linear-gradient(180deg, rgba(15,23,42,0.22) 0%, rgba(15,23,42,0.76) 100%)',
      },
      '&:hover .why-join-button': {
        transform: 'translateY(-2px)',
        boxShadow: '0 14px 26px rgba(220,37,37,0.34)',
      },
    }}
  >
    <Box
      component="img"
      src={item.image}
      alt={item.title}
      className="why-join-image"
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.45s ease',
      }}
    />
    <Box
      className="why-join-overlay"
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, rgba(15,23,42,0.28) 0%, rgba(15,23,42,0.7) 100%)',
        transition: 'background 0.3s ease',
      }}
    />
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: { xs: 2, md: 3.25 },
        py: { xs: 3, md: 4 },
        color: 'white',
      }}
    >
      <Box
        sx={{
          width: { xs: 58, md: 62 },
          height: { xs: 58, md: 62 },
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.22)',
          bgcolor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: { xs: '1.7rem', md: '1.85rem' },
          mb: 2,
        }}
      >
        {item.icon}
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONT_ARCHIVO,
          fontWeight: 800,
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          lineHeight: 1.2,
          mb: 1.75,
          maxWidth: 260,
        }}
      >
        {item.title}
      </Typography>
      <Typography
        sx={{
          fontFamily: FONT_FIGTREE,
          fontSize: { xs: '0.95rem', md: '1rem' },
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.92)',
          maxWidth: 280,
          mb: 3,
        }}
      >
        {item.description}
      </Typography>
      <Button
        component={Link}
        href={item.href}
        className="why-join-button"
        sx={{
          bgcolor: 'white',
          color: brand.accent,
          fontFamily: FONT_ARCHIVO,
          fontWeight: 800,
          fontSize: '0.98rem',
          px: { xs: 2.5, md: 3.5 },
          py: 1.2,
          borderRadius: 999,
          textTransform: 'none',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease',
          '&:hover': {
            bgcolor: brand.softRed,
          },
        }}
      >
        Learn More
      </Button>
    </Box>
  </Box>
);

const WelcomeSection = () => {
  const brand = usePublicBrand();

  const whyJoinReasons = [
    {
      title: "Practical Skills Training",
      description: "Train in real learning spaces with hands-on delivery built for TVET, business, ICT, hospitality and media excellence.",
      icon: <School fontSize="inherit" />,
      image: "/static/31.jpg",
      href: "/admissions/career-guide/",
    },
    {
      title: "Student Life & Support",
      description: "Join a vibrant AIRADS community with mentoring, flexible campuses and learner support that helps you stay focused and confident.",
      icon: <Public fontSize="inherit" />,
      image: "/static/63.JPG",
      href: "/campuses/",
    },
    {
      title: "Career Pathways & Attachment",
      description: "Move from classroom to workplace through industry attachment, guided career pathways and job-ready training outcomes.",
      icon: <BusinessCenter fontSize="inherit" />,
      image: "/static/17.jpg",
      href: "/admissions/procedure/",
    },
  ];

  const campusContacts = [
    { campus: "ELDORET Campus", contact: "0715696979" },
    { campus: "NAKURU Campus", contact: "0711488302" },
    { campus: "KERICHO Campus", contact: "0729976885" },
    { campus: "KISUMU Campus", contact: "0715057262" },
    { campus: "BUNGOMA Campus", contact: "0715771316" },
    { campus: "MARALAL Campus", contact: "0717885888" },
    { campus: "Head Office", contact: "0723555999" },
  ];

  const handlePhoneCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber) => {
    const formattedNumber = phoneNumber.replace(/[-\s]/g, '');
    window.open(`https://wa.me/254${formattedNumber.substring(1)}`, '_blank');
  };

  const handleFacebookVisit = () => {
    window.open('https://www.facebook.com/www.airads.ac.ken/', '_blank');
  };

  return (
    <Box component="section" sx={{ py: 10, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ borderRadius: 4, mb: 8, overflow: 'hidden' }}>
          <Grid container>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: { xs: 400, lg: 500 } }}>
                <Box
                  component="img"
                  src="/static/ceo-min.png"
                  alt="AIRADS College CEO"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s', '&:hover': { transform: 'scale(1.05)' } }}
                />
                <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.45)' }} />
                <Box sx={{ position: 'absolute', bottom: 24, left: 24, color: 'white' }}>
                  <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', borderRadius: 2, px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">CEO Message</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Welcome to Excellence</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <Box sx={{ p: { xs: 4, lg: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: 4, height: 60, bgcolor: brand.primary, borderRadius: 2, mr: 2 }} />
                  <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: brand.neutralText, fontSize: { xs: '2rem', lg: '3rem' } }}>
                    Welcome to AIRADS College
                  </Typography>
                </Box>

                <Box sx={{ color: 'text.secondary', fontSize: '1.125rem', lineHeight: 1.8 }}>
                  <Typography variant="body1" paragraph>
                    Welcome to AIRADS College a national TVET technical training college. We are the best college
                    registered and licensed by TVETA, a Centre of Excellence where Quality is Nurtured.
                  </Typography>
                  <Typography variant="body1">
                    We focus on Technical vocational Education and training TVET - TVET education worldwide is seen
                    as a tool that empowers trainees with practical skills.
                  </Typography>
                </Box>

                <Box sx={{ mt: 4, p: 3, bgcolor: brand.softBlue, borderRadius: 2, borderLeft: `4px solid ${brand.primary}` }}>
                  <Typography variant="h6" sx={{ color: brand.secondary, fontWeight: 'bold' }}>
                    A Centre of Excellence{' '}
                    <Typography component="span" sx={{ color: brand.accent, fontWeight: 600 }}>
                      Where Quality is Nurtured
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontFamily: FONT_ARCHIVO,
                fontWeight: 800,
                color: brand.neutralText,
                mb: 1.5,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Why Join AIRADS College?
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_FIGTREE,
                color: brand.primary,
                fontSize: { xs: '1rem', md: '1.2rem' },
                mb: 2.5,
              }}
            >
              A practical student experience shaped by skills, support and career momentum
            </Typography>
            <Box sx={{ width: 120, height: 4, bgcolor: brand.accent, mx: 'auto', borderRadius: 2 }} />
          </Box>

          <Box
            sx={{
              width: '100vw',
              position: 'relative',
              left: '50%',
              ml: '-50vw',
              px: { xs: 2, sm: 3, md: 5 },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
                gap: { xs: 1.5, md: 3 },
              }}
            >
              {whyJoinReasons.map((reason) => (
                <WhyJoinLifeCard key={reason.title} item={reason} brand={brand} />
              ))}
            </Box>
          </Box>
        </Box>

        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            bgcolor: brand.secondary,
            color: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            How to Apply or Register
          </Typography>

          <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ fontSize: '2rem', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Call/SMS/WhatsApp</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>Contact any of our campus admission lines</Typography>

                  <Grid container spacing={2}>
                    {campusContacts.map((campus, index) => (
                      <Grid key={index} size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', p: 2, borderRadius: 2, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                          <Typography variant="subtitle2" sx={{ color: brand.accent, fontWeight: 'bold', mb: 1 }}>{campus.campus}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                              size="small"
                              onClick={() => handlePhoneCall(campus.contact)}
                              sx={{ color: 'white', textTransform: 'none', minWidth: 'auto', p: 0, '&:hover': { color: '#fef08a' } }}
                              startIcon={<Phone fontSize="small" />}
                            >
                              Call
                            </Button>
                            <Typography sx={{ color: 'white' }}>|</Typography>
                            <Button
                              size="small"
                              onClick={() => handleWhatsApp(campus.contact)}
                              sx={{ color: 'white', textTransform: 'none', minWidth: 'auto', p: 0, '&:hover': { color: '#86efac' } }}
                              startIcon={<WhatsApp fontSize="small" />}
                            >
                              WhatsApp
                            </Button>
                          </Box>
                          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'white' }}>{campus.contact}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Language sx={{ fontSize: '2rem', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Apply Online</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>Visit our website to apply online</Typography>
                  <Button
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded"
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fef08a', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#fef9c3' }, textTransform: 'none', justifyContent: 'flex-start' }}
                    startIcon={<Language />}
                  >
                    Airads Admission Form
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Facebook sx={{ fontSize: '2.5rem', mr: 2, color: brand.primary }} />
                    <Typography variant="h6" fontWeight="bold">Facebook Messenger</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>Use Facebook inbox to reach us instantly</Typography>
                  <Button
                    onClick={handleFacebookVisit}
                    fullWidth
                    startIcon={<Facebook />}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fef08a', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: `rgba(${brand.primary}, 0.3)`, color: '#fef9c3' }, textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    AIRADS College Facebook Page
                  </Button>
                </Box>

                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ fontSize: '2.5rem', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Head Office</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>Contact our main office for general inquiries</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={() => handlePhoneCall('0723555999')}
                      fullWidth
                      startIcon={<Phone />}
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fef08a', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)', color: '#fef9c3' }, textTransform: 'none' }}
                    >
                      0723555999
                    </Button>
                    <Button
                      onClick={() => handleWhatsApp('0723-555-999')}
                      fullWidth
                      startIcon={<WhatsApp />}
                      sx={{ bgcolor: 'rgba(22, 163, 74, 0.2)', color: '#bbf7d0', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: 'rgba(22, 163, 74, 0.4)', color: '#dcfce3' }, textTransform: 'none' }}
                    >
                      WhatsApp
                    </Button>
                  </Box>
                </Box>

                <Box sx={{
                  bgcolor: brand.softRed,
                  border: `2px solid ${brand.accent}`,
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: brand.accent, color: 'white' },
                }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: brand.accent, display: 'flex', alignItems: 'center', mb: 1, '&:hover': { color: 'inherit' } }}>
                    Register Now!
                  </Typography>
                  <Typography variant="body2" sx={{ color: brand.mutedText }}>Don&apos;t miss out on our quality education. Contact us today!</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomeSection;
