#!/usr/bin/env node
/**
 * Synthetic 3-policy benchmark for the strategic sandbox.
 * Results are NOT human-playtest success rates or empirical political probabilities.
 * Strategies use identical seeds, but are not guaranteed identical random draws
 * after divergent turns (as in ordinary history-sensitive deterministic gameplay).
 */
import { beginStrategy, strategyTurn, strategyPlayerView } from "./strategic-director.mjs";

export function runPolicy({ seed, policy = "targeted", scenario = "local-reform" }) {
  if (!["impulsive", "targeted", "adaptive"].includes(policy)) throw Error("Unknown policy");
  let state = beginStrategy({ seed, scenario });
  let number = 0;
  const action = (kind, args = {}) => {
    if (state.result !== "ongoing") return;
    state = strategyTurn(state, { id: "a" + ++number, kind, ...args });
  };
  if (policy === "impulsive") {
    action("publish");
    action("offer", { actorId: "eleni", terms: { credit: 3 } });
    action("offer", { actorId: "nikos", terms: { transparency: 3 } });
    action("commit");
  }
  if (policy === "targeted") {
    action("listen", { actorId: "eleni" });
    action("listen", { actorId: "nikos" });
    action("offer", { actorId: "eleni", terms: { transparency: 3 } });
    action("offer", { actorId: "nikos", terms: { autonomy: 3, budget: 1 } });
    action("coordinate");
    action("commit");
  }
  if (policy === "adaptive") {
    action("listen", { actorId: "eleni" });
    action("listen", { actorId: "nikos" });
    action("prepare");
    action("offer", { actorId: "eleni", terms: { transparency: 3 } });
    if (state.actors.find(a => a.id === "eleni").stance !== "supporting")
      action("offer", { actorId: "eleni", terms: { transparency: 3, budget: 1 } });
    action("offer", { actorId: "nikos", terms: { autonomy: 3, budget: 1 } });
    if (state.actors.find(a => a.id === "nikos").stance !== "supporting")
      action("offer", { actorId: "nikos", terms: { autonomy: 3, budget: 1 } });
    action("coordinate");
    action("commit");
  }
  return { state, view: strategyPlayerView(state) };
}

export function comparePolicies(n = 500) {
  if (!Number.isSafeInteger(n) || n < 30 || n > 10_000) throw Error("Invalid seed count");
  const report = [];
  for (const policy of ["impulsive", "targeted", "adaptive"]) {
    let secured = 0, expired = 0, refused = 0, totalTurns = 0, cost = 0;
    for (let seed = 0; seed < n; seed++) {
      const { state } = runPolicy({ seed, policy });
      if (state.result === "secured") secured++;
      if (state.result === "expired") expired++;
      refused += state.history.filter(h => h.kind === "offer" && h.outcome.result === "failed").length;
      totalTurns += state.turn;
      cost += 9 - state.resources.budget;
    }
    report.push({
      policy, seeds: n,
      secured_fraction: Number((secured / n).toFixed(3)),
      expired_fraction: Number((expired / n).toFixed(3)),
      mean_refused_offers: Number((refused / n).toFixed(3)),
      mean_turns: Number((totalTurns / n).toFixed(2)),
      mean_resource_cost: Number((cost / n).toFixed(2))
    });
  }
  return { name: "synthetic-strategy-acceptance-benchmark", version: 1, report };
}
if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  console.log(JSON.stringify(comparePolicies(), null, 2));
}
