import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  InputBase,
  Stack,
  Paper,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon, Search as SearchIcon } from "@mui/icons-material";
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import { FONT_BODY } from "../../../config";
import ProgramGrid from "../../lists/ProgramGrid";
import { usePage } from "@inertiajs/react";
import {
  PROGRAM_LEVEL_FILTERS,
  matchesProgramLevel,
  matchesPathway,
  derivePathwayFilters,
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
  const [activePathway, setActivePathway] = useState("all");
  const [search, setSearch] = useState("");

  const categoryOptions = useMemo(() => {
    const configured = categories.length > 0 ? categories : platform.programCategories;
    return Array.isArray(configured) ? configured.filter(Boolean) : [];
  }, [categories, platform.programCategories]);

  const pathwayOptions = useMemo(() => derivePathwayFilters(programs), [programs]);

  const filteredPrograms = useMemo(() => {
    if (!programs || programs.length === 0) return [];

    const query = search.trim().toLowerCase();
    return programs.filter(program => {
      const title = getProgramTitle(program).toLowerCase();
      const description = (program?.description || "").toLowerCase();
      const matchCategory =
        activeCategory === ALL_CATEGORIES || getProgramCategory(program) === activeCategory;
      const matchSearch = !query || title.includes(query) || description.includes(query);

      return matchCategory && matchSearch && matchesProgramLevel(program, activeLevel) && matchesPathway(program, activePathway);
    }).map(normalizeProgramForGrid);
  }, [activeCategory, activeLevel, activePathway, search, programs]);

  return (
    <Box component="section" sx={{ py: 10, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" sx={{ fontFamily: FONT_BODY, fontWeight: 900, color: brand.neutralText, mb: 1, fontSize: { xs: '2.2rem', md: '2.8rem' } }}>
          Our Courses
        </Typography>
        <Typography variant="subtitle1" sx={{ fontFamily: FONT_BODY, color: 'text.secondary', mb: 6, maxWidth: 800, fontSize: '1.08rem' }}>
          Browse AIRADS courses from artisan and certificate to diploma and short course levels.
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'white',
              }}
            >
              <List disablePadding>
                <ListItemButton
                  selected={activeCategory === ALL_CATEGORIES}
                  onClick={() => setActiveCategory(ALL_CATEGORIES)}
                  sx={{
                    py: 2,
                    '&.Mui-selected': {
                      bgcolor: brand.accent,
                      color: 'white',
                      '&:hover': { bgcolor: brand.accent },
                    },
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <ListItemText
                    primary="All"
                    slotProps={{
                      primary: {
                        fontWeight: activeCategory === ALL_CATEGORIES ? 700 : 500,
                        fontSize: '0.98rem',
                      },
                    }}
                  />
                  {activeCategory === ALL_CATEGORIES && <ArrowForwardIcon fontSize="small" sx={{ color: 'white' }} />}
                </ListItemButton>
                {categoryOptions.map((category) => (
                  <ListItemButton
                    key={category}
                    selected={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    sx={{
                      py: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    '&.Mui-selected': {
                        bgcolor: brand.accent,
                        color: 'white',
                        '&:hover': { bgcolor: brand.accent },
                      },
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                  >
                    <ListItemText
                      primary={category}
                      slotProps={{
                        primary: {
                          fontWeight: activeCategory === category ? 700 : 500,
                          fontSize: '0.98rem',
                        },
                      }}
                    />
                    {activeCategory === category && <ArrowForwardIcon fontSize="small" sx={{ color: 'white' }} />}
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', lg: 'center' } }}>
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
                      placeholder="Search courses..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{ flex: 1, fontSize: '0.9rem' }}
                    />
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </Box>
                </Box>

                {pathwayOptions.length > 2 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {pathwayOptions.map(pw => (
                      <Button
                        key={pw.value}
                        onClick={() => setActivePathway(pw.value)}
                        variant={activePathway === pw.value ? "contained" : "outlined"}
                        sx={{
                          borderRadius: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                          bgcolor: activePathway === pw.value ? brand.primary : 'white',
                          color: activePathway === pw.value ? 'white' : 'text.primary',
                          borderColor: activePathway === pw.value ? brand.primary : 'divider',
                          '&:hover': {
                            bgcolor: activePathway === pw.value ? brand.primary : 'grey.100',
                            borderColor: activePathway === pw.value ? brand.primary : 'divider',
                          }
                        }}
                      >
                        {pw.label}
                      </Button>
                    ))}
                  </Box>
                )}
              </Stack>

              {filteredPrograms.length > 0 ? (
                <ProgramGrid programs={filteredPrograms} isAuthenticated={isAuthenticated} columns={{ xs: 12, sm: 6, md: 6, lg: 4 }} />
              ) : (
                <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'white', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body1" color="text.secondary">
                    No courses found matching your criteria.
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
