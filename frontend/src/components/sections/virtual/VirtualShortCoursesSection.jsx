import { useState, useMemo } from "react";
import { Box, Container, Typography, Grid, Button, InputBase, Stack } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { FONT_BODY } from "../../../config";
import ProgramGrid from "../../lists/ProgramGrid";
import { usePage } from "@inertiajs/react";
import { isShortCourseProgram } from "../../../utils/programClassification";

const ALL_CATEGORIES = "all";

const getProgramTitle = (program) => program?.name || program?.title || "";
const getProgramCategory = (program) => program?.category || program?.school?.name || "";

const normalizeProgramForGrid = (program) => ({
  ...program,
  name: getProgramTitle(program),
  publicUrl: program?.publicUrl || (program?.slug ? `/programs/${program.slug}/` : "#"),
});

export default function VirtualShortCoursesSection({ programs = [], categories = [] }) {
  const brand = usePublicBrand();
  const { auth, platform = {} } = usePage().props;
  const isAuthenticated = !!auth?.user;

  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [search, setSearch] = useState("");

  const categoryOptions = useMemo(() => {
    const configured = categories.length > 0 ? categories : platform.programCategories;
    return Array.isArray(configured) ? configured.filter(Boolean) : [];
  }, [categories, platform.programCategories]);

  // Filter to only short courses, then apply category + search filters
  const filteredPrograms = useMemo(() => {
    if (!programs || programs.length === 0) return [];

    const query = search.trim().toLowerCase();
    return programs.filter(program => {
      if (!isShortCourseProgram(program)) return false;

      const title = getProgramTitle(program).toLowerCase();
      const description = (program?.description || "").toLowerCase();
      const matchCategory =
        activeCategory === ALL_CATEGORIES || getProgramCategory(program) === activeCategory;
      const matchSearch = !query || title.includes(query) || description.includes(query);

      return matchCategory && matchSearch;
    }).map(normalizeProgramForGrid);
  }, [activeCategory, search, programs]);

  return (
    <Box component="section" sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" sx={{ fontFamily: FONT_BODY, fontWeight: 900, color: brand.neutralText, mb: 1, fontSize: { xs: '2.2rem', md: '2.8rem' } }}>
          Explore Our Courses
        </Typography>
        <Typography variant="subtitle1" sx={{ fontFamily: FONT_BODY, color: 'text.secondary', mb: 6, maxWidth: 800, fontSize: '1.08rem' }}>
          Suite of online, self-paced and flexible programs, featuring short courses designed for the dynamic lifestyles of working professionals.
        </Typography>

        <Typography variant="h5" sx={{ fontFamily: FONT_BODY, color: brand.accent, fontWeight: 800, mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          Short Courses
        </Typography>

        <Stack spacing={4}>
          {/* Category filter pills + search */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' } }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center' }}>
              <Button
                onClick={() => setActiveCategory(ALL_CATEGORIES)}
                variant={activeCategory === ALL_CATEGORIES ? "contained" : "text"}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.25,
                  bgcolor: activeCategory === ALL_CATEGORIES ? brand.accent : 'transparent',
                  color: activeCategory === ALL_CATEGORIES ? 'white' : brand.accent,
                  '&:hover': {
                    bgcolor: activeCategory === ALL_CATEGORIES ? brand.accent : 'rgba(220, 37, 37, 0.08)',
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
                    color: activeCategory === category ? 'white' : brand.accent,
                    bgcolor: activeCategory === category ? brand.accent : 'transparent',
                    '&:hover': {
                      bgcolor: activeCategory === category ? brand.accent : 'rgba(220, 37, 37, 0.08)',
                    },
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 2, py: 0.5, bgcolor: 'white', width: { xs: '100%', sm: 280 } }}>
              <InputBase
                placeholder="Search short courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: '0.9rem' }}
              />
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            </Box>
          </Box>

          {/* Program grid */}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              {filteredPrograms.length > 0 ? (
                <ProgramGrid programs={filteredPrograms} isAuthenticated={isAuthenticated} columns={{ xs: 12, sm: 6, md: 6, lg: 4 }} />
              ) : (
                <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'white', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body1" color="text.secondary">
                    No short courses found matching your criteria.
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
