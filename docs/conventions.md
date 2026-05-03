## File layout and route naming

- Public routes are root-level HTML files, not nested folders or generated templates.
- Product detail pages follow the `product-<slug>.html` naming pattern.
- Shared page chrome is copied by hand across root HTML files; there is no include or partial system to update centrally.
- Static media belongs in `assets/`.
- Deploy output belongs in `dist-cloudflare/`; source edits should happen in root files, not in generated output.

## Versioned asset references

- HTML files use manual `?v=...` query strings on shared assets such as `styles.css`, `script.js`, images, and the homepage video.
- Treat those query strings as part of the cache-busting convention, especially for anything served under `/assets/*`.

## Animation patterns

- `script.js` is opt-in and only loaded on pages that need it.
- Use `[data-reveal]` for single-element reveal states. Current values in use are `drop`, `left`, `right`, `scale`, and `panel`.
- Use `.reveal-sequence` when you want JS to assign staggered `--reveal-delay` values to each child.
- Homepage-only scroll/parallax behavior is built around `[data-storyline]`, `[data-parallax-card]`, `.timeline-item`, and `.hero-media-loop`.
- Named long-running CTA motion uses utility classes such as `.pulse-cta` and `.calm-submit`.
- New motion should account for the existing `prefers-reduced-motion` branch in `styles.css` and the reduced-motion checks in `script.js`.

## Form and backend coupling

- Forms opt into JS handling with `data-contact-form`.
- Human-readable form labeling is separate from payload shape; the backend relies on exact field names such as `Name`, `Email`, `Message`, `Project summary`, and `Form`.
- Keep the honeypot input named `website`; all three handlers short-circuit on that field.
- The form-level label used in backend notifications comes from `data-form-name`, which `script.js` writes into the submitted `Form` field.
- Discord notification output is capped to the first 12 non-empty fields, with each field value truncated to 1024 characters in the webhook payload. Put the most important fields early in the form.
