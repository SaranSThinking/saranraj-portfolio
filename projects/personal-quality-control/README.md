# Personal Quality Control

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/personal-quality-control/
**Part of:** [Learn by Doing](https://saransthinking.github.io/saranraj-portfolio/personal-projects.html) — Saranraj Ramachandran's portfolio

An Individuals–Moving Range (I-MR) control chart applied to a metric from your own life — sleep, steps, study
hours, mood, anything you log daily. The same statistical process control logic that flags a defective batch
on a factory line can flag the one night your sleep genuinely broke pattern — versus normal day-to-day noise.

## The Problem

Habit trackers show a graph, but not whether a bad day was a real signal or just ordinary variation. Without a
baseline and control limits, every dip looks alarming and every improvement looks like a trend. Statistical
Process Control solves exactly this on a factory floor: separating common-cause variation (normal noise) from
special-cause variation (something genuinely changed). This project applies that logic to a personal daily
metric.

## Methodology

- **Moving Range** — `MR_i = |X_i − X_i-1|`. Since a personal metric is one reading per day (no natural
  subgroup), variation is estimated from the difference between consecutive days.
- **Control Limits** — `UCL/LCL = X̄ ± 2.66 × MR̄`. The 2.66 constant is the standard d2-based multiplier for
  individuals charts (equivalent to a subgroup of n=2).
- **Out-of-Control Flagging** — any day outside the control limits is flagged as a likely special cause.
- **Baseline Re-centering** — the center line and limits recompute from your actual running history as you log
  more days.

## What's in the Build

- Any metric, your label — name the metric and its unit.
- One-line daily log — add a date and value; limits and flags recompute instantly.
- Live control chart — inline SVG plot of every reading against the center line and control limits.
- Out-of-control table — every day listed with its moving range and status.
- Sample dataset — 14-day sample with one deliberately planted outlier.
- Local persistence — your log is saved in the browser between visits.

## Files

- `index.html` — page markup and the live tool's UI
- `../../js/personal-quality-control.js` — I-MR computation, SVG chart rendering, table/summary rendering
- Persistence: browser `localStorage` (`pqc_log_v1`, `pqc_metric_name_v1`)

## Stack

HTML5, vanilla JavaScript (ES6), inline SVG rendering, Web Storage API — no build step, no dependencies.
