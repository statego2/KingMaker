/**
 * KINGMAKER experimental Life Mode content inventory.
 *
 * This is the SINGLE authoritative discovery map for the chat-first experimental
 * backend. The published Lydria political campaign is a separate production line.
 * "Executable" is intentionally distinct from authored references and proposals.
 */
import {SCENARIOS} from "./strategic-director.mjs";
import {STRATEGIC_CASEBOOK} from "./strategy-casebook.mjs";
import {STRATEGIC_MECHANISMS,validateMechanisms} from "./strategy-mechanisms.mjs";
import {STRATEGY_COMPETENCIES,validateStrategyCrosswalk} from "./strategy-knowledge-graph.mjs";

export const BACKEND_CATALOG_VERSION="kingmaker-life-catalog-1";
export const BACKEND_LAYERS=Object.freeze([
 {id:"canon",role:"Authority and owner decisions",entry:"AGENTS.md",scope:"Published political game; Life Mode remains draft"},
 {id:"knowledge",role:"Original authored strategic pattern library",entry:"experiments/life-mode/strategy-mechanisms.mjs",scope:"36 playable patterns; 60 authored competency mappings; 0 verified original question mappings"},
 {id:"worlds",role:"Bounded executable simulation scenarios",entry:"experiments/life-mode/strategic-director.mjs",scope:"3 deterministic strategy sandboxes"},
 {id:"cases",role:"Optional authored story seeds",entry:"experiments/life-mode/strategy-casebook.mjs",scope:"12 NOT executable case packets"},
 {id:"life",role:"Chronological accounting and autonomous events",entry:"experiments/life-mode/world-simulator.mjs",scope:"Life actions, cash/debt, age, research and economic events"},
 {id:"strategy",role:"NPC motives, consent, intel, negotiation and coalitions",entry:"experiments/life-mode/strategic-director.mjs",scope:"Bounded and deterministic, not full independent civilization"},
 {id:"saga",role:"Single life with episodic political/business strategy",entry:"experiments/life-mode/strategic-saga.mjs",scope:"Persisted life, returning actor memory and replay"},
 {id:"adapter",role:"Model commands to validated engine actions",entry:"experiments/life-mode/kingmaker-session.mjs",scope:"Structured model adapter, NO live LLM service"},
 {id:"connector",role:"Stateless trusted host model tool interface",entry:"experiments/life-mode/stateless-connector.mjs",scope:"Private save + public result, not a deployed HTTP/API connector"},
 {id:"ui",role:"Narrator/player-safe projection",entry:"experiments/life-mode/kingmaker-session.mjs",scope:"ChatGPT displays prose, not another browser site"},
 {id:"qa",role:"Deterministic Node verification",entry:"experiments/life-mode/kingmaker-session.test.mjs",scope:"Node tests; not human fun approval"}
]);

const clone=x=>structuredClone(x);
export function listBackendContent() {
 return {
  catalogVersion:BACKEND_CATALOG_VERSION,
  status:"experimental-draft-not-deployed",
  layers:clone(BACKEND_LAYERS),
  executableScenarios:Object.entries(SCENARIOS).map(([id,s])=>({
   id,title:s.title,issue:s.issue,objective:s.objective,
   actors:s.actors.map(a=>({id:a.id,name:a.name,role:a.role})),
   stage:"deterministic-executable-prototype"
  })),
  authoredCases:STRATEGIC_CASEBOOK.map(x=>({
   id:x.id,title:x.title,domain:x.domain,scale:x.scale,
   stage:"story-seed-not-executable"
  })),
  strategyLibrary:{mechanisms:STRATEGIC_MECHANISMS.length,competencies:STRATEGY_COMPETENCIES.length,
   domains:10,tensions:15,originalQuestionMappings:0}
 };
}
export function verifyBackendCatalog() {
 const checks=[validateMechanisms(),validateStrategyCrosswalk()];
 const errors=checks.flatMap(x=>x.errors);
 const cases=new Set(STRATEGIC_CASEBOOK.map(x=>x.id));
 const ids=new Set(Object.keys(SCENARIOS));
 if(ids.size!==3)errors.push("Unexpected number of executable strategy scenarios");
 if(cases.size!==STRATEGIC_CASEBOOK.length)errors.push("Duplicate authored case IDs");
 if(BACKEND_LAYERS.length!==new Set(BACKEND_LAYERS.map(x=>x.id)).size)errors.push("Duplicate backend layer");
 for(const x of BACKEND_LAYERS)if(!x.entry||!x.role)errors.push("Missing backend layer documentation");
 return {valid:!errors.length,errors,executableScenarios:ids.size,authoredCases:cases.size,
  authoredMechanisms:STRATEGIC_MECHANISMS.length,originalQuestionMappings:0};
}
