const PJ_ENTRIES_KEY = 'pj_entries_v1';

function pjLoad() {
  const raw = localStorage.getItem(PJ_ENTRIES_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) { /* fall through */ } }
  return [];
}
function pjSave(entries) { localStorage.setItem(PJ_ENTRIES_KEY, JSON.stringify(entries)); }

let pjEntries = pjLoad();
document.getElementById('pjDate').valueAsDate = new Date();

// ---------- Cross-tool snapshot readers ----------
function pjSupplyChainSnapshot() {
  const raw = localStorage.getItem('psc_items_v1');
  if (!raw) return null;
  const items = JSON.parse(raw);
  if (!items.length) return null;
  const needsAttention = items.filter(it => it.stock <= it.avgDailyUsage * it.leadTime * 1.2).length;
  return { label: 'Supply Chain', text: `${items.length} pantry items, ${needsAttention} need attention` };
}

function pjQualitySnapshot() {
  const raw = localStorage.getItem('pqc_log_v1');
  if (!raw) return null;
  const entries = JSON.parse(raw);
  if (!entries.length) return null;
  if (entries.length < 2) return { label: 'Quality Control', text: `1 reading logged` };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const values = sorted.map(e => e.value);
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const mrs = [];
  for (let i = 1; i < n; i++) mrs.push(Math.abs(values[i] - values[i - 1]));
  const mrBar = mrs.reduce((a, b) => a + b, 0) / mrs.length;
  const ucl = mean + 2.66 * mrBar, lcl = mean - 2.66 * mrBar;
  const flagged = values.filter(v => v > ucl || v < lcl).length;
  const metricName = localStorage.getItem('pqc_metric_name_v1') || 'metric';

  return { label: 'Quality Control', text: `${metricName}: ${n} logged, ${flagged} out-of-control` };
}

function pjStudySnapshot() {
  const raw = localStorage.getItem('psp_data_v1');
  if (!raw) return null;
  const points = JSON.parse(raw);
  if (!points.length) return null;
  if (points.length < 2) return { label: 'Study', text: `1 session logged` };

  const n = points.length;
  const xs = points.map(p => p.hours), ys = points.map(p => p.score);
  const xBar = xs.reduce((a, b) => a + b, 0) / n, yBar = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - xBar) * (ys[i] - yBar); sxx += (xs[i] - xBar) ** 2; }
  const slope = sxx ? sxy / sxx : 0;
  const intercept = yBar - slope * xBar;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) { const yHat = slope * xs[i] + intercept; ssRes += (ys[i] - yHat) ** 2; ssTot += (ys[i] - yBar) ** 2; }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;

  return { label: 'Study', text: `${n} sessions, R&sup2;=${r2.toFixed(2)}` };
}

function pjProductivitySnapshot() {
  const raw = localStorage.getItem('ppo_log_v1');
  if (!raw) return null;
  const entries = JSON.parse(raw);
  if (!entries.length) return null;

  const oees = entries.map(e => {
    const availability = e.plannedHours > 0 ? (e.actualHours / e.plannedHours) * 100 : 0;
    const performance = e.tasksPlanned > 0 ? (e.tasksCompleted / e.tasksPlanned) * 100 : 0;
    const quality = e.tasksCompleted > 0 ? ((e.tasksCompleted - e.tasksReworked) / e.tasksCompleted) * 100 : 100;
    return (availability * performance * quality) / 10000;
  });
  const avg = oees.reduce((a, b) => a + b, 0) / oees.length;

  return { label: 'Productivity', text: `Avg OEE ${avg.toFixed(0)}% across ${entries.length} day(s)` };
}

function pjBreakevenSnapshot() {
  const raw = localStorage.getItem('pbe_log_v1');
  if (!raw) return null;
  const entries = JSON.parse(raw);
  if (!entries.length) return null;
  const last = entries[entries.length - 1];
  return { label: 'Breakeven', text: `${entries.length} decision(s), latest: "${last.name}"` };
}

function pjMcdmSnapshot() {
  const raw = localStorage.getItem('pmcdm_last_result_v1');
  if (!raw) return null;
  const last = JSON.parse(raw);
  return { label: 'Decision-Making', text: `"${last.decisionName}" &rarr; ${last.winner}` };
}

