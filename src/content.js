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
c("C01_S01","01","Η ΑΡΧΗ","07:12 — Το μήνυμα","ΕΝΑ ΤΗΛΕΦΩΝΗΜΑ · ΔΕΚΑΠΕΝΤΕ ΛΕΠΤΑ",
[
"Το κινητό δονείται πάνω στο άδειο γραφείο. Μια άγνωστη φωνή: «Με έχουν μετρήσει στην κυβέρνηση. Δεν έχω υποσχεθεί την ψήφο μου σε κανέναν». Η Λέα σηκώνει το βλέμμα. «Λένε ότι έχουν 122. Εμείς έχουμε επιβεβαιώσει 119. Οι άλλοι τρεις δεν έχουν πει το ναι». Σε δεκαπέντε λεπτά η Πρόεδρος περιμένει την αναφορά σου.",
"Η κυβέρνηση έπεσε. Οι εκλογές δεν έδωσαν καθαρό νικητή. Στο γραφείο υπάρχουν καφές, μια οθόνη και μια διαφορά τριών ανθρώπων ανάμεσα στο «μπορεί» και το «έγινε».",
"Η Μάρα, η προϊσταμένη σου, έχει αφήσει μια σημείωση: «Γράψε μόνο αυτό που μπορείς να υπερασπιστείς. Αν υπάρχει αμφιβολία, ονόμασέ την»."
],
[
{type:"uncertain",label:"ΔΗΜΟΣΙΑ ΔΗΛΩΣΗ",value:"122 ψήφοι εξασφαλισμένες",note:"Το κόμμα θέλει να δείξει ότι η κυβέρνηση είναι σχεδόν έτοιμη"},
{type:"confirmed",label:"ΑΝΕΞΑΡΤΗΤΟΣ ΕΛΕΓΧΟΣ",value:"119 βέβαιες, 3 πιθανές",note:"Η Λέα έχει ελέγξει προσωπικά τις βέβαιες δεσμεύσεις"},
{type:"uncertain",label:"Η ΠΡΟΘΕΣΜΙΑ",value:"15 λεπτά",note:"Η Προεδρία ζητά ενημέρωση, όχι τελική απόφαση"}
],
"Τι θα μάθει η Πρόεδρος από εσένα;",
[
o("a","Στείλε","Γράφεις «122 ψήφοι».","Δίνεις ένα καθαρό πολιτικό μήνυμα και βοηθάς τη διαπραγμάτευση να κινηθεί, αλλά οι τρεις δεν έχουν δεσμευτεί.",.36,
"Το σημείωμα φεύγει. Η Λέα σε κοιτάζει: «Ελπίζω να μη μας ρωτήσουν ποιοι είναι οι τρεις». Για την ώρα η άλλη πλευρά δείχνει να πιστεύει ότι υπάρχει πλειοψηφία.",
"Η βεβαιότητα μπορεί να κάνει μια διαπραγμάτευση να κινηθεί. Όταν όμως δεν στηρίζεται σε γεγονός, δίνει σε κάποιον άλλον το δικαίωμα να την καταρρίψει.",{player:{credibility:-1},rel:{lea_marin:{trust:-3,respect:-2}},flags:{OPENING_COUNT:"overstated"},callback:{after:5,from:"Civic Wire",subject:"One of the '122' denies committing",body:"Η Νάντια ζητά να μάθει ποιος από τους τρεις θεωρήθηκε βέβαιος."}}),
o("b","Ξεχώρισε","Γράφεις «119 βέβαιες, 3 πιθανές».","Η Προεδρία θα έχει ακριβή εικόνα, αλλά η συμφωνία ίσως φανεί πιο μακρινή από όσο θέλουν οι διαπραγματευτές.",.96,
"Η Λέα αφήνει επιτέλους τον καφέ της. Η Μάρα απαντά με δύο λέξεις: «Μπορώ να το στηρίξω». Δεν κέρδισες ψηφοφορία. Κέρδισες την πρώτη σου εμπιστοσύνη.",
"Μπορείς να βοηθήσεις μια απόφαση χωρίς να κρύψεις την αβεβαιότητα. Το αποτέλεσμα της ψηφοφορίας θα κριθεί αργότερα· η ακρίβεια του σημειώματος κρίνεται τώρα.",{player:{credibility:2},world:{information_quality:1},rel:{lea_marin:{trust:2,respect:3},mara_eltan:{trust:2}},flags:{OPENING_COUNT:"calibrated"},callback:{after:5,from:"Nadia Serrin",subject:"Your morning brief",body:"«119 βέβαιες, 3 πιθανές. Θέλω να σε ρωτήσω για μία σελίδα από το λιμάνι.»"}}),
o("c","Ζήτησε χρόνο","Δεν στέλνεις ακόμη αριθμό.","Δεν θέλεις η δική σου αναφορά να στηριχθεί σε κάτι αβέβαιο. Ίσως όμως η Πρόεδρος χρειάζεται όσα γνωρίζεις ήδη.",.58,
"Η Μάρα σηκώνει το τηλέφωνο: «Καταλαβαίνω γιατί δίστασες. Αλλά τώρα θα πάρουν απόφαση χωρίς τα δικά μας στοιχεία». Η Λέα αρχίζει να ψάχνει ξανά τις τρεις κλήσεις.",
"Η προσοχή είναι πολύτιμη. Και ο χρόνος επίσης. Μια καλή απόφαση μπορεί να χρειάζεται αναφορά που δηλώνει την αμφιβολία, όχι σιωπή.",{world:{government_pressure:2},rel:{ivo_marek:{respect:-2}},flags:{OPENING_COUNT:"withheld"}})
],["lea_marin","mara_eltan"]),

