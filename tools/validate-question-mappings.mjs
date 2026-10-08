#!/usr/bin/env node
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {auditQuestionMappings} from "../src/question-mapping.js";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const taxonomy=JSON.parse(readFileSync(resolve(root,"data/knowledge_taxonomy_v1.json"),"utf8"));
const manifest=JSON.parse(readFileSync(resolve(root,"data/question_mappings_v1.json"),"utf8"));
const audit=auditQuestionMappings(taxonomy,manifest);
if(!audit.valid){audit.errors.forEach(e=>console.error("FAIL "+e));process.exitCode=1;}
else console.log("QUESTION INTAKE VALID: "+audit.imported+"/1000 imported, "+audit.reviewed+" reviewed, "+audit.unmapped+" unmapped; no inferred coverage.");
