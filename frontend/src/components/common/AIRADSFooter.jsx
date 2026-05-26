import { FaWhatsapp, FaFacebook, FaTiktok } from 'react-icons/fa';
import {
  AccessTime,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Place,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  Fab,
  Grid,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { FONT_HEADING, FONT_BODY } from '../../config';

const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'About AIRADS', href: '/about/' },
      { label: 'Courses We Offer', href: '/courses/' },
      { label: 'AIRADS Schools & Courses', href: '/schools/' },
      { label: 'Admissions', href: '/admissions/' },
      { label: 'How to Apply', href: '/admissions/procedure/' },
      { label: 'Contact Us', href: '/contact/' },
    ],
  },
  {
    title: 'Student Life',
    links: [
      { label: 'Student Portal', href: '/students/' },
      { label: 'Application Forms', href: '/admissions/forms/' },
      { label: 'Career Guide & Prospectus', href: '/admissions/career-guide/' },
      { label: 'Industrial Attachment', href: '/students/' },
      { label: 'Events & News', href: '/news/latest/' },
      { label: 'Downloads', href: '/students/' },
    ],
  },
  {
    title: 'AIRADS Portals',
    links: [
      {
        label: 'Apply Online',
        href: '/admissions/apply/',
      },
      { label: 'Virtual Campus', href: '/campuses/virtual/' },
      { label: 'Campuses', href: '/campuses/' },
      { label: 'TVET/CDACC Courses', href: '/schools/tvet-cdacc-courses/' },
      { label: 'KASNEB Courses', href: '/schools/kasneb-courses/' },
      { label: 'NITA Courses', href: '/schools/nita-courses/' },
    ],
  },
];

const socialLinks = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@airads.college', Icon: FaTiktok },
  { label: 'Facebook', href: 'https://www.facebook.com/airads.college', Icon: FaFacebook },
  { label: 'WhatsApp', href: 'https://wa.me/254723555999', Icon: FaWhatsapp },
];

const regulatoryLinks = [
  { label: 'TVETA', href: 'https://tveta.go.ke' },
  { label: 'CDACC', href: 'https://tvetcdacc.go.ke/' },
];

const FooterHeading = ({ children }) => (
  <Box sx={{ mb: 2.1 }}>
    <Typography
      component="h3"
      sx={{
        color: 'white',
        fontFamily: FONT_HEADING,
        fontWeight: 800,
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
      }}
    >
      {children}
    </Typography>
    <Box sx={{ width: '100%', maxWidth: 292, height: 2, bgcolor: 'white', mt: 1.1 }} />
  </Box>
);

const FooterLink = ({ item }) => {
  const commonSx = {
    display: 'block',
    color: 'rgba(255,255,255,0.86)',
    fontFamily: FONT_BODY,
    fontSize: '0.95rem',
    lineHeight: 1.45,
    textDecoration: 'none',
    py: 0.48,
    transition: 'color 0.2s, padding-left 0.2s',
    '&:hover': {
      color: 'white',
      pl: 0.75,
    },
  };

  if (item.external) {
    return (
      <MuiLink href={item.href} target="_blank" rel="noopener noreferrer" sx={commonSx}>
        {item.label}
      </MuiLink>
    );
  }

  return (
      <MuiLink href={item.href} sx={commonSx}>
      {item.label}
    </MuiLink>
  );
};

