const PSC_STORAGE_KEY = 'psc_items_v1';
const PSC_SERVICE_KEY = 'psc_service_level_v1';
const PSC_ALPHA = 0.3;

function pscSampleHousehold() {
  return [
    { id: 'tp',   name: 'Toilet Paper', supplier: 'BigMart',       unit: 'rolls',   stock: 8,   avgDailyUsage: 0.40, leadTime: 3, variability: 0.25, orderCost: 30, holdCost: 6,  minOrder: 4 },
    { id: 'milk', name: 'Milk',         supplier: 'DailyFresh',    unit: 'liters',  stock: 1.5, avgDailyUsage: 0.50, leadTime: 1, variability: 0.10, orderCost: 10, holdCost: 20, minOrder: 1 },
    { id: 'rice', name: 'Rice',         supplier: 'BigMart',       unit: 'kg',      stock: 4,   avgDailyUsage: 0.30, leadTime: 4, variability: 0.10, orderCost: 25, holdCost: 5,  minOrder: 5 },
    { id: 'soap', name: 'Dish Soap',    supplier: 'HomeEssentials',unit: 'bottles', stock: 1,   avgDailyUsage: 0.08, leadTime: 5, variability: 0.25, orderCost: 15, holdCost: 10, minOrder: 2 },
    { id: 'cof',  name: 'Coffee',       supplier: 'DailyFresh',    unit: 'packs',   stock: 2,   avgDailyUsage: 0.15, leadTime: 4, variability: 0.45, orderCost: 20, holdCost: 15, minOrder: 1 },
    { id: 'oni',  name: 'Onions',       supplier: 'BigMart',       unit: 'kg',      stock: 3,   avgDailyUsage: 0.25, leadTime: 2, variability: 0.25, orderCost: 15, holdCost: 8,  minOrder: 2 }
  ];
}

function pscLoadItems() {
  const raw = localStorage.getItem(PSC_STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through */ }
  }
  const sample = pscSampleHousehold();
  localStorage.setItem(PSC_STORAGE_KEY, JSON.stringify(sample));
  return sample;
}

function pscSaveItems(items) {
  localStorage.setItem(PSC_STORAGE_KEY, JSON.stringify(items));
}

function pscGetZ() {
  const stored = localStorage.getItem(PSC_SERVICE_KEY);
  return stored ? parseFloat(stored) : 1.65;
}

let pscItems = pscLoadItems();

function pscMetrics(item, z) {
  const annualDemand = item.avgDailyUsage * 365;
  const eoqRaw = (annualDemand > 0 && item.orderCost > 0 && item.holdCost > 0)
    ? Math.sqrt((2 * annualDemand * item.orderCost) / item.holdCost)
    : 0;
  const eoq = Math.max(eoqRaw, item.minOrder);
  const dailyStd = item.avgDailyUsage * item.variability;
  const safetyStock = z * dailyStd * Math.sqrt(item.leadTime);
  const rop = item.avgDailyUsage * item.leadTime + safetyStock;
  const daysUntilStockout = item.avgDailyUsage > 0 ? item.stock / item.avgDailyUsage : Infinity;

  let health;
  if (item.stock <= rop) health = 'reorder-now';
  else if (item.stock <= rop + 0.3 * eoq) health = 'reorder-soon';
  else if (item.stock > rop + 1.5 * eoq) health = 'overstocked';
  else health = 'healthy';

  return { eoq, safetyStock, rop, daysUntilStockout, health };
}

const PSC_HEALTH_LABEL = {
  'reorder-now': 'Reorder Now',
  'reorder-soon': 'Reorder Soon',
  'healthy': 'Healthy',
  'overstocked': 'Overstocked'
};

function pscRenderItems() {
  const container = document.getElementById('pscItems');
  const z = pscGetZ();
  container.innerHTML = pscItems.map(item => {
    const m = pscMetrics(item, z);
    const days = isFinite(m.daysUntilStockout) ? m.daysUntilStockout.toFixed(0) : '&infin;';
    return `
      <div class="psc-item-card" data-id="${item.id}">
        <div class="psc-item-header">
          <div>
            <h4>${item.name}</h4>
            <div class="psc-item-supplier">${item.supplier}</div>
          </div>
          <span class="psc-health-badge psc-health-${m.health}">${PSC_HEALTH_LABEL[m.health]}</span>
        </div>
        <div class="psc-item-metrics">
          <div>Stock: <strong>${item.stock.toFixed(2)} ${item.unit}</strong></div>
          <div>Days left: <strong>${days}</strong></div>
          <div>EOQ: <strong>${m.eoq.toFixed(1)} ${item.unit}</strong></div>
          <div>ROP: <strong>${m.rop.toFixed(2)} ${item.unit}</strong></div>
          <div>Safety Stock: <strong>${m.safetyStock.toFixed(2)}</strong></div>
          <div>Usage: <strong>${item.avgDailyUsage.toFixed(2)}/day</strong></div>
        </div>
        <div class="psc-item-actions">
          <button class="psc-log">Log Usage</button>
          <button class="psc-receive">Receive Shipment</button>
          <button class="psc-remove">Remove</button>
        </div>
      </div>
    `;
  }).join('') || '<p class="tool-desc">No items yet — add one above or reset to the sample household.</p>';

  pscRenderShoppingList(z);
}

