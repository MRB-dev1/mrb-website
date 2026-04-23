# MRB Creator Studio Website

Static HTML/CSS starter for a premium creator-focused game development studio, now with a small Node/serverless contact backend.

## Pages

- `index.html` - premium studio homepage for creator-led launches
- `work.html` - selected work and case study previews
- `services.html` - custom development services and project packages
- `shop.html` - digital products, scripts, assets, templates, and tools
- `faq.html` - questions about digital delivery, licensing, support, custom work, and legal pages
- `book.html` - creator partnership and project discovery intake
- `about.html` - studio story, values, platforms, and positioning
- `contact.html` - business inquiries, support, and general contact
- `product-*.html` - individual shop product detail pages with related products
- `privacy.html` - starter privacy policy
- `terms.html` - starter terms of service
- `refund-policy.html` - starter refund policy
- `license.html` - starter digital product license terms
- `styles.css` - shared responsive styling
- `script.js` - shared animations, contact form handling, confirmation modal, and confetti
- `server.js` - local Node backend and static server
- `api/contact.js` - serverless contact endpoint for deployment hosts such as Vercel
- `functions/api/contact.js` - Cloudflare Pages Function contact endpoint
- `scripts/build-cloudflare.js` - Cloudflare Pages static build script
- `wrangler.toml` - Cloudflare Pages deploy configuration
- `vercel.json` - rewrite for `/api/contact`
- `assets/mrb-logo-white.png` - MRB logo used across the site

## Backend and contact form

The contact and inquiry forms submit to `/api/contact`. This endpoint must run on a backend. Opening `contact.html` directly as a file will not create a backend.

Local test flow:

```bash
npm start
```

Then open:

```txt
http://localhost:3000/contact.html
```

If `http://localhost:3000/contact.html` does not load, the server is not running or Node is blocked. On this machine, the visible `node.exe` is currently being denied by Windows, so install/run an official Node.js LTS binary or deploy the serverless endpoint.

Required/optional environment variables:

```txt
CONTACT_TO_EMAIL=hello@mrb.ink
CONTACT_FROM_EMAIL=MRB <website@mrb.ink>
RESEND_API_KEY=
DISCORD_WEBHOOK_URL=
DISCORD_MENTION_ROLE_ID=1496844933431037952
```

`DISCORD_WEBHOOK_URL` lets inquiries post into a private Discord channel through the backend. Do not put Discord webhooks, bot tokens, Resend keys, Lemon Squeezy API keys, or other secrets in HTML or `script.js`.

`DISCORD_MENTION_ROLE_ID` tags the responsible team role when an inquiry arrives. Current role:

```txt
Customer Inquiry Responsible: 1496844933431037952
Assigned to: mr.brum
```

For local testing, `server.js` loads private values from `.env` if that file exists. `.env` is ignored by git and should not be copied into public hosting or committed.

Email notifications require a real email provider configuration. Discord delivery is active locally through `DISCORD_WEBHOOK_URL`, but email will remain disabled until `RESEND_API_KEY` and a verified `CONTACT_FROM_EMAIL` sender/domain are configured. When Resend is configured, the backend sends one internal inquiry email to `CONTACT_TO_EMAIL` and one confirmation receipt email to the submitter.

Form email validation requires a full address such as `name@example.com`; short values like `a@a` are rejected by both the browser and backend.

The Discord MCP server is available to Codex during development, but it is not a public website backend. Visitors cannot safely submit forms directly through MCP. The public site should use `/api/contact`, and that backend can use a Discord webhook stored as an environment variable.

Discord MCP operating docs to read before changing Discord:

```txt
C:\Users\robin\OneDrive\Dokument\Fortnite Projects\MyProjectC\docs\DISCORD_MCP.md
C:\Users\robin\OneDrive\Dokument\Fortnite Projects\MyProjectC\docs\discord_manual_followup_2026-04-20.md
C:\Users\robin\OneDrive\Dokument\Fortnite Projects\MyProjectC\docs\discord_backup_2026-04-20.md
```

