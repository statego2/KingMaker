# KINGMAKER — Life, Ambition & Consequence Simulator
## Project Charter · proposal v1.0 · 2026-10-08

**Status:** PROPOSED CREATIVE PIVOT / design exploration; approved for documentation and tests, **not** approval to replace the shipped game or canonical backlog.  
**Owner / creative authority:** Project creator.  
**Implementation posture:** Chat-first laboratory, parallel experimental engine, protected existing browser campaign.  
**Companion documents:** [Production Plan](2026-10-08_LIFE_SIM_PRODUCTION_PLAN.md), [Playtest and Test Protocol](2026-10-08_LIFE_SIM_TEST_PROTOCOL.md), [Pivot Decision Record](2026-10-08_LIFE_SIM_PIVOT_ADR.md).  
**Existing authority until decision gate:** `AGENTS.md`, `docs/NEXT_ACTION.md`, `docs/PRODUCTION_PLAN.md`, `data/production_backlog_v1.json`, `docs/CHAT_FIRST_PLAYTEST_WORKFLOW.md`.

---

## 1. Vision

> **Dream without limits. Live with consequences.**  
> Enter with an ambition, not a quest. Live one unpredictable life in an independent, resistant, sometimes generous world. You may chase your original dream, lose it, change your mind, fall in love, found an empire, fail, recover, and discover an entirely different life worth remembering.

**The essential asymmetry:** The player authors intentions, goals, strategies and instructions; the world determines reality, feasibility, other people's responses, uncertainty and outcomes. The player is never promised success and never forced to micromanage specialist work.

The product is an **emergent life fantasy simulator with strategic depth**, not (a) a wish-fulfillment chatbot that grants every command, (b) a legal/finance paperwork simulator, (c) a mandatory politics campaign, (d) a rigid choose-three-options visual novel, or (e) a didactic Gracián/Greene quiz.

**The emotional promise:** "I began dreaming of X. I experienced a surprising, consequential life that could not have been fully scripted. I remember what happened."

## 2. Evidence, not overclaiming

**Observed in creator chat playtest, 2026-10-08:** freeform, large-scale ambitions; dynamic moves between wealth, enterprise, reputation, interpersonal life and family; appetite for major time skips; tolerance for setbacks when they create new possibilities; interest in succession, death and a brief posthumous legacy; dislike of excessive names, jargon, UI clutter and predefined political chores. Creator explicitly corrected the earlier recommendation to simulate legal minutiae: **obstacles must matter as consequences but should not become mandatory paperwork.**

**Caveat:** That freeform session was narrated in chat, not validated by a deterministic game engine. Apparent successes and financial windfalls were not independently verified for economic or legal coherence. One satisfying anecdote does not establish retention, fairness, or widespread player appeal. Record these as hypotheses to test.

**Current shipped baseline (verify again before work):** GitHub Pages static political campaign in Lydria, 18 Act I scenes, `index.html` → `src/app-redesign.js`, `src/engine.js` v0.3. An existing 111-task plan, branching content, schema/specs, tests and work-in-progress visual/narrative branches must not be presented as implementing this new concept.

## 3. Player fantasy and core product contract

1. **Any ambition as an input:** "I want one billion", "I want to marry and have a family", "I want to be president", "I want a quiet life of books", "I want to rebuild after bankruptcy". Do not force political ambition.
2. **Ambition box / Genie-like composer:** a conspicuous, frictionless free-text interface for desires, plans, delegations and reactions; suggested actions are optional. "Inbox" can serve as the unified command+world-event surface, but distinguish outgoing intentions from incoming messages.
3. **A sovereign world:** credible actors with agency, limited resources, institutions, incentives, opportunity, time, luck and durable memories. No protection from loss, but no artificial guaranteed catastrophe at a wealth or power threshold.
4. **Abstraction at the right level:** The player orders "Hire lawyers and negotiate" and can encounter huge legal consequences without drafting contracts. The engine simulates hidden legal/economic constraints and surfaces only decisions with interesting trade-offs.
5. **Asymmetric outcomes:** clean success, costly success, failure, partial success, accidental opportunity, delayed consequence, neutral quiet periods. A major story is **not** mandatory every turn.
6. **Life time:** minutes in a crisis, weeks in an operation, years in a period of consolidation; jump only when important facts/events are settled or explicitly left to delegation.
7. **One human life:** player mortality closes the run. Legacy epilogue shows a **selective, causally grounded** aftermath of people/institutions/assets where warranted. No automatic dynasty-control sequel, mandatory 50-year jump, or fabricated epic.
8. **Strategic mastery hidden beneath simple presentation:** depth in incentives, networks, reputation, financial constraints, personnel selection, timing, uncertainty and counterplay. System labels never replace a human scene.
9. **Different lives:** genuine paths through love/family, entrepreneurship, public office, study, philanthropy, art, status, friendship, exploration and failure. No single canonical "winning" metric.
10. **Accessible from the first turn:** few names, always role-labeled ("Λέα — συνεργάτιδα"), simple natural Greek, one meaningful immediate tension; optional details on demand.

