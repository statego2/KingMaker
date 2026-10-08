# KM-089 Knowledge Taxonomy

Slice 1 indexes the 10 domains, 60 competencies and 15 master tensions from docs/00_MASTER_PROJECT.md. It also defines stable Q001–Q1000 IDs and tier ranges.

This is not a completed question-level mapping. The individual 1,000 question records are not present in this repository. No question-to-competency or per-question source attribution has been inferred. The parent KM-089 remains in progress.

Next: obtain original question records, validate IDs and provenance, then map and review actual records in bounded batches. Do not modify game canon or save schema.

## Slice 2 — original-question intake (2026-10-08)

The `data/question_mappings_v1.json` manifest contains **0 imported question records**. The master framework documents the 1,000-question plan but does not provide the item-level corpus. No mappings have been fabricated.

`src/question-mapping.js` validates imported records for canonical Q001–Q1000 IDs, tier, competency and tension IDs, source-record path/locator and review evidence. `npm run validate:mappings` reports imported, reviewed and unmapped counts. Node regression fixtures are synthetic only.

Import actual source records in bounded batches with `question_id`, `tier`, `question_text`, `source_record: {path, locator}`, `primary_competency`, `secondary_competencies`, `master_tension` (ID or null), `source_anchors: [{work, locator}]` and `review_status: "needs_review"`. Set `source_status: "partial_import"` after importing any records. Never cite `docs/00_MASTER_PROJECT.md` as an original individual question source. Only set `review_status: "reviewed"` with named reviewer and review evidence after actual human source verification; passing structural tests alone does not establish correctness.

The intake is not imported by the game. No UI, canon or save changes. KM-089 remains in progress until the corpus is available and real mappings are reviewed.

## Slice 3 — machine-readable coverage and synthetic regression (2026-10-08)

`src/knowledge-coverage.js` separates imported and manifest-attested reviewed primary/secondary mappings by all 60 competencies. The three tests in `tests/knowledge-coverage.test.mjs` cover an empty corpus, mixed synthetic primary/secondary review status, and invalid manifests. The `tools/report-knowledge-coverage.mjs` CLI prints validated JSON (run directly with `node tools/report-knowledge-coverage.mjs`, or `npm run report:coverage` for console use). The report intentionally reads the current empty original manifest and reports 0/1000 imported/reviewed. A `reviewed` label still requires external human provenance verification; structural CI is not creative/editorial approval.

[PR #13](https://github.com/statego2/KingMaker/pull/13); [passing game-tests](https://github.com/statego2/KingMaker/actions/runs/37776026971) and [backlog](https://github.com/statego2/KingMaker/actions/runs/37776026791).