Important Discord MCP rules:

- Use ASCII-only names and text when possible.
- Use Discord shortcodes like `:white_check_mark:` in message content instead of literal emoji.
- MCP cannot pin messages. Pin template messages manually in Discord.
- MCP cannot reliably edit category names or visual positions.
- Keep webhooks and bot tokens out of public files.

New Discord section created:

```txt
Category: Admin Dev - Incoming Requests
website-inquiries: 1496833337921241118
request-triage: 1496833573133484145
request-templates: 1496833659229962300
```

`website-inquiries` reaction standard:

```txt
:eyes: `:eyes:` = seen
:white_check_mark: `:white_check_mark:` = handled
:compass: `:compass:` = needs triage in request-triage
:receipt: `:receipt:` = needs quote/scope
```

Use the first shortcode unwrapped so Discord can render it, then repeat it in backticks so the reusable command is visible.

## Cloudflare Pages deployment

This project can run on Cloudflare Pages without downgrading the frontend. The HTML, CSS, JavaScript, images, animations, product pages, shop pages, contact page, confirmation popup, and confetti stay the same. Cloudflare only replaces the always-running Node server with a Pages Function at `/api/contact`.

Recommended Cloudflare setup:

```txt
Framework preset: None
Build command: npm run build:cloudflare
Build output directory: dist-cloudflare
Functions directory: functions
Production branch: main
Custom domain: mrb.ink
```

The build command copies the static website into `dist-cloudflare`. Do not upload `.env`, `data`, `server.js`, or private logs to Cloudflare as public assets.
`wrangler.toml` points Wrangler at the same build output folder.

Set these environment variables in Cloudflare Pages project settings:

```txt
DISCORD_WEBHOOK_URL=<private website-inquiries webhook>
DISCORD_MENTION_ROLE_ID=1496844933431037952
CONTACT_TO_EMAIL=hello@mrb.ink
CONTACT_FROM_EMAIL=MRB <website@mrb.ink>
RESEND_API_KEY=<private Resend API key, when email is enabled>
```

`DISCORD_WEBHOOK_URL` is enough for Discord inquiry delivery. Email receipts need `RESEND_API_KEY` and a verified sender/domain in Resend.

Deployment options:

```bash
npm run build:cloudflare
```

Then deploy through Cloudflare Pages Git integration with the settings above, or from the project root with Wrangler:

```bash
npm run deploy:cloudflare
```

Windows local note: if PowerShell blocks `npm.ps1` or picks the Codex-bundled `node.exe`, run:

```powershell
$env:PATH='C:\Program Files\nodejs;'+$env:PATH
& 'C:\Program Files\nodejs\npm.cmd' run build:cloudflare
```

Use Git integration or Wrangler for the production version because the site needs the `functions/api/contact.js` backend for form submissions. A simple static drag-and-drop upload is fine for previews, but it will not be the complete form system.

## Shop and checkout

The shop grid links to individual product pages. The current product buy buttons are request-access email links. When Lemon Squeezy products are ready, replace those buttons with Lemon Squeezy checkout URLs or overlay buttons.

## Launch checklist

1. Confirm `mrb.ink` email inboxes are active.
2. Confirm the Cal.com booking link opens in a new tab.
3. Add real project screenshots, product previews, and case study results.
4. Replace product request links with Lemon Squeezy, Stripe, or another checkout provider.
5. Configure `DISCORD_WEBHOOK_URL` and/or Resend env vars for form delivery.
6. Review all legal pages with the actual business details before launch.
7. Confirm the X account link points to the correct public profile.
8. Test through the backend URL, not only by opening HTML files directly.
9. Test every page on desktop and mobile.

## Future production stack

When the static version is approved, rebuild it with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel
- Lemon Squeezy or Stripe
