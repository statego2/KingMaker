# KINGMAKER — Backend Source of Truth (experimental Life Mode)

**One canonical AI entry point:** \`backend/index.mjs\`.
**Actual host program:** \`../chat-host.mjs\`.
**Current status:** Executable **Node sandbox**; draft PR #21 stacked on #20 → #19 → #18; NOT the shipped political browser campaign and NOT autonomously connected to ChatGPT chats.

## Logical directory architecture

~~~text
experiments/life-mode/
  backend/
    index.mjs              ← USE THIS for AI-chat ↔ game-state
    content.mjs            ← authored knowledge, strategic casebook, competency graph
    engine.mjs             ← advanced pure simulation access
    ai.mjs                 ← director-only interfaces; private facts
    README.md              ← this entrypoint
  backend-catalog.mjs       ← executable vs authored inventory and integrity validation
  kingmaker-session.mjs     ← single session façade and command boundary
  chat-handoff.mjs          ← safe Greek turn + cross-chat continuity
  chat-host.mjs             ← runnable local JSON-lines host (no LLM inside)
  strategic-saga.mjs        ← multi-episode single-life orchestration
  world-simulator.mjs       ← age/cash/debt/time/individual actions
  strategic-director.mjs    ← NPCs, limited world strategy, beliefs and coalitions
  strategy-intelligence.mjs ← GM strategy/diagnostics, player-safe brief
  strategic-gm-adapter.mjs  ← strict structured AI action validation
  strategy-mechanisms.mjs   ← authored 36 strategic mechanisms
  strategy-knowledge-graph.mjs ← mappings to 60 canonical competencies
  strategy-casebook.mjs     ← 12 authored story seeds (not 12 engines)
  chat-ledger.mjs           ← raw chronological, inspectable life ledger
  *.test.mjs               ← Node replay and regression tests
~~~

**Why barrels, not moving every existing module?** The earlier PRs #18–#20 and their extensive tests import existing module paths. Moving those files in this experiment would create breakage and distract from the missing AI connection. The new \`backend/\` namespace gives new agents a **stable entry interface** while preserving compatibility; a later explicit migration can reorganize storage safely.

## Authority / data flow

~~~text
PLAYER (free Greek prose, ambitions, creative moves)
          ↓
AI UI (interprets player's intent; does NOT create results)
          ↓    proposed structured command
backend/index.mjs → applySession(session, proposedAction)
          ↓    allowlist + validation
Strategic saga / world / actor rule engine
          ↓    actual state delta + authored adversarial reactions
sessionPlayerView() (safe public projection)  ←──── only text source for UI
          ↓
AI narrator (short story + verdict + freeform prompt + footer)

SEPARATE/PRIVATE:
sessionDirectorPacket() → hidden actor motives and useful mechanisms
saveSession() → replayable trusted action log (private machine transport)
~~~

The narrator sees enough hidden structure to make other agents credible **without leaking private certainty or forcing an outcome**. NPC agendas are not player commands. A player's message is not executable authority.

## Recommended use — minimal Node library

~~~js
import {createSession,applySession,sessionPlayerView,renderPlayerTurn}
  from "./backend/index.mjs";

let session=createSession({life:{
  id:"demo",birthDate:"2010-04-12",startedAt:"2028-05-01",
  location:"Θεσσαλονίκη",cash:900
},seed:10});

let result=applySession(session,{
  id:"step-001",route:"life.action",
  action:{kind:"dream",goalId:"empire",title:"Να φτιάξω αυτοκρατορία"}
});
session=result.session;
console.log(renderPlayerTurn(session)); // public facts only
~~~

For full host protocol use \`../AI_CHAT_RUNTIME_PROTOCOL.md\`. Run the CLI via \`node experiments/life-mode/chat-host.mjs\` (JSON lines, in-memory); use \`--transport\` only when a trusted host stores private replay state; use \`--director\` only when trusted AI/GM receives internal strategy context.

## Resource boundaries (do not blur)

| Layer | Data and evidence | What it **cannot** guarantee |
|---|---|---|
| Life engine | Action ledger, chronological age, cash/debt, costs and market events | Complete macroeconomy, realistic real-world finance, arbitrary prose |
| Strategic engine | 3 bounded, seeded worlds, NPC priorities, evidence, bargaining, refusal, expiry | Any arbitrary historical/political scenario as executable code |
| Casebook | 12 rich creative seeds, with counterplay and long-run callbacks | All 12 are playable in code |
| Knowledge | 36 authored mechanisms mapped to 60 canonical competencies and 15 tensions | Original 1,000 questions have been imported or mapped (they have **not**) |
| AI boundary | Schema validation, independent state, public and director-only projections | Automatic use in a fresh ChatGPT chat without a host/connector |
| Node QA | repeatable behavior and replay checks | Human fun, narrative realism or tested iOS deployment |

## Hard policy for AI collaborators

Read this file, \`../AI_CHAT_RUNTIME_PROTOCOL.md\`, and \`../AI_STRATEGIC_DIRECTOR_PROTOCOL.md\` rather than scanning every source file. For executable simulation, **call the host** and narrate its public result. If the host cannot run, clearly label the conversation **provisional narrative playtest**, preserve a provisional ledger and never falsely claim a scripted turn was generated by the actual reducer.

Official campaign branch, design documents, and production backlog remain governed by root \`AGENTS.md\`. This independent draft is not the approval to replace them.


## Selective content lookup and AI function contract (October 12)

\`../knowledge-retrieval.mjs\` exposes \`findStrategicMaterial(intentText)\`, a Greek/English keyword heuristic that returns **author-approved case references and their strategic mechanisms**. It labels executable scenarios distinctly from creative-only case seeds. It is *not* a natural-language action resolver. \`sessionDirectorPacket(session,{intentText})\` may incorporate this retrieval into its **GM-only** notes while the player's goals remain unchanged.

\`../ai-tool-contract.mjs\` exports \`AI_TOOL_CONTRACT\` and \`AI_ACTION_SCHEMA\`: a provider-neutral function-call description of the five permitted routes. A model can consume that schema, but the host MUST call \`applySession\` to validate against live resources/actors/state and settle the result. The CLI returns the contract via \`{"op":"contract"}\`.

The \`backend/index.mjs\` barrel now exports the schema and safe session operations; \`backend/ai.mjs\` exports both the GM tools and dynamic content finder.

To inspect/verify via npm on this **branch**:

~~~bash
npm run chat:catalog
npm run chat:demo
npm run test:chat
npm run chat:host
~~~


## Portable stateless host API

\`../stateless-connector.mjs\` exposes \`initializeGame\`, \`executeGameTurn\` and \`inspectGame\` through \`backend/index.mjs\`. This is the cleanest contract for a future external AI integration: the trusted application stores \`privateSave\`, calls a validated action once, and passes **only** \`player\` to the chat UI. The optional internal director brief is separately retrieved. Replaying the previous save with the same command produces the same result; applying an already-used command to its new save fails as a duplicate.

It is **not** a live ChatGPT connector. See the stateless example in [AI_CHAT_RUNTIME_PROTOCOL](../AI_CHAT_RUNTIME_PROTOCOL.md).
