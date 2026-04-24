# CHANGES

## Phase 1 - Discovery + Design Tokens

- Read and parsed `mrb_optimization_audit.md` as the audit source of truth.
- Created the Phase 1 tracking files: `CHANGES.md`, `FOLLOW_UPS.md`, and `SIGNATURE_BASELINE.md`.
- Mapped the audit items to Phase/Task IDs, blocked states, or out-of-scope status.
- Extracted the current token inventory from `styles.css`, `script.js`, and `index.html`.
- Proposed a refined token set aligned to the audit's recommended direction: launch dossier noir.
- Wired the approved token set into `styles.css` as additive `:root` custom properties only.
- Did not edit any site/page HTML or JS in this phase, and did not switch existing sections/components over to the new tokens yet.
- Documented the glowing progress line baseline so later Phase 3 work can regression-check it safely.
- Files touched: `CHANGES.md`, `FOLLOW_UPS.md`, `SIGNATURE_BASELINE.md`, `styles.css`
- Assumptions made: the audit's recommended homepage hero is the contrarian option, because the audit explicitly recommends it and the current hero structure can support it without architectural change; `--surface-proof-raise` is wired as an overlay alpha token that will later layer over `--surface-proof`, not as a standalone composite color.
- Pending human input: provide/confirm content for flagged proof, roster, and trust modules before later phases.
- Placeholders added: none
- Verify before Phase 2: confirm blocked items needing content/human decisions; keep the glowing progress line behavior unchanged; migrate existing selectors deliberately instead of bulk-swapping hard-coded values.

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

Source line references below were captured during Phase 1 discovery. The additive `:root` token block wired in Task 1.5 shifts later `styles.css` line numbers, but the owning selectors and systems remain the same.

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

### Approved Refined Token System

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

### Token Wiring Applied

All approved tokens were wired into `styles.css` inside the existing `:root` block as additive custom properties only. No existing selector was migrated to consume these tokens in this step.

| Token | Wired value | Location | Notes |
| --- | --- | --- | --- |
| `--surface-page` | `#020304` | `styles.css:24` | New page-floor token; current `--bg` remains in use until later phases. |
| `--surface-card` | `#0a0d10` | `styles.css:25` | New shared charcoal card token. |
| `--surface-proof` | `#141a22` | `styles.css:26` | New lighter proof-stage base token. |
| `--surface-proof-raise` | `rgba(255,255,255,0.08)` | `styles.css:27` | Wired as overlay alpha to layer over `--surface-proof` later. |
| `--border-subtle` | `rgba(255,255,255,0.10)` | `styles.css:28` | New restrained border step. |
| `--border-strong` | `rgba(255,255,255,0.18)` | `styles.css:29` | New stronger border step for key proof states. |
| `--accent-cool` | `#bdd0e2` | `styles.css:30` | New cool accent foundation. |
| `--accent-glow-soft` | `rgba(189,208,226,0.16)` | `styles.css:31` | New restrained glow token. |
| `--accent-glow-strong` | `rgba(189,208,226,0.28)` | `styles.css:32` | New stronger glow token. |
| `--accent-line` | `linear-gradient(90deg, rgba(255,255,255,0.84), rgba(189,208,226,0.74))` | `styles.css:33` | Future shared accent-line gradient token; original progress line remains untouched. |
| `--type-display` | `88px` | `styles.css:34` | New display scale token. |
| `--type-h1` | `72px` | `styles.css:35` | New H1 token. |
| `--type-h2` | `48px` | `styles.css:36` | New H2 token. |
| `--type-h3` | `24px` | `styles.css:37` | New H3 token. |
| `--type-body-lg` | `19px` | `styles.css:38` | New large body token. |
| `--type-body` | `16px` | `styles.css:39` | New body baseline token. |
| `--space-2` | `8px` | `styles.css:40` | New spacing scale. |
| `--space-3` | `12px` | `styles.css:41` | New spacing scale. |
| `--space-4` | `16px` | `styles.css:42` | New spacing scale. |
| `--space-5` | `24px` | `styles.css:43` | New spacing scale. |
| `--space-6` | `32px` | `styles.css:44` | New spacing scale. |
| `--space-7` | `48px` | `styles.css:45` | New spacing scale. |
| `--space-8` | `72px` | `styles.css:46` | New spacing scale. |
| `--space-9` | `104px` | `styles.css:47` | New spacing scale. |
| `--space-10` | `144px` | `styles.css:48` | New spacing scale. |
| `--radius-sm` | `8px` | `styles.css:49` | New small radius token. |
| `--radius-lg` | `20px` | `styles.css:50` | New large shell radius token. |
| `--radius-pill` | `999px` | `styles.css:51` | New pill radius token. |
| `--motion-fast` | `180ms ease` | `styles.css:52` | New fast interaction token. |
| `--motion-surface` | `220ms ease` | `styles.css:53` | New surface timing token. |
| `--motion-glow` | `360ms ease` | `styles.css:54` | New glow timing token. |
| `--motion-reveal` | `760ms cubic-bezier(0.19, 1, 0.22, 1)` | `styles.css:55` | New reveal timing token. |

