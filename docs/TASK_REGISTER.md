# KINGMAKER — HUMAN-READABLE PRODUCTION TASK REGISTER

**Initial snapshot:** 2026-10-08. **111 tasks / 14 phases.** The live task status belongs to `data/production_backlog_v1.json` (this file is a convenience-generated snapshot).

## How to use
- Start at `AGENTS.md` and `docs/NEXT_ACTION.md`.
- Each task below has an immutable `KM-###` identifier, dependency IDs, priority, size, deliverable and two acceptance checks.
- `P0` = critical path, `P1` = important/parallel, `P2` = defer pending evidence. `XL` must be split before active implementation.
- Initially all implementation tasks are **todo**; the planning files themselves do not complete any implementation task.
- Proof of “done” requires merged/shipped work and acceptance evidence; do not trust the checkbox alone.
- Run `node tools/validate-production-backlog.mjs` after editing the source JSON.

## P00: Foundation / audit — M0
**Purpose:** Verify the shipped product and establish an honest reproducible baseline.

### [ ] KM-001 — Audit canonical entrypoints and stale references
**Priority:** P0 · **Size:** S · **Stream:** production · **Depends on:** none · **Baseline status:** todo.

**Deliverable:** Versioned inventory of shipped vs obsolete files and doc corrections

**Acceptance criteria:** (1) Live index/import graph and all 18 scene IDs recorded; (2) Obsolete design claims identified without changing canon.

### [ ] KM-002 — Create repeatable local build/test workflow
**Priority:** P0 · **Size:** M · **Stream:** engineering · **Depends on:** KM-001 · **Baseline status:** todo.

**Deliverable:** package scripts or equivalent reproducible commands

**Acceptance criteria:** (1) Fresh checkout boots app and reports errors consistently; (2) Instructions work without special private development setup.

### [ ] KM-003 — Add no-dependency smoke tests for imported scene data
**Priority:** P0 · **Size:** M · **Stream:** qa · **Depends on:** KM-002 · **Baseline status:** todo.

**Deliverable:** Automated data/import smoke and scene-count tests

**Acceptance criteria:** (1) All 18 Act I scene definitions resolve and have unique IDs; (2) Broken imports or malformed choices fail CI/local command.

### [ ] KM-004 — Add deterministic decision/save/restore fixtures
**Priority:** P0 · **Size:** M · **Stream:** qa · **Depends on:** KM-003 · **Baseline status:** todo.

**Deliverable:** Golden smoke fixtures for first scene, mid run and ending

**Acceptance criteria:** (1) Choices mutate, save and reload as expected; (2) No hidden score shown prior to commitment.

### [ ] KM-005 — Baseline visual snapshots at phone and desktop widths
**Priority:** P0 · **Size:** M · **Stream:** ux · **Depends on:** KM-001, KM-002 · **Baseline status:** todo.

**Deliverable:** Screenshots, clipping ledger, target viewport matrix

**Acceptance criteria:** (1) First/longest/final scenes have captured layouts; (2) All clipped actions, illegible facts and overlap have issues.

### [ ] KM-006 — Audit existing v0.3 state against v1 schema
**Priority:** P0 · **Size:** M · **Stream:** systems · **Depends on:** KM-001 · **Baseline status:** todo.

**Deliverable:** Gap and migration map for schema/spec/runtime

**Acceptance criteria:** (1) Every key system marked shipped/partial/spec only; (2) Backward-compatible migration risks and test fixtures identified.

### [ ] KM-007 — Record baseline UX playtest and risk register
**Priority:** P0 · **Size:** M · **Stream:** product · **Depends on:** KM-005 · **Baseline status:** todo.

**Deliverable:** Short moderated test protocol, findings and ranked risks

**Acceptance criteria:** (1) At least three novice sessions or clearly flagged unavailable; (2) Comprehension/engagement blockers separated from aesthetic opinions.

### [ ] KM-008 — CI, branch protections and issue delivery convention
**Priority:** P0 · **Size:** M · **Stream:** devops · **Depends on:** KM-002, KM-003, KM-004 · **Baseline status:** todo.

**Deliverable:** Automated checks, PR template, ownership and change discipline

**Acceptance criteria:** (1) Pull requests run import, backlog-validation and baseline tests; (2) Human approval rules and merge/rollback ownership documented.


## P01: Scene system / art pipeline — M1
**Purpose:** Create reusable premium scene grammar, world and character pipeline.

### [ ] KM-009 — Define versioned scene presentation contract
**Priority:** P0 · **Size:** M · **Stream:** engineering · **Depends on:** KM-001, KM-006 · **Baseline status:** todo.

**Deliverable:** Scene mode schema with actors, source IDs, pressure and art refs

**Acceptance criteria:** (1) 18 current scenes can resolve through contract and fallbacks; (2) Unknown mode/actor fails gracefully and validates.

### [ ] KM-010 — Implement adaptive scene layout shell
**Priority:** P0 · **Size:** L · **Stream:** ux · **Depends on:** KM-009, KM-005 · **Baseline status:** todo.

**Deliverable:** Responsive world/context/decision composition

**Acceptance criteria:** (1) No clipped primary action at small/large viewport and enlarged text; (2) Touch and keyboard navigation remain usable.

### [ ] KM-011 — Separate scene renderer from interaction/state orchestration
**Priority:** P0 · **Size:** L · **Stream:** engineering · **Depends on:** KM-009, KM-004 · **Baseline status:** todo.

**Deliverable:** Modular renderer and controller boundary

**Acceptance criteria:** (1) Existing commit/save/back/instruments flows survive refactor; (2) View is not allowed to mutate simulation silently.

