# KINGMAKER — GAME SYSTEMS SPECIFICATION v1
## Executable Design Contract for *KINGMAKER: The Game of Judgment*

**Status:** Canonical Systems Foundation v1  
**Inputs:** World Bible v1, Character Bible v1, Campaign Architecture v1, 1,000-question curriculum  
**Primary target:** Mobile-first browser game  
**Implementation style:** Data-driven HTML/CSS/JavaScript with JSON content/state

---

# 0. Design Objective

KINGMAKER should feel like a strategic world, not a branching quiz.

The engine therefore needs to model five things simultaneously:

1. **Reality** — what is actually true.
2. **Beliefs** — what each actor currently thinks is true.
3. **Relationships** — how actors interpret and remember one another.
4. **Power** — who can cause which outcomes through formal and informal means.
5. **Time** — what changes if the player waits, acts, delegates or misses a window.

The system should support the campaign without pretending to be a fully general artificial society simulator.

The correct design target is:

> **A constrained, inspectable strategic simulation with authored causal structure and dynamic state.**

The author controls:
- the historical setting,
- characters,
- institutions,
- major story engines,
- possible scene families,
- and plausible consequence ranges.

The engine controls:
- which state applies,
- which scenes become available,
- how actors update,
- which consequences trigger,
- and how earlier choices alter later problems.

---

# 1. Core Simulation Loop

The canonical loop is:

```text
WORLD TICK
    ↓
UPDATE CLOCKS / PRESSURES
    ↓
ACTORS OBSERVE AVAILABLE INFORMATION
    ↓
ACTORS UPDATE BELIEFS
    ↓
SCENE TRIGGERS EVALUATED
    ↓
PLAYER RECEIVES BRIEFING / MESSAGES / DECISIONS
    ↓
PLAYER INVESTIGATES / TALKS / DELEGATES / COMMITS
    ↓
ACTION RESOLVES
    ↓
IMMEDIATE EFFECTS
    ↓
ACTORS INTERPRET ACTION
    ↓
RELATIONSHIP + MEMORY WRITES
    ↓
POWER / RESOURCE / NARRATIVE STATE UPDATES
    ↓
DELAYED CONSEQUENCES SCHEDULED
    ↓
NEXT WORLD TICK
```

The engine should never update relationships directly from the visible option label alone.

It should update from the **meaning of the action**.

Example:

```text
CHOICE:
"Release the document."

MEANING TAGS:
- public_disclosure
- verified_70_percent
- harms_ally
- protects_public_interest
- bypasses_private_warning

NPC interpretation:
Nadia → +trust, +respect
Mira → -trust, +respect maybe
Selma → depends on whether investigation is compromised
```

---

# 2. State Architecture

The full save state should be divided into seven top-level domains:

```text
META
TIME
WORLD
PLAYER
ACTORS
NETWORK
STORY
CONTENT_RUNTIME
```

## META

Versioning and reproducibility.

```json
{
  "schema_version": "1.0",
  "game_version": "0.1.0",
  "save_id": "...",
  "created_at": "...",
  "updated_at": "...",
  "rng_seed": 123456789
}
```

## TIME

```json
{
  "campaign_day": 1,
  "time_block": "morning",
  "act": "ACT_I",
  "chapter": "C01",
  "turn": 0
}
```

Time is not minute-by-minute simulation.

Default time granularity:
- briefing scene: no automatic time cost,
- quick call/message: 0–1 time unit,
- meeting/investigation: 1,
- major negotiation: 1–2,
- travel / operational commitment: contextual,
- world tick: usually end of time block or scene bundle.

The campaign can compress:
- hours during crisis,
- days during coalition formation,
- weeks/months between chapters.

---

# 3. World State

World tracks are **latent continuous variables**, usually 0–100.

Canonical tracks:

```text
government_stability
public_trust
institutional_integrity
fiscal_headroom
financial_stability
energy_security
social_cohesion
external_pressure
information_quality
strategic_autonomy
growth_capacity
```

## Important rule

Tracks are not moral scores.

Example:

Increasing `government_stability` can be good or bad.

A captured authoritarian coalition can be extremely stable.

The meaning comes from combinations.

### Example state interpretations

```text
High Government Stability
+ High Institutional Integrity
= durable governance

High Government Stability
+ Low Institutional Integrity
= entrenched machine / capture

Low Government Stability
+ High Institutional Integrity
= legitimate but fragmented pluralism

Low Government Stability
+ Low Institutional Integrity
= breakdown risk
```

---

# 4. Pressure Variables

Story engines should maintain separate **pressure** values.

Canonical v1 pressures:

```text
government_pressure
aster_pressure
finance_pressure
energy_pressure
labour_pressure
maritime_pressure
information_pressure
integrity_pressure
coalition_pressure
succession_pressure
```

Pressure differs from world quality.

Example:

`financial_stability = 58`

but

`finance_pressure = 75`

means:
- the system has not yet collapsed,
- but current events are pushing it hard.

Pressures:
- increase through shocks and unresolved flags,
- decline through capacity and resolved actions,
- can trigger scene families.

