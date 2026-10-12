import test from "node:test";
import assert from "node:assert/strict";
import { beginStrategicLife, strategicLifeTurn, replayStrategicLife, strategicLifeView, saveStrategicLife, loadStrategicLife } from "./strategic-life-bridge.mjs";
const config=()=>({life:{id:"simulated-001",birthDate:"2010-04-12",startedAt:"2028-05-01",location:"Θεσσαλονίκη",cash:900},scenario:"local-reform",seed:12});
test("strategy is playable within age-18 Life Mode without inventing money, title or power",()=>{
 const before=beginStrategicLife(config());
 const after=strategicLifeTurn(before,{id:"t1",kind:"listen",actorId:"eleni",playerText:"Μιλάω στην Ελένη"});
 const v=strategicLifeView(after);
 assert.equal(v.date,"2028-05-08");
 assert.equal(v.age,18);
 assert.equal(v.cash,900);
 assert.equal(v.debt,0);
 assert.equal(v.episode.turn,1);
 assert.equal(v.episode.support,1);
 assert.match(v.lifeFooter,/Ηλικία 18/);
 assert.match(v.latestDecision.detail,/Ελένη/);
 assert.equal(before.life.turns.length,0);
 assert.equal(before.strategy.history.length,0);
});
test("independent life market calendar continues through chained strategy turns",()=>{
 const actions=Array.from({length:10},(_,i)=>({id:"wait"+i,kind:"wait"}));
 const x=replayStrategicLife(beginStrategicLife(config()),actions);
 assert.equal(x.strategy.result,"expired");
 assert.equal(x.life.date,"2028-07-10");
 assert.equal(x.life.turns.length,10);
 assert.equal(x.actions.length,10);
 const v=strategicLifeView(x);
 assert.equal(v.episode.status,"expired");
});
test("strategic save is a trustworthy versioned action log and rejects edited snapshots",()=>{
 const actions=[
  {id:"t1",kind:"listen",actorId:"eleni"},
  {id:"t2",kind:"investigate",factId:"contract-cost"},
  {id:"t3",kind:"offer",actorId:"eleni",terms:{transparency:3}}
 ];
 const a=replayStrategicLife(beginStrategicLife(config()),actions);
 const saved=saveStrategicLife(a);
 assert.deepEqual(loadStrategicLife(saved),a);
 const json=JSON.parse(saved);
 assert.equal(json.format,"kingmaker-strategic-life-v1");
 assert.equal(Object.hasOwn(json,"cash"),false);
 assert.equal(Object.hasOwn(json,"secretMotive"),false);
 const forged=structuredClone(a);forged.life.cash=10_000_000;
 assert.throws(()=>saveStrategicLife(forged),/outside resolver/);
 assert.throws(()=>loadStrategicLife(saved.slice(0,9)),/Corrupt/);
 assert.throws(()=>loadStrategicLife(JSON.stringify({...json,format:"v0"})),/Unsupported/);
 assert.throws(()=>loadStrategicLife(JSON.stringify({...json,actions:[...actions,actions[0]]})),/Duplicate/);
});
test("Life Mode dream goals stay separate from strategic victory flags",()=>{
 const base=beginStrategicLife(config());
 const revised=strategicLifeTurn(base,{id:"t1",kind:"withdraw"});
 assert.equal(revised.strategy.result,"withdrawn");
 assert.equal(revised.life.cash,900);
 assert.deepEqual(revised.life.goals,[]);
 assert.throws(()=>strategicLifeTurn(revised,{id:"t2",kind:"wait"}),/closed/);
});
test("400 strategic life decisions across seeds remain nonnegative, deterministic and chronological",()=>{
 for(let seed=0;seed<40;seed++){
  const cfg={...config(),seed};
  const actions=Array.from({length:10},(_,i)=>({id:"m"+i,kind:"wait"}));
  const x=replayStrategicLife(beginStrategicLife(cfg),actions);
  assert.deepEqual(x,replayStrategicLife(beginStrategicLife(cfg),actions));
  assert.ok(x.life.cash>=0);
  assert.equal(x.life.turns.length,10);
  assert.equal(x.strategy.history.length,10);
  assert.equal(strategicLifeView(x).episode.status,"expired");
 }
});
