# Cognitive Ergonomics

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/cognitive-ergonomics/
**Part of:** [Saranraj Ramachandran — Industrial Engineering Portfolio](https://saransthinking.github.io/saranraj-portfolio/)

Mental workload, decision-making, and human–system interaction — the invisible half of ergonomics. Where
physical ergonomics asks "does this posture hurt the body," cognitive ergonomics asks "does this task overload
the mind." These tools implement the standard measures used to quantify mental workload, interface response
time, and detection performance in industrial and control-room settings.

## Tools

### NASA-TLX Workload Estimator
Raw TLX (unweighted average) across the six standard subscales — Mental Demand, Physical Demand, Temporal
Demand, Performance, Effort, Frustration — a fast, validated way to quantify perceived task workload.

- **Output:** Score bucketed into Low / Moderate / High / Very High workload.

### Fitts's Law Movement Time
Predicts time to reach a target (control, button, component bin) from distance and target width — used for
control-panel and workstation layout.

- **Formula:** `ID = log2(2D/W)` (Index of Difficulty); `MT = a + b × ID` using typical empirical constants
  (a=0.1s, b=0.2s/bit).

### Signal Detection (d′ / Criterion)
Separates true detection sensitivity from response bias in inspection or monitoring tasks — hit rate alone can
be misleading.

- **Formula:** `d′ = z(Hit Rate) − z(False Alarm Rate)`; `criterion c = −0.5 × (z(Hit) + z(FA))`, using an
  inverse-normal-CDF (probit) approximation.

## Applied Focus

No dedicated cognitive-ergonomics publication exists on the CV yet, so this domain is framed around teaching
and cross-domain application rather than a fabricated case study:

- **Human–System Interaction in Operations Courses** — mental workload and interface-design principles built
  into control-panel and dashboard case studies for UG/PG Operations and Business Analytics students.
- **Workload as a Hidden Variable in Ergonomic Modelling** — in the [Ergonomics](../ergonomics/) domain's
  ISM/SEM and ANP-DEMATEL studies, cognitive load and decision fatigue are treated as latent factors alongside
  posture and force.

## Files

- `index.html` — page markup
- Shared assets: `../../css/style.css`, `../../js/cognitive-tools.js`

## Stack

HTML5, vanilla JavaScript (ES6) — includes a self-contained inverse-normal-CDF approximation (Acklam's
rational approximation) for the Signal Detection tool. No build step, no dependencies.
