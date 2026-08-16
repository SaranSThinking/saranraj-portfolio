// ---------- Team Constraint Diagnostic (original framework) ----------
const TCD_DIMENSIONS = [
  { id: 'tcdTrust', name: 'Trust', tip: 'Run a small, visible reliability test - hit one commitment publicly and name it as a trust deposit.' },
  { id: 'tcdComm', name: 'Communication', tip: 'Install one standing checkpoint (daily huddle or shared board) - most communication gaps are a missing ritual, not a missing skill.' },
  { id: 'tcdRole', name: 'Role Clarity', tip: 'Run a RACI pass on the team’s current work this week - ambiguity here quietly taxes every other dimension.' },
  { id: 'tcdAccount', name: 'Accountability', tip: 'Make commitments visible and time-boxed - accountability fails when commitments are private and open-ended.' },
  { id: 'tcdSafety', name: 'Psychological Safety', tip: 'Explicitly reward a surfaced mistake or dissenting view in the next team meeting - safety is built by what gets rewarded, not what gets said.' },
  { id: 'tcdCoord', name: 'Coordination & Cohesion', tip: 'Map the handoff points between team members - most coordination failures live at the handoff, not within any one role.' },
  { id: 'tcdMotivation', name: 'Motivation & Engagement', tip: 'Reconnect the team’s current task to a visible outcome they actually care about - competence without meaning fades fast.' }
];

function tcdScores() {
  return TCD_DIMENSIONS.map(d => parseInt(document.getElementById(d.id).value, 10));
}

function tcdThroughput(scores) {
  const min = Math.min(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return { tti: min * 0.7 + avg * 0.3, min, avg };
}

document.getElementById('tcdCalc').addEventListener('click', () => {
  const scores = tcdScores();
  const { tti, min, avg } = tcdThroughput(scores);
  const constraintIdx = scores.indexOf(min);
  const constraint = TCD_DIMENSIONS[constraintIdx];

  document.getElementById('tcdResult').innerHTML =
    `Naive average: <strong>${avg.toFixed(1)}/10</strong> &middot; Team Throughput Index: <strong>${tti.toFixed(1)}/10</strong><br>` +
    `Your team's constraint: <strong>${constraint.name}</strong> (${min}/10)<br>` +
    `<span style="color:var(--text-muted);font-size:0.85rem;">Your average looks like ${avg.toFixed(1)}, but the team can only actually deliver at ${tti.toFixed(1)} - the constraint sets the ceiling, the way one slow station caps an entire production line's throughput.</span><br><br>` +
    `<strong>Priority move:</strong> ${constraint.tip}`;
  document.getElementById('tcdSimResult').innerHTML = '';
});

document.getElementById('tcdSimConstraint').addEventListener('click', () => {
  const scores = tcdScores();
  const { tti, min } = tcdThroughput(scores);
  const constraintIdx = scores.indexOf(min);
  const newScores = [...scores];
  newScores[constraintIdx] = Math.min(10, newScores[constraintIdx] + 2);
  const { tti: newTti } = tcdThroughput(newScores);
  document.getElementById('tcdSimResult').innerHTML =
    `Fix the constraint (+2 to ${TCD_DIMENSIONS[constraintIdx].name}): <strong>${tti.toFixed(1)} &rarr; ${newTti.toFixed(1)}</strong> ` +
    `<span style="color:var(--teal);font-weight:700;">(+${(newTti - tti).toFixed(1)})</span>`;
});

document.getElementById('tcdSimStrongest').addEventListener('click', () => {
  const scores = tcdScores();
  const { tti } = tcdThroughput(scores);
  const maxIdx = scores.indexOf(Math.max(...scores));
  const newScores = [...scores];
  newScores[maxIdx] = Math.min(10, newScores[maxIdx] + 2);
  const { tti: newTti } = tcdThroughput(newScores);
  const prev = document.getElementById('tcdSimResult').innerHTML;
  document.getElementById('tcdSimResult').innerHTML = prev + (prev ? '<br>' : '') +
    `Polish your strength instead (+2 to ${TCD_DIMENSIONS[maxIdx].name}): <strong>${tti.toFixed(1)} &rarr; ${newTti.toFixed(1)}</strong> ` +
    `<span style="color:var(--red);font-weight:700;">(+${(newTti - tti).toFixed(1)})</span>`;
});

document.getElementById('tcdCopyCitation').addEventListener('click', () => {
  const text = document.getElementById('tcdCitationText').textContent.replace(/\s+/g, ' ').trim();
  navigator.clipboard.writeText(text).then(() => {
    const confirmEl = document.getElementById('tcdCopyConfirm');
    confirmEl.style.display = 'inline';
    setTimeout(() => { confirmEl.style.display = 'none'; }, 2500);
  }).catch(() => {});
});

// ---------- Leadership Style Self-Assessment ----------
document.getElementById('lsCalc').addEventListener('click', () => {
  const q = id => parseInt(document.getElementById(id).value, 10);
  const directive = q('lsQ1') + q('lsQ4');
  const participative = q('lsQ2') + q('lsQ5');
  const delegative = q('lsQ3') + q('lsQ6');

  const scores = { Directive: directive, Participative: participative, Delegative: delegative };
  const lean = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  const descriptions = {
    Directive: 'You default to setting clear expectations and correcting deviations quickly - effective in high-risk or time-critical situations, but can suppress input if overused.',
    Participative: 'You lean toward shared decision-making and consensus-building - strong for buy-in and morale, but can slow decisions under time pressure.',
    Delegative: 'You default to handing off ownership to capable people - powerful for developing autonomy, but risky with an inexperienced team.'
  };
  const actions = {
    Directive: 'This week, pick one decision you\'d normally make alone and ask the team for input first - your risk isn\'t under-leading, it\'s under-listening.',
    Participative: 'This week, pick one decision with a clear deadline and make the call yourself instead of seeking consensus - practice trusting your own judgment under time pressure.',
    Delegative: 'This week, check in on one delegated task earlier than you normally would - delegation without any checkpoint is how small problems become late surprises.'
  };

  document.getElementById('lsResult').innerHTML =
    `Directive: <strong>${directive}/10</strong> &middot; Participative: <strong>${participative}/10</strong> &middot; Delegative: <strong>${delegative}/10</strong><br>` +
    `Primary lean: <strong>${lean}</strong> - ${descriptions[lean]}<br>` +
    `<span class="tool-recommend">${actions[lean]}</span>`;
});

// ---------- Tuckman Stage Finder ----------
const TUCKMAN_INFO = {
  forming: {
    name: 'Forming',
    tip: 'Provide clear structure and purpose - ambiguity is the main risk here, not conflict.'
  },
  storming: {
    name: 'Storming',
    tip: 'Surface the conflict openly and clarify roles - suppressing it now just delays norming.'
  },
  norming: {
    name: 'Norming',
    tip: 'Reinforce the norms that are working and start stepping back from close supervision.'
  },
  performing: {
    name: 'Performing',
    tip: 'Protect autonomy and remove blockers - your job shifts from directing to unblocking.'
  },
  adjourning: {
    name: 'Adjourning',
    tip: 'Run a deliberate close-out: capture lessons learned before the team disbands or reforms.'
  }
};

document.getElementById('tuckmanCalc').addEventListener('click', () => {
  const key = document.getElementById('tuckmanBehavior').value;
  const info = TUCKMAN_INFO[key];
  document.getElementById('tuckmanResult').innerHTML =
    `Stage: <strong>${info.name}</strong><br>${info.tip}`;
});
