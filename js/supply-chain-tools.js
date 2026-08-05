// ---------- EOQ, Safety Stock & Reorder Point ----------
document.getElementById('eoqCalc').addEventListener('click', () => {
  const d = parseFloat(document.getElementById('eoqDemand').value);
  const s = parseFloat(document.getElementById('eoqOrder').value);
  const h = parseFloat(document.getElementById('eoqHold').value);
  const leadTime = parseFloat(document.getElementById('eoqLeadTime').value);
  const demandStd = parseFloat(document.getElementById('eoqDemandStd').value);
  const z = parseFloat(document.getElementById('eoqZ').value);
  const resultEl = document.getElementById('eoqResult');

  if ([d, s, h, leadTime, demandStd, z].some(v => isNaN(v)) || d <= 0 || s <= 0 || h <= 0) {
    resultEl.textContent = 'Enter positive values for demand, ordering cost, and holding cost.';
    return;
  }

  const eoq = Math.sqrt((2 * d * s) / h);
  const ordersPerYear = d / eoq;
  const avgDailyDemand = d / 365;
  const safetyStock = z * demandStd * Math.sqrt(leadTime);
  const reorderPoint = avgDailyDemand * leadTime + safetyStock;
  const totalCost = (d / eoq) * s + (eoq / 2) * h;

  resultEl.innerHTML =
    `EOQ = <strong>${eoq.toFixed(0)} units/order</strong> &middot; ${ordersPerYear.toFixed(1)} orders/year<br>` +
    `Safety Stock = <strong>${safetyStock.toFixed(0)} units</strong> &middot; ` +
    `Reorder Point = <strong>${reorderPoint.toFixed(0)} units</strong><br>` +
    `Annual ordering + holding cost &asymp; <strong>₹${totalCost.toFixed(0)}</strong>`;
});

// ---------- ABC Analysis ----------
document.getElementById('abcCalc').addEventListener('click', () => {
  const raw = document.getElementById('abcValues').value;
  const resultEl = document.getElementById('abcResult');
  const values = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n > 0);

  if (!values.length) {
    resultEl.textContent = 'Enter at least one positive usage value.';
    return;
  }

  const sorted = [...values].sort((a, b) => b - a);
  const total = sorted.reduce((a, b) => a + b, 0);

  let cumulative = 0;
  let countA = 0, countB = 0, countC = 0;
  let valueA = 0, valueB = 0, valueC = 0;

  sorted.forEach(v => {
    cumulative += v;
    const cumPct = (cumulative / total) * 100;
    if (cumPct <= 80) { countA++; valueA += v; }
    else if (cumPct <= 95) { countB++; valueB += v; }
    else { countC++; valueC += v; }
  });

  resultEl.innerHTML =
    `<strong>A</strong>: ${countA} SKUs, ${(valueA / total * 100).toFixed(1)}% of value &middot; ` +
    `<strong>B</strong>: ${countB} SKUs, ${(valueB / total * 100).toFixed(1)}% of value &middot; ` +
    `<strong>C</strong>: ${countC} SKUs, ${(valueC / total * 100).toFixed(1)}% of value ` +
    `(of ${sorted.length} total SKUs)`;
});

// ---------- Total Landed Cost ----------
document.getElementById('lcCalc').addEventListener('click', () => {
  const product = parseFloat(document.getElementById('lcProduct').value);
  const freight = parseFloat(document.getElementById('lcFreight').value);
  const duty = parseFloat(document.getElementById('lcDuty').value);
  const insurance = parseFloat(document.getElementById('lcInsurance').value);
  const handling = parseFloat(document.getElementById('lcHandling').value);
  const units = parseFloat(document.getElementById('lcUnits').value);
  const resultEl = document.getElementById('lcResult');

  if ([product, freight, duty, insurance, handling, units].some(v => isNaN(v)) || product < 0 || units <= 0) {
    resultEl.textContent = 'Enter valid, non-negative cost components and a positive unit count.';
    return;
  }

  const dutyCost = product * (duty / 100);
  const insuranceCost = product * (insurance / 100);
  const unitLandedCost = product + freight + handling + dutyCost + insuranceCost;
  const totalLandedCost = unitLandedCost * units;
  const markup = ((unitLandedCost - product) / product) * 100;

  resultEl.innerHTML =
    `Landed Cost = <strong>₹${unitLandedCost.toFixed(2)}/unit</strong> ` +
    `(+${markup.toFixed(1)}% over product cost) &middot; ` +
    `Total for ${units} units = <strong>₹${totalLandedCost.toFixed(0)}</strong>`;
});

