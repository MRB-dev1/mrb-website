# Spatial systems and layout

Spacing is the silent component of the interface. When it's right, no one notices. When it's wrong, the page feels amateurish even if every individual element is well-designed. The fix is not aesthetic taste — it's mathematical consistency.

## The 4-point grid

Every margin, padding, gap, and dimensional measurement should be a multiple of 4: `4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128`. (Use 8-point if the project skews larger and dense rounding to 4 isn't necessary, but 4-point is the safer default — it halves cleanly to 2 for fine adjustments.)

Why 4 specifically:
- Standard screen densities (1×, 1.5×, 2×, 3×) all scale multiples of 4 to whole pixels.
- A 4-multiple system halves cleanly twice (4 → 2 → 1) before hitting a fractional pixel.
- Designers and developers can mentally enumerate the scale, so cross-team consistency is achievable without lookup.

When the user proposes 7px, 13px, 17px, 22px — round to the nearest multiple of 4. Don't ask permission for this; it's a system rule, not a design decision. If the user *insists* on an off-grid value, it should be a deliberate exception with a reason.

## A practical spacing scale

For a `:root` token block, the following covers most use cases:

```css
:root {
  --space-1: 4px;   /* hairline gap between very tight elements */
  --space-2: 8px;   /* compact padding, small gaps */
  --space-3: 12px;  /* button padding y-axis */
  --space-4: 16px;  /* card padding, section internal gap */
  --space-5: 24px;  /* between unrelated UI sections */
  --space-6: 32px;  /* major section dividers */
  --space-8: 48px;  /* hero internal spacing */
  --space-10: 64px; /* between page sections */
  --space-12: 96px; /* large hero margins */
}
```

This is 9 values — six is the type-size cap, but spacing tolerates more because spacing is consumed across more dimensions (gap, margin, padding × top/right/bottom/left). 9–12 is a reasonable working range.

## Optical alignment vs mathematical centering

Software flexbox/grid centers based on bounding boxes. The human eye centers based on **visual mass** — the perceived weight of an object's dark/heavy regions. The two often disagree.

The classic case: a play icon (right-pointing triangle) inside a perfect circle. The triangle's mass leans right — its bounding box is centered, but it looks pulled to the left. Solution: shift the triangle 1–2px to the right so its visual mass sits on the circle's center.

Common cases requiring optical adjustment:

| Element | What's needed |
|---------|---------------|
| Play / arrow / asymmetric icon in a square or circle | Shift opposite the heaviest mass (usually right or down). |
| Text inside a button | Reduce text-side padding very slightly; the text's invisible bounding box (line-height) is taller than the visible glyphs. |
| Caps text vertically centered next to lowercase-with-descenders | Use `align-items: center` on flex, then nudge the caps up 1px. |
| Glyph-based icon (e.g. `S`, `R`) used as a logo mark in a square | Optical — the geometric center isn't the optical center for asymmetric letterforms. |
| Dropdown menu opened below its trigger | Offset the menu horizontally by the menu's internal padding so the text of the trigger and the text of the items align on a shared vertical axis. |

Don't fight the eye. If something looks off-center after `place-items: center`, trust that perception and nudge by 1–2px rather than re-checking your CSS.

## Focal anchors — "Star of the Show"

Every unique view (homepage hero, product page, dashboard landing, key marketing block) should have **exactly one** dominant visual element that anchors the eye. Candidates: an abstract gradient, an interactive component (a working slider, a live data visualization), a high-contrast image, a single oversized headline.

Without a focal anchor, the page reads as the "spreadsheet look" — everything equally important, nothing earning attention. Failure mode 4 in `failure-modes.md`.

The focal anchor should match the brand. If the product is technical, the anchor should *demonstrate* the product. If the product is editorial, the anchor should be expressive typography. If the product is community-driven, the anchor might be a person or interaction.

One per view. Multiple focal anchors compete and dilute each other.

## Visual rhyming

Subtle geometric motifs repeated across components produce subconscious cohesion. Examples:

- A specific corner radius (e.g. `4px` everywhere — buttons, cards, inputs, image masks, even avatar containers).
- An angle derived from the brand mark, repeated as a diagonal mask on photos, a chevron in dividers, the corner cut of a CTA button.
- A specific stroke width used for icons, dividers, and decorative rules.

The point is repetition that the user doesn't consciously notice. When a design feels "designed" in a specific way and you can't quite say why, this is usually the reason.

## Grid systems — when to use what

| Context | Approach |
|---------|----------|
| Data-heavy SaaS dashboard, tables, multi-pane workspaces | Strict 12-column macro grid. Vertical alignment across data is non-negotiable. |
| Standard product pages, app screens | 12-column or 8-column grid, looser. |
| Marketing landing page, brand storytelling | Loosen or abandon the macro grid. Let focal anchors and visual rhyming dictate spatial flow. |
| Single-column long-form (article, docs) | Just a max-width container (~65–75ch) and consistent vertical rhythm. No macro grid needed. |

Always keep the 4-point micro-grid for component-internal spacing, regardless of the macro decision.

## Depth — modern vs outdated

Outdated: heavy drop shadows (large blur, ~30% black, far offset). Reads as "2010 web design."

Modern depth comes from:
- **Subtle drop shadows**: low opacity (5–10%), large blur (20–40px), small offset. Atmospheric, not heavy.
- **Surface elevation lightness shifts**: especially in dark mode (see `color-and-theming.md`).
- **Noise textures**: a 1–3% opacity noise overlay on backgrounds and surfaces gives a tactile, physical quality.
- **Glassmorphic overlays**: `backdrop-filter: blur(20px)` on a translucent surface, used sparingly (modals, sticky headers).
- **Borders or insets** at low alpha to define edges instead of shadows.

Stack at most two depth techniques per element. A card can have a subtle drop shadow + noise. It shouldn't have shadow + noise + glass + glow.

## Padding and ratio for common components

Practical defaults (light theme; flip neutrals for dark):

```css
.button {
  padding: 12px 16px;          /* tight; or 16px 24px for primary CTAs */
  border-radius: 6px;          /* match site-wide radius rhythm */
}

.input {
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.card {
  padding: 24px;               /* or 32px for marketing tiles */
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--divider-subtle);
}

.modal {
  padding: 32px;
  border-radius: 16px;
  max-width: 480px;            /* ~30rem; constrain so modals never feel sparse */
}
```

The numbers come straight from the 4-point scale. Adjust *up* the scale (e.g. card 32px instead of 24px) for marketing contexts; down (16px) for dense product UIs.

## When the layout still feels wrong — the Producer Method

Designers get stuck optimizing a layout that's fundamentally not working. The fix is structural, not local: produce a drastically different variation and compare.

Examples of Producer Method moves:
- Invert the entire palette (light → dark or vice versa). See if the structure reads better in the opposite mode.
- Swap the focal element type (image hero → text-only hero with massive type, or vice versa).
- Flip the layout primary axis (vertical hero → horizontal split-screen).
- Replace the dominant geometric motif (rounded → sharp angles, or organic blobs → strict grid).

Generate at least one drastic variation before continuing to tweak the original. Local optimization toward a flawed direction never recovers — only structural re-orientation does.
