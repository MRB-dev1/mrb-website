# Typography

Typography is the structural scaffolding of an interface — most of "design" is text. Master typographic hierarchy and most other choices fall out from it.

## Modular scales

A modular scale is a sequence of font sizes derived by multiplying a base size by a fixed ratio, repeated. It produces a harmonic, predictable hierarchy rather than arbitrary sizes.

Pick the ratio based on the kind of interface:

| Ratio | Name | Use case |
|-------|------|----------|
| 1.067 | Minor Second | Dense dashboards, data tables, admin tools — keeps elements tightly grouped |
| 1.125 | Major Second | Dashboards with slightly more hierarchy needed |
| 1.200 | Minor Third | Standard product UI, balanced editorial |
| 1.250 | Major Third | Common general-purpose default |
| 1.333 | Perfect Fourth | Marketing landing pages — clear hierarchy with display impact |
| 1.414 | Augmented Fourth | Hero-driven editorial |
| 1.500 | Perfect Fifth | Large display contrast |
| 1.618 | Golden Ratio | Maximum drama — landing pages, brand storytelling |

Worked example with base 16px and ratio 1.250:

```
12.80  /  16.00  /  20.00  /  25.00  /  31.25  /  39.06  /  48.83
caption / body / lead / h3 / h2 / h1 / display
```

Round to the nearest pixel or rem in implementation. Six sizes is the cap — if you need a seventh, you've got a hierarchy problem, not a scale problem.

## Line height (leading)

The single biggest readability lever. Two contexts, two answers:

- **Body copy / paragraphs / long-form**: `1.4` to `1.6` (140–160%). Goes up to `1.8` for very long-form editorial. Below 1.4, eye fatigue spikes; cognitive parsing breaks down.
- **Display headings (H1, H2, sometimes H3)**: `1.1` to `1.2` (110–120%). Headings are visual anchors, not reading material — excess line-height padding makes the heading look like it's floating in extra space and disrupts optical alignment with adjacent elements.

Don't apply heading line-height to body copy. The aesthetic appeal of tight leading is a heading-only effect.

## Letter spacing (tracking)

- **Display headings**: tighten `-0.02em` to `-0.03em` (-2% to -3%). Modern grotesk and serif display faces look noticeably more solid this way.
- **Body copy**: leave at the font's natural metrics. Don't track body.
- **Small caps / tiny labels (under 12px)**: open up to `+0.02em` to `+0.05em` to preserve legibility.
- **All-caps labels**: open up `+0.05em` to `+0.1em` (caps need more breathing room).

## Font pairing — super families and architectural contrast

Two typefaces that look similar register as a rendering error, not an intentional design choice. Maximize architectural contrast:

- A condensed serif (e.g. Instrument Serif, Editorial New) paired with a wide sans-serif (e.g. Geist, Inter, GT Walsheim).
- A geometric grotesk (Inter) paired with a humanist serif (Source Serif).
- A super family that explicitly ships sans + serif + mono designed together (IBM Plex, Söhne, GT America) — these are pre-tuned to coexist.

Avoid: Georgia + Times, Helvetica + Arial, Inter + Helvetica. Too similar.

A practical rule: if you can swap one font for the other and the page still reads the same, they're too similar.

## Hierarchy via opacity, not size alone

Text emphasis is a function of weight, size, *and* opacity. Mapping hierarchy purely with size produces a stair-stepped feel; mapping with opacity produces depth. The opacity ladder for text on neutral backgrounds:

| Role | Light theme | Dark theme |
|------|-------------|-----------|
| Primary | `rgba(0, 0, 0, 0.87)` | `rgba(255, 255, 255, 0.87)` |
| Secondary / supporting | `rgba(0, 0, 0, 0.60)` | `rgba(255, 255, 255, 0.60)` |
| Disabled | `rgba(0, 0, 0, 0.38)` | `rgba(255, 255, 255, 0.38)` |

Important: `0.38` is **disabled only**. Tertiary readable text (timestamps, captions, metadata) stays at `0.60`. Drop to `0.38` only for unavailable / inactive states. This is where older guidance ("40% for tertiary") is wrong — it pushes readable copy below the WCAG floor and conflates disabled-state styling with hierarchy.

For text on coloured/branded surfaces, **don't** use translucent white — use the paired semantic on-color (e.g. `--on-primary`) at full opacity. Translucent white on saturated brand backgrounds shifts hue unpredictably.

## Font size floor and zoom

- Body copy: 16px minimum (sometimes 17–18px for marketing). 14px is acceptable for dense data tables and metadata only.
- Below 12px is rare in a healthy design — usually a sign that something else (density, scale, hierarchy) needs rethinking.
- Don't disable user zoom (`maximum-scale=1` on viewport meta is an accessibility failure).

## The 6-size cap

A typographic system should have at most 6 distinct font sizes in production. More than that and:

- Spacing rhythm fragments (each size has its own optical line-height needs).
- Developers lose track of which size to use for what.
- The hierarchy stops reading as a hierarchy — it starts to read as visual noise.

Six sizes typically maps to: caption, body, lead, h3, h2, h1 (with optional display variant if a marketing route demands it).

## When the user just wants type that looks nice

A safe default starting point for a vanilla light-theme website:

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Source Serif Pro', Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --size-caption: 0.8rem;   /* 12.8px */
  --size-body: 1rem;        /* 16px   */
  --size-lead: 1.25rem;     /* 20px   */
  --size-h3: 1.563rem;      /* 25px   */
  --size-h2: 1.953rem;      /* ~31px  */
  --size-h1: 2.441rem;      /* ~39px  */

  --leading-tight: 1.15;
  --leading-normal: 1.5;

  --tracking-tight: -0.02em;
  --tracking-normal: 0;
}

h1, h2 { line-height: var(--leading-tight); letter-spacing: var(--tracking-tight); }
h3, p, li { line-height: var(--leading-normal); }
```

Adjust the ratio if the project skews dashboard (use 1.125) or marketing (use 1.333+).
