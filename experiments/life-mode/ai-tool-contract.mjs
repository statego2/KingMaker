/**
 * Provider-neutral JSON Schema describing the AI -> GAME intent proposal.
 * Host MUST still call applySession() for live state-aware validation.
 * This is not registered with OpenAI/ChatGPT automatically.
 */
const termProps=Object.fromEntries(["transparency","autonomy","delivery","credit","budget"].map(k=>[
 k,{type:"integer",minimum:0,maximum:k==="budget"?12:3}
]));
const actionProperties={
 kind:{type:"string",description:"One supported life or strategy action kind; the route determines which."},
 playerText:{type:"string",minLength:1,maxLength:500},
 goalId:{type:"string"},title:{type:"string"},status:{type:"string"},
 planId:{type:"string"},shifts:{type:"integer"},days:{type:"integer"},
 amount:{type:"integer"},budget:{type:"integer"},fee:{type:"integer"},
 offerId:{type:"string"},subject:{type:"string"},actorId:{type:"string"},
 factId:{type:"string"},sourceId:{type:"string"},
 terms:{type:"object",additionalProperties:false,properties:termProps}
};
export const AI_ACTION_SCHEMA=Object.freeze({
 type:"object",additionalProperties:false,required:["id","route"],
 properties:{
  id:{type:"string",pattern:"^[a-zA-Z0-9_-]{1,80}$"},
  route:{type:"string",enum:["life.action","arc.begin","arc.move","arc.close","time.advance"]},
  action:{type:"object",additionalProperties:false,required:["kind"],properties:actionProperties},
  scenario:{type:"string",enum:["local-reform","venture-alliance","civic-network"]},
  days:{type:"integer",minimum:1,maximum:36525},
  playerText:{type:"string",minLength:1,maxLength:500}
 }
});
export const AI_TOOL_CONTRACT=Object.freeze({
 contract:"kingmaker-ai-command-contract-v1",
 tool:{
  name:"kingmaker_step",
  description:"Submit a player's structured intent to a deterministic fictional Life Mode rule engine. Never invent the returned outcome.",
  parameters:AI_ACTION_SCHEMA
 },
 result:{
  authoritative:"applySession(session, proposal)",
  visible:"result.player",
  private:"sessionDirectorPacket(result.session)",
  stateTransport:"saveSession(result.session), hidden from player",
  error:"Reject unsupported command, retain previous state and request an actionable rephrase."
 }
});
export function verifyAiToolContract(){
 const r=AI_ACTION_SCHEMA.properties.route.enum;
 const fields=Object.keys(AI_ACTION_SCHEMA.properties);
 const errors=[];
 if(new Set(r).size!==5)errors.push("Expected five unique routes");
 for(const x of ["id","route","action"]){if(!fields.includes(x))errors.push("Missing "+x);}
 if(AI_ACTION_SCHEMA.additionalProperties!==false)errors.push("Proposals must reject unrecognized fields");
 if(actionProperties.terms.additionalProperties!==false)errors.push("Terms must reject unknown fields");
 return {valid:!errors.length,routes:r.length,errors};
}