## 4. Gameplay loop

```text
FREEFORM INTENTION ("I want X", "I order Y", "I delegate Z")
    ↓
INTENT PARSING (goal / action / constraints / horizon / requested abstraction)
    ↓
PLAN & FEASIBILITY (resources, permissions, reachable counterparties, alternatives)
    ↓
WORLD RESOLUTION (actors act, events occur, uncertainty resolves, costs accrue)
    ↓
HUMAN-SIZED CONSEQUENCE (one scene/message: result, surprise, salient choice)
    ↓
PLAYER RESPONDS / ADJUSTS DREAM / FAST-FORWARDS
    ↻
```

**Never:** Convert a player's goal into its completed outcome merely because the input text was imperative. A goal is not proof of means.  
**Never:** Hide a vital causal rule in the story until after an avoidable punishment. Surprise can be unforeseeable, not retrospectively arbitrary.  
**Never:** Replace a meaningful failure with a forced success just to keep the player's dream alive.

### Example: "I want to be a billionaire"

- Engine records the **aspiration** and current net worth, not a pre-authorized wealth increase.
- Player may choose an actionable plan (build business, seek investors, acquire assets) or delegate due diligence.
- World evaluates counterparty consent, cash flow, debt, financing conditions, time, risk and competitor moves.
- Narration compresses the accounting into engaging consequences. The player may become wealthy, be refused, become indebted, pivot careers, or discover a relationship that changes the priority of money.

### Example: divorce without legal minigame

Player: "Let my lawyers manage this; protect my company and find a settlement." The simulation assigns counsel cost, estate structure, opposing counsel strategy, evidence and timeline. The player sees strategically relevant updates ("They demand voting control", "Your CFO may testify"). The player chooses settlement, investigation, exposure tolerance, negotiation or delegation; **no compulsory contract-review UI**.

## 5. Scope boundaries

### Exploration MVP (in scope)
- Freeform ambition/command input with action taxonomy and clarification only when an action is genuinely uninterpretable.
- Repeatable, replayable single-life state: identity/age/time, cash/assets/liabilities, health, aspiration history, relationships, organizations, promises, reputation, personal circumstances, legal/institutional exposure and knowledge.
- Limited but believable world: one fictional city/country, a small recurring cast and procedurally recruitable supporting actors; distinguish grounded facts and rumors.
- Four tested strategic loops: enterprise/wealth, relationships/family, politics/influence, recovery after failure.
- Delegation and abstraction layer; autonomous NPC agendas; resource and risk gates; time compression.
- Plain-language dramatic event feed, selective epilogue, save/load, deterministic replay of resolution given seed/events.
- Diagnostic mode for designers (not an overwhelming player-facing dashboard).
- Chat-first playtest fixtures and an experimental browser slice **separate from the live main campaign** after proof.

### Explicitly out of scope for the first proof
- A full planet-scale world, detailed government/stock-exchange model, complete 1,000-mechanism curriculum mapping, realistic lawyer/doctor/CPA micromanagement, photorealistic 3D, thousands of authored scenes, multiplayer, unlimited AI compute, real-money transactions, unrestricted autonomous internet actions.
- Automatically showing all hidden stats; mandatory "good/bad" moral scoring; fixed "become kingmaker" win condition.
- Irreversible replacement of existing 36-chapter Lydria canon before creative gate.

## 6. Technical principles / architecture hypothesis

**Separate intent, simulation truth, narration and UI.** The LLM (if used) interprets natural-language commands and writes scenes **under structured engine constraints**; it must not directly invent monetary balances, legal statuses, births, dates or completed acquisitions. Authoritative mutations use validated actions and events. A fixed seed and event ledger permit replay and inspection.

