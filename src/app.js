
import {people} from "./content.js";
import {load,save,reset,scene,progress,commit,readMsg,relationship,quality} from "./engine.js";

let state=load(),tab="briefing",selected=null,analysis=false,last=null,lastCommitted=null;
const root=document.querySelector("#app");
const nav=[["briefing","▣","Briefing"],["inbox","✉","Inbox"],["people","◉","Dossiers"],["network","⌘","Network"],["archive","⌁","Archive"]];
const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const resolveBody=s=>typeof s.body==="function"?s.body(state):s.body;
const resolveEvidence=s=>typeof s.evidence==="function"?s.evidence(state):s.evidence;
const resolveChoices=s=>typeof s.choices==="function"?s.choices(state):s.choices;

function render(){
  const s=scene(state),ch=s?("CH "+s.chapter+" · "+s.chapterTitle):"ACT I COMPLETE";
  root.innerHTML='<div class="app"><header class="top"><div class="brandrow"><div class="mark"><span class="sig"></span><div><div class="brand">KINGMAKER</div><div class="classify">SCS // '+esc(ch)+'</div></div></div><div class="day">LYDRIA · 2032</div></div><div class="progress"><span style="width:'+progress(state)+'%"></span></div></header><main>'+screen()+'</main><nav class="bottom">'+nav.map(([id,ic,l])=>'<button class="nav '+(tab===id?'active':'')+'" data-tab="'+id+'"><b>'+ic+'</b>'+l+'</button>').join("")+'</nav></div>';
  bind();
}

function screen(){
  if(tab==="briefing")return briefing();
  if(tab==="inbox")return inbox();
  if(tab==="people")return dossiers();
  if(tab==="network")return network();
  return archive();
}

function briefing(){
  if(state.finished)return finale();
  const s=scene(state),body=resolveBody(s),evidence=resolveEvidence(s)||[],choices=resolveChoices(s)||[];
  return '<div class="screenlabel">Decision room</div>'+
    (last?'<div class="notice"><strong>WHAT CHANGED</strong><br>'+esc(last)+'</div>':'')+
    '<article class="paper"><div class="kicker">'+esc(s.kicker)+'</div><h1>'+esc(s.title)+'</h1>'+
    '<div class="body">'+body.map(p=>'<p>'+esc(p)+'</p>').join("")+'</div>'+
    '<div class="meta"><span class="tag brass">CHAPTER '+s.chapter+'</span><span class="tag">COMMITMENT · '+(Number(s.chapter)>=6?"HIGH":"MEDIUM")+'</span><span class="tag">'+s.actors.length+' STAKEHOLDERS</span></div>'+
    '<div class="evidence">'+evidence.map(e=>'<div class="ev '+esc(e.type)+'"><div class="head"><span>'+esc(e.label)+'</span><span>'+(e.type==="confirmed"?"CONFIRMED":"UNCERTAIN")+'</span></div><strong>'+esc(e.value)+'</strong><small>'+esc(e.note)+'</small></div>').join("")+'</div>'+
    '<div class="decision"><div class="decision-head"><h2>'+esc(s.question)+'</h2><span class="commitment">Decision owner · player</span></div>'+
    (!selected
      ?'<div class="options">'+choices.map((x,i)=>'<button class="opt" data-choice="'+x.id+'"><span class="verb">'+esc(x.verb)+'</span><div class="opt-title">'+String.fromCharCode(65+i)+'. '+esc(x.title)+'</div><div class="opt-sub">'+esc(x.sub)+'</div></button>').join("")+'</div>'
      :'<div class="options"><button class="opt selected"><span class="verb">'+esc(selected.verb)+'</span><div class="opt-title">'+esc(selected.title)+'</div><div class="opt-sub">'+esc(selected.sub)+'</div></button></div><div class="commitbar"><button class="ghost" data-cancel>Reconsider</button><button class="primary" data-commit>Commit decision</button></div>'
    )+'</div></article>';
}

function consequence(opt){
  return '<div class="consequence"><div class="title">What happened</div><p>'+esc(opt.result)+'</p>'+
    (analysis?'<div class="analysis"><strong>POST-DECISION ANALYSIS</strong><br>'+esc(opt.debrief)+'</div>':'')+
    '<div class="commitbar"><button class="ghost" data-analysis>'+(analysis?'Hide analysis':'Inspect reasoning')+'</button><button class="primary" data-next>Continue</button></div></div>';
}

