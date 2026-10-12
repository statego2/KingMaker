import test from "node:test";
import assert from "node:assert/strict";
import {comparePolicies,runPolicy} from "./strategy-balance.mjs";

test("strategy benchmark is reproducible and compares actual strategic tradeoffs",()=>{
 const a=comparePolicies(100),b=comparePolicies(100);
 assert.deepEqual(a,b);
 assert.deepEqual(a.report.map(x=>x.policy),["impulsive","targeted","adaptive"]);
 for(const row of a.report){
  assert.equal(row.seeds,100);
  assert.ok(row.secured_fraction>=0&&row.secured_fraction<=1);
  assert.ok(row.mean_turns>0&&row.mean_turns<=10);
  assert.ok(row.mean_resource_cost>=0);
 }
 assert.throws(()=>comparePolicies(20),/Invalid/);
});
test("targeted bargaining has advantage over blind assertion without guaranteed victory",()=>{
 const x=comparePolicies(500).report;
 const rash=x.find(z=>z.policy==="impulsive");
 const informed=x.find(z=>z.policy==="targeted");
 const adaptive=x.find(z=>z.policy==="adaptive");
 assert.equal(rash.secured_fraction,0);
 assert.ok(informed.secured_fraction>0.5);
 assert.ok(informed.secured_fraction<1);
 assert.ok(adaptive.secured_fraction>0.5);
 assert.ok(adaptive.secured_fraction<1);
 assert.ok(adaptive.mean_resource_cost>=informed.mean_resource_cost);
});
test("policy outcomes are actual reducer trajectories, not invented scoring labels",()=>{
 for(let seed=0;seed<80;seed++){
  const {state,view}=runPolicy({seed,policy:"adaptive"});
  assert.equal(state.history.length,state.turn);
  assert.equal(view.status,state.result);
  assert.ok(state.resources.budget>=0);
  assert.ok(state.history.every(h=>h.cost>=0));
  assert.ok(state.history.every(h=>h.id));
  assert.ok(state.result==="secured"||state.result==="ongoing"||state.result==="expired");
 }
});
