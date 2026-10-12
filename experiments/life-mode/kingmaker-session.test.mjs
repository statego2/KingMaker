import test from "node:test";
import assert from "node:assert/strict";
import {
 createSession,applySession,sessionPlayerView,sessionDirectorPacket,
 saveSession,loadSession,sessionBootstrap,CHAT_PROTOCOL_VERSION
} from "./kingmaker-session.mjs";
import {verifyBackendCatalog} from "./backend-catalog.mjs";

const newGame=(seed=14)=>createSession({life:{
 id:"ui-"+seed,birthDate:"2010-04-12",startedAt:"2028-05-01",
 location:"Θεσσαλονίκη",cash:900,debt:0
},seed});
const issue=(s,id,route,extra={})=>applySession(s,{id,route,...extra}).session;

test("catalog is an honest single entry for all modules, not a claim that 12 case seeds are executable",()=>{
 const report=verifyBackendCatalog();
 assert.equal(report.valid,true,report.errors.join(", "));
 assert.equal(report.executableScenarios,3);
 assert.equal(report.authoredCases,12);
 assert.equal(report.authoredMechanisms,36);
 assert.equal(report.originalQuestionMappings,0);
 const boot=sessionBootstrap();
 assert.equal(boot.protocol,CHAT_PROTOCOL_VERSION);
 assert.equal(boot.backend.executableWorlds.length,3);
 assert.equal(boot.backend.authoredStories.length,12);
});

test("chat-only initial session has one safe public state and a separate GM packet",()=>{
 const s=newGame(),v=sessionPlayerView(s),gm=sessionDirectorPacket(s);
 assert.equal(v.age,18);
 assert.equal(v.cash,900);
 assert.equal(v.verdict.status,"intro");
 assert.equal(v.activeArc,null);
 assert.match(v.footer,/Μετρητά/);
 assert.match(v.nextPrompt,/ελεύθερα/);
 assert.equal(gm.access,"GM_INTERNAL_DO_NOT_NARRATE");
 assert.equal(gm.privateContext.activeStrategy,null);
 assert.ok(gm.commandContract.lifeActionKinds.includes("dream"));
 assert.deepEqual(s.world.commands,[]);
});

test("free-form life plans become real ledger entries and cannot create a large fortune by wishing",()=>{
 const before=newGame();
 const wished=issue(before,"p1","life.action",{action:{kind:"dream",goalId:"wealth",title:"Θέλω δισεκατομμύριο",
  playerText:"Θέλω να έχω €1 δις αύριο."}});
 assert.equal(sessionPlayerView(wished).cash,900);
 assert.equal(sessionPlayerView(wished).goals[0].status,"pending");
 const plan=issue(wished,"p2","life.action",{action:{kind:"plan",goalId:"wealth",planId:"business",title:"Χτίζω εταιρεία"}});
 const failed=issue(plan,"p3","life.action",{action:{kind:"launch",planId:"business",budget:100000}});
 assert.equal(sessionPlayerView(failed).verdict.status,"failed");
 assert.equal(sessionPlayerView(failed).cash,900);
 assert.equal(before.world.life.goals.length,0);
});

test("two life mechanisms and a strategic episode use exactly one authoritative life timeline",()=>{
 let s=newGame();
 s=issue(s,"one","life.action",{action:{kind:"dream",goalId:"help",title:"Να βοηθήσω την πόλη"}});
 s=issue(s,"two","life.action",{action:{kind:"plan",goalId:"help",planId:"community",title:"Τοπική κοινότητα"}});
 s=issue(s,"three","arc.begin",{scenario:"local-reform"});
 assert.equal(sessionPlayerView(s).activeArc.turn,0);
 s=issue(s,"four","arc.move",{action:{kind:"listen",actorId:"eleni",playerText:"Ακούω την Ελένη"}});
 const p=sessionPlayerView(s);
 assert.equal(p.date,"2028-05-08");
 assert.equal(p.cash,900);
 assert.match(p.verdict.scene,/Ελένη/);
 assert.equal(p.activeArc.turn,1);
 assert.equal(p.goals.length,1);
 assert.equal(p.plans.length,1);
 s=issue(s,"five","arc.move",{action:{kind:"withdraw"}});
 s=issue(s,"six","arc.close");
 assert.equal(sessionPlayerView(s).completedArcs.length,1);
 s=issue(s,"seven","life.action",{action:{kind:"work",shifts:5}});
 assert.equal(sessionPlayerView(s).cash,1200);
 assert.equal(sessionPlayerView(s).date,"2028-05-20");
 assert.equal(s.world.life.turns.length,5);
});

