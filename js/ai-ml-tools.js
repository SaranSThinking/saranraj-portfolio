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

  const gap = precision - recall;
  let action;
  if (Math.abs(gap) < 0.1) {
    action = `Precision and recall are close (F1 = ${f1.toFixed(3)}) - the model isn't strongly biased either way, so tune the decision threshold based on which error actually costs more in your use case.`;
  } else if (gap > 0) {
    action = `Precision is well above recall - the model is conservative, missing real positives (${fn} false negatives) to avoid false alarms. If missing a true case is the costly error here, lower the classification threshold.`;
  } else {
    action = `Recall is well above precision - the model is aggressive, catching positives but with more false alarms (${fp} false positives). If a false alarm is the costly error here, raise the classification threshold.`;
  }

  resultEl.innerHTML =
    `Accuracy = <strong>${(accuracy * 100).toFixed(1)}%</strong> &middot; ` +
    `Precision = <strong>${(precision * 100).toFixed(1)}%</strong> &middot; ` +
    `Recall = <strong>${(recall * 100).toFixed(1)}%</strong><br>` +
    `Specificity = <strong>${(specificity * 100).toFixed(1)}%</strong> &middot; ` +
    `F1 Score = <strong>${f1.toFixed(3)}</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
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
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const extrapWarn = (predictX < xMin || predictX > xMax) ? ' <span class="tool-recommend">This x is outside your data range - treat the prediction as a rough extrapolation, not a reliable estimate.</span>' : '';
    predictionHtml = ` &middot; Predicted y at x=${predictX}: <strong>${prediction.toFixed(2)}</strong>${extrapWarn}`;
  }

  let fitAction;
  if (r2 >= 0.7) fitAction = `Strong fit (R&sup2; = ${r2.toFixed(2)}) - safe to use for prediction within your data's x-range, but not beyond it.`;
  else if (r2 >= 0.4) fitAction = `Moderate fit (R&sup2; = ${r2.toFixed(2)}) - x explains some of the variation in y, but other factors clearly matter too. Use predictions as a rough guide, not a precise estimate.`;
  else fitAction = `Weak fit (R&sup2; = ${r2.toFixed(2)}) - a straight line through x doesn't explain y well here. Look for a different predictor, a non-linear relationship, or accept that this pair isn't strongly related.`;

  resultEl.innerHTML =
    `y = <strong>${slope.toFixed(3)}</strong>x + <strong>${intercept.toFixed(3)}</strong> &middot; ` +
    `R&sup2; = <strong>${r2.toFixed(3)}</strong>${predictionHtml}<br>` +
    `<span class="tool-recommend">${fitAction}</span>`;
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

  let action;
  if (Math.abs(z) > 4) {
    action = `At |z| = ${Math.abs(z).toFixed(1)}, sigmoid and tanh are both saturated (near 0 or 1) - gradients here are close to zero, which is exactly how vanishing gradients stall training in deep networks. ReLU and Leaky ReLU don't saturate on the positive side, which is a big part of why they replaced sigmoid/tanh in hidden layers.`;
  } else if (z < 0) {
    action = `z is negative, so standard ReLU outputs exactly 0 here - if this neuron sees mostly negative inputs during training, it can "die" and stop learning entirely. Leaky ReLU's small negative slope (${leakyRelu.toFixed(4)}) exists specifically to prevent that.`;
  } else {
    action = `In this range, ReLU and Leaky ReLU behave identically (both just pass z through) - the difference between them only shows up for negative inputs.`;
  }

  resultEl.innerHTML =
    `Sigmoid(z) = <strong>${sigmoid.toFixed(4)}</strong> &middot; tanh(z) = <strong>${tanh.toFixed(4)}</strong><br>` +
    `ReLU(z) = <strong>${relu.toFixed(4)}</strong> &middot; Leaky ReLU(z) = <strong>${leakyRelu.toFixed(4)}</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
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
  let urgency, action;
  if (rulDays <= 3) {
    urgency = 'Critical - schedule maintenance immediately';
    action = `Don't wait for confirmation from another reading - by the time a second data point confirms the trend, you may already be past the window.`;
  } else if (rulDays <= 10) {
    urgency = 'Urgent - schedule within the next maintenance window';
    action = `Order any spare parts now if lead time is a risk - waiting until RUL drops into the critical range leaves no buffer for parts delivery.`;
  } else {
    urgency = 'Stable - monitor on normal schedule';
    action = `No action needed yet, but re-check this estimate regularly - degradation rate rarely stays perfectly linear, and it usually accelerates, not slows, as a component ages.`;
  }

  resultEl.innerHTML =
    `Estimated RUL = <strong>${rulDays.toFixed(1)} days</strong> &middot; ${urgency}<br>` +
    `<span class="tool-recommend">${action}</span>`;
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

  const shift = dist(c1, newC1) + dist(c2, newC2);
  const action = shift < 0.05
    ? `Centroids barely moved (total shift ${shift.toFixed(3)}) - this is essentially converged. Running another iteration won't reassign points.`
    : `Centroids moved by ${shift.toFixed(2)} total - paste C1/C2 back in as <strong>${fmt(newC1)}</strong> and <strong>${fmt(newC2)}</strong> and run again; clusters aren't stable yet.`;

  resultEl.innerHTML =
    `Cluster 1 (${cluster1.length} pts): ${fmtList(cluster1)}<br>` +
    `Cluster 2 (${cluster2.length} pts): ${fmtList(cluster2)}<br>` +
    `New centroids after this iteration: C1 = <strong>${fmt(newC1)}</strong>, C2 = <strong>${fmt(newC2)}</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
});
