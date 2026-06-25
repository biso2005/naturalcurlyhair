**Natural*****Curly***
 
The Diagnostic Tool
 
*Implementation Handover for Claude Code*
 
Strategic context · decision tree · data layer · microcopy library · build sequence · acceptance criteria
 
| **How to use this document** This is the single source of truth for the v1 build of the diagnostic tool. It carries everything needed to ship: the strategic posture, the full decision tree across all five entry symptoms, the data sources to wire up, the locked microcopy, the build order, and the acceptance bar. Claude Code can work from this directly. Where this document and earlier specs disagree, this document wins for the tool. Where edits need approval, surface them as written questions to the operator. |
| --- |
 
# 1. Strategic context
 
## What the tool is
 
A decision-support tool that takes a UK reader's surface complaint about their hair, their postcode, and a few behavioural observations, and surfaces the most likely cause and a specific first thing to try this weekend.
 
It is not a prescription engine. It does not tell the user what their hair needs. It helps them figure it out, with better information than they would have otherwise — and the honesty to admit when it does not know.
 
| **The spine — the principle the tool is built to express** The tool does not claim authority over the reader's hair. It surfaces the most likely cause given their inputs, names the standard first thing to try, tells them how to know whether it worked, and tells them what to look at next if it did not. The reader owns the decision and the outcome. |
| --- |
 
## What it is NOT
 
- Not a prescription engine. The tool does not say "buy this and your hair will work." It says "this is what most people in your situation try first."
 
- Not an LLM chatbot. Rules-based decision tree only. No generative outputs.
 
- Not a curl-type quiz. Curl type is an internal variable at most, not the primary axis.
 
- Not a registration funnel. Profiles are offered as a service after value has been delivered, not as a gate.
 
- Not exhaustive. The tool handles the most common 80 percent. Edge cases route to professionals, articles, or honest "we don't know."
 
## Why this is the build
 
The site's strategic target is to be the most-read UK curly hair site. Article volume alone will not win that against US incumbents and AI-generated content. The defensible asset is being the place readers come to when they want to figure something out — and the diagnostic tool is the structural artefact that earns that position.
 
Every other piece of content on the site eventually links into or out of this tool. Articles become deeper answers the tool routes to. The UK environmental moat (water, climate, salon scarcity) is operationalised in the tool's logic, not just described in articles. The tool is the spine.
 
## V1 scope — locked
 
- Five entry symptoms (full breadth)
 
- Postcode-driven data layer with water hardness, humidity, chlorine, and demographic context
 
- Decision tree resolves to a most-likely cause with confidence grade
 
- One specific first action per resolution, with success markers and a next branch
 
- Medical exit ramps where symptoms warrant
 
- Profile save mechanism (resume, get more on topic, sharpen over time)
 
- Silent, structural exits at every screen — no "want to continue?" prompts
 
## Out of scope for v1
 
- LLM-mediated outputs of any kind
 
- Bespoke routine generation per profile (post-v1)
 
- Affiliate product integration inside the tool (post-v1; the tool recommends categories, articles do products)
 
- Comments, ratings, or social features
 
- Standalone mobile app — this is a web tool only
 
# 2. Information architecture
 
## The user journey, end to end
 
Five screens maximum. Every screen ends in a natural answer. The user can leave at any point with value in hand.
 
| **Screen** | **What happens** |
| --- | --- |
| 1 — Entry | User picks the surface complaint that sounds closest to what they are experiencing. Five primary options plus a "not sure" exit. |
| 2 — Postcode | User enters postcode. Tool returns first piece of context: water hardness, climate, and the framing of which factor is likely dominant for someone in their area with their complaint. |
| 3 — Narrowing | User picks a behavioural surface description (how their hair feels, looks, behaves). No technical vocabulary required. "Not near my hair right now" is a valid option. |
| 4 — The starting point | Tool surfaces the most likely cause with confidence grade, the specific first thing to try this weekend, how to know if it worked, and what to look at next if it did not. Profile save offered here. |
| 5 — Optional depth (post-recommendation) | For users who want more, linked detail on why this cause matters, the science behind the recommendation, alternative branches. Most users will exit at Screen 4. |
 
## The five entry symptoms
 
These are the five doors at Screen 1. Worded in the reader's surface language, not in technical vocabulary. Each routes through a different decision sub-tree.
 
| **Symptom code** | **Entry copy** |
| --- | --- |
| S1-dry | My hair feels dry, no matter what I try |
| S2-growth | My hair isn't growing |
| S3-products | My products have stopped working |
| S4-parent | My child's curls — and I have no idea where to start |
| S5-scalp | My scalp is itchy, flaky, or sore |
 
Plus a "not sure" exit that routes to a softer description-based intake (post-v1 enhancement; v1 routes "not sure" to S1-dry as the safest default).
 
## Decision tree shape, per symptom
 
Each symptom has the same internal structure:
 
- Postcode input → water + climate + demographic context returned as Screen 2 output.
 
- Behavioural surface descriptor at Screen 3 → maps to one of 3-5 candidate causes.
 
- Combined postcode data + descriptor → resolves to the single most-likely cause for this user with a confidence grade (high/medium/low).
 
- Most-likely cause → maps to a pre-written recommendation: action, success marker, next branch.
 
- If any answer hits a medical red-flag combination → safety exit ramp fires alongside (not instead of) the hair advice.
 
| **The data does the mapping, not the user** The user never picks their porosity, their curl type, or their root cause. They describe what they see and feel. The tool's logic does the diagnostic work. This is the discipline that makes the tool feel like help, not like a quiz. |
| --- |
 
# 3. Data layer specification
 
## What data the tool needs
 
