# Website page standard (Search Console marketing site)

**Status**: Canonical layout and storytelling system for `projects/Search_Console/docs/`.  
**Reference**: `projects/portfolio/` (see FORGE `projects/portfolio/docs/REFERENCE-TEMPLATE.md`).  
**Live home**: `index.html` is the source of truth.

Bump `CSS_VERSION` in `scripts/sync-site-chrome.py` when `css/style.css` changes materially. Run the sync script after header/footer/script updates.

## Visual rules

| Rule | Standard |
| ---- | -------- |
| Theme | Dark only (`color-scheme: dark` in `:root`). No light mode toggle. |
| Surfaces | Flat `#000000` base, `#1d1d1f` elevated bands. Borders `#424245` only. |
| Accent | `#2997ff` for links, CTAs, chart data, progress bar. Not for decorative section wash. |
| Forbidden | Radial/linear background gradients, glow shadows, left/right color stripes on marketing panels (FORGE PROJECT-LEARNINGS). |
| Typography | System stack in `:root --font`. Left-aligned chapter copy. Muted uppercase eyebrows. |
| Motion | Scroll reveal on `[data-reveal]`. Reduced motion disables reveal and scroll progress. |

## Page shell (every HTML page)

Required in `<body>`:

1. `#scroll-progress` bar (fixed top)
2. Skip link
3. Shared header (`scripts/sync-site-chrome.py`)
4. `<main id="main">`
5. Shared footer with footer dot wave
6. Scripts: `hero-dot-wave.js` (if page uses dot wave), `site-ui.js`, `i18n.js`

Stylesheet:

```html
<link rel="stylesheet" href="css/style.css?v=44">
```

Add `performance-chart.css` only when the page embeds `[data-performance-chart]`.

## Story chapter system (home + long-form pages)

Each content section uses this shape:

```html
<section class="story-chapter [modifiers]" id="section-id">
  <div class="story-chapter__inner">
    <header class="chapter-header reveal" data-reveal>
      <p class="chapter-eyebrow" data-i18n="…">Eyebrow</p>
      <h2 class="chapter-title" data-i18n="…">Headline</h2>
      <p class="chapter-lead" data-i18n="…">One short lead paragraph.</p>
    </header>

    <!-- body: pick ONE primary pattern per section (see below) -->

    <p class="chapter-bridge reveal" data-reveal>
      <a href="#next-section" class="chapter-bridge__link">
        <span data-i18n="story.bridge…">Continue · …</span>
        <span class="chapter-bridge__arrow" aria-hidden="true">→</span>
      </a>
    </p>
  </div>
</section>
```

### Section modifiers

| Class | Use |
| ----- | --- |
| `story-chapter` | Default prose width (`max-width: 48rem`). |
| `story-chapter--wide` | Screenshots, rails, wide media (`64rem`). |
| `story-chapter--alt` | Alternate band (`#1d1d1f` + top/bottom border). Use on every other chapter for rhythm. |
| `story-chapter cta-section` | Email signup panel (centered inner panel). |

### Body patterns (choose one)

| Pattern | Class | When |
| ------- | ----- | ---- |
| Proof bullets | `chapter-proof-list` | 3–5 short claims after a lead. No cards. |
| Pull quote | `chapter-pull-quote` | One sentence insight after chart or story beat. |
| Path arc + steps | `path-arc` + `path-step-list` | Onboarding / numbered flow. |
| Feature spec | `feature-stack` | Capability list with icons. No card grid. |
| Terms strip | `pricing-terms` | 3-column price facts with labels. |
| Chart | `performance-chart` + `data-performance-chart` | Product proof (see `partials/performance-chart.html`). Dual-scale lines, inset plot, stats strip. |
| FAQ | `faq-grid` | Accordion questions. |
| Pricing card | `pricing-card` | Single plan card (pricing chapter only). |

**Do not use** `surface-card` grids for story sections unless the content is truly a dense spec table. Prefer lists, timelines, and one chart.

## Home page arc (`index.html`)

| Order | ID | Pattern |
| ----- | -- | ------- |
| 1 | (hero) | `hero-chapter hero--home` + dot wave |
| 2 | `why-native` | proof list |
| 3 | `proof` | chart + pull quote |
| 4 | `how-to-use` | path arc + steps |
| 5 | `features` | feature stack |
| 6 | `screenshots` | screenshot rail (wide) |
| 7 | `pricing` | terms strip + pricing card |
| 8 | `faq` | accordion |
| 9 | `notify` | CTA panel |

Copy keys for bridges and proof chapter live under `story.*` in `locales/en.json`.

## Inner pages (about, releases, legal)

- Use the same shell (header, footer, CSS version, scripts).
- Replace legacy `.section`, centered heroes, and card grids with `story-chapter` blocks when touching those pages.
- Page-specific CSS belongs in `style.css` under a `page-*` scope, not inline `<style>` blocks.

## Partials

| File | Purpose |
| ---- | ------- |
| `partials/performance-chart.html` | Animated GSC chart embed |
| `partials/story-chapter-header.html` | Header snippet template |
| `partials/story-chapter-bridge.html` | Bridge link template |

## Maintenance

```bash
cd projects/Search_Console/docs
python3 scripts/sync-site-chrome.py
```

Syncs header, footer, scroll progress, and CSS cache-bust version across all static pages.
