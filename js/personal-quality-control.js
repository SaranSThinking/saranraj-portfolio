const PQC_LOG_KEY = 'pqc_log_v1';
const PQC_METRIC_KEY = 'pqc_metric_name_v1';

function pqcSampleData() {
  const values = [7.2, 7.5, 7.1, 7.8, 7.4, 7.6, 7.3, 3.5, 7.5, 7.2, 7.9, 7.4, 7.6, 7.3];
  const start = new Date('2025-01-01');
  return values.map((v, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { date: d.toISOString().slice(0, 10), value: v };
  });
}

function pqcLoad() {
  const raw = localStorage.getItem(PQC_LOG_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through */ }
  }
  return [];
}
function pqcSave(entries) {
  localStorage.setItem(PQC_LOG_KEY, JSON.stringify(entries));
}

let pqcEntries = pqcLoad();

document.getElementById('pqcMetricName').value = localStorage.getItem(PQC_METRIC_KEY) || 'Sleep Hours';
document.getElementById('pqcDate').valueAsDate = new Date();

function pqcCompute(entries) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const values = sorted.map(e => e.value);
  const n = values.length;
  const mean = n ? values.reduce((a, b) => a + b, 0) / n : 0;

  const mrs = [];
  for (let i = 1; i < n; i++) mrs.push(Math.abs(values[i] - values[i - 1]));
  const mrBar = mrs.length ? mrs.reduce((a, b) => a + b, 0) / mrs.length : 0;

  const ucl = mean + 2.66 * mrBar;
  const lcl = mean - 2.66 * mrBar;

  const rows = sorted.map((e, i) => {
    const mr = i === 0 ? null : Math.abs(values[i] - values[i - 1]);
    const outOfControl = n > 1 && (e.value > ucl || e.value < lcl);
    return { ...e, mr, outOfControl };
  });

  return { rows, mean, mrBar, ucl, lcl, n };
}

function pqcRenderChart(result) {
  const chartEl = document.getElementById('pqcChart');
  const { rows, mean, ucl, lcl, n } = result;

  if (n < 2) {
    chartEl.innerHTML = '<p class="tool-desc">Add at least 2 readings to see a control chart.</p>';
    return;
  }

  const width = 700, height = 260, padL = 46, padR = 16, padT = 16, padB = 30;
  const values = rows.map(r => r.value);
  const yMin = Math.min(...values, lcl);
  const yMax = Math.max(...values, ucl);
  const yRange = (yMax - yMin) || 1;

  const xFor = i => padL + (i / (rows.length - 1)) * (width - padL - padR);
  const yFor = v => padT + (1 - (v - yMin) / yRange) * (height - padT - padB);

  const linePoints = rows.map((r, i) => `${xFor(i)},${yFor(r.value)}`).join(' ');

  const circles = rows.map((r, i) =>
    `<circle cx="${xFor(i)}" cy="${yFor(r.value)}" r="4" fill="${r.outOfControl ? '#ef4444' : '#10b981'}" />`
  ).join('');

  const refLine = (v, color, label) =>
    `<line x1="${padL}" y1="${yFor(v)}" x2="${width - padR}" y2="${yFor(v)}" stroke="${color}" stroke-dasharray="4,4" stroke-width="1.2" />
     <text x="${width - padR}" y="${yFor(v) - 4}" text-anchor="end" font-size="10" fill="${color}">${label}</text>`;

  chartEl.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;background:var(--bg-alt);border-radius:10px;">
      ${refLine(ucl, '#ef4444', 'UCL ' + ucl.toFixed(2))}
      ${refLine(mean, '#5e6ad2', 'X̄ ' + mean.toFixed(2))}
      ${refLine(lcl, '#ef4444', 'LCL ' + lcl.toFixed(2))}
      <polyline points="${linePoints}" fill="none" stroke="#5e6ad2" stroke-width="1.5" />
      ${circles}
    </svg>
  `;
}

function pqcRenderTable(result, unit) {
  const tableEl = document.getElementById('pqcTable');
  if (!result.n) { tableEl.innerHTML = ''; return; }

  const head = `<tr><th>Date</th><th>Value</th><th>Moving Range</th><th>Status</th></tr>`;
  const body = result.rows.map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${r.value}</td>
      <td>${r.mr === null ? '—' : r.mr.toFixed(2)}</td>
      <td class="${r.outOfControl ? 'pp-flag-out' : ''}">${r.outOfControl ? 'OUT OF CONTROL' : 'In control'}</td>
    </tr>
  `).join('');

  tableEl.innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
}

function pqcRenderSummary(result) {
  const summaryEl = document.getElementById('pqcSummary');
  if (!result.n) {
    summaryEl.textContent = 'Add readings or load the sample dataset to see control limits.';
    return;
  }
  const flagged = result.rows.filter(r => r.outOfControl).length;
  summaryEl.innerHTML =
    `n = <strong>${result.n}</strong> &middot; Mean = <strong>${result.mean.toFixed(2)}</strong> &middot; ` +
    `MR&#772; = <strong>${result.mrBar.toFixed(2)}</strong><br>` +
    `UCL = <strong>${result.ucl.toFixed(2)}</strong> &middot; LCL = <strong>${result.lcl.toFixed(2)}</strong> &middot; ` +
    `${flagged} of ${result.n} day(s) flagged out-of-control`;
}

function pqcRenderAll() {
  const result = pqcCompute(pqcEntries);
  pqcRenderChart(result);
  pqcRenderTable(result);
  pqcRenderSummary(result);
}

document.getElementById('pqcAdd').addEventListener('click', () => {
  const date = document.getElementById('pqcDate').value;
  const value = parseFloat(document.getElementById('pqcValue').value);
  const metricName = document.getElementById('pqcMetricName').value.trim() || 'Metric';
  localStorage.setItem(PQC_METRIC_KEY, metricName);

  if (!date || isNaN(value)) {
    window.alert('Enter a valid date and value.');
    return;
  }

  pqcEntries = pqcEntries.filter(e => e.date !== date);
  pqcEntries.push({ date, value });
  pqcSave(pqcEntries);
  pqcRenderAll();
});

document.getElementById('pqcClear').addEventListener('click', () => {
  if (window.confirm('Clear your entire log? This cannot be undone.')) {
    pqcEntries = [];
    pqcSave(pqcEntries);
    pqcRenderAll();
  }
});

document.getElementById('pqcSample').addEventListener('click', () => {
  pqcEntries = pqcSampleData();
  pqcSave(pqcEntries);
  document.getElementById('pqcMetricName').value = 'Sleep Hours';
  localStorage.setItem(PQC_METRIC_KEY, 'Sleep Hours');
  pqcRenderAll();
});

pqcRenderAll();
