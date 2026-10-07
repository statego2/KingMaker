# KM-011 — Scene rendering / controller boundary

`src/scene-renderer.js` now owns the pure HTML templates for scene HUD, world/decision, choice cards, context sheet, committed consequence and Act I finale. The active `src/app-redesign.js` only requests these views and remains responsible for DOM mount, navigation/overlays, click events, simulated `commit()`, reads, reset and localStorage save/load.

The renderer accepts `{state,selected,result,analysis,icon}` and returns `renderScene()` / `renderContext()` functions. It does not receive `root`, `document`, a storage API or a commit callback. The existing scene markup/classes and text stay unchanged; keyboard/touch hooks remain delegated by the controller.

Node tests assert no state mutation from scene/choice/context rendering, no precommit Commit action, opt-in debrief, consequence, finale. Existing game tests and Chromium visual baseline provide regression evidence. No save-format migration.

**Remaining architecture risk:** utility screens (Inbox, People, Power, Archive) and instrument overlays still have HTML assembled in the controller. Extract those into pure instrument views in a subsequent bounded follow-up before considering the entire KM-011 design hardening complete. Owner may mark task review if that extraction is required by acceptance.
