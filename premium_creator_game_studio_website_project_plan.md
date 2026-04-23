# Premium Creator-Focused Game Studio Website Project Plan

**Project type:** Premium game development studio website with a separate shop and services area  
**Primary audience:** Social media creators, influencers, streamers, YouTubers, TikTok creators, brands, and potential promotion partners  
**Secondary audience:** Customers buying digital assets, scripts, templates, and tools  
**Build preference:** Custom-coded website, not a website builder  
**Recommended stack:** Next.js + React + TypeScript + Tailwind CSS + Vercel + Lemon Squeezy or Stripe + Calendly  
**Last updated:** 23 April 2026

---

## 1. Executive Summary

The website should present the studio as a **premium creator-focused game development studio**, not as a childish game asset store. The homepage should feel spacious, serious, and high-end, similar in confidence to Apple, DJI, Stripe, Linear, or a polished finance/technology brand.

The most important strategic change is this:

> **Homepage = premium studio image and creator partnership positioning.**  
> **Shop = separate page for assets, code, scripts, templates, and tools.**  
> **Services = separate page for custom development work.**  
> **Work / Case Studies = proof that the studio can execute.**  
> **Book = main conversion page for creator partnerships and client calls.**

The homepage should not try to explain everything. It should build trust, prestige, and curiosity. A creator should land on the site and think:

> “This studio looks serious. Their game looks high quality. This could be something worth promoting or partnering with.”

The shop is still important, but it should not dominate the first impression. People should first see the studio as high-end. Then, if they want products, they can go to the shop page.

---

## Current Implementation Notes - 23 April 2026

The current starter has moved beyond a pure static mockup. It now includes:

- A premium homepage with scroll-based sections, centered landing hero, large CTAs, animated timeline, and MRB logo treatment.
- A top navigation hotbar with Work, Services, Shop, FAQ, About, and Contact.
- A dedicated contact page with a scroll arrow that centers the contact form.
- Contact and project inquiry forms that submit to `/api/contact`.
- A local Node backend in `server.js`.
- A serverless backend in `api/contact.js` for deployment hosts such as Vercel.
- A Cloudflare Pages Function in `functions/api/contact.js` for deployment on Cloudflare Pages.
- A Cloudflare static build script in `scripts/build-cloudflare.js` that outputs to `dist-cloudflare`.
- A `wrangler.toml` file pointing Wrangler at `dist-cloudflare`.
- Optional inquiry delivery to email through Resend.
- Optional inquiry delivery to Discord through `DISCORD_WEBHOOK_URL`.
- A confirmation modal with submitted-info summary and confetti after successful inquiry submission.
- Public response expectation updated to 5h-48h.
- A UEFN-only shop with a shop grid and individual product detail pages.
- Product detail pages with price, included items, license reminder, delivery/support notes, and related products.
- Legal pages including privacy policy, terms, refund policy, and license terms.
- Terms include Epic Games / Fortnite / UEFN non-affiliation language.

Important backend rule:

```txt
Opening contact.html directly as a file does not run the backend.
The form needs a running backend or deployed serverless endpoint.
```

Local testing should use:

```txt
npm start
http://localhost:3000/contact.html
```

If `localhost:3000` does not load, the server is not running. In the current Codex desktop environment, the visible Node executable is blocked by Windows with "Access is denied", so local backend execution requires an official Node.js install, another unblocked Node runtime, or deployment to a host such as Vercel.

Local backend note:

```txt
server.js loads .env for local testing.
.env is gitignored and can hold DISCORD_WEBHOOK_URL and DISCORD_MENTION_ROLE_ID.
Do not commit .env or paste webhook URLs into public files.
```

Email delivery note:

```txt
Discord webhook delivery is configured locally.
Email notifications require RESEND_API_KEY and a verified CONTACT_FROM_EMAIL sender/domain.
Until Resend is configured, form submissions can succeed through Discord while email returns "Email provider not configured".
When Resend is configured, /api/contact sends one internal inquiry email to CONTACT_TO_EMAIL and one confirmation receipt email to the submitter.
```

Validation note:

```txt
Form email fields require a full domain suffix, for example name@example.com.
Backend rejects short emails like a@a.
```

Discord MCP note:

```txt
The Discord MCP server is available to Codex during development, but it is not a safe public website backend.
```

Website visitors cannot submit directly through Codex MCP. The safe public flow is:

```txt
Browser form -> /api/contact backend -> Discord webhook and/or email provider
```

Cloudflare production flow:

```txt
Cloudflare Pages serves dist-cloudflare static assets.
Cloudflare Pages Function handles /api/contact.
DISCORD_WEBHOOK_URL, DISCORD_MENTION_ROLE_ID, RESEND_API_KEY, CONTACT_FROM_EMAIL, and CONTACT_TO_EMAIL stay in Cloudflare environment variables.
```

Recommended Cloudflare Pages settings:

```txt
Framework preset: None
Build command: npm run build:cloudflare
Deploy command: leave empty
Non-production branch deploy command: leave empty
Build output directory: dist-cloudflare
Functions directory: functions
Custom domain: mrb.ink
```

Cloudflare deployment should preserve the full current frontend quality. Do not remove animations, visual assets, product detail pages, confirmation modal behavior, Discord posting, or form validation to make deployment easier.

Secrets must stay in backend environment variables:

```txt
DISCORD_WEBHOOK_URL
DISCORD_MENTION_ROLE_ID
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_TO_EMAIL
LEMON_SQUEEZY_API_KEY if used later
```

Never place these values in HTML, CSS, or browser JavaScript.

Current Discord MCP status:

```txt
MCP connection verified by listing Discord channels from Codex.
Use a Discord webhook for production form delivery.
```

Discord MCP docs to read before any Discord operation:

```txt
C:\Users\robin\OneDrive\Dokument\Fortnite Projects\MyProjectC\docs\DISCORD_MCP.md
C:\Users\robin\OneDrive\Dokument\Fortnite Projects\MyProjectC\docs\discord_manual_followup_2026-04-20.md
C:\Users\robin\OneDrive\Dokument\Fortnite Projects\MyProjectC\docs\discord_backup_2026-04-20.md
```

Verified Discord MCP rules from those docs:

```txt
Use ASCII-only input through MCP.
Use Discord shortcodes in message content instead of literal emoji.
Do not use literal emoji or em-dashes in channel/category names through MCP.
MCP cannot pin messages; the user must pin template messages manually.
MCP cannot edit category names or reliably set visual category position.
Confirm before destructive Discord actions.
Treat Discord tokens, webhook URLs, and guild IDs as secrets.
```

Incoming request Discord section created:

```txt
Category: Admin Dev - Incoming Requests
website-inquiries: 1496833337921241118
request-triage: 1496833573133484145
request-templates: 1496833659229962300
```

Responsible role for website inquiries:

```txt
Customer Inquiry Responsible: 1496844933431037952
Assigned to: mr.brum
Backend mention env: DISCORD_MENTION_ROLE_ID=1496844933431037952
```

`website-inquiries` reaction standard:

```txt
:eyes: `:eyes:` = seen
:white_check_mark: `:white_check_mark:` = handled
:compass: `:compass:` = needs triage in request-triage
:receipt: `:receipt:` = needs quote/scope
```

Use the first shortcode unwrapped so Discord can render it, then repeat it in backticks so the reusable command is visible. Do not send literal emoji through MCP.

Manual Discord follow-up:

```txt
Pin the first template message in each of:
- website-inquiries
- request-triage
- request-templates

If using Discord webhook delivery for website forms, create or copy a webhook for website-inquiries and store it only as DISCORD_WEBHOOK_URL in the backend/deployment environment.
```

---

## 2. Core Strategy

### 2.1 One brand, separate pages

Use **one main website and one main brand**, not separate brands at launch.

Recommended structure:

