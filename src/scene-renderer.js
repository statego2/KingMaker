/**
 * KM-011: pure, reusable Act I scene and consequence HTML renderer.
 * No DOM access, event handlers, localStorage writes or simulation commits here.
 * The controller provides a read-only snapshot + icon renderer.
 */
import {scene,progress,quality} from "./engine.js";
import {meta,cleanTitle,sceneVisual} from "./redesign-scenes.js";

export function createSceneViews({state,selected=null,result=null,analysis=false,icon}){
  const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  const bodyOf=s=>s?(typeof s.body==="function"?s.body(state):s.body)||[]:[];
  const factsOf=s=>s?(typeof s.evidence==="function"?s.evidence(state):s.evidence)||[]:[];
  const choicesOf=s=>s?(typeof s.choices==="function"?s.choices(state):s.choices)||[]:[];
function hud(s){
  return '<header class="scene-hud">'+
    '<div class="brand"><span>K</span><strong>KINGMAKER</strong></div>'+
    '<div class="chapter"><b>CH '+esc(s.chapter)+'</b><small>'+esc(s.chapterTitle)+'</small><i><em style="width:'+progress(state)+'%"></em></i></div>'+
    '<button data-kit class="icon-btn" aria-label="Open instruments">'+icon("menu")+'</button>'+
  '</header>';
}

function renderScene(){
  if(state.finished&&!result)return renderFinale();
  if(result)return renderConsequence();
  const s=scene(state),m=meta(s),body=bodyOf(s),facts=factsOf(s),choices=choicesOf(s);
  return '<main class="game-screen">'+
    hud(s)+
    '<section class="world">'+
      '<div class="world-light"></div>'+
      '<div class="architecture"><i></i><i></i><i></i><i></i><i></i></div>'+
      '<div class="world-title"><span>'+esc(m.place)+'</span><h1>'+esc(cleanTitle(s.title))+'</h1></div>'+
      sceneVisual(s,body,facts)+
      '<p class="world-line">'+esc(body[0]||"")+'</p>'+
      '<button class="context-btn" data-context>'+icon("info")+'<span>Context</span></button>'+
    '</section>'+
    '<section class="decision-panel '+(choices.length>3?"crowded":"")+'">'+
      '<div class="question"><span>'+esc(m.label)+'</span><h2>'+esc(s.question)+'</h2></div>'+
      '<div class="choice-stack">'+choices.map(choice).join("")+'</div>'+
      (selected?'<div class="commit-row"><button data-cancel class="secondary">Change</button><button data-commit class="primary">Commit '+icon("arrow")+'</button></div>':"")+
    '</section>'+
  '</main>';
}

function choice(x,i){
  const active=selected?.id===x.id;
  return '<button class="choice '+(active?"active":"")+'" data-choice="'+x.id+'">'+
    '<span class="key">'+String.fromCharCode(65+i)+'</span>'+
    '<span class="copy"><small>'+esc(x.verb||"Choose")+'</small><strong>'+esc(x.title)+'</strong><em>'+esc(x.sub)+'</em></span>'+
    '<span class="go">'+(active?icon("check"):icon("arrow"))+'</span>'+
  '</button>';
}

function renderContext(){
  const s=scene(state),m=meta(s);
  return '<div class="overlay" data-close-context><section class="sheet" onclick="event.stopPropagation()">'+
    '<header><div><span>'+esc(m.label)+'</span><h2>'+esc(cleanTitle(s.title))+'</h2></div><button data-close-context class="icon-btn">'+icon("close")+'</button></header>'+
    '<div class="context-copy">'+bodyOf(s).map(p=>'<p>'+esc(p)+'</p>').join("")+'</div>'+
    '<div class="source-box">'+factsOf(s).map(e=>'<article><i class="'+esc(e.type||"neutral")+'"></i><div><small>'+esc(e.label)+'</small><strong>'+esc(e.value)+'</strong><em>'+esc(e.note)+'</em></div></article>').join("")+'</div>'+
    '<button class="primary full" data-close-context>Back to decision</button>'+
  '</section></div>';
}

function renderConsequence(){
  const m=meta(result._scene);
  return '<main class="consequence-screen">'+
    '<section class="consequence-world"><div class="reaction"></div><span>'+esc(m.place)+'</span><h1>The world moved.</h1></section>'+
    '<section class="consequence-card"><span>WHAT HAPPENED</span><h2>'+esc(result.result)+'</h2>'+
      (analysis?'<div class="analysis"><small>STRATEGIC READ</small><p>'+esc(result.debrief)+'</p></div>':'<p>Η απόφαση μπήκε στο αρχείο. Κάποιες επιπτώσεις θα γίνουν ορατές αργότερα.</p>')+
      '<div class="result-actions"><button data-analysis class="secondary">'+(analysis?"Hide read":"Inspect reasoning")+'</button><button data-next class="primary">Continue '+icon("arrow")+'</button></div>'+
    '</section>'+
  '</main>';
}

function renderFinale(){
  const q=quality(state),govt={GOV_REFORM_ACCORD:"Reform Accord",GOV_RECONSTRUCTION:"Reconstruction Coalition",GOV_CIVIC_COMPACT:"Civic Compact"}[state.flags.GOVERNMENT_CONFIGURATION]||"Government formed";
  return '<main class="finale"><section class="finale-world"><div class="sun"></div><div class="city"></div><span>ACT I COMPLETE</span><h1>Government at dawn.</h1><p>'+esc(govt)+'</p></section>'+
    '<section class="finale-sheet"><blockquote>Power begins when other people start planning around your judgment.</blockquote><div class="stats"><article><small>Decision quality</small><strong>'+esc(q.label)+'</strong></article><article><small>Credibility</small><strong>'+state.player.credibility+'</strong></article><article><small>Commitments</small><strong>'+(state.promises||[]).length+'</strong></article></div><button class="primary full" data-reset>Play Act I again</button></section></main>';
}

  return {renderScene,renderContext};
}
