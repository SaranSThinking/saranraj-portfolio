# Work System Design

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/work-system-design/
**Part of:** [Saranraj Ramachandran — Industrial Engineering Portfolio](https://saransthinking.github.io/saranraj-portfolio/)

Productivity, OEE, process capability, and SOPs — engineering the work itself, not just the workstation.
Classical Industrial Engineering: time-and-motion study, line balancing, and equipment effectiveness. This is
also where the published productivity research sits — the MOST-based engine assembly line study on the CV
started here.

## Tools

### OEE Calculator
Overall Equipment Effectiveness = Availability × Performance × Quality.

- **Output:** Percentage classified as World-class (≥85%), Typical (60–85%), or Low (<60%).

### Standard Time Calculator
Observed time → Normal time → Standard time, the core time-study chain behind MOST-based standards.

- **Formula:** `Normal Time = Observed Time × (Rating ÷ 100)`; `Standard Time = Normal Time × (1 + Allowance ÷ 100)`.

### Assembly Line Balancing
Given task times and a desired cycle time, computes the minimum number of workstations and resulting balance
efficiency.

- **Method:** `Minimum Stations = ⌈ΣTask Times ÷ Cycle Time⌉`; `Efficiency = ΣTask Times ÷ (Stations × Cycle Time) × 100`.
- Flags infeasible cycle times (any single task longer than the cycle time).

## Case Study

**Productivity Improvement of an Engine Assembly Line Using MOST** (journal, communicated) — station-wise
cycle times were decomposed into elemental motions using the Maynard Operation Sequence Technique (MOST),
establishing standard times used to rebalance the line against takt time. The full DMAIC walkthrough of this
study lives on the [portfolio homepage](https://saransthinking.github.io/saranraj-portfolio/#tool-dmaic); this
page covers the Work System Design angle (time study and line balancing).

## Files

- `index.html` — page markup
- Shared assets: `../../css/style.css`, `../../js/work-system-tools.js`

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox — no build step, no dependencies.