```txt
/                 Premium creator-focused landing page
/work             Selected work, projects, and case studies
/services         Custom game development services
/shop             Digital products, scripts, assets, templates, tools
/book             Book a creator partnership or client call
/about            Studio story, values, team, process
/contact          General contact
/privacy          Privacy policy
/terms            Terms of service
/refund-policy    Refund policy
/license          Digital product license terms
```

This keeps everything connected under one premium identity, while still preventing the homepage from feeling cluttered.

### 2.2 Do not use a separate shop subdomain at launch

Avoid this at the beginning:

```txt
shop.yourdomain.com
```

A subdomain can work later, but for the first version it creates extra complexity. A simple `/shop` page is easier to build, easier for SEO, easier to manage, and better for keeping your brand together.

### 2.3 Brand image first, sales second

Your idea is correct: Apple does not only sell to “elite editors,” but by positioning toward professionals, creators, and high-end users, the entire brand feels more valuable. Your studio should do something similar.

The homepage should say, visually and verbally:

```txt
We are not just a game team.
We build premium game experiences for creators, audiences, brands, and launches.
```

The shop should exist, but it should feel like a professional studio resource library, not the main identity.

---

## 3. Brand Positioning

### 3.1 Recommended positioning statement

Use this internal positioning statement:

> **A premium game development studio building creator-ready game experiences, launch moments, and interactive worlds for creators, brands, and communities.**

This positions you as more than a normal game developer. It connects game development with creator culture, promotion, audience engagement, and premium launch experiences.

### 3.2 Public-facing one-liners

Use one of these for the homepage:

```txt
We build game experiences creators want to promote.
```

```txt
Premium game worlds built for creator-led launches.
```

```txt
A game studio for creators, brands, and high-impact launches.
```

```txt
Creator-ready game experiences for audiences that expect more.
```

### 3.3 What the brand should feel like

The brand should feel:

- Premium
- Clean
- Confident
- Technical
- Cinematic
- Trustworthy
- Modern
- Calm
- Serious
- Creator-aware
- High-end, not childish

The brand should not feel:

- Loud
- Overdesigned
- Meme-heavy
- Cheap
- Random
- Cluttered
- Like a generic “gaming clan” website
- Like a marketplace template
- Like a portfolio made in one evening

### 3.4 Studio identity hierarchy

Your identity should be ordered like this:

```txt
1. Premium creator-focused game studio
2. Custom development partner
3. Launch and promotion partner
4. Case-study-driven studio
5. Digital product and asset shop
```

Do not lead with “we sell scripts and assets.” Lead with the premium studio identity.

---

## 4. How the Plan Changes by Game Platform

The website should adapt depending on your main development focus. Pick one primary platform if possible. A focused studio feels more credible than a studio that claims to do everything.

### 4.1 If you focus on Fortnite / UEFN

Position as:

```txt
Premium UEFN studio for creator-led Fortnite experiences.
```

Strong page ideas:

```txt
/uefn-game-studio
/fortnite-creative-map-development
/creator-fortnite-launches
/verse-scripts
/uefn-assets
```

Good proof to show:

- Island screenshots
- Trailer clips
- Gameplay loops
- Creator playtest clips
- Island codes
- Engagement stats if available
- Before/after polish examples
- Verse systems
- UEFN-specific technical process

Main SEO keywords:

```txt
UEFN studio
Fortnite Creative developer
Fortnite Creative map development
UEFN game development studio
Verse scripting
custom Fortnite Creative map
creator Fortnite experience
```

### 4.2 If you focus on Roblox

Position as:

```txt
Premium Roblox development studio for creators, brands, and communities.
```

Strong page ideas:

```txt
/roblox-game-development
/roblox-scripting-services
/roblox-systems
/roblox-assets
```

Good proof to show:

- Roblox experience screenshots
- Gameplay loops
- Monetization systems
- UI systems
- Social clips
- Player stats if available
- Luau scripting examples
- Launch or update timelines

Main SEO keywords:

```txt
Roblox game development studio
Roblox scripting services
custom Roblox game developer
Roblox game systems
Roblox assets
Luau scripts
```

### 4.3 If you focus on Unity

Position as:

```txt
Unity development studio for polished prototypes, tools, systems, and creator-ready games.
```

Good proof to show:

- Playable prototypes
- Build videos
- Tool demos
- Systems architecture
- UI/UX examples
- Mobile/PC/WebGL builds

Main SEO keywords:

```txt
Unity game development studio
Unity prototype development
Unity game systems
Unity tools
Unity scripts
custom Unity development
```

### 4.4 If you focus on Unreal Engine

Position as:

```txt
Unreal Engine studio building cinematic, scalable, high-end game experiences.
```

Good proof to show:

- Cinematic environments
- Blueprint/C++ systems
- Lighting and visual quality
- Real-time demos
- Multiplayer/system examples
- Optimization examples

Main SEO keywords:

```txt
Unreal Engine development studio
Unreal game development services
Blueprint systems
Unreal Engine assets
custom Unreal Engine developer
```

### 4.5 If you stay general

Position as:

```txt
A premium game technology studio for creators, brands, and custom interactive experiences.
```

This is flexible, but weaker for SEO. If you are early, general positioning can work visually, but your service and SEO pages should still target specific platforms.

Best practical approach:

```txt
Homepage: premium and general
Service pages: platform-specific
Shop categories: platform-specific
Case studies: platform-specific
```

---

## 5. Recommended Sitemap

### 5.1 MVP sitemap

Build this first:

```txt
/
/work
/services
/shop
/book
/about
/contact
/privacy
/terms
/refund-policy
/license
```

### 5.2 Future sitemap

Add these later when you have enough content:

```txt
/case-studies/project-name
/services/creator-launch-builds
/services/custom-coding
/services/custom-assets
/services/game-systems
/shop/uefn
/shop/roblox
/shop/unity
/shop/unreal
/shop/product-name
/blog
/blog/article-name
/resources
/press
/partners
/support
/updates
```

### 5.3 Navigation menu

Keep the main navigation simple:

```txt
Logo
Work
Services
Shop
About
Book a Call
```

The “Book a Call” button should be visually stronger than the other navigation items.

### 5.4 Footer menu

Footer should include:

```txt
Studio
- Home
- Work
- About
- Contact

Services
- Creator partnerships
- Custom coding
- Custom assets
- Game systems

Shop
- All products
- Assets
- Scripts
- Templates
- Tools

Legal
- Privacy Policy
- Terms of Service
- Refund Policy
- License Terms

Social
- YouTube
- TikTok
- X / Twitter
- Discord
- LinkedIn
```

---

## 6. Homepage Section-by-Section Plan

The homepage should be clean, spacious, and creator-focused. Do not put the whole business on the homepage.

### 6.1 Section 1: Minimal navigation

Purpose: Give visitors orientation without overwhelming them.

Recommended navigation:

```txt
Studio logo       Work     Services     Shop     About       Book a Call
```

Design notes:

- Transparent or dark glass header
- Sticky header optional
- Lots of spacing
- Small, clean text
- Button on the right
- Avoid too many dropdowns at launch

### 6.2 Section 2: Premium hero

Purpose: Make the studio feel important immediately.

Recommended headline:

```txt
We build game experiences creators want to promote.
```

Alternative headlines:

```txt
Premium game worlds built for creator-led launches.
```

```txt
Creator-ready games for audiences that expect more.
```

```txt
A game studio for creators, brands, and high-impact launches.
```

Recommended subheading:

```txt
We design and develop polished game worlds, creator moments, and launch-ready systems for influencers, brands, and communities.
```

Primary CTA:

```txt
Book creator partnership call
```

Secondary CTA:

```txt
View selected work
```

Visual direction:

- One cinematic abstract 3D/game visual
- Not a busy collage
- Dark background with soft gradient
- Large whitespace
- Premium type
- No clutter

### 6.3 Section 3: Small trust / focus strip

Purpose: Explain what you do in one glance.

Example:

```txt
Built for creators      Designed for audience moments      Production-ready systems
```

Or:

```txt
Creator launches        Custom game systems                Premium playable worlds
```

Do not use too many stats unless they are real.

### 6.4 Section 4: Creator value section

