import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {summarizeKnowledgeCoverage} from '../src/knowledge-coverage.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const taxonomy = JSON.parse(readFileSync(resolve(root, 'data/knowledge_taxonomy_v1.json'), 'utf8'));
const empty = JSON.parse(readFileSync(resolve(root, 'data/question_mappings_v1.json'), 'utf8'));
const fixture = (id, primary, secondary = [], reviewed = false) => ({
  question_id: id, tier: 'recognition',
  question_text: 'Synthetic test question ' + id,
  source_record: {path: 'fixtures/synthetic-only.md', locator: id},
  primary_competency: primary, secondary_competencies: secondary,
  master_tension: null,
  source_anchors: [{work: 'synthetic fixture', locator: id}],
  review_status: reviewed ? 'reviewed' : 'needs_review',
  ...(reviewed ? {reviewer: 'test-reviewer', review_evidence: 'synthetic-only'} : {})
});
const partial = records => ({...empty, source_status: 'partial_import', records});

test('empty original corpus reports zero reviewed coverage for all 60 competencies', () => {
  const result = summarizeKnowledgeCoverage(taxonomy, empty);
  assert.equal(result.valid, true);
  assert.equal(result.expected_questions, 1000);
  assert.equal(result.imported_questions, 0);
  assert.equal(result.reviewed_questions, 0);
  assert.equal(result.unmapped_questions, 1000);
  assert.equal(result.competencies_with_reviewed_primary, 0);
  assert.equal(result.by_competency.length, 60);
  assert.ok(result.by_competency.every(c => c.imported_primary === 0 && c.reviewed_primary === 0 && c.reviewed_secondary === 0));
});

test('reviewed and pending synthetic mappings remain distinct across primary and secondary coverage', () => {
  const result = summarizeKnowledgeCoverage(taxonomy, partial([
    fixture('Q001', 'PE1', ['PE2', 'JD1'], true),
    fixture('Q002', 'PE1', ['JD1']),
    fixture('Q003', 'JD1', ['PE1'], true)
  ]));
  assert.equal(result.valid, true);
  assert.equal(result.imported_questions, 3);
  assert.equal(result.reviewed_questions, 2);
  assert.equal(result.unmapped_questions, 997);
  assert.equal(result.competencies_with_reviewed_primary, 2);
  const byId = Object.fromEntries(result.by_competency.map(c => [c.id, c]));
  assert.deepEqual([byId.PE1.imported_primary, byId.PE1.reviewed_primary, byId.PE1.reviewed_secondary], [2, 1, 1]);
  assert.deepEqual([byId.JD1.imported_primary, byId.JD1.reviewed_primary, byId.JD1.reviewed_secondary], [1, 1, 1]);
  assert.equal(byId.PE2.reviewed_secondary, 1);
  assert.equal(byId.PE2.reviewed_primary, 0);
});

test('invalid manifest does not produce a misleading valid coverage report', () => {
  const result = summarizeKnowledgeCoverage(taxonomy, partial([fixture('Q001', 'UNKNOWN')]));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('invalid primary competency')));
  assert.equal('by_competency' in result, false);
});