const Footer = () => {
  const brand = usePublicBrand();

  return (
    <Box component="footer" sx={{ mt: 0, color: 'white', position: 'relative' }}>
      <Box
        sx={{
          bgcolor: brand.accent,
          pt: { xs: 4, md: 4.8 },
          pb: { xs: 3.5, md: 4.4 },
          borderTop: `5px solid ${brand.secondary}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={0}>
            <Grid
              size={{ xs: 12, md: 6, lg: 3 }}
              sx={{
                pr: { lg: 3.5 },
                pb: { xs: 3, lg: 0 },
                borderRight: { lg: `1px solid ${brand.secondary}` },
              }}
            >
              <FooterHeading>AIRADS College</FooterHeading>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.88)',
                  fontFamily: FONT_BODY,
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  mb: 2,
                }}
              >
                African Institute of Research and Development Studies is a TVET-focused college
                offering practical training, professional courses and flexible campus-based learning.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.05 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Place sx={{ color: brand.secondary, fontSize: '1.15rem', mt: 0.25 }} />
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.84)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      Institute Plaza, 3rd & 4th Floor, Head Office
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <EmailIcon sx={{ color: brand.secondary, fontSize: '1.15rem', mt: 0.15 }} />
                  <MuiLink href="mailto:info@airads.ac.ke" sx={{ color: 'white', textDecoration: 'none' }}>
                    info@airads.ac.ke
                  </MuiLink>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <PhoneIcon sx={{ color: brand.secondary, fontSize: '1.15rem', mt: 0.15 }} />
                  <MuiLink href="tel:+254723555999" sx={{ color: 'white', textDecoration: 'none' }}>
                    +254 723 555 999
                  </MuiLink>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <AccessTime sx={{ color: brand.secondary, fontSize: '1.15rem', mt: 0.25 }} />
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.84)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      Monday to Friday, 8:00am - 5:00pm
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 2.4 }}>
                <Typography
                  sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    mb: 1.4,
                  }}
                >
                  Follow Our Channels
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.1, flexWrap: 'wrap' }}>
                  {socialLinks.map(({ label, href, Icon }) => (
                    <MuiLink
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      sx={{
                        width: 34,
                        height: 34,
                        border: '1px solid rgba(255,255,255,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textDecoration: 'none',
                        '&:hover': { bgcolor: brand.secondary, borderColor: brand.secondary },
                      }}
                    >
                      <Icon />
                    </MuiLink>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 2.4 }}>
                <Typography
                  sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    mb: 1.1,
                  }}
                >
                  Regulatory Links
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.35 }}>
                  {regulatoryLinks.map((item) => (
                    <MuiLink
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'rgba(255,255,255,0.86)',
                        fontFamily: FONT_BODY,
                        fontSize: '0.92rem',
                        lineHeight: 1.45,
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'white',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {item.label}
                    </MuiLink>
                  ))}
                </Box>
              </Box>
            </Grid>

            {footerColumns.map((column) => (
              <Grid
                key={column.title}
                size={{ xs: 12, md: 4, lg: 3 }}
                sx={{
                  pl: { lg: 3.5 },
                  pr: { lg: 3.5 },
                  pt: { xs: 3, md: 3, lg: 0 },
                  borderTop: { xs: `1px solid rgba(255,255,255,0.18)`, lg: 0 },
                  borderRight: {
                    lg: column.title === 'AIRADS Portals' ? 0 : `1px solid ${brand.secondary}`,
                  },
                }}
              >
                <FooterHeading>{column.title}</FooterHeading>
                <Box component="nav" aria-label={column.title}>
                  {column.links.map((item) => (
                    <FooterLink key={item.label} item={item} />
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: brand.secondary, py: { xs: 1.45, md: 1.7 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.86)', fontSize: '0.9rem' }}>
              Copyright AIRADS College 2026. All rights reserved.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.9rem' }}>
              Designed and Developed by{' '}
              <MuiLink
                href="https://craftyxtech.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white', fontWeight: 800, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Crafty Technologies
              </MuiLink>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 50 }}>
        <Fab
          variant="extended"
          color="success"
          href="https://wa.me/254723555999"
          target="_blank"
          sx={{ bgcolor: '#22c55e', color: 'white', '&:hover': { bgcolor: '#16a34a' }, textTransform: 'none', px: 2 }}
        >
          <WhatsAppIcon sx={{ mr: 1 }} />
          Chat with us
        </Fab>

        <Fab
          variant="extended"
          color="primary"
          href="/admissions/apply/"
          sx={{ bgcolor: brand.accent, color: 'white', '&:hover': { bgcolor: brand.accentHover }, textTransform: 'none', px: 3, fontWeight: 'bold' }}
        >
          Apply Now
        </Fab>
      </Box>
    </Box>
  );
};

export default Footer;
