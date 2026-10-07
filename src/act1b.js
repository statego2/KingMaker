
const c=(id,chapter,chapterTitle,title,kicker,body,evidence,question,choices,actors=[])=>({id,chapter,chapterTitle,title,kicker,body,evidence,question,choices,actors});
const o=(id,verb,title,sub,quality,result,debrief,effects={})=>({id,verb,title,sub,quality,result,debrief,effects});

const routeName=id=>({
  reform_accord:"Reform Accord",
  reconstruction:"Reconstruction Coalition",
  civic_compact:"Civic Compact"
}[id]||id);

const routeStatus=(s,id)=>{
  const v=s.routes?.[id] ?? 0;
  if(v>=64)return "Strong";
  if(v>=54)return "Viable";
  if(v>=45)return "Fragile";
  return "Unlikely";
};

const routeEvidence=s=>[
  {type:(s.routes?.reform_accord??0)>=54?"confirmed":"uncertain",label:"REFORM ACCORD",value:routeStatus(s,"reform_accord"),note:"Renewal + Civic Labour + independents"},
  {type:(s.routes?.reconstruction??0)>=54?"confirmed":"uncertain",label:"RECONSTRUCTION",value:routeStatus(s,"reconstruction"),note:"Renewal + Stability + independents"},
  {type:(s.routes?.civic_compact??0)>=54?"confirmed":"uncertain",label:"CIVIC COMPACT",value:routeStatus(s,"civic_compact"),note:"Labour + Stability + Free Cities + independent"}
];

function c4DiagnosticChoices(s){
  const p=s.flags.GOV_PATH;
  if(p==="reconstruction") return [
    o("a","Verify","Ποιο κομμάτι του old administrative network είναι capability και ποιο capture;","Χωρίζεις continuity από impunity.",.96,"Η Mara ζητά names, functions και dependencies αντί για labels.","Το hidden constraint δεν είναι αν Stability έχει 46 seats. Είναι αν μπορείς να χρησιμοποιήσεις capacity χωρίς να ξαναδημιουργήσεις το pattern που έριξε την προηγούμενη κυβέρνηση.",{routes:{reconstruction:7},world:{information_quality:1},rel:{mara_eltan:{respect:2}}}),
    o("b","Count","Πόσοι independents θα μπουν με αντάλλαγμα committee posts;","Αριθμητικά χρήσιμο, αλλά δεύτερο order.",.62,"Η Nela βγάζει την αριθμητική. Η Elena ρωτά ποιος θα ελέγχει τα implementation chokepoints.","Μπορεί να κλείσεις το 121 και να μην έχεις απαντήσει τι είδους κυβέρνηση σχημάτισες.",{routes:{reconstruction:2}}),
    o("c","Signal","Μπορεί ο Viktor να αποκηρύξει δημόσια το Harbor network;","Μεγάλη συμβολική κίνηση.",.45,"Ο Viktor αρνείται collective confession. Το channel παγώνει προσωρινά.","Η public renunciation μπορεί να αυξήσει legitimacy και να καταστρέψει τη δυνατότητα να ξεχωρίσεις συγκεκριμένη ευθύνη από συλλογική ταπείνωση.",{routes:{reconstruction:-4},rel:{viktor_sarin:{grievance:3}}})
  ];
  if(p==="civic_compact") return [
    o("a","Verify","Ποια conflicts είναι πραγματικά red lines και ποια είναι identity performance;","Χαρτογραφείς vetoes, όχι slogans.",.96,"Η Liora δίνει δύο non-negotiables. Η Mira δίνει τρία. Μόνο ένα συγκρούεται πραγματικά.","Η ideological breadth γίνεται επικίνδυνη όταν δεν ξέρεις ποια διαφορά είναι symbolic και ποια operational.",{routes:{civic_compact:7},world:{information_quality:1}}),
    o("b","Count","Πόσο σταθερά είναι τα 121 votes;","Χρήσιμο, αλλά όχι αρκετό.",.66,"Τα 121 βγαίνουν. Η Elena ρωτά αν θα βγαίνουν και στον πρώτο προϋπολογισμό.","Vote arithmetic δεν είναι coalition architecture.",{routes:{civic_compact:2}}),
    o("c","Unify","Ζητάς κοινό anti-corruption manifesto πριν συνεχίσουν.","Δημιουργεί κοινή ταυτότητα.",.48,"Το manifesto βγαίνει εύκολα. Τα δύσκολα σημεία μένουν άλυτα.","Shared enemy μπορεί να φτιάξει κυβέρνηση και να κρύψει ότι δεν υπάρχει shared governing method.",{routes:{civic_compact:-2}})
  ];
  return [
    o("a","Verify","Ποια concession χρειάζεται η Mira για να αποδείξει ότι δεν έγινε junior partner;","Βρίσκεις το distributional constraint.",.96,"Η απάντηση δεν είναι ministry prestige. Είναι binding worker-transition architecture.","Η hidden μεταβλητή είναι political sellability μέσα στο Civic Labour, όχι μόνο seat math.",{routes:{reform_accord:7},rel:{mira_solen:{respect:2}}}),
    o("b","Count","Πόσοι independents δίνουν 121;","Καθαρό coalition math.",.64,"Η αριθμητική βγαίνει οριακά. Η Elena ζητά να μάθει τι θα κρατήσει τη Mira μέσα σε έξι μήνες.","Το 121 σχηματίζει κυβέρνηση. Δεν τη διατηρεί.",{routes:{reform_accord:2}}),
    o("c","Pressure","Πόσο γρήγορα μπορεί η Renewal να κάνει public το Labour ως υπεύθυνο για delay;","Χρησιμοποιείς blame leverage.",.39,"Η Mira ενημερώνεται ότι κυκλοφορεί blame plan. Το tone της διαπραγμάτευσης σκληραίνει.","Pressure μπορεί να κερδίσει μία concession και να δηλητηριάσει τον μηχανισμό που χρειάζεσαι μετά.",{routes:{reform_accord:-5},rel:{mira_solen:{trust:-3,grievance:2}}})
  ];
}

