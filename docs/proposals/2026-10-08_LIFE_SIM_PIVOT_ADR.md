# ADR — Proposed KINGMAKER product pivot: Emergent Life vs Fixed Political Campaign
**ADR ID:** ADR-LSM-001  
**Date:** 2026-10-08  
**Decision state:** **PROPOSED, NOT ACCEPTED/SHIPPED**  
**Owner of final decision:** Project creator  
**Scope:** Product thesis, campaign architecture, state schema, story pipeline, interface and sequencing  
**Background:** [Charter](2026-10-08_LIFE_SIM_PROJECT_CHARTER.md), [Plan](2026-10-08_LIFE_SIM_PRODUCTION_PLAN.md), [Tests](2026-10-08_LIFE_SIM_TEST_PROTOCOL.md)

## Context

KINGMAKER initially emphasized a cinematic political thriller (Lydria 2032, 6 acts / 36 chapters, a constrained menu of decisions, 1,000 strategic mechanisms operating beneath the plot). The current public prototype and canonical backlog are oriented around this.

Recent chat-first experiments revealed a different creative center: unrestricted aspirations, flexible time, a whole life with wealth/relationships/family/politics/reversals/legacy, and strong independent world resistance. Creator feedback explicitly rejects mandatory legal-financial detail in the player UI, not the existence of legal-financial causal constraints in the simulated world.

A narrated playthrough is **evidence of preference and possible fun**, not evidence of coherent long-term mechanics. The recent freeform life run exposed risk of wish fulfillment, over-generous windfalls and discontinuities in ages/finances. Therefore a full unverified switch would be premature.

## Options

### A. Keep original political campaign primary
**Upside:** current content, world bible, scene architecture and production plan are aligned; curated authorial stakes.  
**Downside:** narrow aspirations, less freedom and life-span imagination; may keep failing creator enjoyment criterion.

### B. Immediately replace the entire game with freeform Life Sim
**Upside:** maximally aligned to expressed fantasy.  
**Downside:** discards working material, invalidates backlog, requires major technical and UX rebuild; risks untested "genie" with no coherence.

### C. Parallel **Life Mode prototype**, reversible comparison (RECOMMENDED)
**Upside:** retain source assets and existing playability; prove the new core with minimal risk, compare paths before committing; reuse actors/institutions/skills where useful.  
**Downside:** some extra branch/adapter work; temporary two-track documentation.

### D. Add a shallow Life Mode as reskin of existing scene engine
**Upside:** quick visual proof.  
**Downside:** A/B/C scene engine cannot fairly support open goals, independent NPC simulation, arbitrated feasibility or decades of state; would imitate the fantasy rather than implement it.

## Recommended decision (pending creator approval)

Prototype **C**, not B: first chat-first playtests, then a small deterministic life-state and event engine, then an isolated browser vertical slice. At G5 choose full pivot, optional companion mode, iteration or stop.

The existing **Republic of Lydria** setting could become one believable starting world/country inside Life Mode; existing campaign scenes could become dynamic events or optional story arcs. No final decision on compatibility or location is made here.

## Strong design constraints for any adopted pivot

- Ambition is **not** automatic outcome.
- No mandatory paperwork; delegation is a first-class action.
- Unexpected outcomes must be explainable by independent actors, events, risks and history; no drama quotas.
- The player may pursue or abandon wealth, power, family, love, study, art, community or quiet happiness without the game imposing a single win condition.
- One playable lifetime; selective posthumous epilogue if earned by previous state.
- Honest world/actor belief and information separation.
- State/reducer owns continuity, authoritative numbers and consequences; narration cannot invent gains.
- Minimal mobile UI: unified aspiration/action surface + world messages; depth behind optional inspection.
- Gracián and Greene are invisible strategic affordances in character judgment, timing, power networks and reputation, not forced lessons.

## Consequences if approved later

1. Update master project charter/vision and **AGENTS.md** creative objective by explicit reviewed PR.
2. Re-scope `docs/PRODUCTION_PLAN.md` and `data/production_backlog_v1.json` only after new proof gates; preserve historical status/evidence. Make a clear supersession map for every unfinished `KM-###` task.
3. Version a new `life_sim` save namespace; migrate only after deterministic tests. Do not silently overwrite political campaign saves.
4. Retain narrative/world assets only where they support the new product; old 36-chapter work is not a forced critical path.
5. Maintain rollback to last working live political build until a creator-approved browser replacement is tested on device.

## Decision log

- 2026-10-08: creator asked for new Charter and Plan, optionally tests. This authorizes producing **proposal documents**. It does **not** alone establish that a full-production pivot or deployment was approved.
- G0: creator review / chat proof — PENDING.
- G1–G5: implementation and evidence — NOT STARTED.

## Unresolved design questions (test rather than ask prematurely)

- Is the creator's strongest reward strategic mastery, surprising alternate life, or their interaction?
- Is political intrigue one optional path or a dominant background setting?
- What degree of mortality/legacy randomness feels earned?
- How many categories of aspiration are needed to feel free before adding global scale?
- How much optional analytics do skilled players want without making beginners feel obligated?
- Can a rule-governed backend retain the chat narrator's spontaneity and charm?
