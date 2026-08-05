# Personal Study Predictor

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/personal-study-predictor/
**Part of:** [Learn by Doing](https://saransthinking.github.io/saranraj-portfolio/personal-projects.html) - Saranraj Ramachandran's portfolio

A least-squares regression model fitted live on your own study-hours-vs-score data - the same math behind
demand forecasting, pointed at your next exam instead. Log a handful of past study sessions and their scores,
and the model tells you the trend line, how well it fits, and how many hours you'd need for a target grade.

## The Problem

Students plan study time by gut feel - "I'll do 3 hours" - with no reference to how their own past effort has
actually translated into scores. A regression model, fit on a student's own history rather than a generic
study guide, turns "how much should I study" into an answerable question.

## Methodology

- **Least-Squares Fit** - `slope = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²`. The line minimizing total squared error between
  predicted and actual scores.
- **R² Goodness of Fit** - `R² = 1 − SS_res / SS_tot`. How much of the score variation the study-hours trend
  actually explains.
- **Forward Prediction** - given planned study hours, the fitted line predicts an expected score.
- **Reverse Solving** - `hours = (target − intercept) / slope`. Given a target score, back-solves for the
  implied study time.

## What's in the Build

- Log past sessions - study-hours/score pairs refit the model instantly.
- Live scatter + trend line - inline SVG plot of every data point against the fitted regression line.
- Forward prediction - planned hours → predicted score.
- Reverse target-solving - target score → implied hours.
- Fit-quality warning - flags when R² is too low to trust the prediction.
- Sample dataset - preloaded study-hours/score history.

## Files

- `index.html` - page markup and the live tool's UI
- `../../js/personal-study-predictor.js` - least-squares regression, SVG chart rendering, forward/reverse
  solving
- Persistence: browser `localStorage` (`psp_data_v1`)

## Stack

HTML5, vanilla JavaScript (ES6), inline SVG rendering, Web Storage API - no build step, no dependencies.
