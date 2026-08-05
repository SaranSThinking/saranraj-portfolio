// ---------- OEE Calculator ----------
document.getElementById('oeeCalc').addEventListener('click', () => {
  const a = parseFloat(document.getElementById('oeeAvail').value) || 0;
  const p = parseFloat(document.getElementById('oeePerf').value) || 0;
  const q = parseFloat(document.getElementById('oeeQual').value) || 0;
  const oee = (a * p * q) / 10000;

  let tier;
  if (oee >= 85) tier = 'World-class';
  else if (oee >= 60) tier = 'Typical - room to improve';
  else tier = 'Low - investigate losses';

  document.getElementById('oeeResult').innerHTML =
    `OEE = <strong>${oee.toFixed(1)}%</strong> &middot; ${tier}`;
});

// ---------- Cp / Cpk Calculator ----------
document.getElementById('cpkCalc').addEventListener('click', () => {
  const usl = parseFloat(document.getElementById('cpkUsl').value);
  const lsl = parseFloat(document.getElementById('cpkLsl').value);
  const mean = parseFloat(document.getElementById('cpkMean').value);
  const std = parseFloat(document.getElementById('cpkStd').value);
  const resultEl = document.getElementById('cpkResult');

  if (!std || std <= 0 || isNaN(usl) || isNaN(lsl) || isNaN(mean)) {
    resultEl.textContent = 'Enter valid USL, LSL, mean, and a positive standard deviation.';
    return;
  }

  const cp = (usl - lsl) / (6 * std);
  const cpu = (usl - mean) / (3 * std);
  const cpl = (mean - lsl) / (3 * std);
  const cpk = Math.min(cpu, cpl);

  let verdict;
  if (cpk >= 1.33) verdict = 'Capable process';
  else if (cpk >= 1.0) verdict = 'Marginally capable - tighten control';
  else verdict = 'Not capable - process exceeds spec limits';

  resultEl.innerHTML =
    `Cp = <strong>${cp.toFixed(2)}</strong> &middot; Cpk = <strong>${cpk.toFixed(2)}</strong> &middot; ${verdict}`;
});

// ---------- Ergonomic Risk Quick-Check ----------
document.getElementById('ergoCalc').addEventListener('click', () => {
  const posture = parseInt(document.getElementById('ergoPosture').value, 10);
  const load = parseInt(document.getElementById('ergoLoad').value, 10);
  const duration = parseInt(document.getElementById('ergoDuration').value, 10);
  const score = posture + load + duration;

  let level, action;
  if (score <= 4) { level = 'Low'; action = 'Acceptable - monitor periodically.'; }
  else if (score <= 6) { level = 'Medium'; action = 'Further investigation needed; change may be required.'; }
  else if (score <= 8) { level = 'High'; action = 'Investigate and implement change soon.'; }
  else { level = 'Very High'; action = 'Implement change immediately.'; }

  document.getElementById('ergoResult').innerHTML =
    `Risk Score = <strong>${score}/10</strong> &middot; ${level} risk &mdash; ${action}`;
});

// ---------- EOQ & Inventory Optimizer ----------
document.getElementById('eoqCalc').addEventListener('click', () => {
  const d = parseFloat(document.getElementById('eoqDemand').value);
  const s = parseFloat(document.getElementById('eoqOrder').value);
  const h = parseFloat(document.getElementById('eoqHold').value);
  const resultEl = document.getElementById('eoqResult');

  if (!d || !s || !h || d <= 0 || s <= 0 || h <= 0) {
    resultEl.textContent = 'Enter positive values for demand, ordering cost, and holding cost.';
    return;
  }

  const eoq = Math.sqrt((2 * d * s) / h);
  const ordersPerYear = d / eoq;
  const totalCost = (d / eoq) * s + (eoq / 2) * h;

  resultEl.innerHTML =
    `EOQ = <strong>${eoq.toFixed(0)} units/order</strong> &middot; ` +
    `${ordersPerYear.toFixed(1)} orders/year &middot; ` +
    `Annual ordering + holding cost &asymp; <strong>₹${totalCost.toFixed(0)}</strong>`;
});