c("C01_S02","01","Η ΑΡΧΗ","09:05 — Το περιθώριο","ΕΝΑΣ ΜΙΚΡΟΣ ΚΑΝΟΝΑΣ · ΜΕΓΑΛΗ ΣΗΜΑΣΙΑ",
[
"«Δεν είναι η Τρίτη η τελευταία μέρα». Η Νέλα, υπάλληλος της Βουλής που όλοι προσπέρασαν, αφήνει μπροστά σου μια παλιά διάταξη. Αν γίνει η κατάθεση πριν από τις δύο, οι συζητήσεις μπορούν νόμιμα να συνεχιστούν ως την Παρασκευή.",
"«Δεν σου βρήκα ψήφους», λέει, με ένα μικρό χαμόγελο. «Μόνο τρεις μέρες». Έξω, τα κανάλια συνεχίζουν να μετρούν αντίστροφα μέχρι την Τρίτη.",
"Αυτός ο χρόνος μπορεί να βοηθήσει μια τίμια συμφωνία. Μπορεί όμως να επιτρέψει στα κόμματα να καθυστερήσουν ή να ξαναμοιράσουν τα χαρτιά."
],
[
{type:"uncertain",label:"ΟΛΟΙ ΕΠΑΝΑΛΑΜΒΑΝΟΥΝ",value:"Τρίτη",note:"Η ημερομηνία κυκλοφορεί ως βεβαιότητα"},
{type:"confirmed",label:"ΚΑΝΟΝΑΣ ΤΗΣ ΒΟΥΛΗΣ",value:"Μέχρι Παρασκευή",note:"Αν η κατάθεση γίνει σήμερα πριν από τις 14:00"}
],
"Σε ποιον δίνεις αυτές τις τρεις μέρες;",
[
o("a","Κράτησέ το ανοικτό","Ενημερώνεις αμέσως τη Μάρα και την Προεδρία.","Η πραγματική προθεσμία θα είναι διαθέσιμη στους υπευθύνους, πριν γίνει δημόσιο εργαλείο πίεσης.",.92,
"Η Μάρα σηκώνει το κεφάλι: «Αυτή είναι η διαφορά ανάμεσα στην ευκαιρία και στην παγίδα». Η Νέλα χαμογελά. Η επιλογή για την Παρασκευή υπάρχει πλέον στο τραπέζι.",
"Ο χρόνος είναι επιλογή. Δεν χρειάζεται να τον ξοδέψεις αμέσως για να έχει αξία.",{player:{credibility:1},rel:{nela_orr:{respect:3},ivo_marek:{trust:1,respect:2}},flags:{FRIDAY_OPTION:true}}),
o("b","Μην ανοίξεις το θέμα","Αφήνεις την Τρίτη ως πολιτική προθεσμία.","Η αίσθηση του επείγοντος μπορεί να πιέσει τους αρχηγούς να συμφωνήσουν. Κρύβεις όμως μία νόμιμη εναλλακτική.",.39,
"Η Νέλα μαζεύει ήσυχα τη διάταξη. «Τότε δεν ήταν λάθος που κανείς δεν την είδε. Ήταν επιλογή». Οι διαπραγματεύσεις συνεχίζονται με πίεση.",
"Το να διατηρείς μια λανθασμένη πεποίθηση για να επιταχύνεις αποφάσεις επηρεάζει τη νομιμοποίησή τους.",{world:{information_quality:-2,government_pressure:2},rel:{nela_orr:{trust:-3},mara_eltan:{trust:-2}},flags:{FRIDAY_SUPPRESSED:true}}),
o("c","Πες το δημόσια","Δίνεις τον κανόνα στον Τύπο.","Όλοι αξίζουν να ξέρουν την πραγματική προθεσμία. Οι διαπραγματευτές θα μάθουν μαζί με το κοινό ότι υπάρχει χρόνος.",.54,
"Ένα τηλεοπτικό έκτακτο διακόπτει τη συζήτηση. Η αλήθεια έγινε δημόσια — και τα κόμματα αλλάζουν τις απαιτήσεις τους. Η Μάρα σε ρωτά ποιον ενημέρωσες πρώτα.",
"Η διαφάνεια είναι πραγματική αξία. Η σειρά και η στιγμή μιας αποκάλυψης έχουν επίσης αποτελέσματα.",{world:{public_trust:1,government_pressure:3},rel:{ivo_marek:{trust:-4}},flags:{FRIDAY_PUBLIC:true}})
],["nela_orr","mara_eltan"]),

