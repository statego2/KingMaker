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

## 2026-10-08 — KM-009 versioned scene presentation contract
- **Code:** [PR #8](https://github.com/statego2/KingMaker/pull/8): `src/scene-contract.js` v1 pure adapter, active metadata resolver wired to it, fallback diagnostics for unknown mode/actor, declared source IDs and optional art/pressure references.
- **Verification:** original/current scene catalog of 18 maps identically, unknown modes fail softly, legacy evidence is not silently treated as independently sourced. [GitHub Actions game-tests run](https://github.com/statego2/KingMaker/actions/runs/37693589420) PASS; full follow-up CI on the final integrated commit required.
- **Runtime/save risk:** no state/save key change; missing real art/source provenance remains explicitly unimplemented. Human browser validation is not inferred from Node tests.
- **Next:** KM-008 M0 CI delivery convention; KM-011 scene renderer/controller boundary. KM-010 remains blocked by KM-005 review.

## 2026-10-08 — KM-008 all-PR CI and branch policy in review
- **Scope:** [PR #9](https://github.com/statego2/KingMaker/pull/9) makes backlog validation a general PR check and introduces CODEOWNERS and `docs/CI_AND_RELEASE_POLICY.md` with ownership, issue requirements and rollback.
- **Actual final branch CI:** [backlog](https://github.com/statego2/KingMaker/actions/runs/37694129392) PASS and [game-tests](https://github.com/statego2/KingMaker/actions/runs/37694129354) PASS.
- **Remaining approval:** GitHub main branch ruleset not changed by connector; [issue #10](https://github.com/statego2/KingMaker/issues/10) captures required owner-only manual activation and blocked-merge verification. Task remains `review` pending that evidence.
- **Next dependency-ready P0:** KM-011 scene renderer/controller separation; KM-007/KM-010 await KM-005 human visual acceptance.

## 2026-10-08 — KM-011 scene renderer/controller separation
- **Implementation:** [PR #11](https://github.com/statego2/KingMaker/pull/11) extracts pure world/choice, context, consequence and finale views into `src/scene-renderer.js`, leaving click orchestration/DOM/save in `src/app-redesign.js`. Added renderer immutability tests and real browser flow smoke.
- **Verified Node CI:** `npm run check` PASS, `npm test` **16 passed / 0 failed**, `npm run validate:backlog` PASS ([run](https://github.com/statego2/KingMaker/actions/runs/37694535974)).
- **Verified Chromium CI:** [visual run](https://github.com/statego2/KingMaker/actions/runs/37694535952) PASS: 15 screenshots, 0 automated warnings, 0 page errors. Browser-click smoke PASS for Context, People, select/commit, consequence, debrief, Continue, persisted reload, Inbox and Reset.
- **Limitations:** utility-only HTML remains in controller, no full accessibility/iOS/art approval is implied. No persisted state schema changes. KM-005 human visual signoff remains `review`.
- **Next:** no other P0 todo task is dependency-ready until manual gates; proceed to independent ready P1 KM-089 taxonomy or KM-012 visual bible (requires human art approval).
