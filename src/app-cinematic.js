/* KINGMAKER — premium editorial presentation layer v5.
   Campaign mechanics stay in content.js / engine.js. */
import {people} from "./content.js";
import {load,save,reset,scene,progress,commit,readMsg,relationship,quality} from "./engine.js";

let state=load(),tab="play",selected=null,analysis=false,last=null,contextOpen=false;
const root=document.querySelector("#app");

const nav=[
  ["play","building","Play"],
  ["inbox","mail","Inbox"],
  ["people","people","People"],
  ["power","bars","Power"],
  ["archive","folder","Archive"]
];

const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const clamp=n=>Math.max(0,Math.min(100,Number(n)||0));
const resolveBody=s=>s?(typeof s.body==="function"?s.body(state):s.body)||[]:[];
const resolveEvidence=s=>s?(typeof s.evidence==="function"?s.evidence(state):s.evidence)||[]:[];
const resolveChoices=s=>s?(typeof s.choices==="function"?s.choices(state):s.choices)||[]:[];

function icon(name){
  const c='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const m={
    building:'<svg '+c+'><path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M3 10h18L12 3 3 10Z"/></svg>',
    mail:'<svg '+c+'><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    people:'<svg '+c+'><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16.5 3.13a4 4 0 0 1 0 7.75"/></svg>',
    bars:'<svg '+c+'><path d="M4 20V10m6 10V4m6 16v-7m4 7V7"/></svg>',
    folder:'<svg '+c+'><path d="M3 6h6l2 2h10v11H3z"/></svg>',
    clock:'<svg '+c+'><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    document:'<svg '+c+'><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 12h6M9 16h6"/></svg>',
    vote:'<svg '+c+'><path d="M4 20h16M6 17V8m4 9V8m4 9V8m4 9V8M4 8h16L12 3 4 8Z"/></svg>',
    arrow:'<svg '+c+'><path d="m9 18 6-6-6-6"/></svg>',
    check:'<svg '+c+'><path d="m5 12 4 4L19 6"/></svg>',
    shield:'<svg '+c+'><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    info:'<svg '+c+'><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    close:'<svg '+c+'><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  return m[name]||m.document;
}

function sceneTone(s){
  const id=s?.id||"",ch=s?.chapter||"";
  if(id==="C01_S01")return "briefing";
  if(id==="C01_S02")return "assembly";
  if(id==="C01_S03")return "presidency";
  if(id==="C02_S01")return "sera";
  if(id==="C02_S02")return "signal";
  if(id==="C02_S03")return "coalition";
  if(id==="C03_S01")return "file";
  if(id==="C03_S02")return "secure";
  if(id==="C03_S03")return "press";
  if(ch==="04")return "presidency";
  if(ch==="05")return "coalition";
  if(ch==="06")return "dawn";
  return "briefing";
}

function sceneMeta(s){
  const t=sceneTone(s);
  const map={
    briefing:["VELIS · 07:12","Decision brief"],
    assembly:["ASSEMBLY","Procedural window"],
    presidency:["PRESIDENCY","Executive brief"],
    sera:["SERA","Regional brief"],
    signal:["SOURCE CHECK","Verification brief"],
    coalition:["COALITION","Formation brief"],
    file:["HARBOR FILE","Evidence brief"],
    secure:["SECURE CHANNEL","Integrity brief"],
    press:["PUBLIC LINE","Communications brief"],
    dawn:["GOVERNMENT AT DAWN","Formation brief"]
  };
  return map[t]||map.briefing;
}

function header(){
  const s=scene(state),p=progress(state);
  return '<header class="km-header">'+
    '<div class="km-brand"><span class="km-mark">K</span><strong>KINGMAKER</strong></div>'+
    '<div class="km-progress"><span>'+(s?'CH '+esc(s.chapter)+' · '+esc(s.chapterTitle):'ACT I COMPLETE')+'</span><div><i style="width:'+p+'%"></i></div></div>'+
  '</header>';
}

function dock(){
  return '<nav class="km-dock">'+nav.map(([id,ic,label])=>
    '<button class="'+(tab===id?'active':'')+'" data-tab="'+id+'"><span>'+icon(ic)+'</span><b>'+label+'</b></button>'
  ).join("")+'</nav>';
}