c("C01_S03","01","Η ΑΡΧΗ","10:40 — Η μία σελίδα","ΣΤΗΝ ΠΟΡΤΑ ΤΗΣ ΠΡΟΕΔΡΙΑΣ",
(state)=>[
"Ο Ίβο, ο άνθρωπος που ελέγχει ποιος φτάνει στο γραφείο της Προέδρου, σου επιστρέφει οκτώ σελίδες. «Δώδεκα λεπτά. Αυτά έχει. Πες μου τι δεν γίνεται να χάσει». Για πρώτη φορά η αναφορά δεν είναι απλώς ένα χαρτί.",
state.flags.OPENING_COUNT==="calibrated"
?"Η Μάρα θυμάται ότι ξεχώρισες τις 119 βέβαιες από τις τρεις πιθανές ψήφους. «Κράτα το ίδιο μέτρο και τώρα»."
:state.flags.OPENING_COUNT==="overstated"
?"Η Λέα επιμένει: «Αν γράψουμε ξανά 122 σαν να είναι υπόσχεση, θα ρισκάρουμε και το όνομα της Προέδρου». Το πρώτο σου σημείωμα βρίσκεται ήδη στο αρχείο."
:"Η Μάρα σε κοιτάζει: «Πριν δεν έδωσες αριθμό. Τώρα η Πρόεδρος χρειάζεται μια απόφαση πάνω σε όσα πραγματικά γνωρίζουμε».",
state.flags.FRIDAY_OPTION
?"Στην άκρη του φακέλου βρίσκεται και το νόμιμο περιθώριο της Παρασκευής. Μπορεί να αλλάξει τη συζήτηση."
:state.flags.FRIDAY_PUBLIC
?"Η είδηση για την Παρασκευή είναι ήδη παντού. Οι πολιτικοί προσαρμόζουν τα αιτήματά τους."
:"Η τηλεόραση συνεχίζει την αντίστροφη μέτρηση ως την Τρίτη."
],
[
{type:"confirmed",label:"Ο ΧΡΟΝΟΣ ΤΗΣ ΠΡΟΕΔΡΟΥ",value:"12 λεπτά",note:"Το υπόμνημα πρέπει να είναι κατανοητό με μία ανάγνωση"},
{type:"uncertain",label:"ΤΟ ΚΡΙΣΙΜΟ",value:"Πόσες ψήφοι είναι πραγματικά βέβαιες;",note:"Μία μικρή απόκλιση μπορεί να αλλάξει το αποτέλεσμα"},
{type:"uncertain",label:"ΤΟ ΠΕΡΙΘΩΡΙΟ",value:"Τρίτη ή Παρασκευή;",note:"Εξαρτάται από το τι έχει αποκαλυφθεί και κατατεθεί"}
],
"Τι βάζεις πρώτο στη σελίδα που θα διαβάσει;",
[
o("a","Δώσε καθαρή εικόνα","Τι ξέρουμε, τι δεν ξέρουμε, τι επιλογές έχει.","Η Πρόεδρος θα δει πρώτα τη διαφορά ανάμεσα στην αλήθεια και τις ελπίδες. Λιγότερες λεπτομέρειες, περισσότερη ουσία.",.97,
"Ο Ίβο διαβάζει μία φορά. Σταματά, σηκώνει το βλέμμα και λέει: «Αυτό θα μπει». Η πόρτα ανοίγει. Η Λέα σου στέλνει: «Κάποιος από τους τρεις ζητά να μιλήσετε. Χωρίς τηλέφωνο».",
"Όταν ο χρόνος του άλλου είναι λίγος, η προσεκτική επιλογή των κρίσιμων πληροφοριών είναι μορφή ευθύνης — όχι απόκρυψη.",{player:{credibility:2},rel:{ivo_marek:{trust:3,respect:4},elena_varin:{respect:2}},flags:{BRIEF_STYLE:"structured"}}),
o("b","Πάρε θέση","Ξεκινάς από τη συμφωνία που θεωρείς πιθανότερη.","Δίνεις στην Πρόεδρο μια σαφή κατεύθυνση, αλλά εκείνη ίσως μη δει γιατί διαφωνούν άλλοι μαζί σου.",.60,
"Ο Ίβο κρατά το χαρτί. Η Μάρα του δίνει ένα συμπληρωματικό σημείωμα με όσα δεν χώρεσαν. Το κινητό σου φωτίζει: «Θέλω να μιλήσουμε. Από κοντά».",
"Η καθαρή εισήγηση μπορεί να βοηθήσει. Αν όμως επιλέγεις στοιχεία μόνο για να τη στηρίξεις, η απόφασή σου γίνεται δυσκολότερο να ελεγχθεί.",{rel:{mara_eltan:{trust:-2}},flags:{BRIEF_STYLE:"advocacy"}}),
o("c","Δείξε τα όλα","Δεν κόβεις τίποτα από τις οκτώ σελίδες.","Η Πρόεδρος θα έχει κάθε λεπτομέρεια, αλλά ίσως χάσει το κρίσιμο μέσα στο πλήθος των στοιχείων.",.50,
"Ο Ίβο βάζει τον φάκελο στο τραπέζι. «Θα τον συντομεύσω εγώ», λέει. Στην οθόνη σου εμφανίζεται: «Με μέτρησαν χωρίς εμένα. Θέλω να συναντηθούμε».",
"Πληρότητα δεν σημαίνει κατ' ανάγκη σαφήνεια. Και το να αφήνεις την ιεράρχηση σε άλλον είναι μία μορφή παραχώρησης.",{player:{credibility:-1},rel:{ivo_marek:{respect:-3}},flags:{BRIEF_STYLE:"overloaded"}})
],["ivo_marek","elena_varin","mara_eltan","lea_marin"]),

