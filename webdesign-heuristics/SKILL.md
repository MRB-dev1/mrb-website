---
name: webdesign-heuristics
description: Apply a rigorous, mathematically-grounded web design system to any web/UI work — writing CSS, HTML, or components; choosing colors; building layouts; designing dark or light themes; sizing typography; debating spacing; wiring button states; or auditing accessibility. Activate even when the user doesn't explicitly say "design" — touching a stylesheet, picking a hex code or font size, or asking "make this look good"/"why does this look off"/"review my UI" all count. Operates in two modes — "back of mind" silently produces conforming code while the user is mid-task, and "review pass" inventories an existing design, lists violations, and proposes/applies fixes when explicitly invoked. Covers 4-layer color systems, 4-point spatial grids, modular type scales, Material 3 dark-mode opacity ladders, WCAG 2.1 contrast minimums, optical alignment, and remediation for the failure modes typical of AI-generated UI. Adaptive across light and dark themes — detect which is in scope before quoting numeric values.
---

# Web Design Heuristics

A distilled, mathematically-grounded system for building or auditing web interfaces. The goal is to replace intuition-based design with replicable rules that produce professional results consistently — then explain *why* the rule exists so it can be bent intelligently when context demands.

## Two operating modes

### 1. Back-of-mind (passive — the default while the user is mid-coding)

When the user is writing CSS, HTML, or components, **silently produce conforming code**. Don't dump the rule set. Don't lecture. Just make the right choice and move on. If the user explicitly asks "why this color?" or "why this size?", explain the rule that drove the choice in one sentence, then continue.

This mode is what triggers when keywords like CSS, HTML, component, hex, opacity, padding, border, hover, dark mode, light mode, layout, font-size, line-height, button, card, or modal appear in the conversation.

### 2. Review pass (active — when explicitly invoked)

Triggers: "design review", "audit my UI", "fix the design", "apply the heuristics", "run the webdesign skill", or any clear directive to evaluate existing work. Workflow:

1. **Inventory** — read the relevant CSS/components/templates. Catalog current colors, spacing values, typography, borders, state styles. If the codebase is large, ask which routes/components to focus on.
2. **Detect theme** — see "Theme adaptiveness" below. Ask the user if ambiguous; numeric recommendations differ between light and dark.
3. **Audit** — for each element, compare to the heuristics. Cite the specific rule that's broken and why it matters (e.g. "body text uses `#000000` — failure mode 5; produces eye strain on white and flattens hierarchy because there's no headroom for emphasis").
4. **Propose** — present a table to the user before editing: location → current → recommended → rule cited → severity. Order by severity (WCAG failures first, then hierarchy/contrast, then spacing, then polish).
5. **Apply** — once approved, edit the files. Prefer extending existing CSS variables over hardcoding new values. Don't refactor structure beyond what the fix requires. Don't add commentary the user didn't ask for.

## Theme adaptiveness

Light and dark themes share the same *principles* but use different *numbers*. Always detect the active theme before quoting any opacity, lightness delta, or contrast number. Look for:

- `@media (prefers-color-scheme: dark)` blocks
- CSS variables named `--theme-dark`, `--bg-dark`, etc.
- Body/`:root` background colors (very dark luminance ⇒ dark theme; near-white ⇒ light theme)
- HTML attributes like `data-theme="dark"`, `class="dark"`, etc.

If both themes are in scope (as is typical), apply both rule sets and ensure the values are kept in semantic CSS variables so the same component reads correctly under either theme. If unclear, ask once before recommending numbers.

## Conflict resolution

When the heuristics disagree, resolve in this order:

1. **WCAG accessibility minimums always win.** Never lower contrast below 4.5:1 (body) or 3:1 (large text + non-text UI) for any aesthetic reason. If a heuristic recommends a value that breaks WCAG, the heuristic loses.
2. **More precise source wins.** Material 3 implementation values supersede general prose guidance. Specifically:
   - **Dark-mode white text on neutral surfaces: `0.87 / 0.60 / 0.38` (primary / secondary / disabled).**
   - **`0.38` is reserved for disabled only — not for "tertiary readable text".** Tertiary readable copy stays at `0.60`.
   - **Dark-mode white text on coloured/branded surfaces: `1.00 / 0.74 / 0.38`** (or, preferably, the paired semantic on-color at full opacity).
