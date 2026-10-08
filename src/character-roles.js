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
// Older authored chapters still contain Latin-script names. Show the same simple role.
const latinNames={
  "Lea Marin":"lea_marin","Lea":"lea_marin",
  "Mara Eltan":"mara_eltan","Mara":"mara_eltan",
  "Nela Orr":"nela_orr","Nela":"nela_orr",
  "Ivo Marek":"ivo_marek","Ivo":"ivo_marek",
  "Elena Varin":"elena_varin","Elena":"elena_varin",
  "Niko Arven":"niko_arven","Niko":"niko_arven",
  "Adrian Kessar":"adrian_kessar","Adrian":"adrian_kessar",
  "Mira Solen":"mira_solen","Mira":"mira_solen",
  "Viktor Sarin":"viktor_sarin","Viktor":"viktor_sarin",
  "Liora Venn":"liora_venn","Liora":"liora_venn",
  "Nadia Serrin":"nadia_serrin","Nadia":"nadia_serrin",
  "Selma Aric":"selma_aric","Selma":"selma_aric",
  "Anton Beran":"anton_beran","Anton":"anton_beran",
  "Silas Koren":"silas_koren","Silas":"silas_koren"
};
const escapeRegExp=s=>s.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&");
const byText=new Map([
  ...Object.values(roles).map(p=>[p.first,p]),
  ...Object.entries(latinNames).map(([alias,id])=>[alias,roles[id]])
]);
const names=[...byText.keys()].sort((a,b)=>b.length-a.length);
const matcher=new RegExp("(?<![\\p{L}])("+names.map(escapeRegExp).join("|")+")(?![\\p{L}])","gu");
export function roleLabel(id){
  const person=roles[id];
  return person?person.first+" ("+person.hint+")":"";
}
export function annotateNames(value){
  const seen=new Set();
  return String(value??"").replace(matcher,(found,_capture,pos,whole)=>{
    const person=byText.get(found);
    const next=whole.slice(pos+found.length);
    if(/^\s*\([^)]{2,75}\)/u.test(next)||seen.has(person.first))return found;
    seen.add(person.first);
    return person.first+" ("+person.hint+")";
  });
}