c("C02_S01","02","Η 121η ΨΗΦΟΣ","Η φωνή από το τηλέφωνο","ΣΥΝΑΝΤΗΣΗ · ΧΩΡΙΣ ΚΑΜΕΡΕΣ",
(state)=>[
"Η φωνή από το πρωινό μήνυμα έχει τώρα πρόσωπο. Ο Νίκο, βουλευτής από τα νησιά Σέρα, κάθεται απέναντί σου χωρίς να προσφέρει το χέρι του. «Με έβαλαν στην κυβέρνηση πριν αποφασίσω. Δεν σου φαίνεται παράξενο;»",
state.flags.OPENING_COUNT==="overstated"
?"«Και στο δικό σας σημείωμα ήμουν βέβαιος», λέει. «Θα χρειαστεί να μου εξηγήσεις γιατί»."
:state.flags.OPENING_COUNT==="calibrated"
?"«Είδα ότι δεν με παρουσίασες ως δεδομένο», λέει. «Αυτός είναι ο λόγος που δέχτηκα να συναντηθούμε»."
:"«Δεν πήρες θέση το πρωί. Καλύτερα από το να μιλήσεις για μένα — αλλά τελικά θα χρειαστεί να αποφασίσεις τι πιστεύεις» λέει.",
"Τρία κόμματα του έχουν προσφέρει αξιώματα. Εκείνος σου δείχνει φωτογραφία από ένα νησί με διακοπές ρεύματος. «Όλοι μιλούν για μια καινούργια χώρα. Ποιος θα πληρώσει αν αφήσουν τη δική μου πίσω;»"
],
[
{type:"confirmed",label:"ΤΑ ΝΗΣΙΑ ΣΕΡΑ",value:"Ακριβό ρεύμα · αδύναμα δρομολόγια",note:"Ο Νίκο εκπροσωπεί ανθρώπους που θα ζήσουν με τη συμφωνία"},
{type:"uncertain",label:"Η ΨΗΦΟΣ ΤΟΥ",value:"Δεν έχει δεσμευτεί",note:"Οι ανακοινώσεις των κομμάτων δεν ισοδυναμούν με προσωπική υπόσχεση"}
],
"Τι θα του πεις;",
[
o("a","Ρώτησε","«Τι θα χάσουν τα νησιά αν πετύχει το σχέδιό μας;»","Του ζητάς να σου εξηγήσει τον δικό του φόβο πριν μιλήσεις για ανταλλάγματα.",.95,
"Ο Νίκο σκύβει μπροστά. «Το δίκτυο ρεύματος. Αν πάνε όλα τα χρήματα στο μεγάλο έργο, θα μας ξεχάσουν πάλι». Για πρώτη φορά η συζήτηση ξεφεύγει από την ψήφο.",
"Ένας άνθρωπος που κρατά μια κρίσιμη ψήφο έχει και δικούς του σκοπούς. Αν τους γνωρίζεις, μπορείς να διαπραγματευτείς κάτι πιο σταθερό από μια χάρη.",{rel:{niko_arven:{trust:3,respect:4}},flags:{NIKO_INTEREST:true},callback:{after:3,from:"Niko Arven",subject:"Not a promise. A number.",body:"«Εξέταση του ηλεκτρικού δικτύου των νησιών πριν κλειδώσει ο προϋπολογισμός. Τότε μπορώ να φέρω άλλους δύο στο τραπέζι»."}}),
o("b","Κάνε προσφορά","«Μπορούμε να σου δώσουμε ρόλο και χρήματα για τα νησιά».","Μια άμεση συμφωνία ίσως αποτρέψει νέες εκλογές, αν τα ανταλλάγματα αρκούν.",.56,
"Ο Νίκο χαμογελά κουρασμένα. «Πολύ γρήγορα έφτασες στα δώρα. Δεν σε ρώτησα τι έφερες». Δεν κλείνει την πόρτα, αλλά περιμένει κάτι ουσιαστικότερο.",
"Η γρήγορη συναλλαγή έχει αξία όταν ξέρεις τι αγοράζεις. Αν δεν γνωρίζεις τις ανάγκες του άλλου, η συμφωνία μπορεί να δημιουργήσει νέα εξάρτηση.",{player:{political_capital:-1},rel:{niko_arven:{respect:-1,dependency:2}},flags:{NIKO_TRANSACTIONAL:true}}),
o("c","Πίεσε","«Αν μπλοκάρεις τη χώρα, θα το μάθουν όλοι».","Του θυμίζεις το κόστος που έχει η καθυστέρηση, ρισκάροντας να τον κάνεις αντίπαλο.",.27,
"Ο Νίκο σηκώνεται. «Δεν σας χρωστάω την κυβέρνηση σας». Η συνάντηση τελειώνει νωρίτερα από το αναμενόμενο.",
"Η πίεση μπορεί να αλλάξει μια ψηφοφορία. Η ταπείνωση όμως μένει στη μνήμη ακόμη και όταν η ψηφοφορία τελειώσει.",{rel:{niko_arven:{trust:-5,grievance:6,respect:-2}},world:{coalition_pressure:2},flags:{NIKO_PRESSURED:true}})
],["niko_arven"]),

