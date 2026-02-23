# Taxonomy Normalization Runbook

## Purpose

Normalize builder taxonomy to the 3-tier contract:

1. Tier 1: `Program.level` (outside curriculum tree)
2. Tier 2: depth-0 builder container (`blueprint.hierarchy_structure[0]`)
3. Tier 3: depth-1 builder content (`blueprint.hierarchy_structure[1]`)

## Preconditions

1. Deploy code that includes `normalize_builder_taxonomy`.
2. Confirm DB backup policy and restore window.
3. Confirm target mode mapping to apply (`--mode`).

## Prechecks

1. Run dry-run and save machine-readable report:

```bash
python manage.py normalize_builder_taxonomy --dry-run --mode online --output-json /tmp/taxonomy-report.json
```

2. Review report fields:
- `invalidBlueprints`
- `impactedPrograms`
- `summary.programsBlockedByDepth`
- `summary.nodesToRename`

3. If any blocked programs exist (`maxDepth > 1`), stop and flatten those trees first.

## Approval Checklist

1. Target mapping confirmed by product/academics.
2. Dry-run report approved by engineering owner.
3. Backup checkpoint timestamp recorded.

## Apply

```bash
python manage.py normalize_builder_taxonomy --apply --mode online --output-json /tmp/taxonomy-apply-report.json
```

Optional scoping:

```bash
python manage.py normalize_builder_taxonomy --apply --program-id 2 --mode theology
python manage.py normalize_builder_taxonomy --apply --blueprint-id 7 --mode tvet
```

## Postchecks

1. Re-run dry-run:

```bash
python manage.py normalize_builder_taxonomy --dry-run --mode online
```

Expected:
- `blueprints_invalid=0` for normalized scope
- `nodes_to_rename=0` for normalized scope

2. Smoke-test Course Builder:
- Create section: no lesson editor auto-opens.
- Add lesson: lesson appears as child of selected section.
- Toasts show current action with semantic label (`Section`, `Lesson`, etc).

3. Verify setup pages only show builder-compatible blueprints.

## Rollback

1. Restore DB from backup if critical mismatch detected.
2. Re-deploy prior release if needed.
3. Investigate report and rerun command in dry-run mode before next apply.
