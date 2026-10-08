import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import {formatQuestionId,questionSlot,validateKnowledgeTaxonomy} from "../src/knowledge-taxonomy.js";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const taxonomy=JSON.parse(readFileSync(resolve(root,"data/knowledge_taxonomy_v1.json"),"utf8"));
const master=readFileSync(resolve(root,"docs/00_MASTER_PROJECT.md"),"utf8");
test("canonical framework: 10 domains, 60 IDs, 15 tensions, and explicit source anchors",()=>{
  assert.deepEqual(validateKnowledgeTaxonomy(taxonomy),[]);
  const section=master.split("# 3. Strategic Mastery Model v1")[1].split("# 4. Fifteen Master Tensions")[0];
  const entries=[...section.matchAll(/^- \*\*([A-Z]{2}[1-6])\*\* (.+)$/gm)].map(([,id,name])=>[id,name]);
  const actual=taxonomy.domains.flatMap(x=>x.competencies.map(c=>[c.id,c.name]));
  assert.equal(entries.length,60,"master section should define exactly 60 competencies");
  assert.deepEqual(actual,entries,"IDs and labels must match canonical master, not paraphrases");
  assert.equal(taxonomy.master_tensions.length,15);
});
test("1000 deterministic question slots have correct tier boundaries but no fabricated mappings",()=>{
  const slots=Array.from({length:1000},(_,i)=>questionSlot(taxonomy,i+1));
  assert.equal(new Set(slots.map(x=>x.id)).size,1000);
  assert.equal(slots[0].id,"Q001");assert.equal(slots[999].id,"Q1000");
  for(const [n,tier] of [[100,"recognition"],[101,"diagnosis"],[270,"diagnosis"],[271,"application"],[470,"application"],[471,"trade_off"],[670,"trade_off"],[671,"adversarial"],[820,"adversarial"],[821,"integrated"],[940,"integrated"],[941,"adversarial_chains"],[980,"adversarial_chains"],[981,"capstone"],[1000,"capstone"]])assert.equal(slots[n-1].tier,tier);
  assert.ok(slots.every(x=>x.mapping_status==="unmapped"&&x.primary_competency===null&&x.source_anchors.length===0));
  assert.throws(()=>formatQuestionId(0),RangeError);assert.throws(()=>formatQuestionId(1001),RangeError);
});
test("validator rejects invented coverage, duplicate IDs, broken ranges and missing provenance",()=>{
  const mutate=fn=>{const copy=structuredClone(taxonomy);fn(copy);assert.notDeepEqual(validateKnowledgeTaxonomy(copy),[]);};
  mutate(t=>{t.question_corpus.mapped_question_count=1000;});
  mutate(t=>{t.domains[1].competencies[0].id="PE1";});
  mutate(t=>{t.question_tiers[2].start=272;});
  mutate(t=>{t.domains[0].competencies[0].source.anchor="UNKNOWN";});
});
