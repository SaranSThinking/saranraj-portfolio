// ---------- NASA-TLX (Raw TLX, unweighted) ----------
document.getElementById('tlxCalc').addEventListener('click', () => {
  const ids = ['tlxMental', 'tlxPhysical', 'tlxTemporal', 'tlxPerformance', 'tlxEffort', 'tlxFrustration'];
  const values = ids.map(id => parseFloat(document.getElementById(id).value));
  if (values.some(v => isNaN(v))) {
    document.getElementById('tlxResult').textContent = 'Enter all six subscale ratings (0-100).';
    return;
  }
  const raw = values.reduce((a, b) => a + b, 0) / values.length;

  let level;
  if (raw <= 20) level = 'Low workload';
  else if (raw <= 50) level = 'Moderate workload';
  else if (raw <= 70) level = 'High workload';
  else level = 'Very high workload - redesign the task';

  const tlxLabels = ['Mental demand', 'Physical demand', 'Temporal demand', 'Performance (perceived)', 'Effort', 'Frustration'];
  const tlxDriverIdx = values.indexOf(Math.max(...values));
  const tlxDriver = tlxLabels[tlxDriverIdx];
  const tlxFix = {
    'Mental demand': 'simplify the decision points or add checklists/prompts so less has to be held in working memory.',
    'Physical demand': 'look at force, repetition, or posture in the task itself, not the person\'s effort.',
    'Temporal demand': 'the task or pace needs more slack - this is a scheduling problem, not a skill problem.',
    'Performance (perceived)': 'the person feels they\'re falling short - check whether the goal or standard is actually achievable as the task is currently designed.',
    'Effort': 'even if the task looks moderate on paper, this person is working hard to keep up - that\'s not sustainable long-term.',
    'Frustration': 'look for friction in the process itself - bad tools or unclear instructions - rather than the task\'s inherent difficulty.'
  }[tlxDriver];

  document.getElementById('tlxResult').innerHTML =
    `Raw TLX = <strong>${raw.toFixed(1)}</strong> / 100 &middot; ${level}<br>` +
    `<span class="tool-recommend"><strong>${tlxDriver}</strong> is the highest subscale (${values[tlxDriverIdx]}/100) - ${tlxFix}</span>`;
});

// ---------- Fitts's Law ----------
document.getElementById('fittsCalc').addEventListener('click', () => {
  const D = parseFloat(document.getElementById('fittsD').value);
  const W = parseFloat(document.getElementById('fittsW').value);
  const resultEl = document.getElementById('fittsResult');
  if (!D || !W || D <= 0 || W <= 0) {
    resultEl.textContent = 'Enter positive distance and width values.';
    return;
  }
  const a = 0.1, b = 0.2; // typical empirical constants (seconds, seconds/bit)
  const ID = Math.log2((2 * D) / W);
  const MT = a + b * ID;

  const action = ID > 4
    ? `This is a demanding target (ID &gt; 4 bits) - growing the target width usually buys more speed than shrinking the distance, since width sits directly in the log term. Try doubling W before you touch D.`
    : `This target is comfortably easy to hit (ID under 4 bits) - movement time is already close to the floor here; further gains would have to come from cutting distance, not widening the target.`;

  resultEl.innerHTML =
    `Index of Difficulty = <strong>${ID.toFixed(2)} bits</strong> &middot; ` +
    `Predicted Movement Time &asymp; <strong>${MT.toFixed(2)} s</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
});

// ---------- Signal Detection Theory ----------
function invNorm(p) {
  // Acklam's rational approximation to the inverse normal CDF
  if (p <= 0) p = 0.0001;
  if (p >= 1) p = 0.9999;
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
             1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
             6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
             -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const plow = 0.02425, phigh = 1 - plow;
  let q, r;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= phigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
           (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
            ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

document.getElementById('sdtCalc').addEventListener('click', () => {
  const hit = parseFloat(document.getElementById('sdtHit').value);
  const fa = parseFloat(document.getElementById('sdtFa').value);
  const resultEl = document.getElementById('sdtResult');
  if (isNaN(hit) || isNaN(fa) || hit <= 0 || hit >= 1 || fa <= 0 || fa >= 1) {
    resultEl.textContent = 'Enter hit and false-alarm rates strictly between 0 and 1.';
    return;
  }
  const zHit = invNorm(hit);
  const zFa = invNorm(fa);
  const dPrime = zHit - zFa;
  const criterion = -0.5 * (zHit + zFa);

  let bias, action;
  if (criterion > 0.2) {
    bias = 'Conservative - biased toward missing signals';
    action = `Lower the response threshold if missed signals are more costly than false alarms in this context - right now the person/system needs more certainty before responding than the situation may warrant.`;
  } else if (criterion < -0.2) {
    bias = 'Liberal - biased toward false alarms';
    action = `Raise the response threshold if false alarms are more costly than misses here - right now it's trigger-happy, flagging things that aren't really there.`;
  } else {
    bias = 'Roughly neutral response bias';
    action = `Bias is balanced. If you want to shift it, that should be a deliberate call based on which error - a miss or a false alarm - is more costly in this specific context, not left to accident.`;
  }

  resultEl.innerHTML =
    `d&prime; = <strong>${dPrime.toFixed(2)}</strong> &middot; Criterion c = <strong>${criterion.toFixed(2)}</strong> &middot; ${bias}<br>` +
    `<span class="tool-recommend">${action}</span>`;
});
