import test from "node:test";
import assert from "node:assert/strict";
import {scenes,inboxSeed} from "../src/content.js";
import {fresh,commit} from "../src/engine.js";
import {knownPeople} from "../src/reveal-map.js";

globalThis.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const bodyOf=(s,state)=>typeof s.body==="function"?s.body(state):s.body;
const choiceOf=(s,state)=>typeof s.choices==="function"?s.choices(state):s.choices;

test("the new opening is an anonymous human mystery, not a 25-person roster",()=>{
  const opening=scenes[0],text=bodyOf(opening,fresh()).join(" ");
  assert.equal(opening.id,"C01_S01");
  assert.deepEqual(opening.actors,["lea_marin","mara_eltan"]);
  assert.match(text,/άγνωστη φωνή/);
  assert.match(text,/119/);
  assert.match(text,/122/);
  assert.doesNotMatch(text,/Νίκο|Niko|Σίλας|Silas|Άντριαν|Mira/);
  assert.ok(inboxSeed.some(m=>m.from==="Άγνωστος αριθμός"));
});

test("cast dossiers and network unlock only after introductions",()=>{
  assert.deepEqual(knownPeople(0),["lea_marin","mara_eltan"]);
  assert.ok(!knownPeople(2).includes("niko_arven"));
  assert.ok(knownPeople(3).includes("niko_arven"));
  assert.ok(!knownPeople(3).includes("silas_koren"));
  assert.ok(knownPeople(13).includes("silas_koren"));
  assert.equal(new Set(knownPeople(18)).size,14);
});

test("opening decisions preserve existing flags and personalize the presidential scene",()=>{
  for(const openingChoice of choiceOf(scenes[0],fresh())){
    let state=commit(fresh(),openingChoice);
    state=commit(state,choiceOf(scenes[1],state)[0]);
    assert.equal(state.i,2);
    const briefing=bodyOf(scenes[2],state).join(" ");
    assert.match(briefing,/Πρόεδρ/);
    assert.ok(briefing.includes("119")||briefing.includes("δεν έδωσες αριθμό"));
    assert.ok(["overstated","calibrated","withheld"].includes(state.flags.OPENING_COUNT));
    state=commit(state,choiceOf(scenes[2],state)[0]);
    const niko=bodyOf(scenes[3],state).join(" ");
    assert.match(niko,/Νίκο/);
    if(state.flags.OPENING_COUNT==="overstated")assert.match(niko,/βέβαιος/);
    if(state.flags.OPENING_COUNT==="calibrated")assert.match(niko,/δεδομένο/);
  }
});

test("three Chapter 2 government paths remain mechanically distinct",()=>{
  const scene=scenes.find(s=>s.id==="C02_S03"),choices=choiceOf(scene,fresh());
  assert.deepEqual(choices.map(c=>c.id),["a","b","c"]);
  assert.deepEqual(choices.map(c=>c.effects.flags.GOV_PATH),["reform_accord","reconstruction","civic_compact"]);
});

test("Chapter 1 and 2 have speakable choices and remain separate from private scores",()=>{
  const firstSix=scenes.slice(0,6);
  assert.equal(firstSix.length,6);
  for(const scene of firstSix){
    const options=choiceOf(scene,fresh());
    assert.equal(options.length,3);
    assert.ok(options.every(c=>c.title.trim().length>12));
    assert.ok(options.every(c=>typeof c.quality==="number"));
    assert.ok(scene.question.length>5);
  }
});
