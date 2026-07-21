import { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button,
  Chip, TextField, Paper
} from "@mui/material";
import { Event as EventIcon, Search, ArrowForward } from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const normalizeEvent = (event) => ({
  ...event,
  date: event.date || event.start_date,
  endDate: event.endDate || event.end_date,
});

const Events = ({ events: serverEvents = [] }) => {
  const brand = usePublicBrand();
  const [searchTerm, setSearchTerm] = useState('');
  const events = useMemo(() => serverEvents.map(normalizeEvent), [serverEvents]);
  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [events, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) > new Date();
  };

  const upcomingEvents = filteredEvents.filter(event => isUpcoming(event.date));
  const pastEvents = filteredEvents.filter(event => !isUpcoming(event.date));
  const secondaryEvents = upcomingEvents.length > 0 ? pastEvents : filteredEvents;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="Events - AIRADS College" />
      <TopNavbar />
      <MainNavbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Compact Hero Section */}
        <Box sx={{ pt: { xs: 15, md: 18 }, pb: 8, position: 'relative', overflow: 'hidden', bgcolor: brand.softBlue }}>
          <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, color: brand.secondary, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Events
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
              Discover upcoming workshops, open days and community activities.
            </Typography>
          </Container>
        </Box>

        {/* Filters Section */}
        <Box sx={{ py: 3, bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid', borderColor: brand.borderBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                }}
                sx={{ width: { xs: '100%', sm: 320 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                <Box sx={{ width: 8, height: 8, bgcolor: brand.primary, borderRadius: '50%' }} />
                <Typography variant="body2">{filteredEvents.length} of {events.length} posts</Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.secondary }}>Upcoming Events</Typography>
                <Box sx={{ width: 80, height: 4, bgcolor: brand.primary, mx: 'auto', borderRadius: 2 }} />
              </Box>

              <Grid container spacing={4}>
                {upcomingEvents.slice(0, 6).map((event, index) => (
                  <Grid key={event.id || index} size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: 'none',
                        bgcolor: brand.softBlue,
                        boxShadow: 2,
                        transition: 'all 0.4s ease',
                        '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }
                      }}
                    >
                      {event.image && (
                        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                          <CardMedia
                            component="img" loading="lazy"
                            image={event.image}
                            alt={event.title}
                            sx={{ height: '100%', transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.1)' } }}
                          />
                          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(15, 23, 42, 0.45)' }} />
                          <Chip
                            icon={<EventIcon fontSize="small" />}
                            label="Event"
                            sx={{ position: 'absolute', top: 16, left: 16, bgcolor: brand.primary, color: 'white', fontWeight: 'bold' }}
                          />
                          <Paper sx={{ position: 'absolute', top: 16, right: 16, p: 1, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', minWidth: 50 }}>
                            <Typography sx={{ color: brand.primary, fontWeight: 800, fontSize: '1.25rem', lineHeight: 1 }}>{new Date(event.date).getDate()}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</Typography>
                          </Paper>
                        </Box>
                      )}
                      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {!event.image && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Chip
                              icon={<EventIcon fontSize="small" />}
                              label="Event"
                              sx={{ bgcolor: brand.primary, color: 'white', fontWeight: 'bold' }}
                            />
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ color: brand.primary, fontWeight: 800, fontSize: '1.25rem', lineHeight: 1 }}>{new Date(event.date).getDate()}</Typography>
                              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</Typography>
                            </Box>
                          </Box>
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
                          {event.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 3 }}>
                          <EventIcon sx={{ fontSize: '1.1rem', mr: 1, color: brand.primary }} />
                          <Typography variant="caption" noWrap>{formatDate(event.date)}</Typography>
                        </Box>
                        <Button
                          component={Link}
                          href={`/events/${event.slug}/`}
                          fullWidth
                          endIcon={<ArrowForward />}
                          sx={{ justifyContent: 'center', color: brand.primary, '&:hover': { bgcolor: brand.primary, color: 'white' } }}
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        )}

        {/* All Events / Past Events */}
        {(filteredEvents.length === 0 || secondaryEvents.length > 0) && <Box sx={{ py: 10, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.secondary }}>
                {upcomingEvents.length > 0 ? 'Past events' : 'All events'}
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.primary, mx: 'auto', borderRadius: 2 }} />
            </Box>

            {filteredEvents.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 10, border: 'none', bgcolor: brand.softBlue, boxShadow: 2 }}>
                <CardContent>
                  <EventIcon sx={{ fontSize: 64, color: brand.borderBlue, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>No Events Found</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'No events have been posted yet. Check back soon for updates!'
                    }
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {secondaryEvents.map((event, index) => (
                  <Card
                    key={event.id || index}
                    sx={{
                      border: 'none',
                      boxShadow: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                    }}
                  >
                    <Grid container>
                      {event.image && (
                        <Grid sx={{ position: 'relative', minHeight: { xs: 200, md: 'auto' } }} size={{ xs: 12, md: 4 }}>
                          <CardMedia
                            component="img" loading="lazy"
                            image={event.image}
                            alt={event.title}
                            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Grid>
                      )}
                      <Grid size={{ xs: 12, md: event.image ? 8 : 12 }}>
                        <CardContent sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: brand.softBlue }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Chip
                              icon={<EventIcon fontSize="small" />}
                              label="Event"
                              sx={{ bgcolor: brand.primary, color: 'white', fontWeight: 'bold', boxShadow: 1 }}
                            />
                            {event.createdAt && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Posted {new Date(event.createdAt).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {event.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
                            {event.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                              <EventIcon sx={{ fontSize: '1.2rem', mr: 1, color: brand.primary }} />
                              <Typography variant="body2">{formatDate(event.date)}</Typography>
                              {isUpcoming(event.date) && (
                                <Chip label="Upcoming" size="small" variant="outlined" sx={{ ml: 2, color: brand.primary, borderColor: brand.primary, bgcolor: brand.softBlue }} />
                              )}
                            </Box>
                            <Button
                              component={Link}
                              href={`/events/${event.slug}/`}
                              endIcon={<ArrowForward />}
                              sx={{ color: brand.primary, '&:hover': { bgcolor: brand.primary, color: 'white' } }}
                            >
                              Read More
                            </Button>
                          </Box>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            )}
          </Container>
        </Box>}
      </Box>

      <Footer />
    </Box>
  );
};

export default Events;
