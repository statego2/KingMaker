import test from "node:test";
import assert from "node:assert/strict";
import { SCENARIOS, beginStrategy, strategyTurn, replayStrategy, strategyPlayerView, strategyDesignerAudit } from "./strategic-director.mjs";
const start=(scenario="local-reform",seed=13)=>beginStrategy({scenario,seed});
const take=(s,id,kind,extra={})=>strategyTurn(s,{id,kind,...extra});
test("three distinct strategic sandboxes start without changing the Life Mode ledger",()=>{
 assert.deepEqual(Object.keys(SCENARIOS),["local-reform","venture-alliance","civic-network"]);
 for(const id of Object.keys(SCENARIOS)){
  const s=start(id),view=strategyPlayerView(s);
  assert.equal(s.turn,0);assert.equal(view.status,"ongoing");
  assert.equal(view.people.length,4);
  assert.ok(view.people.every(p=>p.name&&p.role));
  assert.equal(s.history.length,0);assert.equal(s.evidence.length,0);
 }
});
test("listening builds trust but does not manufacture votes or oblige people",()=>{
 const original=start(),before=strategyPlayerView(original).support;
 const after=take(original,"t1","listen",{actorId:"nikos"});
 assert.equal(strategyPlayerView(after).support,before);
 assert.equal(after.actors.find(a=>a.id==="nikos").trust,1);
 assert.equal(original.actors.find(a=>a.id==="nikos").trust,0);
 assert.match(after.history[0].outcome.detail,/Νίκος/);
});
test("cannot pledge money absent from budget and no negative strategic resources",()=>{
 const original=start();
 const denied=take(original,"t1","offer",{actorId:"nikos",terms:{autonomy:3,budget:12}});
 assert.equal(denied.history[0].outcome.result,"failed");
 assert.equal(denied.resources.budget,original.resources.budget);
 assert.equal(strategyPlayerView(denied).support,strategyPlayerView(original).support);
 assert.throws(()=>take(original,"invalid","offer",{actorId:"nikos",terms:{autonomy:4}}),/Invalid autonomy/);
});
test("actor's own priorities materially change otherwise identical offers",()=>{
 const base=start();
 const eleni=take(base,"t1","offer",{actorId:"eleni",terms:{transparency:3}});
 const nikos=take(base,"t1","offer",{actorId:"nikos",terms:{transparency:3}});
 assert.equal(eleni.history[0].outcome.result,"succeeded");
 assert.equal(nikos.history[0].outcome.result,"failed");
 assert.equal(nikos.actors.find(a=>a.id==="nikos").stance,"undecided");
});
test("a rival cannot be bought with trivially generous terms",()=>{
 const base=start();
 const s=take(base,"t1","offer",{actorId:"stefanos",terms:{credit:3,budget:9}});
 assert.equal(s.history[0].outcome.result,"failed");
 assert.equal(s.resources.budget,9);
 assert.equal(s.actors.find(a=>a.rival).stance,"opposed");
});
test("premature disclosure damages reputation; investigation preserves contradictory claims",()=>{
 const s=take(start(),"p","publish");
 assert.equal(s.resources.credibility,0);
 assert.equal(s.resources.exposure,2);
 assert.equal(s.history[0].outcome.result,"failed");
 let x=start();
 x=take(x,"a","investigate",{factId:"contract-cost"});
 assert.equal(x.evidence.length,1);
 assert.equal(strategyPlayerView(x).investigation.grade,"contested");
 x=take(x,"b","investigate",{factId:"contract-cost"});
 assert.equal(strategyPlayerView(x).investigation.grade,"contested");
 x=take(x,"c","investigate",{factId:"contract-cost"});
 assert.equal(strategyPlayerView(x).investigation.grade,"corroborated");
 assert.equal(x.resources.budget,6);
 const verified=take(x,"p","publish");
 assert.equal(verified.history.at(-1).outcome.result,"succeeded");
 assert.equal(verified.resources.credibility,4);
 assert.equal(strategyPlayerView(verified).investigation.reports.length,3);
});
test("player sees sources but never absolute hidden truth, outside options, utility thresholds, or seed",()=>{
 const x=take(start(),"t1","investigate",{factId:"contract-cost"});
 const json=JSON.stringify(strategyPlayerView(x));
 for(const forbidden of ["truth","threshold","outside","hiddenEvents","seed","priority","rivalMoves"])assert.equal(json.includes('"'+forbidden+'"'),false,forbidden);
 const developer=strategyDesignerAudit(x);
 assert.equal(developer.truth,true);
 assert.ok(developer.actorMotives.every(a=>a.threshold>0));
});
test("commit failure does not end life; enough consent-based coalition ends scenario",()=>{
 let sample=null;
 for(let seed=0;seed<200;seed++){
  let s=start("local-reform",seed);
  const failed=take(s,"early","commit");assert.equal(failed.result,"ongoing");
  s=take(failed,"a","listen",{actorId:"eleni"});
  s=take(s,"b","listen",{actorId:"nikos"});
  s=take(s,"c","offer",{actorId:"eleni",terms:{transparency:3}});
  s=take(s,"d","offer",{actorId:"nikos",terms:{autonomy:3,budget:1}});
  if(s.actors.filter(a=>a.stance==="supporting").length===2){
   const coordinated=take(s,"e","coordinate");
   const ended=take(coordinated,"f","commit");
   if(ended.result==="secured"){sample=ended;break;}
  }
 }
 assert.ok(sample,"reachable coalition by genuine negotiation");
 assert.ok(sample.resources.budget>=0);
 assert.ok(sample.history.some(h=>h.kind==="coordinate"));
 assert.throws(()=>take(sample,"x","wait"),/closed/);
});
test("coalition support is not a magic permanent flag when trust is lost",()=>{
 let s=start();
 s.actors[0].stance="supporting";
 s.actors[0].trust=-2;
 s=take(s,"next","wait");
 assert.equal(s.actors[0].stance,"undecided");
 assert.ok(s.events.some(e=>e.type==="defection"));
});
test("rival has independently seeded countermoves, never deterministic drama each turn",()=>{
 let seen=0,still=0;
 for(let seed=0;seed<80;seed++){
  let s=start("venture-alliance",seed);
  for(let i=1;i<=6;i++)s=take(s,"t"+i,"wait");
  const moves=s.actors.find(a=>a.rival).rivalMoves;
  if(moves>0)seen++;else still++;
  assert.ok(moves<=2);
 }
 assert.ok(seen>0);
 // With 72% per eligible tick and two ticks, there can still be quiet lives.
 assert.ok(still>0);
});
test("closed deadline and voluntary exit are different from wins",()=>{
 let s=start("local-reform");
 for(let i=1;i<=10;i++)s=take(s,"w"+i,"wait");
 assert.equal(s.result,"expired");
 assert.throws(()=>take(s,"extra","commit"),/closed/);
 const x=take(start(),"quit","withdraw");
 assert.equal(x.result,"withdrawn");
 assert.equal(x.history[0].outcome.result,"succeeded");
 assert.equal(x.actors.length,4);
});
test("strategic replay is deterministic and prevents duplicate action IDs",()=>{
 const moves=[
  {id:"t1",kind:"listen",actorId:"eleni"},
  {id:"t2",kind:"investigate",factId:"contract-cost"},
  {id:"t3",kind:"prepare"},
  {id:"t4",kind:"offer",actorId:"eleni",terms:{transparency:3}},
  {id:"t5",kind:"wait"}
 ];
 const original=start(),a=replayStrategy(original,moves),b=replayStrategy(start(),moves);
 assert.deepEqual(a,b);
 assert.deepEqual(original,start());
 assert.throws(()=>take(a,"t5","wait"),/Duplicate/);
 assert.throws(()=>take(a,"t6","invent"),/Unsupported/);
 assert.throws(()=>take(a,"t6","investigate",{factId:"unknown"}),/Unknown fact/);
});
test("same seed, thoughtful and reckless decisions diverge with causal costs",()=>{
 const base=start();
 const calm=replayStrategy(base,[
  {id:"a",kind:"listen",actorId:"nikos"},
  {id:"b",kind:"prepare"},
  {id:"c",kind:"offer",actorId:"nikos",terms:{autonomy:3}}
 ]);
 const rash=replayStrategy(base,[
  {id:"a",kind:"publish"},
  {id:"b",kind:"offer",actorId:"nikos",terms:{credit:3}},
  {id:"c",kind:"commit"}
 ]);
 assert.ok(calm.resources.credibility>rash.resources.credibility);
 assert.ok(calm.actors.find(x=>x.id==="nikos").trust>rash.actors.find(x=>x.id==="nikos").trust);
 assert.equal(calm.result,"ongoing");
});
test("mass scenario integrity: 100 seeds across 3 worlds, no impossible support or negative resources",()=>{
 for(const scenario of Object.keys(SCENARIOS)){
  for(let seed=0;seed<100;seed++){
   let s=start(scenario,seed);
   const cfg=SCENARIOS[scenario];
   for(let turn=1;turn<=Math.min(cfg.deadline,6);turn++){
    s=take(s,"sim"+turn,turn%2===0?"prepare":"wait");
    assert.ok(s.resources.budget>=0);
    assert.ok(strategyPlayerView(s).support>=0);
    assert.ok(s.actors.every(a=>a.trust>=-5&&a.trust<=5));
   }
  }
 }
});
