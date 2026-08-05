# Personal Breakeven Analysis

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/personal-breakeven/
**Part of:** [Learn by Doing](https://saransthinking.github.io/saranraj-portfolio/personal-projects.html) - Saranraj Ramachandran's portfolio

"Will this actually pay for itself?" - answered with the same breakeven math used to justify capital equipment
purchases, pointed at your coffee machine instead. Every buy-it-once-vs-pay-per-use decision has a real
crossover point. This tool finds it.

## The Problem

Purchase decisions like this get justified with a gut feeling - "I'll definitely use it enough" - rather than
a number. The classic business breakeven formula (fixed cost vs. per-unit contribution) applies just as
cleanly to a personal purchase as it does to a factory investment.

## Methodology

- **Contribution per Use** - `Savings/use = Cost/use (alternative) − Cost/use (if you buy)`.
- **Breakeven Point** - `Breakeven Uses = Fixed Cost / Savings per Use`. Directly analogous to the
  fixed-cost/contribution-margin breakeven used for a new product line.
- **Time to Breakeven** - breakeven uses ÷ realistic uses-per-week, giving a breakeven horizon in actual weeks.
- **Cumulative Cost Crossover** - projects total cost under "buy" vs. "keep paying per use" forward in time;
  the chart's crossover point is the breakeven point, visually.

## What's in the Build

- Any buy-vs-pay decision - coffee machine vs. café, bike vs. cabs, annual pass vs. pay-per-visit.
- Live crossover chart - inline SVG plot of cumulative cost for both paths.
- Payback-horizon verdict - set how long you're willing to wait; the tool tells you if the purchase clears
  that bar.
- Decision log - every analyzed decision saved with its verdict.
- Sample decision - a worked coffee-machine-vs-café example.
- Local persistence - decision log saved in the browser between visits.

## Files

- `index.html` - page markup and the live tool's UI
- `../../js/personal-breakeven.js` - breakeven computation, SVG crossover-chart rendering, decision log
- Persistence: browser `localStorage` (`pbe_log_v1`)

## Stack

HTML5, vanilla JavaScript (ES6), inline SVG rendering, Web Storage API - no build step, no dependencies.
