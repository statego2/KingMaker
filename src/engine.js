
import {scenes,inboxSeed} from "./content.js";
const KEY="kingmaker_statecraft_v02";
const clamp=n=>Math.max(0,Math.min(100,n));
const rel=(trust=40,respect=40)=>({familiarity:5,affection:40,trust,respect,fear:0,envy:0,grievance:0,dependency:0});
export function fresh(){return{version:"0.2",i:0,flags:{},player:{credibility:18,political_capital:4,attention:4,public_reputation:3,elite_reputation:8},world:{government_stability:46,public_trust:38,information_quality:56,government_pressure:42,coalition_pressure:38,information_pressure:31},rel:{lea_marin:rel(68,64),mara_eltan:rel(58,55),elena_varin:rel(18,46),ivo_marek:rel(27,31),nela_orr:rel(40,42),niko_arven:rel(40,38),silas_koren:rel(34,38),nadia_serrin:rel(35,38),selma_aric:rel(38,43),anton_beran:rel(37,42)},silas:{verification_depth:0,response_speed:0,disclosure_style:0,observations:0},inbox:inboxSeed.map(x=>({...x})),scheduled:[],history:[],finished:false}};
export function load(){try{const s=JSON.parse(localStorage.getItem(KEY));return s?.version==="0.2"?s:fresh()}catch{return fresh()}}
export function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
export function reset(){const s=fresh();save(s);return s}
export function scene(s){return scenes[s.i]||null}
export function progress(s){return s.finished?100:Math.round((s.i/scenes.length)*100)}
function patch(base,chg){for(const[k,v]of Object.entries(chg||{}))base[k]=clamp((base[k]??0)+v)}
function effects(s,e){
patch(s.player,e.player);patch(s.world,e.world);
for(const[a,ch]of Object.entries(e.rel||{})){s.rel[a]??=rel();patch(s.rel[a],ch)}
Object.assign(s.flags,e.flags||{});
if(e.silas){s.silas[e.silas]=(s.silas[e.silas]||0)+.25;s.silas.observations++}
if(e.callback)s.scheduled.push({due:s.i+e.callback.after,...e.callback});
}
function due(s){const now=s.scheduled.filter(x=>x.due<=s.i);s.scheduled=s.scheduled.filter(x=>x.due>s.i);for(const x of now)s.inbox.unshift({id:"cb_"+s.i+"_"+x.subject,from:x.from,subject:x.subject,body:x.body,unread:true})}
export function commit(s,opt){const n=structuredClone(s);effects(n,opt.effects||{});n.history.push({scene:scene(s).id,chapter:scene(s).chapter,choice:opt.id,title:opt.title,quality:opt.quality,result:opt.result});n.i++;due(n);if(n.i>=scenes.length)n.finished=true;save(n);return n}
export function readMsg(s,id){const n=structuredClone(s);const m=n.inbox.find(x=>x.id===id);if(m)m.unread=false;save(n);return n}
export function relationship(r){if(!r)return"Unknown";if(r.grievance>=50)return"Active grievance";if(r.trust>=60&&r.respect>=60)return"Strong confidence";if(r.trust>=50||r.respect>=55)return"Constructive";if(r.trust<=30)return"Guarded";return"Unclear"}
export function quality(s){if(!s.history.length)return{v:0,label:"—"};const v=s.history.reduce((a,x)=>a+x.quality,0)/s.history.length;return{v,label:v>=.85?"Excellent":v>=.70?"Strong":v>=.55?"Mixed":"Fragile"}}
