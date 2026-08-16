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

  let action;
  if (safetyStock > eoq * 0.5) {
    action = `Safety stock (${safetyStock.toFixed(0)}) is unusually large relative to EOQ - demand is volatile relative to your order size. Push on lead time with the supplier or re-check your service-level target (z) before just carrying more buffer.`;
  } else if (ordersPerYear < 2) {
    action = `You're ordering less than twice a year - verify that's intentional. Very large batches tie up capital and raise obsolescence risk; re-check that your ordering cost input is realistic.`;
  } else if (ordersPerYear > 52) {
    action = `You'd be reordering more than weekly - that usually means ordering cost is understated. Get a real number for it before trusting this EOQ.`;
  } else {
    action = `Reorder ${eoq.toFixed(0)} units every time stock hits ${reorderPoint.toFixed(0)} - this cadence (${ordersPerYear.toFixed(1)}&times;/year) is a reasonable balance of ordering and holding cost.`;
  }

  resultEl.innerHTML =
    `EOQ = <strong>${eoq.toFixed(0)} units/order</strong> &middot; ${ordersPerYear.toFixed(1)} orders/year<br>` +
    `Safety Stock = <strong>${safetyStock.toFixed(0)} units</strong> &middot; ` +
    `Reorder Point = <strong>${reorderPoint.toFixed(0)} units</strong><br>` +
    `Annual ordering + holding cost &asymp; <strong>₹${totalCost.toFixed(0)}</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
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
    `(of ${sorted.length} total SKUs)<br>` +
    `<span class="tool-recommend">Put tight control on your ${countA} A items - frequent counts, low safety stock, negotiated pricing; they're only ${(countA / sorted.length * 100).toFixed(0)}% of SKUs but ${(valueA / total * 100).toFixed(0)}% of value. B items need periodic review. Let C items run on a simple two-bin or max-stock rule - don't spend management effort where the value isn't.</span>`;
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

  let action;
  if (markup > 30) {
    action = `Landed cost is running ${markup.toFixed(0)}% over the sticker price - that's a large hidden layer. Check whether a supplier closer to destination, a different Incoterm, or consolidated shipments would cut freight/duty before you accept this as the real cost.`;
  } else if (markup < 10) {
    action = `Landed cost is close to product cost (+${markup.toFixed(0)}%) - freight, duty, and handling are well controlled here relative to unit price.`;
  } else {
    action = `A +${markup.toFixed(0)}% landed-cost markup is typical - worth tracking each component over time to catch a creeping freight or duty rate before it compounds across volume.`;
  }

  resultEl.innerHTML =
    `Landed Cost = <strong>₹${unitLandedCost.toFixed(2)}/unit</strong> ` +
    `(+${markup.toFixed(1)}% over product cost) &middot; ` +
    `Total for ${units} units = <strong>₹${totalLandedCost.toFixed(0)}</strong><br>` +
    `<span class="tool-recommend">${action}</span>`;
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
  const fastest = modes.reduce((a, b) => (b.days < a.days ? b : a));
  const costGap = fastest.totalCost - cheapest.totalCost;

  const rows = modes.map(m =>
    `${m.label}: freight ₹${m.freight.toFixed(2)} + in-transit carrying ₹${m.carryingCost.toFixed(2)} = <strong>₹${m.totalCost.toFixed(2)}/unit</strong> (${m.days}d)`
  ).join('<br>');

  let action;
  if (fastest.label === cheapest.label) {
    action = `${cheapest.label} wins on both cost and speed - an easy call, no trade-off to make here.`;
  } else if (costGap <= cheapest.totalCost * 0.05) {
    action = `${fastest.label} costs only ₹${costGap.toFixed(2)}/unit more than ${cheapest.label} for ${(cheapest.days - fastest.days).toFixed(0)} fewer transit days - that's cheap insurance against a stockout. Take the speed unless cash is genuinely tight.`;
  } else {
    action = `${cheapest.label} saves ₹${costGap.toFixed(2)}/unit over ${fastest.label} but costs ${(cheapest.days - fastest.days).toFixed(0)} more transit days - only worth it if your safety stock already covers that extra lead time without risking service level.`;
  }

  resultEl.innerHTML = `${rows}<br>Lowest total cost: <strong>${cheapest.label}</strong><br><span class="tool-recommend">${action}</span>`;
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

  const better = madES < madMA ? 'Exponential Smoothing' : 'Moving Average';
  const betterVal = madES < madMA ? esNext : maNext;
  const gapPct = Math.abs(madMA - madES) / Math.max(madMA, madES) * 100;

  let action;
  if (gapPct < 5) {
    action = `Both methods track this data about equally well - no strong reason to prefer one. Default to Moving Average for simplicity unless the pattern shifts.`;
  } else {
    action = `${better} fits this data noticeably better (lower MAD) - use its forecast of <strong>${betterVal.toFixed(1)}</strong> going forward. ${better === 'Exponential Smoothing' ? `If recent periods keep swinging, try raising &alpha; further to react faster.` : `If demand looks stable, a smaller MA window would react to trend changes sooner.`}`;
  }

  resultEl.innerHTML =
    `Moving Average (n=${n}) next-period forecast = <strong>${maNext.toFixed(1)}</strong> (MAD ${madMA.toFixed(1)})<br>` +
    `Exponential Smoothing (&alpha;=${alpha}) next-period forecast = <strong>${esNext.toFixed(1)}</strong> (MAD ${madES.toFixed(1)})<br>` +
    `<span class="tool-recommend">${action}</span>`;
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

  let verdict, action;
  if (ratio <= 1.1) {
    verdict = 'Little to no amplification - orders track demand closely.';
    action = `Whatever information-sharing or batching discipline is already in place is working - keep it, and use it as the baseline when you add new partners or SKUs.`;
  } else if (ratio <= 2) {
    verdict = 'Moderate bullwhip effect - some amplification upstream.';
    action = `Start with order-batching: shrink the order cycle length or share real point-of-sale data with your immediate upstream partner before touching anything else.`;
  } else {
    verdict = 'Strong bullwhip effect - orders are amplifying demand signal significantly.';
    action = `Fix information sharing first - real-time POS or consumption data with suppliers. Safety-stock or batching tweaks won't help much if the root cause is signal distortion this large.`;
  }

  resultEl.innerHTML =
    `Bullwhip Ratio (CV&sup2; orders / CV&sup2; demand) = <strong>${ratio.toFixed(2)}</strong><br>${verdict}<br>` +
    `<span class="tool-recommend">${action}</span>`;
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

  const factors = { Likelihood: likelihood, Impact: impact, Detectability: detect };
  const driver = Object.entries(factors).sort((a, b) => b[1] - a[1])[0][0];
  const driverAction = {
    Likelihood: 'diversify or dual-source whatever is making this risk likely to occur - that\'s the lever with the most headroom here.',
    Impact: 'reduce the blast radius before the probability - build inventory buffer or insurance for this specific failure so a hit doesn\'t cascade.',
    Detectability: 'this risk would catch you by surprise - invest in monitoring/visibility here first, since you can\'t mitigate what you can\'t see coming.'
  }[driver];

  resultEl.innerHTML =
    `Risk Score = <strong>${score}</strong> / 125 &middot; ${tier}<br>` +
    `<span class="tool-recommend"><strong>${driver}</strong> is the highest-scoring factor (${factors[driver]}/5) - ${driverAction}</span>`;
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

  const pillars = { Redundancy: values[0], Visibility: values[1], Flexibility: values[2], Collaboration: values[3] };
  const weakest = Object.entries(pillars).sort((a, b) => a[1] - b[1])[0][0];
  const pillarAction = {
    Redundancy: 'build backup supplier relationships or buffer stock for your most critical items - right now a single failure point has no fallback.',
    Visibility: 'invest in real-time tracking or data-sharing with suppliers - you likely find out about disruptions later than you should.',
    Flexibility: 'diversify sourcing or manufacturing options - too much of your capacity depends on one configuration working.',
    Collaboration: 'formalize joint contingency planning with your key partners - ad hoc coordination breaks down exactly when you need it most.'
  }[weakest];

  resultEl.innerHTML =
    `Resilience Score = <strong>${total}/20</strong> (${pct.toFixed(0)}%) &middot; ${tier}<br>` +
    `<span class="tool-recommend">Weakest pillar: <strong>${weakest}</strong> (${pillars[weakest]}/5) - ${pillarAction}</span>`;
});
