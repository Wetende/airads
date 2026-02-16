# MasterStudy-Like Course Player: Complete Implementation Plan (Inertia-First, Paystack, Admin-Moderated Reviews)

## Summary
This plan delivers a complete, phased implementation covering:
1. Core course player correctness (drip/prerequisites/sequential/access expiry).
2. Builder-to-player settings wiring (drip and prerequisites fully functional).
3. Student-teacher interaction completion (discussion reliability + course reviews with moderation).
4. Paid enrollment flow with Paystack and webhook-verified access activation.

This plan is decision-complete and uses Inertia for all internal UX flows. JSON endpoints are added only where necessary (external Paystack webhook and existing upload/search JSON actions).

## Locked Decisions
1. Delivery shape: `Phased complete` (all domains included, dependency-ordered).
2. Engine strategy: `Strict centralization now` for access/completion.
3. Payments provider: `Paystack`.
4. Review moderation: `Admin approval`.
5. Paid access activation: `Only after verified Paystack payment`.
6. Settings persistence: `Typed Program fields` (not JSON blobs for new core settings).

## Important Public API / Interface Changes

### Data model additions and changes
1. `apps/core/models.py` `Program` additions:
   - `prerequisites_enabled: bool = False`
   - `prerequisite_programs: ManyToMany('self', symmetrical=False, blank=True)`
   - `access_duration_days: PositiveIntegerField(null=True, blank=True)`
   - `drip_enabled: bool = False`
   - `drip_mode: CharField(choices=['none','relative','absolute','mixed'], default='none')`
   - `rating_average: DecimalField(max_digits=3, decimal_places=2, default=0)`
   - `rating_count: PositiveIntegerField(default=0)`

2. `apps/progression/models.py` `Enrollment` additions:
   - `expires_at: DateTimeField(null=True, blank=True)`
   - `access_source: CharField(choices=['free','approval','paid','admin'], default='free')`

3. New review domain model (new app `apps/reviews`):
   - `ProgramReview`
   - Fields: `program`, `user`, `enrollment`, `rating(1..5)`, `review_html`, `status(pending|approved|rejected)`, `moderated_by`, `moderated_at`, `moderation_note`
   - Constraint: unique `(program, user)`

4. New commerce domain models (new app `apps/commerce`):
   - `Order` with `status(created|pending_payment|paid|failed|cancelled|expired|refunded)`, `provider='paystack'`, `amount_minor`, `currency`, `reference`, `paid_at`, `program`, `user`, `enrollment`
   - `PaymentAttempt` with provider payload/state history
   - `WebhookEvent` for idempotency (`provider`, `event_id/reference`, `signature_valid`, `processed_at`, raw payload)

### Route and endpoint contract (Inertia-first)
| Method | Path | Type | Purpose |
|---|---|---|---|
| `POST` | `/instructor/programs/<id>/manage/settings/` | Inertia action | Save pricing/faq/notices + prerequisites/access/drip configuration |
| `POST` | `/programs/<id>/review/` | Inertia action | Student create/update review (sets status `pending`) |
| `GET` | `/admin/reviews/` | Inertia page | Review moderation queue |
| `POST` | `/admin/reviews/<id>/approve/` | Inertia action | Approve review and recompute aggregates |
| `POST` | `/admin/reviews/<id>/reject/` | Inertia action | Reject review with moderation note |
| `GET` | `/programs/<id>/checkout/` | Inertia page | Checkout page for paid program |
| `POST` | `/programs/<id>/checkout/initialize/` | Inertia action | Create `Order`, initialize Paystack, redirect to authorization URL |
| `GET` | `/payments/paystack/callback/` | Web redirect view | Verify transaction, finalize state, redirect with flash status |
| `POST` | `/webhooks/paystack/` | JSON (necessary external endpoint) | Authoritative webhook processing and idempotent order finalization |
| `GET` | `/student/orders/` | Inertia page | Student order history |

### Frontend prop contract updates
1. Course player node status props standardization:
   - `status: unlocked|locked|completed|preview`
   - `lockReason: sequential|prerequisite|scheduled|drip|expired|enrollment_required|null`
   - `unlocksAt: ISO datetime|null`

2. Builder settings props:
   - `program.settings.prerequisitesEnabled`
   - `program.settings.prerequisiteProgramIds[]`
   - `program.settings.accessDurationDays`
   - `program.settings.dripEnabled`
   - `program.settings.dripMode`
   - Per-node `unlockDate`, `unlockAfterDays`