// ---------- Transportation Mode Comparison ----------
document.getElementById('tmCalc').addEventListener('click', () => {
  const value = parseFloat(document.getElementById('tmValue').value);
  const holdRate = parseFloat(document.getElementById('tmHoldRate').value);
  const resultEl = document.getElementById('tmResult');

  const modes = [
    { label: 'Mode A', freight: parseFloat(document.getElementById('tmFreightA').value), days: parseFloat(document.getElementById('tmDaysA').value) },
    { label: 'Mode B', freight: parseFloat(document.getElementById('tmFreightB').value), days: parseFloat(document.getElementById('tmDaysB').value) },
    { label: 'Mode C', freight: parseFloat(document.getElementById('tmFreightC').value), days: parseFloat(document.getElementById('tmDaysC').value) }
  ];

  if (isNaN(value) || isNaN(holdRate) || modes.some(m => isNaN(m.freight) || isNaN(m.days))) {
    resultEl.textContent = 'Enter valid unit value, holding rate, and freight/transit data for each mode.';
    return;
  }

  modes.forEach(m => {
    m.carryingCost = (m.days / 365) * (holdRate / 100) * value;
    m.totalCost = m.freight + m.carryingCost;
  });

  const cheapest = modes.reduce((a, b) => (b.totalCost < a.totalCost ? b : a));

  const rows = modes.map(m =>
    `${m.label}: freight ₹${m.freight.toFixed(2)} + in-transit carrying ₹${m.carryingCost.toFixed(2)} = <strong>₹${m.totalCost.toFixed(2)}/unit</strong> (${m.days}d)`
  ).join('<br>');

  resultEl.innerHTML = `${rows}<br>Lowest total cost: <strong>${cheapest.label}</strong>`;
});

// ---------- Demand Forecast (Moving Average & Exponential Smoothing) ----------
document.getElementById('fcCalc').addEventListener('click', () => {
  const raw = document.getElementById('fcData').value;
  const n = parseInt(document.getElementById('fcWindow').value, 10);
  const alpha = parseFloat(document.getElementById('fcAlpha').value);
  const resultEl = document.getElementById('fcResult');

  const data = raw.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));

  if (data.length < n + 1 || alpha < 0 || alpha > 1 || n < 2) {
    resultEl.textContent = 'Enter enough historical periods (more than the MA window) and a valid alpha (0-1).';
    return;
  }

  // Moving Average
  let maErrors = [];
  for (let i = n; i < data.length; i++) {
    const window = data.slice(i - n, i);
    const maForecast = window.reduce((a, b) => a + b, 0) / n;
    maErrors.push(Math.abs(data[i] - maForecast));
  }
  const maNext = data.slice(data.length - n).reduce((a, b) => a + b, 0) / n;
  const madMA = maErrors.reduce((a, b) => a + b, 0) / maErrors.length;

  // Exponential Smoothing
  let esForecasts = [data[0]];
  for (let i = 1; i < data.length; i++) {
    esForecasts.push(alpha * data[i - 1] + (1 - alpha) * esForecasts[i - 1]);
  }
  const esNext = alpha * data[data.length - 1] + (1 - alpha) * esForecasts[data.length - 1];
  const esErrors = data.slice(1).map((d, i) => Math.abs(d - esForecasts[i + 1]));
  const madES = esErrors.reduce((a, b) => a + b, 0) / esErrors.length;

  resultEl.innerHTML =
    `Moving Average (n=${n}) next-period forecast = <strong>${maNext.toFixed(1)}</strong> (MAD ${madMA.toFixed(1)})<br>` +
    `Exponential Smoothing (&alpha;=${alpha}) next-period forecast = <strong>${esNext.toFixed(1)}</strong> (MAD ${madES.toFixed(1)})`;
});

