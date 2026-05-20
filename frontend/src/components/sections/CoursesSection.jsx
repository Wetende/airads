import React, { useState } from "react";
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip, Paper } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";

const CoursesSection = () => {
  const brand = usePublicBrand();
  const [activeFilter, setActiveFilter] = useState("All Courses");

  const courses = [
    { title: "Certificate in Project Management", description: "AIRADS College is the best technical college offering this comprehensive project management program.", category: "Business Management", level: "Certificate Courses", image: "/static/17.jpg" },
    { title: "Diploma in Planning and Project Management", description: "Course Overview: This two year diploma course offered at AIRADS focuses on strategic planning and project execution.", category: "Business Management", level: "Diploma Course", image: "/static/course-2.jpg" },
    { title: "Diploma in Electrical/Electronic Engineering (KNEC)", description: "This is a two years course which aims at equipping learners with comprehensive knowledge in electrical and electronic systems.", category: "Engineering", level: "Diploma Course", image: "/static/course-3.webp" },
    { title: "Diploma in Information Communication Technology", description: "This course offered at African Institute of Research and Development Studies focuses on modern ICT skills and applications.", category: "Computer", level: "Diploma Course", image: "/static/course-4.jpg" },
    { title: "Certificate in Information Communication Technology", description: "Certificate in Information Communication Technology course is intended to provide foundational ICT skills.", category: "Computer", level: "Certificate Courses", image: "/static/18.jpg" },
    { title: "Diploma in Land Mapping and Survey", description: "Course Overview: This two year diploma course offered at AIRADS covers comprehensive surveying techniques.", category: "Engineering", level: "Diploma Course", image: "/static/course-6.webp" },
    { title: "Certificate in Land Mapping and Survey", description: "Certificate in Land Mapping and Survey course provides foundational skills in surveying and mapping techniques.", category: "Engineering", level: "Certificate Courses", image: "/static/course-6.webp" },
    { title: "Certificate in Electrical Installation", description: "This Certificate course in Electrical Installation is designed to equip learners with necessary skills in electrical systems.", category: "Engineering", level: "Certificate Courses", image: "/static/course-8.webp" },
    { title: "Certificate in Plumbing (KNEC)", description: "Plumbing is the system of pipes, tanks, fittings, and other apparatus required for water supply and sanitation.", category: "Engineering", level: "Certificate Courses", image: "/static/course-1.webp" },
    { title: "Artisan in Electrical and Electronic Technology (KNEC)", description: "This electrical and electronics technology program is designed for hands-on technical skills development.", category: "Engineering", level: "Artisan Courses", image: "/static/course-9.webp" },
    { title: "Artisan in Plumbing (KNEC)", description: "Artisan course in plumbing focusing on practical skills in water supply and sanitation systems.", category: "Engineering", level: "Artisan Courses", image: "/static/course-1.webp" },
    { title: "Artisan in Electrical Installation (KNEC)", description: "Hands-on artisan course in electrical installation covering practical electrical systems.", category: "Engineering", level: "Artisan Courses", image: "/static/course-8.webp" },
    { title: "Disaster Management", description: "Comprehensive course in disaster management and emergency response planning.", category: "Safety & Security", level: "Certificate Courses", image: "/static/36.jpg" },
    { title: "Short Courses", description: "Various short duration courses designed for quick skill acquisition and professional development.", category: "General", level: "Short Courses", image: "/static/course-12.jpg" },
    { title: "NITA Courses", description: "National Industrial Training Authority approved courses for professional certification.", category: "Professional", level: "Certificate Courses", image: "/static/course-13.jpg" },
    { title: "Packages (Computer Packages)", description: "Introduction to computers and various software applications for modern workplace skills.", category: "Computer", level: "Short Courses", image: "/static/ict.jpeg" },
    { title: "Engineering", description: "Comprehensive engineering programs covering various technical disciplines and practical applications.", category: "Engineering", level: "Diploma Course", image: "/static/electrical-1.jpg" },
    { title: "Beauty", description: "Beauty therapy and cosmetology courses focusing on professional beauty skills and techniques.", category: "Beauty and Cosmetology", level: "Short Courses", image: "/static/beauty-1.JPG" },
  ];

  const schools = [
    "All Courses", "SCHOOL OF ENGINEERING & ICT", "SCHOOL OF HOSPITALITY & TOURISM", "SCHOOL OF MEDIA STUDIES",
    "SCHOOL OF BEAUTY", "SCHOOL OF BUSINESS MGT", "SCHOOL OF HEALTH SCIENCES", "SHORT COURSES",
  ];

  const filters = [
    "All Courses", "Artisan Courses", "Beauty and Cosmetology", "Business Management", "Certificate Courses",
    "Computer", "Diploma Course", "Engineering", "General", "Professional", "Safety & Security", "Short Courses",
  ];

  const filteredCourses = activeFilter === "All Courses"
    ? courses
    : courses.filter(course => course.category === activeFilter || course.level === activeFilter);

  return (
    <Box component="section" sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: brand.neutralText, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
            Courses We Offer
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 'normal', lineHeight: 1.6 }}>
            AIRADS College is the best college in Kenya. We have various courses approved by the Ministry of Education and TVETA.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4, color: brand.secondary }}>
            Our Campuses
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {schools.map((school, index) => (
              <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 12 / 7 }}>
                <Paper
                  onClick={() => setActiveFilter(school === "All Courses" ? "All Courses" : school)}
                  sx={{
                    bgcolor: brand.secondary,
                    color: 'white',
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: brand.primary, transform: 'translateY(-2px)' },
                  }}
                  elevation={2}
                >
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {school}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
            {filters.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onClick={() => setActiveFilter(filter)}
                sx={{
                  px: 1,
                  py: 2.5,
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  bgcolor: activeFilter === filter ? brand.secondary : 'grey.100',
                  color: activeFilter === filter ? 'white' : 'text.secondary',
                  boxShadow: activeFilter === filter ? 2 : 0,
                  '&:hover': {
                    bgcolor: activeFilter === filter ? brand.primary : brand.borderBlue,
                    color: activeFilter === filter ? 'white' : brand.secondary,
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {filteredCourses.map((course, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia component="img" height="200" image={course.image} alt={course.title} />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', p: 2 }}>
                    <Chip size="small" label={course.level} sx={{ bgcolor: brand.accent, color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }} />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: brand.secondary, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Chip size="small" label={course.category} sx={{ bgcolor: brand.softBlue, color: brand.primary, fontWeight: 'bold' }} />
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      sx={{ color: brand.accent, fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: 'transparent', color: brand.accentHover } }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              bgcolor: brand.secondary,
              color: 'white',
            }}
          >
            <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              JANUARY 2026 INTAKE ONGOING
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 'normal', opacity: 0.9 }}>
              Intake in Progress in all our Campuses
            </Typography>
            <Button
              href="https://docs.google.com/forms/d/e/1FAIpQLSdl9v2WYIAbX41Wo2LyrUjhSZucHuvytgoYxd9Elq1yFSV0ig/alreadyresponded"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              sx={{
                bgcolor: brand.accent,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                px: 6,
                py: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: brand.accentHover },
              }}
            >
              APPLY NOW
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default CoursesSection;
