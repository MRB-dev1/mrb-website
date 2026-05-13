# Failure modes

Most broken interfaces don't fail because of one bug. They fail because of recurring anti-patterns that compound. The 10 failure modes below cover ~90% of what makes a hand-coded or AI-assisted site look amateurish. Each entry has a symptom (what the user sees), a root cause (why it happens), and a remediation (the specific fix).

In a review pass, scan for these first — they're the highest-leverage corrections.

---

## 1. The vibe-coded UI

**Symptom**: Components are placed but the page reads as disjointed. High-saturation colors that don't cohere. Unicode emojis as icons. Repeated identical KPI cards across multiple views with no consolidation. Sparse fly-out menus where modals would be more focused. Pricing tables where the plan name is bigger than the price.

**Root cause**: Generative AI lacks a spatial rendering engine. It generates structurally valid code without checking how it looks composed. Color choices come from frequency in training data, not optical harmony.

**Remediation**:
- Strip algorithmic styling completely; rebuild from a 4-layer color system.
- Replace emojis with Phosphor / Lucide / Heroicons.
- Enforce the 4-point grid on all spacing.
- Consolidate repeated cards into mapped analytics views with shared layouts.
- Replace fly-outs with center-screen modals for any complex input.
- In pricing tables, make the price figure dominate and shrink the plan name.
- Add at least two depth techniques (subtle shadow + noise, or surface elevation + glassmorphism) to manufacture physical quality.

---

## 2. Pure palette inversion

**Symptom**: Dark mode looks "muddy." Surfaces blend into each other; cards are barely distinguishable from the page background. Borders disappear. The hierarchy that worked in light mode is invisible in dark mode.

**Root cause**: Light mode hex values were directly inverted (subtracted from 255 or pushed through a "dark mode" toggle that flips everything). Light mode uses ~2% lightness deltas because the human eye discriminates light tones easily; that 2% delta becomes invisible on dark surfaces.

**Remediation**:
- Break the 1:1 mapping between light and dark.
- Use a 4–6% lightness delta between dark surfaces (instead of 2%).
- Reverse the elevation direction: in dark mode, elevated surfaces get *lighter*, not darker.
- Apply the Material 3 dark elevation overlay alpha (`α = ((4.5 · ln(elev + 1)) + 2) / 100`) for tonal depth.
- Move from translucent white text to the proper opacity ladder (`0.87 / 0.60 / 0.38`).

---

## 3. Mathematical centering fallacy

**Symptom**: An icon (play button, arrow, asymmetric glyph) sits inside a circle or square and looks "off." Text in a button looks bottom-heavy. Captions don't align cleanly with the cap-height of adjacent labels.

**Root cause**: The CSS centered the *bounding box* mathematically. Human perception centers based on *visual mass*. Asymmetric shapes always have a heavy side; their geometric center isn't their optical center.

**Remediation**:
- Identify the heaviest visual mass and shift opposite by 1–2px.
- For text in buttons, reduce the text-side padding very slightly to compensate for line-height bounding-box overshoot.
- For caps + lowercase mix, nudge the caps up 1px.
- For dropdowns aligned under a trigger, offset horizontally by the dropdown's internal padding so the text axes share a vertical line.
- Don't fight the eye — when something looks off-center after `place-items: center`, trust the perception.

---

## 4. The spreadsheet look

**Symptom**: The page is structurally correct but reads as a uniform grid of equally-weighted elements. Nothing stands out. The eye has no entry point. Reading the page feels like scanning a database query.

**Root cause**: No focal anchor. Every component is sized similarly. Hierarchy is implied only by position, not by contrast / scale / opacity. Often a result of mechanically applying a grid system without making intentional emphasis decisions.

**Remediation**:
- Designate exactly one "Star of the Show" per unique view: an oversized headline, a working interactive demo, a high-contrast image, or a brand-aligned focal element.
- Apply the opacity ladder to text (`0.87 / 0.60`) so primary and secondary copy read at different weights.
- Vary sizes purposefully — use the modular scale to pull H1/H2 to dominant scale and let body text recede.
- Introduce visual rhyming (a repeated motif from the brand mark) to give cohesion without flattening.

---

## 5. High-opacity (pure black/white) typography

**Symptom**: Text on white pages feels harsh — eye strain after a few minutes of reading. Hierarchy looks "stair-stepped" rather than layered. There's no headroom to add emphasis to specific elements.

**Root cause**: Body text is set at `#000000` (or `#FFFFFF` on dark). 100% opacity is reserved as the absolute maximum, but everything starts there, leaving no room above for headings or emphasis.

**Remediation**:
- Map text emphasis to the opacity ladder, not just font weight:
  - Primary: `0.87` opacity
  - Secondary / supporting: `0.60`
  - Disabled: `0.38` (and only here)
- The ladder is *additive* with weight and size. A `font-weight: 700` heading at `0.87` opacity reads stronger than a `font-weight: 400` body at `0.87`.
- Verify the result still passes WCAG 4.5:1.

