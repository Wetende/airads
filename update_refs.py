import os
import re

def update_references():
    src_dir = '/home/wetende/Projects/airads/frontend/src'
    # Match any /static/... ending with jpg, jpeg, png (case insensitive)
    pattern = re.compile(r'(/static/[^"\']+)\.(jpg|jpeg|png)', re.IGNORECASE)
    
    count = 0
    files_changed = 0

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content, subs = pattern.subn(r'\1.webp', content)
                    
                    if subs > 0:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        count += subs
                        files_changed += 1
                        print(f"Updated {subs} reference(s) in {file}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

    print(f"\nDone! Replaced {count} references across {files_changed} files.")

if __name__ == '__main__':
    update_references()