Four data sources, all public, all curated into the site's own lookup. None require API integration in v1 — pre-computed lookup tables shipped with the site work fine and refresh annually.
 
| **Data type** | **Source** | **Granularity** | **Refresh cadence** |
| --- | --- | --- | --- |
| Water hardness (mg/L CaCO3) | DWI + individual water company published data, aggregated | Postcode district (~3000 districts) | Annually |
| Humidity / climate | Met Office archives | Regional (city/county level) | Annually |
| Chlorine in drinking water | DEFRA + water company data | Regional | Annually |
| Demographic context (curl-care availability proxy) | ONS Black/mixed-race population density + Habia salon registration data | Local Authority District | Annually |
 
## Lookup table specification
 
Build a single JSON or JS file at /src/data/uk_postcode_profile.json keyed by postcode district (e.g. "SE18", "M14", "B5"). Each entry contains:
 
| **Field** | **Value** |
| --- | --- |
| district | string — e.g. "SE18" |
| water_hardness_mgl | integer — milligrams CaCO3 per litre |
| water_band | enum — "soft" (<60), "moderate" (60-120), "hard" (120-180), "very_hard" (180-280), "extreme" (>280) |
| water_uk_percentile | integer 0-100 — where this hardness sits in the UK distribution |
| humidity_avg | integer — annual mean relative humidity, percent |
| humidity_band | enum — "low" (<60), "moderate" (60-75), "high" (>75) |
| chlorine_level | enum — "low", "moderate", "high" |
| region | string — e.g. "London SE", "Greater Manchester" |
| salon_density | enum — "high", "moderate", "low", "very_low" — proxy for ease of accessing an Afro-specialist salon |
 
## Bootstrapping the data — operator notes
 
The data exists publicly but is not aggregated for this purpose. Initial population requires manual curation. Realistic approach:
 
- Week 1 — water hardness. Pull from each major UK water company (Thames Water, Severn Trent, Anglian, Yorkshire, United Utilities, etc.). Most publish hardness by postcode in PDF or CSV. Convert all units to mg/L CaCO3 (some publish in French or German degrees — multiply accordingly). TapWater.uk has done some aggregation but their data is incomplete; treat as a starting point, not a primary source.
 
- Week 2 — humidity. Met Office Historic Station Data is free. ~270 stations across the UK; map each postcode district to its nearest station. Annual mean RH is the simplest figure.
 
- Week 2 — chlorine. DEFRA's Drinking Water Inspectorate publishes water quality reports by water company. Categorical bucketing is enough; precise values aren't needed for v1.
 
- Week 3 — demographics. ONS Census 2021 data, table TS021 (ethnicity). Habia's salon registration data — 302 Afro/natural salons of ~35,000 total — can be mapped to LADs to compute a density figure.
 
| **Fallback for postcodes not in the table** If a user enters a postcode not in the lookup (rare but possible — e.g. typos, brand new postcodes), default to UK national average values and flag the result as "based on UK averages — your specific area data isn't in our lookup yet." Do not block the user. |
| --- |
 
## The decision-tree logic spec
 
The tree is a rules-based mapping, expressible as a switch/case or a JSON decision table. For each (symptom × postcode_profile × surface_descriptor) combination, the output is:
 
| **Output field** | **Description** |
| --- | --- |
| most_likely_cause | string — the cause code (e.g. "hard_water_buildup", "protein_overload", "low_porosity_sealing", "traction_alopecia_risk") |
| confidence | enum — "high", "medium", "low" |
| confidence_reason | string — one sentence explaining why this confidence level |
| recommendation_code | string — pointer to the recommendation microcopy (e.g. "REC-chelate-01") |
| next_branch_code | string — pointer to the "if it didn't work" branch |
| medical_exit_fires | boolean — true if the combination triggers a safety exit ramp |
| medical_exit_code | string — pointer to the exit ramp microcopy if firing |
 
The full mapping tables for each symptom are in Section 4 below.
 
# 4. The decision trees — per symptom
 
Each symptom is laid out as: surface descriptors (Screen 3 picks), candidate causes, the rules that map combinations to a most-likely cause, and the confidence calibration.
 
## S1 — "My hair feels dry, no matter what I try"
 
### Candidate causes
 
| **Cause code** | **Plain English** |
| --- | --- |
| hard_water_buildup | Mineral film from hard water is blocking moisture |
| low_porosity_sealed_wrong | Hair is low porosity, products are sitting on top not penetrating |
| protein_overload | Too much protein in routine — hair is brittle, mistaken for dry |
| moisture_overload | Too much moisture, hair is over-conditioned and limp |
| seasonal_humidity_loss | Low ambient humidity is pulling moisture from hair |
 
### Surface descriptors at Screen 3
 
- Coated, like products are sitting on it → high signal for hard_water_buildup OR low_porosity_sealed_wrong
 
- Rough or straw-like → signal for protein_overload OR seasonal_humidity_loss
 
- Limp, weighed down, lifeless → high signal for moisture_overload
 
- Looks dry but feels normal to touch → likely seasonal_humidity_loss
 
- Not near my hair right now → use postcode data only, lower confidence
 
### Rules — how combinations map
 
| **Postcode profile** | **Surface descriptor** | **Resolves to (confidence)** |
| --- | --- | --- |
| water_band = very_hard or extreme | Coated | hard_water_buildup (high) |
| water_band = hard | Coated | hard_water_buildup (medium — confirm with chelating wash) |
| water_band ≤ moderate | Coated | low_porosity_sealed_wrong (medium) |
| Any | Rough or straw-like | protein_overload (medium — confirm by stopping protein for 2 weeks) |
| humidity_band = low | Rough or straw-like | seasonal_humidity_loss (medium, especially Oct-Mar) |
| Any | Limp, weighed down | moisture_overload (medium) |
| humidity_band = low | Looks dry but feels normal | seasonal_humidity_loss (high) |
| Any | Not near my hair | Default to most-likely-by-postcode (low confidence — flag) |
 
