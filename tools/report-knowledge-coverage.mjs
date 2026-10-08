#!/usr/bin/env node
// KM-089: coverage report; manifest-attested reviews are not independent human approval.
import {readFileSync} from "node:fs";
import {dirname,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {summarizeKnowledgeCoverage} from "../src/knowledge-coverage.js";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const taxonomy=JSON.parse(readFileSync(resolve(root,"data/knowledge_taxonomy_v1.json"),"utf8"));
const manifest=JSON.parse(readFileSync(resolve(root,"data/question_mappings_v1.json"),"utf8"));
const report=summarizeKnowledgeCoverage(taxonomy,manifest);
if(!report.valid){
  console.error("Knowledge coverage report rejected: invalid question mapping manifest");
  for(const error of report.errors)console.error("FAIL "+error);
  process.exitCode=1;
}else{
  console.log(JSON.stringify(report,null,2));
}
