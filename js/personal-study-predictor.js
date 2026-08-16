const PSP_DATA_KEY = 'psp_data_v1';

function pspSampleData() {
  const hours = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6];
  const scores = [45, 52, 58, 63, 68, 72, 75, 80, 82, 88];
  return hours.map((h, i) => ({ hours: h, score: scores[i] }));
}

function pspLoad() {
  const raw = localStorage.getItem(PSP_DATA_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through */ }
  }
  return [];
}
function pspSave(points) {
  localStorage.setItem(PSP_DATA_KEY, JSON.stringify(points));
}

let pspPoints = pspLoad();
let pspFitResult = null;

function pspFit(points) {
  const n = points.length;
  if (n < 2) return null;

  const xs = points.map(p => p.hours);
  const ys = points.map(p => p.score);
  const xBar = xs.reduce((a, b) => a + b, 0) / n;
  const yBar = ys.reduce((a, b) => a + b, 0) / n;

  let sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumXY += (xs[i] - xBar) * (ys[i] - yBar);
    sumXX += (xs[i] - xBar) ** 2;
  }
  const slope = sumXX !== 0 ? sumXY / sumXX : 0;
  const intercept = yBar - slope * xBar;

  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yHat = slope * xs[i] + intercept;
    ssRes += (ys[i] - yHat) ** 2;
    ssTot += (ys[i] - yBar) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;

  return { slope, intercept, r2, n };
}

