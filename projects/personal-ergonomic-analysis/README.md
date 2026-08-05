# Personal Ergonomic Analysis

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/personal-ergonomic-analysis/
**Part of:** [Learn by Doing](https://saransthinking.github.io/saranraj-portfolio/personal-projects.html) - Saranraj Ramachandran's portfolio

An integrated audit of your own desk setup - combining anthropometric fit and posture risk into one Workspace
Ergonomic Score. The [Ergonomics domain](../ergonomics/) has these techniques as separate calculators; this
project fuses them into a single personal report with specific, prioritized fixes.

## The Problem

Most home and hostel desks are whatever came with the room - not sized to the person using them. A mismatch of
even a few centimeters in desk or chair height compounds into wrist, neck, and shoulder strain over months,
invisibly, because nobody checks the numbers against a real formula.

## Methodology

- **Anthropometric Fit** - recommended desk (`0.40 × stature`), chair (`0.25 × stature`), and monitor
  (`0.75 × stature`) heights from percentage-of-stature ratios, compared against actual measurements. A
  mismatch beyond 3cm incurs a penalty (capped at 20 points per dimension).
- **Posture Risk Screen** - a simplified, seated-desk-work posture check (upper arm, wrist, neck, trunk),
  scored 4 (best) to 12 (worst) and converted to a penalty of up to 40 points.
- **Combined Score** - `Score = 100 − (desk penalty + chair penalty + monitor penalty + posture penalty)`,
  clamped to 0–100.
- **Prioritized Fixes** - every deduction ties to a specific recommendation (exact cm adjustment or posture
  change), not a generic "improve your posture."

## What's in the Build

- Single combined score - one Workspace Ergonomic Score out of 100.
- Specific fix list - each flagged issue comes with the exact adjustment needed.
- Assessment history - re-run the audit after changes and track score improvement over time.
- Sample assessment - a worked example with a mismatched desk setup.
- Local persistence - assessment history saved in the browser between visits.

## Files

- `index.html` - page markup and the live tool's UI
- `../../js/personal-ergonomic-analysis.js` - fit-penalty and posture-penalty computation, recommendation
  engine, assessment history
- Persistence: browser `localStorage` (`pea_log_v1`)

## Stack

HTML5, vanilla JavaScript (ES6), rule-based recommendation engine, Web Storage API - no build step, no
dependencies.
