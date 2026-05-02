# Cookie Verification Guide

Use this checklist when verifying the consent flow and consent-related analytics.

## Expected behavior

- Before consent is accepted, there should be no requests to `googletagmanager.com`, `google-analytics.com`, or `analytics.google.com`.
- If the visitor rejects analytics immediately, no consent telemetry is sent. This is intentional.
- If the visitor accepts analytics, GA4 should initialize immediately and `page_view` should appear in DebugView.
- If the visitor later changes an existing accepted choice from the manage panel, `consent_changed` should fire before analytics storage is revoked.
- Rejecting analytics should clear `_ga*` cookies through `clearAnalyticsCookies()`.

## Consent telemetry events

- `consent_banner_view`
  Fires only after the visitor accepts analytics on a page where the banner was shown.

- `consent_set`
  Params: `consent_state`, `interaction_source`.
  `interaction_source` values currently used: `banner`, `panel`, `manage_button`.

- `consent_changed`
  Params: `consent_state`, `interaction_source`.
  Fires only when an existing consent choice is changed from the preferences panel.

## Manual verification steps

1. Set `debug: true` in [analytics-config.js](/C:/Users/robin/Downloads/creator_studio_starter/analytics-config.js).
2. Start the site with `npm start`.
3. Open a page in a fresh browser session and confirm the banner appears.
4. With DevTools open, verify there are no GA requests before clicking any consent action.
5. Accept analytics and confirm:
   `page_view` appears in DebugView.
   `consent_banner_view` appears once.
   `consent_set` appears with `consent_state=accepted`.
6. Re-open cookie settings from the manage button, disable analytics, save, and confirm:
   `consent_changed` appears with `consent_state=rejected`.
   `_ga*` cookies are removed.
   New GA requests stop after consent is revoked.
7. Retry from a fresh session and reject analytics first. Confirm:
   no GA requests are sent.
   no `_ga*` cookies remain after rejection.
