# Personal Productivity OEE

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/personal-productivity-oee/
**Part of:** [Learn by Doing](https://saransthinking.github.io/saranraj-portfolio/personal-projects.html) — Saranraj Ramachandran's portfolio

Score your own day the way a factory scores a machine — Availability × Performance × Quality. OEE decomposes
machine downtime into three separate losses instead of one vague "productivity" number. Applied to a personal
day, it usually reveals that the real leak isn't effort, it's availability or rework.

## The Problem

A vague sense of "productive" or "not productive" doesn't tell you what to fix. Was the problem that you
didn't have enough time available? That you worked slower than planned? Or that you did the work but had to
redo half of it? Each needs a completely different fix. OEE forces that decomposition on a shop floor; this
project forces the same decomposition on a personal day.

## Methodology

- **Availability** — `Actual Hours Worked / Planned Hours`. Time lost to interruptions, meetings, or not
  starting.
- **Performance** — `Tasks Completed / Tasks Planned`. Of the time you had, how much of the planned output you
  hit.
- **Quality** — `(Completed − Reworked) / Completed`. Work that had to be redone counts against you like a
  defective part.
- **Personal OEE** — `Availability × Performance × Quality`. The same 85% "world-class" benchmark from
  manufacturing applies.

## What's in the Build

- One log per day — planned/actual hours and planned/completed/reworked tasks.
- Automatic A/P/Q breakdown — each day shows all three component ratios, not just the final OEE.
- Live trend chart — inline SVG bar chart of daily OEE against the 85% world-class benchmark line.
- Rolling average — tracks average OEE across all logged days.
- Sample week — preloaded 7-day sample showing the pattern.
- Local persistence — log saved in the browser between visits.

## Files

- `index.html` — page markup and the live tool's UI
- `../../js/personal-productivity-oee.js` — OEE computation, SVG bar-chart rendering, table/summary rendering
- Persistence: browser `localStorage` (`ppo_log_v1`)

## Stack

HTML5, vanilla JavaScript (ES6), inline SVG rendering, Web Storage API — no build step, no dependencies.
