import test from "node:test";
import assert from "node:assert/strict";
import { createRun, applyTurn, ageOn, statusFooter } from "./chat-ledger.mjs";

const start = () => createRun({ id: "life-001", birthDate: "2010-04-12", startedAt: "2028-05-01", location: "Θεσσαλονίκη", cash: 850 });

test("every fresh life begins at 18 and long jumps preserve age", () => {
  assert.throws(() => createRun({ id: "bad", birthDate: "2010-04-12", startedAt: "2027-05-01", location: "Αθήνα" }), /age 18/);
  assert.equal(ageOn("2010-04-12", "2040-04-11"), 29);
  assert.equal(ageOn("2010-04-12", "2040-04-12"), 30);
});

test("an extravagant ambition stays a goal; the visible plans survive turns", () => {
  const first = applyTurn(start(), {
    id: "t1", date: "2028-05-01", playerText: "Θέλω να γίνω δισεκατομμυριούχος",
    scene: "Γράφεις τον στόχο σου.", outcome: { result: "pending" },
    goals: [{ id: "wealth", title: "€1 δισ.", status: "pending" }],
    plans: [{ id: "venture", goalId: "wealth", title: "Στήνω εταιρεία", status: "active" }]
  });
  assert.equal(first.cash, 850);
  const second = applyTurn(first, {
    id: "t2", date: "2028-05-05", playerText: "Ζητώ χρηματοδότηση",
    scene: "Ο επενδυτής αρνήθηκε.", outcome: { result: "failed", cause: "Δεν δέχτηκε τους όρους." },
    plans: [{ id: "venture", goalId: "wealth", title: "Στήνω εταιρεία", status: "blocked" }]
  });
  assert.match(statusFooter(second), /€1 δισ\./);
  assert.match(statusFooter(second), /Στήνω εταιρεία \(μπλοκαρισμένο\)/);
  assert.equal(first.plans[0].status, "active");
});

test("a costly success needs a cause and accounts for the money", () => {
  const event = {
    id: "t1", date: "2028-05-02", playerText: "Αγοράζω εισιτήριο",
    scene: "Το εισιτήριο αγοράστηκε.", outcome: { result: "succeeded", cause: "Η αγορά επιβεβαιώθηκε." },
    finance: { cashDelta: -300, cause: "Αεροπορικό εισιτήριο" }
  };
  const after = applyTurn(start(), event);
  assert.equal(after.cash, 550);
  assert.throws(() => applyTurn(after, event), /Duplicate/);
  assert.throws(() => applyTurn(start(), { ...event, finance: { cashDelta: -900, cause: "Ακριβό εισιτήριο" } }), /Invalid cash/);
  assert.throws(() => applyTurn(start(), { ...event, finance: { cashDelta: -100 } }), /cause/);
  assert.throws(() => applyTurn(start(), { ...event, outcome: { result: "succeeded" } }), /causal/);
});

test("chronology, person labels and goal ownership are enforced", () => {
  assert.throws(() => applyTurn(start(), { id: "t1", date: "2028-04-30", playerText: "Περιμένω", scene: "Περνά η ώρα.", outcome: { result: "pending" } }), /reverse/);
  assert.throws(() => applyTurn(start(), { id: "t1", date: "2028-05-01", playerText: "Προσλαμβάνω", scene: "Μιλάω.", outcome: { result: "pending" }, people: [{ id: "p1", name: "Λέα" }] }), /role/);
  assert.throws(() => applyTurn(start(), { id: "t1", date: "2028-05-01", playerText: "Σχεδιάζω", scene: "Σκέφτομαι.", outcome: { result: "pending" }, plans: [{ id: "p1", goalId: "unknown", title: "Βήμα", status: "active" }] }), /no goal/);
  assert.throws(() => applyTurn(start(), { id: "t1", date: "2028-05-01", playerText: "Θέλω να κερδίσω", scene: "Το δήλωσες.", outcome: { result: "pending" }, goals: [{ id: "win", title: "Νίκη", status: "succeeded" }] }), /intention alone/);
});
