# KINGMAKER — MASTER PRODUCTION PLAN
**Version:** 1.0 (2026-10-08)  
**Status:** active planning baseline; NOT a claim that any future milestone is implemented.  
**Source of truth for task status:** `data/production_backlog_v1.json`.  
**AI starting point:** `AGENTS.md` → `docs/NEXT_ACTION.md` → backlog.

## 0. Executive production thesis

KINGMAKER is a **cinematic political-strategy judgment game**, not a government dashboard, not a branching quiz, and not a passive visual novel. A player should be able to **observe → investigate → interpret → commit → observe reaction → update beliefs** inside a persistent fictional republic. Philosophical and strategic learning must be dramatized, not presented as compulsory lessons.

**First principle: prove the first hour before manufacturing the remaining 30 hours.**

Production operates as **two loops**:
1. **Proof loop:** build a small complete experience, test comprehension/agency/emotional engagement, correct the model.
2. **Scale loop:** reuse validated scene grammar, simulation contracts, art pipeline, content templates, and QA suites across Acts II–VI.

Avoid feature growth without a demonstrated player problem. The core loop must be enjoyable even with optional dossiers and analytical instruments closed.

## 1. Verified starting point and limitations

Verified from the repository, NOT from a full device playtest:
- Public GitHub Pages build uses `index.html` → `src/app-redesign.js` and `styles-redesign.css`.
- `src/redesign-scenes.js` assigns nine scene modes (briefing, character, document, phone, map, media, warroom, timeline, dawn) across **18 scenes / Chapters 1–6**.
- `src/content.js` and `src/act1b.js` contain Act I scene content; `src/engine.js` manages a lightweight v0.3 state, relationships, promises, inbox, effects, scheduled callbacks, history and local save.
- Canonical **game-state schema v1** and system spec exist in `data/` and `docs/04_GAME_SYSTEMS_SPEC_V1.md`, but are **not identical to the shipped v0.3 runtime state**.
- Scene art is CSS/vector/procedural prototype, not a finished portrait/environment art pipeline. Current decisions are primarily A/B/C commits; full inquiry/negotiation/agent decision systems are not complete.
- There is no documented automated runtime test pipeline/package manifest or validated performance/accessibility baseline in the tree inspected on 2026-10-08.
- `README.md` and parts of `design/09_CINEMATIC_VISUAL_PIVOT.md` describe older app entry points; fix document drift early.

**Do not represent a scene template as a finished piece of cinematic artwork, a game-system specification as executed code, or a code commit as a user-tested milestone.**

## 2. Canon, authority and change control

The following documents have different jobs:
1. **Narrative canon:** `docs/01_WORLD_BIBLE_V1.md`, `02_CHARACTER_BIBLE_V1.md`, `03_STORY_CAMPAIGN_ARCHITECTURE_V1.md`.
2. **System design contract:** `docs/04_GAME_SYSTEMS_SPEC_V1.md`; implementation can stage components incrementally but must track intentional deltas.
3. **Strategic curriculum canon:** `docs/00_MASTER_PROJECT.md`; 10 domains, 60 competencies, 1,000-question corpus as source material, not 1,000 on-screen quizzes.
4. **Visual authority:** `design/09_CINEMATIC_VISUAL_PIVOT.md` overrides dashboard-first treatments; `design/00_CREATIVE_DIRECTION.md` still governs creative principles.
5. **Executable truth:** shipped imports in `index.html`, `src/engine.js`, `src/content.js`, `src/act1b.js`, `src/app-redesign.js`, `src/redesign-scenes.js`.
6. **Execution status:** `data/production_backlog_v1.json`, `docs/NEXT_ACTION.md`, and committed evidence in PRs/test notes.

Never overwrite a canonical world/campaign assumption casually. Propose a decision record describing impact, alternatives, save/content migration and affected chapters before modifying canon. The owner approves material scope or artistic direction pivots.

## 3. Design invariants

- **One clear decision at a time.** Context is layered and optional, except information needed to decide fairly.
- **Political moments first, instruments second.** Major scene composition targets ~45–60% world, 15–25% story, 25–35% decision, *adapted for screen size and accessibility*; never force unreadable text to satisfy ratios.
- **Actual agency:** seeking knowledge, choosing who to contact, preserving optionality, leveraging/expending access, taking positions and accepting constraints.
- **Provenance/uncertainty:** distinguish verified fact, reported claim, inference and unknown; do not reveal developer ground truth.
- **No pre-choice quality labels, hidden morality meters or "correct answer" leakage.**
- **Outcome ≠ decision quality.** Fortune, actor incentives, resources and side effects must matter.
- **Consequences leave residue:** promises, relationships, institutions, media and history evolve and can return later.
- **Plausible, fair counterparties.** Political disagreement is not synonymous with corruption or villainy.
- **Readable, touch-friendly, mobile-first.** No requirement to scroll past unrelated UI to reach a decision. For long text, accessible inspect sheet/modal is acceptable.
- **No gratuitous complexity:** every mechanic must create a meaningful trade-off, better information or new player action.

