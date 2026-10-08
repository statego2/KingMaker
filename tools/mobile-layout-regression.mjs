#!/usr/bin/env node
// KM-005 / #12: responsive geometry checks in Chromium, not human/iOS approval.
import assert from "node:assert/strict";
import {chromium} from "playwright";
import {scenes} from "../src/content.js";
const base=process.env.KM_PREVIEW_URL||"http://127.0.0.1:4173/";
const browser=await chromium.launch({headless:true});
const index=scenes.findIndex(s=>s.id==="C06_S02");
assert.ok(index>=0,"C06_S02 missing");
async function moveTo(page,target){
  await page.evaluate(async target=>{
    const engine=await import("./src/engine.js");
    let s=engine.fresh();
    while(s.i<target){
      const current=engine.scene(s);
      const choices=typeof current.choices==="function"?current.choices(s):current.choices;
      s=engine.commit(s,choices[0]);
    }
    engine.save(s);
  },target);
  await page.reload({waitUntil:"networkidle"});
}
async function measure(page){
  return page.evaluate(()=>{
    const rect=el=>el?.getBoundingClientRect();
    const overlap=(a,b)=>!!(a&&b&&a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom);
    const title=rect(document.querySelector(".world-title h1"));
    const paper=rect(document.querySelector(".visual-briefing .paper-card"));
    const context=rect(document.querySelector(".visual-briefing .context-btn"));
    const clipped=[...document.querySelectorAll("[data-choice]")].flatMap((el,i)=>{
      const a=rect(el),copy=el.querySelector(".copy"),b=rect(copy);
      return b.top<a.top+2||b.bottom>a.bottom-2||copy.scrollWidth>copy.clientWidth+2?[i]:[];
    });
    const commit=rect(document.querySelector("[data-commit]"));
    return {titlePaperOverlap:overlap(title,paper),contextPaperOverlap:overlap(context,paper),clipped,
      horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2,
      commitBelow:!!(commit&&commit.bottom>innerHeight+1)};
  });
}
const errors=[];
try{
  for(const [width,height] of [[320,568],[375,667],[390,844],[430,932]]){
    const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce"});
    const page=await context.newPage();
    page.on("pageerror",e=>errors.push(width+": "+e.message));
    await page.goto(base,{waitUntil:"networkidle"});
    const first=await measure(page);
    assert.equal(first.titlePaperOverlap,false,width+"px: title intersects dossier");
    assert.equal(first.contextPaperOverlap,false,width+"px: context control obscures dossier");
    assert.equal(first.horizontalOverflow,false,width+"px: horizontal overflow");
    if(width===320){
      await page.evaluate(()=>{document.body.style.zoom="1.25";});
      const zoom=await measure(page);
      assert.equal(zoom.titlePaperOverlap,false,"320px at 125% zoom: title intersects dossier");
      assert.equal(zoom.horizontalOverflow,false,"320px at 125% zoom: horizontal overflow");
      await page.screenshot({path:"artifacts/visual-baseline/320x568-zoom125-first.png",fullPage:true,animations:"disabled"});
    }
    await moveTo(page,index);
    if(height<=760){
      const cue=await page.locator(".decision-panel.crowded .question>span").evaluate(el=>getComputedStyle(el,"::after").content);
      assert.match(cue,/SCROLL FOR MORE/,width+"px: long option list needs a visible scroll cue");
    }
    const choices=page.locator("[data-choice]");
    for(let i=0;i<await choices.count();i++){
      await choices.nth(i).scrollIntoViewIfNeeded();
      const state=await measure(page);
      assert.deepEqual(state.clipped,[],width+"px C06_S02: choice copy clipped");
      assert.equal(state.horizontalOverflow,false,width+"px C06_S02: horizontal overflow");
    }
    await choices.nth(1).click();
    const selected=await measure(page);
    assert.deepEqual(selected.clipped,[],width+"px C06_S02: selected copy clipped");
    assert.equal(selected.commitBelow,false,width+"px: commit below viewport");
    assert.equal(await page.locator(".choice.active").count(),1,width+"px: selection lost");
    await page.locator("[data-commit]").click();
    assert.equal(await page.locator(".consequence-screen").count(),1,width+"px: commit failed");
    console.log("MOBILE LAYOUT PASS "+width+"x"+height+": briefing safe zone, C06_S02 choices and commit");
    await context.close();
  }
  assert.deepEqual(errors,[],"Browser page errors");
}finally{await browser.close();}
