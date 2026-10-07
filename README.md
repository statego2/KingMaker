# KingMaker

**KINGMAKER: The Game of Judgment** is a mobile-first strategic narrative RPG / simulation built around conditional strategic judgment.

The project combines:
- a 1,000-question strategic curriculum,
- a persistent near-future political/economic world,
- recurring NPCs with beliefs, incentives and memory,
- dynamic power networks,
- long causal chains,
- decision quality separated from outcome,
- and a campaign that progresses from **Outsider → Operator → Kingmaker → Counterplayer → System → Legacy**.

## Current canon

- **World:** Republic of Lydria, 2032
- **Core strategic asset:** Aster Gate Corridor
- **Main cast:** 27 recurring characters
- **Campaign:** 6 Acts / 36 core chapters
- **Curriculum:** 1,000 questions complete

## Repository structure

```text
docs/
  00_MASTER_PROJECT.md
  01_WORLD_BIBLE_V1.md
  02_CHARACTER_BIBLE_V1.md
  03_STORY_CAMPAIGN_ARCHITECTURE_V1.md

data/
  world_state_seed_v1.json
  character_state_seed_v1.json
  relationship_graph_v1.json
  campaign_seed_v1.json
```

## Core loop

```text
PERCEIVE
→ SELF-COMMAND
→ FRAME
→ CHOOSE
→ ACT
→ OBSERVE REACTIONS
→ UPDATE BELIEFS
→ ADAPT
```

## Design rule

The campaign is **not** a series of quiz questions with fictional decoration.

The 1,000-question corpus is a curriculum and scenario laboratory. Strategic mechanisms are rewritten into recurring character conflicts, institutions, crises and delayed consequences.

## Next phase

**Game Systems Specification**

The next milestone turns the campaign architecture into executable mechanics and data contracts for a browser-based mobile implementation.


## Playable build

The first playable vertical slice is now in the repository root as a self-contained `index.html`.

Current scope: **Chapters 1–3 / 9 scenes** with persistent state, delayed callbacks, relationship updates, Inbox, People and Situation views.


## Visual direction integrated

The separate high-level design preproduction is now part of the canonical repository under `/design`.

The playable build has been updated to use the **Statecraft Noir** visual language:
institutional materiality + editorial typography + provenance-first strategic interfaces.

### Live build
GitHub Pages serves the repository root.
