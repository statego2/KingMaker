/**
 * Small, deterministic strategic material discovery aid for AI game direction.
 *
 * Not a Greek NLP interpreter and NEVER an action resolver. Returns relevant
 * authored knowledge, independently tagged as either runnable or story-seed.
 * The LLM may use this as background only; player free text stays free text.
 */
import {STRATEGIC_CASEBOOK} from "./strategy-casebook.mjs";
import {strategicCaseKnowledgePack} from "./strategy-knowledge-graph.mjs";
const CUES=Object.freeze([
 {signals:["επιχειρ","εταιρ","startup","επενδ","χρηματοδοτ","δανει","δισεκατο","πλουτο","business"],cases:["CASE-01","CASE-02","CASE-06"]},
 {signals:["πολιτικ","εκλογ","κυβερν","βουλευ","συνασπισ","δημοτικ","εξουσι","president"],cases:["CASE-03","CASE-09"]},
 {signals:["κοινοτ","εθελον","ομαδα","προσφορ","αλληλοβοηθ"],cases:["CASE-04"]},
 {signals:["σχεση","φιλι","ερωτ","γαμ","συντροφ","love"],cases:["CASE-07"]},
 {signals:["μελετ","βιβλ","γνωσ","μαθησ","αναγνωσ","φιλοσοφ","learning"],cases:["CASE-11"]},
 {signals:["δημοσιογραφ","φημη","αποκαλυψ","σκανδαλ","media"],cases:["CASE-05"]},
 {signals:["υφεση","υφεσ","χρεοκοπ","ρευστοτ","κρισ","recession"],cases:["CASE-08"]},
 {signals:["κληρονομ","διαδοχ","γηρατ","legacy","successor"],cases:["CASE-10"]},
 {signals:["αντιπαλ","ανταγωνισ","εκδικ","rival"],cases:["CASE-12"]}
]);
const EXECUTABLE=new Map([["CASE-01","venture-alliance"],["CASE-03","local-reform"],["CASE-04","civic-network"]]);
const fold=x=>x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
export function findStrategicMaterial(text,{limit=3}={}){
 if(typeof text!=="string"||text.length>1500)throw Error("Invalid intent text");
 if(!Number.isSafeInteger(limit)||limit<1||limit>12)throw Error("Invalid retrieval limit");
 const normalized=fold(text);
 const scores=new Map();
 for(const rule of CUES){
  const matches=rule.signals.filter(s=>normalized.includes(fold(s)));
  if(!matches.length)continue;
  for(const [index,cid] of rule.cases.entries()){
   const score=matches.length*10-index;
   scores.set(cid,Math.max(scores.get(cid)??0,score));
  }
 }
 const relevant=[...scores.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit);
 return {
  method:"keyword-retrieval-heuristic-no-outcome-authority",
  identified:relevant.length>0,
  candidates:relevant.map(([id,score])=>{
   const c=STRATEGIC_CASEBOOK.find(s=>s.id===id);
   const pack=strategicCaseKnowledgePack(id);
   return {
    id,title:c.title,domain:c.domain,scale:c.scale,
    confidence:"heuristic-topic-match",score,
    availability:EXECUTABLE.has(id)?"bounded-executable-world":"authored-reference-only",
    executableScenario:EXECUTABLE.get(id)??null,
    authoredMechanisms:pack.patterns.map(p=>({
     id:p.id,competencies:p.competencies,tradeoff:p.tension,cost:p.cost,
     countermove:p.independentCounterplay,delayed:p.longRunCallback
    }))
   };
  }),
  note:"Not an intent parser, not a guarantee of success, no permission to invent unsupported engine outcomes."
 };
}