function pspRenderChart(points, fit) {
  const chartEl = document.getElementById('pspChart');
  if (!fit) {
    chartEl.innerHTML = '<p class="tool-desc">Add at least 2 data points to see the fitted line.</p>';
    return;
  }

  const width = 700, height = 260, padL = 46, padR = 16, padT = 16, padB = 30;
  const xs = points.map(p => p.hours);
  const ys = points.map(p => p.score);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys, fit.intercept + fit.slope * xMin);
  const yMax = Math.max(...ys, fit.intercept + fit.slope * xMax);
  const xRange = (xMax - xMin) || 1;
  const yRange = (yMax - yMin) || 1;

  const xFor = x => padL + ((x - xMin) / xRange) * (width - padL - padR);
  const yFor = y => padT + (1 - (y - yMin) / yRange) * (height - padT - padB);

  const circles = points.map(p =>
    `<circle cx="${xFor(p.hours)}" cy="${yFor(p.score)}" r="4" fill="#96690a" />`
  ).join('');

  const lineX1 = xMin, lineX2 = xMax;
  const lineY1 = fit.intercept + fit.slope * lineX1;
  const lineY2 = fit.intercept + fit.slope * lineX2;

  chartEl.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;background:var(--bg-alt);border-radius:10px;">
      <line x1="${xFor(lineX1)}" y1="${yFor(lineY1)}" x2="${xFor(lineX2)}" y2="${yFor(lineY2)}" stroke="#1b3a5c" stroke-width="1.5" />
      ${circles}
    </svg>
  `;
}

function pspRenderFit(fit) {
  const fitEl = document.getElementById('pspFit');
  if (!fit) {
    fitEl.textContent = 'Add at least 2 data points or load the sample dataset.';
    return;
  }
  let action;
  if (fit.r2 < 0.5) {
    action = `Fit is weak - other factors (sleep, topic difficulty, prior background) likely matter more than raw hours for you. Track one of those alongside hours before trusting an hours-based prediction.`;
  } else if (fit.r2 < 0.75) {
    action = `Decent fit - hours studied is a real signal, but roughly a quarter to half the variation in your scores comes from something else. Use predictions as a planning guide, not a guarantee.`;
  } else if (fit.slope <= 0) {
    action = `More hours isn't predicting higher scores here - before adding more study time, check whether those hours are actually focused, since the relationship you're tracking isn't the one you'd expect.`;
  } else {
    action = `Strong, consistent relationship - ${fit.slope.toFixed(1)} points per extra hour, reliably enough to plan around. Use the calculator below with real confidence for this subject.`;
  }
  fitEl.innerHTML =
    `Fitted line: score = <strong>${fit.slope.toFixed(2)}</strong> &times; hours + <strong>${fit.intercept.toFixed(2)}</strong> ` +
    `&middot; R&sup2; = <strong>${fit.r2.toFixed(3)}</strong> (n=${fit.n})<br>` +
    `<span class="tool-recommend">${action}</span>`;
}

function pspRenderTable(points) {
  const tableEl = document.getElementById('pspTable');
  if (!points.length) { tableEl.innerHTML = ''; return; }
  const head = `<tr><th>Study Hours</th><th>Score</th></tr>`;
  const body = [...points]
    .sort((a, b) => a.hours - b.hours)
    .map(p => `<tr><td>${p.hours}</td><td>${p.score}</td></tr>`)
    .join('');
  tableEl.innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
}

function pspRenderAll() {
  pspFitResult = pspFit(pspPoints);
  pspRenderChart(pspPoints, pspFitResult);
  pspRenderFit(pspFitResult);
  pspRenderTable(pspPoints);
}

document.getElementById('pspAdd').addEventListener('click', () => {
  const hours = parseFloat(document.getElementById('pspHours').value);
  const score = parseFloat(document.getElementById('pspScore').value);
  if (isNaN(hours) || isNaN(score) || hours < 0 || score < 0 || score > 100) {
    window.alert('Enter valid study hours and a score between 0 and 100.');
    return;
  }
  pspPoints.push({ hours, score });
  pspSave(pspPoints);
  pspRenderAll();
});

document.getElementById('pspClear').addEventListener('click', () => {
  if (window.confirm('Clear your entire log? This cannot be undone.')) {
    pspPoints = [];
    pspSave(pspPoints);
    pspRenderAll();
  }
});

document.getElementById('pspSample').addEventListener('click', () => {
  pspPoints = pspSampleData();
  pspSave(pspPoints);
  pspRenderAll();
});

document.getElementById('pspCalcBtn').addEventListener('click', () => {
  const resultEl = document.getElementById('pspPredictResult');
  if (!pspFitResult) {
    resultEl.textContent = 'Add at least 2 data points first.';
    return;
  }
  const predictHours = parseFloat(document.getElementById('pspPredictHours').value);
  const targetScore = parseFloat(document.getElementById('pspTargetScore').value);
  const { slope, intercept } = pspFitResult;

  const xs = pspPoints.map(p => p.hours);
  const maxObservedHours = Math.max(...xs);

  let html = '';
  if (!isNaN(predictHours)) {
    const predictedScore = slope * predictHours + intercept;
    const capped = Math.max(0, Math.min(100, predictedScore));
    const outOfRange = predictHours > maxObservedHours * 1.5 ? ` <span class="tool-recommend">This is well beyond your logged hours (max ${maxObservedHours}h) - the trend may not hold that far out; treat it as a rough extrapolation.</span>` : '';
    html += `At <strong>${predictHours}h</strong> of study, predicted score &asymp; <strong>${capped.toFixed(1)}</strong>${predictedScore > 100 || predictedScore < 0 ? ' (capped to a realistic 0-100 range)' : ''}<br>${outOfRange}`;
  }
  if (!isNaN(targetScore)) {
    if (Math.abs(slope) < 1e-9) {
      html += `Slope is essentially flat - study hours don't predict score changes in this data.`;
    } else {
      const neededHours = (targetScore - intercept) / slope;
      const realism = neededHours > maxObservedHours * 2 ? ` <span class="tool-recommend">That's more than double your longest logged session - if it seems unrealistic, the honest read is that hours alone won't get you there; look at study method too.</span>` : '';
      html += `To reach a score of <strong>${targetScore}</strong>, the trend implies &asymp; <strong>${neededHours.toFixed(1)}h</strong> of study.${realism}`;
    }
  }
  resultEl.innerHTML = html || 'Enter values and calculate.';
});

pspRenderAll();
