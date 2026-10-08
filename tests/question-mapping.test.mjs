import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {auditQuestionMappings,mappedQuestionOrSlot,validateQuestionMappingManifest} from "../src/question-mapping.js";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const taxonomy=JSON.parse(readFileSync(resolve(root,"data/knowledge_taxonomy_v1.json"),"utf8"));
const empty=JSON.parse(readFileSync(resolve(root,"data/question_mappings_v1.json"),"utf8"));
const draft=(id="Q001",tier="recognition")=>({
 question_id:id,tier,question_text:"Synthetic test fixture: which evidence should be verified first?",
 source_record:{path:"fixtures/synthetic-corpus.md",locator:"item-"+id},
 primary_competency:"PE2",secondary_competencies:["JD1"],master_tension:"MT01",
 source_anchors:[{work:"synthetic-test-only",locator:"fixture-1"}],review_status:"needs_review"
});
const manifest=records=>({schema_version:"1.0",taxonomy_id:taxonomy.id,
 source_status:records.length?"partial_import":"awaiting_original_corpus",records});
test("empty corpus reports zero imported/reviewed, 1000 unmapped",()=>{
 assert.deepEqual(validateQuestionMappingManifest(taxonomy,empty),[]);
 const a=auditQuestionMappings(taxonomy,empty);
 assert.equal(a.valid,true);assert.equal(a.imported,0);assert.equal(a.reviewed,0);
 assert.equal(a.unmapped,1000);assert.equal(a.missing_ids[0],"Q001");
 assert.equal(a.missing_ids.at(-1),"Q1000");assert.equal(a.by_tier.capstone.expected,20);
 assert.equal(a.by_domain.PE,0);
 assert.equal(mappedQuestionOrSlot(taxonomy,empty,1000).mapping_status,"unmapped");
});
test("partial synthetic intake preserves canonical tier and review boundary",()=>{
 const r=draft(),m=manifest([r]);
 assert.deepEqual(validateQuestionMappingManifest(taxonomy,m),[]);
 assert.equal(mappedQuestionOrSlot(taxonomy,m,1),r);
 assert.equal(mappedQuestionOrSlot(taxonomy,m,2).mapping_status,"unmapped");
 const a=auditQuestionMappings(taxonomy,m);
 assert.equal(a.imported,1);assert.equal(a.reviewed,0);assert.equal(a.awaiting_review,1);
 assert.equal(a.unmapped,999);assert.equal(a.by_domain.PE,1);
});
test("reject duplicate/invalid IDs, tier, competency, and provenance",()=>{
 const invalid=[
 [draft(),draft()],[draft("Q0001")],[draft("Q1001")],[draft("Q001","diagnosis")],
 [{...draft(),source_record:{path:"docs/00_MASTER_PROJECT.md",locator:"3"}}],
 [{...draft(),source_record:{path:"fixtures/synthetic-corpus.md"}}],
 [{...draft(),primary_competency:"FAKE1"}],
 [{...draft(),secondary_competencies:["PE2"]}],
 [{...draft(),secondary_competencies:["JD1","JD1"]}],
 [{...draft(),master_tension:"MT99"}],
 [{...draft(),source_anchors:[{work:"test"}]}],
 [{...draft(),question_text:""}]
 ];
 for(const records of invalid)assert.notDeepEqual(validateQuestionMappingManifest(taxonomy,manifest(records)),[],JSON.stringify(records));
});
test("review requires human evidence and source anchors",()=>{
 const pending={...draft(),review_status:"reviewed"};
 assert.notDeepEqual(validateQuestionMappingManifest(taxonomy,manifest([pending])),[]);
 const reviewed={...pending,reviewer:"human-reviewer",review_evidence:"https://github.com/statego2/KingMaker/pull/EXAMPLE"};
 assert.deepEqual(validateQuestionMappingManifest(taxonomy,manifest([reviewed])),[]);
 assert.equal(auditQuestionMappings(taxonomy,manifest([reviewed])).reviewed,1);
 assert.notDeepEqual(validateQuestionMappingManifest(taxonomy,manifest([{...reviewed,source_anchors:[]}])),[]);
});
test("cannot claim complete import for absent or partial records",()=>{
 assert.notDeepEqual(validateQuestionMappingManifest(taxonomy,{...empty,source_status:"complete_import"}),[]);
 assert.notDeepEqual(validateQuestionMappingManifest(taxonomy,{...manifest([draft()]),source_status:"awaiting_original_corpus"}),[]);
 assert.notDeepEqual(validateQuestionMappingManifest(taxonomy,{...manifest([draft()]),source_status:"complete_import"}),[]);
});
