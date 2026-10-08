# KINGMAKER — LIFE SIMULATION PRODUCTION PLAN
## Work breakdown, dependencies, sequencing, schedule and delivery rules
**Version:** proposal 1.0 · 2026-10-08  
**Status:** DESIGN PLAN ONLY; implementation not yet started, milestones not passed.  
**Related:** [Charter](2026-10-08_LIFE_SIM_PROJECT_CHARTER.md) · [Test Protocol](2026-10-08_LIFE_SIM_TEST_PROTOCOL.md) · [Pivot ADR](2026-10-08_LIFE_SIM_PIVOT_ADR.md)

## 0. Production thesis: prove fun before scale

The new **dream → action → world resistance → meaningful consequence → evolving life** loop must be proven by real play before a large tech refactor. Use ChatGPT as temporary front end per `docs/CHAT_FIRST_PLAYTEST_WORKFLOW.md`; use GitHub for accepted learnings, durable state, reproducible fixtures, prototype and tests.

**Why this is not a 36-chapter schedule:** Chapters are now optional emergent arcs, not mandatory navigation or win conditions. This plan is a *parallel exploration*. Existing Lydria campaign remains intact until a reviewed ADR decision.

**Prioritized proof sequence:**
1. Can a player enter a freeform dream and experience resistance that feels fair, surprising and enjoyable?
2. Can the world remain causally coherent over a decade and survive failure/recovery rather than granting wishes?
3. Can the exact same mechanics support fundamentally different aspirations (wealth, family, influence, quiet life)?
4. Only then: can a browser experience preserve the chat prototype's magic?

## 1. Baseline & capability inventory

As inspected 2026-10-08, the shipped static game has 18 Act I scenes; actual entrypoint `index.html` imports `src/app-redesign.js`; `src/engine.js` maintains v0.3 scene-index and simple state. Richer `data/game_state_schema_v1.json`, `docs/04_GAME_SYSTEMS_SPEC_V1.md`, test suites and political story are reusable **assets**, not a ready-made freeform life simulator. `data/production_backlog_v1.json` remains the canonical backlog for shipped political work. Read `AGENTS.md` and `docs/NEXT_ACTION.md` at every implementation start, and inspect live PRs because handoff snapshots can age quickly.

**Architecture choice for the proof:** isolated `experiments/life-sim/` (or similarly isolated directory/package agreed in implementation PR) with pure deterministic domain code, fixture data and thin adapter. Avoid editing production `src/engine.js` or `src/app-redesign.js` until compatibility is proven. This is a design hypothesis; evaluate actual test/runtime constraints before choosing an exact path.

## 2. Schedule model and estimation policy

Schedule is **relative to explicit approval** (T0 = creator approves opening the execution track). No automated/background work implied. A phase can take many separate interactive work sessions. Estimates are rough **engineering effort**, excluding waiting for creative feedback, and assume one capable engineer/AI-assisted workstream plus regular owner playtests and reviews. Ranges are planning estimates, not delivery promises.

| Phase / target window from T0 | Goal | Estimated active effort | Dependencies | Gate |
|---|---|---:|---|---|
| L0 / Week 1 | Research and chat-play proof | 10–20 h | charter review | G0 / loop worth developing |
| L1 / Weeks 2–3 | Minimal domain model, goals, commands, ledgers | 20–35 h | L0 | G1 / state truth |
| L2 / Weeks 3–5 | Independent world, actors, resistance, time | 30–55 h | L1 | G2 / fair simulation |
| L3 / Weeks 5–6 | Narration, memory, legacy, 4 life paths | 20–40 h | L2 | G3 / memorable play |
| L4 / Weeks 6–8 | Lightweight browser vertical slice | 25–45 h | L3 | G4 / mobile first-hour proof |
| L5 / Weeks 8–9 | Balance, blind tests, pivot decision | 15–30 h | L4 | G5 / go-iterate-pivot-stop |

**Totals:** 120–225 h indicative engineering/prototype effort, plus creative testing/rework. The calendar windows assume sufficiently frequent execution sessions and can slip. Do not represent them as unattended background work or firm due dates. If L0 fails, pause the rest before spending the estimates.

**Critical path:** LSM-001 → 003 → 005 → 009 → 013 → 017 → 021 → 027 → 032 → 037 → 041.  
**Parallel opportunities:** UI concept/Greek prose and test design can run beside state design; strategic-mechanism tagging can be explored after the early play loop proves fun; visual polish waits for UX proof.

## 3. Work breakdown structure (WBS)

