import test from "node:test";
import assert from "node:assert/strict";
import { beginLife, act, replayLife, playerView, saveLife, loadLife } from "./world-simulator.mjs";

const fresh = (seed = 17, cash = 900) => beginLife({
  id: "fixture-" + seed,
  birthDate: "2010-04-12",
  startedAt: "2028-05-01",
  location: "Θεσσαλονίκη",
  cash, seed
});
const dream = { id: "t1", kind: "dream", goalId: "independence", title: "Οικονομική ανεξαρτησία" };
const plan = { id: "t2", kind: "plan", goalId: "independence", planId: "venture", title: "Αρχίζω επιχείρηση" };
const setup = seed => replayLife(fresh(seed), [dream, plan]);

test("ambition and planning never manufacture cash, debt or an accomplished life", () => {
  const run = setup(17);
  assert.equal(run.cash, 900);
  assert.equal(run.debt, 0);
  assert.equal(run.goals[0].status, "pending");
  assert.equal(run.plans[0].status, "active");
  assert.match(playerView(run).footer, /Οικονομική ανεξαρτησία/);
  assert.throws(() => act(run, { id: "t3", kind: "revise", goalId: "independence", status: "succeeded" }), /cannot be declared/);
  assert.throws(() => act(run, { id: "t3", kind: "dream", goalId: "independence", title: "duplicate" }), /exists/);
});

test("no unfinanced investments; work pays only for actual elapsed shifts", () => {
  const run = setup(5);
  const denied = act(run, { id: "t3", kind: "launch", planId: "venture", budget: 5000 });
  assert.equal(denied.turns.at(-1).outcome.result, "failed");
  assert.equal(denied.cash, 900);
  assert.equal(denied.simulation.projects.length, 0);
  const earned = act(denied, { id: "t4", kind: "work", shifts: 10 });
  assert.equal(earned.cash, 1500);
  assert.equal(earned.date, "2028-05-11");
  assert.equal(earned.turns.at(-1).finance.cashDelta, 600);
  assert.match(earned.turns.at(-1).finance.cause, /βάρδιες/);
});

test("financing offer requires explicit borrower acceptance, preserving net position", () => {
  const initial = setup(101);
  const pitched = act(initial, { id: "t3", kind: "pitch", planId: "venture", amount: 10_000 });
  assert.equal(pitched.cash, initial.cash);
  assert.equal(pitched.debt, initial.debt);
  assert.equal(pitched.date, "2028-05-08");
  const view = playerView(pitched);
  assert.equal(JSON.stringify(view).includes("seed"), false);
  assert.equal(JSON.stringify(view).includes("score"), false);
  if (pitched.simulation.offers.length) {
    const offer = pitched.simulation.offers[0];
    assert.equal(offer.status, "open");
    const signed = act(pitched, { id: "t4", kind: "accept", offerId: offer.id });
    assert.equal(signed.cash, 10_900);
    assert.equal(signed.debt, 10_000);
    assert.equal(signed.cash - signed.debt, initial.cash);
    assert.equal(signed.simulation.offers[0].status, "accepted");
    const repeat = act(signed, { id: "t5", kind: "accept", offerId: offer.id });
    assert.equal(repeat.cash, signed.cash);
    assert.equal(repeat.debt, signed.debt);
    assert.equal(repeat.turns.at(-1).outcome.result, "failed");
  } else {
    assert.equal(pitched.turns.at(-1).outcome.result, "failed");
    assert.match(pitched.turns.at(-1).outcome.cause, /τράπεζα/);
  }
});

test("funding refusal is possible and cannot be forced with unlimited request", () => {
  const run = setup(17);
  const denied = act(run, { id: "t3", kind: "pitch", planId: "venture", amount: 200_000 });
  assert.equal(denied.turns.at(-1).outcome.result, "failed");
  assert.equal(denied.simulation.offers.length, 0);
  assert.equal(denied.cash, run.cash);
  const quickRetry = act(denied, { id: "t4", kind: "pitch", planId: "venture", amount: 3_000 });
  assert.equal(quickRetry.turns.at(-1).outcome.result, "failed");
  assert.match(quickRetry.turns.at(-1).outcome.cause, /30 ημέρες/);
});