### [ ] KM-012 — Create Lydria location and time-of-day visual bible
**Priority:** P1 · **Size:** M · **Stream:** art · **Depends on:** KM-001 · **Baseline status:** todo.

**Deliverable:** Approved art boards for Velis, Presidency, Assembly, Harbor, Sera, Aster Gate, Daran

**Acceptance criteria:** (1) Each place has 3 recognizable motifs and palette rules; (2) No contradiction with world/character canon.

### [ ] KM-013 — Build character identity/continuity sheets
**Priority:** P1 · **Size:** M · **Stream:** art · **Depends on:** KM-012 · **Baseline status:** todo.

**Deliverable:** Main cast reference and portrait consistency manifest

**Acceptance criteria:** (1) Principal actors recognizable across scenes and expressions; (2) Role, age, location and wardrobe continuity tracked.

### [ ] KM-014 — Build asset specification and attribution manifest
**Priority:** P0 · **Size:** M · **Stream:** art · **Depends on:** KM-012, KM-013 · **Baseline status:** todo.

**Deliverable:** Asset manifest naming, dimensions, provenance, licenses

**Acceptance criteria:** (1) Each used asset has source/license and target crop metadata; (2) Placeholder-to-final asset replacement requires no code fork.

### [ ] KM-015 — Implement evidence/document prop components
**Priority:** P1 · **Size:** M · **Stream:** ux · **Depends on:** KM-009, KM-010 · **Baseline status:** todo.

**Deliverable:** Paper, classified memo, news and source provenance templates

**Acceptance criteria:** (1) Facts/suspicions have explicit non-color-only labels; (2) Greek and English text fit without truncating meaning.

### [ ] KM-016 — Implement cinematic template accessibility and reduced motion
**Priority:** P0 · **Size:** M · **Stream:** ux · **Depends on:** KM-010, KM-011 · **Baseline status:** todo.

**Deliverable:** Focusable inspect sheets and motion-safe transitions

**Acceptance criteria:** (1) Modal traps/restores focus, escape/back works; (2) Reduced motion disables nonessential transitions without hiding content.

### [ ] KM-017 — Approve first visual direction with real art samples
**Priority:** P0 · **Size:** M · **Stream:** product · **Depends on:** KM-012, KM-013, KM-014, KM-015 · **Baseline status:** todo.

**Deliverable:** Sign-off board with 3 gameplay mock screenshots

**Acceptance criteria:** (1) Actual portrait and room samples reviewed at phone size; (2) Owner explicitly approves quality before mass asset production.


## P02: Gold Chapter 1 — M2
**Purpose:** Ship three outstanding playable scenes with true agency and feedback.

### [ ] KM-018 — Write Chapter 1 scene experience specification
**Priority:** P0 · **Size:** M · **Stream:** narrative · **Depends on:** KM-001, KM-007 · **Baseline status:** todo.

**Deliverable:** Three-scene beats, stakes, actors, inquiry and callback map

**Acceptance criteria:** (1) Each scene has one question, three levers and an information gap; (2) Characters and chronology conform to original Day Zero canon.

### [ ] KM-019 — Build Chapter 1 opening with production art
**Priority:** P0 · **Size:** L · **Stream:** art · **Depends on:** KM-014, KM-017, KM-018 · **Baseline status:** todo.

**Deliverable:** Finished playable 07:12 presentation, source sheets and atmosphere

**Acceptance criteria:** (1) Scene visually distinct and information legible on target phone; (2) No generic placeholder silhouettes presented as final portrait.

### [ ] KM-020 — Design investigation action contract and time/attention cost
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-006, KM-018 · **Baseline status:** todo.

**Deliverable:** Investigation action schema and resolution rules

**Acceptance criteria:** (1) Action changes knowledge/options at stated cost; (2) At least one choose-to-investigate vs commit trade-off exists.

### [ ] KM-021 — Implement investigative interaction in 07:12 briefing
**Priority:** P0 · **Size:** L · **Stream:** engineering · **Depends on:** KM-020, KM-019, KM-011 · **Baseline status:** todo.

**Deliverable:** Call/verify/source interaction and UI feedback

**Acceptance criteria:** (1) Verified/unverified signals update before commit; (2) Test proves attention/time budget and consequences persist.

### [ ] KM-022 — Redesign Chapter 1 Nela procedural scene
**Priority:** P0 · **Size:** M · **Stream:** narrative · **Depends on:** KM-018, KM-020 · **Baseline status:** todo.

**Deliverable:** Playable procedural investigation scene with distinctive voice

**Acceptance criteria:** (1) Procedural clause is discoverable and meaningful; (2) Timed trade-off not solved by a trivial correct-choice highlight.

### [ ] KM-023 — Redesign Chapter 1 one-page Presidency scene
**Priority:** P0 · **Size:** M · **Stream:** narrative · **Depends on:** KM-018, KM-020 · **Baseline status:** todo.

**Deliverable:** Meaningful brief compression/communication interaction

**Acceptance criteria:** (1) Player distinguishes facts/inference/recommendation; (2) Different information hierarchy leads to observable reactions.

### [ ] KM-024 — Implement Chapter 1 reactions and delayed hook
**Priority:** P0 · **Size:** M · **Stream:** systems · **Depends on:** KM-021, KM-022, KM-023 · **Baseline status:** todo.

**Deliverable:** Observable character responses and future callback

**Acceptance criteria:** (1) At least one earlier act changes a later reachable scene; (2) Archive records who acted and why without exposing hidden variables.

### [ ] KM-025 — Run Chapter 1 save/resume and multi-choice playthrough regression
**Priority:** P0 · **Size:** M · **Stream:** qa · **Depends on:** KM-021, KM-022, KM-023, KM-024 · **Baseline status:** todo.

