import {act1bScenes} from "./act1b.js";


export const people={
lea_marin:{name:"Lea Marin",initials:"LM",role:"Senior data analyst · SCS",note:"Ακριβής, γρήγορη, δύσπιστη απέναντι στη βεβαιότητα."},
mara_eltan:{name:"Dr. Mara Eltan",initials:"ME",role:"Director · SCS",note:"Χτίζει strategic capacity χωρίς shadow government."},
elena_varin:{name:"Elena Varin",initials:"EV",role:"President of Lydria",note:"Θεσμική νομιμοποίηση πάνω από προσωπική ευκολία."},
ivo_marek:{name:"Ivo Marek",initials:"IM",role:"Chief of Staff · Presidency",note:"Gatekeeper του σπανιότερου πόρου: attention."},
nela_orr:{name:"Nela Orr",initials:"NO",role:"Senior Clerk · Assembly",note:"Procedure ως κρυφή μορφή ισχύος."},
niko_arven:{name:"Niko Arven",initials:"NA",role:"Independent MP · Sera",note:"Pivotal vote· refuses to be treated as a number."},
silas_koren:{name:"Silas Koren",initials:"SK",role:"Strategist · Stability Union",note:"Παρατηρεί patterns πριν επιχειρήσει exploit."},
nadia_serrin:{name:"Nadia Serrin",initials:"NS",role:"Investigative journalist · Civic Wire",note:"Κάθε source έχει motive· κάθε motive χρειάζεται δεύτερο έλεγχο."},
selma_aric:{name:"Selma Aric",initials:"SA",role:"Integrity Commissioner",note:"Evidence that survives court and time."},
anton_beran:{name:"Anton Beran",initials:"AB",role:"Caretaker Prime Minister",note:"Institutional memory με Harbor baggage."},
adrian_kessar:{name:"Adrian Kessar",initials:"AK",role:"Leader · Renewal Alliance",note:"Reform urgency, competence and a temptation toward centralization."},
mira_solen:{name:"Mira Solen",initials:"MS",role:"Leader · Civic Labour",note:"Growth is acceptable only if workers do not carry the transition alone."},
viktor_sarin:{name:"Viktor Sarin",initials:"VS",role:"Leader · Stability Union",note:"Continuity, administrative depth and the burden of the old system."},
liora_venn:{name:"Liora Venn",initials:"LV",role:"Leader · Free Cities List",note:"Transparency, pluralism and suspicion of concentrated power."}
};

const c=(id,chapter,chapterTitle,title,kicker,body,evidence,question,choices,actors=[])=>({id,chapter,chapterTitle,title,kicker,body,evidence,question,choices,actors});
const o=(id,verb,title,sub,quality,result,debrief,effects={})=>({id,verb,title,sub,quality,result,debrief,effects});

