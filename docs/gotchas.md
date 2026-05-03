## Current gotchas

- `DISCORD_WEBHOOK_URL` is the only variable required for the live Discord inquiry path. If neither Discord nor Resend is configured, the deployed serverless handlers return 500.
- Local and deployed inquiry behavior are different. `server.js` logs to `data/inquiries.jsonl` and still returns success without a delivery provider; `functions/api/contact.js` and `api/contact.js` do not.
- Local inquiry testing dirties the repo because `server.js` appends accepted submissions to `data/inquiries.jsonl`.
- Opening `contact.html` or `book.html` directly from disk is not a valid end-to-end test. `script.js` only falls back to `http://localhost:3000/api/contact` for `file:` pages, so the local server still needs to be running.
- `scripts/build-cloudflare.js` is an allowlist build. New source files, new asset folders, or new top-level frontend files will not reach `dist-cloudflare/` unless that script is updated.
- `_headers` marks `/assets/*` as immutable. If you replace an asset in place, also update the `?v=` query string on every HTML reference to avoid stale cached media.
- `script.js` is only included on `index.html`, `contact.html`, `book.html`, and `faq.html`. Reusing `data-reveal`, form hooks, or homepage motion markup on other pages requires adding that script tag first.
