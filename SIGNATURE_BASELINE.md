# SIGNATURE_BASELINE

## Scope

This baseline documents the locked glowing progress line motif before any Phase 3 additive extensions. It covers:

1. The global top-page progress bar on the homepage
2. The homepage production-path storyline spine and node progression

## Ownership

### Global top progress bar

- Markup: `index.html:16`
- Styling: `styles.css:271-282`
- Trigger logic: `script.js:7-13`, `script.js:303-305`

### Homepage production-path storyline line

- Section markup: `index.html:176-230`
- Spine markup: `index.html:184-185`
- Timeline items: `index.html:190-221`
- Styling: `styles.css:1381-1558`
- Trigger logic: `script.js:15-50`, `script.js:281-305`

## Current behavior

### Global top progress bar

- Appears only on the homepage.
- Sits fixed at the top edge of the viewport.
- Starts at `scaleX(0)` and grows left-to-right based on total page scroll progress.
- Uses no CSS transition for the fill itself; the scale is updated directly on scroll/resize.
- Behavior is continuous across the full homepage, not section-by-section.

### Homepage production-path storyline line

- Appears only in the `From idea to launch` section.
- Renders as a vertical spine centered through the storyline grid.
- The filled portion is controlled through the CSS variable `--story-progress`.
- As the section scrolls through the viewport center line, the spine fill grows downward.
- Each timeline item changes to `.is-passed` once the filled progress has crossed that item's connector point.
- The connector rule and node brighten when the item becomes passed.
- Supporting visual cards move with a small parallax offset tied to the same storyline progress value.

## Color source

### Global top progress bar

- Gradient is hard-coded in `styles.css:280`:
  - `rgba(255, 255, 255, 0.82)`
  - `rgba(170, 190, 210, 0.62)`
- Glow is hard-coded in `styles.css:281`:
  - `0 0 18px rgba(255, 255, 255, 0.18)`
- The bar is not currently driven by a single dedicated token.

### Homepage production-path storyline line

- Spine base uses hard-coded white-on-dark values in `styles.css:1408-1416`.
- Filled spine gradient uses hard-coded values in `styles.css:1427`:
  - `#ffffff`
  - `#f5fff0`
  - `#b8c7d9`
- Node and passed-state glows combine hard-coded white with existing cool accents in `styles.css:1444-1447`, `styles.css:1509-1511`, and `styles.css:1539-1542`.
- Timeline item labels use `var(--cyan)` in `styles.css:1556`.
- Storyline atmosphere also responds to `--story-cyan-alpha` and `--story-lime-alpha` from `script.js:23-26`.

## Trigger conditions

### Global top progress bar

- Trigger: browser scroll position over total document scrollable height.
- Calculation: `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`
- Update cadence: on `scroll` and `resize`.

### Homepage production-path storyline line

- Trigger: storyline section position relative to the viewport center line.
- Calculation: `(centerLine - rect.top) / rect.height`, clamped between `0` and `1`.
- Each timeline item flips to `.is-passed` when the progress height crosses that item's connector position.
- Update cadence: on `scroll` and `resize`.

## Timing / easing family

### Global top progress bar

- The bar fill has no explicit CSS transition; movement is immediate from scroll updates.

### Homepage production-path storyline line

- Story progress fill itself has no explicit transition; it is updated immediately from scroll.
- Timeline item passed-state transitions use `380ms ease` for border/background/box-shadow/filter changes in `styles.css:1465-1470`.
- Connector line transitions use `380ms ease` in `styles.css:1504`.
- Node transitions use `380ms ease` in `styles.css:1534`.
- Related reveal-on-enter animation uses:
  - `opacity 640ms ease`
  - `transform 760ms cubic-bezier(0.19, 1, 0.22, 1)`
  - `filter 760ms ease`
  from `styles.css:2602-2610`.

## Regression notes for later phases

- Do not change the global progress bar's position, height, or scroll-driven `scaleX` behavior.
- Do not change the storyline section's center-line-driven fill logic.
- Additive motif work in later phases must not alter:
  - the top bar fill behavior
  - the spine fill behavior
  - the passed-state thresholds
  - the current timing family listed above

## Preview notes

- No screenshots were taken in Phase 1.
- Regression checking later should compare homepage scroll behavior before and after any Phase 3 motif extensions.
