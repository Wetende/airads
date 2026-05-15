import os
import re
import glob

imports = """import MainNavbar from '../../components/common/MainNavbar';
import TopNavbar from '../../components/common/TopNavbar';
import Footer from '../../components/common/AIRADSFooter';
import { Head } from "@inertiajs/react";
import { Box, Container, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { School, Business, MenuBook, Wifi, BusinessCenter, EmojiEvents, Phone, WhatsApp, LocationOn, Email, Star, Lightbulb, People, Cog, Computer, Users, Trophy } from '@mui/icons-material';

// PageLayout Component
const PageLayout = ({ children, title, subtitle, backgroundImage }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <TopNavbar />
      <MainNavbar />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          py: { xs: 12, md: 16 }, 
          px: 2, 
          overflow: 'hidden',
          background: backgroundImage 
            ? `linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%), url(${backgroundImage})` 
            : `linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)`,
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
        
        {/* Decorative Elements */}
        <Box sx={{ position: 'absolute', top: 80, left: 40, width: 128, height: 128, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <Box sx={{ position: 'absolute', bottom: 80, right: 40, width: 96, height: 96, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
      </Box>

      {/* Content */}
      <Box component="main" sx={{ position: 'relative', zIndex: 10, flexGrow: 1, mt: -6 }}>
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

// FeatureCard Component
const FeatureCard = ({ icon: Icon, title, description, className }) => {
  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 4, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ 
          width: 64, height: 64, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white',
          transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' }
        }}>
          <Icon fontSize="large" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e3a8a' }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{description}</Typography>
      </CardContent>
    </Card>
  );
};

// ContactCard Component
const ContactCard = ({ phone, whatsapp, email, address, className }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#1e3a8a' }}>Contact Information</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', flexShrink: 0 }}>
              <Phone />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Phone</Typography>
              <Typography component="a" href={`tel:${phone}`} variant="body1" sx={{ fontWeight: 500, color: '#1e3a8a', textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
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
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1e3a8a', color: 'white', flexShrink: 0 }}>
                <Email />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Email</Typography>
                <Typography component="a" href={`mailto:${email}`} variant="body1" sx={{ fontWeight: 500, color: '#1e3a8a', textDecoration: 'none', '&:hover': { opacity: 0.8 } }}>
                  {email}
                </Typography>
              </Box>
            </Box>
          )}

          {address && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#64748b', color: 'white', flexShrink: 0 }}>
                <LocationOn />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e3a8a' }}>{address}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="contained"
            fullWidth
            sx={{ py: 1.5, background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          >
            Apply Now
          </Button>
          <Button 
            variant="outlined"
            fullWidth
            sx={{ py: 1.5, borderColor: '#1e3a8a', color: '#1e3a8a', borderRadius: 2, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#1e3a8a', color: 'white' } }}
          >
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
"""

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find where the page component starts (e.g. const Eldoret = () => {)
    match = re.search(r'const [A-Za-z]+ = \(\) => {', content)
    if not match:
        return
    
    component_start_idx = match.start()
    
    # Extract the component text
    component_text = content[component_start_idx:]
    
    # Apply substitutions to component_text
    
    # Wrapper classes
    component_text = component_text.replace('<div className="max-w-6xl mx-auto px-4 py-16">', '<Container maxWidth="lg" sx={{ pb: 10 }}>')
    component_text = component_text.replace('<div className="grid lg:grid-cols-3 gap-12 mb-16">', '<Grid container spacing={6}>')
    component_text = component_text.replace('<div className="lg:col-span-2 space-y-12">', '<Grid item xs={12} lg={8}><Box sx={{ display: \'flex\', flexDirection: \'column\', gap: 6 }}>')
    # Close the extra Box for space-y-12
    # The original structure:
    # <div className="lg:col-span-2 space-y-12">
    #   ...
    # </div>
    # <div>
    #   <ContactCard ... />
    # </div>
    # We replace contact sidebar wrapper:
    component_text = re.sub(r'</div>\s*<div>\s*<ContactCard', r'</Box></Grid>\n<Grid item xs={12} lg={4}>\n<ContactCard', component_text)
    component_text = re.sub(r'</ContactCard>\s*</div>', r'</ContactCard>\n</Grid>', component_text)
    
    # Fix the final </div> to </Container>
    component_text = re.sub(r'</div>\s*</PageLayout>', r'</Grid>\n</Container>\n</PageLayout>', component_text)
    
    # Sub-sections
    component_text = component_text.replace('<Card className="bg-white shadow-lg border-0">', '<Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: 4, boxShadow: \'0 10px 15px -3px rgba(0, 0, 0, 0.1)\' }}>')
    component_text = component_text.replace('<CardContent className="p-8">', '')
    component_text = component_text.replace('</CardContent>\n            </Card>', '</Paper>')
    component_text = component_text.replace('</CardContent>\n            </Paper>', '</Paper>')
    component_text = component_text.replace('</Card>', '</Paper>')
    component_text = component_text.replace('</CardContent>', '')
    
    component_text = re.sub(r'<h2 className="text-3xl font-bold mb-6" style={{ color: \'#1e3a8a\' }}>(.*?)</h2>', r'<Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: \'#1e3a8a\' }}>\1</Typography>', component_text)
    component_text = re.sub(r'<h2 className="text-3xl font-bold mb-8 text-center" style={{ color: \'#1e3a8a\' }}>(.*?)</h2>', r'<Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: \'center\', color: \'#1e3a8a\' }}>\1</Typography>', component_text)

    # Paragraphs in About
    component_text = component_text.replace('<div className="prose prose-lg text-gray-600 max-w-none">', '')
    component_text = component_text.replace('<p className="mb-4">', '<Typography variant="body1" sx={{ color: \'text.secondary\', mb: 2, lineHeight: 1.8 }}>')
    component_text = component_text.replace('<p>', '<Typography variant="body1" sx={{ color: \'text.secondary\', lineHeight: 1.8 }}>')
    component_text = component_text.replace('</p>', '</Typography>')

    # Features Grid
    component_text = component_text.replace('<div className="grid md:grid-cols-2 gap-6">', '<Grid container spacing={3}>')
    component_text = re.sub(r'<FeatureCard key=\{index\} \{\.\.\.feature\} />', r'<Grid item xs={12} sm={6} key={index}><FeatureCard {...feature} /></Grid>', component_text)
    # The closing div for features grid
    component_text = component_text.replace('</div>\n            </div>', '</Grid>\n            </Box>')
    component_text = component_text.replace('<div>\n              <Typography variant="h4"', '<Box>\n              <Typography variant="h4"')

    # Courses Grid
    component_text = component_text.replace('<div className="grid md:grid-cols-2 gap-4">', '<Grid container spacing={2}>')
    component_text = re.sub(r'<div key=\{index\} className="flex items-center gap-3 p-4 rounded-lg" style=\{\{ backgroundColor: \'#f1f5f9\' \}\}>', r'<Grid item xs={12} sm={6} key={index}>\n<Box sx={{ display: \'flex\', alignItems: \'center\', gap: 2, p: 2, borderRadius: 2, bgcolor: \'#f1f5f9\' }}>', component_text)
    component_text = re.sub(r'<Trophy className="w-5 h-5 flex-shrink-0" style=\{\{ color: \'#1e3a8a\' \}\} />', r'<EmojiEvents sx={{ color: \'#1e3a8a\' }} />', component_text)
    component_text = re.sub(r'<Star className="w-5 h-5 flex-shrink-0" style=\{\{ color: \'#1e3a8a\' \}\} />', r'<Star sx={{ color: \'#1e3a8a\' }} />', component_text)
    component_text = re.sub(r'<span className="font-medium" style=\{\{ color: \'#1e3a8a\' \}\}>(.*?)</span>', r'<Typography variant="body2" sx={{ fontWeight: 600, color: \'#1e3a8a\' }}>\1</Typography>', component_text)
    component_text = component_text.replace('</div>\n                  ))}</div>', '</Box>\n</Grid>\n))}</div>')
    component_text = component_text.replace('</div>\n                </div>', '</Grid>\n              </Paper>')
    component_text = component_text.replace('))}</div>', '))}</Grid>')

    # Campus Excellence Grid
    component_text = component_text.replace('<div className="grid md:grid-cols-2 gap-8">', '<Grid container spacing={4}>')
    component_text = re.sub(r'<div>\n\s*<h3 className="text-xl font-semibold mb-4" style={{ color: \'#1e3a8a\' }}>(.*?)</h3>', r'<Grid item xs={12} sm={6}>\n<Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: \'#1e3a8a\' }}>\1</Typography>', component_text)
    component_text = component_text.replace('<ul className="space-y-2 text-gray-600">', '<Box component="ul" sx={{ pl: 0, listStyle: \'none\', color: \'text.secondary\' }}>')
    component_text = component_text.replace('<li>', '<Typography component="li" sx={{ mb: 1, lineHeight: 1.6 }}>')
    component_text = component_text.replace('</li>', '</Typography>')
    component_text = component_text.replace('</ul>\n                  </div>', '</Box>\n</Grid>')

    # Stats Grid
    component_text = component_text.replace('<div className="grid md:grid-cols-3 gap-6">', '<Grid container spacing={3}>')
    
    # Stat Cards
    component_text = component_text.replace('<Card className="text-white shadow-lg border-0" style={{ background: \'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)\' }}>', '<Grid item xs={12} sm={4}>\n<Card elevation={0} sx={{ background: \'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)\', color: \'white\', textAlign: \'center\', borderRadius: 4 }}>')
    component_text = component_text.replace('<Card className="bg-green-500 text-white shadow-lg border-0">', '<Grid item xs={12} sm={4}>\n<Card elevation={0} sx={{ bgcolor: \'#22c55e\', color: \'white\', textAlign: \'center\', borderRadius: 4 }}>')
    component_text = component_text.replace('<Card className="text-white shadow-lg border-0" style={{ backgroundColor: \'#1e3a8a\' }}>', '<Grid item xs={12} sm={4}>\n<Card elevation={0} sx={{ bgcolor: \'#1e3a8a\', color: \'white\', textAlign: \'center\', borderRadius: 4 }}>')
    
    component_text = component_text.replace('<CardContent className="p-6 text-center">', '<CardContent sx={{ p: 3 }}>')
    component_text = re.sub(r'<div className="text-3xl font-bold mb-2">(.*?)</div>', r'<Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>\1</Typography>', component_text)
    component_text = re.sub(r'<div className="text-white/90">(.*?)</div>', r'<Typography variant="body2" sx={{ opacity: 0.9 }}>\1</Typography>', component_text)
    
    component_text = re.sub(r'</CardContent>\n              </Paper>', r'</CardContent>\n</Card>\n</Grid>', component_text)
    component_text = component_text.replace('</CardContent>\n</Card>\n</Grid>\n            </div>', '</CardContent>\n</Card>\n</Grid>\n</Grid>')

    # Replace Lucide icons in features array
    component_text = component_text.replace('GraduationCap', 'School')
    component_text = component_text.replace('Building2', 'Business')
    component_text = component_text.replace('Building', 'Business')
    component_text = component_text.replace('BookOpen', 'MenuBook')

    new_content = imports + "\n" + component_text
    
    with open(filepath, 'w') as f:
        f.write(new_content)

for filepath in glob.glob('frontend/src/pages/public/campuses/*.jsx'):
    if 'Bungoma.jsx' not in filepath:
        process_file(filepath)

for filepath in glob.glob('frontend/src/pages/public/schools/*.jsx'):
    process_file(filepath)