**Deliverable:** Repeatable test paths incl action/skip/restoration

**Acceptance criteria:** (1) Every available choice advances without crash or soft lock; (2) Reload preserves earned information and pending callback.

### [ ] KM-026 — Gold Chapter 1 blind playtest and polish gate
**Priority:** P0 · **Size:** L · **Stream:** product · **Depends on:** KM-019, KM-024, KM-025 · **Baseline status:** todo.

**Deliverable:** Evidence log of sessions, issues and accepted fixes

**Acceptance criteria:** (1) Novices can explain the stakes and information confidence; (2) Owner reviews compelling visuals, agency and desire to continue.


## P03: Gold Chapters 1–3 — M3
**Purpose:** Prove a sustained first-session experience across nine connected scenes.

### [ ] KM-027 — Rewrite Chapter 2 actor conflict and consented dialogue structure
**Priority:** P0 · **Size:** M · **Stream:** narrative · **Depends on:** KM-026 · **Baseline status:** todo.

**Deliverable:** Three linked 121st Vote scene production cards

**Acceptance criteria:** (1) Actor incentives differentiated in dialogue; (2) Scenes preserve earlier count and procedural flags.

### [ ] KM-028 — Build Chapter 2 character portrait/phone/mapping assets
**Priority:** P1 · **Size:** L · **Stream:** art · **Depends on:** KM-017, KM-027 · **Baseline status:** todo.

**Deliverable:** Production art and motion for character/phone/coalition scenes

**Acceptance criteria:** (1) Location/actor continuity consistent with Chapter 1; (2) Source visuals readable without metadata clutter.

### [ ] KM-029 — Implement Chapter 2 conversation and rumor-verification loop
**Priority:** P0 · **Size:** L · **Stream:** engineering · **Depends on:** KM-020, KM-027 · **Baseline status:** todo.

**Deliverable:** Two-way dialogue and verification actions

**Acceptance criteria:** (1) Rumor source dependencies constrain what is actually known; (2) Skipped inquiry remains viable with risk and time opportunity cost.

### [ ] KM-030 — Rewrite Chapter 3 evidence chain and media conflict
**Priority:** P0 · **Size:** M · **Stream:** narrative · **Depends on:** KM-026, KM-027 · **Baseline status:** todo.

**Deliverable:** Three scene cards for The File

**Acceptance criteria:** (1) Chain of custody and privacy/legal constraints credible; (2) Past rumor choices alter interpretation or access.

### [ ] KM-031 — Build Chapter 3 paper/newsroom and Harbor art
**Priority:** P1 · **Size:** L · **Stream:** art · **Depends on:** KM-017, KM-030 · **Baseline status:** todo.

**Deliverable:** High-readability classified file and press visuals

**Acceptance criteria:** (1) Newspaper represents only events available to press; (2) No claims unsupported by game state appear as confirmed.

### [ ] KM-032 — Implement branching call-backs across Chapters 1–3
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-024, KM-029, KM-030 · **Baseline status:** todo.

**Deliverable:** Persistent flag, promise and sourced reveal callbacks

**Acceptance criteria:** (1) At least two decisions return in later scenes in materially distinct ways; (2) Replay fixtures prove continuity through all nine scenes.

### [ ] KM-033 — Add information provenance inspect experience
**Priority:** P0 · **Size:** M · **Stream:** ux · **Depends on:** KM-015, KM-029, KM-030 · **Baseline status:** todo.

**Deliverable:** Expandable claims with source, confidence and chronology

**Acceptance criteria:** (1) Player can distinguish reported claims from independent verification; (2) No developer truth or hidden quality revealed.

### [ ] KM-034 — First-session pacing, art and response instrumentation
**Priority:** P0 · **Size:** M · **Stream:** qa · **Depends on:** KM-028, KM-029, KM-031, KM-032 · **Baseline status:** todo.

**Deliverable:** Time-in-scene, inquiry use and voluntary exit instrumentation or study sheet

**Acceptance criteria:** (1) Can identify skipped/overlong scenes without personal tracking; (2) Instrumentation opt-in/local and privacy review documented.

### [ ] KM-035 — Gold Chapters 1–3 gate with external playtest
**Priority:** P0 · **Size:** L · **Stream:** product · **Depends on:** KM-033, KM-034 · **Baseline status:** todo.

**Deliverable:** Playtest findings, decision journal and M3 approval

**Acceptance criteria:** (1) Nine scenes tested end-to-end on real phone(s); (2) No mass campaign expansion until owner accepts proof loop.


## P04: Persistent simulation foundation — M4
**Purpose:** Harden state, actor, evidence and consequence systems before content scale.

### [ ] KM-036 — Choose runtime schema evolution and migration strategy
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-006, KM-035 · **Baseline status:** todo.

**Deliverable:** Architecture decision record for v0.3 ↔ v1 state alignment

**Acceptance criteria:** (1) Upgrade can load existing v0.3 saves without wiping gameplay; (2) Migration test covers missing fields and invalid saves.

### [ ] KM-037 — Separate pure simulation from storage/UI
**Priority:** P0 · **Size:** L · **Stream:** engineering · **Depends on:** KM-036, KM-011 · **Baseline status:** todo.

**Deliverable:** Pure state transition APIs and persistence adapter

**Acceptance criteria:** (1) Deterministic same input yields same output; (2) Existing UI and local save remain functional.

### [ ] KM-038 — Add content/event IDs and replayable event log
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-037 · **Baseline status:** todo.

**Deliverable:** Immutable event and content provenance contracts