## 4. Milestones, gates and critical path

The phase/task identifiers below map to `data/production_backlog_v1.json`.

| Gate | Deliverable | Why it matters | Hard exit criterion |
|---|---|---|---|
| M0 / P00 | Evidence-based baseline + test harness | Know what works before refactoring | Boot/commit/save/restore/regression smoke reproducible; baseline problems logged |
| M1 / P01 | Scene architecture + art pipeline | Templates are reusable, not bespoke hacks | Scene contracts, responsive layout, visual-reference approval, asset provenance |
| M2 / P02 | **Gold Chapter 1** | First complete playable proof | Three scenes with investigation, consequence and persistent feedback; usable on target phones |
| M3 / P03 | **Gold Chapters 1–3** | Prove sustained experience | Nine scenes, callbacks, provenance, narrative hooks, supervised blind playtests |
| M4 / P04 | Simulation foundations | Content can branch/recombine with integrity | Deterministic replay, migration, memory, source/actor state and engine tests |
| M5 / P05 | **Polished Act I (Ch 1–6)** | First release-worthy small game | All 18 scenes upgraded and multi-route ending tested; no known critical blockers |
| M6 / P06 | Act II — The Operator | Execution/implementation becomes gameplay | Ch 7–12 built and project/resource systems are playable |
| M7 / P07 | Act III — The Kingmaker | Coalition and agenda power | Ch 13–18 built; relational power and negotiation evidenced by outcomes |
| M8 / P08 | Act IV — The Counterplayer | Adversarial learning without unfairness | Ch 19–24 built; Silas probes visible via fair clues |
| M9 / P09 | Act V — The System | Multi-crisis strategic orchestration | Ch 25–30 built; resource allocation creates consistent second-order effects |
| M10 / P10 | Act VI — Legacy | Personal power vs durable institutions | Ch 31–36 built; endings trace back to recorded structural choices |
| XP / P11 | Curriculum + difficulty | Deep knowledge inside cases | Mechanism coverage matrix, optional debrief, calibrated modes, no spoilers |
| XP / P12 | Art, sound, game feel, accessibility | Immersion and usability | Audio/visual consistency, readable UI, reduced-motion/mute parity |
| MR / P13 | Quality, release and live operations | Trustworthy distributable product | Automated + manual matrix, privacy/accessibility/performance gates, rollback plan |

**Critical path:** P00 → P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → release.  
P11/P12 and much of P13 **run alongside**, rather than waiting until the end. Tasks have more precise dependency edges in the machine-readable backlog.

### Working priority order

1. Preserve compatibility and establish tests.
2. Build visually convincing, legible **Chapter 1**, not merely another universal CSS skin.
3. Give the player one genuinely consequential investigation action, not just three static answers.
4. Verify narrative feedback and save/resume.
5. Validate Chapters 1–3 with real players before expanding production.
6. Harden the engine/data architecture *before* scripting Acts II–VI at scale.
7. Scale in six-chapter act increments, always including art, code, QA and feedback.

## 5. Workstreams / responsibilities

| Stream | Work product | Typical owner role |
|---|---|---|
| Product / design | north star, decision records, target audience, gates | creative director / game designer |
| Narrative / world | outline → scene cards → dialogue → conditional branches | narrative designer |
| Simulation / systems | state model, rules, memory, probabilities, balancing | gameplay engineer / systems designer |
| UX / interaction | scene flow, inspector, decision affordances, touch/accessibility | UX engineer |
| Visual / technical art | character continuity, scene backgrounds, maps, documentation | art director / artist / technical artist |
| Audio / motion | ambience, scene cues, silent states, performance | audio designer / motion engineer |
| Learning design | principle coverage, case validity, debrief, calibrated difficulty | curriculum designer |
| Quality / platform | automated tests, mobile matrix, saves, deployment, telemetry | QA / release engineer |
| Producer / orchestration | dependencies, estimates, status, handoffs, risks | AI agent + human approver |

An AI can fulfil multiple roles on a small team, but **review roles must remain distinct in acceptance** (e.g. author cannot declare UX satisfaction from code compilation alone).

## 6. Estimates / planning horizon

Use **relative size, not invented calendar commitments**:
- S: focused one-file/one-behavior change, typically sub-day.
- M: scoped subsystem slice, likely multiple files.
- L: cross-functional feature with validation and integration.
- XL: split into multiple tasks before implementation.

