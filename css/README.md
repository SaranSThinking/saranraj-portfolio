# `css/`

Two shared stylesheets. Every page in the site loads `style.css`; only the "Learn by Doing" personal-project
pages additionally load `personal-projects.css`.

## `style.css`

The core design system. Organized top to bottom as:

| Section | What it styles |
|---|---|
| `:root` variables | Dark-theme color palette (`--bg`, `--card-bg`, `--navy` [electric blue accent], `--teal` [emerald accent], `--red`, `--amber`, `--text`, `--text-muted`, `--border`), font stacks (`--font-body`: Inter, `--font-mono`: JetBrains Mono), shadows, radius |
| Header / nav | `.site-header`, `.main-nav`, `.nav-cta`, mobile `.nav-toggle` |
| Hero | `.hero`, `.eyebrow`, `.hero-stats` — used on the homepage and (as `.pp-hero`) on project pages |
| Section templates | `.section`, `.section-alt`, `.kicker`, `.section-title` — the alternating-background section rhythm used everywhere |
| About / expertise grid | `.about-grid`, `.expertise-grid`, `.expertise-card` — the 9 domain cards on the homepage |
| **Tool cards** | `.tool-card`, `.tool-header`, `.tool-tag`, `.tool-inputs`, `.tool-result`, `.capability-badge` — the component every calculator on every domain page is built from |
| DMAIC | `.dmaic-steps`, `.dmaic-step`, `.dmaic-letter` |
| Timeline / research / skills | `.timeline`, `.research-grid`, `.pub-list`, `.skills-grid`, `.chip` |
| Domain-page template | `.domain-hero`, `.back-link`, `.mode-toggle` (RULA/REBA switcher), `.case-grid`, `.case-card` |
| **Personal-project template** | `.pp-hero`, `.pp-badge`, `.pp-stat-row`, `.pp-section` (the numbered 01/02/03/04 case-study sections), `.pp-methodology-grid`, `.pp-feature-grid`, `.pp-stack-outcome`, `.pp-live-embed`, `.pp-project-grid` (hub cards) |
| Contact / footer | `.contact-section`, `.site-footer` |
| Responsive | Two breakpoints (`900px`, `720px`) collapsing every multi-column grid to 1–2 columns and switching the nav to a slide-down mobile menu |

## `personal-projects.css`

Widget-level styles specific to the interactive apps under `projects/personal-*/`, loaded alongside
`style.css`:

| Section | What it styles |
|---|---|
| Personal Supply Chain | `.psc-controls`, `.psc-add-item`, `.psc-items`, `.psc-item-card`, `.psc-health-badge` (4 status colors), `.psc-item-actions`, `.psc-shopping-list` |
| Generic log/table widgets | `.pp-log-form`, `.pp-data-table` (reused by the Quality Control, Study Predictor, Productivity OEE, Breakeven, and Ergonomic Analysis tools) |
| MCDM | `.pmcdm-matrix-table` (dynamically generated rating grid), `.pp-rank-row` / `.pp-rank-fill` (ranked horizontal bars) |
| Journal | `.pj-entry`, `.pj-snapshot-chip` (cross-tool data snapshot chips) |
| Live indicator | `.live-dot` — the pulsing red dot used in each project's "live tool" header |

Both files use the same `:root` custom properties from `style.css`, so any palette change there cascades
automatically — no color values are duplicated in `personal-projects.css`.
