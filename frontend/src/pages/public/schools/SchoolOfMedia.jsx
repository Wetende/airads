import MainNavbar from '../../../components/common/MainNavbar';
import TopNavbar from '../../../components/common/TopNavbar';
import Footer from '../../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email, Star, Lightbulb, People, Settings as Cog, Computer, Groups as Users, EmojiEvents as Trophy } from '@mui/icons-material';
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { Award, Badge, Camera, CardDescription, CardHeader, CardTitle, Clock, Film, Mail, Mic, Monitor, Radio, Tv } from "./schoolUi";

// PageLayout Component
const PageLayout = ({ children, title, subtitle, backgroundImage }) => {
  const brand = usePublicBrand();

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
          bgcolor: brand.secondary,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
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
  const brand = usePublicBrand();

  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 4, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ 
          width: 64, height: 64, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
          bgcolor: brand.secondary, color: 'white',
          transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' }
        }}>
          <Icon fontSize="large" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brand.secondary }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{description}</Typography>
      </CardContent>
    </Card>
  );
};

// ContactCard Component
const ContactCard = ({ phone, whatsapp, email, address, className }) => {
  const brand = usePublicBrand();

  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: brand.secondary }}>Contact Information</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: brand.secondary, color: 'white', flexShrink: 0 }}>
              <Phone />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Phone</Typography>
              <Typography component="a" href={`tel:${phone}`} variant="body1" sx={{ fontWeight: 500, color: brand.secondary, textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
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
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: brand.secondary, color: 'white', flexShrink: 0 }}>
                <Email />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Email</Typography>
                <Typography component="a" href={`mailto:${email}`} variant="body1" sx={{ fontWeight: 500, color: brand.secondary, textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
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
                <Typography variant="body1" sx={{ fontWeight: 500, color: brand.secondary }}>{address}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="contained"
            fullWidth
            sx={{ py: 1.5, bgcolor: brand.secondary, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          >
            Apply Now
          </Button>
          <Button 
            variant="outlined"
            fullWidth
            sx={{ py: 1.5, borderColor: brand.secondary, color: brand.secondary, borderRadius: 2, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: brand.secondary, color: 'white' } }}
          >
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const SchoolOfMedia = () => {
  const brand = usePublicBrand();

  const courses = [
    {
      title: "Diploma in Journalism and Mass Communication",
      duration: "2 Years",
      level: "Diploma",
      description: "Comprehensive training in journalism, broadcasting, and digital media communication.",
      modules: ["News Writing", "Broadcasting", "Media Ethics", "Digital Journalism"]
    },
    {
      title: "Certificate in Film and Video Production",
      duration: "1 Year",
      level: "Certificate",
      description: "Hands-on training in video production, editing, and cinematography.",
      modules: ["Video Production", "Film Editing", "Camera Operations", "Post-Production"]
    },
    {
      title: "Diploma in Radio and Television Production",
      duration: "2 Years",
      level: "Diploma",
      description: "Professional training in radio and TV production, presentation, and programming.",
      modules: ["Radio Production", "TV Production", "Presenting Skills", "Programme Planning"]
    },
    {
      title: "Certificate in Photography",
      duration: "6 Months",
      level: "Certificate",
      description: "Professional photography skills for commercial, portrait, and event photography.",
      modules: ["Digital Photography", "Studio Lighting", "Photo Editing", "Commercial Photography"]
    },
    {
      title: "Certificate in Graphic Design and Animation",
      duration: "1 Year",
      level: "Certificate",
      description: "Creative training in graphic design, animation, and digital content creation.",
      modules: ["Graphic Design", "2D Animation", "Digital Art", "Brand Design"]
    },
    {
      title: "Short Course in Social Media Management",
      duration: "3 Months",
      level: "Short Course",
      description: "Strategic training in social media marketing and content management.",
      modules: ["Social Media Strategy", "Content Creation", "Digital Marketing", "Analytics"]
    }
  ];

  const facilities = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "Photography Studio",
      description: "Professional photography studio with lighting equipment and backdrop systems"
    },
    {
      icon: <Film className="h-8 w-8 text-primary" />,
      title: "Video Production Suite",
      description: "State-of-the-art video production and editing facilities with latest equipment"
    },
    {
      icon: <Radio className="h-8 w-8 text-primary" />,
      title: "Radio Station",
      description: "Fully functional campus radio station for hands-on broadcasting experience"
    },
    {
      icon: <Monitor className="h-8 w-8 text-primary" />,
      title: "Digital Media Lab",
      description: "Computer lab equipped with industry-standard software for media production"
    }
  ];

  const careerOpportunities = [
    "Journalist", "TV/Radio Presenter", "Video Producer", "Photographer",
    "Graphic Designer", "Social Media Manager", "News Reporter", "Film Editor",
    "Broadcasting Technician", "Content Creator", "Media Consultant", "Animation Artist"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Head title="School of Media Studies - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="mt-24 relative text-white py-20" style={{ backgroundColor: brand.secondary }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              School of Media Studies
            </h1>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Shaping Media Excellence - Where Stories Come to Life and Creativity Meets Technology
            </Typography>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-blue-600">
                <Phone className="mr-2 h-5 w-5" />
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
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
              The School of Media Studies at AIRADS College prepares students for dynamic careers in the media industry. 
              Our programs combine theoretical knowledge with practical experience, ensuring graduates are ready to 
              excel in journalism, broadcasting, film production, and digital media.
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Tv className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Industry Relevance</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Curriculum designed with industry input to meet current media landscape demands
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Mic className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Practical Training</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Hands-on experience through campus radio, TV production, and media projects
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Professional Network</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Strong connections with media houses, production companies, and industry professionals
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
              Cutting-edge media programs that prepare students for the evolving digital media landscape
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Professional Facilities</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Industry-standard facilities that provide real-world media production experience
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
              Diverse career paths in the dynamic and growing media and entertainment industry
            </Typography>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {careerOpportunities.map((career, index) => (
                <div key={index} className="flex items-center p-3 bg-background rounded-lg shadow-sm">
                  <School className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{career}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Apply Section */}
      <section className="py-16 text-white" style={{ backgroundColor: brand.secondary }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Tell Your Story to the World</h2>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
            Join AIRADS College School of Media Studies and become part of Kenya's next generation of media professionals
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Apply Online Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Download Brochure
            </Button>
          </div>
          <div className="mt-8 text-white/80">
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>Call us: +254 723 555 999 | Email: media@airads.ac.ke</Typography>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SchoolOfMedia;
