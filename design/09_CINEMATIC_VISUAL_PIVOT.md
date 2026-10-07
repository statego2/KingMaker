# KINGMAKER — Cinematic Visual Pivot

**Status: CANONICAL VISUAL OVERRIDE**

This document supersedes the dashboard-first interpretation of the earlier Statecraft Noir UI documents.

The underlying strategic principles remain valid:
- information provenance matters,
- power is relational,
- consequences persist,
- the player earns broader access over time.

What changes is **how those systems are presented**.

## 1. New visual north star

KINGMAKER is a **cinematic political strategy game**, not an intelligence dashboard.

The player should spend most of their time looking at:
- places,
- people,
- atmosphere,
- political moments,
- maps,
- symbolic objects,
- dramatic situations,

with strategic information embedded into those scenes.

The UI supports the world.
The UI is not the world.

## 2. Primary composition rule

For major campaign scenes:

**WORLD / SCENE 45–60%**
- environment,
- lighting,
- people,
- location identity,
- movement,
- time of day.

**STORY / CONTEXT 15–25%**
- what is happening,
- who is involved,
- what changed.

**DECISION 25–35%**
- the actual strategic choice.

Analytical detail remains accessible but should not dominate the first impression.

## 3. What is explicitly deprecated

Do not build future screens around:
- stacked rectangles on dark grey,
- dense terminal aesthetics,
- "government SaaS",
- tiny metadata everywhere,
- dashboards as the default scene,
- dossier cards as the main emotional experience,
- monochrome black/brass across the entire game,
- generic intelligence-grid backgrounds.

These can exist as secondary analytical modes only.

## 4. Visual world

Lydria should feel geographically and emotionally real.

Velis:
- blue pre-dawn government district,
- warm Assembly interiors,
- Presidential stone and glass,
- rain on office windows,
- media lights at night,
- crowded corridors during coalition crises.

Sera:
- sea, wind, ferries, islands, coast-guard screens,
- warmer natural color palette.

Aster Gate:
- enormous port infrastructure,
- rail,
- cranes,
- data and energy layers,
- real scale.

Daran:
- machinery,
- steel,
- workers,
- heat,
- industrial amber.

The player should be able to recognize location before reading its label.

## 5. Character presentation

Characters must become visual anchors.

Priority:
1. face,
2. posture / expression,
3. environment,
4. role,
5. analytical metadata.

Not the reverse.

A meeting with Elena Varin should feel like a meeting with the President, not opening her database record.

## 6. Decision presentation

The decision is the dramatic climax of a scene.

Choices should:
- have space,
- use strong verbs,
- be visually distinct without exposing hidden score,
- feel like actions, not quiz answers.

Avoid presenting all supporting information at equal visual weight.

## 7. Analytical surfaces

Network, dossier, archive and system views remain important.

They are **special instruments**, not the universal layout.

Use them when the player's task is actually:
- mapping power,
- checking history,
- comparing sources,
- tracking commitments,
- managing a multi-system crisis.

## 8. Color philosophy

The game is not "dark mode."

Each place and moment owns a palette.

Examples:
- Velis dawn: navy / steel blue / pale gold.
- Assembly: walnut / burgundy / warm institutional light.
- Presidency: stone / midnight blue / cream / restrained gold.
- Sera: sea blue / cyan / sunset amber.
- Harbor evidence: cold rain / paper ivory / ink red.
- Crisis: desaturated world with selective amber/red pressure signals.
- Legacy: pale sunrise, stone, archival cream.

Black is a framing color, not the entire world.

## 9. Motion

Use environmental motion before interface animation:
- rain,
- distant traffic,
- cranes,
- sea haze,
- screens reflected in glass,
- camera flashes,
- moving map light.

Interface motion should be restrained and support focus.

## 10. Implementation rule

Before adding a new dashboard component, ask:

**Can this information be communicated through the scene, a character, a map, an object, or one strong visual cue instead?**

If yes, prefer that.

## 11. Current playable reference

As of 2026-10-08, the shipped GitHub Pages entrypoint is `index.html` → `src/app-redesign.js` / `src/redesign-scenes.js` + `styles-redesign.css`. This is a **scene-first procedural prototype**, not finished film-quality assets.

Future UI work should evolve from the scene-first direction, with real location and character art, consistent composition and gameplay-first usability. Do not restore the deprecated dashboard-first composition. Track implementation tasks and verified status in `data/production_backlog_v1.json` and `docs/NEXT_ACTION.md`.
