import MainNavbar from '../../../components/common/MainNavbar';
import TopNavbar from '../../../components/common/TopNavbar';
import Footer from '../../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email, Star, Lightbulb, People, Settings as Cog, Computer, Groups as Users, EmojiEvents as Trophy } from '@mui/icons-material';
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { Award, Badge, Briefcase, CardDescription, CardHeader, CardTitle, ChefHat, Clock, Mail, MapPin, Utensils } from "./schoolUi";

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

const SchoolOfHospitalityTourism = () => {
  const brand = usePublicBrand();

  const courses = [
    {
      title: "Diploma in Food and Beverage Production and Service",
      duration: "2 Years",
      level: "Diploma",
      description: "Comprehensive training in culinary arts, restaurant management, and beverage service.",
      modules: ["Culinary Arts", "Menu Planning", "Food Safety", "Restaurant Operations"]
    },
    {
      title: "Certificate in Hotel and Restaurant Management",
      duration: "1 Year",
      level: "Certificate",
      description: "Essential skills in hotel operations, guest services, and hospitality management.",
      modules: ["Front Office", "Housekeeping", "Customer Service", "Hotel Operations"]
    },
    {
      title: "Diploma in Travel and Tourism Management",
      duration: "2 Years",
      level: "Diploma",
      description: "Professional training in tourism operations, travel planning, and destination management.",
      modules: ["Tour Operations", "Travel Planning", "Cultural Tourism", "Hospitality Marketing"]
    },
    {
      title: "Certificate in Catering and Accommodation",
      duration: "1 Year",
      level: "Certificate",
      description: "Practical skills in commercial catering and accommodation services.",
      modules: ["Commercial Cooking", "Catering Management", "Accommodation Services", "Event Planning"]
    },
    {
      title: "Artisan in Food Production",
      duration: "6 Months",
      level: "Artisan",
      description: "Hands-on training in professional food preparation and production techniques.",
      modules: ["Basic Cooking", "Food Preparation", "Kitchen Safety", "Food Presentation"]
    },
    {
      title: "Short Course in Barista Training",
      duration: "1 Month",
      level: "Short Course",
      description: "Specialized training in coffee preparation and café operations.",
      modules: ["Coffee Knowledge", "Espresso Techniques", "Latte Art", "Customer Service"]
    }
  ];

  const facilities = [
    {
      icon: <ChefHat className="h-8 w-8 text-blue-600" />,
      title: "Professional Kitchen",
      description: "Fully equipped commercial kitchen with modern appliances and cooking stations"
    },
    {
      icon: <Utensils className="h-8 w-8 text-blue-600" />,
      title: "Restaurant Training Facility",
      description: "Mock restaurant setup for practical training in food service and hospitality"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Conference & Events Hall",
      description: "Multi-purpose hall for event management training and practical sessions"
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Tourism Resource Center",
      description: "Information hub with tourism materials, maps, and planning resources"
    }
  ];

  const careerOpportunities = [
    "Hotel Manager", "Restaurant Manager", "Tour Guide", "Event Coordinator",
    "Chef/Cook", "Front Office Supervisor", "Catering Manager", "Travel Consultant",
    "Food & Beverage Supervisor", "Housekeeping Manager", "Tourism Officer", "Hospitality Trainer"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="School of Hospitality & Tourism - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="mt-24 relative text-white py-20" style={{ backgroundColor: brand.secondary }}>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              School of Hospitality & Tourism Management
            </h1>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Excellence in Hospitality Education - Shaping Future Leaders in Tourism & Service Industry
            </Typography>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                <Phone className="mr-2 h-5 w-5" />
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 transition-colors">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">About Our School</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              The School of Hospitality and Tourism Management at AIRADS College is dedicated to preparing students 
              for successful careers in Kenya's growing hospitality and tourism sector. Our comprehensive programs 
              combine theoretical knowledge with practical skills, ensuring graduates are industry-ready.
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-gray-900">Industry Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Courses approved by KNEC and recognized by leading hospitality employers across Kenya
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-gray-900">Practical Training</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Hands-on experience in our state-of-the-art facilities and industry attachments
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-gray-900">Employment Success</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  95% of our graduates secure employment within 6 months of completion
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16" style={{ backgroundColor: brand.softBlue }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Courses</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Choose from our comprehensive range of hospitality and tourism programs designed to meet industry demands
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="h-full shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">{course.level}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{course.title}</CardTitle>
                  <CardDescription className="text-gray-600">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Key Modules:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.modules.map((module, idx) => (
                        <Badge key={idx} className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">World-Class Facilities</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Our modern facilities provide the perfect environment for practical learning and skill development
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">{facility.icon}</div>
                  <CardTitle className="text-lg text-gray-900">{facility.title}</CardTitle>
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
      <section className="py-16" style={{ backgroundColor: brand.softBlue }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Career Opportunities</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Our graduates excel in various roles across the hospitality and tourism industry
            </Typography>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {careerOpportunities.map((career, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <School className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{career}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Apply Section */}
      <section className="py-16 text-white" style={{ backgroundColor: brand.secondary }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Hospitality Career?</h2>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
            Join AIRADS College School of Hospitality and Tourism Management and become part of Kenya's premier hospitality professionals
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
              Apply Online Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 transition-colors">
              Download Brochure
            </Button>
          </div>
          <div className="mt-8 text-white/80">
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>Call us: +254 723 555 999 | Email: hospitality@airads.ac.ke</Typography>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SchoolOfHospitalityTourism;