function inbox(){
  const n=state.inbox.filter(x=>x.unread).length;
  return '<div class="screenlabel">Incoming intelligence · '+n+' unread</div><div class="list">'+
    state.inbox.map(m=>'<button class="row" style="width:100%;text-align:left;color:inherit;cursor:pointer" data-msg="'+m.id+'"><div><div class="title">'+esc(m.from)+'</div><div class="sub"><b>'+esc(m.subject)+'</b><br>'+esc(m.body)+'</div></div><span class="badge '+(m.unread?'new':'')+'">'+(m.unread?'NEW':'FILED')+'</span></button>').join("")+
    '</div>';
}

function dossiers(){
  return '<div class="screenlabel">Known actors · player assessment</div><div class="list">'+
    Object.keys(state.rel).filter(id=>people[id]).map(id=>{
      const p=people[id],r=state.rel[id];
      return '<div class="row person"><div class="portrait">'+p.initials+'</div><div><div class="title">'+esc(p.name)+'</div><div class="sub">'+esc(p.role)+'<br>'+esc(p.note)+'</div></div><span class="rel">'+relationship(r)+'</span></div>';
    }).join("")+
    '</div><div class="notice" style="margin-top:10px">These labels are player-side assessments. Hidden developer truth is never shown here.</div>';
}

function network(){
  const later=state.i>=9;
  const nodes=later
    ?[["elena_varin",50,12],["adrian_kessar",18,35],["mira_solen",40,32],["player",50,58],["viktor_sarin",76,34],["liora_venn",82,62],["niko_arven",68,80],["silas_koren",26,80]]
    :[["elena_varin",50,16],["mara_eltan",30,45],["player",50,58],["niko_arven",72,45],["silas_koren",78,75],["nela_orr",22,78]];
  const lines=later
    ?[[50,58,50,12,false],[50,58,18,35,false],[50,58,40,32,false],[50,58,76,34,false],[50,58,82,62,false],[50,58,68,80,false],[50,58,26,80,true]]
    :[[50,58,50,16,false],[50,58,30,45,false],[50,58,72,45,false],[50,58,78,75,true],[50,58,22,78,false]];
  const edge=(x1,y1,x2,y2,sus)=>{
    const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),ang=Math.atan2(dy,dx)*180/Math.PI;
    return '<span class="edge '+(sus?'suspected':'')+'" style="left:'+x1+'%;top:'+y1+'%;width:'+len+'%;transform:rotate('+ang+'deg)"></span>';
  };
  return '<div class="screenlabel">Power map · lens: access / coalition</div><div class="network">'+
    lines.map(x=>edge(...x)).join("")+
    nodes.map(([id,x,y])=>{const p=id==="player"?{initials:"YOU",name:"You"}:people[id];return '<div class="node" style="left:'+x+'%;top:'+y+'%"><div class="dot">'+p.initials+'</div><small>'+esc(p.name)+'</small></div>'}).join("")+
    '</div><div class="notice" style="margin-top:10px">Act I network is epistemic. Dashed links are suspected or adversarial, not confirmed control.</div>'+
    '<div class="panel">'+trk("Reform Accord",state.routes.reform_accord)+trk("Reconstruction",state.routes.reconstruction)+trk("Civic Compact",state.routes.civic_compact)+'</div>'+
    '<div class="section"><h2>Institutional design</h2><div class="panel">'+trk("NSO capability",state.institutions.nso_capability)+trk("NSO legitimacy",state.institutions.nso_legitimacy)+trk("NSO personalization",state.institutions.nso_personalization)+'</div></div>';
}

function trk(n,v){
  return '<div class="track"><div class="trackhead"><span>'+n+'</span><span>'+Math.round(v)+'/100</span></div><div class="bar"><span style="width:'+Math.max(0,Math.min(100,v))+'%"></span></div></div>';
}

