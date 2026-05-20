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

const Eldoret = () => {
  const brand = usePublicBrand();

  const features = [
    {
      icon: Business,
      title: "Modern Facilities",
      description: "State-of-the-art workshops, laboratories and modern equipment for comprehensive training."
    },
    {
      icon: Cog,
      title: "Engineering Excellence",
      description: "Specialized in engineering and technical programs with industry-standard equipment."
    },
    {
      icon: Computer,
      title: "ICT Hub",
      description: "Advanced computer labs and ICT training facilities for digital skills development."
    },
    {
      icon: Users,
      title: "Experienced Faculty",
      description: "Highly qualified trainers with extensive industry experience and expertise."
    }
  ];

  const specialPrograms = [
    "Diploma in Electrical/Electronic Engineering",
    "Diploma in Information Communication Technology",
    "Certificate in Project Management",
    "Artisan in Electrical Installation",
    "Computer Packages Training",
    "Industrial Attachment Programs"
  ];

  return (
    <PageLayout
      title="AIRADS Eldoret Campus"
      subtitle="Modern facilities in Eldoret serving the Rift Valley region with cutting-edge technical education and engineering programs."
    >
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Head title="Eldoret Campus - AIRADS College" />
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: brand.secondary }}>About Eldoret Campus</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                  Our Eldoret campus stands as a beacon of technical excellence in the Rift Valley region.
                  Located in one of Kenya's fastest-growing cities, the campus serves as a hub for engineering,
                  ICT, and technical education with modern facilities that rival the best institutions in the country.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.8 }}>
                  With a focus on practical, hands-on learning, our Eldoret campus is equipped with industry-standard
                  workshops, computer laboratories, and modern equipment that ensure students graduate with skills
                  that are immediately applicable in the workplace.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  The campus has built strong partnerships with local industries and maintains our institutional
                  commitment to excellence with consistent high pass rates and graduate employment success.
                </Typography>
              </Paper>

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center', color: brand.secondary }}>Why Choose Eldoret Campus?</Typography>
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6 }}>
                      <FeatureCard {...feature} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: brand.secondary }}>Specialized Programs</Typography>
                <Grid container spacing={2}>
                  {specialPrograms.map((program, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: brand.softBlue }}>
                        <Star sx={{ color: brand.secondary }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brand.secondary }}>{program}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: brand.secondary }}>Campus Excellence</Typography>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brand.secondary }}>Academic Excellence</Typography>
                    <Box component="ul" sx={{ pl: 0, listStyle: 'none', color: 'text.secondary' }}>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• 90-100% KNEC pass rate</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• TVETA approved programs</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Industry-aligned curriculum</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Qualified instructors</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: brand.secondary }}>Facilities & Resources</Typography>
                    <Box component="ul" sx={{ pl: 0, listStyle: 'none', color: 'text.secondary' }}>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Modern workshops & labs</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Free WiFi & internet</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Computer training centers</Typography>
                      <Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>• Library & study areas</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card elevation={0} sx={{ bgcolor: brand.secondary, color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>800+</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Students</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card elevation={0} sx={{ bgcolor: brand.accent, color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>18</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Years</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Card elevation={0} sx={{ bgcolor: brand.secondary, color: 'white', textAlign: 'center', borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>95%</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Employment</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <ContactCard
              phone="0715-696-979"
              whatsapp="0715-696-979"
              email="eldoret@airads.ac.ke"
              address="Eldoret Town, Uasin Gishu County"
            />
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
};

export default Eldoret;
