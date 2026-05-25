import React from "react";
import { Head } from "@inertiajs/react";
import { 
  Box, Container, Typography, Grid, Paper, Card, CardContent, CardHeader, 
  Chip, Button, List, ListItem, ListItemIcon, ListItemText 
} from "@mui/material";
import { 
  School, LocationOn, Phone, Language, CheckCircle, 
  Event, WhatsApp, Facebook 
} from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const ApplicationProcedure = () => {
  const brand = usePublicBrand();

  const campuses = [
    "ELDORET", "NAKURU", "KERICHO", "KISUMU", "BUNGOMA", "MARALAL", "LODWAR"
  ];

  const whyChooseUs = [
    "Technical Education for gainful and Self employment",
    "All our campuses are Accredited by Ministry of Education – TVETA",
    "Adequate learning well-furnished resources for practical training",
    "Excellent KNEC pass rate (90-100%) for the last 13 years consistently",
    "Qualified and Experienced Lecturers, Trainers and Instructors",
    "Serene Learning Environment",
    "Free WIFI-Internet for Research and Learning",
    "Industrial attachments and High Employability – Job Placements"
  ];

  const schools = [
    {
      title: "SCHOOL OF ELECTRICAL ENGINEERING AND ICT",
      courses: [
        "Electrical and Electronics Engineering (Power Option)",
        "Electrical Installation",
        "Welding and Fabrication",
        "Plumbing",
        "Information Communication Technology (ICT)",
        "Networking",
        "Computer Software Programming"
      ]
    },
    {
      title: "SCHOOL OF HOSPITALITY AND TOURISM MANAGEMENT",
      courses: [
        "Food and Beverage Production",
        "Food and Beverage Service",
        "Hotel and Catering Accommodation",
        "Housekeeping and Laundry Services",
        "Bakery Technology",
        "Tourism Management",
        "Tour Guiding and Operations"
      ]
    },
    {
      title: "SCHOOL OF HEALTH AND SOCIAL SCIENCES",
      courses: [
        "Nutrition and Dietetics Management",
        "Social Work",
        "Community Development",
        "HIV Testing and Management",
        "Disaster Management",
        "Health Records with IT",
        "Community Health and Development"
      ]
    },
    {
      title: "SCHOOL OF BEAUTY AND HAIRDRESSING",
      courses: [
        "Hairdressing and Plaiting",
        "Beauty Therapy",
        "Cosmetology (Beauty Therapy and Hairdressing)",
        "Barbering",
        "Nail Technology",
        "Massage/Reflexology",
        "Lash Tinting & Perming technology"
      ]
    },
    {
      title: "SCHOOL OF JOURNALISM AND MEDIA STUDIES",
      courses: [
        "Journalism",
        "Mass Media and Communication",
        "Radio Production and Broadcasting",
        "TV Production and Broadcasting",
        "Video Editing"
      ]
    },
    {
      title: "SCHOOL OF BUSINESS AND MANAGEMENT STUDIES",
      courses: [
        "Business Management",
        "Entrepreneurship development",
        "Human Resource Management",
        "Supply Chain Management",
        "Cooperative Management",
        "Sales & Marketing",
        "Banking and Finance"
      ]
    }
  ];

  const computerPackages = [
    "Introduction to computers", "Keyboarding", "Microsoft Windows /operating system",
    "Word processing using MS word", "Spreadsheet using MS Excel", "Database Management using MS Access",
    "Digital Presentation using MS PowerPoint", "Internet and Email", "Introduction to graphic design",
    "Social Media & Digital Skills", "Software Installation", "Computer & Maintenance",
    "Document Formatting and printing skills", "PC troubleshooting"
  ];

  const contactMethods = [
    { campus: "ELDORET", phone: "0715696979" },
    { campus: "NAKURU", phone: "0711488302" },
    { campus: "KERICHO", phone: "0729976885" },
    { campus: "KISUMU", phone: "0715057262" },
    { campus: "BUNGOMA", phone: "0715771316" },
    { campus: "MARALAL", phone: "0717885888" },
    { campus: "LODWAR", phone: "071981845" }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Head title="Application Procedure - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ pt: { xs: 15, md: 20 }, pb: { xs: 8, md: 12 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Chip 
              label="MAY/JUNE INTAKE NOW OPEN" 
              sx={{ mb: 4, px: 2, py: 3, fontSize: '1.1rem', fontWeight: 'bold', bgcolor: brand.accent, color: 'white', border: 'none' }}
            />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, color: brand.secondary, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              AFRICAN INSTITUTE OF RESEARCH<br />
              AND DEVELOPMENT STUDIES
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, color: brand.mutedText, maxWidth: 800, mx: 'auto', fontWeight: 300 }}>
              The Best TVET College in Kenya - A Centre of Excellence Where Quality is Nurtured
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 8 }}>
              {campuses.map((campus) => (
                <Chip 
                  key={campus} 
                  label={`${campus} CAMPUS`} 
                  sx={{ bgcolor: brand.softBlue, color: brand.secondary, fontWeight: 'bold', border: `1px solid ${brand.borderBlue}` }}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 3 }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<Language />}
                href="/admissions/apply/" 
                sx={{ py: 2, px: 4, borderRadius: 2, bgcolor: brand.accent, fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: brand.accentHover } }}
              >
                Apply Online Now
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<Phone />}
                href="https://wa.me/254723555999" 
                target="_blank"
                sx={{ py: 2, px: 4, borderRadius: 2, borderColor: brand.accent, color: brand.accent, fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: brand.accent, color: 'white' } }}
              >
                Contact Admissions
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Why Choose AIRADS */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.neutralText }}>
                Why AIRADS College is the Best!
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.accent, mx: 'auto', borderRadius: 2 }} />
            </Box>
            
            <Grid container spacing={4}>
              {whyChooseUs.map((reason, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ height: '100%', borderLeft: `4px solid ${brand.secondary}`, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 3 }}>
                      <CheckCircle sx={{ color: brand.secondary, mr: 2, mt: 0.5 }} />
                      <Typography variant="body2" sx={{ color: brand.mutedText, lineHeight: 1.6 }}>
                        {reason}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Schools and Courses */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.neutralText }}>
                Our Schools & Programs
              </Typography>
              <Typography variant="h6" sx={{ color: brand.mutedText, mb: 3, fontWeight: 400 }}>
                We offer Artisan, Certificate and Diploma courses in 6 major schools
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.accent, mx: 'auto', borderRadius: 2 }} />
            </Box>
            
            <Grid container spacing={4}>
              {schools.map((school, index) => (
                <Grid key={index} size={{ xs: 12, md: 6 }}>
                  <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)', boxShadow: 6 } }}>
                    <CardHeader 
                      sx={{ bgcolor: brand.secondary, color: 'white', py: 2 }}
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <School sx={{ mr: 2 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{school.title}</Typography>
                        </Box>
                      }
                    />
                    <CardContent sx={{ p: 3 }}>
                      <List dense disablePadding>
                        {school.courses.map((course, idx) => (
                          <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: brand.accent }} />
                            </ListItemIcon>
                            <ListItemText primary={course} sx={{ '& .MuiListItemText-primary': { color: brand.mutedText } }} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Computer Packages */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 3, color: brand.neutralText }}>
                Computer Application Packages
              </Typography>
              <Chip 
                label="Certificate in Computer Applications Awarded" 
                sx={{ px: 2, py: 2.5, fontSize: '1rem', fontWeight: 'bold', bgcolor: brand.accent, color: 'white' }}
              />
            </Box>
            
            <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, maxWidth: 900, mx: 'auto', boxShadow: 3 }}>
              <Grid container spacing={2}>
                {computerPackages.map((pkg, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 2, '&:hover': { bgcolor: brand.softBlue }, transition: 'background-color 0.2s' }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: brand.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', mr: 2, flexShrink: 0 }}>
                        {index + 1}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{pkg}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 5, p: 3, bgcolor: brand.softBlue, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: brand.mutedText, lineHeight: 1.8 }}>
                  <Box component="span" sx={{ fontWeight: 'bold', color: brand.neutralText }}>Duration:</Box> 1-2 months depending on number of hours you attend class per day<br />
                  <Box component="span" sx={{ fontWeight: 'bold', color: brand.neutralText }}>Schedule:</Box> Part-time, Evening and Saturday classes Available<br />
                  <Box component="span" sx={{ fontWeight: 'bold', color: brand.neutralText }}>New classes commence:</Box> Every Week on Monday and Tuesday
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Box>

        {/* How to Apply */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.neutralText, textTransform: 'uppercase' }}>
                How to Apply or Register
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.accent, mx: 'auto', borderRadius: 2 }} />
            </Box>
            
            <Grid container spacing={6}>
              {/* Contact Methods */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ height: '100%', boxShadow: 4, borderRadius: 3 }}>
                  <CardHeader 
                    sx={{ bgcolor: brand.secondary, color: 'white', py: 2 }}
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ mr: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Campus Contact Numbers</Typography>
                      </Box>
                    }
                  />
                  <CardContent sx={{ p: 3 }}>
                    <List disablePadding>
                      {contactMethods.map((contact, index) => (
                        <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: brand.softBlue, mb: 1, borderRadius: 2, p: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: brand.secondary }}>{contact.campus} Campus</Typography>
                          <Typography variant="body2" sx={{ color: brand.mutedText, fontWeight: 500 }}>{contact.phone}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Application Methods */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card sx={{ height: '100%', boxShadow: 4, borderRadius: 3 }}>
                  <CardHeader 
                    sx={{ bgcolor: brand.accent, color: 'white', py: 2 }}
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Language sx={{ mr: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Application Methods</Typography>
                      </Box>
                    }
                  />
                  <CardContent sx={{ p: 3 }}>
                    <List disablePadding>
                      <ListItem sx={{ '&:hover': { bgcolor: brand.softBlue }, borderRadius: 2, mb: 1 }}>
                        <ListItemIcon><Language sx={{ color: brand.secondary }} /></ListItemIcon>
                        <ListItemText primary="Apply online at www.airads.ac.ke" />
                      </ListItem>
                      <ListItem sx={{ '&:hover': { bgcolor: brand.softBlue }, borderRadius: 2, mb: 1 }}>
                        <ListItemIcon><Facebook sx={{ color: brand.secondary }} /></ListItemIcon>
                        <ListItemText primary="Use Facebook inbox (Messenger)" />
                      </ListItem>
                      <ListItem sx={{ '&:hover': { bgcolor: brand.softBlue }, borderRadius: 2, mb: 1 }}>
                        <ListItemIcon><LocationOn sx={{ color: brand.secondary }} /></ListItemIcon>
                        <ListItemText primary="Visit any of our campus locations" />
                      </ListItem>
                      <ListItem sx={{ '&:hover': { bgcolor: brand.softBlue }, borderRadius: 2, mb: 1 }}>
                        <ListItemIcon><WhatsApp sx={{ color: brand.secondary }} /></ListItemIcon>
                        <ListItemText primary="Call/SMS/WhatsApp any campus" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* CTA Section */}
            <Box sx={{ mt: 10, textAlign: 'center' }}>
              <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, bgcolor: brand.accent, color: 'white', boxShadow: 6 }}>
                <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Ready to Start Your Journey?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 300, opacity: 0.9 }}>
                  Join thousands of successful graduates from AIRADS College
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    startIcon={<Event />}
                    href="/admissions/apply/" 
                    sx={{ bgcolor: 'white', color: brand.accent, fontWeight: 'bold', '&:hover': { bgcolor: '#f1f5f9' }, py: 1.5, px: 3 }}
                  >
                    Apply for May/June Intake
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    href="https://airads.ac.ke/bronchure/UNIVERSAL%20BROCHURE-compressed.pdf" 
                    target="_blank"
                    sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', fontWeight: 'bold', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }, py: 1.5, px: 3 }}
                  >
                    Download Application Forms
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ApplicationProcedure;
