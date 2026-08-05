# Saranraj Ramachandran - Industrial Engineering Portfolio

**Live site:** https://saransthinking.github.io/saranraj-portfolio/

A static portfolio site for Saranraj Ramachandran, Lecturer (Department of Industrial Engineering, CEG,
Anna University). Nine expertise-domain pages, each with live interactive calculators grounded in real IE/AI-ML
methods, plus a "Learn by Doing" hub of seven hands-on personal-productivity tools. Pure HTML/CSS/vanilla
JavaScript - no framework, no build step, no server-side code.

## Site Map

| Section | Path | Description |
|---|---|---|
| Home | [`index.html`](index.html) | Bio, timeline, publications, teaching roles, skills, contact |
| Learn by Doing hub | [`personal-projects.html`](personal-projects.html) | Index of the 7 personal projects |
| Ergonomics | [`projects/ergonomics/`](projects/ergonomics/) | RULA/REBA, NIOSH Lifting Equation, anthropometric sizing |
| Cognitive Ergonomics | [`projects/cognitive-ergonomics/`](projects/cognitive-ergonomics/) | NASA-TLX, Fitts's Law, Signal Detection Theory |
| Work System Design | [`projects/work-system-design/`](projects/work-system-design/) | OEE, Standard Time, Line Balancing |
| Supply Chain & Logistics | [`projects/supply-chain/`](projects/supply-chain/) | EOQ/ROP, ABC, Landed Cost, Transport, Forecasting, Bullwhip, Risk, Resilience |
| Quality Management | [`projects/quality-management/`](projects/quality-management/) | Cp/Cpk, X̄–R Control Chart |
| Lean Six Sigma | [`projects/lean-six-sigma/`](projects/lean-six-sigma/) | FMEA RPN, Takt Time, 5S Scorecard, DMAIC |
| Entrepreneurship | [`projects/entrepreneurship/`](projects/entrepreneurship/) | Entrepreneurial Intention, Break-Even |
| Organisational Behaviour | [`projects/organisational-behaviour/`](projects/organisational-behaviour/) | Leadership Style, Tuckman Stage Finder |
| AI & Machine Learning | [`projects/ai-ml/`](projects/ai-ml/) | Classification Metrics, Regression, Activation Functions, RUL, K-Means |
| Personal Supply Chain | [`projects/personal-supply-chain/`](projects/personal-supply-chain/) | Household inventory optimizer (EOQ/ROP/safety stock) |
| Personal Quality Control | [`projects/personal-quality-control/`](projects/personal-quality-control/) | I-MR control chart on a personal metric |
| Personal Study Predictor | [`projects/personal-study-predictor/`](projects/personal-study-predictor/) | Live regression on study-hours vs. score |
| Personal Productivity OEE | [`projects/personal-productivity-oee/`](projects/personal-productivity-oee/) | Daily OEE self-tracking |
| Personal Breakeven Analysis | [`projects/personal-breakeven/`](projects/personal-breakeven/) | Buy-vs-pay-per-use breakeven calculator |
| Personal Decision Making | [`projects/personal-decision-mcdm/`](projects/personal-decision-mcdm/) | Weighted Sum Model (MCDM) |
| Personal Ergonomic Analysis | [`projects/personal-ergonomic-analysis/`](projects/personal-ergonomic-analysis/) | Workspace ergonomic audit |

Each `projects/<slug>/` folder has its own `README.md` with that project's problem statement, methodology
(formulas), feature list, and case studies.

## Repository Structure

```
saranraj-portfolio/
├── index.html                 # Homepage
├── personal-projects.html     # "Learn by Doing" hub
├── css/                       # Shared stylesheets - see css/README.md
├── js/                        # Shared + per-page scripts - see js/README.md
└── projects/
    └── <slug>/
        ├── index.html          # The project's page
        └── README.md           # Problem, methodology, features
```

## Shared Assets

### `css/`
- **`style.css`** - the core design system: CSS custom-property palette (light theme - off-white background,
  deep indigo/emerald accents), typography (Inter + JetBrains Mono), header/nav, hero, section templates,
  expertise cards, the `.tool-card` component used by every calculator, capability badges, timeline, research/
  publication lists, skills chips, footer, the domain-page template (mode toggle, case-study cards), the
  personal-project case-study template (`.pp-*` classes: stat rows, numbered sections, methodology/feature
  grids), and all responsive breakpoints.
- **`personal-projects.css`** - widget-level styles specific to the "Learn by Doing" live tools: pantry item
  cards and health-status badges, log forms, data tables, the MCDM rating matrix and ranked bars, journal
  entries, and the live-indicator dot.

### `js/`
See [`js/README.md`](js/README.md) for the full file-by-file breakdown. In short: `main.js` is shared by every
page (nav, scroll progress, footer year); each domain page and each personal project has its own dedicated
script implementing that page's calculators.

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox, inline SVG for charts, the Web Storage API for the personal
projects' local persistence. No build step, no bundler, no framework, no external JS dependencies (only Google
Fonts is loaded remotely).

## Deployment

Static site served via GitHub Pages from the `master` branch root. Any push to `master` triggers a rebuild.
