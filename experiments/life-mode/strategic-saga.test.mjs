import test from "node:test";
import assert from "node:assert/strict";
import {beginSaga,sagaCommand,replaySaga,sagaPlayerView,saveSaga,loadSaga} from "./strategic-saga.mjs";
const fresh=seed=>beginSaga({life:{id:"saga-"+seed,birthDate:"2010-04-12",startedAt:"2028-05-01",location:"Πειραματική πόλη",cash:850},seed});
const apply=(s,id,kind,params={})=>sagaCommand(s,{id,kind,...params});
test("multiple strategic chapters share one true Life Mode timeline, resources and age",()=>{
 let s=fresh(19);
 s=apply(s,"a","begin",{scenario:"local-reform"});
 s=apply(s,"b","move",{action:{kind:"listen",actorId:"eleni"}});
 s=apply(s,"c","move",{action:{kind:"withdraw"}});
 s=apply(s,"d","close");
 assert.equal(s.episodes.length,1);
 assert.equal(s.episodes[0].result,"withdrawn");
 assert.equal(s.active,null);
 assert.equal(sagaPlayerView(s).cash,850);
 s=apply(s,"e","advance",{days:365});
 const secondStart=sagaPlayerView(s).date;
 s=apply(s,"f","begin",{scenario:"venture-alliance"});
 assert.equal(s.active.index,2);
 assert.equal(sagaPlayerView(s).date,secondStart);
 assert.equal(sagaPlayerView(s).active.turn,0);
 assert.equal(sagaPlayerView(s).previousEpisodes.length,1);
 assert.equal(s.life.turns.length,3);
 assert.equal(s.life.goals.length,0);
});
test("returning NPC remembers prior relationship, but old votes and promises do not teleport into a new episode",()=>{
 let s=fresh(8);
 s=apply(s,"b","begin",{scenario:"local-reform"});
 s=apply(s,"c","move",{action:{kind:"listen",actorId:"eleni"}});
 const formerTrust=s.active.strategy.actors.find(a=>a.id==="eleni").trust;
 s=apply(s,"d","move",{action:{kind:"withdraw"}});
 s=apply(s,"e","close");
 s=apply(s,"f","advance",{days:700});
 s=apply(s,"g","begin",{scenario:"local-reform"});
 const returning=s.active.strategy.actors.find(a=>a.id==="eleni");
 assert.equal(returning.trust,formerTrust);
 assert.equal(returning.stance,"undecided");
 assert.equal(s.active.strategy.commitments.length,0);
 assert.ok(returning.memory.some(e=>e.type==="remembered-past-episode"));
 assert.equal(sagaPlayerView(s).active.support,1);
});
test("concurrent unresolved campaigns and unsupported commands are rejected",()=>{
 const s=apply(fresh(11),"a","begin",{scenario:"local-reform"});
 assert.throws(()=>apply(s,"b","begin",{scenario:"venture-alliance"}),/Finish or withdraw/);
 assert.throws(()=>apply(s,"c","close"),/Cannot archive unresolved/);
 assert.throws(()=>apply(s,"a","move",{action:{kind:"wait"}}),/Duplicate/);
 assert.throws(()=>apply(s,"d","advance",{days:10}),/Resolve the active arc/);
 assert.throws(()=>apply(s,"d","magic"),/Unsupported saga/);
});
test("versioned saga replay rejects unearned riches and preserves deterministic episode boundaries",()=>{
 const input=[
  {id:"a",kind:"begin",scenario:"local-reform"},
  {id:"b",kind:"move",action:{kind:"listen",actorId:"eleni"}},
  {id:"c",kind:"move",action:{kind:"withdraw"}},
  {id:"d",kind:"close"},
  {id:"e",kind:"advance",days:50},
  {id:"f",kind:"begin",scenario:"civic-network"},
  {id:"g",kind:"move",action:{kind:"wait"}}
 ];
 const s=replaySaga(fresh(5),input);
 assert.deepEqual(loadSaga(saveSaga(s)),s);
 assert.equal(sagaPlayerView(s).previousEpisodes[0].scenario,"local-reform");
 assert.equal(sagaPlayerView(s).active.scenario,"civic-network");
 const forged=structuredClone(s);
 forged.life.cash+=1_000_000;
 assert.throws(()=>saveSaga(forged),/modified outside/);
 assert.throws(()=>loadSaga("{bad"),/Corrupt/);
 const payload=JSON.parse(saveSaga(s));
 assert.throws(()=>loadSaga(JSON.stringify({...payload,format:"unknown"})),/Unsupported/);
 assert.throws(()=>loadSaga(JSON.stringify({...payload,commands:[...input,input[0]]})),/Duplicate/);
});
test("50 different synthetic lifetimes stay independent through two strategic arcs",()=>{
 for(let seed=0;seed<50;seed++){
  const input=[
   {id:"a",kind:"begin",scenario:"local-reform"},
   {id:"b",kind:"move",action:{kind:"listen",actorId:"eleni"}},
   {id:"c",kind:"move",action:{kind:"withdraw"}},
   {id:"d",kind:"close"},
   {id:"e",kind:"advance",days:730},
   {id:"f",kind:"begin",scenario:"venture-alliance"},
   {id:"g",kind:"move",action:{kind:"listen",actorId:"sofia"}},
   {id:"h",kind:"move",action:{kind:"withdraw"}},
   {id:"i",kind:"close"}
  ];
  const s=replaySaga(fresh(seed),input),v=sagaPlayerView(s);
  assert.equal(v.previousEpisodes.length,2);
  assert.equal(v.cash,850);
  assert.equal(v.debt,0);
  assert.equal(s.life.turns.length,5);
  assert.ok(v.age>=20);
  assert.deepEqual(loadSaga(saveSaga(s)),s);
 }
});


test("a source-informed NPC retains fading beliefs across separate years but never inherited votes",()=>{
 let s=fresh(33);
 s=apply(s,"begin1","begin",{scenario:"local-reform"});
 s=apply(s,"research1","move",{action:{kind:"investigate",factId:"contract-cost"}});
 s=apply(s,"research2","move",{action:{kind:"investigate",factId:"contract-cost"}});
 s=apply(s,"share1","move",{action:{kind:"share",actorId:"eleni",sourceId:"audit"}});
 const beliefBefore=s.active.strategy.actors.find(x=>x.id==="eleni").belief;
 assert.ok(beliefBefore.confidence>0.1);
 s=apply(s,"quit1","move",{action:{kind:"withdraw"}});
 s=apply(s,"close1","close");
 s=apply(s,"pass","advance",{days:730});
 s=apply(s,"begin2","begin",{scenario:"local-reform"});
 const actor=s.active.strategy.actors.find(x=>x.id==="eleni");
 assert.ok(actor.belief.confidence>=0.1);
 assert.ok(actor.belief.confidence<beliefBefore.confidence);
 assert.equal(actor.belief.heardGroups.includes("audit"),true);
 assert.equal(actor.stance,"undecided");
 assert.deepEqual(loadSaga(saveSaga(s)),s);
});
