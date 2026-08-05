const PBE_LOG_KEY = 'pbe_log_v1';

function pbeLoad() {
  const raw = localStorage.getItem(PBE_LOG_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) { /* fall through */ } }
  return [];
}
function pbeSave(entries) { localStorage.setItem(PBE_LOG_KEY, JSON.stringify(entries)); }

let pbeEntries = pbeLoad();

function pbeCompute(input) {
  const savingsPerUse = input.altCost - input.ownCost;
  let breakEvenUses = null, breakEvenWeeks = null, verdict;

  if (savingsPerUse <= 0) {
    verdict = 'Never breaks even - the per-use cost is not actually lower when you own it.';
  } else {
    breakEvenUses = input.fixed / savingsPerUse;
    breakEvenWeeks = input.usesPerWeek > 0 ? breakEvenUses / input.usesPerWeek : Infinity;
    verdict = breakEvenWeeks <= input.horizon
      ? `Worth buying - breaks even in ~${breakEvenWeeks.toFixed(1)} weeks, within your ${input.horizon}-week horizon.`
      : `Not yet worth it - breaks even in ~${breakEvenWeeks.toFixed(1)} weeks, beyond your ${input.horizon}-week horizon.`;
  }

  return { savingsPerUse, breakEvenUses, breakEvenWeeks, verdict };
}

function pbeRenderChart(input, result) {
  const chartEl = document.getElementById('pbeChart');
  if (result.breakEvenWeeks === null || !isFinite(result.breakEvenWeeks)) {
    chartEl.innerHTML = '';
    return;
  }

  const width = 700, height = 260, padL = 50, padR = 16, padT = 16, padB = 30;
  const horizonWeeks = Math.max(input.horizon * 1.4, result.breakEvenWeeks * 1.4, 4);
  const steps = 20;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const week = (horizonWeeks / steps) * i;
    const costBuy = input.fixed + input.ownCost * input.usesPerWeek * week;
    const costPayPerUse = input.altCost * input.usesPerWeek * week;
    points.push({ week, costBuy, costPayPerUse });
  }

  const maxCost = Math.max(...points.map(p => Math.max(p.costBuy, p.costPayPerUse)));
  const xFor = w => padL + (w / horizonWeeks) * (width - padL - padR);
  const yFor = c => padT + (1 - c / maxCost) * (height - padT - padB);

  const buyLine = points.map(p => `${xFor(p.week)},${yFor(p.costBuy)}`).join(' ');
  const altLine = points.map(p => `${xFor(p.week)},${yFor(p.costPayPerUse)}`).join(' ');
  const crossX = xFor(result.breakEvenWeeks);

  chartEl.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;background:var(--bg-alt);border-radius:10px;">
      <line x1="${crossX}" y1="${padT}" x2="${crossX}" y2="${height - padB}" stroke="#059669" stroke-dasharray="4,4" stroke-width="1.2" />
      <text x="${crossX}" y="${padT + 10}" text-anchor="middle" font-size="10" fill="#059669">breakeven</text>
      <polyline points="${buyLine}" fill="none" stroke="#4338ca" stroke-width="1.8" />
      <polyline points="${altLine}" fill="none" stroke="#dc2626" stroke-width="1.8" />
      <text x="${padL}" y="${padT}" font-size="10" fill="#4338ca">- Buy</text>
      <text x="${padL + 50}" y="${padT}" font-size="10" fill="#dc2626">- Pay per use</text>
    </svg>
  `;
}

function pbeRenderTable() {
  const tableEl = document.getElementById('pbeTable');
  if (!pbeEntries.length) { tableEl.innerHTML = ''; return; }
  const head = `<tr><th>Decision</th><th>Fixed Cost</th><th>Breakeven</th><th>Verdict</th></tr>`;
  const body = [...pbeEntries].reverse().map(e => `
    <tr>
      <td>${e.name}</td>
      <td>₹${e.fixed}</td>
      <td>${e.breakEvenWeeks !== null && isFinite(e.breakEvenWeeks) ? e.breakEvenWeeks.toFixed(1) + ' wks' : 'n/a'}</td>
      <td class="${e.verdict.startsWith('Worth') ? '' : 'pp-flag-out'}">${e.verdict}</td>
    </tr>
  `).join('');
  tableEl.innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
}

document.getElementById('pbeCalc').addEventListener('click', () => {
  const name = document.getElementById('pbeName').value.trim() || 'Untitled Decision';
  const fixed = parseFloat(document.getElementById('pbeFixed').value);
  const altCost = parseFloat(document.getElementById('pbeAltCost').value);
  const ownCost = parseFloat(document.getElementById('pbeOwnCost').value);
  const usesPerWeek = parseFloat(document.getElementById('pbeUsesPerWeek').value);
  const horizon = parseFloat(document.getElementById('pbeHorizon').value);
  const resultEl = document.getElementById('pbeResult');

  if ([fixed, altCost, ownCost, usesPerWeek, horizon].some(v => isNaN(v) || v < 0)) {
    resultEl.textContent = 'Enter valid, non-negative values for all fields.';
    return;
  }

  const input = { fixed, altCost, ownCost, usesPerWeek, horizon };
  const result = pbeCompute(input);

  resultEl.innerHTML =
    `Savings per use = <strong>₹${result.savingsPerUse.toFixed(2)}</strong>` +
    (result.breakEvenUses !== null
      ? ` &middot; Breakeven = <strong>${result.breakEvenUses.toFixed(1)} uses</strong> (~${isFinite(result.breakEvenWeeks) ? result.breakEvenWeeks.toFixed(1) : '&infin;'} weeks)`
      : '') +
    `<br>${result.verdict}`;

  pbeRenderChart(input, result);

  pbeEntries.push({
    name, fixed, altCost, ownCost, usesPerWeek, horizon,
    breakEvenUses: result.breakEvenUses, breakEvenWeeks: result.breakEvenWeeks, verdict: result.verdict,
    date: new Date().toISOString().slice(0, 10)
  });
  pbeSave(pbeEntries);
  pbeRenderTable();
});

document.getElementById('pbeSample').addEventListener('click', () => {
  document.getElementById('pbeName').value = 'Home Coffee Machine';
  document.getElementById('pbeFixed').value = '3500';
  document.getElementById('pbeAltCost').value = '180';
  document.getElementById('pbeOwnCost').value = '25';
  document.getElementById('pbeUsesPerWeek').value = '5';
  document.getElementById('pbeHorizon').value = '12';
  document.getElementById('pbeCalc').click();
});

pbeRenderTable();
