/**
 * KM-011: pure, reusable Act I scene and consequence HTML renderer.
 * No DOM access, event handlers, localStorage writes or simulation commits here.
 * The controller provides a read-only snapshot + icon renderer.
 */
import {scene,progress} from "./engine.js";
import {meta,cleanTitle,sceneVisual} from "./redesign-scenes.js";

export function createSceneViews({state,selected=null,result=null,analysis=false,icon}){
  const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  const bodyOf=s=>s?(typeof s.body==="function"?s.body(state):s.body)||[]:[];
  const factsOf=s=>s?(typeof s.evidence==="function"?s.evidence(state):s.evidence)||[]:[];
  const choicesOf=s=>s?(typeof s.choices==="function"?s.choices(state):s.choices)||[]:[];
function hud(s){
  return '<header class="scene-hud">'+
    '<div class="brand"><span>K</span><strong>KINGMAKER</strong></div>'+
    '<div class="chapter"><b>ΚΕΦ. '+esc(s.chapter)+'</b><small>'+esc(s.chapterTitle)+'</small><i><em style="width:'+progress(state)+'%"></em></i></div>'+
    '<button data-kit class="icon-btn" aria-label="Άνοιγμα εργαλείων">'+icon("menu")+'</button>'+
  '</header>';
}

function renderScene(){
  if(state.finished&&!result)return renderFinale();
  if(result)return renderConsequence();
  const s=scene(state),m=meta(s),body=bodyOf(s),facts=factsOf(s),choices=choicesOf(s);
  const teaser=(typeof s.teaser==="function"?s.teaser(state):s.teaser)||body[0]||"";
  return '<main class="game-screen">'+
    hud(s)+
    '<section class="world">'+
      '<div class="world-light"></div>'+
      '<div class="architecture"><i></i><i></i><i></i><i></i><i></i></div>'+
      '<div class="world-title"><span>'+esc(m.place)+'</span><h1>'+esc(cleanTitle(s.title))+'</h1></div>'+
      sceneVisual(s,body,facts)+
      '<p class="world-line">'+esc(teaser)+'</p>'+
      '<button class="context-btn" data-context>'+icon("info")+'<span>Στοιχεία</span></button>'+
    '</section>'+
    '<section class="decision-panel '+(choices.length>3?"crowded":"")+'">'+
      '<div class="question"><span>'+esc(m.label)+'</span><h2>'+esc(s.question)+'</h2></div>'+
      '<div class="choice-stack">'+choices.map(choice).join("")+'</div>'+
      (selected?'<div class="commit-row"><button data-cancel class="secondary">Αλλαγή</button><button data-commit class="primary">Επιβεβαίωση '+icon("arrow")+'</button></div>':"")+
    '</section>'+
  '</main>';
}

function choice(x,i){
  const active=selected?.id===x.id;
  return '<button class="choice '+(active?"active":"")+'" data-choice="'+x.id+'">'+
    '<span class="key">'+String.fromCharCode(65+i)+'</span>'+
    '<span class="copy"><small>'+esc(x.verb||"Επιλογή")+'</small><strong>'+esc(x.title)+'</strong><em>'+esc(x.sub)+'</em></span>'+
    '<span class="go">'+(active?icon("check"):icon("arrow"))+'</span>'+
  '</button>';
}

function renderContext(){
  const s=scene(state),m=meta(s);
  return '<div class="overlay" data-close-context><section class="sheet" onclick="event.stopPropagation()">'+
    '<header><div><span>'+esc(m.label)+'</span><h2>'+esc(cleanTitle(s.title))+'</h2></div><button data-close-context class="icon-btn">'+icon("close")+'</button></header>'+
    '<div class="context-copy">'+bodyOf(s).map(p=>'<p>'+esc(p)+'</p>').join("")+'</div>'+
    '<div class="source-box">'+factsOf(s).map(e=>'<article><i class="'+esc(e.type||"neutral")+'"></i><div><small>'+esc(e.label)+'</small><strong>'+esc(e.value)+'</strong><em>'+esc(e.note)+'</em></div></article>').join("")+'</div>'+
    '<button class="primary full" data-close-context>Πίσω στην απόφαση</button>'+
  '</section></div>';
}

function renderConsequence(){
  const m=meta(result._scene);
  return '<main class="consequence-screen">'+
    '<section class="consequence-world"><div class="reaction"></div><span>'+esc(m.place)+'</span><h1>Κάτι άλλαξε.</h1></section>'+
    '<section class="consequence-card"><span>Η ΣΥΝΕΠΕΙΑ</span><h2>'+esc(result.result)+'</h2>'+
      (analysis?'<div class="analysis"><small>ΠΙΣΩ ΑΠΟ ΤΗΝ ΑΠΟΦΑΣΗ</small><p>'+esc(result.debrief)+'</p></div>':'<p>Η απόφαση μπήκε στο αρχείο. Κάποιες επιπτώσεις θα γίνουν ορατές αργότερα.</p>')+
      '<div class="result-actions"><button data-analysis class="secondary">'+(analysis?"Κλείσιμο":"Δες περισσότερα")+'</button><button data-next class="primary">Συνέχεια '+icon("arrow")+'</button></div>'+
    '</section>'+
  '</main>';
}

function renderFinale(){
  const govt={GOV_REFORM_ACCORD:"Συμφωνία αλλαγής",GOV_RECONSTRUCTION:"Κυβέρνηση συνέχειας",GOV_CIVIC_COMPACT:"Πλατύς συμβιβασμός"}[state.flags.GOVERNMENT_CONFIGURATION]||"Σχηματίστηκε κυβέρνηση";
  return '<main class="finale"><section class="finale-world"><div class="sun"></div><div class="city"></div><span>ΤΕΛΟΣ ΠΡΩΤΗΣ ΠΡΑΞΗΣ</span><h1>Κυβέρνηση πριν την αυγή.</h1><p>'+esc(govt)+'</p></section>'+
    '<section class="finale-sheet"><blockquote>Κανείς δεν ξέρει ακόμη αν θα αντέξει. Ξέρεις μόνο πως όσα υποσχέθηκες θα σε ακολουθήσουν.</blockquote><div class="stats"><article><small>Δεσμεύσεις</small><strong>'+(state.promises||[]).length+'</strong></article><article><small>Η επόμενη πράξη</small><strong>Διακυβέρνηση</strong></article></div><button class="primary full" data-reset>Παίξε ξανά</button></section></main>';
}

  return {renderScene,renderContext};
}
