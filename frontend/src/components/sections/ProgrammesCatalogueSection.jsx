import { Box, Container, Typography, Card, CardActionArea, Grid } from '@mui/material';
import { Link } from '@inertiajs/react';
import {
  IconSchool,
  IconCertificate,
  IconTools,
  IconBook,
} from '@tabler/icons-react';
import { usePublicBrand } from '../../hooks/usePublicBrand';

const programmes = [
  {
    title: 'Diploma Courses',
    subtitle: 'View Diploma Programmes',
    icon: IconSchool,
    href: '/admissions/career-guide/',
  },
  {
    title: 'Certificate Courses',
    subtitle: 'View Certificate Programmes',
    icon: IconCertificate,
    href: '/admissions/career-guide/',
  },
  {
    title: 'Artisan Courses',
    subtitle: 'View Artisan Programmes',
    icon: IconTools,
    href: '/admissions/career-guide/',
  },
  {
    title: 'Short Courses & NITA',
    subtitle: 'View Short Courses',
    icon: IconBook,
    href: '/admissions/career-guide/',
  },
];

const ProgrammesCatalogueSection = () => {
  const brand = usePublicBrand();

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} columns={10} alignItems="stretch">
          {/* ── Left Title Block ── */}
          <Grid size={{ xs: 10, md: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                textAlign: { xs: 'center', md: 'left' },
                mb: { xs: 2, md: 0 },
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  color: brand.accent,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  fontSize: { xs: '1.2rem', md: '1.35rem' },
                  lineHeight: 1.3,
                  letterSpacing: 0.5,
                }}
              >
                Programmes<br />Catalogue
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: brand.primary, mt: 1, fontWeight: 500, fontSize: '0.85rem' }}
              >
                Explore our programmes.
              </Typography>
            </Box>
          </Grid>

          {/* ── Programme Cards ── */}
          {programmes.map((prog, i) => {
            const Icon = prog.icon;
            return (
              <Grid key={i} size={{ xs: 5, md: 2 }}>
                <Card
                  sx={{
                    bgcolor: brand.accent,
                    color: 'white',
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 32px rgba(220,37,37,0.25)',
                      bgcolor: brand.accentHover,
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={prog.href}
                    sx={{
                      p: { xs: 3, md: 3 },
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <Icon size={40} stroke={1.5} />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        mt: 2,
                        mb: 0.5,
                        fontSize: '0.9rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {prog.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.85, fontSize: '0.72rem' }}
                    >
                      {prog.subtitle}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProgrammesCatalogueSection;