function render(){
  root.innerHTML='<div class="km-app">'+header()+'<main class="km-main">'+screen()+'</main>'+dock()+(contextOpen?contextModal():'')+'</div>';
  bind();
}

function screen(){
  if(tab==="play")return play();
  if(tab==="inbox")return inbox();
  if(tab==="people")return peopleScreen();
  if(tab==="power")return power();
  return archive();
}

function compactNarrative(s){
  const body=resolveBody(s);
  if(!body.length)return "";
  const text=body.join(" ");
  return '<p>'+esc(text)+'</p>';
}

function factItem(e){
  const key=(e.label||"").toLowerCase();
  const ic=key.includes("clock")||key.includes("window")?"clock":key.includes("vote")||key.includes("whip")?"vote":"document";
  const cls=e.type==="confirmed"?"confirmed":e.type==="uncertain"?"uncertain":"neutral";
  return '<article class="brief-fact '+cls+'">'+
    '<span>'+icon(ic)+'</span><div><small>'+esc(e.label)+'</small><strong>'+esc(e.value)+'</strong><em>'+esc(e.note)+'</em></div>'+
  '</article>';
}

function choiceItem(x,i){
  const on=selected?.id===x.id;
  return '<button class="editorial-choice '+(on?'selected':'')+'" data-choice="'+x.id+'">'+
    '<span class="choice-index">'+String.fromCharCode(65+i)+'</span>'+
    '<span class="choice-copy"><small>'+esc(x.verb||"Choose")+'</small><strong>'+esc(x.title)+'</strong><em>'+esc(x.sub)+'</em></span>'+
    '<span class="choice-arrow">'+(on?icon("check"):icon("arrow"))+'</span>'+
  '</button>';
}

function play(){
  if(state.finished&&!last)return finale();
  if(last)return consequence(last);
  const s=scene(state),evidence=resolveEvidence(s).slice(0,3),choices=resolveChoices(s),meta=sceneMeta(s);
  return '<section class="play-editorial '+(choices.length>=4?'dense':'')+'">'+
    '<article class="brief-sheet '+sceneTone(s)+'">'+
      '<div class="brief-top"><div><span>'+esc(meta[1])+'</span><small>'+esc(meta[0])+'</small></div><button data-context>'+icon("info")+'<b>Context</b></button></div>'+
      '<div class="brief-title"><h1>'+esc(s.title)+'</h1><span class="chapter-stamp">CH '+esc(s.chapter)+'</span></div>'+
      '<div class="brief-narrative">'+compactNarrative(s)+'</div>'+
      '<div class="brief-facts">'+evidence.map(factItem).join("")+'</div>'+
    '</article>'+
    '<section class="decision-sheet">'+
      '<div class="decision-title"><div><span>YOUR DECISION</span><h2>'+esc(s.question)+'</h2></div></div>'+
      '<div class="editorial-choices">'+choices.map(choiceItem).join("")+'</div>'+
      (selected?'<div class="decision-confirm"><button class="subtle" data-cancel>Change</button><button class="primary" data-commit>Confirm '+icon("arrow")+'</button></div>':'')+
    '</section>'+
  '</section>';
}

function contextModal(){
  const s=scene(state),body=resolveBody(s);
  return '<div class="modal-backdrop" data-close-context><section class="context-modal" onclick="event.stopPropagation()">'+
    '<header><div><span>FULL CONTEXT</span><h2>'+esc(s?.title||"")+'</h2></div><button data-close-context>'+icon("close")+'</button></header>'+
    '<div class="context-copy">'+body.map(p=>'<p>'+esc(p)+'</p>').join("")+'</div>'+
    '<button class="primary wide" data-close-context>Back to decision</button>'+
  '</section></div>';
}

function consequence(opt){
  const s=opt._scene||scene(state);
  return '<section class="result-view">'+
    '<div class="result-card premium"><span>CONSEQUENCE</span><h1>'+esc(opt.result)+'</h1>'+
      (analysis?'<div class="analysis-copy"><small>STRATEGIC READ</small><p>'+esc(opt.debrief)+'</p></div>':'<p>Η απόφαση καταγράφηκε. Κάποιες συνέπειες θα φανούν αργότερα.</p>')+
    '</div>'+
    '<div class="result-actions"><button class="subtle" data-analysis>'+(analysis?'Hide reasoning':'Inspect reasoning')+'</button><button class="primary" data-next>Continue '+icon("arrow")+'</button></div>'+
  '</section>';
}

