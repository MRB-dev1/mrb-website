# Glossary

Precise terminology for the concepts referenced throughout this skill. When the user asks "what's a modular scale?" or "why does optical alignment matter?", the answer lives here.

## Affordance vs. signifier

An **affordance** is a property an object has that enables an interaction. A button affords clicking. A scrollable region affords scrolling. A draggable item affords dragging.

A **signifier** is the visible cue that communicates the affordance to the user. The drop shadow, border radius, and color shift on hover are signifiers — they tell the user "this is a button you can click" without requiring instructions.

The distinction matters because an interface can have an affordance without a signifier, and that's a usability failure. A clickable `<div>` with no visual styling has the affordance (it does respond to clicks) but no signifier — users won't know it's clickable. Modern interface work is mostly about ensuring every affordance has a clear signifier.

## Design tokens

Platform-agnostic, semantic units of a design system, exposed as named values rather than raw hex codes or pixel numbers. Instead of `#0055FF`, the system uses `--color-button-primary`. Instead of `16px`, it uses `--space-4`.

The point isn't readability; it's centralization. When the brand updates the primary color, every button, link, focus ring, and accent across the entire web/iOS/Android codebase updates by changing one token's value. This is impossible with hardcoded hexes.

The W3C Design Tokens Community Group is standardizing a JSON format so tokens can be authored once and consumed across Figma, Style Dictionary, Tailwind, native iOS/Android, etc. A typical token taxonomy:

```
--color-{namespace}-{role}-{variant}-{state}

--color-bg-page                 (top-level page background)
--color-bg-card                 (card surface)
--color-text-primary            (body text)
--color-text-secondary
--color-border-subtle
--color-button-primary-bg
--color-button-primary-bg-hover
--color-status-success
```

The naming hierarchy goes from general (namespace) to specific (state). This makes IDE autocomplete useful and prevents collisions.

## Modular scale

A typographic scale derived by multiplying a base size by a fixed mathematical ratio, then repeating. With base = 16 and ratio = 1.250:

```
12.80  →  16  →  20  →  25  →  31.25  →  39.06  →  48.83
```

The point is that all sizes share a harmonic relationship — they "fit together" the way notes in a musical scale do. Pick a ratio based on the contrast you want:

- 1.067 (Minor Second) — minimal contrast, dense dashboards
- 1.125 (Major Second) — slight contrast
- 1.200 (Minor Third) — balanced
- 1.250 (Major Third) — common default
- 1.333 (Perfect Fourth) — strong marketing
- 1.500 (Perfect Fifth) — display-heavy
- 1.618 (Golden Ratio) — maximum drama

Same principle works for spacing scales, but spacing tolerates a few more values (~9–12) than typography (cap at 6).

## Optical alignment vs. mathematical centering

**Mathematical centering** uses the bounding box of an element. The CSS `place-items: center` algorithm finds the geometric center of a rectangle and aligns there.

**Optical centering** uses the *visual mass* of an element — where the dark/heavy regions actually sit. Asymmetric shapes (a play triangle, a downward arrow, a single asymmetric letter mark) have visual mass that doesn't match the bounding box's geometric center.

The classic example: a play icon (right-pointing triangle) inside a circle. CSS centers the bounding rectangle. The eye sees the triangle's mass leaning right, perceives the icon as "off-center to the left," and a small leftward push by CSS makes it look right.

This isn't a bug to be fixed in CSS. The eye is right; CSS is approximating. The remediation is a manual offset of 1–2px after CSS centering, sized by visual judgment.

Same logic applies to text inside containers (the line-height bounding box overshoots glyph height, so text needs slightly less padding on its baseline side), caps + lowercase mixes, and any logo mark with asymmetric character.

## OKLCH

A color space with three coordinates: `L` (perceptual lightness, 0–1), `C` (chroma, 0–~0.4), `H` (hue, 0–360°). Pronounced "oh-clutch."

Why it matters: traditional `HSL` and `RGB` are mathematically defined but not perceptually uniform. Two HSL colors with identical lightness can look dramatically different in brightness because the formula doesn't model human perception. OKLCH does. `oklch(0.7 0.15 30)` (reddish) and `oklch(0.7 0.15 240)` (blue) actually look the same brightness.

