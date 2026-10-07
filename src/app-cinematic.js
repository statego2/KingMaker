/* KINGMAKER cinematic presentation layer.
   Keep campaign mechanics in content.js / engine.js.
   This file intentionally owns the live scene-first rendering so gameplay work can evolve independently. */
import {people} from "./content.js";
import {load,save,reset,scene,progress,commit,readMsg,relationship,quality} from "./engine.js";

let state=load(),tab="briefing",selected=null,analysis=false,last=null;
const root=document.querySelector("#app");

const nav=[
  ["briefing","◆","Play"],
  ["inbox","✦","Inbox"],
  ["people","◌","People"],
  ["network","⌘","Power"],
  ["archive","◫","Archive"]
];

const esc=x=>String(x??"")
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;");

const pct=n=>Math.max(0,Math.min(100,n));

function sceneType(s){
  if(!s) return "legacy";
  const id=s.id||"",ch=s.chapter||"";
  if(id==="C01_S01") return "briefing";
  if(id==="C01_S02") return "assembly";
  if(id==="C01_S03") return "presidency";
  if(id==="C02_S01") return "sera";
  if(id==="C02_S02") return "rumor";
  if(id==="C02_S03") return "coalition";
  if(id==="C03_S01") return "file";
  if(id==="C03_S02") return "chain";
  if(id==="C03_S03") return "podium";
  if(ch==="04") return id.endsWith("S03")?"assembly":"presidency";
  if(ch==="05") return id.endsWith("S02")?"rumor":"coalition";
  if(ch==="06") return id.endsWith("S03")?"presidency":"briefing";
  return "briefing";
}

function sceneEvidence(s){return s?(typeof s.evidence==="function"?s.evidence(state):s.evidence)||[]:[]}
function sceneChoices(s){return s?(typeof s.choices==="function"?s.choices(state):s.choices)||[]:[]}

function sceneCaption(s){
  const map={
    briefing:["VELIS · 07:12","Government district before markets open"],
    assembly:["ASSEMBLY · 09:05","Procedure can move the clock"],
    presidency:["PRESIDENCY · 10:40","Twelve minutes of presidential attention"],
    sera:["SERA CHANNEL · DAY 2","A pivotal vote is still a person"],
    rumor:["VELIS · DAY 3","Two messages. One source chain."],
    coalition:["VELIS · DAY 4","Three viable governments. Three future dependencies."],
    file:["CIVIC WIRE · 18:43","The page that should not exist"],
    chain:["SECURE CHANNEL · DAY 6","Truth depends on who touches it next"],
    podium:["PRESIDENCY · DAY 7","The line that will survive tomorrow"],
    legacy:["VELIS · DAY 7","The first week is now on record"]
  };
  return map[sceneType(s)]||map.briefing;
}

function skyline(){
  return '<div class="cityline">'+
    [14,28,20,38,24,44,18,33,26,48,22,35,17,42,25,31,46,18,37,21].map((h,i)=>'<i style="--h:'+h+'%;--d:'+(i%5)+'"></i>').join("")+
  '</div>';
}

