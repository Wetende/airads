import { Box, Typography, Grid, Button, Stack } from '@mui/material';
import { Link } from '@inertiajs/react';
import {
  IconSchool,
  IconClipboardText,
  IconBuildingBank,
  IconWorld,
  IconUsers,
  IconFileInvoice,
} from '@tabler/icons-react';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { FONT_HEADING, FONT_BODY } from '../../config';

const quickLinks = [
  { icon: IconSchool, label: 'Programmes', href: '/admissions/career-guide/' },
  { icon: IconClipboardText, label: 'Admissions', href: '/admissions/procedure/' },
  { icon: IconBuildingBank, label: 'Campuses', href: '/campuses/' },
  { icon: IconWorld, label: 'Virtual Campus', href: 'https://virtual.airads.ac.ke/', external: true },
  { icon: IconUsers, label: 'Student Portal', href: '/students/' },
  { icon: IconFileInvoice, label: 'Downloads', href: '/admissions/forms/' },
];

const QuickLinksAdmissionSection = () => {
  const brand = usePublicBrand();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 0, md: 1.5 },
        px: { xs: 0, md: 2.5 },
        bgcolor: '#eef2f7',
      }}
    >
      <Grid
        container
        sx={{
          overflow: 'hidden',
          minHeight: { md: 540 },
          boxShadow: '0 22px 48px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: '100%',
              position: 'relative',
              background: `linear-gradient(105deg, ${brand.softBlue} 0%, rgba(186, 230, 253, 0.86) 38%, rgba(219, 234, 254, 0.7) 74%, #ffffff 100%)`,
              px: { xs: 3, sm: 4, md: 7 },
              py: { xs: 5, md: 6.5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 18% 86%, rgba(59, 130, 246, 0.18) 0, rgba(59, 130, 246, 0) 34%), radial-gradient(circle at 36% 24%, rgba(37, 99, 235, 0.14) 0, rgba(37, 99, 235, 0) 30%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  color: brand.accent,
                  fontSize: { xs: '2rem', md: '2.65rem' },
                  lineHeight: 1.08,
                  mb: 3,
                  maxWidth: 540,
                }}
              >
                Study at AIRADS College
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: brand.neutralText,
                  mb: 5,
                  maxWidth: 620,
                  lineHeight: 1.7,
                  fontFamily: FONT_BODY,
                  fontSize: { xs: '1rem', md: '1.05rem' },
                }}
              >
                AIRADS College opens practical pathways into media, business, ICT,
                hospitality and professional training, backed by flexible campuses and
                student support that keep you moving toward employable skills.
              </Typography>

              <Stack spacing={0}>
                {quickLinks.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Box
                      key={item.label}
                      component={item.external ? 'a' : Link}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 1.85,
                        pr: { xs: 1, md: 4 },
                        textDecoration: 'none',
                        color: brand.accent,
                        borderTop: index === 0 ? '1px solid rgba(255,255,255,0.82)' : 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.82)',
                        transition:
                          'transform 0.22s ease, background-color 0.22s ease, padding-left 0.22s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.18)',
                          transform: 'translateX(6px)',
                          pl: 0.5,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          flexShrink: 0,
                          borderRadius: 0.8,
                          bgcolor: brand.primary,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 10px 18px rgba(37, 99, 235, 0.24)',
                        }}
                      >
                        <Icon size={18} stroke={1.8} />
                      </Box>
                      <Typography
                        sx={{
                          color: brand.accent,
                          fontFamily: FONT_BODY,
                          fontWeight: 500,
                          fontSize: { xs: '1rem', md: '1.06rem' },
                          letterSpacing: 0.1,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: '100%',
              minHeight: { xs: 380, md: 'auto' },
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src="/static/68.JPG"
              alt="AIRADS Campus"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(15,23,42,0.74) 0%, rgba(15,23,42,0.58) 34%, rgba(15,23,42,0.42) 100%)',
              }}
            />
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                color: 'white',
                textAlign: 'left',
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 5, md: 6 },
                maxWidth: 620,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: brand.accent,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1.9,
                  fontSize: '0.95rem',
                  mb: 1.6,
                  display: 'block',
                }}
              >
                May/June intake is now open
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: { xs: '1.95rem', sm: '2.45rem', md: '3rem' },
                  lineHeight: 1.05,
                  mb: 2.1,
                  maxWidth: 'none',
                  whiteSpace: { md: 'nowrap' },
                }}
              >
                Apply for Admission
              </Typography>
              <Box
                sx={{
                  width: 116,
                  height: 2,
                  bgcolor: brand.accent,
                  mb: 5,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4.25,
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.05rem' },
                  maxWidth: 520,
                }}
              >
                Join AIRADS College for diploma, certificate, artisan and short courses
                designed to build practical confidence, industry readiness and career
                momentum.
              </Typography>
              <Button
                component="a"
                href="/admissions/apply/"
                variant="contained"
                sx={{
                  backgroundColor: brand.accent,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 4.25,
                  py: 1.55,
                  minWidth: 156,
                  borderRadius: 999,
                  textTransform: 'none',
                  boxShadow: '0 10px 24px rgba(220,37,37,0.32)',
                  '&:hover': {
                    backgroundColor: brand.accentHover,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 28px rgba(220,37,37,0.45)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                Apply Now
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickLinksAdmissionSection;
