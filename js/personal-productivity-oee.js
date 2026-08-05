const PPO_LOG_KEY = 'ppo_log_v1';

function ppoSampleWeek() {
  const base = [
    { plannedHours: 8, actualHours: 7,   tasksPlanned: 6, tasksCompleted: 6, tasksReworked: 0 },
    { plannedHours: 8, actualHours: 5,   tasksPlanned: 6, tasksCompleted: 4, tasksReworked: 0 },
    { plannedHours: 8, actualHours: 8,   tasksPlanned: 6, tasksCompleted: 6, tasksReworked: 2 },
    { plannedHours: 6, actualHours: 6,   tasksPlanned: 5, tasksCompleted: 5, tasksReworked: 0 },
    { plannedHours: 8, actualHours: 4,   tasksPlanned: 6, tasksCompleted: 3, tasksReworked: 1 },
    { plannedHours: 8, actualHours: 7,   tasksPlanned: 6, tasksCompleted: 5, tasksReworked: 0 },
    { plannedHours: 8, actualHours: 7.5, tasksPlanned: 6, tasksCompleted: 6, tasksReworked: 1 }
  ];
  const start = new Date('2025-02-03');
  return base.map((d, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return { date: date.toISOString().slice(0, 10), ...d };
  });
}

function ppoLoad() {
  const raw = localStorage.getItem(PPO_LOG_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through */ }
  }
  return [];
}
function ppoSave(entries) { localStorage.setItem(PPO_LOG_KEY, JSON.stringify(entries)); }

let ppoEntries = ppoLoad();
document.getElementById('ppoDate').valueAsDate = new Date();

function ppoCompute(entry) {
  const availability = entry.plannedHours > 0 ? (entry.actualHours / entry.plannedHours) * 100 : 0;
  const performance = entry.tasksPlanned > 0 ? (entry.tasksCompleted / entry.tasksPlanned) * 100 : 0;
  const quality = entry.tasksCompleted > 0
    ? ((entry.tasksCompleted - entry.tasksReworked) / entry.tasksCompleted) * 100
    : 100;
  const oee = (availability * performance * quality) / 10000;
  return { availability, performance, quality, oee };
}

function ppoRenderChart(entries) {
  const chartEl = document.getElementById('ppoChart');
  if (!entries.length) {
    chartEl.innerHTML = '<p class="tool-desc">Add a day to see your OEE trend.</p>';
    return;
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const width = 700, height = 260, padL = 40, padR = 16, padT = 16, padB = 40;
  const barWidth = (width - padL - padR) / sorted.length;
  const yFor = pct => padT + (1 - pct / 100) * (height - padT - padB);

  const bars = sorted.map((e, i) => {
    const { oee } = ppoCompute(e);
    const x = padL + i * barWidth + barWidth * 0.15;
    const w = barWidth * 0.7;
    const y = yFor(Math.min(oee, 100));
    const barColor = oee >= 85 ? '#10b981' : oee >= 60 ? '#f59e0b' : '#ef4444';
    const label = e.date.slice(5);
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${height - padB - y}" fill="${barColor}" rx="2" />
      <text x="${x + w / 2}" y="${height - padB + 14}" text-anchor="middle" font-size="9" fill="#8b8b96">${label}</text>
      <text x="${x + w / 2}" y="${y - 4}" text-anchor="middle" font-size="9" fill="#e4e4e7">${oee.toFixed(0)}%</text>
    `;
  }).join('');

  const benchmarkY = yFor(85);

  chartEl.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;background:var(--bg-alt);border-radius:10px;">
      <line x1="${padL}" y1="${benchmarkY}" x2="${width - padR}" y2="${benchmarkY}" stroke="#5e6ad2" stroke-dasharray="4,4" stroke-width="1.2" />
      <text x="${width - padR}" y="${benchmarkY - 4}" text-anchor="end" font-size="10" fill="#5e6ad2">85% world-class</text>
      ${bars}
    </svg>
  `;
}

function ppoRenderTable(entries) {
  const tableEl = document.getElementById('ppoTable');
  if (!entries.length) { tableEl.innerHTML = ''; return; }
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const head = `<tr><th>Date</th><th>Availability</th><th>Performance</th><th>Quality</th><th>OEE</th></tr>`;
  const body = sorted.map(e => {
    const { availability, performance, quality, oee } = ppoCompute(e);
    return `<tr>
      <td>${e.date}</td>
      <td>${availability.toFixed(0)}%</td>
      <td>${performance.toFixed(0)}%</td>
      <td>${quality.toFixed(0)}%</td>
      <td class="${oee < 60 ? 'pp-flag-out' : ''}">${oee.toFixed(1)}%</td>
    </tr>`;
  }).join('');
  tableEl.innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
}

function ppoRenderSummary(entries) {
  const summaryEl = document.getElementById('ppoSummary');
  if (!entries.length) {
    summaryEl.textContent = 'Add a day or load the sample week to see your trend.';
    return;
  }
  const oeeValues = entries.map(e => ppoCompute(e).oee);
  const avg = oeeValues.reduce((a, b) => a + b, 0) / oeeValues.length;
  const worst = Math.min(...oeeValues);

  let tier;
  if (avg >= 85) tier = 'World-class average — rare, and worth understanding why.';
  else if (avg >= 60) tier = 'Typical range — look at the lowest-scoring days for the biggest loss.';
  else tier = 'Low average — availability or quality is likely the dominant loss, check the breakdown.';

  summaryEl.innerHTML =
    `Average OEE across ${entries.length} day(s) = <strong>${avg.toFixed(1)}%</strong> &middot; ` +
    `Worst day = <strong>${worst.toFixed(1)}%</strong><br>${tier}`;
}

function ppoRenderAll() {
  ppoRenderChart(ppoEntries);
  ppoRenderTable(ppoEntries);
  ppoRenderSummary(ppoEntries);
}

document.getElementById('ppoAdd').addEventListener('click', () => {
  const date = document.getElementById('ppoDate').value;
  const plannedHours = parseFloat(document.getElementById('ppoPlannedHours').value);
  const actualHours = parseFloat(document.getElementById('ppoActualHours').value);
  const tasksPlanned = parseFloat(document.getElementById('ppoTasksPlanned').value);
  const tasksCompleted = parseFloat(document.getElementById('ppoTasksCompleted').value);
  const tasksReworked = parseFloat(document.getElementById('ppoTasksReworked').value);

  if (!date || [plannedHours, actualHours, tasksPlanned, tasksCompleted, tasksReworked].some(v => isNaN(v) || v < 0)) {
    window.alert('Enter a valid date and non-negative values for all fields.');
    return;
  }

  ppoEntries = ppoEntries.filter(e => e.date !== date);
  ppoEntries.push({ date, plannedHours, actualHours, tasksPlanned, tasksCompleted, tasksReworked });
  ppoSave(ppoEntries);
  ppoRenderAll();
});

document.getElementById('ppoClear').addEventListener('click', () => {
  if (window.confirm('Clear your entire log? This cannot be undone.')) {
    ppoEntries = [];
    ppoSave(ppoEntries);
    ppoRenderAll();
  }
});

document.getElementById('ppoSample').addEventListener('click', () => {
  ppoEntries = ppoSampleWeek();
  ppoSave(ppoEntries);
  ppoRenderAll();
});

ppoRenderAll();