---

# 5. Actor Model

Each major actor has:

```text
IDENTITY
CAPABILITIES
OBJECTIVES
UTILITY_WEIGHTS
BELIEFS
RELATIONSHIPS
MEMORIES
DEPENDENCIES
CURRENT_PLAN
FALLBACK_PLAN
STATE_FLAGS
```

## Capabilities

```text
formal_power
informal_power
resources
access
information_access
network_reach
public_reputation
elite_reputation
operational_capacity
```

## Dispositions

```text
risk_tolerance
status_sensitivity
time_horizon
conflict_tolerance
ambiguity_tolerance
loyalty_weight
institutionalism
```

Dispositions influence how an actor chooses among **plausible strategies**.

They should not mechanically dictate action.

---

# 6. Actor Utility

Actors do not choose actions from morality labels.

Each actor evaluates expected utility over several dimensions.

Base utility dimensions:

```text
personal_power
faction_success
institutional_legitimacy
national_interest
material_gain
reputation
relationships
ideology_values
security
future_optionality
```

A candidate action receives:

```text
U(action) =
Σ(weight_i × expected_effect_i)
- perceived_risk
- switching_cost
- violation_cost
+ relationship_modifiers
+ status_modifiers
```

This is not meant to be a mathematically perfect model of humans.

It is an **authoring discipline**.

It forces writers to answer:

> Why would this actor want this?

rather than:

> What action would create drama?

---

# 7. Belief Model

This is one of the core systems.

Every meaningful proposition can have an ID.

Example:

```text
FACT_MERIDIAN_SOLVENT
FACT_AUREON_TENDER_INFLUENCE
FACT_SERRAT_INCIDENT_INTENTIONAL
FACT_NIKO_WILL_SUPPORT_COALITION
```

Each actor can hold:

```json
{
  "proposition": "FACT_NIKO_WILL_SUPPORT_COALITION",
  "probability": 0.63,
  "confidence": 0.52,
  "source_refs": ["SRC_112", "SRC_118"],
  "last_updated": 7
}
```

## Probability vs Confidence

Probability:
> How likely do I think the proposition is true?

Confidence:
> How strong/stable is my evidence basis?

A player could believe:

```text
P(defection) = 70%
confidence = low
```

That is different from:
```text
P(defection) = 70%
confidence = high
```

---

# 8. Information Objects

Every important information item is a structured object.

```json
{
  "info_id": "INFO_00042",
  "claim_ids": ["FACT_X", "FACT_Y"],
  "source_actor": "nadia_serrin",
  "origin_type": "document",
  "provenance": ["whistleblower", "procurement_archive"],
  "independence_group": "HARBOR_SOURCE_CHAIN_A",
  "reliability_prior": 0.77,
  "distortion_type": "selective_context",
  "authenticity": 0.92,
  "visibility": "private",
  "known_by": ["player", "nadia_serrin"],
  "expires": null
}
```

## Independence Groups

Two sources can be separate people but not independent.

If both claims originate from the same internal memo:

```text
Source A
   ↘
    Memo X
   ↗
Source B
```

the engine should mark a shared `independence_group`.

This prevents fake corroboration.

---

# 9. Player Knowledge

The engine stores objective truth separately from what the player knows.

Player knowledge entry:

```json
{
  "claim_id": "FACT_X",
  "player_probability": 0.60,
  "player_confidence": 0.45,
  "evidence_seen": ["INFO_001", "INFO_008"],
  "status": "inferred"
}
```

The UI should not show exact hidden truth.

It may show:

```text
LIKELY
Confidence: moderate
Sources: 2
Source independence: uncertain
```

Difficulty mode determines how much of that interpretation is assisted.

---

# 10. Relationship Model

Per actor → player:

```text
affection
trust
respect
fear
envy
grievance
dependency
ideological_alignment
material_alignment
familiarity
```

Ranges:
`0–100`

Baseline neutral:
`50`

But some values such as fear and grievance can naturally start lower.

## Why separate variables matter

Example:

Silas Koren after being defeated fairly:

```text
affection: 38
trust: 61
respect: 86
fear: 49
envy: 30
grievance: 44
dependency: 12
```

This relationship can support:
- rivalry,
- cooperation,
- negotiation,
- mutual prediction,

without collapsing into "likes you = 57."

---

# 11. Relationship Update Engine

A resolved action emits semantic tags:

```text
kept_promise
broke_promise
shared_credit
public_humiliation
private_disagreement
protected_actor
caused_actor_cost
gave_actor_voice
bypassed_actor
lied
updated_honestly
reciprocal_concession
unilateral_concession
```

Each actor interprets tags through:
- values,
- objectives,
- status sensitivity,
- prior trust,
- believed player motive.

### Example

Player publicly rejects Tomas Veyr's demand but privately gives him early warning.

Possible interpretation:

```text
policy_alignment: -10
trust: +4
respect: +6
grievance: +2
```

Why?
Because:
- he dislikes outcome,
- but respects clear boundary and prior warning.

