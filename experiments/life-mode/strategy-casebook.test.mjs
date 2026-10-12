import test from "node:test";
import assert from "node:assert/strict";
import {STRATEGIC_CASEBOOK,validateCases,getPublicCase} from "./strategy-casebook.mjs";
import {STRATEGIC_MECHANISMS} from "./strategy-mechanisms.mjs";
test("12 authored case packets pass structural depth and breadth checks",()=>{
 const validation=validateCases();
 assert.equal(validation.valid,true,validation.errors.join("\n"));
 assert.equal(validation.count,12);
 assert.equal(new Set(STRATEGIC_CASEBOOK.map(x=>x.id)).size,12);
 assert.ok(new Set(STRATEGIC_CASEBOOK.map(x=>x.scale)).size===3);
 assert.ok(new Set(STRATEGIC_CASEBOOK.map(x=>x.domain)).size>=8);
});
test("every strategic case only references actual audited mechanism IDs",()=>{
 const ids=new Set(STRATEGIC_MECHANISMS.map(p=>p.id));
 for(const item of STRATEGIC_CASEBOOK){
  assert.ok(item.mechanisms.every(id=>ids.has(id)),item.id);
  assert.ok(item.discoverable.length>=3);
  assert.ok(item.possibleMoves.length>=4);
  assert.ok(item.private.length>0);
  assert.ok(item.actors.length>=2);
 }
});
test("case opener introduces people by name plus role, withholding hidden agenda",()=>{
 for(const item of STRATEGIC_CASEBOOK){
  const p=getPublicCase(item.id);
  assert.equal(p.cast.length,item.actors.length);
  assert.ok(p.cast.every(a=>a.name&&a.role));
  for(const secret of item.private){
   assert.equal(JSON.stringify(p).includes(secret),false);
  }
  assert.equal(Object.hasOwn(p,"private"),false);
  assert.equal(Object.hasOwn(p,"countermove"),false);
 }
 assert.throws(()=>getPublicCase("CASE-99"),/Unknown/);
});
