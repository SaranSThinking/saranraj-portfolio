// ---------- RULA / REBA mode toggle ----------
const modeRula = document.getElementById('modeRula');
const modeReba = document.getElementById('modeReba');
const rulaPanel = document.getElementById('rulaPanel');
const rebaPanel = document.getElementById('rebaPanel');

modeRula.addEventListener('click', () => {
  modeRula.classList.add('active');
  modeReba.classList.remove('active');
  rulaPanel.style.display = '';
  rebaPanel.style.display = 'none';
});
modeReba.addEventListener('click', () => {
  modeReba.classList.add('active');
  modeRula.classList.remove('active');
  rebaPanel.style.display = '';
  rulaPanel.style.display = 'none';
});

// ---------- RULA scoring (simplified, educational) ----------
document.getElementById('rulaCalc').addEventListener('click', () => {
  const upperArm = parseInt(document.getElementById('rUpperArm').value, 10);
  const lowerArm = parseInt(document.getElementById('rLowerArm').value, 10);
  const wrist = parseInt(document.getElementById('rWrist').value, 10);
  const neck = parseInt(document.getElementById('rNeck').value, 10);
  const trunk = parseInt(document.getElementById('rTrunk').value, 10);
  const muscle = parseInt(document.getElementById('rMuscle').value, 10);
  const force = parseInt(document.getElementById('rForce').value, 10);

  const score = upperArm + lowerArm + wrist + neck + trunk + muscle + force;

  let level, action;
  if (score <= 8) { level = 'Action Level 1'; action = 'Acceptable posture.'; }
  else if (score <= 11) { level = 'Action Level 2'; action = 'Further investigation; change may be needed.'; }
  else if (score <= 15) { level = 'Action Level 3'; action = 'Investigate soon; change required.'; }
  else { level = 'Action Level 4'; action = 'Investigate and change immediately.'; }

  const rulaFactors = { 'Upper arm': upperArm, 'Lower arm': lowerArm, Wrist: wrist, Neck: neck, Trunk: trunk, 'Muscle use': muscle, Force: force };
  const rulaDriver = Object.entries(rulaFactors).sort((a, b) => b[1] - a[1])[0][0];
  const rulaFix = {
    'Upper arm': 'bring the work closer to the body or lower the working height - this cuts shoulder abduction/flexion directly.',
    'Lower arm': 'keep the elbow closer to 90&deg; and avoid reaching across the body.',
    Wrist: 'add a wrist rest and realign the tool/keyboard angle to reduce deviation.',
    Neck: 'raise the visual target closer to eye level - most neck load comes from looking down.',
    Trunk: 'add lumbar support or adjust seat/work height to cut forward bend or twist.',
    'Muscle use': 'break up static holds with micro-breaks or task rotation - this is a duration problem, not a posture one.',
    Force: 'reduce the weight/force required or add mechanical assistance before touching posture at all.'
  }[rulaDriver];

  document.getElementById('rulaResult').innerHTML =
    `Score = <strong>${score}</strong> &middot; ${level} &mdash; ${action}<br>` +
    `<span class="tool-recommend"><strong>${rulaDriver}</strong> is your biggest contributor - ${rulaFix}</span>`;
});

