// KM-089 slice 1: pure, non-gameplay taxonomy integrity and question-slot lookup.
// This module deliberately does not invent per-question competency or source mappings.
export function formatQuestionId(number){
  if(!Number.isInteger(number)||number<1||number>1000)throw new RangeError("Question number must be 1..1000");
  return "Q"+String(number).padStart(3,"0");
}
export function questionSlot(taxonomy,number){
  const id=formatQuestionId(number);
  const tier=taxonomy.question_tiers.find(x=>number>=x.start&&number<=x.end);
  if(!tier)throw new Error("Missing tier for "+id);
  return {id,tier:tier.id,mapping_status:"unmapped",primary_competency:null,secondary_competencies:[],source_anchors:[]};
}
export function validateKnowledgeTaxonomy(taxonomy){
  const errors=[];
  const bad=(message)=>errors.push(message);
  if(taxonomy?.schema_version!=="1.0")bad("schema_version must be 1.0");
  if(!Array.isArray(taxonomy?.domains)||taxonomy.domains.length!==10)bad("Expected 10 domains");
  const domainIds=new Set(),competencyIds=new Set();
  for(const domain of taxonomy?.domains||[]){
    if(!/^[A-Z]{2}$/.test(domain.id||"")||domainIds.has(domain.id))bad("Duplicate or invalid domain ID "+domain.id);
    domainIds.add(domain.id);
    if(!Array.isArray(domain.competencies)||domain.competencies.length!==6)bad(domain.id+" must have 6 competencies");
    for(let i=0;i<(domain.competencies||[]).length;i++){
      const item=domain.competencies[i],expected=domain.id+(i+1);
      if(item.id!==expected||competencyIds.has(item.id))bad("Invalid/duplicate competency "+item.id+" expected "+expected);
      competencyIds.add(item.id);
      if(!item.name?.trim()||item.source?.path!=="docs/00_MASTER_PROJECT.md"||item.source?.anchor!==item.id)bad("Missing canonical provenance for "+item.id);
    }
  }
  if(competencyIds.size!==60)bad("Expected 60 unique competencies");
  const tensions=taxonomy?.master_tensions||[];
  if(tensions.length!==15||new Set(tensions.map(x=>x.id)).size!==15)bad("Expected 15 unique master tensions");
  for(let i=0;i<tensions.length;i++)if(tensions[i].id!=="MT"+String(i+1).padStart(2,"0")||!tensions[i].name?.trim())bad("Invalid master tension "+i);
  let next=1;
  for(const tier of taxonomy?.question_tiers||[]){
    if(tier.start!==next||!Number.isInteger(tier.end)||tier.end<tier.start||!tier.id?.trim())bad("Noncontiguous/invalid question tier "+tier.id);
    next=tier.end+1;
  }
  if(next!==1001)bad("Question tiers must cover Q001..Q1000 exactly");
  if(taxonomy?.question_corpus?.expected_count!==1000)bad("Expected 1000 question IDs");
  if(taxonomy?.question_corpus?.mapped_question_count!==0||taxonomy?.question_corpus?.repository_status!=="not_present_as_individual_question_records")bad("Unverified per-question mapping claim");
  return errors;
}
