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

const SchoolOfHealthSocial = () => {
  const courses = [
    {
      title: "Diploma in Community Health and Development",
      duration: "2 Years",
      level: "Diploma",
      description: "Comprehensive training in community health promotion, disease prevention, and health education.",
      modules: ["Public Health", "Health Promotion", "Epidemiology", "Community Development"]
    },
    {
      title: "Certificate in Health Records and Information Technology",
      duration: "1 Year",
      level: "Certificate",
      description: "Training in medical records management, health information systems, and data management.",
      modules: ["Medical Records", "Health Information Systems", "Data Management", "Medical Coding"]
    },
    {
      title: "Diploma in Social Work and Community Development",
      duration: "2 Years",
      level: "Diploma",
      description: "Professional training in social work practice, counseling, and community development.",
      modules: ["Social Work Practice", "Counseling Skills", "Community Mobilization", "Human Rights"]
    },
    {
      title: "Certificate in Nutrition and Dietetics",
      duration: "1 Year",
      level: "Certificate",
      description: "Essential knowledge in nutrition science, meal planning, and dietary counseling.",
      modules: ["Nutrition Science", "Meal Planning", "Dietary Counseling", "Food Safety"]
    },
    {
      title: "Certificate in Pharmaceutical Technology",
      duration: "1 Year",
      level: "Certificate",
      description: "Training in pharmaceutical operations, drug dispensing, and pharmacy management.",
      modules: ["Pharmacy Operations", "Drug Knowledge", "Dispensing Practices", "Inventory Management"]
    },
    {
      title: "Diploma in Environmental Health",
      duration: "2 Years",
      level: "Diploma",
      description: "Specialized training in environmental health monitoring, sanitation, and pollution control.",
      modules: ["Environmental Monitoring", "Water Quality", "Waste Management", "Health Inspection"]
    }
  ];

  const facilities = [
    {
      icon: <Stethoscope className="h-8 w-8 text-primary" />,
      title: "Health Sciences Laboratory",
      description: "Fully equipped laboratory for practical training in health sciences and medical procedures"
    },
    {
      icon: <MenuBook className="h-8 w-8 text-primary" />,
      title: "Health Information Center",
      description: "Comprehensive library with medical journals, health publications, and research materials"
    },
    {
      icon: <Users2 className="h-8 w-8 text-primary" />,
      title: "Community Outreach Clinic",
      description: "On-campus clinic for practical training and community health services"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Simulation Training Rooms",
      description: "Mock healthcare environments for practical skills development and assessment"
    }
  ];

  const careerOpportunities = [
    "Community Health Officer", "Health Records Officer", "Social Worker", "Nutritionist",
    "Public Health Inspector", "Health Educator", "Medical Records Clerk", "Pharmacy Technician",
    "Environmental Health Officer", "Community Development Officer", "Health Information Analyst", "Research Assistant"
  ];

  return (
    <div className="min-h-screen bg-background">
       <Head title="School of Health & Social Sciences - AIRADS College" />
       <TopNavbar /> 
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="mt-24 relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              School of Health & Social Sciences
            </h1>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Empowering Communities Through Health Education - Business Tomorrow's Healthcare Professionals
            </Typography>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-emerald-600">
                <Phone className="mr-2 h-5 w-5" />
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                <Mail className="mr-2 h-5 w-5" />
                Get Information
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* School Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Our School</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              The School of Health and Social Sciences at AIRADS College is committed to training competent health 
              professionals and social workers who will serve communities with dedication and expertise. Our programs 
              focus on preventive healthcare, community development, and social welfare.
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Training health professionals who make a real difference in community health and wellbeing
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Activity className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Practical Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Hands-on training through community outreach programs and healthcare attachments
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Professional Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Courses recognized by health regulatory bodies and leading healthcare institutions
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Programs</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Comprehensive health and social sciences programs designed to address community health needs
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{course.level}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Modules:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.modules.map((module, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Facilities</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Modern facilities designed to provide comprehensive health sciences education
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{facility.icon}</div>
                  <CardTitle className="text-lg">{facility.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>{facility.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Career Opportunities</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Our graduates serve in various healthcare and social service roles across Kenya
            </Typography>
          </Box>
</Grid>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {careerOpportunities.map((career, index) => (
                <div key={index} className="flex items-center p-3 bg-background rounded-lg shadow-sm">
                  <School className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{career}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Apply Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Make a Difference in Community Health</h2>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
            Join AIRADS College School of Health and Social Sciences and contribute to building healthier communities across Kenya
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Apply Online Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
              Download Brochure
            </Button>
          </div>
          <div className="mt-8 text-white/80">
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>Call us: +254 723 555 999 | Email: health@airads.ac.ke</Typography>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SchoolOfHealthSocial;