# Crossview Course Presentation to Airads — 2026-07-16

## Recorded refs and commits

- Airads base: `4937c6f55603057cb4d2a6b2df6a072055dd0085`
- Shared presentation cherry-pick: `100eaef9`
- Shared MUI compatibility cherry-pick: `a24ccce3`
- Airads public-page wiring: `629002391187654bcfa912cba015ed5bae3742e2`

## Product-preserving promotion

- Adopted the shared course details and course-content presentation.
- Retained `MainNavbar`, `VirtualNavbar`, `AIRADSFooter`, the enrollment
  interest workflow, wishlist behavior, and the existing 4/8 content grid.
- Kept enrollment actions on white and confined the grey block to course
  metrics.
- Preserved user-owned `lms-inspiration/` references and did not commit
  generated Playwright or `static/dist` artifacts.

## Playwright evidence

Validated `/programs/introduction-to-ai/` through the Vite development source.

| Viewport | Public page overflow | Tab behavior |
| --- | --- | --- |
| 1500px | None | Six tabs fit |
| 1024px | None | Six tabs fit |
| 768px | None; content stacks | Six tabs fit |
| 375px | None | Tab list scrolls: 479px content in 263px viewport |

Additional checks:

- Arrow-key tab focus moved from Curriculum to Resources.
- Enter collapsed and reopened the curriculum section.
- The first curriculum section was expanded initially.
- Course details used the theme grey surface and metric separators.
- Curriculum and settings builder sidebars both computed to exactly 360px.
- The editor remained visible and usable at 1024px.
- A temporary instructor session used for builder QA was deleted afterward.

## Verification evidence

| Gate | Result |
| --- | --- |
| Focused presentation and builder tests | Passed: 7 tests |
| Full Vitest | Passed: 29 files, 88 tests |
| Changed-file ESLint | Passed |
| Full ESLint | Existing backlog: 301 errors, 16 warnings in untouched files |
| Production build | Passed: 19,718 modules transformed |
| `python manage.py check` | Passed: zero issues |
| Migration drift | Passed: no changes detected |
| Full backend pytest | 757 passed; one local URL-config mismatch |
| URL-config test with production base URL | Passed: 1 test |
| `git diff --check` | Passed |
| Generated asset audit | Passed: no `static/dist` changes retained |

The backend mismatch expects `https://virtual.airads.ac.ke` while the local
checkout intentionally sets `http://virtual.localhost:8000`. The same test
passes when `VIRTUAL_CAMPUS_BASE_URL=https://virtual.airads.ac.ke` is supplied.
