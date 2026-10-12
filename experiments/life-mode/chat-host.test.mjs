import test from "node:test";
import assert from "node:assert/strict";
import {createLocalHost} from "./chat-host.mjs";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const modulePath=fileURLToPath(new URL("./chat-host.mjs",import.meta.url));

test("public-only AI host gives narrative state, not private saves, seed, actor agenda or GM notes",()=>{
 const host=createLocalHost();
 const intro=host.request({op:"start"});
 assert.equal(intro.ok,true);
 assert.equal(intro.player.age,18);
 assert.equal(Object.hasOwn(intro,"save"),false);
 assert.equal(Object.hasOwn(intro,"director"),false);
 const moved=host.request({op:"step",command:{
  id:"t1",route:"life.action",action:{kind:"dream",goalId:"meaning",title:"Να ζήσω με νόημα"}
 }});
 assert.equal(moved.ok,true);
 assert.equal(moved.player.goals[0].status,"pending");
 assert.equal(moved.receipt.worldTurnCount,1);
 const json=JSON.stringify(moved);
 for(const k of ['"seed"','"threshold"','"outside"','"privateContext"']){
  assert.equal(json.includes(k),false,k);
 }
 assert.equal(typeof host.snapshot(),"string");
});

test("trusted transport can resume exactly from a save, while director notes are separately gated",()=>{
 const host=createLocalHost({transport:true,director:true});
 const start=host.request({op:"start"});
 const first=host.request({op:"step",command:{id:"start-arc",route:"arc.begin",scenario:"local-reform"}});
 assert.equal(first.director.privateContext.activeStrategy.world.title.includes("συμβούλιο"),true);
 const turn=host.request({op:"step",command:{
  id:"talk",route:"arc.move",action:{kind:"listen",actorId:"eleni"}
 }});
 assert.equal(turn.player.verdict.status,"succeeded");
 const restored=createLocalHost({transport:true});
 const loaded=restored.request({op:"restore",save:turn.save});
 assert.deepEqual(loaded.player,turn.player);
 assert.equal(loaded.save,turn.save);
 assert.equal(Object.hasOwn(loaded,"director"),false);
 assert.equal(start.player.age,18);
});

test("host rejects wrong commands atomically and does not mutate state on failure",()=>{
 const host=createLocalHost({transport:true});
 assert.throws(()=>host.request({op:"step",command:{}}),/No active session/);
 host.request({op:"start"});
 const before=host.snapshot();
 const attacks=[
  {op:"step",command:{id:"a",route:"life.action",action:{kind:"work",shifts:5,cash:99999}}},
  {op:"step",command:{id:"a",route:"arc.move",action:{kind:"listen",actorId:"eleni"}}},
  {op:"step",command:{id:"a",route:"time.advance",days:-1}},
  {op:"restore",save:"not-json"},
  {op:"state",command:{id:"foo"}},
  {op:"unknown"},
  {op:"start",cash:99999}
 ];
 for(const request of attacks){
  assert.throws(()=>host.request(request));
  assert.equal(host.snapshot(),before);
 }
 const okay=host.request({op:"step",command:{id:"a",route:"life.action",action:{kind:"work",shifts:1}}});
 assert.equal(okay.player.cash,960);
});

test("real newline JSON command stream is deterministic and produces machine-readable lines",()=>{
 const lines=[
  JSON.stringify({op:"catalog"}),
  JSON.stringify({op:"start"}),
  JSON.stringify({op:"step",command:{id:"a",route:"life.action",action:{
   kind:"dream",goalId:"learning",title:"Μελέτη και κατανόηση"}}}),
  JSON.stringify({op:"state"}),
  JSON.stringify({op:"step",command:{id:"a",route:"life.action",action:{kind:"work",shifts:1}}}),
  "{not json}"
 ].join("\n")+"\n";
 const args=[modulePath];
 const out=execFileSync(process.execPath,args,{input:lines,encoding:"utf8",timeout:15000});
 const events=out.trim().split("\n").map(s=>JSON.parse(s));
 assert.equal(events.length,6);
 assert.equal(events[0].catalog.backend.executableWorlds.length,3);
 assert.equal(events[1].player.age,18);
 assert.equal(events[2].player.goals.length,1);
 assert.equal(events[3].player.cash,900);
 assert.equal(events[4].ok,false);
 assert.match(events[4].error,/Duplicate/);
 assert.equal(events[5].ok,false);
 assert.equal(Object.hasOwn(events[2],"director"),false);
});
