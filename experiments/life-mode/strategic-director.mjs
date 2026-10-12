// KINGMAKER Strategy Director v1 — isolated pure strategic simulation.
// Numbers are deliberately abstract strategic capacity, not euros or real-world predictions.
// Structured AI commands only. Player projection MUST exclude private actor parameters.
const copy = x => structuredClone(x);
const clip = (x,a,b) => Math.min(b,Math.max(a,x));
const str = (x,label) => { if(typeof x!=="string" || !x.trim() || x.length>160)throw Error("Invalid "+label);return x.trim(); };
const int = (x,a,b,label) => { if(!Number.isSafeInteger(x)||x<a||x>b)throw Error("Invalid "+label);return x; };
function chance(seed,...p){let h=2166136261;for(const c of [seed,...p].join("|"))h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)/4294967296;}
const TYPES=new Set(["listen","investigate","share","prepare","offer","coordinate","publish","commit","wait","withdraw"]);
export const SCENARIOS=Object.freeze({
 "local-reform":{
   title:"Το συμβούλιο που δεν σε εμπιστεύεται",issue:"Μεταρρύθμιση δημοτικών υπηρεσιών",
   objective:"Πέτυχε βιώσιμη συμμαχία πριν από την ψηφοφορία",deadline:10,target:9,baseline:1,budget:9,
   fact:{id:"contract-cost",question:"Το σχέδιο υπερβαίνει τον προϋπολογισμό;",truth:true,
      sources:[{id:"rumor",group:"social",claim:true,quality:"unknown",label:"ανώνυμη ανάρτηση"},
       {id:"audit",group:"audit",claim:true,quality:"documented",label:"ανεξάρτητος έλεγχος"},
       {id:"budget",group:"public",claim:true,quality:"documented",label:"δημόσιος προϋπολογισμός"}]},
   actors:[
    {id:"eleni",name:"Ελένη",role:"δημοτική σύμβουλος",power:3,trust:1,priority:"transparency",threshold:5,outside:1,need:"Διαφάνεια",stance:"undecided"},
    {id:"nikos",name:"Νίκος",role:"επικεφαλής παράταξης",power:4,trust:0,priority:"autonomy",threshold:6,outside:2,need:"Αυτονομία",stance:"undecided"},
    {id:"maria",name:"Μαρία",role:"αντιδήμαρχος",power:3,trust:1,priority:"delivery",threshold:6,outside:2,need:"Εφικτή υλοποίηση",stance:"undecided"},
    {id:"stefanos",name:"Στέφανος",role:"αντίπαλος συνασπισμού",power:4,trust:-1,priority:"credit",threshold:10,outside:3,need:"Διατήρηση επιρροής",stance:"opposed",rival:true}]
 },
 "venture-alliance":{
   title:"Η συμφωνία των τριών",issue:"Επιχειρηματική κοινοπραξία",
   objective:"Δημιούργησε συνεργασία με δεσμεύσεις και ανεξάρτητους εταίρους",deadline:12,target:8,baseline:0,budget:8,
   fact:{id:"supply-risk",question:"Είναι αξιόπιστος ο βασικός προμηθευτής;",truth:false,
    sources:[{id:"sales-talk",group:"trade",claim:true,quality:"unknown",label:"φήμη αγοράς"},
      {id:"invoice-audit",group:"audit",claim:false,quality:"documented",label:"ανεξάρτητη οικονομική έκθεση"},
      {id:"deliveries",group:"logistics",claim:false,quality:"documented",label:"αρχεία παραδόσεων"}]},
   actors:[
    {id:"sofia",name:"Σοφία",role:"επενδύτρια",power:4,trust:0,priority:"delivery",threshold:5,outside:2,need:"Απόδοση με εκτελέσιμο σχέδιο",stance:"undecided"},
    {id:"andreas",name:"Ανδρέας",role:"τεχνικός συνιδρυτής",power:3,trust:1,priority:"autonomy",threshold:5,outside:1,need:"Πραγματικός λόγος στις αποφάσεις",stance:"undecided"},
    {id:"irini",name:"Ειρήνη",role:"διανομέας",power:3,trust:0,priority:"transparency",threshold:5,outside:2,need:"Αξιόπιστα στοιχεία",stance:"undecided"},
    {id:"petros",name:"Πέτρος",role:"ανταγωνιστής",power:3,trust:-1,priority:"credit",threshold:10,outside:3,need:"Διατήρηση συνεργατών",stance:"opposed",rival:true}]
 },
 "civic-network":{
   title:"Μια κοινότητα χωρίς αρχηγό",issue:"Εθελοντική πρωτοβουλία",
   objective:"Σύνδεσε ανεξάρτητους ανθρώπους χωρίς να τους υποχρεώνεις",deadline:14,target:8,baseline:0,budget:7,
   fact:{id:"facility-access",question:"Είναι εξασφαλισμένος ο χώρος συνάντησης;",truth:false,
    sources:[{id:"chat",group:"chat",claim:true,quality:"unknown",label:"ομαδική συνομιλία"},
      {id:"owner",group:"owner",claim:false,quality:"documented",label:"γραπτή απάντηση ιδιοκτήτη"},
      {id:"permit",group:"municipality",claim:false,quality:"documented",label:"δημόσιο μητρώο"}]},
   actors:[
    {id:"anna",name:"Άννα",role:"συντονίστρια",power:3,trust:0,priority:"autonomy",threshold:4,outside:1,need:"Ισότιμη συμμετοχή",stance:"undecided"},
    {id:"giorgos",name:"Γιώργος",role:"διαχειριστής πόρων",power:3,trust:0,priority:"delivery",threshold:5,outside:1,need:"Εφικτό πρόγραμμα",stance:"undecided"},
    {id:"vaso",name:"Βάσω",role:"δημοσιογράφος κοινότητας",power:3,trust:1,priority:"transparency",threshold:5,outside:1,need:"Τεκμηριωμένες πληροφορίες",stance:"undecided"},
    {id:"costas",name:"Κώστας",role:"επικεφαλής άλλης ομάδας",power:2,trust:-1,priority:"credit",threshold:8,outside:2,need:"Ανεξαρτησία της δικής του ομάδας",stance:"opposed",rival:true}]
 }
});
const grade=reports=>{
 const agree=reports.filter(x=>x.claim===true&&x.quality==="documented");
 const disagree=reports.filter(x=>x.claim===false&&x.quality==="documented");
 const a=new Set(agree.map(x=>x.group)).size,b=new Set(disagree.map(x=>x.group)).size;
 return a>=2?{status:"corroborated",direction:true}:b>=2?{status:"corroborated",direction:false}:
 {status:reports.length?"contested":"unknown",direction:null};
};
function support(s){
 const c=SCENARIOS[s.scenario];
 return c.baseline+s.actors.filter(a=>a.stance==="supporting").reduce((n,a)=>n+a.power,0)+(s.coordinated?1:0);
}
function actor(s,id){const a=s.actors.find(x=>x.id===id);if(!a)throw Error("Unknown actor");return a;}
function terms(raw){
 if(!raw||typeof raw!=="object"||Array.isArray(raw))throw Error("Terms required");
 return Object.fromEntries(["transparency","autonomy","delivery","credit","budget"].map(k=>[k,int(raw[k]??0,0,k==="budget"?12:3,k)]));
}
export function beginStrategy({scenario="local-reform",seed=1}={}){
 if(!SCENARIOS[scenario])throw Error("Unknown scenario");
 int(seed,-2147483648,2147483647,"seed");
 const c=SCENARIOS[scenario];
 return {version:1,scenario,seed,turn:0,result:"ongoing",
  resources:{budget:c.budget,credibility:2,preparation:0,exposure:0},
  actors:c.actors.map(a=>({...copy(a),memory:[],offers:0,consulted:false,rivalMoves:0,
   belief:{probability:Number((0.25+chance(seed,"belief",a.id)*0.5).toFixed(3)),
    confidence:0.1,heardGroups:[]}})),
  evidence:[],disclosed:false,coordinated:false,pressure:1,
  events:[],hiddenEvents:[],history:[],commitments:[]};
}
function autonomy(s){
 // Terms accepted by a third party are not indefinite: missed shared action
 // changes their incentive to stay, without any new command from the player.
 for(const promise of s.commitments){
  if(promise.status!=="pending" || s.turn<promise.dueTurn)continue;
  promise.status="expired";
  const ally=actor(s,promise.actorId);
  if(ally.stance==="supporting"){
   ally.stance="undecided";
   ally.trust=clip(ally.trust-1,-5,5);
   ally.memory.push({turn:s.turn,type:"missed-commitment",acceptedTurn:promise.acceptedTurn});
   s.events.push({turn:s.turn,type:"promise-lapse",
    text:ally.name+" ("+ally.role+") αποσύρει την προσωρινή στήριξη μετά από αναβολές χωρίς υλοποίηση."});
  }
 }
 const rival=s.actors.find(a=>a.rival);
 if(s.turn>=3&&s.turn%3===0&&support(s)<SCENARIOS[s.scenario].target&&chance(s.seed,"rival",s.turn)<.72){
  s.pressure=clip(s.pressure+1,0,10);rival.rivalMoves++;
  s.events.push({turn:s.turn,type:"counterplay",text:rival.name+" ("+rival.role+") αναπτύσσει δικό του δίκτυο."});
  s.hiddenEvents.push({turn:s.turn,type:"counterplay-motive",actorId:rival.id,reason:"Protect outside influence"});
 }
 for(const a of s.actors.filter(a=>a.stance==="supporting"&&a.trust<=-2)){
  a.stance="undecided";a.memory.push({turn:s.turn,type:"defection"});
  s.events.push({turn:s.turn,type:"defection",text:a.name+" ("+a.role+") αποσύρει τη δέσμευση."});
 }
}
export function strategyTurn(previous,command){
 if(!previous||previous.version!==1||!SCENARIOS[previous.scenario])throw Error("Unknown strategic state");
 if(previous.result!=="ongoing")throw Error("Episode closed");
 if(!command||typeof command!=="object"||Array.isArray(command))throw Error("Invalid action");
 const id=str(command.id,"id"),kind=str(command.kind,"kind");
 if(!TYPES.has(kind))throw Error("Unsupported action");
 if(previous.history.some(h=>h.id===id))throw Error("Duplicate action ID");
 const s=copy(previous),c=SCENARIOS[s.scenario],before=s.resources.budget,supportBefore=support(s);
 s.turn++;
 let result="pending",detail="",cause="";
 switch(kind){
  case "listen":{
   const a=actor(s,str(command.actorId,"actorId"));
   a.consulted=true;a.trust=clip(a.trust+1,-5,5);
   a.memory.push({turn:s.turn,type:"listened"});
   result="succeeded";detail=a.name+" ("+a.role+"): «"+a.need+"».";
   cause="Η ακρόαση βελτιώνει εμπιστοσύνη, δεν εξασφαλίζει συναίνεση.";
   break;
  }
  case "investigate":{
   if(command.factId!==c.fact.id)throw Error("Unknown fact");
   const e=c.fact.sources.find(x=>!s.evidence.some(y=>y.id===x.id));
   if(!e){result="partial";detail="Δεν υπάρχει νέα ανεξάρτητη πηγή.";cause="Η επανάληψη δεν ενισχύει τεκμηρίωση.";break;}
   if(s.resources.budget<1){result="failed";detail="Ανεπαρκείς πόροι έρευνας.";cause="Η έρευνα απαιτεί πραγματική προσπάθεια.";break;}
   s.resources.budget--;s.evidence.push(copy(e));
   result="succeeded";detail=e.label+": "+(e.claim?"υποστηρίζει":"αντικρούει")+" τον ισχυρισμό.";
   cause="Η πηγή καταγράφεται με προέλευση· η πραγματική αλήθεια παραμένει χωριστή.";
   break;
  }
  case "share":{
   const a=actor(s,str(command.actorId,"actorId"));
   const source=s.evidence.find(e=>e.id===str(command.sourceId,"source ID"));
   if(!source)throw Error("Cannot share a source the player has not discovered");
   if(a.belief.heardGroups.includes(source.group)){
    result="partial";detail=a.name+" ("+a.role+") είχε ήδη λάβει στοιχεία αυτής της αλυσίδας.";
    cause="Η αναπαραγωγή κοινής πηγής δεν αποτελεί ανεξάρτητη απόδειξη.";break;
   }
   a.belief.heardGroups.push(source.group);
   const influence=source.quality==="documented"?0.3:0.07;
   const direction=source.claim?1:0;
   a.belief.probability=Number((a.belief.probability*(1-influence)+direction*influence).toFixed(3));
   a.belief.confidence=Number(clip(a.belief.confidence+(source.quality==="documented"?0.24:0.04),0,1).toFixed(3));
   a.memory.push({turn:s.turn,type:"heard-source",sourceId:source.id,group:source.group});
   result="succeeded";detail=a.name+" ("+a.role+") μελέτησε την πηγή «"+source.label+"». Δεν υποσχέθηκε υποστήριξη.";
   cause="Το πρόσωπο ενημέρωσε τη δική του αβέβαιη πεποίθηση με βάση μια αποδιδόμενη πηγή.";
   break;
  }
  case "prepare":{
   if(s.resources.budget<1){result="failed";detail="Δεν υπάρχουν πόροι προετοιμασίας.";cause="Πραγματικός περιορισμός.";break;}
   if(s.resources.preparation>=3){result="partial";detail="Φθίνουσα οριακή απόδοση προετοιμασίας.";cause="Δεν υπάρχει αθροιστικό άπειρο bonus.";break;}
   s.resources.budget--;s.resources.preparation++;
   result="succeeded";detail="Η ομάδα ετοίμασε καλύτερο σχέδιο.";cause="Εκτέλεση με χρόνο και κόστος.";
   break;
  }
  case "offer":{
   const a=actor(s,str(command.actorId,"actorId")),t=terms(command.terms);
   if(a.rival){result="failed";detail=a.name+" ("+a.role+") αρνείται συνεργασία.";cause="Αντίθετο σχέδιο και εξωτερική επιλογή.";break;}
   if(t.budget>s.resources.budget){result="failed";detail="Μη χρηματοδοτημένη προσφορά.";cause="Υποσχέσεις χωρίς πόρους δεν είναι συμβόλαια.";break;}
   if(a.stance==="supporting"){result="partial";detail="Υπάρχει ήδη δέσμευση.";cause="Απαγορεύεται διπλή αγορά στήριξης.";break;}
   const focused=t[a.priority];
   const utility=focused*2+a.trust+(a.priority==="transparency"&&a.belief.confidence>=0.34?1:0)+Math.min(2,s.resources.preparation)+
      Math.min(2,t.budget)-a.outside-Math.floor(s.pressure/4)+(s.turn>=c.deadline-2?1:0);
   const accepted=utility>=a.threshold&&chance(s.seed,"accept",a.id,s.turn)>=.12;
   a.offers++;
   if(accepted){
    s.resources.budget-=t.budget;a.trust=clip(a.trust+1,-5,5);a.stance="supporting";
    a.memory.push({turn:s.turn,type:"agreement",terms:t});
    s.hiddenEvents.push({turn:s.turn,type:"obligation",actorId:a.id,terms:t});
    s.commitments.push({actorId:a.id,terms:t,acceptedTurn:s.turn,dueTurn:s.turn+4,status:"pending"});
    result="succeeded";detail=a.name+" ("+a.role+") αποδέχτηκε δεσμευτικούς όρους.";
    cause="Όφελος, εμπιστοσύνη και εξωτερικές επιλογές κάλυψαν το προσωπικό κατώφλι.";
   }else{
    if(a.offers>=2&&!a.consulted&&utility<a.threshold)a.trust=clip(a.trust-1,-5,5);
    a.memory.push({turn:s.turn,type:"refusal",terms:t});
    result="failed";detail=a.name+" ("+a.role+") αρνείται, διατηρώντας το δικό του σχέδιο.";
    cause=utility>=a.threshold?"Ανεξάρτητη πιθανότητα άρνησης.":"Οι όροι δεν ικανοποιούν το δικό του συμφέρον.";
   }
   break;
  }
  case "coordinate":{
   if(s.coordinated){result="partial";detail="Υπάρχει ήδη συντονισμός.";cause="Δεν στοιβάζονται διπλά bonuses.";break;}
   if(s.actors.filter(a=>a.stance==="supporting"&&!a.rival).length<2||s.resources.budget<1){
    result="failed";detail="Χρειάζονται δύο σύμμαχοι και ένας πόρος.";cause="Δίκτυο από πραγματικές δεσμεύσεις.";break;
   }
   s.coordinated=true;s.resources.budget--;
   result="succeeded";detail="Η συμμαχία συντονίζεται δημόσια.";cause="Μικρή βελτίωση συλλογικής αποτελεσματικότητας.";
   break;
  }
  case "publish":{
   if(s.disclosed){result="partial";detail="Το ζήτημα ήδη δημοσιοποιήθηκε.";cause="Όχι απεριόριστα επικοινωνιακά bonuses.";break;}
   s.disclosed=true;const g=grade(s.evidence);
   if(g.status==="corroborated"&&g.direction===c.fact.truth){
    s.resources.credibility=clip(s.resources.credibility+2,0,10);
    s.pressure=clip(s.pressure-1,0,10);
    result="succeeded";detail="Η ανεξάρτητα τεκμηριωμένη δημοσιοποίηση ενισχύει την αξιοπιστία.";
    cause="Συμφωνία δύο ανεξάρτητων τεκμηριωμένων πηγών με την πραγματικότητα.";
   }else{
    s.resources.credibility=clip(s.resources.credibility-2,0,10);
    s.resources.exposure=clip(s.resources.exposure+2,0,10);
    for(const a of s.actors.filter(a=>!a.rival))a.trust=clip(a.trust-1,-5,5);
    result="failed";detail="Πρόωρη δημοσιοποίηση εκθέτει την αξιοπιστία σου.";
    cause="Ανεπαρκής ή λανθασμένη τεκμηρίωση.";
   }
   break;
  }
  case "commit":{
   const backing=support(s);
   if(backing>=c.target&&s.resources.credibility>=1&&s.resources.exposure<=6){
    s.result="secured";result="succeeded";
    for(const p of s.commitments)if(p.status==="pending")p.status="activated";
    detail="Η συμμαχία επικυρώθηκε. Η πρωτοβουλία εγκρίθηκε." ;
    cause="Επαρκείς πραγματικές δεσμεύσεις πριν από την προθεσμία.";
   }else{
    result="failed";detail="Δεν υπάρχει εφικτή συμμαχία: "+backing+"/"+c.target+".";
    cause="Λείπει στήριξη ή νομιμοποίηση, όχι απλώς πρόθεση.";
   }
   break;
  }
  case "wait":{
   result="succeeded";detail="Ο χρόνος περνά, οι άλλοι συνεχίζουν τα σχέδιά τους.";
   cause="Χαμένη ευκαιρία λόγω παρόδου χρόνου.";break;
  }
  case "withdraw":{
   s.result="withdrawn";result="succeeded";detail="Αποσύρεσαι χωρίς να διαγράψεις δεσμεύσεις.";
   for(const p of s.commitments)if(p.status==="pending")p.status="abandoned";
   cause="Ο παίκτης επιλέγει έξοδο και διατηρεί ιστορικό.";break;
  }
 }
 if(s.result==="ongoing"){
  autonomy(s);
  if(s.turn>=c.deadline){s.result="expired";for(const p of s.commitments)if(p.status==="pending")p.status="expired";s.events.push({turn:s.turn,type:"deadline",text:"Η προθεσμία έληξε χωρίς συμφωνία."});}
 }
 s.history.push({id,turn:s.turn,kind,outcome:{result,detail,cause},
  playerText:typeof command.playerText==="string"?command.playerText.slice(0,500):null,
  cost:before-s.resources.budget,supportDelta:support(s)-supportBefore,
  events:copy(s.events.filter(e=>e.turn===s.turn))});
 return s;
}
export function replayStrategy(initial,commands){
 if(!Array.isArray(commands))throw Error("Commands must be array");
 return commands.reduce(strategyTurn,initial);
}
export function strategyPlayerView(s){
 if(!s||s.version!==1||!SCENARIOS[s.scenario])throw Error("Unknown state");
 const c=SCENARIOS[s.scenario],g=grade(s.evidence);
 return {scenario:s.scenario,title:c.title,issue:c.issue,objective:c.objective,turn:s.turn,deadline:c.deadline,
  status:s.result,support:support(s),requiredSupport:c.target,resources:copy(s.resources),
  people:s.actors.map(a=>({id:a.id,name:a.name,role:a.role,stance:a.stance,consulted:a.consulted,
   relation:a.trust>=3?"θετική":a.trust<=-2?"επιφυλακτική":"αβέβαιη"})),
  investigation:{question:c.fact.question,grade:g.status,reports:copy(s.evidence)},
  publicEvents:copy(s.events),lastTurn:s.history.length?(()=>{const h=s.history.at(-1);return {id:h.id,turn:h.turn,kind:h.kind,playerText:h.playerText,cost:h.cost,supportDelta:h.supportDelta,events:copy(h.events),outcome:{result:h.outcome.result,detail:h.outcome.detail}};})():null};
}
export function strategyDesignerAudit(s){
 if(!s||s.version!==1)throw Error("Unknown state");
 return {seed:s.seed,truth:SCENARIOS[s.scenario].fact.truth,pressure:s.pressure,
  actorMotives:s.actors.map(a=>({id:a.id,priority:a.priority,threshold:a.threshold,outside:a.outside,
   trust:a.trust,stance:a.stance,memory:copy(a.memory),belief:copy(a.belief),rivalMoves:a.rivalMoves})),
  hiddenEvents:copy(s.hiddenEvents),commitments:copy(s.commitments)};
}
