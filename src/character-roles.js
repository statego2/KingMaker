/**
 * On-screen, plain-language Greek identification of people.
 * Do not require players to memorize cast lists or infer offices from initials.
 * These are presentation hints, not secret world knowledge.
 */
export const roles={
  lea_marin:{first:"Λέα",hint:"συνάδελφος αναλύτρια"},
  mara_eltan:{first:"Μάρα",hint:"προϊσταμένη σου"},
  nela_orr:{first:"Νέλα",hint:"υπάλληλος της Βουλής"},
  ivo_marek:{first:"Ίβο",hint:"διευθυντής του γραφείου της Προέδρου"},
  elena_varin:{first:"Έλενα",hint:"Πρόεδρος της χώρας"},
  niko_arven:{first:"Νίκο",hint:"ανεξάρτητος βουλευτής"},
  adrian_kessar:{first:"Άντριαν",hint:"αρχηγός κόμματος"},
  mira_solen:{first:"Μίρα",hint:"αρχηγός του Εργατικού Κόμματος"},
  viktor_sarin:{first:"Βίκτορ",hint:"αρχηγός της παλαιάς παράταξης"},
  liora_venn:{first:"Λιόρα",hint:"αρχηγός της παράταξης των πόλεων"},
  nadia_serrin:{first:"Νάντια",hint:"ερευνητική δημοσιογράφος"},
  selma_aric:{first:"Σέλμα",hint:"επικεφαλής ανεξάρτητης έρευνας"},
  anton_beran:{first:"Άντον",hint:"υπηρεσιακός πρωθυπουργός"},
  silas_koren:{first:"Σίλας",hint:"πολιτικός στρατηγιστής"}
};
const entries=Object.values(roles);
const escapeRegExp=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const names=entries.map(e=>e.first).sort((a,b)=>b.length-a.length);
const matcher=new RegExp("(?<![\\p{L}])("+names.map(escapeRegExp).join("|")+")(?![\\p{L}])","gu");
const byFirst=new Map(entries.map(e=>[e.first,e.hint]));
export function roleLabel(id){
  const person=roles[id];
  return person?person.first+" ("+person.hint+")":"";
}
export function annotateNames(value){
  const seen=new Set();
  const input=String(value??"");
  return input.replace(matcher,(found,_capture,pos,whole)=>{
    // Text that already spells out an identity should not acquire duplicate labels.
    const next=whole.slice(pos+found.length);
    if(/^\s*\([^)]{2,75}\)/u.test(next)||seen.has(found))return found;
    seen.add(found);
    return found+" ("+byFirst.get(found)+")";
  });
}
