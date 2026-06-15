import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button,
  Chip, TextField, MenuItem, Select, FormControl, InputLabel, Paper, Dialog,
  DialogContent, DialogTitle, IconButton
} from "@mui/material";
import {
  Event as EventIcon, AccessTime, LocationOn, Search, Close, ArrowForward,
  Article, BeachAccess, Campaign, CalendarToday
} from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const Events = () => {
  const brand = usePublicBrand();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('airads-events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
        setFilteredEvents(parsedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
        setFilteredEvents([]);
      }
    }
  }, []);

  // Filter events based on type and search term
  useEffect(() => {
    let filtered = events;

    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedType, searchTerm]);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'event': return brand.primary;
      case 'news': return brand.secondary;
      case 'holiday': return brand.secondary;
      case 'announcement': return brand.primary;
      default: return brand.mutedText;
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'event': return <EventIcon fontSize="small" />;
      case 'news': return <Article fontSize="small" />;
      case 'holiday': return <BeachAccess fontSize="small" />;
      case 'announcement': return <Campaign fontSize="small" />;
      default: return <CalendarToday fontSize="small" />;
    }
  };

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

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

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
              Events & News
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
              Stay updated with AIRADS College latest happenings
            </Typography>
          </Container>
        </Box>

        {/* Filters Section */}
        <Box sx={{ py: 3, bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid', borderColor: brand.borderBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', md: 'auto' } }}>
                <TextField
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />,
                  }}
                  sx={{ width: { xs: '100%', sm: 250 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <FormControl size="small" sx={{ width: { xs: '100%', sm: 200 } }}>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="event">Events</MenuItem>
                    <MenuItem value="news">News</MenuItem>
                    <MenuItem value="holiday">Holidays</MenuItem>
                    <MenuItem value="announcement">Announcements</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                <Box sx={{ width: 8, height: 8, bgcolor: brand.primary, borderRadius: '50%' }} />
                <Typography variant="body2">{filteredEvents.length} of {events.length} posts</Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {[
                { type: 'event', label: 'Events', color: brand.primary },
                { type: 'news', label: 'News', color: brand.secondary },
                { type: 'holiday', label: 'Holidays', color: brand.secondary },
                { type: 'announcement', label: 'Announcements', color: brand.primary }
              ].map((stat, index) => (
                <Grid key={index} size={{ xs: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', p: 3, bgcolor: stat.color, color: 'white', border: 'none', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {events.filter(e => e.type === stat.type).length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>{stat.label}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
                      onClick={() => setSelectedEvent(event)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
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
                            icon={getEventTypeIcon(event.type)}
                            label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            sx={{ position: 'absolute', top: 16, left: 16, bgcolor: getEventTypeColor(event.type), color: 'white', fontWeight: 'bold' }}
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
                              icon={getEventTypeIcon(event.type)}
                              label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              sx={{ bgcolor: getEventTypeColor(event.type), color: 'white', fontWeight: 'bold' }}
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
        <Box sx={{ py: 10, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.secondary }}>
                {upcomingEvents.length > 0 ? 'Recent Updates' : 'All Events & News'}
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.primary, mx: 'auto', borderRadius: 2 }} />
            </Box>

            {filteredEvents.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 10, border: 'none', bgcolor: brand.softBlue, boxShadow: 2 }}>
                <CardContent>
                  <EventIcon sx={{ fontSize: 64, color: brand.borderBlue, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>No Events Found</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {selectedType !== 'all' || searchTerm
                      ? 'Try adjusting your filters or search terms'
                      : 'No events have been posted yet. Check back soon for updates!'
                    }
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(upcomingEvents.length > 0 ? pastEvents : filteredEvents).map((event, index) => (
                  <Card
                    key={event.id || index}
                    onClick={() => setSelectedEvent(event)}
                    sx={{
                      cursor: 'pointer',
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
                              icon={getEventTypeIcon(event.type)}
                              label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              sx={{ bgcolor: getEventTypeColor(event.type), color: 'white', fontWeight: 'bold', boxShadow: 1 }}
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
        </Box>
      </Box>

      {/* Event Detail Modal */}
      <Dialog
        open={Boolean(selectedEvent)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {selectedEvent && (
          <>
            {selectedEvent.image && (
              <Box sx={{ position: 'relative', height: { xs: 200, sm: 300 } }}>
                <CardMedia component="img" loading="lazy" image={selectedEvent.image} alt={selectedEvent.title} sx={{ height: '100%' }} />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(15, 23, 42, 0.45)' }} />
                <Chip
                  icon={getEventTypeIcon(selectedEvent.type)}
                  label={selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  sx={{ position: 'absolute', top: 16, left: 16, bgcolor: getEventTypeColor(selectedEvent.type), color: 'white', fontWeight: 'bold' }}
                />
                <IconButton
                  onClick={handleCloseDialog}
                  sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}

            <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
              {!selectedEvent.image && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Chip
                    icon={getEventTypeIcon(selectedEvent.type)}
                    label={selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                    sx={{ bgcolor: getEventTypeColor(selectedEvent.type), color: 'white', fontWeight: 'bold' }}
                  />
                  <IconButton onClick={handleCloseDialog} size="small"><Close /></IconButton>
                </Box>
              )}

              <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, color: 'text.primary' }}>
                {selectedEvent.title}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ fontSize: '1.2rem', mr: 1, color: brand.primary }} />
                  <Typography variant="body2">{formatDate(selectedEvent.date)}</Typography>
                </Box>
                {selectedEvent.createdAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ fontSize: '1.2rem', mr: 1, color: brand.primary }} />
                    <Typography variant="body2">Posted {new Date(selectedEvent.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                )}
                {isUpcoming(selectedEvent.date) && (
                  <Chip label="Upcoming" size="small" variant="outlined" sx={{ color: brand.primary, borderColor: brand.primary, bgcolor: brand.softBlue }} />
                )}
              </Box>

              <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {selectedEvent.description}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Events;
