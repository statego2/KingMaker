// Experimental, deterministic Life Mode action resolver.
// Structured commands are supplied by a narrator/adapter; this is NOT a free-text parser.
// Does not touch the live campaign, storage keys, or canonical game-state schema.
import { createRun, applyTurn, ageOn, statusFooter } from "./chat-ledger.mjs";

const RULESET = "life-experiment-0.2";
const DAY = 86_400_000;
const CONTACTS = Object.freeze({
  lender: { name: "Μαρία", role: "υπεύθυνη χρηματοδότησης" },
  advisor: { name: "Αλέξης", role: "σύμβουλος επιχειρήσεων" },
  friend: { name: "Ελένη", role: "φίλη" },
  organizer: { name: "Νίκος", role: "οργανωτής κοινότητας" }
});

function day(date) {
  const time = Date.parse(date + "T00:00:00Z");
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date) {
    throw new Error("Invalid ISO date");
  }
  return time;
}
function addDays(date, n) {
  return new Date(day(date) + n * DAY).toISOString().slice(0, 10);
}
function daysApart(from, to) {
  return Math.round((day(to) - day(from)) / DAY);
}
function positiveInt(value, field, max = 1_000_000) {
  if (!Number.isSafeInteger(value) || value <= 0 || value > max) {
    throw new Error("Invalid " + field);
  }
  return value;
}
function required(value, field) {
  if (typeof value !== "string" || !value.trim() || value.length > 240) {
    throw new Error("Invalid " + field);
  }
  return value.trim();
}
function chance(seed, id, salt) {
  // FNV-1a style mixing: repeatable per seed and action, no Math.random or hidden rerolls.
  let hash = 2166136261;
  const text = String(seed) + "|" + id + "|" + salt;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}
function projectionOfPerson(id) {
  const actor = CONTACTS[id];
  if (!actor) throw new Error("Unknown actor");
  return { id, name: actor.name, role: actor.role };
}
function reveal(people, id) {
  if (!people.some(p => p.id === id)) people.push(projectionOfPerson(id));
}
function titleFor(run, goalId) {
  const goal = run.goals.find(g => g.id === goalId);
  if (!goal) throw new Error("Unknown aspiration");
  return goal.title;
}
function activePlan(run, planId) {
  const plan = run.plans.find(p => p.id === planId);
  if (!plan || plan.status !== "active") throw new Error("An active plan is required");
  return plan;
}

export function beginLife(config) {
  const seed = config.seed ?? 1;
  if (!Number.isSafeInteger(seed)) throw new Error("Seed must be an integer");
  const run = createRun(config);
  const worldEvents = [180, 720].flatMap((offset, i) => {
    const draw = chance(seed, "macro-" + i, "economy");
    const kind = draw < 0.22 ? "cooling" : draw < 0.45 ? "growth" : null;
    return kind ? [{ id: "economy-" + i, date: addDays(run.date, offset), kind, processed: false }] : [];
  });
  return {
    ...run,
    simulation: {
      ruleset: RULESET, seed, finished: false,
      origin: { id: config.id, birthDate: config.birthDate, startedAt: config.startedAt, location: config.location, cash: run.cash, debt: run.debt, seed },
      commands: [], offers: [], projects: [], relationships: [], politicalContacts: [],
      world: { economy: "steady", events: worldEvents },
      skills: { business: 0, society: 0 }, knowledge: { venture: false }, influence: 0,
      advisor: false, lastPitchAt: null, publicEvents: []
    }
  };
}

