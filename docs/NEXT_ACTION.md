# KINGMAKER — NEXT ACTION / VERIFIED HANDOFF
**Snapshot:** 2026-10-08. Before work, verify this file, open PRs, current main, dependencies and latest Actions results.

## Shipped baseline
- 18 Act I scenes in cinematic scene-first static app; engine saves use v0.3. 111-task production plan, not 111 shipped features.
- Local Node check/preview; scene/content/save replay tests; versioned scene presentation contract; pure scene renderer separated from controller.
- Latest verified branch CI: [PR #11](https://github.com/statego2/KingMaker/pull/11), [Node 16 tests](https://github.com/statego2/KingMaker/actions/runs/37694535974), [Chromium browser run](https://github.com/statego2/KingMaker/actions/runs/37694535952). 15 captures, zero automated geometry/page errors; actual browser flow for context, People, commit, debrief, Inbox, persistence and reset passed.

## Active P0 review blocker — issue #12
- **KM-005 / [issue #12](https://github.com/statego2/KingMaker/issues/12):** A responsive title/dossier safe-zone fix, content-sized short-screen choice cards and selected-option visibility change are committed on [task branch](https://github.com/statego2/KingMaker/tree/task/KM-005-mobile-safe-zones-issue-12) ([code commit](https://github.com/statego2/KingMaker/commit/1edf3d8807e00960f9c4483726bc07312c2c56d0)).
- **Next:** open a [comparison PR](https://github.com/statego2/KingMaker/compare/main...task/KM-005-mobile-safe-zones-issue-12?expand=1), verify all Actions (game-tests, validate-backlog, Chromium capture/mobile regression), inspect 320px screenshots and test real iOS Safari/system text sizing. The connector refused PR creation in this session; no PR, CI success, device acceptance or main merge is claimed.
- Keep KM-005 at **review** until human/device approval. This is not a new dependency-ready P0 task.

## Current dependency gates
- **KM-005: review** — 15 Chromium snapshots captured, zero machine warnings; human must inspect [artifact](https://github.com/statego2/KingMaker/actions/runs/37692937460) and test actual iOS/legibility/critical touch interactions. Do not mark done solely from Chromium.
- **KM-008: review** — checks/CODEOWNERS documented, but [owner issue #10](https://github.com/statego2/KingMaker/issues/10) requires actual main branch ruleset activation and verification. Do not mark done without evidence.
- **KM-007** and **KM-010** are dependency-blocked by KM-005; do not bypass the validator or infer human signoff.

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
