# LMS dashboard reskin to Airads

## Scope

- Source repository: `/home/wetende/Projects/lms`
- Source commit: `81ffa984` (`feat(lms): adopt green authenticated dashboard reskin`)
- Destination repository: `/home/wetende/Projects/airads`
- Destination base: `f110616a`
- Integration branch: `sync/lms-dashboard-reskin-20260723`

The canonical authenticated dashboard shell and the student, instructor, and administrator dashboard presentations were promoted into Airads. Existing routes, permissions, feature gates, Inertia props, and backend behavior were retained.

## Product adaptation

- Replaced the generic LMS mark and name with the Airads College logo and fixed product identity.
- Set the Airads shell and dashboard palette to navy `#082F63`, blue `#0C5AA6`, and red accent `#EF2026`.
- Preserved the Airads-only Admissions navigation entry and `/admin/admissions/` route.
- Adapted two icon imports to modules available in Airads' installed MUI icon version.
- Did not touch or promote the separate College Portal implementation, product pages, backend admissions implementation, deployment configuration, or LMS generated bundles.

## Verification

- `git diff --check`: passed for source files.
- Scoped ESLint for all promoted dashboard, layout, navigation, and theme files: passed.
- Focused Vitest dashboard/layout/color suite: 13 passed, with existing MUI prop-forwarding warnings.
- Django system check: passed.
- Migration drift check: passed; no changes detected.
- Full Django suite: 885 passed, 1,014 existing warnings.
- Full Vitest suite: 146 passed, 1 failed. The failure is the pre-existing date-sensitive `ScheduledSessionRenderer` test whose fixed July 21, 2026 session is now in the past; the same failure was reproduced on untouched Airads `main`.
- Production Vite build: passed; 19,748 modules transformed.
- Source scan for LMS names and green palette values in promoted files: clean.

Generated `static/dist` output is committed separately from source changes.
