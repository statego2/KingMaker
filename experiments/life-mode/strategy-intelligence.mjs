/**
 * Strategic situation synthesizer for the AI Game Master.
 * Director notes may refer to hidden goals; narrator notes NEVER reveal private
 * facts/utility values/seed. Mechanisms are design affordances, not answer keys.
 */
import { SCENARIOS, strategyPlayerView, strategyDesignerAudit } from "./strategic-director.mjs";
import { STRATEGIC_MECHANISMS } from "./strategy-mechanisms.mjs";
const byId=new Map(STRATEGIC_MECHANISMS.map(p=>[p.id,p]));
function suggestions(v){
 const list=[];
 if(v.lastTurn?.kind==="offer"&&v.lastTurn.outcome.result==="failed"){
  list.push({id:"SM-016",observation:"Πρόσφατη άρνηση χωρίς σύμπτωση συμφερόντων."});
  list.push({id:"SM-018",observation:"Προσοχή σε επανάληψη πίεσης χωρίς νέο στοιχείο."});
 }
 if(v.investigation.grade==="unknown"||v.investigation.grade==="contested"){
  list.push({id:"SM-001",observation:"Ο ισχυρισμός δεν έχει ακόμη δύο ανεξάρτητες τεκμηριωμένες πηγές."});
  list.push({id:"SM-004",observation:"Η περαιτέρω έρευνα μπορεί να έχει αξία αλλά ξοδεύει χρόνο."});
 }
 if(v.deadline-v.turn<=3){
  list.push({id:"SM-010",observation:"Το παράθυρο αποφάσεων πλησιάζει στο τέλος του."});
 }
 const supporters=v.people.filter(p=>p.stance==="supporting");
 if(supporters.length>=2){
  list.push({id:"SM-023",observation:"Διαφορετικές δεσμεύσεις πρέπει να συνυπάρξουν."});
 }
 if(v.resources.budget<=2){
  list.push({id:"SM-009",observation:"Χαμηλό διαθέσιμο απόθεμα πόρων."});
 }
 if(v.publicEvents.some(e=>e.type==="counterplay")){
  list.push({id:"SM-027",observation:"Αυτόνομος ανταγωνιστής μετακινεί την κατάσταση."});
 }
 if(v.resources.exposure>=2){
  list.push({id:"SM-021",observation:"Η δημόσια αξιοπιστία δοκιμάζεται από προηγούμενη αποκάλυψη."});
 }
 if(list.length===0){
  list.push({id:"SM-015",observation:"Οι εταίροι έχουν και δικές τους επιλογές εκτός συμφωνίας."});
  list.push({id:"SM-017",observation:"Καλή σχέση και συναίνεση αποτελούν χωριστές καταστάσεις."});
 }
 return list.map(x=>({...x,pattern:byId.get(x.id)}));
}
export function buildDirectorBrief(s){
 const player=strategyPlayerView(s);
 const audit=strategyDesignerAudit(s);
 const config=SCENARIOS[s.scenario];
 const turnsLeft=Math.max(0,config.deadline-s.turn);
 const supporters=player.people.filter(p=>p.stance==="supporting");
 const undecided=player.people.filter(p=>p.stance==="undecided");
 return {
  access:"GM_ONLY_NEVER_NARRATE_DIRECTLY",
  world:{title:config.title,issue:config.issue,turn:s.turn,turnsLeft,
   support:player.support,required:player.requiredSupport,remainingBudget:player.resources.budget,
   status:s.result},
  playerKnows:{factGrade:player.investigation.grade,
   reports:player.investigation.reports.map(r=>({source:r.id,claim:r.claim,quality:r.quality}))},
  // These are diagnostic hidden model state, not verified knowledge of actual people.
  hidden:{authoredFact:audit.truth,actorMotives:audit.actorMotives,
   rivalMoves:audit.actorMotives.filter(a=>a.rivalMoves>0),
   obligations:audit.hiddenEvents.filter(x=>x.type==="obligation")},
  currentTradeoffs:{
   supporters:supporters.map(x=>x.name+" ("+x.role+")"),
   undecided:undecided.map(x=>x.name+" ("+x.role+")"),
   weakPoints:[
    ...(turnsLeft<=3?["decision-window"]:[]),
    ...(player.resources.budget<=2?["low-reserve"]:[]),
    ...(player.resources.credibility<=1?["fragile-credibility"]:[]),
    ...(supporters.length<2?["uncoordinated-coalition"]:[])
   ]
  },
  conditionalPatterns:suggestions(player).map(x=>({
   id:x.id,observation:x.observation,
   tension:x.pattern.tension,cost:x.pattern.price,
   countermove:x.pattern.countermove,delayed:x.pattern.delayed
  })),
  adjudication:{
   rule:"Resolve actual attempt before composing prose. No arbitrary winning, re-roll or NPC obedience.",
   default:"Choose a scene with a clear verdict and at most one major new complication.",
   never:"Do not reveal hidden motives/thresholds as facts to the player.",
   next:"Use structured strategyTurn for the next grounded player action."
  }
 };
}
export function buildPlayerBrief(s){
 const v=strategyPlayerView(s);
 const remaining=Math.max(0,v.deadline-v.turn);
 return {
  title:v.title,
  summary:v.issue+" — "+v.objective,
  deadline:"Απομένουν "+remaining+" γύροι για απόφαση.",
  support:"Επιβεβαιωμένη στήριξη "+v.support+"/"+v.requiredSupport,
  resources:"Διαθέσιμοι πόροι σχεδιασμού "+v.resources.budget,
  // No private actor weights. Only public roles, stances and observed reports.
  knownPeople:v.people.map(p=>({name:p.name,role:p.role,stance:p.stance})),
  evidence:{question:v.investigation.question,grade:v.investigation.grade,
   reports:v.investigation.reports.map(r=>({label:r.label,claim:r.claim,quality:r.quality}))},
  event:v.lastTurn?{result:v.lastTurn.outcome.result,text:v.lastTurn.outcome.detail}:null,
  question:"Τι κάνεις τώρα; Μπορείς να ενεργήσεις με δικά σου λόγια."
 };
}
