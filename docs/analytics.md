# Analytics

This site uses the inline `gtag` integration in [analytics.js](/C:/Users/robin/Downloads/creator_studio_starter/analytics.js) with consent gating from the existing cookie banner flow. No analytics events are sent until the visitor accepts analytics cookies.

## Configuration

- Measurement ID lives in [analytics-config.js](/C:/Users/robin/Downloads/creator_studio_starter/analytics-config.js).
- `send_page_view: true` is explicit in the GA4 config call.
- `allow_google_signals` and `allow_ad_personalization_signals` stay disabled.
- `ad_storage`, `ad_user_data`, and `ad_personalization` stay denied in the consent payload.
- Default event payloads include a stripped `page_location` and `page_referrer` so query strings do not leak into GA4.
- Non-PII user properties currently set after consent: `consent_state`, `viewport_bucket`.

## Event Inventory

### Core navigation and clicks

- `page_view`
  Purpose: Automatic page-load event from GA4 after consent.
  Params: `page_location`, `page_path`, `page_title`, `page_referrer`.

- `nav_click`
  Purpose: Header, footer, and future mobile-menu navigation usage.
  Params: `nav_item`, `nav_location`.

- `cta_click`
  Purpose: Primary CTA buttons and link-style calls to action.
  Params: `cta_location`, `cta_text`, `link_url`.

- `email_click`
  Purpose: Mailto link usage.
  Params: `link_domain`, `link_location`, `link_text`.

- `booking_click`
  Purpose: Cal.com booking intent.
  Params: `link_location`, `link_text`, `link_url`.

- `file_download`
  Purpose: Download tracking for linked files.
  Params: `file_extension`, `file_name`, `link_location`.

- `outbound_click`
  Purpose: External link tracking.
  Params: `link_domain`, `link_location`, `link_text`, `link_url`.

- `scroll_depth`
  Purpose: Read-depth milestones.
  Params: `percent_scrolled`.

- `section_view`
  Purpose: One-time section visibility tracking as visitors move through page content.
  Params: `section_id`, `section_name`, `section_index`.

### UI interactions

- `mobile_menu_toggle`
  Purpose: Future-safe mobile-menu open/close tracking when a mobile toggle exists.
  Params: `state`.

- `faq_toggle`
  Purpose: FAQ item expand/collapse tracking on `faq.html`.
  Params: `question_text`, `state`.

- `accordion_toggle`
  Purpose: Generic non-FAQ `<details>` / accordion usage.
  Params: `accordion_label`, `accordion_id`, `state`.

- `carousel_advance`
  Purpose: Future-safe carousel progression tracking when carousel controls exist.
  Params: `carousel_id`, `direction`, `slide_index`.

- `video_play`
  Purpose: Video playback starts.
  Params: `video_label`, `video_id`.

- `video_pause`
  Purpose: Video pauses before completion.
  Params: `video_label`, `video_id`.

- `video_complete`
  Purpose: Video finishes.
  Params: `video_label`, `video_id`.

- `video_progress`
  Purpose: Video progress milestones at 10, 25, 50, 75, and 90 percent.
  Params: `video_label`, `video_id`, `progress_percent`.

### Forms

- `form_start`
  Purpose: First focus inside a form after consent.
  Params: `form_name`, `form_id`.

- `form_field_error`
  Purpose: Native validation errors without field values.
  Params: `form_name`, `field_name`, `error_type`.

- `form_submit_attempt`
  Purpose: Submit intent before async resolution.
  Params: `form_name`.

- `generate_lead`
  Purpose: Successful contact-form submission on `contact.html`.
  Params: `form_name`, `lead_type`, `method`.

- `form_submit_success`
  Purpose: Successful non-lead form submission, currently the booking inquiry form.
  Params: `form_name`.

- `form_submit_failure`
  Purpose: Submit failures caused by validation, Turnstile, HTTP failures, or network issues.
  Params: `form_name`, `error_code`.

### Commerce

- `view_item`
  Purpose: Product detail page views and shop listing exposure.
  Params: `currency`, `value`, `item_id`, `item_name`, `item_category`, `price`, `items`.
  Shop-only extras: `item_list_id`, `item_list_name`.

- `select_item`
  Purpose: Product selection from the shop grid and checkout CTA pre-selection.
  Params: `currency`, `value`, `item_id`, `item_name`, `item_category`, `price`, `items`.
  Shop-only extras: `item_list_id`, `item_list_name`.

- `begin_checkout`
  Purpose: Lemon Squeezy checkout intent from product buy buttons.
  Params: `currency`, `value`, `item_id`, `item_name`, `item_category`, `price`, `items`.

- `purchase`
  Purpose: Successful Lemon Squeezy checkout completion.
  Params: `transaction_id`, `value`, `currency`, `items`.

- `payment_info_update`
  Purpose: Lemon Squeezy payment-method overlay success.
  Params: `checkout_provider`.

- `purchase_error`
  Purpose: Lemon Squeezy overlay error events when the provider emits them.
  Params: `error_type`.

Current repo note:

- The analytics hooks are checkout-ready, but the product CTA `href` values in the source HTML are still `mailto:` links. `begin_checkout`, `purchase`, and `payment_info_update` will stay dormant until those buttons point to real `.lemonsqueezy.com` checkout URLs.

### Consent telemetry

- `consent_banner_view`
  Purpose: Banner impression, only recorded when the visitor later accepts analytics.
  Params: default page params only.

- `consent_set`
  Purpose: Accepted or rejected consent choices.
  Params: `consent_state`, `interaction_source`.

- `consent_changed`
  Purpose: Existing consent choice changed from the manage panel.
  Params: `consent_state`, `interaction_source`.

### Reliability and performance

- `js_error`
  Purpose: Global runtime errors and unhandled promise rejections.
  Params: `error_message`, `error_source`, `error_line`, `error_column`.
  Guardrail: max 5 tracked errors per page view.

- `web_vital`
  Purpose: Field performance reporting through `web-vitals@4`.
  Params: `metric_name`, `metric_value`, `metric_rating`, `metric_delta`, `metric_id`.
  Metrics: `LCP`, `INP`, `CLS`, `FCP`, `TTFB`.

## DebugView Verification

1. Set `debug: true` in [analytics-config.js](/C:/Users/robin/Downloads/creator_studio_starter/analytics-config.js), or temporarily open the page with `?debug_ga=1`.
2. Enable the Google Analytics Debugger browser extension.
3. Start the site with `npm start`.
4. Open the local pages through `http://localhost:3000/`.
5. Accept analytics cookies in the banner.
6. Open GA4 DebugView and confirm `page_view` plus the interaction you are testing.
7. For Web Vitals, wait about 10 seconds after load for `LCP` and `CLS`.
8. For commerce, switch product links to Lemon Squeezy test-mode URLs before validating `begin_checkout` and `purchase`.
9. For quick browser-side diagnostics, run `window.mrbAnalytics.getDiagnostics()` in DevTools after accepting cookies.

## Privacy Boundary

- No event sends form field values, email addresses, names, or message bodies.
- `page_location`, `page_referrer`, and tracked `link_url` values have query strings stripped before sending.
- `mailto:` links are logged as `mailto` clicks without the email address.
- JavaScript error messages are truncated and scrubbed for email addresses and full URLs with query strings.
- Product prices are read from HTML `data-item-*` attributes, not hardcoded inside tracking calls.
- Consent telemetry is still consent-gated by design, so first-time rejecters do not generate analytics requests.
