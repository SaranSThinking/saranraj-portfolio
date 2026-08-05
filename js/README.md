# `js/`

Every script is plain ES6, loaded with a `<script src="...">` tag - no bundler, no modules, no npm
dependencies. `main.js` is shared across the whole site; every other file implements the calculators for one
specific page.

## Shared

| File | Used by | Does |
|---|---|---|
| **`main.js`** | Every page | Mobile nav toggle, scroll-progress bar, footer copyright year |

## Homepage

| File | Does |
|---|---|
| **`tools.js`** | The 5 embedded tools on `index.html`: OEE, Cp/Cpk, Ergonomic Risk Quick-Check, EOQ Optimizer calculators (the DMAIC case study on the homepage is static content, no script needed) |

## Domain pages (`projects/<slug>/`)

| File | Domain | Implements |
|---|---|---|
| **`ergonomics-tools.js`** | Ergonomics | RULA/REBA mode toggle + scoring, NIOSH Lifting Equation (RWL/LI with real frequency-multiplier and coupling tables), anthropometric workstation sizing |
| **`cognitive-tools.js`** | Cognitive Ergonomics | NASA-TLX (Raw TLX), Fitts's Law movement time, Signal Detection Theory (includes a self-contained inverse-normal-CDF approximation) |
| **`work-system-tools.js`** | Work System Design | OEE calculator, Standard Time chain (observed → normal → standard), assembly line balancing |
| **`supply-chain-tools.js`** | Supply Chain & Logistics | EOQ/safety-stock/ROP, ABC classification, Total Landed Cost, Transportation Mode Comparison, Demand Forecast (moving average + exponential smoothing), Bullwhip Effect Ratio, Supply Risk Exposure Score, Resilience Index - 8 tools, the largest domain file |
| **`quality-tools.js`** | Quality Management | Cp/Cpk, X̄–R control chart limits (A2/D3/D4 constants for n=2–6) |
| **`lss-tools.js`** | Lean Six Sigma | FMEA Risk Priority Number, Takt Time, 5S Audit Scorecard |
| **`entrepreneurship-tools.js`** | Entrepreneurship | Entrepreneurial Intention self-assessment, Break-Even Analysis |
| **`ob-tools.js`** | Organisational Behaviour | Leadership Style self-assessment, Tuckman stage finder |
| **`ai-ml-tools.js`** | AI & Machine Learning | Classification metrics (confusion matrix → accuracy/precision/recall/F1), simple linear regression, neuron activation functions, predictive-maintenance RUL estimator, one k-means iteration |

## Personal projects (`projects/personal-*/`)

Each file owns its own `localStorage` key(s) (noted below) and, where it draws a chart, renders it as inline
SVG with no charting library.

| File | Does | `localStorage` key(s) |
|---|---|---|
| **`personal-supply-chain.js`** | Full pantry-inventory app: per-item EOQ/ROP/safety-stock, exponential-smoothing consumption logging, 4-tier stock-health classification, supplier-grouped shopping list | `psc_items_v1`, `psc_service_level_v1` |
| **`personal-quality-control.js`** | I-MR control chart on a user-defined metric, SVG chart, out-of-control flagging | `pqc_log_v1`, `pqc_metric_name_v1` |
| **`personal-study-predictor.js`** | Live least-squares regression on study-hours-vs-score, SVG scatter+trend chart, forward prediction and reverse target-solving | `psp_data_v1` |
| **`personal-productivity-oee.js`** | Daily Availability × Performance × Quality tracker, SVG bar chart vs. 85% benchmark | `ppo_log_v1` |
| **`personal-breakeven.js`** | Buy-vs-pay-per-use breakeven calculator, SVG cumulative-cost crossover chart | `pbe_log_v1` |
| **`personal-decision-mcdm.js`** | Weighted Sum Model: dynamic rating-matrix generation, weight normalization, ranked-bar visualization | `pmcdm_log_v1`, `pmcdm_last_result_v1` |
| **`personal-ergonomic-analysis.js`** | Combined anthropometric-fit + posture-risk audit, rule-based recommendation engine | `pea_log_v1` |
| **`personal-journal.js`** | Tagged reflection journal that *reads* (never writes) the `localStorage` keys above from all 6 other personal tools to attach a live cross-tool snapshot to each entry. Delisted from the "Learn by Doing" hub, so it (and `personal-journal.html`) stays at the repo root rather than under `projects/` | `pj_entries_v1` |

All `localStorage` data stays entirely in the visitor's own browser - nothing is transmitted anywhere, which
is also why the cross-tool journal snapshot only works within a single browser/device.
