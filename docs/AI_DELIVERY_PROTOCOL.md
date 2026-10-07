# AI DELIVERY PROTOCOL — reliable multi-agent handoffs

## Goal
Make "open this repository and continue" executable without hidden private conversational context. This is a **workflow**, not automatic background execution; an AI continues only when asked and given repository access.

### Step 1: Orientation
Read `AGENTS.md` and `docs/NEXT_ACTION.md`; fetch current default branch, existing PRs and task statuses. Inspect real code and canonical contracts. Never take another assistant's confident historical claim as proof of deployed state.

### Step 2: Select one ready task
Resolve `depends_on`; only `done` prerequisites qualify. Priority sort: P0 → P1 → P2; among same priority prefer current milestone blockers and smaller vertical scope. Do not silently mark old tasks done because code "looks similar". If a task already partially exists, inventory the gap and reuse it.

### Step 3: Confirm contract
State `id`, objective, precise deliverable, impacted files, dependencies, how to validate, state migration considerations, and any human decision required. If a task is L/XL and spans many independent changes, create detailed subtasks before implementing; parent stays open.

### Step 4: Work in a branch
Naming: `task/KM-001-audit-entrypoints`. Do not commit directly to `main` unless explicitly authorized for a tiny low-risk correction. For parallel agents, claim the task via GitHub issue/PR before editing, coordinate ownership of shared files, refresh/rebase after conflicts.

### Step 5: Implement and verify
- Add or modify code/content, not only discussion.
- Run the repo's actual available tests; show **commands and their outputs**.
- Test representative branches for any story logic change.
- Verify reachable UI on target small-screen layout for visual work; if automated browser absent, document visual QA as pending.
- Check source provenance, fairness and pre-choice state leakage.
- Run `node tools/validate-production-backlog.mjs`.
- For user-visible art/audio, check rights and asset continuity.
- Avoid hiding errors by loosening validators.

### Step 6: PR evidence and status
The PR body includes: task ID(s), summary, file list, before/after behavior, tests, screenshots/video if possible, save migration/rollback, unresolved limitations and manual signoff requirements.

Status mapping:
- `todo`: no claimed implementation.
- `in_progress`: active owner and branch, dependencies verified.
- `blocked`: actionable blocker in `notes`.
- `review`: implementation demonstrable and tests run; awaiting review or non-automatable check.
- `done`: acceptance conditions met, merged/shipped, **evidence** array includes PR/commit/test results and any required human signoff.

One task must not be marked `done` solely because a branch contains code; reviewers/owner decide acceptance. When adding evidence use durable text/URL; not speculative statements. Update progress log with date, link, results, open risks. Refresh NEXT_ACTION once milestone changes.

### Step 7: Handoff format
```text
Task: KM-...
Status: done | review | blocked | in_progress
Branch/PR: ...
Files touched: ...
What changed: ...
Tests actually executed: ...
Manual/creative verification still needed: ...
Migration impact: ...
New/remaining risks: ...
Next ready task: KM-...
```
Keep change-set cohesive and rollback-safe. If access is not available, say so and provide exact patch/PR instructions, not a false completion claim.

## Avoid these anti-patterns
- "Finished game" inferred from 18 direct-choice scenes.
- Expanding all chapters before the Gold slice has been validated.
- Replacing narrative conflicts with 60 visible meters or curriculum labels.
- Moving deep-domain gameplay into visual-only placeholder screens.
- Faking source confidence, actor knowledge, playtest results or test runs.
- Massive undocumented refactors in engine, state schema and content simultaneously.
- Deploying a new asset library with no provenance, performance or responsive checks.
- Updating a GitHub Project card while the canonical backlog remains stale (or vice versa).

## Scope revision requests
Large new ideas go into a proposed change record: problem → evidence → options → impact on critical path → cost/complexity → suggested decision → owner approval. Protected canon changes require an explicit ADR and regression review. New features must not silently displace current P0 tasks.

## Automation and machine contracts
`data/production_backlog_v1.json`: machine-readable source; `docs/TASK_REGISTER.md`: initial human-readable snapshot; regenerate/refresh when task definitions change. Do not rely on the Markdown snapshot for mutable status.
`tools/validate-production-backlog.mjs`: checks phase, IDs, ordering, cycles, status, evidence and readiness.
`docs/PROGRESS_LOG.md`: verified events, not future promises.
