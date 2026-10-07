# KINGMAKER — Executable Baseline Inventory (KM-001)

**Audit date:** 2026-10-08  
**Reference:** `main` commit `3d6eff61c09c6fb69f72b8468b2b68993de136f9` before this audit.  
**Method:** repository tree + direct source inspection through the connected GitHub API. No browser, device or automated playthrough completed in this audit.

## Actual deployed entry and dependency graph

```text
index.html
├── styles-redesign.css?v=scene-first-v6
└── src/app-redesign.js?v=scene-first-v6
    ├── src/content.js
    │   └── src/act1b.js
    ├── src/engine.js
    │   └── src/content.js
    └── src/redesign-scenes.js
        └── src/content.js
```

The alternative `src/app.js`, `src/app-cinematic.js` and `styles.css` exist but are **not imported by the current HTML entrypoint**. They are preserved as historical/experimental sources pending a deliberate cleanup decision; editing them does not affect the live game.

## All shipped Act I scene identifiers

- Chapter 1, scene 1: `C01_S01`
- Chapter 1, scene 2: `C01_S02`
- Chapter 1, scene 3: `C01_S03`
- Chapter 2, scene 1: `C02_S01`
- Chapter 2, scene 2: `C02_S02`
- Chapter 2, scene 3: `C02_S03`
- Chapter 3, scene 1: `C03_S01`
- Chapter 3, scene 2: `C03_S02`
- Chapter 3, scene 3: `C03_S03`
- Chapter 4, scene 1: `C04_S01`
- Chapter 4, scene 2: `C04_S02`
- Chapter 4, scene 3: `C04_S03`
- Chapter 5, scene 1: `C05_S01`
- Chapter 5, scene 2: `C05_S02`
- Chapter 5, scene 3: `C05_S03`
- Chapter 6, scene 1: `C06_S01`
- Chapter 6, scene 2: `C06_S02`
- Chapter 6, scene 3: `C06_S03`

Scenes `C01_S01`–`C03_S03` are declared in `src/content.js`; `C04_S01`–`C06_S03` in `src/act1b.js`, composed as `scenes`. Every identifier has a mode/location mapping in `src/redesign-scenes.js`. **18 definitions do not equal 18 production-gold scenes.**

## Capability truth table

| Capability | Classification | Evidence / limitation |
|---|---|---|
| One-screen cinematic scene presentation | Shipped scaffold | `src/app-redesign.js`, `src/redesign-scenes.js`, `styles-redesign.css`; art is DOM/CSS/procedural |
| Scene choice → effect → result → continue | Shipped scaffold | `commit()` in `src/engine.js`; primary controller in `src/app-redesign.js` |
| Local save/load and reset | Partial | Local storage key `kingmaker_statecraft_v03`; v02 normalization, errors fall back to fresh without recovery UI |
| Actor relations, promises, scheduled inbox callbacks | Partial | `src/engine.js`; simple counters and scheduled messages, no comprehensive ledger |
| Three coalition routes and Act I outcome | Partial | Routes in engine/content; no balance/playtest proof |
| Full investigate / contact / negotiate loops | Spec-only or incomplete | No separate action-cost investigation transaction in current controller |
| Runtime schema v1 | Spec-only | `data/game_state_schema_v1.json` broader than engine v0.3 object; requires migration design |
| Real character/location key art | Not shipped | Character silhouettes and procedural props only; visual signoff outstanding |
| No-dependency runtime tests | Not present | Existing `.github/workflows/production-backlog.yml` only checks production-backlog integrity |
| Browser/device/keyboard/accessibility baseline | Not verified | Dedicated M0 tasks `KM-005` and `KM-007` pending |
| Full 36-chapter campaign | Spec-only beyond Act I | 6-act plan exists; no shipped Chapters 7–36 |

## Concrete gaps and risks (not silently fixed here)

1. `src/engine.js`: `commit(s,opt)` trusts the caller's option, lacks a current-scene option/duplicate-action guard, and has no event IDs. Add targeted replay/save tests in KM-004 before design changes.
2. `src/engine.js`: `normalize()` does not comprehensively validate restored state; v02 import is coarse normalization. Audit schema compatibility in KM-006 and migration design later.
3. `src/app-redesign.js`: scene rendering, overlay state, navigation and event handlers are coupled; formal scene contract and separation are KM-009/KM-011.
4. Scene evidence currently distinguishes some `confirmed` and `uncertain` labels but lacks a general provenance/independence model; do not mistake labels for verified truth.
5. `index.html` has no build pipeline; the public static site is a boot target, not a verified gameplay smoke test. KM-002/KM-003 should add reproducible checks.
6. Quality `quality()` includes historical choice-score averages; audit all exposure points before introducing new choice displays to preserve the no-prechoice-quality rule.
7. Real device visual QA and human art approval have not occurred in this audit. No performance or comprehension numbers are inferred.

## Documentation reconciliation

The **current** `README.md` and `design/09_CINEMATIC_VISUAL_PIVOT.md` already point at `app-redesign.js`. Earlier planning text saying they are *currently* stale was an outdated hypothesis; the affected production notes were corrected. Do not revert either file to `app-cinematic.js`.

## Next dependency-ready work after review/merge

- `KM-002`: reproducible fresh-checkout local build/test workflow (P0).
- `KM-006`: exhaustive engine v0.3 ↔ schema v1 delta map (P0).
- `KM-012`, `KM-089`: independently ready P1 art/reference and taxonomy work; subordinate to the M0 critical path.

**Verification:** source tree and import/ID count inspected through GitHub; backlog validator is a repository CI check and must be confirmed separately. No browser launch, gameplay interaction or save/load simulation performed here.
