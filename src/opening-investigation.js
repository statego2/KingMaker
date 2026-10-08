/**
 * One optional, consequential discovery action in the cold open.
 * The existing A/B/C commitment remains available without an extra tap.
 * Keep temporary UI inspection outside the versioned save schema; record the
 * selected action only when the player commits the scene.
 */
export const openingLeads={
  callback:{
    label:"Πάρε πίσω τον άγνωστο",
    reason:"Ρισκάρεις να τον προειδοποιήσεις, αλλά θα ακούσεις τη δική του πλευρά.",
    discovery:"Ακούγονται αυτοκίνητα. «Το όνομά μου εμφανίζεται σε μια συμφωνία που δεν υπέγραψα. Αν το ανακοινώσουν, θα το αρνηθώ μπροστά σε όλους», σου ψιθυρίζει η άγνωστη φωνή.",
    teaser:"Τον πήρες πίσω. Η φωνή είναι ξεκάθαρη: «Αν με ανακοινώσουν, θα τους διαψεύσω». Η Πρόεδρος περιμένει απάντηση.",
    effects:{flags:{OPENING_LEAD:"callback"},rel:{niko_arven:{familiarity:2,trust:1}}}
  },
  audit:{
    label:"Έλεγξε τη λίστα με τη Λέα",
    reason:"Ακολουθείς την πηγή των τριών αβέβαιων ψήφων πριν αποφασίσεις.",
    discovery:"Η Λέα (συνάδελφος αναλύτρια) ανοίγει τα αρχεία των κλήσεων. «Οι 119 έχουν απαντήσει προσωπικά. Για τους άλλους τρεις έχουμε μόνο σημείωμα ενός κομματικού συνεργάτη». Κάποιος παρουσίασε μια πρόβλεψη σαν δέσμευση.",
    teaser:"Ο έλεγχος της Λέας (συνάδελφος αναλύτρια) έδειξε: 119 προσωπικές δεσμεύσεις, 3 ονόματα από κομματικό σημείωμα. Τι θα κάνεις;",
    effects:{flags:{OPENING_LEAD:"audit"},rel:{lea_marin:{respect:1}},world:{information_quality:1}}
  }
};
export function getOpeningLead(id){return Object.hasOwn(openingLeads,id)?openingLeads[id]:null}
export function withOpeningLead(option,id){
  const lead=getOpeningLead(id);
  if(!lead)return option;
  const orig=option.effects||{},bonus=lead.effects;
  const relationships={...(orig.rel||{})};
  for(const [actor,patch] of Object.entries(bonus.rel||{})){
    relationships[actor]={...(relationships[actor]||{})};
    for(const [k,v] of Object.entries(patch))relationships[actor][k]=(relationships[actor][k]||0)+v;
  }
  return {...option,effects:{
    ...orig,
    flags:{...(orig.flags||{}),...(bonus.flags||{})},
    rel:relationships,
    world:{...(orig.world||{}),...Object.fromEntries(Object.entries(bonus.world||{}).map(([k,v])=>[k,(orig.world?.[k]||0)+v]))}
  }};
}
