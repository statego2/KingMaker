# KINGMAKER — QUALITY, VERIFICATION & PLAYER RESEARCH STRATEGY

## Intent
Quality is measured by how people **experience and understand** decisions in a living political world, not by commits, scene count or screenshots alone. Each milestone combines automated checks, structured manual tests, gameplay evidence and creative signoff. Do not claim tests were run if they were not.

## 1. Quality levels

### Q0 — Static validation
- JavaScript syntax and module import graph; schema and content references.
- Every scene has unique ID, valid chapter, source/evidence data, at least two strategic options, guarded conditional variants, reachable next scene.
- Actor IDs/location IDs and art refs exist. No orphaned callback/commitment.
- Backlog graph acyclic; dependencies ready before marking in-progress.

### Q1 — Simulation unit/integration testing
- Fresh/save/load/reset, old v0.3 migration, corruption recovery.
- Commit applies effects only once; deterministic replay and event order.
- State invariants: bounded resources, possible coalition, reasonable attention/time, promise status exclusivity, unique callback delivery, no null scene for valid state.
- Golden fixtures: Chapter 1 three options, Day Zero→Day 2, Act I multi-government variants, Silas observations, NSO route and repeated callbacks.
- At least one long state path for each significant choice route. Differing random seed may affect outcome, not known input or source provenance unfairly.

### Q2 — Browser interactions and accessibility
- One-tap action → selected → commit → consequence → continue.
- Open/close context and field kit; keyboard focus, Escape, Back; no hidden navigation required.
- Phone viewport matrix including 320×568, 375×667, 390×844, 430×932; landscape/desktop smoke. These are **test targets**, not a claim devices have been tested.
- Increased text / 200% zoom, readable Greek, valid ARIA, contrast, reduced motion, touch targets, narrator/screen reader review.
- Safe-area inset and long choice text must not block commit.
- Audio mute and autoplay policy; required meaning conveyed without sound.

### Q3 — Player-level game test
A guided observer may set up and record but must **not coach strategic understanding** during blind sessions.
Before: prior game experience and expectations, never leading "did you like it".
During: where user hesitates, inquiry frequency, misleading provenance, reading/scanning, return to dossier, choice time, voluntary continuation.
After: ask the player to explain (1) goal, (2) known vs uncertain, (3) alternatives and costs, (4) immediate reaction, (5) expected downstream consequences, (6) a memorable actor.
Log anonymous transcripts/structured notes with consent; don't infer universal rates from 3–5 people.

### Q4 — Release hardening
Performance with measured budgets on an actual target reference device, storage quotas, offline/error fallback where supported, compatibility and corrupted-state recovery, credits/asset usage rights, deploy preview/rollback, browser security/privacy review. Block launch on crash/critical save-loss/data leakage/major accessibility failures.

## 2. Gold Chapter 1 exit criteria
- 07:12 briefing has a genuine investigation action costing time/attention or access.
- Nela procedural clause enables actual option value, not cosmetic flavor.
- Presidential one-page brief responds to framing rather than a universal graded answer.
- Facts, claims, inferences and unknowns labeled and accessible in context.
- Reaction and at least one future callback are visible/testable without exposing quality metric early.
- Small-phone play without clipped choices or unreasonable text minification.
- Save/resume tests, multi-choice playthroughs and simple measurement protocol exist.
- Gold **requires a human creative review**; autonomous tests can only prepare evidence.

## 3. Nine-scene M3 pilot plan
Use a small convenience sample of novice players first, ideally varying genre familiarity. Record gameplay completion time, points of friction, whether they voluntarily choose the next scene, and whether they can articulate stakes/source confidence. Do not predeclare success rates without baseline; iterate on observed failure clusters. Keep the session self-contained, and do not use deceptive telemetry.

The owner decides whether results justify broad expansion. Possible decisions: **Go** (proof demonstrated); **Iterate** (bounded focused repair); **Pivot** (problem with core loop); **Stop** (not enough signal/resources).

## 4. Balancing and gameplay QA

| What to inspect | Example signal | Required response |
|---|---|---|
| Dominant option | almost everyone picks one choice for superficial gain | analyze option costs, evidence, alternatives and reversibility |
| Costless investigation | always gathering information never harms opportunity | meaningful time/attention/access cost, but not forced guesswork |
| Fake branching | different options lead to indistinguishable outcomes | strengthen systemic, dialogic or historical differences |
| Unfair twist | reversal depends on unknowable hidden state | add discoverable clue or bounded uncertainty |
| Knowledge leakage | hidden actor truth shown in UI | projection tests and provenance audit |
| Narrative overload | long passive reading blocks every scene | layered three-level text and interactive beat |
| Save fragility | flags lost after reload | deterministic replay regression, migration fixtures |
| Narrative contradictions | actor acts contrary to known canon/history | story memory and causal ledger validation |
| UI clutter | dashboard over cinematic scene | move analysis into contextual instrument |
| Art mismatch | actors/places inconsistent across scenes | locked character/style sheets and scene manifests |

## 5. Evidence record for each task
```yaml
task: KM-###
commit_or_pr: URL
changed_files: []
automated_checks:
  - command: "node ... "
    result: pass|fail|not-run
manual_checks:
  - scenario: "..."
    device: "..."
    result: pass|fail|pending
save_migration: not-applicable|tested|pending
asset_license_review: not-applicable|reviewed|pending
known_issues: []
reviewer: human-or-agent-and-scope
approval_required: yes|no
```

## 6. Release regression coverage matrix
At each act gate test:
- opening from clean profile;
- resumed old profile;
- three distinctive strategic routes (institutional / political / network);
- at least one no-investigation, all-investigation and constrained-attention path;
- high/low credibility and strong/weak relationship histories;
- several government arrangements/obligations;
- Act IV adversarial styles;
- Act V crisis cascades;
- Act VI succession variants;
- reduced motion, audio off, long Greek text, keyboard-only.

## 7. Privacy and telemetry
Instrument only what is necessary; favor anonymous, aggregate, opt-in session instrumentation. Avoid storing raw user decisions/communications remotely without disclosure and consent. Clearly distinguish fictional political in-game state from information about actual users. Implement explicit retention policy before collection.

## 8. No fabricated quality gates
A passed syntax check is not UX acceptance. A correct scene count is not content completeness. A public Pages URL is not proof deployment has refreshed. A handoff document is not a playable feature. Record all outstanding manual checks honestly.
