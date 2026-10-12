/**
 * Original strategy-case competency crosswalk (60 canonical competencies).
 * Maps AUTHORED mechanics to the master framework's IDs, NOT the absent
 * Q001-Q1000 original questions and not claims of per-question source coverage.
 */
import { STRATEGIC_MECHANISMS } from "./strategy-mechanisms.mjs";
import { STRATEGIC_CASEBOOK } from "./strategy-casebook.mjs";

const d=prefix=>Array.from({length:6},(_,i)=>prefix+(i+1));
export const STRATEGY_COMPETENCIES=Object.freeze(
 ["PE","SC","JD","TE","PI","CI","PN","RP","CA","DG"].flatMap(d)
);
const MAP={
 "SM-001":["PE1","PE2"],"SM-002":["PE2","PE4"],"SM-003":["PE3","PE5"],
 "SM-004":["JD4","PE6"],"SM-005":["PE6","JD6"],"SM-006":["JD1","JD2"],
 "SM-007":["JD5","CA1"],"SM-008":["JD2","DG4"],"SM-009":["TE5","JD3"],
 "SM-010":["TE1","TE2"],"SM-011":["TE3","CI4"],"SM-012":["TE6","SC5"],
 "SM-013":["TE4","PI6"],"SM-014":["TE5","DG5"],"SM-015":["PI4","PN3"],
 "SM-016":["PI1","PI2"],"SM-017":["PI3","CI6"],"SM-018":["PI5","SC3"],
 "SM-019":["CI3","CI6"],"SM-020":["CI1","CI2"],"SM-021":["CI4","RP2"],
 "SM-022":["PN1","PN6"],"SM-023":["PN5","PN2"],"SM-024":["PN3","CA6"],
 "SM-025":["RP1","RP5"],"SM-026":["RP6","RP3"],"SM-027":["CA1","CA2"],
 "SM-028":["CA3","CA5"],"SM-029":["CA4","TE6"],"SM-030":["DG6","PN4"],
 "SM-031":["DG4","SC6"],"SM-032":["DG3","SC4"],"SM-033":["DG5","DG2","DG1"],
 "SM-034":["SC1","SC2"],"SM-035":["CI5","SC3"],"SM-036":["CA6","RP4"]
};
export const STRATEGY_CROSSWALK=Object.freeze(MAP);

export function validateStrategyCrosswalk(){
 const validIds=new Set(STRATEGY_COMPETENCIES);
 const actual=new Set(STRATEGIC_MECHANISMS.map(x=>x.id));
 const errors=[],coverage=new Set();
 for(const [mechanism,competencies] of Object.entries(STRATEGY_CROSSWALK)){
  if(!actual.has(mechanism))errors.push("Unknown mechanism "+mechanism);
  if(!Array.isArray(competencies)||!competencies.length)errors.push("Unmapped mechanism "+mechanism);
  for(const id of competencies){
   if(!validIds.has(id))errors.push("Unknown competency "+id);
   coverage.add(id);
  }
 }
 for(const id of actual)if(!STRATEGY_CROSSWALK[id])errors.push("Missing crosswalk "+id);
 const uncovered=STRATEGY_COMPETENCIES.filter(id=>!coverage.has(id));
 return {valid:!errors.length && uncovered.length===0,
  authoredMechanisms:actual.size,canonicalCompetencies:STRATEGY_COMPETENCIES.length,
  competenciesTouched:coverage.size,uncovered,errors,originalQuestionMappings:0};
}
export function strategicCaseKnowledgePack(caseId){
 const scenario=STRATEGIC_CASEBOOK.find(c=>c.id===caseId);
 if(!scenario)throw Error("Unknown strategic case");
 const byId=new Map(STRATEGIC_MECHANISMS.map(p=>[p.id,p]));
 return {
  caseId,theme:scenario.domain,scale:scenario.scale,
  sourceBoundary:"Authored strategic scenario mapping; NOT item-level Gracian/Greene/question provenance.",
  constraints:[scenario.bottleneck,scenario.countermove],
  patterns:scenario.mechanisms.map(id=>{
   const pattern=byId.get(id);
   if(!pattern)throw Error("Unknown mechanism in casebook "+id);
   return {id,name:pattern.name,competencies:[...STRATEGY_CROSSWALK[id]],
    domain:pattern.domain,tension:pattern.tension,
    observableSignal:pattern.signal,lever:pattern.lever,
    cost:pattern.price,independentCounterplay:pattern.countermove,
    longRunCallback:pattern.delayed};
  })
 };
}
