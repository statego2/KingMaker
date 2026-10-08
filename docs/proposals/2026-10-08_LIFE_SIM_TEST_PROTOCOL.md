# KINGMAKER — LIFE-SIM TEST & PLAYTEST PROTOCOL
**Version:** proposal v1.0 · 2026-10-08  
**Status:** planned cases, not executed. No test results or player satisfaction claims.  
**Companions:** [Charter](2026-10-08_LIFE_SIM_PROJECT_CHARTER.md) · [Production Plan](2026-10-08_LIFE_SIM_PRODUCTION_PLAN.md)

## 1. The actual question

Can a freeform player **dream ambitiously**, meet **credible world resistance** without paperwork, remain meaningfully agentic, experience **coherent surprises**, and finish with a distinctive, memorable life?

**Three separate things to test:**
1. **Correctness:** the game does not contradict its own assets, actors, time, history, information or resource constraints.
2. **Game quality:** effort, information, planning and delegation change outcomes; successes and setbacks feel earned, not handed out or manufactured.
3. **Player experience:** it feels enjoyable to play, not merely impressive when summarized.

A perfect unit-test result is *not* a validated fun game. A delighted creator is *not* proof of deterministic continuity.

## 2. Sources of truth & test harness design

- Each run has immutable `run_id`, `seed`, `ruleset_version`, `world_seed_id`, `turn_id`, action request, validated intent, resolved event, state diff, narrator projection and notes.
- Engine owns numeric/relationship/status mutations; narrator can only render permitted player-visible details. Keep a designer-only event log for debugging.
- Replay fixture: `initial_state + ruleset + seed + actions = exactly identical final_state and ordered event set`. Narrative wording may vary, but cannot contradict resolved facts.
- Fail fast on negative cash balance if no explicit overdraft/credit action, double-spending money, double marriages, age reversals, impossible death chronology, actor consent bypass or orphaned company ownership.
- Use synthetic/fictitious cases. Do not expose real personal identifying information in pilot logs.
- Unit tests should run with Node's existing `node --test` infrastructure when the experimental package is implemented, plus repo's documented `npm run check`, `npm test`, `npm run validate:backlog`. These commands already exist in current project; *the new life-sim tests do not yet exist*.

## 3. Behavioral test matrix

| Case | Setup / action | Expected contract | Failure to reject |
|---|---|---|---|
| LS-T01 Dream is not outcome | Fresh player, "I want €1b" | Dream stored; money unchanged; accessible plan/next decision | Wealth instantly becomes €1b |
| LS-T02 Resource constraint | €12k available, order €100k acquisition | Financing/delegation/alternative or explained failure; no purchase without settlement | Negative/teleported cash or magically acquired asset |
| LS-T03 Delegated legal issue | Divorce; "Let my lawyers handle it" | Time and costs; opposition; consequential choices only if escalation required | Mandatory clause-by-clause legal minigame |
| LS-T04 Opponent autonomy | Player makes aggressive hostile purchase offer | Counterparty can refuse/counter; remembers terms; plausibly changes plan | Every NPC always agrees or always obstructs |
| LS-T05 Costly success | Business succeeds with debt and staff obligations | Positive outcome and persistent exposures, audited ledger | Only upside, no history |
| LS-T06 Partial failure/recovery | Cash-flow crisis, loan rejected | Usable alternatives/recovery, loss of options, meaningful world change | "Game Over" without causal final condition or free bailout |
| LS-T07 Wrong/missing information | NPC says rival will invest; source uncertain | Player belief and world truth stay separate, later reveal consistent | Narrator spoils hidden truth or contradicts prior evidence |
| LS-T08 Quiet periods | 2 years of calm activity | Some time progression with organic change; no mandatory scandals | Exactly one disaster per X turns |
| LS-T09 Time leap | Age 28 in 2032, wait 10 years | Age ≈38 in 2042 subject to birthday; all scheduled events resolved in order | Age 91 in 2088 from birth year 2004 without explanation |
| LS-T10 Financial ledger | Cash €10m; buy 10% stake for €2m | Cash −€2m, asset valuation recorded, fees/counterparty leg recorded | Net worth magically +€20m on purchase |
| LS-T11 Relationship agency | "Marry X" without X consent or current relationship | Player intention/action progresses socially; no forced marriage | Instant spouse creation |
| LS-T12 Goal revision | Stop pursuing wealth; switch to family/study | Old dream reprioritized; world obligations continue | Reset/rewrite world history |
| LS-T13 Causal surprise | Rival responds to earlier betrayal after 5 years | Callback traces to prior event; surprise still explainable | Arbitrary unrelated punishment |
| LS-T14 Death and ending | Player dies at age 89 | Freeze player actions; produce selective epilogue from known assets/actors | Dynasty sequel or invented empire |
| LS-T15 Replay/idempotency | Submit event twice; replay saved action log | Single mutation, identical resolved state | Double-spending or extra child |
| LS-T16 Knowledge projection | Player does not know NPC plan | Narration doesn't disclose private plan as fact | Player sees developer hidden goal |
| LS-T17 Real impact | Same state/seed, plan A vs plan B | At least one meaningful divergence logically tracks actions | Cosmetic reskin with identical outcomes |
| LS-T18 Accessibility | Phone 320/375/390/430px, screen reader, 200% zoom | Primary input remains accessible; no hidden mandatory commands | Required action clipped beneath fold |
| LS-T19 Conflicting commands | "Spend 20m" then "I only have 10k" | Engine reconciles with state, transparently refuses/alternatives | Blind obedience to last message |
| LS-T20 Legacy restraint | Character died young with limited network | Short, grounded aftermath; no forced 50-year epic | Generic overblown world-history montage |

