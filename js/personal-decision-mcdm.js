const PMCDM_LOG_KEY = 'pmcdm_log_v1';
const PMCDM_LAST_KEY = 'pmcdm_last_result_v1';

function pmcdmParseList(str) {
  return str.split(',').map(s => s.trim()).filter(Boolean);
}
function pmcdmParseWeights(str) {
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}

function pmcdmLoadLog() {
  const raw = localStorage.getItem(PMCDM_LOG_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) { /* fall through */ } }
  return [];
}
function pmcdmSaveLog(entries) { localStorage.setItem(PMCDM_LOG_KEY, JSON.stringify(entries)); }

let pmcdmLog = pmcdmLoadLog();
let pmcdmCurrentCriteria = [];
let pmcdmCurrentOptions = [];

function pmcdmRenderMatrix() {
  const criteria = pmcdmParseList(document.getElementById('pmcdmCriteria').value);
  const options = pmcdmParseList(document.getElementById('pmcdmOptions').value);
  const matrixEl = document.getElementById('pmcdmMatrix');

  if (!criteria.length || !options.length) {
    matrixEl.innerHTML = '<p class="tool-desc">Enter at least one criterion and one option.</p>';
    return;
  }

  pmcdmCurrentCriteria = criteria;
  pmcdmCurrentOptions = options;

  const headerCells = criteria.map(c => `<th>${c}</th>`).join('');
  const rows = options.map((opt, oi) => {
    const cells = criteria.map((c, ci) =>
      `<td><input type="number" min="1" max="10" value="5" data-opt="${oi}" data-crit="${ci}" class="pmcdm-rating"></td>`
    ).join('');
    return `<tr><td>${opt}</td>${cells}</tr>`;
  }).join('');

  matrixEl.innerHTML = `
    <table class="pmcdm-matrix-table">
      <thead><tr><th>Rate 1&ndash;10</th>${headerCells}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function pmcdmRenderRanking(scores) {
  const rankingEl = document.getElementById('pmcdmRanking');
  const maxScore = Math.max(...scores.map(s => s.score), 0.01);
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  rankingEl.innerHTML = sorted.map((s, i) => `
    <div class="pp-rank-row ${i === 0 ? 'pp-rank-winner' : ''}">
      <div class="pp-rank-label">${i === 0 ? '🏆 ' : ''}${s.option}</div>
      <div class="pp-rank-track">
        <div class="pp-rank-fill" style="width:${(s.score / maxScore) * 100}%">
          <span>${s.score.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function pmcdmRenderTable() {
  const tableEl = document.getElementById('pmcdmTable');
  if (!pmcdmLog.length) { tableEl.innerHTML = ''; return; }
  const head = `<tr><th>Decision</th><th>Winner</th><th>Score</th><th>Date</th></tr>`;
  const body = [...pmcdmLog].reverse().map(e => `
    <tr><td>${e.decisionName}</td><td>${e.winner}</td><td>${e.winnerScore.toFixed(2)}</td><td>${e.date}</td></tr>
  `).join('');
  tableEl.innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
}

document.getElementById('pmcdmGenerate').addEventListener('click', pmcdmRenderMatrix);

document.getElementById('pmcdmCalc').addEventListener('click', () => {
  if (!pmcdmCurrentCriteria.length || !pmcdmCurrentOptions.length) {
    window.alert('Generate the rating matrix first.');
    return;
  }

  const weightsRaw = pmcdmParseWeights(document.getElementById('pmcdmWeights').value);
  if (weightsRaw.length !== pmcdmCurrentCriteria.length) {
    window.alert('Number of weights must match number of criteria.');
    return;
  }
  const weightSum = weightsRaw.reduce((a, b) => a + b, 0);
  if (weightSum <= 0) {
    window.alert('Weights must sum to a positive number.');
    return;
  }
  const weights = weightsRaw.map(w => (w / weightSum) * 100);

  const ratingInputs = document.querySelectorAll('.pmcdm-rating');
  const ratings = pmcdmCurrentOptions.map(() => pmcdmCurrentCriteria.map(() => 5));
  ratingInputs.forEach(input => {
    const oi = parseInt(input.getAttribute('data-opt'), 10);
    const ci = parseInt(input.getAttribute('data-crit'), 10);
    ratings[oi][ci] = parseFloat(input.value) || 0;
  });

  const scores = pmcdmCurrentOptions.map((opt, oi) => {
    const score = ratings[oi].reduce((sum, r, ci) => sum + r * (weights[ci] / 100), 0);
    return { option: opt, score };
  });

  pmcdmRenderRanking(scores);

  const winner = [...scores].sort((a, b) => b.score - a.score)[0];
  const decisionName = document.getElementById('pmcdmName').value.trim() || 'Untitled Decision';
  const entry = {
    decisionName,
    criteria: pmcdmCurrentCriteria,
    weights,
    options: pmcdmCurrentOptions,
    scores,
    winner: winner.option,
    winnerScore: winner.score,
    date: new Date().toISOString().slice(0, 10)
  };
  pmcdmLog.push(entry);
  pmcdmSaveLog(pmcdmLog);
  localStorage.setItem(PMCDM_LAST_KEY, JSON.stringify(entry));
  pmcdmRenderTable();
});

document.getElementById('pmcdmSample').addEventListener('click', () => {
  document.getElementById('pmcdmName').value = 'Choosing a Job Offer';
  document.getElementById('pmcdmCriteria').value = 'Salary, Growth, Location, Work-Life Balance';
  document.getElementById('pmcdmWeights').value = '35, 25, 20, 20';
  document.getElementById('pmcdmOptions').value = 'Offer A, Offer B, Offer C';
  pmcdmRenderMatrix();

  const sampleRatings = [
    [9, 6, 7, 5], // Offer A
    [6, 9, 8, 7], // Offer B
    [7, 7, 9, 9]  // Offer C
  ];
  document.querySelectorAll('.pmcdm-rating').forEach(input => {
    const oi = parseInt(input.getAttribute('data-opt'), 10);
    const ci = parseInt(input.getAttribute('data-crit'), 10);
    input.value = sampleRatings[oi][ci];
  });

  document.getElementById('pmcdmCalc').click();
});

pmcdmRenderTable();