function inbox(){
  const msgs=state.inbox.slice(0,5),unread=state.inbox.filter(x=>x.unread).length;
  return '<section class="utility-screen"><header class="utility-header"><div><span>INBOX</span><h1>Incoming intelligence</h1></div><b>'+unread+'<small>UNREAD</small></b></header>'+
    '<div class="message-list">'+msgs.map(m=>'<button class="message-row '+(m.unread?'unread':'')+'" data-msg="'+m.id+'">'+
      '<span class="avatar">'+esc((m.from||"?").split(" ").map(x=>x[0]).join("").slice(0,2))+'</span>'+
      '<span class="message-copy"><small>'+esc(m.from)+'</small><strong>'+esc(m.subject)+'</strong><em>'+esc(m.body)+'</em></span>'+
      '<span class="message-state">'+(m.unread?'NEW':'FILED')+'</span><span class="row-arrow">'+icon("arrow")+'</span>'+
    '</button>').join("")+'</div></section>';
}

function peopleScreen(){
  const pref=["elena_varin","mara_eltan","lea_marin","silas_koren","niko_arven"];
  const ids=[...pref,...Object.keys(state.rel).filter(id=>people[id]&&!pref.includes(id))].slice(0,5);
  return '<section class="utility-screen"><header class="utility-header"><div><span>PEOPLE</span><h1>Power has a face</h1></div></header>'+
    '<div class="person-list">'+ids.map((id,i)=>personRow(id,i)).join("")+'</div></section>';
}

function relationLabel(r){
  if(!r)return"Unknown";
  if(r.grievance>=25)return"Rival";
  if(r.trust>=60&&r.respect>=55)return"Trusted";
  if(r.respect>=55)return"Useful";
  if(r.trust<=30)return"Guarded";
  return relationship(r);
}

function personRow(id,i){
  const p=people[id],r=state.rel[id]||{},label=relationLabel(r),cls=label.toLowerCase().replaceAll(" ","-");
  return '<article class="person-row"><div class="portrait p'+(i+1)+'"><span>'+esc(p.initials)+'</span></div>'+
    '<div class="person-copy"><small>'+esc(p.role)+'</small><strong>'+esc(p.name)+'</strong><em>'+esc(p.note)+'</em></div>'+
    '<span class="relation '+cls+'">'+esc(label)+'</span></article>';
}

function power(){
  const later=state.i>=9;
  const nodes=later
    ?[["elena_varin",50,12],["adrian_kessar",20,37],["mira_solen",80,37],["player",50,56],["silas_koren",22,76],["niko_arven",78,76]]
    :[["elena_varin",50,12],["lea_marin",20,37],["mara_eltan",80,37],["player",50,56],["niko_arven",22,76],["silas_koren",78,76]];
  const edges=[[50,56,50,12],[50,56,20,37],[50,56,80,37],[50,56,22,76],[50,56,78,76]];
  return '<section class="utility-screen power-screen"><header class="utility-header"><div><span>POWER</span><h1>Coalition map</h1></div><small>ACCESS LENS</small></header>'+
    '<div class="power-map">'+edges.map(edge).join("")+nodes.map(n=>node(...n)).join("")+'</div>'+
    '<div class="route-list">'+route("Reform Accord",state.routes?.reform_accord,"blue")+route("Reconstruction",state.routes?.reconstruction,"gold")+route("Civic Compact",state.routes?.civic_compact,"green")+'</div>'+
    '<div class="institution-strip">'+institution("Capability",state.institutions?.nso_capability,"building")+institution("Legitimacy",state.institutions?.nso_legitimacy,"shield")+institution("Personalization",state.institutions?.nso_personalization,"people")+'</div>'+
  '</section>';
}

