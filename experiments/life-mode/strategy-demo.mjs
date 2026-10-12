#!/usr/bin/env node
// 8-turn synthetic strategy / Life Mode narrative produced by the real reducer.
// Fictional data, not a creator playtest or model-driven free-text simulation.
import { beginStrategicLife, saveStrategicLife, loadStrategicLife } from "./strategic-life-bridge.mjs";
import { resolveGameMasterProposal } from "./strategic-gm-adapter.mjs";
const setup={
  life:{id:"strategy-demo-01",birthDate:"2010-04-12",startedAt:"2028-05-01",
    location:"Λύδρα (φανταστική πόλη)",cash:900},
  scenario:"local-reform",seed:13
};
const script=[
 {id:"step-01",kind:"listen",actorId:"eleni",playerText:"Ακούω την Ελένη και θέλω να μάθω τι την προβληματίζει."},
 {id:"step-02",kind:"investigate",factId:"contract-cost",playerText:"Ελέγχω πρώτα την οικονομική καταγγελία."},
 {id:"step-03",kind:"investigate",factId:"contract-cost",playerText:"Αναζητώ ανεξάρτητο έγγραφο."},
 {id:"step-04",kind:"investigate",factId:"contract-cost",playerText:"Διασταυρώνω με επίσημα στοιχεία."},
 {id:"step-05",kind:"offer",actorId:"eleni",terms:{transparency:3},
  playerText:"Προτείνω στην Ελένη δημόσιο έλεγχο."},
 {id:"step-06",kind:"listen",actorId:"nikos",playerText:"Συζητώ με τον Νίκο τους όρους αυτονομίας του."},
 {id:"step-07",kind:"offer",actorId:"nikos",terms:{autonomy:3,budget:1},
  playerText:"Προτείνω στον Νίκο ανεξάρτητο ρόλο με συγκεκριμένους πόρους."},
 {id:"step-08",kind:"coordinate",playerText:"Προσπαθώ να φέρω τους δύο συμμάχους σε κοινή συμφωνία."},
 {id:"step-09",kind:"commit",playerText:"Ζητώ έγκριση του σχεδίου."}
];
let state=beginStrategicLife(setup);
console.log("KINGMAKER / Στρατηγική δοκιμή · ηλικία 18 · υπόθεση δημοτικής μεταρρύθμισης");
for(const intent of script){
  if(state.strategy.result!=="ongoing")break;
  const {run,response}=resolveGameMasterProposal(state,intent);
  state=run;
  console.log("\n"+intent.playerText);
  console.log("["+(response.event?.result??"pending")+"] "+(response.event?.text??""));
  console.log(response.date+" · "+response.age+" ετών");
}
const loaded=loadStrategicLife(saveStrategicLife(state));
if(JSON.stringify(loaded)!==JSON.stringify(state))throw Error("Save/replay divergence");
const last=state.strategy.history.at(-1);
console.log("\nΤελική κατάσταση: "+state.strategy.result);
console.log("Επαληθευμένη τελευταία κίνηση: "+last.kind+" / "+last.outcome.result);
console.log("Προϋπολογισμός καθημερινής ζωής: €"+state.life.cash+" (χωριστός από αφηρημένους πόρους στρατηγικής)");
console.log("9 δηλωμένες προθέσεις / "+state.strategy.history.length+" εκτελεσμένες κινήσεις");
