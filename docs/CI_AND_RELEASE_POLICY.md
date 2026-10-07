# KM-008 — CI, ownership and rollback policy

## Automated gates
Every pull request runs `game-tests` (Node static import/syntax checks, scene/save regression and backlog validator) and `validate-backlog` (task graph/status/evidence validation). The backlog workflow no longer filters on file paths; a test-only PR cannot skip the check. The visual baseline workflow is additional evidence for relevant presentation changes, not a player/device signoff.

## Change ownership
Repository owner: `@statego2`. `CODEOWNERS` can request reviewer attention when enabled. The implementation AI owns the task branch, evidence, tests and documentation; human owner approves aesthetic and narrative gates, public releases and material scope changes. No AI may treat CI success as creative acceptance. Branch convention `task/KM-###-slug`; every PR describes exact acceptance, state migration, tests, remaining risks and next task in the existing template.

## GitHub branch protection (manual action pending)
The connected API does not expose branch ruleset mutations, so no protection has been configured by this commit. Owner: GitHub repository Settings → Rules → Rulesets → New ruleset targeting `main`; require a PR and passing `game-tests` and `validate-backlog`; disallow force pushes and deletion. Consider independent reviewer approvals only when an eligible person is available. Confirm rules by intentionally failing a test PR and verifying merge is blocked. KM-008 remains review until this is confirmed or owner explicitly approves a documented exception.

## Issue and rollback process
File issues with task ID, scene ID, viewport/browser, steps, expected/actual result and evidence. For release regression: freeze merges, revert the faulty PR, re-run `npm run verify`, inspect browser behavior and save/load, confirm GitHub Pages actual deployment and log an incident regression fixture. Preserve older saves when a migration/rollback is needed.

No manual visual or release acceptance is implied here.
