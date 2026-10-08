import {people} from "./content.js";
import {load,reset,scene,commit,readMsg,relationship} from "./engine.js";
import {meta} from "./redesign-scenes.js";
import {createSceneViews} from "./scene-renderer.js";

let state=load();
let screen="scene";
let selected=null;
let result=null;
let analysis=false;
let contextOpen=false;
let kitOpen=false;

const root=document.querySelector("#app");
const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
const bodyOf=s=>s?(typeof s.body==="function"?s.body(state):s.body)||[]:[];
const factsOf=s=>s?(typeof s.evidence==="function"?s.evidence(state):s.evidence)||[]:[];
const choicesOf=s=>s?(typeof s.choices==="function"?s.choices(state):s.choices)||[]:[];

function icon(name){
  const c='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const m={
    menu:'<svg '+c+'><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close:'<svg '+c+'><path d="M6 6l12 12M18 6 6 18"/></svg>',
    back:'<svg '+c+'><path d="m15 18-6-6 6-6"/></svg>',
    arrow:'<svg '+c+'><path d="m9 18 6-6-6-6"/></svg>',
    check:'<svg '+c+'><path d="m5 12 4 4L19 6"/></svg>',
    info:'<svg '+c+'><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    mail:'<svg '+c+'><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    people:'<svg '+c+'><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16.5 3.13a4 4 0 0 1 0 7.75"/></svg>',
    graph:'<svg '+c+'><circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m11 7-5 9m7-9 5 9M7 18h10"/></svg>',
    archive:'<svg '+c+'><path d="M4 5h16v4H4zM6 9h12v11H6zM10 13h4"/></svg>'
  };
  return m[name]||m.info;
}


function render(){
  const s=scene(state);
  const cls=s?"visual-"+meta(s).mode:"visual-dawn";
  root.innerHTML='<div class="km '+cls+'">'+
    (screen==="scene"?renderScene():renderUtility())+
    (contextOpen?renderContext():"")+
    (kitOpen?renderKit():"")+
  '</div>';
  bind();
}




function renderScene(){return createSceneViews({state,selected,result,analysis,icon}).renderScene()}
function renderContext(){return createSceneViews({state,selected,result,analysis,icon}).renderContext()}

function renderKit(){
  const unread=state.inbox.filter(x=>x.unread).length;
  const items=[
    ["inbox","mail","Inbox",unread?unread+" new":"clear"],
    ["people","people","People","dossiers"],
    ["power","graph","Power","access lens"],
    ["archive","archive","Archive",state.history.length+" entries"]
  ];
  return '<div class="overlay" data-close-kit><section class="kit" onclick="event.stopPropagation()">'+
    '<header><div><span>FIELD KIT</span><h2>Strategic instruments</h2></div><button data-close-kit class="icon-btn">'+icon("close")+'</button></header>'+
    '<div class="kit-grid">'+items.map(([id,ic,n,m])=>'<button data-screen="'+id+'"><span>'+icon(ic)+'</span><strong>'+n+'</strong><small>'+m+'</small></button>').join("")+'</div>'+
    '<p>Open an instrument only when the problem calls for it. The political moment stays primary.</p>'+
  '</section></div>';
}


function utilityHeader(kicker,title,metaText=""){
  return '<header class="utility-head"><button data-back class="icon-btn">'+icon("back")+'</button><div><span>'+esc(kicker)+'</span><h1>'+esc(title)+'</h1></div><small>'+esc(metaText)+'</small></header>';
}

function renderUtility(){
  if(screen==="inbox")return renderInbox();
  if(screen==="people")return renderPeople();
  if(screen==="power")return renderPower();
  return renderArchive();
}

function renderInbox(){
  const unread=state.inbox.filter(x=>x.unread).length;
  return '<main class="utility">'+utilityHeader("INBOX","Incoming intelligence",unread+" unread")+
    '<div class="scroll-list messages">'+state.inbox.map(m=>'<button data-msg="'+m.id+'" class="message '+(m.unread?"unread":"")+'"><span class="avatar">'+esc((m.from||"?").split(" ").map(x=>x[0]).join("").slice(0,2))+'</span><span class="msg-copy"><small>'+esc(m.from)+'</small><strong>'+esc(m.subject)+'</strong><em>'+esc(m.body)+'</em></span><b>'+(m.unread?"NEW":"FILED")+'</b></button>').join("")+'</div></main>';
}

function relLabel(r){
  if(!r)return"Unknown";
  if(r.grievance>=25)return"Rival";
  if(r.trust>=60&&r.respect>=55)return"Trusted";
  if(r.respect>=55)return"Useful";
  if(r.trust<=30)return"Guarded";
  return relationship(r);
}