---

# 12. Memory System

Every salient event can generate one or more actor memories.

```json
{
  "memory_id": "MEM_0042",
  "actor_id": "mira_solen",
  "event_id": "EVT_031",
  "summary": "Player warned Mira before automation announcement.",
  "interpretation": "Player treats Labour as a participant rather than an obstacle.",
  "believed_intent": "respect_and_coalition_maintenance",
  "benefit": 12,
  "cost": 2,
  "salience": 0.72,
  "decay": 0.015,
  "tags": ["early_warning", "respect", "automation"]
}
```

## Memory Recall

A later scene queries memories by:
- actor,
- tags,
- salience,
- recency,
- unresolved grievance,
- structural similarity.

Example:
A later energy decision can recall:
`early_warning`

even if the original memory was about automation.

This allows actors to form beliefs about **character** from repeated behavior.

---

# 13. Promise / Obligation Ledger

Promises should be explicit state, not vague dialogue flavor.

```json
{
  "promise_id": "PROMISE_17",
  "giver": "player",
  "receiver": "niko_arven",
  "terms": "Island grid funding receives cabinet review before budget lock.",
  "deadline": 21,
  "status": "active",
  "visibility": "private",
  "importance": 0.66
}
```

Statuses:

```text
active
fulfilled
partially_fulfilled
broken
waived
superseded
impossible_due_to_external_change
```

NPC interpretation of broken promises must distinguish:
- deception,
- negligence,
- changed circumstances,
- genuine impossibility.

---

# 14. Power Graph

Actors/institutions are nodes.

Edges are typed:

```text
authority
access
trust
money
dependency
information
patronage
coalition
rivalry
obligation
kinship
procedural_control
```

Each edge can have:

```text
strength
direction
visibility
stability
source
```

## Derived network concepts

The engine may compute simplified:
- degree centrality,
- brokerage,
- chokepoints,
- dependency concentration.

These are not directly shown as perfect numbers to player.

They enable:
- hidden influence,
- gatekeeper scenes,
- coalition instability,
- power-map UI.

---

# 15. Player Resources

The player should have a small number of understandable strategic resources.

Canonical v1:

```text
attention
staff_capacity
political_capital
credibility
public_reputation
elite_reputation
network_reach
intelligence_capacity
institutional_authority
financial_discretion
```

Not every resource is spendable like mana.

## Attention

Attention is the most game-like resource.

During a time block:
- direct involvement consumes attention,
- delegation saves attention,
- poor staff increases supervision cost,
- crisis overload creates missed signals.

## Political Capital

Represents ability to ask actors to:
- take risk,
- accept delay,
- vote against immediate preference,
- absorb public cost.

Political capital is relationship/network-specific as well as global.

---

# 16. Staff System

The player should eventually manage a small staff.

Staff fields:

```text
competencies
capacity
trust_player
autonomy
burnout
network_access
specialization
```

A staff member can:
- investigate,
- draft,
- negotiate,
- monitor,
- brief,
- coordinate.

## Delegation

Delegation outcome depends on:
- staff skill,
- task fit,
- autonomy,
- information access,
- player clarity,
- time.

The player should not be punished for delegation merely to create drama.

High-quality delegation is a late-game skill.

---

# 17. Decision Object

Every major decision should compile to:

```json
{
  "decision_id": "DEC_001",
  "objective": "...",
  "known_facts": [],
  "uncertain_facts": [],
  "hidden_truth_refs": [],
  "actors": [],
  "options": [],
  "deadline": null,
  "decision_quality_model": {},
  "resolution_model": {},
  "memory_templates": [],
  "debrief_tags": []
}
```

Each option contains semantic consequences rather than hard-coded prose only.

```json
{
  "option_id": "OPT_A",
  "label": "...",
  "tags": ["public_escalation", "fast", "irreversible"],
  "effects": [],
  "stochastic_events": [],
  "actor_interpretation_rules": []
}
```

---

# 18. Decision Quality vs Outcome

This distinction is mandatory.

## Decision Quality

Score from information available **at the time**.

Dimensions:

```text
diagnosis
evidence_use
tradeoff_awareness
second_order_reasoning
calibration
integrity_legacy
```

Internal score:
`0.0–1.0`

## Outcome

Outcome is generated from:
- decision,
- hidden truth,
- actor reactions,
- world state,
- stochastic uncertainty.

A 0.85 decision can fail.

A 0.30 decision can get lucky.

The debrief should be able to say:

> The policy failed, but the decision was well-calibrated given what you knew.

or:

> You won the vote, but relied on an assumption that was false. The outcome was lucky.

---

# 19. Outcome Resolution

A simple canonical resolution model:

```text
BASE_EFFECT
+ STATE_MODIFIERS
+ ACTOR_RESPONSE
+ RANDOM_COMPONENT
= OUTCOME
```

Randomness should be:
- bounded,
- seeded,
- explainable in postmortem,
- never used to erase strategic preparation.

## Recommended variance

Routine operational decisions:
`±5%`

