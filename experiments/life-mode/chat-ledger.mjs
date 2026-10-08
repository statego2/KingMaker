// An audit aid for chat-first Life Mode playtests, not a world resolver.
// The narrator supplies outcomes; this module preserves what was asserted.
const RESULTS = new Set(["pending", "partial", "succeeded", "failed", "withdrawn"]);
const PLAN_STATES = new Set(["active", "blocked", "completed", "abandoned"]);

function isoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ||
      new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid date: ${value}`);
  }
  return value;
}

export function ageOn(birthDate, date) {
  const birth = isoDate(birthDate);
  const now = isoDate(date);
  if (now < birth) throw new Error("Date precedes birth");
  const years = Number(now.slice(0, 4)) - Number(birth.slice(0, 4));
  return years - (now.slice(5) < birth.slice(5) ? 1 : 0);
}

function amount(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid ${label}`);
  return value;
}

export function createRun({ id, birthDate, startedAt, location, cash = 0, debt = 0 }) {
  if (!id || !location) throw new Error("Run ID and location required");
  if (ageOn(birthDate, startedAt) !== 18) throw new Error("Every new life starts at age 18");
  return {
    version: 1, id, birthDate, date: startedAt, location,
    cash: amount(cash, "cash"), debt: amount(debt, "debt"),
    goals: [], plans: [], people: [], turns: []
  };
}

function upsert(list, patch, allowedStates, kind) {
  if (!patch?.id || !patch?.title || !allowedStates.has(patch.status)) {
    throw new Error(`Invalid ${kind} update`);
  }
  const at = list.findIndex(item => item.id === patch.id);
  if (at < 0) list.push({ ...patch });
  else list[at] = { ...list[at], ...patch };
}

export function applyTurn(previous, turn) {
  if (!previous || previous.version !== 1) throw new Error("Unknown run version");
  if (!turn?.id || !turn.playerText || !turn.date || !turn.scene || !turn.outcome) {
    throw new Error("Turn needs ID, player input, date, scene and outcome");
  }
  if (previous.turns.some(item => item.id === turn.id)) throw new Error("Duplicate turn ID");
  isoDate(turn.date);
  if (turn.date < previous.date) throw new Error("Time cannot reverse");
  if (turn.outcome.result && !RESULTS.has(turn.outcome.result)) throw new Error("Invalid result");
  if (turn.outcome.result === "succeeded" && !turn.outcome.cause) {
    throw new Error("Success needs an explicit causal account");
  }
  const next = structuredClone(previous);
  const finance = turn.finance ?? {};
  const cashDelta = finance.cashDelta ?? 0;
  const debtDelta = finance.debtDelta ?? 0;
  if (![cashDelta, debtDelta].every(Number.isSafeInteger)) throw new Error("Invalid money delta");
  if ((cashDelta || debtDelta) && !finance.cause) throw new Error("Money change needs a cause");
  amount(next.cash + cashDelta, "cash");
  amount(next.debt + debtDelta, "debt");
  next.cash += cashDelta;
  next.debt += debtDelta;
  for (const goal of turn.goals ?? []) upsert(next.goals, goal, RESULTS, "goal");
  for (const plan of turn.plans ?? []) {
    if (!next.goals.some(goal => goal.id === plan.goalId)) throw new Error("Plan has no goal");
    upsert(next.plans, plan, PLAN_STATES, "plan");
  }
  for (const person of turn.people ?? []) {
    if (!person.id || !person.name || !person.role) throw new Error("Person needs name and role");
    const at = next.people.findIndex(item => item.id === person.id);
    if (at < 0) next.people.push({ ...person });
    else next.people[at] = { ...next.people[at], ...person };
  }
  next.date = turn.date;
  next.location = turn.location ?? next.location;
  next.turns.push({
    id: turn.id, date: turn.date, playerText: turn.playerText,
    scene: turn.scene, outcome: { ...turn.outcome },
    finance: { cashDelta, debtDelta, cause: finance.cause ?? null }
  });
  return next;
}

export function statusFooter(run) {
  const goals = run.goals.filter(goal => goal.status === "pending" || goal.status === "partial");
  const plans = run.plans.filter(plan => plan.status === "active" || plan.status === "blocked");
  const lines = [
    `Ηλικία ${ageOn(run.birthDate, run.date)} · ${run.date} · ${run.location}`,
    `Μετρητά €${run.cash.toLocaleString("el-GR")} · Χρέος €${run.debt.toLocaleString("el-GR")}`,
    `Στόχοι: ${goals.length ? goals.map(goal => goal.title).join(" · ") : "κανένας ενεργός"}`,
    `Σχέδια: ${plans.length ? plans.map(plan => `${plan.title}${plan.status === "blocked" ? " (μπλοκαρισμένο)" : ""}`).join(" · ") : "κανένα ενεργό"}`
  ];
  return lines.join("\n");
}
