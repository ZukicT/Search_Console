# Website page standard (Search Console marketing site)

**Status**: Canonical layout and storytelling system for `projects/Search_Console/docs/`.  
**Reference**: `projects/portfolio/` (see FORGE `projects/portfolio/docs/REFERENCE-TEMPLATE.md`).  
**Live home**: `index.html` is the source of truth.

Bump `CSS_VERSION` in `scripts/sync-site-chrome.py` when `css/style.css` changes materially. Run the sync script after header/footer/script updates.

## Visual rules

The site matches the app's white Carbon design from version 2.5. The earlier dark glass theme is gone.

| Rule | Standard |
| ---- | -------- |
| Theme | Light only (`color-scheme: light` in `:root`). No dark mode toggle. |
| Surfaces | White `#ffffff` base, Gray 10 `#f4f4f4` for alternate bands. Rules `#e0e0e0`, 1px. |
| Text | Gray 100 `#161616`, supporting Gray 70 `#525252`. |
| Accent | Blue 60 `#0f62fe` for links, CTAs, chart data and the progress bar. Hover `#0043ce`, pressed `#002d9c`. |
| Shape | Square corners everywhere. No shadows, no blur, no glass. The global rule at the end of `css/style.css` enforces this. |
| Typography | System stack. Headings are light weight. Eyebrows, pills and small labels use `--font-mono`, uppercase with wide tracking. |
| Buttons | Flat blue fill, darker on hover and press. No scale on press. |
| Brand | Blink (`Bot-*.png`) is the only character: solid blue, no outline. The blue tile cluster sits top right of the home hero. |
| Screenshots | Real captures from the app in demo mode, in a 1px ink frame. Source: `dev-docs/app-store-images/src/`. |
| Forbidden | Rounded cards, gradients as decoration, glow, glass, a second accent colour, other mascots. |
| Motion | Scroll reveal on `[data-reveal]`. Reduced motion disables reveal and scroll progress. |

Home page (`index.html`) order: hero (`.home-hero`, with the live Blink SVG driven by the block at the end of `js/site-ui.js`), film (`#film`, a poster that swaps to the YouTube player on click), Blink, why an app, the numbers, getting started, what is inside, the app, plans, FAQ. Motion matches the app: fade with an 8px rise over 0.28s, 0.04s staggers, no scale or bounce on interface elements. Blink is the one exception and may hop.

Sound: `window.SiteSound` (end of `js/site-ui.js`) plays the app's short synthesised tones on clicks: `advance` for primary buttons, `tick` for small controls and chart scrubbing, `select` for picking a figure, `pop` for the film, `hop` for Blink, `chart` when a blog chart scrolls into view (after the first click or key press). Nothing plays before the visitor's first click, the hero has a Sound on/off toggle that is remembered, and anything that can repeat is rate limited. `SiteSound.measure(name)` renders a sound offline and reports its peak and length, for checking without speakers.

The numbers section is a live copy of the app's Overview (`[data-overview-demo]`): pick a figure to redraw the chart, drag along it to read a day. Its data is sample data and is labelled as such.

Copy rules: the app is independent and not made by Google; say so. Never state a figure, price or feature the app does not have. The trial is 3 days. The free plan has ads and one property.

To change locale copy for a release, add the strings to a script like `scripts/apply-2.5-copy.py` so all nine languages change together. `scripts/sync-site-chrome.py` owns the header, footer, banner text and asset versions; edit it there, not in each page.

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
<link rel="stylesheet" href="css/style.css?v=100">
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