**Status convention:** All tasks below = `proposed` until explicitly initiated. IDs `LSM-###` are a *proposal namespace*, deliberately separate from live `KM-###` backlog. No task below is marked shipped, review or done. Time estimates below are engineering effort **per task**, not elapsed clock time.

### L0 — Discovery and chat-play proof · Gate G0

| ID | Priority / h | Depends | Concrete deliverable / acceptance |
|---|---|---|---|
| LSM-001 | P0 / 1–2 | — | Record owner review of charter, identify approved hypotheses vs open questions; do not silently promote |
| LSM-002 | P0 / 2–3 | 001 | Audit baseline code/PRs, confirm compat and safe isolation boundary; document current behavior |
| LSM-003 | P0 / 2–3 | 001 | Establish chat-run template, intent→resolution→result format, continuity ledger and scenario seed |
| LSM-004 | P1 / 1–2 | 003 | Character/cast guidelines: ≤3 named actors in onboarding, parenthetical roles, optional details |
| LSM-005 | P0 / 3–5 | 003 | Run wealth-life playtest with at least 15 meaningful turns incl. financing refusal, partial success and callback |
| LSM-006 | P0 / 2–4 | 003 | Run non-wealth (relationships/family or quiet-life) test with changing goals and time compression |
| LSM-007 | P0 / 2–4 | 005,006 | Stress test power/influence and failure/recovery; record surprising-but-causal outcomes |
| LSM-008 | P0 / 2–3 | 005–007 | Synthesize a friction log, 5 strongest scenes, 5 weakest moments; creator G0 Go/Iterate/Stop |

**G0 exit:** At least one run feels worthwhile to continue without author coaxing; three distinct ambitions demonstrated at least as narrative mechanics; sources of arbitrariness noted. If the core play isn't fun, DO NOT build a large engine.

### L1 — Authoritative state and commands · Gate G1

| ID | Priority / h | Depends | Concrete deliverable / acceptance |
|---|---|---|---|
| LSM-009 | P0 / 3–5 | 008 | Model versioned player/time/wealth/debt/relationships/entities/aspirations; JSON schema and typed domain contracts |
| LSM-010 | P0 / 2–4 | 009 | Build event ledger: actor, cause, preconditions, effect, time, visibility, source, causal parent IDs |
| LSM-011 | P0 / 3–5 | 009 | Intent parser contract for GOAL/ACTION/DELEGATE/QUERY/WAIT/REVISE/RELATIONSHIP, preserving raw text |
| LSM-012 | P0 / 3–6 | 010,011 | Command validator and effects boundary; invalid actions cannot change state, duplicate ids cannot double-spend |
| LSM-013 | P0 / 3–6 | 010,012 | Seeded deterministic reducer, action replay, serialization, versioned saves and recovery from corrupted inputs |
| LSM-014 | P0 / 2–4 | 009,013 | Initial wealth/liability transfer rules: cash conserved or explicitly explained by income/expense/valuation, ownership ledger |
| LSM-015 | P1 / 2–5 | 009,011 | Belief/knowledge model; distinguish world truth, actor belief and what player has discovered |
| LSM-016 | P0 / 2–4 | 013–015 | Automatic invariant tests, long-tick age/time, failed-action, replay and migration fixtures; G1 decision |

**G1 exit:** Identical state+seed+action history reproduces identical game-state outcomes; no net-worth teleportation, age/date contradictions or orphaned entity links; original political saves unaffected.

### L2 — World resistance & autonomous people · Gate G2

| ID | Priority / h | Depends | Concrete deliverable / acceptance |
|---|---|---|---|
| LSM-017 | P0 / 4–7 | 016 | Feasibility engine: resources, eligibility, timeline, counterparty consent, delegation capabilities and refusal reasons |
| LSM-018 | P0 / 4–8 | 015,017 | NPC goals, relationships, memories, priorities, agency, and independent actions at world ticks |
| LSM-019 | P0 / 3–6 | 017,018 | Counterplay engine: rivals react to player's market/political/social moves, not all adversarial all the time |
| LSM-020 | P0 / 3–6 | 017 | Domain-resolution contracts: financing/enterprise, relationships/family, influence/politics, loss/recovery |
| LSM-021 | P0 / 3–5 | 018–020 | World-tick dispatcher: scheduled events, delayed promises, hazards, opportunities, callbacks; no forced catastrophe quota |
| LSM-022 | P0 / 2–5 | 020,021 | Time abstraction: hours/days/months/years; pause/compress on consequential crisis, no meaningless turn spam |
| LSM-023 | P0 / 3–6 | 017–022 | Delegation: hire experts, bounded authority, cost, trust, competence, failure and escalation threshold |
| LSM-024 | P1 / 2–4 | 018,021 | Story-salience policy: choose consequential events; add quiet-life beats, prevent incessant crisis |
| LSM-025 | P0 / 3–6 | 021–024 | Resistance/fairness calibration: decisions affect outcomes; opponent moves explainable; uncertainty bounded |
| LSM-026 | P0 / 3–5 | 017–025 | Golden scenario and seeded Monte Carlo **diagnostic** (not proof of fun); G2 review |

