import React from 'react';
import { Box, Container, Grid, Typography, Button, Paper, Card, CardContent } from '@mui/material';
import { WhatsApp, Phone, Language, EmojiEvents, School, MenuBook, Wifi, Public, BusinessCenter, Facebook } from '@mui/icons-material';

const WelcomeSection = () => {
  const whyJoinReasons = [
    {
      title: "Excellent KNEC Pass Rate",
      description: "90-100% pass rate in KNEC, NITA, ICM & KASNEB Exams for 18 years consistently",
      icon: <EmojiEvents fontSize="inherit" />,
      color: "linear-gradient(to right bottom, #3b82f6, #2563eb)",
      shadowColor: "rgba(59, 130, 246, 0.2)"
    },
    {
      title: "Qualified Trainers",
      description: "Experienced and qualified trainers dedicated to student success",
      icon: <School fontSize="inherit" />,
      color: "linear-gradient(to right bottom, #ef4444, #dc2626)",
      shadowColor: "rgba(239, 68, 68, 0.2)"
    },
    {
      title: "Learning Resources",
      description: "Well-furnished lecture halls, computers, internet, books and furniture",
      icon: <MenuBook fontSize="inherit" />,
      color: "linear-gradient(to right bottom, #2563eb, #1d4ed8)",
      shadowColor: "rgba(37, 99, 235, 0.2)"
    },
    {
      title: "Free Internet & WiFi",
      description: "Free internet and WiFi access for research and learning",
      icon: <Wifi fontSize="inherit" />,
      color: "linear-gradient(to right bottom, #dc2626, #b91c1c)",
      shadowColor: "rgba(220, 38, 38, 0.2)"
    },
    {
      title: "Student Diversity",
      description: "6 National campuses across the country serving diverse students",
      icon: <Public fontSize="inherit" />,
      color: "linear-gradient(to right bottom, #1d4ed8, #1e40af)",
      shadowColor: "rgba(29, 78, 216, 0.2)"
    },
    {
      title: "Industrial Attachment",
      description: "Industrial attachment placements and mentoring programs",
      icon: <BusinessCenter fontSize="inherit" />,
      color: "linear-gradient(to right bottom, #b91c1c, #991b1b)",
      shadowColor: "rgba(185, 28, 28, 0.2)"
    }
  ];

  const campusContacts = [
    { campus: "ELDORET Campus", contact: "0715696979" },
    { campus: "NAKURU Campus", contact: "0711488302" },
    { campus: "KERICHO Campus", contact: "0729976885" },
    { campus: "KISUMU Campus", contact: "0715057262" },
    { campus: "BUNGOMA Campus", contact: "0715771316" },
    { campus: "MARALAL Campus", contact: "0717885888" },
    { campus: "Head Office", contact: "0723555999" }
  ];

  const handlePhoneCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber) => {
    const formattedNumber = phoneNumber.replace(/[-\s]/g, '');
    window.open(`https://wa.me/254${formattedNumber.substring(1)}`, '_blank');
  };

  const handleFacebookVisit = () => {
    window.open('https://www.facebook.com/www.airads.ac.ken/', '_blank');
  };

  return (
    <Box component="section" sx={{ py: 10, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        {/* CEO Welcome Message */}
        <Paper elevation={4} sx={{ borderRadius: 4, mb: 8, overflow: 'hidden' }}>
          <Grid container>
            {/* CEO Photo */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: { xs: 400, lg: 500 } }}>
                <Box
                  component="img"
                  src="/static/ceo-min.png"
                  alt="AIRADS College CEO"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s', '&:hover': { transform: 'scale(1.05)' } }}
                />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30, 58, 138, 0.8), transparent)' }} />
                <Box sx={{ position: 'absolute', bottom: 24, left: 24, color: 'white' }}>
                  <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', borderRadius: 2, px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">CEO Message</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Welcome to Excellence</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            {/* Welcome Content */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ p: { xs: 4, lg: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: 4, height: 60, background: 'linear-gradient(to bottom, #2563eb, #dc2626)', borderRadius: 2, mr: 2 }} />
                  <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', background: 'linear-gradient(to right, #1e40af, #2563eb, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', lg: '3rem' } }}>
                    Welcome to AIRADS College
                  </Typography>
                </Box>
                
                <Box sx={{ color: 'text.secondary', fontSize: '1.125rem', lineHeight: 1.8 }}>
                  <Typography variant="body1" paragraph>
                    Welcome to AIRADS College a national TVET technical training college. We are the best college 
                    registered and licensed by TVETA, a Centre of Excellence where Quality is Nurtured.
                  </Typography>
                  <Typography variant="body1">
                    We focus on Technical vocational Education and training TVET - TVET education worldwide is seen 
                    as a tool that empowers trainees with practical skills.
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 4, p: 3, background: 'linear-gradient(to right, #eff6ff, #fef2f2)', borderRadius: 2, borderLeft: '4px solid #3b82f6' }}>
                  <Typography variant="h6" sx={{ color: '#1e40af', fontWeight: 'bold' }}>
                    A Centre of Excellence <Typography component="span" sx={{ color: '#dc2626', fontWeight: 600 }}>Where Quality is Nurtured</Typography>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Why Join AIRADS College */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', background: 'linear-gradient(to right, #1e40af, #2563eb, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              Why Join AIRADS College?
            </Typography>
            <Box sx={{ width: 120, height: 4, background: 'linear-gradient(to right, #2563eb, #dc2626)', mx: 'auto', borderRadius: 2 }} />
          </Box>
          
          <Grid container spacing={4}>
            {whyJoinReasons.map((reason, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 4, 
                    transition: 'all 0.3s', 
                    '&:hover': { 
                      transform: 'translateY(-8px) scale(1.02)', 
                      boxShadow: `0 20px 25px -5px ${reason.shadowColor}, 0 10px 10px -5px ${reason.shadowColor}`
                    } 
                  }}
                >
                  <CardContent sx={{ p: 4, position: 'relative' }}>
                    <Box sx={{ 
                      fontSize: '3rem', 
                      mb: 2, 
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      background: reason.color,
                      color: 'white',
                      boxShadow: `0 4px 14px 0 ${reason.shadowColor}`
                    }}>
                      {reason.icon}
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: '#1e40af', mb: 2 }}>
                      {reason.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {reason.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How to Apply Section */}
        <Paper 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4, 
            background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #dc2626)', 
            color: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            How to Apply or Register
          </Typography>
          
          <Grid container spacing={6}>
            {/* Registration Methods */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ fontSize: '2rem', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Call/SMS/WhatsApp</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>Contact any of our campus admission lines</Typography>
                  
                  <Grid container spacing={2}>
                    {campusContacts.map((campus, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ bgcolor: 'rgba(37, 99, 235, 0.2)', p: 2, borderRadius: 2, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}>
                          <Typography variant="subtitle2" sx={{ color: '#fca5a5', fontWeight: 'bold', mb: 1 }}>{campus.campus}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button 
                              size="small" 
                              onClick={() => handlePhoneCall(campus.contact)}
                              sx={{ color: 'white', textTransform: 'none', minWidth: 'auto', p: 0, '&:hover': { color: '#fef08a' } }}
                            >
                              📞 Call
                            </Button>
                            <Typography sx={{ color: 'white' }}>|</Typography>
                            <Button 
                              size="small" 
                              onClick={() => handleWhatsApp(campus.contact)}
                              sx={{ color: 'white', textTransform: 'none', minWidth: 'auto', p: 0, '&:hover': { color: '#86efac' } }}
                              startIcon={<WhatsApp fontSize="small" />}
                            >
                              WhatsApp
                            </Button>
                          </Box>
                          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'white' }}>{campus.contact}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Language sx={{ fontSize: '2rem', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Apply Online</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>Visit our website to apply online</Typography>
                  <Button 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fef08a', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#fef9c3' }, textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    🌐 Airads Admission Form
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Additional Contact Methods */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Facebook sx={{ fontSize: '2.5rem', mr: 2, color: '#3b82f6' }} />
                    <Typography variant="h6" fontWeight="bold">Facebook Messenger</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>Use Facebook inbox to reach us instantly</Typography>
                  <Button 
                    onClick={handleFacebookVisit}
                    fullWidth
                    startIcon={<Facebook />}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fef08a', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.3)', color: '#fef9c3' }, textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    AIRADS College Facebook Page
                  </Button>
                </Box>

                <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)', p: 3, borderRadius: 3, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'scale(1.02)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>🏢</Typography>
                    <Typography variant="h6" fontWeight="bold">Head Office</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>Contact our main office for general inquiries</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      onClick={() => handlePhoneCall('0723555999')}
                      fullWidth
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fef08a', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)', color: '#fef9c3' }, textTransform: 'none' }}
                    >
                      📞 0723555999
                    </Button>
                    <Button 
                      onClick={() => handleWhatsApp('0723-555-999')}
                      fullWidth
                      startIcon={<WhatsApp />}
                      sx={{ bgcolor: 'rgba(22, 163, 74, 0.2)', color: '#bbf7d0', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: 'rgba(22, 163, 74, 0.4)', color: '#dcfce3' }, textTransform: 'none' }}
                    >
                      WhatsApp
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ 
                  background: 'linear-gradient(to right, rgba(220, 38, 38, 0.3), rgba(239, 68, 68, 0.3))', 
                  border: '2px solid rgba(248, 113, 113, 1)', 
                  p: 3, 
                  borderRadius: 3, 
                  transition: 'all 0.3s', 
                  '&:hover': { background: 'linear-gradient(to right, rgba(220, 38, 38, 0.5), rgba(239, 68, 68, 0.5))' } 
                }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#bfdbfe', display: 'flex', alignItems: 'center', mb: 1 }}>
                    📢 Register Now! <Typography component="span" sx={{ ml: 1, fontSize: '1.5rem' }}>🎓</Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Don't miss out on our quality education. Contact us today!</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomeSection;