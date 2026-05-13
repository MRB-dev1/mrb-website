# QA protocol

A 4-phase checklist that takes a project from inception through deployment without skipping the structural decisions that get glossed over when only the visible work is being done.

When a user asks for help launching, redesigning, or auditing a site holistically, walk through these phases in order. When the user asks only about a specific concern (e.g. "is my color system OK?"), jump to the relevant phase.

## Phase 1 — Strategic discovery

Before any pixels are pushed, document the systemic constraints. The output of this phase is a shared understanding that downstream work can be measured against. Skipping it produces designs that look fine but don't serve a goal.

| Vector | Question to answer |
|--------|-------------------|
| Organizational | What does the organization do, who is the user, what is this product *for*? |
| Objectives | What measurable outcome defines success? (Conversion, retention, time-to-task, NPS — pick something.) |
| Constraints | Brand boundaries, technical platform, integration dependencies, timeline, budget. |
| Stakeholders | Who reviews? Who has final approval? Who can be vetoed without blocking? |
| Competitor matrix | 3–5 direct competitors. For each: what works, what doesn't, what to adapt vs. avoid. |
| Current state | If a redesign: walk the existing site. What stays? What goes? What is uniquely "this brand"? |

If the user is starting from scratch, get them to state Phase 1 answers before drafting layouts. If they have a draft already, ask which Phase 1 answers were made explicit and treat the rest as assumptions worth surfacing.

## Phase 2 — Visual hierarchy and spatial verification

Once layout begins, audit against the structural rules in this skill before getting attached to a direction.

- **4-point grid**: every margin, padding, gap is a multiple of 4. Snap any off-grid values.
- **Modular type scale**: at most six font sizes, each derived from a base × ratio. No arbitrary 17px / 21px values.
- **Focal anchor**: every unique view has exactly one "Star of the Show." If you can't point to it on a route, the route doesn't have one yet.
- **Optical alignment**: asymmetric icons inside containers are shifted opposite their heaviest mass. Text in buttons has compensated padding.
- **Visual rhyming**: a brand-derived motif (corner radius, angle, stroke width) repeats across components.
- **Depth calibration**: shadows are subtle (low alpha, large blur). Surface elevation in dark mode follows the lightness-delta math. Stack at most two depth techniques per element.

## Phase 3 — WCAG 2.1 accessibility audit

This phase is non-negotiable; it's not a polish step. Run before launch and after any significant visual revision.

| Check | Minimum | How to test |
|-------|---------|-------------|
| Body text contrast | 4.5:1 (AA) | WebAIM contrast checker, browser DevTools, or `npx pa11y https://...` |
| Large text contrast (≥18pt or ≥14pt bold) | 3:1 (AA) | Same |
| Non-text UI contrast (borders, focus rings, icon-only buttons, status dots) | 3:1 (AA) | Same — easy to miss without checking |
| Keyboard navigation | Full reachability | Tab through the page from the address bar |
| Focus visible | Yes, on every interactive element | Tab through; check ring visibility |
| Heading hierarchy | One H1 per route, no skipped levels | Use a heading-outline browser extension |
| Alt text | Present on every non-decorative image | Source code review, or axe DevTools |
| Form labels | Every input has a `<label>` or `aria-label` | axe DevTools |
| Color isn't the only signifier | Pair color with icon / pattern / text | Manual review |
| Reduced motion | Respect `prefers-reduced-motion` | Toggle the OS setting and reload |
| Tap targets | ≥44×44 CSS pixels on mobile | Mobile DevTools simulator |

For AAA compliance (rare for general sites; common for government, healthcare, finance): bump body to 7:1, large text to 4.5:1, and document the additional considerations.

## Phase 4 — Pre-launch QA

Once the design and accessibility are settled, validate that nothing breaks under deployment conditions.

### Technical

- **Cross-browser**: Chrome, Safari, Firefox, Edge — all current. iOS Safari and Android Chrome on real devices if possible.
- **Performance**: Lighthouse run; aim for green on Performance, Accessibility, Best Practices, SEO. Largest Contentful Paint < 2.5s, Cumulative Layout Shift < 0.1, Interaction to Next Paint < 200ms.
- **Asset compression**: images served as WebP/AVIF where supported; SVG for icons; lazy-loading on below-the-fold media.
- **DNS / SSL**: domain points correctly across global servers; HTTPS padlock visible; no mixed-content warnings.
- **Rollback plan**: ability to revert the deployment if a critical issue surfaces post-launch.
- **Analytics / monitoring**: install before launch, not after. Confirm events fire on key flows.

### UX / functional

- **Responsive breakpoints**: mobile (≤480), tablet (481–1024), desktop (1025–1440), ultra-wide (1441+). No CSS overflow, no overlapping elements, tap targets adequate at every breakpoint.
- **Forms**: every form submitted manually; the destination (database, email inbox, CRM) verified to receive the data. Validation errors trigger correctly when fields are empty/malformed.
- **Payment / checkout** (if applicable): sandbox transactions through every flow. Successful and declined cases. Confirmation emails received.
- **Authentication** (if applicable): signup, login, logout, password reset — all flows. Role-based access where relevant.
- **Search** (if applicable): empty query, no-results, too-many-results, special characters, very long queries.
- **Regression**: late-cycle code changes — re-test the flows that were "done" weeks ago.

### Content / SEO / security

- **Metadata**: every route has a unique `<title>` (≤60 chars) and meta description (≤155 chars). OpenGraph and Twitter Card tags for shareable URLs.
- **Heading structure**: one H1 per route, cascading H2/H3 without skipped levels.
- **Image alt text**: descriptive on functional images, empty on decorative.
- **XML sitemap**: generated and submitted to Google Search Console.
- **`robots.txt`**: present and not blocking the wrong paths.
- **Cookie consent / privacy policy**: present per applicable jurisdiction (GDPR, CCPA, etc.).
- **Security headers**: Content-Security-Policy, X-Frame-Options, Strict-Transport-Security configured at the server/CDN level.
- **404 / error pages**: branded, helpful, with a link back to the homepage and main navigation.

## When to use this protocol vs. the heuristics

The 25 heuristics in `SKILL.md` are local rules — they apply to a specific element or decision. The QA protocol is a global rule — it applies to a project as a whole.

If the user asks "what color should this button be?", reach for the heuristics. If the user asks "I'm about to launch — what should I check?", walk through Phase 4.

If the user asks for a "design review," the answer is somewhere in between: walk Phase 2 (spatial) and Phase 3 (WCAG) explicitly, treat Phase 1 as background, defer Phase 4 unless launch is imminent.
