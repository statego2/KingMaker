# KINGMAKER — Strategic Depth Implementation / Next Agent Handoff
**Date:** 2026-10-12
**Status:** Experiments only; changes committed on \`task/LSM-strategic-depth-20261012\`, a draft PR stacked on PR #19 (which is stacked on PR #18). **NOT merged, NOT deployed.** The official political campaign remains separate.

## User instruction and goal

Make AI-chat KINGMAKER simulations much deeper strategically: persistent motives, independent counterplayers, imperfect knowledge, multi-step goals, reputation, negotiations, institutions, delegated complexity, second-order and delayed effects. Keep chat experience cinematic and free-form, not a legal/financial spreadsheet or a static option menu. Real agency matters: failure and refusal can be real; success requires grounded means.

## Created executable code

| Artifact | Proven scope |
|---|---|
| \`strategic-director.mjs\` | Three deterministic fictional strategy sandboxes: local reform, venture coalition and civic network; context-specific NPC utilities, offers/refusals, independent rivals, trust, deadlines, sourced investigation, optional disclosure, coalition commitment, bounded reputation, persistent promises that can lapse, per-NPC beliefs and source-aware sharing |
| \`strategy-intelligence.mjs\` | Adaptive **director-only** situation briefs with tensions, pressure, mechanism suggestions, risks, actor agency and counterplay; separate safe player briefing |
| \`strategy-mechanisms.mjs\` | 36 original playable mechanisms, each with observed signal, meaningful lever, cost, independent countermove and delayed callback; 10 domains and 15 tensions |
| \`strategy-knowledge-graph.mjs\` | Authored crosswalk of those 36 mechanisms to 60 existing canonical competencies, plus case-specific knowledge retrieval; **NOT** original question provenance |
| \`strategy-casebook.mjs\` | 12 case seeds for long-life political, entrepreneurial, social, reputational, legacy, philosophical and adversarial situations; role-labeled casts, hidden constraints, alternatives and callbacks; **authoring data, not 12 executable systems** |
| \`strategic-life-bridge.mjs\` | Embed one strategy episode into the existing experimental Life Mode calendar without converting abstract strategy points into real euros or power |
| \`strategic-saga.mjs\` | Multiple strategy episodes across **one** preserved age-18 life; historical outcomes, remembering NPCs, belief decay, replayable state, quiet long time leaps |
| \`strategic-gm-adapter.mjs\` | Validated AI-to-resolver intent contract, separated public vs hidden GM packet, no unauthorized cash/actor/outcome mutation, narrated outcomes driven by actual reducer |
| \`strategy-balance.mjs\` | Seeded policy comparison (impulsive, targeted, adaptive); demonstrates strategies yield different success distributions without 100% success |
| \`strategy-demo.mjs\` | Executable Greek-language demonstration of fictional negotiation and measured refusal/coalition dynamics with save/load replay |

All code uses built-in Node ES modules; no new npm dependencies or service keys required. No edits made to the shipped \`src/engine.js\`, \`src/app-redesign.js\`, canonical backlog, save namespace or production Pages.

## Reproduction

From the root of the experimental PR's checkout (Node 22+):

\`\`\`sh
npm run check
npm test
npm run validate:backlog
npm run validate:taxonomy
npm run validate:mappings
node experiments/life-mode/strategy-demo.mjs
node experiments/life-mode/strategy-balance.mjs
node experiments/life-mode/balance-audit.mjs
\`\`\`

**Verified CI so far:** Latest full runtime workflow [#38284529972](https://github.com/statego2/KingMaker/actions/runs/38284529972) **PASS, 116/116 Node tests**, plus syntax/import/knowledge checks; backlog workflow [#38284529968](https://github.com/statego2/KingMaker/actions/runs/38284529968) **PASS**. These are earlier-head results when the handoff was drafted; inspect the final PR head separately after any further commit. **Browser/creator fun test: NOT RUN.**

## What makes the strategic content more than a script

1. **Opposition has legitimate incentives**: an ally values transparency, another autonomy; high-level demands cannot magically force consent. A rival may gain outside supporters while the player does nothing.
2. **Source-independent epistemics**: a rumor, a direct record and a second independent document occupy different evidence weights. Player knowledge and NPC knowledge remain separated.
3. **Consequences persist**: accepted offers consume finite capacity and create obligations, which can expire. A returning NPC remembers previous cooperation or neglect, although old votes do not carry into a new arc.
4. **Time is part of the game**: investigation buys evidence but may cost a voting/funding window. Independent Life Mode economic events continue during strategy play.
5. **Strategic alternatives are real**: target terms, gather evidence, listen, prepare, coordinate, exit or choose a new aspiration. Failure and non-wealth lives remain playable.
6. **Counterfactual tests**: reproducible seeds compare rash and better-informed policies with both successes and failures. These *toy-model* differences are proof of code behavior, not of realistic political probabilities.

## Quality gates remaining

**Before calling this a playable, world-class strategic simulation:**
- Run real creator free-form chat tests, including one grandiose desire with insufficient means, a refusal, a delegated job, strategic opposition, a four-year time leap, and a non-wealth aspiration. Verify enjoyment, clarity and absence of UI micromanagement.
- The current game-facing interpreter is **not an LLM**: \`validateModelProposal\` checks structured AI output, but a reliable Greek natural-language-to-command resolver has not been implemented in a runtime service. Unsupported player actions cannot yet be arbitrated generically.
- The three executable strategy worlds are deliberately bounded toy examples. The 12 casebook entries are not 12 executable adventures. Do not present them as such.
- NPCs have priorities, memory, beliefs and bounded autonomous countermoves; they **do not yet** plan in an indefinitely evolving full world with independent budgets, institutions and companies. No complete asset/equity accounting or macroeconomy exists.
- Success in a local episode does **not** grant real political office, giant fortune or control of nations.
- The earlier project's 1,000 individual Gracián/Greene question records remain **absent** and 0 verified item-level question mappings are claimed. The 60-competency crosswalk is new authored game-design material, not forensic reconstruction of the absent records.
- Tests are algorithmic correctness checks, not human entertainment or economic realism validation. No iOS browser acceptance has occurred.

## Next production direction

1. Keep these experiments stacked in draft until owner agrees to the creative Life Mode direction and playtest proves real fun.
2. Implement a robust *freeform command arbitration* service and actor discovery/progression: safe fallback for actions outside the 10 structured verb types, multi-step delegated programs, without exposing a menu.
3. Give NPCs longer independent agendas, budgets, strategic plans, delayed reports and multiple mutually competing institutions, and connect those choices to realistic life resources.
4. Add actor-to-actor negotiations, alliances and defections without always making the player the center of every event; make institutional veto, implementation costs and enforcement matter.
5. Integrate multi-year projects, companies/equity, liabilities, trained teams, succession and bounded legacy, with QA for causality/replay.
6. Expand from 3 tested executable worlds using the 12 casebook seeds **only after** validating gameplay and mechanics.
7. Add playtest metrics and selective scenario balancing based on creator feedback. Never substitute quantity of mechanics for entertainment.

**Rule of thumb for new agents:** Use \`AI_STRATEGIC_DIRECTOR_PROTOCOL.md\` for every AI chat simulation; select relevant cases using \`strategy-casebook.mjs\` and \`strategy-knowledge-graph.mjs\`, keep a hidden ledger and give the player one free-form, consequential scene at a time. Never tell the player they "won" unless the actual state and world authorize the result.
