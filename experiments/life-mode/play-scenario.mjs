#!/usr/bin/env node
// Executable synthetic playtest. Use with: node experiments/life-mode/play-scenario.mjs
// Its results are produced by the resolver; prose here cannot overwrite the ledger.
import { beginLife, act, playerView } from "./world-simulator.mjs";

const initial = beginLife({
  id: "synthetic-life-playtest-01", birthDate: "2010-04-12",
  startedAt: "2028-05-01", location: "Θεσσαλονίκη", cash: 900, seed: 48
});
const story = [
  { id: "01", kind: "dream", goalId: "wealth", title: "Να αποκτήσω €1 δισ.", playerText: "Στα 18 μου θέλω να γίνω δισεκατομμυριούχος." },
  { id: "02", kind: "plan", goalId: "wealth", planId: "startup", title: "Να ανοίξω εταιρεία", playerText: "Ξεκινάω μία επιχείρηση." },
  { id: "03", kind: "launch", planId: "startup", budget: 100_000, playerText: "Στήνω επιχείρηση €100.000 χωρίς να έχω τα λεφτά." },
  { id: "04", kind: "work", shifts: 12, playerText: "Κάνω 12 βάρδιες για να συγκεντρώσω κεφάλαιο." },
  { id: "05", kind: "study", subject: "business", playerText: "Μελετώ επιχειρηματική στρατηγική για έναν μήνα." },
  { id: "06", kind: "investigate", subject: "venture", playerText: "Ζητώ έρευνα αγοράς πριν ρισκάρω." },
  { id: "07", kind: "delegate", fee: 300, playerText: "Αναθέτω την τεχνική ανάλυση σε έναν σύμβουλο." },
  { id: "08", kind: "launch", planId: "startup", budget: 600, playerText: "Δοκιμάζω μικρό επιχειρηματικό εγχείρημα." },
  { id: "09", kind: "wait", days: 90, playerText: "Περιμένω τρεις μήνες." },
  { id: "10", kind: "dream", goalId: "community", title: "Να επηρεάσω θετικά τον τόπο μου", playerText: "Θέλω να βοηθήσω την κοινότητά μου." },
  { id: "11", kind: "plan", goalId: "community", planId: "initiative", title: "Διοργάνωση κοινότητας", playerText: "Χτίζω μια πρωτοβουλία." },
  { id: "12", kind: "network", playerText: "Γνωρίζω ανθρώπους στην τοπική κοινότητα." },
  { id: "13", kind: "organize", planId: "initiative", budget: 100, playerText: "Διοργανώνω μια μικρή δράση." },
  { id: "14", kind: "wait", days: 60, playerText: "Περνούν δύο μήνες." },
  { id: "15", kind: "connect", playerText: "Αφιερώνω χρόνο σε μία φιλία." },
  { id: "16", kind: "connect", playerText: "Συναντώ ξανά τη φίλη μου." },
  { id: "17", kind: "invite", playerText: "Ρωτάω αν θέλει να δοκιμάσουμε μία σχέση." },
  { id: "18", kind: "finish", playerText: "Θέλω εδώ να τελειώσει η δοκιμαστική ζωή." }
];
let run = initial;
for (const command of story) {
  run = act(run, command);
  const event = run.turns.at(-1);
  console.log("[" + event.date + "] " + command.playerText);
  console.log(event.scene);
  console.log("Αποτέλεσμα: " + event.outcome.result +
    (event.outcome.cause ? " · Αιτία: " + event.outcome.cause : ""));
  console.log("");
}
const view = playerView(run);
console.log("--- ΜΟΝΟ ΕΠΑΛΗΘΕΥΜΕΝΗ ΚΑΤΑΣΤΑΣΗ ---");
console.log(view.footer);
console.log("Επιρροή: " + view.influence + " · Κατάσταση: " + (view.finished ? "Τέλος" : "Ενεργή"));
console.log("Γνωστά πρόσωπα: " + view.people.map(p => p.name + " (" + p.role + ")").join(" · "));
