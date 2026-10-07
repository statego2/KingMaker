import test from "node:test";
import assert from "node:assert/strict";
import {createPreviewServer} from "../tools/serve.mjs";
test("preview serves static entrypoint and module with correct status/content type",async()=>{
  const server=createPreviewServer();
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  try{
    const page=await fetch(base+"/");
    assert.equal(page.status,200);
    assert.match(page.headers.get("content-type"),/text\/html/);
    assert.match(await page.text(),/src\/app-redesign\.js/);
    const js=await fetch(base+"/src/engine.js");
    assert.equal(js.status,200);
    assert.match(js.headers.get("content-type"),/text\/javascript/);
    const missing=await fetch(base+"/no-such-file.js");
    assert.equal(missing.status,404);
    const post=await fetch(base+"/",{method:"POST"});
    assert.equal(post.status,405);
  }finally{await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
