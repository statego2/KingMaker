# KINGMAKER — AI-as-UI Runtime Protocol v1

**Status:** Experimental Node-only integration contract, not a deployed conversational integration.
**Start:** [backend/README.md](backend/README.md) → [backend/index.mjs](backend/index.mjs) → [chat-host.mjs](chat-host.mjs).
**Source of truth:** \`kingmaker-session.mjs\` + trusted saga/world rules. ChatGPT is the presentation and intent interface, **never** the accounting/state authority.

## Single-model interaction flow

~~~text
Human message (free-form Greek)
   ↓
Model: classify observed intention and propose ONE permitted action
   ↓
Host: validateModelProposal / normalizeProposal; reject forged fields
   ↓
Engine: applySession(...) — only this changes canonical life state
   ↓
Public view → Model: concise Greek scene, actual verdict, player's room for action, footer
                  ↑
          Optional PRIVATE GM brief used for reasoning about plausible future conflicts
~~~

The AI must not narrate success until the host has returned the actual resolved event. The user's desires are **not** transaction records. A goal of €1 billion begins as a goal, not €1 billion in cash. Wealth, votes, personal relationships and social influence are not interchangeable meters.

## Running the local host on a Mac/Node 22+

On the experimental branch, from the repository root:

~~~bash
node experiments/life-mode/chat-host.mjs
~~~

The program reads one JSON object per line, writes one JSON response per line. No token, secret or third-party AI connection is required for this local test.

Start from age 18:

~~~json
{"op":"start","seed":17,"life":{"id":"life-17","birthDate":"2010-04-12","startedAt":"2028-05-01","location":"Θεσσαλονίκη","cash":900,"debt":0}}
~~~

Human says “Θέλω να γίνω δισεκατομμυριούχος.” Model sends:

~~~json
{"op":"step","command":{"id":"turn-001","route":"life.action","action":{"kind":"dream","goalId":"wealth","title":"Οικονομική ανεξαρτησία","playerText":"Θέλω να γίνω δισεκατομμυριούχος."}}}
~~~

Model shows only \`response.player.verdict\`, optional public scene information and \`response.player.footer\`. Do not expose machine JSON, developer context, seed or internal actor utilities.

Start a bounded strategic episode:

~~~json
{"op":"step","command":{"id":"turn-002","route":"arc.begin","scenario":"venture-alliance"}}
~~~

Listen to a relevant person (role labels come from public projection):

~~~json
{"op":"step","command":{"id":"turn-003","route":"arc.move","action":{"kind":"listen","actorId":"sofia","playerText":"Μιλάω με τη Σοφία (επενδύτρια)."}}}
~~~

Example offer requiring the other actor's independent acceptance:

~~~json
{"op":"step","command":{"id":"turn-004","route":"arc.move","action":{"kind":"offer","actorId":"sofia","terms":{"delivery":3,"budget":1},"playerText":"Της προτείνω διαφανές σχέδιο υλοποίησης."}}}
~~~

If the episode has reached a terminal result (secured, expired, withdrawn), archive it:

~~~json
{"op":"step","command":{"id":"turn-005","route":"arc.close"}}
~~~

Return to ordinary life and cash-based decisions:

~~~json
{"op":"step","command":{"id":"turn-006","route":"life.action","action":{"kind":"work","shifts":4,"playerText":"Δουλεύω τέσσερις βάρδιες."}}}
~~~

Leap a quiet year while the independent economic calendar continues:

~~~json
{"op":"step","command":{"id":"turn-007","route":"time.advance","days":365,"playerText":"Περνά ένας χρόνος."}}
~~~

The structured commands are **examples of host input**, not suggestions that the player must type JSON. The AI is expected to interpret natural input, translate it into legal proposals and keep the JSON out of the narrative.

## Routes and responsible systems

| Route | Engine method | Limits |
| --- | --- | --- |
| \`life.action\` | Saga → Life Mode \`act()\` | Supported \`dream,revise,plan,work,wait,pitch,accept,repay,delegate,investigate,study,launch,network,organize,connect,invite,finish\` |
| \`arc.begin\` | Saga → \`beginStrategy()\` | Only \`local-reform\`, \`venture-alliance\`, \`civic-network\` are executable |
| \`arc.move\` | GM validator → \`strategyTurn()\` | \`listen,investigate,share,prepare,offer,coordinate,publish,commit,wait,withdraw\` |
| \`arc.close\` | Saga archive | Only after secured/expired/withdrawn; histories remain |
| \`time.advance\` | Saga → Life Mode wait | Only positive integer day count within engine bounds |

No forced sample menu. The interpreter should ask a brief natural clarification only when needed, rather than silently rewriting an impossible action into a different intention. An ambitious action not supported by the engine must be labeled as **not yet executable**, not quietly invented.

## The two information planes

### PLAYER/public

\`sessionPlayerView(session)\` contains age, date, location, cash, debt, goals, plans, known people, current arc, public events, clear outcome, and compact footer. \`renderPlayerTurn(session)\` is a safe baseline Greek narrative. The AI may expand its literary style without changing facts.

### DIRECTOR/private

\`sessionDirectorPacket(session)\` contains strategic tensions, independent NPC motivations, latest structured actions, and a small set of relevant strategy mechanisms. **This is never player text.** It may help model the next plausible choices and countermoves but cannot override the resolver's result.

Knowledge is retrieved selectively: casebook → strategic mechanisms → 60-competency crosswalk. Do not dump 36 mechanisms or 12 cases into every message, and do not present them as 1,000 verified book passages.

### PRIVATE save transport

In-process state stays in the local CLI until exit. For handoff to an external trusted host:

~~~bash
node experiments/life-mode/chat-host.mjs --transport --director
~~~

\`--transport\` includes \`save\` with a replayable ordered action log. \`--director\` adds GM-private notes. Store them securely: **do not insert either field into the player's narrative**. The private save can be replayed in a trusted host by:

~~~json
{"op":"restore","save":"<opaque trusted save JSON string from previous response>"}
~~~

\`--transport\` does **not** encrypt or authenticate a save. It is a validated local replay mechanism; do not use as a secure multiplayer service or accept untrusted internet save blobs without a production security layer.

## New ChatGPT conversation — what actually works today

A new chat with **GitHub read access** can open the linked source and director protocol, understand the game design, and conduct a **provisional chat-ledger playtest**. Reading GitHub files **does not run Node**, does not automatically give ChatGPT access to your Mac's local \`chat-host\`, and does not persist a live module instance across unrelated chats.

For executable AI-as-UI gameplay, an external host/connector must run \`chat-host.mjs\` and supply its structured calls to the model. ChatGPT Work/other computer-capable workflows may be useful for running a local-hosted workflow where supported, but no such integration is implemented by this PR.

To preserve continuity without a live host, \`exportChatHandoff(session)\` produces a **player-safe** summary. An exact replay requires \`saveSession(session)\` transferred privately to an actual host. Do not confuse the two modes.

## A good player-facing turn in Greek

> Η Σοφία (επενδύτρια) ακούει την πρότασή σου, κοιτάζει τα οικονομικά και κρατά την απόφαση για αργότερα. Ζητά σαφές χρονοδιάγραμμα αντί για γενικές υποσχέσεις.
>
> **Αποτέλεσμα:** Η προσφορά δεν εγκρίθηκε ακόμη. Παραμένεις ελεύθερος να αλλάξεις τους όρους, να ερευνήσεις ή να αναζητήσεις άλλον συνεργάτη.
>
> Τι κάνεις;
>
> Ηλικία 18 · [ημερομηνία] · Μετρητά €900 · Χρέος €0 · Σχέδιο: επιχείρηση

**This paragraph is an illustrative style sample**, not a real current engine result or fabricated agreement.

## Testing and failure policy

- \`npm test\` and \`npm run verify\` check rule integrity and replay consistency.
- \`node --test experiments/life-mode/kingmaker-session.test.mjs experiments/life-mode/chat-host.test.mjs\` targets the AI bridge.
- Wrong kind, forged actor, invalid evidence, duplicate ID, fake cash or unsupported action → explicit rejection and **no canonical state mutation**.
- Tests cannot certify that the narrative is entertaining; that requires real creator playtesting.
- No automatic background work, AI web access, image renderer, official electoral sandbox, human-approved release, or iPhone deployment is implied.
