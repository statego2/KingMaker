# KINGMAKER Life Mode — Engineering Handoff

**As of:** 2026-10-12
**Owner status:** proposed experiment; no full-product pivot, no player approval, no deployed UI.
**Upstream proposal:** [PR #18](https://github.com/statego2/KingMaker/pull/18)
**Implementation:** [Draft PR #19](https://github.com/statego2/KingMaker/pull/19)
**Branch:** \`task/LSM-prototype-resolver-20261012\` (base: \`proposal/KM-life-fantasy-simulator-charter-20261008\`)

## Executed work

1. Read AGENTS, current production handoff, actual backlog, and PR #18 proposal and ledger. The official political game remains published separately; its primary work awaits creator acceptance gates. PR #18 is itself a draft and does not approve a pivot.
2. Built \`world-simulator.mjs\` as an **isolated** structured-command resolver layered over the PR #18 ledger. Handles chosen dreams, active plans, work, investigation, study, advisor, financing offers, repayment, investment project settlement, voluntary social consent, community organization and discretionary ending.
3. Made world resistance explicit: resource constraints/refusal, NPC agency, fixed operational time costs, repayment, irreversible project spend, delayed (non-guaranteed) recovery, and seeded independent economic changes. Political backing never produces fictitious cash.
4. Added causal, chronological callbacks. Independent market reports arrive while players study, work, or skip ahead; publication precedes affected venture settlement when dates require that order.
5. Added source-of-truth save/replay format: the serialized payload contains origin + ordered commands; loading recomputes outcomes. Saving rejects state edited outside the reducer. \`playerView\` excludes seeds and hidden outcomes.
6. Added an 18-turn synthetic story executable by Node and a 500-seed balance audit contrasting novice, research, professional advice, study and combination. The existence of toy-model balance diagnostics **does not validate player enjoyment or real economics**.
7. Expanded automated unit and property-like seed tests covering 100 alternate seeded worlds, refusal, consent, money, event chronology, quiet stretches, noninterference, replay, serialization and CLI output.

## Verification evidence

- Early isolated slice: 51/51 Node tests on [Actions #38279117500](https://github.com/statego2/KingMaker/actions/runs/38279117500); backlog check [#38279117654](https://github.com/statego2/KingMaker/actions/runs/38279117654) succeeded.
- Broader engine: 59/59 Node tests on [Actions #38279937176](https://github.com/statego2/KingMaker/actions/runs/38279937176); backlog check [#38279937192](https://github.com/statego2/KingMaker/actions/runs/38279937192) succeeded.
- Autonomous market + balance audit: **65/65 Node tests** on [Actions #38280506937](https://github.com/statego2/KingMaker/actions/runs/38280506937) and backlog check [#38280506909](https://github.com/statego2/KingMaker/actions/runs/38280506909), both succeeded.
- Those runs cover \`npm run check\`, \`npm test\`, \`npm run validate:backlog\`, \`npm run validate:taxonomy\`, \`npm run validate:mappings\`, and a coverage-report assertion. Test count/CI status above applies to the stated commits only; verify the **final** PR commit separately.
- Chromium/iPhone Safari/manual user test: **NOT RUN**. No public site deployment or merge performed.

## Correctness and scope limits

- The parser/intent-to-command adapter is **not** implemented. This is a deterministic **structured** core, not an LLM-backed full freeform browser.
- Economic odds are **hypothetical balance parameters**. The five-mode calibration can guide later redesign but cannot establish actual loan acceptance, commerce, social behavior, or demographic realism.
- Lending is principal-only (no compound interest yet), asset net worth and business-equity accounting are not integrated, NPCs have minimal state, and there is no unbounded life-world scheduler, geopolitical simulation, death/legacy logic or polished UI.
- Not all long-run demands are validated. “Fun,” refusal believability, narrative voice, age-18 chat onboarding and the chosen game fantasy require a blind owner-guided session.
- No official \`KM-###\` or proposed \`LSM-###\` item was falsely marked complete; full G0–G5 validation has not occurred.

## Next dependency-safe action

First: obtain creative G0 review of the actual Life Mode experiment versus the political campaign. Run a **fresh, 18-year-old freeform chat playtest**. Convert user input into bounded resolver commands without exposing technical menus; always render the role-labeled character, a clear verdict and bottom-of-turn cash/debt/aspiration/plan snapshot. Evaluate both a wealth route and a non-wealth path, with a rejection, delegation and time leap.

Then, if author accepts this direction, design an interpreter layer with a structured AI→engine contract and unknown-command fallback. Add actor agendas and assets/liabilities only after proving the first loop. Prototype browser/mobile later; do not overwrite the shipped campaign or merge PR #18/#19 as a production pivot without explicit creative approval.
