import test,{beforeEach} from "node:test";
import assert from "node:assert/strict";
import {scenes} from "../src/content.js";
import {fresh,load,save,reset,scene,progress,commit,readMsg,quality} from "../src/engine.js";
const values=new Map();
globalThis.localStorage={
  getItem:k=>values.has(k)?values.get(k):null,
  setItem:(k,v)=>values.set(k,String(v)),
  removeItem:k=>values.delete(k),
  clear:()=>values.clear()
};
beforeEach(()=>values.clear());
const choices=s=>{
  const current=scene(s);
  assert.ok(current,"Missing scene index "+s.i);
  const items=typeof current.choices==="function"?current.choices(s):current.choices;
  assert.ok(items.length>=2,current.id+" no choices");
  return items;
};

test("fresh → commit → storage restore preserves effects, history and progress",()=>{
  let state=fresh();
  assert.equal(state.i,0);
  assert.equal(progress(state),0);
  assert.equal(quality(state).label,"—");
  const option=choices(state)[1];
  state=commit(state,option);
  assert.equal(state.i,1);
  assert.equal(state.history.length,1);
  assert.equal(state.history[0].choice,option.id);
  assert.ok(quality(state).v>0);
  assert.deepEqual(load(),state);
  assert.ok(progress(state)>0);
});
test("three opening decisions yield distinct state and replayable save snapshots",()=>{
  const variants=choices(fresh()).map(option=>{
    values.clear();
    const a=commit(fresh(),option);
    const b=load();
    assert.deepEqual(a,b);
    return {flag:a.flags.OPENING_COUNT,delta:a.player.credibility,choice:a.history[0].choice};
  });
  assert.equal(new Set(variants.map(x=>x.flag)).size,3);
  assert.equal(new Set(variants.map(x=>x.choice)).size,3);
});
test("one complete deterministic route reaches Act I ending and delivers callbacks",()=>{
  let state=fresh();
  const first=choices(state)[1];
  state=commit(state,first);
  for(let i=1;i<scenes.length;i++)state=commit(state,choices(state)[0]);
  assert.equal(state.i,18);
  assert.equal(state.finished,true);
  assert.equal(scene(state),null);
  assert.equal(progress(state),100);
  assert.equal(state.history.length,18);
  assert.deepEqual(load(),state);
  assert.ok(state.inbox.some(msg=>String(msg.id).startsWith("cb_")),"Opening callback did not fire");
});
test("legacy v0.2 save recovers, reset and read-message round trip",()=>{
  const old=fresh();old.version="0.2";
  delete old.routes;delete old.institutions;
  values.set("kingmaker_statecraft_v02",JSON.stringify(old));
  const migrated=load();
  assert.equal(migrated.version,"0.3");
  assert.ok(migrated.routes.reform_accord!==undefined);
  assert.equal(JSON.parse(values.get("kingmaker_statecraft_v03")).version,"0.3");
  const id=migrated.inbox[0].id;
  const updated=readMsg(migrated,id);
  assert.equal(updated.inbox.find(x=>x.id===id).unread,false);
  assert.equal(load().inbox.find(x=>x.id===id).unread,false);
  assert.deepEqual(reset(),fresh());
});
test("malformed stored JSON does not crash boot",()=>{
  values.set("kingmaker_statecraft_v03","{bad-json");
  assert.deepEqual(load(),fresh());
});