## S2 — "My hair isn't growing"
 
### The reframe
 
| **Critical posture** Almost universally, the answer is retention, not growth. Hair grows roughly the same rate for almost everyone. The user's hair is growing; they are losing length to breakage faster than it's growing. The tool's first job for this symptom is to reframe the question — gently — and route them to retention diagnostics. |
| --- |
 
### Candidate causes
 
| **Cause code** | **Plain English** |
| --- | --- |
| mechanical_breakage | Hair breaking from manipulation — combing, styling, friction |
| protein_moisture_imbalance | Hair is over-elastic (moisture overload) or brittle (protein overload), breaking at weak points |
| traction_damage | Tension styles, tight braids, weaves causing breakage at the hairline or where tension is highest |
| chemical_damage_history | Past relaxer, dye, bleach, or heat has weakened the shaft — current breakage is the legacy |
| scalp_or_medical | If shedding from the root (not breakage), routes to scalp/medical exit |
 
### Surface descriptors at Screen 3
 
- I see short broken pieces in my brush / pillow / bath → mechanical_breakage OR protein_moisture_imbalance
 
- I see whole hairs with little white bulbs on the end → scalp_or_medical (MEDICAL EXIT FIRES)
 
- My hairline is thinning or my edges are gone → traction_damage (MEDICAL EXIT also fires — traction alopecia)
 
- My hair just won't get past a certain length → mechanical_breakage at ends
 
- I've used relaxers / heat / dye in the past two years → chemical_damage_history
 
### Rules
 
| **Postcode profile** | **Surface descriptor** | **Resolves to (confidence)** |
| --- | --- | --- |
| Any | Short broken pieces | mechanical_breakage (high) + check protein_moisture_imbalance as secondary |
| Any | Whole hairs with bulbs | scalp_or_medical (MEDICAL EXIT FIRES — high) |
| Any | Hairline thinning | traction_damage (high) + MEDICAL EXIT FIRES (traction alopecia) |
| Any | Won't get past a certain length | mechanical_breakage at ends (high) — likely needs trim + retention work |
| water_band = very_hard or extreme | Won't get past a certain length | hard_water making breakage worse (medium) — chelate AND retention work |
| Any | Relaxers/heat/dye history | chemical_damage_history (high) — needs bond-builder + low-manipulation |
 
## S3 — "My products have stopped working"
 
### Candidate causes
 
| **Cause code** | **Plain English** |
| --- | --- |
| hard_water_buildup | Mineral buildup is now blocking products that previously worked |
| product_buildup | Product/silicone buildup from layering — needs clarifying |
| porosity_shifted | Hair changed (chemical service, damage, age) and products are now wrong for it |
| seasonal_shift | Routine that worked in summer doesn't work in winter (or vice versa) |
| water_change | User moved house or area — new water is different |
 
### Surface descriptors at Screen 3
 
- It feels coated, sticky, or filmy → hard_water_buildup OR product_buildup
 
- Same products, same routine, but it just doesn't work like it used to → porosity_shifted OR water_change
 
- It worked in summer but doesn't work now (or vice versa) → seasonal_shift
 
- I moved house in the last six months → water_change (HIGH SIGNAL)
 
- I dyed or chemically treated my hair recently → porosity_shifted
 
### Rules
 
| **Postcode profile** | **Surface descriptor** | **Resolves to (confidence)** |
| --- | --- | --- |
| water_band = very_hard or extreme | Coated/sticky/filmy | hard_water_buildup (high) |
| Any | Coated/sticky/filmy | product_buildup + check water (medium) |
| Any | Same routine, different result | porosity_shifted (medium) — ask about recent changes |
| humidity_band = low + season is winter | Worked in summer not winter | seasonal_shift to low humidity (high) |
| Any | Moved house recently | water_change (high — compare new vs old postcode hardness) |
| Any | Dye/chemical recently | porosity_shifted (high) |
 
## S4 — "My child's curls — and I have no idea where to start"
 
### The reframe
 
| **Critical posture** Parents in this entry are often overwhelmed and emotionally invested. Many are not the same hair type as their child (mixed-race families, adopted children, etc.) and feel they are getting it wrong. The tool's first move is to lower the temperature: this is more learnable than it feels, and there are a small number of common failure modes. |
| --- |
 
### Candidate causes
 
| **Cause code** | **Plain English** |
| --- | --- |
| under_moisturised | Most common — kids' hair needs more moisture than the parent thinks |
| wrong_products_for_texture | Adult or European-hair products on a child's coily/curly hair |
| over_manipulation | Too much daily styling, harsh brushing, painful detangling |
| scalp_neglect | Wash days too infrequent, scalp not being addressed |
| medical_pattern | Symptoms warrant a medical check — patches, sores, severe scalp issues |
 
### Surface descriptors at Screen 3
 
- Hair is dry, tangly, painful to comb → under_moisturised + over_manipulation
 
- I'm using normal kids' shampoo/conditioner / what I use → wrong_products_for_texture
 
- Detangling makes them cry → over_manipulation (technique issue)
 
- Hair is breaking off in patches → MEDICAL EXIT FIRES + check tight styling
 
- Scalp has flakes, sores, or smells → MEDICAL EXIT FIRES (scalp_neglect or condition)
 
### Rules
 
