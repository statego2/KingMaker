# KINGMAKER — NEXT ACTION / VERIFIED HANDOFF
**Snapshot:** 2026-10-08. Before work, verify this file, open PRs, current main, dependencies and latest Actions results.

## Shipped baseline
- 18 Act I scenes in cinematic scene-first static app; engine saves use v0.3. 111-task production plan, not 111 shipped features.
- Local Node check/preview; scene/content/save replay tests; versioned scene presentation contract; pure scene renderer separated from controller.
- Latest verified branch CI: [PR #11](https://github.com/statego2/KingMaker/pull/11), [Node 16 tests](https://github.com/statego2/KingMaker/actions/runs/37694535974), [Chromium browser run](https://github.com/statego2/KingMaker/actions/runs/37694535952). 15 captures, zero automated geometry/page errors; actual browser flow for context, People, commit, debrief, Inbox, persistence and reset passed.

## Pending responsive P0 issue #12 integration
- Existing tested layout fix ported onto latest main in `task/KM-005-mobile-safe-zones-integrated-20261008`: briefing art/title safe zones at 320–430px, scrollable long choice cards and explicit scrolling indicator, selected-choice visibility, responsive Chromium regression for 4 phone widths.
- Main-site stylesheet/module cache-bust version changes to `scene-first-v7` after merging; **no owner iPhone/Safari acceptance inferred**. CI for [PR #14](https://github.com/statego2/KingMaker/pull/14) passed: [Node 27/27](https://github.com/statego2/KingMaker/actions/runs/37776473919), [backlog](https://github.com/statego2/KingMaker/actions/runs/37776473871) and [Chromium/mobile](https://github.com/statego2/KingMaker/actions/runs/37776473933) (15 PNG, 4 mobile widths; no warnings). Merge still requires confirmation on final commit. KM-005 remains `review` until human device approval; KM-007/KM-010 dependencies do not unlock.
- KM-008 still requires GitHub ruleset configured by owner ([issue #10](https://github.com/statego2/KingMaker/issues/10)).

## Current dependency gates
- **KM-005: review** — 15 Chromium snapshots captured, zero machine warnings; human must inspect [artifact](https://github.com/statego2/KingMaker/actions/runs/37692937460) and test actual iOS/legibility/critical touch interactions. Do not mark done solely from Chromium.
- **KM-008: review** — checks/CODEOWNERS documented, but [owner issue #10](https://github.com/statego2/KingMaker/issues/10) requires actual main branch ruleset activation and verification. Do not mark done without evidence.
- **KM-007** and **KM-010** are dependency-blocked by KM-005; do not bypass the validator or infer human signoff.

## Active KM-089 bounded taxonomy implementation
- [Task branch](https://github.com/statego2/KingMaker/tree/task/KM-089-taxonomy-index-slice-1): canonical 10 domains / 60 competency IDs, 15 tensions and Q001–Q1000 tier slots; Node tests and a taxonomy validator added. **Parent status: in_progress, not done.**
- Original 1,000 individual question records are absent from this repository. Do not infer per-question competency/source coverage from the master document's completion claim. Next slice requires original corpus and provenance.
- **Verified task-branch CI:** [game-tests #37705840526](https://github.com/statego2/KingMaker/actions/runs/37705840526) PASS (`npm run check`, `npm test` **19/19**, `npm run validate:backlog`, `npm run validate:taxonomy`); [backlog #37705840519](https://github.com/statego2/KingMaker/actions/runs/37705840519) PASS. [Code commit ce45339](https://github.com/statego2/KingMaker/commit/ce45339fd1d567ef35a763af6633b68b1aa89eab). PR creation was refused by connector; [open comparison](https://github.com/statego2/KingMaker/compare/main...task/KM-089-taxonomy-index-slice-1?expand=1). Not merged.
- P0 [KM-005 issue #12](https://github.com/statego2/KingMaker/issues/12) remains human/device review; [P0 fix branch](https://github.com/statego2/KingMaker/tree/task/KM-005-mobile-safe-zones-issue-12) has passing branch Actions but PR creation is blocked. KM-008 still awaits [owner ruleset issue #10](https://github.com/statego2/KingMaker/issues/10).

### KM-089 slice 2 — provenance-gated corpus intake
- Added an empty original-question intake manifest, canonical ID/tier/competency/tension validation, item-level provenance checks, coverage audit and synthetic-only Node tests. **0 actual records imported, 0 reviewed; KM-089 remains in_progress.**
- Run `npm run check`, `npm test`, `npm run validate:backlog`, `npm run validate:taxonomy`, and `npm run validate:mappings`; verify final-commit Actions before claiming CI success.
- [Task branch](https://github.com/statego2/KingMaker/tree/task/KM-089-taxonomy-index-slice-1) and [compare](https://github.com/statego2/KingMaker/compare/main...task/KM-089-taxonomy-index-slice-1). The original question corpus is the next content blocker; no UI or save-schema changes.

### KM-089 delivery: source-safe foundation available for review
- [PR #13](https://github.com/statego2/KingMaker/pull/13) contains canonical taxonomy, original-question intake, provenance validation, `src/knowledge-coverage.js`, new synthetic coverage tests and a JSON CLI (`node tools/report-knowledge-coverage.mjs` or `npm run report:coverage`).
- **Verified head CI:** [game-tests 37776026971](https://github.com/statego2/KingMaker/actions/runs/37776026971) passed: `npm run check`, `npm test` (**27/27**), `npm run validate:backlog`, `npm run validate:taxonomy`, `npm run validate:mappings` and JSON coverage report assertion; [backlog 37776026791](https://github.com/statego2/KingMaker/actions/runs/37776026791) passed.
- **KM-089 remains in_progress:** original individual question corpus is absent; coverage stays **0/1,000**. The code is a foundation, not completed substantive mapping.
- **Next dependency-ready separate work:** KM-012 art bible has an existing unmerged branch and requires human visual approval. KM-005 (#12) and KM-008 (#10) stay in review.

## Parallel narrative track — PR #15 (not a completed KM task)
- [Draft PR #15](https://github.com/statego2/KingMaker/pull/15) contains the V2 six-act / 36-chapter story treatment and rewrites **the nine live scenes in Chapters 1–3**, with gradual character reveals and a cinematic anonymous-caller opening. **Chapters 4–6 still use the earlier script; Acts II–VI remain unimplemented.**
- Story is **proposed pending creative owner review**. Do not interpret this branch as proof of a finished Gold Chapter 1, the first 90 minutes, or a shipped 36-chapter campaign.
- Preserve established save keys, scene IDs and effect flags on merge. Review final-head PR Actions, then blind-read the opening on iOS; human feedback is the quality gate.
- This is a parallel owner-requested narrative workstream; the dependency-ready engineering tasks listed below remain unchanged.

## Next dependency-ready implementation work
- **KM-012 [P1]** — Create Lydria location and time-of-day visual bible (depends: KM-001)
- **KM-089 [P1]** — Map 1,000 mechanisms to taxonomy with stable IDs (depends: KM-001)

Prefer **KM-089**, where taxonomy/unique ID work can produce a verifiable content-engine deliverable without waiting for creative approval. KM-012 is useful parallel visual-world bible work, but new art boards require owner signoff; keep status review until accepted.

## Required protocol
1. Read `AGENTS.md`, the actual source and current tests, `docs/PRODUCTION_PLAN.md`, `docs/AI_DELIVERY_PROTOCOL.md`, current backlog and open PRs.
2. Claim one dependency-ready task on `task/KM-###-...`. If L/XL, split into bounded child deliverables.
3. Implement code/data/docs; validate `npm run check`, `npm test`, `npm run validate:backlog` in GitHub Actions, and browser checks when UI changes.
4. Update canonical task status, evidence, `docs/PROGRESS_LOG.md` and this NEXT_ACTION in the same PR. Require human creative/device approval where specified.
5. Never claim the 36-chapter project or the Gold Chapter 1 complete without their explicit gates.

## Important work already landed
- KM-001: [entrypoint audit PR #4](https://github.com/statego2/KingMaker/pull/4)
- KM-002–004: [Node preview and regression suite PR #5](https://github.com/statego2/KingMaker/pull/5), malformed C02_S03 option fixed
- KM-006: [v0.3–v1 state delta PR #7](https://github.com/statego2/KingMaker/pull/7), migration not active
- KM-009: [scene presentation adapter PR #8](https://github.com/statego2/KingMaker/pull/8)
- KM-011: [scene/controller boundary PR #11](https://github.com/statego2/KingMaker/pull/11)

### Final CI verification — KM-089 slice 2
- [Node workflow 37716425812](https://github.com/statego2/KingMaker/actions/runs/37716425812): check PASS; npm test 24/24 PASS; backlog, taxonomy and mapping validators PASS.
- [Backlog workflow 37716425836](https://github.com/statego2/KingMaker/actions/runs/37716425836): PASS.
- Tested commit: https://github.com/statego2/KingMaker/commit/1aa6bc97cef8cdd3601cea0e96a6def8553f2fb3


## Feedback-driven parallel experiment — PR #17
- Creator reports unresolved cast comprehension and low entertainment value. [PR #17](https://github.com/statego2/KingMaker/pull/17) introduces name/role labels and optional, consequential opening investigation plus a stronger inciting incident.
- Review smartphone onboarding and whether each interaction is genuinely enjoyable; do not mark Gold Chapter 1 or KM-005 done without owner acceptance. Improve Chapters 4–6 only after creator feedback on the first scene.