3. **Context overrides the universal rule.** Several rules are contextual divergences, not contradictions. Always check the element kind before applying:
   - **Line-height:** 1.1–1.2 for *display headings* (H1/H2), 1.4–1.6 for *body copy*. Don't compress body copy.
   - **Grids:** 12-column macro grids are appropriate for *data-heavy dashboards*; loosened or abandoned for *marketing landing pages* where focal anchors and visual rhyming dictate flow.
   - **Modular scale:** low-contrast (1.067, 1.125) for *dense dashboards*; high-contrast (1.333, 1.618) for *marketing/editorial*.

## The 25 heuristics — quick reference

Use this table as the working checklist. Every entry is "if condition then action." Read the relevant `references/<topic>.md` for the underlying reasoning when context is ambiguous.

### Typography & readability

| # | If… | Then… |
|---|-----|-------|
| 1 | The text is body copy / paragraphs | `line-height: 1.4`–`1.6` (140–160%). Never compress body. |
| 2 | The text is a display heading (H1/H2) | `line-height: 1.1`–`1.2`; tighten letter-spacing -2% to -3%. |
| 3 | A line of body copy can exceed ~80 characters | Constrain `max-width` (~65–75ch). |
| 4 | The font size is below 16px | Increase letter-spacing slightly to preserve legibility. |
| 5 | The interface is a dense dashboard | Use a low-contrast modular scale (1.067 Minor Second or 1.125 Major Second). |
| 6 | The interface is a marketing/editorial page | Use a high-contrast modular scale (1.333 Perfect Fourth or 1.618 Golden Ratio). |
| 7 | Defining the typographic scale | Cap distinct font sizes at six total. |

### Color, theming, and contrast

| # | If… | Then… |
|---|-----|-------|
| 8 | Setting primary text on a light background | Never use `#000000`. Use `rgba(0,0,0,0.87)` (or equivalent dark gray) for primary, `0.60` for secondary. |
| 9 | Setting primary text on a *neutral* dark background | Use `rgba(255,255,255,0.87)` primary, `0.60` secondary, `0.38` disabled only. |
| 10 | Setting text on a *coloured/brand-filled* dark surface | Use the paired semantic `on-*` color at full opacity (`onPrimary`, `onSecondary`). Don't use translucent white. |
| 11 | Designing an elevated card in light mode | Separate from background by a ~2% lightness delta. |
| 12 | Designing an elevated card in dark mode | Separate by 4–6% lightness delta. Surfaces get *lighter* as elevation increases. |
| 13 | Defining warning / error / success states | Override brand colors with semantic hues (red / yellow / green); status must read as status regardless of brand. |
| 14 | Drawing a structural border on a light card | Use ~85% off-white, not pure black 1px. |
| 15 | Generating a charting / data-viz palette | Use OKLCH so all hues share perceived brightness. |

### Spatial, optical, and component logic

| # | If… | Then… |
|---|-----|-------|
| 16 | Setting any margin / padding / gap | Pixel value must be a multiple of 4 (4, 8, 12, 16, 24, 32, 48, 64). |
| 17 | An icon sits next to a text label | The icon's bounding height matches the text's line-height exactly. |
| 18 | Placing text inside a button | Reduce the text-side padding slightly for optical alignment. |
| 19 | Centering an asymmetrical icon (play, arrow) in a geometric container | Manually shift it *opposite* the heaviest visual mass. CSS centering won't look centered. |
| 20 | Aligning a dropdown below its trigger | Offset horizontally by the dropdown's internal padding so the text axes share a line. |

### Layout, components, and feedback

| # | If… | Then… |
|---|-----|-------|
| 21 | Adding signifiers (icons in nav, status, etc.) | Use Phosphor / Lucide / Heroicons. Never Unicode emojis. |
| 22 | A user inputs complex / multi-stage / sensitive data | Use a center-screen modal, not a side fly-out. |
| 23 | Designing a pricing table | The numerical price dominates; the plan name is significantly smaller. |
| 24 | An element is interactive | Engineer four states: default, hover, active (pressed), disabled. |
| 25 | An initial layout feels structurally flawed | Apply the Producer Method: drastic variation (invert light/dark, swap focal element) before iterating on the existing direction. |

## State layers — the dark-theme specifics