| **Postcode profile** | **Surface descriptor** | **Resolves to (confidence)** |
| --- | --- | --- |
| Any | Dry, tangly, painful to comb | under_moisturised + over_manipulation (high — most common parent issue) |
| water_band = hard+ | Dry, tangly, painful | hard water worsening under_moisturised (high) |
| Any | Using normal kids' products | wrong_products_for_texture (high) |
| Any | Detangling makes them cry | over_manipulation/technique (high) |
| Any | Patches of breakage | MEDICAL EXIT (high) + investigate tight styling |
| Any | Scalp flakes/sores/smell | MEDICAL EXIT (high) — needs GP |
 
## S5 — "My scalp is itchy, flaky, or sore"
 
### Critical posture
 
| **Scalp = most likely to need a clinician** S5 is the symptom most likely to fire a medical exit. The tool's job here is mostly to triage which symptoms are routine (dry scalp, mild flakes from infrequent washing) versus which need a GP (sores, painful patches, hair loss localised to scalp issues, suspected fungal or seborrhoeic dermatitis, CCCA pattern). When in doubt, exit fires. |
| --- |
 
### Candidate causes
 
| **Cause code** | **Plain English** |
| --- | --- |
| dry_scalp_routine | Routine issue — infrequent washing, product buildup, or low-humidity dryness |
| product_irritation | An ingredient in the routine is irritating the scalp |
| seborrhoeic_dermatitis_pattern | Pattern consistent with seb derm — MEDICAL EXIT |
| ccca_pattern | Hair loss + scalp symptoms at the crown — MEDICAL EXIT urgent |
| folliculitis_or_infection | Sores, pus, or signs of infection — MEDICAL EXIT urgent |
 
### Surface descriptors at Screen 3
 
- Itchy with mild flakes, no pain, no patches → dry_scalp_routine
 
- Started after I switched products → product_irritation
 
- Greasy patches with yellow scales, especially along the hairline → seborrhoeic_dermatitis_pattern (MEDICAL EXIT FIRES)
 
- I'm losing hair at the crown / top → ccca_pattern (MEDICAL EXIT FIRES — urgent)
 
- Sores, scabs, pus, or painful spots → folliculitis_or_infection (MEDICAL EXIT FIRES — urgent)
 
### Rules
 
| **Postcode profile** | **Surface descriptor** | **Resolves to (confidence)** |
| --- | --- | --- |
| Any | Itchy, mild flakes | dry_scalp_routine (high) |
| Any | Started after new product | product_irritation (high) |
| Any | Greasy patches, yellow scales | seborrhoeic_dermatitis_pattern (MEDICAL EXIT) |
| Any | Hair loss at crown | ccca_pattern (MEDICAL EXIT — URGENT) |
| Any | Sores or pus | folliculitis_or_infection (MEDICAL EXIT — URGENT) |
 
# 5. Microcopy library
 
Every text element in the tool, written in the locked voice (confidence-graded, specific about action, hedged about claim, plain-spoken British English). Each item has a code that Claude Code can reference in component templates.
 
Voice rules applied throughout:
 
- Specific about action, hedged about claim
 
- Confidence is stated explicitly, not implied
 
- No "honest," "trusted," "ultimate" self-claims
 
- No "dive in," "game-changer," enthusiasm padding
 
- British English: chelating, not chelating; programme, not program; etc.
 
- Sentence case throughout, including buttons
 
## Screen 1 — Entry
 
| **S1-HEADER** What's bothering you? |
| --- |
 
| **S1-SUBHEAD** Pick the one that sounds closest. |
| --- |
 
| **S1-PICK-DRY** My hair feels dry, no matter what I try |
| --- |
 
| **S1-PICK-GROWTH** My hair isn't growing |
| --- |
 
| **S1-PICK-PRODUCTS** My products have stopped working |
| --- |
 
| **S1-PICK-PARENT** My child's curls — and I have no idea where to start |
| --- |
 
| **S1-PICK-SCALP** My scalp is itchy, flaky, or sore |
| --- |
 
| **S1-NOT-SURE** Not sure? Tell us what you're noticing → |
| --- |
 
## Screen 2 — Postcode and first context
 
| **S2-HEADER** Your postcode |
| --- |
 
| **S2-SUBHEAD** So we can factor in your water and climate. |
| --- |
 
| **S2-INPUT-PLACEHOLDER** e.g. SE18 4AB |
| --- |
 
| **S2-RESULT-HEADER** The first piece of your picture |
| --- |
 
### S2 result body — by water band
 
| **S2-WATER-EXTREME** Your area has extremely hard water — {value} mg/L, near the top of the UK range. For hard-water postcodes like yours and a complaint of {symptom_summary}, water is the first thing we'd check. |
| --- |
 
| **S2-WATER-VERY-HARD** Your area has very hard water — {value} mg/L, in the top {percentile}% of the UK range. For postcodes like yours and a complaint of {symptom_summary}, water is the first thing we'd check. |
| --- |
 
| **S2-WATER-HARD** Your area has hard water — {value} mg/L. That's enough to be a factor for {symptom_summary}, though usually not the only one. |
| --- |
 
| **S2-WATER-MODERATE** Your area has moderate water — {value} mg/L. Water is probably not your main factor for {symptom_summary}. We'll look at other causes first. |
| --- |
 
| **S2-WATER-SOFT** Your area has soft water — {value} mg/L. Water is almost certainly not your issue for {symptom_summary}. Good news: that takes a common cause off the table. |
| --- |
 
### S2 confidence line — appended to result
 
| **S2-CONF-HIGH** Confidence: high. Hard water leaves a mineral film that blocks moisture from getting into your hair. This is well-established. |
| --- |
 
| **S2-CONF-MED** Confidence: medium. Your water is in the range where it can be a factor — but not always the main one. |
| --- |
 
