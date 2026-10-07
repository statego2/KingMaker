# KM-005 — Reproducible Chromium visual baseline

This is a baseline of the current scene-first game. It is not an artistic approval, Safari test or iPhone hardware run.

To reproduce: run npm run dev in one terminal. In a second terminal run npm install --no-save --no-package-lock playwright@1.56.1, then npx playwright install chromium, then node tools/capture-visual-baseline.mjs.

The separate visual-baseline GitHub Actions workflow stores the snapshots as an artifact. It captures first, longest (by initial scene text) and final scenes at **320×568, 375×667, 390×844, 430×932 and 1440×900**. The JSON ledger records choice/commit geometry, horizontal overflow and potential clipping; actual legibility, scene aesthetics, keyboard reachability and iOS safe areas still need human inspection.

A commit below the viewport is a **review candidate**, not conclusive proof of a bug when scrolling is possible. Create GitHub issues for visual problems after reviewing images. Keep KM-005 in review until visual and artifact checks are done; actual-device review remains separate.
