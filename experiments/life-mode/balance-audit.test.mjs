import test from "node:test";
import assert from "node:assert/strict";
import { auditLifeBalance } from "./balance-audit.mjs";

test("balance audit is deterministic and includes all five preparation paths", () => {
  const first = auditLifeBalance(100);
  assert.deepEqual(first, auditLifeBalance(100));
  assert.deepEqual(first.results.map(row => row.mode), [
    "naive", "research", "expert", "study", "combined"
  ]);
  for (const row of first.results) {
    assert.equal(row.seeds, 100);
    assert.ok(row.profitable_fraction >= 0 && row.profitable_fraction <= 1);
    assert.ok(row.zero_return_fraction >= 0 && row.zero_return_fraction <= 1);
    assert.ok(Number.isSafeInteger(row.mean_net_change_eur));
  }
  assert.throws(() => auditLifeBalance(0), /Seed count/);
  assert.throws(() => auditLifeBalance(10001), /Seed count/);
});

test("across 500 fixed worlds, professional preparation changes win odds without guarantees", () => {
  const result = auditLifeBalance(500).results;
  const novice = result.find(x => x.mode === "naive");
  const expert = result.find(x => x.mode === "expert");
  const prepared = result.find(x => x.mode === "combined");
  assert.ok(expert.profitable_fraction > novice.profitable_fraction,
    "Hiring an expert should improve success frequency in the synthetic calibration");
  assert.ok(prepared.profitable_fraction > novice.profitable_fraction,
    "Combined research and study should improve success frequency");
  assert.ok(expert.profitable_fraction < 1 && novice.profitable_fraction > 0,
    "Expert advice cannot guarantee success and luck still exists");
});
