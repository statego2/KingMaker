import test from "node:test";
import assert from "node:assert/strict";
import {scenes,people} from "../src/content.js";
import {presentation,meta,sceneVisual} from "../src/redesign-scenes.js";
import {resolveScenePresentation,validateScenePresentation,SCENE_MODES} from "../src/scene-contract.js";
import {fresh} from "../src/engine.js";

test("all 18 legacy scenes normalize into version 1 contract with stable visual modes",()=>{
  for(const s of scenes){
    const {valid,issues,contract}=validateScenePresentation(s,{presentation,people});
    assert.equal(valid,true,s.id+": "+issues.join("; "));
    assert.equal(contract.version,"1.0");
    assert.equal(contract.id,s.id);
    assert.ok(SCENE_MODES.includes(contract.mode));
    assert.equal(contract.mode,meta(s).mode);
    assert.equal(contract.place,meta(s).place);
    assert.equal(contract.label,meta(s).label);
    assert.deepEqual(contract.actors,s.actors||[]);
    assert.equal(contract.art.status,"procedural_fallback");
    assert.deepEqual(contract.sourceRefs,[],"Legacy facts do not prove source provenance");
    const state=fresh(),body=typeof s.body==="function"?s.body(state):s.body,evidence=typeof s.evidence==="function"?s.evidence(state):s.evidence;
    assert.ok(sceneVisual(s,body,evidence).length>40);
  }
});
test("unknown mode, missing scene ID, unknown actor and missing art all fail softly",()=>{
  const problematic={id:"FUTURE_001",actors:["ghost","lea_marin"],body:["Test"],evidence:[],question:"?",title:"Test"};
  const resolved=resolveScenePresentation(problematic,{presentation:{FUTURE_001:["hologram","",""]},people});
  assert.equal(resolved.mode,"briefing");
  assert.equal(resolved.place,"VELIS");
  assert.equal(resolved.label,"DECISION BRIEF");
  assert.deepEqual(resolved.actors,["lea_marin"]);
  assert.equal(resolved.art.id,null);
  assert.equal(resolved.sourceRefs.length,0);
  assert.ok(resolved.issues.some(x=>x.includes("Unknown scene mode")));
  assert.ok(resolved.issues.some(x=>x.includes("Unknown actor")));
  assert.equal(validateScenePresentation({},{}).valid,false);
});
test("explicit attributed source IDs are preserved without deriving hidden truth",()=>{
  const item={id:"C01_S01",sources:[{id:"SRC_123",kind:"document",provenance:"archive"}],pressure:"government_pressure",art:{id:"VELIS_OFFICE_DAWN"}};
  const c=resolveScenePresentation(item,{presentation,people});
  assert.equal(c.sourceRefs[0].id,"SRC_123");
  assert.equal(c.sourceRefs[0].provenance,"archive");
  assert.equal(c.pressure,"government_pressure");
  assert.equal(c.art.id,"VELIS_OFFICE_DAWN");
  assert.deepEqual(c.issues,[]);
});