function edge(e){
  const [x1,y1,x2,y2]=e,dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),ang=Math.atan2(dy,dx)*180/Math.PI;
  return '<i class="map-edge" style="left:'+x1+'%;top:'+y1+'%;width:'+len+'%;transform:rotate('+ang+'deg)"></i>';
}
function node(id,x,y){
  const p=id==="player"?{initials:"YOU",name:"You"}:people[id]||{initials:"?",name:id};
  return '<div class="map-node '+(id==="player"?'you':'')+'" style="left:'+x+'%;top:'+y+'%"><span>'+esc(p.initials)+'</span><b>'+esc(p.name)+'</b></div>';
}
function route(name,v,tone){v=clamp(v);return '<article class="route"><div><small>'+esc(name)+'</small><strong>'+Math.round(v)+'%</strong></div><i><em class="'+tone+'" style="width:'+v+'%"></em></i></article>'}
function institution(name,v,ic){v=clamp(v);return '<article><span>'+icon(ic)+'</span><small>'+esc(name)+'</small><strong>'+Math.round(v)+'</strong></article>'}

function archive(){
  const h=state.history.slice(-4).reverse(),promises=(state.promises||[]).slice(0,3);
  return '<section class="utility-screen"><header class="utility-header"><div><span>ARCHIVE</span><h1>Decisions on record</h1></div><b>'+state.history.length+'<small>ENTRIES</small></b></header>'+
    '<div class="archive-list">'+(h.length?h.map(x=>'<article class="archive-row"><span>CH '+esc(x.chapter)+'</span><div><strong>'+esc(x.title)+'</strong><em>'+esc(x.result)+'</em></div></article>').join(""):'<div class="empty">No decisions yet.</div>')+'</div>'+
    (promises.length?'<div class="promise-box"><header><span>'+icon("document")+'</span><strong>Active commitments</strong><small>'+promises.length+'</small></header>'+promises.map(p=>'<article><b>'+esc(p.text)+'</b><span>'+esc(p.status||"active")+'</span></article>').join("")+'</div>':'')+
    '<button class="reset-link" data-reset>Reset run</button></section>';
}

function finale(){
  const q=quality(state),govt={GOV_REFORM_ACCORD:"Reform Accord",GOV_RECONSTRUCTION:"Reconstruction Coalition",GOV_CIVIC_COMPACT:"Civic Compact"}[state.flags.GOVERNMENT_CONFIGURATION]||"Government formed";
  return '<section class="finale-view"><div class="finale-hero"><span>ACT I COMPLETE</span><h1>A government exists.</h1><p>'+esc(govt)+'</p></div>'+
    '<div class="finale-stats"><article><small>Decision quality</small><strong>'+esc(q.label)+'</strong></article><article><small>Credibility</small><strong>'+state.player.credibility+'</strong></article><article><small>Commitments</small><strong>'+(state.promises||[]).length+'</strong></article></div>'+
    '<blockquote>Power begins when other people start planning around your judgment.</blockquote><button class="primary wide" data-reset>Play Act I again</button></section>';
}

function bind(){
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;selected=null;analysis=false;contextOpen=false;render()});
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{selected=resolveChoices(scene(state)).find(x=>x.id===b.dataset.choice)||null;render()});
  document.querySelector("[data-cancel]")?.addEventListener("click",()=>{selected=null;render()});
  document.querySelector("[data-commit]")?.addEventListener("click",()=>{if(!selected)return;const current=scene(state),opt=selected;state=commit(state,opt);selected=null;analysis=false;last={...opt,_scene:current};render()});
  document.querySelector("[data-analysis]")?.addEventListener("click",()=>{analysis=!analysis;render()});
  document.querySelector("[data-next]")?.addEventListener("click",()=>{last=null;analysis=false;render()});
  document.querySelectorAll("[data-msg]").forEach(b=>b.onclick=()=>{state=readMsg(state,b.dataset.msg);render()});
  document.querySelector("[data-context]")?.addEventListener("click",()=>{contextOpen=true;render()});
  document.querySelectorAll("[data-close-context]").forEach(b=>b.onclick=()=>{contextOpen=false;render()});
  document.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>{if(confirm("Reset this run?")){state=reset();tab="play";selected=null;last=null;analysis=false;contextOpen=false;render()}});
}
render();
