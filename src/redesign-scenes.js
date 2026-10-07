import {people} from "./content.js";

export const presentation={
  C01_S01:["briefing","VELIS · GOVERNMENT DISTRICT","PRESIDENTIAL BRIEFING"],
  C01_S02:["character","SCS · RULES DESK","PROCEDURAL WINDOW"],
  C01_S03:["document","PRESIDENCY · 10:40","ONE-PAGE BRIEF"],
  C02_S01:["character","VELIS · DAY 2","PRIVATE MEETING"],
  C02_S02:["phone","SECURE CHANNEL · DAY 3","TWO MESSAGES"],
  C02_S03:["map","COALITION ROOM · DAY 4","THREE PATHS"],
  C03_S01:["document","HARBOR FILE · DAY 6","RESTRICTED PAGE"],
  C03_S02:["character","SCS · DAY 6","CHAIN OF CUSTODY"],
  C03_S03:["media","VELIS · DAY 7","PUBLIC LINE"],
  C04_S01:["warroom","PRESIDENCY · DAY 10","SIX LEADERS"],
  C04_S02:["document","PRESIDENCY · DAY 11","THE MISSING VARIABLE"],
  C04_S03:["document","ASSEMBLY · DAY 12","SUNSET CLAUSE"],
  C05_S01:["map","VELIS · DAY 17","MINISTRY MAP"],
  C05_S02:["character","PRIVATE OFFICE · DAY 19","SILAS KOREN"],
  C05_S03:["document","COALITION ROOM · DAY 22","COALITION CONTRACT"],
  C06_S01:["timeline","VELIS · DAY 29","MARKETS OPEN IN 90 MIN"],
  C06_S02:["warroom","NSO DESIGN ROOM · DAY 31","WHO OWNS STRATEGY"],
  C06_S03:["dawn","VELIS · DAY 32","GOVERNMENT AT DAWN"]
};

const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
export const cleanTitle=t=>String(t||"").replace(/^(Day\s*\d+\s*—\s*|\d{2}:\d{2}\s*—\s*)/i,"");
export const meta=s=>{const x=presentation[s?.id]||["briefing","VELIS","DECISION BRIEF"];return{mode:x[0],place:x[1],label:x[2]}};

function actor(s){return people[(s?.actors||[])[0]]||{name:"Unknown",role:"",initials:"?"}}
function factRows(facts,max=3){
  return facts.slice(0,max).map((e,i)=>'<div class="prop-row '+esc(e.type||"neutral")+'"><span>'+String(i+1).padStart(2,"0")+'</span><div><small>'+esc(e.label)+'</small><strong>'+esc(e.value)+'</strong></div><em>'+(e.type==="confirmed"?"CONFIRMED":e.type==="uncertain"?"UNVERIFIED":"SOURCE")+'</em></div>').join("");
}

export function sceneVisual(s,body,facts){
  const p=meta(s),a=actor(s);
  if(p.mode==="briefing") return '<div class="briefing-prop"><div class="paper-card"><header><b>OFFICE OF STRATEGIC COORDINATION</b><span>RESTRICTED</span></header><h3>Presidential briefing</h3>'+factRows(facts)+'<div class="stamp">15 MIN</div></div><div class="desk-shadow"></div></div>';
  if(p.mode==="document") return '<div class="document-prop"><div class="paper-card dossier"><header><b>'+esc(p.label)+'</b><span>CONFIDENTIAL</span></header><h3>'+esc(cleanTitle(s.title))+'</h3><p>'+esc(body[1]||body[0]||"")+'</p>'+factRows(facts,2)+'<div class="pen-line"></div></div></div>';
  if(p.mode==="character") return '<div class="character-prop"><div class="portrait-art"><span class="head"></span><span class="shoulders"></span><i></i></div><div class="character-card"><small>'+esc(a.role)+'</small><h3>'+esc(a.name)+'</h3><blockquote>'+esc(body[1]||body[0]||"")+'</blockquote></div></div>';
  if(p.mode==="phone") return '<div class="phone-prop"><div class="phone-ring">☎</div><small>SECURE INCOMING</small><h3>'+esc(a.name)+'</h3><p>'+esc(body[1]||body[0]||"")+'</p><div class="wave">'+Array(18).fill(0).map((_,i)=>'<i style="height:'+(8+(i%5)*5)+'px"></i>').join("")+'</div></div>';
  if(p.mode==="map") return '<div class="map-prop"><svg viewBox="0 0 360 190" aria-hidden="true"><path d="M26 112 63 55l52 7 21-37 55 23 47-17 32 40 54 12 8 51-56 25-45-11-30 25-52-17-44 20-36-31z"/><path class="region r2" d="m64 58 50 6 19-34 48 21-19 45-51 8z"/><path class="region r3" d="m165 52 71-18 31 38-33 42-66-18z"/><path class="region r4" d="m112 106 50-8 70 18-4 55-61 4-49-16z"/></svg><i class="pin p1"></i><i class="pin p2"></i><i class="pin p3"></i><aside>'+facts.slice(0,3).map(e=>'<div><small>'+esc(e.label)+'</small><strong>'+esc(e.value)+'</strong></div>').join("")+'</aside></div>';
  if(p.mode==="media") return '<div class="media-prop"><div class="newspaper"><header>THE LYDRIAN CHRONICLE</header><small>VELIS · POLITICS</small><h3>'+esc(cleanTitle(s.title))+'</h3><p>'+esc(body[0]||"")+'</p><div class="news-columns"></div></div></div>';
  if(p.mode==="warroom") return '<div class="warroom-prop"><div class="table-map"></div>'+(s.actors||[]).slice(0,5).map((id,i)=>{const x=people[id]||{initials:"?",name:id};return '<div class="war-token t'+(i+1)+'"><span>'+esc(x.initials)+'</span><b>'+esc(x.name)+'</b></div>'}).join("")+'<div class="table-paper one"></div><div class="table-paper two"></div><div class="coffee"></div></div>';
  if(p.mode==="timeline") return '<div class="timeline-prop"><div class="timeline-line"></div>'+facts.slice(0,3).map((e,i)=>'<div class="time-event e'+(i+1)+'"><span>'+String(i+1).padStart(2,"0")+'</span><div><small>'+esc(e.label)+'</small><strong>'+esc(e.value)+'</strong></div></div>').join("")+'<div class="market-clock">90<small>MIN</small></div></div>';
  return '<div class="dawn-prop"><div class="sun"></div><div class="city"></div><blockquote>'+esc(body[0]||"")+'</blockquote></div>';
}
