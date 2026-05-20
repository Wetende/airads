# Frontend Standards: MUI 7 + Context7

This document defines the frontend implementation rule for this repository.

Scope:
- Applies to all frontend work under `frontend/src/**`
- Immediate enforcement priority: AIRADS public frontend pages and their shared public components
- Later enforcement target: the rest of the frontend application

Primary goal:
- keep all frontend code aligned with the installed MUI major version
- avoid outdated examples from blogs, Stack Overflow, or older MUI versions
- use Context7 to confirm component APIs before introducing or reviewing MUI patterns

## Source Of Truth

Current UI library version in this project:
- `@mui/material`: `7.2.0`

Documentation source to use:
- Context7 library: `/mui/material-ui/v7.2.0`

Working rule:
- when writing, reviewing, or migrating MUI code, use Context7 against the matching installed MUI version
- do not assume examples from MUI v5 or older Grid APIs are valid here
- if uncertain about a component prop, check Context7 before implementing

## Enforcement Policy

We are standardizing on documented MUI 7 APIs only.

This means:
- use APIs that exist in MUI 7 documentation
- prefer version-matched examples from Context7 over memory
- treat legacy MUI patterns as migration work, not acceptable new code

Public frontend first:
- `frontend/src/pages/public/**`
- public shared sections/components used by AIRADS public pages

After that:
- the same standards apply to all other frontend pages and shared components

## Required Context7 Workflow

Use Context7 when:
- adding a new MUI component pattern
- changing Grid layouts
- copying examples from outside the repo
- reviewing code that looks suspicious for version mismatch
- migrating old MUI code

Recommended lookup pattern:
1. Resolve the library as `Material UI`
2. Use `/mui/material-ui/v7.2.0`
3. Query the specific component or migration topic before editing

Examples:
- Grid API and responsive sizing
- Tabs behavior
- Dialog props
- Theme override patterns
- system `sx` usage when unsure

## MUI 7 Grid Rule

This is the most important rule because it already caused broken public layouts in this repo.

Allowed:

```jsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 6 }}>
    ...
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    ...
  </Grid>
</Grid>
```

Also allowed when a single value is intended:

```jsx
<Grid size={6}>...</Grid>
```

Not allowed in new or updated code:

```jsx
<Grid item xs={12} md={6}>...</Grid>
```

```jsx
<Grid xs={12} md={6}>...</Grid>
```

MUI 7 rule summary:
- use `container` for layout containers
- use `size` for item width
- use `offset` for offsets
- do not use legacy `item`
- do not use legacy breakpoint props such as `xs`, `sm`, `md`, `lg`, `xl` directly on `Grid`

## Public Frontend Priority Areas

First-pass enforcement focus:
- `frontend/src/pages/public/**`
- `frontend/src/components/sections/**`
- `frontend/src/components/common/**` when used by public pages
- `frontend/src/components/lists/ProgramGrid.jsx`
- public AIRADS landing and marketing sections

Why this is first:
- public pages are the most visible
- layout regressions show up there first
- these pages had confirmed MUI 7 Grid mismatches already

## Review Checklist

Before finishing frontend work:
- confirm the MUI component pattern matches MUI 7 docs
- check Grid usage for legacy props
- verify responsive layout behavior
- keep shared public sections consistent with the established AIRADS patterns
- prefer existing approved section patterns over inventing a new one unnecessarily

## Quick Audit Commands

Use these checks when auditing MUI 7 compatibility:

```bash
rg -n "Grid item|\\b(xs|sm|md|lg|xl)=\\{[^}]+\\}|\\b(xs|sm|md|lg|xl)=\\d" frontend/src/pages/public frontend/src/components/sections frontend/src/components/common frontend/src/components/lists/ProgramGrid.jsx -S
```

Then validate with:

```bash
npm run build
```

## AIRADS Public Frontend Note

For AIRADS public frontend work, follow the established repository patterns we already confirmed during the public-page cleanup:
- MUI 7 Grid API only
- reuse approved section treatments when extending nearby sections
- avoid layout fixes that depend on accidental legacy behavior

This rule is not limited to AIRADS forever.
AIRADS public pages are simply the first enforcement surface.

## Decision Rule

If there is a conflict between:
- memory
- old snippets
- random internet examples
- and version-matched Context7 documentation

Use the version-matched Context7 documentation.
