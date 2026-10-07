
import {people} from "./content.js";
import {load,save,reset,scene,progress,commit,readMsg,relationship,quality} from "./engine.js";
let state=load(),tab="briefing",selected=null,analysis=false,last=null;
const root=document.querySelector("#app");
const nav=[["briefing","▣","Briefing"],["inbox","✉","Inbox"],["people","◉","Dossiers"],["network","⌘","Network"],["archive","⌁","Archive"]];
const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
function render(){
 const s=scene(state),ch=s?("CH "+s.chapter+" · "+s.chapterTitle):"VERTICAL SLICE COMPLETE";
 root.innerHTML='<div class="app"><header class="top"><div class="brandrow"><div class="mark"><span class="sig"></span><div><div class="brand">KINGMAKER</div><div class="classify">SCS // '+esc(ch)+'</div></div></div><div class="day">LYDRIA · 2032</div></div><div class="progress"><span style="width:'+progress(state)+'%"></span></div></header><main>'+screen()+'</main><nav class="bottom">'+nav.map(([id,ic,l])=>'<button class="nav '+(tab===id?'active':'')+'" data-tab="'+id+'"><b>'+ic+'</b>'+l+'</button>').join("")+'</nav></div>';bind();
}
function screen(){if(tab==="briefing")return briefing();if(tab==="inbox")return inbox();if(tab==="people")return dossiers();if(tab==="network")return network();return archive()}
function briefing(){
 if(state.finished)return finale();
 const s=scene(state),body=typeof s.body==="function"?s.body(state):s.body;
 return '<div class="screenlabel">Decision room</div>'+ (last?'<div class="notice"><strong>WHAT HAPPENED</strong><br>'+esc(last)+'</div>':'')+
 '<article class="paper"><div class="kicker">'+esc(s.kicker)+'</div><h1>'+esc(s.title)+'</h1><div class="body">'+body.map(p=>'<p>'+esc(p)+'</p>').join("")+'</div>'+
 '<div class="meta"><span class="tag brass">CHAPTER '+s.chapter+'</span><span class="tag">COMMITMENT · MEDIUM</span><span class="tag">'+s.actors.length+' STAKEHOLDERS</span></div>'+
 '<div class="evidence">'+s.evidence.map(e=>'<div class="ev '+esc(e.type)+'"><div class="head"><span>'+esc(e.label)+'</span><span>'+ (e.type==="confirmed"?"CONFIRMED":"UNCERTAIN") +'</span></div><strong>'+esc(e.value)+'</strong><small>'+esc(e.note)+'</small></div>').join("")+'</div>'+
 '<div class="decision"><div class="decision-head"><h2>'+esc(s.question)+'</h2><span class="commitment">Decision owner · player</span></div>'+
 (!selected?'<div class="options">'+s.choices.map((x,i)=>'<button class="opt" data-choice="'+x.id+'"><span class="verb">'+esc(x.verb)+'</span><div class="opt-title">'+String.fromCharCode(65+i)+'. '+esc(x.title)+'</div><div class="opt-sub">'+esc(x.sub)+'</div></button>').join("")+'</div>':
 '<div class="options"><button class="opt selected"><span class="verb">'+esc(selected.verb)+'</span><div class="opt-title">'+esc(selected.title)+'</div><div class="opt-sub">'+esc(selected.sub)+'</div></button></div><div class="commitbar"><button class="ghost" data-cancel>Reconsider</button><button class="primary" data-commit>Commit decision</button></div>')+
 '</div></article>';
}
function consequence(opt){return '<div class="consequence"><div class="title">What happened</div><p>'+esc(opt.result)+'</p>'+(analysis?'<div class="analysis"><strong>POST-DECISION ANALYSIS</strong><br>'+esc(opt.debrief)+'</div>':'')+'<div class="commitbar"><button class="ghost" data-analysis>'+(analysis?'Hide analysis':'Inspect reasoning')+'</button><button class="primary" data-next>Continue</button></div></div>'}
function inbox(){const n=state.inbox.filter(x=>x.unread).length;return '<div class="screenlabel">Incoming intelligence · '+n+' unread</div><div class="list">'+state.inbox.map(m=>'<button class="row" style="width:100%;text-align:left;color:inherit;cursor:pointer" data-msg="'+m.id+'"><div><div class="title">'+esc(m.from)+'</div><div class="sub"><b>'+esc(m.subject)+'</b><br>'+esc(m.body)+'</div></div><span class="badge '+(m.unread?'new':'')+'">'+(m.unread?'NEW':'FILED')+'</span></button>').join("")+'</div>'}
function dossiers(){return '<div class="screenlabel">Known actors · player assessment</div><div class="list">'+Object.keys(state.rel).filter(id=>people[id]).map(id=>{const p=people[id],r=state.rel[id];return '<div class="row person"><div class="portrait">'+p.initials+'</div><div><div class="title">'+esc(p.name)+'</div><div class="sub">'+esc(p.role)+'<br>'+esc(p.note)+'</div></div><span class="rel">'+relationship(r)+'</span></div>'}).join("")+'</div><div class="notice" style="margin-top:10px">These labels are player-side assessments. Hidden developer truth is never shown here.</div>'}
function network(){
 const nodes=[["elena_varin",50,16],["mara_eltan",30,45],["player",50,58],["niko_arven",72,45],["silas_koren",78,75],["nela_orr",22,78]];
 const lines=[[50,58,50,16,false],[50,58,30,45,false],[50,58,72,45,false],[50,58,78,75,true],[50,58,22,78,false]];
 const edge=(x1,y1,x2,y2,sus)=>{const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),ang=Math.atan2(dy,dx)*180/Math.PI;return '<span class="edge '+(sus?'suspected':'')+'" style="left:'+x1+'%;top:'+y1+'%;width:'+len+'%;transform:rotate('+ang+'deg)"></span>'};
 return '<div class="screenlabel">Power map · lens: access / information</div><div class="network">'+lines.map(x=>edge(...x)).join("")+nodes.map(([id,x,y])=>{const p=id==="player"?{initials:"YOU",name:"You"}:people[id];return '<div class="node" style="left:'+x+'%;top:'+y+'%"><div class="dot">'+p.initials+'</div><small>'+esc(p.name)+'</small></div>'}).join("")+'</div><div class="notice" style="margin-top:10px">Act I access is incomplete. Dashed edges are suspected, not confirmed.</div><div class="panel">'+trk("Government stability",state.world.government_stability)+trk("Information quality",state.world.information_quality)+trk("Public trust",state.world.public_trust)+'</div>'
}
function trk(n,v){return '<div class="track"><div class="trackhead"><span>'+n+'</span><span>'+v+'/100</span></div><div class="bar"><span style="width:'+v+'%"></span></div></div>'}
function archive(){const h=state.history;return '<div class="screenlabel">Archive · decisions on record</div>'+(h.length?'<div>'+h.map((x,i)=>'<div class="archive-item"><span class="when">ENTRY '+String(i+1).padStart(2,"0")+' · '+esc(x.chapter)+'</span><strong>'+esc(x.title)+'</strong><p>'+esc(x.result)+'</p></div>').join("")+'</div>':'<div class="notice">No major decisions have been committed yet.</div>')+'<div class="section"><h2>Local save</h2><div class="panel"><div class="commitbar"><button class="ghost" data-save>Save now</button><button class="ghost" data-reset>Reset run</button></div></div></div>'}
function finale(){const q=quality(state),strong=state.history.filter(x=>x.quality>=.85).length;return '<div class="screenlabel">Vertical slice complete</div><article class="paper"><div class="kicker">ARCHIVE MARKER · DAY 7</div><h1>You are now visible.</h1><p class="lede">Δεν απέκτησες ακόμη εξουσία. Άνθρωποι στην Presidency, Assembly και media άρχισαν όμως να θυμούνται πώς σκέφτεσαι.</p><div class="rule"></div><div class="summary"><div class="stat"><strong>'+esc(q.label)+'</strong><span>Decision quality</span></div><div class="stat"><strong>'+strong+'</strong><span>Strong calls</span></div><div class="stat"><strong>'+state.player.credibility+'</strong><span>Credibility</span></div><div class="stat"><strong>'+state.silas.observations+'</strong><span>Silas observations</span></div></div><div class="analysis" style="margin-top:15px"><strong>THE WORLD REMEMBERS</strong><br>Source provenance, procedural power, relationship memory and delayed callbacks are now part of one continuous state.</div><div class="commitbar"><button class="primary" data-reset>Play another run</button></div></article>'}
function bind(){
 document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;selected=null;last=null;render()});
 document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{selected=scene(state).choices.find(x=>x.id===b.dataset.choice);render()});
 document.querySelector("[data-cancel]")?.addEventListener("click",()=>{selected=null;render()});
 document.querySelector("[data-commit]")?.addEventListener("click",()=>{const opt=selected;state=commit(state,opt);selected=null;analysis=false;last=opt.result;render();const host=document.querySelector(".paper");if(host)host.insertAdjacentHTML("beforeend",consequence(opt));bind()});
 document.querySelector("[data-analysis]")?.addEventListener("click",()=>{analysis=!analysis;const opt=state.history.length?state.history[state.history.length-1]:null;if(opt){const fake={result:opt.result,debrief:"Decision logged. Full retrospective explanation unlocks when more truth becomes known."};document.querySelector(".consequence").outerHTML=consequence(fake);bind()}});
 document.querySelector("[data-next]")?.addEventListener("click",()=>{last=null;window.scrollTo({top:0,behavior:"smooth"});render()});
 document.querySelectorAll("[data-msg]").forEach(b=>b.onclick=()=>{state=readMsg(state,b.dataset.msg);render()});
 document.querySelector("[data-save]")?.addEventListener("click",()=>{save(state);last="Local save updated.";tab="briefing";render()});
 document.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>{if(confirm("Reset this run?")){state=reset();tab="briefing";selected=null;last=null;render()}});
}
render();
