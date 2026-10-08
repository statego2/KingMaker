# KM-012 — Lydria location and time-of-day visual bible (proposed v1)

**Status:** `review` after branch CI; **NOT APPROVED ART**. Owner art-direction signoff, real production reference boards, phone-scale evaluation and asset licensing remain outstanding.

**Machine-readable companion:** [`data/lydria_visual_bible_v1.json`](../data/lydria_visual_bible_v1.json). This is a *shot/identity specification*, not shipped game art or a runtime location registry.

## Design authority and scope

- [World Bible](../docs/01_WORLD_BIBLE_V1.md) §4 (geography), §5 (Harbor scandal/Aster Gate proposal), §6 (Assembly and Presidency) defines what exists.
- [Cinematic Visual Pivot](../design/09_CINEMATIC_VISUAL_PIVOT.md) §4, §8–10 governs scene-first imagery, local palettes and environmental motion.
- [Creative Direction](../design/00_CREATIVE_DIRECTION.md) governs incomplete information, institutional nuance and restraint.
- [Scene catalog](../src/redesign-scenes.js) maps *existing* scene IDs to prototype modes. Examples in the manifest are reference targets, **not** proof that art is present.
- No narrative canon, save state, chapter logic, assets or runtime UI changed by this task.

## Visual grammar: recognize the place before reading the label

| Identity | Three recognition anchors | Light/color family | Production caution |
|---|---|---|---|
| **Velis** | Institutional skyline; rain/glass; access-threshold corridors | Blue hour, steel, pale gold | Distinct buildings, not one imaginary super-ministry |
| **Presidency** | Stone/glass threshold; long table; restrained ceremonial mark | Cream stone, midnight blue, modest gold | Constitutional guardian, **not** executive throne |
| **Assembly** | Seat rhythm; walnut surfaces; procedural corridors | Burgundy, walnut, warm light | 240 seats/121 confidence is canon; chamber architecture isn't |
| **Harbor Contracts file** | Source-marked paper; rainy evidence room; technical plans | Cold rain, paper ivory, ink red | A *narrative evidence context*, **not** a new city; no automatic guilt cue |
| **Sera Islands** | Ferry pier; sea horizon; navigation/coast-guard prop | Sea blue, cyan, sunset amber | Do not draw disputed waters as settled borders |
| **Aster Gate / Port Aster** | Cranes; freight rail; planned energy/data overlays | Industrial steel, maritime blue, safety amber | **Proposal ≠ completed infrastructure** |
| **Daran Belt** | Heavy machinery; workers; robotics beside legacy lines | Steel, amber, factory warmth | Avoid faceless workers or simplistic automation moral |

Each identity has **three distinct daypart/shift shot directions** (21 total) in the JSON, with light, camera and environmental motion cues. These are concepts, not invented factual climate or architectural canon. Human review can revise every shot without changing narrative continuity.

## Scene-first staging and mobile constraints

1. **World first:** one readable actor, place or symbolic object establishes the scene. Show the reason a political moment matters before exposing an analytical instrument.
2. **Story second:** provenance belongs to physical props and dialogue; distinguish verified facts, reports and inference with *text*, not only color.
3. **Decision third:** choice cards remain large, legible and accessible; art never crosses the title or action safe zone at **320/375/390/430px**. At 320px crop/reframe the image before reducing readable text.
4. **Camera language:** human eye level for bargaining, doorway for access, over-shoulder for documents, wide infrastructure views only when scale is the dramatic point.
5. **Motion:** environmental rain, distant traffic, ferries, machinery or subtle reflections; no strobing or essential information conveyed by animation. Respect reduced motion.
6. **No generic UI takeover:** maps, dossiers and system panels appear as optional instruments, not default full-screen dashboards.

## Bounded production handoff

**Slice A (this branch):** 7 canonical-context identity briefs, 3 motifs per identity, palette guidance, 21 time/shift shot concepts, location-specific anti-canon-drift risks, machine-readable manifest and Node contract test.

**Slice B (requires artist/owner):** 7 reference boards with source/rights and at least one 320px composition study each. Validate visual differentiation blind (remove location labels) and approve/revise each palette.

**Slice C (requires art pipeline):** 3 gameplay mock screenshots for the initial gold chapter, actual art asset attribution/crop manifest, iPhone/Safari checks and explicit creative signoff. **KM-012 is not done until the owner approves the visual bible**; downstream KM-013 and KM-014 must not assume acceptance.

## Owner review checklist

- [ ] Seven identities are recognizable without their labels and do not contradict canonical geography or institutions.
- [ ] Presidency/Assembly are visually distinct, while Harbor file is clearly a *case*, not a location.
- [ ] Aster Gate proposed elements are visibly differentiated from built infrastructure.
- [ ] At least one phone composition per identity protects the title, choice copy and tap targets.
- [ ] Reference/production assets have provenance, permission and license records.
- [ ] Owner explicitly accepts or requests revisions to the direction; only then move `KM-012` to `done` after merge.

**Not a runtime/UI change:** Chromium screenshots and actual device approval are intentionally pending until visual samples exist. No art assets or palettes have been silently applied to the game.
