# Ergonomics

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/ergonomics/
**Part of:** [Saranraj Ramachandran — Industrial Engineering Portfolio](https://saransthinking.github.io/saranraj-portfolio/)

Human factors, posture, and workload assessment — turning physical and cognitive strain into measurable,
fixable risk. This is the domain where the portfolio's research concentration sits most heavily: ergonomic
variable modelling, workplace risk prioritization, and productivity-linked ergonomic assessment across IT,
automobile, and manufacturing settings.

## Tools

### RULA / REBA Posture Risk Screener
Simplified additive scoring inspired by RULA (Rapid Upper Limb Assessment) and REBA (Rapid Entire Body
Assessment) worksheets. Toggle between upper-limb-only screening (desk work, assembly) and whole-body
screening (lifting, material handling).

- **Method:** Body-region posture scores (upper arm, lower arm, wrist, neck, trunk, legs) plus muscle-use and
  force/load modifiers, summed into an action level (1–4 for RULA, negligible–very-high for REBA).
- **Note:** Educational simplified scoring, not the official RULA/REBA lookup tables — use the full worksheets
  for certified workplace assessments.

### NIOSH Lifting Equation
Computes the Recommended Weight Limit (RWL) and Lifting Index (LI) for a manual lifting task using the 1994
NIOSH revised lifting equation.

- **Formula:** `RWL = LC × HM × VM × DM × AM × FM × CM` where LC=23kg and HM/VM/DM/AM/FM/CM are the horizontal,
  vertical, distance, asymmetry, frequency, and coupling multipliers.
- **Output:** `LI = Load ÷ RWL` — LI ≤ 1 is low risk, 1–3 is moderate (redesign recommended), > 3 is high risk.

### Anthropometric Workstation Sizing
Percentage-of-stature method for quick workstation dimension guidance based on worker height and task type
(standing/sitting, precision/light/heavy work).

## Case Studies

- **Modelling & Analysis of Ergonomic Variables in the IT Industry** (ICBAI 2019, IISc Bangalore) — ISM and SEM
  used to map how ergonomic variables in IT workplaces relate to and influence one another.
- **Quantifying & Prioritizing Ergonomic Measures in an Automobile Industry** (ICAIEA 2022, CEG Anna University)
  — ANP and DEMATEL used to rank candidate ergonomic interventions on an automobile shop floor by impact and
  interdependency.
- **Ergonomic Effect on Manufacturing Industries' Productivity — A Review** (journal, communicated) — literature
  review linking ergonomic risk factors to measurable productivity loss.

## Files

- `index.html` — page markup
- Shared assets: `../../css/style.css`, `../../js/ergonomics-tools.js`

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox — no build step, no dependencies.
