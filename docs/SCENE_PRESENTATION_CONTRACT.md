# KM-009 — Versioned scene presentation contract v1

The pure adapter `src/scene-contract.js` converts authored scene records into one stable presentation interface without entangling simulation state. The active renderer `src/redesign-scenes.js` delegates its visual `meta()` resolver to the adapter; existing 18 scene modes and appearance are unchanged.

## v1 contract fields
- `version`, `id` — scene contract version and stable content scene ID
- `mode` — one of the nine allowed visual modes; **unknown values fall back to briefing** and emit issue
- `place`, `label` — visible scene context, with legible defaults when absent
- `actors`, `primaryActor` — known actor IDs resolved from current people registry; unknown actors are excluded and reported, not silently treated as real characters
- `sourceRefs` — *only explicitly provided* authored source IDs. Existing raw evidence labels do not constitute provenance and are not transmuted into invented source records
- `pressure` — optional authored reference; no exposure of hidden numerical state
- `art` — authored asset ID if present, otherwise `procedural_fallback`; no fake approved artwork
- `issues` — non-fatal validation diagnostics; `validateScenePresentation` supplies a Boolean validity result.

## Dependencies and future gates
- The contract does **not** change `src/engine.js`, localStorage or canon; no save migration needed.
- Rendering uses a fallback for unexpected future scene modes; authoring/test validation still catches them.
- The 18 original scenes resolve and render through the same current CSS/procedural scene pipeline, supported by Node smoke tests; no screenshot or actual device acceptance is implied.
- KM-010 can evolve the adaptive layout against this interface after KM-005 approval; KM-011 should pull view/controller apart without exposing hidden choice quality.
- Before implementing actual art/source production, add stable IDs to authored scene sources/art manifests via an approved, audited authoring pipeline.
