#!/usr/bin/env node
// KM-002: portable static import, entrypoint and JS syntax diagnostics (Node 20+).
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { resolve, dirname, relative, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const file=path=>join(root,path);
const scripts=[];
function walk(folder){
  if(!existsSync(file(folder)))return;
  for(const d of readdirSync(file(folder),{withFileTypes:true})){
    const rel=join(folder,d.name);
    if(d.isDirectory()) walk(rel);
    else if(/\.(?:js|mjs)$/.test(rel))scripts.push(rel);
  }
}
for(const dir of ["src","tools","tests"])walk(dir);
const errors=[];
for(const script of scripts){
  try{execFileSync(process.execPath,["--check",file(script)],{stdio:"pipe"});}
  catch(e){errors.push("Syntax "+script+": "+String(e.stderr||e.message));}
  const source=readFileSync(file(script),"utf8");
  for(const match of source.matchAll(/(?:import|export)\s+(?:[^"'\n]*?\s+from\s*)?["'](\.[^"']+)["']/g)){
    const target=resolve(dirname(file(script)),match[1]);
    if(!existsSync(target)||!statSync(target).isFile())errors.push("Missing import: "+script+" -> "+match[1]);
  }
}
const html=readFileSync(file("index.html"),"utf8");
for(const match of html.matchAll(/(?:src|href)\s*=\s*["'](\.?\.?\/[^"'?#]+)(?:[?#][^"']*)?["']/g)){
  const asset=match[1];
  const abs=resolve(root,asset);
  if(!abs.startsWith(root+"/")||!existsSync(abs))errors.push("Missing/unsafe entrypoint asset: "+asset);
}
if(!html.includes('id="app"'))errors.push("index.html lacks #app mount");
console.log("Static audit: "+scripts.length+" JavaScript files, index.html and relative imports");
if(errors.length){for(const e of errors)console.error("FAIL "+e);process.exitCode=1;}
else console.log("STATIC CHECK PASSED");
