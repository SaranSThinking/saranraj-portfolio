// ---------- FMEA RPN ----------
document.getElementById('fmeaCalc').addEventListener('click', () => {
  const sev = parseFloat(document.getElementById('fmeaSev').value);
  const occ = parseFloat(document.getElementById('fmeaOcc').value);
  const det = parseFloat(document.getElementById('fmeaDet').value);
  const resultEl = document.getElementById('fmeaResult');

  if ([sev, occ, det].some(v => isNaN(v) || v < 1 || v > 10)) {
    resultEl.textContent = 'Enter Severity, Occurrence, and Detection between 1 and 10.';
    return;
  }

  const rpn = sev * occ * det;
  let tier;
  if (rpn >= 200) tier = 'Critical - act immediately';
  else if (rpn >= 100) tier = 'High priority';
  else if (rpn >= 50) tier = 'Moderate priority';
  else tier = 'Low priority';

  resultEl.innerHTML = `RPN = <strong>${rpn}</strong> / 1000 &middot; ${tier}`;
});

// ---------- Takt Time ----------
document.getElementById('taktCalc').addEventListener('click', () => {
  const time = parseFloat(document.getElementById('taktTime').value);
  const demand = parseFloat(document.getElementById('taktDemand').value);
  const resultEl = document.getElementById('taktResult');

  if (!time || !demand || time <= 0 || demand <= 0) {
    resultEl.textContent = 'Enter positive available time and demand values.';
    return;
  }

  const takt = time / demand;
  resultEl.innerHTML = `Takt Time = <strong>${takt.toFixed(2)} min/unit</strong> (${(takt * 60).toFixed(1)} sec/unit)`;
});

// ---------- 5S Audit ----------
document.getElementById('s5Calc').addEventListener('click', () => {
  const ids = ['s1', 's2', 's3', 's4', 's5'];
  const values = ids.map(id => parseFloat(document.getElementById(id).value));
  const resultEl = document.getElementById('s5Result');

  if (values.some(v => isNaN(v) || v < 0 || v > 5)) {
    resultEl.textContent = 'Enter all five ratings between 0 and 5.';
    return;
  }

  const total = values.reduce((a, b) => a + b, 0);
  const pct = (total / 25) * 100;

  let tier;
  if (pct >= 80) tier = 'Excellent - embedded 5S culture';
  else if (pct >= 60) tier = 'Good - sustain and standardize further';
  else if (pct >= 40) tier = 'Developing - needs consistent reinforcement';
  else tier = 'Weak - 5S not yet established';

  resultEl.innerHTML = `Score = <strong>${total}/25</strong> (${pct.toFixed(0)}%) &middot; ${tier}`;
});