function archive(){
  const h=state.history;
  const promiseBlock=state.promises.length
    ?'<div class="section"><h2>Active commitments</h2><div class="list">'+state.promises.map(p=>'<div class="row"><div><div class="title">'+esc(p.text)+'</div><div class="sub">To: '+esc(p.to)+' · '+esc(p.status)+'</div></div><span class="badge">'+esc(p.id)+'</span></div>').join("")+'</div></div>'
    :"";
  return '<div class="screenlabel">Archive · decisions on record</div>'+
    (h.length?'<div>'+h.map((x,i)=>'<div class="archive-item"><span class="when">ENTRY '+String(i+1).padStart(2,"0")+' · CH '+esc(x.chapter)+'</span><strong>'+esc(x.title)+'</strong><p>'+esc(x.result)+'</p></div>').join("")+'</div>':'<div class="notice">No major decisions have been committed yet.</div>')+
    promiseBlock+
    '<div class="section"><h2>Local save</h2><div class="panel"><div class="commitbar"><button class="ghost" data-save>Save now</button><button class="ghost" data-reset>Reset run</button></div></div></div>';
}

function govtName(){
  return {
    GOV_REFORM_ACCORD:"Reform Accord",
    GOV_RECONSTRUCTION:"Reconstruction Coalition",
    GOV_CIVIC_COMPACT:"Civic Compact"
  }[state.flags.GOVERNMENT_CONFIGURATION]||"No government";
}

function nsoName(){
  return {
    chartered:"Chartered cross-government NSO",
    pm_controlled:"PM-controlled Strategy Unit",
    quota_board:"Coalition quota board",
    temporary:"Temporary SCS"
  }[state.flags.NSO_CHARTER]||"Unresolved";
}

function finale(){
  const q=quality(state),strong=state.history.filter(x=>x.quality>=.85).length;
  return '<div class="screenlabel">Act I complete · Government Formation</div><article class="paper">'+
    '<div class="kicker">ARCHIVE MARKER · DAY 32</div><h1>A government exists.</h1>'+
    '<p class="lede">Δεν είσαι ακόμη Kingmaker. Αλλά η πρώτη κυβέρνηση της εποχής σχηματίστηκε μέσα σε ένα δίκτυο πληροφοριών, promises και procedural choices στο οποίο το όνομά σου πλέον εμφανίζεται.</p>'+
    '<div class="rule"></div>'+
    '<div class="summary">'+
      '<div class="stat"><strong>'+esc(govtName())+'</strong><span>Government</span></div>'+
      '<div class="stat"><strong>'+esc(q.label)+'</strong><span>Decision quality</span></div>'+
      '<div class="stat"><strong>'+state.player.credibility+'</strong><span>Credibility</span></div>'+
      '<div class="stat"><strong>'+state.silas.observations+'</strong><span>Silas observations</span></div>'+
    '</div>'+
    '<div class="analysis" style="margin-top:15px"><strong>NSO ARCHITECTURE</strong><br>'+esc(nsoName())+
    '<br><br><strong>ACTIVE PROMISES</strong><br>'+state.promises.length+
    '<br><br><strong>NEXT</strong><br>Act II — The Operator. The coalition now has to make Aster Gate, automation and energy policy work in the real state.</div>'+
    '<div class="commitbar"><button class="primary" data-reset>Play Act I again</button></div></article>';
}

function bind(){
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;selected=null;last=null;lastCommitted=null;render()});
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{
    const choices=resolveChoices(scene(state));
    selected=choices.find(x=>x.id===b.dataset.choice);
    render();
  });
  document.querySelector("[data-cancel]")?.addEventListener("click",()=>{selected=null;render()});
  document.querySelector("[data-commit]")?.addEventListener("click",()=>{
    const opt=selected;
    state=commit(state,opt);
    selected=null;
    analysis=false;
    last=opt.result;
    lastCommitted=opt;
    render();
    const host=document.querySelector(".paper");
    if(host)host.insertAdjacentHTML("beforeend",consequence(opt));
    bind();
  });
  document.querySelector("[data-analysis]")?.addEventListener("click",()=>{
    analysis=!analysis;
    if(lastCommitted){
      const box=document.querySelector(".consequence");
      if(box){box.outerHTML=consequence(lastCommitted);bind();}
    }
  });
  document.querySelector("[data-next]")?.addEventListener("click",()=>{last=null;lastCommitted=null;window.scrollTo({top:0,behavior:"smooth"});render()});
  document.querySelectorAll("[data-msg]").forEach(b=>b.onclick=()=>{state=readMsg(state,b.dataset.msg);render()});
  document.querySelector("[data-save]")?.addEventListener("click",()=>{save(state);last="Local save updated.";tab="briefing";render()});
  document.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>{if(confirm("Reset this run?")){state=reset();tab="briefing";selected=null;last=null;lastCommitted=null;render()}});
}
render();
