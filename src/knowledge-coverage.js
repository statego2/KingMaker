import {auditQuestionMappings} from "./question-mapping.js";
// Reviewed means attested in the source manifest; not independently approved.
export function summarizeKnowledgeCoverage(taxonomy, manifest) {
  const audit = auditQuestionMappings(taxonomy, manifest);
  if (!audit.valid) return {valid:false, errors:audit.errors};
  const records = manifest.records;
  const reviewed = records.filter(r => r.review_status === "reviewed");
  const by_competency = taxonomy.domains.flatMap(d => d.competencies.map(c => ({
    id:c.id, domain_id:d.id,
    imported_primary:records.filter(r => r.primary_competency === c.id).length,
    reviewed_primary:reviewed.filter(r => r.primary_competency === c.id).length,
    reviewed_secondary:reviewed.filter(r => r.secondary_competencies.includes(c.id)).length
  })));
  return {valid:true, taxonomy_id:taxonomy.id, source_status:manifest.source_status,
    expected_questions:1000, imported_questions:audit.imported,
    reviewed_questions:audit.reviewed, unmapped_questions:audit.unmapped,
    competencies_with_reviewed_primary:by_competency.filter(c => c.reviewed_primary > 0).length,
    by_competency};
}