Purpose: Show creators why the studio matters to them.

Headline:

```txt
Built around the way creators actually launch content.
```

Three cards:

```txt
Easy to film
Clear visual moments, strong gameplay beats, and scenes that work well for short-form and long-form content.

Easy to understand
Experiences designed so audiences quickly understand the hook, challenge, reward, and reason to keep watching.

Easy to launch
Support for trailers, creator kits, thumbnails, update plans, and promotional moments around release.
```

### 6.5 Section 5: Featured work

Purpose: Show one strong project instead of overwhelming the homepage.

Structure:

```txt
Featured project
Project name
Short description
What we built
Why it mattered
Button: View case study
```

Use one hero image/video here.

### 6.6 Section 6: Process

Purpose: Make the studio feel professional and low-risk.

Headline:

```txt
A clear process from idea to creator-ready launch.
```

Steps:

```txt
01 Creator fit
We understand the audience, platform, content style, and launch goal.

02 Experience concept
We define the hook, gameplay loop, visual style, and promotional angle.

03 Prototype and polish
We build the core experience, test the moments, and refine the feel.

04 Launch support
We prepare assets, creator notes, release materials, and update plans.
```

### 6.7 Section 7: Final CTA

Purpose: Convert serious visitors.

Headline:

```txt
Bring your audience into a world built for them.
```

Subheading:

```txt
If you are a creator, brand, or partner exploring a game launch, start with a short discovery call.
```

Primary CTA:

```txt
Book a creator partnership call
```

Secondary CTA:

```txt
Explore our work
```

---

## 7. Page-by-Page Content Outline

### 7.1 Home page

Goal: Create premium trust and drive creator/partner calls.

Content:

- Hero headline
- Short creator-focused explanation
- Book call CTA
- View work CTA
- Trust strip
- Creator value section
- Featured project
- Process section
- Final CTA

Avoid:

- Full shop grid
- Too many product cards
- Too many services
- Long walls of text
- Cheap-looking animations

### 7.2 Work page

Goal: Show previous projects and proof.

Content:

- Page headline: “Selected work”
- Short intro
- Filter by platform if needed: UEFN, Roblox, Unity, Unreal, Tools
- Project cards
- Case study previews
- Results if available
- CTA to book a call

Project card content:

```txt
Project image/video
Project name
Platform
What we built
Audience / goal
Result or highlight
View case study
```

### 7.3 Case study page

Goal: Convert trust into bookings.

Recommended case study structure:

```txt
1. Hero
   - Project name
   - Platform
   - One-sentence result
   - Hero image/video

2. Quick facts
   - Client / creator / internal project
   - Platform
   - Timeline
   - Services provided
   - Role

3. Challenge
   - What problem or goal existed?

4. Concept
   - What was the game idea or creator angle?

5. Process
   - Design
   - Development
   - Testing
   - Polish
   - Launch support

6. Final build
   - Screenshots
   - Video clips
   - Systems built
   - Tools used

7. Results
   - Views
   - plays
   - retention
   - engagement
   - creator feedback
   - client feedback
   - internal learnings

8. What we would improve
   - Shows honesty and professionalism

9. CTA
   - “Build a creator-ready game experience with us”
```

### 7.4 Services page

Goal: Sell custom development work.

Recommended headline:

```txt
Custom game development for creator-led launches and premium playable worlds.
```

Service cards:

```txt
Creator launch builds
Custom gameplay experiences designed around creators, audiences, and promotional moments.

Custom coding
Scripts, systems, tools, and gameplay mechanics built for your project.

Custom assets
Game-ready environments, props, UI elements, and visual assets.

Game systems
Progression, economy, interaction, inventory, UI, quests, matchmaking, and more.

Prototype development
Fast playable prototypes to test a concept before full production.

Polish and optimization
Improve feel, performance, visuals, usability, and player experience.
```

Pricing approach:

- Use “starting from” prices if you want to filter out low-budget requests.
- Use “request a quote” for larger work.
- Use packages only if the deliverables are very clear.

Recommended structure:

```txt
Starter project: from $500–$1,500
Small custom system: from $750–$2,500
Creator launch build: from $2,500–$10,000+
Full custom development: by quote
```

Adjust these numbers based on your skill level, market, scope, and confidence. Do not promise low prices if you want a premium brand.

### 7.5 Shop page

Goal: Sell digital products separately from the premium homepage.

Recommended headline:

```txt
Production-ready assets, scripts, and systems.
```

Subheading:

```txt
Tools and digital products built from real game development workflows.
```

Categories:

```txt
All products
UEFN / Fortnite
Roblox
Unity
Unreal Engine
Scripts
Assets
Templates
UI kits
Tools
Bundles
```

Product card:

```txt
Image or preview
Product name
Platform
Short description
Price
Badge: New / Popular / Updated
Button: View product
```

### 7.6 Product page

Goal: Make a customer confident enough to buy.

Product page structure:

```txt
1. Product hero
   - Name
   - Platform
   - Price
   - Preview image/video
   - Buy button

2. What it does
   - Simple explanation

3. Who it is for
   - Beginner creators, UEFN developers, Roblox developers, etc.

4. What is included
   - Files
   - Documentation
   - Example scenes
   - Setup guide
   - Version info

5. Requirements
   - Engine version
   - Plugins
   - Skill level
   - Platform limitations

6. License
   - Personal use
   - Commercial use
   - What is not allowed

7. Updates
   - How updates are delivered
   - How long updates are included

8. Support
   - Email or Discord
   - Response expectations
   - What support includes and does not include

9. Refund policy
   - Clear and fair rules

10. FAQ
   - Common buyer concerns
```

### 7.7 Book page

Goal: Convert creators, brands, and clients into calls.

Recommended headline:

```txt
Book a creator partnership call.
```

Subheading:

```txt
Tell us about your audience, platform, and the experience you want to build or promote.
```

Booking page sections:

```txt
1. Who this is for
2. What we can discuss
3. Short intake form
4. Calendar embed or booking link
5. What happens after booking
6. FAQ
```

### 7.8 About page

Goal: Build trust and explain who you are.

Content:

```txt
Studio mission
Why you build games
Why creators matter
Your development philosophy
Team or founder section
Tools/platforms you use
Process
Values
CTA to book a call
```

### 7.9 Contact page

Goal: Provide a simple general contact route.

Content:

```txt
Email
Contact form
Business inquiries
Support inquiries
Social links
Expected response time
```

---

## 8. User Journeys

### 8.1 Creator / influencer journey

```txt
Home → Creator value section → Featured work → Book page → Intake form → Call booked
```

What they need to feel:

- The studio is serious
- The game/project could create good content
- The team understands creators
- The collaboration process is clear
- Booking a call feels easy

### 8.2 Brand / company journey

```txt
Home → Work → Case study → Services → Book page
```

What they need to feel:

- The studio can execute professionally
- The process is structured
- The work has quality
- The team understands launches and audiences
- There is a clear path to starting

### 8.3 Shop customer journey

```txt
Home or Google → Shop → Product page → Checkout → Download → Support / updates
```

What they need to feel:

- Product is useful
- Product is compatible with their platform
- Price is clear
- License is clear
- Download is automatic
- Refund/support policy is clear

### 8.4 Unknown visitor journey

```txt
Home → About → Work → Case study → Final CTA
```

What they need to feel:

- The studio is real
- The work is not fake
- There is proof
- The messaging is professional
- The site is polished enough to trust

---

## 9. Portfolio and Case Studies

### 9.1 What to show

Show proof visually and clearly:

- Screenshots
- Short video clips
- Trailer clips
- Gameplay loops
- Before/after polish examples
- UI screenshots
- Environment shots
- Tool/system screenshots
- Player or creator reactions if available
- Stats if true and verifiable
- Timeline
- Role and deliverables

### 9.2 What makes a case study premium

A premium case study does not only show pictures. It explains the thinking.

Include:

```txt
Goal → Problem → Concept → Process → Final result → Learnings → CTA
```

