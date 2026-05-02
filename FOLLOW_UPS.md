# FOLLOW_UPS

## Audit-marked out of scope

- Full redesign
- Full light mode
- Bespoke WebGL / 3D hero work
- Fake scarcity timers
- Separate case-study microsites
- Experiential-agency direction in the style of `resn` / `activetheory`
- Sticky mobile CTA A/B testing before CTA language is unified

## Phase 1 notes

- No additional out-of-scope repo issues were logged during Phase 1.

## Phase 3 notes

- `book.html` still uses the title `Book a Call - MRB`; this is a page-title copy string, not a live CTA control.
- `faq.html` still contains the question `What happens after I book a call?`; this is FAQ copy and should be handled in the later exact-audit FAQ pass rather than silently rewritten here.

## Media follow-up

- `assets/attack-the-brainrot-cinematic.mp4` is the provided source hero loop and weighs about 25 MB. It works for now, but production performance would benefit from a smaller web-encoded version or a short poster-backed cut.

## Contact anti-spam follow-up

- The disposable-email denylist is a practical starter list, not a permanent source of truth. Review and refresh it over time if new temp-mail providers show up in spam.
- The live Turnstile widget needs a real Cloudflare Turnstile site key and secret key bound to `mrb.ink`. Until those keys are added to Pages, the widget stays hidden and the backend skips Turnstile validation.
