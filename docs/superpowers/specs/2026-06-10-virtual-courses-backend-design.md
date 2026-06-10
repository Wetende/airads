# Virtual Campus Courses Backend Design
**Date**: 2026-06-10

## Goal
Connect the `VirtualCourses.jsx` listing page to the Django backend so it renders actual course data from the database.

## Approach: All-Inclusive
Any `Program` added to the database that is marked as `is_published=True` will automatically appear in the Virtual Campus course catalog. There is no need for a dedicated "Virtual" flag or category constraint, making administration simple.

## Architecture

### 1. View: `airads_virtual_courses`
- File: `apps/core/views.py`
- Behavior: Mimic the logic of the existing `public_programs_list` view.
- Query: `Program.objects.filter(is_published=True)`
- Filters Support: Search by `name`, filter by `category`, filter by `level`.
- Pagination: Use existing `_build_pagination` utility.
- Return: `render(request, "Public/VirtualCourses", props)`

### 2. URL Routing
- File: `apps/core/urls.py`
- Path: `path("campuses/virtual/courses/", views.airads_virtual_courses, name="airads.virtual_courses")`
- Placement: Must be placed *before* the generic `<slug:slug>` catch-all route for campuses to prevent route shadowing.

### 3. Updating the Main Landing Page (`Virtual.jsx`)
- The current `airads_campus_detail` view renders `Public/Virtual` but doesn't pass the `programs` data required by the `VirtualAcademicProgramsSection`.
- We will update `airads_campus_detail` so that if `slug == 'virtual'`, we append the necessary `programs` payload to the props before rendering.

## Error Handling & Edge Cases
- Missing Programs: The React components handle empty arrays gracefully with `EmptyState`.
- Route Precedence: Placing the new route before `<slug>` avoids 404s.

## Testing Strategy
- Navigate to `/campuses/virtual/courses/` and verify the page renders without errors.
- Confirm any manual courses added via the Django Admin panel appear on the Virtual Campus catalog.