function pscRenderShoppingList(z) {
  const listEl = document.getElementById('pscShoppingList');
  const needsReorder = pscItems.filter(item => {
    const m = pscMetrics(item, z);
    return m.health === 'reorder-now' || m.health === 'reorder-soon';
  });

  if (!needsReorder.length) {
    listEl.innerHTML = 'Nothing needs reordering right now.';
    return;
  }

  const bySupplier = {};
  needsReorder.forEach(item => {
    const m = pscMetrics(item, z);
    const qty = Math.max(Math.ceil(m.eoq), item.minOrder);
    (bySupplier[item.supplier] = bySupplier[item.supplier] || []).push(
      `${item.name} — ${qty} ${item.unit}`
    );
  });

  listEl.innerHTML = Object.entries(bySupplier).map(([supplier, lines]) => `
    <div class="psc-shopping-group">
      <h5>${supplier}</h5>
      <ul>${lines.map(l => `<li>${l}</li>`).join('')}</ul>
    </div>
  `).join('');
}

// ---------- Event wiring ----------
document.getElementById('pscItems').addEventListener('click', (e) => {
  const card = e.target.closest('.psc-item-card');
  if (!card) return;
  const id = card.getAttribute('data-id');
  const item = pscItems.find(i => i.id === id);
  if (!item) return;

  if (e.target.classList.contains('psc-log')) {
    const qtyStr = window.prompt(`How many ${item.unit} of "${item.name}" did you use today?`, '1');
    const qty = parseFloat(qtyStr);
    if (!isNaN(qty) && qty >= 0) {
      item.stock = Math.max(0, item.stock - qty);
      item.avgDailyUsage = PSC_ALPHA * qty + (1 - PSC_ALPHA) * item.avgDailyUsage;
      pscSaveItems(pscItems);
      pscRenderItems();
    }
  } else if (e.target.classList.contains('psc-receive')) {
    const z = pscGetZ();
    const suggested = Math.ceil(pscMetrics(item, z).eoq);
    const qtyStr = window.prompt(`How many ${item.unit} of "${item.name}" did you receive?`, String(suggested));
    const qty = parseFloat(qtyStr);
    if (!isNaN(qty) && qty > 0) {
      item.stock += qty;
      pscSaveItems(pscItems);
      pscRenderItems();
    }
  } else if (e.target.classList.contains('psc-remove')) {
    if (window.confirm(`Remove "${item.name}" from your household?`)) {
      pscItems = pscItems.filter(i => i.id !== id);
      pscSaveItems(pscItems);
      pscRenderItems();
    }
  }
});

document.getElementById('pscAddItem').addEventListener('click', () => {
  const name = document.getElementById('pscName').value.trim();
  const supplier = document.getElementById('pscSupplier').value.trim() || 'Unspecified';
  const unit = document.getElementById('pscUnit').value.trim() || 'units';
  const stock = parseFloat(document.getElementById('pscStock').value);
  const avgDailyUsage = parseFloat(document.getElementById('pscUsage').value);
  const leadTime = parseFloat(document.getElementById('pscLeadTime').value);
  const variability = parseFloat(document.getElementById('pscVariability').value);
  const orderCost = parseFloat(document.getElementById('pscOrderCost').value);
  const holdCost = parseFloat(document.getElementById('pscHoldCost').value);
  const minOrder = parseFloat(document.getElementById('pscMinOrder').value);

  if (!name || [stock, avgDailyUsage, leadTime, orderCost, holdCost, minOrder].some(v => isNaN(v) || v < 0)) {
    window.alert('Enter a name and valid non-negative values for all fields.');
    return;
  }

  pscItems.push({
    id: 'item_' + Date.now(),
    name, supplier, unit, stock, avgDailyUsage, leadTime, variability, orderCost, holdCost, minOrder
  });
  pscSaveItems(pscItems);
  pscRenderItems();
  document.getElementById('pscName').value = '';
  document.getElementById('pscSupplier').value = '';
});

document.getElementById('pscServiceLevel').addEventListener('change', (e) => {
  localStorage.setItem(PSC_SERVICE_KEY, e.target.value);
  const pctMap = { '1.28': '90%', '1.65': '95%', '2.05': '98%' };
  document.getElementById('statServiceLevel').textContent = pctMap[e.target.value] || '95%';
  pscRenderItems();
});

document.getElementById('pscReset').addEventListener('click', () => {
  if (window.confirm('Reset to the sample household? This clears any items you added.')) {
    pscItems = pscSampleHousehold();
    pscSaveItems(pscItems);
    pscRenderItems();
  }
});

// ---------- Init ----------
document.getElementById('pscServiceLevel').value = String(pscGetZ());
pscRenderItems();
