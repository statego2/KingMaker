
import {scenes,inboxSeed} from "./content.js";
const KEY="kingmaker_statecraft_v03";
const OLD_KEY="kingmaker_statecraft_v02";
const clamp=n=>Math.max(0,Math.min(100,n));
const rel=(trust=40,respect=40)=>({familiarity:5,affection:40,trust,respect,fear:0,envy:0,grievance:0,dependency:0});

function baseRelations(){
  return {
    lea_marin:rel(68,64),mara_eltan:rel(58,55),elena_varin:rel(18,46),ivo_marek:rel(27,31),
    nela_orr:rel(40,42),niko_arven:rel(40,38),silas_koren:rel(34,38),nadia_serrin:rel(35,38),
    selma_aric:rel(38,43),anton_beran:rel(37,42),adrian_kessar:rel(40,46),mira_solen:rel(40,46),
    viktor_sarin:rel(38,48),liora_venn:rel(40,46)
  };
}

export function fresh(){
  return {
    version:"0.3",
    i:0,
    flags:{},
    player:{credibility:18,political_capital:4,attention:4,public_reputation:3,elite_reputation:8},
    world:{government_stability:46,public_trust:38,information_quality:56,government_pressure:42,coalition_pressure:38,information_pressure:31},
    routes:{reform_accord:50,reconstruction:50,civic_compact:50},
    institutions:{nso_capability:25,nso_legitimacy:30,nso_personalization:15},
    rel:baseRelations(),
    promises:[],
    silas:{verification_depth:0,response_speed:0,disclosure_style:0,observations:0},
    inbox:inboxSeed.map(x=>({...x})),
    scheduled:[],
    history:[],
    finished:false
  };
}

function normalize(s){
  const n=structuredClone(s||fresh());
  n.version="0.3";
  n.routes??={reform_accord:50,reconstruction:50,civic_compact:50};
  n.institutions??={nso_capability:25,nso_legitimacy:30,nso_personalization:15};
  n.promises??=[];
  n.rel??={};
  for(const [id,r] of Object.entries(baseRelations())) n.rel[id]??=r;
  n.finished=Number.isInteger(n.i) ? n.i>=scenes.length : false;
  return n;
}

export function load(){
  try{
    const current=localStorage.getItem(KEY);
    if(current) return normalize(JSON.parse(current));
    const old=localStorage.getItem(OLD_KEY);
    if(old){
      const migrated=normalize(JSON.parse(old));
      save(migrated);
      return migrated;
    }
    return fresh();
  }catch{return fresh()}
}
export function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
export function reset(){const s=fresh();save(s);return s}
export function scene(s){return scenes[s.i]||null}
export function progress(s){return s.finished?100:Math.round((s.i/scenes.length)*100)}

function patch(base,chg){for(const[k,v]of Object.entries(chg||{}))base[k]=clamp((base[k]??0)+v)}

function applyPromise(s,p){
  if(!p)return;
  const existing=s.promises.find(x=>x.id===p.id);
  if(existing) Object.assign(existing,p);
  else s.promises.push({...p,status:p.status||"active",createdAt:s.i});
}

function effects(s,e){
  patch(s.player,e.player);
  patch(s.world,e.world);
  patch(s.routes,e.routes);
  patch(s.institutions,e.institutions);

  for(const[a,ch]of Object.entries(e.rel||{})){
    s.rel[a]??=rel();
    patch(s.rel[a],ch);
  }

  Object.assign(s.flags,e.flags||{});
  if(e.silas){
    s.silas[e.silas]=(s.silas[e.silas]||0)+.25;
    s.silas.observations++;
  }
  if(e.promise) applyPromise(s,e.promise);
  if(e.callback) s.scheduled.push({due:s.i+e.callback.after,...e.callback});
}

function due(s){
  const now=s.scheduled.filter(x=>x.due<=s.i);
  s.scheduled=s.scheduled.filter(x=>x.due>s.i);
  for(const x of now){
    s.inbox.unshift({
      id:"cb_"+s.i+"_"+x.subject,
      from:x.from,subject:x.subject,body:x.body,unread:true
    });
  }
}

export function commit(s,opt){
  const n=structuredClone(s);
  const current=scene(s);
  effects(n,opt.effects||{});
  n.history.push({
    scene:current.id,
    chapter:current.chapter,
    choice:opt.id,
    verb:opt.verb,
    title:opt.title,
    quality:opt.quality,
    result:opt.result,
    debrief:opt.debrief
  });
  n.i++;
  due(n);
  if(n.i>=scenes.length)n.finished=true;
  save(n);
  return n;
}

export function readMsg(s,id){
  const n=structuredClone(s);
  const m=n.inbox.find(x=>x.id===id);
  if(m)m.unread=false;
  save(n);
  return n;
}

export function relationship(r){
  if(!r)return"Unknown";
  if(r.grievance>=50)return"Active grievance";
  if(r.trust>=60&&r.respect>=60)return"Strong confidence";
  if(r.trust>=50||r.respect>=55)return"Constructive";
  if(r.trust<=30)return"Guarded";
  return"Unclear";
}

export function quality(s){
  if(!s.history.length)return{v:0,label:"—"};
  const v=s.history.reduce((a,x)=>a+x.quality,0)/s.history.length;
  return{v,label:v>=.85?"Excellent":v>=.70?"Strong":v>=.55?"Mixed":"Fragile"};
}
