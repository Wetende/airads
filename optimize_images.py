import os
from PIL import Image

def optimize_images():
    static_dir = '/home/wetende/Projects/airads/static'
    MAX_WIDTH = 1200
    
    count = 0
    saved_bytes = 0
    
    for filename in os.listdir(static_dir):
        ext = os.path.splitext(filename)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png']:
            filepath = os.path.join(static_dir, filename)
            out_filename = os.path.splitext(filename)[0] + '.webp'
            out_filepath = os.path.join(static_dir, out_filename)
            
            try:
                original_size = os.path.getsize(filepath)
                with Image.open(filepath) as img:
                    # Convert to RGB if necessary (e.g. RGBA for PNGs)
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    
                    # Resize if wider than MAX_WIDTH
                    if img.width > MAX_WIDTH:
                        ratio = MAX_WIDTH / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                        
                    # Save as WebP
                    img.save(out_filepath, 'webp', quality=80)
                    
                new_size = os.path.getsize(out_filepath)
                saved_bytes += (original_size - new_size)
                count += 1
                print(f"Optimized: {filename} -> {out_filename} (Saved { (original_size - new_size) / 1024:.1f} KB)")
            except Exception as e:
                print(f"Error processing {filename}: {e}")
                
    print(f"\nDone! Optimized {count} images.")
    print(f"Total space saved: {saved_bytes / (1024*1024):.2f} MB")

if __name__ == '__main__':
    optimize_images()