High-uncertainty political / market outcomes:
`±15–25%`

Extreme-tail events:
explicit event tables, not arbitrary random punishment.

---

# 20. Reversibility

Every major option should declare:

```text
reversibility: high | medium | low
```

Low-reversibility decisions:
- treaties,
- public red lines,
- major appointments,
- long concessions,
- constitutional rules,
- reputation-defining accusations.

High-reversibility decisions:
- pilot,
- temporary reserve,
- exploratory talks,
- small staffing changes,
- conditional contracts.

This feeds:
- decision quality,
- AI actor preference,
- tutorial/debrief,
- risk.

---

# 21. Scene Trigger Engine

A scene can trigger based on:

```text
chapter
act
world tracks
pressure thresholds
flags
actor state
relationship state
prior scene completion
promises
time
random roll
absence of another event
```

Example:

```json
{
  "all": [
    {"flag": "BUDGET_VOTE_ACTIVE"},
    {"world.government_stability": {"lte": 45}},
    {"actors.nela_orr.player_relationship.trust": {"gte": 35}}
  ],
  "none": [
    {"flag": "NELA_PROCEDURAL_ROUTE_USED"}
  ]
}
```

---

# 22. Scene Priority

When many scenes trigger:

Priority score:

```text
urgency
+ narrative_relevance
+ actor_salience
+ unresolved_promise
+ pressure_link
- repetition_penalty
```

Scene categories:

```text
MANDATORY_SPINE
CRISIS
CONSEQUENCE
RELATIONSHIP
OPPORTUNITY
INTELLIGENCE
FLAVOR
```

Rules:
- mandatory spine cannot be starved,
- consequence scenes should often outrank new opportunities,
- unresolved personal promises should become harder to ignore over time.

---

# 23. Dynamic Scene Variants

Scenes should contain authored variants selected by state.

Example:

`ASTER_FINANCING_MEETING`

Variant A:
- Adrian PM
- Mira coalition partner
- Liora outside government

Variant B:
- Mira PM
- Adrian opposition
- Liora coalition partner

The strategic mechanism is the same:
financing + procurement + capture risk.

But:
- who can promise,
- who can veto,
- who takes credit,
- who is suspicious,

all change.

---

# 24. Flags

Flags are discrete truths created by choices.

Examples:

```text
NIKO_EARLY_WARNING_KEPT
NSO_OVERSIGHT_ACCEPTED
ASTER_SINGLE_OPERATOR
ASTER_OPEN_INTEROPERABILITY
LABOUR_PACT_SIGNED
ORDAN_LONG_TERM_CONTRACT
MERIDIAN_PUBLIC_REASSURANCE
SERRAT_HOTLINE_CREATED
LEA_PUBLIC_CREDIT_SHARED
SILAS_PROBE_DETECTED
```

Flags should describe facts, not hidden moral judgments.

Avoid:
`PLAYER_WAS_GOOD`

Use:
`PLAYER_SHARED_CREDIT_WITH_LEA`

---

# 25. Narrative / Media System

Narratives are objects.

```json
{
  "narrative_id": "NARR_PLAYER_SHADOW_GOVERNMENT",
  "claim": "The NSO is becoming an unelected shadow government.",
  "salience": 0.41,
  "credibility": 0.55,
  "emotional_intensity": 0.33,
  "audience_support": {
    "general": 0.28,
    "free_cities_base": 0.61,
    "business": 0.22
  },
  "sponsors": ["..."],
  "evidence_refs": ["..."],
  "decay_rate": 0.02
}
```

Narrative adoption changes through:
- evidence,
- repetition,
- elite endorsements,
- player behavior that confirms/contradicts it,
- counter-narratives,
- attention competition.

---

# 26. Public Audience Segments

Canonical audience segments:

```text
general_public
urban_youth
business_elite
organized_labour
industrial_regions
rural_regions
sera_islands
security_voters
international_investors
civil_service
```

A policy may improve one segment's support and reduce another's.

No universal approval meter.

---

# 27. Faction Model

Each faction tracks:

```text
public_support
internal_unity
resources
institutional_access
media_access
network_reach
coalition_commitments
player_trust
player_fear
player_dependency
current_strategy
red_lines
```

## Internal Unity

Low unity can:
- make leader commitments unreliable,
- generate leaks,
- create defections,
- produce sub-faction scenes.

The faction leader is not the faction.

---

# 28. Coalition Model

A coalition has:

```text
members
shared_objectives
contract_terms
red_lines
issue_scope
confidence_commitments
appointment_rules
dispute_process
exit_conditions
cohesion
dependency_asymmetry
```

Coalition cohesion updates based on:
- promise fulfillment,
- distribution of gains,
- humiliation,
- side deals,
- external threat,
- ideological distance,
- player brokerage.

---

# 29. Crisis System

Crisis is not a separate minigame.

It changes:
- time granularity,
- attention scarcity,
- tolerance for delay,
- actor risk preferences,
- media salience,
- available emergency authorities.

## Crisis Phase

