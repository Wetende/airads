import React, { useState, useMemo } from "react";
import { Box, Container, Typography, Grid, Button, List, ListItem, ListItemButton, ListItemText, InputBase, Paper } from "@mui/material";
import { ArrowForward as ArrowForwardIcon, Search as SearchIcon } from "@mui/icons-material";
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import ProgramGrid from "../../lists/ProgramGrid";
import { usePage } from "@inertiajs/react";

const CATEGORIES = ["All", "School of Business", "School of Engineering", "School of Hospitality", "School of Health", "School of Beauty", "School of Media"];

export default function VirtualAcademicProgramsSection({ programs = [] }) {
  const brand = usePublicBrand();
  const { auth } = usePage().props;
  const isAuthenticated = !!auth?.user;

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filteredPrograms = useMemo(() => {
    if (!programs || programs.length === 0) return [];
    
    return programs.filter(program => {
      // Mock filtering logic for the layout
      const matchCategory = activeCategory === "All" || program?.school?.name?.includes(activeCategory.replace("School of ", ""));
      const matchSearch = program?.title?.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === "All" || program?.level === activeTab;
      
      return matchCategory && matchSearch && matchTab;
    });
  }, [activeCategory, search, activeTab, programs]);

  return (
    <Box component="section" sx={{ py: 10, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: brand.neutralText, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Academic <Box component="span" sx={{ bgcolor: brand.secondary, color: 'white', px: 2, py: 0.5, borderRadius: 2 }}>Programs</Box>
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 6, maxWidth: 800 }}>
          Fully accredited TVETA and CDACC programs designed to build your expertise from artisan to diploma levels.
        </Typography>

        <Typography variant="h5" sx={{ color: brand.secondary, fontWeight: 700, mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          Diploma, Certificate & Artisan
        </Typography>

        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
              <List disablePadding>
                {CATEGORIES.map((cat, index) => (
                  <ListItem key={cat} disablePadding divider={index !== CATEGORIES.length - 1}>
                    <ListItemButton
                      selected={activeCategory === cat}
                      onClick={() => setActiveCategory(cat)}
                      sx={{
                        py: 2,
                        '&.Mui-selected': {
                          bgcolor: brand.primary,
                          color: 'white',
                          '&:hover': { bgcolor: brand.primary },
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
                {["All", "Diploma", "Certificate", "Artisan"].map(tab => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    variant={activeTab === tab ? "contained" : "outlined"}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: activeTab === tab ? brand.secondary : 'transparent',
                      color: activeTab === tab ? 'white' : 'text.primary',
                      borderColor: activeTab === tab ? brand.secondary : 'divider',
                      '&:hover': {
                        bgcolor: activeTab === tab ? brand.secondary : 'grey.100',
                        borderColor: activeTab === tab ? brand.secondary : 'divider',
                      }
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 2, py: 0.5, bgcolor: 'white', width: { xs: '100%', sm: 280 } }}>
                <InputBase
                  placeholder="Search programs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ flex: 1, fontSize: '0.9rem' }}
                />
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </Box>
            </Box>

            {/* Grid */}
            {filteredPrograms.length > 0 ? (
              <ProgramGrid programs={filteredPrograms} isAuthenticated={isAuthenticated} columns={{ xs: 12, sm: 6, md: 6, lg: 4 }} />
            ) : (
              <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'white', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="body1" color="text.secondary">
                  No programs found matching your criteria.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