test("investments have causal delayed payoffs, paid from real budgets", () => {
  const run = setup(4);
  const launched = act(run, { id: "t3", kind: "launch", planId: "venture", budget: 500 });
  assert.equal(launched.cash, 400);
  assert.equal(launched.simulation.projects[0].status, "running");
  assert.equal(playerView(launched).projects[0].roll, undefined);
  assert.equal(playerView(launched).projects[0].successChance, undefined);
  const before = act(launched, { id: "t4", kind: "wait", days: 89 });
  assert.equal(before.cash, 400);
  assert.equal(before.simulation.projects[0].status, "running");
  const settled = act(before, { id: "t5", kind: "wait", days: 1 });
  const p = settled.simulation.projects[0];
  assert.equal(p.status, "resolved");
  assert.equal(settled.cash, 400 + p.payout);
  assert.equal(p.payout >= 0, true);
  assert.equal(settled.simulation.publicEvents.some(e => e.parent === "t3" && e.id === "settle-" + p.id), true);
  const muchLater = act(settled, { id: "t6", kind: "wait", days: 3650 });
  assert.equal(muchLater.cash, settled.cash);
  assert.equal(muchLater.simulation.projects[0].status, "resolved");
  assert.equal(playerView(muchLater).age, 28);
});

test("the player may delegate with cost; refusal leaves money and work unchanged", () => {
  const run = setup(9);
  const tooCheap = act(run, { id: "t3", kind: "delegate", fee: 200 });
  assert.equal(tooCheap.simulation.advisor, false);
  assert.equal(tooCheap.cash, 900);
  const hired = act(tooCheap, { id: "t4", kind: "delegate", fee: 300 });
  assert.equal(hired.simulation.advisor, true);
  assert.equal(hired.cash, 600);
  assert.ok(playerView(hired).people.some(p => p.role === "σύμβουλος επιχειρήσεων"));
  const twice = act(hired, { id: "t5", kind: "delegate", fee: 300 });
  assert.equal(twice.cash, hired.cash);
});

test("relationships need another person's independent consent, not a player order", () => {
  const run = fresh();
  const invited = act(run, { id: "t1", kind: "invite" });
  assert.equal(invited.turns.at(-1).outcome.result, "failed");
  const met = act(invited, { id: "t2", kind: "connect" });
  assert.equal(met.simulation.relationships[0].mutuallyInterested, false);
  const close = act(met, { id: "t3", kind: "connect" });
  const invitedAgain = act(close, { id: "t4", kind: "invite" });
  const relation = invitedAgain.simulation.relationships[0];
  assert.equal(relation.mutuallyInterested, invitedAgain.turns.at(-1).outcome.result === "succeeded");
  assert.equal(run.people.length, 0);
  assert.equal(invitedAgain.people[0].role, "φίλη");
});

test("time is quiet until a real deferred event is due; goals can be abandoned", () => {
  const run = setup(20);
  const quiet = act(run, { id: "t3", kind: "wait", days: 730 });
  assert.equal(quiet.date, "2030-05-01");
  assert.equal(quiet.simulation.publicEvents.some(e => e.id.startsWith("settle-")), false);
  const pivot = act(quiet, { id: "t4", kind: "revise", goalId: "independence", status: "withdrawn" });
  assert.equal(pivot.goals[0].status, "withdrawn");
  assert.equal(pivot.plans[0].status, "active");
  assert.equal(pivot.cash, 900);
});

test("replay of identical commands and seed yields identical ledger, including hidden rolls", () => {
  const input = [dream, plan, { id: "t3", kind: "delegate", fee: 300 }, { id: "t4", kind: "launch", planId: "venture", budget: 500 }, { id: "t5", kind: "wait", days: 120 }];
  const first = replayLife(fresh(31), input);
  assert.deepEqual(replayLife(fresh(31), input), first);
  assert.deepEqual(fresh(31), fresh(31));
  assert.equal(first.turns.length, input.length);
  assert.throws(() => act(first, input[1]), /Duplicate/);
  assert.throws(() => act(first, { id: "x", kind: "unsupported" }), /Unsupported/);
  assert.throws(() => act(first, { id: "x", kind: "wait", days: -1 }), /Invalid days/);
});

