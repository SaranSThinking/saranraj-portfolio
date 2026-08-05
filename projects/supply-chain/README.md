# Supply Chain & Logistics Management

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/supply-chain/
**Part of:** [Saranraj Ramachandran - Industrial Engineering Portfolio](https://saransthinking.github.io/saranraj-portfolio/)

Inventory parameters, distribution, analytics, and resilience - organized around the four courses taught in
this space: Supply Chain Management, Logistics Management, Supply Chain Analytics, and Supply Chain Risk &
Resilience. Anchored by a filed patent on how inventory parameters and management techniques affect supply
chain performance.

## Tools

### Supply Chain Management
- **EOQ, Safety Stock & Reorder Point** - `EOQ = √(2DS/H)` (Wilson formula); safety stock from a
  demand-variability Z-score; `ROP = avg daily demand × lead time + safety stock`.
- **ABC Inventory Classification** - ranks SKUs by annual usage value into A (~top 80% of value), B (~next
  15%), and C (~remaining 5%) tiers.

### Logistics Management
- **Total Landed Cost** - product cost + freight + handling + duty% + insurance%, the true delivered cost per
  unit.
- **Transportation Mode Comparison** - compares total cost (freight + in-transit holding cost) across three
  modes, capturing the cost/speed trade-off between air, road, and sea.

### Supply Chain Analytics
- **Demand Forecast (Moving Average & Exponential Smoothing)** - next-period forecasts from both methods, with
  MAD (Mean Absolute Deviation) fit error.
- **Bullwhip Effect Ratio** - `(σ_orders/μ_orders)² ÷ (σ_demand/μ_demand)²`, the standard CV²-ratio measure of
  demand-signal amplification upstream.

### Supply Chain Risk & Resilience
- **Supply Risk Exposure Score** - Likelihood × Impact × Detectability (1–5 each), an FMEA-style risk register
  score for supply risks (single-source suppliers, geopolitical, logistics disruption).
- **Supply Chain Resilience Index** - a 4-pillar maturity score (Redundancy, Visibility, Flexibility,
  Collaboration), each rated 0–5.

## Case Studies

- **Impact of Inventory Parameters & Management Techniques on Supply Chain Performance** (Patent No.
  202321011890, ready for publication) - examines how inventory parameters directly shape supply chain
  performance and customer satisfaction.
- **Industrial ERP System over Blockchain Technology** (Patent No. 202221025755, published 08.07.2022) -
  combines ERP's business-data management with blockchain's secure multi-party transaction tracking.

## Files

- `index.html` - page markup
- Shared assets: `../../css/style.css`, `../../js/supply-chain-tools.js`

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox - no build step, no dependencies.
