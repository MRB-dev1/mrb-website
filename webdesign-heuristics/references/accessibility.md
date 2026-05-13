# Accessibility (WCAG 2.1)

Accessibility isn't an aesthetic add-on — it's the floor. WCAG 2.1 is the legally-recognized standard in most jurisdictions; AA is the practical baseline, AAA is for content where additional care is genuinely warranted (e.g. government, finance, healthcare).

The single rule that overrides every aesthetic heuristic in this skill: **never lower contrast below WCAG minimums for any visual reason.** If a "design improvement" makes text harder to read, it isn't an improvement.

## Contrast ratios — the numbers

Contrast is measured as the ratio between the relative luminance of the foreground and background. `1:1` is invisible (same color); `21:1` is the maximum (pure black on pure white).

| Tier | Element | Minimum ratio |
|------|---------|---------------|
| **AA** | Standard body text | **4.5:1** |
| **AA** | Large text (≥18pt / 24px, OR ≥14pt / 18.5px bold) | **3:1** |
| **AA** | Non-text UI: form input borders, button outlines, icons that convey meaning, focus indicators, status indicators | **3:1** |
| **AAA** | Standard body text | 7:1 |
| **AAA** | Large text | 4.5:1 |
| Exempt | Inactive (disabled) components, pure decoration, logotypes | No requirement |

When in doubt, run pairings through a contrast checker (WebAIM, Stark, browser DevTools). Don't eyeball — perception is unreliable across monitors and lighting conditions.

### What counts as "large text"

Large text is whatever is **18pt or larger** (24px), **OR 14pt or larger if it's bold** (18.5px bold). Anything smaller is standard text and gets the 4.5:1 floor regardless of weight or font.

A common mistake: treating all headings as "large text" and giving H3/H4/H5 the 3:1 floor. Only headings that actually render at ≥24px (or ≥18.5px bold) qualify. A 16px H4 needs 4.5:1.

## Body text against backgrounds — quick reference

| Foreground | Background | Approximate ratio |
|------------|-----------|-------------------|
| `#FFFFFF` | `#121212` | 17.4:1 ✓ AAA |
| `rgba(255,255,255,0.87)` | `#121212` | ~14.7:1 ✓ AAA |
| `rgba(255,255,255,0.60)` | `#121212` | ~9.0:1 ✓ AAA |
| `rgba(255,255,255,0.38)` | `#121212` | ~5.0:1 ✓ AA standard, ✗ AAA standard |
| `rgba(0,0,0,0.87)` | `#FFFFFF` | ~16.1:1 ✓ AAA |
| `rgba(0,0,0,0.60)` | `#FFFFFF` | ~7.4:1 ✓ AAA |
| `rgba(0,0,0,0.38)` | `#FFFFFF` | ~3.9:1 ✗ AA standard, ✓ AA large |

Note that the 0.38 disabled rung passes AA on dark backgrounds but fails AA standard on light backgrounds. This is fine because **disabled is exempt** from contrast requirements — but it underscores why `0.38` should never be used for readable copy. If you want tertiary readable text on a light page, stay at `0.60`.

## Non-text contrast — the often-forgotten rule

WCAG 2.1 added the 3:1 minimum for **non-text UI**. This catches:

- **Form input borders** — a `1px` border in `rgba(0,0,0,0.12)` on white is roughly 1.2:1 — it fails. Use `rgba(0,0,0,0.38)` or darker (or pair with a label/icon that conveys the input boundary).
- **Focus rings** — must be 3:1 against both the focused element AND the surrounding background.
- **Icon-only buttons** — the icon needs 3:1 against its background.
- **Status indicators** (a colored dot for "online" / "offline") — needs 3:1 against the surface.
- **Chart elements** — bars, lines, and points need 3:1 against the chart background.

Common failure: a hover state that's defined only by a 0.04 alpha tint. Visually too subtle to register at 3:1. Strengthen the hover treatment, or add a secondary signifier (underline, slight scale shift, color change).

## Focus visibility

Every interactive element must have a clearly visible focus indicator. Default browser focus rings are functional but ugly; the temptation is to remove them with `outline: none` and never replace them — that's an accessibility failure.

