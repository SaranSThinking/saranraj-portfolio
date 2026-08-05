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

// ---------- Standard Time ----------
document.getElementById('stCalc').addEventListener('click', () => {
  const observed = parseFloat(document.getElementById('stObserved').value);
  const rating = parseFloat(document.getElementById('stRating').value);
  const allowance = parseFloat(document.getElementById('stAllowance').value);
  const resultEl = document.getElementById('stResult');

  if (isNaN(observed) || isNaN(rating) || isNaN(allowance) || observed <= 0) {
    resultEl.textContent = 'Enter valid observed time, rating, and allowance.';
    return;
  }

  const normalTime = observed * (rating / 100);
  const standardTime = normalTime * (1 + allowance / 100);

  resultEl.innerHTML =
    `Normal Time = <strong>${normalTime.toFixed(3)} min</strong> &middot; ` +
    `Standard Time = <strong>${standardTime.toFixed(3)} min</strong>`;
});

// ---------- Line Balancing ----------
document.getElementById('lbCalc').addEventListener('click', () => {
  const raw = document.getElementById('lbTasks').value;
  const cycle = parseFloat(document.getElementById('lbCycle').value);
  const resultEl = document.getElementById('lbResult');

  const tasks = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

  if (!tasks.length || !cycle || cycle <= 0) {
    resultEl.textContent = 'Enter valid task times and a positive cycle time.';
    return;
  }

  const maxTask = Math.max(...tasks);
  if (maxTask > cycle) {
    resultEl.innerHTML =
      `Task of <strong>${maxTask}</strong> exceeds the cycle time of <strong>${cycle}</strong> - ` +
      `no feasible line balance until that task is split or the cycle time is raised.`;
    return;
  }

  const totalTime = tasks.reduce((a, b) => a + b, 0);
  const minStations = Math.ceil(totalTime / cycle);
  const efficiency = (totalTime / (minStations * cycle)) * 100;

  resultEl.innerHTML =
    `Total task time = <strong>${totalTime.toFixed(1)}</strong> &middot; ` +
    `Minimum workstations = <strong>${minStations}</strong> &middot; ` +
    `Balance efficiency = <strong>${efficiency.toFixed(1)}%</strong>`;
});