**Acceptance criteria:** (1) All commit/investigation events have stable IDs and order; (2) Replaying a recorded session recreates equivalent state.

### [ ] KM-039 — Implement beliefs and source independence model
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-037, KM-038, KM-033 · **Baseline status:** todo.

**Deliverable:** Player-known facts, claims, independence and confidence

**Acceptance criteria:** (1) Two correlated claims not treated as independent proof; (2) Hidden truth never accidentally enters UI projection.

### [ ] KM-040 — Implement character motivation, access and memory ledger
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-037, KM-038 · **Baseline status:** todo.

**Deliverable:** Actor memory/access/incentive transforms and recall

**Acceptance criteria:** (1) Lea/Elena/Silas react to prior behavior contextually; (2) Scene ownership visibility constraints tested.

### [ ] KM-041 — Implement promise/obligation lifecycle and callbacks
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-037, KM-038 · **Baseline status:** todo.

**Deliverable:** Formal offer, accepted promise, due, kept, broken, callback

**Acceptance criteria:** (1) Mutually exclusive promise statuses protected; (2) Consequences and archive stay consistent after reload.

### [ ] KM-042 — Implement scoped time/attention/action economy
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-037, KM-020 · **Baseline status:** todo.

**Deliverable:** Investigate/contact/delegate decisions as costed actions

**Acceptance criteria:** (1) Time window closes when clock budget exhausted; (2) Always-investigate exploit cannot dominate freely.

### [ ] KM-043 — Implement fairness-preserving branching and scene triggers
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-039, KM-040, KM-041, KM-042 · **Baseline status:** todo.

**Deliverable:** Branch-and-recombine scene scheduler

**Acceptance criteria:** (1) Alternative paths respect access and known facts; (2) No missing scene or dead-end from valid routes.

### [ ] KM-044 — Implement decision-quality vs outcome scoring and optional debrief
**Priority:** P0 · **Size:** M · **Stream:** systems · **Depends on:** KM-037, KM-039, KM-043 · **Baseline status:** todo.

**Deliverable:** Separate ex-ante decision rubric and stochastic outcome ledger

**Acceptance criteria:** (1) No hidden score visible before choice; (2) Reasoning references available evidence rather than realized luck.

### [ ] KM-045 — Golden replay + property/fuzz invariants for simulation
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-038, KM-039, KM-040, KM-041, KM-042, KM-043, KM-044 · **Baseline status:** todo.

**Deliverable:** Automated cases for all critical state transitions

**Acceptance criteria:** (1) No negative resources or invalid promise loops under random inputs; (2) Same seed/replay restores same trace and outcomes.

### [ ] KM-046 — M4 architecture review and schema/content migration signoff
**Priority:** P0 · **Size:** M · **Stream:** product · **Depends on:** KM-045, KM-036 · **Baseline status:** todo.

**Deliverable:** Owner-reviewed engine contract and migration documentation

**Acceptance criteria:** (1) All nine Gold scenes still playable after migration; (2) Blocking design drift recorded before Phase P05.


## P05: Polished Act I — M5
**Purpose:** Upgrade all 18 Act I scenes, routes and ending quality.

### [ ] KM-047 — Upgrade Act I Chapters 4–6 into scene cards and encounters
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-046 · **Baseline status:** todo.

**Deliverable:** Production cards and key actors for Chapters 4–6

**Acceptance criteria:** (1) Choice branches informed by Chapters 1–3 choices; (2) Every scene preserves canonical 2032 political chronology.

### [ ] KM-048 — Act I institutional coalition and ministry simulation
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-046, KM-047 · **Baseline status:** todo.

**Deliverable:** Coalition bargaining, ministry and NSO route transitions

**Acceptance criteria:** (1) Government configurations arise only from viable paths; (2) Trade-offs affect institutions and relationships over multiple chapters.

### [ ] KM-049 — Produce Act I remaining art/location templates
**Priority:** P1 · **Size:** L · **Stream:** art · **Depends on:** KM-017, KM-047 · **Baseline status:** todo.

**Deliverable:** Presidential warroom, ministry, coalition, market dawn art

**Acceptance criteria:** (1) Visual identity consistent across 18 scenes; (2) Finished assets documented with license and crop reference.

### [ ] KM-050 — Build Act I multi-ending and aftermath sequences
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-048, KM-049 · **Baseline status:** todo.

**Deliverable:** Government formation variants and consequence epilogue

**Acceptance criteria:** (1) Government/NSO/payoffs correspond to state, not canned outcome; (2) Endings acknowledge promises and institutional design.

### [ ] KM-051 — QA all Act I paths, promises, relationships and replay
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-048, KM-049, KM-050 · **Baseline status:** todo.

**Deliverable:** Route matrix and deterministic playthrough fixtures

**Acceptance criteria:** (1) All 18 scenes and legal branches reachable without corruption; (2) Reset/save/callback and reveal restrictions pass.

### [ ] KM-052 — Full Act I audience test and balance revision
**Priority:** P0 · **Size:** L · **Stream:** product · **Depends on:** KM-049, KM-050, KM-051 · **Baseline status:** todo.

**Deliverable:** Act I feedback, pacing and choice-balance report

**Acceptance criteria:** (1) Players can recall meaningful prior relationships/actions; (2) Rewrites justified by evidence; owner accepts M5 gate.

### [ ] KM-053 — Ship Act I versioned standalone build and release notes
**Priority:** P1 · **Size:** M · **Stream:** devops · **Depends on:** KM-052, KM-008 · **Baseline status:** todo.

**Deliverable:** Tagged and reversible playable Act I release

**Acceptance criteria:** (1) Known issues and unsupported systems listed; (2) Rollback, cache invalidation and save compatibility verified.


