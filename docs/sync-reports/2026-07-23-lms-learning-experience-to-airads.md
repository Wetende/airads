# LMS learning experience synchronization to Airads

## Scope

- Canonical source repository: `/home/wetende/Projects/lms`
- Canonical reviewed source range: `f9148dc9..9c8af82d` (selected commits)
- Destination repository: `/home/wetende/Projects/airads`
- Destination base: `2bf064313512cd1f5f28a9a0e659ae5264de6cc4`
- Destination source head: `7e027c3e`

The five canonical source/test commits were replayed in order after LMS
verification. The LMS promotion report and LMS-generated bundles were not
copied; Airads generated its own product bundle from the reconciled source.

## Product preservation

- Retained the Airads authenticated dashboard shell and fixed navy, blue and red
  palette.
- Added the shared current-learning experience inside Airads's existing student
  dashboard rather than replacing the dashboard.
- Preserved the Airads college portal, admissions navigation and backend,
  public campus pages, product branding and deployment configuration.
- The shared additions continue to consume MUI theme tokens, so no canonical
  LMS green values were introduced into Airads source.
- Existing APIs and course-player URLs remain backward-compatible.

## Verification

- `git diff --check`: passed.
- Scoped ESLint for synchronized frontend source: passed.
- Django system check: passed with zero issues.
- Migration drift check: passed; no changes detected.
- Full frontend suite: **61 files passed, 161 tests passed**.
- Full backend suite: **889 passed, 658 warnings in 23m45s** with
  `VIRTUAL_CAMPUS_BASE_URL=https://virtual.airads.ac.ke`.
- The first run inherited the developer-only `.env` value
  `http://virtual.localhost:8000` and consequently produced one expected-domain
  assertion failure with 888 other tests passing. The failing redirect passed
  in isolation and in the full rerun once the production URL required by the
  test was supplied; application source and the local `.env` were not changed.
- Production Vite build: passed.

The Airads `static/dist` output is committed separately after source
synchronization and product verification.
