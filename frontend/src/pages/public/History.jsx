import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent } from "@mui/material";
import {
  School, Verified, LocalHospital, Assignment, Assessment,
  EventNote, Star, EmojiEvents, Public, Computer, Museum, LocationCity, AccountBalance, RocketLaunch
} from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";
import { usePublicBrand } from "../../hooks/usePublicBrand";

const History = () => {
  const brand = usePublicBrand();

  const registrations = [
    {
      title: "Technical and Vocational Education and Training Authority",
      acronym: "TVETA",
      registration: "MOHEST/PC/1049/07",
      icon: <Verified fontSize="large" />,
    },
    {
      title: "AIRADS COLLEGE KNDI Interim License",
      acronym: "KNDI",
      registration: "KNDI/ACCR/IL 029",
      icon: <Assignment fontSize="large" />,
    },
    {
      title: "Kenya Pharmacy and Poisons Board",
      acronym: "KPPB",
      registration: "PPB/COL/013/07",
      icon: <LocalHospital fontSize="large" />,
    },
    {
      title: "Kenya National Examination Council",
      acronym: "KNEC",
      registration: "Technical, Business and ECDE Centre numbers",
      icon: <School fontSize="large" />,
    },
    {
      title: "Kenya Accountants and Secretaries National Examination Board",
      acronym: "KASNEB",
      registration: "KASNEB",
      icon: <Assessment fontSize="large" />,
    }
  ];

  const campuses = [
    { name: "Eldoret Town Campus", isMain: true, students: "5,000+", established: "2006", icon: <AccountBalance fontSize="large" /> },
    { name: "Kericho Town Campus", isMain: false, students: "3,200+", established: "2012", icon: <LocationCity fontSize="large" /> },
    { name: "Kisumu City Campus", isMain: false, students: "4,100+", established: "2014", icon: <LocationCity fontSize="large" /> },
    { name: "Nakuru City Campus", isMain: false, students: "3,800+", established: "2015", icon: <LocationCity fontSize="large" /> },
    { name: "Bungoma Town Campus", isMain: false, students: "2,900+", established: "2017", icon: <LocationCity fontSize="large" /> },
    { name: "Lodwar Campus", isMain: false, students: "1,500+", established: "2019", icon: <LocationCity fontSize="large" /> },
    { name: "Maralal Campus", isMain: false, students: "1,200+", established: "2020", icon: <LocationCity fontSize="large" /> }
  ];

  const milestones = [
    { year: "2006", event: "AIRADS College Founded", description: "Opened our doors with a vision for excellence", icon: <Museum fontSize="large" /> },
    { year: "2010", event: "First Graduation Ceremony", description: "Celebrated our first graduating class", icon: <School fontSize="large" /> },
    { year: "2015", event: "Multi-Campus Expansion", description: "Established campuses across Kenya", icon: <Public fontSize="large" /> },
    { year: "2020", event: "Digital Transformation", description: "Embraced online learning platforms", icon: <Computer fontSize="large" /> },
    { year: "2024", event: "25,000+ Graduates", description: "Milestone achievement in student success", icon: <EmojiEvents fontSize="large" /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Head title="History - AIRADS College" />
      <TopNavbar />
      <MainNavbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: brand.secondary,
            color: 'white',
            pt: { xs: 15, md: 20 },
            pb: { xs: 10, md: 15 }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="overline"
                sx={{
                  display: 'inline-block',
                  px: 4, py: 1.5,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontWeight: 700,
                  letterSpacing: 3,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Since 2006
              </Typography>
            </Box>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 4, color: 'white', fontSize: { xs: '3rem', md: '4rem', lg: '5rem' }, lineHeight: 1.1 }}>
              Our History
            </Typography>
            <Typography variant="h5" sx={{ color: brand.softBlue, maxWidth: 800, mx: 'auto', fontWeight: 300, lineHeight: 1.8 }}>
              <Box component="span" sx={{ fontWeight: 600, color: 'white' }}>18 Years</Box> of Excellence in Technical Education and
              <Box component="span" sx={{ fontWeight: 600, color: 'white' }}> Innovation</Box>
            </Typography>
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ width: 32, height: 4, bgcolor: 'white', borderRadius: 2 }} />
              <Box sx={{ width: 64, height: 4, bgcolor: brand.softBlue, borderRadius: 2 }} />
              <Box sx={{ width: 32, height: 4, bgcolor: 'white', borderRadius: 2 }} />
            </Box>
          </Container>
        </Box>

        {/* About AIRADS Section */}
        <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'white', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 8, bgcolor: brand.primary }} />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
            {/* Institution Overview */}
            <Box sx={{ textAlign: 'center', mb: { xs: 10, md: 15 } }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 96, height: 96, bgcolor: brand.primary,
                borderRadius: '50%', color: 'white', mb: 4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
              }}>
                <Museum sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: brand.neutralText, mb: 4 }}>
                African Institute of Research and Development Studies
              </Typography>

              <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: brand.softBlue, border: `1px solid ${brand.borderBlue}`, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                <Typography variant="h6" sx={{ color: brand.mutedText, lineHeight: 1.8, fontWeight: 400, mb: 6 }}>
                  African Institute of Research and Development Studies is one of the best tertiary technical training institutions offering
                  <Box component="span" sx={{ fontWeight: 700, color: brand.primary }}> Higher National Diploma, Diploma, certificate, and artisan courses</Box> examined by
                  KNEC and KASNEB. We are an institution with campuses in major towns in Kenya.
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'transform 0.5s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                      <Box sx={{ width: 64, height: 64, bgcolor: brand.primary, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)', p: 2 }}>
                        <EventNote fontSize="large" />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: brand.primary, mb: 1 }}>April 1st, 2006</Typography>
                      <Typography variant="h6" sx={{ color: brand.mutedText, fontWeight: 500 }}>Opened Our Doors</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'transform 0.5s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                      <Box sx={{ width: 64, height: 64, bgcolor: brand.secondary, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)', p: 2 }}>
                        <Star fontSize="large" />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: brand.secondary, mb: 1 }}>18 Years</Typography>
                      <Typography variant="h6" sx={{ color: brand.mutedText, fontWeight: 500 }}>Of Excellence</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Timeline Section */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brand.neutralText, textAlign: 'center', mb: 8 }}>
                Our Journey Through Time
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {milestones.map((milestone, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', '&:hover .icon-box': { transform: 'scale(1.1)' }, '&:hover .content-box': { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                    <Box className="icon-box" sx={{ flexShrink: 0, width: 80, height: 80, bgcolor: brand.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)', transition: 'transform 0.3s', mr: 4 }}>
                      {milestone.icon}
                    </Box>
                    <Paper className="content-box" elevation={0} sx={{ flex: 1, p: 4, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.5s' }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: brand.primary, mb: 1 }}>{milestone.year}</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: brand.neutralText, mb: 1 }}>{milestone.event}</Typography>
                          <Typography variant="body1" sx={{ color: brand.mutedText }}>{milestone.description}</Typography>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'block' }, width: 4, height: 60, bgcolor: brand.secondary, borderRadius: 2 }} />
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Graduation Achievements */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Paper elevation={0} sx={{ bgcolor: brand.secondary, borderRadius: 6, p: { xs: 4, md: 8 }, color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <Box sx={{ position: 'relative', zIndex: 10 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <School fontSize="large" /> GRADUATION ACHIEVEMENTS
                  </Typography>
                  <Grid container spacing={4} sx={{ maxWidth: 900, mx: 'auto', mb: 6 }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 6, p: 4, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', mb: 2 }}>8</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>Graduation Ceremonies</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>Celebrating Excellence</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 6, p: 4, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', mb: 2 }}>25,000+</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>Students Released to Job Market</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>Making Impact Globally</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, p: 4, maxWidth: 900, mx: 'auto', backdropFilter: 'blur(8px)' }}>
                    <Typography variant="h6" sx={{ color: brand.softBlue, fontStyle: 'italic', lineHeight: 1.8, fontWeight: 400 }}>
                      "AIRADS College is proud of you graduands. The real ambassadors of African Institute of Research and Development Studies."
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Official Registrations */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: brand.neutralText, mb: 3 }}>
                  Official Registrations & Approvals
                </Typography>
                <Typography variant="h6" sx={{ color: brand.mutedText, maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                  Officially recognized and approved by leading educational authorities in Kenya
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 120, height: 4, bgcolor: brand.primary, borderRadius: 2 }} />
                </Box>
              </Box>

              <Grid container spacing={4}>
                {registrations.map((reg, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: brand.softBlue,
                        p: 4,
                        borderRadius: 6,
                        height: '100%',
                        transition: 'transform 0.5s, box-shadow 0.5s',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                          '& .icon-wrapper': { transform: 'scale(1.1) rotate(6deg)' }
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box className="icon-wrapper" sx={{ width: 64, height: 64, bgcolor: brand.primary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)', transition: 'all 0.3s' }}>
                          {reg.icon}
                        </Box>
                        <Box sx={{ ml: 3 }}>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: brand.primary }}>
                            {reg.acronym}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: brand.neutralText, mb: 3, lineHeight: 1.4 }}>
                        {reg.title}
                      </Typography>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 3, p: 2 }}>
                        <Typography variant="body2" sx={{ color: brand.mutedText, fontFamily: 'monospace', fontWeight: 600 }}>
                          {reg.registration}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Campus Network */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: brand.neutralText, mb: 3 }}>
                  Our Campus Network
                </Typography>
                <Typography variant="h6" sx={{ color: brand.mutedText, maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                  Strategically located across Kenya to serve students nationwide
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 120, height: 4, bgcolor: brand.primary, borderRadius: 2 }} />
                </Box>
              </Box>

              <Paper elevation={0} sx={{ bgcolor: brand.softBlue, borderRadius: 6, p: { xs: 4, md: 6 }, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <Grid container spacing={4}>
                  {campuses.map((campus, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={campus.isMain ? 8 : 2}
                        sx={{
                          p: 4,
                          textAlign: 'center',
                          borderRadius: 4,
                          height: '100%',
                          bgcolor: campus.isMain ? brand.secondary : 'white',
                          color: campus.isMain ? 'white' : brand.mutedText,
                          transition: 'transform 0.5s',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': { transform: 'translateY(-8px) scale(1.02)' }
                        }}
                      >
                        <Box sx={{ position: 'relative', zIndex: 10 }}>
                          <Box sx={{ mb: 2, color: campus.isMain ? 'white' : brand.primary }}>{campus.icon}</Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {campus.name}
                          </Typography>
                          {campus.isMain && <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>(Main Campus)</Typography>}
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, opacity: 0.8 }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{campus.students}</Typography>
                              <Typography variant="caption">Students</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{campus.established}</Typography>
                              <Typography variant="caption">Established</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>

            {/* Vision 2030 Commitment */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Paper elevation={0} sx={{ bgcolor: brand.secondary, borderRadius: 6, p: { xs: 6, md: 8 }, color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <Box sx={{ position: 'relative', zIndex: 10 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <RocketLaunch fontSize="large" /> Vision 2030 Commitment
                  </Typography>
                  <Typography variant="h6" sx={{ lineHeight: 1.8, maxWidth: 1000, mx: 'auto', fontWeight: 400 }}>
                    AIRADS College in the spirit of the <Box component="span" sx={{ fontWeight: 700, color: brand.softBlue }}>vision 2030</Box> and
                    <Box component="span" sx={{ fontWeight: 700, color: brand.softBlue }}> TVETA publications</Box>, is one of the best colleges in implementing and executing the
                    <Box component="span" sx={{ fontWeight: 700, color: brand.softBlue }}> TVET courses and Competency Based Curriculum</Box>. We have various courses approved by the ministry of education and TVETA.
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Impact Numbers */}
            <Paper elevation={0} sx={{ bgcolor: brand.softBlue, borderRadius: 6, p: { xs: 6, md: 8 }, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brand.neutralText, textAlign: 'center', mb: 8 }}>
                Our Impact in Numbers
              </Typography>
              <Grid container spacing={4}>
                {[
                  { number: "18", label: "Years of Excellence", icon: <EmojiEvents fontSize="large" /> },
                  { number: "7", label: "Campus Locations", icon: <LocationCity fontSize="large" /> },
                  { number: "25K+", label: "Graduates", icon: <School fontSize="large" /> },
                  { number: "5+", label: "Official Registrations", icon: <Verified fontSize="large" /> }
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 6, transition: 'transform 0.5s', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', '&:hover': { transform: 'translateY(-12px) scale(1.05)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' } }}>
                      <Box sx={{ width: 80, height: 80, bgcolor: brand.primary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mx: 'auto', mb: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)' }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: brand.neutralText }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="h6" sx={{ color: brand.mutedText, fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default History;
