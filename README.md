# Airads

The official web platform and Learning Management System for Airads College.
It combines the Airads public website, campuses and admissions workflows,
Virtual Campus, and the shared LMS experience in one Django and React
application.

## Product scope

Airads owns the complete branded experience for its learners, applicants,
staff, and visitors:

- College website, schools, campuses, news, and institutional content
- Admissions information, applications, and applicant onboarding
- Physical-campus and Virtual Campus course discovery
- Student, instructor, and administrator dashboards
- Online course creation, enrollment, delivery, and completion
- Payments, reports, certificates, inquiries, reviews, and notifications

Airads is a dedicated product. Its name, public copy, campuses, admissions
rules, contact information, and branded assets belong in this repository.

## Relationship to LMS

Airads uses the shared engine maintained in the LMS repository at
`/home/wetende/Projects/crossview`.

- `origin` is `Wetende/airads` and receives Airads work.
- `upstream` points to the LMS repository and supplies accepted engine updates.
- Generic builder, player, assessment, progression, dashboard, or commerce
  improvements must remain reusable and free of Airads branding.
- Airads public pages, admissions, campuses, copy, emails, and assets stay here.

If a generic LMS capability is first developed in Airads, split it into a clean
shared-engine commit, promote it to LMS, verify it there, and then synchronize
the accepted implementation back into both product repositories.

See [`docs/airads-fork-sync.md`](docs/airads-fork-sync.md) and
[`docs/shared-engine-playbook.md`](docs/shared-engine-playbook.md).

## Core LMS capabilities

- Course and program management
- Course builder with sections, lessons, assessments, and resources
- Course player with progress, prerequisites, and drip access
- Enrollment, grading, rubrics, reviews, and certificates
- Student, instructor, and administrator dashboards
- Orders, payments, reporting, and notifications

## Technology

| Layer           | Technology                                               |
| --------------- | -------------------------------------------------------- |
| Backend         | Django 5, Django REST Framework where an API is required |
| Web application | React 19, Inertia.js, MUI, Tailwind CSS                  |
| Database        | PostgreSQL in production, SQLite for local development   |
| Build           | Vite 7                                                   |
| Testing         | pytest, pytest-django, Vitest, Testing Library           |

Inertia.js is the primary web data path: Django views return React pages with
their props directly.

## Repository boundaries

Airads-specific surfaces include:

- `frontend/src/pages/public/`
- Airads navigation, footer, logos, colors, copy, and media
- Campus, school, admissions, news, career, and Virtual Campus workflows
- Airads contact defaults, emails, and production deployment configuration

Shared LMS surfaces include the course builder, course player, curriculum,
assessments, progression, enrollment, certifications, reviews, commerce,
reports, and generic dashboard behavior.

Do not mix product-specific and shared-engine work in one commit.

## Local setup

### Prerequisites

- Python 3.10+
- Node.js 20+
- PostgreSQL for production, or SQLite for local development

```bash
git clone git@github.com:Wetende/airads.git
cd airads

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
npm install

cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
```

## Development

Run Django and Vite in separate terminals:

```bash
source .venv/bin/activate
python manage.py runserver
```

```bash
npm run dev
```

Open `http://localhost:8000`.

## Verification

Prefer focused Django and React tests, then expand the suite according to the
risk of the change. Use browser automation only when the behavior genuinely
depends on a real browser.

```bash
source .venv/bin/activate
python manage.py check
python manage.py makemigrations --check --dry-run
python -m pytest -q
npm test
npm run build
```

## Synchronizing shared LMS work

Before pulling or promoting shared work:

```bash
git status --short --branch
git remote -v
git fetch upstream
```

Follow [`docs/upstream-sync.md`](docs/upstream-sync.md). Preserve Airads public
and admissions files during conflict resolution, and accept the canonical LMS
behavior on shared surfaces.

## Documentation

| Document                                                                   | Purpose                                |
| -------------------------------------------------------------------------- | -------------------------------------- |
| [`docs/airads-fork-sync.md`](docs/airads-fork-sync.md)                     | Airads remotes and sync boundaries     |
| [`docs/shared-engine-playbook.md`](docs/shared-engine-playbook.md)         | Cross-repository change classification |
| [`docs/shared-surface-manifest.md`](docs/shared-surface-manifest.md)       | Shared and product-only paths          |
| [`docs/course-builder-taxonomy.md`](docs/course-builder-taxonomy.md)       | Course builder structure               |
| [`docs/admissions-forms-migration.md`](docs/admissions-forms-migration.md) | Admissions workflow context            |
| [`docs/paystack-webhook-runbook.md`](docs/paystack-webhook-runbook.md)     | Payment webhook operations             |
