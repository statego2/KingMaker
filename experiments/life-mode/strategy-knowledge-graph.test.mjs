import test from "node:test";
import assert from "node:assert/strict";
import {STRATEGY_COMPETENCIES,STRATEGY_CROSSWALK,validateStrategyCrosswalk,strategicCaseKnowledgePack} from "./strategy-knowledge-graph.mjs";
import {STRATEGIC_CASEBOOK} from "./strategy-casebook.mjs";
test("author-created playbook crosswalk covers 60 master competencies without inventing a single original question mapping",()=>{
 const r=validateStrategyCrosswalk();
 assert.equal(r.valid,true,JSON.stringify(r.errors));
 assert.equal(r.authoredMechanisms,36);
 assert.equal(r.canonicalCompetencies,60);
 assert.equal(r.competenciesTouched,60);
 assert.equal(r.originalQuestionMappings,0);
 assert.deepEqual(r.uncovered,[]);
 assert.equal(new Set(STRATEGY_COMPETENCIES).size,60);
 assert.equal(Object.keys(STRATEGY_CROSSWALK).length,36);
});
test("every case retrieves a distinct grounded mechanism pack with real costs and countermoves",()=>{
 for(const c of STRATEGIC_CASEBOOK){
  const pack=strategicCaseKnowledgePack(c.id);
  assert.equal(pack.caseId,c.id);
  assert.ok(pack.patterns.length>=3);
  assert.match(pack.sourceBoundary,/NOT item-level/);
  assert.ok(pack.patterns.every(p=>p.competencies.length>=2));
  assert.ok(pack.patterns.every(p=>p.longRunCallback.length>20));
  assert.ok(pack.patterns.every(p=>p.cost!==p.lever));
 }
 assert.throws(()=>strategicCaseKnowledgePack("unknown"),/Unknown strategic case/);
});