**G2 exit:** The player can ask for impossible, ambitious and mundane actions. Responses arise from state, not arbitrary narrator discretion. Same dream can unfold differently under different seeds without contradicting history. The simulation offers clear agency after setbacks.

### L3 — Human-readable life drama · Gate G3

| ID | Priority / h | Depends | Concrete deliverable / acceptance |
|---|---|---|---|
| LSM-027 | P0 / 3–6 | 026 | Narrative adapter renders player-known facts and salient choices; no invented mechanical outcomes |
| LSM-028 | P0 / 2–4 | 027 | Simple Greek and cast continuity: introduce one relevant person at a time, label roles, optional inspect |
| LSM-029 | P0 / 2–4 | 027 | Dream inbox event/command distinction, outcome summary, follow-up input, optional suggestion chips |
| LSM-030 | P0 / 3–6 | 022,027 | Life-span and mortality closure rules, age-consistent death, limited posthumous legacy based on recorded commitments |
| LSM-031 | P1 / 2–5 | 024,027 | Drama pacing: success/failure/quiet/relationship variation; no repetitive boardroom reports |
| LSM-032 | P0 / 4–7 | 027–031 | Play four ambition routes for ≥20 meaningful decisions each; assess memory, surprise, retrospective |
| LSM-033 | P0 / 2–4 | 032 | Creator G3 sign-off: "would I actually enjoy playing again?" Identify what to discard |

**G3 exit:** Distinctive endings for at least two runs; retrospective references concrete past causes; can play without opening any financial/legal/system dashboards.

### L4 — Browser vertical slice · Gate G4

| ID | Priority / h | Depends | Concrete deliverable / acceptance |
|---|---|---|---|
| LSM-034 | P0 / 2–4 | 033 | Agree independent browser runtime boundary and adapter; freeze affected legacy files |
| LSM-035 | P0 / 4–8 | 034 | Single responsive screen: ambition composer, events, action reply and time status |
| LSM-036 | P0 / 4–7 | 034,035 | Connect state/command/resolver/narrative pipeline with no untrusted UI-supplied state mutations |
| LSM-037 | P0 / 3–6 | 036 | Save/load/version migration; verify no interaction with existing political campaign storage keys |
| LSM-038 | P1 / 3–5 | 035–037 | Optional inspect panels for wealth/assets, important people, organizations, commitments |
| LSM-039 | P0 / 4–7 | 035–038 | Mobile responsive/playability and accessibility checks at 320/375/390/430 widths; iPhone human review |
| LSM-040 | P0 / 3–5 | 037–039 | Browser integration tests: dream input, blocked goal, delayed consequence, failure recovery, reload, ending |
| LSM-041 | P0 / 2–4 | 039,040 | Play complete 15–30 minute vertical slice, collect first-hour friction, creator G4 approval |

**G4 exit:** The first 3 minutes deliver meaningful interaction; save/reload works; scenario navigable one-handed on phone; **do not** auto-merge/redeploy as replacement of main game.

### L5 — Balance, research & pivot decision · Gate G5

| ID | Priority / h | Depends | Concrete deliverable / acceptance |
|---|---|---|---|
| LSM-042 | P0 / 3–5 | 041 | Blind pilot protocol with 3–5 novice/experienced participants; informed consent, no participant coaching |
| LSM-043 | P0 / 3–5 | 042 | Capture comprehension, agency, predictability, voluntary continuation and remembered events |
| LSM-044 | P0 / 3–6 | 043 | Fix top three observed friction sources; repeat corresponding regressions |
| LSM-045 | P1 / 2–3 | 044 | Balance seeds for overgenerous wealth, arbitrary punishment, inactivity and NPC passivity |
| LSM-046 | P0 / 2–4 | 044,045 | Record G5 outcome: integrate Life Mode / full pivot / continue both / stop, with trade-offs and migration plan |
| LSM-047 | P0 / 1–2 | 046 | On acceptance only: propose changed master charter, production backlog and AGENTS handoff as a reviewed PR |

**G5 exit:** human-reviewed and evidence-backed decision. No blanket commitment to build the complete open-world game without passing G0–G4.