c("C02_S02","02","Η 121η ΨΗΦΟΣ","Δύο μηνύματα, μία φήμη","ΤΟ ΙΔΙΟ ΨΕΜΑ ΜΕ ΔΥΟ ΦΩΝΕΣ",
[
"Πριν φύγεις από τη Βουλή, η Λέα σου δείχνει δύο μηνύματα. Το πρώτο λέει ότι ο Νίκο έχει κλείσει συμφωνία με τους αντιπάλους σου. Το δεύτερο ισχυρίζεται ότι «όλοι το γνωρίζουν».",
"«Κοίτα εδώ», λέει. Και οι δύο πληροφορίες προέρχονται τελικά από την ίδια ομαδική συνομιλία. Δεν είναι δύο μάρτυρες. Είναι μία φήμη που έκανε τον γύρο της πόλης.",
"Αν η είδηση αληθεύει, αλλάζει τα πάντα. Αν δεν αληθεύει, μπορεί να καταστρέψεις μόνος σου την εμπιστοσύνη που μόλις προσπάθησες να χτίσεις."
],
[
{type:"uncertain",label:"ΠΡΩΤΟ ΜΗΝΥΜΑ",value:"Ο Νίκο έχει συμφωνήσει",note:"Πολιτικός συνεργάτης με κίνητρο να πιέσει"},
{type:"uncertain",label:"ΔΕΥΤΕΡΟ ΜΗΝΥΜΑ",value:"«Όλοι το ξέρουν»",note:"Έρχεται από άλλο άτομο, αλλά όχι ανεξάρτητη πηγή"},
{type:"confirmed",label:"Η ΛΕΑ ΕΛΕΓΞΕ",value:"Κοινή αρχική συνομιλία",note:"Καμία ανεξάρτητη επιβεβαίωση"}
],
"Τι κάνεις με τη φήμη;",
[
o("a","Έλεγξε","Ψάχνεις κάποιον που γνωρίζει από πρώτο χέρι.","Χάνεις λίγο χρόνο, αλλά δεν αφήνεις μια φήμη να οδηγήσει τη διαπραγμάτευση.",.98,
"Η νέα πηγή δεν επιβεβαιώνει μυστική συμφωνία. Η φήμη παραμένει πιθανή, όχι αποδεδειγμένη. Η Λέα χαμογελά: «Δύο τηλέφωνα δεν κάνουν δύο γεγονότα».",
"Οι ανεξάρτητες πηγές μετρούν περισσότερο από τον αριθμό των ανθρώπων που επαναλαμβάνουν την ίδια ιστορία.",{world:{information_quality:2},rel:{lea_marin:{respect:2}},flags:{SILAS_VERIFY:true},silas:"verification_depth"}),
o("b","Πάρε τηλέφωνο","Ρωτάς κατευθείαν τον Νίκο αν είναι αλήθεια.","Ίσως μάθεις γρήγορα την απάντηση. Θα δείξεις όμως πόσο εύκολα μια φήμη σε κάνει να αντιδράς.",.65,
"«Αν είχα μυστική συμφωνία, θα σου το έλεγα επειδή το διάβασες σε μήνυμα;» απαντά. Η κλήση τελειώνει χωρίς επιβεβαίωση.",
"Η ίδια ερώτηση μπορεί να σου δώσει πληροφορίες και ταυτόχρονα να αποκαλύψει τη δική σου ανησυχία.",{rel:{niko_arven:{trust:-1}},flags:{SILAS_SPEED:true},silas:"response_speed"}),
o("c","Χρησιμοποίησέ τη","Μεταφέρεις τη φήμη ως πιθανή για να κινηθούν οι άλλοι.","Αυξάνεις την πίεση να παρθούν αποφάσεις πριν διαλυθεί η συμμαχία.",.22,
"Μέσα σε μία ώρα η ιστορία κυκλοφορεί παντού. Κανείς δεν θυμάται πλέον ποιος είπε πρώτος «ίσως».",
"Η αβέβαιη πληροφορία μπορεί να γίνει πολιτικό εργαλείο. Όταν αποκτήσει ζωή, δεν την ελέγχει απαραίτητα αυτός που την έσπρωξε.",{world:{information_quality:-4,coalition_pressure:3},player:{credibility:-2},flags:{RUMOR_AMPLIFIED:true},silas:"disclosure_style"})
],["lea_marin","niko_arven"]),

