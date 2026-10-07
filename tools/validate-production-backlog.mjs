#!/usr/bin/env node
/* KINGMAKER production backlog integrity validator. Node 18+; no external deps. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const file=path.join(root,"data","production_backlog_v1.json");
const fail=(message)=>{console.error("ERROR: "+message);process.exitCode=1;};
const plain=(s)=>typeof s==="string"&&s.trim().length>0;
let backlog;
try{backlog=JSON.parse(fs.readFileSync(file,"utf8"));}
catch(e){console.error("Could not parse backlog: "+e.message);process.exit(1);}

const tasks=backlog.tasks||[],phases=backlog.phases||[];
const allowed=new Set(backlog.statuses||["todo","in_progress","blocked","review","done"]);
const allowedP=new Set(["P0","P1","P2"]),allowedSize=new Set(["S","M","L","XL"]);
const ids=new Set(),phaseIds=new Set(phases.map(x=>x.id)),byId=new Map();
if(backlog.schema_version!=="1.0")fail("schema_version must be 1.0");
if(!tasks.length)fail("no tasks");
if(!phases.length)fail("no phases");

for(const task of tasks){
 if(!/^KM-\d{3}$/.test(task.id||""))fail("bad task id: "+task.id);
 if(ids.has(task.id))fail("duplicate task id: "+task.id);
 ids.add(task.id);byId.set(task.id,task);
 if(!phaseIds.has(task.phase))fail(task.id+" invalid phase: "+task.phase);
 if(!allowed.has(task.status))fail(task.id+" invalid status "+task.status);
 if(!allowedP.has(task.priority))fail(task.id+" invalid priority "+task.priority);
 if(!allowedSize.has(task.size))fail(task.id+" invalid size "+task.size);
 if(!plain(task.title)||!plain(task.stream))fail(task.id+" missing title or stream");
 if(!Array.isArray(task.depends_on)||!Array.isArray(task.deliverables)||!Array.isArray(task.acceptance_criteria)||!Array.isArray(task.evidence))fail(task.id+" invalid array fields");
 if(!(task.deliverables||[]).every(plain)||task.deliverables.length<1)fail(task.id+" missing deliverable");
 if((task.acceptance_criteria||[]).length<2||!task.acceptance_criteria.every(plain))fail(task.id+" needs two acceptance criteria");
 if(task.status==="done"&&task.evidence.length===0)fail(task.id+" DONE requires evidence");
 if(task.status==="blocked"&&!plain(task.notes))fail(task.id+" BLOCKED requires blocker details in notes");
 if(task.status==="in_progress"&&task.size==="XL")fail(task.id+" XL must split before in_progress");
 if(new Set(task.depends_on).size!==task.depends_on.length)fail(task.id+" duplicate dependencies");
}

for(const task of tasks)for(const dep of task.depends_on){
 if(!byId.has(dep))fail(task.id+" unknown dependency: "+dep);
 if(dep===task.id)fail(task.id+" self-dependency");
 if(Number(dep.slice(3))>=Number(task.id.slice(3)))fail(task.id+" forward dependency "+dep+"; reorder IDs or revise dependency");
 if(["in_progress","review","done"].includes(task.status)&&byId.get(dep)?.status!=="done")fail(task.id+" status needs completed dependency "+dep);
}

const visiting=new Set(),visited=new Set();
function visit(id){
 if(visiting.has(id)){fail("dependency cycle at "+id);return;}
 if(visited.has(id))return;
 visiting.add(id);
 for(const dep of byId.get(id)?.depends_on||[])if(byId.has(dep))visit(dep);
 visiting.delete(id);visited.add(id);
}
for(const id of ids)visit(id);

const ready=tasks.filter(t=>t.status==="todo"&&t.depends_on.every(dep=>byId.get(dep)?.status==="done"))
 .sort((a,b)=>a.priority.localeCompare(b.priority)||Number(a.id.slice(3))-Number(b.id.slice(3)));
console.log("KINGMAKER backlog: "+tasks.length+" tasks / "+phases.length+" phases");
for(const p of phases){
 const ts=tasks.filter(t=>t.phase===p.id);
 const done=ts.filter(t=>t.status==="done").length;
 console.log("  "+p.id+"  "+done+"/"+ts.length+" done — "+p.name);
}
console.log("Dependency-ready tasks: "+ready.length);
ready.slice(0,10).forEach(t=>console.log("  "+t.id+" ["+t.priority+"] "+t.title));
if(process.argv.includes("--ready"))console.log(JSON.stringify(ready,null,2));
if(process.argv.includes("--task")){
 const id=process.argv[process.argv.indexOf("--task")+1];
 const t=byId.get(id);
 if(!t)fail("unknown task ID "+id);
 else console.log(JSON.stringify(t,null,2));
}
if(process.exitCode)console.error("BACKLOG VALIDATION FAILED");
else console.log("BACKLOG VALIDATION PASSED");