## 4. Contracts between independent AI/engineering contributors

Every work item must have: task ID, owner's authorized scope, touched paths, dependency status, acceptance cases, fixture evidence, relevant commit/PR, explicit unverified claims, next action.

**Concurrency rules:**
- Existing production modules are protected. No parallel changes to `src/engine.js`, `src/content.js`, `src/act1b.js`, `src/app-redesign.js` without coordinated ownership.
- All new gameplay domain mutations must go through a single reducer/resolver boundary.
- Story designers can add fixtures/structured events but **cannot** change balance or canonical facts implicitly via prose.
- Unit tests are part of the same PR as a new subsystem; no delayed "QA later" phase.
- A large feature = 1 focused testable vertical subfeature; do not mark parent complete.
- Existing active `KM-###` dependencies and review gates remain in force; proposal IDs don't bypass them.

## 5. Data model minimum, with extension points

```text
meta       schemaVersion, seed, turn, gameId
time       bornOn, currentDate, elapsed, temporalScale
player     alive, roles, properties, liabilities, competence, reputation, health
dreams     id, desiredOutcome, currentPriority, status, horizon, revisions
people     actorId, role, age, relationships, goals, knowledge, memory, currentPlan
companies  entityId, owners, liquidity, liabilities, governance, employees, status
world      politics, economy, geography, opportunityPressure, institutions
actions    id, actorId, intentType, parameters, constraints, delegation, submittedAt
events     id, effectiveAt, parents, visibility, cause, mutations, participants
openLoops  promises, negotiations, dueDates, obligations, ongoingProcesses
narration  projectedEvents, playerKnownRefs, pendingChoice
ending     deathCause, finalSnapshot, selectedLegacyHorizon, causalCallbacks
```

All schema fields require types, defaults, invariants, migration tests and documentation. Avoid 100 unnecessary 0–100 meters.

## 6. Design-specific balancing rules

- **No guaranteed rise/fall:** never deterministically trigger a scandal at 100m net worth or grant an inheritance to rescue player.
- **Meaningful uncertainty:** bad events may occur without warning if plausible in-world; major penalties must still have causally coherent sources. Some avoidable risks should be discoverable in advance.
- **NPC independence:** NPCs can say no, demand better terms, cooperate opportunistically, love, betray or walk away, with internally consistent motives and imperfect knowledge.
- **Power carries constraints:** influence creates access and leverage but also exposure, expectations, debts and rival attention.
- **Experts handle detail:** delegate law, finance, logistics, staff; consequence and strategic choices remain visible.
- **Quiet successes count:** not every joyful life needs an empire or dramatic loss.
- **Player can retarget:** goals are living preferences; changing ambition is valid gameplay.
- **Failure remains playable:** bankruptcy/divorce/defeat are transitions with realistic restrictions and new possible strategies, not automatic blank resets.

## 7. Continuous test strategy

Tests belong **inside** each engineering phase, and a separate cross-phase [test protocol](2026-10-08_LIFE_SIM_TEST_PROTOCOL.md) defines the risk matrix, exact cases, fairness experiments and acceptance thresholds.

Minimum test classes:
- **Contracts:** parsing and validation, references and schema.
- **Invariants:** asset/liability arithmetic, coherent age/calendar, conservation/explicit external flows, relationship references, bounded authority.
- **Replay:** seeded determinism, idempotent actions, save/load, crash recovery, version migrations.
- **Behavior:** refusals, constraints, delegated failures, rival reactions, partial success, quiet periods, delayed callbacks, re-prioritized dreams.
- **Narrative consistency:** no knowledge leakage, actor role consistency, no magical wealth/birth/death/marriage, no overwritten history.
- **UX:** phone sizes, keyboard/focus, large text, Greek legibility, mute/reduced motion, scroll-independent primary action.
- **Player research:** do they voluntarily continue? Can they explain why an outcome happened? What remained memorable?

At each gate report PASS/FAIL/NOT RUN separately for automated, structured manual and creative acceptance. No simulated engine or results are claimed until implemented and verified.

## 8. Practical immediate next action

**LSM-001**: creator accepts or adjusts Charter and explicitly chooses whether the execution experiment may proceed. Next, **LSM-003** should produce a tightly-scoped chat-first 20-turn wealth scenario with a truthful state ledger while **LSM-006** tests a non-wealth dream. Resist drawing conclusions from one giant improvised lifetime without measurable continuity.

**Stop rule for overengineering:** if the next feature does not make the player more free, the world more coherent, or the lived story more memorable, do not build it yet.
