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
  Fab 
} from "@mui/material";
import { WhatsApp as WhatsAppIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 10,
        pt: 8,
        pb: 4,
        background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
        color: 'white',
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* College Info */}
          <Grid item xs={12} md={6} lg={3}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f87171', mb: 2 }}>
              AIRADS College
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300', mb: 3, lineHeight: 1.8 }}>
              African Institute of Research and Development Studies –AIRADS College is the best College that 
              provides a holistic training, innovation and research environment to equip trainees with the best 
              tools & Infrastructure.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>📧</span>
                <MuiLink href="mailto:info@airads.ac.ke" sx={{ color: 'grey.300', textDecoration: 'none', '&:hover': { color: '#60a5fa' } }}>
                  info@airads.ac.ke
                </MuiLink>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>📞</span>
                <MuiLink href="tel:+254723555999" sx={{ color: 'grey.300', textDecoration: 'none', '&:hover': { color: '#60a5fa' } }}>
                  +254 723 555 999
                </MuiLink>
              </Typography>
            </Box>
          </Grid>

          {/* Follow Our Channels */}
          <Grid item xs={12} md={6} lg={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f87171', mb: 2 }}>
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
                sx={{ display: 'flex', alignItems: 'center', color: 'grey.300', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'white', '& svg': { color: '#3b82f6' } } }}
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

          {/* Location */}
          <Grid item xs={12} md={6} lg={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f87171', mb: 2 }}>
              Location
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, color: 'grey.300' }}>
              <Typography variant="body2">Institute Plaza 3rd & 4th Floor</Typography>
              <Typography variant="body2">Head Office</Typography>
              <Typography variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>📞</span> +254 723 555 999
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>📱</span> 0723 555 999
              </Typography>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={6} lg={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f87171', mb: 2 }}>
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
                    '&:hover fieldset': { borderColor: '#60a5fa' },
                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                  }
                }} 
              />
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, py: 1, textTransform: 'none' }}
              >
                Subscribe Now
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(30, 41, 59, 1)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            © Copyright AIRADS College 2026. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            Designed and Developed by{' '}
            <Typography component="span" variant="body2" sx={{ color: '#60a5fa', fontWeight: 'bold' }}>
              Powerspur Solutions Ltd
            </Typography>
          </Typography>
        </Box>
      </Container>

      {/* Floating Buttons */}
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
          sx={{ bgcolor: '#1d4ed8', color: 'white', '&:hover': { bgcolor: '#1e40af' }, textTransform: 'none', px: 3, fontWeight: 'bold' }}
        >
          Apply Now
        </Fab>
      </Box>
    </Box>
  );
};

export default Footer;