| **S2-CARRY-ON** That's already enough to start with. Or carry on to narrow it further. |
| --- |
 
| **S2-CARRY-ON-LINK** Carry on → |
| --- |
 
## Screen 3 — Narrowing
 
| **S3-HEADER** How does your hair actually feel? |
| --- |
 
| **S3-SUBHEAD** No need to know your porosity or type. Just describe what you feel. |
| --- |
 
### S3 picks — for S1 (dry)
 
| **S3-DRY-COATED** Coated, like products are sitting on it |
| --- |
 
| **S3-DRY-ROUGH** Rough or straw-like |
| --- |
 
| **S3-DRY-LIMP** Limp, weighed down, lifeless |
| --- |
 
| **S3-DRY-LOOKSDRY** Looks dry but feels normal to touch |
| --- |
 
| **S3-DRY-NOTNEAR** I'm not near my hair right now |
| --- |
 
| **S3-NOTNEAR-NOTE** "I'm not near my hair" is a real option. We'll work with what we have. |
| --- |
 
### S3 picks — for S2 (growth)
 
| **S3-GROWTH-PIECES** I see short broken pieces in my brush, pillow, or bath |
| --- |
 
| **S3-GROWTH-BULBS** I see whole hairs with little white bulbs on the end |
| --- |
 
| **S3-GROWTH-HAIRLINE** My hairline is thinning or my edges are gone |
| --- |
 
| **S3-GROWTH-LENGTH** My hair just won't get past a certain length |
| --- |
 
| **S3-GROWTH-HISTORY** I've used relaxers, heat, or dye in the past two years |
| --- |
 
### S3 picks — for S3 (products)
 
| **S3-PROD-COATED** It feels coated, sticky, or filmy |
| --- |
 
| **S3-PROD-SAME** Same products, same routine, but it doesn't work like it used to |
| --- |
 
| **S3-PROD-SEASON** It worked in summer but doesn't work now (or vice versa) |
| --- |
 
| **S3-PROD-MOVED** I moved house in the last six months |
| --- |
 
| **S3-PROD-CHEMICAL** I dyed or chemically treated my hair recently |
| --- |
 
### S3 picks — for S4 (parent)
 
| **S3-PARENT-DRY** Hair is dry, tangly, painful to comb |
| --- |
 
| **S3-PARENT-PRODUCTS** I'm using normal kids' products, or what I use |
| --- |
 
| **S3-PARENT-CRY** Detangling makes them cry |
| --- |
 
| **S3-PARENT-PATCHES** Hair is breaking off in patches |
| --- |
 
| **S3-PARENT-SCALP** Scalp has flakes, sores, or smells |
| --- |
 
### S3 picks — for S5 (scalp)
 
| **S3-SCALP-ITCHY** Itchy with mild flakes, no pain, no patches |
| --- |
 
| **S3-SCALP-NEW** Started after I switched products |
| --- |
 
| **S3-SCALP-GREASY** Greasy patches with yellow scales, especially along the hairline |
| --- |
 
| **S3-SCALP-CROWN** I'm losing hair at the crown or top of my head |
| --- |
 
| **S3-SCALP-SORES** Sores, scabs, pus, or painful spots |
| --- |
 
## Screen 4 — The starting point
 
| **S4-HEADER** Here's where most people in your situation start |
| --- |
 
### Cause copy — one per cause code
 
| **CAUSE-hard_water_buildup** Mineral buildup from your hard water. Your hair feels coated because something is coating it — a calcium and magnesium film that ordinary shampoo doesn't remove. |
| --- |
 
| **CAUSE-low_porosity_sealed_wrong** Low porosity. Your hair's cuticles lie flat — products sit on top instead of getting in. Heavy products and cold application make it worse. |
| --- |
 
| **CAUSE-protein_overload** Too much protein. Many curl products contain protein, and stacking them makes hair stiff, dry-feeling, and prone to snap rather than stretch. |
| --- |
 
| **CAUSE-moisture_overload** Moisture overload. Hair that's been deep conditioned heavily and frequently can become limp and weak. The fix is counter-intuitive — it needs protein, not more conditioner. |
| --- |
 
| **CAUSE-seasonal_humidity_loss** Low humidity. UK winters and central heating drop indoor humidity well below what your hair likes. The same routine that worked in May won't work in December. |
| --- |
 
| **CAUSE-mechanical_breakage** Mechanical breakage. Your hair is growing — but you're losing it to friction, combing, and styling faster than it grows. This is the retention problem, not a growth problem. |
| --- |
 
| **CAUSE-protein_moisture_imbalance** Protein-moisture balance is off. Healthy hair stretches and bounces back. Yours is either snapping (too much protein) or over-stretching and mushy (too much moisture). |
| --- |
 
| **CAUSE-traction_damage** Tension damage. Tight braids, weaves, or pulled-back styles have caused breakage along the hairline. This is the early stage of traction alopecia — usually reversible if you catch it now. |
| --- |
 
| **CAUSE-chemical_damage_history** Chemical damage history. Past relaxer, dye, bleach, or heat has weakened the hair shaft. Current breakage is the legacy of older damage, even if you've stopped now. |
| --- |
 
| **CAUSE-product_buildup** Product buildup. Months of layering oils, butters, leave-ins, and stylers leaves a film. Even good products build up over time. |
| --- |
 
| **CAUSE-porosity_shifted** Your hair has changed. Chemical services, damage, hormonal shifts, even age — they change how your hair behaves. Products that worked before may now be wrong. |
| --- |
 
| **CAUSE-water_change** Your water changed. Moving house can switch you from soft to very hard water (or vice versa). Many "my products stopped working" stories are actually "my water changed" stories. |
| --- |
 