function sceneArt(s){
  const t=sceneType(s),[eyebrow,caption]=sceneCaption(s);
  const actors=(s?.actors||[]).slice(0,4).map(id=>people[id]).filter(Boolean);
  const actorRail=actors.length?'<div class="scene-cast">'+actors.map((p,i)=>
    '<div class="cast-chip" style="--i:'+i+'"><span class="cast-face">'+esc(p.initials)+'</span><span>'+esc(p.name.split(" ")[0])+'</span></div>'
  ).join("")+'</div>':"";

  let art="";
  if(t==="briefing"){
    art='<div class="window-glow"></div>'+skyline()+'<div class="table-perspective"></div><div class="paper-stack"></div>';
  } else if(t==="assembly"){
    art='<div class="chamber"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="clock-ring"></div><div class="rule-sheet"></div>';
  } else if(t==="presidency"){
    art='<div class="window-glow presidential"></div>'+skyline()+'<div class="presidential-seal">LV</div><div class="brief-page"><b>FACT</b><b>INFERENCE</b><b>DECISION</b></div>';
  } else if(t==="sera"){
    art='<div class="horizon"></div><div class="island island-a"></div><div class="island island-b"></div><div class="sea-grid"></div><div class="ferry-light"></div>';
  } else if(t==="rumor"){
    art='<div class="message-orbit m1">A</div><div class="message-orbit m2">B</div><div class="message-core">1</div><div class="signal-lines"></div>';
  } else if(t==="coalition"){
    art='<div class="coalition-path p1"></div><div class="coalition-path p2"></div><div class="coalition-path p3"></div><div class="coalition-node n1">R</div><div class="coalition-node n2">C</div><div class="coalition-node n3">S</div><div class="coalition-node n4">F</div>';
  } else if(t==="file"){
    art='<div class="rain"></div><div class="evidence-page"><span>ASTER HARBOR</span><b>DC wants clause<br>narrow enough</b><i></i></div><div class="desk-light"></div>';
  } else if(t==="chain"){
    art='<div class="chain-line"></div><div class="chain-node c1">M</div><div class="chain-node c2">S</div><div class="chain-node c3">A</div><div class="chain-node c4">N</div><div class="secure-pulse"></div>';
  } else if(t==="podium"){
    art='<div class="press-wall"></div><div class="podium-shape"></div><div class="mic one"></div><div class="mic two"></div><div class="camera-flash f1"></div><div class="camera-flash f2"></div>';
  } else {
    art=skyline()+'<div class="archive-light"></div>';
  }

  return '<section class="scene-stage '+t+'">'+
    '<div class="scene-atmos"></div>'+
    '<div class="scene-art">'+art+'</div>'+
    '<div class="scene-vignette"></div>'+
    '<div class="scene-copy"><span>'+esc(eyebrow)+'</span><strong>'+esc(caption)+'</strong></div>'+
    actorRail+
  '</section>';
}

function appHeader(){
  const s=scene(state);
  const chapter=s?"CH "+s.chapter:"COMPLETE";
  return '<header class="topbar">'+
    '<div class="brandlock"><span class="crownmark"><i></i><i></i><i></i></span><div><b>KINGMAKER</b><small>THE GAME OF JUDGMENT</small></div></div>'+
    '<div class="chapterchip">'+esc(chapter)+'</div>'+
    '<div class="story-progress"><span style="width:'+progress(state)+'%"></span></div>'+
  '</header>';
}

function render(){
  root.innerHTML='<div class="app">'+appHeader()+'<main>'+screen()+'</main><nav class="dock">'+
    nav.map(([id,ic,l])=>'<button class="nav '+(tab===id?'active':'')+'" data-tab="'+id+'"><b>'+ic+'</b><span>'+l+'</span></button>').join("")+
  '</nav></div>';
  bind();
}

function screen(){
  if(tab==="briefing") return briefing();
  if(tab==="inbox") return inbox();
  if(tab==="people") return dossiers();
  if(tab==="network") return network();
  return archive();
}