```text
NORMAL
WATCH
ACTIVE
ACUTE
STABILIZING
AFTERMATH
```

## Crisis escalation

Pressure alone does not automatically cause collapse.

Escalation uses:
- pressure,
- resilience,
- unresolved triggers,
- actor responses,
- feedback loops.

---

# 30. Act V Crisis Composer

At Act IV end:

```text
score each pressure
apply resilience modifiers
apply unresolved flags
apply relationship/channel modifiers
rank modules
```

Choose:
- 3 primary crisis modules,
- 2 secondary complications.

## Example

Player invested in:
- energy diversification,
- labor pact,
- Serrat hotline.

But neglected:
- Meridian concentration,
- Aster dependency,
- coalition health.

Act V could become:

Primary:
1. finance
2. Aster infrastructure
3. government collapse

Secondary:
4. information war
5. mild energy price shock

Labor and Serrat become stabilizers.

This is meaningful agency.

---

# 31. Feedback Loops

The engine should explicitly support self-reinforcing dynamics.

## Bank Run

```text
rumour
→ withdrawals
→ liquidity stress
→ alarming observable behavior
→ more credible rumour
→ more withdrawals
```

## Coalition Fragmentation

```text
low trust
→ private side deals
→ suspicion
→ less information sharing
→ worse coordination
→ more side deals
```

## Personalized Power

```text
player solves crisis
→ actors route more decisions through player
→ player gains information/access
→ player solves more crises
→ institutions atrophy
→ player becomes indispensable
```

This last loop is the campaign's deepest system.

---

# 32. Personalized Power Index

Track internally:

```text
player_decision_share
network_brokerage
staff_dependency
institutional_bypass_frequency
direct_leader_access
delegation_rate
successor_authority
```

Derived:

```text
PERSONALIZATION_INDEX
```

High personalization is not automatically bad.

During a genuine acute crisis it may improve outcomes.

The cost appears over time if:
- delegation remains low,
- institutions cannot act without player,
- information channels route through one node,
- successors stay weak.

---

# 33. Institutional Capacity

Each major institution tracks:

```text
capability
legitimacy
independence
information_quality
redundancy
leadership_quality
process_maturity
personalization
```

Institutions:
- Presidency
- Cabinet
- NSO
- Central Bank
- Integrity Commission
- NID
- Assembly administration
- Aster Gate Authority (if created)

A strong institution is not simply high-capability.

Example:

```text
capability 90
legitimacy 35
personalization 85
```

is a dangerous high-performance machine.

---

# 34. Silas Learning Model

Silas maintains beliefs about **player tendencies**, not secret variables.

Tracked dimensions:

```text
response_speed
verification_depth
conflict_aversion
status_sensitivity
loyalty_bias
disclosure_style
reserve_preference
reversibility_preference
public_response_threshold
process_preference
```

Each:

```json
{
  "estimate": 0.0,
  "confidence": 0.0,
  "observations": 0,
  "last_observed": null
}
```

## Update

For each observable player action:

```text
new_estimate =
weighted_average(old_estimate, observed_signal)

confidence increases with:
- repeated similar observations,
- high-signal actions,
- cross-context consistency.

confidence decreases with:
- contradictory observations,
- deliberate mixed strategy,
- context that explains the behavior better.
```

## Exploit threshold

Silas should only design a targeted exploit when:
- confidence ≥ configured threshold,
- observation count sufficient,
- and he has a plausible route to act.

## Clue requirement

Every exploit scene must include at least one clue:
- timing pattern,
- too-convenient framing,
- correlated source,
- unusual choice of intermediary,
- repetition of a previous player behavior.

---

# 35. Difficulty Modes

Difficulty changes **information support**, not NPC intelligence cheats.

## Apprentice

- highlights source conflicts,
- shows rough relationship explanations,
- stronger debriefs,
- fewer hidden correlations,
- generous time/attention.

## Strategist

Default.

- no principle labels before decision,
- moderate uncertainty,
- indirect relationship cues,
- normal time/resource pressure.

## Master

- fewer confidence hints,
- more correlated sources,
- less visible consequence forecasting,
- actors exploit patterns sooner,
- tighter attention.

## Grandmaster

- hidden most relationship estimates,
- fewer explicit source-independence warnings,
- greater adversarial adaptation,
- outcomes more sensitive to unmodeled second-order effects,
- no "recommended" investigation prompts.

Important:
Grandmaster is not allowed to fabricate missing evidence just to punish the player.

---

# 36. Debrief System

Debrief is optional.

It has two layers.

## Immediate debrief

After major decisions:

```text
Your objective
Key information available
Decision quality estimate
Major trade-off
What remained uncertain
```

## Retrospective debrief

Only after enough truth becomes known:

```text
What was actually true
Which assumptions were correct
Which outcomes were luck
What second-order effect appeared
Related competencies
Gracián / Greene anchors
```

The game should sometimes delay the answer.

Real strategy does not provide instant answer keys.

---

# 37. Curriculum Integration

Each scene can tag:

```text
primary_competency
secondary_competencies
master_tension
workbook_links
```