function c6TimingChoices(s){
  const hasFriday=!!s.flags.FRIDAY_OPTION && !s.flags.FRIDAY_PUBLIC;
  if(hasFriday) return [
    o("a","Use option","Χρησιμοποιείς το Friday window και κλείνεις τα γραπτά terms πριν το announcement.","Κάνεις μικρό joint statement ότι talks continue under constitutional timetable.",.94,"Η αγορά βλέπει controlled delay, όχι vacuum. Οι negotiators αποκτούν τρεις ακόμη ημέρες χωρίς να προσποιούνται ότι το deal έκλεισε.","Η αξία της procedural optionality φαίνεται όταν σου επιτρέπει να αποφύγεις false urgency.",{world:{government_pressure:-4,public_trust:1},routes:{reform_accord:1,reconstruction:1,civic_compact:1},flags:{TIMING_CHOICE:"use_friday"}}),
    o("b","Announce","Ανακοινώνεις provisional framework τώρα, με named contingencies.","Κρατάς momentum αλλά αυξάνεις public commitment.",.78,"Τα futures σταθεροποιούνται, αλλά δύο unresolved clauses γίνονται δημόσια political promises.","Με πραγματική extra time διαθέσιμη, η premature commitment έχει μεγαλύτερο opportunity cost.",{world:{government_pressure:-2},flags:{TIMING_CHOICE:"provisional"}}),
    o("c","Pretend","Διαρρέεις ότι το deal έχει ουσιαστικά κλείσει.","Αγοράζεις market calm με ambiguity.",.20,"Τα media γράφουν «agreement». Ένας party negotiator το διαψεύδει live.","False certainty μετατρέπει bargaining friction σε credibility event.",{player:{credibility:-3},world:{information_quality:-3,government_pressure:3},flags:{TIMING_CHOICE:"fake_done"}})
  ];
  return [
    o("a","Announce","Ανακοινώνεις provisional framework με ακριβώς όσα έχουν συμφωνηθεί και όσα μένουν open.","Δεν λες ότι υπάρχει τελική κυβέρνηση.",.93,"Η αγορά βλέπει direction χωρίς fabricated certainty. Οι leaders δεσμεύονται μόνο στα core terms.","Όταν το timing window είναι στενό, calibrated provisional commitment μπορεί να είναι καλύτερο από perfection.",{world:{government_pressure:-4},routes:{reform_accord:1,reconstruction:1,civic_compact:1},flags:{TIMING_CHOICE:"provisional"}}),
    o("b","Wait","Δεν βγαίνει τίποτα μέχρι να υπογραφεί πλήρες contract.","Αποφεύγεις incomplete commitment.",.61,"Οι negotiators κερδίζουν καθαρότητα, αλλά το market opens μέσα σε vacuum.","Deliberation είναι αρετή όταν το delay δεν είναι itself irreversible.",{world:{government_pressure:3},flags:{TIMING_CHOICE:"wait"}}),
    o("c","Pretend","Διαρρέεις ότι το deal έχει κλείσει.","Κατεβάζεις panic γρήγορα.",.18,"Η διαρροή κρατά δεκαεπτά λεπτά πριν διαψευστεί.","Fake certainty είναι fragile asset.",{player:{credibility:-3},world:{information_quality:-3,government_pressure:4},flags:{TIMING_CHOICE:"fake_done"}})
  ];
}