### Hard-coded values intentionally left in place for later migration

- Existing page/base tokens such as `--bg`, `--bg-2`, `--surface`, `--surface-strong`, `--line`, `--cyan`, and `--shadow` remain live and unchanged in this step.
- Repeated hard-coded dark panel values like `rgba(5,5,6,0.68)`, `rgba(5,5,6,0.7)`, and `rgba(8,10,12,0.52)` were not migrated yet.
- Hard-coded progress-line and storyline gradients/glows remain untouched to preserve the original glowing progress line behavior documented in `SIGNATURE_BASELINE.md`.
- Existing explicit type sizes (`82`, `76`, `64`, etc.), shell radii (`18`, `22`), larger story spacing (`210`, `340`), and loop timings remain in place until the relevant later phases consume the new tokens deliberately.

### Suggested Commit Message

`style: wire approved phase 1 tokens`

## Phase 2 - Copy + CTA Unification

- Built the copy replacement matrix before editing live page copy.
- Applied only the audit's exact homepage rewrites that do not depend on missing proof content.
- Unified the visible primary CTA label to `Book a discovery call` across Home, Work, Services, About, and the header CTA on Contact.
- Unified the visible secondary CTA label to `See selected work` where the route supports it cleanly.
- Did not touch the contact form fields, behavior, or form submit button.
- Left the contact-form secondary link text (`Book a call`) unchanged intentionally because the contact form is locked and out of scope for this pass.
- Did not rewrite the homepage hero yet because the audit couples that rewrite to a real proof artefact.
- Did not rewrite the `Selected direction` section yet because the audit couples that slot to a real flagship launch dossier.
- Did not rewrite Work / Services / About page intros because the audit diagnoses them but does not provide verbatim replacements.
- Did not trim the homepage FAQ yet because the audit does not specify the exact two retained questions.
- Files touched in this phase: `CHANGES.md`, `index.html`, `work.html`, `services.html`, `about.html`, `contact.html`

### Copy Replacement Matrix

