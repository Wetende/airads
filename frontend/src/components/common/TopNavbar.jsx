
import { Box, Container,  Link as MuiLink, IconButton } from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react';
import { usePublicBrand } from '../../hooks/usePublicBrand';

const TopNavbar = () => {
  const brand = usePublicBrand();

  const quickLinks = [
    { text: "Online Admissions", href: "https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded", external: true },
    { text: "TVETA", href: "https://tveta.go.ke", external: true },
    { text: "CDACC", href: "https://tvetcdacc.go.ke/", external: true },
    { text: "Staff Mail", href: "mailto:staff@airads.ac.ke" },
    { text: "Student Portal", href: "/students/" },
    { text: "Career", href: "/admissions/career-guide/" },
  ];

  const socialLinks = [
    { icon: IconBrandFacebook, href: "https://www.facebook.com/www.airads.ac.ken/", label: "Facebook" },
    { icon: IconBrandX, href: "#", label: "X / Twitter" },
    { icon: IconBrandLinkedin, href: "#", label: "LinkedIn" },
    { icon: IconBrandYoutube, href: "#", label: "YouTube" },
    { icon: IconBrandInstagram, href: "#", label: "Instagram" },
  ];

  const linkSx = {
    fontSize: '0.72rem',
    letterSpacing: 0.3,
    '&:hover': { color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' },
  };

  return (
    <Box
      sx={{
        bgcolor: brand.secondary,
        color: 'white',
        py: 0.4,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, lg: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left — Contact info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 14 }} />
              <MuiLink
                href="mailto:info@airads.ac.ke"
                color="inherit"
                underline="none"
                sx={linkSx}
              >
                info@airads.ac.ke
              </MuiLink>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 14 }} />
              <MuiLink
                href="tel:+254723555999"
                color="inherit"
                underline="none"
                sx={linkSx}
              >
                +254 723 555 999
              </MuiLink>
            </Box>
          </Box>

          {/* Center — Quick links (hidden on xs) */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1.5, alignItems: 'center' }}>
            {quickLinks.map((link, i) => (
              <MuiLink
                key={i}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                color="inherit"
                underline="none"
                sx={linkSx}
              >
                {link.text}
              </MuiLink>
            ))}
          </Box>

          {/* Right — Social icons + Apply CTA */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <IconButton
                    key={i}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: 'white',
                      p: 0.5,
                      '&:hover': { color: 'rgba(255,255,255,0.7)' },
                    }}
                  >
                    <Icon size={15} stroke={1.5} />
                  </IconButton>
                );
              })}
            </Box>

            {/* CTA Button */}
            <MuiLink
              href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded"
              target="_blank"
              underline="none"
              sx={{
                bgcolor: brand.accent,
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                textTransform: 'uppercase',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: brand.accentHover,
                }
              }}
            >
              APPLY NOW
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TopNavbar;