| **CAUSE-under_moisturised** Most likely: under-moisturised. Children's coily and curly hair needs more moisture and more frequent application than most parents realise — and probably more than your own hair needs. |
| --- |
 
| **CAUSE-wrong_products_for_texture** Wrong products. Standard kids' shampoos and adult European-hair products strip and dry textured hair. The product range matters. |
| --- |
 
| **CAUSE-over_manipulation** Too much handling. Daily combing, harsh detangling, tight styles — they break off more hair than the scalp can replace. Less is genuinely more. |
| --- |
 
| **CAUSE-dry_scalp_routine** Routine issue. Likely dry scalp from infrequent washing, product buildup at the roots, or low-humidity winter dryness. |
| --- |
 
| **CAUSE-product_irritation** An ingredient is irritating you. Common culprits: fragrance, sulphates, certain preservatives. Trace it to what changed. |
| --- |
 
### Confidence calibration copy
 
| **CONF-HIGH** Confidence: high. The combination of your inputs points here strongly. |
| --- |
 
| **CONF-MED** Confidence: medium. This is the most likely cause, but there are other plausible ones. The first try will tell us. |
| --- |
 
| **CONF-LOW** Confidence: low. We have less to go on than usual — the recommendation below is a safe first try, but treat it as the start of figuring this out, not the answer. |
| --- |
 
### Recommendation microcopy — one per cause
 
| **REC-hard_water_buildup** This weekend: Use a chelating shampoo, just once. (Around £8 at Boots — Malibu C Hard Water Wellness, Kinky-Curly Come Clean, or similar.) Skip your leave-in for that wash only. Follow with your normal conditioner. — How you'll know: Within two wash days, hair should feel lighter. Products should start "working" again. — If nothing changed: Hard water wasn't your issue. The next thing to look at is your porosity behaviour and product layering. |
| --- |
 
| **REC-low_porosity_sealed_wrong** This weekend: Try the LCO method (Liquid, then Cream, then Oil — not the other way round) on damp, warm hair. Apply small amounts. Use a leave-in spray instead of a heavy butter. — How you'll know: Within one wash day, hair should feel less coated and more flexible. — If nothing changed: It may be product buildup rather than low porosity. Try a clarifying wash next. |
| --- |
 
| **REC-protein_overload** This weekend: Stop all protein products for two weeks. Use only moisture-based conditioners (no "strengthening," no keratin, no rice, no wheat, no hydrolyzed anything). Deep condition with a moisture-rich treatment. — How you'll know: Within two wash days, hair should feel softer, more elastic, less brittle. — If nothing changed: It may be moisture overload instead. Add one protein treatment back in and see. |
| --- |
 
| **REC-moisture_overload** This weekend: Use a light protein treatment (look for hydrolysed wheat, rice, or keratin in the ingredients). Apply once. Skip your usual deep conditioner that wash. — How you'll know: Within one wash day, hair should feel firmer and bounce back better. — If nothing changed: Investigate buildup or porosity issues next. |
| --- |
 
| **REC-seasonal_humidity_loss** This weekend: Add a humectant (glycerin, honey, aloe) to your routine — but only if indoor humidity is above 40%. Below that, humectants pull moisture FROM your hair, not to it. — How you'll know: Within one wash day, hair should feel less brittle. — Year-round: Consider a small humidifier in your bedroom (around £30, makes a real difference). |
| --- |
 
| **REC-mechanical_breakage** This week: Cut comb use by 80%. Detangle with fingers and conditioner on wet hair only. Sleep on a satin pillowcase or in a satin bonnet. Stop any tight styles for two weeks. — How you'll know: Within two weeks, you should see fewer short broken pieces in your brush, pillow, and bath. — If nothing changed: Move to the protein-moisture balance check. |
| --- |
 
| **REC-protein_moisture_imbalance** This weekend: Do the stretch test. Pull a single damp strand gently. Snaps quickly = protein overload, treat with moisture. Stretches and goes mushy = moisture overload, treat with light protein. Stretches and bounces back = you're balanced, look elsewhere. — How you'll know: The strand tells you in 30 seconds. — Then: Treat for the imbalance you found. |
| --- |
 
| **REC-traction_damage** This week: Stop all tight braids, weaves, and pulled-back styles. Switch to loose styles or wear hair down. See a GP — traction alopecia caught early is usually reversible. — How you'll know: Edge regrowth typically takes 6-12 weeks. The GP will track it. — Important: This is also in the medical track. Don't skip the GP appointment. |
| --- |
 
| **REC-chemical_damage_history** This weekend: Add a bond builder (Olaplex No. 3, K18, or Epres) to your routine — once a week, before shampoo. These rebuild the broken bonds chemical services left. — Note: They're not protein treatments, so they're safe on protein-sensitive hair. — How you'll know: Within four weeks, breakage should noticeably decrease. — Bigger picture: Damaged hair has to grow out. Bond builders slow the loss; they don't undo it. |
| --- |
 
| **REC-product_buildup** This weekend: Use a clarifying shampoo (not a chelating one — different job). Once. Then resume your normal routine but cut the number of layered products in half. — How you'll know: Within one wash day, hair should feel cleaner and respond to products again. |
| --- |
 
| **REC-porosity_shifted** This weekend: Reassess. The products you used before may now be too heavy or too light. Start with the simplest possible routine: gentle shampoo, lightweight conditioner, a single leave-in, no oils. — How you'll know: Build back up one product at a time over four weeks. You'll find what works for your current hair, not your old hair. |
| --- |
 
| **REC-water_change** This weekend: Compare your new postcode's water hardness to your old one (we can check both). If you've moved from soft to hard water, the fix is the chelating shampoo route. If from hard to soft, your routine is probably over-conditioning your hair now. — How you'll know: One wash day with the right adjustment will tell you. |
| --- |
 