---

## 6. Arbitrary sizing arrays

**Symptom**: Eight different font sizes in the codebase. Margins are 13px, 17px, 21px. Padding values pulled from "what fits." Developers ask "should this be 18px or 19px?" because the system doesn't have a clear answer.

**Root cause**: No design tokens. No modular scale. Sizes were chosen visually one element at a time without a generative rule.

**Remediation**:
- Restrict the project to a chosen modular scale (typically 1.250 or 1.333 for general products).
- Cap font sizes at six total. Map the existing sizes onto the six.
- Convert all spacing values to multiples of 4. Snap arbitrary values to the nearest 4-multiple.
- Migrate hardcoded values to CSS custom properties (`--space-4`, `--size-h2`).

---

## 7. Semantic over-decoration

**Symptom**: An error message uses the brand color instead of red. A success toast is purple because the brand is purple. A warning banner is orange but so is the CTA — users can't tell at a glance whether they're being warned or invited.

**Root cause**: Treating UI colors as decoration that should match the brand. But status colors are *meaning*, not aesthetic. They have to override branding to communicate intuitively.

**Remediation**:
- Reserve brand colors for layer 2 (functional accents): primary CTAs, links, focus rings, brand identity moments.
- Lock layer 3 (semantic) to universally-recognized hues:
  - Red — danger / error / destructive
  - Yellow / amber — warning / caution
  - Green — success / completion
  - Blue — info / neutral notification
- If brand color collides with a semantic color (e.g. brand is green), shift the semantic one slightly (a different green, or pair with a checkmark icon) so they're distinguishable.

---

## 8. Font similarity clashing

**Symptom**: The page uses two fonts but reads as if it might be a rendering bug — like the browser failed to load one and substituted a similar fallback. The pairing doesn't feel intentional.

**Root cause**: Two typefaces selected that are structurally too similar (Helvetica + Arial, Georgia + Times, Inter + Roboto, two humanist sans). Without architectural contrast, a reader perceives them as the same font.

**Remediation**:
- Maximize contrast in pairing:
  - Condensed serif + wide sans-serif (e.g. Instrument Serif + Geist)
  - Geometric grotesk + humanist serif (e.g. Inter + Source Serif)
  - Use a "super family" designed to coexist (IBM Plex sans + serif + mono, GT America)
- Test: if you swap one for the other and the page reads identically, they're too similar.
- Two fonts is enough for most projects. Three is unusual; four is almost always too many.

---

## 9. The harsh border effect

**Symptom**: Cards on a light page look caged. The eye is drawn to the outline, not the content inside. The interface feels heavier and older than intended.

**Root cause**: A 1px pure-black border (`#000000`) is the strongest possible visual line on a white background. It overwhelms whatever the card contains.

**Remediation**:
- Soften to `rgba(0, 0, 0, 0.12)` for subtle separation, or `rgba(0, 0, 0, 0.16)` for slightly more emphasis.
- Or replace the border entirely with a 2% lightness delta on the card background — the surface contrast does the separation.
- For dark mode, mirror the same approach with `rgba(255, 255, 255, 0.12)` and 4–6% lightness delta on surfaces.

---

## 10. Low-contrast degradation

**Symptom**: Light gray text on white because "minimalist." Charts where adjacent data series share nearly the same hue. Form input borders that disappear into the page background. Disabled-looking buttons that are actually enabled.

**Root cause**: An aesthetic preference for understatement, applied without checking WCAG. Often introduced by designers chasing a Stripe / Linear / Vercel visual style without realizing those companies still pass 4.5:1.

**Remediation**:
- Run every text/background pair through a contrast checker (WebAIM, browser DevTools).
- Body text: minimum 4.5:1. Don't go below.
- Non-text UI: minimum 3:1.
- For visual lightness, reach for opacity *up to* the WCAG floor, not past it. `rgba(0, 0, 0, 0.60)` on white is ~7.4:1 — still well above 4.5:1, plenty of room to lighten if needed for hierarchy.
- For subtle data-viz palettes, use OKLCH with controlled chroma so adjacent series are still distinguishable at 3:1 against the chart background.

---

## How to use this reference during a review pass

When inventorying an existing site, ask for each failure mode in turn: "Is this present?" Almost every failed UI exhibits 3–5 of them simultaneously. Fixing any one in isolation feels marginal; fixing them together transforms the result.

The order of attack matters:

1. **WCAG failures first** (failure mode 10) — non-negotiable.
2. **Typography hierarchy** (5, 6) — sets up the rest of the system.
3. **Color system** (1, 2, 7) — replaces ad-hoc choices with a tokenized 4-layer model.
4. **Borders, depth, spacing** (8, 9) — once tokens exist, snap component values to them.
5. **Optical and focal polish** (3, 4) — last, because it depends on the other layers being correct.
