import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Container } from '@mui/material';
import { FormatQuote as QuoteIcon } from '@mui/icons-material';
import { usePublicBrand } from '../../hooks/usePublicBrand';

export default function PrincipalMessage({ 
  principalName, 
  campusName, 
  message, 
  imageUrl 
}) {
  const brand = usePublicBrand();

  return (
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          bgcolor: 'white',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Left side: Photo */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '40%' },
            minHeight: { xs: 300, md: 450 },
            position: 'relative',
            bgcolor: brand.softBlue || '#f0f4f8'
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={`Principal of ${campusName}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          ) : (
            <Box 
              sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            >
              <Typography variant="body2">Principal Photo</Typography>
            </Box>
          )}
        </Box>

        {/* Right side: Message */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '60%' },
            p: { xs: 4, md: 6, lg: 8 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Decorative Quote Icon */}
          <QuoteIcon 
            sx={{ 
              position: 'absolute', 
              top: 32, 
              left: 32, 
              fontSize: 120, 
              color: brand.secondary || '#0c5aa6', 
              opacity: 0.05,
              transform: 'rotate(180deg)',
              zIndex: 0
            }} 
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                color: brand.secondary, 
                fontWeight: 700, 
                letterSpacing: 2, 
                mb: 2, 
                display: 'block' 
              }}
            >
              Message from the Principal
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'text.primary', 
                mb: 4, 
                lineHeight: 1.8, 
                fontStyle: 'italic',
                fontWeight: 400
              }}
            >
              "{message}"
            </Typography>
            
            <Box sx={{ mt: 'auto', pt: 4, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Bookman Old Style", Georgia, serif', 
                  fontWeight: 700, 
                  color: brand.secondary 
                }}
              >
                {principalName}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  textTransform: 'uppercase', 
                  letterSpacing: 1, 
                  mt: 0.5 
                }}
              >
                Principal, {campusName}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
  );
}

PrincipalMessage.propTypes = {
  principalName: PropTypes.string.isRequired,
  campusName: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  imageUrl: PropTypes.string
};
