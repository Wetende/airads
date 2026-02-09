# Opus 4.6 Bug Review: Confirmation + Work Todo

Date reviewed: 2026-02-09

## Confirmed Critical

- [x] Restore `QuestionImageMatchingPair` model (or remove all references consistently).
  - Evidence: `apps/assessments/question_bank_service.py:11`, `apps/assessments/question_bank_service.py:102`, missing in `apps/assessments/models.py`.
  - Runtime impact: `ImportError` when loading assessments views.

- [x] Fix invalid `_get_post_data` imports from `apps.core.views`.
  - Evidence: `apps/progression/views.py:1843`, `apps/progression/views.py:2185`.
  - `apps/core/views.py` has no `_get_post_data`; helper is `get_post_data` in `apps/core/utils.py:4`, plus local helper exists at `apps/progression/views.py:2335`.
  - Runtime impact: POST paths for gradebook save and practicum review crash.

- [x] Replace invalid `Question` attribute usage in instructor student-progress view.
  - Evidence: `apps/progression/views.py:1998`, `apps/progression/views.py:2006`, `apps/progression/views.py:2008`, `apps/progression/views.py:2009`.
  - `correct_answer` and `explanation` do not exist on `Question`; `question.options` is a manager, not serialized data.

- [x] Add missing `Q` import in practicum rubric admin views.
  - Evidence: `apps/practicum/views_admin.py:63` uses `Q(...)` without import.
  - Runtime impact: rubric list path for non-superadmin branches can raise `NameError`.

- [x] Remove insecure default `SECRET_KEY` fallback and require env-provided key outside local dev.
  - Evidence: `config/settings/settings.py:26`.

## Confirmed High

- [ ] Stop using DRF `Response` in plain Django/Inertia views.
  - Evidence: `apps/assessments/views.py:47`, `apps/assessments/views.py:52`, `apps/assessments/views.py:56`, `apps/assessments/views.py:61`, `apps/assessments/views.py:92`, `apps/assessments/views.py:99`, `apps/assessments/views.py:101`.

- [ ] Prevent answer leakage from question APIs.
  - Evidence:
    - `apps/assessments/serializers.py:190` exposes `is_correct`.
    - `apps/assessments/serializers.py:213` exposes `answer_data`.
    - `apps/assessments/views.py:146` + `apps/assessments/views.py:150` exposes questions to any authenticated user.

- [ ] Add authorization checks in question mutation endpoints.
  - Evidence:
    - `apps/assessments/views.py:158` (`reorder`) trusts `quiz_id`.
    - `apps/assessments/views.py:197` (`add_to_quiz`) allows writing to any quiz by id.

- [ ] Add `rubric` grading type support to config validator.
  - Evidence: `apps/assessments/validators.py:34-41` accepts only `weighted|competency|pass_fail`.
  - Note: strategy factory supports rubric (`apps/assessments/strategies.py:267`, `apps/assessments/strategies.py:290`).

- [ ] Remove class shadowing of `RubricService` in practicum services.
  - Evidence:
    - Import: `apps/practicum/services.py:13`
    - Redefinition: `apps/practicum/services.py:19`

- [ ] Delete unreachable block after early return in instructor student detail.
  - Evidence: `apps/progression/views.py:1671-1686` returns, then dead code starts at `apps/progression/views.py:1688`.

- [ ] Remove debug `print()` statements.
  - Evidence: `apps/progression/views.py:1451`, `apps/progression/views.py:1492`.

## Confirmed Medium

- [ ] Review/align sequential lock logic source-of-truth.
  - Evidence: `apps/progression/views.py:746` defaults sequential lock to true from `node.completion_rules`.
  - Risk: inconsistent with `ProgressionEngine` blueprint-driven progression rules (`apps/progression/services.py:467-470`).

- [ ] Optimize `CurriculumNode.get_depth()` and callsites for deep tree traversals.
  - Evidence: iterative parent access in `apps/curriculum/models.py:52-59`; repeated calls can produce N+1 without parent preloading.

- [ ] Optimize `ProgressionEngine.get_unlock_status()` to avoid per-node queries.
  - Evidence:
    - Loop: `apps/progression/services.py:543-553`
    - `can_access()` queries `NodeCompletion` each call: `apps/progression/services.py:459-464`
    - `SequentialLockChecker` queries siblings per call: `apps/progression/services.py:55-58`

- [ ] Decide whether empty programs should report `0.0` instead of `100.0` progress.
  - Evidence: `apps/progression/services.py:244-246`.

- [ ] Add explicit decorator or centralized auth guard for admin certificates.
  - Evidence: no `@login_required` on `apps/certifications/views.py:120` (manual checks exist at `apps/certifications/views.py:133-138`).

- [ ] Add rate limiting/abuse protection for public certificate verification.
  - Evidence: public endpoint `apps/certifications/views.py:63` with no throttle.

- [ ] Fix partial-credit loss in quiz grading aggregation.
  - Evidence: `apps/assessments/models.py:353-357` only adds points when `is_correct` is truthy, dropping partial points returned with `is_correct=False`.

## Confirmed Low

- [ ] Remove duplicate import.
  - Evidence: `apps/assessments/views.py:3` and `apps/assessments/views.py:13` both import `get_object_or_404`.

- [ ] Change `DEBUG` default to safe value.
  - Evidence: `config/settings/settings.py:23` defaults to `"True"`.

- [ ] Document/mitigate model validation bypass in bulk operations.
  - Evidence:
    - Validation in model save: `apps/curriculum/models.py:109-113`
    - Multiple bulk operations bypass save, e.g. `Question.objects.bulk_update(...)` in `apps/assessments/views.py:179`, `ContentBlock.objects.bulk_update(...)` in `apps/content/views.py:184`.

- [ ] Add max-attempt guard in serial generation loop.
  - Evidence: unbounded uniqueness loop in `apps/certifications/services.py:133-136`.

## Not Confirmed / Partially Confirmed from Opus List

- [ ] `services.py:28` missing `rubric` support: **Partially confirmed**
  - Validator gap is real (`apps/assessments/validators.py`), but strategy service already supports rubric (`apps/assessments/strategies.py:267`, `apps/assessments/strategies.py:290`).

- [ ] `admin/superadmin blocked from content blocks`: **Not confirmed**
  - `is_instructor()` includes `is_staff`/`is_superuser` (`apps/core/utils.py:28-30`), and content views rely on this (`apps/content/views.py:26`, `apps/content/views.py:64`, etc.).

- [ ] `double query execution in views.py:42`: **Not confirmed in current tree**
  - Did not find the reported discarded paginated-query pattern at the cited location.

## Additional Critical Blocker (Found During Validation)

- [x] Fix missing URL target `instructor_quiz_image_upload`.
  - Evidence:
    - Referenced in `apps/core/urls.py:128`
    - Not defined in `apps/core/views.py` (closest exists: `apps/core/views.py:5327`).
  - Runtime impact: Django URL loading/checks fail at startup.