test("a closed lifetime cannot be mutated or transformed into an automatic sequel", () => {
  const run = setup(88);
  const finished = act(run, { id: "t3", kind: "finish" });
  assert.equal(playerView(finished).finished, true);
  assert.throws(() => act(finished, { id: "t4", kind: "work", shifts: 5 }), /closed/);
});

test("100 seed probes uphold money invariants, finite outcomes and reproducibility", () => {
  const outcomes = new Set();
  for (let seed = 0; seed < 100; seed++) {
    const run = setup(seed);
    const a = act(run, { id: "t3", kind: "launch", planId: "venture", budget: 500 });
    const b = act(a, { id: "t4", kind: "wait", days: 91 });
    const p = b.simulation.projects[0];
    outcomes.add(p.outcome);
    assert.equal(a.cash, 400);
    assert.ok(b.cash >= 0 && Number.isSafeInteger(b.cash));
    assert.equal(b.debt, 0);
    assert.equal(b.cash, 400 + p.payout);
    assert.deepEqual(b, replayLife(fresh(seed), [
      dream, plan,
      { id: "t3", kind: "launch", planId: "venture", budget: 500 },
      { id: "t4", kind: "wait", days: 91 }
    ]));
  }
  assert.ok(outcomes.has("profitable"), "Some seeds should succeed");
  assert.ok(outcomes.has("failed"), "Some seeds should fail");
});


test("repayment cancels matching debt and cash, with no debt magically cancelled", () => {
  const initial = setup(5);
  const offer = replayLife(initial, [
    { id: "t3", kind: "pitch", planId: "venture", amount: 30_001 }
  ]);
  assert.equal(offer.simulation.offers.length, 0);
  assert.equal(offer.debt, 0);
  const withoutDebt = act(offer, { id: "t4", kind: "repay", amount: 100 });
  assert.equal(withoutDebt.turns.at(-1).outcome.result, "failed");
  assert.equal(withoutDebt.cash, initial.cash);
  // Constructed debt through original trusted ledger, not an invented simulator transfer.
  const debtRun = fresh(5);
  debtRun.cash = 10_900;
  debtRun.debt = 10_000;
  const paid = act(debtRun, { id: "t1", kind: "repay", amount: 5_000 });
  assert.equal(paid.cash, 5_900);
  assert.equal(paid.debt, 5_000);
  const settled = act(paid, { id: "t2", kind: "repay", amount: 6_000 });
  assert.equal(settled.cash, 900);
  assert.equal(settled.debt, 0);
  const lowCashFixture = { ...paid, cash: 200 };
  const denied = act(lowCashFixture, { id: "t2", kind: "repay", amount: 5_000 });
  assert.equal(denied.cash, lowCashFixture.cash);
  assert.equal(denied.debt, lowCashFixture.debt);
});

test("30-day study and paid investigation alter opportunity, never reveal outcome", () => {
  const run = setup(6);
  const learned = act(run, { id: "t3", kind: "study", subject: "business" });
  assert.equal(learned.simulation.skills.business, 1);
  assert.equal(learned.date, "2028-05-31");
  assert.equal(learned.cash, run.cash);
  const scouted = act(learned, { id: "t4", kind: "investigate", subject: "venture" });
  assert.equal(scouted.cash, 800);
  assert.equal(scouted.simulation.knowledge.venture, true);
  const launch = act(scouted, { id: "t5", kind: "launch", planId: "venture", budget: 500 });
  assert.ok(launch.simulation.projects[0].successChance > 0.42);
  assert.equal(playerView(launch).projects[0].roll, undefined);
  assert.equal(playerView(launch).projects[0].successChance, undefined);
  assert.equal(playerView(launch).knowledge.venture, true);
  assert.equal(scouted.simulation.projects.length, 0);
});