const baseScenes=[
c("C01_S01","01","DAY ZERO","07:12 — The Briefing Room","RESTRICTED · COALITION COUNT",
["Η Lydria ξύπνησε χωρίς κυβέρνηση.","Το Renewal whip γράφει «122 committed». Η Lea έχει επιβεβαιώσει προσωπικά μόνο 119· άλλοι τρεις είναι probable.","Η Presidency ζητά αριθμό σε δεκαπέντε λεπτά."],
[{type:"uncertain",label:"PARTY WHIP",value:"122 committed",note:"Strong incentive to show momentum"},{type:"confirmed",label:"LEA / DIRECT CHECK",value:"119 confirmed + 3 probable",note:"Independent confirmations"},{type:"uncertain",label:"CLOCK",value:"15 minutes",note:"Presidential briefing window"}],
"Τι αριθμό στέλνεις;",
[
o("a","Commit","122 committed.","Καθαρό signal, αλλά probability γίνεται fact.",.36,"Το brief φεύγει γρήγορα. Η Lea μένει σιωπηλή για λίγο.","Η πολιτική καθαρότητα αγοράστηκε με false precision.",{player:{credibility:-1},rel:{lea_marin:{trust:-3,respect:-2}},flags:{OPENING_COUNT:"overstated"},callback:{after:5,from:"Civic Wire",subject:"One of the '122' denies committing",body:"Η Nadia ζητά να μάθει ποιος θεωρήθηκε confirmed."}}),
o("b","Calibrate","119 confirmed. 3 probable.","Ξεχωρίζεις evidence από estimate.",.96,"Η Mara απαντά: «Αυτό μπορώ να υπερασπιστώ.»","Decision quality κρίνεται από την πληροφορία που είχες, όχι από το τελικό vote.",{player:{credibility:2},world:{information_quality:1},rel:{lea_marin:{trust:2,respect:3},mara_eltan:{trust:2}},flags:{OPENING_COUNT:"calibrated"},callback:{after:5,from:"Nadia Serrin",subject:"Your morning brief",body:"«119 confirmed, 3 probable. Θέλω να σε ρωτήσω κάτι για το Harbor file.»"}}),
o("c","Delay","Δεν δίνω αριθμό ακόμα.","Ελαχιστοποιείς epistemic risk, αλλά καις χρόνο.",.58,"Ο Ivo απαντά: «Τότε θα αποφασίσουμε χωρίς εσάς για την ώρα.»","Uncertainty δεν απαιτεί σιωπή· μπορεί να απαιτεί calibrated report.",{world:{government_pressure:2},rel:{ivo_marek:{respect:-2}},flags:{OPENING_COUNT:"withheld"}})
],["lea_marin","mara_eltan","ivo_marek"]),

c("C01_S02","01","DAY ZERO","09:05 — The Clerk Nobody Called","PROCEDURAL NOTE",
["Όλοι θεωρούν ότι το confidence window κλειδώνει για την Τρίτη.","Η Nela Orr βρίσκει filing clause που επιτρέπει νόμιμα να μεταφερθεί ως την Παρασκευή.","Δεν σου βρήκε ψήφους. Σου έδωσε χρόνο."],
[{type:"uncertain",label:"CONSENSUS",value:"Tuesday",note:"Repeated by parties and media"},{type:"confirmed",label:"RULES OFFICE",value:"Friday is lawful",note:"If filing occurs before 14:00"}],
"Τι κάνεις με την procedural option;",
[
o("a","Preserve","Ενημερώνεις Presidency και Mara, όχι ακόμη public.","Κρατάς option value.",.92,"Ο Ivo ζητά το exact citation. Η Nela το στέλνει σε τρεις γραμμές.","Μια option αξίζει επειδή υπάρχει· δεν χρειάζεται να ενεργοποιηθεί ή να διαφημιστεί.",{player:{credibility:1},rel:{nela_orr:{respect:3},ivo_marek:{trust:1,respect:2}},flags:{FRIDAY_OPTION:true}}),
o("b","Suppress","Κρατάς το Tuesday assumption.","Η artificial urgency μπορεί να κλείσει deal.",.39,"Η Nela σημειώνει ότι το memo της δεν μπήκε στο brief.","Κρύβεις πραγματική option από τον decision maker.",{world:{information_quality:-2,government_pressure:2},rel:{nela_orr:{trust:-3},mara_eltan:{trust:-2}},flags:{FRIDAY_SUPPRESSED:true}}),
o("c","Expose","Δίνεις το note σε reporter.","Το κοινό μαθαίνει ότι υπάρχει χρόνος.",.34,"Push alert: «Η χώρα έχει ως την Παρασκευή». Τα war rooms αλλάζουν tempo.","Αληθινή πληροφορία μπορεί να αλλάξει το bargaining game πριν αποφασιστεί αν πρέπει.",{world:{public_trust:1,government_pressure:3},rel:{ivo_marek:{trust:-4}},flags:{FRIDAY_PUBLIC:true}})
],["nela_orr","ivo_marek","mara_eltan"]),

c("C01_S03","01","DAY ZERO","10:40 — One Page","PRESIDENTIAL BRIEF",
["Ο Ivo επιστρέφει το οκτασέλιδο draft.","«Η Πρόεδρος έχει δώδεκα λεπτά. Θέλει fact, inference και απόφαση — όχι όλη την ημέρα.»","Το πρόβλημα είναι πλέον information architecture."],
[{type:"confirmed",label:"BANDWIDTH",value:"12 minutes",note:"President + two advisers"},{type:"uncertain",label:"OPEN QUESTIONS",value:"5",note:"Only two change today's decision"}],
"Πώς ξαναγράφεις το brief;",
[
o("a","Structure","Facts → uncertainties → viable options → decision.","Κόβεις background που δεν αλλάζει την επιλογή.",.97,"Ο Ivo σταματά στο τέλος της πρώτης σελίδας. «Αυτό μπαίνει.»","Information compression είναι power όταν παραμένει auditable.",{player:{credibility:2},rel:{ivo_marek:{trust:3,respect:4},elena_varin:{respect:2}},flags:{BRIEF_STYLE:"structured"}}),
o("b","Advocate","Μία recommendation + supporting facts.","Καθαρό, αλλά selective.",.49,"Η Mara ζητά να δει το appendix πριν φύγει.","Αν το evidence filtering ακολουθεί το conclusion, ο analyst γίνεται hidden advocate.",{rel:{mara_eltan:{trust:-2}},flags:{BRIEF_STYLE:"advocacy"}}),
o("c","Include","Κρατάς όλο το context.","Η Πρόεδρος πρέπει να δει τα πάντα.",.41,"Ο Ivo κλείνει τον φάκελο. «Θα το συμπτύξω εγώ.»","Όταν attention είναι constraint, το να μη διαλέγεις hierarchy είναι επίσης επιλογή.",{player:{credibility:-1},rel:{ivo_marek:{respect:-3}},flags:{BRIEF_STYLE:"overloaded"}})
],["ivo_marek","elena_varin","mara_eltan"]),

c("C02_S01","02","THE 121ST VOTE","Day 2 — Niko Arven","PRIVATE MEETING",
["Τρία κόμματα έχουν ήδη προσφέρει στον Niko chair, funding ή reputational pressure.","Δεν σε ρωτά τι του προσφέρεις.","«Όλοι μου λένε τι είναι καλό για τη χώρα. Ποιος πληρώνει όταν κάνετε λάθος;»"],
[{type:"confirmed",label:"SERA ISLANDS",value:"High energy cost",note:"Grid + ferry dependence"},{type:"uncertain",label:"NIKO",value:"Pivotal, not captive",note:"Local legitimacy matters"}],
"Πώς ανοίγεις;",
[
o("a","Elicit","«Ποιο ρίσκο για τα νησιά δεν κατάλαβε κανείς;»","Μαθαίνεις objective πριν προσφέρεις.",.95,"«Το grid. Αν το Aster πάρει όλο το capital, τα νησιά θα πληρώσουν ξανά.»","Leverage δεν σημαίνει ότι το utility είναι απλώς “δώσε μου κάτι”.",{rel:{niko_arven:{trust:3,respect:4}},flags:{NIKO_INTEREST:true},callback:{after:3,from:"Niko Arven",subject:"Not a promise. A number.",body:"«Review για island grid πριν κλειδώσει το budget και μπορώ να κρατήσω δύο independents στο δωμάτιο.»"}}),
o("b","Trade","Committee chair + island funding.","Συγκεκριμένο package πριν diagnostic work.",.56,"«Ωραία πακέτα. Κανείς δεν ρώτησε αν αυτά είναι τα προβλήματα.»","Η offer-first λογική μπορεί να αγοράσει support και να χάσει understanding.",{player:{political_capital:-1},rel:{niko_arven:{respect:-1,dependency:2}},flags:{NIKO_TRANSACTIONAL:true}}),
o("c","Pressure","Του λες ότι θα χρεωθεί δημόσια το deadlock.","Χρησιμοποιείς reputational leverage.",.27,"Ο Niko χαμογελά. «Τότε χρειάζεστε καλύτερο αφήγημα.»","Το grievance επιβιώνει πολύ περισσότερο από μία ψήφο.",{rel:{niko_arven:{trust:-5,grievance:6,respect:-2}},world:{coalition_pressure:2},flags:{NIKO_PRESSURED:true}})
],["niko_arven"]),

c("C02_S02","02","THE 121ST VOTE","Day 3 — Two Messages, One Rumor","SOURCE PROVENANCE",
["Renewal aide: «Ο Niko έκλεισε με Stability».","Media producer: «Όλοι στο Assembly ακούνε το ίδιο».","Η Lea βρίσκει ότι και οι δύο πληροφορίες περνούν από το ίδιο parliamentary chat."],
[{type:"uncertain",label:"SOURCE A",value:"Renewal aide",note:"Political incentive"},{type:"uncertain",label:"SOURCE B",value:"Media producer",note:"Looks independent"},{type:"confirmed",label:"PROVENANCE",value:"Shared chain",note:"Not independent corroboration"}],
"Πώς αντιδράς;",
[
o("a","Verify","Ψάχνεις ανεξάρτητο route.","Δύο mouths ≠ δύο sources.",.98,"Η δεύτερη διαδρομή δεν επιβεβαιώνει secret deal. Το rumor μένει plausible.","Source independence είναι χωριστή ερώτηση από source count.",{world:{information_quality:2},rel:{lea_marin:{respect:2}},flags:{SILAS_VERIFY:true},silas:"verification_depth"}),
o("b","Confront","Παίρνεις αμέσως τον Niko.","Direct access, αλλά αποκαλύπτεις response threshold.",.65,"«Αν είχα συμφωνία, γιατί θα στο έλεγα επειδή κάποιος έγραψε κάτι σε chat;»","Το direct ask είναι data collection και ταυτόχρονα signal προς τους άλλους.",{rel:{niko_arven:{trust:-1}},flags:{SILAS_SPEED:true},silas:"response_speed"}),
o("c","Amplify","Μεταφέρεις τη φήμη για να αυξήσεις urgency.","Χρησιμοποιείς unverified claim ως εργαλείο.",.22,"Σε μία ώρα το rumor έχει μπει σε τρία νέα channels.","Η πληροφορία δεν είναι μόνο κάτι που πιστεύεις· μπορεί να γίνει causal weapon.",{world:{information_quality:-4,coalition_pressure:3},player:{credibility:-2},flags:{RUMOR_AMPLIFIED:true},silas:"disclosure_style"})
],["lea_marin","niko_arven","silas_koren"]),

c("C02_S03","02","THE 121ST VOTE","Day 4 — Three Viable Paths","COALITION ARCHITECTURE",
["Τρεις routes είναι πραγματικά βιώσιμες.","Καμία δεν είναι «η σωστή κυβέρνηση». Κάθε μία λύνει διαφορετικό constraint και δημιουργεί άλλη dependency.","Η Mara ζητά πού αξίζει να βάλει το SCS την επόμενη ημέρα analytical effort."],
[{type:"confirmed",label:"REFORM ACCORD",value:"Renewal + Civic Labour + independents",note:"Reform/labour bridge · fragile math"},{type:"confirmed",label:"RECONSTRUCTION",value:"Renewal + Stability + independents",note:"Capacity · legitimacy cost"},{type:"confirmed",label:"CIVIC COMPACT",value:"Labour + Stability + Free Cities",note:"Oversight · more veto points"}],
"Ποια route stress-testάρεις πρώτη;",
[
o("a","Stress-test","Reform Accord","Δοκιμάζεις distribution + one-vote fragility.",.83,"Η Mira ζητά confidential distribution table.","Η επιλογή route δεν είναι moral endorsement· είναι allocation analytical capacity.",{flags:{GOV_PATH:"reform_accord"},routes:{reform_accord:7}}),
o("b","Stress-test","Reconstruction Coalition","Δοκιμάζεις continuity χωρίς capture.",.80,"Ο Viktor ανοίγει quiet channel. Το όνομα Silas Koren εμφανίζεται στο calendar.","Administrative memory είναι asset και liability μαζί.",{flags:{GOV_PATH:"reconstruction"},routes:{reconstruction:7},rel:{silas_koren:{familiarity:2}}}),
o("c","Stress-test","Civic Compact","Δοκιμάζεις broad oversight coalition.","Περισσότερα veto points, αλλά real outside option.",.77,"Η Liora ζητά rules πριν ministries.","Outside option αλλάζει bargaining power ακόμη και αν δεν γίνει τελικό government.",{flags:{GOV_PATH:"civic_compact"},routes:{civic_compact:7}})
],["mara_eltan","silas_koren"]),

c("C03_S01","03","THE FILE","Day 6 — “A Page Your People Say Does Not Exist”","HARBOR CONTRACTS",
["Η Nadia στέλνει crop από procurement memo.","Contract numbers και meeting log ταιριάζουν με το archive.","Η explosive handwritten annotation — «DC wants clause narrow enough» — δεν υπάρχει σε κανένα SCS copy."],
[{type:"confirmed",label:"CONTRACT REFERENCES",value:"Match archive",note:"High authenticity"},{type:"confirmed",label:"MEETING",value:"Occurred",note:"Context incomplete"},{type:"uncertain",label:"ANNOTATION",value:"Unverified",note:"Could be original, later note, or alteration"}],
"Ποια είναι η ακριβέστερη διάγνωση;",
[
o("a","Separate","Mostly authentic document; annotation unverified.","Χωρίζεις document authenticity από annotation meaning.",.98,"Η Lea: «Αρκετό για να ερευνήσουμε. Όχι για να πούμε ιστορία.»","True document + uncertain layer μπορεί να παράγει false total picture.",{world:{information_quality:2},rel:{lea_marin:{respect:2},nadia_serrin:{respect:2}},flags:{HARBOR_DIAGNOSIS:"mixed"}}),
o("b","Dismiss","Όλο το page είναι fake.","Ένα unverified layer μολύνει τα πάντα.",.25,"Η Lea: «Αυτό δεν ακολουθεί από τα δεδομένα.»","Αμφίβολο στοιχείο δεν εξαφανίζει τα independently verified parts.",{world:{information_quality:-2},rel:{lea_marin:{trust:-2,respect:-3}},flags:{HARBOR_DIAGNOSIS:"dismissed"}}),
o("c","Conclude","Αποδεικνύει ότι ο Damir ζήτησε tailored clause.","Συνδέεις initials + context + annotation.",.30,"Η Mara: «Μου λες τι ξέρουμε ή τι φοβάσαι ότι σημαίνει;»","Plausible inference δεν είναι yet established fact.",{player:{credibility:-1},rel:{mara_eltan:{trust:-2}},flags:{HARBOR_DIAGNOSIS:"overclaim"}})
],["nadia_serrin","lea_marin","mara_eltan"]),

c("C03_S02","03","THE FILE","Day 6 — Who Gets the Page First?","CHAIN OF CUSTODY",
["Η Nadia θέλει answer απόψε. Η Integrity Commission έχει ongoing investigation.","Ο Anton μπορεί να δώσει context, αλλά έχει reputational incentive.","Κάθε extra recipient αυξάνει leak surface."],
[{type:"uncertain",label:"NADIA",value:"Publication clock",note:"Hours"},{type:"confirmed",label:"SELMA",value:"Investigative authority",note:"Can protect evidence"},{type:"uncertain",label:"ANTON",value:"Context source",note:"Also self-interested"}],
"Ποια sequence διαλέγεις;",
[
o("a","Sequence","Mara → Selma → context → calibrated reply.","Προστατεύεις investigation χωρίς να υπόσχεσαι silence.",.95,"Η Selma: «Στείλε original crop. Μην σχολιάσεις handwriting ακόμη.»","Η διαδικασία μπορεί να παράγει καλύτερη αλήθεια από το fastest public reaction.",{rel:{selma_aric:{trust:4,respect:3},mara_eltan:{trust:2}},flags:{HARBOR_PROCESS:"protected"}}),
o("b","Disclose","Επιβεβαιώνεις στη Nadia ό,τι ταιριάζει.","Public interest first, με caveat για annotation.",.77,"Η Nadia: «Fair. Θα γράψω exactly that.»","Defensible, αλλά αυξάνει publication pressure πριν ασφαλιστεί evidence.",{rel:{nadia_serrin:{trust:4,respect:2},selma_aric:{trust:-1}},flags:{HARBOR_PROCESS:"journalistic"}}),
o("c","Context","Παίρνεις πρώτα τον Anton.","Ίσως λύσει ambiguity σε ένα call.",.47,"Ο Anton: «Το meeting έγινε. Το note δεν το έχω ξαναδεί.»","Subject-first contact μπορεί να βελτιώσει context και να δημιουργήσει coordination risk.",{rel:{anton_beran:{familiarity:3},selma_aric:{trust:-2}},flags:{HARBOR_PROCESS:"subject_first"}})
],["nadia_serrin","selma_aric","anton_beran"]),

c("C03_S03","03","THE FILE","Day 7 — The Line You Can Defend","PUBLIC LINE",
(state)=>[
state.flags.OPENING_COUNT==="calibrated"?"Η Mara ακουμπά δίπλα στο Harbor page το πρώτο σου brief: «Την πρώτη μέρα ξεχώρισες confirmed από probable.»":state.flags.OPENING_COUNT==="overstated"?"Η Mara ακουμπά το πρώτο brief δίπλα στο page: «Την πρώτη μέρα αφήσαμε probability να γίνει fact. Δεν θα το ξανακάνουμε εδώ.»":"Η Mara: «Δεν μπορούμε να περιμένουμε certainty για πάντα. Μπορούμε όμως να ονομάζουμε σωστά την uncertainty.»",
"Η Nadia πιθανότατα δημοσιεύει σήμερα. Η Selma δεν έχει ολοκληρώσει forensic work.","Η Πρόεδρος χρειάζεται μία public line πριν το μεσημέρι."
],
[{type:"confirmed",label:"KNOWN",value:"Real meeting + contract references",note:"Confirmed"},{type:"uncertain",label:"UNKNOWN",value:"Handwriting provenance / intent",note:"Active investigation"},{type:"uncertain",label:"PUBLIC CLOCK",value:"Hours",note:"Story likely publishes"}],
"Τι εισηγείσαι;",
[
o("a","Calibrate","«Μέρος του υλικού είναι αυθεντικό. Το annotation ερευνάται.»","Δεν προκαταλαμβάνεις την έρευνα.",.97,"Η Mara: «Αυτό μπορεί να παραμείνει ακριβές και αύριο. Χρησιμοποίησέ το.»","Truthfulness είναι relation between words και likely interpretation — όχι legalistic escape.",{player:{credibility:3},world:{information_quality:2,public_trust:1},rel:{mara_eltan:{trust:3,respect:3},elena_varin:{trust:2,respect:2},selma_aric:{trust:2}},flags:{FINAL_LINE:"calibrated"}}),
o("b","Defend","«Δεν υπάρχει confirmed evidence of wrongdoing.»","Technically true, wider implication.",.44,"Η Mara: «Και τι πιστεύεις ότι θα ακούσει ο κόσμος;»","Technically true μπορεί να είναι strategically misleading.",{player:{credibility:-1},world:{public_trust:-1},rel:{nadia_serrin:{trust:-3}},flags:{FINAL_LINE:"defensive"}}),
o("c","Release","Δημοσιεύεις όλο το page.","Maximum transparency πριν provenance work.",.37,"Η Selma: «Τώρα αποδεικνύουμε chain of custody μπροστά σε όλη τη χώρα.»","Transparency χωρίς sequencing μπορεί να μειώσει, όχι να αυξήσει, information quality.",{world:{public_trust:1,information_pressure:4},rel:{selma_aric:{trust:-5}},flags:{FINAL_LINE:"full_release"}})
],["mara_eltan","elena_varin","nadia_serrin","selma_aric"])
];

export const scenes=[...baseScenes,...act1bScenes];

export const inboxSeed=[
{id:"m1",from:"Dr. Mara Eltan",subject:"07:30 briefing",body:"Bring me a count I can defend, not a count somebody wants to be true.",unread:true},
{id:"m2",from:"Ivo Marek",subject:"Coalition status",body:"One page. Confirmed facts first. Decision points at the end.",unread:true}
];
