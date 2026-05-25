import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button } from "@mui/material";
import { Phone, CheckCircleOutline } from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";
import { usePublicBrand } from "../../hooks/usePublicBrand";

const Admissions = () => {
  const brand = usePublicBrand();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Head title="Admissions - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, color: brand.secondary, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Admissions
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
              Join AIRADS College and start your journey to a successful career in technical education.
            </Typography>
          </Box>

          <Grid container spacing={8}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: brand.secondary, mb: 4 }}>
                Application Procedure
              </Typography>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { title: 'Contact Us', desc: 'Call, SMS, or WhatsApp any of our admission lines' },
                  { title: 'Apply Online', desc: 'Visit www.airads.ac.ke to submit your application' },
                  { title: 'Submit Documents', desc: 'Provide required academic certificates and documents' },
                  { title: 'Confirmation', desc: 'Receive admission confirmation and begin your studies' }
                ].map((step, index) => (
                  <ListItem key={index} sx={{ alignItems: 'flex-start', p: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: brand.secondary, color: 'white', fontWeight: 'bold' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={<Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{step.title}</Typography>}
                      secondary={<Typography variant="body1" sx={{ color: 'text.secondary' }}>{step.desc}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, bgcolor: brand.softBlue, height: '100%' }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: brand.secondary, mb: 4 }}>
                  Contact Information
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Campus Contact Numbers:</Typography>
                  <List dense disablePadding>
                    {[
                      'ELDORET Campus: 0715-696-979',
                      'NAKURU Campus: 0711-488-302',
                      'KERICHO Campus: 0729-976-885',
                      'KISUMU Campus: 0715-505-262',
                      'BUNGOMA Campus: 0715-771-316',
                      'Head Office: 0723-555-999'
                    ].map((contact, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                        <Phone sx={{ color: 'text.secondary', fontSize: '1.2rem', mr: 2 }} />
                        <ListItemText primary={contact} sx={{ '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '1.05rem' } }} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Other Contact Methods:</Typography>
                  <List dense disablePadding>
                    {[
                      'Facebook Messenger',
                      'Email: info@airads.ac.ke',
                      'Website: www.airads.ac.ke'
                    ].map((method, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                        <CheckCircleOutline sx={{ color: brand.primary, fontSize: '1.2rem', mr: 2 }} />
                        <ListItemText primary={method} sx={{ '& .MuiListItemText-primary': { color: 'text.secondary', fontSize: '1.05rem' } }} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 10 }}>
            <Paper sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, bgcolor: brand.accent, color: 'white', textAlign: 'center' }}>
              <Typography variant="h3" component="h3" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
                MAY/JUNE INTAKE ONGOING
              </Typography>
              <Typography variant="h6" sx={{ mb: 5, fontWeight: 400, opacity: 0.9 }}>
                Don't miss this opportunity to join Kenya's premier technical college
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  bgcolor: 'white', 
                  color: brand.accent,
                  fontWeight: 'bold', 
                  fontSize: '1.1rem',
                  px: 6, 
                  py: 2, 
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                APPLY NOW
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Admissions;