test("organizing must earn backing, costs money, and never returns fictional money", () => {
  const run = setup(45);
  let current = run;
  for (let i = 0; i < 3; i++) {
    current = act(current, { id: "net" + i, kind: "network" });
  }
  assert.ok(current.people.some(p => p.role === "οργανωτής κοινότητας"));
  assert.equal(current.debt, 0);
  const trust = current.simulation.politicalContacts[0]?.trust ?? 0;
  assert.ok(trust >= 0 && trust <= 3);
  const organized = act(current, { id: "t6", kind: "organize", planId: "venture", budget: 500 });
  assert.equal(organized.cash, 400);
  assert.equal(organized.simulation.projects[0].political, true);
  const settled = act(organized, { id: "t7", kind: "wait", days: 60 });
  assert.equal(settled.cash, 400);
  assert.equal(settled.simulation.projects[0].payout, 0);
  assert.ok(["rejected", "supported"].includes(settled.simulation.projects[0].outcome));
  assert.equal(settled.simulation.influence, settled.simulation.projects[0].outcome === "supported" ? 1 : 0);
  assert.ok(JSON.stringify(playerView(settled)).includes("οργανωτής"));
  assert.equal(JSON.stringify(playerView(organized)).includes("successChance"), false);
});

test("distinct attempts use unique project IDs, and active-plan collisions are rejected", () => {
  const run = setup(7);
  const once = act(run, { id: "t3", kind: "launch", planId: "venture", budget: 200 });
  assert.throws(() => act(once, { id: "t4", kind: "launch", planId: "venture", budget: 100 }), /running project/);
  const settled = act(once, { id: "t5", kind: "wait", days: 90 });
  const twice = act(settled, { id: "t6", kind: "launch", planId: "venture", budget: 100 });
  assert.equal(twice.simulation.projects.length, 2);
  assert.notEqual(twice.simulation.projects[0].id, twice.simulation.projects[1].id);
});

test("same seed different preparatory decisions produce different state and odds", () => {
  const base = setup(17);
  const naive = act(base, { id: "t3", kind: "launch", planId: "venture", budget: 500 });
  const prepared = replayLife(base, [
    { id: "research", kind: "investigate", subject: "venture" },
    { id: "learn", kind: "study", subject: "business" },
    { id: "t3", kind: "launch", planId: "venture", budget: 500 }
  ]);
  assert.ok(prepared.simulation.projects[0].successChance > naive.simulation.projects[0].successChance);
  assert.equal(naive.cash, 400);
  assert.equal(prepared.cash, 300);
  assert.notEqual(prepared.date, naive.date);
});


test("save/load replays actions rather than trusting an edited cash snapshot", () => {
  const run = replayLife(fresh(26), [
    dream, plan,
    { id: "t3", kind: "study", subject: "business" },
    { id: "t4", kind: "investigate", subject: "venture" },
    { id: "t5", kind: "launch", planId: "venture", budget: 200 },
    { id: "t6", kind: "wait", days: 120 }
  ]);
  const serialized = saveLife(run);
  assert.deepEqual(loadLife(serialized), run);
  const snapshot = JSON.parse(serialized);
  assert.equal(snapshot.format, "kingmaker-life-experiment-v1");
  assert.equal(Object.hasOwn(snapshot, "cash"), false);
  assert.equal(Object.hasOwn(snapshot, "politicalSaveKey"), false);
  const tampered = structuredClone(run);
  tampered.cash = 1_000_000_000;
  assert.throws(() => saveLife(tampered), /modified outside/);
  assert.throws(() => loadLife(serialized.slice(0, 5)), /Corrupt/);
  assert.throws(() => loadLife(JSON.stringify({ ...snapshot, format: "v0-unsupported" })), /Unsupported/);
  assert.throws(() => loadLife(JSON.stringify({ ...snapshot, commands: [...snapshot.commands, snapshot.commands[0]] })), /Duplicate/);
});

test("seeded actor autonomy admits both cooperation and refusal, not automatic obedience", () => {
  const outcomes = new Set();
  for (let i = 0; i < 100; i++) {
    const run = act(fresh(i), { id: "intro", kind: "network" });
    outcomes.add(run.turns.at(-1).outcome.result);
    assert.equal(run.people.length, 1);
    assert.equal(run.people[0].role, "οργανωτής κοινότητας");
    assert.equal(run.cash, 900);
  }
  assert.ok(outcomes.has("succeeded"));
  assert.ok(outcomes.has("failed"));
});

