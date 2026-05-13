# Color and theming

The 60-30-10 interior-design color rule (60% dominant, 30% secondary, 10% accent) is structurally insufficient for software. Modern interfaces have dozens of states (hover, active, disabled, error, success, info, focus rings, dividers, elevation overlays) that can't be expressed with three colors. The functional replacement is the **4-layer color system**.

## The 4-layer color system

| Layer | Purpose | Typical scope |
|-------|---------|---------------|
| **1. Neutral foundation** | The "frame" of the application. Backgrounds, surfaces, dividers, borders, text. | 4 background lightness levels, 2 stroke styles, 3 text variants. Almost monochromatic. |
| **2. Functional accents** | Brand color expressed as a **scale** (50–900), used for interactive states. | Primary, hover, pressed, focus ring, disabled tint. Not just one hex. |
| **3. Semantic communication** | Meaning that overrides brand. | Red (danger / destructive), yellow (warning), green (success), blue (info). |
| **4. Theming** | Light / dark / high-contrast variants of all of the above. | Tokens, not hard-coded values. |

Brand colors live in layer 2 only. Status (warning / error / success) **must** override brand. A red error message must be red even if the brand is also red — tint or pattern can keep them distinct.

## OKLCH — perceptually uniform color

`OKLCH(L, C, H)` — Lightness, Chroma, Hue — is the modern alternative to `HSL` and `RGB` for designing palettes.

The problem with HSL: changing the hue while holding lightness constant produces *visibly* different brightness. HSL yellow at 50% lightness looks blinding; HSL blue at 50% lightness looks medium-dark. This makes accessible chart palettes nearly impossible to author by hand.

OKLCH solves this by mathematically modeling color as the human eye perceives it. `oklch(0.7 0.15 30)` and `oklch(0.7 0.15 240)` will look the same brightness even though one is reddish and one is blue. This matters specifically for:

- Data viz palettes (so no series accidentally dominates).
- Status colors that need to read the same intensity.
- Generating tints/shades programmatically (lightness step actually behaves linearly).

CSS support is solid in modern browsers. Fallback to HSL or hex via `@supports` if you need to support older browsers, but generate the values from the OKLCH source.

```css
:root {
  --primary: oklch(0.6 0.18 250);          /* base */
  --primary-hover: oklch(0.55 0.18 250);   /* darker by lightness step */
  --primary-pressed: oklch(0.5 0.18 250);
}
```

## Light-mode mathematics

- **Primary text**: `rgba(0, 0, 0, 0.87)`. Never pure `#000000` — it produces eye strain on white and leaves no headroom for emphasis.
- **Secondary text**: `rgba(0, 0, 0, 0.60)`.
- **Disabled text**: `rgba(0, 0, 0, 0.38)`. Disabled only — not "tertiary readable".
- **Elevated card vs background**: ~2% lightness delta. Light mode separates surfaces with very small lightness shifts because the human eye discriminates light tones easily.
- **Borders / dividers**: ~85% off-white (`#D9D9D9` ish, or `rgba(0, 0, 0, 0.12)`). Never a 1px pure-black border — it draws the eye to the container, not the content.
- **Background hierarchy**: page (`#FCFCFC` or `#FFFFFF`) → card (`#F8F8F8`) → elevated card (`#F2F2F2`). Each step ~2% darker.

## Dark-mode mathematics

Dark mode is **not** the inverse of light mode. The human eye discriminates dark mid-tones poorly, so the deltas need to be larger.

### Text on neutral dark surfaces

| Role | Value |
|------|-------|
| Primary | `rgba(255, 255, 255, 0.87)` |
| Secondary / supporting | `rgba(255, 255, 255, 0.60)` |
| Disabled | `rgba(255, 255, 255, 0.38)` |

### Text on coloured / brand-filled dark surfaces

Use the paired semantic `on-*` color at full opacity (`onPrimary`, `onSecondary`, `onError`). If a numeric ladder is genuinely needed:

| Role | Value |
|------|-------|
| Primary | `rgba(255, 255, 255, 1.00)` |
| Secondary | `rgba(255, 255, 255, 0.74)` |
| Disabled | `rgba(255, 255, 255, 0.38)` |

But prefer the semantic role token. Translucent white over saturated brand backgrounds reads slightly off-hue and degrades contrast unpredictably.

### Surface elevation

