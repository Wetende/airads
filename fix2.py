import glob
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix color quotes
    content = content.replace(r"\'#1e3a8a\'", "'#1e3a8a'")
    content = content.replace(r"\'#22c55e\'", "'#22c55e'")
    content = content.replace(r"\'text.secondary\'", "'text.secondary'")
    content = content.replace(r"\'center\'", "'center'")
    content = content.replace(r"\'flex\'", "'flex'")
    content = content.replace(r"\'column\'", "'column'")
    content = content.replace(r"\'#f1f5f9\'", "'#f1f5f9'")
    
    # In my previous script, I did:
    # component_text = component_text.replace('<p className="mb-4">', '<Typography variant="body1" sx={{ color: \'text.secondary\', mb: 2, lineHeight: 1.8 }}>')
    # component_text = component_text.replace('<p>', '<Typography variant="body1" sx={{ color: \'text.secondary\', lineHeight: 1.8 }}>')
    # component_text = component_text.replace('</p>', '</Typography>')

    # So if there are any remaining <p className="...">, they were not replaced.
    # But </p> WAS replaced. So they now look like <p className="..."> ... </Typography>
    # We should find <p ...> and replace with <Typography ...>
    content = re.sub(r'<p\s+className="[^"]*">', r'<Typography variant="body1" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}>', content)
    content = re.sub(r'<p>', r'<Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8 }}>', content)
    
    # Just in case there are any remaining </p>
    content = content.replace('</p>', '</Typography>')

    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob('frontend/src/pages/public/campuses/*.jsx'):
    fix_file(filepath)

for filepath in glob.glob('frontend/src/pages/public/schools/*.jsx'):
    fix_file(filepath)
