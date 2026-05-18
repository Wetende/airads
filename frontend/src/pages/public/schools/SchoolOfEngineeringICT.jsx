import MainNavbar from '../../../components/common/MainNavbar';
import TopNavbar from '../../../components/common/TopNavbar';
import Footer from '../../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email, Star, Lightbulb, People, Settings as Cog, Computer, Groups as Users, EmojiEvents as Trophy } from '@mui/icons-material';
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { Award, Wrench, Zap } from "./schoolUi";

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

const SchoolOfEngineeringICT = () => {
  const brand = usePublicBrand();

  const courses = [
    {
      title: "Diploma in Electrical/Electronic Engineering (KNEC)",
      duration: "2 Years",
      type: "Diploma",
      description: "Comprehensive knowledge in electrical and electronic systems with practical applications."
    },
    {
      title: "Diploma in Information Communication Technology",
      duration: "2 Years", 
      type: "Diploma",
      description: "Modern ICT skills and applications for the digital age."
    },
    {
      title: "Certificate in Information Communication Technology",
      duration: "1 Year",
      type: "Certificate",
      description: "Foundational ICT skills for beginners in technology."
    },
    {
      title: "Diploma in Land Mapping and Survey",
      duration: "2 Years",
      type: "Diploma", 
      description: "Comprehensive surveying techniques and mapping technologies."
    },
    {
      title: "Certificate in Land Mapping and Survey",
      duration: "1 Year",
      type: "Certificate",
      description: "Foundational skills in surveying and mapping techniques."
    },
    {
      title: "Certificate in Electrical Installation",
      duration: "6 Months",
      type: "Certificate",
      description: "Practical skills in electrical systems installation and maintenance."
    },
    {
      title: "Certificate in Plumbing (KNEC)",
      duration: "6 Months",
      type: "Certificate",
      description: "Water supply and sanitation systems expertise."
    },
    {
      title: "Artisan in Electrical and Electronic Technology (KNEC)",
      duration: "3 Years",
      type: "Artisan",
      description: "Hands-on technical skills in electrical and electronics."
    },
    {
      title: "Artisan in Plumbing (KNEC)",
      duration: "3 Years",
      type: "Artisan",
      description: "Practical plumbing skills and water systems management."
    },
    {
      title: "Artisan in Electrical Installation (KNEC)",
      duration: "3 Years",
      type: "Artisan",
      description: "Comprehensive electrical installation and maintenance skills."
    }
  ];

  const facilities = [
    "Modern Computer Labs with Latest Software",
    "Electrical Workshop with Industry-Standard Equipment",
    "Electronics Laboratory",
    "Surveying Equipment and Tools",
    "CAD/CAM Software Suite",
    "High-Speed Internet Connectivity",
    "Project Development Center",
    "Technical Library"
  ];

  const careerOpportunities = [
    "Electrical Engineer",
    "ICT Specialist", 
    "Network Administrator",
    "Land Surveyor",
    "Electronics Technician",
    "Systems Analyst",
    "Project Manager",
    "Technical Consultant",
    "Electrical Contractor",
    "Software Developer"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="School of Engineering & ICT - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      {/* Hero Section */}
      <div className="mt-24 text-white py-20" style={{ backgroundColor: brand.secondary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              School of Engineering & ICT
            </h1>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Business Tomorrow's Engineers and ICT Professionals
            </Typography>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="flex items-center">
                  <Award className="h-6 w-6 mr-2" />
                  <span>90-100% Pass Rate</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="flex items-center">
                  <Users className="h-6 w-6 mr-2" />
                  <span>Expert Faculty</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="flex items-center">
                  <Business className="h-6 w-6 mr-2" />
                  <span>Modern Facilities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Leading Engineering & ICT Education
              </h2>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                The School of Engineering and ICT at AIRADS College is at the forefront of technical education, 
                combining theoretical knowledge with practical skills to prepare students for the modern workforce.
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                Our programs are designed to meet industry standards and are approved by KNEC, NITA, and other 
                relevant bodies. We focus on hands-on learning, ensuring our graduates are job-ready upon completion.
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: brand.softBlue }}>
                  <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Graduates</div>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: brand.softBlue }}>
                  <MenuBook className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">10+</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-lg" style={{ backgroundColor: brand.softBlue }}>
                <Computer className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern ICT Labs</h3>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>State-of-the-art computer laboratories with latest software and hardware.</Typography>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: brand.softRed }}>
                <Wrench className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Engineering Workshops</h3>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>Fully equipped workshops for hands-on engineering practice.</Typography>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: brand.softBlue }}>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Electrical Labs</h3>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>Professional electrical and electronics laboratories.</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Choose from our comprehensive range of engineering and ICT programs designed to meet industry needs.
            </Typography>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.type === 'Diploma' ? 'bg-blue-100 text-blue-800' :
                    course.type === 'Certificate' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.type}
                  </span>
                  <span className="text-sm text-gray-500">{course.duration}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.title}</h3>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>{course.description}</Typography>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">World-Class Facilities</h2>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                Our school is equipped with modern facilities that provide students with hands-on experience 
                using industry-standard equipment and software.
              </Typography>
              <div className="space-y-4">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Career Opportunities</h2>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                Our graduates are highly sought after in various industries. Here are some career paths available:
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {careerOpportunities.map((career, index) => (
                  <div key={index} className="rounded-lg p-3 text-center" style={{ backgroundColor: brand.softBlue }}>
                    <span className="text-sm font-medium text-blue-800">{career}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ backgroundColor: brand.secondary }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Engineering & ICT Journey?
          </h2>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
            Join thousands of successful graduates who started their careers at AIRADS College.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Download Brochure
            </button>
          </div>
          <div className="mt-8 text-blue-100">
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>Call us: 0723-555-999 | WhatsApp: 0723-555-999</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolOfEngineeringICT;
