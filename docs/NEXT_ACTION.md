# KINGMAKER — NEXT ACTION / CURRENT HANDOFF
**Snapshot:** 2026-10-08. Refresh against latest `main` and open PRs on every new session.

## Current situation
- Production planning documentation exists; execution backlog initially all `todo` until implementation/test proof is added.
- Shipped baseline is **18 Act I scenes**, lightweight simulation v0.3, scene-first UI with procedural art.
- We have **not** verified full gameplay with browser automation or actual device sessions in this planning phase.
- **Do not jump straight to Act II** just because all Act I scene IDs exist. M2/M3/M4/M5 production-quality gates remain open.
- The latest creative pivot is scene-first cinematic political strategy, not dense dashboard-first UI.

## Current milestone
**M0 / P00 — Foundation/testing (automated baseline available).**

## Immediate next task
**KM-005 — Baseline visual snapshots at phone and desktop widths** (P0, M; dependencies KM-001 and KM-002 now satisfied).

**In concurrent review:** KM-005 screenshot baseline [PR #6](https://github.com/statego2/KingMaker/pull/6). **Completed:** KM-006 schema audit [PR #7](https://github.com/statego2/KingMaker/pull/7). **Dependency-ready after KM-006:** KM-008 and KM-009; additionally P1 KM-012 / KM-089.

Deliver for KM-005:
1. Capture 320×568, 375×667, 390×844, 430×932 and desktop screenshots of first/longest/final scenes.
2. Record clipped/obscured actions and visibility defects in a viewport ledger, with links to evidence.
3. Mark browser/device distinctions honestly; no visual quality signoff inferred from CI.
4. Run `npm run verify`, update backlog and the progress log with evidence.

After KM-005 review, continue KM-007 (baseline UX playtest) and KM-008 (CI/ownership convention), then KM-009 (scene contract) as dependency-gated.

**KM-001 audit artifact:** [`docs/IMPLEMENTATION_INVENTORY.md`](IMPLEMENTATION_INVENTORY.md), [PR #4](https://github.com/statego2/KingMaker/pull/4), backlog integrity [CI run](https://github.com/statego2/KingMaker/actions/runs/37692280622). No browser/device playtest included.

**Recent verified M0 delivery:** [PR #5](https://github.com/statego2/KingMaker/pull/5), [CI](https://github.com/statego2/KingMaker/actions/runs/37692611628): `npm run check` passed, Node test runner **9/9**, backlog integrity passed. Bug fixed: malformed Civic Compact choice in `C02_S03`.

## Ready-to-start rule
Find `todo` tasks with all `depends_on` in `done`, select priority P0 then phase progression; do not auto-select parallel cosmetic tasks over gold-loop blockers. If current task already has an open PR, review/finish it rather than duplicate.

## Known initial tech and product gaps (claims to verify in M0)
1. Resolved hypothesis: current README and visual-pivot document correctly reference `app-redesign.js`; historical app files remain in-tree.
2. Engine state and versioned schema differ substantially.
3. `src/app-redesign.js` is still a tightly coupled DOM controller; modularity needs work.
4. Current scenes use procedural visual mockups; no finalized portrait/location pipeline.
5. Investigation/negotiation gameplay is partial or absent; most scenes offer direct A/B/C outcomes.
6. Initial Node smoke/save test suite and CI are now present; browser, device and complete replay coverage are not yet evidenced.
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