These tags are invisible in story mode until debrief.

Mastery profile can update:

```text
competency_exposure
decision_quality
confidence_calibration
error_pattern
```

Challenge Mode can recommend drills based on story weaknesses.

Example:

Player repeatedly:
- trusts correlated sources.

Story observes:
`PE2 Source Evaluation weakness`

Challenge Mode can surface:
relevant Q-items.

But the story never pauses to say:
> You failed PE2.

---

# 38. Confidence Calibration

Before some high-value decisions, player may optionally state confidence.

Example:
> How confident are you that Niko will vote yes?

Slider / buckets:

```text
<40%
40–60%
60–80%
80%+
```

Later:
- calibration score compares belief to outcome/ground truth,
- overconfidence becomes visible,
- correct uncertainty is rewarded.

This should be used selectively, not every scene.

---

# 39. Investigation Actions

Before commitment, the player can sometimes spend time/attention to:

```text
verify_source
seek_independent_source
ask_actor_directly
request_document
consult_expert
run_scenario
map_network
wait_for_signal
```

Investigation has cost.

Waiting can:
- improve information,
- close a window,
- signal weakness,
- allow opponent action.

---

# 40. Dialogue System

Dialogue choices should mainly alter:

```text
information gained
relationship interpretation
commitments
framing
future access
```

Not:
`+5 charisma`

Dialogue options should represent:
- question,
- boundary,
- disclosure level,
- framing,
- commitment,
- silence.

Actors can refuse to answer.

---

# 41. Negotiation System

Negotiations need not become a separate complex economic simulator.

Each negotiation should track:

```text
issues
positions
interests
reservation_values
known_constraints
unknown_constraints
relationship_horizon
public_audience_cost
time_pressure
agreement_zone
```

Player actions:
- ask,
- reveal,
- package,
- sequence,
- concede,
- condition,
- pause,
- walk away.

Strong play discovers interests and creates packages.

---

# 42. Appointment System

Appointments matter because they create durable network changes.

Candidate evaluation includes:

```text
competence
loyalty
independence
network
integrity
public_credibility
faction_cost
succession_value
```

There should be no universally best candidate.

A highly competent loyalist can lower institutional independence.

A strong independent candidate can create future rivalry.

---

# 43. Agenda System

Not every issue reaches the player automatically.

Agenda control determines:
- which topics reach a meeting,
- in what order,
- with how much time,
- with what framing.

Actors such as:
- Ivo,
- Nela,
- Silas,
- party whips,
- the player,

can exert agenda influence.

Agenda control is power.

---

# 44. Access System

Access is modeled as:

```text
channel
gatekeeper
relationship_requirement
formal_permission
time_cost
reputation_cost
```

Example:
The player can bypass Ivo using direct Presidential contact.

This may:
- save time,
- lower Ivo trust,
- increase personalization,
- establish precedent.

The engine should remember the access method.

---

# 45. Reputation System

Player reputation is audience-specific.

Canonical dimensions:

```text
competent
trustworthy
independent
loyal
decisive
fair
dangerous
technocratic
political
secretive
```

Different audiences hold different reputation vectors.

A public event updates only audiences that plausibly observe it.

---

# 46. Credibility

Credibility is specifically:

> How much weight actors give the player's claims and commitments.

It rises through:
- accuracy,
- calibrated uncertainty,
- promise keeping,
- correction of own errors.

It falls through:
- confident false claims,
- repeated exaggeration,
- broken commitments,
- selective disclosure discovered later.

Credibility should be slower-moving than public approval.

---

# 47. Status and Face

Some actors have high status sensitivity.

Actions can contain:

```text
private_correction
public_correction
public_credit
status_threat
face_saving
humiliation
```

Face-saving is not cosmetic.

It can alter whether an actor can accept a deal without losing their coalition.

This is especially relevant to:
- Talia,
- Tomas,
- party leaders,
- Damir,
- union leadership.

---

# 48. Ethics / Integrity Without Morality Meter

The game does not have:
`GOOD +10`

Integrity is represented through factual patterns:

```text
kept_commitments
neutral_rule_support
truthfulness
due_process
conflict_of_interest_management
civilian/public harm
use_of_deception
institutional_bypass
```

These affect:
- actor trust,
- legitimacy,
- institutional integrity,
- ending.

A deceptive tactic may succeed.

The engine does not prevent it.

It models the system it creates.

---

# 49. Hidden Truth and Authoring Fairness

Every major mystery must have:
- canonical truth,
- evidence trail,
- plausible alternative interpretations.

Writers cannot decide truth after seeing player choice.

Otherwise strategy becomes fake.

For each mystery:

```text
truth
evidence_supporting_truth
evidence_against_or_ambiguous
who_knows
who_believes_wrongly
how_truth_can_be_discovered
```

---

# 50. Stochasticity and Reproducibility

Every save has RNG seed.

Random events should be logged:

```json
{
  "roll_id":"ROLL_17",
  "seed_state":"...",
  "distribution":"normal",
  "expected":0.62,
  "roll":0.54,
  "context":"independent_mp_vote"
}
```