function briefing(){
  if(state.finished&&!last) return finale();
  if(last) return consequence(last);

  const s=scene(state),body=typeof s.body==="function"?s.body(state):s.body;
  const evidence=sceneEvidence(s),choices=sceneChoices(s);
  return '<div class="play-screen">'+sceneArt(s)+
    '<section class="story-sheet">'+
      '<div class="story-kicker"><span>ACT I · '+(Number(s.chapter)<=3?"THE OUTSIDER":"GOVERNMENT FORMATION")+'</span><em>'+esc(s.kicker)+'</em></div>'+
      '<h1>'+esc(s.title)+'</h1>'+
      '<div class="story-body">'+body.map((p,i)=>'<p class="'+(i===0?'lead':'')+'">'+esc(p)+'</p>').join("")+'</div>'+
      '<div class="intel-strip">'+evidence.map((e,i)=>'<article class="intel '+esc(e.type)+'">'+
        '<div class="intel-index">'+String(i+1).padStart(2,"0")+'</div>'+
        '<div><span>'+esc(e.label)+'</span><strong>'+esc(e.value)+'</strong><small>'+esc(e.note)+'</small></div>'+
      '</article>').join("")+'</div>'+
      '<div class="decision-zone">'+
        '<div class="decision-label">YOUR MOVE</div>'+
        '<h2>'+esc(s.question)+'</h2>'+
        (!selected?
          '<div class="choice-stack">'+choices.map((x,i)=>choiceCard(x,i,false)).join("")+'</div>':
          '<div class="choice-stack">'+choiceCard(selected,choices.findIndex(x=>x.id===selected.id),true)+'</div>'+
          '<div class="commit-row"><button class="secondary" data-cancel>Change choice</button><button class="primary" data-commit>Make the call <span>→</span></button></div>'
        )+
      '</div>'+
    '</section>'+
  '</div>';
}

function choiceCard(x,i,on){
  return '<button class="choice '+(on?'selected':'')+'" data-choice="'+x.id+'" '+(on?'disabled':'')+'>'+
    '<span class="choice-number">'+String(i+1).padStart(2,"0")+'</span>'+
    '<span class="choice-copy"><b>'+esc(x.title)+'</b><small>'+esc(x.sub)+'</small></span>'+
    '<span class="choice-arrow">'+(on?'✓':'→')+'</span>'+
  '</button>';
}

function consequence(opt){
  const s=opt._scene||scene(state);
  return '<div class="play-screen result-screen">'+sceneArt(s)+
    '<section class="result-sheet">'+
      '<span class="result-eyebrow">CONSEQUENCE</span>'+
      '<h1>'+esc(opt.result)+'</h1>'+
      '<div class="result-divider"></div>'+
      (analysis?'<div class="reasoning"><span>STRATEGIC READ</span><p>'+esc(opt.debrief)+'</p></div>':
        '<p class="result-muted">Το παιχνίδι καταγράφει την απόφασή σου. Η πραγματική της αξία μπορεί να φανεί πολύ αργότερα.</p>')+
      '<div class="commit-row"><button class="secondary" data-analysis>'+(analysis?'Hide reasoning':'Inspect reasoning')+'</button><button class="primary" data-next>Continue <span>→</span></button></div>'+
    '</section>'+
  '</div>';
}

function inbox(){
  const n=state.inbox.filter(x=>x.unread).length;
  return '<section class="utility-screen"><div class="utility-hero inbox-hero"><span>INCOMING</span><h1>'+n+' unread message'+(n===1?'':'s')+'</h1><p>Private channels, callbacks and information that may matter later.</p></div>'+
    '<div class="message-list">'+state.inbox.map(m=>'<button class="message '+(m.unread?'unread':'')+'" data-msg="'+m.id+'">'+
      '<span class="sender-orb">'+esc(m.from.split(" ").map(x=>x[0]).join("").slice(0,2))+'</span>'+
      '<span class="message-copy"><b>'+esc(m.from)+'</b><strong>'+esc(m.subject)+'</strong><small>'+esc(m.body)+'</small></span>'+
      '<i>'+ (m.unread?'NEW':'FILED') +'</i>'+
    '</button>').join("")+'</div></section>';
}

function dossiers(){
  const ids=Object.keys(state.rel).filter(id=>people[id]);
  return '<section class="utility-screen"><div class="utility-hero people-hero"><span>PEOPLE</span><h1>Power has a face.</h1><p>Your model of each person is incomplete, revisable and shaped by what you have actually observed.</p></div>'+
    '<div class="people-grid">'+ids.map((id,i)=>{
      const p=people[id],r=state.rel[id],score=Math.round((r.trust+r.respect)/2);
      return '<article class="person-card" style="--tone:'+((i*41)%360)+'">'+
        '<div class="person-art"><span>'+esc(p.initials)+'</span><i></i></div>'+
        '<div class="person-copy"><small>'+esc(p.role)+'</small><h2>'+esc(p.name)+'</h2><p>'+esc(p.note)+'</p>'+
        '<div class="relation-row"><span>'+esc(relationship(r))+'</span><b style="--v:'+pct(score)+'%"><i></i></b></div></div>'+
      '</article>';
    }).join("")+'</div></section>';
}

