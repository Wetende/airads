import React from 'react';
import { Link } from "@inertiajs/react";
import { FaWhatsapp, FaFacebook, FaTiktok } from "react-icons/fa";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  TextField,
  Button,
  Fab,
} from "@mui/material";
import { Email as EmailIcon, Phone as PhoneIcon, WhatsApp as WhatsAppIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";

const Footer = () => {
  const brand = usePublicBrand();

  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        pt: 8,
        pb: 4,
        bgcolor: "#0F172A",
        color: 'white',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: brand.accent, mb: 2 }}>
              AIRADS College
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300', mb: 3, lineHeight: 1.8 }}>
              African Institute of Research and Development Studies –AIRADS College is the best College that
              provides a holistic training, innovation and research environment to equip trainees with the best
              tools & Infrastructure.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, fontSize: '1rem', color: brand.accent }} />
                <MuiLink href="mailto:info@airads.ac.ke" sx={{ color: 'grey.300', textDecoration: 'none', '&:hover': { color: brand.primary } }}>
                  info@airads.ac.ke
                </MuiLink>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: brand.accent }} />
                <MuiLink href="tel:+254723555999" sx={{ color: 'grey.300', textDecoration: 'none', '&:hover': { color: brand.primary } }}>
                  +254 723 555 999
                </MuiLink>
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: brand.accent, mb: 2 }}>
              Follow Our Channels
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <MuiLink
                href="https://www.tiktok.com/@airads.college"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', color: 'grey.300', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'white', '& svg': { color: '#ec4899' } } }}
              >
                <FaTiktok style={{ marginRight: '12px', fontSize: '1.5rem', transition: 'color 0.2s' }} />
                <Typography variant="body2">TikTok</Typography>
              </MuiLink>
              <MuiLink
                href="https://www.facebook.com/airads.college"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', color: 'grey.300', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'white', '& svg': { color: brand.primary } } }}
              >
                <FaFacebook style={{ marginRight: '12px', fontSize: '1.5rem', transition: 'color 0.2s' }} />
                <Typography variant="body2">Facebook</Typography>
              </MuiLink>
              <MuiLink
                href="https://wa.me/254723555999"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', color: 'grey.300', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'white', '& svg': { color: '#22c55e' } } }}
              >
                <FaWhatsapp style={{ marginRight: '12px', fontSize: '1.5rem', transition: 'color 0.2s' }} />
                <Typography variant="body2">WhatsApp</Typography>
              </MuiLink>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: brand.accent, mb: 2 }}>
              Location
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, color: 'grey.300' }}>
              <Typography variant="body2">Institute Plaza 3rd & 4th Floor</Typography>
              <Typography variant="body2">Head Office</Typography>
              <Typography variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: brand.accent }} /> +254 723 555 999
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: brand.accent }} /> 0723 555 999
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: brand.accent, mb: 2 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300', mb: 2 }}>
              Subscribe to our newsletter for updates
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                variant="outlined"
                placeholder="E-mail"
                size="small"
                fullWidth
                sx={{
                  bgcolor: 'rgba(30, 41, 59, 0.8)',
                  borderRadius: 1,
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.8)' },
                    '&:hover fieldset': { borderColor: brand.primary },
                    '&.Mui-focused fieldset': { borderColor: brand.primary },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ bgcolor: brand.primary, '&:hover': { bgcolor: brand.primaryHover }, py: 1, textTransform: 'none' }}
              >
                Subscribe Now
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(30, 41, 59, 1)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            © Copyright AIRADS College 2026. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            Designed and Developed by{' '}
            <Typography component="span" variant="body2" sx={{ color: brand.primary, fontWeight: 'bold' }}>
              Powerspur Solutions Ltd
            </Typography>
          </Typography>
        </Box>
      </Container>

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
          href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded"
          target="_blank"
          sx={{ bgcolor: brand.accent, color: 'white', '&:hover': { bgcolor: brand.accentHover }, textTransform: 'none', px: 3, fontWeight: 'bold' }}
        >
          Apply Now
        </Fab>
      </Box>
    </Box>
  );
};

export default Footer;
