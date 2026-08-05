# AI & Machine Learning

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/ai-ml/
**Part of:** [Saranraj Ramachandran - Industrial Engineering Portfolio](https://saransthinking.github.io/saranraj-portfolio/)

Applied ML for Industrial Engineering - prediction, classification, and pattern detection on shop-floor and
operations data. Taught alongside Operations and Analytics, so the framing stays applied: not ML for its own
sake, but another tool in the same box as SPC, DMAIC, and forecasting - for predictive maintenance, quality
classification, and demand prediction.

## Tools

Small, transparent implementations of the algorithms behind the black box:

### Classification Metrics
From a confusion matrix (TP/FP/FN/TN), computes Accuracy, Precision, Recall, Specificity, and F1 - the metrics
that matter on imbalanced data (e.g. rare defect classification).

### Simple Linear Regression
Least-squares fit of y on x, with R² and a point prediction.

- **Formula:** `slope = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²`; `R² = 1 − SS_res/SS_tot`.

### Neuron Activation Explorer
Given a weighted sum z, computes Sigmoid, tanh, ReLU, and Leaky ReLU - the standard activation functions.

### Predictive Maintenance: RUL Estimator
A linear degradation model estimating Remaining Useful Life from a sensor trend.

- **Formula:** `RUL = (Failure Threshold − Current Reading) ÷ Degradation Rate`.

### K-Means: One Iteration, Worked by Hand
Assigns points to the nearest of two centroids by Euclidean distance, then recomputes the centroids - the
two-step loop k-means repeats until convergence.

## Applied Focus

No AI/ML publication exists on the CV, so this domain is grounded in teaching and certified skills rather than
a fabricated research case study:

- **AI & Machine Learning Course** - covers the mechanics behind these tools (regression, classification,
  clustering, neural network basics), framed around Industrial Engineering use cases.
- **Python, SQL & Analytics Toolchain** - Data Analytics and Power BI certified, with working Python/SQL for
  the same data pipelines that feed the ergonomics, quality, and supply chain work on this site.
- **ML as the Next Layer on Classical IE Tools** - predictive maintenance extends OEE/reliability thinking
  ([Work System Design](../work-system-design/)); classification metrics extend SPC
  ([Quality Management](../quality-management/)); regression extends demand forecasting
  ([Supply Chain Analytics](../supply-chain/)).

## Files

- `index.html` - page markup
- Shared assets: `../../css/style.css`, `../../js/ai-ml-tools.js`

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox - no build step, no dependencies.
