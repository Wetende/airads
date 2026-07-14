# Crossview Inquiry Intake to Airads — 2026-07-15

## Recorded refs and commits

- Airads base: `fa9e352939b5e2897c9b8e57044e7313879a7bbf`
- Canonical Crossview shared feature: `3d043cd02e9862d1548667f5d8a7fa50eae57afe`
- Airads shared cherry-pick: `25a8bd0b` (`feat: add generic inquiry intake workflow`)
- Airads-only public wiring: `05a86143` (`feat(public): activate Airads contact inquiries`)

The canonical inquiry feature and Airads public-page integration remain in
separate commits so the shared engine can continue to move independently of
tenant presentation.

## Propagated shared feature

- Added the neutral `Inquiry` model, Django admin workflow, migration, form,
  persistence and email service, CSRF-protected `POST /api/inquiries/`
  endpoint, and backend tests.
- Added the direct frontend submission API and reusable React hook with
  loading, field-error, success, failure, and reset states.
- Added the shared API documentation and manifest entry.
- Preserved Airads environment configuration while adding the optional blank
  `INQUIRY_NOTIFICATION_EMAIL` setting. With no override, delivery falls back
  to `PlatformSettings.contact_email`.

## Airads fork integration

- Connected the existing Airads Contact form to the shared hook without
  changing its tenant-owned layout or copy.
- Added controlled form state, honeypot handling, validation feedback,
  submission loading state, success feedback, and public-page regression
  tests.
- Retained the existing Program Detail interest flow. That endpoint creates or
  resumes users, enrolls free-program applicants, initiates paid checkout, and
  supports Google sign-in recovery; replacing it with a passive inquiry would
  remove functional enrollment and commerce behavior.

## Verification evidence

All Django commands used `DEBUG=True` and
`DJANGO_SECRET_KEY=sync-audit-only` in an isolated Airads worktree.

| Gate | Result |
| --- | --- |
| `python manage.py check` | Passed: zero issues |
| `python manage.py makemigrations --check --dry-run` | Passed: no changes detected |
| Focused inquiry backend suite | Passed: `12 passed, 16 warnings in 18.63s` |
| Full `pytest -q` | Passed: `752 passed, 747 warnings in 1342.17s (0:22:22)` |
| Focused inquiry/contact Vitest suite | Passed: `3` files, `7` tests in `9.86s` |
| Full `npm test` | Passed: `28` files, `82` tests in `45.57s` |
| Contact/frontend ESLint | Passed with no findings |
| `npm run build` | Passed: `19714` modules transformed; built in `49.26s` |
| `git diff --check` | Passed with no whitespace errors |
| Shared tenant-literal scan | Passed with no Crossview or DigikaTech matches |
| Generated asset audit | Passed: no `static/dist` diff retained |

The remaining output was warning-only: existing Django 6 constraint
deprecations, factory_boy post-generation deprecations, the absent test
`staticfiles` directory, existing MUI Grid migration warnings, and stale
Browserslist data.

## Boundary conclusion

The Airads shared-engine surface now contains the same generic inquiry
capability promoted from Crossview. Airads-specific markup remains fork-only,
and no Crossview or DigikaTech tenant literals were introduced into the shared
implementation.
