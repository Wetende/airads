import MainNavbar from '../../../components/common/MainNavbar';
import TopNavbar from '../../../components/common/TopNavbar';
import Footer from '../../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email, Star, Lightbulb, People, Settings as Cog, Computer, Groups as Users, EmojiEvents as Trophy } from '@mui/icons-material';
import { usePublicBrand } from "../../../hooks/usePublicBrand";

const PageLayout = ({ children, title, subtitle }) => {
  const brand = usePublicBrand();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <TopNavbar />
      <MainNavbar />

      <Box
        sx={{
          position: 'relative',
          py: { xs: 12, md: 16 },
          px: 2,
          overflow: 'hidden',
          bgcolor: brand.secondary,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mt: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: 'white', mb: 3, letterSpacing: '-0.02em', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 800, mx: 'auto', lineHeight: 1.8, fontWeight: 400 }}>
              {subtitle}
            </Typography>
          )}
        </Container>

        <Box sx={{ position: 'absolute', top: 80, left: 40, width: 128, height: 128, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <Box sx={{ position: 'absolute', bottom: 80, right: 40, width: 96, height: 96, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
      </Box>

      <Box component="main" sx={{ position: 'relative', zIndex: 10, flexGrow: 1, mt: -6 }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  const brand = usePublicBrand();

  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 4, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{
          width: 64, height: 64, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
          bgcolor: brand.secondary, color: 'white',
          transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' }
        }}>
          <Icon fontSize="large" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brand.secondary }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{description}</Typography>
      </CardContent>
    </Card>
  );
};

const ContactCard = ({ phone, whatsapp, email, address }) => {
  const brand = usePublicBrand();

  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: brand.secondary }}>Contact Information</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: brand.secondary, color: 'white', flexShrink: 0 }}>
              <Phone />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Phone</Typography>
              <Typography component="a" href={`tel:${phone}`} variant="body1" sx={{ fontWeight: 500, color: brand.secondary, textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                {phone}
              </Typography>
            </Box>
          </Box>

          {whatsapp && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#22c55e', color: 'white', flexShrink: 0 }}>
                <WhatsApp />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>WhatsApp</Typography>
                <Typography component="a" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" variant="body1" sx={{ fontWeight: 500, color: '#22c55e', textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                  {whatsapp}
                </Typography>
              </Box>
            </Box>
          )}

          {email && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: brand.secondary, color: 'white', flexShrink: 0 }}>
                <Email />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Email</Typography>
                <Typography component="a" href={`mailto:${email}`} variant="body1" sx={{ fontWeight: 500, color: brand.secondary, textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                  {email}
                </Typography>
              </Box>
            </Box>
          )}

          {address && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: brand.mutedText, color: 'white', flexShrink: 0 }}>
                <LocationOn />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: brand.secondary }}>{address}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.5, bgcolor: brand.secondary, borderRadius: 2, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: brand.primaryHover } }}
          >
            Apply Now
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ py: 1.5, borderColor: brand.secondary, color: brand.secondary, borderRadius: 2, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: brand.secondary, color: 'white' } }}
          >
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Kisumu = () => {
  const brand = usePublicBrand();

  const features = [
    {
      icon: School,
      title: "Lakeside Location",
      description: "Strategic location in the beautiful lakeside city with access to unique opportunities."
    },
    {
      icon: Business,
      title: "Marine Programs",
      description: "Specialized programs in marine and aquatic related technical fields."
    },
    {
      icon: Business,
      title: "Business Hub",
      description: "Located in Western Kenya's commercial center with strong industry connections."
    },
    {
      icon: Wifi,
      title: "Aquaculture Focus",
      description: "Programs aligned with the region's fishing and aquaculture industries."
    }
  ];

  const programs = [
    "Hospitality and Tourism Management",
    "Information Communication Technology",
    "Business Management",
    "Health and Social Sciences",
    "Beauty and Cosmetology",
    "Electrical Engineering"
  ];

  return (
    <PageLayout
      title="AIRADS Kisumu Campus"
      subtitle="Located in the beautiful lakeside city of Kisumu, offering diverse programs with strong connections to regional industries."
    >
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Head title="Kisumu Campus - AIRADS College" />
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: brand.secondary }}>About Kisumu Campus</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                  Situated in the vibrant lakeside city of Kisumu, our campus serves as a gateway to technical
                  education in Western Kenya. The campus benefits from its unique location near Lake Victoria,
                  offering students exposure to diverse economic activities including fishing, agriculture, and commerce.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                  Our Kisumu campus is renowned for its comprehensive programs that align with the region's
                  economic needs. From hospitality and tourism to technical engineering, we prepare students
                  for careers in both traditional and emerging sectors.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  With modern facilities and a commitment to practical education, the campus maintains
                  AIRADS College's tradition of excellence while serving the unique needs of the lakeside region.
                </Typography>
              </Paper>

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center', color: brand.secondary }}>Campus Advantages</Typography>
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6 }}>
                      <FeatureCard {...feature} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: brand.secondary }}>Popular Programs</Typography>
                <Grid container spacing={2}>
                  {programs.map((program, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: brand.softBlue, borderLeft: `4px solid ${brand.secondary}` }}>
                        <Trophy sx={{ color: brand.secondary }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brand.neutralText }}>{program}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: brand.secondary }}>Regional Impact</Typography>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brand.secondary }}>Economic Integration</Typography>
                    <Box component="ul" sx={{ pl: 0, listStyle: 'none', color: 'text.secondary' }}>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Tourism & hospitality sector</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Fishing industry partnerships</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Agricultural value chains</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Cross-border trade opportunities</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brand.secondary }}>Student Benefits</Typography>
                    <Box component="ul" sx={{ pl: 0, listStyle: 'none', color: 'text.secondary' }}>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Diverse career opportunities</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Industry mentorship programs</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Practical training placements</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Entrepreneurship support</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card elevation={0} sx={{ bgcolor: brand.secondary, color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>450+</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Graduates</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card elevation={0} sx={{ bgcolor: brand.accent, color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>92%</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Pass Rate</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card elevation={0} sx={{ bgcolor: brand.mutedText, color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>12+</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Programs</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <ContactCard
              phone="0715-505-262"
              whatsapp="0715-505-262"
              email="kisumu@airads.ac.ke"
              address="Kisumu City, Kisumu County"
            />
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
};

export default Kisumu;
