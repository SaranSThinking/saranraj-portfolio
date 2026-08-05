const PEA_LOG_KEY = 'pea_log_v1';

function peaLoad() {
  const raw = localStorage.getItem(PEA_LOG_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) { /* fall through */ } }
  return [];
}
function peaSave(entries) { localStorage.setItem(PEA_LOG_KEY, JSON.stringify(entries)); }

let peaEntries = peaLoad();

function peaFitPenalty(delta) {
  const abs = Math.abs(delta);
  if (abs <= 3) return 0;
  return Math.min(20, 5 + (abs - 3) * 1.5);
}

function peaRun() {
  const height = parseFloat(document.getElementById('peaHeight').value);
  const desk = parseFloat(document.getElementById('peaDesk').value);
  const chair = parseFloat(document.getElementById('peaChair').value);
  const monitor = parseFloat(document.getElementById('peaMonitor').value);
  const upperArm = parseInt(document.getElementById('peaUpperArm').value, 10);
  const wrist = parseInt(document.getElementById('peaWrist').value, 10);
  const neck = parseInt(document.getElementById('peaNeck').value, 10);
  const trunk = parseInt(document.getElementById('peaTrunk').value, 10);
  const scoreEl = document.getElementById('peaScore');
  const recEl = document.getElementById('peaRecommendations');

  if ([height, desk, chair, monitor].some(v => isNaN(v) || v <= 0)) {
    scoreEl.textContent = 'Enter valid positive measurements.';
    return;
  }

  const recDesk = 0.40 * height;
  const recChair = 0.25 * height;
  const recMonitor = 0.75 * height;

  const deskDelta = desk - recDesk;
  const chairDelta = chair - recChair;
  const monitorDelta = monitor - recMonitor;

  const deskPenalty = peaFitPenalty(deskDelta);
  const chairPenalty = peaFitPenalty(chairDelta);
  const monitorPenalty = peaFitPenalty(monitorDelta);

  const postureScore = upperArm + wrist + neck + trunk; // 4 (best) to 12 (worst)
  const posturePenalty = ((postureScore - 4) / 8) * 40;

  const rawScore = 100 - deskPenalty - chairPenalty - monitorPenalty - posturePenalty;
  const score = Math.max(0, Math.min(100, rawScore));

  let tier;
  if (score >= 80) tier = 'Good - minor or no issues';
  else if (score >= 60) tier = 'Needs improvement - a few fixable issues';
  else tier = 'Poor - multiple issues compounding';

  scoreEl.innerHTML = `Workspace Ergonomic Score = <strong>${score.toFixed(0)}/100</strong> &middot; ${tier}`;

  const recs = [];
  if (deskPenalty > 0) recs.push(`Desk is ${desk > recDesk ? 'higher' : 'lower'} than recommended by ${Math.abs(deskDelta).toFixed(1)}cm - target ≈ ${recDesk.toFixed(1)}cm.`);
  if (chairPenalty > 0) recs.push(`Chair is ${chair > recChair ? 'higher' : 'lower'} than recommended by ${Math.abs(chairDelta).toFixed(1)}cm - target ≈ ${recChair.toFixed(1)}cm.`);
  if (monitorPenalty > 0) recs.push(`Monitor top is ${monitor > recMonitor ? 'higher' : 'lower'} than recommended by ${Math.abs(monitorDelta).toFixed(1)}cm - target ≈ ${recMonitor.toFixed(1)}cm.`);
  if (upperArm >= 2) recs.push('Bring keyboard/mouse closer to reduce shoulder reach.');
  if (wrist >= 2) recs.push('Consider a wrist rest or lower keyboard tray to neutralize wrist angle.');
  if (neck >= 2) recs.push('Raise monitor top closer to eye level to reduce neck flexion.');
  if (trunk >= 2) recs.push('Add lumbar support or adjust chair depth to reduce slouch.');

  recEl.innerHTML = recs.length
    ? `<div class="tool-result"><strong>Prioritized fixes:</strong><ul style="margin:8px 0 0;padding-left:18px;">${recs.map(r => `<li>${r}</li>`).join('')}</ul></div>`
    : '<div class="tool-result">No issues flagged - your setup matches the recommended fit and posture targets.</div>';

  peaEntries.push({
    date: new Date().toISOString().slice(0, 10),
    height, desk, chair, monitor, upperArm, wrist, neck, trunk, score
  });
  peaSave(peaEntries);
  peaRenderTable();
}

function peaRenderTable() {
  const tableEl = document.getElementById('peaTable');
  if (!peaEntries.length) { tableEl.innerHTML = ''; return; }
  const head = `<tr><th>Date</th><th>Score</th><th>Desk</th><th>Chair</th><th>Monitor</th></tr>`;
  const body = [...peaEntries].reverse().map(e => `
    <tr>
      <td>${e.date}</td>
      <td class="${e.score < 60 ? 'pp-flag-out' : ''}">${e.score.toFixed(0)}/100</td>
      <td>${e.desk}cm</td><td>${e.chair}cm</td><td>${e.monitor}cm</td>
    </tr>
  `).join('');
  tableEl.innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
}

document.getElementById('peaCalc').addEventListener('click', peaRun);

document.getElementById('peaSample').addEventListener('click', () => {
  document.getElementById('peaHeight').value = '165';
  document.getElementById('peaDesk').value = '82';
  document.getElementById('peaChair').value = '37';
  document.getElementById('peaMonitor').value = '95';
  document.getElementById('peaUpperArm').value = '3';
  document.getElementById('peaWrist').value = '3';
  document.getElementById('peaNeck').value = '3';
  document.getElementById('peaTrunk').value = '3';
  peaRun();
});

peaRenderTable();
