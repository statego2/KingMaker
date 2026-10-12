import test from "node:test";
import assert from "node:assert/strict";
import { beginStrategy, strategyTurn } from "./strategic-director.mjs";
import { buildDirectorBrief, buildPlayerBrief } from "./strategy-intelligence.mjs";
const step=(state,id,kind,args={})=>strategyTurn(state,{id,kind,...args});

test("player brief includes actual state and accessible free-form agency, not secret utility",()=>{
 const state=step(beginStrategy({seed:42}),"listen","listen",{actorId:"eleni"});
 const p=buildPlayerBrief(state),g=buildDirectorBrief(state);
 assert.match(p.summary,/μεταρρύθμιση|δημοτικών υπηρεσιών/i);
 assert.equal(p.event.result,"succeeded");
 assert.match(p.question,/δικά σου λόγια/);
 assert.equal(g.access,"GM_ONLY_NEVER_NARRATE_DIRECTLY");
 assert.ok(g.hidden.actorMotives.every(x=>Number.isInteger(x.threshold)));
 const visible=JSON.stringify(p);
 for(const secret of ["threshold","outside","authoredFact","private","actorMotives","seed","hiddenEvents","rivalMoves"]){
  assert.equal(visible.includes('"'+secret+'"'),false);
 }
});

test("director priorities adapt to actual refusal and time pressure without predetermined choices",()=>{
 let s=beginStrategy({seed:12});
 s=step(s,"one","offer",{actorId:"nikos",terms:{transparency:1}});
 const first=buildDirectorBrief(s);
 assert.ok(first.conditionalPatterns.some(p=>p.id==="SM-016"));
 for(let i=2;i<=8;i++)s=step(s,"wait"+i,"wait");
 const late=buildDirectorBrief(s);
 assert.ok(late.conditionalPatterns.some(p=>p.id==="SM-010"));
 assert.equal(late.world.turnsLeft,2);
 assert.equal(late.adjudication.next.includes("structured strategyTurn"),true);
});

test("director notes require actual source records and never claim that rumors are independent proof",()=>{
 let s=beginStrategy({scenario:"venture-alliance",seed:7});
 s=step(s,"q1","investigate",{factId:"supply-risk"});
 const p=buildPlayerBrief(s),g=buildDirectorBrief(s);
 assert.equal(p.evidence.grade,"contested");
 assert.equal(p.evidence.reports.length,1);
 assert.equal(g.playerKnows.factGrade,"contested");
 assert.equal(g.hidden.authoredFact,false);
 assert.equal(JSON.stringify(p).includes("authoredFact"),false);
});
