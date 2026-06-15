import { Link } from '@inertiajs/react';
import { Box, Container, Grid, Typography, Button, Paper } from '@mui/material';
import { Phone, Language, School, Public, BusinessCenter, Place } from '@mui/icons-material';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { FONT_HEADING, FONT_BODY } from '../../config';

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
      component="img" loading="lazy"
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
          fontFamily: FONT_HEADING,
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
          fontFamily: FONT_BODY,
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
          fontFamily: FONT_HEADING,
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
      image: "/static/31.webp",
      href: "/admissions/career-guide/",
    },
    {
      title: "Student Life & Support",
      description: "Join a vibrant AIRADS community with mentoring, flexible campuses and learner support that helps you stay focused and confident.",
      icon: <Public fontSize="inherit" />,
      image: "/static/63.webp",
      href: "/campuses/",
    },
    {
      title: "Career Pathways & Attachment",
      description: "Move from classroom to workplace through industry attachment, guided career pathways and job-ready training outcomes.",
      icon: <BusinessCenter fontSize="inherit" />,
      image: "/static/17.webp",
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

  return (
    <Box component="section" sx={{ py: 10, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ borderRadius: 4, mb: 8, overflow: 'hidden' }}>
          <Grid container sx={{ alignItems: 'stretch' }}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: { xs: 380, lg: '100%' } }}>
                <Box
                  component="img" loading="lazy"
                  src="/static/ceo-min.webp"
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
              <Box
                sx={{
                  p: { xs: 4, lg: 5.5 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  bgcolor: '#ffffff',
                }}
              >
                <Box sx={{ maxWidth: 820 }}>
                  <Typography
                    sx={{
                      fontFamily: FONT_HEADING,
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      letterSpacing: 1.6,
                      textTransform: 'uppercase',
                      color: brand.primary,
                      mb: 1.5,
                    }}
                  >
                    Message From AIRADS Leadership
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ width: 4, height: 64, bgcolor: brand.primary, borderRadius: 2, mr: 2.25, mt: 0.35 }} />
                    <Box>
                      <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                          fontFamily: FONT_HEADING,
                          fontWeight: 800,
                          color: brand.neutralText,
                          fontSize: { xs: '2rem', lg: '2.9rem' },
                          lineHeight: 1.08,
                          mb: 1.25,
                        }}
                      >
                        Welcome to AIRADS College
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONT_BODY,
                          color: brand.primary,
                          fontSize: { xs: '1rem', md: '1.08rem' },
                          lineHeight: 1.7,
                          maxWidth: 700,
                        }}
                      >
                        A national TVET institution committed to practical skills, character,
                        innovation and opportunity for every learner.
                      </Typography>
                    </Box>
                </Box>

                  <Box
                    sx={{
                      color: 'text.secondary',
                      fontSize: '1.125rem',
                      lineHeight: 1.8,
                      mb: 3.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '1rem', md: '1.08rem' },
                        lineHeight: 1.85,
                        mb: 2.2,
                      }}
                    >
                      Welcome to AIRADS College, a national TVET technical training college
                      registered and licensed by TVETA. We are building a centre of excellence
                      where quality is nurtured, ambition is encouraged, and students are guided
                      toward employable, future-ready skills.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '1rem', md: '1.08rem' },
                        lineHeight: 1.85,
                      }}
                    >
                      Our focus on technical and vocational education is grounded in practical
                      learning. We believe TVET should empower trainees with confidence,
                      competence and the real-world experience needed to thrive in industry,
                      entrepreneurship and community leadership.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 4,
                      p: { xs: 2.5, md: 3 },
                      bgcolor: brand.softBlue,
                      borderRadius: 2.5,
                      borderLeft: `4px solid ${brand.primary}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_HEADING,
                        fontSize: { xs: '1.05rem', md: '1.2rem' },
                        color: brand.secondary,
                        fontWeight: 800,
                        lineHeight: 1.5,
                      }}
                    >
                      “A Centre of Excellence where quality is nurtured and every student is
                      prepared to grow into a capable professional.”
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    pt: 3,
                    mt: { xs: 3, md: 4 },
                    borderTop: '1px solid rgba(148, 163, 184, 0.28)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        color: brand.neutralText,
                        fontSize: '1rem',
                      }}
                    >
                      AIRADS College Leadership
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_BODY,
                        color: 'text.secondary',
                        fontSize: '0.98rem',
                        mt: 0.4,
                      }}
                    >
                      Guiding students with practical education, discipline and opportunity.
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: FONT_HEADING,
                      color: brand.accent,
                      fontWeight: 800,
                      letterSpacing: 0.6,
                    }}
                  >
                    Excellence Where Quality Is Nurtured
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
                fontFamily: FONT_HEADING,
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
                fontFamily: FONT_BODY,
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
            borderRadius: 0,
            color: 'white',
            boxShadow: '0 24px 46px rgba(15, 23, 42, 0.2)',
            overflow: 'hidden',
            position: 'relative',
            backgroundImage:
              `linear-gradient(90deg, rgba(104, 22, 31, 0.42) 0%, rgba(104, 22, 31, 0.18) 48%, rgba(37, 99, 235, 0.22) 100%), url('/static/68.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Grid container sx={{ position: 'relative', zIndex: 1, alignItems: 'stretch' }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 4 },
                  bgcolor: 'rgba(248, 250, 252, 0.94)',
                  color: brand.neutralText,
                  borderTop: { xs: `4px solid ${brand.accent}`, lg: 'none' },
                  borderLeft: { lg: `4px solid ${brand.accent}` },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.25 }}>
                  <Typography
                    sx={{
                      fontFamily: FONT_HEADING,
                      fontWeight: 800,
                      fontSize: { xs: '1.55rem', md: '2rem' },
                      lineHeight: 1.1,
                    }}
                  >
                    Need Help Applying?
                  </Typography>
                  <Box sx={{ flex: 1, height: 2, bgcolor: brand.accent, opacity: 0.9 }} />
                </Box>

                <Typography
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: { xs: '1rem', md: '1.02rem' },
                    lineHeight: 1.75,
                    color: brand.neutralText,
                    mb: 2.5,
                    maxWidth: 520,
                  }}
                >
                  Talk to our admissions team for help choosing a programme, finding your nearest
                  campus, completing your online form and understanding what you need before
                  registration.
                </Typography>

                <Box sx={{ display: 'grid', gap: 1, mb: 3 }}>
                  {[
                    'Get programme and campus guidance',
                    'Call or WhatsApp for quick admissions support',
                    'Apply online when you are ready',
                  ].map((item) => (
                    <Typography
                      key={item}
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: { xs: '0.98rem', md: '1rem' },
                        lineHeight: 1.6,
                        color: brand.neutralText,
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mb: 2.75 }}>
                  <Button
                    component="a"
                    href="/admissions/apply/"
                    variant="contained"
                    sx={{
                      bgcolor: '#b80f0f',
                      color: 'white',
                      fontFamily: FONT_HEADING,
                      fontWeight: 800,
                      px: 3,
                      py: 1.45,
                      borderRadius: 0,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#960c0c' },
                    }}
                  >
                    Apply Online
                  </Button>
                  <Button
                    component={Link}
                    href="/admissions/procedure/"
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(30, 41, 59, 0.22)',
                      color: brand.neutralText,
                      fontFamily: FONT_HEADING,
                      fontWeight: 800,
                      px: 3,
                      py: 1.45,
                      borderRadius: 0,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.06)',
                        borderColor: brand.primary,
                      },
                    }}
                  >
                    Admission Guide
                  </Button>
                </Box>

                <Typography
                  sx={{
                    fontFamily: FONT_BODY,
                    color: brand.mutedText,
                    fontSize: '0.96rem',
                    mb: 2.5,
                  }}
                >
                  Head Office: <Box component="span" sx={{ color: brand.neutralText, fontWeight: 700 }}>0723555999</Box>
                </Typography>

                <Box
                  sx={{
                    border: '1px solid rgba(30, 41, 59, 0.12)',
                    bgcolor: 'rgba(255,255,255,0.78)',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.25,
                      borderBottom: `2px solid ${brand.accent}`,
                    }}
                  >
                    <Place sx={{ color: brand.accent, fontSize: '1.2rem' }} />
                    <Typography
                      sx={{
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: brand.neutralText,
                      }}
                    >
                      Campus Direction Map
                    </Typography>
                  </Box>

                  <Box
                    component="iframe"
                    title="AIRADS campus coverage map"
                    src="https://www.google.com/maps?q=0.517358,35.2741286&z=17&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sx={{
                      width: '100%',
                      height: 220,
                      border: 0,
                      display: 'block',
                    }}
                  />

                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 1.25,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_BODY,
                        color: brand.mutedText,
                        fontSize: '0.93rem',
                        lineHeight: 1.6,
                      }}
                    >
                      Explore where AIRADS serves learners across Kenya, including our virtual campus option.
                    </Typography>
                    <Button
                      component={Link}
                      href="/campuses/"
                      sx={{
                        color: brand.primary,
                        fontFamily: FONT_HEADING,
                        fontWeight: 800,
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 0,
                        '&:hover': { bgcolor: 'transparent', color: brand.primaryHover },
                      }}
                    >
                      View Campuses
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Box
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 4 },
                  background: 'linear-gradient(90deg, rgba(24, 95, 173, 0.96) 0%, rgba(46, 117, 194, 0.86) 100%)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.75 }}>
                  <Phone sx={{ fontSize: '2rem', color: brand.accent }} />
                  <Typography
                    sx={{
                      fontFamily: FONT_HEADING,
                      fontWeight: 800,
                      fontSize: { xs: '1.5rem', md: '1.9rem' },
                      letterSpacing: 0.4,
                    }}
                  >
                    ADMISSIONS CHANNELS
                  </Typography>
                  <Box sx={{ flex: 1, height: 2, bgcolor: brand.accent, opacity: 0.95 }} />
                </Box>

                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.42)' }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.1fr) auto auto' },
                      gap: 1.5,
                      alignItems: 'center',
                      py: 1.45,
                      borderBottom: '1px solid rgba(255,255,255,0.42)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: brand.secondary,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(255,255,255,0.22)',
                        }}
                      >
                        <Language sx={{ fontSize: '1rem' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 600, color: 'white' }}>
                          Online Admission Form
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)' }}>
                          Start your application online
                        </Typography>
                      </Box>
                    </Box>
                    <Box />
                    <Button
                      component="a"
                      href="/admissions/apply/"
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontFamily: FONT_BODY,
                        fontWeight: 600,
                        justifySelf: { md: 'end' },
                      }}
                    >
                      Open Form
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.1fr) auto auto' },
                      gap: 1.5,
                      alignItems: 'center',
                      py: 1.45,
                      borderBottom: '1px solid rgba(255,255,255,0.42)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: brand.secondary,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(255,255,255,0.22)',
                        }}
                      >
                        <School sx={{ fontSize: '1rem' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 600, color: 'white' }}>
                          Admission Guide
                        </Typography>
                        <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)' }}>
                          Review requirements and application steps
                        </Typography>
                      </Box>
                    </Box>
                    <Box />
                    <Button
                      component={Link}
                      href="/admissions/procedure/"
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontFamily: FONT_BODY,
                        fontWeight: 600,
                        justifySelf: { md: 'end' },
                      }}
                    >
                      View Guide
                    </Button>
                  </Box>

                  {[
                    { campus: 'Head Office Admissions', contact: '0723555999' },
                    ...campusContacts,
                  ].map((campus) => (
                    <Box
                      key={campus.campus}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 1.2, md: 1.5 },
                        alignItems: { xs: 'stretch', md: 'center' },
                        py: 1.35,
                        borderBottom: '1px solid rgba(255,255,255,0.42)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: brand.secondary,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            border: '1px solid rgba(255,255,255,0.22)',
                          }}
                        >
                          <Phone sx={{ fontSize: '1rem' }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontFamily: FONT_BODY, fontWeight: 600, color: 'white' }}>
                            {campus.campus}
                          </Typography>
                          <Typography sx={{ fontFamily: FONT_BODY, fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)' }}>
                            {campus.contact}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1.5, md: 1.1 },
                          pl: { xs: 5.25, md: 0 },
                          justifyContent: { xs: 'flex-start', md: 'flex-end' },
                          flexWrap: 'nowrap',
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handlePhoneCall(campus.contact)}
                          sx={{
                            color: 'white',
                            textTransform: 'none',
                            fontFamily: FONT_BODY,
                            fontWeight: 600,
                            minWidth: 'auto',
                            whiteSpace: 'nowrap',
                            px: 0,
                          }}
                        >
                          Call
                        </Button>

                        <Button
                          size="small"
                          onClick={() => handleWhatsApp(campus.contact)}
                          sx={{
                            color: '#bfdbfe',
                            textTransform: 'none',
                            fontFamily: FONT_BODY,
                            fontWeight: 600,
                            minWidth: 'auto',
                            whiteSpace: 'nowrap',
                            px: 0,
                          }}
                        >
                          WhatsApp
                        </Button>
                      </Box>
                    </Box>
                  ))}
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
