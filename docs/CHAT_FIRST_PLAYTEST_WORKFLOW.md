# KINGMAKER — Chat-first playtest and GitHub implementation workflow

**Owner direction — 2026-10-08.** Until we have a game the owner considers worthwhile, the primary playable experience is the conversation with the AI. The AI is the provisional player-facing interface: it presents scenes, plays characters, resolves player actions and tracks consequences. GitHub remains the durable source for the game's world, story, rules, state model, code, tests and accepted design decisions. The existing browser build is a separate implementation under development, not the authoritative rendering of an uncommitted chat improvisation.

## Play in the conversation

1. Start from the current story/world canon and the latest accepted playtest state. Establish the player's role and one immediate situation in natural Greek. Introduce people and systems only when the scene needs them.
2. The player can answer in their own words. Suggested actions help orientation but never limit agency. A chosen action changes the situation; investigation costs time or access, and useful discoveries can alter the next decision.
3. Keep a private continuity ledger: scene/time, player actions, verified facts, reported claims, unknowns, who knows what, relationships, promises, resources, and unresolved callbacks. Reveal only what the player could know. Never display hidden scores or a “correct answer” before a choice.
4. Let scenes have human stakes, surprise and credible opposition. Avoid a loop of three obvious multiple-choice answers or repeated arithmetic reports. Keep the opening cinematic, readable and light on names; the political and strategic depth can grow through action.
5. If the owner pauses to critique or redesign, leave the scene pending. Discuss the problem, test a new version here and resume from the agreed state. Do not force the player to commit to an in-world action while discussing production.

## Turn playtests into project changes

1. Record the observation and the specific gameplay problem. Distinguish exploratory chat invention from an owner-accepted design decision and from implemented browser behavior.
2. For accepted changes, update the relevant GitHub story/content, state/engine, design docs and focused tests. Preserve continuity IDs and existing saves, or explicitly plan migration. Keep the chat session's choices and their causal consequences available for future implementation.
3. Work in a task branch and PR under `AGENTS.md` and `docs/AI_DELIVERY_PROTOCOL.md`; report what is committed, merged and actually tested. Do not claim that a free-text action or a chat branch is supported by the browser engine until it is implemented and verified there.
4. Use short playtest records for important sessions: premise, choices, discoveries, player feedback, unresolved scene and implementation candidates. Promote a change into canon only with the owner's creative approval. Do not infer acceptance merely because a player tried an option.
5. Prioritize making the first hour genuinely enjoyable. Expand complexity and Chapters 7–36 only after the relevant proof and architecture gates in `docs/PRODUCTION_PLAN.md`.

This workflow persists across future AI sessions. It does not run an AI in the background; the work continues when the owner asks to play, iterate or implement.
