# KINGMAKER — Production Progress Log

Entries document **verified project activity**, separate from the aspirational backlog. New agents must append dated entries with actual evidence.

## 2026-10-08 — Master planning baseline drafted
- **Scope:** established production methodology, gate-level roadmap, 111 dependency-ordered tasks across 14 phases, AI handoff protocol, quality strategy, narrative production matrix and backlog validator.
- **Work status:** planning infrastructure only. The implementation tasks remain `todo`.
- **Baseline:** 18 Act I scene definitions, scene-first runtime, lightweight v0.3 simulation and procedural scene visuals. No gold-playtest gate yet.
- **Checks required before accepting planning change:** machine backlog validator, repository file fetch, PR merge confirmation.
- **Follow-up:** `KM-001` audit of actual entrypoints and documentation drift; then testing foundation.

## 2026-10-08 — KM-001 implementation / baseline inspection
- **Source inspected:** `main` `3d6eff61c09c6fb69f72b8468b2b68993de136f9`; live index/import graph, 18 content IDs, scene mapping, engine and current documentation.
- **Artifact:** `docs/IMPLEMENTATION_INVENTORY.md`, shipped/partial/spec-only table, dependency graph, key technical and UX risks.
- **Correction:** planning references treating the current README and visual pivot as stale were inaccurate; both already identify `app-redesign.js`.
- **State:** code review/merge outstanding; no runtime browser smoke, device QA or local Node validator execution claimed at authoring time. Repository backlog CI is expected to report independently.
- **Verification:** `node tools/validate-production-backlog.mjs` executed by GitHub Actions on [PR #4](https://github.com/statego2/KingMaker/pull/4), [successful run](https://github.com/statego2/KingMaker/actions/runs/37692280622). Acceptance criteria met by code audit and scene ID inventory; review/merge is the delivery gate.
- **Follow-up:** KM-002 and KM-006.

## 2026-10-08 — KM-002 / KM-003 / KM-004 reproducible automated baseline
- **Change:** no-dependency localhost server and CLI; static entrypoint/import checks; Node built-in tests for 18 content definitions, choices, saves, route progression and scheduled callbacks; Node 22 GitHub Actions workflow; local-dev instructions. [PR #5](https://github.com/statego2/KingMaker/pull/5).
- **Actual CI commands:** `npm run check` — PASS (13 JS files and HTML/imports); `npm test` — **9 passed, 0 failed**; `npm run validate:backlog` — PASS. [GitHub Actions run](https://github.com/statego2/KingMaker/actions/runs/37692611628).
- **Real defect exposed and corrected:** in `C02_S03`, the Civic Compact option had displaced argument fields (quality/result/debrief/effects), now corrected in `src/content.js`.
- **Gaps:** browser interaction, visual screenshots and real-device review not run; branch-route coverage only one deterministic Act I route, not a combinatorial campaign audit. Save behavior unchanged.
- **Follow-up:** KM-005 visual baseline, KM-006 state/schema audit; KM-008 delivery policy and CI hardening.

## 2026-10-08 — KM-006 schema audit (v0.3 vs v1)
- **Deliverables:** [PR #7](https://github.com/statego2/KingMaker/pull/7): `docs/STATE_SCHEMA_AUDIT.md`, `data/state_migration_map_v0_3_to_v1.json`, two tests freezing complete mapping of all 14 live root fields and 8 required v1 domains.
- **Actual CI:** `npm run check` — PASS; `npm test` — **11/11 passed**; `npm run validate:backlog` — PASS ([run](https://github.com/statego2/KingMaker/actions/runs/37693129288)).
- **Risks mapped:** corrupt-save fallback, forward-version overwrite, 14 vs 25 actor seed drift, callback ID collisions, event-log/inbox preservation and timeline semantics.
- **Boundary:** No v1 migration or canonical schema mutation performed; migration decision belongs to KM-036 after earlier gold gates.

## 2026-10-08 — KM-005 Chromium visual baseline, awaiting human acceptance
- **Implementation:** [PR #6](https://github.com/statego2/KingMaker/pull/6), headless Playwright Chromium on five viewports × three selected Act I states; full-page PNGs and machine-readable viewport geometry uploaded as a [GitHub Actions artifact](https://github.com/statego2/KingMaker/actions/runs/37692937460).
- **Actual run:** [CI #37692937460](https://github.com/statego2/KingMaker/actions/runs/37692937460) passed; **15 screenshots, 0 automated geometry warnings, 0 page errors**. Chapter 6 scene 2 was longest by text under initial state.
- **Unverified:** PNGs need human visual/legibility inspection; true iPhone Safari/safe-area/device touch and accessibility acceptance are not claimed. Existing static + Node CI also passed.
- **Status:** `review`, not `done`. Consequently KM-007 remains dependency-blocked. KM-008 / KM-009 are dependency-ready.