function network(){
  const later=state.i>=9;
  const nodes=later
    ?[["elena_varin",50,11],["adrian_kessar",17,35],["mira_solen",39,31],["player",50,57],["viktor_sarin",77,34],["liora_venn",82,62],["niko_arven",68,80],["silas_koren",25,80]]
    :[["elena_varin",50,13],["mara_eltan",27,42],["player",50,55],["niko_arven",75,39],["silas_koren",78,76],["nela_orr",22,78]];
  const lines=later
    ?[[50,57,50,11,false],[50,57,17,35,false],[50,57,39,31,false],[50,57,77,34,false],[50,57,82,62,false],[50,57,68,80,false],[50,57,25,80,true]]
    :[[50,55,50,13,false],[50,55,27,42,false],[50,55,75,39,false],[50,55,78,76,true],[50,55,22,78,false]];
  const edge=(x1,y1,x2,y2,sus)=>{
    const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),ang=Math.atan2(dy,dx)*180/Math.PI;
    return '<span class="power-edge '+(sus?'suspected':'')+'" style="left:'+x1+'%;top:'+y1+'%;width:'+len+'%;transform:rotate('+ang+'deg)"></span>';
  };
  const routeMetrics=state.routes
    ?metric("Reform Accord",state.routes.reform_accord)+metric("Reconstruction",state.routes.reconstruction)+metric("Civic Compact",state.routes.civic_compact)
    :metric("Government stability",state.world.government_stability)+metric("Information quality",state.world.information_quality)+metric("Public trust",state.world.public_trust);
  const institutionMetrics=state.institutions
    ?'<div class="system-pulse">'+metric("NSO capability",state.institutions.nso_capability)+metric("NSO legitimacy",state.institutions.nso_legitimacy)+metric("NSO personalization",state.institutions.nso_personalization)+'</div>'
    :"";
  return '<section class="utility-screen network-screen">'+
    '<div class="utility-hero power-hero"><span>POWER MAP</span><h1>Titles are only one layer.</h1><p>What you can see changes as access, coalitions and institutional power become real.</p></div>'+
    '<div class="power-map"><div class="map-haze"></div>'+lines.map(x=>edge(...x)).join("")+
      nodes.map(([id,x,y])=>{
        const p=id==="player"?{initials:"YOU",name:"You"}:people[id];
        return '<div class="power-node '+(id==="player"?'you':'')+'" style="left:'+x+'%;top:'+y+'%"><div>'+esc(p.initials)+'</div><small>'+esc(p.name)+'</small></div>';
      }).join("")+
    '</div>'+
    '<div class="system-pulse">'+routeMetrics+'</div>'+institutionMetrics+
  '</section>';
}

function metric(name,value){
  return '<div class="metric"><div><span>'+esc(name)+'</span><b>'+value+'</b></div><i><em style="width:'+pct(value)+'%"></em></i></div>';
}

function archive(){
  const h=state.history;
  const promises=(state.promises||[]);
  return '<section class="utility-screen"><div class="utility-hero archive-hero"><span>ARCHIVE</span><h1>The world remembers.</h1><p>Your decisions become history before you know which ones mattered most.</p></div>'+
    (h.length?'<div class="timeline">'+h.map((x,i)=>'<article class="timeline-item"><span>'+String(i+1).padStart(2,"0")+'</span><div><small>CHAPTER '+esc(x.chapter)+'</small><h2>'+esc(x.title)+'</h2><p>'+esc(x.result)+'</p></div></article>').join("")+'</div>':
      '<div class="empty-state">No major decision is on record yet.</div>')+
    (promises.length?'<div class="commitment-list"><div class="decision-label">ACTIVE COMMITMENTS</div>'+promises.map(p=>'<article class="commitment-card"><small>'+esc(p.to)+'</small><b>'+esc(p.text)+'</b><span>'+esc(p.status||"active")+'</span></article>').join("")+'</div>':'')+
    '<div class="archive-actions"><button class="secondary" data-save>Save now</button><button class="secondary danger" data-reset>Reset run</button></div>'+
  '</section>';
}