## P06: Act II — The Operator — M6
**Purpose:** Turn political plans and institutions into execution mechanics.

### [ ] KM-054 — Plan Act II Ch 7–12 scene-by-scene beats/competencies
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-053, KM-046 · **Baseline status:** todo.

**Deliverable:** Six chapter implementation production packets

**Acceptance criteria:** (1) Every scene maps to an implementation constraint; (2) All chapter transitions checked against Act I outcomes.

### [ ] KM-055 — Implement ministry/staff delegation and authority limits
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-042, KM-054 · **Baseline status:** todo.

**Deliverable:** Appointments, delegated work, reporting and incentives

**Acceptance criteria:** (1) Delegation changes capacity and accountability; (2) Staff does not provide omniscient info or free actions.

### [ ] KM-056 — Implement Aster Gate projects, milestones and bottlenecks
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-055, KM-054 · **Baseline status:** todo.

**Deliverable:** Project simulation and resource dependency graph

**Acceptance criteria:** (1) Trade-offs include implementation, politics and time; (2) Late projects create consequences beyond a single number.

### [ ] KM-057 — Implement industry/automation and energy policy trade-offs
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-056 · **Baseline status:** todo.

**Deliverable:** Labour, costs, public trust and energy interaction model

**Acceptance criteria:** (1) No universally dominant policy in playtests; (2) Project outcomes influenced by real constraints.

### [ ] KM-058 — Build Act II location art/interactive brief surfaces
**Priority:** P1 · **Size:** L · **Stream:** art · **Depends on:** KM-012, KM-055 · **Baseline status:** todo.

**Deliverable:** Aster Gate, Daran, parliament workroom and energy art

**Acceptance criteria:** (1) Strategic geography legible without full war map; (2) Scene and institution visual grammar consistent.

### [ ] KM-059 — Ship Chapters 7–12 with conditional scene variants
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-054, KM-055, KM-056, KM-057, KM-058 · **Baseline status:** todo.

**Deliverable:** Six chapters live with execution mechanics

**Acceptance criteria:** (1) All canonical chapters have distinct player dilemmas; (2) Earlier government route meaningfully shapes implementation.

### [ ] KM-060 — Act II regression, balance and M6 acceptance
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-059 · **Baseline status:** todo.

**Deliverable:** Replay/route matrix and audience feedback

**Acceptance criteria:** (1) Act I states transition validly into Act II; (2) No blocking implementation exploit or missing callback.


## P07: Act III — The Kingmaker — M7
**Purpose:** Make agenda, coalitions, appointments and networks player agency.

### [ ] KM-061 — Plan Act III Ch 13–18 agenda/power narratives
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-060 · **Baseline status:** todo.

**Deliverable:** Six chapter packets including rival strategies

**Acceptance criteria:** (1) Personal and institutional power tensions visible; (2) Branch structure bounded and recombinable.

### [ ] KM-062 — Implement agenda-sequencing and bargaining actions
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-042, KM-061 · **Baseline status:** todo.

**Deliverable:** Priority agenda, negotiation offers and sequencing

**Acceptance criteria:** (1) Order of moves changes available coalition paths; (2) Negotiation requires incentives rather than good/evil answers.

### [ ] KM-063 — Implement coalition graph and multiple analytical lenses
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-040, KM-062 · **Baseline status:** todo.

**Deliverable:** Actor/faction power projection, access/dependency lenses

**Acceptance criteria:** (1) Lenses show different valid partial perspectives; (2) Relationships not equated with simplistic power score.

### [ ] KM-064 — Implement appointment and political reputation repercussions
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-056, KM-063 · **Baseline status:** todo.

**Deliverable:** Appointments and credibility/reputation feedback loops

**Acceptance criteria:** (1) Short-term ally rewards can harm legitimacy; (2) People remember obligations and personnel changes.

### [ ] KM-065 — Build Act III cinematic council/press/network experience
**Priority:** P1 · **Size:** L · **Stream:** ux · **Depends on:** KM-017, KM-064 · **Baseline status:** todo.

**Deliverable:** Council, negotiation and network artifacts

**Acceptance criteria:** (1) Complexity emerges with earned access; (2) Scene remains primary for political encounters.

### [ ] KM-066 — Ship Chapters 13–18 and Kingmaker payoff
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-061, KM-062, KM-063, KM-064, KM-065 · **Baseline status:** todo.

**Deliverable:** Six Act III chapters and power-route progression

**Acceptance criteria:** (1) Multiple viable power styles supported; (2) At least one visible long consequence from Act I/II.

### [ ] KM-067 — Act III M7 balance and exploit review
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-066 · **Baseline status:** todo.

**Deliverable:** Replay and behavior-dominance test pack

**Acceptance criteria:** (1) No negotiation or centralization exploit dominates; (2) Owner validates earned, ethically ambiguous Kingmaker power.


## P08: Act IV — The Counterplayer — M8
**Purpose:** Deliver fair adversarial intelligence and player-model counterplay.

### [ ] KM-068 — Plan Act IV Ch 19–24 adversarial clues and pacing
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-067 · **Baseline status:** todo.

**Deliverable:** Counterplayer production packets and evidence trail

**Acceptance criteria:** (1) Silas motivations and earlier observations matter; (2) At least one fair tell before major adversarial reversal.

### [ ] KM-069 — Implement Silas player-model observation and response
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-040, KM-068 · **Baseline status:** todo.

**Deliverable:** Versioned behavior observations and opponent policy

**Acceptance criteria:** (1) Observations are generated only by player-visible behavior; (2) Adaptation does not read unearned hidden player intentions.