```css
/* Acceptable focus pattern */
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

The `:focus-visible` pseudo-class shows the ring only for keyboard navigation, not mouse clicks — best of both worlds. The ring color should hit 3:1 against both the focused element and the surrounding surface. A common safe choice is the brand primary color at `oklch(0.6 0.18 hue)`-range lightness, paired with a 2px offset so the ring doesn't blend into the element's own border.

## Structural / semantic checks

Beyond contrast, these are the most common accessibility failures in modern hand-coded sites:

- **One H1 per route.** Skipping heading levels (H1 → H3 with no H2) breaks screen-reader navigation. Heading hierarchy should mirror visual hierarchy.
- **Alt text on every non-decorative image.** Decorative images get `alt=""` (empty but present, so screen readers skip them). Functional images get descriptive alt text. Don't write "image of…" — screen readers already announce that.
- **Buttons vs links.** A `<button>` triggers an action; an `<a href>` navigates. Don't use a `<div onclick=...>` for either — neither keyboard nor screen reader will recognize it. `role="button"` on a div is a fallback, not a substitute.
- **Form labels.** Every input needs a `<label>` (or `aria-label` if no visual label is shown). Placeholder text isn't a label — it disappears on focus.
- **Color isn't the only signal.** A red error border alone fails users with color-vision differences. Pair color with an icon, text, or pattern.
- **Animations and motion.** Respect `prefers-reduced-motion`. Disable parallax, large-distance translations, and auto-play video for users who request it.
- **Tap targets ≥ 44×44 CSS pixels** for mobile. Buttons and links smaller than this fail WCAG 2.5.5 (Target Size, AAA, but a strong AA recommendation).

## Patterns that frequently fail — and what to do

| Symptom | Likely violation | Fix |
|---------|-----------------|-----|
| "Light gray text on white for minimalist look" | 4.5:1 body contrast | Bump to `rgba(0,0,0,0.60)` minimum, or `0.87` for primary. |
| Placeholder text *is* the label | 1.4.1 / 3.3.2 (no programmatic label) | Add `<label>` (visually hidden if needed) or `aria-label`. |
| Focus ring removed entirely | 2.4.7 (focus visible) | Replace with `:focus-visible` styling. |
| Icon-only button with no label | 4.1.2 (name/role/value) | Add `aria-label` describing the action. |
| Modal traps that don't trap focus correctly | 2.4.3 (focus order) | On open, move focus into the modal; on close, restore to trigger. Use a focus-trap library if rolling your own. |
| Required fields marked only by a red `*` | 1.3.3 (sensory characteristics) | Add the word "required" via `aria-required` or visible text. |
| Animations that move >5px and can't be disabled | 2.3.3 (animation from interactions) | Wrap motion in `@media (prefers-reduced-motion: no-preference)` or provide a toggle. |

## When auditing an existing site

Order of operations:

1. Run an automated tool first (axe DevTools, WAVE, Lighthouse). Catches the easy 30%.
2. Tab through the page from the address bar. Every interactive element should be reachable, focus should be visible, and tab order should match visual order.
3. Use a screen reader (NVDA on Windows, VoiceOver on Mac). At minimum, navigate the homepage end-to-end and try one form.
4. Test at 200% browser zoom. Layout shouldn't break, text shouldn't truncate.
5. Test with `prefers-reduced-motion` enabled.

Automated tools catch programmatic violations. They don't catch "the alt text is wrong" or "the heading order doesn't make sense" — humans still verify the *quality* of the semantics.

## Severity priority for a review pass

When auditing and proposing fixes, order by severity:

1. **Critical** — body text fails 4.5:1, no keyboard navigation possible, missing form labels, missing focus indicators.
2. **High** — large text fails 3:1, non-text UI fails 3:1, heading hierarchy broken, decorative-only color signals.
3. **Medium** — alt text missing or generic, focus ring weak, tap targets under 44×44.
4. **Low** — minor contrast for AAA pursuit, animation-related improvements, polish.

Surface critical and high issues to the user first; fold low-priority items into a follow-up list.
