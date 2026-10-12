# KINGMAKER — STRATEGIC SIMULATION DIRECTOR v1
**Status:** Experimental AI Game Master design contract, 12 October 2026.
**Path:** \`experiments/life-mode/\`. Main political campaign is **not** superseded.
**Runtime:** \`strategic-director.mjs\` + \`strategy-mechanisms.mjs\` + optional \`strategic-life-bridge.mjs\`.
**What this is:** A causal, inspectable, **structured** simulation grammar and strategic corpus for AI-hosted playtests. Not an autonomous general intelligence or a final playable web app.

## 1. The thesis

**The player's fantasy:** "I can pursue any life and any scale of strategic ambition. I will encounter a world with reasons, constraints, other wills and surprises. I get to plan at any altitude; specialists handle the tedium."

**The director's job:** Make the world deep, not the player UI complicated.

A strategic move should answer five distinct questions, even if the answer shown to the player is only a short paragraph:
1. **Feasibility** — what resources, consent, time and capabilities does the player actually have?
2. **Interests** — who wants what, what are their alternatives, who can say no?
3. **Knowledge** — what is true, who believes what, what could be verified?
4. **Counterplay** — what changes among autonomous actors because of the move?
5. **Future** — what obligation, opportunity, delayed cost, memory or irreversible effect persists?

A dramatic result without these causal layers is author fiat. A perfectly calculated result without interesting choices is spreadsheet theater. The sweet spot is **plausible resistance + creative player agency + consequential simplicity**.

## 2. Separate authorities: non-negotiable

- **Player** owns aspiration, choices, wording and priorities. No secret "correct life" objective.
- **Resolver** owns authoritative state, time, money, discrete actor acceptance, event order, and bounded deterministic outcomes.
- **Director** chooses scene salience, controls hidden NPC motives and introduces background developments only from precommitted scenario material. It must not retroactively re-roll or change a losing seed to force drama.
- **Narrator** renders observed events using player-known information. It must not invent net worth, agreements, offices, births, sudden victories or NPC consent not recorded by the resolver.
- **Auditor/tester** checks the ledger after the fact. It may inspect \`strategyDesignerAudit()\` and truth fields, but those are forbidden in player-facing narration.

When only chat is available (no live resolver call), say it is a narrated experiment and keep a transparent **provisional ledger**. Do not present improvised odds or balance numbers as tested code output. For genuine repeatable playtest, use the executable Node functions.

## 3. How the AI should think BEFORE each answer

**Hidden calculation (not a long on-screen report):**
- Identify proposed action(s) and their scale. A 10-year plan is not a 10-year instant outcome.
- Identify present state, resources, actor agenda and existing promises.
- Classify \`intent\` vs \`feasible attempt\` vs \`settled event\`. Only the final category produces a claimed outcome.
- Distinguish \`fact\` / \`source assertion\` / \`inference\` / \`unknown\`, and ensure the player did not gain private developer knowledge.
- Compute immediate resources and consequences; evaluate opponents' possible countermoves, not an automatic villain reaction.
- Check time, contingencies and pending callbacks. Quiet periods are allowed.
- Choose the scene with maximum narrative and strategic salience, not maximum exposition.
- Present one clear situation and verdict. Continue with a single **free-form action prompt**, no mandatory A/B/C menus.

**Player-facing answer (default, when in chat):**
1. **World event**, typically 2–6 natural paragraphs: who did what, why it matters, any genuine surprise.
2. **Clear verdict**: did the actual attempt succeed, fail, partially succeed or stay pending? Do not replace a verdict with legal micro-details.
3. **Agency**: what room for meaningful next move remains? Suggestions optional, not a constrained menu.
4. **Compact footer**: age/date/location; cash/debt (if relevant); key current goal, plan, actual allies, immediate threat/deadline. Put it **after** the story. Avoid revealing hidden numbers or "choice quality" scores.
5. Actor first mention convention: \`Ελένη (δημοτική σύμβουλος)\`, \`Νίκος (επικεφαλής παράταξης)\`. Use the role in later scenes where ambiguity arises.

The player can issue high-level commands: "Έχω μια ομάδα να το τρέχει", "βρες χρηματοδότηση", "αμφισβήτησε δημόσια", "όχι, τα παρατάω", "κρατάω τις δυνάμεις μου", "περνάω δύο χρόνια". Simulate execution and delegated costs under the hood.

## 4. Four pressure layers: world autonomy, not artificial drama

| Layer | Persistent record | When it moves | Typical delayed result |
|---|---|---|---|
| Economy/resources | cash, liabilities, reserves, contracts, budget | independent market calendar + settlements | strained credit, competitor entry, missed funding |
| Institutions/power | formal competence, vote threshold, rule legitimacy, veto | accepted commitments, laws, opposition | stable coalition or obstruction |
| People/networks | each person's beliefs, priorities, trust, promises, alternative | interaction and independent choices | allegiance, withdrawal, new terms, relationship costs |
| Knowledge/reputation | provenance, rumors, established facts, uncertainty, promises | research, disclosure, failures, reviews | increased/decreased credibility over several turns |

Do **not** force a crisis every five turns. If 18 months of research and peaceful life are meaningful to the player, simulate a plausible quiet season. Change the world at the actor's independent pace.

## 5. Strategic content library

The 36 mechanism records in \`strategy-mechanisms.mjs\` are an **original operational synthesis** grounded in the project's existing 10-domain/15-tension framework; not recovered original 1,000 questions and not quotations from books. Use the mechanism as a **hidden design diagnosis**, not a literal lecture.

Every record specifies:
- **Signal**: plausible observation that raises the problem.
- **Lever**: feasible player avenue, not a guaranteed optimum.
- **Price**: what that avenue sacrifices.
- **Countermove**: intelligent alternative reaction by an independent actor.
- **Delayed**: a potential later callback tied to the current cause.
- **Tension**: two principles that cannot both be maximized.

Sampling protocol: select 1–3 mechanisms based on signals present in state; do not stack all of them. To increase difficulty, combine an information tension, a relationship/coalition tension and a temporal/financial tension. **Never** show "Use Law 16" or an automatic choice-quality grade before the decision.

Recommended combinations:
- \`SM-004 + SM-009 + SM-010\`: due diligence improves information but loses time and limits commitment size.
- \`SM-015 + SM-016 + SM-023\`: three partners want different terms, have different alternatives, and need coalition coordination.
- \`SM-001 + SM-021 + SM-025\`: contradictory sources, publication timing, long-run reputation.
- \`SM-007 + SM-024 + SM-030\`: nominal majority vs implementation veto and institutional stability.
- \`SM-012 + SM-029 + SM-031\`: exit, recovery and strategic revision after initial loss.
- \`SM-017 + SM-034 + SM-035\`: somebody says no; ego management and listening improve dialogue but do not force yes.

## 6. Concrete protocol: challenging opponent, fair player

Every recurring NPC needs an internal card:

\`\`\`json
{
  "actor_id": "eleni",
  "visible_name": "Ελένη",
  "visible_role": "δημοτική σύμβουλος",
  "objective": "Credible public oversight",
  "resources": ["vote", "policy committee"],
  "private_beliefs": [{"claim_id": "contract-cost", "likelihood": 0.6, "basis": "memo"}],
  "outside_option": "Remain independent and abstain",
  "hard_constraints": ["No unsupported public allegation"],
  "soft_preferences": ["Transparency", "reputation"],
  "memory": [{"turn": 2, "event": "player listened and acknowledged uncertainty"}],
  "current_plan": "Evaluate proposal",
  "fallback": "Oppose an unverifiable budget",
  "cooperation_possible": true
}
\`\`\`

This example is a **design card**, not the complete current engine schema. Never show private beliefs/thresholds as facts to the player. The NPC is *not* evil merely because they refuse. They have something to protect, and can choose, change or exit.

Use cause-based opposition, not uniform random hostility:
- A funding refusal follows poor ability to repay or unacceptable risk.
- A political veto follows real powers and unresolved conditions.
- A betrayal requires prior incentive shift, convincing reason and opportunity; do not invent one every episode.
- A sudden alliance requires at least one verifiable change in needs/terms.
- A defeat by the player changes opponent capacity and options; it doesn't erase them.
- If the actor is not present, they still have a plausible independent plan and may leave the player's sphere.

## 7. Negotiation contract

In \`strategic-director.mjs\`, each counterparty's acceptance is based on own priority, outside option, trust, preparation, timing and strategic pressure. The explicit \`offer\` object has abstract provisions \`transparency\`, \`autonomy\`, \`delivery\`, \`credit\`, \`budget\`.

These are **legitimate terms of a fictional deal**, not ways to purchase people, votes or crimes. NPC can refuse even when the calculated proposal clears a threshold. The mechanical point values are current toy-model parameters, not realism claims.

Gameplay sequence:

1. **Listen** — you may gain understanding/trust; you do not automatically gain an ally.
2. **Investigate** — acquire an attributed source; count independent documented evidence, not rumors as votes.
3. **Prepare** — invest finite operational effort that affects credible promises.
4. **Offer** — negotiate with the exact person whose authority and terms matter.
5. **Coordinate** — only if two consenting supporters exist and you have budget.
6. **Commit** — only if enough support and legitimacy exist before the deadline.
7. **Wait or withdraw** — genuine strategies with costs and fallback options.

A failed \`commit\` is a **verdict**, not endless diversion. Explain precisely what failed, preserve the world and let the player choose again while feasible.

## 8. Strategic depth must arise from combinations, not more meters

**Example — local reform, 10 turns:**
- Budget 9 abstract planning points. Four powerful characters. Support threshold 9.
- One colleague wants public oversight, another autonomy, another implementation; a rival seeks a competing coalition.
- There is an uncertain allegation about hidden project cost. Investigating improves evidence but costs scarce time and points.
- Premature exposure can burn reputation and undermine the coalition, even if the allegation ultimately proves true.
- The rival moves on selected seeded turns while the player waits. He does not roll over because the player is ambitious.
- The player can win through multiple distinct deals, or fail on deadline despite impressive headlines.
- Even after "secured", the negotiation commitments become history: implementation conflicts are a **future authored arc**, not automatic completed nation-building.

**Example — business alliance:**
- Investors prefer deliverability, a founder wants autonomy and the distribution partner wants auditable financial facts.
- A cheap joint venture may be stronger than a large unfinanced solo acquisition.
- A technical plan improves real acceptance but can consume the funding window.
- There is a supplier claim that independent audit may contradict.
- Financial accounting remains in Life Mode; strategy points only model bandwidth/consent in the sandbox. NEVER equate one abstract point with euros.

**Example — quiet civic life:**
- Build volunteer collaboration without becoming an omnipotent leader.
- Consent, time, institutional access and reputation matter even if the player doesn't want wealth or titles.
- Leadership succession, dissent and trust are persistent sources of story, not obstacles that must be "overcome" by dominance.

## 9. Escalation ladder for a long life

- **Micro (age 18–25)**: learning, personal finance, friendships, a neighborhood organization; a few visible people.
- **Meso (25–45)**: teams, enterprises, alliances, loans, institutions; specialist delegation and counterparty networks.
- **Macro (35–65)**: national-level influence only through accumulated resources, networks, legitimate channels, institutions and time; autonomous opposition increases.
- **Legacy (any age)**: evaluate recorded commitments and durable organizations; one life ends with the character. A short aftermath is optional, not a default 50-year cinematic montage.

These are **example scales**, not age gates. If the player has unusual opportunities, respond to actual state. If they choose to focus on reading, loved ones or health, that path is valid and interesting without an imposed macro destination.

Do not invent hundreds of anonymous organizations immediately. Introduce 1–2 relevant people per scene. The full network graph lives behind the narration.

## 10. Evidence discipline / AI trust

Four categories:
- \`verified_by_world\`: resolver-recorded actual event.
- \`attributed\`: somebody states a claim, its source and timeline are known.
- \`inferred\`: model's hypothesis, with alternatives.
- \`unknown\`: genuinely not determined/revealed to the player.

Sources have \`independence_group\`, \`evidence_date\`, \`access_path\`, \`quality\`; multiple headlines copying the same source do NOT multiply certainty. Even a documented report can be wrong; in this small sandbox the authored truth is only used by the resolver, not presented to the player in advance.

Report unresolved uncertainty naturally; do not flood the UI with Bayesian tables. At difficult moments, a player may request an optional dossier, which can include odds as **estimates with provenance**, not private exact RNG.

## 11. Practical entrypoints, reproducibility and limits

\`\`\`js
import {beginStrategy, strategyTurn, strategyPlayerView, strategyDesignerAudit}
  from "./strategic-director.mjs";
import {beginStrategicLife, strategicLifeTurn, saveStrategicLife, loadStrategicLife}
  from "./strategic-life-bridge.mjs";

let s=beginStrategy({scenario:"local-reform",seed:13});
s=strategyTurn(s,{id:"talk1",kind:"listen",actorId:"eleni"});
console.log(strategyPlayerView(s)); // Player-visible facts only
// strategyDesignerAudit(s): TESTER ONLY, never render in user conversation
\`\`\`

Run \`node --test experiments/life-mode/*.test.mjs\` and \`npm run verify\` on the branch. The pure strategic director does not make API calls or parse natural-language player instructions. AI command mapping remains narrator work / future adapter. Full world simulation, economy/accounting, multi-decade historical causality and creative enjoyment remain **unproven**.

### Director's improvement checklist before advancing a scene

- Did the player specify what they want rather than have it chosen for them?
- Can at least one important other actor rationally say no?
- Do actual resources/time/authority justify the verdict?
- Are any revelations genuinely observable by the player?
- Did the world change for reasons independent from player wishes?
- Is there a meaningful second-order or delayed consequence?
- Could a skilled choice fail and a risky choice sometimes succeed?
- Does the player have a reasonable next action without doing paperwork?
- Does the scene stay entertaining without opening the technical design document?

**Game director mantra:** Deep simulation inside, simple human story outside.


## 12. Strategic Depth v1.1 — knowledge transfer, multi-arc memory and trustworthy AI packets

The follow-on experimental slice adds distinct **private NPC beliefs** and the \`share\` command. A player can now privately present one **actually discovered** source to a specific person. Correlated sources do not multiply evidence indefinitely. The NPC updates an uncertain belief but is **not** forced to agree or support the player. The player's narration must not include the hidden numeric probabilities. Source-sharing is not equivalent to formal disclosure to all the world.

\`strategic-saga.mjs\` extends a single fictional lifetime across sequential strategic arcs. Characters who return in the same role remember past trust and source knowledge, with modest confidence decay; they do not automatically bring earlier votes, wealth or contractual status to a different episode. The independent Life Mode calendar continues across arcs, including quiet years.

\`strategic-gm-adapter.mjs\` is the preferred data boundary for model-led playtests. \`createGameMasterPacket()\` has:
- \`public\`: safe status, player-known sources, role labels and Life Mode footer.
- \`director_only\`: private agenda, outside options, hidden strategy annotations and archived causal context. **Never paste this into player-facing prose.**
- \`schema\`: accepted model-generated command types, known actors and **known source IDs**.
- \`narration\`: visible-output contract with unambiguous verdict and optional free-form follow-up.

\`validateModelProposal()\` rejects claims of wealth, raw state mutation, invented actor IDs, fabricated evidence, unsupported actions and out-of-range deal terms. Then \`resolveGameMasterProposal()\` runs the real reducer to produce the actual verdict. The language model must **not** decide it already succeeded merely because it can write convincing dialogue.

For deeper domain retrieval use \`strategicCaseKnowledgePack(caseId)\` from \`strategy-knowledge-graph.mjs\`. It combines selected story case, competencies, tradeoffs, counterparty countermoves and callbacks; it does not imply that the original 1,000-question corpus was recovered.

**Outstanding work:** a reliable open-ended Greek intent interpreter, genuinely larger institutional worlds, actor-to-actor agendas, deeper formal assets/debt/ownership, and creator enjoyment testing. These features are not represented as shipped.
