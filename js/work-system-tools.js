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

  const factors = { Availability: a, Performance: p, Quality: q };
  const loss = Object.entries(factors).sort((a, b) => a[1] - b[1])[0][0];
  const lossFix = {
    Availability: 'unplanned stops and changeover time are the biggest loss - look there before touching speed or quality.',
    Performance: 'minor stops and reduced running speed are the biggest loss - check for a bottleneck station or micro-stoppages that never get logged.',
    Quality: 'defects and rework are the biggest loss - fix the defect source first; perfect uptime and speed won\'t save output lost to scrap.'
  }[loss];

  document.getElementById('oeeResult').innerHTML =
    `OEE = <strong>${oee.toFixed(1)}%</strong> &middot; ${tier}<br>` +
    `<span class="tool-recommend"><strong>${loss}</strong> is your biggest loss factor (${factors[loss]}%) - ${lossFix}</span>`;
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
  const hourlyCapacity = 60 / standardTime;

  let ratingNote = '';
  if (rating < 75 || rating > 125) {
    ratingNote = ` A performance rating of ${rating}% is unusually far from 100 - get a second observer to rate the same operator before you commit to this standard.`;
  }

  resultEl.innerHTML =
    `Normal Time = <strong>${normalTime.toFixed(3)} min</strong> &middot; ` +
    `Standard Time = <strong>${standardTime.toFixed(3)} min</strong><br>` +
    `<span class="tool-recommend">Use Standard Time, not the raw observed time, for capacity planning and line balancing - it implies about <strong>${hourlyCapacity.toFixed(1)} units/hour</strong> at a sustainable pace.${ratingNote}</span>`;
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
  const idlePerStation = cycle - (totalTime / minStations);

  let action;
  if (efficiency >= 90) {
    action = `A well-balanced line - the task times split cleanly across ${minStations} stations with little idle time to chase.`;
  } else if (efficiency >= 75) {
    action = `Some slack remains (&asymp;${idlePerStation.toFixed(1)} min/station idle on average) - try regrouping tasks across stations before adding another one.`;
  } else {
    action = `Efficiency is low - a large or awkwardly-sized task is likely forcing an extra station just to fit. Look for a task close to ${(cycle / 2).toFixed(1)} min that could be split to rebalance the load.`;
  }

  resultEl.innerHTML =
    `Total task time = <strong>${totalTime.toFixed(1)}</strong> &middot; ` +
    `Minimum workstations = <strong>${minStations}</strong> &middot; ` +
    `Balance efficiency = <strong>${efficiency.toFixed(1)}%</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
});