- **Lightness delta between elevated surfaces: 4–6%**, not 2%. (In light mode it's 2%.) Dark mode needs the larger delta to keep edges visible.
- **Elevation lightens, not darkens.** As a surface moves up the z-axis (closer to the user), its lightness *increases*. A modal at 12dp is *lighter* than the page background at 0dp. This is counterintuitive coming from physical metaphors but it's how the human eye reads dark elevation.

The official Material 3 dark elevation overlay alpha follows the formula:

```
α = ((4.5 · ln(elev + 1)) + 2) / 100
```

Common checkpoints: 1dp `0.05`, 3dp `0.08`, 6dp `0.11`, 8dp `0.12`, 12dp `0.14`, 16dp `0.15`, 24dp `0.16`. Apply by overlaying white at this alpha onto the base dark surface.

### Borders / dividers in dark mode

`rgba(255, 255, 255, 0.12)` is the practical default for subtle separators. `0.16` for a slightly more emphasized rule. Never use pure white 1px lines — same problem as pure black on light, magnified.

## State layers — hover, focus, pressed, dragged

State feedback is a **layer**, not a color change. Overlay a translucent sheet matching the foreground color (white over dark surfaces; black over light surfaces) at these alphas — current Material 3 tokens:

| State | Alpha |
|-------|-------|
| Hover | `0.08` |
| Focus (visible) | `0.10` |
| Pressed / active | `0.10` |
| Dragged | `0.16` |

```css
.button {
  background: var(--surface);
  position: relative;
}
.button::before {
  content: "";
  position: absolute; inset: 0;
  background: rgba(255, 255, 255, 0);
  transition: background 120ms;
}
.button:hover::before { background: rgba(255, 255, 255, 0.08); }
.button:focus-visible::before { background: rgba(255, 255, 255, 0.10); }
.button:active::before { background: rgba(255, 255, 255, 0.10); }
```

For light themes, swap to `rgba(0, 0, 0, 0.04 / 0.08 / 0.10 / 0.12)` — the same alpha pattern looks proportionally weaker on light surfaces because black-on-white discriminates more strongly than white-on-black.

## What `opacity:` is for, and what it isn't

`opacity:` on a parent container fades **everything**: text, icons, borders, shadows, and any state layers. It cascades. This wipes out hierarchy and breaks interaction feedback. **Don't use `opacity:` to de-emphasize text.**

Put alpha on the color itself: `color: rgba(...)` or modern `color: rgb(... / α)`. Reserve `opacity:` for whole-block transitions (a card sliding in, a modal scrim).

## Drop-in CSS variable scaffold

The minimum viable token set for a hand-coded site that wants to respect everything above:

```css
:root {
  /* Default = light theme */
  --bg-page: #FFFFFF;
  --bg-card: #F8F8F8;
  --bg-card-elevated: #F2F2F2;

  --text-high: rgba(0, 0, 0, 0.87);
  --text-medium: rgba(0, 0, 0, 0.60);
  --text-disabled: rgba(0, 0, 0, 0.38);

  --divider-subtle: rgba(0, 0, 0, 0.12);
  --divider-emphasis: rgba(0, 0, 0, 0.16);

  --state-hover: rgba(0, 0, 0, 0.04);
  --state-focus: rgba(0, 0, 0, 0.08);
  --state-pressed: rgba(0, 0, 0, 0.10);

  --primary: oklch(0.6 0.18 250);
  --on-primary: #FFFFFF;

  --success: oklch(0.7 0.18 145);
  --warning: oklch(0.78 0.16 85);
  --error: oklch(0.62 0.22 25);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-page: #121212;
    --bg-card: #1A1A1A;          /* +4% lightness from page */
    --bg-card-elevated: #222222; /* +6% lightness from page */

    --text-high: rgba(255, 255, 255, 0.87);
    --text-medium: rgba(255, 255, 255, 0.60);
    --text-disabled: rgba(255, 255, 255, 0.38);

    --divider-subtle: rgba(255, 255, 255, 0.12);
    --divider-emphasis: rgba(255, 255, 255, 0.16);

    --state-hover: rgba(255, 255, 255, 0.08);
    --state-focus: rgba(255, 255, 255, 0.10);
    --state-pressed: rgba(255, 255, 255, 0.10);
    --state-dragged: rgba(255, 255, 255, 0.16);

    --on-primary: #FFFFFF;
  }
}
```

When auditing an existing site, propose this scaffold first if no token system exists, then remap selectors to it. When extending an existing token system, add the missing variables (especially `--state-*` and `--divider-*`) before introducing any of the heuristics that depend on them.

## Common color failures and fixes

- **Too-saturated brand palette across the whole UI.** Mute by pushing layer 1 (neutrals) almost to grayscale and reserving brand for layer 2. Most "garish" interfaces are using brand color where a neutral belongs.
- **Identical hue used for primary action and success state.** Hard to distinguish. Status overrides brand — if brand is green, find a different green for success or use a green-to-blue shift in the on-color.
- **Borders that are pure black or pure white.** Soften to the divider alpha values.
- **Dark-mode surfaces that all look the same.** The author probably used a 2% delta out of habit. Bump to 4–6%.
- **Translucent white text on a saturated button.** Looks washed out. Replace with the paired `on-*` color at full opacity.
