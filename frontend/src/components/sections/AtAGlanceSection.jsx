import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from '@inertiajs/react';
import {
  Visibility as VisibilityIcon,
  RocketLaunch as MissionIcon,
  AutoStories as PhilosophyIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  Description as DescriptionIcon,
  Payments as PaymentsIcon,
  HowToReg as HowToRegIcon,
} from '@mui/icons-material';
import { usePublicBrand } from '../../hooks/usePublicBrand';

const tabPanels = [
  {
    label: 'About AIRADS',
    content: (props) => <AboutPanel {...props} />,
  },
  {
    label: 'How to Apply',
    content: (props) => <HowToApplyPanel {...props} />,
  },
  {
    label: 'Admissions',
    content: (props) => <AdmissionsPanel {...props} />,
  },
  {
    label: 'Fee Structures',
    content: (props) => <FeeStructuresPanel {...props} />,
  },
];

function AboutPanel({ brand }) {
  return (
    <Grid container spacing={4} alignItems="stretch">
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="h5"
          sx={{ color: brand.primary, fontWeight: 700, mb: 3 }}
        >
          AIRADS at a Glance
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <VisibilityIcon sx={{ color: brand.primary, mt: 0.3 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>VISION:</Typography>
              <Typography variant="body2" color="text.secondary">
                To be a World Class Centre of Excellence<br/>
                and Innovation in Technical, Research<br/>
                and Entrepreneurship Training.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <MissionIcon sx={{ color: brand.accent, mt: 0.3 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>MISSION:</Typography>
              <Typography variant="body2" color="text.secondary">
                To provide Quality Technical and Entrepreneurship<br/>
                Training and Cutting Edge Research that will ensure<br/>
                developmental Transformation of individuals<br/>
                and communities in the world.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <PhilosophyIcon sx={{ color: brand.secondary, mt: 0.3 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>CORE VALUES:</Typography>
              <Typography variant="body2" color="text.secondary">
                Innovative Thinking • Hard Work • Integrity<br/>
                Excellence • Corporate Social Responsibility
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          component={Link}
          href="/about/"
          variant="outlined"
          sx={{
            mt: 3,
            borderColor: brand.primary,
            color: brand.primary,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: brand.softBlue, borderColor: brand.primary },
          }}
        >
          Read More
        </Button>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          component="img"
          src="/static/31.jpg"
          alt="AIRADS Campus"
          sx={{
            width: '100%',
            height: '100%',
            minHeight: 320,
            objectFit: 'cover',
            borderRadius: 3,
            boxShadow: 3,
          }}
        />
      </Grid>
    </Grid>
  );
}

function HowToApplyPanel({ brand }) {
  const steps = [
    'Visit any of our 8 campuses or apply online',
    'Fill in the application form',
    'Submit your documents (ID, KCSE Certificate)',
    'Pay the required fees',
    'Receive your admission letter',
    'Report on the specified date',
  ];
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h5" sx={{ color: brand.primary, fontWeight: 700, mb: 3 }}>
          How to Apply
        </Typography>
        <List dense>
          {steps.map((step, i) => (
            <ListItem key={i} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: brand.primary,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </Box>
              </ListItemIcon>
              <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            component={Link}
            href="/admissions/procedure/"
            variant="contained"
            sx={{
              bgcolor: brand.primary,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: brand.secondary },
            }}
          >
            Application Procedure
          </Button>
          <Button
            component="a"
            href="/admissions/apply/"
            variant="contained"
            sx={{
              bgcolor: brand.accent,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: brand.accentHover },
            }}
          >
            Apply Online
          </Button>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          component="img"
          src="/static/image33.jpg"
          alt="Students applying"
          sx={{ width: '100%', height: '100%', minHeight: 320, objectFit: 'cover', borderRadius: 3, boxShadow: 3 }}
        />
      </Grid>
    </Grid>
  );
}

function AdmissionsPanel({ brand }) {
  const links = [
    { icon: <SchoolIcon />, text: 'TVET Programmes', href: '/admissions/career-guide/' },
    { icon: <DescriptionIcon />, text: 'Application Forms', href: '/admissions/forms/' },
    { icon: <HowToRegIcon />, text: 'Prospective Students', href: '/admissions/procedure/' },
    { icon: <DownloadIcon />, text: 'Career Guide & Prospectus', href: '/admissions/career-guide/' },
  ];
  return (
    <Box>
      <Typography variant="h5" sx={{ color: brand.primary, fontWeight: 700, mb: 3 }}>
        Admissions Information
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        We don&apos;t just give students an education and experiences that set them up for success in a career.
        We help them succeed in their career — to discover a field they&apos;re passionate about and dare to lead it.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {links.map((link, i) => (
          <Grid size={{ xs: 12, sm: 6 }} key={i}>
            <Button
              component={Link}
              href={link.href}
              fullWidth
              startIcon={link.icon}
              sx={{
                justifyContent: 'flex-start',
                bgcolor: brand.softBlue,
                color: brand.primary,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
                '&:hover': { bgcolor: brand.borderBlue },
              }}
            >
              {link.text}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function FeeStructuresPanel({ brand }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ color: brand.primary, fontWeight: 700, mb: 3 }}>
        Fee Structures
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        AIRADS College offers affordable, flexible fee payment plans. Contact your nearest campus for detailed fee structures.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            component={Link}
            href="/admissions/procedure/"
            fullWidth
            startIcon={<PaymentsIcon />}
            sx={{
              justifyContent: 'flex-start',
              bgcolor: brand.softBlue,
              color: brand.primary,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: brand.borderBlue },
            }}
          >
            View Fee Structures
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            component={Link}
            href="/contact/"
            fullWidth
            startIcon={<DownloadIcon />}
            sx={{
              justifyContent: 'flex-start',
              bgcolor: brand.softBlue,
              color: brand.primary,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: brand.borderBlue },
            }}
          >
            Contact Admissions
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

const AtAGlanceSection = () => {
  const brand = usePublicBrand();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box component="section" sx={{ py: 8, bgcolor: '#f0f4f8' }}>
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          ml: '-50vw',
          px: { xs: 2, lg: 4 },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: '2%' }, alignItems: 'stretch' }}>
          {/* ── Left Promo Panel (50%) ── */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
              
              {/* Scrolling Ticker above banner */}
              <Box
                sx={{
                  bgcolor: brand.primary,
                  color: 'white',
                  py: 0.8,
                  px: 2,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-block',
                    animation: 'scrollTicker 18s linear infinite',
                    '@keyframes scrollTicker': {
                      '0%': { transform: 'translateX(100%)' },
                      '100%': { transform: 'translateX(-100%)' },
                    },
                  }}
                >
                  <Typography variant="body2" component="span" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Study Online with AIRADS Virtual Campus. | Intake Open for 2026. | Earn your Certificate, Diploma or Artisan degree from anywhere.
                  </Typography>
                </Box>
              </Box>

              {/* Banner Graphic */}
              <Box
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: 4,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url(/static/image33.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)',
                    zIndex: 1,
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 2, color: 'white' }}>
                  <Typography variant="overline" sx={{ color: brand.accent, fontWeight: 800, letterSpacing: 1 }}>
                    Study Smart; Online
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, mt: 1, lineHeight: 1.2 }}>
                    eLEARNING /<br />VIRTUAL CAMPUS
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, maxWidth: '95%', mb: 4 }}>
                    Earn your Certificate, Diploma, or Artisan degree online. <br/><br/>
                    Join our Virtual Campus for flexible, high-quality technical education.<br/><br/>
                    Study from anywhere, anytime, at your own pace.
                  </Typography>
                  
                  {/* Telephone inside banner like MUT */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: brand.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{fontWeight: 'bold', fontSize: '1.2rem', color: 'white'}}>☎</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, lineHeight: 1 }}>Call to find out more</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: brand.accent }}>+254 723 555 999</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Horizontal Pill Buttons below banner */}
              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: brand.accent,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.1,
                    '&:hover': { bgcolor: brand.accentHover },
                  }}
                >
                  Intake Open for 2026
                </Button>
                <Button
                  component={Link}
                  href="/campuses/virtual/"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: brand.primary,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.1,
                    '&:hover': { bgcolor: brand.secondary },
                  }}
                >
                  Virtual Campus
                </Button>
              </Box>
            </Box>
          </Box>

          {/* ── Right Tabs Panel (50%) ── */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column' }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: brand.accent, mb: 4 }}>
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  sx: { 
                    bgcolor: brand.accent, 
                    height: 3, 
                    borderRadius: '3px 3px 0 0',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -3,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '6px 6px 0',
                      borderStyle: 'solid',
                      borderColor: `${brand.accent} transparent transparent transparent`,
                      display: 'block',
                      width: 0,
                    }
                  },
                }}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: 0.5,
                    color: 'text.secondary',
                    '&.Mui-selected': { color: brand.accent },
                    minHeight: 48,
                  },
                }}
              >
                {tabPanels.map((tab, i) => (
                  <Tab
                    key={i}
                    label={tab.label}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Active panel */}
            <Box sx={{ flex: 1 }}>
              {tabPanels[activeTab].content({ brand })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AtAGlanceSection;
