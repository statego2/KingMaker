/**
 * Reusable long-life arc orchestration. Structured, deterministic research slice.
 * An arc's political/business "victory" is only a local fictional achievement.
 * It NEVER grants life money, national office, a spouse or automatic power.
 */
import {beginLife,act,playerView} from "./world-simulator.mjs";
import {beginStrategy,strategyTurn,strategyPlayerView} from "./strategic-director.mjs";
const FORMAT="kingmaker-strategy-saga-v1";
const copy=x=>structuredClone(x);
const valid=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,80}$/.test(x);
export function beginSaga({life,seed=1}={}){
 if(!life||typeof life!=="object")throw Error("Saga requires a Life Mode origin");
 if(!Number.isSafeInteger(seed))throw Error("Invalid saga seed");
 const settings={...life,seed:life.seed??seed};
 return {version:1,origin:{life:copy(settings),seed},
  life:beginLife(settings),active:null,episodes:[],actorMemory:{},commands:[]};
}
export function sagaCommand(previous,command){
 if(previous?.version!==1||!previous.origin||!Array.isArray(previous.commands))throw Error("Unknown saga format");
 if(!command||typeof command!=="object"||Array.isArray(command)||!valid(command.id))throw Error("Invalid saga command");
 if(previous.commands.some(c=>c.id===command.id))throw Error("Duplicate saga command");
 const s=copy(previous);
 switch(command.kind){
  case "begin":{
   if(s.active)throw Error("Finish or withdraw the current arc first");
   const index=s.episodes.length+1;
   const chapterSeed=s.origin.seed+(index*7919);
   if(!Number.isSafeInteger(chapterSeed)||chapterSeed<-2147483648||chapterSeed>2147483647)throw Error("Saga seed overflow");
   const chapter=beginStrategy({scenario:command.scenario,seed:chapterSeed});
   // Memory may persist for returning casts, but SUPPORT and signed promises
   // are scoped to their real episode and must be renegotiated.
   for(const a of chapter.actors){
    const key=chapter.scenario+":"+a.id;
    const past=s.actorMemory[key];
    if(past){
     a.trust=Math.max(-5,Math.min(5,past.trust));
     a.memory=[...copy(past.memory.slice(-3)),{turn:0,type:"remembered-past-episode",arc:past.episode}];
    }
   }
   s.active={index,scenario:chapter.scenario,startedAt:s.life.date,strategy:chapter};
   break;
  }
  case "move":{
   if(!s.active)throw Error("Start an arc before strategic moves");
   const payload=command.action;
   if(!payload||typeof payload!=="object"||Array.isArray(payload))throw Error("Invalid arc move");
   const move={...copy(payload),id:command.id};
   const resolved=strategyTurn(s.active.strategy,move);
   // The actual Life Mode scheduler and its independent market events continue.
   const advanced=act(s.life,{
    id:"saga-"+command.id,kind:"wait",days:7,
    playerText:typeof move.playerText==="string"&&move.playerText.trim()?
      move.playerText:"[strategy arc] "+move.kind
   });
   s.active.strategy=resolved;s.life=advanced;
   break;
  }
  case "close":{
   if(!s.active)throw Error("No active arc");
   if(s.active.strategy.result==="ongoing")throw Error("Cannot archive unresolved strategic commitments");
   const a=s.active;
   const view=strategyPlayerView(a.strategy);
   s.episodes.push({
    index:a.index,scenario:a.scenario,startedAt:a.startedAt,
    finishedAt:s.life.date,result:a.strategy.result,
    publicSupport:view.support,requiredSupport:view.requiredSupport,
    actorOutcomes:view.people.map(p=>({id:p.id,name:p.name,role:p.role,stance:p.stance})),
    // Count actually activated agreements, not unrealized intentions.
    enactedAgreements:a.strategy.commitments.filter(p=>p.status==="activated").length
   });
   for(const actor of a.strategy.actors){
    s.actorMemory[a.scenario+":"+actor.id]={
      trust:actor.trust,memory:copy(actor.memory),episode:a.index
    };
   }
   s.active=null;
   break;
  }
  case "advance":{
   if(s.active)throw Error("Resolve the active arc before a free-form life leap");
   if(!Number.isSafeInteger(command.days)||command.days<=0||command.days>36525)throw Error("Invalid days");
   s.life=act(s.life,{id:"saga-"+command.id,kind:"wait",days:command.days,
    playerText:typeof command.playerText==="string"&&command.playerText.trim()?command.playerText:"Περνά ο χρόνος."});
   break;
  }
  default:throw Error("Unsupported saga command");
 }
 s.commands.push(copy(command));
 return s;
}
export function replaySaga(initial,commands){
 if(!Array.isArray(commands))throw Error("Invalid saga actions");
 return commands.reduce(sagaCommand,initial);
}
export function sagaPlayerView(s){
 if(s?.version!==1)throw Error("Unknown saga state");
 const life=playerView(s.life);
 return {
  date:life.date,age:life.age,cash:life.cash,debt:life.debt,location:life.location,
  lifeFooter:life.footer,
  active:s.active?strategyPlayerView(s.active.strategy):null,
  previousEpisodes:copy(s.episodes),
  latestLifeMessage:life.lastEvent?.scene??null
 };
}
export function saveSaga(s){
 if(s?.version!==1||!s.origin||!Array.isArray(s.commands))throw Error("Invalid saga");
 const reconstructed=replaySaga(beginSaga(s.origin),s.commands);
 if(JSON.stringify(reconstructed)!==JSON.stringify(s))throw Error("Saga was modified outside trusted resolver");
 return JSON.stringify({format:FORMAT,origin:copy(s.origin),commands:copy(s.commands)});
}
export function loadSaga(text){
 if(typeof text!=="string"||text.length>4_000_000)throw Error("Invalid saga payload");
 let data;try{data=JSON.parse(text)}catch{throw Error("Corrupt saga JSON")}
 if(data?.format!==FORMAT||!data.origin||!Array.isArray(data.commands)||data.commands.length>10_000)
  throw Error("Unsupported saga save");
 return replaySaga(beginSaga(data.origin),data.commands);
}