| Page | Section | Current copy in repo | Exact replacement from audit | File path | Status |
| --- | --- | --- | --- | --- | --- |
| Home | Hero headline | `Game worlds built for the moment creators go live.` | `Most creator games die in the explanation.` | `index.html` | blocked: CONTENT REQUIRED |
| Home | Hero subhead | `MRB designs polished playable experiences, launch systems, and creator-ready moments for audiences that need to understand the hook fast.` | `MRB builds the kind that land on frame one: clear hook, good footage, clean handoff, proper launch support.` | `index.html` | blocked: CONTENT REQUIRED |
| Home | Hero primary CTA | `Book a creator call` | `Book a discovery call` | `index.html` | completed |
| Home | Hero secondary CTA | `View selected work` | `See selected work` | `index.html` | completed |
| Home | `What MRB builds` heading | `Interactive worlds shaped around content, not just mechanics.` | `Games for creators have two jobs: they have to play well, and they have to read well on camera.` | `index.html` | completed |
| Home | `What MRB builds` supporting copy | `The build has to feel good in-game, but it also has to work on camera: fast to understand, easy to frame, and strong enough to become a launch moment.` | `MRB builds around the thing viewers notice first - the hook, the loop, the reveal, the reaction - then makes sure the systems, UI and launch materials back it up.` | `index.html` | completed |
| Home | `Selected direction` section | `Lead with one strong world, then let the work prove it.` / `A premium studio homepage should feel edited...` | `Featured launch` / `One project. One hook. One proof trail. Show the world, what MRB built, what shipped with it, and what happened next. If the flagship case is strong enough, it will sell the services and the shop without explaining either to death.` | `index.html` | blocked: CONTENT REQUIRED |
| Home | `Creator systems` heading | `The experience should be built to survive the launch.` | `A creator launch is not finished when the build works.` | `index.html` | completed |
| Home | `Creator systems` supporting copy | `MRB plans gameplay, UI, reward states, creator notes, update paths, and support expectations so the release does not feel improvised.` | `It is finished when the creator knows what to show, what to say, what files they have, and what happens after day one. MRB plans the gameplay, the interface states, the reward logic and the launch pack as one job.` | `index.html` | completed |
| Home | Production-path heading | `A production path with visible momentum.` | `From brief to first playable, the path stays visible.` | `index.html` | completed |
| Home | Production-path supporting copy | `The line follows the project as the concept becomes a playable, creator-ready launch.` | `Audience fit, content angle, prototype, launch handoff.` | `index.html` | completed |
| Home | `Separate paths` heading | `Premium studio first. Shop and services where they belong.` | `Custom work is for launches and bespoke systems.` | `index.html` | completed |
| Home | `Separate paths` supporting copy | `The homepage builds trust. Services handle custom work. The shop sells production-ready resources without taking over the brand.` | `The shop is for teams who only need the reusable parts. Start with services if the world is unique. Start with the shop if the problem is narrower.` | `index.html` | completed |
| Home | Homepage FAQ intro | `Clear answers before people buy or book.` / `Delivery, licensing, support, and custom work expectations should be visible without making the homepage feel like a legal document.` | `Before you book: yes, MRB handles custom builds; yes, licensing is clear; yes, discovery starts with audience, deadline and scope.` | `index.html` | blocked: HUMAN INPUT REQUIRED |
| Home | Final CTA heading | `Bring your audience into a world built for them.` | `If you have an audience, a deadline and a real budget, start here.` | `index.html` | completed |
| Home | Final CTA supporting copy | `If you are exploring a creator-led game launch, custom build, branded experience, or premium playable world, start with a short discovery call.` | `MRB takes discovery calls for creator launches, branded worlds and bespoke systems.` | `index.html` | completed |
| Shared CTA | Header CTA | `Get in contact` | `Book a discovery call` | `index.html`, `work.html`, `services.html`, `about.html`, `contact.html` | completed |
| Shared CTA | Floating CTA | `Get in contact` | `Book a discovery call` | `index.html` | completed |
| Shared CTA | Primary CTA variants | `Book around your project` / `Plan the launch` / `Book a project call` / `Book a call` / `Start with a call` | `Book a discovery call` | `index.html`, `work.html`, `services.html`, `about.html` | completed |
| Shared CTA | Secondary CTA variants | `View work` / `View selected work` / `Contact the studio` / `Email the studio` / `Explore services` | `See selected work` | `index.html`, `work.html`, `services.html`, `about.html` | completed |
| Contact | Form CTA row | `Book a call` | locked contact form; no copy change applied | `contact.html` | out of scope |
| Work | Page intro | `Case studies that prove the studio image.` / `Focused UEFN project previews built around the goal, process, visual direction, creator value, and launch result.` | no exact rewrite supplied in audit | `work.html` | blocked: HUMAN INPUT REQUIRED |
| Services | Page intro | `Custom game development for creator-led launches and premium playable worlds.` / `MRB builds polished game systems...` | no exact rewrite supplied in audit | `services.html` | blocked: HUMAN INPUT REQUIRED |
| About | Page intro | `A Stockholm, Sweden UEFN studio built for creator-led Fortnite launches.` / `MRB exists to turn playable ideas...` | no exact rewrite supplied in audit | `about.html` | blocked: HUMAN INPUT REQUIRED |

## Phase 3 - Visual System

