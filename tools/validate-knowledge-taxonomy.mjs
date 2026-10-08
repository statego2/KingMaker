#!/usr/bin/env node
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {validateKnowledgeTaxonomy,questionSlot} from "../src/knowledge-taxonomy.js";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const data=JSON.parse(readFileSync(resolve(root,"data/knowledge_taxonomy_v1.json"),"utf8"));
const errors=validateKnowledgeTaxonomy(data);
if(errors.length){errors.forEach(x=>console.error("FAIL "+x));process.exitCode=1;}
else {const slots=Array.from({length:1000},(_,i)=>questionSlot(data,i+1));console.log("KNOWLEDGE TAXONOMY PASSED: 10 domains / 60 competencies / 15 tensions / "+slots.length+" stable question IDs; "+data.question_corpus.mapped_question_count+" verified item mappings");}
