import glob
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Fix the Special Programs/Popular Courses </div> tags
    # We find:
    # <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e3a8a' }}>{program}</Typography>
    # </div>
    content = re.sub(r'(</Typography>\s*)</div>', r'\1</Box>\n</Grid>', content)
    # Then:
    # ))}
    # </div>
    content = re.sub(r'(\)\)\}\s*)</div>', r'\1</Grid>', content)

    # 2. Fix the </ul>
    content = content.replace('</ul>', '</Box>')

    # 3. Fix the Stats Grid
    # We have:
    # <Typography variant="body2" sx={{ opacity: 0.9 }}>Students</Typography>
    # </Paper>
    content = re.sub(r'(<Typography variant="body2" sx={{ opacity: 0.9 }}>.*?</Typography>\s*)</Paper>', r'\1</CardContent>\n</Card>\n</Grid>', content)

    # 4. Fix the Campus Excellence </Paper>
    content = content.replace('</Grid>\n              </Paper>\n              </Paper>', '</Grid>\n</Paper>')

    # 5. Fix the end of file
    # <ContactCard ... />
    # </div>
    # </div>
    # </Grid>
    content = re.sub(r'(/>\s*)</div>\s*</div>\s*</Grid>', r'\1</Grid>\n</Grid>', content)
    
    # 6. Any other remaining </Paper> instead of </Grid> for the main container?
    # Let's clean up any double </Grid>
    content = content.replace('</Grid>\n</Container>\n</PageLayout>', '</Container>\n</PageLayout>')

    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob('frontend/src/pages/public/campuses/*.jsx'):
    if 'Bungoma.jsx' not in filepath:
        fix_file(filepath)

for filepath in glob.glob('frontend/src/pages/public/schools/*.jsx'):
    fix_file(filepath)
