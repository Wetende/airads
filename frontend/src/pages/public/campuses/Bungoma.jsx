import MainNavbar from '../../components/common/MainNavbar';
import TopNavbar from '../../components/common/TopNavbar';
import Footer from '../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email } from '@mui/icons-material';

// PageLayout Component
const PageLayout = ({ children, title, subtitle, backgroundImage }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <TopNavbar />
      <MainNavbar />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          py: { xs: 12, md: 16 }, 
          px: 2, 
          overflow: 'hidden',
          background: backgroundImage 
            ? `linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%), url(${backgroundImage})` 
            : `linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mt: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: 'white', mb: 3, letterSpacing: '-0.02em', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 800, mx: 'auto', lineHeight: 1.8, fontWeight: 400 }}>
              {subtitle}
            </Typography>
          )}
        </Container>
        
        {/* Decorative Elements */}
        <Box sx={{ position: 'absolute', top: 80, left: 40, width: 128, height: 128, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <Box sx={{ position: 'absolute', bottom: 80, right: 40, width: 96, height: 96, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
      </Box>

      {/* Content */}
      <Box component="main" sx={{ position: 'relative', zIndex: 10, flexGrow: 1, mt: -6 }}>
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

// FeatureCard Component
const FeatureCard = ({ icon: Icon, title, description, className }) => {
  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 4, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ 
          width: 64, height: 64, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white',
          transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' }
        }}>
          <Icon fontSize="large" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e3a8a' }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{description}</Typography>
      </CardContent>
    </Card>
  );
};

// ContactCard Component
const ContactCard = ({ phone, whatsapp, email, address, className }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#1e3a8a' }}>Contact Information</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', flexShrink: 0 }}>
              <Phone />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Phone</Typography>
              <Typography component="a" href={`tel:${phone}`} variant="body1" sx={{ fontWeight: 500, color: '#1e3a8a', textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                {phone}
              </Typography>
            </Box>
          </Box>

          {whatsapp && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#22c55e', color: 'white', flexShrink: 0 }}>
                <WhatsApp />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>WhatsApp</Typography>
                <Typography component="a" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" variant="body1" sx={{ fontWeight: 500, color: '#22c55e', textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                  {whatsapp}
                </Typography>
              </Box>
            </Box>
          )}

          {email && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1e3a8a', color: 'white', flexShrink: 0 }}>
                <Email />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Email</Typography>
                <Typography component="a" href={`mailto:${email}`} variant="body1" sx={{ fontWeight: 500, color: '#1e3a8a', textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                  {email}
                </Typography>
              </Box>
            </Box>
          )}

          {address && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#64748b', color: 'white', flexShrink: 0 }}>
                <LocationOn />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e3a8a' }}>{address}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="contained"
            fullWidth
            sx={{ py: 1.5, background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          >
            Apply Now
          </Button>
          <Button 
            variant="outlined"
            fullWidth
            sx={{ py: 1.5, borderColor: '#1e3a8a', color: '#1e3a8a', borderRadius: 2, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#1e3a8a', color: 'white' } }}
          >
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Bungoma = () => {
  const features = [
    {
      icon: School,
      title: "Expert Faculty",
      description: "Qualified and experienced trainers dedicated to student success and practical learning."
    },
    {
      icon: Business,
      title: "Modern Facilities",
      description: "State-of-the-art workshops, laboratories, and equipment for hands-on training."
    },
    {
      icon: MenuBook,
      title: "Comprehensive Courses",
      description: "Wide range of TVET courses approved by TVETA and aligned with industry needs."
    },
    {
      icon: Wifi,
      title: "Digital Learning",
      description: "Free WiFi and computer access for research and modern learning approaches."
    }
  ];

  const courses = [
    "Diploma in Electrical/Electronic Engineering",
    "Certificate in Information Communication Technology", 
    "Artisan in Plumbing",
    "Certificate in Project Management",
    "Beauty and Cosmetology",
    "Short Courses & NITA Programs"
  ];

  return (
    <PageLayout
      title="AIRADS Bungoma Campus"
      subtitle="Strategic location in Bungoma with state-of-the-art equipment. Serving Western Kenya with quality technical education and vocational training."
    >
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Head title="Bungoma Campus - AIRADS College" />
        
        {/* Main Content Grid */}
        <Grid container spacing={6}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* About Section */}
              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1e3a8a' }}>About Bungoma Campus</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                  Located in the vibrant town of Bungoma, our campus serves as a beacon of technical education 
                  in Western Kenya. With over 18 years of consistent KNEC excellence, we continue to produce 
                  skilled graduates who contribute meaningfully to Kenya's workforce.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                  Our Bungoma campus is equipped with modern workshops, computer laboratories, and practical 
                  training facilities that ensure students gain hands-on experience in their chosen fields. 
                  We maintain our commitment to quality education with a 90-100% pass rate in national examinations.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  The campus serves students from Bungoma County and surrounding regions, offering flexible 
                  learning schedules and industry-relevant curricula that prepare graduates for immediate 
                  employment or entrepreneurship opportunities.
                </Typography>
              </Paper>

              {/* Features */}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center', color: '#1e3a8a' }}>Why Choose Bungoma Campus?</Typography>
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <FeatureCard {...feature} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Popular Courses */}
              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#1e3a8a' }}>Popular Courses</Typography>
                <Grid container spacing={2}>
                  {courses.map((course, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: '#f1f5f9' }}>
                        <EmojiEvents sx={{ color: '#1e3a8a' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e3a8a' }}>{course}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Success Stats */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>500+</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Graduates</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ bgcolor: '#22c55e', color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>95%</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Pass Rate</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ bgcolor: '#1e3a8a', color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>15+</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Programs</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Contact Sidebar */}
          <Grid item xs={12} lg={4}>
            <ContactCard
              phone="0715-771-316"
              whatsapp="0715-771-316"
              email="bungoma@airads.ac.ke"
              address="Bungoma Town, Western Kenya"
            />
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
};

export default Bungoma;