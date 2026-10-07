import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { scenes, people, inboxSeed } from "../src/content.js";
import { fresh } from "../src/engine.js";
import { presentation, meta, sceneVisual } from "../src/redesign-scenes.js";

const evaluate=(field,state)=>typeof field==="function"?field(state):field;
test("Act I exports exactly 18 uniquely named, ordered scenes with visual mappings",()=>{
  const expected=Array.from({length:6},(_,ch)=>Array.from({length:3},(_,n)=>`C${String(ch+1).padStart(2,"0")}_S${String(n+1).padStart(2,"0")}`)).flat();
  assert.deepEqual(scenes.map(s=>s.id),expected);
  assert.equal(new Set(scenes.map(s=>s.id)).size,18);
  assert.deepEqual(Object.keys(presentation).sort(),expected.slice().sort());
  assert.equal(Object.keys(inboxSeed.reduce((x,y)=>(x[y.id]=true,x),{})).length,inboxSeed.length);
});
test("every imported scene resolves to playable choices, evidence and a meaningful visual",()=>{
  const state=fresh();
  for(const s of scenes){
    const label=s.id;
    assert.ok(s.title&&s.chapterTitle&&s.question,label+" missing text");
    assert.equal(Number(s.chapter),Number(label.slice(1,3)),label+" chapter");
    assert.ok(["briefing","character","document","phone","map","media","warroom","timeline","dawn"].includes(meta(s).mode),label+" mode");
    const body=evaluate(s.body,state);
    const facts=evaluate(s.evidence,state);
    const choices=evaluate(s.choices,state);
    assert.ok(Array.isArray(body)&&body.length,label+" body");
    assert.ok(Array.isArray(facts),label+" evidence");
    assert.ok(Array.isArray(choices)&&choices.length>=2,label+" choices");
    const ids=new Set();
    for(const o of choices){
      assert.ok(o.id&&o.verb&&o.title&&o.result,label+" choice copy");
      assert.ok(!ids.has(o.id),label+" duplicate choice "+o.id);
      ids.add(o.id);
      assert.ok(Number.isFinite(o.quality)&&o.quality>=0&&o.quality<=1,label+" private quality");
      assert.ok(o.effects&&typeof o.effects==="object",label+" choice effects");
    }
    for(const id of s.actors||[])assert.ok(people[id],label+" actor "+id);
    for(const f of facts)assert.ok(f.label&&f.value!==undefined,label+" malformed fact");
    assert.ok(sceneVisual(s,body,facts).length>40,label+" empty prop");
  }
});
test("the decision screen does not display hidden option quality before committing",()=>{
  const source=readFileSync(new URL("../src/app-redesign.js",import.meta.url),"utf8");
  const current=source.slice(source.indexOf("function renderScene(){"),source.indexOf("\nfunction choice("));
  assert.ok(current.startsWith("function renderScene(){"));
  assert.doesNotMatch(current,/\bquality\s*\(/);
  assert.doesNotMatch(current,/\bdebrief\b/);
});