test("short CLI fixture narrates 18 actual turns and preserves audit footer", async () => {
  const { execFileSync } = await import("node:child_process");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const dir = dirname(fileURLToPath(import.meta.url));
  const stdout = execFileSync(process.execPath, [join(dir, "play-scenario.mjs")], {
    encoding: "utf8", timeout: 10_000
  });
  assert.equal((stdout.match(/Αποτέλεσμα:/g) ?? []).length, 18);
  assert.match(stdout, /Δεν μπορείς να ξεκινήσεις/);
  assert.match(stdout, /ΜΟΝΟ ΕΠΑΛΗΘΕΥΜΕΝΗ ΚΑΤΑΣΤΑΣΗ/);
  assert.match(stdout, /Ηλικία 18/);
  assert.match(stdout, /Τέλος/);
});


test("independent world events follow seed and date, not a wealth/power target", () => {
  let witnessed = 0;
  let quiet = 0;
  for (let seed = 0; seed < 100; seed++) {
    const noDream = act(fresh(seed), { id: "wait-all", kind: "wait", days: 180 });
    const withDream = replayLife(fresh(seed), [
      { ...dream, id: "new-aspiration" },
      { id: "wait-all", kind: "wait", days: 180 }
    ]);
    const worldA = noDream.simulation.publicEvents.filter(e => e.parent === "world-seed");
    const worldB = withDream.simulation.publicEvents.filter(e => e.parent === "world-seed");
    assert.deepEqual(worldA, worldB);
    assert.equal(playerView(noDream).economy, playerView(withDream).economy);
    assert.equal(noDream.cash, withDream.cash);
    if (worldA.length) witnessed++; else quiet++;
  }
  assert.ok(witnessed > 0, "some worlds should have independent market news");
  assert.ok(quiet > 0, "some worlds should be quiet");
});

test("calendar advances market events exactly once even across large leaps and saves", () => {
  const seed = Array.from({ length: 100 }, (_, i) => i)
    .find(i => fresh(i).simulation.world.events.some(e => e.date === "2028-10-28"));
  assert.notEqual(seed, undefined);
  const original = fresh(seed);
  assert.equal(playerView(original).economy, "steady");
  assert.equal(JSON.stringify(playerView(original)).includes("world-seed"), false);
  const reached = act(original, { id: "w1", kind: "wait", days: 365 });
  const headlines = reached.simulation.publicEvents.filter(e => e.parent === "world-seed");
  assert.ok(headlines.length > 0);
  const later = act(reached, { id: "w2", kind: "wait", days: 365 });
  const combined = later.simulation.publicEvents.filter(e => e.parent === "world-seed");
  assert.equal(combined.filter(e => e.id === "economy-0").length, 1);
  assert.deepEqual(loadLife(saveLife(later)), later);
});


test("economy shock before venture settlement changes success odds in chronological order", () => {
  const seed = Array.from({ length: 250 }, (_, i) => i)
    .find(i => fresh(i).simulation.world.events.some(e => e.date === "2028-10-28" && e.kind === "cooling"));
  assert.notEqual(seed, undefined);
  const base = act(setup(seed), { id: "wait-100", kind: "wait", days: 100 });
  const invested = act(base, { id: "venture-3", kind: "launch", planId: "venture", budget: 500 });
  const settled = act(invested, { id: "wait-90", kind: "wait", days: 90 });
  const venture = settled.simulation.projects[0];
  assert.equal(venture.effectiveChance, venture.successChance - 0.10);
  assert.equal(settled.simulation.world.economy, "cooling");
  const publicItems = settled.simulation.publicEvents;
  const worldIndex = publicItems.findIndex(e => e.id === "economy-0");
  const settlementIndex = publicItems.findIndex(e => e.id === "settle-" + venture.id);
  assert.ok(worldIndex !== -1 && worldIndex < settlementIndex);
  assert.equal(settled.cash, 400 + venture.payout);
});

test("advancing study time cannot bury important external news", () => {
  const seed = Array.from({ length: 100 }, (_, i) => i)
    .find(i => fresh(i).simulation.world.events.some(e => e.date === "2028-10-28"));
  const before = act(fresh(seed), { id: "w", kind: "wait", days: 170 });
  const after = act(before, { id: "s", kind: "study", subject: "society" });
  assert.equal(after.date, "2028-11-17");
  assert.ok(after.turns.at(-1).scene.includes("τοπική αγορά"));
  assert.ok(after.turns.at(-1).scene.includes("μελέτη"));
  assert.equal(after.simulation.publicEvents.filter(e => e.parent === "world-seed").length, 1);
});