c("C02_S03","02","Η 121η ΨΗΦΟΣ","Τρεις πόρτες","ΠΟΙΟΣ ΘΑ ΚΥΒΕΡΝΗΣΕΙ",
[
"Το βράδυ η Μάρα απλώνει τρία μικρά χαρτιά στο τραπέζι. «Δεν έχεις να διαλέξεις ποιον συμπαθείς. Πρέπει να δούμε ποια συμφωνία μπορεί να σταθεί».",
"Ο Άντριαν θέλει να αλλάξει τη χώρα γρήγορα. Η Μίρα θέλει εγγυήσεις ότι οι εργαζόμενοι δεν θα πληρώσουν το κόστος. Οι παλαιότεροι πολιτικοί γνωρίζουν πώς δουλεύει το κράτος, αλλά κουβαλούν το βάρος του σκανδάλου.",
"Καθεμία από τις τρεις κυβερνήσεις θα μπορούσε να συγκεντρώσει 121 ψήφους. Καθεμία όμως θα χρωστά κάτι διαφορετικό την επόμενη μέρα."
],
[
{type:"confirmed",label:"ΣΥΜΦΩΝΙΑ ΑΛΛΑΓΗΣ",value:"Μεταρρυθμίσεις + προστασία εργασίας",note:"Άντριαν, Μίρα και ανεξάρτητοι· οριακή πλειοψηφία"},
{type:"confirmed",label:"ΚΥΒΕΡΝΗΣΗ ΣΥΝΕΧΕΙΑΣ",value:"Νέα ηγεσία + παλαιά εμπειρία",note:"Πιο σταθερή διοίκηση, κίνδυνος να καλυφθούν παλιές ευθύνες"},
{type:"confirmed",label:"ΠΛΑΤΥΣ ΣΥΜΒΙΒΑΣΜΟΣ",value:"Εργασία + θεσμικοί έλεγχοι",note:"Περισσότερες ομάδες έχουν δικαίωμα αντίρρησης"}
],
"Ποια συμφωνία θέλεις να ελέγξεις πιο προσεκτικά;",
[
o("a","Δοκίμασε","Μια κυβέρνηση που συνδέει αλλαγή και εργασία.","Ίσως πετύχει πολλά, αρκεί η Μίρα να μη μείνει διακοσμητική σύμμαχος.",.83,
"Η Μίρα ζητά γραπτή εγγύηση για τους ανθρώπους που θα χάσουν δουλειές από την αυτοματοποίηση.",
"Το να εξετάζεις μια επιλογή δεν σημαίνει ότι δεσμεύτηκες να την υποστηρίξεις. Πρώτα δοκιμάζεις πού μπορεί να σπάσει.",{flags:{GOV_PATH:"reform_accord"},routes:{reform_accord:7}}),
o("b","Δοκίμασε","Μια κυβέρνηση που ξέρει να λειτουργεί το κράτος.","Κερδίζει διοικητική εμπειρία, αλλά μπορεί να χάσει την εμπιστοσύνη όσων ήθελαν πραγματική αλλαγή.",.80,
"Ένας παλιός πολιτικός ανοίγει δίαυλο. Στο ημερολόγιο εμφανίζεται μια συνάντηση με τον στρατηγιστή του.",
"Η εμπειρία μπορεί να είναι πόρος και παγίδα μαζί. Η ερώτηση είναι πώς κρατάς το πρώτο χωρίς να κληρονομήσεις το δεύτερο.",{flags:{GOV_PATH:"reconstruction"},routes:{reconstruction:7},rel:{silas_koren:{familiarity:2}}}),
o("c","Δοκίμασε","Έναν συμβιβασμό με περισσότερους ελέγχους.","Δίνει λόγο σε περισσότερες ομάδες και ίσως περισσότερη εμπιστοσύνη· μπορεί όμως να δυσκολεύεται να πάρει αποφάσεις.",.77,
"Η πλευρά των ανεξάρτητων πόλεων ζητά εγγυήσεις ελέγχου πριν μοιραστούν υπουργεία.",
"Το ότι πολλοί συμφωνούν με τον σκοπό δεν σημαίνει ότι έχουν τον ίδιο τρόπο για να τον πετύχουν.",{flags:{GOV_PATH:"civic_compact"},routes:{civic_compact:7}})
],["mara_eltan","adrian_kessar","mira_solen"]),

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
{id:"m1",from:"Μάρα",subject:"07:30 · Η αναφορά",body:"Χρειάζομαι έναν αριθμό που μπορούμε να υπερασπιστούμε. Όχι έναν αριθμό που θα ήθελε κάποιο κόμμα να είναι αληθινός.",unread:true},
{id:"m2",from:"Γραφείο Προεδρίας",subject:"Η σημερινή ενημέρωση",body:"Μία σελίδα. Τι γνωρίζουμε, τι αγνοούμε και ποια απόφαση πρέπει να παρθεί.",unread:true},
{id:"m3",from:"Άγνωστος αριθμός",subject:"07:12 · Φωνητικό μήνυμα",body:"«Με έχουν μετρήσει στην κυβέρνηση. Δεν έχω υποσχεθεί την ψήφο μου σε κανέναν».",unread:true}
];