// ---------- Bullwhip Effect Ratio ----------
function stats(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return { mean, variance, std: Math.sqrt(variance) };
}

document.getElementById('bwCalc').addEventListener('click', () => {
  const orders = document.getElementById('bwOrders').value.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));
  const demand = document.getElementById('bwDemand').value.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));
  const resultEl = document.getElementById('bwResult');

  if (orders.length < 2 || demand.length < 2) {
    resultEl.textContent = 'Enter at least two values in each series.';
    return;
  }

  const o = stats(orders);
  const d = stats(demand);
  const cvOrders = o.std / o.mean;
  const cvDemand = d.std / d.mean;
  const ratio = (cvOrders ** 2) / (cvDemand ** 2);

  let verdict;
  if (ratio <= 1.1) verdict = 'Little to no amplification - orders track demand closely.';
  else if (ratio <= 2) verdict = 'Moderate bullwhip effect - some amplification upstream.';
  else verdict = 'Strong bullwhip effect - orders are amplifying demand signal significantly.';

  resultEl.innerHTML =
    `Bullwhip Ratio (CV&sup2; orders / CV&sup2; demand) = <strong>${ratio.toFixed(2)}</strong><br>${verdict}`;
});

// ---------- Supply Risk Exposure Score ----------
document.getElementById('srCalc').addEventListener('click', () => {
  const likelihood = parseFloat(document.getElementById('srLikelihood').value);
  const impact = parseFloat(document.getElementById('srImpact').value);
  const detect = parseFloat(document.getElementById('srDetect').value);
  const resultEl = document.getElementById('srResult');

  if ([likelihood, impact, detect].some(v => isNaN(v) || v < 1 || v > 5)) {
    resultEl.textContent = 'Enter Likelihood, Impact, and Detectability between 1 and 5.';
    return;
  }

  const score = likelihood * impact * detect;
  let tier;
  if (score >= 80) tier = 'Critical exposure - mitigate immediately';
  else if (score >= 45) tier = 'High exposure - active mitigation plan needed';
  else if (score >= 20) tier = 'Moderate exposure - monitor and plan contingency';
  else tier = 'Low exposure - routine monitoring';

  resultEl.innerHTML = `Risk Score = <strong>${score}</strong> / 125 &middot; ${tier}`;
});

// ---------- Supply Chain Resilience Index ----------
document.getElementById('resCalc').addEventListener('click', () => {
  const ids = ['resRedundancy', 'resVisibility', 'resFlexibility', 'resCollaboration'];
  const values = ids.map(id => parseFloat(document.getElementById(id).value));
  const resultEl = document.getElementById('resResult');

  if (values.some(v => isNaN(v) || v < 0 || v > 5)) {
    resultEl.textContent = 'Enter all four pillar ratings between 0 and 5.';
    return;
  }

  const total = values.reduce((a, b) => a + b, 0);
  const pct = (total / 20) * 100;

  let tier;
  if (pct >= 80) tier = 'Resilient - well-positioned to absorb disruption';
  else if (pct >= 55) tier = 'Developing resilience - real gaps remain';
  else if (pct >= 30) tier = 'Fragile - a single disruption could be severe';
  else tier = 'Highly vulnerable - minimal resilience capacity';

  resultEl.innerHTML = `Resilience Score = <strong>${total}/20</strong> (${pct.toFixed(0)}%) &middot; ${tier}`;
});
