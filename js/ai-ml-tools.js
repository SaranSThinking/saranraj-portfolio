// ---------- Classification Metrics ----------
document.getElementById('cmCalc').addEventListener('click', () => {
  const tp = parseFloat(document.getElementById('cmTP').value);
  const fp = parseFloat(document.getElementById('cmFP').value);
  const fn = parseFloat(document.getElementById('cmFN').value);
  const tn = parseFloat(document.getElementById('cmTN').value);
  const resultEl = document.getElementById('cmResult');

  if ([tp, fp, fn, tn].some(v => isNaN(v) || v < 0)) {
    resultEl.textContent = 'Enter non-negative values for TP, FP, FN, and TN.';
    return;
  }

  const total = tp + fp + fn + tn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const specificity = (tn + fp) > 0 ? tn / (tn + fp) : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  resultEl.innerHTML =
    `Accuracy = <strong>${(accuracy * 100).toFixed(1)}%</strong> &middot; ` +
    `Precision = <strong>${(precision * 100).toFixed(1)}%</strong> &middot; ` +
    `Recall = <strong>${(recall * 100).toFixed(1)}%</strong><br>` +
    `Specificity = <strong>${(specificity * 100).toFixed(1)}%</strong> &middot; ` +
    `F1 Score = <strong>${f1.toFixed(3)}</strong>`;
});

// ---------- Simple Linear Regression ----------
document.getElementById('regCalc').addEventListener('click', () => {
  const xs = document.getElementById('regX').value.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));
  const ys = document.getElementById('regY').value.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));
  const predictX = parseFloat(document.getElementById('regPredictX').value);
  const resultEl = document.getElementById('regResult');

  if (xs.length < 2 || xs.length !== ys.length) {
    resultEl.textContent = 'Enter equal-length X and Y series with at least 2 points.';
    return;
  }

  const n = xs.length;
  const xBar = xs.reduce((a, b) => a + b, 0) / n;
  const yBar = ys.reduce((a, b) => a + b, 0) / n;

  let sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumXY += (xs[i] - xBar) * (ys[i] - yBar);
    sumXX += (xs[i] - xBar) ** 2;
  }
  const slope = sumXY / sumXX;
  const intercept = yBar - slope * xBar;

  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yHat = slope * xs[i] + intercept;
    ssRes += (ys[i] - yHat) ** 2;
    ssTot += (ys[i] - yBar) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;

  let predictionHtml = '';
  if (!isNaN(predictX)) {
    const prediction = slope * predictX + intercept;
    predictionHtml = ` &middot; Predicted y at x=${predictX}: <strong>${prediction.toFixed(2)}</strong>`;
  }

  resultEl.innerHTML =
    `y = <strong>${slope.toFixed(3)}</strong>x + <strong>${intercept.toFixed(3)}</strong> &middot; ` +
    `R&sup2; = <strong>${r2.toFixed(3)}</strong>${predictionHtml}`;
});

// ---------- Activation Function Explorer ----------
document.getElementById('actCalc').addEventListener('click', () => {
  const z = parseFloat(document.getElementById('actZ').value);
  const resultEl = document.getElementById('actResult');

  if (isNaN(z)) {
    resultEl.textContent = 'Enter a valid value for z.';
    return;
  }

  const sigmoid = 1 / (1 + Math.exp(-z));
  const tanh = Math.tanh(z);
  const relu = Math.max(0, z);
  const leakyRelu = z >= 0 ? z : 0.01 * z;

  resultEl.innerHTML =
    `Sigmoid(z) = <strong>${sigmoid.toFixed(4)}</strong> &middot; tanh(z) = <strong>${tanh.toFixed(4)}</strong><br>` +
    `ReLU(z) = <strong>${relu.toFixed(4)}</strong> &middot; Leaky ReLU(z) = <strong>${leakyRelu.toFixed(4)}</strong>`;
});

// ---------- Predictive Maintenance: RUL Estimator ----------
document.getElementById('rulCalc').addEventListener('click', () => {
  const current = parseFloat(document.getElementById('rulCurrent').value);
  const threshold = parseFloat(document.getElementById('rulThreshold').value);
  const rate = parseFloat(document.getElementById('rulRate').value);
  const resultEl = document.getElementById('rulResult');

  if ([current, threshold, rate].some(v => isNaN(v)) || rate <= 0) {
    resultEl.textContent = 'Enter valid readings and a positive degradation rate.';
    return;
  }

  if (current >= threshold) {
    resultEl.innerHTML = `Sensor reading has already reached the failure threshold - <strong>schedule maintenance now</strong>.`;
    return;
  }

  const rulDays = (threshold - current) / rate;
  let urgency;
  if (rulDays <= 3) urgency = 'Critical - schedule maintenance immediately';
  else if (rulDays <= 10) urgency = 'Urgent - schedule within the next maintenance window';
  else urgency = 'Stable - monitor on normal schedule';

  resultEl.innerHTML =
    `Estimated RUL = <strong>${rulDays.toFixed(1)} days</strong> &middot; ${urgency}`;
});

// ---------- K-Means: One Iteration ----------
function parsePoint(str) {
  const [x, y] = str.split(':').map(s => parseFloat(s.trim()));
  return { x, y };
}
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

document.getElementById('kmCalc').addEventListener('click', () => {
  const resultEl = document.getElementById('kmResult');
  const pointStrs = document.getElementById('kmPoints').value.split(',').map(s => s.trim()).filter(Boolean);
  const points = pointStrs.map(parsePoint);
  const c1 = parsePoint(document.getElementById('kmC1').value);
  const c2 = parsePoint(document.getElementById('kmC2').value);

  if (points.some(p => isNaN(p.x) || isNaN(p.y)) || isNaN(c1.x) || isNaN(c1.y) || isNaN(c2.x) || isNaN(c2.y) || points.length < 2) {
    resultEl.textContent = 'Enter valid x:y points and two valid x:y centroids.';
    return;
  }

  const cluster1 = [], cluster2 = [];
  points.forEach(p => {
    if (dist(p, c1) <= dist(p, c2)) cluster1.push(p);
    else cluster2.push(p);
  });

  const mean = pts => pts.length
    ? { x: pts.reduce((a, b) => a + b.x, 0) / pts.length, y: pts.reduce((a, b) => a + b.y, 0) / pts.length }
    : null;

  const newC1 = mean(cluster1) || c1;
  const newC2 = mean(cluster2) || c2;

  const fmt = p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`;
  const fmtList = pts => pts.map(fmt).join(', ') || 'none';

  resultEl.innerHTML =
    `Cluster 1 (${cluster1.length} pts): ${fmtList(cluster1)}<br>` +
    `Cluster 2 (${cluster2.length} pts): ${fmtList(cluster2)}<br>` +
    `New centroids after this iteration: C1 = <strong>${fmt(newC1)}</strong>, C2 = <strong>${fmt(newC2)}</strong>`;
});
