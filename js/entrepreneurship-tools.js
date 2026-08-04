// ---------- Entrepreneurial Intention Self-Assessment ----------
document.getElementById('eiCalc').addEventListener('click', () => {
  const ids = ['eiQ1', 'eiQ2', 'eiQ3', 'eiQ4', 'eiQ5'];
  const values = ids.map(id => parseInt(document.getElementById(id).value, 10));
  const total = values.reduce((a, b) => a + b, 0);
  const pct = (total / 25) * 100;

  let level;
  if (pct >= 80) level = 'Very high entrepreneurial intention';
  else if (pct >= 60) level = 'Moderate-to-high intention';
  else if (pct >= 40) level = 'Moderate intention — exploring the idea';
  else level = 'Low intention — leaning toward stability';

  document.getElementById('eiResult').innerHTML =
    `Score = <strong>${total}/25</strong> (${pct.toFixed(0)}%) &middot; ${level}`;
});

// ---------- Break-Even Analysis ----------
document.getElementById('beCalc').addEventListener('click', () => {
  const fixed = parseFloat(document.getElementById('beFixed').value);
  const price = parseFloat(document.getElementById('bePrice').value);
  const varCost = parseFloat(document.getElementById('beVarCost').value);
  const resultEl = document.getElementById('beResult');

  const contribution = price - varCost;
  if (isNaN(fixed) || isNaN(price) || isNaN(varCost) || contribution <= 0) {
    resultEl.textContent = 'Price per unit must exceed variable cost per unit.';
    return;
  }

  const breakEvenUnits = fixed / contribution;
  const breakEvenRevenue = breakEvenUnits * price;

  resultEl.innerHTML =
    `Contribution Margin = <strong>₹${contribution.toFixed(0)}/unit</strong><br>` +
    `Break-Even Volume = <strong>${Math.ceil(breakEvenUnits)} units/month</strong> &middot; ` +
    `Break-Even Revenue &asymp; <strong>₹${breakEvenRevenue.toFixed(0)}/month</strong>`;
});
