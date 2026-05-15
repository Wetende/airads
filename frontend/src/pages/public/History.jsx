import React from 'react';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent } from "@mui/material";
import { 
  School, Verified, LocalHospital, Assignment, Assessment, 
  EventNote, Star, EmojiEvents, Public, Computer, Museum, LocationCity, AccountBalance
} from "@mui/icons-material";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const History = () => {
  const registrations = [
    {
      title: "Technical and Vocational Education and Training Authority",
      acronym: "TVETA",
      registration: "MOHEST/PC/1049/07",
      icon: <Verified fontSize="large" />,
      color: "linear-gradient(to right, #3b82f6, #2563eb)",
      bgColor: "linear-gradient(to bottom right, #eff6ff, #dbeafe)"
    },
    {
      title: "AIRADS COLLEGE KNDI Interim License",
      acronym: "KNDI",
      registration: "KNDI/ACCR/IL 029",
      icon: <Assignment fontSize="large" />,
      color: "linear-gradient(to right, #22c55e, #16a34a)",
      bgColor: "linear-gradient(to bottom right, #f0fdf4, #dcfce7)"
    },
    {
      title: "Kenya Pharmacy and Poisons Board",
      acronym: "KPPB",
      registration: "PPB/COL/013/07",
      icon: <LocalHospital fontSize="large" />,
      color: "linear-gradient(to right, #a855f7, #9333ea)",
      bgColor: "linear-gradient(to bottom right, #faf5ff, #f3e8ff)"
    },
    {
      title: "Kenya National Examination Council",
      acronym: "KNEC",
      registration: "Technical, Business and ECDE Centre numbers",
      icon: <School fontSize="large" />,
      color: "linear-gradient(to right, #f97316, #ea580c)",
      bgColor: "linear-gradient(to bottom right, #fff7ed, #ffedd5)"
    },
    {
      title: "Kenya Accountants and Secretaries National Examination Board",
      acronym: "KASNEB",
      registration: "KASNEB",
      icon: <Assessment fontSize="large" />,
      color: "linear-gradient(to right, #14b8a6, #0d9488)",
      bgColor: "linear-gradient(to bottom right, #f0fdfa, #ccfbf1)"
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
            background: 'linear-gradient(to right, #1e3a8a, #1e40af, #1d4ed8)', 
            color: 'white',
            pt: { xs: 15, md: 20 },
            pb: { xs: 10, md: 15 }
          }}
        >
          {/* Animated Background Elements */}
          <Box sx={{ position: 'absolute', inset: 0 }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 400, height: 400, bgcolor: '#3b82f6', borderRadius: '50%', opacity: 0.1, filter: 'blur(80px)', animation: 'pulse 4s infinite' }} />
            <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 400, height: 400, bgcolor: '#ef4444', borderRadius: '50%', opacity: 0.1, filter: 'blur(80px)', animation: 'pulse 4s infinite 2s' }} />
          </Box>
          
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
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 4, background: 'linear-gradient(to right, #ffffff, #bfdbfe, #fca5a5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '3rem', md: '4rem', lg: '5rem' }, lineHeight: 1.1 }}>
              Our History
            </Typography>
            <Typography variant="h5" sx={{ color: '#dbeafe', maxWidth: 800, mx: 'auto', fontWeight: 300, lineHeight: 1.8 }}>
              <Box component="span" sx={{ fontWeight: 600, color: 'white' }}>18 Years</Box> of Excellence in Technical Education and 
              <Box component="span" sx={{ fontWeight: 600, color: '#fecaca' }}> Innovation</Box>
            </Typography>
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ width: 32, height: 4, bgcolor: 'white', borderRadius: 2 }} />
              <Box sx={{ width: 64, height: 4, bgcolor: '#93c5fd', borderRadius: 2 }} />
              <Box sx={{ width: 32, height: 4, bgcolor: '#f87171', borderRadius: 2 }} />
            </Box>
          </Container>
        </Box>

        {/* About AIRADS Section */}
        <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'white', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 8, background: 'linear-gradient(to right, #3b82f6, #ef4444)' }} />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
            {/* Institution Overview */}
            <Box sx={{ textAlign: 'center', mb: { xs: 10, md: 15 } }}>
              <Box sx={{ 
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                width: 96, height: 96, background: 'linear-gradient(to right, #3b82f6, #2563eb)', 
                borderRadius: '50%', color: 'white', mb: 4, boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)'
              }}>
                <Museum sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e3a8a', mb: 4 }}>
                African Institute of Research and Development Studies
              </Typography>
              
              <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, background: 'linear-gradient(to right, #eff6ff, #ffffff, #fef2f2)', border: '1px solid #dbeafe', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                <Typography variant="h6" sx={{ color: '#475569', lineHeight: 1.8, fontWeight: 400, mb: 6 }}>
                  African Institute of Research and Development Studies is one of the best tertiary technical training institutions offering 
                  <Box component="span" sx={{ fontWeight: 700, color: '#1d4ed8' }}> Higher National Diploma, Diploma, certificate, and artisan courses</Box> examined by 
                  KNEC and KASNEB. We are an institution with campuses in major towns in Kenya.
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'transform 0.5s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                      <Box sx={{ w: 64, h: 64, background: 'linear-gradient(to right, #3b82f6, #2563eb)', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 3, boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)', p: 2 }}>
                        <EventNote fontSize="large" />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563eb', mb: 1 }}>April 1st, 2006</Typography>
                      <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>Opened Our Doors</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'transform 0.5s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                      <Box sx={{ w: 64, h: 64, background: 'linear-gradient(to right, #ef4444, #dc2626)', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 3, boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)', p: 2 }}>
                        <Star fontSize="large" />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mb: 1 }}>18 Years</Typography>
                      <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>Of Excellence</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Timeline Section */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', textAlign: 'center', mb: 8 }}>
                Our Journey Through Time
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {milestones.map((milestone, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', '&:hover .icon-box': { transform: 'scale(1.1)' }, '&:hover .content-box': { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
                    <Box className="icon-box" sx={{ flexShrink: 0, width: 80, height: 80, background: 'linear-gradient(to right, #3b82f6, #2563eb)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)', transition: 'transform 0.3s', mr: 4 }}>
                      {milestone.icon}
                    </Box>
                    <Paper className="content-box" elevation={0} sx={{ flex: 1, p: 4, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.5s' }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2563eb', mb: 1 }}>{milestone.year}</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>{milestone.event}</Typography>
                          <Typography variant="body1" sx={{ color: '#64748b' }}>{milestone.description}</Typography>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'block' }, width: 4, height: 60, bgcolor: '#ef4444', borderRadius: 2 }} />
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Graduation Achievements */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Paper elevation={0} sx={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af, #b91c1c)', borderRadius: 6, p: { xs: 4, md: 8 }, color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <Box sx={{ position: 'relative', zIndex: 10 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <School fontSize="large" /> GRADUATION ACHIEVEMENTS
                  </Typography>
                  <Grid container spacing={4} sx={{ maxWidth: 900, mx: 'auto', mb: 6 }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 6, p: 4, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#fde047', mb: 2 }}>8</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>Graduation Ceremonies</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>Celebrating Excellence</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 6, p: 4, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'background-color 0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#86efac', mb: 2 }}>25,000+</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>Students Released to Job Market</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>Making Impact Globally</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, p: 4, maxWidth: 900, mx: 'auto', backdropFilter: 'blur(8px)' }}>
                    <Typography variant="h6" sx={{ color: '#bfdbfe', fontStyle: 'italic', lineHeight: 1.8, fontWeight: 400 }}>
                      "AIRADS College is proud of you graduands. The real ambassadors of African Institute of Research and Development Studies."
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Official Registrations */}
            <Box sx={{ mb: { xs: 10, md: 15 } }}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Official Registrations & Approvals
                </Typography>
                <Typography variant="h6" sx={{ color: '#475569', maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                  Officially recognized and approved by leading educational authorities in Kenya
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 120, height: 4, background: 'linear-gradient(to right, #3b82f6, #ef4444)', borderRadius: 2 }} />
                </Box>
              </Box>
              
              <Grid container spacing={4}>
                {registrations.map((reg, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        background: reg.bgColor,
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
                        <Box className="icon-wrapper" sx={{ width: 64, height: 64, background: reg.color, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s' }}>
                          {reg.icon}
                        </Box>
                        <Box sx={{ ml: 3 }}>
                          <Typography variant="h4" sx={{ fontWeight: 900, background: reg.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {reg.acronym}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, lineHeight: 1.4 }}>
                        {reg.title}
                      </Typography>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 3, p: 2 }}>
                        <Typography variant="body2" sx={{ color: '#334155', fontFamily: 'monospace', fontWeight: 600 }}>
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
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Our Campus Network
                </Typography>
                <Typography variant="h6" sx={{ color: '#475569', maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
                  Strategically located across Kenya to serve students nationwide
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 120, height: 4, background: 'linear-gradient(to right, #3b82f6, #a855f7)', borderRadius: 2 }} />
                </Box>
              </Box>
              
              <Paper elevation={0} sx={{ background: 'linear-gradient(to bottom right, #f8fafc, #ffffff, #eff6ff)', borderRadius: 6, p: { xs: 4, md: 6 }, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
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
                          background: campus.isMain ? 'linear-gradient(to right, #2563eb, #7c3aed, #4f46e5)' : 'white',
                          color: campus.isMain ? 'white' : '#334155',
                          transition: 'transform 0.5s',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': { transform: 'translateY(-8px) scale(1.02)' }
                        }}
                      >
                        {campus.isMain && (
                          <Box sx={{ position: 'absolute', inset: 0 }}>
                            <Box sx={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, bgcolor: 'white', borderRadius: '50%', opacity: 0.1, filter: 'blur(20px)' }} />
                          </Box>
                        )}
                        <Box sx={{ position: 'relative', zIndex: 10 }}>
                          <Box sx={{ mb: 2 }}>{campus.icon}</Box>
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
              <Paper elevation={0} sx={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af, #991b1b)', borderRadius: 6, p: { xs: 6, md: 8 }, color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <Box sx={{ position: 'relative', zIndex: 10 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    🚀 Vision 2030 Commitment
                  </Typography>
                  <Typography variant="h6" sx={{ lineHeight: 1.8, maxWidth: 1000, mx: 'auto', fontWeight: 400 }}>
                    AIRADS College in the spirit of the <Box component="span" sx={{ fontWeight: 700, color: '#93c5fd' }}>vision 2030</Box> and 
                    <Box component="span" sx={{ fontWeight: 700, color: '#fca5a5' }}> TVETA publications</Box>, is one of the best colleges in implementing and executing the 
                    <Box component="span" sx={{ fontWeight: 700, color: '#bfdbfe' }}> TVET courses and Competency Based Curriculum</Box>. We have various courses approved by the ministry of education and TVETA.
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Impact Numbers */}
            <Paper elevation={0} sx={{ background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #fef2f2)', borderRadius: 6, p: { xs: 6, md: 8 }, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', textAlign: 'center', mb: 8 }}>
                Our Impact in Numbers
              </Typography>
              <Grid container spacing={4}>
                {[
                  { number: "18", label: "Years of Excellence", icon: <EmojiEvents fontSize="large" />, color: "linear-gradient(to right, #3b82f6, #2563eb)" },
                  { number: "7", label: "Campus Locations", icon: <LocationCity fontSize="large" />, color: "linear-gradient(to right, #2563eb, #1d4ed8)" },
                  { number: "25K+", label: "Graduates", icon: <School fontSize="large" />, color: "linear-gradient(to right, #ef4444, #dc2626)" },
                  { number: "5+", label: "Official Registrations", icon: <Verified fontSize="large" />, color: "linear-gradient(to right, #1d4ed8, #ef4444)" }
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 6, transition: 'transform 0.5s', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', '&:hover': { transform: 'translateY(-12px) scale(1.05)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' } }}>
                      <Box sx={{ width: 80, height: 80, background: stat.color, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mx: 'auto', mb: 4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, background: stat.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#475569', fontWeight: 500 }}>
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