// ---------- REBA scoring (simplified, educational) ----------
document.getElementById('rebaCalc').addEventListener('click', () => {
  const trunk = parseInt(document.getElementById('bTrunk').value, 10);
  const neck = parseInt(document.getElementById('bNeck').value, 10);
  const legs = parseInt(document.getElementById('bLegs').value, 10);
  const upperArm = parseInt(document.getElementById('bUpperArm').value, 10);
  const lowerArm = parseInt(document.getElementById('bLowerArm').value, 10);
  const wrist = parseInt(document.getElementById('bWrist').value, 10);
  const load = parseInt(document.getElementById('bLoad').value, 10);
  const coupling = parseInt(document.getElementById('bCoupling').value, 10);
  const activity = parseInt(document.getElementById('bActivity').value, 10);

  const score = trunk + neck + legs + upperArm + lowerArm + wrist + load + coupling + activity;

  let level, action;
  if (score <= 9) { level = 'Negligible risk'; action = 'No action necessary.'; }
  else if (score <= 14) { level = 'Low risk'; action = 'Action may be needed.'; }
  else if (score <= 19) { level = 'Medium risk'; action = 'Further investigation; change soon.'; }
  else if (score <= 23) { level = 'High risk'; action = 'Investigate and implement change soon.'; }
  else { level = 'Very high risk'; action = 'Implement change immediately.'; }

  const rebaFactors = { Trunk: trunk, Neck: neck, Legs: legs, 'Upper arm': upperArm, 'Lower arm': lowerArm, Wrist: wrist, Load: load, Coupling: coupling, Activity: activity };
  const rebaDriver = Object.entries(rebaFactors).sort((a, b) => b[1] - a[1])[0][0];
  const rebaFix = {
    Trunk: 'add lumbar support or adjust seat/work height to cut forward bend or twist.',
    Neck: 'raise the visual target closer to eye level - most neck load comes from looking down.',
    Legs: 'check for uneven weight-bearing or add a footrest - unsupported or asymmetric stance drives this up fast.',
    'Upper arm': 'bring the work closer to the body or lower the working height.',
    'Lower arm': 'keep the elbow closer to 90&deg; and avoid reaching across the body.',
    Wrist: 'add a wrist rest and realign the tool/keyboard angle.',
    Load: 'reduce the weight or force required, or add lifting aids - this is the highest-leverage fix on the list.',
    Coupling: 'improve the grip - better handles or a redesigned grip point cuts this immediately.',
    Activity: 'break up static holds or rapid repeated motion - this is a duration/pattern problem, not a posture one.'
  }[rebaDriver];

  document.getElementById('rebaResult').innerHTML =
    `Score = <strong>${score}</strong> &middot; ${level} &mdash; ${action}<br>` +
    `<span class="tool-recommend"><strong>${rebaDriver}</strong> is your biggest contributor - ${rebaFix}</span>`;
});

