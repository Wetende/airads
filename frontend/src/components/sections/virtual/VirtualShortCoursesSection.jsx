import React, { useState, useMemo } from "react";
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip, List, ListItem, ListItemButton, ListItemText, InputBase, Paper } from "@mui/material";
import { ArrowForward as ArrowForwardIcon, Search as SearchIcon, PlayArrow } from "@mui/icons-material";
import { usePublicBrand } from "../../../hooks/usePublicBrand";

const MOCK_COURSES = [
  { title: "Packages (Computer Packages)", duration: "4 Weeks", category: "Computer", level: "Short Courses", image: "/static/ict.jpeg" },
  { title: "Digital Marketing Fundamentals", duration: "6 Weeks", category: "Business Management", level: "Short Courses", image: "/static/course-12.jpg" },
  { title: "Graphic Design Masterclass", duration: "8 Weeks", category: "Design", level: "Short Courses", image: "/static/18.jpg" },
  { title: "Data Analysis using Python", duration: "10 Weeks", category: "Computer", level: "Short Courses", image: "/static/course-4.jpg" },
  { title: "Beauty Therapy Essentials", duration: "4 Weeks", category: "Beauty and Cosmetology", level: "Short Courses", image: "/static/beauty-1.JPG" },
  { title: "Cybersecurity Awareness", duration: "2 Weeks", category: "Safety & Security", level: "Short Courses", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

const CATEGORIES = ["All", "Computer", "Business Management", "Design", "Beauty and Cosmetology", "Safety & Security"];

export default function VirtualShortCoursesSection() {
  const brand = usePublicBrand();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => {
      const matchCategory = activeCategory === "All" || course.category === activeCategory;
      const matchSearch = course.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <Box component="section" sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: brand.neutralText, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Explore Our <Box component="span" sx={{ bgcolor: brand.accent, color: 'white', px: 2, py: 0.5, borderRadius: 2 }}>Courses</Box>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 6, maxWidth: 800 }}>
          Suite of online, self-paced and flexible programs, featuring Diploma, certificates and Short Courses designed for the dynamic lifestyles of working professionals.
        </Typography>

        <Typography variant="h5" sx={{ color: brand.accent, fontWeight: 700, mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          Short Courses
        </Typography>

        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
              <List disablePadding>
                {CATEGORIES.map((cat, index) => (
                  <ListItem key={cat} disablePadding divider={index !== CATEGORIES.length - 1}>
                    <ListItemButton
                      selected={activeCategory === cat}
                      onClick={() => setActiveCategory(cat)}
                      sx={{
                        py: 2,
                        '&.Mui-selected': {
                          bgcolor: brand.secondary,
                          color: 'white',
                          '&:hover': { bgcolor: brand.secondary },
                        },
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <ListItemText
                        primary={cat}
                        primaryTypographyProps={{ fontWeight: activeCategory === cat ? 700 : 500, fontSize: '0.95rem' }}
                      />
                      {activeCategory === cat && <ArrowForwardIcon fontSize="small" sx={{ color: 'white' }} />}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Top Bar */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {["All", "Trending", "Newly Released"].map(tab => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    variant={activeTab === tab ? "contained" : "outlined"}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: activeTab === tab ? brand.accent : 'transparent',
                      color: activeTab === tab ? 'white' : 'text.primary',
                      borderColor: activeTab === tab ? brand.accent : 'divider',
                      '&:hover': {
                        bgcolor: activeTab === tab ? brand.accent : 'grey.100',
                        borderColor: activeTab === tab ? brand.accent : 'divider',
                      }
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 2, py: 0.5, bgcolor: 'white', width: { xs: '100%', sm: 280 } }}>
                <InputBase
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ flex: 1, fontSize: '0.9rem' }}
                />
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </Box>
            </Box>

            {/* Grid */}
            <Grid container spacing={3}>
              {filteredCourses.map((course, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" height="180" image={course.image} alt={course.title} />
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.3s', '&:hover': { opacity: 1 } }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PlayArrow sx={{ color: brand.primary }} />
                        </Box>
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 800, color: brand.secondary, mb: 1, fontSize: '1.1rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {course.duration}
                      </Typography>
                      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            color: brand.accent,
                            borderColor: brand.accent,
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 1,
                            '&:hover': { bgcolor: brand.accent, color: 'white' }
                          }}
                        >
                          Start Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
