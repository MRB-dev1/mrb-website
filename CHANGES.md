# CHANGES

## Phase 1 - Discovery + Design Tokens

- Read and parsed `mrb_optimization_audit.md` as the audit source of truth.
- Did not edit any site/page HTML, CSS, or JS in this phase.
- Created the Phase 1 tracking files: `CHANGES.md`, `FOLLOW_UPS.md`, and `SIGNATURE_BASELINE.md`.
- Mapped the audit items to Phase/Task IDs, blocked states, or out-of-scope status.
- Extracted the current token inventory from `styles.css`, `script.js`, and `index.html`.
- Proposed a refined token set aligned to the audit's recommended direction: launch dossier noir.
- Documented the glowing progress line baseline so later Phase 3 work can regression-check it safely.
- Files touched: `CHANGES.md`, `FOLLOW_UPS.md`, `SIGNATURE_BASELINE.md`
- Assumptions made: the audit's recommended homepage hero is the contrarian option, because the audit explicitly recommends it and the current hero structure can support it without architectural change.
- Pending human input: approve the proposed refined token set; provide/confirm content for flagged proof, roster, and trust modules before later phases.
- Placeholders added: none
- Verify before Phase 2: approve tokens; confirm blocked items needing content/human decisions; keep the glowing progress line behavior unchanged.

### Audit Mapping Table