function finalGovChoices(s){
  const ids=["reform_accord","reconstruction","civic_compact"];
  const ranked=ids.slice().sort((a,b)=>(s.routes?.[b]??0)-(s.routes?.[a]??0));
  const viable=ranked.filter(id=>(s.routes?.[id]??0)>=45);
  const use=viable.length>=2?viable:ranked.slice(0,2);
  return use.map((id,idx)=>{
    const score=s.routes?.[id]??0;
    const q=Math.min(.95,.74+(score-45)*.008);
    if(id==="reform_accord") return o(
      "gov_reform","Form","Reform Accord — Adrian Kessar PM","Renewal + Civic Labour + independent support. High reform capacity, narrow parliamentary margin.",q,
      "Στις 05:42 η Elena Varin καλεί τον Adrian Kessar να σχηματίσει κυβέρνηση. Η Mira Solen μπαίνει στη συμφωνία με binding labour-transition terms. Το πρώτο majority count είναι οριακό αλλά πραγματικό.",
      "Το route είναι βιώσιμο επειδή συνδέει growth με labour legitimacy. Το structural risk είναι dependency σε λίγες pivotal votes και η ανάγκη να μη γίνει Civic Labour junior partner.",
      {flags:{GOVERNMENT_CONFIGURATION:"GOV_REFORM_ACCORD",PRIME_MINISTER:"adrian_kessar"},world:{government_stability:6,coalition_pressure:-3,public_trust:2},institutions:{nso_capability:2},promise:{id:"COALITION_LABOUR_TRANSITION",to:"mira_solen",text:"Worker-transition framework before major automation rollout"}}
    );
    if(id==="reconstruction") return o(
      "gov_reconstruction","Form","Reconstruction Coalition — Renewal + Stability","Administrative depth and broader vote buffer, with Harbor legitimacy burden.",q,
      "Στις 06:03 ο Adrian και ο Viktor εμφανίζονται μαζί στην Presidency. Η κυβέρνηση έχει μεγαλύτερη operational depth — και κάθε δημοσιογράφος ρωτά αν η μεταρρύθμιση μόλις αγκάλιασε το old network.",
      "Το route αγοράζει capability και stability. Το burden είναι να αποδείξει ότι continuity δεν σημαίνει impunity ή restoration of capture.",
      {flags:{GOVERNMENT_CONFIGURATION:"GOV_RECONSTRUCTION",PRIME_MINISTER:"adrian_kessar"},world:{government_stability:9,public_trust:-2,coalition_pressure:-4},institutions:{nso_capability:3},promise:{id:"COALITION_INTEGRITY_FIREWALL",to:"selma_aric",text:"Aster procurement safeguards remain independent of coalition control"}}
    );
    return o(
      "gov_civic","Form","Civic Compact — Mira Solen PM","Civic Labour + Stability + Free Cities + independent support. Broad oversight, many veto points.",q,
      "Στις 05:58 η Elena Varin δίνει εντολή σχηματισμού κυβέρνησης στη Mira Solen. Η Liora Venn κρατά το signed oversight annex πάνω από το coalition photo.",
      "Το route έχει ισχυρή legitimacy architecture και πραγματική pluralism. Το structural risk είναι implementation friction από πολλαπλά veto centers.",
      {flags:{GOVERNMENT_CONFIGURATION:"GOV_CIVIC_COMPACT",PRIME_MINISTER:"mira_solen"},world:{government_stability:4,public_trust:4,coalition_pressure:-2},institutions:{nso_legitimacy:3},promise:{id:"COALITION_OVERSIGHT",to:"liora_venn",text:"Independent review and sunset discipline for exceptional coordination powers"}}
    );
  });
}

