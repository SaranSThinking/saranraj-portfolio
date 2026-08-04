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
  else if (cpk >= 1.0) verdict = 'Marginally capable — tighten control';
  else verdict = 'Not capable — process exceeds spec limits';

  resultEl.innerHTML =
    `Cp = <strong>${cp.toFixed(2)}</strong> &middot; Cpk = <strong>${cpk.toFixed(2)}</strong> &middot; ${verdict}`;
});

// ---------- X-bar / R Control Chart Limits ----------
const CONTROL_CONSTANTS = {
  2: { A2: 1.880, D3: 0,     D4: 3.267 },
  3: { A2: 1.023, D3: 0,     D4: 2.574 },
  4: { A2: 0.729, D3: 0,     D4: 2.282 },
  5: { A2: 0.577, D3: 0,     D4: 2.114 },
  6: { A2: 0.483, D3: 0,     D4: 2.004 }
};

document.getElementById('ccCalc').addEventListener('click', () => {
  const grandMean = parseFloat(document.getElementById('ccMean').value);
  const avgRange = parseFloat(document.getElementById('ccRange').value);
  const n = parseInt(document.getElementById('ccN').value, 10);
  const resultEl = document.getElementById('ccResult');

  if (isNaN(grandMean) || isNaN(avgRange) || avgRange < 0) {
    resultEl.textContent = 'Enter a valid grand mean and average range.';
    return;
  }

  const { A2, D3, D4 } = CONTROL_CONSTANTS[n];
  const uclX = grandMean + A2 * avgRange;
  const lclX = grandMean - A2 * avgRange;
  const uclR = D4 * avgRange;
  const lclR = D3 * avgRange;

  resultEl.innerHTML =
    `X&#772; chart: UCL = <strong>${uclX.toFixed(3)}</strong>, LCL = <strong>${lclX.toFixed(3)}</strong><br>` +
    `R chart: UCL = <strong>${uclR.toFixed(3)}</strong>, LCL = <strong>${lclR.toFixed(3)}</strong>`;
});
