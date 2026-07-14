# Crossview to Airads Shared-Engine Sync — 2026-07-14

## Recorded refs

- Canonical repository: `Wetende/crossview`
- Canonical ref: `main` at `7f225cd354ae21a1e9c78821ee966d24a580e680`
- Destination repository: `Wetende/airads`
- Destination reviewed local base: `main` at `1621fc12f9e55906a81a9fce463808c6a555a866`
- Destination remote base at audit start: `origin/main` at `b64483aab99e1d4a497b7a5a1b8b534e10ea9f59`
- Reviewed integration head before this report: `bf66679dab31083a0ffcceaf3c3644b15d946df0`

Both remote refs were fetched again after verification and remained at the
recorded commits. The sync ran in an isolated Airads worktree. The original
Airads worktree, including its unrelated dirty files and stash, was not
modified.

## Canonical corrections propagated

- Payment-enabled revenue fixtures.
- Two-tier Program/Module/Lesson taxonomy fixtures and section-scoped file
  settings.
- The repaired legacy blueprint migration and current curriculum regression
  contracts.
- Assessment scoring and certification fixture alignment.
- Image-matching editor import and value synchronization fixes.
- Immediate quiz submission of the latest selected answer, including its
  frontend regression test.
- Canonical shared-surface manifest, shared-engine playbook, and sequential
  sync runbook. The former Airads-specific runbook is retained separately as
  `docs/airads-fork-sync.md`.

Airads already contained the accepted LMS implementations promoted to
Crossview, so those files were not reapplied merely to create matching commit
IDs.

## Fork behavior retained

- Airads admissions, campus, virtual-campus, public marketing, and public
  reporting surfaces.
- Airads notification/email copy, tenant logo/contact defaults, category
  seeds, and admissions redirects.
- Airads pathway classification extensions.
- Airads' independently adopted MUI 9/global typography differences.
- The Airads root route's `Public/Home` component contract; its stale test was
  corrected instead of replacing the fork's public page with Crossview's
  `Public/Landing`.
- Generated `static/dist` output. It was built for verification and then
  restored/removed from the source-only sync branch.

## Boundary audit

- `apps/assessments/`, `apps/curriculum/`, `apps/reviews/`, the shared quiz
  feature, the accepted player overview, and shared course-builder pages match
  canonical Crossview at the reviewed refs.
- Remaining differences under mixed/shared roots were reviewed as the fork
  behavior listed above rather than overwritten wholesale.
- Added non-documentation lines in `1621fc12..HEAD` were scanned for Airads,
  DigikaTech, and Crossview tenant/domain literals; the scan returned no
  matches.
- `git diff --check` passed.
- Only the isolated worktree's ignored `node_modules` symlink remained
  untracked after generated build cleanup.

## Verification evidence

All Django commands used `DEBUG=True` and
`DJANGO_SECRET_KEY=sync-audit-only`.

| Gate | Result |
| --- | --- |
| `python manage.py check` | Passed: `System check identified no issues (0 silenced).` |
| `python manage.py makemigrations --check --dry-run` | Passed: `No changes detected` |
| `pytest -q` | Passed: `740 passed, 750 warnings in 1593.16s (0:26:33)` |
| `npm test` | Passed: `25` files, `75` tests in `36.48s` |
| `npm run build` | Passed: `19712` modules transformed; built in `34.58s` |

The warnings were pre-existing deprecation/test-environment warnings and React
DOM-prop warnings from frontend mocks; no gate reported an error.

## Propagation decision

This reviewed Airads head is accepted for `airads/main`, subject to a final
remote-ref freshness check. DigikaTech remains the next sequential downstream
target and must be verified independently before shared-engine parity is
declared complete.