export const act1bScenes=[
c("C04_S01","04","THE PRESIDENT'S HOUR","Day 10 — Six Leaders, Six Realities","PRESIDENCY · SYNTHESIS",
[
"Η Presidency έχει πλέον μιλήσει χωριστά με όλους τους βασικούς leaders.",
"Το πρόβλημα δεν είναι έλλειψη πληροφορίας. Είναι ότι κάθε briefing χρησιμοποιεί άλλη μονάδα μέτρησης: votes, dignity, ministries, deadlines, legitimacy.",
"Η Elena θέλει ένα synthesis που να μην εξαφανίζει τη διαφορά ανάμεσα σε θέση, συμφέρον και πραγματικό control."
],
[
{type:"confirmed",label:"ADRIAN",value:"Needs a governable reform mandate",note:"Publicly talks about ministries"},
{type:"uncertain",label:"MIRA",value:"Needs visible distributional gain",note:"Not necessarily a prestigious title"},
{type:"uncertain",label:"VIKTOR",value:"Protects continuity + people",note:"Will resist collective humiliation"},
{type:"confirmed",label:"LIORA",value:"Oversight before exceptional power",note:"Sunset / audit are real constraints"}
],
"Πώς οργανώνεις το Presidential synthesis;",
[
o("a","Map","Claim → underlying interest → control → red line.","Δείχνεις τι λένε, τι θέλουν και τι μπορούν πραγματικά να μπλοκάρουν.",.97,"Η Elena διαβάζει τον πίνακα δύο φορές. «Τώρα βλέπω τη διαπραγμάτευση, όχι τις δηλώσεις.»","Strategic briefing σημαίνει να αποσυνδέεις rhetoric, incentives και power.",{player:{credibility:2},world:{information_quality:2},rel:{elena_varin:{trust:2,respect:3},mara_eltan:{respect:2}}}),
o("b","Summarize","Leader-by-leader summary.","Διατηρείς nuance αλλά όχι common structure.",.67,"Το memo είναι ακριβές. Η Elena σημειώνει: «Ξέρω τι είπε ο καθένας. Πες μου πού συγκρούονται.»","Accurate reporting δεν είναι πάντα useful synthesis.",{player:{credibility:1}}),
o("c","Recommend","Βάζεις πρώτα το preferred coalition και φιλτράρεις τα facts γύρω του.","Δίνεις clear direction.",.41,"Η Mara επιστρέφει το draft με δύο λέξεις στο margin: «analysis ή advocacy;»","Recommendation χωρίς transparent model κάνει το briefing μη ελέγξιμο.",{rel:{mara_eltan:{trust:-2}},world:{information_quality:-1}})
],["elena_varin","mara_eltan","adrian_kessar","mira_solen","viktor_sarin","liora_venn"]),

c("C04_S02","04","THE PRESIDENT'S HOUR","Day 11 — The Missing Variable","PRESIDENCY · ROUTE TEST",
(s)=>[
"Η Elena δείχνει τη route που εσύ έβαλες πρώτη στο Chapter 2: "+routeName(s.flags.GOV_PATH||"reform_accord")+".",
"«Δεν θέλω άλλη seat count. Ποιο πράγμα, αν είναι λάθος, κάνει αυτή τη route να φαίνεται βιώσιμη ενώ δεν είναι;»",
"Για πρώτη φορά το briefing ζητά explicit falsification, όχι support."
],
(s)=>[
{type:"confirmed",label:"PRIORITY ROUTE",value:routeName(s.flags.GOV_PATH||"reform_accord"),note:"Received extra SCS analytical attention"},
{type:"uncertain",label:"VIABILITY",value:routeStatus(s,s.flags.GOV_PATH||"reform_accord"),note:"Current internal route state"},
{type:"uncertain",label:"QUESTION",value:"What would falsify it?",note:"President asks for the missing variable"}
],
"Τι ελέγχεις πρώτα;",
c4DiagnosticChoices,
["elena_varin","mara_eltan","mira_solen","viktor_sarin","liora_venn"]),

c("C04_S03","04","THE PRESIDENT'S HOUR","Day 12 — The Sunset Clause","EXCEPTIONAL POWER",
[
"Η Liora Venn δεν ζητά ministry.",
"Ζητά κάτι πιο δομικό: οποιαδήποτε νέα strategic-coordination authority να λήγει αυτόματα αν δεν ανανεωθεί μετά από independent review.",
"Ο Adrian θεωρεί το sunset operational drag. Η Elena θεωρεί την απαίτηση σοβαρή."
],
[
{type:"confirmed",label:"LIORA",value:"Wants binding sunset",note:"Not a symbolic request"},
{type:"uncertain",label:"EXECUTIVE",value:"Wants continuity",note:"Fears permanent negotiation over coordination"},
{type:"confirmed",label:"PRECEDENT",value:"Rule will survive current coalition",note:"Future governments inherit it"}
],
"Τι architecture εισηγείσαι;",
[
o("a","Bind","12-month sunset, automatic expiry unless renewed.","Maximum guardrail, recurring political cost.",.84,"Η Liora το δέχεται αμέσως. Ο Adrian ζητά operational exception for active crises.","Ισχυρό restraint, αλλά renewal frequency μπορεί να κάνει long-horizon capacity hostage σε annual politics.",{routes:{civic_compact:5,reform_accord:1},institutions:{nso_legitimacy:7,nso_capability:-1,nso_personalization:-4},flags:{SUNSET:"12_month"}}),
o("b","Balance","18-month sunset + independent review + explicit renewal vote.","Χρονικό όριο, audit, και αρκετό runway για implementation.",.96,"Η Elena σημειώνει ότι ο κανόνας θα τη δεσμεύσει και αν δεν της αρέσει η επόμενη κυβέρνηση. «Τότε είναι κανόνας.»","Η αξία του sunset δεν είναι anti-power symbolism. Είναι role reversal: θα αποδεχόσουν τον ίδιο κανόνα στον αντίπαλό σου;",{routes:{civic_compact:4,reform_accord:3,reconstruction:2},institutions:{nso_legitimacy:8,nso_capability:2,nso_personalization:-5},flags:{SUNSET:"18_review"}}),
o("c","Centralize","Permanent mandate under PM control.","Maximum speed and continuity.",.46,"Ο Adrian δεν κρύβει ότι προτιμά την καθαρότητα. Η Liora κλείνει το notebook της.","Μπορεί να είναι αποτελεσματικό τώρα και να μετατρέψει coordination σε captured executive asset αργότερα.",{routes:{reform_accord:2,reconstruction:2,civic_compact:-7},institutions:{nso_capability:6,nso_legitimacy:-7,nso_personalization:7},flags:{SUNSET:"none"}}),
o("d","Defer","Κρατάς προσωρινό SCS χωρίς νέο θεσμικό κανόνα.","Preserve optionality until government forms.",.59,"Κανείς δεν κερδίζει, κανείς δεν δεσμεύεται. Το ambiguity μεταφέρεται στο Chapter 6.","Deferral is real option value, αλλά unresolved governance μετατρέπεται σε bargaining chip αργότερα.",{institutions:{nso_legitimacy:-1},flags:{SUNSET:"deferred"}})
],["liora_venn","adrian_kessar","elena_varin"]),

c("C05_S01","05","THE PRICE OF A MINISTRY","Day 17 — The Ministry Everyone Wants","IMPLEMENTATION POWER",
[
"Οι διαπραγματεύσεις περνούν από principles σε ministries.",
"Το Infrastructure portfolio μοιάζει με το μεγάλο prize. Η Lea όμως χαρτογραφεί ότι ο πραγματικός Aster control περνά από budget release, authority appointments, procurement design και permit sequencing.",
"Ένα prestige ministry μπορεί να είναι λιγότερο ισχυρό από τρεις βαρετές clauses."
],
[
{type:"confirmed",label:"VISIBLE",value:"Infrastructure Ministry",note:"Status + public ownership of Aster"},
{type:"confirmed",label:"HIDDEN",value:"Appointments / budget release / procurement",note:"Implementation chokepoints"},
{type:"uncertain",label:"RISK",value:"Trade prestige for control",note:"Parties may not notice until later"}
],
"Τι προτείνεις στους negotiators;",
[
o("a","Separate","Άφησε prestige portfolio να διαπραγματευτεί, αλλά γράψε neutral governance για appointments, budget gates και procurement.","Αποσυνδέεις status από structural control.",.96,"Οι negotiators ξαφνικά διαφωνούν λιγότερο για τον τίτλο και περισσότερο για τις clauses που πραγματικά αλλάζουν power.","Formal ministry ≠ implementation power. Η καλύτερη συμφωνία συχνά κάνει τα hidden chokepoints explicit.",{routes:{reform_accord:2,reconstruction:2,civic_compact:2},institutions:{nso_legitimacy:2},world:{information_quality:1},flags:{ASTER_GOVERNANCE_SEPARATED:true}}),
o("b","Win","Κράτα Infrastructure στο PM bloc.","Ο visible winner κρατά central control.",.55,"Το prestige issue κλείνει. Οι coalition partners αρχίζουν να ζητούν vetoes αλλού.","Concentration μπορεί να αυξήσει speed και να παράγει compensating capture σε λιγότερο ορατά σημεία.",{routes:{reform_accord:1},institutions:{nso_personalization:2},world:{coalition_pressure:2},flags:{ASTER_PM_CONTROL:true}}),
o("c","Trade","Δώσε Infrastructure στον πιο δύσκολο partner για να κλείσει η συμφωνία.","Μετατρέπεις status concession σε coalition glue.",.61,"Η συμφωνία πλησιάζει. Τρεις ημέρες μετά όλοι ανακαλύπτουν ότι μαζί με τον τίτλο πήγαν και δύο appointment powers.","Η concession μπορεί να είναι σωστή, αλλά πρέπει να ξέρεις τι ακριβώς παραχωρείς.",{world:{coalition_pressure:-2},routes:{civic_compact:1,reconstruction:1},flags:{ASTER_PORTFOLIO_TRADED:true}})
],["mara_eltan","lea_marin","adrian_kessar","mira_solen","viktor_sarin"]),

c("C05_S02","05","THE PRICE OF A MINISTRY","Day 19 — Silas's Generous Offer","PROCEDURAL LEVERAGE",
[
"Ο Silas Koren εμφανίζεται με πρόταση που μοιάζει μικρότερη απ' όσο περίμενες.",
"Δεν ζητά μεγάλο ministry. Ζητά η Stability Union να προεδρεύει στην committee που προγραμματίζει confirmation hearings για την Aster Gate Authority.",
"«Αν δεν έχεις πρόθεση να διορίσεις ακατάλληλους ανθρώπους, γιατί να σε ανησυχεί το schedule;»"
],
[
{type:"confirmed",label:"FORMAL POWER",value:"Committee chair",note:"Low prestige"},
{type:"confirmed",label:"PROCEDURAL POWER",value:"Schedules confirmations",note:"Can accelerate or stall appointments"},
{type:"uncertain",label:"SILAS MOTIVE",value:"Leverage / safeguard / both",note:"Not directly observable"}
],
"Πώς απαντάς;",
[
o("a","Accept","Δέχεσαι. Το chair είναι μικρό τίμημα.","Κλείνεις votes φθηνά.",.31,"Ο Silas δεν χαμογελά. Απλώς ζητά να μπει η clause ακριβώς όπως γράφτηκε.","Η χαμηλή status value μπορεί να κρύβει υψηλή agenda value.",{routes:{reconstruction:4},rel:{silas_koren:{respect:-1}},flags:{SILAS_SCHEDULING_VETO:true}}),
o("b","Reject","Αρνείσαι οποιοδήποτε special procedural right.","Μηδενίζεις το leverage.",.63,"Ο Silas απαντά: «Τότε τουλάχιστον ξέρεις τι αξίζει.»","Το trap detection δεν σημαίνει ότι κάθε leverage πρέπει να απορρίπτεται. Μπορεί να χρειάζεται redesign.",{routes:{reconstruction:-2},rel:{silas_koren:{respect:1}},flags:{SILAS_OFFER_REJECTED:true}}),
o("c","Bound","Δέχεσαι chair μόνο με published scheduling rule, deadlines και symmetrical minority rights.","Μετατρέπεις personal veto σε neutral procedure.",.97,"Ο Silas διαβάζει τη clause και λέει: «Αυτό θα με περιορίζει και όταν κερδίσουμε.» — «Ναι.» — «Τότε είναι σοβαρή πρόταση.»","Το καλύτερο counter σε hidden leverage μπορεί να είναι rule design που παραμένει χρήσιμο χωρίς να ανήκει σε πρόσωπο.",{routes:{reconstruction:5,reform_accord:2,civic_compact:2},rel:{silas_koren:{respect:5,trust:1}},institutions:{nso_legitimacy:2},flags:{SILAS_RULE_NEUTRAL:true}}),
o("d","Expose","Διαρρέεις ότι η Stability ζήτησε κρυφό veto.","Αυξάνεις reputational cost.",.37,"Το headline γράφει «Stability sought control of Aster appointments». Το offer πεθαίνει — και μαζί του δύο quiet channels.","Η exposure αφαιρεί leverage και μπορεί να καταστρέψει την πιθανότητα lawful redesign.",{routes:{reconstruction:-6},rel:{silas_koren:{trust:-5,grievance:5}},world:{coalition_pressure:3},flags:{SILAS_EXPOSED:true}})
],["silas_koren","viktor_sarin","nela_orr"]),

c("C05_S03","05","THE PRICE OF A MINISTRY","Day 22 — The Coalition Contract","COMMITMENT ARCHITECTURE",
(s)=>[
"Η route που προηγείται τώρα είναι "+routeName(Object.entries(s.routes||{}).sort((a,b)=>b[1]-a[1])[0]?.[0]||"reform_accord")+".",
"Οι leaders συμφωνούν πλέον σε αρκετά για να γράψουν contract. Το ερώτημα είναι πόσο από τη συμφωνία πρέπει να γίνει public, measurable και enforceable.",
"Ό,τι μείνει vague σήμερα θα γίνει interpretation fight αργότερα."
],
routeEvidence,
"Τι format προτείνεις;",
[
o("a","Publish","Λεπτομερές public contract με measurable commitments, annex για implementation και explicit dispute process.","Μειώνεις ambiguity και side-letter politics.",.95,"Το draft φτάνει 27 σελίδες. Κανείς δεν το αγαπά, αλλά όλοι ξέρουν πού θα γίνει η επόμενη σύγκρουση.","Commitment architecture δεν εξαφανίζει disagreement. Κάνει το disagreement πιο auditable.",{world:{public_trust:2,information_quality:2,coalition_pressure:-3},routes:{reform_accord:3,reconstruction:3,civic_compact:3},promise:{id:"COALITION_PUBLIC_CONTRACT",to:"coalition",text:"Publish measurable coalition commitments and dispute process"},flags:{CONTRACT_STYLE:"auditable"}}),
o("b","Keep flexible","Τριών σελίδων principles + private side letters.","Maximum room to adapt.",.53,"Το public launch ακούγεται ενωμένο. Μέσα σε 48 ώρες δύο parties περιγράφουν διαφορετικά τι υποσχέθηκαν.","Flexibility έχει αξία, αλλά private ambiguity μετατρέπει κάθε future dispute σε attribution war.",{world:{coalition_pressure:2,information_quality:-2},flags:{CONTRACT_STYLE:"side_letters"}}),
o("c","Minimal","Μόνο core confidence agreement. Τα policy fights λύνονται case-by-case.","Δεν κλειδώνεις future governments σε assumptions του σήμερα.",.65,"Η κυβέρνηση γίνεται ευκολότερη να σχηματιστεί και δυσκολότερη να προβλεφθεί.","Minimal contract αυξάνει optionality και το future brokerage burden.",{routes:{reconstruction:1,civic_compact:1,reform_accord:1},institutions:{nso_personalization:2},flags:{CONTRACT_STYLE:"minimal"}})
],["adrian_kessar","mira_solen","viktor_sarin","liora_venn","niko_arven"]),

c("C06_S01","06","GOVERNMENT AT DAWN","Day 29 — Ninety Minutes to Markets","TIMING WINDOW",
(s)=>[
"Το market opens σε ενενήντα λεπτά.",
s.flags.FRIDAY_OPTION&&!s.flags.FRIDAY_PUBLIC?"Η procedural option που κράτησες κλειστή στο Day Zero υπάρχει ακόμη. Δεν χρειάζεται να προσποιηθείς ότι σήμερα είναι το τελευταίο λεπτό.":"Δεν έχεις καθαρό extra procedural window που να μπορείς να χρησιμοποιήσεις χωρίς νέο political cost.",
"Υπάρχει framework. Δεν υπάρχει ακόμη πλήρες signed coalition contract."
],
routeEvidence,
"Πώς χειρίζεσαι το timing;",
c6TimingChoices,
["elena_varin","ivo_marek","mara_eltan","adrian_kessar","mira_solen"]),

c("C06_S02","06","GOVERNMENT AT DAWN","Day 31 — Who Owns Strategy?","NSO FOUNDING",
[
"Η τελευταία μεγάλη σύγκρουση δεν αφορά ministry.",
"Αφορά το τι θα γίνει το SCS μετά τον σχηματισμό κυβέρνησης.",
"Όλοι το θέλουν επειδή όλοι κατάλαβαν ότι όποιος ελέγχει cross-ministry information, agenda preparation και implementation monitoring αποκτά power χωρίς να υπογράφει τις περισσότερες αποφάσεις."
],
[
{type:"confirmed",label:"SCS",value:"Useful, temporary",note:"Low formal authority"},
{type:"uncertain",label:"PROPOSAL A",value:"PM-controlled strategy unit",note:"Fast / partisan risk"},
{type:"uncertain",label:"PROPOSAL B",value:"Chartered cross-government NSO",note:"Slower / durable legitimacy"},
{type:"uncertain",label:"PROPOSAL C",value:"Coalition quota board",note:"Represented / fragmented"}
],
"Ποιο institutional design εισηγείσαι;",
[
o("a","Centralize","Executive Strategy Unit κάτω από τον PM.","Καθαρή command chain και υψηλή speed.",.62,"Οι ministers καταλαβαίνουν αμέσως ποιος ελέγχει το agenda. Η Liora ζητά formal opposition oversight.","Η λύση είναι λειτουργική, αλλά μετατρέπει analytical coordination σε executive asset.",{institutions:{nso_capability:9,nso_legitimacy:-6,nso_personalization:7},routes:{reform_accord:2,reconstruction:2,civic_compact:-4},flags:{NSO_CHARTER:"pm_controlled"}}),
o("b","Charter","Cross-government NSO με narrow statutory remit, audit, fixed reporting rules και director που δεν αλλάζει με ένα phone call.","Λιγότερη άμεση control, μεγαλύτερη durability.",.97,"Η Elena ζητά η appointment process να είναι γραμμένη πριν ανακοινωθεί το office. Η Mara για πρώτη φορά χαμογελά.","Η ισχυρότερη long-term θέση μπορεί να είναι ένας θεσμός που δεν μπορείς να χρησιμοποιήσεις ακριβώς όπως θέλεις.",{institutions:{nso_capability:6,nso_legitimacy:10,nso_personalization:-7},routes:{reform_accord:2,reconstruction:2,civic_compact:3},flags:{NSO_CHARTER:"chartered"}}),
o("c","Quota","Board με quota εκπροσώπους coalition parties.","Όλοι έχουν seat και κανείς δεν μονοπωλεί.",.50,"Το board λύνει το ownership fight. Μετά ανοίγει τρεις νέους για το ποιος βλέπει ποιο raw data.","Representation μειώνει capture risk αλλά μπορεί να εισάγει partisan filtration μέσα στην ίδια τη πληροφορία.",{institutions:{nso_capability:-4,nso_legitimacy:2,nso_personalization:-2},world:{information_quality:-2},flags:{NSO_CHARTER:"quota_board"}}),
o("d","Temporary","Κρατάς το SCS προσωρινό μέχρι να περάσει η πρώτη crisis περίοδος.","Δεν κλειδώνεις institution μέσα σε coalition bargaining.",.68,"Όλοι συμφωνούν — επειδή όλοι πιστεύουν ότι θα κερδίσουν το επόμενο round.","Deferral προστατεύει από premature design και αφήνει ownership unresolved ακριβώς όταν το office γίνεται ισχυρότερο.",{institutions:{nso_capability:1,nso_legitimacy:-2,nso_personalization:2},flags:{NSO_CHARTER:"temporary"}})
],["elena_varin","mara_eltan","liora_venn","adrian_kessar"]),

c("C06_S03","06","GOVERNMENT AT DAWN","Day 32 — Government at Dawn","CONSTITUTIONAL FORMATION",
(s)=>[
"Στις 05:21 η Elena Varin έχει μπροστά της τρεις folders.",
"Δεν έχουν το ίδιο βάρος πλέον. Οι προηγούμενες 31 ημέρες άλλαξαν vote confidence, trust, procedural options και το κόστος κάθε coalition.",
"Δεν διαλέγεις «ποια παράταξη σου αρέσει». Διαλέγεις ποια governing architecture μπορείς να υπερασπιστείς με τα δεδομένα που δημιούργησες."
],
routeEvidence,
"Ποια κυβέρνηση εισηγείσαι να σχηματιστεί;",
finalGovChoices,
["elena_varin","mara_eltan","adrian_kessar","mira_solen","viktor_sarin","liora_venn","niko_arven","silas_koren"])
];
