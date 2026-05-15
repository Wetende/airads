import glob
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # The </div> closing the stats grid
    content = re.sub(r'</CardContent>\n</Card>\n</Grid>\n\s*</div>', '</CardContent>\n</Card>\n</Grid>\n</Grid>', content)
    
    # And closing the main grid before Container
    content = content.replace('</Grid>\n</Container>\n</PageLayout>', '</Grid>\n</Grid>\n</Container>\n</PageLayout>')
    content = content.replace('          </Grid>\n</Container>\n</PageLayout>', '          </Grid>\n</Grid>\n</Container>\n</PageLayout>')
    
    # Also fix some missed PageLayouts if Hero sections had different closing
    # Specifically School pages might not have a </Grid> from ContactCard if they don't have a ContactCard!
    # Wait, do schools have ContactCard?
    
    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob('frontend/src/pages/public/campuses/*.jsx'):
    fix_file(filepath)

for filepath in glob.glob('frontend/src/pages/public/schools/*.jsx'):
    fix_file(filepath)
