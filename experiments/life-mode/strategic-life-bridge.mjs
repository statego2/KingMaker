/**
 * Experimental bridge: AI may launch a strategic episode inside a Life Mode run.
 * Every strategic turn advances the independent Life Mode calendar by a week.
 * "Influence points" are local abstract scenario resources, NEVER euros, life
 * influence or national-office claims. No official browser save key is touched.
 */
import { beginLife, act, playerView as lifeView } from "./world-simulator.mjs";
import { beginStrategy, strategyTurn, strategyPlayerView } from "./strategic-director.mjs";

const FORMAT="kingmaker-strategic-life-v1";
function clone(x){return structuredClone(x);}
function validAction(a){
 if(!a||typeof a!=="object"||Array.isArray(a)||typeof a.id!=="string"||
    !/^[A-Za-z0-9_-]{1,80}$/.test(a.id))throw Error("Invalid strategic action id");
}
export function beginStrategicLife({life,scenario="local-reform",seed=1}={}){
 if(!life||typeof life!=="object")throw Error("Life origin required");
 const origin={...life,seed:life.seed??seed};
 const initial=beginLife(origin);
 return {
  version:1,
  life:initial,
  strategy:beginStrategy({scenario,seed}),
  origin:{life:clone(origin),scenario,seed},
  actions:[]
 };
}
export function strategicLifeTurn(previous,action){
 if(previous?.version!==1||!previous.life||!previous.strategy)throw Error("Unknown strategic-life state");
 validAction(action);
 if(previous.actions.some(a=>a.id===action.id))throw Error("Duplicate strategic action");
 const episode=strategyTurn(previous.strategy,action);
 const life=act(previous.life,{
  id:"strategy-"+action.id,kind:"wait",days:7,
  playerText:typeof action.playerText==="string"&&action.playerText.trim()?
    action.playerText:"[strategy] "+action.kind
 });
 return {...previous,strategy:episode,life,actions:[...previous.actions,clone(action)]};
}
export function replayStrategicLife(initial,commands){
 if(!Array.isArray(commands))throw Error("Invalid strategic replay");
 return commands.reduce(strategicLifeTurn,initial);
}
export function strategicLifeView(s){
 if(s?.version!==1)throw Error("Unknown strategic-life state");
 const sv=strategyPlayerView(s.strategy);
 const lv=lifeView(s.life);
 return {
  date:lv.date,age:lv.age,location:lv.location,cash:lv.cash,debt:lv.debt,
  episode:sv,lifeFooter:lv.footer,
  // Only player-known Life Mode market news; don't leak unrelated seed state.
  lifeEvent:lv.lastEvent?.scene??null,
  latestDecision:sv.lastTurn?.outcome??null
 };
}
export function saveStrategicLife(s){
 if(s?.version!==1||!s.origin||!Array.isArray(s.actions))throw Error("Invalid strategic save");
 const replay=replayStrategicLife(beginStrategicLife(s.origin),s.actions);
 if(JSON.stringify(replay)!==JSON.stringify(s))throw Error("Strategic state was modified outside resolver");
 return JSON.stringify({format:FORMAT,origin:clone(s.origin),actions:clone(s.actions)});
}
export function loadStrategicLife(text){
 if(typeof text!=="string"||text.length>2_000_000)throw Error("Invalid strategic save payload");
 let payload;try{payload=JSON.parse(text);}catch{throw Error("Corrupt strategic save JSON");}
 if(payload?.format!==FORMAT||!payload.origin||!Array.isArray(payload.actions)||
    payload.actions.length>1000)throw Error("Unsupported strategic save");
 return replayStrategicLife(beginStrategicLife(payload.origin),payload.actions);
}