### Candidate behavioral fixture objects (author against actual resolver schema when implemented)
```json
{
  "case_id": "LS-T01",
  "initial": {"age":28, "year":2032, "cash_eur":12000, "net_worth_eur":12000},
  "command": "Θέλω να αποκτήσω ένα δισεκατομμύριο ευρώ.",
  "expect": {
    "dream_created": true,
    "cash_unchanged": true,
    "net_worth_unchanged": true,
    "next_strategy_available": true
  }
}
```

```json
{
  "case_id": "LS-T02",
  "initial": {"cash_eur":12000, "available_credit_eur":0},
  "command": "Αγόρασε μια επιχείρηση 100000 ευρώ τώρα.",
  "expect": {
    "instant_acquisition": false,
    "explanation_or_funding_path": true,
    "no_unauthorized_negative_balance": true
  }
}
```

## 4. Property-based and long-run tests

Generate many randomized seeds **after** a deterministic engine exists. Assertions:
- Time non-decreasing, births strictly preceding death, each actor's age consistent with dates.
- Every ownership transfer has counterparties, consideration or explicit gift/inheritance event.
- Every outgoing payment has a funding source or explicitly recorded debt.
- A dream/goal update alone never changes assets or legal states.
- Every life ending halts player-controlled actions and has a bounded, grounded epilogue.
- Commit and replay are idempotent; event ordering stable.
- No indefinite automatic scene loops or non-terminating callbacks.
- A non-criminal civilian action does not spontaneously cause legal jeopardy in the absence of any plausible chain, though rare exogenous events remain allowed.
- Optional complexity never becomes a prerequisite to progressing through simple ambitions.

**Example target runs:** 100 seeded 100-turn synthetic runs for structural invariants per CI once performance permits; 1,000 seeds offline pre-gate for balance diagnostics. **These are proposed targets, not tests run, not claims of realistic statistics.**

## 5. Fairness & anti-wish-fulfillment experiments

Compare with the **same world seed**, differing only in a player decision:
- Do nothing / pursue wealth / pursue relationship / seek information / hire specialists.
- Show different expenditures and opportunities, but preserve independent world events and NPC autonomy.
- "Unskilled" strategy can sometimes succeed (luck exists); "skilled" strategy can sometimes fail (uncertainty exists).
- Check how often giant windfalls arise without meaningful cause and tighten priors.
- Check how often disasters follow arbitrary success thresholds and remove artificial punishment rules.
- Track **failure readability**: was it understandable which constraint, exposure or independent event caused the setback?
- Resist the "always dramatic" trap: test genuine steady progress, satisfying stability and quiet accomplishments.

**Do not target 50/50 success/failure:** artificially forcing equal odds would make the simulation feel rigged. Calibrate conditional probabilities to in-world state and action, not to a universal drama budget.

## 6. Structured human playtests

