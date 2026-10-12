/**
 * Transport-neutral handoff to a model/other chat. The player-facing handoff
 * NEVER contains GM private state. A trusted host MAY request a developer bundle
 * with both private context and a replayable action log; don't paste it publicly.
 */
import {sessionPlayerView,sessionDirectorPacket,saveSession} from "./kingmaker-session.mjs";
const compact=(value,max=12000)=>{
 const json=JSON.stringify(value,null,2);
 if(json.length>max)throw Error("Context exceeds safe transfer budget");
 return json;
};
export function renderPlayerTurn(session){
 const view=sessionPlayerView(session);
 const outcome=view.verdict;
 const lines=[
  outcome.scene,
  outcome.worldEvents&&outcome.worldEvents!==outcome.scene?outcome.worldEvents:"",
  outcome.status==="failed"&&outcome.reason?"Αιτία: "+outcome.reason:"",
  "",
  view.nextPrompt,
  "",
  "——— ΚΑΤΑΣΤΑΣΗ ———",
  view.footer
 ];
 if(view.activeArc){
  lines.push("Ενεργό στρατηγικό επεισόδιο: "+view.activeArc.title+
   " · Γύρος "+view.activeArc.turn+"/"+view.activeArc.deadline+
   " · Στήριξη "+view.activeArc.support+"/"+view.activeArc.requiredSupport);
 }
 return lines.join("\n").trim();
}
export function exportChatHandoff(session,{privateForTrustedDirector=false}={}){
 const publicView=sessionPlayerView(session);
 const lines=[
  "# KINGMAKER — Playtest Continuity",
  "",
  "Status: executable experimental Life Mode; this is not published campaign state.",
  "Always keep the chat player-facing, free-form, cinematic and causal.",
  "The age-18 life, cash/debt, named goals and historic episode results below are authoritative from engine replay.",
  "Avoid replacing intents with automatic accomplishments. Do not invent NPC consent or secret facts.",
  "",
  "## Player-observable state",
  "~~~json",
  compact({
   age:publicView.age,date:publicView.date,location:publicView.location,
   cash:publicView.cash,debt:publicView.debt,
   goals:publicView.goals,plans:publicView.plans,knownPeople:publicView.knownPeople,
   activeArc:publicView.activeArc,completedArcs:publicView.completedArcs,
   recentVerdict:publicView.verdict
  }),
  "~~~",
  "",
  "## Display contract",
  "Short scene → actual verdict → open free-text next move → compact status footer.",
  "Treat free text as player intention; the structured resolver, if connected, is the authority."
 ];
 if(privateForTrustedDirector){
  lines.push("","## INTERNAL — not for player narration",
   "~~~json",compact(sessionDirectorPacket(session).privateContext,65000),"~~~",
   "## PRIVATE machine replay save", "~~~json",JSON.stringify({save:saveSession(session)}),"~~~");
 }else{
  lines.push("",
   "This PUBLIC export intentionally omits private actor motives, hidden probabilities, random seed and replay token.",
   "To resume the exact executable state, a trusted local host must separately carry the private save token.");
 }
 return lines.join("\n");
}
