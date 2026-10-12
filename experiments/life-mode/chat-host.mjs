#!/usr/bin/env node
/**
 * Local newline-delimited JSON protocol for any external AI host.
 * It does NOT include, call or emulate a language model. The host is expected
 * to keep the "save" response private and show only "player" to end users.
 *
 * default: public-only payloads in process-memory
 * --transport: include replayable save strings (PRIVATE machine protocol)
 * --director: include private GM notes (PRIVATE machine protocol)
 */
import {createInterface} from "node:readline";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {createSession,applySession,sessionPlayerView,sessionDirectorPacket,
 saveSession,loadSession,sessionBootstrap} from "./kingmaker-session.mjs";

const isObj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const allowed=(obj,fields)=>{
 if(!isObj(obj))throw Error("Invalid host request");
 for(const key of Object.keys(obj))if(!fields.includes(key))throw Error("Unauthorized request field "+key);
};
function defaultLife(){
 return {id:"local-life-test",birthDate:"2010-04-12",startedAt:"2028-05-01",
  location:"Θεσσαλονίκη",cash:900,debt:0};
}
export function createLocalHost({transport=false,director=false}={}){
 let current=null;
 const answer=(type,extra={})=>{
  if(!current)throw Error("No active session: send start or restore");
  return {ok:true,type,...extra,player:sessionPlayerView(current),
   ...(transport?{save:saveSession(current)}:{}),
   ...(director?{director:sessionDirectorPacket(current)}:{})};
 };
 return {
  request(request){
   allowed(request,["op","life","seed","save","command"]);
   const op=request.op;
   if(op==="catalog")return {ok:true,type:"catalog",catalog:sessionBootstrap()};
   if(op==="start"){
    if(request.command!==undefined||request.save!==undefined)throw Error("Start cannot include saved command");
    current=createSession({life:request.life??defaultLife(),seed:request.seed??1});
    return answer("started");
   }
   if(op==="restore"){
    if(typeof request.save!=="string"||request.life!==undefined||request.command!==undefined)
     throw Error("Restore requires a valid save token only");
    current=loadSession(request.save);
    return answer("restored");
   }
   if(!current)throw Error("No active session");
   if(op==="step"){
    if(!isObj(request.command)||request.save!==undefined||request.life!==undefined)throw Error("Step requires a structured command");
    const {session,receipt}=applySession(current,request.command);
    current=session;
    return answer("resolved",{receipt});
   }
   if(op==="state"){
    if(request.command!==undefined||request.save!==undefined)throw Error("State has no command");
    return answer("state");
   }
   throw Error("Unsupported host operation");
  },
  snapshot:()=>current?saveSession(current):null
 };
}
export async function runCli(argv=process.argv.slice(2)){
 const host=createLocalHost({
  transport:argv.includes("--transport"),director:argv.includes("--director")
 });
 const rl=createInterface({input:process.stdin,crlfDelay:Infinity,terminal:false});
 for await(const line of rl){
  if(!line.trim())continue;
  try{
   const request=JSON.parse(line);
   process.stdout.write(JSON.stringify(host.request(request))+"\n");
  }catch(error){
   process.stdout.write(JSON.stringify({ok:false,error:error instanceof Error?error.message:"Unknown failure"})+"\n");
  }
 }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 await runCli();
}