These are *not reliable velocity forecasts*. Establish empirical throughput from M0–M3. Re-estimate after every gate using merged work, remaining uncertainty, asset production and human playtest throughput. Reserve explicit integration/polish slack in each act; avoid a false fixed release date before M3.

## 7. Dependency and staffing policy

Never begin mass chapter scripting while scene contract, engine versioning and first playtest lessons are unresolved. Parallelize independent art research, documentation, curriculum tagging and QA harness work. Avoid concurrent writes to `src/engine.js`, scene tables or `index.html` without a branch-level integration owner.

**Definition of Ready:** scope bounded; acceptance observable; dependencies done; canonical references known; implementation path testable; required human creative approval identified.

**Definition of Done:** code/content merged; relevant checks pass; scene interaction demonstrated where applicable; no save regression; manual-only verification listed honestly; checklist and progress log updated with PR/commit proof. No gate auto-passes on the basis of source-code existence alone.

## 8. Quality gate rubric (release-blocking)

For each selected chapter:
- **Comprehension:** a new player can state who needs what, known vs unverified facts, and available levers without coaching.
- **Agency:** player had meaningful options/inquiry; no dominant trivial choice.
- **Consequence:** immediate reaction visible; delayed paths reachable and testable.
- **Fairness:** evidence sufficient; hidden developer score not exposed; adversarial behavior foreshadowed.
- **Pacing:** no compulsory lore dump; one primary objective; hooks emerge from actual systems.
- **Visual identity:** scene recognizably situated in Lydria; portraits/documents readable at small viewport.
- **Technical:** no console errors; touch targets and focus; save/load; reduced motion; low-end mobile smoke; regression scenarios.
- **Content integrity:** canon names, event chronology, actor access and promise continuity verified.

Quantitative thresholds (performance, comprehension rate, defect budgets) must be **baselined with devices and playtest sample**. Do not manufacture target percentages without context. See `docs/QUALITY_AND_TEST_STRATEGY.md`.

## 9. Key risks and mitigations

| Risk | Trigger | Mitigation |
|---|---|---|
| Beautiful but hollow visual novel | choices only; no inquiry/counterplay | Chapter 1 agency gate before adding art mass |
| Engine/spec drift | state v0.3 incompatible with v1 schema | versioned adapter + migrations + golden tests |
| Infinite content scope | branches multiply per chapter | branch-and-recombine; bounded consequence horizon |
| Generic visual identity | placeholder CSS mistaken for final art | shot/asset bible, character continuity review |
| UI regresses to government SaaS | dense stacked cards become primary mode | scene-first approval rubric |
| False strategic lessons | "perfect answer" inferred from hidden rubric | evidence and trade-off review, decision ≠ outcome |
| AI conflict and status fiction | multiple agents edit same file or mark todo done | task claim, PR proof, dependency validation |
| Narrative memory collapses | promise/callback lost between chapters | replay fixtures and callback tests |
| Mobile/performance issues | assets heavy, small screens cut off choices | perf budgets, adaptive crops, device matrix |
| Premature monetization/scaling | production before retention/comprehension evidence | staged gates, player research |

## 10. Management rhythm

Each work session:
1. Read `AGENTS.md`, `docs/NEXT_ACTION.md`, this plan, the precise task and affected canon.
2. Inspect current `main` and open PRs; never rely on an old snapshot.
3. Select one dependency-ready task; record intention and branch.
4. Deliver smallest verifiable slice and tests/screenshots where feasible.
5. Mark status only with concrete proof; update blockers/gate state and `docs/NEXT_ACTION.md` in the same PR.
6. Summarize: completed, tests actually run, files touched, remaining risks, next available task.

At each gate: hold a review of gameplay, narrative, art, tech, and operational risk. Keep user approval separate from automated checks for major creative changes.

## 11. Cross-document index

- **Agent contract:** `AGENTS.md`
- **Next task and living status:** `docs/NEXT_ACTION.md`
- **Full machine backlog / dependencies:** `data/production_backlog_v1.json`
- **Readable task inventory:** `docs/TASK_REGISTER.md`
- **Working with autonomous AI agents:** `docs/AI_DELIVERY_PROTOCOL.md`
- **Quality and evidence:** `docs/QUALITY_AND_TEST_STRATEGY.md`
- **36-chapter production map:** `docs/CAMPAIGN_PRODUCTION_MATRIX.md`
- **Validate task graph:** `node tools/validate-production-backlog.mjs`

The plan is designed for **progressive elaboration**: near-term tasks have fine-grained DoD; later tasks form an executable WBS and must be decomposed into scene-specific work before entering `in_progress`.
