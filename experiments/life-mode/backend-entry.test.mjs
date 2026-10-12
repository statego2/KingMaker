import test from "node:test";
import assert from "node:assert/strict";
import * as backend from "./backend/index.mjs";
import * as data from "./backend/content.mjs";
import * as engine from "./backend/engine.mjs";
import * as ai from "./backend/ai.mjs";
import {renderPlayerTurn,exportChatHandoff} from "./chat-handoff.mjs";

test("stable backend namespace exposes complete modules instead of requiring the AI to guess source paths",()=>{
 for(const fn of ["createSession","applySession","sessionPlayerView","sessionDirectorPacket",
  "saveSession","loadSession","sessionBootstrap","renderPlayerTurn","listBackendContent","verifyBackendCatalog"]){
  assert.equal(typeof backend[fn],"function","Missing backend."+fn);
 }
 for(const fn of ["validateMechanisms","validateStrategyCrosswalk","getPublicCase","strategicCaseKnowledgePack"]){
  assert.equal(typeof data[fn],"function","Missing content."+fn);
 }
 for(const fn of ["beginLife","act","beginStrategy","strategyTurn","beginSaga","sagaCommand","saveSaga"]){
  assert.equal(typeof engine[fn],"function","Missing engine."+fn);
 }
 for(const fn of ["createGameMasterPacket","validateModelProposal","buildDirectorBrief","sessionDirectorPacket"]){
  assert.equal(typeof ai[fn],"function","Missing ai."+fn);
 }
 assert.equal(data.STRATEGIC_MECHANISMS.length,36);
 assert.equal(data.STRATEGIC_CASEBOOK.length,12);
 assert.equal(data.STRATEGY_COMPETENCIES.length,60);
});

test("end-to-end AI-as-UI narrative uses the same reducer state after ordinary and strategic actions",()=>{
 let session=backend.createSession({life:{
  id:"entry-smoke",birthDate:"2010-04-12",startedAt:"2028-05-01",
  location:"Θεσσαλονίκη",cash:900
 },seed:41});
 session=backend.applySession(session,{id:"goal",route:"life.action",action:{
  kind:"dream",goalId:"kingmaker",title:"Χτίζω ουσιαστικές συμμαχίες"
 }}).session;
 session=backend.applySession(session,{id:"start",route:"arc.begin",scenario:"local-reform"}).session;
 session=backend.applySession(session,{id:"speak",route:"arc.move",action:{
  kind:"listen",actorId:"eleni",playerText:"Ζητώ να ακούσω την Ελένη"
 }}).session;
 const publicView=backend.sessionPlayerView(session);
 const hidden=backend.sessionDirectorPacket(session);
 assert.equal(publicView.age,18);
 assert.equal(publicView.date,"2028-05-08");
 assert.equal(publicView.cash,900);
 assert.equal(publicView.activeArc.turn,1);
 assert.equal(hidden.publicView.verdict.status,"succeeded");
 assert.equal(hidden.privateContext.activeStrategy.access,"GM_ONLY_NEVER_NARRATE_DIRECTLY");
 const narrator=renderPlayerTurn(session);
 assert.match(narrator,/Ελένη/);
 assert.match(narrator,/Στόχοι/);
 assert.doesNotMatch(narrator,/outside|threshold|privateContext/);
 assert.deepEqual(backend.loadSession(backend.saveSession(session)),session);
 assert.ok(exportChatHandoff(session).includes("KINGMAKER — Playtest Continuity"));
});