// ---------- NIOSH Lifting Equation ----------
const NIOSH_FREQ_BRACKETS = [0.2, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const NIOSH_FM = {
  1: {
    lt75: {0.2:1.00,0.5:.97,1:.94,2:.91,3:.88,4:.84,5:.80,6:.75,7:.70,8:.60,9:.52,10:.45,11:.41,12:.37,13:0,14:0,15:0},
    ge75: {0.2:1.00,0.5:.97,1:.94,2:.91,3:.88,4:.84,5:.80,6:.75,7:.70,8:.60,9:.52,10:.45,11:.41,12:.37,13:.34,14:.31,15:.28}
  },
  2: {
    lt75: {0.2:.95,0.5:.92,1:.88,2:.84,3:.79,4:.72,5:.60,6:.50,7:.42,8:.35,9:.30,10:.26,11:0,12:0,13:0,14:0,15:0},
    ge75: {0.2:.95,0.5:.92,1:.88,2:.84,3:.79,4:.72,5:.60,6:.50,7:.42,8:.35,9:.30,10:.26,11:.23,12:.21,13:0,14:0,15:0}
  },
  8: {
    lt75: {0.2:.85,0.5:.81,1:.75,2:.65,3:.55,4:.45,5:.35,6:.27,7:.22,8:.18,9:0,10:0,11:0,12:0,13:0,14:0,15:0},
    ge75: {0.2:.85,0.5:.81,1:.75,2:.65,3:.55,4:.45,5:.35,6:.27,7:.22,8:.18,9:.15,10:.13,11:0,12:0,13:0,14:0,15:0}
  }
};
const NIOSH_CM = {
  good: { lt75: 1.00, ge75: 1.00 },
  fair: { lt75: 0.95, ge75: 1.00 },
  poor: { lt75: 0.90, ge75: 0.90 }
};

function niosh_getFM(freq, durationCat, vCat) {
  if (freq > 15) return 0;
  const bracket = NIOSH_FREQ_BRACKETS.find(b => b >= freq);
  return NIOSH_FM[durationCat][vCat][bracket] ?? 0;
}

document.getElementById('nioshCalc').addEventListener('click', () => {
  const load = parseFloat(document.getElementById('nLoad').value);
  const H = parseFloat(document.getElementById('nH').value);
  const V = parseFloat(document.getElementById('nV').value);
  const D = parseFloat(document.getElementById('nD').value);
  const A = parseFloat(document.getElementById('nA').value);
  const F = parseFloat(document.getElementById('nF').value);
  const durationCat = parseInt(document.getElementById('nDur').value, 10);
  const couplingQ = document.getElementById('nCoupling').value;
  const resultEl = document.getElementById('nioshResult');

  if ([load, H, V, D, A, F].some(v => isNaN(v)) || H <= 0) {
    resultEl.textContent = 'Enter valid numeric values for all task parameters.';
    return;
  }

  const LC = 23;
  const HM = H > 63 ? 0 : 25 / Math.max(H, 25);
  const VM = V > 175 ? 0 : 1 - 0.003 * Math.abs(V - 75);
  const Dclamped = Math.max(D, 25);
  const DM = Dclamped > 175 ? 0 : 0.82 + 4.5 / Dclamped;
  const AM = A > 135 ? 0 : 1 - 0.0032 * A;
  const vCat = V < 75 ? 'lt75' : 'ge75';
  const FM = niosh_getFM(F, durationCat, vCat);
  const CM = NIOSH_CM[couplingQ][vCat];

  const RWL = LC * HM * VM * DM * AM * FM * CM;
  const LI = RWL > 0 ? load / RWL : Infinity;

  let verdict;
  if (!isFinite(LI)) verdict = 'RWL is zero at these extremes - task geometry exceeds equation limits.';
  else if (LI <= 1) verdict = 'Low risk - most workers should be able to perform this lift safely.';
  else if (LI <= 3) verdict = 'Moderate risk - task redesign recommended.';
  else verdict = 'High risk - task redesign strongly recommended.';

  const multipliers = { Horizontal: HM, Vertical: VM, Distance: DM, Asymmetry: AM, Frequency: FM, Coupling: CM };
  const worst = Object.entries(multipliers).sort((a, b) => a[1] - b[1])[0][0];
  const worstFix = {
    Horizontal: 'the load is too far from the body - pull it in closer before changing anything else; this multiplier is usually the cheapest fix.',
    Vertical: 'the lift is starting/ending far from ~75cm (knuckle height) - adjust the origin or destination height.',
    Distance: 'the vertical travel distance is too large - shorten the lift range or split it into stages.',
    Asymmetry: 'there\'s significant trunk twisting - reposition the destination so the worker doesn\'t rotate while loaded.',
    Frequency: 'lift frequency is too high for the duration - slow the pace or add rest allowance/job rotation.',
    Coupling: 'grip quality on the load is poor - better handles or a redesigned grip point directly raises RWL.'
  }[worst];

  const action = isFinite(LI) && LI > 1
    ? `<span class="tool-recommend"><strong>${worst}</strong> is dragging RWL down the most - ${worstFix}</span>`
    : '';

  resultEl.innerHTML =
    `RWL = <strong>${RWL.toFixed(1)} kg</strong> &middot; LI = <strong>${isFinite(LI) ? LI.toFixed(2) : '&infin;'}</strong><br>${verdict}<br>${action}`;
});

// ---------- Anthropometric Workstation Sizing ----------
document.getElementById('anthroCalc').addEventListener('click', () => {
  const H = parseFloat(document.getElementById('aHeight').value);
  const posture = document.getElementById('aPosture').value;
  const task = document.getElementById('aTask').value;
  const resultEl = document.getElementById('anthroResult');

  if (!H || H <= 0) {
    resultEl.textContent = 'Enter a valid worker stature.';
    return;
  }

  const adj = task === 'precision' ? 5 : task === 'heavy' ? -10 : 0;

  let html, action;
  if (posture === 'standing') {
    const elbowHeight = 0.63 * H;
    const workSurface = elbowHeight + adj;
    const eyeHeight = 0.90 * H;
    html = `Elbow height &asymp; <strong>${elbowHeight.toFixed(0)} cm</strong> &middot; ` +
      `Recommended work surface height &asymp; <strong>${workSurface.toFixed(0)} cm</strong> &middot; ` +
      `Standing eye height (monitor top reference) &asymp; <strong>${eyeHeight.toFixed(0)} cm</strong>`;
    action = `Most standing benches aren't adjustable to the exact centimetre - get within &plusmn;2cm using a platform/riser under the work, not by asking the person to hunch or stretch.`;
  } else {
    const seatHeight = 0.25 * H;
    const deskHeight = 0.40 * H + adj;
    const eyeHeight = 0.75 * H;
    html = `Seat (chair) height &asymp; <strong>${seatHeight.toFixed(0)} cm</strong> &middot; ` +
      `Recommended desk height &asymp; <strong>${deskHeight.toFixed(0)} cm</strong> &middot; ` +
      `Seated eye height (monitor top reference) &asymp; <strong>${eyeHeight.toFixed(0)} cm</strong>`;
    action = `If the desk itself isn't adjustable, fix seat height first (it's usually adjustable), then close any resulting elbow-to-desk gap with an armrest or keyboard tray rather than raising the chair past the correct seat height.`;
  }
  resultEl.innerHTML = html + `<br><span class="tool-recommend">${action}</span>` +
    '<br><span class="tool-footnote-inline">Percentage-of-stature guideline - approximate, for teaching use.</span>';
});
