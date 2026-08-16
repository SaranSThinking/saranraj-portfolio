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

  const factors = { Severity: sev, Occurrence: occ, Detection: det };
  const driver = Object.entries(factors).sort((a, b) => b[1] - a[1])[0][0];
  const driverFix = {
    Severity: 'this is usually the hardest lever to pull - a high severity score typically means the failure mode itself needs to be designed out, not just controlled downstream.',
    Occurrence: 'focus on eliminating the root cause or mistake-proofing (poka-yoke) so the failure happens less often in the first place.',
    Detection: 'as-is, this failure would slip through. Add inspection points, automated checks, or process controls that catch it before it reaches the next stage.'
  }[driver];

  resultEl.innerHTML =
    `RPN = <strong>${rpn}</strong> / 1000 &middot; ${tier}<br>` +
    `<span class="tool-recommend"><strong>${driver}</strong> (${factors[driver]}/10) is the biggest contributor - ${driverFix}</span>`;
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
  resultEl.innerHTML =
    `Takt Time = <strong>${takt.toFixed(2)} min/unit</strong> (${(takt * 60).toFixed(1)} sec/unit)<br>` +
    `<span class="tool-recommend">Design every station's cycle time at or just under this number. Whichever station actually takes longer than takt is your bottleneck - fix that one station before rebalancing anything else on the line.</span>`;
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

  const sLabels = ['Sort', 'Set in Order', 'Shine', 'Standardize', 'Sustain'];
  const weakestIdx = values.indexOf(Math.min(...values));
  const weakest = sLabels[weakestIdx];
  const sFix = {
    Sort: 'clear out what\'s not needed at the workstation - unnecessary items are the single most common source of wasted search time.',
    'Set in Order': 'give every remaining item a labeled, fixed location - if people are hunting for tools, this is the S to fix.',
    Shine: 'build cleaning into the shift routine itself, not a separate event - a Shine step that only happens occasionally doesn\'t stick.',
    Standardize: 'write the standard down - this is usually the missing S even when Sort/Set/Shine look fine, because nothing stops them drifting back within a month.',
    Sustain: 'this is a discipline problem, not a technique problem - a visible, recurring audit schedule fixes it, not more training.'
  }[weakest];

  resultEl.innerHTML =
    `Score = <strong>${total}/25</strong> (${pct.toFixed(0)}%) &middot; ${tier}<br>` +
    `<span class="tool-recommend">Weakest S: <strong>${weakest}</strong> (${values[weakestIdx]}/5) - ${sFix}</span>`;
});