| Audit item | Task ID | Status | Notes |
| --- | --- | --- | --- |
| Adopt the recommended `launch dossier noir` direction | 3.1, 3.2, 4.4 | mapped | This is the audit's selected direction and the basis for all later work. |
| `Expedition luxury` direction | out of scope | out of scope | Alternative direction not selected by the audit. |
| `Product-ops premium` direction | out of scope | out of scope | Alternative direction not selected by the audit. |
| Ignore experiential-agency direction (`resn` / `activetheory`) | out of scope | out of scope | Audit explicitly says to ignore this direction for this round. |
| Homepage hero rewrite using the audit's recommended contrarian option | 2.3 | mapped | Audit explicitly recommends the contrarian hero, so no hero-choice gate is needed. |
| Add a real hero proof artefact (still or loop) beside the hero | 4.1, 4.3 | blocked: CONTENT REQUIRED | Real asset and proof facts are not in the repo. |
| Better-version silent 6-8 second hero loop | 4.3 | blocked: CONTENT REQUIRED | Gated better version; requires a real approved asset. |
| Rewrite `What MRB builds` section | 2.4 | mapped | Exact rewrite is supplied in the audit. |
| Delete the current meta `Selected direction` section copy | 2.4 | mapped | Audit explicitly says to delete the section as written. |
| Replace that section with `Featured launch` framing | 2.4, 4.4 | blocked: CONTENT REQUIRED | Replacement framing is supplied, but the flagship proof content is missing. |
| Rewrite `Creator systems` section | 2.4 | mapped | Exact rewrite is supplied in the audit. |
| Rewrite `From idea to launch` section copy | 2.4 | mapped | Must preserve the existing glowing line behavior. |
| Rewrite `Separate paths` section copy | 2.4 | mapped | Exact rewrite is supplied in the audit. |
| Compress homepage FAQ to two high-value questions | 2.6 | blocked: HUMAN INPUT REQUIRED | Audit gives the direction but does not specify the exact two retained homepage questions/answers. |
| Rewrite the homepage FAQ intro copy | 2.4 | mapped | The audit provides exact framing copy for the homepage FAQ module. |
| Rewrite the final homepage CTA block | 2.4 | mapped | Exact rewrite is supplied in the audit. |
| Tighten Work / Services / About headers and intros | 2.5 | blocked: HUMAN INPUT REQUIRED | Audit diagnoses the issue but does not provide verbatim replacements for all affected page headers. |
| Apply a three-surface dark hierarchy | 3.1 | mapped | Enabled by the token proposal in Phase 1. |
| Break the repeated homepage section rhythm | 3.2 | mapped | MVP can be done within the existing order/skeleton. |
| Better-version asymmetric proof section / mixed-light section | 3.5 | blocked: DESIGN DECISION REQUIRED | Audit marks this as a better-version visual move, not automatic MVP work. |
| Make the Work page trustworthy with one real dossier | 4.5 | blocked: CONTENT REQUIRED | Concrete deliverables, result line, and named proof are missing. |
| Better-version three dossier cards on Work | 4.5 | blocked: CONTENT REQUIRED | Gated expansion after MVP proof exists. |
| Separate case-study microsites / matrix | out of scope | out of scope | Audit says this is out of scope with the locked architecture. |
| Extend the glowing line motif into CTA hovers / proof cards / nodes | 3.4 | mapped | Additive only; original glowing line behavior stays locked. |
| Better-version shared motion language tied to scroll state | 3.5 | blocked: DESIGN DECISION REQUIRED | Gated better version. |
| Make H1 larger / reduce above-fold chips / tighten body widths | 5.2 | mapped | Part of the hierarchy ruthlessness pass. |
| Mobile proof pills / dominant mobile CTA hierarchy | 5.1 | mapped | Mobile cleanup after copy/design work lands. |
| Sticky mobile CTA A/B test | out of scope | out of scope | Audit explicitly says only worth testing after CTA language is unified. |
| One dominant CTA: `Book a discovery call` | 2.2 | mapped | Site-wide primary CTA language. |
| One secondary CTA: `See selected work` | 2.2 | mapped | Site-wide secondary CTA language. |
| Standardize CTA placement cadence across key pages | 3.3 | mapped | Header, hero, post-proof, post-line, final CTA within the locked structure. |
| Use fit/capacity/timing signals instead of fake scarcity | 4.2 | blocked: CONTENT REQUIRED | Any scarcity/availability statement must be true and supplied/confirmed. |
| Surface response-time trust near the main CTA | 4.2 | mapped | Repo/user context already contains the current response-time fact. |
| Add one flagship proof artefact near the hero | 4.4 | blocked: CONTENT REQUIRED | Flagship project/content not yet specified. |
| Add a collaborator / roster strip | 4.6 | blocked: CONTENT REQUIRED | Needs real names/logos or must be skipped. |
| Surface founder trust layer (Stockholm, founder contact, response window) | 4.2 | mapped | Factual inputs already exist in repo/user context. |
| Add specialism proof line (`working in UEFN since launch`) | 4.2 | mapped | Fact already exists in repo/user context. |
| Add ownership / handoff summary near the first CTA | 4.2 | blocked: HUMAN INPUT REQUIRED | Audit calls for the module, but does not provide verbatim final copy. |
| Add recency / update cadence on proof blocks | 4.5 | blocked: CONTENT REQUIRED | Real recency/update data missing. |
| Add Vercel-style proof strip under the hero | 4.1 | blocked: CONTENT REQUIRED | Needs real proof facts for pills/strip. |
| Add Stripe-style proof band after featured launch | 4.2 | blocked: CONTENT REQUIRED | Needs real metrics or operational facts. |
| Add AREA 17 / Instrument / Ueno-style roster treatment | 4.6 | blocked: CONTENT REQUIRED | Requires real roster/recognition data. |
| Only use a Ueno-style marquee if the names are real and strong enough | 4.6 | blocked: HUMAN INPUT REQUIRED | Requires both real names and explicit user approval. |
| Frame creator work as a launch ecosystem (Red Bull / Rapha / Arc'teryx cues) | 2.4, 4.4 | mapped | Implement through copy/proof structure, not by changing architecture. |
| Give proof blocks dual routes into work and shop/service paths (On cue) | 3.2, 4.4 | mapped | Needs to work within current page skeleton. |
| Make Services / Shop / FAQ feel like adjacent rooms in one house (Patagonia cue) | 5.3 | mapped | Cross-page consistency task. |
| Sharper POV sentence plus one or two short client lines (Arc cue) | 2.3, 4.6 | blocked: CONTENT REQUIRED | POV sentence is covered by hero rewrite; client lines need real source content. |
| Hero rewrite must ship with proof artefact | 2.3, 4.3 | blocked: CONTENT REQUIRED | Explicit coupling from the audit. |
| Replacing `Selected direction` requires a flagship launch card | 2.4, 4.4 | blocked: CONTENT REQUIRED | Explicit coupling from the audit. |
| CTA unification must happen with CTA hierarchy normalization | 2.2, 3.3 | mapped | Explicit coupling from the audit. |
| Compressing homepage FAQ requires spacing rebalance | 2.6, 5.3 | mapped | Explicit coupling from the audit. |
| Work specificity requires metadata / proof chips | 4.5 | blocked: CONTENT REQUIRED | Explicit coupling from the audit. |
| Shop teaser should inherit flagship proof language | 3.2, 5.3 | mapped | Explicit coupling from the audit. |
| `Hero rewrite + real proof image + unify CTA` priority bundle | 2.2, 2.3, 4.3 | blocked: CONTENT REQUIRED | Highest-priority bundle; blocked on proof asset. |
| `Replace meta section with flagship dossier` priority bundle | 2.4, 4.4 | blocked: CONTENT REQUIRED | Highest-priority proof bundle; blocked on flagship content. |
| `Break the section rhythm` priority bundle | 3.2 | mapped | Highest-priority MVP visual bundle. |
| `Make the Work page trustworthy` priority bundle | 4.5 | blocked: CONTENT REQUIRED | Highest-priority proof bundle; blocked on real case content. |
| `Standardize CTA hierarchy across the whole site` priority bundle | 2.2, 3.3 | mapped | Highest-priority conversion bundle. |
| `Trim homepage FAQ and push detail down` priority bundle | 2.6 | blocked: HUMAN INPUT REQUIRED | Exact retained homepage FAQ items still need decision/confirmation. |
| `Add a concise trust strip` priority bundle | 4.2 | mapped | MVP can use verified studio facts already in repo/user context. |
| `Tighten repeated language across Home/Services/About/Shop` priority bundle | 2.5 | blocked: HUMAN INPUT REQUIRED | The audit identifies the problem, but not all exact copy replacements. |
| `Extend the glowing line motif` priority bundle | 3.4 | mapped | Must remain additive and preserve baseline behavior. |
| Full redesign | out of scope | out of scope | Audit explicitly excludes it. |
| Full light mode | out of scope | out of scope | Audit explicitly excludes it. |
| Bespoke WebGL / 3D hero work | out of scope | out of scope | Audit explicitly excludes it. |
| Fake scarcity timers | out of scope | out of scope | Audit explicitly excludes them. |
| Separate case-study microsites | out of scope | out of scope | Audit explicitly excludes them. |

### Current Token Inventory

| System | Current values | Source |
| --- | --- | --- |
| Base dark colors | `--bg #030303`, `--bg-2 #071018`, `--ink #050608` | `styles.css:2-3`, `styles.css:19` |
| Surface colors | `--surface rgba(255,255,255,0.062)`, `--surface-strong rgba(255,255,255,0.11)`, repeated hard-coded dark panels like `rgba(5,5,6,0.68)` and `rgba(5,5,6,0.7)` | `styles.css:4-5`, `styles.css:926-928`, `styles.css:1220-1223` |
| Border colors | `--line rgba(255,255,255,0.13)`, `--blue-line rgba(170,218,255,0.18)` plus many `1px solid var(--line)` applications | `styles.css:7-8`, `styles.css:171`, `styles.css:924-925`, `styles.css:1218-1219` |
| Text colors | `--text #f7f7f2`, `--muted #a8adb5`, `--muted-2 #747a84` | `styles.css:13-15` |
| Accent colors | `--cyan #b8c7d9`, `--lime #d8f89a`, `--gold #ffd37a`, plus `--tone-cyan 0.018`, `--tone-violet 0.012`, `--tone-amber 0.006` for atmospheric overlays | `styles.css:9-18` |
| Typography family | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | `styles.css:52` |
| Typography sizes | Global `h1 76`, `h2 46`, `h3 23`, `h4 16`; hero display `82`; page hero `64`; proof/cinema titles `38-40`; micro/meta text `12-14`; body/support text `17-20` | `styles.css:124-140`, `styles.css:414`, `styles.css:1659`, `styles.css:1263`, `styles.css:1323`, `styles.css:805`, `styles.css:2528-2541` |
| Layout widths | `--max 1180px`, `.section-shell width min(var(--max), calc(100% - 48px))`, `.narrow max-width 860px`, header width `calc(var(--max) + 64px)` | `styles.css:21`, `styles.css:150-156`, `styles.css:167-168` |
| Spacing cadence | Repeated vertical sections `128`, tight sections `90`, common gaps `18 / 24 / 28 / 34 / 44 / 72`, larger story cadence `94 / 104 / 128 / 150 / 210 / 340` | `styles.css:170`, `styles.css:403-405`, `styles.css:833-837`, `styles.css:852`, `styles.css:1030`, `styles.css:1069`, `styles.css:1075-1078`, `styles.css:1133`, `styles.css:1385-1389` |
| Radius | Base `--radius 8px`, header `22px`, mobile header `18px`, pill/button radii `999px`, node/dot circles `50%` | `styles.css:20`, `styles.css:172`, `styles.css:243`, `styles.css:2865`, `styles.css:1422-1443`, `styles.css:1528-1529` |
| Shadows | Base `--shadow 0 24px 80px rgba(0,0,0,0.48)`; header `0 18px 60px rgba(0,0,0,0.34)`; CTA and motif glows stack hard-coded white/cyan/lime shadows | `styles.css:22`, `styles.css:176`, `styles.css:255-258`, `styles.css:279-281`, `styles.css:1479-1484`, `styles.css:1508-1511`, `styles.css:1538-1542` |
| Motion timings | `180ms ease` for buttons/links/inputs; `220ms ease` for cards; `240ms ease` modal panel; `280ms ease-out` floating visual transform; `380ms ease` timeline state changes; `640ms ease` + `760ms cubic-bezier(0.19, 1, 0.22, 1)` reveal system | `styles.css:232`, `styles.css:308`, `styles.css:946`, `styles.css:1586`, `styles.css:1465-1470`, `styles.css:1504`, `styles.css:1534`, `styles.css:2602-2610` |
| Motion loops | `logo-drift 12s ease-in-out infinite alternate`, `cta-breathe 4.8s / 3.4s`, `cta-calm 7.2s`, `package-shine 900ms`, `scope-invert-pop 560ms`, `confetti-fall` with `cubic-bezier(0.16, 0.82, 0.38, 1)` | `styles.css:354`, `styles.css:583`, `styles.css:587`, `styles.css:591`, `styles.css:745`, `styles.css:791`, `styles.css:2238-2241`, `styles.css:2387-2450` |

### Proposed Refined Token System (for approval only)

| Proposed token | Current base | Proposed value | Rationale |
| --- | --- | --- | --- |
| `--surface-page` | `--bg #030303` | `#020304` | Keeps the current near-black base but tightens it for the audit's darker editorial floor. |
| `--surface-card` | hard-coded `rgba(5,5,6,0.68/0.7)` and `rgba(8,10,12,0.52)` | `#0a0d10` | Gives cards one consistent charcoal value instead of several close cousins. |
| `--surface-proof` | current white/light proof sections plus `--bg-2 #071018` | `#141a22` | Creates the audit's lighter proof-stage surface without going full light mode. |
| `--surface-proof-raise` | `--surface-strong rgba(255,255,255,0.11)` | `rgba(255,255,255,0.08)` over `#141a22` | Keeps proof panels brighter than the page without flattening them into white cards. |
| `--border-subtle` | `--line rgba(255,255,255,0.13)` | `rgba(255,255,255,0.10)` | Slightly thinner/cleaner border treatment, closer to the audit's restraint. |
| `--border-strong` | hard-coded brighter whites in hero/timeline | `rgba(255,255,255,0.18)` | Gives proof states and key panels a single stronger border step. |
| `--accent-cool` | `--cyan #b8c7d9` | `#bdd0e2` | Keeps the existing cool accent family, nudged slightly brighter for better dark contrast. |
| `--accent-glow-soft` | current scattered white/cyan glows | `rgba(189,208,226,0.16)` | Unifies restrained cool glow behavior for hover and proof accents. |
| `--accent-glow-strong` | current scattered stronger glows | `rgba(189,208,226,0.28)` | Gives one stronger step for motif echoes without introducing a second hue family. |
| `--accent-line` | current progress-line gradient | `linear-gradient(90deg, rgba(255,255,255,0.84), rgba(189,208,226,0.74))` | Preserves the existing white-to-cool-light motif while tightening the palette. |
| `--type-display` | hero `82`, global `h1 76` | `88px` | Supports the audit's call for a larger, more decisive H1/display. |
| `--type-h1` | `76px` | `72px` | Keeps global H1 slightly under the display token so the homepage can own the largest scale. |
| `--type-h2` | `46px` | `48px` | Tight refinement upward for section headings. |
| `--type-h3` | `23px` | `24px` | Normalizes the mid-tier heading size. |
| `--type-body-lg` | `19-20px` scattered | `19px` | Standard large body/lead size instead of multiple nearby values. |
| `--type-body` | browser default with custom line-height | `16px` | Establishes an explicit baseline body token. |
| `--space-2` | 8 / 10 / 12 scattered | `8px` | Small spacing base. |
| `--space-3` | 12 / 14 scattered | `12px` | Micro gaps / chip spacing. |
| `--space-4` | 16 / 18 scattered | `16px` | Compact inner spacing. |
| `--space-5` | 22 / 24 / 26 / 28 scattered | `24px` | Default card padding / section sub-gaps. |
| `--space-6` | 30 / 32 / 34 scattered | `32px` | Medium spacing step. |
| `--space-7` | 44 / 46 / 48 scattered | `48px` | Large inner spacing / section heading gap. |
| `--space-8` | 64 / 72 scattered | `72px` | Major section spacing step. |
| `--space-9` | 94 / 104 scattered | `104px` | Large structural spacing step. |
| `--space-10` | 128 / 138 / 150 scattered | `144px` | Hero / oversized section step aligned to the audit's stronger tempo. |
| `--radius-sm` | `--radius 8px` | `8px` | Keep the current small radius. |
| `--radius-lg` | header `18-22px` | `20px` | One large radius for major shells instead of separate 18 and 22. |
| `--radius-pill` | `999px` | `999px` | Preserve the existing pill/button treatment. |
| `--motion-fast` | `180ms ease` | `180ms ease` | Keep current fast interactive timing. |
| `--motion-surface` | `220ms ease` | `220ms ease` | Keep current card/surface timing. |
| `--motion-glow` | `380ms ease` | `360ms ease` | Slightly tighter for motif extensions while staying in family with the current line states. |
| `--motion-reveal` | `760ms cubic-bezier(0.19, 1, 0.22, 1)` | `760ms cubic-bezier(0.19, 1, 0.22, 1)` | Preserve the current reveal character for additive motif work. |

### Suggested Commit Message

`docs: map audit, capture current tokens, and baseline glowing line`