### [ ] KM-070 — Implement contested-source and disinformation investigation
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-039, KM-069 · **Baseline status:** todo.

**Deliverable:** Source conflict, source-chain and contradiction mechanics

**Acceptance criteria:** (1) Sources can be right about facts and wrong about motives; (2) Verification actions make uncertainty narrower when appropriate.

### [ ] KM-071 — Build intelligence UI with verification provenance
**Priority:** P1 · **Size:** L · **Stream:** ux · **Depends on:** KM-015, KM-070 · **Baseline status:** todo.

**Deliverable:** Intelligence overlays and dual-source comparisons

**Acceptance criteria:** (1) Visuals avoid fabricated certainty and color-only meaning; (2) Players can trace source credibility and contradictions.

### [ ] KM-072 — Ship Chapters 19–24 with adversarial branching
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-068, KM-069, KM-070, KM-071 · **Baseline status:** todo.

**Deliverable:** Six Act IV chapters and counterplay arcs

**Acceptance criteria:** (1) At least two player styles produce different opponent tactics; (2) No unavoidable unfair gotchas.

### [ ] KM-073 — Adversarial fairness blind playtest and rebalance
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-072 · **Baseline status:** todo.

**Deliverable:** Evidence/fairness and counter-strategy audit

**Acceptance criteria:** (1) Players can describe available warning signals afterward; (2) No deterministic unwinnable trap for valid strategies.

### [ ] KM-074 — M8 narrative-system consistency release gate
**Priority:** P0 · **Size:** M · **Stream:** product · **Depends on:** KM-073 · **Baseline status:** todo.

**Deliverable:** Accepted Act IV release report

**Acceptance criteria:** (1) Past character decisions and source records remain consistent; (2) Owner approves adversarial tone and perceived fairness.


## P09: Act V — The System — M9
**Purpose:** Ship playable interacting national crises and triage.

### [ ] KM-075 — Design Act V Ch 25–30 connected crisis scenario graph
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-074 · **Baseline status:** todo.

**Deliverable:** Stateful crisis timeline and cross-sector dependencies

**Acceptance criteria:** (1) All six chapters change at least two connected systems; (2) Crisis narrative not arbitrary time pressure.

### [ ] KM-076 — Implement crisis composer with bounded simultaneous lanes
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-057, KM-075 · **Baseline status:** todo.

**Deliverable:** Crisis state machines, thresholds and emergent combinations

**Acceptance criteria:** (1) At most five major lanes visible at once; (2) Resource moves propagate through valid dependencies.

### [ ] KM-077 — Implement liquidity / market / energy / maritime interactions
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-076 · **Baseline status:** todo.

**Deliverable:** Cross-sector risk and intervention simulation

**Acceptance criteria:** (1) At least one delayed second-order trade-off per crisis; (2) No rescue action solves all crises at zero cost.

### [ ] KM-078 — Create crisis board and situation map (earned instrument)
**Priority:** P1 · **Size:** L · **Stream:** ux · **Depends on:** KM-010, KM-077 · **Baseline status:** todo.

**Deliverable:** Accessible crisis triage screen and map layers

**Acceptance criteria:** (1) Players can prioritize in one glance; (2) Sources and consequence timelines accessible on inspection.

### [ ] KM-079 — Build emergency sound / motion / crisis visual package
**Priority:** P1 · **Size:** L · **Stream:** audio · **Depends on:** KM-078 · **Baseline status:** todo.

**Deliverable:** Crisis atmosphere, alert and silence language

**Acceptance criteria:** (1) Urgency legible with audio off and reduced motion; (2) No artificial casino-like alerts.

### [ ] KM-080 — Ship Chapters 25–30 with response branches
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-075, KM-076, KM-077, KM-078, KM-079 · **Baseline status:** todo.

**Deliverable:** All six chapters and crisis resolution outcomes

**Acceptance criteria:** (1) Crisis policies respond to prior institutions and credibility; (2) No impossible-to-handle state caused by a valid earlier choice.

### [ ] KM-081 — Act V stress, route and crisis fairness gate
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-080 · **Baseline status:** todo.

**Deliverable:** Stress/replay and crisis prioritization evidence

**Acceptance criteria:** (1) Multiple simultaneous states run without deadlock; (2) At least one owner-approved no-win-but-fair tradeoff documented.


## P10: Act VI — Legacy — M10
**Purpose:** Resolve succession, constitutional design and accumulated historical consequence.

### [ ] KM-082 — Design Act VI Ch 31–36 long-horizon arc and ending matrix
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-081 · **Baseline status:** todo.

**Deliverable:** Six chapter packets and ending condition matrix

**Acceptance criteria:** (1) Choices reconcile personal and institutional routes; (2) All ending families consistent with archive evidence.

### [ ] KM-083 — Implement succession and institutional durability model
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-041, KM-048, KM-082 · **Baseline status:** todo.

**Deliverable:** Successor pool, dependency, rules and resilience metrics

**Acceptance criteria:** (1) Highly personalized power carries transition cost; (2) Durable institutions can persist without protagonist.

### [ ] KM-084 — Implement legacy analytics and historical causal tracing
**Priority:** P0 · **Size:** L · **Stream:** systems · **Depends on:** KM-038, KM-083 · **Baseline status:** todo.

**Deliverable:** Player-readable links from outcomes to accumulated decisions

**Acceptance criteria:** (1) Every displayed causal claim references real recorded events; (2) Uncertainty in historical inference remains explicit.

### [ ] KM-085 — Produce Act VI sunrise/archive/succession visuals
**Priority:** P1 · **Size:** L · **Stream:** art · **Depends on:** KM-017, KM-083 · **Baseline status:** todo.