| **REC-under_moisturised** This week: Add a daily light moisture spray (water + a little leave-in conditioner in a spray bottle works). Re-moisturise hair every morning and before bed. Switch wash day from once a fortnight to once a week. — How you'll know: Within a week, hair should feel softer and detangle more easily. — Long-term: A kids' co-wash routine works well for most coily children. |
| --- |
 
| **REC-wrong_products_for_texture** This week: Switch to products formulated for coily and curly hair. Affordable starter set at Boots: a sulphate-free kids' shampoo (Cantu Care for Kids or Mixed Chicks Kids), a light leave-in conditioner, a hair butter. — How you'll know: First wash day with the new products should feel meaningfully different. |
| --- |
 
| **REC-over_manipulation** This week: Cut daily styling. Move to a once-a-week wash and style routine. Refresh with water and a leave-in in between, but don't re-style. Use finger detangling on wet, conditioned hair only. — How you'll know: Within two weeks, fewer broken pieces, less tangling, faster wash days. — Detangling without crying: Section in four, work from ends up, drench in conditioner first. |
| --- |
 
| **REC-dry_scalp_routine** This week: Wash every 5-7 days (more often than most curly routines suggest). Use a gentle, non-stripping cleanser. Apply a small amount of oil to the scalp once mid-week, not to the lengths. — How you'll know: Itching and flaking should reduce within two wash cycles. — If nothing changed: It may be a scalp condition rather than a routine issue. See a GP. |
| --- |
 
| **REC-product_irritation** This week: Stop using the most recently added product. If symptoms improve in 3-5 days, that's the culprit. If you can't tell which is new, simplify radically — shampoo, conditioner, water, nothing else — for a week. — How you'll know: Symptoms either resolve (it was a product) or persist (something else is going on, see a GP). |
| --- |
 
### "Did that not work?" branching copy
 
| **BRANCH-INTRO** Here's what to look at next if the first thing didn't move things. |
| --- |
 
| **BRANCH-from-hard-water** If chelating didn't change anything: Hard water wasn't your issue. Most likely next: low porosity (products sit on top) or protein-moisture imbalance. The stretch test will tell you which. |
| --- |
 
| **BRANCH-from-protein** If stopping protein didn't help: It's the opposite problem. You're likely moisture overloaded. Add a light protein treatment and see what changes. |
| --- |
 
| **BRANCH-from-mechanical** If reducing manipulation didn't reduce breakage: The breakage may be from chemical damage history rather than current technique. Look at a bond builder. |
| --- |
 
### Profile save copy
 
| **PROFILE-HEADER** Save your profile |
| --- |
 
| **PROFILE-BENEFIT-1** Pick up where you left off. |
| --- |
 
| **PROFILE-BENEFIT-2** Get more on what you're working on. |
| --- |
 
| **PROFILE-BENEFIT-3** The tool gets sharper as we know more. |
| --- |
 
| **PROFILE-INPUT-PLACEHOLDER** your@email.com |
| --- |
 
| **PROFILE-CTA** Save profile |
| --- |
 
| **PROFILE-FOOTNOTE** One follow-up email in 14 days. No newsletter. Unsubscribe in one click. |
| --- |
 
## Medical exit ramps
 
| **EXIT-HEADER** A note before the hair advice |
| --- |
 
| **EXIT-INTRO-shedding** Some of what you described — whole hairs with little white bulbs at the root — points to shedding from the root, not breakage. That's worth getting checked. By a real person, not a website. |
| --- |
 
| **EXIT-INTRO-traction** Some of what you described — hairline thinning or lost edges — is early-stage traction alopecia. It's reversible if caught now, harder to reverse later. The next step is a GP. |
| --- |
 
| **EXIT-INTRO-ccca** Some of what you described — hair loss at the crown or top of the head — is a pattern worth getting checked promptly. CCCA, the most common scarring hair loss in Black women, often starts this way. Early treatment matters. |
| --- |
 
| **EXIT-INTRO-seb-derm** Some of what you described — greasy patches with yellow scales — is consistent with seborrhoeic dermatitis. It's treatable, but not with hair products. You need a GP. |
| --- |
 
| **EXIT-INTRO-infection** Some of what you described — sores, scabs, pus — is consistent with folliculitis or infection. Please see a GP this week, not next month. |
| --- |
 
| **EXIT-NEXT-STEP** The next step is a clinician. Start with your GP, then a trichologist or dermatologist if they refer you. The Institute of Trichologists has a directory of PSA-accredited practitioners. |
| --- |
 
| **EXIT-PARALLEL** Nothing in our usual advice will make this worse. While you wait for an appointment, here's what's safe to keep doing. |
| --- |
 
| **EXIT-DUAL-TRACK** The medical track and the hair track run together. Keep doing both. |
| --- |
 
| **EXIT-DIRECTORY-LINK** Institute of Trichologists directory → |
| --- |
 
# 6. Build sequence
 
Build in three phases. Each phase is shippable on its own. Do not move to the next phase until the current one is built, tested, and confirmed.
 
## Phase A — Data layer and routing logic (Weeks 1-2)
 
- Build the postcode lookup table at /src/data/uk_postcode_profile.json with the schema in Section 3. Bootstrap with the 50 largest UK postcode districts by population; expand to full coverage in Phase C.
 
- Build the decision-tree resolver as a pure function at /src/lib/diagnostic.ts. Takes (symptom_code, postcode_profile, surface_descriptor) and returns (cause_code, confidence, confidence_reason, recommendation_code, next_branch_code, medical_exit_fires, medical_exit_code).
 
