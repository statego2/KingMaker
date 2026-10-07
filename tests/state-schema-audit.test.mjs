import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fresh} from "../src/engine.js";
const map=JSON.parse(readFileSync(new URL("../data/state_migration_map_v0_3_to_v1.json",import.meta.url),"utf8"));
const schema=JSON.parse(readFileSync(new URL("../data/game_state_schema_v1.json",import.meta.url),"utf8"));
test("KM-006 migration audit maps every shipped v0.3 root key without assuming v1 is live",()=>{
  assert.equal(fresh().version,map.legacy_save_version);
  assert.deepEqual(Object.keys(map.legacy_keys).sort(),Object.keys(fresh()).sort());
  assert.equal(Object.keys(map.legacy_keys).length,14);
  for(const [key,item] of Object.entries(map.legacy_keys)){
    assert.ok(item.target&&item.rule,key+" has no preservation rule");
    assert.ok(["partial","shipped","spec_only"].includes(item.state),key);
  }
});
test("KM-006 audit classifies every required canonical v1 domain",()=>{
  assert.deepEqual(Object.keys(map.v1_domains).sort(),schema.required.slice().sort());
  for(const [key,item] of Object.entries(map.v1_domains)){
    assert.ok(["partial","shipped","spec_only"].includes(item.state),key);
    assert.ok(item.evidence,key+" has no evidence");
  }
  assert.ok(map.fixtures_to_build.length>=6,"migration risk fixtures missing");
});
