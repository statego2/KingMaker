# KINGMAKER — NEXT ACTION / CURRENT HANDOFF
**Snapshot:** 2026-10-08. Refresh against latest `main` and open PRs on every new session.

## Current situation
- Production planning documentation exists; execution backlog initially all `todo` until implementation/test proof is added.
- Shipped baseline is **18 Act I scenes**, lightweight simulation v0.3, scene-first UI with procedural art.
- We have **not** verified full gameplay with browser automation or actual device sessions in this planning phase.
- **Do not jump straight to Act II** just because all Act I scene IDs exist. M2/M3/M4/M5 production-quality gates remain open.
- The latest creative pivot is scene-first cinematic political strategy, not dense dashboard-first UI.

## Current milestone
**M0 / P00 — Foundation/testing.**

## Immediate next task
**KM-002 — Create repeatable local build/test workflow** (P0, M; depends on KM-001, completed in PR #4 after CI acceptance).

**Also ready:** KM-006 (v0.3 vs v1 schema audit), plus parallel P1 KM-012 and KM-089.

Deliver for KM-002:
1. Document Node 22 / static-site boot commands without a private environment.
2. Add portable, no-dependency local scripts for syntax, import and test checks.
3. Ensure fresh checkout setup and error codes are reproducible; follow up with KM-003 tests.
4. Verify using Node and record exact output through CI if local execution is not available.

Then seek next dependency-ready **KM-002** (local test/build workflow), followed by KM-003/004/005/006/007/008 as allowed by dependency graph.

**KM-001 audit artifact:** [`docs/IMPLEMENTATION_INVENTORY.md`](IMPLEMENTATION_INVENTORY.md), [PR #4](https://github.com/statego2/KingMaker/pull/4), backlog integrity [CI run](https://github.com/statego2/KingMaker/actions/runs/37692280622). No browser/device playtest included.

## Ready-to-start rule
Find `todo` tasks with all `depends_on` in `done`, select priority P0 then phase progression; do not auto-select parallel cosmetic tasks over gold-loop blockers. If current task already has an open PR, review/finish it rather than duplicate.

## Known initial tech and product gaps (claims to verify in M0)
1. Resolved hypothesis: current README and visual-pivot document correctly reference `app-redesign.js`; historical app files remain in-tree.
2. Engine state and versioned schema differ substantially.
3. `src/app-redesign.js` is still a tightly coupled DOM controller; modularity needs work.
4. Current scenes use procedural visual mockups; no finalized portrait/location pipeline.
5. Investigation/negotiation gameplay is partial or absent; most scenes offer direct A/B/C outcomes.
6. No evidenced test matrix/CI/reproducible simulator replay suite in repository snapshot.
7. Existing scene assets and content require font, small-screen, localization, source and callback audit.

## Human decision checkpoints
- **M1:** visual sample approval.
- **M2:** Gold Chapter 1 feel and art approval.
- **M3:** first session earns commitment to expand.
- **M5:** Act I release-worthiness.
- **M7/M8/M10:** meaning/tone/fairness/endings.
- **MR:** release candidate approval.

If approvals are unavailable, prepare the artifact and explicitly mark `review` or `blocked`; never pretend signoff exists.

## Useful links
- Playable build: https://statego2.github.io/KingMaker/
- Repository: https://github.com/statego2/KingMaker
- Plan: `docs/PRODUCTION_PLAN.md`
- Tasks: `data/production_backlog_v1.json`
- Readable register: `docs/TASK_REGISTER.md`
- Agent instructions: `AGENTS.md`