### 9.3 Case study template

```md
# Project Name

## Overview
One short paragraph explaining what the project was.

## Quick Facts
- Platform:
- Timeline:
- Role:
- Services:
- Audience:

## Challenge
What needed to be solved?

## Concept
What was the central idea, hook, or creator angle?

## Development Process
How the project moved from idea to build.

## Systems Built
- Gameplay mechanic
- UI system
- Progression
- Tools
- Scripting
- Assets

## Visual Direction
Screenshots, video, worldbuilding, mood, polish.

## Results
Use real numbers if available. If not, use qualitative outcomes.

## What We Learned
Shows maturity and honesty.

## CTA
Book a call to build something similar.
```

---

## 10. Shop Structure

### 10.1 Shop purpose

The shop should sell products without weakening the premium studio image.

It should feel like:

```txt
A professional product library from a serious game studio.
```

Not:

```txt
A random asset dump.
```

### 10.2 Product categories

Recommended categories:

```txt
UEFN / Fortnite assets
Roblox systems
Unity scripts
Unreal assets
Gameplay systems
UI kits
Environment kits
Code templates
Launch templates
Creator tools
Bundles
```

### 10.3 Product naming

Use clear, professional product names.

Bad:

```txt
INSANE ULTIMATE SCRIPT PACK!!!
```

Good:

```txt
Creator Launch UI Kit
UEFN Interaction System
Roblox Progression Template
Unity Inventory System
Unreal Cinematic Environment Pack
```

### 10.4 Product pricing

Recommended early pricing:

```txt
Small scripts/tools: $9–$29
Templates/systems: $29–$99
Asset packs: $19–$149
Bundles: $99–$299
Custom services: by quote or starting from price
```

Pricing depends heavily on quality, platform, documentation, support, and commercial license value.

### 10.5 Licensing

Every product needs a license. Keep it simple.

Recommended license rules:

```txt
Allowed:
- Use in personal projects
- Use in commercial games/projects
- Modify for your own project
- Use for client work if license says so

Not allowed:
- Resell the product as-is
- Redistribute files publicly
- Share with people who did not buy it
- Claim the original asset/code as your own standalone product
- Upload it to another marketplace
```

Offer two license types later:

```txt
Standard license: for individuals/small projects
Studio license: for teams/client work
```

### 10.6 Updates

Decide before launch:

```txt
Do customers get lifetime updates?
Do customers get one year of updates?
Are major version upgrades paid?
Where do they download updates?
```

Beginner-friendly recommendation:

```txt
Minor updates included. Major rebuilds may be sold as new versions.
```

### 10.7 Refund policy

Digital product refunds are tricky because the product can be downloaded instantly. Be fair but clear.

Possible policy:

```txt
Because digital products can be downloaded immediately, refunds are reviewed case by case. Refunds may be offered if the product is broken, significantly different from the description, or incompatible because of an error in our listing. Refunds are not usually offered if the customer bought the wrong product, changed their mind, or did not read the requirements.
```

This should be reviewed with a legal professional if you sell internationally.

### 10.8 Support

Support should be realistic.

Example support wording:

```txt
Support includes installation help, bug reports, and clarification about included files. Support does not include custom modifications, private tutoring, or building your full project for you.
```

---

## 11. Services Structure

### 11.1 Services to offer

Recommended service categories:

```txt
Creator launch builds
Custom coding
Custom assets
Gameplay systems
Game UI/UX
Prototype development
Map/world design
Polish and optimization
Technical consulting
Launch support
```

### 11.2 Pricing approach

Use a mix of “starting from” and “request a quote.”

Why:

- Exact prices are hard because custom game work varies a lot.
- Starting prices prevent very low-budget inquiries.
- Request a quote keeps the brand premium.

Recommended wording:

```txt
Small systems start from $750.
Creator launch builds start from $2,500.
Larger projects are quoted after a discovery call.
```

If you are still early and need clients, lower the starting price but do not make the site look cheap. Example:

```txt
Starter projects from $500.
Custom builds by quote.
```

### 11.3 Service page layout

```txt
Hero
Service categories
Featured work
Process
Pricing guidance
FAQ
Book a call CTA
```

### 11.4 Service detail page template

For future service pages:

```txt
/service/custom-coding
/service/creator-launch-builds
/service/custom-assets
```

Each page should include:

```txt
What the service is
Who it is for
What problems it solves
What deliverables are included
Example projects
Starting price or quote guidance
Timeline expectations
FAQ
Book a call CTA
```

---

## 12. Booking Flow

### 12.1 Main booking goal

The main CTA should be:

```txt
Book a creator partnership call
```

Not just:

```txt
Contact us
```

“Book a call” feels direct and action-oriented.

### 12.2 Booking page structure

```txt
1. Hero: Book a creator partnership call
2. Short explanation
3. Who this is for
4. What we can discuss
5. Intake form
6. Calendar embed/link
7. What happens next
8. FAQ
```

### 12.3 Intake form questions

Ask enough to qualify leads, but not so much that people give up.

Recommended questions:

```txt
Name
Email
Creator/channel name
Main platform: YouTube, TikTok, Twitch, Instagram, other
Links to socials
Audience size
Type of content you create
Are you interested in promotion, collaboration, custom development, or early access?
What platform/game engine is the project related to?
What is your ideal timeline?
Do you have a budget range?
What should we know before the call?
```

### 12.4 Calendar tool

Recommended beginner tool:

```txt
Calendly
```

Calendly’s free plan currently includes one event type and one connected calendar; paid Standard plans add unlimited event types, more integrations, reminders, and other features. Check the official pricing page before subscribing because plan details can change.

### 12.5 Confirmation email

Example confirmation email:

```txt
Subject: Creator partnership call confirmed

Thanks for booking a call with [Studio Name].

Before the call, please send any useful links, including your channel, previous campaigns, game references, or project documents.

On the call, we will discuss:
- Your audience and content style
- The game or experience idea
- The launch/promotion goal
- Timeline and next steps

See you soon,
[Studio Name]
```

### 12.6 Follow-up after call

After the call, send:

```txt
Summary of what was discussed
Recommended next step
Estimated scope
Timeline
Price range or proposal path
Link to case studies
Call-to-action: approve proposal / book next meeting / send assets
```

---

## 13. Content Needed Before Building

### 13.1 Text content

Prepare:

```txt
Studio name
One-line positioning statement
Homepage headline
Homepage subheading
Service descriptions
Shop category descriptions
About page story
Process explanation
FAQ answers
Contact details
Legal/policy drafts
```

### 13.2 Visual content

Prepare:

```txt
Logo
Favicon
Studio color palette
Project screenshots
Gameplay videos
Trailer clips
Product preview images
Team/founder photo if relevant
Behind-the-scenes images
Mockups of UI/systems
```

### 13.3 Proof content

Prepare:

```txt
Case studies
Testimonials
Creator feedback
Partner logos
Project results
Screenshots of launches
Player/community stats
Before/after examples
```

### 13.4 Product content

For each shop product, prepare:

```txt
Product name
Price
Category
Preview image/video
Description
Included files
Requirements
Installation instructions
License terms
Refund/support notes
Download file
Changelog
```

---

## 14. Trust and Proof Strategy

### 14.1 Trust signals to include

Use:

```txt
Case studies
Selected work
Real screenshots
Real videos
Testimonials
Process explanation
Clear contact details
Clear policies
Professional design
High-quality writing
Transparent pricing guidance
Specific platform expertise
```

### 14.2 Proof hierarchy

Strongest proof:

```txt
Real creator/client testimonial with name and link
Real project with screenshots/video
Real result numbers
Public launch or island/game link
```

Medium proof:

```txt
Detailed internal case study
Before/after screenshots
Behind-the-scenes process
Technical breakdown
```

Weak proof:

```txt
Generic claims
Fake logos
Unverified numbers
Vague “we are experts” language
```

Do not fake proof. Premium brands are specific and restrained.

---

## 15. Design Direction

### 15.1 Overall style