3. Public program detail props:
   - Approved reviews list, `ratingAverage`, `ratingCount`
   - CTA state now includes paid checkout states (`not_enrolled_paid`, `pending_payment`, `enrolled`)

## Implementation Plan (Phased Complete)

## Phase 0: Stabilize routing and feature gates
1. Set canonical ownership:
   - `apps/core` owns instructor course management and gradebook URLs.
   - `apps/progression` owns student portal and enrollment flows.
2. Resolve duplicate-path ambiguity:
   - Reorder includes in `config/urls.py` so canonical owner wins for overlapping paths.
   - Keep backward compatibility with redirect wrappers where needed.
3. Add feature toggles in `PlatformSettings.features`:
   - `course_reviews`, `payments`, `drip_v2`.
4. Acceptance:
   - Instructor program pages consistently resolve to one controller path.
   - No route regression on student session URLs.

## Phase 1: Schema and migration package
1. Add Program and Enrollment typed fields listed above.
2. Create `apps/reviews` and `apps/commerce` apps + migrations.
3. Backfill migration:
   - Compute `Enrollment.expires_at` for active enrollments where `Program.access_duration_days` exists.
   - Initialize `Program.rating_average/rating_count` to `0`.
4. Add env config:
   - `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_WEBHOOK_SECRET`, `PAYSTACK_CALLBACK_URL`.
5. Acceptance:
   - Migrations apply cleanly on existing data.
   - Admin and shell can create/read new models without nullable integrity issues.

## Phase 2: Strict access/completion centralization
1. Refactor `apps/progression/services.py` as single source of truth:
   - Access check order: enrollment status/expiry -> schedule locks -> prerequisite locks -> sequential locks -> completion status.
   - Standardized `AccessResult`.
2. Replace direct completion writes:
   - Remove/replace `NodeCompletion.objects.get_or_create` calls in:
     - `apps/progression/views.py` session/practicum paths.
     - `apps/core/views.py` quiz/assignment/course-player context paths.
   - Route all completion through `ProgressionEngine.mark_complete(...)`.
3. Replace `_check_unlock_status` internals:
   - Keep helper as compatibility wrapper that calls engine, not custom logic.
4. Ensure completion side effects:
   - `Enrollment.status='completed'` and `completed_at` set only by engine.
   - Existing certificate signal remains trigger point.
5. Acceptance:
   - Locked nodes cannot be opened via direct URL when scheduled/dripped/expired/prereq-locked.
   - Completing last required node transitions enrollment to `completed` and triggers certificate generation exactly once.

## Phase 3: Builder settings wiring (drip/prerequisites/access)
1. Backend (`instructor_program_update_settings`):
   - Accept and validate: prerequisite IDs, access duration, drip mode, per-node drip schedule.
   - Enforce no self-prerequisite and no prerequisite cycles.
   - Transactionally update `CurriculumNode.unlock_date/unlock_after_days`.
2. Serialization (`serialize_program_data`, tree builders):
   - Include settings and per-node schedule fields in Inertia props.
3. Frontend:
   - `SettingsPanel.jsx`:
     - real prerequisite selector (multi-select programs),
     - real access duration save,
     - save-on-action via existing Inertia endpoint.
   - `DripEditor.jsx`:
     - read from actual node values,
     - submit schedule payload via Inertia post,
     - display validation and save states.
4. Acceptance:
   - Changes from builder persist and are visible after reload.
   - Player lock state reflects saved drip/prerequisite/access settings without manual DB edits.

## Phase 4: Course player and student-teacher interaction hardening
1. Player:
   - Use only service-derived status map for sidebar and stage lock checks.
   - Show precise lock reason and unlock datetime.
   - Preserve current “requirements before completion” behavior for video/document/assessment, but completion still funnels through engine.
2. Discussion/notes:
   - Keep current flows; add stricter payload validation and explicit error feedback states for failed posts.
   - Ensure notifications are sent once per event.
3. Optional UX parity:
   - “Continue where you left off” target node preference in `program_view`.
4. Acceptance:
   - No mismatch between sidebar lock state and direct session access.
   - Discussion and notes work reliably under partial reloads.