This unlocks:
- **Programmatic palette generation**: increment lightness by a fixed step and the result is consistent across hues.
- **Accessible chart palettes**: every series in a multi-line chart can be at the same perceived intensity.
- **Predictable interpolation**: gradients and animations between OKLCH values move through perceptually-balanced intermediate colors.

CSS support is solid in modern browsers. Older browsers fall back through a `@supports (color: oklch(0% 0 0))` block. For projects that ship to a wide audience, generate values in OKLCH and convert to hex/HSL fallbacks at build time.

## Star of the Show (focal anchor)

Every unique interface view should have exactly one dominant element — a "Star of the Show" — that captures the eye and anchors the visual hierarchy.

Candidates:
- An oversized headline (typography as the focal element)
- An interactive demo (the product itself, working, on the homepage)
- A high-contrast image with intentional composition
- A bold abstract gradient or large branded shape

Without a focal anchor, the page reads as flat — every element competing equally. With multiple competing focal anchors, no single one wins. The rule is **one per view**.

The focal anchor should match the brand's identity. Technical product → demonstrate the product. Editorial brand → expressive typography. Visual brand → photography or illustration.

## Visual rhyming

The systematic repetition of small geometric motifs across disparate components, building subconscious cohesion.

Examples:
- A specific corner radius (e.g. `4px`) used on every container — buttons, cards, inputs, image masks, avatars.
- An angle from the brand mark (e.g. a 30° diagonal) repeated as a chevron, a section divider, an image clip path.
- A specific stroke width used for icons, dividers, and decorative rules.

It works the way poetic rhyming does: the user doesn't consciously notice, but the repetition produces a sense of "designed-ness." When a website feels "considered" without an obvious reason, this is usually it.

## "Producer Method"

When a design feels stuck or fundamentally not working, the natural impulse is to keep tweaking the existing direction. This is local optimization toward a flawed maximum and rarely produces a good result.

The Producer Method instead forces a structural reset: produce a drastically different variation before continuing to refine. Examples of "drastic":

- Invert the entire palette (light → dark or vice versa).
- Swap the focal element type (image hero → typography hero).
- Flip the primary axis (vertical → horizontal split).
- Replace the dominant geometric motif (rounded → sharp; organic → grid).

The new variation rarely *is* the answer, but the comparison between the two reveals what the original was missing — or what the original got right that the variation lost. Either way, the structural understanding deepens, and the next iteration is more decisive.

## State layer

A translucent overlay rendered over a resting surface to provide interaction feedback (hover, focus, pressed, dragged) without changing the underlying surface or text colors.

Implementation: a pseudo-element (`::before` or `::after`) absolutely positioned to fill the parent, with a translucent fill color matching the foreground. On dark surfaces, the fill is white. On light surfaces, it's black. The alpha steps for current Material 3 are:

- Hover — 0.08
- Focus — 0.10
- Pressed / active — 0.10
- Dragged — 0.16

The advantage over changing element colors directly: state layers compose with any underlying surface (brand-colored buttons, neutral cards, custom tints) and don't break text contrast or hierarchy. They're also trivially animatable via `transition: background 120ms`.

## Tonal elevation

A dark-mode-specific technique where elevated surfaces are visually distinguished by overlaying white at progressively higher alphas as elevation increases. The official Material 3 formula:

```
α = ((4.5 · ln(elev + 1)) + 2) / 100
```

Common checkpoints: 1dp `0.05`, 3dp `0.08`, 6dp `0.11`, 8dp `0.12`, 12dp `0.14`, 16dp `0.15`, 24dp `0.16`.

This replaces drop shadows in dark mode (where shadows have nowhere darker to go and become invisible). The visual effect: elevated surfaces look slightly *lighter* than the page, not darker — which matches how dark elevation reads to the human eye.

In light mode, the equivalent technique is the 2% lightness delta between surfaces; tonal elevation is primarily a dark-mode tool.
