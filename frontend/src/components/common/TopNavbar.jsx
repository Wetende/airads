import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { usePublicBrand } from '../../hooks/usePublicBrand';

const TopNavbar = () => {
  const brand = usePublicBrand();

  return (
    <Box
      sx={{
        bgcolor: brand.secondary,
        color: 'white',
        py: 0.5,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
            Quick Links:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <MuiLink href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              Online Admissions
            </MuiLink>
            <MuiLink href="https://tveta.go.ke" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              TVETA
            </MuiLink>
            <MuiLink href="https://tvetcdacc.go.ke/" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              TVETA-CDACC
            </MuiLink>
            <MuiLink href="https://knec.ac.ke" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              KNEC
            </MuiLink>
            <MuiLink href="https://nita.go.ke" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              NITA
            </MuiLink>
            <MuiLink href="https://katti.go.ke" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              KATTI
            </MuiLink>
            <MuiLink href="https://education.go.ke" target="_blank" rel="noopener noreferrer" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              MOE
            </MuiLink>
            <MuiLink href="mailto:staff@airads.ac.ke" color="inherit" underline="none" sx={{ fontSize: '0.75rem', '&:hover': { color: '#fca5a5', transition: 'color 0.2s' } }}>
              Staff Mail
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TopNavbar;