- Build the microcopy library at /src/data/diagnostic_copy.json — each entry keyed by code (e.g. "S1-HEADER", "REC-hard_water_buildup").
 
- Write tests for the resolver covering at least one path through each of the five symptoms, including the medical exit firings.
 
| **Phase A acceptance** Resolver function is fully tested with the v1 microcopy library. Postcode lookup covers the 50 largest districts. No UI yet — just the engine. Hand-test by passing inputs and verifying outputs. |
| --- |
 
## Phase B — UI components and screens (Weeks 3-4)
 
- Build Screen 1 (entry symptom picker) as an Astro component using the locked tokens. Mobile-first. Picks render as plain editorial entries with hairline rules, not branded buttons.
 
- Build Screen 2 (postcode input + first-context display). Postcode input validates basic UK format. Result block shows water band copy from the library, with confidence line.
 
- Build Screen 3 (surface descriptor picker, varies by symptom).
 
- Build Screen 4 (the recommendation card with cause, confidence, action, success marker, next branch). Includes the profile save form below.
 
- Build the medical exit ramp variant — fires when resolver returns medical_exit_fires=true. Renders parallel to (not instead of) the hair advice.
 
- Wire silent exits — every screen ends in a natural stop. No "want to continue?" prompts. The next-step affordance is a quiet "→" link, not a button.
 
- Implement URL-based state — every screen state is encoded in the URL so users can bookmark and return.
 
| **Phase B acceptance** Full journey is walkable end-to-end for all five symptoms. All microcopy renders from the library, not hardcoded. Resolver outputs map correctly to UI display. Mobile rendering tested at 375px and 414px. Production build (pnpm build && pnpm preview) is clean. |
| --- |
 
## Phase C — Profile save and follow-up (Weeks 4-6)
 
- Build the profile save mechanism. v1: stateless — the user's full session is encoded in their saved URL, plus email captured for the follow-up. No login. No account.
 
- Wire email capture to the existing email service. Tag captures with symptom_code, cause_code, postcode_district for cohorting.
 
- Build the 14-day follow-up email template. Asks one question: "did this help?" Two-button reply (yes/no). The "no" reply triggers a second email with the next branch.
 
- Expand postcode coverage to all UK postcode districts (~3000).
 
- Add the data refresh process — a documented procedure for updating water, humidity, and demographic data annually.
 
| **Phase C acceptance** Profile save works. Follow-up email triggers at 14 days. Postcode coverage is national. Data refresh process is documented in /docs/data-refresh.md. |
| --- |
 
# 7. Acceptance criteria — v1 overall
 
V1 ships when ALL of the following are true:
 
- All five entry symptoms route correctly through the tree to a most-likely cause and recommendation
 
- Postcode lookup covers all UK postcode districts (~3000)
 
- Every cause has microcopy, confidence calibration, action, success marker, and next-branch
 
- Medical exit ramps fire correctly for all five trigger combinations and render in parallel to hair advice (not replacing it)
 
- Profile save works; 14-day follow-up email triggers
 
- Mobile rendering works at 375px, 414px, and 768px
 
- Page weight under 200KB transferred for any single tool screen
 
- Core Web Vitals green on the tool's primary entry URL
 
- All microcopy is in the locked voice — no banned words ("honest", "trusted", "ultimate", "comprehensive", "definitive")
 
- Resolver is fully tested with at least 30 test cases across the five symptoms
 
- URL-based state — every screen is bookmarkable and shareable
 
- No LLM calls anywhere in the user-facing flow
 
- Accessibility floor: keyboard navigation, focus states, semantic HTML, meaningful alt text
 
## What v1 explicitly does NOT include
 
- Affiliate product links inside the tool (the tool routes to product-recommendation articles, which carry the affiliate links)
 
- Sophisticated profile machine learning or recommendation personalisation beyond "resume from where you left off"
 
- User-generated content (ratings, comments, reviews)
 
- Mobile native app
 
- Multi-language support (English UK only)
 
- Integration with social login
 
## Post-v1 — what comes after
 
Once v1 is shipped and shows real usage, the next priorities are:
 
- Tier 3 data — instrumenting tool usage so the dataset compounds. Aggregate (anonymised) reporting on which causes resolve most for which postcodes.
 
- The "not sure" entry — a softer description-based intake for users who don't pick a primary symptom.
 
- Expanding to additional surface descriptors and edge causes within each symptom (e.g. hormonal shifts, postpartum hair loss, age-related changes).
 
- Optional advanced screen for engaged users — "more on what's happening," linking to the relevant deep articles (cronograma, the porosity debunk, hard water explainer).
 
- Affiliate-aware product recommendations — but only after the editorial verdict-never-bent rule is enshrined operationally.
 
# 8. Standing rules for the build
 
- Locked specs win. Once this document is approved, execute. Do not seek approval on each step.
 
- Verify-claims rule still applies. Do not claim a feature works without confirming in actual production build.
 
- Phase gate: pnpm build && pnpm preview must pass cleanly before moving to the next phase.
 
- Microcopy comes from the library file. Do not hardcode any user-facing text in components. If a string is needed that isn't in the library, surface it as a written question.
 
- Confidence-grading is structural. Every recommendation rendered to the user MUST display its confidence line. Never silently drop it.
 
- No LLM in user-facing flow. Production tools (drafting, sense-checking) are fine for the developer, never in runtime.
 
- Banned words apply in all microcopy: "honest," "trusted," "independent" (as a self-claim), "comprehensive," "definitive," "expert," "genuine."
 
- British English throughout.
 
- Sentence case for everything including buttons.
 
- Mobile-first. Design and review on mobile viewports first; desktop should not have functionality mobile lacks.
 
*— End of Implementation Handover —*