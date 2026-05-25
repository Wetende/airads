import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { 
  Box, Container, Typography, Grid, Paper, Button, Chip, TextField, 
  CircularProgress, Card, CardContent
} from "@mui/material";
import { 
  Download, Description, OpenInNew, CalendarToday, LocationOn, Phone
} from "@mui/icons-material";
import { usePublicBrand } from "../../hooks/usePublicBrand";
import TopNavbar from "../../components/common/TopNavbar";
import MainNavbar from "../../components/common/MainNavbar";
import Footer from "../../components/common/AIRADSFooter";

const ApplicationForm = () => {
  const brand = usePublicBrand();
  const [downloadingForm, setDownloadingForm] = useState(null);

  const campusForms = [
    {
      name: "Bungoma Campus",
      key: "bungoma",
      description: "Application form and brochure for Bungoma Campus",
      location: "College House – 3rd Floor – Opposite Bungoma Main Stage",
      contact: "0715-771-316",
      hasForm: true
    },
    {
      name: "Eldoret Campus", 
      key: "eldoret",
      description: "Application form and brochure for Eldoret Campus",
      location: "Institute Plaza 3rd Floor- Oloo Street, Next to KPLC Commercial Office",
      contact: "0715-696-979",
      hasForm: true
    },
    {
      name: "Kisumu City Campus",
      key: "kisumu",
      description: "Application form and brochure for Kisumu Campus",
      location: "Oginga Odinga Street, Swan Building, 2nd Floor",
      contact: "0715-505-262",
      hasForm: true
    },
    {
      name: "Lodwar Campus",
      key: "lodwar",
      description: "Application form and brochure for Lodwar Campus", 
      location: "Equity Bank Building – Opposite Lodwar Town",
      contact: "Coming Soon",
      hasForm: true
    },
    {
      name: "Nakuru Campus",
      key: "nakuru",
      description: "Application form and brochure for Nakuru Campus",
      location: "TradeWorld Building 2nd Floor, Opposite Prestige Mall, Kijabe Row",
      contact: "0711488302",
      hasForm: true
    },
    {
      name: "Kericho Campus",
      key: "kericho",
      description: "Application form and brochure for Kericho Campus",
      location: "ACK BUSINESS PARK Building -2ND Floor Along Kericho –Nakuru Highway",
      contact: "0729-976-885",
      hasForm: true
    }
  ];

  // Universal PDF URL
  const universalPdfUrl = "https://airads.ac.ke/bronchure/UNIVERSAL%20BROCHURE-compressed.pdf";

  const handleDownload = (campusKey) => {
    setDownloadingForm(campusKey);
    
    // Open the universal PDF in a new tab
    window.open(universalPdfUrl, '_blank');
    
    setTimeout(() => {
      setDownloadingForm(null);
    }, 1000);
  };

  const availableFormsCount = campusForms.filter(campus => campus.hasForm).length;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Head title="Application Forms - AIRADS College" />
      <TopNavbar />
      <MainNavbar />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ pt: { xs: 15, md: 20 }, pb: { xs: 8, md: 10 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Chip 
              label="Application Forms Available" 
              sx={{ mb: 4, px: 2, py: 2.5, fontSize: '1.1rem', fontWeight: 'bold', bgcolor: brand.accent, color: 'white', border: 'none' }}
            />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 3, color: brand.secondary, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Download Application Forms
            </Typography>
            <Typography variant="h5" sx={{ mb: 6, color: brand.mutedText, maxWidth: 800, mx: 'auto', fontWeight: 300 }}>
              Get your application forms and brochures based on your preferred campus
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: brand.mutedText, fontSize: '0.9rem' }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2">Updated: {new Date().toLocaleDateString()}</Typography>
              <Typography variant="body2" sx={{ mx: 1 }}>&#8226;</Typography>
              <Typography variant="body2">{availableFormsCount} forms available</Typography>
            </Box>
          </Container>
        </Box>

        {/* Application Form Information */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.neutralText }}>
                Complete Application Package
              </Typography>
              <Typography variant="h6" sx={{ color: brand.mutedText, mb: 3, fontWeight: 400 }}>
                Each campus form includes everything you need for your application
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.accent, mx: 'auto', borderRadius: 2 }} />
            </Box>

            <Grid container spacing={4} sx={{ mb: 8 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }, borderRadius: 3, border: 'none', boxShadow: 2 }}>
                  <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 3, borderRadius: '50%', bgcolor: brand.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Description fontSize="large" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Application Forms</Typography>
                  <Chip label="All Programs" sx={{ mb: 3, bgcolor: brand.softBlue, color: brand.secondary, fontWeight: 'bold' }} />
                  <Typography variant="body1" sx={{ color: brand.mutedText }}>
                    Complete application forms for Certificate, Diploma, and Short Courses
                  </Typography>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }, borderRadius: 3, border: 'none', boxShadow: 2 }}>
                  <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 3, borderRadius: '50%', bgcolor: brand.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Description fontSize="large" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Course Information</Typography>
                  <Chip label="Detailed Brochures" sx={{ mb: 3, bgcolor: brand.softRed, color: brand.accent, fontWeight: 'bold' }} />
                  <Typography variant="body1" sx={{ color: brand.mutedText }}>
                    Comprehensive course details, requirements, and campus information
                  </Typography>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }, borderRadius: 3, border: 'none', boxShadow: 2 }}>
                  <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 3, borderRadius: '50%', bgcolor: brand.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Description fontSize="large" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Fee Structure</Typography>
                  <Chip label="Transparent Pricing" sx={{ mb: 3, bgcolor: '#dcfce7', color: '#15803d', fontWeight: 'bold' }} />
                  <Typography variant="body1" sx={{ color: brand.mutedText }}>
                    Complete fee breakdown and payment options for all programs
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Campus Forms Download Section */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: brand.neutralText }}>
                Download Forms by Campus
              </Typography>
              <Typography variant="h6" sx={{ color: brand.mutedText, mb: 3, fontWeight: 400 }}>
                Select your preferred campus to download the complete application package
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: brand.accent, mx: 'auto', borderRadius: 2 }} />
            </Box>

            <Grid container spacing={4}>
              {campusForms.map((campus, index) => (
                <Grid key={index} size={{ xs: 12, lg: 6 }}>
                  <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' } }}>
                    <Box sx={{ bgcolor: brand.secondary, p: 3, color: 'white' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ mr: 1.5 }} />
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{campus.name}</Typography>
                        </Box>
                        <Chip 
                          label={campus.hasForm ? 'Available' : 'Coming Soon'} 
                          size="small"
                          sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} 
                        />
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>{campus.description}</Typography>
                    </Box>
                    
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <LocationOn sx={{ color: brand.primary, mr: 2, mt: 0.2, fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ color: brand.mutedText }}>{campus.location}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: brand.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                            <Phone sx={{ color: 'white', fontSize: '0.9rem' }} />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{campus.contact}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ borderTop: '1px solid #e2e8f0', pt: 3, mt: 'auto' }}>
                        {campus.hasForm ? (
                          <Box sx={{ bgcolor: '#f0fdfa', border: '1px solid #bbf7d0', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ p: 1, borderRadius: 1, bgcolor: brand.primary, color: 'white', mr: 2 }}>
                                <Description />
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Complete Application Package</Typography>
                                <Typography variant="caption" sx={{ color: brand.mutedText }}>Universal Brochure &#8226; All Programs Included</Typography>
                              </Box>
                            </Box>
                            <Button
                              variant="contained"
                              onClick={() => handleDownload(campus.key)}
                              disabled={downloadingForm === campus.key}
                              startIcon={downloadingForm === campus.key ? <CircularProgress size={20} color="inherit" /> : <Download />}
                              sx={{ bgcolor: brand.accent, '&:hover': { bgcolor: brand.accentHover, boxShadow: 4 } }}
                            >
                              Download
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 3, textAlign: 'center' }}>
                            <Box sx={{ width: 48, height: 48, mx: 'auto', bgcolor: 'grey.300', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                              <Description sx={{ color: 'grey.500' }} />
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: brand.mutedText, mb: 1 }}>Application Form Coming Soon</Typography>
                            <Typography variant="caption" sx={{ color: brand.mutedText, display: 'block', mb: 2 }}>We're preparing the application materials for this campus</Typography>
                            <Chip label="Not Available Yet" size="small" sx={{ bgcolor: 'grey.200', color: brand.mutedText }} />
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ mt: 3, p: 2, bgcolor: brand.softBlue, borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: brand.mutedText, display: 'block', textAlign: 'center' }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>Complete Package Includes:</Box> Application forms for all programs, course brochures, fee structure, admission requirements, and campus-specific information.
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Paper sx={{ maxWidth: 900, mx: 'auto', bgcolor: brand.accent, color: 'white', borderRadius: 4, p: { xs: 4, md: 6 }, textAlign: 'center', boxShadow: 6 }}>
              <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                Need Help with Your Application?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 300, opacity: 0.9 }}>
                Our admissions team is ready to assist you with the application process
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 3 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<OpenInNew />}
                  href="/admissions/apply/" 
                  sx={{ bgcolor: 'white', color: brand.accent, fontWeight: 'bold', '&:hover': { bgcolor: '#f1f5f9' }, py: 1.5, px: 3 }}
                >
                  Apply Online at admissions.airads.ac.ke
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  startIcon={<Phone />}
                  href="https://wa.me/254723555999" 
                  target="_blank"
                  sx={{ borderColor: 'white', color: 'white', fontWeight: 'bold', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }, py: 1.5, px: 3 }}
                >
                  Contact Admissions Office
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>

        {/* File Statistics Section */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: brand.softBlue }}>
          <Container maxWidth="md">
            <Paper sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Available Downloads</Typography>
                <Typography variant="body2" sx={{ color: brand.mutedText }}>Quick overview of all available application forms</Typography>
              </Box>
              <Grid container spacing={4}>
                <Grid sx={{ textAlign: 'center' }} size={{ xs: 12, sm: 4 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: brand.primary, mb: 1 }}>{availableFormsCount}</Typography>
                  <Typography variant="body2" sx={{ color: brand.mutedText }}>Available Forms</Typography>
                </Grid>
                <Grid sx={{ textAlign: 'center' }} size={{ xs: 12, sm: 4 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: brand.accent, mb: 1 }}>{availableFormsCount}</Typography>
                  <Typography variant="body2" sx={{ color: brand.mutedText }}>Active Campuses</Typography>
                </Grid>
                <Grid sx={{ textAlign: 'center' }} size={{ xs: 12, sm: 4 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#16a34a', mb: 1 }}>6</Typography>
                  <Typography variant="body2" sx={{ color: brand.mutedText }}>Total Campuses</Typography>
             </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>

        {/* Comments Section */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'white' }}>
          <Container maxWidth="md">
            <Paper sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: 3 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Leave a Reply</Typography>
                <Typography variant="body2" sx={{ color: brand.mutedText }}>Your email address will not be published. Required fields are marked *</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Name *" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Email *" type="email" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Website" type="url" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Comment *" multiline rows={6} variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant="contained" size="large" sx={{ bgcolor: brand.primary, fontWeight: 'bold', py: 1.5, px: 4, '&:hover': { bgcolor: brand.primaryHover, boxShadow: 4 } }}>
                    Post Comment
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ApplicationForm;
