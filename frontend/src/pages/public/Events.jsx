import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { 
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, 
  Chip, TextField, MenuItem, Select, FormControl, InputLabel, Paper, Dialog,
  DialogContent, DialogTitle, IconButton
} from "@mui/material";
import { 
  Event as EventIcon, AccessTime, LocationOn, Search, Close, ArrowForward
} from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const Events = () => {
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
      case 'event': return '#2563eb'; // blue-600
      case 'news': return '#059669'; // emerald-600
      case 'holiday': return '#e11d48'; // rose-600
      case 'announcement': return '#9333ea'; // purple-600
      default: return '#475569'; // slate-600
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'event': return '🎉';
      case 'news': return '📰';
      case 'holiday': return '🏖️';
      case 'announcement': return '📢';
      default: return '📅';
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
        <Box sx={{ pt: { xs: 15, md: 18 }, pb: 8, position: 'relative', overflow: 'hidden', bgcolor: '#f8fafc' }}>
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(37,99,235,0.05), rgba(71,85,105,0.05))' }} />
          <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, background: 'linear-gradient(to right, #2563eb, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Events & News
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
              Stay updated with AIRADS College latest happenings
            </Typography>
          </Container>
        </Box>

        {/* Filters Section */}
        <Box sx={{ py: 3, bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid #dbeafe' }}>
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
                <Box sx={{ width: 8, height: 8, bgcolor: '#3b82f6', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
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
                { type: 'event', label: 'Events', color: 'linear-gradient(135deg, #2563eb, #3b82f6)' },
                { type: 'news', label: 'News', color: 'linear-gradient(135deg, #059669, #10b981)' },
                { type: 'holiday', label: 'Holidays', color: 'linear-gradient(135deg, #e11d48, #f43f5e)' },
                { type: 'announcement', label: 'Announcements', color: 'linear-gradient(135deg, #9333ea, #a855f7)' }
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card sx={{ textAlign: 'center', p: 3, background: stat.color, color: 'white', border: 'none', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}>
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
                <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2 }}>Upcoming Events</Typography>
                <Box sx={{ width: 80, height: 4, background: 'linear-gradient(to right, #2563eb, #475569)', mx: 'auto', borderRadius: 2 }} />
              </Box>

              <Grid container spacing={4}>
                {upcomingEvents.slice(0, 6).map((event, index) => (
                  <Grid item xs={12} md={6} lg={4} key={event.id || index}>
                    <Card 
                      onClick={() => setSelectedEvent(event)}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'linear-gradient(to bottom right, #ffffff, rgba(239,246,255,0.5))',
                        boxShadow: 2,
                        transition: 'all 0.4s ease',
                        '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }
                      }}
                    >
                      {event.image && (
                        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            image={event.image}
                            alt={event.title}
                            sx={{ height: '100%', transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.1)' } }}
                          />
                          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
                          <Chip 
                            label={`${getEventTypeIcon(event.type)} ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`}
                            sx={{ position: 'absolute', top: 16, left: 16, bgcolor: getEventTypeColor(event.type), color: 'white', fontWeight: 'bold' }}
                          />
                          <Paper sx={{ position: 'absolute', top: 16, right: 16, p: 1, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', minWidth: 50 }}>
                            <Typography sx={{ color: '#2563eb', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1 }}>{new Date(event.date).getDate()}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</Typography>
                          </Paper>
                        </Box>
                      )}
                      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {!event.image && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Chip 
                              label={`${getEventTypeIcon(event.type)} ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`}
                              sx={{ bgcolor: getEventTypeColor(event.type), color: 'white', fontWeight: 'bold' }}
                            />
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ color: '#2563eb', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1 }}>{new Date(event.date).getDate()}</Typography>
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
                          <EventIcon sx={{ fontSize: '1.1rem', mr: 1, color: '#3b82f6' }} />
                          <Typography variant="caption" noWrap>{formatDate(event.date)}</Typography>
                        </Box>
                        <Button 
                          fullWidth 
                          endIcon={<ArrowForward />}
                          sx={{ justifyContent: 'center', color: '#2563eb', '&:hover': { bgcolor: '#2563eb', color: 'white' } }}
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
        <Box sx={{ py: 10, background: 'linear-gradient(to right, #ffffff, rgba(239,246,255,0.5))' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
                {upcomingEvents.length > 0 ? 'Recent Updates' : 'All Events & News'}
              </Typography>
              <Box sx={{ width: 80, height: 4, background: 'linear-gradient(to right, #2563eb, #475569)', mx: 'auto', borderRadius: 2 }} />
            </Box>

            {filteredEvents.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 10, border: 'none', background: 'linear-gradient(to bottom right, #ffffff, rgba(239,246,255,0.8))', boxShadow: 2 }}>
                <CardContent>
                  <EventIcon sx={{ fontSize: 64, color: '#93c5fd', mb: 2 }} />
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
                        <Grid item xs={12} md={4} sx={{ position: 'relative', minHeight: { xs: 200, md: 'auto' } }}>
                          <CardMedia
                            component="img"
                            image={event.image}
                            alt={event.title}
                            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Grid>
                      )}
                      <Grid item xs={12} md={event.image ? 8 : 12}>
                        <CardContent sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', height: '100%', background: 'linear-gradient(to bottom right, #ffffff, rgba(239,246,255,0.3))' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Chip 
                              label={`${getEventTypeIcon(event.type)} ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`}
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
                              <EventIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#3b82f6' }} />
                              <Typography variant="body2">{formatDate(event.date)}</Typography>
                              {isUpcoming(event.date) && (
                                <Chip label="Upcoming" size="small" variant="outlined" sx={{ ml: 2, color: '#059669', borderColor: '#059669', bgcolor: '#ecfdf5' }} />
                              )}
                            </Box>
                            <Button 
                              endIcon={<ArrowForward />}
                              sx={{ color: '#2563eb', '&:hover': { bgcolor: '#2563eb', color: 'white' } }}
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
                <CardMedia component="img" image={selectedEvent.image} alt={selectedEvent.title} sx={{ height: '100%' }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                <Chip 
                  label={`${getEventTypeIcon(selectedEvent.type)} ${selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}`}
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
                    label={`${getEventTypeIcon(selectedEvent.type)} ${selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}`}
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
                  <EventIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#3b82f6' }} />
                  <Typography variant="body2">{formatDate(selectedEvent.date)}</Typography>
                </Box>
                {selectedEvent.createdAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ fontSize: '1.2rem', mr: 1, color: '#3b82f6' }} />
                    <Typography variant="body2">Posted {new Date(selectedEvent.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                )}
                {isUpcoming(selectedEvent.date) && (
                  <Chip label="Upcoming" size="small" variant="outlined" sx={{ color: '#059669', borderColor: '#059669', bgcolor: '#ecfdf5' }} />
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