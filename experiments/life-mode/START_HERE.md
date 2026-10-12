# KINGMAKER — AI Playtest Quick Start

**Single source for the experimental AI UI:** [backend/README.md](backend/README.md).
**Single runtime API:** [backend/index.mjs](backend/index.mjs).
**Model↔engine contract:** [AI_CHAT_RUNTIME_PROTOCOL.md](AI_CHAT_RUNTIME_PROTOCOL.md).
**Strategic depth:** [AI_STRATEGIC_DIRECTOR_PROTOCOL.md](AI_STRATEGIC_DIRECTOR_PROTOCOL.md).
**Current code:** draft PR #21 stacked on #20 (strategic depth), #19 (life engine), #18 (proposal).

## For a new ChatGPT chat with GitHub access

1. Read the five links above **on the experimental branch**, not the stale published main.
2. Explain whether the runtime can actually be executed in the current chat. GitHub reading alone is not Node execution. If not, label the session a **provisional narrated playtest**.
3. The player starts at 18. Present a short fictional moment and let them freely state ambitions; no mandatory choices/menu. Do not choose their life goal for them.
4. Track intent vs attempt vs genuine world result. Every substantial counterparty has their own goals, available resources, knowledge, consent and opportunity. A refusal must be clear, not drowned in bureaucracy.
5. Select only the relevant knowledge: one scenario, a few mechanisms, credible counterplay. Keep the rest backstage. World pressure is causal, not synthetic drama on each turn.
6. At the bottom of every turn: age/date, genuine cash/debt, active goal, active plan, critical pending threat or opportunity. Use Greek with actor roles in parentheses.
7. After playtests, record player feedback separately from things that the current executable code actually supports. Proposals are not accepted canon until approval.

### Reusable startup instruction for a new chat

> KINGMAKER — ξεκίνα Life Mode playtest από τα 18. Στο GitHub, στο branch task/LSM-backend-ai-ui-bridge-20261012, διάβασε experiments/life-mode/START_HERE.md, backend/README.md, AI_CHAT_RUNTIME_PROTOCOL.md και AI_STRATEGIC_DIRECTOR_PROTOCOL.md. Χρησιμοποίησε τη στρατηγική βιβλιοθήκη και το πραγματικό game state όπου υπάρχει εκτελέσιμος resolver. Αν δεν μπορείς να εκτελέσεις τον Node host, πες το καθαρά και κάνε provisional chat playtest. Θέλω ελεύθερες εντολές, πραγματική αντίσταση, αυτόνομους άλλους ανθρώπους, μεγάλες φιλοδοξίες, ελάχιστη μικροδιαχείριση, σαφείς συνέπειες και σύντομο footer. Ξεκίνα!

## For a developer / AI agent that **can** run Node

Run from repo root:

~~~bash
node experiments/life-mode/chat-host.mjs --transport --director
~~~

Now wire:
- model player message → validated command \`{"op":"step","command":{...}}\`
- returned \`player\` → short Greek narration and footer
- returned \`director\` → internal director planning ONLY
- returned \`save\` → private host persistence ONLY

\`op:start\` initializes a run with an 18-year-old character. \`op:restore\` resumes an exact trusted replay. No API key or AI completion endpoint is implemented: the model host is a separate responsibility.

## Owner truth status

This is an experiment that keeps the political browser game intact. There are 3 executable sandbox scenarios and 12 additional authored case seeds, not an unlimited full-world strategic simulator. The original 1,000 question corpus remains unmapped; source-based content must not be invented. Unit tests are not human fun tests. PR #21 must not be merged as an official creative pivot without approval.
