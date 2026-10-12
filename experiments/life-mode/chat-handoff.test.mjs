import test from "node:test";
import assert from "node:assert/strict";
import {createSession,applySession} from "./kingmaker-session.mjs";
import {renderPlayerTurn,exportChatHandoff} from "./chat-handoff.mjs";
const start=()=>createSession({life:{id:"handoff-01",birthDate:"2010-04-12",startedAt:"2028-05-01",
 location:"Θεσσαλονίκη",cash:900},seed:17});
test("player turn is short natural Greek, includes footer and no private GM truth",()=>{
 const initial=start();
 const moved=applySession(initial,{id:"a",route:"life.action",action:{
  kind:"dream",goalId:"meaning",title:"Ζωή με νόημα"}}).session;
 const text=renderPlayerTurn(moved);
 assert.match(text,/Στόχοι:/);
 assert.match(text,/Ηλικία 18/);
 assert.match(text,/ελεύθερα/);
 assert.doesNotMatch(text,/rivalMoves|threshold|privateContext|outside_option/);
 assert.doesNotMatch(text,/seed/);
});
test("public handoff and private GM handoff have explicit different data boundaries",()=>{
 let s=start();
 s=applySession(s,{id:"a",route:"arc.begin",scenario:"local-reform"}).session;
 s=applySession(s,{id:"b",route:"arc.move",action:{kind:"listen",actorId:"eleni"}}).session;
 const publicExport=exportChatHandoff(s);
 const gmExport=exportChatHandoff(s,{privateForTrustedDirector:true});
 assert.match(publicExport,/KINGMAKER/);
 assert.match(publicExport,/Player-observable state/);
 assert.match(publicExport,/PUBLIC export intentionally omits/);
 assert.doesNotMatch(publicExport,/"save":|"seed":|"threshold":|"actorMotives":/);
 assert.match(gmExport,/INTERNAL/);
 assert.match(gmExport,/"save":/);
 assert.match(gmExport,/"actorMotives":/);
 assert.match(renderPlayerTurn(s),/Ενεργό στρατηγικό επεισόδιο/);
});