- Applied the approved three-surface dark hierarchy to shared shells and homepage proof-stage sections in `styles.css`, while leaving the contact form and original glowing progress-line selectors untouched.
- Reworked the shared CTA styling so the primary action is visibly brighter and more consistent, while secondary buttons are quieter and less glow-heavy.
- Added restrained motif echoes to marketing surfaces using line-based top-edge accents and a light-sweep hover on primary CTA controls only.
- Broke up the homepage rhythm with background and spacing shifts only: darker page base, brighter proof-stage bands, tighter compact decision bars, and differentiated spacing between hero, proof, production-path, separate-paths, and final CTA sections.
- Preserved the locked contact form by explicitly restoring its existing button treatment after the shared CTA-system update.
- Cleaned up the remaining stale `Get in contact` header CTA labels on shop, FAQ, legal, product, and book pages so the site-wide primary action is now consistent.
- Files touched in this phase: `styles.css`, `CHANGES.md`, `FOLLOW_UPS.md`, `book.html`, `faq.html`, `license.html`, `privacy.html`, `product-case-study-page-kit.html`, `product-creator-launch-ui-pack.html`, `product-launch-checklist-system.html`, `product-premium-environment-kit.html`, `product-progression-system-template.html`, `product-studio-starter-bundle.html`, `refund-policy.html`, `shop.html`, `terms.html`
- Assumptions made: the audit's minimum-viable visual pass should stay CSS-only, should not introduce a mixed-light section yet, and should not modify the glowing progress line's own selectors or scroll logic.
- Pending human input: Phase 3.5 remains gated; do not introduce the audit's better-version asymmetric proof section or mixed-light expansion without explicit approval.
- What to verify before the next phase: homepage proof sections feel more distinct on desktop/mobile, primary CTA wins quickly against secondary CTA, and the progress-line behavior matches `SIGNATURE_BASELINE.md`.

### Phase 3 Audit Mapping

| Audit item | Task ID | Status | Notes |
| --- | --- | --- | --- |
| Introduce three dark values, one restrained cool accent, subtle texture, and brighter proof panels | 3.1 | completed | Applied via existing token system in `styles.css`; homepage proof-stage sections now stay within the dark palette rather than switching to full light surfaces. |
| Keep the same order, but make hero, flagship proof, production path, separate paths and final CTA visibly different section types | 3.2 | completed | Minimum-viable version only: background and spacing shifts; no structural or asymmetric layout changes yet. |
| One primary CTA, one secondary CTA, consistent button styling and placement across Home, Work, Services and Contact | 3.3 | completed | Visual hierarchy updated in CSS; stale header CTA labels on secondary pages were also normalized so the system is actually site-wide. |
| Use the glowing line motif as a subtle connector in proof cards, button hovers and section dividers | 3.4 | completed | Added button sweep and line accents on cards/dividers; original progress-line selectors and behavior left unchanged. |
| Better version: one asymmetric proof section and one mixed-light section | 3.5 | blocked: DESIGN DECISION REQUIRED | Audit marks this as better-version work; not started. |
| Better version: one asymmetric proof section and one mixed-light section | 3.5 | blocked: HUMAN INPUT REQUIRED | Requires explicit approval before any layout-level escalation. |

### Phase 3 Verification

- `npm run build:cloudflare` passed after the CSS updates and again after the final site-wide CTA-label cleanup.
- No JS files changed in this phase, so `node --check` was not needed.
- Stale CTA sweep now only returns:
  - `contact.html` secondary `Book a call` link inside the locked contact form
  - `faq.html` question text `What happens after I book a call?`
  - `book.html` page title `Book a Call - MRB`
- The homepage progress line and storyline spine were not edited in markup, scroll logic, or their original active-state selectors.

### Suggested Commit Message

`style: apply phase 3 visual hierarchy and CTA system`

## Phase 4 - Trust and Proof

- Added three hero proof pills directly beneath the hero subhead. One uses a real fact (`UEFN / Fortnite`), and two are intentionally visible placeholders because the audit requires real proof rather than invented claims.
- Converted the existing post-hero metrics strip into a slim homepage trust strip using real studio facts already present in the repo and prior user instructions: location, response time, founder contact, and specialism.
- Added a visible hero-media placeholder inside the existing hero console so the homepage now clearly asks for a real launch still or lightweight loop instead of pretending the abstract console is final proof.
- Replaced the old meta homepage proof block with a real flagship launch dossier structure using the provided hook, build scope, launch assets, and operational proof line.
- Rewrote the featured Work case with the same concrete flagship proof so the Work page now shows one shipped-style dossier instead of generic capability language.
- Replaced the remaining hero proof-pill placeholders for scope and launch assets using the provided real launch facts.
- Kept the existing hero structure, CTA placement, and animation system intact; this was a content/proof pass within the current skeleton, not a redesign.
- Did not touch the contact form.
- Files touched in this phase: `index.html`, `work.html`, `styles.css`, `CHANGES.md`
- Assumptions made: known factual trust items from the live site brief (`Stockholm, Sweden`, `5h-48h`, `Robin@mrb.ink`, `UEFN since launch`) are safe to surface without additional approval.
- Pending human input: the flagship project name is still missing, so it is rendered as a visible placeholder rather than guessed copy.
- Pending content: no real hero still or lightweight loop asset exists in the repo yet, so the hero-media placeholder remains visible.
- What to verify before the next phase: hero proof pills stay readable on mobile, the trust strip feels compact rather than salesy, and the hero placeholder is obviously temporary but still visually intentional.

