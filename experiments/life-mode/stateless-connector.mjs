/**
 * Stateless host-side facade for future AI connectors.
 *
 * Trusted application/server stores replay JSON outside the model's visible chat.
 * Each tool invocation loads it, applies exactly one action, returns the new
 * private save and the PUBLIC authoritative projection.
 *
 * This module is NOT a deployed remote endpoint, API authentication service,
 * or LLM integration. Never expose privateSave to the player.
 */
import {createSession,applySession,saveSession,loadSession,
 sessionPlayerView,sessionDirectorPacket} from "./kingmaker-session.mjs";
const assertSave=x=>{
 if(typeof x!=="string"||x.length<10||x.length>6_000_000)throw Error("Invalid trusted save");
 return x;
};
export function initializeGame({life,seed=1}={}){
 const s=createSession({life,seed});
 return {privateSave:saveSession(s),player:sessionPlayerView(s)};
}
export function executeGameTurn({privateSave,command}={}){
 const previous=loadSession(assertSave(privateSave));
 const result=applySession(previous,command);
 return {
  privateSave:saveSession(result.session),
  player:result.player,
  receipt:result.receipt
 };
}
export function inspectGame({privateSave,intentText=null,includeDirector=false}={}){
 const session=loadSession(assertSave(privateSave));
 const out={player:sessionPlayerView(session)};
 if(includeDirector)out.director=sessionDirectorPacket(session,{intentText});
 return out;
}
