# KINGMAKER — Handoff to Implementation AI

## Intent

This branch is a design package, not an implementation branch.

No file here should be assumed to be production-ready code.

The implementation AI should preserve the existing canonical world, character, campaign and future game-system contracts in /docs and /data.

## Recommended use

Treat the design package as four layers:

1. Creative constraints
   - 00_CREATIVE_DIRECTION
   - 01_VISUAL_LANGUAGE

2. Interaction architecture
   - 02_UI_UX_SYSTEM
   - 03_GAME_FEEL_AND_PACING
   - 05_SCREEN_BLUEPRINTS

3. Art production
   - 04_ASSET_BIBLE
   - ASSET_MANIFEST
   - 07_ASSET_PROMPT_LIBRARY
   - assets/concepts

4. Progression logic
   - 06_VISUAL_PROGRESSION_MATRIX

## Do not implement blindly

Before implementing any screen:
- map it to actual game state,
- identify which information is known versus inferred,
- identify provenance,
- decide whether the player's current act / access grants this view,
- ensure no hidden developer truth leaks through UI,
- ensure decision quality is not revealed before commitment.

## High-priority prototype order

Prototype 1:
Chapter opening → briefing → dossier → Decision Room → consequence.

Prototype 2:
Network lens switching and relationship provenance.

Prototype 3:
Aster Gate situation map.

Prototype 4:
Act V crisis board.

Prototype 5:
Act VI legacy / succession view.

## Acceptance test

The first playable visual slice should cover the first 90 minutes and answer:

Can a new player understand what matters without the UI explaining strategy principles explicitly?

Can they tell fact, source claim and inference apart?

Can they feel that people and institutions persist?

Does committing to a choice feel consequential without artificial gamification?

Does the game already look like KINGMAKER rather than a generic narrative app?

If not, do not scale content production yet.