### A. Creator-directed scenario test
Run four short scenarios with deliberate contrasting aspirations:
- **Wealth:** aim for billionaire status from low capital; delegation, financing, at least one setback.
- **Power:** start outside institutions; access, reputation, coalition/competition and independent opponents.
- **Connection:** seek a meaningful relationship/family; requires other actors' consent and agency.
- **Alternate life:** abandon the original goal after surprising events; find another vocation or quiet life.

Each should cover: opening intention, action with cost, autonomous world response, meaningful next decision, significant outcome, memory callback, compressed time and optional life ending.

Capture: exact user input, state snapshot, actual resolver result (or explicit narrator-only hypothesis), what felt fun/bad, surprising twist, reason for continuing/quitting. Never pretend improvised chat is a validated engine test.

### B. Blind exploratory pilot (suggest 3–5 consenting players)
Observer explains controls and stops talking. Players choose a dream rather than being assigned one. Mix familiar and unfamiliar simulation players if possible.

Do not use leading questions. Observe:
- Can they express a goal within first minute?
- Do they understand one actor, one obstacle and one meaningful choice?
- Do they know the difference between ordering an action and obtaining an outcome?
- Do they seek more detail or are they forced into it?
- Do they react to failure by choosing a new strategy?
- Do they voluntarily continue after the initial encounter?
- Can they retell two specific events, their own causal role, and a memorable NPC?
- Would they choose to start a different life?

Ask afterward: "What were you trying to do?", "What surprised you?", "Which response felt unfair?", "What would you try next?", "Which detail felt like homework?", "What did you think would happen, and why?"

Capture **observation over evaluation**. Small-sample results are directional, not statistically representative.

## 7. Human acceptance rubric (0–3 per dimension)

| Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Agency | choices cosmetic | sporadic effect | meaningful change | strategy consistently matters |
| World independence | pure genie | scripted resistance | credible autonomy | actors adapt and surprise coherently |
| Intuitive simplicity | bureaucratic | frequent confusion | mostly easy | natural play, optional depth |
| Coherence | repeated contradictions | some breaks | rare minor breaks | durable causal state |
| Dream flexibility | fixed quest | limited retargeting | multiple goals | ambitions evolve naturally |
| Emotional memory | forgettable | one beat | several distinctive beats | memorable whole-life arc |
| Replay desire | stop early | only if pushed | willing next run | voluntarily explores new life |

**Provisional G3/G4 creative heuristic:** no 0 in any dimension, composite ≥15/21, and qualitative creator desire to start another run. This threshold is a discussion anchor, not mathematical proof of enjoyment; revise if observations contradict it.

## 8. Milestone test gates, escalation, reporting

- **G0 chat-play:** four scenario styles, friction notebook, creative decision before coding large engine.
- **G1 data integrity:** invariants, command atomicity, save/replay, no monetary/time teleportation.
- **G2 behavior:** refusal, NPC autonomy, delayed callbacks and varied outcomes reproducible.
- **G3 narrator/play quality:** truthful prose and different journeys, remembered relationships, no forced paperwork.
- **G4 browser:** small-phone accessibility + end-to-end 15–30 minute playable slice and creator approval.
- **G5 release direction:** pilot evidence and stop/go decision; canonical changes only after explicit approval.

For every result log:
```yaml
test_id: LS-TXX
engine_commit: null
ruleset_version: null
seed: null
run_id: null
automated: NOT_RUN
manual: NOT_RUN
creator_review: PENDING
expected: "..."
observed: null
evidence_url: null
severity: null
remediation_task_id: null
```
**Reporting discipline:** PASS / FAIL / NOT RUN must refer to real execution; "documented" is not "tested". Save fixtures and maintain an appendix of known limitations.

## 9. Kill/iterate conditions

- **Kill or redesign core loop:** interest depends on an omnipotent narrator granting huge instant wins; replacing that with a coherent resolver eliminates enjoyment.
- **Iterate pacing:** player loves idea but feels rushed, flooded with crises, or bored in long waits.
- **Iterate coherence:** player sees opportunities but timeline, financial stakes or promises break.
- **Iterate UI:** player understands chat run but browser hides goal entry or requires too many taps.
- **Scale only after proof:** added mechanics demonstrate a meaningful new choice, lived consequence or causal possibility. Detailed finance/law screens are optional tools, not mandatory chores.
