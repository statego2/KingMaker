# Life Mode v0.2 — executable prototype handoff

**Status (12 October 2026): experimental draft, NOT the shipped KINGMAKER game.**
This code is on the dependent branch of proposed PR #18. It is not a creator-approved permanent pivot. It does not modify the live campaign, saves, AGENTS.md, production backlog, or Pages.

## What is genuinely executable

- \`chat-ledger.mjs\` (from PR #18): age-18 starts, chronological event narration, goals/plans, role-labeled people, causal cash/debt changes and Greek summary footer.
- \`world-simulator.mjs\`: pure seeded **structured** command resolver that creates the event outcomes consumed by the ledger. It does not understand Greek natural-language messages directly. An AI narrator must map user intent to one supported command, then narrate only the returned result.
- \`world-simulator.test.mjs\`: no-dependency Node tests on causality, time, actor agency, finance, hidden odds, idempotence, repeatability and 100 seeds.
- \`play-scenario.mjs\`: deterministic synthetic 18-turn, multi-aspiration story, not a human playtest and not evidence of entertainment value.

## Run (Node.js 22+)

\`\`\`sh
node --test experiments/life-mode/chat-ledger.test.mjs experiments/life-mode/world-simulator.test.mjs
node experiments/life-mode/play-scenario.mjs
node experiments/life-mode/balance-audit.mjs
npm run verify
\`\`\`

No environment secrets, browser, package install, web API or database needed.

## Player-facing contract

The real player should type an open intention: e.g. “I want to start a €100,000 business although I only have €900.” The ChatGPT narrator translates the instruction into a structured command. The resolver may reject the action and suggest a feasible path; it does not treat desires as accomplished. The player sees narrative results and a short status footer. Mechanical disclosures and optional inspectors are not mandatory.

**Available command kinds:**

| Kind | Meaning | Verifiable friction |
| --- | --- | --- |
| dream / revise | Establish or reprioritize chosen life aspirations | A wish cannot equal success |
| plan | Attach plan to existing aspiration | Cannot invent orphan plans |
| work | Advance time through paid shifts | Cash only after elapsed labor |
| pitch / accept / repay | Seek a lender's offer, deliberately accept liability, repay principal | Independent lender refusal, cooldown, loan cap, debt and liquidity |
| delegate | Hire an expert to handle the details | Cost, minimum fee, not unlimited |
| investigate | Obtain information and improve venture execution | Cost €100 + 14 days; no preview of secret outcome |
| study | Learn business/social systems | 30 days; bounded incremental competence |
| launch | Commit available money to a venture | May lose principal; resolved after 90 days |
| network / organize | Seek a voluntary organizer and attempt a supported community event | Autonomy; resources spent, no invented profit; support after 60 days |
| connect / invite | Build a relationship and ask consent | Other party can refuse |
| wait | Advance time | Quiet periods are allowed; due events settle once; independent economic news can arise without any player action |
| finish | End this experimental life | All subsequent commands refused |

All costs and odds are **toy calibration values**, not empirical economic forecasts. They are deliberately small and subject to balancing. Dates/identities are fictional. Business research and learning modestly improve odds; they never make success certain. Seeded outcomes are deterministic for a given event order and seed, so QA can reproduce them. Action IDs are idempotency keys, not player-controlled reroll buttons.

## Causal/accounting invariants

1. \`beginLife\` delegates to an age-18, nonnegative-finance run initializer. The resolver validates its own namespace and duplicate action IDs.
2. Each action returns a new object. The input is never mutated. Failed actions can consume time but do not silently create assets.
3. Every change of cash/debt includes a narrated cause and appears in the turn ledger. Borrowing moves cash and debt equally. Repayment reduces both equally. Public organizing is **not** a business revenue stream.
4. Ventures spend money up front. At their due date, the resolver produces at most one documented payout; no rescue bonus or artificial disaster after wealth targets.
5. A player cannot command another actor's consent. A contact must be introduced with a Greek name + role. Actor reactions occur independently from player wishes.
6. \`playerView\` excludes random rolls, underlying simulation seed and unresolved project success chances. It reveals what has become public and can be inspected, not the outcome before it occurs.
7. Replay: same initial run + same ordered commands + same seed → identical state and events. Different preparation may change chances and the resulting timeline.
8. The original \`kingmaker_statecraft_v03\` browser save key and political campaign modules are untouched.

## Known prototype boundaries and deliberate omissions

- **Not a freeform language engine**: no NLP parser, AI API or model-based judge included. Only the adapter contracts are implemented.
- **Not a full macroeconomic model**: a small seeded market-climate calendar exists, but no interest accrual, taxes, asset pricing, company shares, property valuation, employment contracts or inflation yet. Loans in this prototype are principal-only.
- **Not a full political simulation**: grassroots backing is a demonstrator, not election mechanics, sovereign power or a worldwide geopolitical simulator.
- **Not a personality model**: limited fixed NPCs; no NPC long-run agenda planner, mortality, children, rival families or 50-year epilogue.
- **No game-condition victory shortcut**: aspirations persist and are only completed when future validated world events justify completion, not when a player writes “I win.”
- **No deployment**: PR work and GitHub Actions pass do not prove the game is playable in iPhone Safari.
- **No creator G0/G1 approval**: this prototype is offered as an isolated research slice; the proposed production plan's stage statuses are unchanged.

## Suggested chat-first gold playtest

Begin at 18 with €900 and a freely worded dream. Let the player ask for funding beyond present means and show an immediate feasible, grounded refusal. Allow a self-directed plan, a small delegated task, voluntary NPC disagreement, an investment and a ninety-day leap; keep a compact resource/goal/plan footer. Try a contrasting dream (study/connection/community) with similarly genuine responses. Record exactly where the player finds it fun or tedious; the code passing tests is not proof of either.

Only promote the experiment into official production after comparing a real chat playtest to the existing campaign and explicitly approving the pivot.


## Strategic-depth laboratory (stacked draft branch, October 12)

A separate [strategic engine handoff](STRATEGY_ENGINE_HANDOFF.md) describes the next experimental slice and links its reproducible checks. This is not part of the published political browser build.

- **GM contract:** [AI Strategic Director Protocol](AI_STRATEGIC_DIRECTOR_PROTOCOL.md) keeps the story free-form while the hidden state models motives, evidence, opposition, resources and time.
- **Engines:** \`strategic-director.mjs\`, \`strategic-life-bridge.mjs\`, \`strategic-saga.mjs\`, \`strategic-gm-adapter.mjs\`.
- **Strategic corpus:** \`strategy-mechanisms.mjs\` (36 new authored mechanisms), \`strategy-knowledge-graph.mjs\` (60 competency crosswalk), \`strategy-casebook.mjs\` (12 authored case seeds).
- **Executable demonstrations:** \`node experiments/life-mode/strategy-demo.mjs\` and \`node experiments/life-mode/strategy-balance.mjs\`.
- **Truth boundary:** 3 executable strategy scenarios and 12 non-executable case seeds. The 1,000 original question records are still absent, and no original item-level mapping is claimed.
- **Human approval:** Still pending. Node testing does not establish fun, realism or iPhone playability.

**Current order of stacked proposals:** PR #18 (Life Mode charter and ledger) → PR #19 (life world resolver) → PR #20 (strategic-depth experiment). Do not merge directly into public main or replace the old campaign without an explicit owner-reviewed decision.