For interaction feedback on dark UIs, layer a translucent white over the resting surface (don't change text color):

- **Hover** — `rgba(255,255,255,0.08)`
- **Focus** — `rgba(255,255,255,0.10)`
- **Pressed** — `rgba(255,255,255,0.10)`
- **Dragged** — `rgba(255,255,255,0.16)`

Light themes use translucent black at the same alpha steps. **Never lower `opacity:` on a parent container** to de-emphasize text — it cascades into icons, borders, shadows, and state layers, breaking hierarchy and feedback simultaneously. Put alpha on the color itself with `rgba()` or modern `rgb(... / α)`.

## Drop-in CSS variable scaffold

When the project has no semantic token system, propose this `:root` block before applying values, then remap the rest of the work to these tokens. It's the simplest scaffold that respects every numeric rule above and is theme-adaptive.

```css
:root {
  /* Light theme defaults */
  --text-high: rgba(0, 0, 0, 0.87);
  --text-medium: rgba(0, 0, 0, 0.60);
  --text-disabled: rgba(0, 0, 0, 0.38);
  --state-hover: rgba(0, 0, 0, 0.04);
  --state-focus: rgba(0, 0, 0, 0.08);
  --state-pressed: rgba(0, 0, 0, 0.10);
  --divider-subtle: rgba(0, 0, 0, 0.12);
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-high: rgba(255, 255, 255, 0.87);
    --text-medium: rgba(255, 255, 255, 0.60);
    --text-disabled: rgba(255, 255, 255, 0.38);
    --state-hover: rgba(255, 255, 255, 0.08);
    --state-focus: rgba(255, 255, 255, 0.10);
    --state-pressed: rgba(255, 255, 255, 0.10);
    --state-dragged: rgba(255, 255, 255, 0.16);
    --divider-subtle: rgba(255, 255, 255, 0.12);
  }
}
```

## Reference files (read on demand)

The references below contain full reasoning and edge cases. Read whichever is relevant; in parallel if a question crosses domains.

- [`references/typography.md`](references/typography.md) — modular scales (1.067 → 1.618), leading/tracking math, font pairing, super families, the 6-size cap, opacity-driven hierarchy.
- [`references/color-and-theming.md`](references/color-and-theming.md) — 4-layer color system, OKLCH theory, light vs dark mathematics, Material 3 opacity ladders for both surface types, state layers, elevation overlay formula `α = ((4.5 · ln(elev + 1)) + 2) / 100`.
- [`references/spatial-and-layout.md`](references/spatial-and-layout.md) — 4-point grid, optical alignment, focal anchors (Star of the Show), visual rhyming, depth via noise + glassmorphism instead of heavy drop shadows.
- [`references/accessibility.md`](references/accessibility.md) — WCAG 2.1 AA (4.5:1 / 3:1 / 3:1) and AAA (7:1 / 4.5:1) ratios, structural heading order, alt text, focus-visible.
- [`references/failure-modes.md`](references/failure-modes.md) — 10 named anti-patterns and their remediations (vibe-coded UI, palette inversion, math-centering fallacy, spreadsheet look, high-opacity text, arbitrary sizing, semantic over-decoration, font similarity clash, harsh borders, low-contrast degradation).
- [`references/qa-protocol.md`](references/qa-protocol.md) — 4-phase pre-launch checklist (discovery → spatial verification → WCAG audit → technical/UX/SEO QA).
- [`references/glossary.md`](references/glossary.md) — design tokens, modular scale, optical vs mathematical centering, OKLCH, visual rhyming, affordances vs signifiers.

## What this skill never recommends

A short list, surfaced here so the back-of-mind mode catches them without needing to consult a reference:

- `#000000` text on light backgrounds, or 100% white text on dark backgrounds for body copy.
- A 1px pure-black border around light-mode cards.
- Direct hex inversion to produce a dark theme.
- `opacity:` on a parent to de-emphasize text.
- Unicode emojis as UI signifiers.
- Identical or near-identical font pairings (e.g. Georgia + Times). Maximize architectural contrast.
- More than 6 distinct font sizes per project.
- Padding / spacing values that aren't multiples of 4.
- Brand colors used for warning/error/success.
- A "minimalist" gray-on-white text choice that fails 4.5:1.
- Repeating identical KPI cards across views without consolidation (the AI-generated dashboard symptom).
- Lowering `0.38` opacity onto readable-but-tertiary text. `0.38` is the disabled rung.