Suggested boundaries:
- `intent`: normalize freeform requests into GOAL, ACTION, DELEGATE, QUERY, WAIT, RELATIONSHIP, REVISE_GOAL; preserve original text.
- `world-state`: typed entities, balances/debts, actor memory/agendas, organizations, time, deaths, pregnancy/family relationships where relevant and consistent.
- `feasibility`: resource checks, permission, prerequisites, delayed dependencies, option generation; meaningful refusal paths.
- `resolver`: ordered, auditable world ticks and counter-moves; noise bounded and seeded, not dice masquerading as realism.
- `narrative`: render truthful **player-visible** consequences, clear names/roles, emotion, uncertainty, choices; no hidden-knowledge leakage.
- `presenter`: simple composer + story/inbox; optional "inspect" layer for wealth/family/organizations/strategic intel.
- `telemetry/QA`: consent-respecting event traces, incoherence reports, test fixtures; no personal dream content sent to analytics by default.

**Scope discipline:** Build a thin, end-to-end vertical slice first. Do not implement every subsystem before demonstrating fun.

## 7. Success, failure and quality gates

### North-star (qualitative)
After playing, the player can retell a distinctive chain of events and willingly continue because **the world might surprise them and their next decision matters**.

### Exploratory thresholds (targets to calibrate, not claimed measurements)
- 5–10 minute first session: participant describes their own aspiration and one meaningful obstacle **without instruction**.
- Two or more viable, meaningfully different strategies appear for a substantial ambition; at least one does not succeed automatically.
- Three reruns with the same goal produce coherent but distinct lives with varied seeds **without** loss of agency or arbitrary punishments.
- All tested money/time/age/entity invariants hold; no fabricated net-worth jump without recorded transaction and valuation.
- A 20–30 minute exploratory run has identifiable callbacks to prior player choices and at least one unscripted-but-explainable reversal.
- In small, explicitly exploratory blind tests, prefer voluntary next-turn interest and meaningful retrospection to vanity like "hours played". Do not infer population percentages from tiny samples.

**Hard no-go:** players feel unable to influence outcomes; major consequences have no understandable cause; narrative contradicts the ledger; frequent forced disasters; flat repetitive wins; compulsory bureaucracy; the system invents success from an intention; the first session is cognitively overloaded.

## 8. Decision ownership and constraints

- **Creator:** judges fun, approves pivot/canon, chooses whether political campaign becomes optional path, approves creative UI/tonal direction and gold slice.
- **AI design/engineering agents:** prototype, test, log limitations and propose improvements; cannot declare creative acceptance or run in the background.
- **Production source of truth:** existing main and backlog remain authoritative until explicit change decision. This proposal uses separate files/branch, not stealth edits to `AGENTS.md` / `NEXT_ACTION.md`.
- **Legal/ethical/product:** fictional interactions should have plausible consequences; avoid presenting simulated law as actual personal legal advice; no requirement to model sexual violence or gratuitous exploitation for "realism"; protect player data.

## 9. Risks and response

| Risk | Why serious | Primary mitigation |
|---|---|---|
| Wish-granting narrator | Strategy collapses | State-owned mutations, feasibility and resource ledgers, refusal tests |
| Punishment generator | Feels rigged | Risk exposure, discoverable warnings, autonomy of NPCs, outcome calibration |
| LLM hallucinations | Broken age/wealth/continuity | Structured world state, event sourcing, deterministic simulation, property tests |
| Feature sprawl | Infinite engine, no fun | Four loops, one location, 60-minute gold slice, stop/go gates |
| Technical chores | Dream fantasy becomes spreadsheet | Delegation, tiered detail, events expressed via human drama |
| Boring procedural noise | Unpredictable does not equal interesting | Dramatic selection policy: consequence + agency + change |
| Existing project disruption | Loss of work/saves | Experimental branch/mode, versioned schema, reversible ADR decision |
| One-sample bias | Creator-specific preferences | Small blind sample + explicit creator review; report uncertainty |
| Recurring actors as cardboard | No sustained attachment or opposition | NPC goals, memories, divergent interpretations and independent schedules |

## 10. Milestone authority and go/no-go

Follow the companion production plan. **Checkpoint 0:** creator reviews this charter and the proposed life-sim direction; docs may exist without canon promotion. **Checkpoint 1:** chat-first proof across 3 strategic routes and 1 failed dream. **Checkpoint 2:** minimal structured resolver with reproducible tests. **Checkpoint 3:** independent compact browser mode with blind playtests. Only then decide whether to pivot the project-wide canonical road map, offer Life Mode alongside political campaign, or stop.

**The project succeeds by producing a remarkable playable life, not by completing a large software task inventory.**
