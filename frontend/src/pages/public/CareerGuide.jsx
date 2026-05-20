import React, { useState } from "react";
import { 
  Box, Container, Typography, Grid, Paper, Card, CardContent, CardHeader, 
  Chip, Button, Tabs, Tab, LinearProgress, Avatar
} from "@mui/material";
import { 
  MenuBook, People, TrendingUp, EmojiEvents, Work, 
  TrackChanges, School, Download, OpenInNew, ChevronRight, 
  Business, AccessTime, LocationOn 
} from "@mui/icons-material";
import { Head } from "@inertiajs/react";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const CareerGuide = () => {
  const brand = usePublicBrand();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const stats = [
    { number: "13+", label: "Years of Excellence", icon: <EmojiEvents fontSize="large" /> },
    { number: "90-100%", label: "KNEC Pass Rate", icon: <TrendingUp fontSize="large" /> },
    { number: "6", label: "Campuses Nationwide", icon: <Business fontSize="large" /> },
    { number: "1000+", label: "Graduates Employed", icon: <People fontSize="large" /> }
  ];

  const careerPaths = [
    {
      category: "Engineering & ICT",
      description: "High-demand technical careers in the digital age",
      careers: [
        {
          title: "Electrical Engineer",
          demand: "Very High",
          salary: "Kshs 45,000 - 120,000",
          description: "Design and maintain electrical systems for buildings, power plants, and industrial facilities."
        },
        {
          title: "Software Developer",
          demand: "Extremely High", 
          salary: "Kshs 50,000 - 150,000",
          description: "Create applications, websites, and software solutions for businesses and organizations."
        },
        {
          title: "Network Administrator",
          demand: "High",
          salary: "Kshs 35,000 - 80,000",
          description: "Manage and maintain computer networks for organizations and businesses."
        }
      ]
    },
    {
      category: "Hospitality & Tourism",
      description: "Exciting opportunities in Kenya's growing tourism sector",
      careers: [
        {
          title: "Hotel Manager",
          demand: "High",
          salary: "Kshs 40,000 - 100,000",
          description: "Oversee daily operations of hotels and hospitality establishments."
        },
        {
          title: "Tour Guide",
          demand: "High",
          salary: "Kshs 25,000 - 60,000",
          description: "Lead tourists through Kenya's beautiful attractions and cultural sites."
        },
        {
          title: "Food & Beverage Manager",
          demand: "Medium",
          salary: "Kshs 30,000 - 75,000",
          description: "Manage restaurant operations and ensure excellent customer service."
        }
      ]
    },
    {
      category: "Health & Social Sciences",
      description: "Make a difference in people's lives and communities",
      careers: [
        {
          title: "Community Health Worker",
          demand: "Very High",
          salary: "Kshs 25,000 - 50,000",
          description: "Provide basic healthcare services and health education in communities."
        },
        {
          title: "Social Worker",
          demand: "High",
          salary: "Kshs 30,000 - 65,000",
          description: "Support individuals and families facing social challenges."
        },
        {
          title: "Nutritionist",
          demand: "Medium",
          salary: "Kshs 35,000 - 70,000",
          description: "Provide dietary advice and create nutrition programs for optimal health."
        }
      ]
    },
    {
      category: "Beauty & Hairdressing",
      description: "Creative careers in the growing beauty industry",
      careers: [
        {
          title: "Salon Owner/Manager",
          demand: "High",
          salary: "Kshs 30,000 - 80,000",
          description: "Run your own beauty salon or manage existing establishments."
        },
        {
          title: "Professional Beautician",
          demand: "High",
          salary: "Kshs 20,000 - 50,000",
          description: "Provide beauty treatments and cosmetic services to clients."
        },
        {
          title: "Hair Stylist",
          demand: "Medium",
          salary: "Kshs 18,000 - 45,000",
          description: "Create beautiful hairstyles and provide hair care services."
        }
      ]
    },
    {
      category: "Media & Journalism",
      description: "Tell stories and shape public opinion in the digital age",
      careers: [
        {
          title: "News Reporter",
          demand: "Medium",
          salary: "Kshs 25,000 - 60,000",
          description: "Research and report news stories for television, radio, or online media."
        },
        {
          title: "Video Editor",
          demand: "High",
          salary: "Kshs 30,000 - 70,000",
          description: "Edit video content for films, TV shows, documentaries, and online content."
        },
        {
          title: "Radio Presenter",
          demand: "Medium",
          salary: "Kshs 20,000 - 55,000",
          description: "Host radio shows and engage audiences through entertaining broadcasts."
        }
      ]
    },
    {
      category: "Business & Management",
      description: "Lead organizations and drive business success",
      careers: [
        {
          title: "Business Manager",
          demand: "High",
          salary: "Kshs 40,000 - 100,000",
          description: "Oversee business operations and drive organizational growth."
        },
        {
          title: "Marketing Specialist",
          demand: "High",
          salary: "Kshs 35,000 - 85,000",
          description: "Develop and implement marketing strategies to promote products and services."
        },
        {
          title: "HR Coordinator",
          demand: "Medium",
          salary: "Kshs 30,000 - 70,000",
          description: "Manage human resources functions and support employee development."
        }
      ]
    }
  ];

  const employmentOpportunities = [
    {
      sector: "Private Companies",
      percentage: 60,
      description: "Work in established businesses across various industries"
    },
    {
      sector: "Self Employment", 
      percentage: 25,
      description: "Start your own business or practice as an independent professional"
    },
    {
      sector: "Government Agencies",
      percentage: 10,
      description: "Serve in various government departments and ministries"
    },
    {
      sector: "NGOs & International Organizations",
      percentage: 5,
      description: "Work with non-profit organizations and international bodies"
    }
  ];

  const successStories = [
    {
      name: "Jane Wanjiku",
      course: "ICT (2019)",
      position: "Software Developer at Safaricom",
      story: "AIRADS gave me the technical foundation I needed. Now I'm developing mobile apps used by millions of Kenyans.",
      image: "JW"
    },
    {
      name: "David Kiplagat",
      course: "Hospitality Management (2020)",
      position: "Hotel Manager at Sarova Hotels",
      story: "The practical training at AIRADS prepared me for real-world challenges in the hospitality industry.",
      image: "DK"
    },
    {
      name: "Grace Akinyi",
      course: "Beauty Therapy (2021)",
      position: "Salon Owner (3 Locations)",
      story: "I started with one small salon. AIRADS taught me both the skills and business knowledge to expand.",
      image: "GA"
    }
  ];

  const getDemandColor = (demand) => {
    switch(demand) {
      case "Extremely High": return "#22c55e";
      case "Very High": return "#4ade80";
      case "High": return "#3b82f6";
      case "Medium": return "#eab308";
      default: return "#6b7280";
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Head title="Career Guide - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ pt: { xs: 15, md: 20 }, pb: { xs: 8, md: 10 }, position: 'relative', overflow: 'hidden', bgcolor: brand.softBlue }}>
          <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <Chip 
              label="Your Future Starts Here" 
              sx={{ mb: 4, px: 2, py: 2.5, fontSize: '1.1rem', fontWeight: 'bold', bgcolor: brand.primary, color: 'white', border: 'none' }}
            />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, color: brand.secondary, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Career Guide & Prospectus
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 300 }}>
              Discover exciting career opportunities and chart your path to success with AIRADS College
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 3 }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<Download />}
                href="https://airads.ac.ke/bronchure/UNIVERSAL%20BROCHURE-compressed.pdf"
                target="_blank"
                sx={{ py: 2, px: 4, borderRadius: 2, bgcolor: brand.primary, fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Download Complete Prospectus
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<OpenInNew />}
                href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded"
                target="_blank"
                sx={{ py: 2, px: 4, borderRadius: 2, borderColor: brand.accent, color: brand.accent, fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: brand.accent, color: 'white' } }}
              >
                Apply Online Now
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Statistics Section */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                Our Track Record of Excellence
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.primary, mx: 'auto', borderRadius: 2 }} />
            </Box>
            
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ textAlign: 'center', border: 'none', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ color: brand.primary, mb: 2, display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: brand.softBlue }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: brand.primary, mb: 1 }}>{stat.number}</Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Career Paths Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                Explore Career Paths
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3, fontWeight: 400 }}>
                Discover the exciting career opportunities available to our graduates
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.primary, mx: 'auto', borderRadius: 2 }} />
            </Box>

            <Box sx={{ mb: 4, bgcolor: brand.softBlue, borderRadius: 2, p: 1 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable" 
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold', borderRadius: 1, minHeight: 48, px: 3, color: 'text.secondary' },
                  '& .Mui-selected': { bgcolor: brand.primary, color: 'white !important', boxShadow: 2 }
                }}
              >
                {careerPaths.map((path, index) => (
                  <Tab key={index} label={path.category} />
                ))}
              </Tabs>
            </Box>

            {careerPaths.map((path, index) => (
              <Box key={index} role="tabpanel" hidden={tabValue !== index} sx={{ mt: 4 }}>
                {tabValue === index && (
                  <Box>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{path.category}</Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>{path.description}</Typography>
                    </Box>
                    <Grid container spacing={4}>
                      {path.careers.map((career, idx) => (
                        <Grid key={idx} size={{ xs: 12, md: 4 }}>
                          <Card sx={{ height: '100%', border: 'none', boxShadow: 2, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }, bgcolor: 'white' }}>
                            <CardHeader 
                              sx={{ pb: 1 }}
                              title={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', mr: 1 }}>{career.title}</Typography>
                                  <Chip 
                                    label={career.demand} 
                                    size="small" 
                                    sx={{ bgcolor: getDemandColor(career.demand), color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }} 
                                  />
                                </Box>
                              }
                              subheader={
                                <Box sx={{ display: 'flex', alignItems: 'center', color: brand.primary, mt: 1 }}>
                                  <Work fontSize="small" sx={{ mr: 1 }} />
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{career.salary}</Typography>
                                </Box>
                              }
                            />
                            <CardContent>
                              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 3 }}>
                                {career.description}
                              </Typography>
                              <Button 
                                variant="outlined" 
                                fullWidth 
                                endIcon={<ChevronRight />}
                                href="/schools"
                                sx={{ borderColor: brand.primary, color: brand.primary, '&:hover': { bgcolor: brand.primary, color: 'white' } }}
                              >
                                Learn More
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            ))}
          </Container>
        </Box>

        {/* Employment Opportunities */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                Employment Opportunities
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3, fontWeight: 400 }}>
                Where our graduates find employment after completion
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.primary, mx: 'auto', borderRadius: 2 }} />
            </Box>

            <Grid container spacing={8} alignItems="center">
              <Grid size={{ xs: 12, lg: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6 }}>Employment Distribution</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {employmentOpportunities.map((opportunity, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{opportunity.sector}</Typography>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{opportunity.percentage}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={opportunity.percentage} 
                        sx={{ 
                          height: 12, 
                          borderRadius: 6, 
                          bgcolor: 'grey.200', 
                          '& .MuiLinearProgress-bar': { bgcolor: brand.primary, borderRadius: 6 }
                        }} 
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>{opportunity.description}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ border: 'none', bgcolor: 'white', boxShadow: 4, borderRadius: 4 }}>
                  <CardHeader 
                    sx={{ bgcolor: brand.primary, color: 'white', p: 3 }}
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrackChanges sx={{ mr: 2, fontSize: '2rem' }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>High Employability Rate</Typography>
                      </Box>
                    }
                  />
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Typography variant="h1" sx={{ fontWeight: 900, color: brand.primary, mb: 1 }}>95%</Typography>
                      <Typography variant="h6" sx={{ color: 'text.secondary' }}>of our graduates find employment within 6 months</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: brand.softBlue, borderRadius: 2 }}>
                        <AccessTime sx={{ color: brand.primary, mr: 2 }} />
                        <Typography variant="body1">Average job placement: 3-4 months</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: brand.softBlue, borderRadius: 2 }}>
                        <EmojiEvents sx={{ color: brand.primary, mr: 2 }} />
                        <Typography variant="body1">Industry partnerships for internships</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: brand.softBlue, borderRadius: 2 }}>
                        <People sx={{ color: brand.primary, mr: 2 }} />
                        <Typography variant="body1">Career counseling & job placement support</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Success Stories */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                Success Stories
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3, fontWeight: 400 }}>
                Real stories from our successful graduates
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.primary, mx: 'auto', borderRadius: 2 }} />
            </Box>

            <Grid container spacing={4}>
              {successStories.map((story, index) => (
                <Grid key={index} size={{ xs: 12, md: 4 }}>
                  <Card sx={{ height: '100%', border: 'none', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 }, display: 'flex', flexDirection: 'column' }}>
                    <CardHeader 
                      sx={{ textAlign: 'center', bgcolor: brand.softBlue, pb: 3 }}
                      title={
                        <Box>
                          <Avatar
                            sx={{
                              width: 72,
                              height: 72,
                              mx: 'auto',
                              mb: 2,
                              bgcolor: brand.primary,
                              fontSize: '1.75rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {story.image}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{story.name}</Typography>
                        </Box>
                      }
                      subheader={
                        <Chip label={story.course} size="small" sx={{ mt: 1, bgcolor: brand.softBlue, color: brand.primary, fontWeight: 'bold' }} />
                      }
                    />
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: brand.primary, mb: 2 }}>{story.position}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.8 }}>
                        "{story.story}"
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Call to Action */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: brand.secondary, color: 'white' }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 3 }}>
              Ready to Start Your Career Journey?
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, fontWeight: 300, opacity: 0.9, lineHeight: 1.6 }}>
              Join thousands of successful professionals who started their careers at AIRADS College. 
              Your future in the industry begins with the right education.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 3 }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<School />}
                href="/schools"
                sx={{ bgcolor: 'white', color: brand.primary, fontWeight: 'bold', '&:hover': { bgcolor: '#f1f5f9' }, py: 1.5, px: 4 }}
              >
                Explore Our Courses
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<Download />}
                href="https://airads.ac.ke/bronchure/UNIVERSAL%20BROCHURE-compressed.pdf"
                target="_blank"
                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', fontWeight: 'bold', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }, py: 1.5, px: 4 }}
              >
                Download Full Prospectus
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default CareerGuide;
