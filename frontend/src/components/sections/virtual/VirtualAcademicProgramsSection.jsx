import { useState, useMemo } from "react";
import { Box, Container, Typography, Grid, Button, InputBase, Stack } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import ProgramGrid from "../../lists/ProgramGrid";
import { usePage } from "@inertiajs/react";
import {
  PROGRAM_LEVEL_FILTERS,
  matchesProgramLevel,
} from "../../../utils/programClassification";

const ALL_CATEGORIES = "all";

const getProgramTitle = (program) => program?.name || program?.title || "";
const getProgramCategory = (program) => program?.category || program?.school?.name || "";

const normalizeProgramForGrid = (program) => ({
  ...program,
  name: getProgramTitle(program),
  publicUrl: program?.publicUrl || (program?.slug ? `/programs/${program.slug}/` : "#"),
});

export default function VirtualAcademicProgramsSection({ programs = [], categories = [] }) {
  const brand = usePublicBrand();
  const { auth, platform = {} } = usePage().props;
  const isAuthenticated = !!auth?.user;

  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeLevel, setActiveLevel] = useState("all");
  const [search, setSearch] = useState("");

  const categoryOptions = useMemo(() => {
    const configured = categories.length > 0 ? categories : platform.programCategories;
    return Array.isArray(configured) ? configured.filter(Boolean) : [];
  }, [categories, platform.programCategories]);

  const filteredPrograms = useMemo(() => {
    if (!programs || programs.length === 0) return [];

    const query = search.trim().toLowerCase();
    return programs.filter(program => {
      const title = getProgramTitle(program).toLowerCase();
      const description = (program?.description || "").toLowerCase();
      const matchCategory =
        activeCategory === ALL_CATEGORIES || getProgramCategory(program) === activeCategory;
      const matchSearch = !query || title.includes(query) || description.includes(query);

      return matchCategory && matchSearch && matchesProgramLevel(program, activeLevel);
    }).map(normalizeProgramForGrid);
  }, [activeCategory, activeLevel, search, programs]);

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
          Diploma, Certificate, Artisan & Short Courses
        </Typography>

        <Stack spacing={4}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.25,
              alignItems: 'center',
            }}
          >
            <Button
              onClick={() => setActiveCategory(ALL_CATEGORIES)}
              variant={activeCategory === ALL_CATEGORIES ? "contained" : "text"}
              sx={{
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.25,
                bgcolor: activeCategory === ALL_CATEGORIES ? brand.primary : 'transparent',
                color: activeCategory === ALL_CATEGORIES ? 'white' : brand.primary,
                '&:hover': {
                  bgcolor: activeCategory === ALL_CATEGORIES ? brand.primary : 'rgba(37, 99, 235, 0.08)',
                },
              }}
            >
              All Categories
            </Button>
            {categoryOptions.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? "contained" : "text"}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  color: activeCategory === category ? 'white' : brand.primary,
                  bgcolor: activeCategory === category ? brand.primary : 'transparent',
                  '&:hover': {
                    bgcolor: activeCategory === category ? brand.primary : 'rgba(37, 99, 235, 0.08)',
                  },
                }}
              >
                {category}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' } }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {PROGRAM_LEVEL_FILTERS.map(level => (
                  <Button
                    key={level.value}
                    onClick={() => setActiveLevel(level.value)}
                    variant={activeLevel === level.value ? "contained" : "outlined"}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: activeLevel === level.value ? brand.secondary : 'white',
                      color: activeLevel === level.value ? 'white' : 'text.primary',
                      borderColor: activeLevel === level.value ? brand.secondary : 'divider',
                      '&:hover': {
                        bgcolor: activeLevel === level.value ? brand.secondary : 'grey.100',
                        borderColor: activeLevel === level.value ? brand.secondary : 'divider',
                      }
                    }}
                  >
                    {level.label}
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

          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
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
        </Stack>
      </Container>
    </Box>
  );
}