The design should feel like:

```txt
Apple-level space
DJI-level cinematic product presentation
Stripe-level clarity
Linear-level minimalism
Finance/tech-level trust
```

Visual keywords:

```txt
Dark premium
Cinematic
Minimal
Spacious
Precise
Glass-like surfaces
Soft gradients
High contrast
Large typography
Few but strong visuals
```

### 15.2 Layout

Use:

- Large hero sections
- Wide spacing
- Strong alignment
- Few columns
- Clear visual hierarchy
- One main idea per section
- Lots of breathing room

Avoid:

- Too many cards at once
- Busy backgrounds
- Gamer neon everywhere
- Overlapping elements without purpose
- Huge walls of text
- Random icons

### 15.3 Colors

Recommended base palette:

```txt
Background: near-black / deep navy / charcoal
Text: soft white
Secondary text: cool gray
Accent: electric blue, violet, cyan, or silver
Cards: dark glass / translucent panels
Borders: subtle white transparency
```

Example palette:

```txt
#05070D  near-black
#0B1020  deep navy
#F5F7FA  soft white
#9CA3AF  muted gray
#6D7CFF  premium blue/violet accent
#22D3EE  cyan highlight
```

Do not use too many colors. One main accent color is enough.

### 15.4 Typography

Use modern sans-serif fonts.

Good options:

```txt
Inter
Geist
Satoshi
Manrope
Neue Haas Grotesk-style fonts
```

Typography rules:

```txt
Big hero headline
Short paragraphs
Small uppercase labels
Clean nav text
Strong button text
Generous line height
```

### 15.5 Buttons

Primary button:

```txt
White or bright accent background
Dark text
Rounded pill shape
Medium-large padding
Clear label
```

Example:

```txt
Book creator partnership call
```

Secondary button:

```txt
Transparent background
Subtle border
Soft text
```

Example:

```txt
View selected work
```

### 15.6 Cards

Cards should be simple:

```txt
Dark background
Subtle border
Soft gradient
Rounded corners
One strong heading
Short body text
Minimal icon or image
```

### 15.7 Animations

Use animations carefully.

Good animations:

```txt
Subtle fade-in
Slow gradient glow
Smooth hover states
Slight card lift
Video preview on project cards
```

Avoid at launch:

```txt
Heavy 3D scenes
Complex scroll hijacking
Too many particles
Huge animated backgrounds
Cursor effects
Sound effects
Loading screens
```

A premium website feels expensive because it is controlled, not because it moves constantly.

---

## 16. Brand Voice and Copywriting

### 16.1 Voice

The copy should be:

```txt
Confident
Clear
Premium
Calm
Specific
Creator-aware
Technical but understandable
```

Avoid:

```txt
Hype language
Overpromising
Cheap sales language
Too many buzzwords
Childish gaming language
```

### 16.2 Headline examples

```txt
We build game experiences creators want to promote.
```

```txt
Premium game worlds built for creator-led launches.
```

```txt
Creator-ready systems, worlds, and gameplay moments.
```

```txt
From concept to launch-ready playable experience.
```

```txt
Built for creators. Polished for audiences.
```

### 16.3 CTA examples

```txt
Book creator partnership call
View selected work
Explore services
View product library
Request a quote
Start a project
Download asset
Buy now
```

### 16.4 Service description example

```txt
Creator launch builds
We design and develop custom game experiences around your audience, content style, and launch goal. From gameplay hook to visual polish, each build is shaped to create moments people want to watch, share, and play.
```

### 16.5 Product description example

```txt
Creator Launch UI Kit
A clean, production-ready UI kit for game menus, launch screens, creator campaigns, and interactive experiences. Includes layered files, implementation notes, and commercial-use licensing for eligible projects.
```

---

## 17. Conversion Strategy

### 17.1 Primary conversion

Primary conversion:

```txt
Book a creator partnership call
```

This CTA should appear:

```txt
Navigation
Hero
After featured work
Services page
Case study pages
Final homepage CTA
Footer
```

### 17.2 Secondary conversion

Secondary conversion:

```txt
View selected work
```

This helps people who are not ready to book yet.

### 17.3 Shop conversion

Shop conversions happen on `/shop` and product pages, not the homepage.

Use:

```txt
Clear product previews
Compatibility info
License clarity
Buy button above the fold
FAQ
Refund policy
Support notes
Trust badges
Bundles
```

### 17.4 Lead magnets

Optional future lead magnets:

```txt
Creator launch checklist
UEFN map launch checklist
Roblox game polish checklist
Free UI mini-kit
Free script sample
Game launch planning template
```

### 17.5 Upsells and bundles

Future shop upsells:

```txt
Buy product → offer setup guide
Buy script → offer support package
Buy one UI kit → offer full creator launch bundle
Buy asset pack → offer custom adaptation service
```

### 17.6 Trust placement

Add proof near conversion points:

```txt
Before booking CTA: show selected work or testimonial
Before product buy button: show compatibility, license, support
Before service quote: show process and case study
```

---

## 18. SEO and Marketing Plan

### 18.1 SEO goal

The website should be structured so Google understands:

```txt
Who you are
What platforms you work with
What services you offer
What products you sell
Why your work is credible
```

### 18.2 Homepage SEO

Homepage target:

```txt
creator-focused game development studio
premium game development studio
game studio for creators
```

Homepage title example:

```txt
[Studio Name] — Premium Game Studio for Creator-Led Launches
```

Homepage meta description example:

```txt
[Studio Name] builds premium game experiences, creator-ready worlds, and custom development systems for creators, brands, and communities.
```

### 18.3 Service SEO pages

Create platform-specific pages later:

```txt
UEFN Game Development Studio
Fortnite Creative Map Development
Roblox Game Development Studio
Custom Roblox Scripting Services
Unity Game Development Services
Unreal Engine Development Services
Custom Game Systems
Game UI/UX Design Services
```

### 18.4 Shop SEO pages

Product/category SEO pages:

```txt
UEFN Assets
Verse Scripts
Roblox Scripts
Roblox Systems
Unity Scripts
Unreal Engine Assets
Game UI Kits
Game Templates
```

### 18.5 Blog/content ideas

Good content topics:

```txt
How to design a Fortnite Creative map creators will promote
What makes a game experience good for YouTube and TikTok
UEFN launch checklist for creators
Roblox game systems every creator project needs
How to polish a game prototype before launch
How to make game UI feel premium
How to prepare a creator launch kit for a game
Custom game development checklist for brands
```

### 18.6 SEO basics

Each page should have:

```txt
One clear H1 heading
Descriptive page title
Meta description
Clean URL
Fast loading
Compressed images
Alt text for images
Internal links
Schema markup where useful
Mobile-friendly layout
```

### 18.7 Marketing channels

Use:

```txt
YouTube shorts / TikTok development clips
Twitter/X progress threads
Discord community
LinkedIn for brand/client positioning
Creator outreach email
Case study posts
Behind-the-scenes clips
Product launch posts
```

The best content for this brand is proof-based:

```txt
Build clips
Before/after polish
Creator-focused design explanations
Launch breakdowns
Short gameplay moments
Case study breakdowns
```

---

## 19. Analytics and Tracking Plan

### 19.1 Tools

Recommended beginner setup:

```txt
Google Analytics 4 or Plausible
Google Search Console
Vercel Analytics optional
Lemon Squeezy / Stripe dashboard
Calendly booking reports
```

### 19.2 Events to track

Track:

```txt
Book call button clicks
Calendly link clicks
Form starts
Form submissions
Product page views
Buy button clicks
Checkout starts
Purchases
Revenue by product
Revenue by traffic source
Abandoned checkouts
Refunds
Shop category clicks
Case study views
Scroll depth on homepage
Outbound social clicks
```

### 19.3 Key metrics

Important metrics:

```txt
Homepage conversion rate to booking
Services page conversion rate
Case study to booking conversion
Product page purchase conversion rate
Average order value
Revenue per visitor
Top traffic sources
Top converting keywords
Top viewed projects
Email signup rate
```

