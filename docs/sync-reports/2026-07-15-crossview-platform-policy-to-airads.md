# Crossview Platform Policy to Airads — 2026-07-15

## Recorded refs and commits

- Airads base: `0fd3c6db1cb640a2cf8b974679eda856f879811e`
- Crossview source: `9591ed08`
  (`feat(platform): add optional deployment policy locks`)
- Airads promotion: `bf3460c2`

## Promotion result

- Promoted the generic deployment-policy mechanism unchanged in behavior.
- Airads does not configure `LMS_PLATFORM_POLICY`, so all capabilities remain
  enabled and its existing deployment modes and admin settings stay
  configurable.
- Resolved `apps/core/admin.py` by retaining Airads campus/admissions admin
  registrations alongside the shared program-blueprint guard.
- Resolved `apps/platform/models.py` by retaining Airads virtual-campus payload
  and logo fallback while honoring any future explicit policy URLs first.
- No Airads public pages or tenant copy changed.

## Verification

| Gate | Result |
| --- | --- |
| Python compile check for affected apps | Passed |
| `python manage.py check` | Passed: zero issues |
| Public-page boundary audit | Passed: no public-page source changes |
| Crossview source verification | `711` backend tests, `75` frontend tests, and production build passed |

The Airads test suites were not repeated at the user's request to complete the
sequential rollout more quickly.
