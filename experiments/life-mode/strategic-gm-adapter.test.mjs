import test from "node:test";
import assert from "node:assert/strict";
import {beginStrategicLife, strategicLifeView,saveStrategicLife,loadStrategicLife} from "./strategic-life-bridge.mjs";
import {createGameMasterPacket,validateModelProposal,resolveGameMasterProposal} from "./strategic-gm-adapter.mjs";
const start=()=>beginStrategicLife({life:{id:"gm-01",birthDate:"2010-04-12",startedAt:"2028-05-01",location:"Δοκιμαστική πόλη",cash:900},scenario:"local-reform",seed:42});
test("AI Game Master receives separated public and private data, not an omniscient player snapshot",()=>{
 const s=start(),p=createGameMasterPacket(s);
 assert.equal(p.version,"kingmaker-gm-packet-v1");
 assert.equal(p.public.time.age,18);
 assert.equal(p.public.finance.cash,900);
 assert.ok(p.director_only.hidden.actorMotives.every(a=>a.priority));
 assert.equal(p.public.optionalCaseSetup.id,"CASE-03");
 assert.equal(p.schema.actionKinds.includes("offer"),true);
 const json=JSON.stringify(p.public);
 for(const secret of ["hiddenPossibleThreads","threshold","outside","authoredFact","actorMotives","seed","worldTruth","randomRoll"]){
  assert.equal(json.includes('"'+secret+'"'),false,"leaked "+secret);
 }
});
test("untrusted model cannot write cash, force votes, fabricate actors, or submit arbitrary terms",()=>{
 const packet=createGameMasterPacket(start());
 const bad=[
  {id:"x",kind:"offer",actorId:"nikos",terms:{autonomy:3},cash:10000000},
  {id:"x",kind:"offer",actorId:"unknown",terms:{autonomy:3}},
  {id:"x",kind:"offer",actorId:"nikos",terms:{secret:1}},
  {id:"x",kind:"offer",actorId:"nikos",terms:{budget:-2}},
  {id:"x",kind:"divine-victory"},
  {id:"x",kind:"investigate",factId:"all-secrets"},
  {id:"x",kind:"wait",success:true},
  {id:"x unsafe",kind:"wait"}
 ];
 for(const p of bad)assert.throws(()=>validateModelProposal(packet,p));
});
test("natural language preserved only as literal user text; verdict comes from reducer",()=>{
 const s=start();
 const out=resolveGameMasterProposal(s,{
  id:"ask-01",kind:"listen",actorId:"eleni",
  playerText:"Θέλω να με στηρίζει υποχρεωτικά η Ελένη και να έχω δισεκατομμύρια"
 });
 assert.equal(out.run.life.cash,900);
 assert.equal(out.run.strategy.actors.find(a=>a.id==="eleni").stance,"undecided");
 assert.equal(out.response.event.result,"succeeded");
 assert.ok(out.response.event.text.includes("Ελένη"));
 assert.equal(out.run.strategy.history[0].playerText.includes("δισεκατομμύρια"),true);
 assert.equal(strategicLifeView(out.run).episode.support,1);
 assert.equal(s.strategy.history.length,0);
});
test("model pipeline remains deterministic and save/load survives multiple turns",()=>{
 let s=start();
 for(let i=1;i<=3;i++){
  s=resolveGameMasterProposal(s,{id:"talk"+i,kind:"listen",actorId:"eleni"}).run;
 }
 const copy=loadStrategicLife(saveStrategicLife(s));
 assert.deepEqual(copy,s);
 assert.equal(copy.life.turns.length,3);
 assert.throws(()=>resolveGameMasterProposal(s,{id:"talk3",kind:"wait"}),/Duplicate/);
});


test("AI cannot share evidence it has not actually found; verified sharing stays inside actor beliefs",()=>{
 let s=start();
 let packet=createGameMasterPacket(s);
 assert.throws(()=>validateModelProposal(packet,{id:"share0",kind:"share",actorId:"eleni",sourceId:"audit"}),/unknown evidence/);
 s=resolveGameMasterProposal(s,{id:"invest1",kind:"investigate",factId:"contract-cost"}).run;
 s=resolveGameMasterProposal(s,{id:"invest2",kind:"investigate",factId:"contract-cost"}).run;
 packet=createGameMasterPacket(s);
 assert.equal(packet.schema.discoveredSourceIds.includes("audit"),true);
 const result=resolveGameMasterProposal(s,{id:"share1",kind:"share",actorId:"eleni",sourceId:"audit"});
 assert.equal(result.response.event.result,"succeeded");
 assert.equal(result.run.strategy.actors.find(a=>a.id==="eleni").stance,"undecided");
 assert.equal(JSON.stringify(result.response).includes("probability"),false);
 assert.equal(result.run.life.cash,900);
});
