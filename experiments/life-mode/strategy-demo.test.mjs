import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const dir=dirname(fileURLToPath(import.meta.url));
test("Greek strategic scenario runs in Node using genuine resolver and replay",()=>{
 const output=execFileSync(process.execPath,[join(dir,"strategy-demo.mjs")],{encoding:"utf8",timeout:10_000});
 assert.match(output,/KINGMAKER/);
 assert.match(output,/Ελένη/);
 assert.match(output,/Νίκο/);
 assert.match(output,/Τελική κατάσταση:/);
 assert.match(output,/Επαληθευμένη τελευταία κίνηση:/);
 assert.match(output,/€900/);
 assert.doesNotMatch(output,/threshold|outside|rivalMoves|hiddenEvents|randomRoll/);
 assert.equal((output.match(/κινήσεις/g)??[]).length>=1,true);
});
