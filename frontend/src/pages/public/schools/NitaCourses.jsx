import MainNavbar from '../../../components/common/MainNavbar';
import TopNavbar from '../../../components/common/TopNavbar';
import Footer from '../../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Typography, Card, CardContent, Button } from '@mui/material';
import { MenuBook, Phone, Star, Groups as Users } from '@mui/icons-material';
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { Award, Badge, CardDescription, CardHeader, CardTitle, CheckCircleIcon as CheckCircle, Clock, Mail, Target, Zap } from "./schoolUi";

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
              NITA Courses
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About NITA Courses</h2>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>
              AIRADS College is an accredited NITA training provider offering nationally recognized trade courses
              and practical skills training. Our programs are designed to equip students with employable skills
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

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our NITA Courses?</h2>
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
            Join our NITA courses to gain practical skills and certifications that employers value
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Apply for NITA Course
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
