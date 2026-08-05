# Personal Decision Making (MCDM)

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/personal-decision-mcdm/
**Part of:** [Learn by Doing](https://saransthinking.github.io/saranraj-portfolio/personal-projects.html) - Saranraj Ramachandran's portfolio

A Weighted Sum Model - the same multi-criteria decision-making technique used to prioritize supplier or vendor
choices - pointed at your next job offer, apartment, or grad school pick. Big personal decisions rarely fail
from lack of options; they fail from comparing options on gut feel instead of the criteria that actually
matter, weighted honestly.

## The Problem

When a decision has several options and several things that matter - salary vs. growth vs. location, or rent
vs. commute vs. space - most people compare them in their head, where one loud criterion (usually the most
recent conversation) quietly dominates the rest. MCDM techniques make every criterion's influence explicit and
auditable.

## Methodology - Weighted Sum Model (Simple Additive Weighting)

- **Criteria Weights** - each criterion gets a weight reflecting importance; weights are normalized to sum to
  100% regardless of the raw numbers entered.
- **Option Ratings** - each option rated 1–10 against every criterion, criterion-by-criterion.
- **Weighted Sum** - `Score = Σ(weight_i × rating_i)`. Every criterion contributes exactly its declared weight.
- **Ranking** - options ranked by total weighted score, with the weights visible so you can see why one option
  won.

## What's in the Build

- Any decision, any criteria - type your own criteria, weights, and options.
- Auto-generated rating matrix - enter criteria and options once; the tool builds the ratings grid.
- Weight auto-normalization - weights don't need to sum to exactly 100.
- Visual ranked bars - final scores render as ranked horizontal bars.
- Sample decision - a "choosing a job offer" example with criteria, weights, and ratings pre-filled.
- Decision history - past decisions and winners logged locally.

## Files

- `index.html` - page markup and the live tool's UI
- `../../js/personal-decision-mcdm.js` - weighted-sum computation, dynamic rating-matrix generation, ranking
  visualization
- Persistence: browser `localStorage` (`pmcdm_log_v1`, `pmcdm_last_result_v1`)

## Stack

HTML5, vanilla JavaScript (ES6), dynamic DOM generation, Web Storage API - no build step, no dependencies.