export function act(previous, command) {
  if (!previous?.simulation || previous.simulation.ruleset !== RULESET) {
    throw new Error("Unknown experimental simulation version");
  }
  if (previous.simulation.finished) throw new Error("This life is already closed");
  if (!command || typeof command !== "object" || Array.isArray(command)) throw new Error("Invalid command");
  const id = required(command.id, "action ID");
  if (previous.turns.some(t => t.id === id)) throw new Error("Duplicate turn ID");
  const kind = required(command.kind, "action kind");
  const sim = structuredClone(previous.simulation);
  const visiblePeople = [];
  const goalPatches = [];
  const planPatches = [];
  let date = previous.date;
  let cashDelta = 0;
  let debtDelta = 0;
  let result = "pending";
  let cause = null;
  let scene = "";
  const moneyCauses = [];
  const released = [];

  function money(cash, debt, why) {
    if (!Number.isSafeInteger(cash) || !Number.isSafeInteger(debt)) throw new Error("Unsafe money delta");
    if (cash || debt) moneyCauses.push(required(why, "money cause"));
    cashDelta += cash;
    debtDelta += debt;
    if (!Number.isSafeInteger(previous.cash + cashDelta) ||
        !Number.isSafeInteger(previous.debt + debtDelta) ||
        previous.cash + cashDelta < 0 || previous.debt + debtDelta < 0) {
      throw new Error("Insufficient available funds or unsafe balance");
    }
  }
  function progress(to) {
    if (day(to) < day(date)) throw new Error("Time cannot reverse");
    const pending = [
      ...sim.projects.filter(p => p.status === "running" && p.dueOn <= to)
        .map(p => ({ kind: "project", at: p.dueOn, ref: p })),
      ...sim.world.events.filter(e => !e.processed && e.date <= to)
        .map(e => ({ kind: "world", at: e.date, ref: e }))
    ].sort((a, b) => a.at.localeCompare(b.at) ||
      (a.kind === "world" ? -1 : 1));
    for (const event of pending) {
      if (event.kind === "world") {
        const e = event.ref;
        e.processed = true;
        sim.world.economy = e.kind;
        const headline = e.kind === "cooling"
          ? "Η τοπική αγορά επιβραδύνεται. Οι επιχειρήσεις και οι τράπεζες γίνονται πιο επιφυλακτικές."
          : "Η τοπική αγορά ενισχύεται. Ανοίγονται ευκαιρίες αλλά όχι εγγυημένες αποδόσεις.";
        released.push(headline);
        sim.publicEvents.push({ id: e.id, date: e.date, parent: "world-seed", text: headline });
        continue;
      }
      const p = event.ref;
      p.status = "resolved";
      const shift = p.political ? 0
        : sim.world.economy === "cooling" ? -0.10
        : sim.world.economy === "growth" ? 0.10 : 0;
      p.effectiveChance = Math.max(0.05, Math.min(0.90, p.successChance + shift));
      const favorable = p.roll < p.effectiveChance;
      // Spend happened at launch. The payout can be zero: no forced bailout.
      const payout = p.political ? 0 : favorable ? Math.floor(p.budget * 1.55) :
        (p.roll < p.effectiveChance + 0.25 ? Math.floor(p.budget * 0.35) : 0);
      p.payout = payout;
      p.outcome = p.political ? (favorable ? "supported" : "rejected")
        : (favorable ? "profitable" : (payout ? "partial" : "failed"));
      if (payout) money(payout, 0, "Διακανονισμός έργου " + p.id);
      const msg = p.political
        ? (favorable ? "Η πρωτοβουλία " + p.id + " απέκτησε τοπική υποστήριξη."
                     : "Η πρωτοβουλία " + p.id + " δεν συγκέντρωσε αρκετή υποστήριξη.")
        : favorable
          ? "Το έργο " + p.id + " απέδωσε €" + payout + "."
          : (payout ? "Το έργο " + p.id + " ανέκτησε μόνο €" + payout + "."
                    : "Το έργο " + p.id + " απέτυχε· το αρχικό κεφάλαιο χάθηκε.");
      released.push(msg);
      sim.publicEvents.push({ id: "settle-" + p.id, date: p.dueOn, parent: p.actionId, text: msg });
      if (p.political && favorable) sim.influence = Math.min(10, sim.influence + 1);
    }
    date = to;
  }
  function pass(days, max = 36525) {
    positiveInt(days, "days", max);
    progress(addDays(date, days));
  }

  switch (kind) {
    case "dream": {
      const goalId = required(command.goalId, "goal ID");
      const title = required(command.title, "aspiration");
      if (previous.goals.some(g => g.id === goalId)) throw new Error("Aspiration ID exists; use revise");
      goalPatches.push({ id: goalId, title, status: "pending" });
      scene = "Ο στόχος «" + title + "» καταγράφηκε. Δεν έχει πραγματοποιηθεί ακόμη.";
      break;
    }
    case "revise": {
      const goalId = required(command.goalId, "goal ID");
      const title = titleFor(previous, goalId);
      if (!["pending", "partial", "withdrawn"].includes(command.status)) {
        throw new Error("An aspiration cannot be declared completed by intention");
      }
      goalPatches.push({ id: goalId, title, status: command.status });
      scene = "Η προτεραιότητα για «" + title + "» άλλαξε. Οι υποχρεώσεις παραμένουν.";
      result = "succeeded";
      cause = "Η αλλαγή προτεραιότητας είναι απόφαση του παίκτη, όχι εξωτερικό επίτευγμα.";
      break;
    }
    case "plan": {
      const goalId = required(command.goalId, "goal ID");
      titleFor(previous, goalId);
      const planId = required(command.planId, "plan ID");
      if (previous.plans.some(p => p.id === planId)) throw new Error("Plan ID exists");
      planPatches.push({ id: planId, goalId, title: required(command.title, "plan title"), status: "active" });
      scene = "Το σχέδιο οργανώθηκε. Αποτέλεσμα δεν έχει προκύψει ακόμη.";
      break;
    }
    case "work": {
      const shifts = positiveInt(command.shifts, "shifts", 30);
      pass(shifts);
      const pay = shifts * 60;
      money(pay, 0, "Εισόδημα από " + shifts + " πραγματικές βάρδιες");
      result = "succeeded";
      cause = "Εργασία με αντάλλαγμα χρόνο.";
      scene = "Εργάστηκες " + shifts + " βάρδιες και πληρώθηκες €" + pay + ".";
      break;
    }
    case "wait": {
      pass(command.days);
      result = released.length ? "partial" : "succeeded";
      cause = "Πέρασε χρόνος, χωρίς εγγυημένη δραματική εξέλιξη.";
      scene = released.length ? released.join(" ") : "Πέρασε χρόνος χωρίς σημαντικό νέο γεγονός.";
      break;
    }
    case "pitch": {
      const plan = activePlan(previous, required(command.planId, "plan ID"));
      const amount = positiveInt(command.amount, "requested funding", 10_000_000);
      if (sim.lastPitchAt && daysApart(sim.lastPitchAt, date) < 30) {
        result = "failed";
        cause = "Η υπεύθυνη δεν επανεξετάζει φάκελο μέσα σε 30 ημέρες.";
        scene = "Η Μαρία (χρηματοδότηση) αρνείται νέα αίτηση ακόμη.";
        break;
      }
      pass(7);
      sim.lastPitchAt = date;
      reveal(visiblePeople, "lender");
      const tooLarge = amount > 30_000;
      const score = 0.35 + (sim.advisor ? 0.15 : 0) + Math.min(previous.cash / 100_000, 0.15) - (amount > 15_000 ? 0.12 : 0)
        + sim.skills.business * 0.02 + (sim.world.economy === "cooling" ? -0.10 : sim.world.economy === "growth" ? 0.06 : 0);
      const overLeveraged = previous.debt > Math.max(25_000, previous.cash * 2);
      const approved = !tooLarge && !overLeveraged && chance(sim.seed, previous.turns.length + 1, "lender") < score;
      if (approved) {
        const offerId = "offer-" + id;
        sim.offers.push({ id: offerId, amount, lender: "lender", expiresOn: addDays(date, 30), status: "open", planId: plan.id });
        result = "partial";
        cause = "Η ανεξάρτητη πιστοδοτική απόφαση εγκρίνει μόνο πρόταση, όχι εκταμίευση.";
        scene = "Η Μαρία (χρηματοδότηση) προσφέρει δάνειο €" + amount + " με ισόποσο χρέος. Μπορείς να το αποδεχτείς ή να το αφήσεις.";
      } else {
        result = "failed";
        cause = tooLarge ? "Το ποσό υπερβαίνει την τρέχουσα πολιτική χρηματοδότησης." : overLeveraged ? "Οι υφιστάμενες οφειλές είναι ήδη υψηλές." : "Η τράπεζα έκρινε τον κίνδυνο υπερβολικό.";
        scene = "Η Μαρία (χρηματοδότηση) αρνήθηκε. Το σχέδιο παραμένει διαθέσιμο για αναθεώρηση.";
      }
      break;
    }
    case "accept": {
      const offer = sim.offers.find(o => o.id === required(command.offerId, "offer ID"));
      if (!offer) throw new Error("Unknown offer");
      if (offer.status !== "open" || offer.expiresOn < date) {
        result = "failed";
        cause = "Η πρόταση δεν είναι πλέον ενεργή.";
        scene = "Η προσφορά έχει λήξει ή χρησιμοποιηθεί.";
      } else {
        offer.status = "accepted";
        money(offer.amount, offer.amount, "Εκταμίευση τραπεζικού δανείου " + offer.id);
        result = "succeeded";
        cause = "Υπήρχε μη ληγμένη προσφορά και ο παίκτης αποδέχτηκε το χρέος.";
        scene = "Έλαβες €" + offer.amount + ". Η οφειλή αυξήθηκε ισόποσα.";
      }
      break;
    }
    case "repay": {
      const requested = positiveInt(command.amount, "repayment", 10_000_000);
      const payment = Math.min(requested, previous.debt);
      if (!payment) {
        result = "failed";
        cause = "Δεν υπάρχει ανεξόφλητο δάνειο.";
        scene = "Δεν υπάρχει χρέος για εξόφληση.";
      } else if (payment > previous.cash) {
        result = "failed";
        cause = "Τα διαθέσιμα δεν επαρκούν για την αποπληρωμή.";
        scene = "Δεν έχεις τα χρήματα για αυτή την αποπληρωμή.";
      } else {
        money(-payment, -payment, "Αποπληρωμή κεφαλαίου δανείου");
        result = "succeeded";
        cause = "Οφειλή και μετρητά μειώθηκαν ισόποσα.";
        scene = "Πλήρωσες €" + payment + " από το δάνειο.";
      }
      break;
    }
    case "study": {
      if (!["business", "society"].includes(command.subject)) throw new Error("Unknown study subject");
      pass(30);
      const subject = command.subject;
      if (sim.skills[subject] >= 5) {
        result = "partial";
        cause = "Επιπλέον μελέτη σε αυτό το επίπεδο έχει μειωμένη επίδραση.";
        scene = "Συνέχισες τη μελέτη· δεν δημιουργήθηκε νέο επίτευγμα από μόνο του.";
      } else {
        sim.skills[subject]++;
        result = "succeeded";
        cause = "Συστηματική μελέτη επί 30 ημέρες, με κόστος χρόνου.";
        scene = "Έναν μήνα αργότερα κατανοείς καλύτερα το θέμα που μελέτησες.";
      }
      break;
    }
    case "investigate": {
      if (command.subject !== "venture") throw new Error("Unknown investigation");
      if (sim.knowledge.venture) {
        result = "partial";
        cause = "Η αναζήτηση επαναλαμβάνει όσα είναι ήδη γνωστά.";
        scene = "Οι βασικοί κίνδυνοι είναι ήδη καταγεγραμμένοι.";
        break;
      }
      if (previous.cash < 100) {
        result = "failed";
        cause = "Η έρευνα απαιτεί €100 για υπηρεσίες/δεδομένα.";
        scene = "Δεν καλύπτεται ακόμη το κόστος της έρευνας.";
        break;
      }
      pass(14);
      money(-100, 0, "Αγορά στοιχείων και ανεξάρτητη έρευνα αγοράς");
      sim.knowledge.venture = true;
      result = "succeeded";
      cause = "Η εξέταση αποκάλυψε εύρος κινδύνου, όχι το μυστικό αποτέλεσμα του εγχειρήματος.";
      scene = "Έχεις πλέον εικόνα των βασικών εμπορικών κινδύνων. Η πιθανότητα επιτυχίας βελτιώνεται, χωρίς εγγύηση.";
      break;
    }
    case "delegate": {
      const fee = positiveInt(command.fee, "fee", 100_000);
      reveal(visiblePeople, "advisor");
      pass(3);
      if (fee < 300) {
        result = "failed";
        cause = "Ο Αλέξης (σύμβουλος) έχει κατώτατη αμοιβή €300.";
        scene = "Ο Αλέξης (σύμβουλος) αρνήθηκε τους όρους.";
      } else if (fee > previous.cash) {
        result = "failed";
        cause = "Δεν επαρκούν τα διαθέσιμα κεφάλαια.";
        scene = "Δεν μπορείς να πληρώσεις τον σύμβουλο ακόμη.";
      } else if (sim.advisor) {
        result = "failed";
        cause = "Υπάρχει ήδη ενεργός σύμβουλος.";
        scene = "Έχεις ήδη αναθέσει την εργασία στον Αλέξη.";
      } else {
        money(-fee, 0, "Αμοιβή σύμβουλου");
        sim.advisor = true;
        result = "succeeded";
        cause = "Ο σύμβουλος αποδέχτηκε την αμοιβή και αναλαμβάνει την ανάλυση κινδύνου.";
        scene = "Ο Αλέξης (σύμβουλος) αναλαμβάνει την τεχνική δουλειά. Εσύ κρατάς τις στρατηγικές αποφάσεις.";
      }
      break;
    }
    case "launch": {
      const plan = activePlan(previous, required(command.planId, "plan ID"));
      const budget = positiveInt(command.budget, "budget", 1_000_000);
      if (budget > previous.cash) {
        result = "failed";
        cause = "Δεν επαρκεί το διαθέσιμο κεφάλαιο· η φιλοδοξία δεν δημιουργεί χρηματοδότηση.";
        scene = "Δεν μπορείς να ξεκινήσεις με αυτά τα χρήματα. Μπορείς να εργαστείς, να μειώσεις το σχέδιο ή να αναζητήσεις χρηματοδότηση.";
        break;
      }
      if (sim.projects.some(p => p.planId === plan.id && p.status === "running")) {
        throw new Error("Plan already has a running project");
      }
      money(-budget, 0, "Δεσμεύτηκε πραγματικό κεφάλαιο για νέο έργο");
      const p = {
        id: "project-" + id, actionId: id, planId: plan.id,
        budget, dueOn: addDays(date, 90), status: "running",
        roll: chance(sim.seed, previous.turns.length + 1, "venture"),
        successChance: Math.min(0.85, (sim.advisor ? 0.60 : 0.42) +
          (sim.knowledge.venture ? 0.08 : 0) + sim.skills.business * 0.03)
      };
      sim.projects.push(p);
      result = "partial";
      cause = "Η επένδυση εκκινεί το έργο, αλλά η απόδοση παραμένει αβέβαιη για 90 ημέρες.";
      scene = "Το έργο άρχισε με €" + budget + ". Το αποτέλεσμα δεν είναι γνωστό ακόμη.";
      break;
    }
    case "network": {
      reveal(visiblePeople, "organizer");
      pass(14);
      const accepted = chance(sim.seed, previous.turns.length + 1, "organizer") <
        Math.min(0.90, 0.6 + sim.skills.society * 0.07);
      const person = sim.politicalContacts.find(p => p.actorId === "organizer");
      if (accepted) {
        if (person) person.trust = Math.min(4, person.trust + 1);
        else sim.politicalContacts.push({ actorId: "organizer", trust: 1 });
        result = "succeeded";
        cause = "Ο Νίκος (οργανωτής κοινότητας) αποφάσισε ότι η συνεργασία αξίζει τον χρόνο του.";
        scene = "Ο Νίκος (οργανωτής κοινότητας) δέχτηκε να συνεργαστεί στην τοπική οργάνωση.";
      } else {
        result = "failed";
        cause = "Ο Νίκος (οργανωτής κοινότητας) προτίμησε άλλες δεσμεύσεις.";
        scene = "Ο Νίκος (οργανωτής κοινότητας) δεν δέχτηκε την πρόταση. Η κοινότητα συνεχίζει χωρίς εσένα.";
      }
      break;
    }
    case "organize": {
      const plan = activePlan(previous, required(command.planId, "plan ID"));
      const budget = positiveInt(command.budget, "community budget", 100_000);
      const trust = sim.politicalContacts.find(p => p.actorId === "organizer")?.trust ?? 0;
      if (budget > previous.cash) {
        result = "failed";
        cause = "Η διοργάνωση απαιτεί πραγματικά διαθέσιμα χρήματα.";
        scene = "Η διοργάνωση δεν ξεκινά χωρίς τους πόρους.";
        break;
      }
      if (sim.projects.some(p => p.planId === plan.id && p.status === "running")) {
        throw new Error("Plan already has a running project");
      }
      money(-budget, 0, "Πραγματική δαπάνη δημόσιας διοργάνωσης");
      const p = {
        id: "project-" + id, actionId: id, planId: plan.id,
        budget, dueOn: addDays(date, 60), status: "running",
        roll: chance(sim.seed, previous.turns.length + 1, "organize"),
        successChance: Math.min(0.80, 0.22 + trust * 0.13 + sim.skills.society * 0.06),
        political: true
      };
      sim.projects.push(p);
      result = "partial";
      cause = "Τα χρήματα ξοδεύτηκαν σε πραγματική προσπάθεια· η ανταπόκριση των πολιτών παραμένει άγνωστη.";
      scene = "Ξεκινά η διοργάνωση. Οι άλλοι συμμετέχουν μόνο αν το επιλέξουν.";
      break;
    }
    case "connect": {
      reveal(visiblePeople, "friend");
      pass(7);
      const current = sim.relationships.find(r => r.actorId === "friend");
      if (current) current.trust = Math.min(3, current.trust + 1);
      else sim.relationships.push({ actorId: "friend", trust: 1, mutuallyInterested: false });
      result = "succeeded";
      cause = "Η Ελένη (φίλη) επέλεξε να συναντηθεί, όχι να υποσχεθεί σχέση.";
      scene = "Πέρασες χρόνο με την Ελένη (φίλη). Γνωρίζεστε καλύτερα.";
      break;
    }
    case "invite": {
      reveal(visiblePeople, "friend");
      pass(2);
      const relation = sim.relationships.find(r => r.actorId === "friend");
      const accepted = !!relation && relation.trust >= 2 && chance(sim.seed, previous.turns.length + 1, "consent") < 0.65;
      if (accepted) relation.mutuallyInterested = true;
      result = accepted ? "succeeded" : "failed";
      cause = accepted ? "Η Ελένη (φίλη) εξέφρασε δική της αμοιβαία επιθυμία." : "Η Ελένη (φίλη) δεν συναίνεσε· το αίτημα δεν δεσμεύει άλλο πρόσωπο.";
      scene = accepted ? "Η Ελένη (φίλη) δέχτηκε να εξερευνήσετε μια σχέση." : "Η Ελένη (φίλη) δεν θέλει σχέση τώρα.";
      break;
    }
    case "finish": {
      sim.finished = true;
      result = "succeeded";
      cause = "Ο παίκτης έκλεισε αυτή τη δοκιμαστική ιστορία.";
      scene = "Τέλος δοκιμής. Η πορεία σου αποτυπώνεται μόνο από καταγεγραμμένα γεγονότα.";
      break;
    }
    default:
      throw new Error("Unsupported action kind: " + kind);
  }

  const moneyCause = moneyCauses.length ? moneyCauses.join(" · ") : undefined;
  const next = applyTurn(previous, {
    id, date, playerText: typeof command.playerText === "string" && command.playerText.trim()
      ? command.playerText : "[structured] " + kind,
    scene, outcome: { result, ...(cause ? { cause } : {}) },
    finance: { cashDelta, debtDelta, ...(moneyCause ? { cause: moneyCause } : {}) },
    goals: goalPatches, plans: planPatches, people: visiblePeople
  });
  sim.publicEvents.push({ id: "action-" + id, date, parent: id, text: scene });
  sim.commands.push(structuredClone(command));
  next.simulation = sim;
  return next;
}

