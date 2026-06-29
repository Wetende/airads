import { useState, useMemo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, InputBase, Select, MenuItem, Button, Pagination } from "@mui/material";
import { Search as SearchIcon, FilterList as FilterIcon } from "@mui/icons-material";
import VirtualCampusLayout from "../../../layouts/VirtualCampusLayout";
import ProgramGrid from "../../../components/lists/ProgramGrid";
import { getProgramsListState } from "../programsState";
import { usePublicBrand } from "../../../hooks/usePublicBrand";
import EmptyState from "../../../components/EmptyState";
import {
  PROGRAM_LEVEL_FILTERS,
  matchesProgramLevel,
} from "../../../utils/programClassification";

export default function VirtualCourses({ programs = [], filters = {}, categories = [] }) {
  const brand = usePublicBrand();
  const { auth, platform = {}, siteContext = {} } = usePage().props;
  const routes = siteContext.routes || {};
  const coursesHref = routes.virtualCourses || "/courses/";
  const isAuthenticated = !!auth?.user;

  const [search, setSearch] = useState(filters.search || "");
  const [category, setCategory] = useState(filters.category || "all");
  const [level, setLevel] = useState(filters.level || "all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const categoryOptions = useMemo(() => {
    const configured = categories.length > 0 ? categories : platform.programCategories;
    const options = Array.isArray(configured) ? configured.filter(Boolean) : [];
    if (category !== "all" && category && !options.includes(category)) {
      return [category, ...options];
    }
    return options;
  }, [categories, category, platform.programCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(
      coursesHref,
      {
        search,
        category: category !== "all" ? category : "",
        level: level !== "all" ? level : "",
      },
      { preserveState: true, replace: true },
    );
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setLevel("all");
    router.get(coursesHref);
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter(prog => {
      const matchSearch = prog?.title?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || prog?.category === category || prog?.school?.name?.includes(category);
      const matchLevel = matchesProgramLevel(prog, level);
      return matchSearch && matchCat && matchLevel;
    });
  }, [programs, search, category, level]);

  const paginatedPrograms = filteredPrograms.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(filteredPrograms.length / itemsPerPage);

  const listState = getProgramsListState({
    filters: { search, category, level: level !== "all" ? level : "" },
    isLoadingPrograms: false,
    totalPrograms: filteredPrograms.length,
  });

  return (
    <VirtualCampusLayout>
      <Head title="Virtual Courses Catalog - AIRADS College" />
      
      {/* Catalog Hero */}
      <Box sx={{ bgcolor: brand.secondary, color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>Virtual Course Catalog</Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
            Browse our comprehensive list of online programs, short courses, and certifications designed for your career growth.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'sticky', top: 100 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <FilterIcon sx={{ color: brand.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Filters</Typography>
              </Box>

              <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>Search</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 2, py: 0.5 }}>
                    <InputBase
                      placeholder="Search courses..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>Category</Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="all">Categories</MenuItem>
                    {categoryOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>Level</Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    sx={{ borderRadius: 1 }}
                  >
                    {PROGRAM_LEVEL_FILTERS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value === "all" ? "All Levels" : option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: brand.primary, mt: 2 }}>
                  Apply Filters
                </Button>
                
                {listState.showClearFilters && (
                  <Button variant="text" fullWidth onClick={handleClearFilters} sx={{ color: 'text.secondary' }}>
                    Clear Filters
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Results Area */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: brand.neutralText }}>
                {filteredPrograms.length} {filteredPrograms.length === 1 ? "Result" : "Results"} Found
              </Typography>
            </Box>

            {listState.kind === "ready" && (
              <>
                <ProgramGrid programs={paginatedPrograms} isAuthenticated={isAuthenticated} columns={{ xs: 12, sm: 6, lg: 4 }} />
                
                {pageCount > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination 
                      count={pageCount} 
                      page={page} 
                      onChange={(e, v) => setPage(v)} 
                      color="primary" 
                      size="large" 
                    />
                  </Box>
                )}
              </>
            )}

            {(listState.kind === "empty-filtered" || listState.kind === "empty-catalog") && (
              <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 4, bgcolor: 'white' }}>
                <EmptyState
                  title="No courses found"
                  description={listState.message}
                  action={listState.showClearFilters ? { label: "Clear Filters", onClick: handleClearFilters } : null}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </VirtualCampusLayout>
  );
}