Developer/debug mode can replay identical outcome sequences.

This is essential for testing.

---

# 51. Save / Load

Save state should include:
- all current world/actor/network state,
- active promises,
- memories,
- scheduled consequences,
- story flags,
- RNG state,
- content version.

Autosave:
- before major irreversible decision,
- after consequence pulse,
- chapter start.

Manual save:
default enabled outside locked scenes.

---

# 52. Content Versioning

Each content object should have:

```text
content_version
schema_version
```

If schema changes:
- migration functions convert old saves where possible.

Never silently break saves because a character field was renamed.

---

# 53. Mobile UI State

Primary portrait navigation:

```text
HOME / BRIEFING
INBOX
PEOPLE
POWER MAP
SITUATION
RESOURCES
CODEX
```

## Bottom navigation

Recommended 5 primary tabs:

1. Briefing
2. Inbox
3. People
4. Situation
5. More

"More" contains:
- Power Map
- Resources
- Codex
- Settings
- Save

The current decision can appear as an overlay/card stack.

---

# 54. Briefing Screen

Shows:

- date / campaign phase,
- 3–5 highest-priority changes,
- active clocks,
- unresolved commitments,
- today's available attention.

No raw hidden stats.

Example:

```text
Government formation: fragile
Aster financing window: closing
Meridian confidence: stable, watching
Serrat talks: scheduled in 4 days
```

---

# 55. Inbox

Contains:
- messages,
- requests,
- leaked documents,
- analyst notes,
- media links,
- invitations.

Each item can have:
- source,
- urgency,
- authenticity indicator if known,
- related actor,
- action buttons.

Inbox itself becomes information overload in advanced play.

---

# 56. People Screen

For each known actor:

```text
public role
known objectives
observed behavior
relationship impressions
promises
recent memories
access routes
player confidence in assessment
```

Never:
- exact hidden trust number,
- developer truth,
- secret plan.

---

# 57. Power Map

Graph view should support filters:

```text
formal authority
access
money
information
dependency
coalition
```

The player's map is epistemic.

Unknown edges are hidden.
Suspected edges can be dashed.
Confirmed edges solid.

This makes "network mapping" an actual mechanic.

---

# 58. Situation Room

Shows active story engines.

Example:

```text
Government
Aster Gate
Energy
Financial Stability
Labour
Serrat
Harbor Investigation
NSO
```

Each displays:
- qualitative state,
- known risks,
- current decisions,
- active clocks.

---

# 59. Consequence Pulse

After major time blocks, show a compact consequence screen:

```text
WHAT CHANGED
- Civic Labour confidence vote stance hardened.
- Aster financing remains available.
- Nadia published without the disputed page.
- Ivo now routes Presidency requests through Mara.
```

Do not reveal:
- all hidden relationship changes,
- all future flags.

---

# 60. Difficulty Through Information, Not HP

Harder modes alter:
- evidence clarity,
- time,
- visibility,
- actor adaptation,
- relationship inference.

They do not simply:
- increase costs by 50%,
- make NPCs immune,
- create arbitrary failures.

---

# 61. Content Pipeline

Canonical authoring sequence:

```text
Strategic mechanism
→ campaign engine
→ recurring actors
→ current state conditions
→ scene premise
→ information set
→ player options
→ semantic tags
→ immediate effects
→ actor interpretations
→ memory writes
→ delayed effects
→ debrief metadata
→ QA
```

Every story scene must be data-backed.

---

# 62. Validation Rules

Automated content validator should flag:

- missing actor IDs,
- impossible state references,
- option without effects,
- memory write without actor,
- duplicate scene ID,
- trigger referencing unknown flag,
- all options producing identical state,
- irreversible option with no autosave marker,
- debrief tag not in 60-competency registry,
- source reference without provenance,
- promise deadline earlier than creation,
- consequence scheduled before its cause.

---

# 63. Balance / Telemetry

For local development, log:

```text
option pick rate
decision quality
outcome distribution
relationship deltas
scene trigger frequency
crisis frequency
ending frequency
time spent per scene
investigation action frequency
```

Purpose:
- identify obvious choices,
- dead content,
- overpowered strategy,
- hidden traps that are too opaque.

Telemetry should not alter single-player decisions in real time.

---

# 64. Anti-Exploit Design

Potential player exploits:

## Reload until random outcome succeeds
Mitigation:
- RNG seed can be stored before decision,
- outcome roll tied to pre-decision state.

## Always choose "gather more info"
Mitigation:
- time, attention and signaling cost.

## Always be transparent
Mitigation:
- negotiation/security costs.

## Always be secretive
Mitigation:
- trust/legitimacy decay and poorer distributed decision-making.

## Always centralize
Mitigation:
- short-term efficiency, long-term personalization and bottleneck risk.

## Always delegate
Mitigation:
- staff skill, trust and task complexity matter.

No universal dominant strategy.

---

# 65. The Player Model