**Deliverable:** Legacy art and restrained visual language

**Acceptance criteria:** (1) Visual noise lower than Act V; (2) Legacy screen conveys irreversible passage of time.

### [ ] KM-086 — Ship Chapters 31–36 and ending families
**Priority:** P0 · **Size:** L · **Stream:** narrative · **Depends on:** KM-082, KM-083, KM-084, KM-085 · **Baseline status:** todo.

**Deliverable:** Full canon campaign conclusion with variants

**Acceptance criteria:** (1) At least three materially distinct ending families accessible; (2) Endings reflect relevant political, moral and system tradeoffs.

### [ ] KM-087 — Full-campaign route reachability and character continuity audit
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-086 · **Baseline status:** todo.

**Deliverable:** Recorded automated and manual full-run variants

**Acceptance criteria:** (1) No broken joins across 36 chapters; (2) Critical promises and flags recognized across acts.

### [ ] KM-088 — Owner review of Legacy meaning and campaign closure
**Priority:** P0 · **Size:** M · **Stream:** product · **Depends on:** KM-087 · **Baseline status:** todo.

**Deliverable:** Approved M10 creative signoff

**Acceptance criteria:** (1) Player ending explains what was built, not only personal rank; (2) Legacy lesson arises through play rather than compulsory moralization.


## P11: Curriculum / balance / modes — XP
**Purpose:** Embed strategic mastery, calibration, fair challenge and adaptive difficulty.

### [ ] KM-089 — Map 1,000 mechanisms to taxonomy with stable IDs
**Priority:** P1 · **Size:** L · **Stream:** curriculum · **Depends on:** KM-001 · **Baseline status:** todo.

**Deliverable:** Master competence index and source provenance map

**Acceptance criteria:** (1) 10 domains / 60 competencies trace to source corpus; (2) No invented pedagogical coverage for unimplemented scenarios.

### [ ] KM-090 — Tag live scenes with competence and evidence links
**Priority:** P1 · **Size:** L · **Stream:** curriculum · **Depends on:** KM-026, KM-089 · **Baseline status:** todo.

**Deliverable:** Scene→mechanism coverage table

**Acceptance criteria:** (1) Each tagged principle corresponds to an actual decision dilemma; (2) Tags absent from ordinary gameplay by default.

### [ ] KM-091 — Develop optional debrief and reflection contracts
**Priority:** P1 · **Size:** M · **Stream:** curriculum · **Depends on:** KM-044, KM-090 · **Baseline status:** todo.

**Deliverable:** Decision-specific reflection and counterfactual records

**Acceptance criteria:** (1) Debrief separates known evidence, uncertainty and luck; (2) No grading leak before commitment.

### [ ] KM-092 — Implement skill mastery measurement with uncertainty
**Priority:** P2 · **Size:** L · **Stream:** systems · **Depends on:** KM-091 · **Baseline status:** todo.

**Deliverable:** Calibrated and bounded learner progress model

**Acceptance criteria:** (1) Measures choices across multiple observations, not a single label; (2) Visible feedback remains optional.

### [ ] KM-093 — Implement Apprentice/Strategist/Master/Grandmaster modes
**Priority:** P1 · **Size:** L · **Stream:** systems · **Depends on:** KM-092 · **Baseline status:** todo.

**Deliverable:** Difficulty presets primarily via information presentation

**Acceptance criteria:** (1) Harder modes still provide fair inference paths; (2) Save migration and replay across settings tested.

### [ ] KM-094 — Validate case quality and political nuance with reviewers
**Priority:** P1 · **Size:** L · **Stream:** curriculum · **Depends on:** KM-090, KM-091, KM-092, KM-093 · **Baseline status:** todo.

**Deliverable:** Pedagogical and adversarial review notes

**Acceptance criteria:** (1) At least two viable reasoned approaches in pivotal cases; (2) No cynical manipulation framed as universally superior.

### [ ] KM-095 — Instrument balance experiments and adaptive calibration policy
**Priority:** P2 · **Size:** L · **Stream:** qa · **Depends on:** KM-093, KM-094 · **Baseline status:** todo.

**Deliverable:** Consent-aware aggregated study protocol and balance report

**Acceptance criteria:** (1) Improvement measurable without profiling private users; (2) Adaptive difficulty opt-out and fairness reviewed.


## P12: Art / sound / game feel / accessibility — XP
**Purpose:** Give Lydria consistent visual/audio identity and accessible cinematic experience.

### [ ] KM-096 — Approve art direction and asset-generation rights policy
**Priority:** P1 · **Size:** M · **Stream:** art · **Depends on:** KM-014, KM-017 · **Baseline status:** todo.

**Deliverable:** Final art standards, provenance and consistency QA

**Acceptance criteria:** (1) Rights, crop, sizes and prohibited inconsistencies documented; (2) No third-party likeness or unlicensed art silently shipped.

### [ ] KM-097 — Produce principal cast visual identities and expressions
**Priority:** P1 · **Size:** XL · **Stream:** art · **Depends on:** KM-013, KM-096 · **Baseline status:** todo.

**Deliverable:** Actor portraits, variants, animation-ready asset set

**Acceptance criteria:** (1) Canonical principal characters consistent across scenes; (2) Art approved in real gameplay viewport before full roll-out.

### [ ] KM-098 — Produce Lydria major place and atmosphere library
**Priority:** P1 · **Size:** XL · **Stream:** art · **Depends on:** KM-012, KM-096 · **Baseline status:** todo.

**Deliverable:** Location key art, weather/day variants, visual kit

**Acceptance criteria:** (1) Velis/Sera/Aster Gate/Daran distinctly recognizable; (2) Asset memory/performance budgets tracked.