function renderPeople(){
  const preferred=["elena_varin","mara_eltan","lea_marin","silas_koren","niko_arven"];
  const ids=[...preferred,...Object.keys(state.rel).filter(id=>people[id]&&!preferred.includes(id))];
  return '<main class="utility">'+utilityHeader("PEOPLE","Power has a face","PLAYER ASSESSMENT")+
    '<div class="scroll-list people">'+ids.map((id,i)=>{const p=people[id],r=state.rel[id]||{};return '<article class="person"><div class="face f'+((i%5)+1)+'"><span>'+esc(p.initials)+'</span></div><div><small>'+esc(p.role)+'</small><strong>'+esc(p.name)+'</strong><em>'+esc(p.note)+'</em></div><b>'+esc(relLabel(r))+'</b></article>'}).join("")+'</div></main>';
}

function edge([x1,y1,x2,y2]){
  const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),ang=Math.atan2(dy,dx)*180/Math.PI;
  return '<i class="edge" style="left:'+x1+'%;top:'+y1+'%;width:'+len+'%;transform:rotate('+ang+'deg)"></i>';
}
function node([id,x,y]){
  const p=id==="player"?{initials:"YOU",name:"You"}:people[id]||{initials:"?",name:id};
  return '<div class="node '+(id==="player"?"you":"")+'" style="left:'+x+'%;top:'+y+'%"><span>'+esc(p.initials)+'</span><b>'+esc(p.name)+'</b></div>';
}
function route(name,v){
  v=clamp(v);
  return '<article><div><small>'+esc(name)+'</small><strong>'+Math.round(v)+'%</strong></div><i><em style="width:'+v+'%"></em></i></article>';
}

function renderPower(){
  const later=state.i>=9;
  const nodes=later
    ?[["elena_varin",50,14],["adrian_kessar",21,37],["mira_solen",79,37],["player",50,57],["silas_koren",23,78],["niko_arven",77,78]]
    :[["elena_varin",50,14],["lea_marin",21,37],["mara_eltan",79,37],["player",50,57],["niko_arven",23,78],["silas_koren",77,78]];
  const edges=[[50,57,50,14],[50,57,21,37],[50,57,79,37],[50,57,23,78],[50,57,77,78]];
  return '<main class="utility power">'+utilityHeader("POWER","Coalition map","ACCESS LENS")+
    '<div class="network">'+edges.map(edge).join("")+nodes.map(node).join("")+'</div>'+
    '<div class="route-strip">'+route("Reform",state.routes?.reform_accord)+route("Reconstruction",state.routes?.reconstruction)+route("Civic",state.routes?.civic_compact)+'</div></main>';
}

function renderArchive(){
  const h=state.history.slice().reverse(),promises=state.promises||[];
  return '<main class="utility">'+utilityHeader("ARCHIVE","Decisions on record",h.length+" entries")+
    '<div class="scroll-list archive">'+
      (promises.length?'<section class="commitments"><span>ACTIVE COMMITMENTS</span>'+promises.map(p=>'<article><strong>'+esc(p.text)+'</strong><small>'+esc(p.status||"active")+'</small></article>').join("")+'</section>':"")+
      (h.length?h.map(x=>'<article class="archive-row"><span>CH '+esc(x.chapter)+'</span><div><strong>'+esc(x.title)+'</strong><em>'+esc(x.result)+'</em></div></article>').join(""):'<div class="empty">No decisions yet.</div>')+
      '<button class="reset" data-reset>Reset run</button>'+
    '</div></main>';
}


function bind(){
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{selected=choicesOf(scene(state)).find(x=>x.id===b.dataset.choice)||null;render();document.querySelector(".choice.active")?.scrollIntoView({block:"nearest",inline:"nearest"});});
  document.querySelector("[data-cancel]")?.addEventListener("click",()=>{selected=null;render()});
  document.querySelector("[data-commit]")?.addEventListener("click",()=>{if(!selected)return;const current=scene(state);const opt=selected;state=commit(state,opt);selected=null;analysis=false;result={...opt,_scene:current};render()});
  document.querySelector("[data-analysis]")?.addEventListener("click",()=>{analysis=!analysis;render()});
  document.querySelector("[data-next]")?.addEventListener("click",()=>{result=null;analysis=false;render()});
  document.querySelector("[data-context]")?.addEventListener("click",()=>{contextOpen=true;render()});
  document.querySelectorAll("[data-close-context]").forEach(b=>b.onclick=()=>{contextOpen=false;render()});
  document.querySelector("[data-kit]")?.addEventListener("click",()=>{kitOpen=true;render()});
  document.querySelectorAll("[data-close-kit]").forEach(b=>b.onclick=()=>{kitOpen=false;render()});
  document.querySelectorAll("[data-screen]").forEach(b=>b.onclick=()=>{screen=b.dataset.screen;kitOpen=false;selected=null;render()});
  document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>{screen="scene";render()});
  document.querySelectorAll("[data-msg]").forEach(b=>b.onclick=()=>{state=readMsg(state,b.dataset.msg);render()});
  document.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>{if(confirm("Reset this run?")){state=reset();screen="scene";selected=null;result=null;analysis=false;contextOpen=false;kitOpen=false;render()}});
}
render();