The engine can maintain a private behavioral profile for:
- debrief personalization,
- Silas observation,
- ending analysis.

Track patterns:

```text
verification_rate
average_response_speed
delegation_rate
public_escalation_rate
promise_keep_rate
risk_appetite
reversibility_preference
coalition_breadth
disclosure_ratio
rule_neutrality
personalization_rate
```

Important:
This profile describes behavior.
It does not assign personality labels as objective truth.

---

# 66. Example Resolution — Chapter 1

Situation:
Two coalition counts.

```text
Whip source says: 122
Lea independently verifies: 119
Deadline: 90 minutes
```

Player chooses:
> "Report 119 confirmed, 3 probable, explain source."

Semantic tags:

```text
calibrated
truthful_uncertainty
no_false_precision
protects_presidency
slower_political_momentum
```

Decision quality:
high.

Possible stochastic outcome:
One probable MP confirms later.

Actual result:
120 by noon.

The player was numerically "wrong" about eventual 119,
but epistemically correct to report:
119 confirmed + 3 probable.

Debrief:
**Good decision, imperfect prediction.**

This is the exact distinction the whole game is built to teach.

---

# 67. Example Long Consequence — Bypassing Ivo

Act I:
Player bypasses Ivo once to reach Elena during genuine urgency.

Immediate:
- fast access,
- crisis avoided.

Ivo interpretation:
- if urgency real: small grievance, respect may rise.
- if vanity/weak reason: trust falls more.

Act III:
Other actors may cite the precedent:
> "You bypassed the gatekeeper when it mattered."

Act IV:
NSO oversight critics can use repeated bypasses as evidence of personalized access.

Act VI:
A Presidency with strong gatekeeping may survive.
A Presidency normalized around personal channels may become factionalized.

One small scene can therefore matter without forcing a scripted callback.

---

# 68. v1 Implementation Boundary

The first playable implementation does **not** need:
- full autonomous NPC planning,
- generative dialogue,
- hundreds of procedural events,
- complex economy simulation.

v1 needs:

1. deterministic state container,
2. scene trigger engine,
3. authored choices,
4. relationship/memory writes,
5. world tracks and pressures,
6. information objects,
7. basic actor belief storage,
8. promises,
9. dynamic scene variants,
10. save/load,
11. mobile UI,
12. Act I content.

The architecture should support later expansion without requiring it immediately.

---

# 69. Recommended Implementation Order

## Milestone A — Engine Skeleton

- state store
- schema validation
- content loader
- trigger evaluator
- effect resolver
- save/load

## Milestone B — Human System

- actors
- relationships
- memories
- promises
- information provenance
- power graph

## Milestone C — Narrative Runtime

- scene queue
- dialogue/choice UI
- consequence pulse
- chapter scheduler
- dynamic variants

## Milestone D — Strategic Systems

- pressures
- crisis state
- decision-quality model
- Silas learner
- audience narratives

## Milestone E — Vertical Slice

Implement Chapters 1–3 completely.

This should prove:
- information reasoning,
- procedural power,
- relationship memory,
- delayed consequence.

Only after the vertical slice works should we author all 36 chapters.

---

# 70. Repo Structure Recommendation

```text
/
  README.md
  docs/
    00_MASTER_PROJECT.md
    01_WORLD_BIBLE_V1.md
    02_CHARACTER_BIBLE_V1.md
    03_STORY_CAMPAIGN_ARCHITECTURE_V1.md
    04_GAME_SYSTEMS_SPEC_V1.md

  data/
    world_state_seed_v1.json
    character_state_seed_v1.json
    relationship_graph_v1.json
    campaign_seed_v1.json
    game_state_schema_v1.json

  src/
    state/
    engine/
    systems/
    ui/
    content/

  content/
    acts/
      act_01/
    scenes/
    decisions/

  tests/
    state/
    triggers/
    consequences/
    narrative/

  public/
```

---

# 71. Canon Locks After Systems v1

1. Game is **authored simulation**, not freeform agent society.
2. Objective truth, beliefs and player knowledge are stored separately.
3. Relationships are multidimensional.
4. Important actions write memories.
5. Promises are explicit state.
6. Power is a typed network graph.
7. Decision quality and outcome remain separate.
8. Scene triggers are state-based.
9. Act V crises are composed from accumulated pressures.
10. Silas learns only from observable behavior.
11. Difficulty changes information support and pressure, not hidden cheating.
12. Integrity is modeled through behavior and institutional consequences, not morality points.
13. The initial implementation target is **Act I vertical slice**, not all 36 chapters at once.
14. Engine must support deterministic seeded replay for testing.
15. Mobile portrait UI is the primary interface target.

---

# 72. Next Phase

The next phase should be:

# **VERTICAL SLICE CONTENT + ENGINE SKELETON**

Specifically:

- Chapters 1–3 fully authored as executable scene data,
- initial JavaScript state store,
- trigger/effect resolver,
- mobile portrait shell,
- first People / Inbox / Briefing screens,
- save/load,
- first delayed callback.

At that point KINGMAKER becomes a game rather than only a design project.