import test from "node:test";
import assert from "node:assert/strict";
import {AI_ACTION_SCHEMA,AI_TOOL_CONTRACT,verifyAiToolContract} from "./ai-tool-contract.mjs";
import {createLocalHost} from "./chat-host.mjs";
import {createSession,sessionDirectorPacket,sessionBootstrap,applySession} from "./kingmaker-session.mjs";

test("portable AI tool schema matches live allowlisted route names and field restrictions",()=>{
 const report=verifyAiToolContract();
 assert.equal(report.valid,true);
 assert.equal(report.routes,5);
 assert.deepEqual(AI_ACTION_SCHEMA.properties.route.enum,
  ["life.action","arc.begin","arc.move","arc.close","time.advance"]);
 assert.equal(AI_ACTION_SCHEMA.additionalProperties,false);
 assert.equal(AI_ACTION_SCHEMA.properties.action.additionalProperties,false);
 assert.equal(AI_TOOL_CONTRACT.tool.name,"kingmaker_step");
});
test("host exposes schema without creating a game, and the director gets the same contract",()=>{
 const host=createLocalHost();
 const packet=host.request({op:"contract"});
 assert.equal(packet.ok,true);
 assert.equal(packet.contract.tool.name,"kingmaker_step");
 assert.equal(Object.hasOwn(packet,"save"),false);
 assert.equal(sessionBootstrap().toolContract.tool.name,packet.contract.tool.name);
 const s=createSession({life:{
  id:"contract",birthDate:"2010-04-12",startedAt:"2028-05-01",
  location:"Θεσσαλονίκη",cash:900
 },seed:1});
 assert.deepEqual(sessionDirectorPacket(s).commandContract.modelTool,packet.contract.tool);
});
test("one validated model-tool argument produces an engine-reconciled outcome, not guessed success",()=>{
 const start=createSession({life:{
  id:"arg",birthDate:"2010-04-12",startedAt:"2028-05-01",
  location:"Θεσσαλονίκη",cash:900
 },seed:2});
 const input={id:"dream1",route:"life.action",action:{kind:"dream",goalId:"wealth",title:"Ένα δισεκατομμύριο"}};
 const result=applySession(start,input);
 assert.equal(result.player.cash,900);
 assert.equal(result.player.goals[0].status,"pending");
 assert.equal(result.receipt.canonicalKind,"life");
});