### 19.4 What to review weekly

```txt
Which pages got traffic?
Which CTAs were clicked?
Which products were viewed?
Which traffic sources converted?
Where did people drop off?
Did any bookings happen?
Did any purchases happen?
```

---

## 20. Legal and Business Checklist

This is not legal advice. For international sales, taxes, digital products, and client contracts, use a lawyer/accountant when possible.

### 20.1 Required legal pages

You should have:

```txt
Privacy Policy
Terms of Service
Refund Policy
Digital Product License Terms
Cookie Policy if using cookies/tracking
Contact/business information
```

### 20.2 Privacy policy

Should explain:

```txt
What data you collect
Why you collect it
How users contact you
Analytics tools used
Payment processors used
Booking tools used
Email tools used
How long data is stored
How users can request deletion/access
```

### 20.3 Terms of service

Should explain:

```txt
Use of the website
Service limitations
Intellectual property ownership
Custom work terms
Payment terms
No guarantee of specific results
Limitation of liability
Dispute handling
```

### 20.4 Refund policy

Should explain:

```txt
Digital product refund rules
Custom service refund rules
What happens if a product is broken
What happens if a client cancels
How to request a refund
Response timeframe
```

### 20.5 License terms

Should explain:

```txt
Personal/commercial use
Number of users/seats
Redistribution restrictions
Client work permissions
Modification permissions
Marketplace resale restrictions
Attribution requirements if any
Ownership of custom work
```

### 20.6 GDPR / cookie compliance

If selling to or tracking users in the EU/EEA, GDPR and cookie rules matter.

Consider:

```txt
Cookie banner if using non-essential cookies
Analytics consent settings
Privacy policy
Data processing agreements with tools
Ability to delete/access user data
Minimal data collection
```

### 20.7 Taxes / VAT

Digital product sales can create tax/VAT obligations depending on where customers live and which payment provider you use. Merchant of Record platforms such as Lemon Squeezy and Gumroad can reduce complexity because they handle many tax/compliance obligations as the merchant, but you should still check your local business obligations.

### 20.8 Platform/IP rules

If you build for UEFN, Roblox, Unity, Unreal, or other ecosystems:

```txt
Do not sell copyrighted assets you do not own
Do not misuse platform trademarks
Do not imply official partnership unless true
Follow platform marketplace rules
Respect third-party asset licenses
Avoid selling ripped game assets
Keep clear ownership records
```

---

## 21. Technical Recommendations

### 21.1 Beginner explanation

A website is usually made of:

```txt
HTML        Structure: headings, text, buttons, images
CSS         Design: colors, spacing, layout, fonts
JavaScript  Interactivity: menus, filters, forms, checkout logic
```

Modern professional websites often use:

```txt
React       Reusable interface components
Next.js     Full website framework built on React
TypeScript  Safer JavaScript
Tailwind    Fast styling system
Vercel      Hosting/deployment platform
```

### 21.2 Recommended stack

Because you want to code the website and avoid builders, use:

```txt
Next.js
React
TypeScript
Tailwind CSS
Vercel
GitHub
Lemon Squeezy or Stripe
Calendly
```

### 21.3 Why this stack

Next.js:

- Good for professional websites
- Good for SEO
- Easy page routing
- Works well with Vercel
- Common in modern web development

React:

- Lets you build reusable components
- Good for cards, buttons, product pages, layouts

TypeScript:

- Helps prevent coding mistakes
- Better for serious projects

Tailwind CSS:

- Fast styling
- Good for premium custom design
- Avoids writing huge CSS files

Vercel:

- Easy deployment
- Works very well with Next.js
- Has a free Hobby plan for personal projects

GitHub:

- Stores your code
- Lets Vercel deploy automatically from your repository

### 21.4 Project folder structure

Recommended structure:

```txt
studio-site/
  app/
    page.tsx
    work/
      page.tsx
    services/
      page.tsx
    shop/
      page.tsx
    book/
      page.tsx
    about/
      page.tsx
    contact/
      page.tsx
    privacy/
      page.tsx
    terms/
      page.tsx
    refund-policy/
      page.tsx
    license/
      page.tsx

  components/
    Header.tsx
    Footer.tsx
    Hero.tsx
    CreatorValue.tsx
    FeaturedWork.tsx
    Process.tsx
    FinalCTA.tsx
    ProjectCard.tsx
    ProductCard.tsx
    ServiceCard.tsx

  public/
    images/
      logo.svg
      project-01.jpg
      project-02.jpg
      product-01.jpg

  app/globals.css
```

### 21.5 What is `page.tsx`?

In Next.js, a `page.tsx` file creates a webpage.

Example:

```txt
app/page.tsx
```

creates:

```txt
yourdomain.com/
```

And:

```txt
app/shop/page.tsx
```

creates:

```txt
yourdomain.com/shop
```

### 21.6 Getting started command

Install Node.js first, then run:

```bash
npx create-next-app@latest studio-site --typescript --tailwind --eslint --app
cd studio-site
npm run dev
```

Open:

```txt
http://localhost:3000
```

That is your local development site.

---

## 22. Hosting and Domain

### 22.1 How hosting works

Your domain is the address:

```txt
yourdomain.com
```

Hosting is where the website files live.

For a Next.js site, the easiest hosting option is:

```txt
Vercel
```

Flow:

```txt
Code in VS Code → Push to GitHub → Vercel builds site → Domain points to Vercel
```

### 22.2 Free hosting options

Good free/low-cost options:

```txt
Vercel Hobby
Netlify Free
GitHub Pages for static sites
Cloudflare Pages
```

For your recommended Next.js stack, use Vercel.

### 22.3 Current hosting notes

As of the latest checked official information:

- Vercel has a free Hobby plan and a Pro plan listed at $20/month plus additional usage.
- Vercel Hobby includes free monthly allowances, but if you exceed limits you may need to wait for the next cycle or upgrade.
- Netlify has a Free plan, a Personal plan listed at $9/month, and a Pro plan listed at $20/month.

Always check official pricing pages before committing because pricing and limits can change.

### 22.4 Connecting your existing domain

Basic steps:

```txt
1. Deploy site to Vercel
2. Add your domain in Vercel project settings
3. Go to your domain registrar
4. Update DNS records as Vercel instructs
5. Wait for DNS propagation
6. Confirm HTTPS/SSL is active
```

DNS means “Domain Name System.” It tells browsers where your domain should point.

---

## 23. Payments and Digital Delivery

### 23.1 Best beginner recommendation

For your first digital shop, use:

```txt
Lemon Squeezy payment links or checkout
```

Why:

- Built for digital products
- Handles downloads
- Beginner-friendly
- Acts as Merchant of Record
- Helps with global digital tax/compliance complexity
- Easy to link from your custom-coded site

### 23.2 Stripe

Use Stripe if:

```txt
You want more control
You are comfortable with more setup
You want custom checkout
You want subscriptions/client portal later
You want deeper integrations
```

Stripe’s official US standard card pricing is listed as 2.9% + 30¢ per successful domestic card transaction, with additional fees for international cards or currency conversion. Pricing varies by country, so check the Stripe pricing page for your region.

### 23.3 Lemon Squeezy

Best for:

```txt
Digital products
Templates
Scripts
Assets
Software licenses
Simple checkout
Tax handling support
```

Recommended for your first version.

### 23.4 Gumroad

Good for:

```txt
Very fast launch
Simple creator sales
No-code checkout
```

Tradeoff:

```txt
Higher transaction fee than some alternatives
Less premium feeling than a fully branded custom flow
```

Gumroad currently lists a transaction fee of 10% + $0.50 for profile/direct sales and says it operates as a Merchant of Record for tax obligations.

### 23.5 Shopify

Good for:

```txt
Full ecommerce store
Many products
Inventory/order management
Apps
Physical products later
```

Not ideal for your first custom-coded premium studio site unless ecommerce becomes the main business. Shopify’s Basic plan is currently listed from $29/month billed yearly, with online card rates starting at 2.9% + 30¢ in the US, but pricing can vary by region and plan.

