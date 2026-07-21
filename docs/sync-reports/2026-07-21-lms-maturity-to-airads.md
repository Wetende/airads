# LMS maturity synchronization to Airads — 2026-07-21

## Scope

- Canonical LMS repository: `/home/wetende/Projects/lms`
- Canonical reviewed ref: `c45be76ad8f631079edb67746bf9c3220c437a3d`
- Airads integration baseline: `c71dfa0d0a4cecbcd8ed0c42aed142b3a45bc92c`
- Airads integration branch: `sync/lms-maturity-20260721`
- Shared capabilities: learning operations, learner management and reminders, question banks, pricing, engagement, Google Classroom, normalized course-player activities, scheduled sessions, Google Meet, and gradebook hardening

Airads was the proving deployment for this work. The accepted canonical LMS range was reconciled back into Airads without replacing Airads-owned admissions, public pages, branding, seeds, or deployment policy.

## Airads-owned adjustments

- Preserved Airads TVET instructor-approval enrollment as the deployment default.
- Made the four generic direct-enrollment admissions tests explicitly opt into open enrollment; production policy was not weakened.
- Updated shared-engine documentation to use `/home/wetende/Projects/lms` as the canonical local repository.
- Preserved all generated `static/dist` output outside the integration commits.

## Verification

- `python manage.py check`: passed
- `python manage.py makemigrations --check --dry-run`: passed
- Full Django suite: `877 passed`, `1006 warnings`, `1768.94s`
- Focused admissions suite: `21 passed`
- Full Vitest suite with a 15-second per-test timeout: `52 files passed`, `137 tests passed`, `71.55s`
- Focused rerun of the two initially resource-starved frontend files: `5 passed`
- Production Vite build: passed
- `git diff --check`: passed
- Generated-asset exclusion: passed; no `static/dist` changes were committed

The first frontend run was performed concurrently with two long Django suites and timed out in two otherwise passing files. Both files passed immediately in isolation, and the full suite then passed with a 15-second per-test timeout.

## Deferred external verification

Google Classroom, Calendar, and Meet adapters are covered by mocked automated tests. A live Google Workspace sandbox journey remains a release gate because deployment OAuth credentials were not available during this synchronization.

## Promotion status

The Airads candidate is ready for local main-branch fast-forward after this report is committed. No remote branch was pushed and no generated assets were included.

After the downstream portability scan, canonical commit `15209aad` removed an
Airads-only admissions dependency from the generic LMS checkout. That source
change is intentionally not applied here because Airads defines and uses the
dependency when creating an order from an approved admission application.
