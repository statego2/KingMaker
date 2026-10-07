#!/usr/bin/env node
// KM-005: Headless Chromium visual baseline. Optional Playwright dependency.
import { chromium } from "playwright";
import {mkdir,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {scenes} from "../src/content.js";
import {fresh} from "../src/engine.js";

const base=process.env.KM_PREVIEW_URL||"http://127.0.0.1:4173/";
const folder=resolve("artifacts/visual-baseline");
const initial=fresh();
const textSize=s=>{
  const b=typeof s.body==="function"?s.body(initial):s.body;
  const c=typeof s.choices==="function"?s.choices(initial):s.choices;
  return [s.question,...(b||[]),...(c||[]).flatMap(x=>[x.title,x.sub])].join("").length;
};
const longest=scenes.reduce((best,s,i)=>textSize(s)>textSize(scenes[best])?i:best,0);
const viewports=[[320,568],[375,667],[390,844],[430,932],[1440,900]];
const ledger={date:"2026-10-08",browser:"Headless Playwright Chromium, Linux CI",longestScene:scenes[longest].id,viewports:[],errors:[],limitations:["Emulated viewport is not real iPhone/Safari","Images and visual hierarchy require manual review","No artistic or playtest signoff"]};
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true});
async function moveTo(page,index){
  await page.evaluate(async target=>{
    const engine=await import("./src/engine.js");
    let s=engine.fresh();
    while(s.i<target){
      const current=engine.scene(s);
      if(!current)throw Error("Missing scene "+s.i);
      const opts=typeof current.choices==="function"?current.choices(s):current.choices;
      s=engine.commit(s,opts[0]);
    }
    engine.save(s);
  },index);
  await page.reload({waitUntil:"networkidle"});
}
async function geometry(page){
  return page.evaluate(()=>{
    const measure=el=>{if(!el)return null;const r=el.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),bottom:Math.round(r.bottom),belowFold:r.bottom>innerHeight};};
    return {
      viewport:{width:innerWidth,height:innerHeight},
      document:{scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight},
      horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2,
      commit:measure(document.querySelector("[data-commit]")),
      choices:[...document.querySelectorAll("[data-choice]")].map(measure),
      decisionPanel:measure(document.querySelector(".decision-panel")),
      scrollers:[...document.querySelectorAll("*")].filter(x=>x.scrollHeight>x.clientHeight+4&&["auto","scroll"].includes(getComputedStyle(x).overflowY)).slice(0,8).map(x=>({className:String(x.className),scrollHeight:x.scrollHeight,clientHeight:x.clientHeight}))
    };
  });
}
try{
  for(const [width,height] of viewports){
    const name=width+"x"+height;
    const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"reduce"});
    const page=await ctx.newPage();
    page.on("pageerror",e=>ledger.errors.push(name+": "+e.message));
    const entry={viewport:name,stages:[],warnings:[]};
    await page.goto(base,{waitUntil:"networkidle"});
    for(const [tag,index] of [["first",0],["longest",longest],["final",scenes.length]]){
      await moveTo(page,index);
      const stage={tag,sceneId:scenes[index]?.id||"ACT_I_FINISHED"};
      if(index<scenes.length){
        await page.locator("[data-choice]").first().click();
        if(await page.locator("[data-commit]").count()!==1)ledger.errors.push(name+" "+tag+": Commit action missing");
      }else if(await page.locator(".finale").count()!==1)ledger.errors.push(name+": finale missing");
      stage.geometry=await geometry(page);
      if(stage.geometry.horizontalOverflow)entry.warnings.push(tag+": horizontal overflow");
      if(stage.geometry.commit?.belowFold)entry.warnings.push(tag+": commit below viewport; check scrolling/reachability");
      if(stage.geometry.choices.some(x=>x.height<40))entry.warnings.push(tag+": touch target under 40 px");
      stage.png=name+"-"+tag+".png";
      await page.screenshot({path:resolve(folder,stage.png),fullPage:true,animations:"disabled"});
      entry.stages.push(stage);
    }
    ledger.viewports.push(entry);
    await ctx.close();
    console.log(name+": first="+scenes[0].id+" longest="+scenes[longest].id+" final=Act I; "+entry.warnings.length+" candidate warnings");
  }
}finally{await browser.close();}
await writeFile(resolve(folder,"viewport-ledger.json"),JSON.stringify(ledger,null,2)+"\n");
await writeFile(resolve(folder,"README.md"),"KM-005: 15 headless Chromium full-page images, geometry and potential clipping warnings. Human visual, iOS and accessibility acceptance remain pending.\n");
console.log("VISUAL BASELINE: "+ledger.viewports.length*3+" screenshots; "+ledger.viewports.reduce((n,v)=>n+v.warnings.length,0)+" warnings; "+ledger.errors.length+" page errors");
if(ledger.errors.length){for(const error of ledger.errors)console.error(error);process.exitCode=1;}
