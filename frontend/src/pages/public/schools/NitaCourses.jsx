import MainNavbar from '../../../components/common/MainNavbar';
import TopNavbar from '../../../components/common/TopNavbar';
import Footer from '../../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email, Star, Lightbulb, People, Settings as Cog, Computer, Groups as Users, EmojiEvents as Trophy } from '@mui/icons-material';
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { Award, Badge, CardDescription, CardHeader, CardTitle, CheckCircleIcon as CheckCircle, Clock, Mail, Target, Zap } from "./schoolUi";

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

const NitaCourses = () => {
  const brand = usePublicBrand();

  const nitaCourses = [
    {
      title: "NITA Welding Technology",
      duration: "6 Months",
      level: "NITA Level 1-3",
      description: "Comprehensive welding training covering arc welding, gas welding, and advanced welding techniques.",
      modules: ["Arc Welding", "Gas Welding", "Safety Procedures", "Metal Fabrication"]
    },
    {
      title: "NITA Motor Vehicle Mechanics",
      duration: "1 Year",
      level: "NITA Level 1-2",
      description: "Professional training in automotive repair, maintenance, and diagnostic procedures.",
      modules: ["Engine Repair", "Electrical Systems", "Transmission", "Diagnostics"]
    },
    {
      title: "NITA Electrical Installation",
      duration: "6 Months",
      level: "NITA Level 1-3",
      description: "Training in electrical wiring, installation, and maintenance of electrical systems.",
      modules: ["Wiring Systems", "Power Distribution", "Safety Standards", "Electrical Testing"]
    },
    {
      title: "NITA Plumbing Technology",
      duration: "6 Months",
      level: "NITA Level 1-2",
      description: "Hands-on training in water supply systems, drainage, and plumbing installations.",
      modules: ["Pipe Installation", "Water Systems", "Drainage", "Plumbing Repairs"]
    },
    {
      title: "NITA Carpentry and Joinery",
      duration: "1 Year",
      level: "NITA Level 1-3",
      description: "Comprehensive woodworking skills including furniture making and construction carpentry.",
      modules: ["Wood Working", "Furniture Making", "Construction Carpentry", "Tool Operation"]
    },
    {
      title: "NITA Masonry",
      duration: "6 Months",
      level: "NITA Level 1-2",
      description: "Professional training in brickwork, stonework, and construction techniques.",
      modules: ["Brickwork", "Stone Masonry", "Concrete Work", "Construction Safety"]
    }
  ];

  const shortCourses = [
    {
      title: "Computer Packages Training",
      duration: "1-3 Months",
      description: "Microsoft Office Suite, Internet skills, and basic computer literacy"
    },
    {
      title: "Digital Marketing",
      duration: "2 Months",
      description: "Social media marketing, SEO, and online business strategies"
    },
    {
      title: "First Aid Training",
      duration: "1 Week",
      description: "Basic first aid, CPR, and emergency response techniques"
    },
    {
      title: "Entrepreneurship Skills",
      duration: "1 Month",
      description: "Business planning, financial management, and startup strategies"
    },
    {
      title: "Customer Service Excellence",
      duration: "2 Weeks",
      description: "Professional customer service skills and communication techniques"
    },
    {
      title: "Basic Accounting",
      duration: "1 Month",
      description: "Bookkeeping, financial records, and basic accounting principles"
    }
  ];

  const facilities = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "NITA Approved Workshops",
      description: "Fully equipped workshops meeting NITA standards for practical training"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Certified Instructors",
      description: "NITA certified trainers with extensive industry experience"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Assessment Centers",
      description: "Accredited assessment facilities for NITA trade tests and certifications"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Modern Equipment",
      description: "Up-to-date tools and machinery for comprehensive practical training"
    }
  ];

  const benefits = [
    "NITA Recognized Certification",
    "Industry-Relevant Skills",
    "Job Placement Assistance",
    "Flexible Training Schedules",
    "Affordable Fees",
    "Practical Skills Focus"
  ];

  return (
    <div className="mt-24 text-white min-h-screen bg-background">
      <Head title="NITA Courses - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative text-white py-20" style={{ backgroundColor: brand.secondary }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              NITA Courses & Short Courses
            </h1>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Skills Development for Employment - Practical Training That Opens Doors to Success
            </Typography>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-orange-600">
                <Phone className="mr-2 h-5 w-5" />
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About NITA & Short Courses</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              AIRADS College is an accredited NITA training provider offering nationally recognized trade courses 
              and practical short courses. Our programs are designed to equip students with employable skills 
              and industry certifications that are valued by employers across Kenya.
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <MenuBook className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>NITA Accredited</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  All courses approved and recognized by National Industrial Training Authority
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Quick Skills Development</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Fast-track programs designed for immediate skill acquisition and employment
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Industry Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
                  Nationally recognized certificates that enhance employment opportunities
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* NITA Courses Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">NITA Trade Courses</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              National Industrial Training Authority approved courses for technical skills development
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {nitaCourses.map((course, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {course.level}
                    </Badge>
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
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Short Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Short Courses</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              Quick skill development programs for immediate employment and career enhancement
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortCourses.map((course, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">Short Course</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our NITA & Short Courses?</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-4 bg-background rounded-lg shadow-sm">
                  <Star className="h-5 w-5 text-orange-600 mr-3 flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Training Facilities</h2>
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

      {/* Contact & Apply Section */}
      <section className="py-16 text-white" style={{ backgroundColor: brand.secondary }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Develop Skills for Success</h2>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
            Join our NITA courses and short programs to gain practical skills and certifications that employers value
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Apply for NITA Course
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              Register Short Course
            </Button>
          </div>
          <div className="mt-8 text-white/80">
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>Call us: +254 723 555 999 | Email: nita@airads.ac.ke</Typography>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NitaCourses;
