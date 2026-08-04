# Lean Six Sigma

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/lean-six-sigma/
**Part of:** [Saranraj Ramachandran — Industrial Engineering Portfolio](https://saransthinking.github.io/saranraj-portfolio/)

Green Belt certified. DMAIC-driven process improvement and waste elimination. Beyond running DMAIC projects,
this domain includes research into why Lean Six Sigma adoption actually fails in small-scale industries — the
barriers matter as much as the toolkit.

## Tools

### FMEA Risk Priority Number
`RPN = Severity × Occurrence × Detection` (1–10 each) — ranks which failure modes to fix first.

- **Tiers:** ≥200 Critical, ≥100 High priority, ≥50 Moderate priority, else Low priority.

### Takt Time Calculator
`Takt Time = Available Time per Shift ÷ Customer Demand per Shift` — the rate at which you must produce to
match customer demand.

### 5S Audit Scorecard
Rates each of the five S's (Sort, Set in Order, Shine, Standardize, Sustain) 0–5 for a quick
workplace-organization health check, scored as a percentage of 25.

## DMAIC Walkthrough

**Engine Assembly Line Productivity**, using the Maynard Operation Sequence Technique (MOST):

1. **Define** — cycle time imbalance across stations flagged as the core productivity constraint.
2. **Measure** — station-wise cycle times decomposed into elemental motions using MOST.
3. **Analyze** — line-balancing analysis identified bottleneck stations and non-value-adding motion sequences.
4. **Improve** — work elements re-sequenced using MOST-derived standard times to balance the line to takt time.
5. **Control** — revised SOPs and station standard times documented for sustained line balance.

See [Work System Design](../work-system-design/) for the line-balancing calculator behind steps 3–4.

## Case Study

**Exploration of Barriers on Implementation of Lean Six Sigma in Small Scale Industries** (ICAIEA 2022, CEG
Anna University) — identifies and structures the organizational, financial, and cultural barriers that stop
small-scale industries from successfully adopting Lean Six Sigma.

## Files

- `index.html` — page markup
- Shared assets: `../../css/style.css`, `../../js/lss-tools.js`

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox — no build step, no dependencies.