function pjErgonomicsSnapshot() {
  const raw = localStorage.getItem('pea_log_v1');
  if (!raw) return null;
  const entries = JSON.parse(raw);
  if (!entries.length) return null;
  const last = entries[entries.length - 1];
  return { label: 'Ergonomics', text: `Workspace score ${last.score.toFixed(0)}/100` };
}

function pjBuildSnapshot() {
  return [
    pjSupplyChainSnapshot(),
    pjQualitySnapshot(),
    pjStudySnapshot(),
    pjProductivitySnapshot(),
    pjBreakevenSnapshot(),
    pjMcdmSnapshot(),
    pjErgonomicsSnapshot()
  ].filter(Boolean);
}

function pjRenderSnapshotChips(snapshot, containerId) {
  const el = document.getElementById(containerId);
  if (!snapshot.length) {
    el.innerHTML = containerId === 'pjSnapshotPreview'
      ? 'No data yet — visit the other tools and log a few things, then come back here.'
      : '';
    return;
  }
  el.innerHTML = `<div class="pj-snapshot-row">${snapshot.map(s =>
    `<span class="pj-snapshot-chip"><strong>${s.label}:</strong> ${s.text}</span>`
  ).join('')}</div>`;
}

function pjRenderPreview() {
  pjRenderSnapshotChips(pjBuildSnapshot(), 'pjSnapshotPreview');
}

function pjRenderTimeline() {
  const timelineEl = document.getElementById('pjTimeline');
  const filter = document.getElementById('pjFilter').value;
  const filtered = filter === 'All' ? pjEntries : pjEntries.filter(e => e.tag === filter);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  if (!sorted.length) {
    timelineEl.innerHTML = '<p class="tool-desc">No entries yet.</p>';
    return;
  }

  timelineEl.innerHTML = sorted.map(e => `
    <div class="pj-entry">
      <div class="pj-entry-header">
        <span class="tool-tag">${e.tag}</span>
        <span class="pj-entry-date">${e.date}</span>
      </div>
      <p class="pj-entry-text">${e.text}</p>
      ${e.snapshot && e.snapshot.length ? `<div class="pj-snapshot-row">${e.snapshot.map(s =>
        `<span class="pj-snapshot-chip"><strong>${s.label}:</strong> ${s.text}</span>`
      ).join('')}</div>` : ''}
    </div>
  `).join('');
}

document.getElementById('pjAdd').addEventListener('click', () => {
  const date = document.getElementById('pjDate').value;
  const tag = document.getElementById('pjTag').value;
  const text = document.getElementById('pjText').value.trim();
  const attach = document.getElementById('pjAttach').checked;

  if (!date || !text) {
    window.alert('Enter a date and some text for the entry.');
    return;
  }

  pjEntries.push({
    date, tag, text,
    snapshot: attach ? pjBuildSnapshot() : null
  });
  pjSave(pjEntries);
  document.getElementById('pjText').value = '';
  pjRenderTimeline();
});

document.getElementById('pjFilter').addEventListener('change', pjRenderTimeline);

document.getElementById('pjSample').addEventListener('click', () => {
  const today = new Date();
  const iso = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().slice(0, 10);
  };

  pjEntries.push(
    {
      date: iso(2), tag: 'Productivity',
      text: 'Rough day — kept getting pulled into meetings. Availability was clearly the bottleneck, not effort.',
      snapshot: [{ label: 'Productivity', text: 'Avg OEE 52% across 3 day(s)' }]
    },
    {
      date: iso(1), tag: 'Study',
      text: 'Fit is finally strong enough to trust — going with the trend line\'s recommended hours for the next exam.',
      snapshot: [{ label: 'Study', text: '8 sessions, R&sup2;=0.94' }]
    },
    {
      date: iso(0), tag: 'Ergonomics',
      text: 'Raised my chair and monitor today after the workspace audit flagged both. Should re-run this in a week.',
      snapshot: [{ label: 'Ergonomics', text: 'Workspace score 61/100' }]
    }
  );
  pjSave(pjEntries);
  pjRenderTimeline();
});

pjRenderPreview();
pjRenderTimeline();
