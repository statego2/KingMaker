# KINGMAKER — v0.3 runtime ↔ v1 state contract audit (KM-006)

**Scope:** compare actual src/engine.js fresh/load/commit against data/game_state_schema_v1.json, docs/04_GAME_SYSTEMS_SPEC_V1.md, world/character seed files. No migration is implemented by this document.

## Structural verdict

The currently playable engine state is **v0.3**. The v1 JSON Schema is a forward-looking design contract, not an instance of shipped state. A direct v1 schema validator would reject a fresh v0.3 save because none of the v1 required root domains (meta, time, world, player, actors, network, story, content_runtime) are present as specified. Some similarly named v0.3 objects carry much narrower data.

| v1 domain | Current delivery | Concrete difference |
|---|---|---|
| meta | Partial | version only, no save ID, schema version, timestamps, RNG seed |
| time | Spec only | 0-based scene index i; no persisted day/time block/act/chapter |
| world | Partial | 6 scalar measures, 3 coalition routes, 3 NSO metrics; lacks 11 canonical world tracks and 10 documented pressure series |
| player | Partial | 5 resource counters; no knowledge, staff or behavioral profile; promises are separate global array |
| actors | Partial | 14 relationships + Silas aggregate counters, not agent state, belief and memory objects for 25 seeded actors |
| network | Spec only | power-network visualization is not a saved influence-edge model |
| story | Partial | 18 linear scene IDs, flags, history, scheduled inbox callbacks; no generalized scene trigger graph |
| content_runtime | Spec only | no versioned seen-content / RNG log; old inbox data has no target schema slot |

This is an architectural delta, not evidence that the playable Chapter 1 suddenly became broken.

## Legacy field mapping — preserve every key

The machine-readable source is data/state_migration_map_v0_3_to_v1.json. Every v0.3 root key has an explicit destination and preservation rule, including fields not represented in the current v1 schema.

| v0.3 | Proposed v1 location | Caution |
|---|---|---|
| version | meta.game_version | distinct from schema_version; never coerce unknown future versions |
| i | time.turn + story.active_scenes | stable scene IDs required; current index cannot encode day/time |
| flags | story.chapter_flags / world.flags | classify flags individually |
| player | player.resources | copy existing numeric counters without reinterpreting scale |
| world | world.tracks / world.pressures | split tracks vs pressure fields; missing canonical seed tracks are not magically simulated |
| routes | **world.coalition_routes** extension | preserve 3 route strengths; not identical to party factions |
| institutions | world.institutions | retain NSO-specific scores |
| rel | actors[id].player_relationship | preserve 8 existing dimensions; add new ones only with documented defaults |
| promises | player.promises | array → ID-indexed ledger after duplicate/status audit |
| silas | actors.silas_koren.state | preserve observation counters privately |
| inbox | **content_runtime.inbox** extension | otherwise message/unread state would be lost |
| scheduled | story.scheduled_consequences | due currently indexes scenes, not clock time |
| history | story.completed_scenes + **event_log** extension | store ordered decisions and full consequence snapshots |
| finished | story.campaign_status extension | keep ending distinction and reconciliation rule |

**Important:** three proposed extension fields are NOT in the current canonical v1 schema. They require an approved versioned schema amendment. The map is not permission to start changing production saves before KM-036.

## Migration and replay hazards

1. **Corrupt save / silent reset:** load() catches parse errors and falls back to fresh without export or recovery; repeated launches appear as new game.
2. **Forward compatibility:** normalize() always overwrites version to 0.3, so future-version data passed through old engine would be downgraded without a compatibility gate.
3. **Actor loss:** fresh() initializes 14 named relationships but the character seed defines 25 people; speculative instantiation must not invent the other 11 actors' state/history.
4. **Callback duplication / ID collision:** current callback IDs derive from due scene index and subject; duplicate same-subject events can conflict. No unique event ID/replay ledger.
5. **Weak restored-state validation:** normalize() repairs a few optional objects but does not validate i range, array shapes, nested player/world fields or malformed relation dimensions.
6. **Implicit timeline:** campaign_day cannot be reconstructed truthfully from chapter number; author canonical mapping from scene IDs and campaign chronology.
7. **Missing world semantics:** current world scalar names include pressure counters and do not align one-to-one with the 11 canonical tracks; preserve values and label unknowns explicitly.
8. **Private truth / fair-play:** never derive actor-private beliefs from player's public flags or expose hidden outcome quality while migrating.

## Proposed migration stages (not authorization to implement)

A. Freeze replay fixtures of v0.2 and v0.3: opening, midrun with callbacks/promises, 3 governmental finale variants, damaged save and unknown future version.

B. Define an **adapter** that reads old keys into a normalized intermediary representation, preserving unknown legacy fields in an opaque compatibility envelope. Separate pure state conversion from localStorage I/O.

C. Decide and approve v1 extensions for coalition routes, inbox, event history and campaign completion; document actors, clocks and source provenance before changing the saved format.

D. Implement lossless round-trip tests and a one-time migration marker before activating writes to the new key; old versions remain readable. Provide backup/export/recovery before any destructive migration.

E. Gate on deterministic replay, callback uniqueness, browser persisted-state tests and cross-version fixtures (KM-036/037/038/045/105); do not activate M4 schema prematurely.

## Testing and evidence

- data/state_migration_map_v0_3_to_v1.json is a machine-readable audit with all 14 legacy root keys and all 8 required v1 domains.
- tests/state-schema-audit.test.mjs asserts that the mapping covers the actual fresh() root keys and current schema required domains. It intentionally does not pretend to validate a v0.3 save against v1 schema.
- Existing tests/engine.test.mjs test v0.2 recovery, fresh/save/load, callbacks and corrupt JSON current behavior, **not** non-destructive upgrade or backward compatibility for all future versions.
- No runtime/state migration, browser storage verification or real-user testing is claimed by this audit.
