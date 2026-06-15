import os
import re

def inject_lazy_loading():
    src_dir = '/home/wetende/Projects/airads/frontend/src'
    
    # We will look for component="img" and <img and ensure they have loading="lazy"
    patterns = [
        # Match <CardMedia component="img" or <Box component="img" etc that doesn't already have loading=
        (re.compile(r'(component="img")(?![^>]*loading=)', re.IGNORECASE), r'\1 loading="lazy"'),
        # Match <img that doesn't already have loading=
        (re.compile(r'(<img\s+)(?![^>]*loading=)', re.IGNORECASE), r'\1loading="lazy" '),
    ]
    
    count = 0
    files_changed = 0

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    for pattern, replacement in patterns:
                        content, _ = pattern.subn(replacement, content)
                    
                    if content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        count += 1 # we can't easily count subs per file with multiple patterns simply, just count files
                        files_changed += 1
                        print(f"Injected lazy loading in {file}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

    print(f"\nDone! Injected lazy loading in {files_changed} files.")

if __name__ == '__main__':
    inject_lazy_loading()