### Phase 4 Audit Mapping

| Audit item | Task ID | Status | Notes |
| --- | --- | --- | --- |
| Add hero proof pills beneath the subhead | 4.1 | completed | Added three pills in the hero; unresolved proof facts are rendered as visible placeholders rather than invented proof. |
| Add a slim trust strip with location, response time, founder contact, and specialism | 4.2 | completed | Reused the existing post-hero metrics strip so the homepage skeleton and order stay intact. |
| Add a hero visual placeholder for a real launch still/loop | 4.3 | completed | Added a visible placeholder inside the existing hero console with TODO note in source. |
| Add one flagship launch dossier block | 4.4 | completed | Homepage flagship dossier now uses the provided hook/build/assets/proof copy; project name remains a visible placeholder pending final content. |
| Rewrite one featured Work page case with concrete deliverables and result line | 4.5 | completed | Work page featured case now uses the same concrete flagship proof set instead of generic placeholder proof language. |
| Add optional secondary social proof only if the audit explicitly recommends it | 4.6 | blocked: HUMAN INPUT REQUIRED | Optional better-version work; do not start without approval. |

### Phase 4 Placeholders

| Placeholder | File path | Missing content needed |
| --- | --- | --- |
| `PLACEHOLDER: add real content` | `index.html` | Final flagship project name for the homepage dossier. |
| `PLACEHOLDER: add real content` | `work.html` | Final flagship project name for the Work page dossier and featured card. |
| `PLACEHOLDER: add launch still or lightweight loop` | `index.html` | Real hero media asset: strongest launch still or silent 6-8 second loop. |

### Phase 4 Verification

- `npm run build:cloudflare` passed after the hero-proof and trust-strip updates and again after the flagship dossier / Work-page case rewrite.
- No JS files changed in this phase, so `node --check` was not needed.
- Final check for this phase should also confirm the homepage dossier and Work dossier use the same flagship proof set and anchors still land on the featured case.

### Suggested Commit Message

`trust: add flagship launch dossier and hero proof scaffolding`

## Phase 5 - Limited Non-Content Polish

- Kept the remaining project-name and hero-media placeholders fully visible and treated them as intentional.
- Tightened the changed hero proof section only: the proof-pill grid now gives more width to the longer scope / launch-asset facts on desktop and stacks cleanly on narrower screens.
- Reduced hierarchy noise in the changed proof areas by shortening the gap before the hero CTAs once the proof pills are present.
- Tightened the changed dossier surfaces only: the homepage flagship dossier no longer carries unnecessary empty height, the dossier-grid spacing is slightly denser, and the Work dossier media frame is more compact.
- Added mobile-specific type tuning for the changed dossier titles and supporting proof copy so Home and Work stay readable without changing their substance.
- Did not alter CTA language, dossier substance, section order, the contact form, or the glowing progress line behavior.
- Files touched in this phase: `styles.css`, `CHANGES.md`
- What to verify before later work: the proof pills remain readable on tablet/mobile, the homepage dossier title and Work dossier title do not overpower their sections on phones, and the two remaining real-content placeholders still stand out clearly.

### Phase 5 Verification

- `npm run build:cloudflare` passed after the limited proof-section polish.
- No JS files changed in this phase, so `node --check` was not needed.
- Home and Work still show the same flagship proof story.
- Remaining intentional placeholders are unchanged:
  - flagship project name on Home
  - flagship project name on Work
  - hero still/loop asset on Home

### Suggested Commit Message

`style: polish phase 5 proof sections`