export function replayLife(initial, commands) {
  if (!Array.isArray(commands)) throw new Error("Actions must be an array");
  return commands.reduce((state, command) => act(state, command), initial);
}

export function playerView(run) {
  if (!run?.simulation || run.simulation.ruleset !== RULESET) throw new Error("Not a Life Mode run");
  const sim = run.simulation;
  return {
    id: run.id, date: run.date, age: ageOn(run.birthDate, run.date),
    location: run.location, cash: run.cash, debt: run.debt,
    goals: structuredClone(run.goals), plans: structuredClone(run.plans),
    people: structuredClone(run.people),
    projects: sim.projects.map(p => ({
      id: p.id, planId: p.planId, budget: p.budget, dueOn: p.dueOn,
      status: p.status, ...(p.status === "resolved" ? { payout: p.payout, outcome: p.outcome } : {})
    })),
    offers: sim.offers.filter(o => o.status === "open" && o.expiresOn >= run.date)
      .map(({ id, amount, expiresOn, planId }) => ({ id, amount, expiresOn, planId })),
    relationships: sim.relationships.map(({ actorId, trust, mutuallyInterested }) => ({ actorId, trust, mutuallyInterested })),
    politicalContacts: structuredClone(sim.politicalContacts),
    skills: structuredClone(sim.skills), knowledge: structuredClone(sim.knowledge),
    influence: sim.influence, economy: sim.world.economy,
    lastEvent: run.turns.length ? structuredClone(run.turns.at(-1)) : null,
    finished: sim.finished,
    footer: statusFooter(run)
  };
}


