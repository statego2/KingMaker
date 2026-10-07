# KINGMAKER — AI AGENT OPERATING CONTRACT
**Always read this file first.** Applies to all agent work in this repository.

## The one-sentence objective
Build a genuinely enjoyable **cinematic political strategy game** in which the player's observation, investigation, interpretation, negotiation and commitments change a persistent Lydrian political world. Do NOT turn it into a spreadsheet, lesson app, passive visual novel or government SaaS.

## Required startup sequence
1. Pull/check **current** `main`; inspect any open PRs/branches before writing.
2. Read `docs/NEXT_ACTION.md`, `docs/PRODUCTION_PLAN.md`, and `data/production_backlog_v1.json`.
3. Read only relevant canonical context: `docs/01_WORLD_BIBLE_V1.md`, `02_CHARACTER_BIBLE_V1.md`, `03_STORY_CAMPAIGN_ARCHITECTURE_V1.md`, `04_GAME_SYSTEMS_SPEC_V1.md`; visual override: `design/09_CINEMATIC_VISUAL_PIVOT.md`.
4. Inspect actual shipped entry point `index.html` and imported code; never trust a stale README over runtime evidence.
5. Identify the **highest-priority dependency-ready task**. If current status differs from plan, reconcile with code/PRs before proceeding.
6. Choose one cohesive slice, create a task branch, implement, test, document evidence, and propose a PR.

## When user says “Μπες στο KingMaker και συνέχισε τη δουλειά”
Unless they name a particular milestone:
- Select the first `todo` P0 task in `docs/NEXT_ACTION.md` / backlog whose `depends_on` are all `done`.
- Do the actual work, not only a plan or a list of suggestions.
- If work scope is too large, implement a complete vertically testable subtask and note precisely what remains. Do not mark the parent `done`.
- If blocked by access, tool limits, missing asset/human approval, mark `blocked` with a concrete request. Do not silently skip to downstream work.
- If a human wants a different task, honor that priority provided dependencies/safety are respected.

## Truth rules
- Current entrypoint (as inspected Oct 2026): `index.html` imports `src/app-redesign.js` and `styles-redesign.css`.
- Current Act I contains 18 playable scenes in `src/content.js` and `src/act1b.js`; this does not mean the Act I **gold** milestone is done.
- The v0.3 runtime state (`src/engine.js`) is materially smaller than `data/game_state_schema_v1.json`; migrate deliberately.
- `src/redesign-scenes.js` supplies procedural/CSS scene placeholders, not approved character/location key art.
- Reports of tests, GitHub writes, deployments and reviews must reflect checks **actually performed**. Never imply browser/user acceptance from static syntax checks.
- No hidden developer truth and no quality score displayed before a choice.

## Scope and safety rails
- Preserve canon: Lydria 2032, 6 Acts/36 chapters, recurring actors, branch-and-recombine, persistent consequence, agency and fairness.
- Preserve existing saves or provide explicit versioned migrations with fixture coverage.
- Favor reusable scene contracts and narrow interfaces. Avoid one gigantic UI file or duplicate simulation state.
- For major scene decisions show world/actor/object first and UI second. Use reference art only with permission/provenance.
- Visible knowledge must be justified by source access and timeline.
- Do not write all Chapters 7–36 until M3 gold slice and M4 architecture gates have passed.
- Respect accessibility: keyboard/focus/reading-size/reduced motion/mute; no information solely through color or audio.
- Be cautious editing `index.html`, `src/engine.js`, `src/content.js`, `src/act1b.js`; coordinate concurrent agents using branches/PRs.

## Task status and acceptance
The canonical task inventory is `data/production_backlog_v1.json`; valid states: `todo`, `in_progress`, `blocked`, `review`, `done`.

To mark `in_progress`: dependencies all done, task scoped, no conflicting active agent.
To mark `review`: changes committed on branch, checks run, relevant evidence recorded, manual checks labeled.
To mark `done`: changes merged or verified as shipped, acceptance criteria verified, evidence cites PR/commit and tests; user/creative gate explicitly approved where applicable.

Update **backlog + `docs/NEXT_ACTION.md` + `docs/PROGRESS_LOG.md`** in a coherent PR. Do not update a document by rewriting project history as if aspirational items are shipped.
Run `node tools/validate-production-backlog.mjs` after every backlog edit.
If no runtime test suite exists yet, state “not available” and bootstrap it on the correct task. Do not fabricate a passing test.

## Your response after a task
Report concisely:
- Task ID and what changed, with PR/commit link.
- Tests completed (exact commands) and any manual/unverified items.
- Whether merged/deployed.
- Blockers, remaining follow-ups and the next dependency-ready task.

Full protocol: `docs/AI_DELIVERY_PROTOCOL.md`. Detailed gates: `docs/QUALITY_AND_TEST_STRATEGY.md`.
