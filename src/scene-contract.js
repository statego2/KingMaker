/**
 * Versioned, pure presentation adapter for legacy authored scenes (KM-009).
 * A scene's visual contract is data, NEVER a store of player or hidden world truth.
 * This module must not import engine, DOM, renderer or content to avoid state cycles.
 */
export const SCENE_PRESENTATION_VERSION="1.0";
export const SCENE_MODES=Object.freeze(["briefing","character","document","phone","map","media","warroom","timeline","dawn"]);
const DEFAULTS=Object.freeze({mode:"briefing",place:"VELIS",label:"DECISION BRIEF"});
const validText=s=>typeof s==="string"&&s.trim().length>0;
const stableId=s=>validText(s)&&/^[A-Za-z][A-Za-z0-9_-]*$/.test(s);
/**
 * @param {object} authoredScene A scene from content.js / act1b.js.
 * @param {object} config {presentation,people} from existing authored catalogue.
 * @returns {{version:string,id:string,mode:string,place:string,label:string,actors:string[],primaryActor:string|null,sourceRefs:object[],pressure:string|null,art:object,issues:string[]}}
 */
export function resolveScenePresentation(authoredScene,config={}){
  const issues=[];
  const scene=authoredScene&&typeof authoredScene==="object"?authoredScene:{};
  const id=validText(scene.id)?scene.id:"UNKNOWN_SCENE";
  if(!stableId(scene.id))issues.push("Invalid or missing scene ID");
  const raw=config.presentation?.[id];
  if(!Array.isArray(raw)||raw.length<3)issues.push("Missing presentation mapping: "+id);
  const mode=SCENE_MODES.includes(raw?.[0])?raw[0]:DEFAULTS.mode;
  if(raw&&!SCENE_MODES.includes(raw[0]))issues.push("Unknown scene mode: "+String(raw[0]));
  const place=validText(raw?.[1])?raw[1]:DEFAULTS.place;
  const label=validText(raw?.[2])?raw[2]:DEFAULTS.label;
  if(raw&&(!validText(raw[1])||!validText(raw[2])))issues.push("Missing scene place or label");
  const actorIds=Array.isArray(scene.actors)?scene.actors:[];
  if(scene.actors!==undefined&&!Array.isArray(scene.actors))issues.push("Invalid actor list");
  const actors=[];
  for(const actorId of actorIds){
    if(!validText(actorId)||!config.people?.[actorId]){
      issues.push("Unknown actor ID: "+String(actorId));
      continue;
    }
    if(!actors.includes(actorId))actors.push(actorId);
  }
  const declared=Array.isArray(scene.sources)?scene.sources:[];
  const sourceRefs=declared.filter(x=>x&&stableId(x.id)).map(x=>({id:x.id,kind:x.kind||"declared",provenance:x.provenance||"unspecified"}));
  if(scene.sources!==undefined&&!Array.isArray(scene.sources))issues.push("Invalid scene sources");
  // Existing legacy evidence lacks source identity; preserve that gap rather than inventing a source.
  const pressure=validText(scene.pressure)?scene.pressure:null;
  const artId=validText(scene.art?.id)?scene.art.id:null;
  const art={id:artId,status:artId?"authored_reference":"procedural_fallback"};
  return {version:SCENE_PRESENTATION_VERSION,id,mode,place,label,actors,primaryActor:actors[0]||null,sourceRefs,pressure,art,issues};
}
export function validateScenePresentation(scene,config={}){
  const resolved=resolveScenePresentation(scene,config);
  return {valid:resolved.issues.length===0,issues:resolved.issues,contract:resolved};
}