test("model cannot write cash, hidden odds, agreements, time, people, or reroll through extra fields",()=>{
 const s=newGame();
 const bad=[
  {id:"x",route:"life.action",action:{kind:"work",shifts:1,cash:999999}},
  {id:"x",route:"life.action",action:{kind:"dream",goalId:"x",title:"x",status:"succeeded"}},
  {id:"x",route:"life.action",action:{kind:"work",shifts:2,id:"another"}},
  {id:"x",route:"life.action",action:{kind:"launch",budget:100,planId:"z",success:true}},
  {id:"x",route:"arc.begin",scenario:"forged-world"},
  {id:"x",route:"time.advance",days:0},
  {id:"x",route:"unknown",action:{}},
  {id:"unsafe id",route:"time.advance",days:1}
 ];
 for(const cmd of bad)assert.throws(()=>applySession(s,cmd));
 const inArc=issue(s,"a","arc.begin",{scenario:"local-reform"});
 const forbidden=[
  {id:"bad1",route:"arc.move",action:{kind:"listen",actorId:"eleni",trust:100}},
  {id:"bad2",route:"arc.move",action:{kind:"offer",actorId:"eleni",terms:{transparency:3},outcome:"succeeded"}},
  {id:"bad3",route:"arc.move",action:{kind:"share",actorId:"eleni",sourceId:"audit"}},
  {id:"bad4",route:"life.action",action:{kind:"work",shifts:20}}
 ];
 for(const cmd of forbidden)assert.throws(()=>applySession(inArc,cmd));
});

test("same action ID cannot resolve twice; source-sharing requires actual prior discovery",()=>{
 let s=issue(newGame(),"start","arc.begin",{scenario:"local-reform"});
 s=issue(s,"a","arc.move",{action:{kind:"investigate",factId:"contract-cost"}});
 s=issue(s,"b","arc.move",{action:{kind:"investigate",factId:"contract-cost"}});
 const p=applySession(s,{id:"c",route:"arc.move",action:{kind:"share",actorId:"eleni",sourceId:"audit"}});
 s=p.session;
 assert.equal(p.player.verdict.status,"succeeded");
 assert.equal(s.world.active.strategy.actors.find(a=>a.id==="eleni").stance,"undecided");
 assert.equal(JSON.stringify(p.player).includes('"probability"'),false);
 assert.throws(()=>applySession(s,{id:"c",route:"arc.move",action:{kind:"listen",actorId:"eleni"}}),/Duplicate/);
});

test("GM private data cannot leak through player projection even after autonomous opponent move",()=>{
 let s=issue(newGame(),"open","arc.begin",{scenario:"venture-alliance"});
 for(let i=1;i<=3;i++)s=issue(s,"w"+i,"arc.move",{action:{kind:"wait"}});
 const player=sessionPlayerView(s),gm=sessionDirectorPacket(s);
 assert.ok(gm.privateContext.activeStrategy.hidden.actorMotives.length>0);
 assert.ok(gm.privateContext.relevantKnowledge.patterns.length>=3);
 const visible=JSON.stringify(player);
 for(const secret of ['"seed"','"threshold"','"outside"','"priority"','"authoredFact"','"hiddenEvents"','"privateContext"']){
  assert.equal(visible.includes(secret),false,secret);
 }
 assert.ok(gm.privateContext.lastStructuredActions.length>=1);
 assert.equal(gm.publicView.verdict.status,player.verdict.status);
});

test("session save/load replays actions, rejects modified state, and never serializes a trusted snapshot",()=>{
 let s=issue(newGame(),"one","life.action",{action:{kind:"work",shifts:2}});
 s=issue(s,"two","arc.begin",{scenario:"civic-network"});
 s=issue(s,"three","arc.move",{action:{kind:"listen",actorId:"anna"}});
 const encoded=saveSession(s);
 const loaded=loadSession(encoded);
 assert.deepEqual(loaded,s);
 assert.equal(JSON.parse(encoded).format,CHAT_PROTOCOL_VERSION);
 assert.equal(Object.hasOwn(JSON.parse(encoded),"cash"),false);
 const forged=structuredClone(s);
 forged.world.life.cash=99_000_000;
 assert.throws(()=>saveSession(forged),/modified outside/);
 assert.throws(()=>loadSession("oops"),/Corrupt/);
 assert.throws(()=>loadSession(JSON.stringify({format:"unknown",saga:"{}"})),/Unsupported/);
});

test("150 seeded chat sessions survive life start/arc/refusal/time/close without negative balances",()=>{
 for(let seed=0;seed<150;seed++){
  let s=newGame(seed);
  s=issue(s,"dream","life.action",{action:{kind:"dream",goalId:"life",title:"Να εξελιχθώ"}});
  s=issue(s,"open","arc.begin",{scenario:seed%2?"local-reform":"civic-network"});
  s=issue(s,"move1","arc.move",{action:{kind:"listen",actorId:seed%2?"eleni":"anna"}});
  s=issue(s,"move2","arc.move",{action:{kind:"withdraw"}});
  s=issue(s,"close","arc.close");
  s=issue(s,"time","time.advance",{days:365});
  const view=sessionPlayerView(s);
  assert.equal(view.age,19);
  assert.equal(view.completedArcs.length,1);
  assert.ok(view.cash>=0);
  assert.deepEqual(loadSession(saveSession(s)),s);
 }
});
