// KM-089 slice 2: provenance-gated intake; not imported by the game.
import {formatQuestionId,questionSlot} from "./knowledge-taxonomy.js";
const filled=x=>typeof x==="string"&&x.trim().length>0;
export function validateQuestionMappingManifest(taxonomy,manifest){
 const errors=[],fail=x=>errors.push(x);
 if(manifest?.schema_version!=="1.0")fail("schema_version must be 1.0");
 if(manifest?.taxonomy_id!==taxonomy?.id)fail("taxonomy_id mismatch");
 if(!["awaiting_original_corpus","partial_import","complete_import"].includes(manifest?.source_status))fail("Invalid source_status");
 if(!Array.isArray(manifest?.records)){fail("records must be array");return errors;}
 const records=manifest.records;
 if(records.length>1000)fail("Too many records");
 if(!records.length&&manifest.source_status!=="awaiting_original_corpus")fail("Empty manifest must await source");
 if(records.length&&manifest.source_status==="awaiting_original_corpus")fail("Nonempty manifest cannot await source");
 if(records.length!==1000&&manifest.source_status==="complete_import")fail("Complete import requires 1000 records");
 const competencies=new Set((taxonomy?.domains||[]).flatMap(d=>(d.competencies||[]).map(c=>c.id)));
 const tensions=new Set((taxonomy?.master_tensions||[]).map(t=>t.id)),seen=new Set();
 for(const [i,r] of records.entries()){
  const id=r?.question_id,label=id||"record["+i+"]";
  const n=typeof id==="string"&&/^Q\d{3,4}$/.test(id)?Number(id.slice(1)):NaN;
  if(!Number.isInteger(n)||n<1||n>1000||formatQuestionId(n)!==id){fail(label+": invalid question_id");continue;}
  if(seen.has(id))fail(id+": duplicate question_id");
  seen.add(id);
  if(r.tier!==questionSlot(taxonomy,n).tier)fail(id+": tier mismatch");
  if(!filled(r.question_text))fail(id+": missing original question text");
  if(!filled(r.source_record?.path)||!filled(r.source_record?.locator))fail(id+": missing item-level source");
  if(r.source_record?.path==="docs/00_MASTER_PROJECT.md")fail(id+": framework is not item-level source");
  if(!competencies.has(r.primary_competency))fail(id+": invalid primary competency");
  if(!Array.isArray(r.secondary_competencies))fail(id+": secondary_competencies must be array");
  else{
   if(new Set(r.secondary_competencies).size!==r.secondary_competencies.length)fail(id+": duplicate secondary");
   for(const c of r.secondary_competencies){
    if(!competencies.has(c))fail(id+": invalid secondary "+c);
    if(c===r.primary_competency)fail(id+": primary repeated as secondary");
   }
  }
  if(r.master_tension!==null&&!tensions.has(r.master_tension))fail(id+": invalid master tension");
  if(!Array.isArray(r.source_anchors))fail(id+": source_anchors must be array");
  else for(const a of r.source_anchors)if(!filled(a?.work)||!filled(a?.locator))fail(id+": invalid source anchor");
  if(!["needs_review","reviewed"].includes(r.review_status))fail(id+": invalid review_status");
  if(r.review_status==="reviewed"){
   if(!filled(r.reviewer)||!filled(r.review_evidence))fail(id+": review requires reviewer/evidence");
   if(!r.source_anchors?.length)fail(id+": review requires source anchor");
  }
 }
 return errors;
}
export function auditQuestionMappings(taxonomy,manifest){
 const errors=validateQuestionMappingManifest(taxonomy,manifest);
 const records=Array.isArray(manifest?.records)?manifest.records:[];
 const present=new Set(records.map(r=>r?.question_id));
 const by_tier=Object.fromEntries((taxonomy.question_tiers||[]).map(t=>[t.id,{
  expected:t.end-t.start+1,
  imported:records.filter(r=>r?.tier===t.id).length,
  reviewed:records.filter(r=>r?.tier===t.id&&r.review_status==="reviewed").length
 }]));
 const by_domain=Object.fromEntries((taxonomy.domains||[]).map(d=>[d.id,
  records.filter(r=>d.competencies.some(c=>c.id===r?.primary_competency)).length]));
 return {valid:errors.length===0,errors,expected:1000,imported:records.length,
  reviewed:records.filter(r=>r?.review_status==="reviewed").length,
  awaiting_review:records.filter(r=>r?.review_status==="needs_review").length,
  unmapped:1000-present.size,
  missing_ids:Array.from({length:1000},(_,i)=>formatQuestionId(i+1)).filter(id=>!present.has(id)),
  by_tier,by_domain};
}
export function mappedQuestionOrSlot(taxonomy,manifest,number){
 const id=formatQuestionId(number);
 return (manifest?.records||[]).find(r=>r.question_id===id)||questionSlot(taxonomy,number);
}