### 23.6 WooCommerce

Good for:

```txt
WordPress-based ecommerce
Full control
Large plugin ecosystem
```

Not recommended for your first custom-coded Next.js site. It adds WordPress maintenance, plugin updates, hosting management, and security responsibilities.

### 23.7 Recommended first checkout flow

```txt
Product page on your site
→ Buy button
→ Lemon Squeezy checkout
→ Customer pays
→ Lemon Squeezy delivers download
→ Customer receives receipt
→ You manage orders in Lemon Squeezy dashboard
```

This avoids building a complex checkout system at launch.

---

## 24. Admin Workflow and Maintenance

### 24.1 Updating pages

Early workflow:

```txt
Edit code in VS Code
Commit changes to GitHub
Vercel deploys automatically
Check live site
```

### 24.2 Adding products

Early workflow:

```txt
Create product in Lemon Squeezy
Upload files
Set price
Write product description
Copy checkout link
Create product page/card on your site
Add buy button link
Test purchase/download
```

### 24.3 Managing orders

Use the payment provider dashboard:

```txt
Lemon Squeezy dashboard
Stripe dashboard
Gumroad dashboard
Shopify admin if using Shopify
```

### 24.4 Support

Set up:

```txt
support@yourdomain.com
Contact form
Optional Discord support channel
FAQ page
Product documentation
```

### 24.5 Publishing case studies

At launch, case studies can be coded manually as pages.

Later, use a CMS such as:

```txt
Sanity
Contentful
Payload CMS
Strapi
```

A CMS means “Content Management System.” It lets you edit content from an admin interface instead of editing code.

### 24.6 Maintenance schedule

Weekly:

```txt
Check analytics
Check bookings
Check orders
Answer support
Fix bugs
```

Monthly:

```txt
Update products
Improve copy
Add screenshots/videos
Publish one case study or article
Review SEO performance
Review broken links
```

Quarterly:

```txt
Refresh homepage proof
Update pricing/packages
Review legal policies
Audit performance
Review conversion rates
```

---

## 25. MVP vs Future Version

### 25.1 Build first for launch

MVP pages:

```txt
Home
Work
Services
Shop
Book
About
Contact
Privacy
Terms
Refund Policy
License Terms
```

MVP features:

```txt
Premium homepage
Separate shop page
Product cards
External checkout links
Booking link/embed
Contact form or email link
Case study previews
Responsive mobile design
Analytics
SEO basics
Legal pages
```

### 25.2 Add later

Future features:

```txt
Full product pages for every product
CMS for case studies/products
Search/filtering in shop
Bundles/upsells
Email newsletter
Lead magnet
Testimonials section
Advanced analytics
Customer accounts
Creator partner page
Press/brand kit
Affiliate program
```

### 25.3 Overkill at the beginning

Avoid at launch:

```txt
Custom checkout
Customer login/dashboard
Full marketplace
Creator dashboard
Affiliate dashboard
Complex 3D animations
Advanced CMS
Real-time chat
Review system
Forum
Subscription system
AI features
Multi-language site
Complex product filtering
```

---

## 26. Pages and Features to Avoid at Launch

Avoid building pages just because big companies have them.

Do not launch with:

```txt
Careers page if you are not hiring
Investor page
Press room with no press
Huge blog with no content
Community forum
Complicated account system
Massive support center
Full marketplace
Overdesigned animation pages
Dozens of service pages with thin content
```

Keep the site focused and strong.

---

## 27. Budget Options

These are estimates. Always check current official pricing before buying tools.

### 27.1 Free or almost-free setup

Best for learning and first launch.

```txt
Code editor: VS Code — free
Code storage: GitHub Free — free
Hosting: Vercel Hobby — free
Booking: Calendly Free — free
Analytics: Google Analytics + Search Console — free
Payments: Lemon Squeezy/Gumroad/Stripe — no monthly fee, transaction fees apply
Domain: already owned
Email: use existing email at first, or upgrade later
```

Estimated cost:

```txt
$0/month plus payment processing fees
Domain renewal separately if not already paid
```

### 27.2 Low-budget setup

Good first professional setup.

```txt
Vercel Hobby or Pro if needed
Calendly Standard if you need more event types/reminders
Lemon Squeezy for products
Google Analytics or Plausible
Basic business email
```

Estimated cost:

```txt
$10–$50/month plus payment processing fees
```

### 27.3 Professional setup

Good when bookings/products are producing revenue.

```txt
Vercel Pro
Calendly Standard/Teams
Lemon Squeezy or Stripe
Plausible or advanced analytics
Business email
CMS such as Sanity
Design assets/tools
Legal templates or lawyer review
```

Estimated cost:

```txt
$50–$200/month plus payment processing fees and legal/accounting costs
```

### 27.4 Scalable long-term setup

Good when the studio is growing.

```txt
Vercel Pro or Enterprise
Custom checkout or advanced Lemon Squeezy/Stripe integration
CMS
Customer portal
Email marketing
Support desk
Advanced analytics
A/B testing
More robust legal/accounting setup
```

Estimated cost:

```txt
$200–$1,000+/month depending on traffic, tools, team size, and support needs
```

---

## 28. Beginner-Friendly Step-by-Step Roadmap

### Phase 1: Planning

```txt
1. Choose studio name and main platform focus.
2. Decide main offer: creator partnerships, custom builds, or products.
3. Write your positioning statement.
4. Choose the MVP pages.
5. Decide what proof you already have.
```

### Phase 2: Branding

```txt
1. Choose logo direction.
2. Choose colors.
3. Choose typography.
4. Define visual style.
5. Create basic brand rules.
```

### Phase 3: Content writing

```txt
1. Write homepage headline/subheading.
2. Write service descriptions.
3. Write shop category descriptions.
4. Write about page.
5. Write FAQ.
6. Write legal placeholders.
```

### Phase 4: Visual preparation

```txt
1. Collect project screenshots.
2. Record short gameplay clips.
3. Make product preview images.
4. Prepare logo/favicon.
5. Create project thumbnails.
```

### Phase 5: Development setup

```txt
1. Install Node.js.
2. Install Visual Studio Code.
3. Create GitHub account.
4. Create Next.js app.
5. Run local dev server.
```

Command:

```bash
npx create-next-app@latest studio-site --typescript --tailwind --eslint --app
cd studio-site
npm run dev
```

### Phase 6: Build pages

```txt
1. Build Header component.
2. Build Footer component.
3. Build homepage sections.
4. Build Work page.
5. Build Services page.
6. Build Shop page.
7. Build Book page.
8. Build About and Contact pages.
9. Build legal pages.
```

### Phase 7: Add shop/payment

```txt
1. Create Lemon Squeezy account.
2. Create first products.
3. Upload download files.
4. Set prices.
5. Copy checkout links.
6. Add buy buttons to product cards/pages.
7. Test checkout and download flow.
```

### Phase 8: Add booking

```txt
1. Create Calendly event.
2. Add questions.
3. Set availability.
4. Connect calendar.
5. Add link/embed to Book page.
6. Test booking confirmation.
```

### Phase 9: Deploy

```txt
1. Push code to GitHub.
2. Create Vercel account.
3. Import GitHub repository.
4. Deploy project.
5. Add custom domain.
6. Check HTTPS.
```

### Phase 10: Test

```txt
1. Test all pages.
2. Test mobile layout.
3. Test buttons.
4. Test shop links.
5. Test booking link.
6. Test contact form/email.
7. Check spelling.
8. Check loading speed.
9. Check SEO metadata.
10. Check legal pages.
```

### Phase 11: Launch

```txt
1. Announce on social media.
2. Send to creators/partners.
3. Share selected work.
4. Publish a short launch post.
5. Monitor analytics and errors.
```

### Phase 12: Improve

```txt
1. Review analytics weekly.
2. Improve unclear sections.
3. Add better proof.
4. Add case studies.
5. Improve shop products.
6. Test different CTA wording.
```

