# KINGMAKER — M0 local developer workflow (KM-002 / KM-003 / KM-004)

This project is a static ES-module game hosted on GitHub Pages. **No build step and no npm dependencies** are required. Node.js **20+** is required for the no-dependency test harness; GitHub Actions uses Node 22.

## Fresh checkout
```sh
git clone https://github.com/statego2/KingMaker.git
cd KingMaker
node --version
npm run dev
# In a browser, open http://127.0.0.1:4173/
```
The preview server serves local assets from the repository without replacing the GitHub Pages deployment. `PORT=4174 npm run dev` changes the listening port. Stop it with Ctrl+C.

## Reproducible checks
```sh
npm run check              # JavaScript syntax, local imports, HTML asset references
npm test                   # Node built-in tests: scene data, progression, saves, HTTP boot
npm run validate:backlog   # task graph / dependencies / evidence policy
npm run verify             # all of the above
```
A nonzero exit status blocks CI; inspect the failing diagnostic. The `.github/workflows/game-tests.yml` workflow executes those checks on PRs and pushes to main.

## Coverage and exclusions
- KM-002: Node preview server and fresh-checkout commands, no private setup; HTTP GET/404/405 + MIME test.
- KM-003: imported 18-scene roster and presentation maps, choice and evidence integrity, actors, module syntax/import graph.
- KM-004: fresh → choice → persisted restore; all three opening alternatives; deterministic 18-scene route; scheduled callback; legacy v02 normalization; reset/read inbox; malformed JSON fallback.
- Pre-choice quality-display guard inspects the active `renderScene()` controller function.
- The 18-scene route exercises **one** choice pattern, not every branching combination. **No browser automation, screenshots, phone device runs or manual playtest** are claimed. KM-005 and later quality gates remain open.
- Legacy migration still has known validation gaps and silent corruption fallback, documented under KM-006. These tests freeze **current observed behavior**, not endorse it as finished design.

## State compatibility
No gameplay, state schema or save-key changes in these tasks. Live code still uses `kingmaker_statecraft_v03` and can read `v02`.

## CI evidence
Record the actual GitHub Actions run in the production log/backlog after completion. Do not assume CI passed merely because this workflow file exists.
