# Personal Supply Chain

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/personal-supply-chain/
**Part of:** [Learn by Doing](https://saransthinking.github.io/saranraj-portfolio/personal-projects.html) — Saranraj Ramachandran's portfolio

A household inventory optimizer that applies real supply-chain mathematics — EOQ, reorder points, safety
stock, and consumption smoothing — to the items in your pantry. Treat your home like a warehouse and stop
guessing when to restock.

## The Problem

Most households manage pantry stock by memory and guesswork — leading to emergency grocery runs for toilet
paper while onions rot in the drawer. There was no lightweight tool that applied the same inventory-theory
formulas warehouses use — EOQ, ROP, safety stock — to everyday household items, while remaining simple enough
for a non-logistics user.

## Methodology

- **Economic Order Quantity (EOQ)** — Wilson formula: `√(2DS/H)`. Calibrates the ideal batch size trading off
  ordering cost against holding cost, per item.
- **Reorder Point + Safety Stock** — `ROP = avg_daily × lead_time + safety_stock`. Safety stock uses a Z-score
  against lead-time variability (low/medium/high) to hit the target service level.
- **Exponential Smoothing** — usage rate is smoothed with α=0.3 as consumption is logged, so forecasts adapt to
  real habits without over-reacting to one-off events.
- **Stock Projection** — days-until-stockout projected from the smoothed usage rate and current stock.

## What's in the Build

- One-tap logging — log usage or a received shipment, and the forecast retrains instantly.
- Smart shopping list — bundles all reorders by supplier with EOQ quantities.
- Stock-health dashboard — four-bucket classification (reorder now / reorder soon / healthy / overstocked)
  with days-until-stockout per item.
- Sample household — 6 preloaded items so the math is visible before adding your own.
- Supplier grouping — the shopping list groups and sorts by source.
- Min-order-qty respect — EOQ is floored at the supplier's minimum batch size.

## Files

- `index.html` — page markup and the live tool's UI
- `../../js/personal-supply-chain.js` — all logic: EOQ/ROP/safety-stock math, item state, exponential
  smoothing, shopping-list generation
- Persistence: browser `localStorage` (`psc_items_v1`, `psc_service_level_v1`) — nothing leaves the device

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox, Web Storage API — no build step, no dependencies.
