// ---------- Entrepreneurial Intention Self-Assessment ----------
document.getElementById('eiCalc').addEventListener('click', () => {
  const ids = ['eiQ1', 'eiQ2', 'eiQ3', 'eiQ4', 'eiQ5'];
  const values = ids.map(id => parseInt(document.getElementById(id).value, 10));
  const total = values.reduce((a, b) => a + b, 0);
  const pct = (total / 25) * 100;

  let level, action;
  if (pct >= 80) {
    level = 'Very high entrepreneurial intention';
    action = 'Move from intention to validation - talk to 10 potential customers this month before writing a business plan.';
  } else if (pct >= 60) {
    level = 'Moderate-to-high intention';
    action = 'Pressure-test the idea with something small and cheap - a landing page, a pre-sale, a paid pilot - before committing full-time.';
  } else if (pct >= 40) {
    level = 'Moderate intention - exploring the idea';
    action = 'Exploring is fine, but set yourself a specific decision deadline - open-ended exploring quietly turns into never deciding.';
  } else {
    level = 'Low intention - leaning toward stability';
    action = 'Stability isn\'t the wrong answer. If you want to keep the door open, find a low-risk way to test entrepreneurial work - a side project or a freelance client - without giving up the stable path yet.';
  }

  document.getElementById('eiResult').innerHTML =
    `Score = <strong>${total}/25</strong> (${pct.toFixed(0)}%) &middot; ${level}<br>` +
    `<span class="tool-recommend">${action}</span>`;
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
  const cmRatio = (contribution / price) * 100;

  const action = cmRatio < 20
    ? `Your contribution margin is only ${cmRatio.toFixed(0)}% of price - break-even is very sensitive to any cost slippage or discounting. A small price increase moves break-even faster here than cutting fixed costs would.`
    : `A ${cmRatio.toFixed(0)}% contribution margin gives you real room - once past ${Math.ceil(breakEvenUnits)} units/month, most of each additional sale is profit, not just cost recovery.`;

  resultEl.innerHTML =
    `Contribution Margin = <strong>₹${contribution.toFixed(0)}/unit</strong><br>` +
    `Break-Even Volume = <strong>${Math.ceil(breakEvenUnits)} units/month</strong> &middot; ` +
    `Break-Even Revenue &asymp; <strong>₹${breakEvenRevenue.toFixed(0)}/month</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
});
