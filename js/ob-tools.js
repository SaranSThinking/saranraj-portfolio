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

  document.getElementById('lsResult').innerHTML =
    `Directive: <strong>${directive}/10</strong> &middot; Participative: <strong>${participative}/10</strong> &middot; Delegative: <strong>${delegative}/10</strong><br>` +
    `Primary lean: <strong>${lean}</strong> - ${descriptions[lean]}`;
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
