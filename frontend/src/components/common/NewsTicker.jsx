import { useState, useCallback } from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';
import { usePublicBrand } from '../../hooks/usePublicBrand';

const updates = [
  "SEPTEMBER 2026 INTAKE ONGOING — Apply Now!",
  "KNEC Exams Results: 90-100% Pass Rate — 20 Years Consistent Excellence",
  "NITA Short Courses Available — Enroll Today",
  "Industrial Attachment Placements Open for All Students",
  "Virtual Campus Now Open — Study from Anywhere",
  "Maralal Campus",
];

const NewsTicker = () => {
  const brand = usePublicBrand();
  const [isPaused, setIsPaused] = useState(false);

  const togglePause = useCallback(() => setIsPaused((p) => !p), []);

  return (
    <Box
      sx={{
        bgcolor: '#F5F5F5',
        borderBottom: '1px solid #E5E5E5',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 0, lg: 0 },
          display: 'flex',
          alignItems: 'stretch',
          height: 40,
          overflow: 'hidden',
        }}
      >
        {/* ── "NEW UPDATES" Badge ── */}
        <Box
          sx={{
            bgcolor: brand.accent,
            color: 'white',
            px: 2,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            mr: 2,
            my: -0.01,
            clipPath:
              'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)',
            pr: 4,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '0.68rem',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            New Updates
          </Typography>
        </Box>

        {/* ── Scrolling Text Track ── */}
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 6,
              animation: `ticker-scroll 45s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              whiteSpace: 'nowrap',
              '@keyframes ticker-scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {[...updates, ...updates].map((text, i) => (
              <Typography
                key={i}
                variant="body2"
                component="span"
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: '#333333',
                  letterSpacing: 0.2,
                  textTransform: 'uppercase',
                  cursor: 'default',
                  flexShrink: 0,
                }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* ── Controls ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            ml: 1,
            flexShrink: 0,
          }}
        >
          <IconButton size="small" sx={{ color: '#555', p: 0.5 }} aria-label="Previous update">
            <PrevIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={togglePause}
            sx={{ color: '#555', p: 0.5 }}
            aria-label={isPaused ? 'Play ticker' : 'Pause ticker'}
          >
            {isPaused ? <PlayIcon sx={{ fontSize: 18 }} /> : <PauseIcon sx={{ fontSize: 18 }} />}
          </IconButton>
          <IconButton size="small" sx={{ color: '#555', p: 0.5 }} aria-label="Next update">
            <NextIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsTicker;
