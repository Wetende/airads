"""
Fix Blueprint Script - Run on Production
=========================================
This script fixes blueprints that have more than 2 hierarchy levels.
Per the course-builder-taxonomy.md docs, blueprints must have exactly 2 levels:
  - [0]: Container (e.g., "Module", "Unit", "Section")
  - [1]: Content (e.g., "Lesson", "Session", "Topic")

The program.level field is used for academic level (Year 1, Diploma, etc.)
which is NOT part of the curriculum tree.

Usage (run via Django shell or as management command):
    python manage.py shell < scripts/fix_blueprints.py
    
Or via cPanel Python app:
    Enter the path: /path/to/scripts/fix_blueprints.py
"""

from apps.blueprints.models import AcademicBlueprint

print("=" * 60)
print("BLUEPRINT FIX SCRIPT")
print("=" * 60)

# Define the correct 2-tier structure for each blueprint
CORRECTIONS = {
    "Bible College Standard": ["Module", "Lesson"],
    "Online Self-Paced": ["Section", "Lesson"],
    # Add other blueprints as needed
}

for blueprint in AcademicBlueprint.objects.all():
    current = blueprint.hierarchy_structure
    print(f"\nBlueprint: {blueprint.name} (ID: {blueprint.id})")
    print(f"  Current structure: {current} ({len(current)} levels)")
    
    if len(current) == 2:
        print("  ✓ Already correct (2 levels)")
        continue
    
    # Check if we have a predefined correction
    if blueprint.name in CORRECTIONS:
        new_structure = CORRECTIONS[blueprint.name]
        print(f"  → Will update to: {new_structure}")
        
        # Uncomment the lines below to actually apply the fix
        # blueprint.hierarchy_structure = new_structure
        # blueprint.save(update_fields=['hierarchy_structure'])
        # print("  ✓ FIXED!")
        print("  ⚠ DRY RUN - Uncomment lines above to apply fix")
    else:
        print(f"  ⚠ No correction defined for '{blueprint.name}'")
        print(f"    Add it to CORRECTIONS dict with 2-level structure")

print("\n" + "=" * 60)
print("DONE - Review output above")
print("=" * 60)