function govtName(){
  return {GOV_REFORM_ACCORD:"Reform Accord",GOV_RECONSTRUCTION:"Reconstruction Coalition",GOV_CIVIC_COMPACT:"Civic Compact"}[state.flags.GOVERNMENT_CONFIGURATION]||"Government formed";
}
function nsoName(){
  return {chartered:"Chartered cross-government NSO",pm_controlled:"PM-controlled Strategy Unit",quota_board:"Coalition quota board",temporary:"Temporary SCS"}[state.flags.NSO_CHARTER]||"Institutional design unresolved";
}
function finale(){
  const q=quality(state),strong=state.history.filter(x=>x.quality>=.85).length;
  return '<div class="finale">'+
    '<div class="finale-art">'+skyline()+'<div class="sunrise"></div><div class="empty-chair"></div></div>'+
    '<div class="finale-copy"><span>ACT I COMPLETE · DAY 32</span><h1>A government exists.</h1>'+
    '<p>Δεν είσαι ακόμη Kingmaker. Αλλά η πρώτη κυβέρνηση αυτής της εποχής σχηματίστηκε μέσα σε ένα δίκτυο επιλογών, promises και procedural power όπου η κρίση σου πλέον μετρά.</p>'+
    '<div class="final-stats"><div><b>'+esc(govtName())+'</b><span>Government</span></div><div><b>'+esc(q.label)+'</b><span>Decision quality</span></div><div><b>'+state.player.credibility+'</b><span>Credibility</span></div><div><b>'+strong+'</b><span>Strong calls</span></div></div>'+
    '<div class="legacy-card"><small>INSTITUTIONAL RESULT</small><b>'+esc(nsoName())+'</b><span>'+(state.promises||[]).length+' active commitments carry into Act II.</span></div>'+
    '<blockquote>Power begins when other people start planning around your judgment.</blockquote>'+
    '<button class="primary wide" data-reset>Play Act I again <span>↻</span></button></div>'+
  '</div>';
}

function bind(){
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{
    tab=b.dataset.tab;selected=null;analysis=false;render();window.scrollTo({top:0,behavior:"smooth"});
  });

  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{
    selected=sceneChoices(scene(state)).find(x=>x.id===b.dataset.choice);
    render();
    requestAnimationFrame(()=>document.querySelector(".decision-zone")?.scrollIntoView({behavior:"smooth",block:"center"}));
  });

  document.querySelector("[data-cancel]")?.addEventListener("click",()=>{selected=null;render()});

  document.querySelector("[data-commit]")?.addEventListener("click",()=>{
    const current=scene(state);
    const opt=selected;
    state=commit(state,opt);
    selected=null;
    analysis=false;
    last={...opt,_scene:current};
    render();
    window.scrollTo({top:0,behavior:"smooth"});
  });

  document.querySelector("[data-analysis]")?.addEventListener("click",()=>{analysis=!analysis;render()});

  document.querySelector("[data-next]")?.addEventListener("click",()=>{
    last=null;analysis=false;render();window.scrollTo({top:0,behavior:"smooth"});
  });

  document.querySelectorAll("[data-msg]").forEach(b=>b.onclick=()=>{state=readMsg(state,b.dataset.msg);render()});

  document.querySelector("[data-save]")?.addEventListener("click",()=>{save(state)});

  document.querySelectorAll("[data-reset]").forEach(b=>b.onclick=()=>{
    if(confirm("Reset this run?")){
      state=reset();tab="briefing";selected=null;last=null;analysis=false;render();window.scrollTo(0,0);
    }
  });
}

render();