## Phase 5: Reviews (student->admin moderation->public display)
1. Implement `/programs/<id>/review/`:
   - Eligibility: authenticated user with completed enrollment.
   - One review record per user+program.
   - Edit behavior: updating any existing review resets status to `pending`.
2. Admin moderation queue:
   - list pending/rejected/approved,
   - approve/reject with note.
3. Aggregate updates:
   - recompute and persist `Program.rating_average`, `Program.rating_count` on moderation changes.
4. Wire frontend modals:
   - `frontend/src/components/modals/CourseDetailsModal.jsx`
   - `frontend/src/components/modals/LeaveReviewModal.jsx`
   - keep existing UI, point to real backend behavior.
5. Acceptance:
   - Student can submit review after completion.
   - Public page displays only approved reviews and real aggregates.

## Phase 6: Commerce with Paystack (verified-payment enrollment)
1. Checkout flow:
   - Paid program CTA routes to checkout page.
   - Initialize order and Paystack transaction server-side.
2. Callback + webhook flow:
   - Callback verifies transaction and sets user-facing state.
   - Webhook is authoritative; idempotent processing updates order and enrollment.
   - Enrollment activation only on verified success event.
3. Enrollment integration:
   - On successful payment: create/activate enrollment with `access_source='paid'` and `expires_at` derived from course access duration.
   - Prevent duplicate active paid enrollments/orders per user+program while pending.
4. Student order history page:
   - Show order reference, date, amount, status, program, payment provider.
5. Acceptance:
   - Successful Paystack payment grants access.
   - Failed/cancelled payment never grants access.
   - Duplicate webhook deliveries do not duplicate enrollment/order transitions.

## Phase 7: Cleanup, compatibility, and docs
1. Remove dead logic branches and duplicate unlock/completion code paths.
2. Keep temporary redirects for old conflicting instructor URLs for one release cycle, then remove.
3. Update docs:
   - `docs/inertia-architecture.md` add section “External-provider exceptions” for webhook/callback endpoints.
   - Add operations runbook for Paystack webhook verification and replay handling.
4. Acceptance:
   - No duplicate business logic for access/completion remains.
   - Route map is deterministic and documented.

## Test Cases and Scenarios

1. Access/locking service unit tests:
   - scheduled lock, drip lock, prerequisite lock, sequential lock, expiry lock, unlocked path, completed path.
2. View integration tests:
   - `program_view`, `session_viewer`, and sidebar status use identical lock outcomes.
3. Completion tests:
   - quiz pass, assignment submit/grade, practicum approval all route through engine and set enrollment completion correctly.
4. Builder tests:
   - saving prerequisites/drip/access updates DB fields and rehydrates props correctly.
5. Review tests:
   - eligibility gating, one-review-per-student behavior, moderation transitions, aggregate recalculation.
6. Commerce tests:
   - checkout initialization creates pending order,
   - webhook signature validation,
   - idempotent webhook replay,
   - success activates enrollment,
   - failure leaves enrollment inactive.
7. Regression tests:
   - old instructor URLs redirect/resolve correctly during compatibility window.
8. Frontend tests (Vitest):
   - DripEditor controlled data load/save payload.
   - SettingsPanel prerequisite selector and validation.
   - Course player lock-reason rendering.
   - Review modal submission states.
9. End-to-end happy path:
   - Instructor configures drip/prerequisites -> student buys course -> unlock progression behaves correctly -> student completes -> certificate generated -> student submits review -> admin approves -> public rating updates.

## Rollout and Monitoring
1. Rollout by feature flags:
   - Enable `drip_v2` first.
   - Enable `course_reviews` second.
   - Enable `payments` last.
2. Add structured logging:
   - access decision logs (node, reason, unlock_at),
   - completion events (enrollment, node, trigger),
   - payment state transitions (order reference, provider event).
3. Add admin reconciliation view:
   - list payment webhooks by processing status for manual replay.
4. Rollback plan:
   - disable `payments` flag to return to approval/open enrollment behavior without removing models.

## Assumptions and Defaults
1. One order maps to one program (bundles/subscriptions deferred).
2. Currency defaults to `KES` unless explicitly set in `custom_pricing`.
3. Paystack webhook is authoritative source of payment truth.
4. Reviews are allowed only after course completion.
5. Course hierarchy remains 2-tier in builder (`Section -> Content node`) for this release.
6. Internal UX flows remain Inertia pages/actions; non-Inertia JSON endpoints are only for external/webhook or existing file-upload style requirements.
