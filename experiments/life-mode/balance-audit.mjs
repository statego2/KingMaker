#!/usr/bin/env node
// Reproducible synthetic economics diagnostic; NOT realism or player fun evidence.
// Usage: node experiments/life-mode/balance-audit.mjs
import { beginLife, replayLife } from "./world-simulator.mjs";

const DREAM = { id: "dream", kind: "dream", goalId: "wealth", title: "Οικονομική ανεξαρτησία" };
const PLAN = { id: "plan", kind: "plan", goalId: "wealth", planId: "company", title: "Αρχίζω επιχείρηση" };
const MODES = ["naive", "research", "expert", "study", "combined"];

export function auditLifeBalance(count = 500) {
  if (!Number.isSafeInteger(count) || count < 30 || count > 10_000) {
    throw new Error("Seed count must be between 30 and 10000");
  }
  const output = [];
  for (const mode of MODES) {
    let victories = 0, zeroReturn = 0, sumPayout = 0, sumProfit = 0;
    const payouts = [];
    for (let seed = 0; seed < count; seed++) {
      const initial = beginLife({
        id: "balance-" + seed, birthDate: "2010-04-12",
        startedAt: "2028-05-01", location: "Δοκιμαστική πόλη",
        cash: 3_000, seed
      });
      const commands = [DREAM, PLAN];
      if (mode === "study" || mode === "combined") {
        commands.push({ id: "study", kind: "study", subject: "business" });
      }
      if (mode === "research" || mode === "combined") {
        commands.push({ id: "research", kind: "investigate", subject: "venture" });
      }
      if (mode === "expert" || mode === "combined") {
        commands.push({ id: "expert", kind: "delegate", fee: 300 });
      }
      commands.push(
        { id: "launch", kind: "launch", planId: "company", budget: 2_000 },
        { id: "maturity", kind: "wait", days: 90 }
      );
      const final = replayLife(initial, commands);
      const project = final.simulation.projects[0];
      if (project.status !== "resolved") throw new Error("Missing settlement");
      if (project.outcome === "profitable") victories++;
      if (project.payout === 0) zeroReturn++;
      sumPayout += project.payout;
      sumProfit += final.cash - initial.cash;
      payouts.push(project.payout);
    }
    payouts.sort((a, b) => a - b);
    output.push({
      mode, seeds: count,
      profitable_fraction: Number((victories / count).toFixed(3)),
      zero_return_fraction: Number((zeroReturn / count).toFixed(3)),
      mean_payout_eur: Math.round(sumPayout / count),
      mean_net_change_eur: Math.round(sumProfit / count),
      median_payout_eur: payouts[Math.floor((count - 1) / 2)]
    });
  }
  return { kind: "synthetic-life-balance-diagnostic", version: 1, results: output };
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  console.log(JSON.stringify(auditLifeBalance(), null, 2));
}
