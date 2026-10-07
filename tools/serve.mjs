#!/usr/bin/env node
// KM-002: dependency-free preview server for GitHub Pages-compatible assets.
// Run: npm run dev (or PORT=4173 npm run dev). Binds localhost by default.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname, sep } from "node:path";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".ico":"image/x-icon"};
export function createPreviewServer(){
  return createServer(async (req,res)=>{
    if(!["GET","HEAD"].includes(req.method)){res.writeHead(405,{"Allow":"GET, HEAD"});res.end();return;}
    let path;
    try{
      const url=new URL(req.url,"http://localhost");
      const name=decodeURIComponent(url.pathname);
      if(name.includes("\\")||name.includes("\0"))throw Error("Bad path");
      path=resolve(root,"."+name+(name.endsWith("/")?"index.html":""));
      if(path!==root && !path.startsWith(root+sep))throw Error("Outside root");
    }catch{res.writeHead(400);res.end("Bad request");return;}
    try{
      const info=await stat(path);
      if(!info.isFile())throw Error("Not a file");
      const bytes=await readFile(path);
      res.writeHead(200,{"Content-Type":mime[extname(path)]||"application/octet-stream","Cache-Control":"no-store","Content-Length":bytes.length,"X-Content-Type-Options":"nosniff"});
      res.end(req.method==="HEAD"?undefined:bytes);
    }catch{res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});res.end("Not found");}
  });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4173);
  const server=createPreviewServer();
  server.listen(port,"127.0.0.1",()=>console.log("KINGMAKER preview: http://127.0.0.1:"+server.address().port+"/"));
}
