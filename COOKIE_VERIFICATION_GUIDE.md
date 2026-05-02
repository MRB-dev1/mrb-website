# Cookie Verification Guide

This site now uses a consent-aware Google Analytics 4 setup.

## 1. Configure the Measurement ID

Edit `analytics-config.js` and set:

```js
measurementId: "G-XXXXXXXXXX"
```

Replace the placeholder with the real GA4 Measurement ID from your Google Analytics property.

## 2. Expected behavior

- Before a visitor makes a choice, Google Analytics should not load.
- After `Reject analytics`, Google Analytics should still not load and no GA cookies should exist.
- After `Accept analytics`, the Google tag should load and GA cookies can be set.
- The site stores the consent choice in the first-party cookie `mrb_cookie_consent`.

## 3. Browser checks

Use a private/incognito window so you start clean.

### Application or Storage tab

Check cookies for your site.

- Before consent: no `_ga`, `_ga_*`, `_gid`, or `_gat` cookies.
- After reject: still no `_ga`, `_ga_*`, `_gid`, or `_gat` cookies.
- After accept: expect `mrb_cookie_consent=accepted` plus GA cookies such as `_ga`.

### Network tab

Filter for these domains:

- `googletagmanager.com`
- `google-analytics.com`

Expected results:

- Before consent: no requests to either domain.
- After reject: no requests to either domain.
- After accept: request to `gtag/js?id=...` and analytics collection requests like `g/collect`.

## 4. Revoke consent test

Use the `Cookie settings` button on the site.

1. Accept analytics.
2. Confirm GA requests and cookies appear.
3. Reopen Cookie settings.
4. Choose `Reject analytics`.
5. Refresh the page.
6. Confirm GA cookies are cleared and no new analytics requests fire.

## 5. Event checks

After accepting analytics, verify these interactions in GA DebugView or Tag Assistant:

- Page views on each HTML page.
- `cta_click`
- `booking_click`
- `email_click`
- `outbound_click`
- `file_download`
- `scroll_depth`
- `generate_lead`

Important: the contact form tracking intentionally avoids sending names, emails, or message content to Google Analytics.

## 6. Helpful tools

- Google Tag Assistant: [tagassistant.google.com](https://tagassistant.google.com/)
- Google consent mode guide: [developers.google.com/tag-platform/security/guides/consent](https://developers.google.com/tag-platform/security/guides/consent)
- Google consent mode overview: [developers.google.com/tag-platform/security/concepts/consent-mode](https://developers.google.com/tag-platform/security/concepts/consent-mode)
