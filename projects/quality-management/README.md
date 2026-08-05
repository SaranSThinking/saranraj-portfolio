# Quality Management

**Live:** https://saransthinking.github.io/saranraj-portfolio/projects/quality-management/
**Part of:** [Saranraj Ramachandran - Industrial Engineering Portfolio](https://saransthinking.github.io/saranraj-portfolio/)

Statistical process control and quality systems - for the shop floor and for academic accreditation alike.
M.E. in Quality Engineering & Management, plus years coordinating NBA and NAAC accreditation processes at CEG:
quality management here spans both statistical process control and the systems-level work of running an
accredited academic department.

## Tools

### Process Capability (Cp / Cpk)
Checks whether a process can consistently meet specification.

- **Formula:** `Cp = (USL−LSL)/(6σ)`; `Cpu = (USL−mean)/(3σ)`; `Cpl = (mean−LSL)/(3σ)`; `Cpk = min(Cpu, Cpl)`.
- **Interpretation:** Cpk ≥ 1.33 capable, 1.0–1.33 marginally capable, < 1.0 not capable.

### X̄–R Control Chart Limits
Computes 3σ control limits for subgroup averages and ranges using the standard A2/D3/D4 constants for subgroup
sizes n=2–6.

- **Formula:** `UCL_X̄/LCL_X̄ = X̄̄ ± A2 × R̄`; `UCL_R = D4 × R̄`; `LCL_R = D3 × R̄`.

## Case Study: Academic Quality Systems Leadership

- **2024 - NBA PTV Co-ordinator**, CEG Department of Industrial Engineering - documentation, evidence
  compilation, and peer-team-visit readiness for National Board of Accreditation review.
- **2023 - NAAC PTV Co-ordinator**, CEG Department of Industrial Engineering - led peer-team-visit preparation
  for NAAC accreditation.
- **2021–22 - NAAC Documentation & Design In-charge**, CEG Department of Industrial Engineering - owned
  documentation structure and design for NAAC submissions.

## Files

- `index.html` - page markup
- Shared assets: `../../css/style.css`, `../../js/quality-tools.js`

## Stack

HTML5, vanilla JavaScript (ES6), CSS Grid/Flexbox - no build step, no dependencies.