### [ ] KM-099 — Build audio style guide and dynamic ambience state machine
**Priority:** P1 · **Size:** L · **Stream:** audio · **Depends on:** KM-017 · **Baseline status:** todo.

**Deliverable:** Location ambience, music layering and reactive cues

**Acceptance criteria:** (1) Silence/music transitions do not distract from dialogue; (2) Mute, autoplay policy and browser fallback implemented.

### [ ] KM-100 — Implement environmental motion system and perf guardrails
**Priority:** P1 · **Size:** L · **Stream:** engineering · **Depends on:** KM-010, KM-098 · **Baseline status:** todo.

**Deliverable:** Reduced-motion-aware cinematic effects

**Acceptance criteria:** (1) No obstructed decisions or major frame stalls; (2) Low-end device fallback available.

### [ ] KM-101 — Implement scalable typography, contrast and touch accessibility
**Priority:** P0 · **Size:** L · **Stream:** ux · **Depends on:** KM-016, KM-010 · **Baseline status:** todo.

**Deliverable:** Accessible text sizing, focus, hit target and contrast system

**Acceptance criteria:** (1) Small phone and 200% text UX inspected; (2) Non-color semantic states and keyboard/back tested.

### [ ] KM-102 — Finish scene-specific audio, haptics and mix mastering
**Priority:** P2 · **Size:** L · **Stream:** audio · **Depends on:** KM-099, KM-101 · **Baseline status:** todo.

**Deliverable:** Mix-ready cue matrix and implemented audio pipeline

**Acceptance criteria:** (1) Dialog/critical choices remain clear against soundtrack; (2) No required audio-only information.

### [ ] KM-103 — Cinematic full-game consistency and asset completeness gate
**Priority:** P1 · **Size:** L · **Stream:** art · **Depends on:** KM-097, KM-098, KM-099, KM-100, KM-101, KM-102 · **Baseline status:** todo.

**Deliverable:** Art/audio/UX acceptance catalog

**Acceptance criteria:** (1) Every chapter references approved or explicitly accepted fallback assets; (2) No placeholder silhouettes accidentally presented as finished art.


## P13: Quality / delivery / release — MR
**Purpose:** Make the full product reliable, observable and ready for release.

### [ ] KM-104 — Automate content validation/CI for 36-chapter scale
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-008, KM-038 · **Baseline status:** todo.

**Deliverable:** Structured validator for cross-ref, assets, IDs, callbacks

**Acceptance criteria:** (1) Broken references or invalid scenes fail PR checks; (2) Random branches and missing texts covered.

### [ ] KM-105 — Harden save versioning, export, recovery and migrations
**Priority:** P0 · **Size:** L · **Stream:** engineering · **Depends on:** KM-036, KM-046 · **Baseline status:** todo.

**Deliverable:** Robust import/export/migration and corruption handling

**Acceptance criteria:** (1) Old states load or recover safely with clear notice; (2) No personal data silently transmitted.

### [ ] KM-106 — Create cross-device/browser QA and performance budgets
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-101, KM-105 · **Baseline status:** todo.

**Deliverable:** Manual and automated mobile test matrix

**Acceptance criteria:** (1) Major phone widths and browsers tested under throttling; (2) Measured budgets and exceptions signed off.

### [ ] KM-107 — Implement privacy-first telemetry/error diagnostics
**Priority:** P1 · **Size:** M · **Stream:** devops · **Depends on:** KM-034, KM-104 · **Baseline status:** todo.

**Deliverable:** Consent and data-retention aware event policy

**Acceptance criteria:** (1) Telemetry off by default if consent not obtained; (2) No actor/player choice history harvested without disclosure.

### [ ] KM-108 — Build release pipeline, previews, caching and rollback
**Priority:** P0 · **Size:** M · **Stream:** devops · **Depends on:** KM-008, KM-107 · **Baseline status:** todo.

**Deliverable:** Preview deploy, build stamping, cache strategy and rollback

**Acceptance criteria:** (1) Versioned release can be deployed and reverted safely; (2) Pre-release save migration and smoke checks automated.

### [ ] KM-109 — Legal, credits, localization and accessibility QA
**Priority:** P1 · **Size:** L · **Stream:** production · **Depends on:** KM-104, KM-108 · **Baseline status:** todo.

**Deliverable:** Credits, asset rights inventory, localization and access review

**Acceptance criteria:** (1) All shipped assets have provenance, required notices present; (2) Text and UI operate in supported language configurations.

### [ ] KM-110 — Closed beta, bug triage and release candidate approval
**Priority:** P0 · **Size:** L · **Stream:** qa · **Depends on:** KM-088, KM-095, KM-103, KM-104, KM-105, KM-106, KM-107, KM-108, KM-109 · **Baseline status:** todo.

**Deliverable:** Accepted release candidate and reproducible bug ledger

**Acceptance criteria:** (1) No outstanding release-blocking regressions; (2) Owner reviews actual player test evidence and release risks.

### [ ] KM-111 — Public release, incident procedure and post-launch backlog
**Priority:** P1 · **Size:** L · **Stream:** devops · **Depends on:** KM-110 · **Baseline status:** todo.

**Deliverable:** Tagged release notes, recovery policy and future iteration queue

**Acceptance criteria:** (1) Working public build and version tag verified; (2) Post-launch feedback prioritized without unbounded features.


## Production exit discipline
Complete a milestone only after its integration, QA and owner-review tasks have passed; see `docs/PRODUCTION_PLAN.md` and `docs/QUALITY_AND_TEST_STRATEGY.md`. For future updates regenerate this snapshot or mark it stale: the canonical JSON remains the machine-readable truth.
