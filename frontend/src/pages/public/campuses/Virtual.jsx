import MainNavbar from '../../components/common/MainNavbar';
import TopNavbar from '../../components/common/TopNavbar';
import Footer from '../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email, Star, Lightbulb, People, Cog, Computer, Users, Trophy } from '@mui/icons-material';

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

const Virtual = () => {
  const features = [
    {
      icon: Monitor,
      title: "Digital Learning Platform",
      description: "State-of-the-art online learning management system with interactive content and tools."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Learn at your own pace with 24/7 access to course materials and recorded lectures."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Access quality education from anywhere in the world with internet connectivity."
    },
    {
      icon: Users,
      title: "Virtual Community",
      description: "Interactive online community with peer collaboration and instructor support."
    }
  ];

  const programs = [
    "Certificate in Information Communication Technology",
    "Certificate in Project Management",
    "Diploma in Business Management",
    "Computer Packages Training",
    "Digital Marketing Fundamentals", 
    "Entrepreneurship and Innovation",
    "Data Analysis and Visualization",
    "Online Teaching and Learning",
    "E-commerce and Digital Business",
    "Cybersecurity Fundamentals"
  ];

  const platforms = [
    "Video Conferencing (Zoom, Google Meet)",
    "Learning Management System (LMS)",
    "Interactive Whiteboards",
    "Digital Libraries and Resources",
    "Online Assessment Tools",
    "Mobile Learning Apps"
  ];

  return (
    <PageLayout
      title="AIRADS Virtual Campus"
      subtitle="Breaking geographical barriers with quality online education. Learn from anywhere, anytime with our comprehensive virtual learning platform."
    >
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Head title="Virtual Campus - AIRADS College" />
        <Grid container spacing={6}>
          <Grid item xs={12} lg={8}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About Virtual Campus</h2>
                
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                    Our Virtual Campus represents AIRADS College's commitment to making quality technical education 
                    accessible to everyone, regardless of location. Through innovative online learning technologies, 
                    we deliver the same high-quality education that has made AIRADS a leader in technical training.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                    The virtual campus leverages cutting-edge digital tools and platforms to create engaging, 
                    interactive learning experiences. Students benefit from live online classes, recorded lectures, 
                    digital resources, and real-time interaction with instructors and fellow students.
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    Whether you're a working professional seeking to upgrade your skills, a parent managing family 
                    responsibilities, or someone in a remote location, our virtual campus brings quality education 
                    directly to you.
                  </Typography>
                </Box>
</Grid>
              </Paper>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Virtual Learning Advantages</h2>
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}><FeatureCard {...feature} /></Grid>
                ))}
              </Grid>
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Online Programs Available</h2>
                <Grid container spacing={2}>
                  {programs.map((program, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <MenuBook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">{program}</span>
                    </div>
                  ))}
                </Grid>
              </Paper>

            <Grid container spacing={4}>
              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Platforms</h3>
                  <div className="space-y-3">
                    {platforms.map((platform, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Wifi className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-gray-600">{platform}</span>
                      </div>
                    ))}
                  </Grid>
                
              </Paper>

              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Student Support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-600">24/7 Technical Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-600">Online Tutoring</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MenuBook className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-600">Digital Library Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-600">Career Guidance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-600">Progress Tracking</span>
                    </div>
                  </div>
                
              </Paper>
            </div>

            <Grid container spacing={3}>
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl border-0">
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>1000+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Online Students</Typography>
                
              </CardContent>
</Card>
</Grid>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-0">
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>94%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Completion Rate</Typography>
                
              </CardContent>
</Card>
</Grid>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg border-0">
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>15+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Online Programs</Typography>
                
              </CardContent>
</Card>
</Grid>
</Grid>
          </Box></Grid>
<Grid item xs={12} lg={4}>
<ContactCard
              phone="0723-555-999"
              whatsapp="0723-555-999"
              email="virtual@airads.ac.ke"
              address="Online Platform - Accessible Worldwide"
            />
          </Grid>
</Grid>
</Container>
</PageLayout>
  );
};

export default Virtual;