import { Box, Typography, Stack } from '@mui/material';
import { Link } from '@inertiajs/react';
import { IconNotebook, IconNews, IconCalendarEvent } from '@tabler/icons-react';
import { usePublicBrand } from '../../hooks/usePublicBrand';
import { FONT_ARCHIVO, FONT_FIGTREE } from '../../config';

const notices = [
  {
    title: 'Notice to all students — Fee clearance requirement for continuing students',
    date: '05/18/2026',
    href: '/news/latest/',
  },
  {
    title: 'May/June Intake Now Open',
    date: '05/10/2026',
    href: '/news/latest/',
  },
  {
    title: 'Industrial attachment — All eligible students to report to Dean of Students',
    date: '04/28/2026',
    href: '/news/latest/',
  },
  {
    title: 'KNEC examination timetable released — Check your campus noticeboard',
    date: '04/15/2026',
    href: '/news/latest/',
  },
];

const news = [
  {
    title: 'AIRADS College Achieves 100% Pass Rate in KNEC Examinations',
    date: '05/15/2026',
    image: '/static/63.JPG',
    href: '/news/latest/',
  },
  {
    title: 'New Maralal Campus Opens Doors to Students in Samburu County',
    date: '05/08/2026',
    image: '/static/7.1.JPG',
    href: '/news/latest/',
  },
  {
    title: 'AIRADS Partners with Industry Leaders for Student Attachment Programs',
    date: '04/22/2026',
    image: '/static/17.jpg',
    href: '/news/latest/',
  },
];

const NoticesNewsSection = () => {
  const brand = usePublicBrand();

  return (
    <Box component="section" sx={{ pt: { xs: 2.5, md: 3.5 }, pb: { xs: 6, md: 8 }, bgcolor: '#f5f6f8' }}>
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
              boxShadow: '0 0 0 6px #f5f6f8',
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

      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          ml: '-50vw',
          px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            borderRadius: 1.5,
            boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
            backgroundColor: '#fff',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <Box>
            <Box
              sx={{
                height: '100%',
                bgcolor: brand.accent,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: { xs: 3, md: 4 },
                  py: { xs: 3, md: 3.5 },
                  color: 'white',
                }}
              >
                <IconNotebook size={28} stroke={1.7} />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: FONT_ARCHIVO,
                    fontWeight: 800,
                    fontSize: { xs: '1.35rem', md: '1.8rem' },
                  }}
                >
                  Notices Board
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    bgcolor: 'rgba(125, 16, 16, 0.7)',
                    ml: { xs: 1, md: 2 },
                  }}
                />
              </Box>

              <Stack spacing={0.75} sx={{ px: { xs: 0.75, md: 0.9 }, pb: { xs: 0.75, md: 0.9 } }}>
                {notices.map((notice) => (
                  <Box
                    key={notice.title}
                    component={Link}
                    href={notice.href}
                    sx={{
                      display: 'block',
                      bgcolor: '#fff',
                      textDecoration: 'none',
                      px: { xs: 2.5, md: 3.5 },
                      py: { xs: 2.5, md: 3 },
                      borderBottom: `5px solid ${brand.accent}`,
                      transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                      '&:hover': {
                        transform: 'translateX(6px)',
                        boxShadow: '0 12px 28px rgba(127, 29, 29, 0.16)',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#404040',
                        fontFamily: FONT_FIGTREE,
                        fontSize: { xs: '1.02rem', md: '1.08rem' },
                        fontWeight: 700,
                        lineHeight: 1.35,
                        mb: 1.6,
                      }}
                    >
                      {notice.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#8a8f98' }}>
                      <IconCalendarEvent size={16} stroke={1.7} />
                      <Typography
                        sx={{
                          fontFamily: FONT_ARCHIVO,
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          letterSpacing: 0.8,
                        }}
                      >
                        {notice.date}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                height: '100%',
                px: { xs: 3, md: 4 },
                py: { xs: 3.5, md: 4 },
                backgroundColor: '#fafafa',
                backgroundImage:
                  'radial-gradient(circle at 18px 18px, rgba(15, 23, 42, 0.045) 0, rgba(15, 23, 42, 0.045) 8px, transparent 8px), radial-gradient(circle at 54px 54px, rgba(15, 23, 42, 0.035) 0, rgba(15, 23, 42, 0.035) 8px, transparent 8px)',
                backgroundSize: '72px 72px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: { xs: 3, md: 4 },
                }}
              >
                <IconNews size={28} stroke={1.7} color={brand.primary} />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: FONT_ARCHIVO,
                    fontWeight: 800,
                    fontSize: { xs: '1.3rem', md: '1.75rem' },
                    color: brand.primary,
                    whiteSpace: { md: 'nowrap' },
                  }}
                >
                  News &amp; Updates
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    bgcolor: brand.accent,
                    minWidth: 60,
                  }}
                />
              </Box>

              <Stack spacing={3}>
                {news.map((item) => (
                  <Box
                    key={item.title}
                    component={Link}
                    href={item.href}
                    sx={{
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2.25,
                      textDecoration: 'none',
                      transition: 'transform 0.22s ease',
                      '&:hover': {
                        transform: 'translateX(6px)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: { xs: 96, sm: 110 },
                        height: { xs: 96, sm: 92 },
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: '#9ca3af',
                          fontFamily: FONT_ARCHIVO,
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          letterSpacing: 0.6,
                          mb: 1.1,
                        }}
                      >
                        {item.date}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#3f3f46',
                          fontFamily: FONT_FIGTREE,
                          fontSize: { xs: '1rem', md: '1.06rem' },
                          fontWeight: 700,
                          lineHeight: 1.35,
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NoticesNewsSection;
