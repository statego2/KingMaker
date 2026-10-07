# KINGMAKER — The Game of Judgment

**A mobile-first cinematic political strategy game about judgment, power and consequence.** The player explores a persistent fictional republic, investigates incomplete and conflicting information, understands human incentives, makes difficult decisions and lives with their consequences.

## Continue production with an AI agent

**Start here:** [AGENTS.md](AGENTS.md) → [NEXT_ACTION](docs/NEXT_ACTION.md) → [Master Production Plan](docs/PRODUCTION_PLAN.md).

Say to a GitHub-connected AI: **«Μπες στο repo KingMaker, διάβασε AGENTS.md και NEXT_ACTION.md, βρες την επόμενη dependency-ready εργασία και συνέχισε την υλοποίηση. Άνοιξε PR και πες μου τι έκανες και τι έλεγξες.»**

An AI must read current code and backlog, implement one cohesive task, verify it, record evidence, and hand off. This does **not** schedule ongoing background work.

### Production documents

| Document | Use |
|---|---|
| [Master production plan](docs/PRODUCTION_PLAN.md) | Vision, phases M0–M10, priorities, release gates, risks |
| [Machine-readable backlog](data/production_backlog_v1.json) | **111 numbered tasks**, dependencies, statuses, deliverables and acceptance criteria |
| [Task register](docs/TASK_REGISTER.md) | Human-readable WBS and detailed acceptance |
| [Current next action](docs/NEXT_ACTION.md) | Where the next AI starts |
| [AI delivery protocol](docs/AI_DELIVERY_PROTOCOL.md) | Branches, PRs, tests and truthful status handoff |
| [Campaign matrix](docs/CAMPAIGN_PRODUCTION_MATRIX.md) | 36-chapter production map |
| [Quality/testing strategy](docs/QUALITY_AND_TEST_STRATEGY.md) | UX, simulation, accessibility, playtest and release gates |
| [Progress log](docs/PROGRESS_LOG.md) | Dated verified work |
| [Backlog validator](tools/validate-production-backlog.mjs) | DAG/evidence/status integrity; run with Node 18+ |

## Current implementation (as inspected October 8, 2026)

- **Playable scaffold:** Act I / Chapters 1–6 / 18 scripted scenes (Day Zero → Government at Dawn).
- **Current web entry:** `index.html` loads `src/app-redesign.js` with `styles-redesign.css` and `src/redesign-scenes.js`.
- **Campaign code:** `src/content.js`, `src/act1b.js`.
- **Lightweight simulation v0.3:** `src/engine.js` supports player/world state, relationships, promises, choice effects, delayed messages, history and local saves.
- **Design/documentation:** canonical world, character, 36-chapter campaign architecture, system specification and 10-domain / 60-competency / 1,000-question strategic source corpus.
- **Current visuals:** procedural scene mockups and presentation templates, *not* a complete final portrait/location-art library.

**Not yet production complete:** Gold Chapter 1, tested first 60–90 minutes, full investigation/actions and simulation contracts, real art package, test automation, Acts II–VI content and final release. The specifications describe intentions, not shipped functionality.

## Play

[Open KINGMAKER on GitHub Pages](https://statego2.github.io/KingMaker/).

GitHub Pages uses this repository's published configuration. This URL's existence is not a substitute for deployment or device verification.

## Creative identity

**Lydria, 2032.** The six-act story follows:
**The Outsider → The Operator → The Kingmaker → The Counterplayer → The System → Legacy.**

Core interactive loop:
**Observe → Investigate → Interpret → Commit → See reactions → Update beliefs.**

The game embeds strategic learning in actual political trade-offs, rather than making a visible multiple-choice curriculum. Decisions can be informed, constrained, reversible or mistaken. Decision quality is separate from the result.

### Canon hierarchy

- [Master Project / curriculum](docs/00_MASTER_PROJECT.md)
- [World Bible](docs/01_WORLD_BIBLE_V1.md)
- [Character Bible](docs/02_CHARACTER_BIBLE_V1.md)
- [36-Chapter Architecture](docs/03_STORY_CAMPAIGN_ARCHITECTURE_V1.md)
- [Game Systems Specification](docs/04_GAME_SYSTEMS_SPEC_V1.md)
- [Cinematic visual override](design/09_CINEMATIC_VISUAL_PIVOT.md)

## First milestone

**M0: baseline, documentation audit, smoke tests and reproducible workflow**. Then make **Gold Chapter 1** and **Gold Chapters 1–3** compelling and verifiably playable before expanding content. Check [NEXT_ACTION](docs/NEXT_ACTION.md) rather than inferring from this README.
