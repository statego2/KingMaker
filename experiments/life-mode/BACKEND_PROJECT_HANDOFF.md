# KINGMAKER — Consolidated AI Backend Handoff (2026-10-12)

**Experimental only.** This document supersedes scattered "which file should the next agent read?" guidance **for the Life Mode experiment**, not the published Lydria political campaign.

## Definitive starting points

1. [START_HERE.md](START_HERE.md) — read this in a new ChatGPT/GitHub chat.
2. [backend/README.md](backend/README.md) — the backend architecture and source-of-truth map.
3. [AI_CHAT_RUNTIME_PROTOCOL.md](AI_CHAT_RUNTIME_PROTOCOL.md) — exact command I/O, local host, safety boundaries and limits.
4. [AI_STRATEGIC_DIRECTOR_PROTOCOL.md](AI_STRATEGIC_DIRECTOR_PROTOCOL.md) — narrative strategy, actor agency, epistemic discipline and deep gameplay.
5. [backend/index.mjs](backend/index.mjs) — **one stable programmatic import** for player-facing session operations.
6. [chat-host.mjs](chat-host.mjs) — executable Node JSON-lines adapter. No LLM service/API credentials in code.

The root AGENTS.md and README.md explicitly link here when the user requests experimental Life Mode, while preserving the existing campaign authority.

## Exact architecture

~~~text
Owner's free-form text
  ↓
AI interpreter (model/host-owned; no hidden money or world editing)
  ↓ structured action: one of five routes
kingmaker-session.mjs
  ├─ validate against command allowlist + current facts
  ├─ world-simulator.mjs for real life actions, years, cash and consequences
  ├─ strategic-director.mjs for NPC beliefs, consent, counterplay, evidence and offers
  ├─ strategic-saga.mjs for one lifetime, many arcs, NPC memory and replay
  ├─ knowledge-retrieval.mjs → strategy-casebook / strategy-mechanisms / competency graph
  └─ ai-tool-contract.mjs to explain the command schema to external AI hosts
  ↓
Authoritative event and new state
  ├─ sessionPlayerView() / renderPlayerTurn() → PLAYER
  ├─ sessionDirectorPacket() → TRUSTED GM INTERNAL only
  └─ saveSession() → TRUSTED HOST storage only
  ↓
ChatGPT: cinematic narrative; actual result; player can freely choose next move;
         concise age/date/cash/debt/goals/plans footer
~~~

## Production status: what is implemented vs not

| Artifact/behavior | Status |
| --- | --- |
| Stable backend namespace with import barrels and machine-readable inventory | Implemented, tested |
| Single chat-to-engine command reducer and structured action allowlist | Implemented, tested |
| Safe player / private GM projections and action schema exposed to host | Implemented, tested |
| Greek-language strategy material retrieval by player topic | Implemented as **heuristic**, tested; not an LLM interpreter |
| Repeatable life progression, strategy arcs and cross-year episodic memory | Implemented as **bounded prototype**, tested |
| Local CLI JSON-lines host with in-process state, optional replay transport | Implemented, tested |
| Player turn formatting and safe/protected chat handoff | Implemented, tested |
| 36 authored strategic mechanisms, 60 competency mapping, 12 authored case packets | Available and tested as **authored content** |
| 3 executable deterministic strategy scenarios | Available as **bounded sandboxes** |
| Model automatically connected to ChatGPT cloud from an unrelated chat | **NOT implemented**; needs an actual connector/host |
| Arbitrary natural Greek intent-to-action parsing and open-ended world simulation | **NOT implemented** |
| Original book-source question mapping Q001–Q1000 | **0 verified item mappings** (source records absent) |
| iOS/Safari browser game, production deployment, human gameplay acceptance | **NOT implemented/tested** in this slice |
| Old public political game replacement or merge | **NOT approved / NOT performed** |

## Practical run commands from the PR checkout

~~~bash
npm run chat:catalog     # executable vs authored resources + function schema
npm run chat:host        # standard JSON-lines host, public-only
node experiments/life-mode/chat-host.mjs --transport --director # trusted private transport
npm run chat:demo        # scripted 9-turn Greek strategy demonstration
npm run test:chat        # focused AI connection tests
npm run verify           # full project regression, taxonomy and backlog validation
~~~

Use \`{"op":"contract"}\` to discover the JSON Schema. \`{"op":"catalog"}\` shows the backend resources. \`{"op":"start",...}\`, \`{"op":"step",...}\`, \`{"op":"state"}\`, and \`{"op":"restore","save": "..."}\` manage a session. The host emits **actual resolver outcomes**; it does not claim success based on player wording.

**Save security:** event-log replay detects external modifications of a loaded in-memory result at save time; the local JSON save is not cryptographically authenticated. Do not expose private transport publicly or treat this local sandbox as a secure online game backend.

## Verification

GitHub Actions checked this branch repeatedly on every commit. At the initial AI-host integration stage [runtime run #38287821744](https://github.com/statego2/KingMaker/actions/runs/38287821744) reported **129/129 passing**; after content retrieval [#38288714031](https://github.com/statego2/KingMaker/actions/runs/38288714031) reported **138/138 passing**. Later [runtime run #38289206670](https://github.com/statego2/KingMaker/actions/runs/38289206670) and [backlog run #38289206457](https://github.com/statego2/KingMaker/actions/runs/38289206457) completed successfully. Verify the **final PR head** after any subsequent commit. All these are automated Node/CI tests, not browser or user experience tests.

## Version chain / repository safety

Draft stacked dependencies:
- PR #18: experimental Life Mode charter and chronological ledger.
- PR #19: Life Mode resolver / debt, cash, independent market and replay.
- PR #20: strategic-depth casebook, actors, lifelong sagas and player/GM private knowledge.
- **PR #21: backend consolidation and AI-chat host**. Base is PR #20's branch.

No PR is production-approved merely for having green automated tests. The published campaign under \`main\` remains unmodified. Do not merge this stack as a replacement without the owner's creative go/no-go.

## Handoff for the next AI coding session

Pick the highest-value unverified connector gap rather than creating dozens more theoretical mechanisms:

1. Build/validate an actual model-host adapter invoking \`kingmaker_step\` and passing only the resulting public player view into narration. Add integration tests that simulate hallucinated tool calls and unsupported Greek actions, **without changing the existing reducer**.
2. Use explicit owner gameplay feedback to widen the limited 3 executable scenario worlds; preserve freeform choices, delegated execution, NPC agency and compact footer.
3. Add true actor-to-actor actions, resource budgets, competing plans and institutional vetoes that run without player activity. Extend delayed future obligations, not random forced drama.
4. Stress-test long saves and replay time; assess whether checkpoints or versioned migrations are needed. Do not introduce fake quick wins.
5. Run an actual human chat-first playtest and evaluate whether this is fun. Do not overclaim entertainment from algorithmic correctness.

**One rule:** In the chat, the AI is the player's UI and literary narrator; in code, the reducer is the game. The AI should never silently become both rule writer and winner.


## Additional connector portability slice

Added \`stateless-connector.mjs\` for host-owned private replay state and one-shot deterministic commands. Its three operations \`initializeGame\`, \`executeGameTurn\`, \`inspectGame\` are exported via the stable \`backend/index.mjs\` API and tested with 100 different seeded games. This reduces friction for a future actual AI service integration, while deliberately not pretending to install a remote model connector or secure cloud backend. Consult the AI Chat Runtime Protocol for its code example.
