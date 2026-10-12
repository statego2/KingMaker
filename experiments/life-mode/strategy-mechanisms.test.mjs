import test from "node:test";
import assert from "node:assert/strict";
import { STRATEGIC_MECHANISMS, CANON_DOMAINS, MASTER_TENSIONS, validateMechanisms, mechanismCandidates } from "./strategy-mechanisms.mjs";

test("strategic library is a unique, validated 36-mechanism original synthesis",()=>{
 const report=validateMechanisms();
 assert.equal(report.valid,true,report.errors.join("\n"));
 assert.equal(report.count,36);
 assert.equal(new Set(STRATEGIC_MECHANISMS.map(x=>x.id)).size,36);
 assert.deepEqual(new Set(report.domains),new Set(CANON_DOMAINS));
 assert.ok(new Set(STRATEGIC_MECHANISMS.map(x=>x.tension)).size>=12);
 assert.equal(MASTER_TENSIONS.length,15);
});

test("all mechanisms have actionable signal, real trade-off, independent countermove and delayed impact",()=>{
 for(const p of STRATEGIC_MECHANISMS){
  for(const key of ["signal","lever","price","countermove","delayed"]){
   assert.ok(p[key].length>20,p.id+" missing "+key);
  }
  assert.ok(p.price!==p.lever);
  assert.ok(p.countermove!==p.delayed);
 }
});

test("mechanism palette filters by fictional context without player omniscience",()=>{
 const epistemics=mechanismCandidates({domain:"PE"});
 assert.ok(epistemics.length>=3);
 assert.ok(epistemics.every(x=>x.domain==="PE"));
 const doubt=mechanismCandidates({signal:"Αληθοφάνεια"});
 assert.equal(doubt.length,1);
 assert.equal(doubt[0].id,"SM-001");
 assert.equal(mechanismCandidates({domain:"UNKNOWN"}).length,0);
});

test("validator rejects fabricated source coverage and broken identifiers rather than silently accepting",()=>{
 const copied=structuredClone(STRATEGIC_MECHANISMS.slice(0,2));
 copied[1].id=copied[0].id;
 assert.equal(validateMechanisms(copied).valid,false);
 const bad=structuredClone(copied);
 bad[0].tension="not-a-canonical-tension";
 assert.ok(validateMechanisms(bad).errors.length>=2);
});
