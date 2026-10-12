import test from "node:test";
import assert from "node:assert/strict";
import {initializeGame,executeGameTurn,inspectGame} from "./stateless-connector.mjs";
const initial=seed=>initializeGame({life:{id:"stateless-"+seed,birthDate:"2010-04-12",startedAt:"2028-05-01",
 location:"Θεσσαλονίκη",cash:900},seed});
test("stateless connector can process multiple independent AI turns without a resident process",()=>{
 const a=initial(9);
 assert.equal(a.player.age,18);
 const b=executeGameTurn({privateSave:a.privateSave,command:{id:"dream",route:"life.action",action:{
  kind:"dream",goalId:"wealth",title:"Θέλω να γίνω δισεκατομμυριούχος"}}});
 assert.equal(b.player.goals[0].status,"pending");
 assert.equal(b.player.cash,900);
 const c=executeGameTurn({privateSave:b.privateSave,command:{id:"work",route:"life.action",action:{
  kind:"work",shifts:4}}});
 assert.equal(c.player.cash,1140);
 assert.equal(inspectGame({privateSave:c.privateSave}).player.cash,1140);
 assert.equal(inspectGame({privateSave:a.privateSave}).player.cash,900);
 assert.equal(Object.hasOwn(inspectGame({privateSave:c.privateSave}),"director"),false);
});
test("a trusted connector may request private strategic context independently of player view",()=>{
 const s=initial(17);
 const a=executeGameTurn({privateSave:s.privateSave,command:{id:"arc",route:"arc.begin",scenario:"local-reform"}});
 const view=inspectGame({privateSave:a.privateSave,intentText:"Πολιτική εξουσία και συνασπισμός",includeDirector:true});
 assert.equal(view.director.privateContext.optionalMaterialByPlayerIntent.candidates[0].id,"CASE-03");
 assert.equal(view.player.cash,900);
 assert.equal(JSON.stringify(view.player).includes('"threshold"'),false);
 assert.equal(view.director.commandContract.availableRoutes[0],"arc.move");
});
test("invalid commands or corrupted saves never produce modified output or persisted corruption",()=>{
 const s=initial(12);
 const bad={id:"attack",route:"life.action",action:{kind:"work",shifts:2,cash:1000000}};
 assert.throws(()=>executeGameTurn({privateSave:s.privateSave,command:bad}),/Unauthorized|Unexpected/);
 assert.equal(inspectGame({privateSave:s.privateSave}).player.cash,900);
 assert.throws(()=>executeGameTurn({privateSave:JSON.stringify({format:"wrong-save-format"})}),/Unsupported/);
 assert.throws(()=>inspectGame({privateSave:"not-json"}),/Invalid|Corrupt/);
 const cmd={id:"t1",route:"life.action",action:{kind:"work",shifts:1}};
 const one=executeGameTurn({privateSave:s.privateSave,command:cmd});
 assert.deepEqual(executeGameTurn({privateSave:s.privateSave,command:cmd}),one);
 assert.throws(()=>executeGameTurn({privateSave:one.privateSave,command:cmd}),/Duplicate/);
});
test("100 seeded stateless life journeys keep cash nonnegative and consistently replay",()=>{
 for(let seed=0;seed<100;seed++){
  let state=initial(seed);
  const commands=[
   {id:"g",route:"life.action",action:{kind:"dream",goalId:"growth",title:"Κατανόηση κόσμου"}},
   {id:"open",route:"arc.begin",scenario:"civic-network"},
   {id:"talk",route:"arc.move",action:{kind:"listen",actorId:"anna"}},
   {id:"exit",route:"arc.move",action:{kind:"withdraw"}},
   {id:"close",route:"arc.close"},
   {id:"work",route:"life.action",action:{kind:"work",shifts:4}}
  ];
  for(const command of commands)state=executeGameTurn({privateSave:state.privateSave,command});
  assert.equal(state.player.cash,1140);
  assert.equal(state.player.completedArcs.length,1);
  assert.equal(state.player.goals[0].status,"pending");
  assert.deepEqual(inspectGame({privateSave:state.privateSave}).player,state.player);
 }
});
