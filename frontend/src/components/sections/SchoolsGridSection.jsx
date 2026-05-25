
import { Box, Container, Typography, Card, CardActionArea, CardMedia } from '@mui/material';
import { Link } from '@inertiajs/react';
import { IconBuildingBank } from '@tabler/icons-react';
import { FONT_ARCHIVO, FONT_FIGTREE } from '../../config';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { trainingPathways } from '../../pages/public/schools/pathwayData';

const TrainingPathwayCard = ({ pathway, brand }) => (
  <Card
    sx={{
      borderRadius: 1.5,
      overflow: 'hidden',
      border: '1px solid rgba(148, 163, 184, 0.18)',
      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
      backgroundColor: '#ffffff',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 38px rgba(15, 23, 42, 0.16)',
      },
      '&:hover .school-image': {
        transform: 'scale(1.06)',
      },
      '&:hover .school-overlay': {
        background: `linear-gradient(180deg, rgba(15,23,42,0.28) 0%, rgba(15,23,42,0.78) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 6px)`,
      },
      '&:hover .read-more': {
        transform: 'translate(-50%, 0)',
        opacity: 1,
      },
      '&:hover .pathway-copy': {
        transform: 'translateY(-22px)',
      },
    }}
  >
    <CardActionArea
      component={Link}
      href={pathway.href}
      sx={{
        position: 'relative',
        aspectRatio: { xs: '16 / 9', sm: '2 / 1' },
        minHeight: { xs: 190, sm: 185, md: 190 },
      }}
    >
      <CardMedia
        component="img"
        image={pathway.image}
        alt={pathway.title}
        className="school-image"
        sx={{
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.45s ease',
        }}
      />
      <Box
        className="school-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.68) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 6px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2.5, sm: 3 },
          py: 2.5,
          transition: 'background 0.3s ease',
        }}
      >
        <Box
          className="pathway-copy"
          sx={{
            maxWidth: 300,
            textAlign: 'center',
            transition: 'transform 0.32s ease',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'white',
              fontFamily: FONT_ARCHIVO,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: { xs: '0.98rem', sm: '1.08rem' },
              lineHeight: 1.35,
              textShadow: '0 2px 14px rgba(0,0,0,0.42)',
            }}
          >
            {pathway.title}
          </Typography>
          <Box
            sx={{
              width: 86,
              height: 3,
              bgcolor: brand.accent,
              mt: 1.35,
              mx: 'auto',
              borderRadius: 999,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.88)',
              fontFamily: FONT_FIGTREE,
              textAlign: 'center',
              fontSize: '0.76rem',
              lineHeight: 1.45,
              mt: 1.25,
            }}
          >
            {pathway.description}
          </Typography>
        </Box>
        <Box
          className="read-more"
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: { xs: 14, sm: 16 },
            transform: 'translate(-50%, 58px)',
            opacity: 0,
            px: { xs: 3, sm: 3.75 },
            py: 1.1,
            borderRadius: 999,
            bgcolor: brand.primary,
            color: 'white',
            fontFamily: FONT_ARCHIVO,
            fontWeight: 800,
            fontSize: '0.88rem',
            lineHeight: 1,
            boxShadow: '0 14px 28px rgba(37, 99, 235, 0.38)',
            transition: 'transform 0.32s ease, opacity 0.32s ease, background-color 0.2s ease',
            '&:hover': {
              bgcolor: brand.primaryHover,
            },
          }}
        >
          Read More
        </Box>
      </Box>
    </CardActionArea>
  </Card>
);

const SchoolsGridSection = () => {
  const brand = usePublicBrand();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: '#f6f8fb',
      }}
    >
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          ml: '-50vw',
          px: { xs: 2, sm: 3, md: 5 },
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 80,
              height: 0,
              borderTop: `2px solid ${brand.accent}`,
            }}
          />
          <Box
            sx={{
              width: 12,
              height: 12,
              border: `2px solid ${brand.accent}`,
              transform: 'rotate(45deg)',
              borderRadius: '2px',
              bgcolor: '#ffffff',
              flexShrink: 0,
              boxShadow: '0 0 0 6px #f6f8fb',
            }}
          />
          <Box
            sx={{
              flex: 1,
              minWidth: 80,
              height: 0,
              borderTop: `2px solid ${brand.accent}`,
            }}
          />
        </Box>
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 1.25,
            mb: { xs: 4, md: 5 },
          }}
        >
          <IconBuildingBank size={34} stroke={1.6} color={brand.primary} />
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: FONT_ARCHIVO,
              fontWeight: 800,
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.95rem' },
              color: 'text.primary',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            AIRADS TRAINING PATHWAYS
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 2, sm: 3, md: 3.5 },
          }}
        >
          {trainingPathways.map((pathway) => (
            <TrainingPathwayCard key={pathway.title} pathway={pathway} brand={brand} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SchoolsGridSection;