const SAVE_FORMAT = "kingmaker-life-experiment-v1";

/** Saves only the original fictional setup and ordered structured commands.
 * On load, results are reconstructed by the trusted deterministic resolver.
 * Does not access browser localStorage or the separate political-campaign keys.
 */
export function saveLife(run) {
  if (!run?.simulation || run.simulation.ruleset !== RULESET ||
      !run.simulation.origin || !Array.isArray(run.simulation.commands)) {
    throw new Error("Invalid Life Mode save state");
  }
  const copy = replayLife(beginLife(run.simulation.origin), run.simulation.commands);
  if (JSON.stringify(copy) !== JSON.stringify(run)) {
    throw new Error("Run was modified outside the authoritative resolver");
  }
  return JSON.stringify({
    format: SAVE_FORMAT,
    origin: structuredClone(run.simulation.origin),
    commands: structuredClone(run.simulation.commands)
  });
}

export function loadLife(text) {
  if (typeof text !== "string" || text.length > 4_000_000) throw new Error("Invalid save payload");
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Corrupt Life Mode save JSON");
  }
  if (payload?.format !== SAVE_FORMAT ||
      !payload.origin || !Array.isArray(payload.commands) ||
      payload.commands.length > 10_000) {
    throw new Error("Unsupported Life Mode save format");
  }
  return replayLife(beginLife(payload.origin), payload.commands);
}