---

## 29. Launch Checklist

### Strategy

```txt
[ ] Studio positioning is clear
[ ] Homepage is creator-focused
[ ] Shop is separate from homepage
[ ] Main CTA is Book a Call
[ ] Secondary CTA is View Work
```

### Content

```txt
[ ] Homepage copy written
[ ] Services copy written
[ ] Shop copy written
[ ] About copy written
[ ] Contact information added
[ ] FAQ written
[ ] Legal pages drafted
```

### Visuals

```txt
[ ] Logo added
[ ] Favicon added
[ ] Hero visual added
[ ] Project images added
[ ] Product images added
[ ] Mobile visuals checked
```

### Development

```txt
[ ] Next.js project created
[ ] Tailwind configured
[ ] Pages built
[ ] Components organized
[ ] Mobile responsive layout checked
[ ] Navigation works
[ ] Footer works
[ ] No broken links
```

### Shop

```txt
[ ] Products created
[ ] Download files uploaded
[ ] Pricing set
[ ] License terms written
[ ] Refund policy written
[ ] Checkout links tested
[ ] Download delivery tested
```

### Booking

```txt
[ ] Calendly or booking tool set up
[ ] Intake questions added
[ ] Calendar availability correct
[ ] Confirmation email checked
[ ] Booking page tested
```

### SEO

```txt
[ ] Page titles written
[ ] Meta descriptions written
[ ] H1 headings checked
[ ] Image alt text added
[ ] Sitemap generated if needed
[ ] Google Search Console set up
```

### Analytics

```txt
[ ] Analytics installed
[ ] Booking clicks tracked
[ ] Product clicks tracked
[ ] Purchases tracked if possible
[ ] Search Console connected
```

### Legal

```txt
[ ] Privacy policy published
[ ] Terms of service published
[ ] Refund policy published
[ ] License terms published
[ ] Cookie/GDPR setup reviewed
[ ] Business/tax setup reviewed
```

### Final QA

```txt
[ ] Desktop tested
[ ] Mobile tested
[ ] Tablet tested
[ ] Chrome tested
[ ] Safari tested if possible
[ ] Forms tested
[ ] Buttons tested
[ ] Payments tested
[ ] Booking tested
[ ] Spelling checked
[ ] Site speed checked
```

---

## 30. 30 / 60 / 90 Day Plan

### First 30 days after launch

Focus:

```txt
Make the site trustworthy and functional.
```

Actions:

```txt
1. Review analytics weekly.
2. Fix unclear copy.
3. Improve homepage spacing and visuals.
4. Add one strong case study.
5. Test booking flow.
6. Contact creators directly.
7. Publish short behind-the-scenes clips.
8. Add first shop products.
9. Improve product descriptions.
10. Collect feedback from visitors.
```

### Days 31–60

Focus:

```txt
Increase proof and traffic.
```

Actions:

```txt
1. Publish another case study.
2. Create platform-specific service page.
3. Publish 2–4 SEO articles or project breakdowns.
4. Add testimonials if available.
5. Improve shop categories.
6. Create a free lead magnet.
7. Start email capture.
8. Outreach to creators and brands.
9. Improve product previews.
10. Review conversion rates.
```

### Days 61–90

Focus:

```txt
Turn the site into a real sales and partnership machine.
```

Actions:

```txt
1. Add more product pages.
2. Add bundles.
3. Improve booking qualification.
4. Add stronger case study results.
5. Build a creator partnership page if needed.
6. Improve SEO based on Search Console.
7. Test different homepage CTA text.
8. Create a monthly content schedule.
9. Add support/documentation page.
10. Decide whether to add CMS or keep editing by code.
```

---

## 31. Suggested Homepage Copy Draft

### Hero

```txt
We build game experiences creators want to promote.
```

```txt
Premium playable worlds, creator-ready launch moments, and custom game systems for influencers, brands, and communities.
```

Buttons:

```txt
Book creator partnership call
View selected work
```

### Creator value

```txt
Built around the way creators launch content.
```

```txt
We design gameplay hooks, visual moments, and launch-ready experiences that are easy to film, easy to understand, and exciting for audiences to watch.
```

### Process

```txt
From audience fit to polished launch.
```

```txt
Every build starts with the creator, the audience, and the moment the content needs to create.
```

### Final CTA

```txt
Bring your audience into a world built for them.
```

```txt
Start with a short call and we will explore the right game experience, launch angle, and collaboration path.
```

---

## 32. Recommended Tech Stack

Final recommended stack:

```txt
Editor: Visual Studio Code
Code storage: GitHub
Frontend framework: Next.js
UI library: React
Language: TypeScript
Styling: Tailwind CSS
Hosting: Vercel
Payments/digital delivery: Lemon Squeezy first, Stripe later if needed
Booking: Calendly
Analytics: Google Analytics 4 + Search Console, or Plausible
Email/support: business email + optional helpdesk later
CMS: none at launch, Sanity later if needed
```

---

## 33. Current Pricing / Platform Reference Notes

The following notes were checked against official or primary pricing/documentation pages around 22 April 2026. Always verify again before buying because SaaS pricing changes often.

- **Vercel:** Hobby is free; Pro is listed at $20/month plus additional usage.  
- **Netlify:** Free plan exists; Personal is listed at $9/month; Pro is listed at $20/month.  
- **Next.js:** `create-next-app` is the recommended easiest way to create a new Next.js app and supports TypeScript, Tailwind, ESLint, and the App Router.  
- **Tailwind CSS:** Official docs include a Next.js installation path using `create-next-app`, PostCSS, and importing Tailwind in global CSS.  
- **Calendly:** Free plan includes one event type and one connected calendar; Standard is listed at $10/seat/month billed yearly.  
- **Stripe:** US standard online domestic card pricing is listed as 2.9% + 30¢ per successful transaction; extra fees may apply for international cards/currency conversion.  
- **Lemon Squeezy:** Acts as Merchant of Record for digital sales tax/compliance.  
- **Gumroad:** Lists 10% + $0.50 per transaction for profile/direct sales and states it handles tax obligations as Merchant of Record.  
- **Shopify:** Basic is listed from $29/month billed yearly, with US online card rates starting at 2.9% + 30¢; Shopify includes ecommerce hosting on plans.  
- **GitHub:** Free plans include unlimited public and private repositories, with limits on some advanced features.

Official references:

```txt
Vercel pricing: https://vercel.com/pricing
Vercel Hobby docs: https://vercel.com/docs/accounts/plans/hobby
Netlify pricing: https://www.netlify.com/pricing/
Next.js create-next-app docs: https://nextjs.org/docs/app/api-reference/cli/create-next-app
Next.js installation docs: https://nextjs.org/docs/app/getting-started/installation
Tailwind with Next.js docs: https://tailwindcss.com/docs/guides/nextjs
Calendly pricing: https://calendly.com/pricing
Stripe pricing: https://stripe.com/pricing
Lemon Squeezy Merchant of Record: https://www.lemonsqueezy.com/reporting/merchant-of-record
Gumroad pricing: https://gumroad.com/pricing
Shopify pricing: https://www.shopify.com/pricing
GitHub pricing: https://github.com/pricing
GitHub plans docs: https://docs.github.com/articles/github-s-products
```

---

## 34. Final Recommendation

Build the first real version as a **custom-coded Next.js website**.

Do not start with a huge shop, dashboard, or marketplace. Start with a premium creator-focused studio website that makes people trust you.

Your first launch should be:

```txt
Premium homepage
Separate work page
Separate services page
Separate shop page
Booking page
Basic legal pages
Lemon Squeezy checkout links
Calendly booking link
Vercel hosting
```

The most important strategic rule:

> Keep the homepage clean. Make the studio feel high-end. Move products to the shop. Move custom work to services. Use work/case studies as proof. Use booking as the main conversion.

This gives you the best balance of:

```txt
Premium image
Realistic beginner build
Professional technical foundation
Creator-focused positioning
Room to grow into a serious studio brand
```
