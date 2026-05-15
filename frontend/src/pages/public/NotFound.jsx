import { Head } from "@inertiajs/react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home } from "@mui/icons-material";

const NotFound = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Head title="404 - Not Found - AIRADS College" />
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '6rem', md: '8rem' }, fontWeight: 900, color: 'primary.main', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, fontWeight: 500 }}>
          Oops! Page not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          href="/" 
          startIcon={<Home />}
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
