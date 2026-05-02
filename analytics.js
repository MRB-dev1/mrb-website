(() => {
  const config = window.MRB_ANALYTICS_CONFIG || {};
  const measurementId = typeof config.measurementId === "string" ? config.measurementId.trim() : "";
  const consentCookieName = config.consentCookieName || "mrb_cookie_consent";
  const consentStorageKey = config.consentStorageKey || "mrb_cookie_consent";
  const privacyPolicyPath = config.privacyPolicyPath || "privacy.html";
  const consentMaxAgeSeconds = 60 * 60 * 24 * 180;
  const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);
  const scrollThresholds = [25, 50, 75, 90];
  const firedScrollDepths = new Set();

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  window.gtag =
    window.gtag ||
    function gtag() {
      dataLayer.push(arguments);
    };

  const state = {
    consent: "unset",
    banner: null,
    panel: null,
    analyticsCheckbox: null,
    manageButton: null,
    tagRequested: false,
    tagLoaded: false,
  };

  const normalizeText = (value, maxLength = 120) => {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
  };

  const readCookieValue = (name) => {
    const prefix = `${encodeURIComponent(name)}=`;
    return document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(prefix))
      ?.slice(prefix.length);
  };

  const storeConsent = (value) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${encodeURIComponent(consentCookieName)}=${encodeURIComponent(
      value
    )}; Max-Age=${consentMaxAgeSeconds}; Path=/; SameSite=Lax${secure}`;

    try {
      window.localStorage.setItem(consentStorageKey, value);
    } catch (error) {
      void error;
    }
  };

  const readStoredConsent = () => {
    const fromCookie = readCookieValue(consentCookieName);
    if (fromCookie === "accepted" || fromCookie === "rejected") {
      return fromCookie;
    }

    try {
      const fromStorage = window.localStorage.getItem(consentStorageKey);
      if (fromStorage === "accepted" || fromStorage === "rejected") {
        return fromStorage;
      }
    } catch (error) {
      void error;
    }

    return "unset";
  };

  const deleteCookieEverywhere = (name) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    const base = `${encodeURIComponent(name)}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; SameSite=Lax${secure}`;
    document.cookie = base;

    const parts = window.location.hostname.split(".");
    for (let index = 0; index < parts.length - 1; index += 1) {
      const domain = parts.slice(index).join(".");
      document.cookie = `${base}; Domain=${domain}`;
      document.cookie = `${base}; Domain=.${domain}`;
    }
  };

  const clearAnalyticsCookies = () => {
    const cookieNames = document.cookie
      .split(";")
      .map((item) => item.trim().split("=")[0])
      .filter(Boolean);

    const analyticsCookies = new Set(["_ga", "_gid", "_gat"]);
    cookieNames
      .filter((name) => analyticsCookies.has(name) || /^_ga_/i.test(name))
      .forEach((name) => deleteCookieEverywhere(name));
  };

  const buildConsentPayload = (granted) => ({
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });

  const loadGoogleTag = () =>
    new Promise((resolve, reject) => {
      if (!validMeasurementId) {
        resolve(false);
        return;
      }

      if (state.tagLoaded) {
        resolve(true);
        return;
      }

      const existing = document.querySelector("script[data-google-analytics-tag='true']");
      if (existing) {
        if (existing.dataset.loaded === "true") {
          state.tagLoaded = true;
          resolve(true);
          return;
        }

        existing.addEventListener(
          "load",
          () => {
            existing.dataset.loaded = "true";
            state.tagLoaded = true;
            resolve(true);
          },
          { once: true }
        );
        existing.addEventListener("error", () => reject(new Error("Google Analytics failed to load")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset.googleAnalyticsTag = "true";
      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          state.tagLoaded = true;
          resolve(true);
        },
        { once: true }
      );
      script.addEventListener("error", () => reject(new Error("Google Analytics failed to load")), { once: true });
      document.head.append(script);
    });

  const configureGoogleAnalytics = async () => {
    if (!validMeasurementId) {
      return;
    }

    if (state.tagRequested) {
      window.gtag("consent", "update", buildConsentPayload(true));
      return;
    }

    state.tagRequested = true;
    window.gtag("consent", "default", buildConsentPayload(false));
    window.gtag("consent", "update", buildConsentPayload(true));
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: window.location.protocol === "https:" ? "SameSite=Lax;Secure" : "SameSite=Lax",
      debug_mode: Boolean(config.debug),
      transport_type: "beacon",
    });

    try {
      await loadGoogleTag();
    } catch (error) {
      state.tagRequested = false;
      if (config.debug) {
        console.warn(error);
      }
    }
  };

  const track = (eventName, params = {}) => {
    if (state.consent !== "accepted" || !validMeasurementId) {
      return;
    }

    window.gtag("event", eventName, {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
      ...params,
    });
  };

  const getClickContext = (element) => {
    if (element.closest("header")) {
      return "header";
    }
    if (element.closest("footer")) {
      return "footer";
    }
    if (element.closest("form")) {
      return "form";
    }
    if (element.closest("main")) {
      return "main";
    }
    return "page";
  };

  const isDownloadLink = (href, element) => {
    if (element.hasAttribute("download")) {
      return true;
    }

    return /\.(zip|pdf|docx?|xlsx?|pptx?|mp3|mp4|mov|png|jpe?g|webp|svg)$/i.test(href);
  };

  const isBookingLink = (href, label) =>
    /cal\.com/i.test(href) || /book a discovery call|book call|discovery call/i.test(label);

  const getSafeUrl = (href) => {
    try {
      return new URL(href, window.location.href);
    } catch (error) {
      void error;
      return null;
    }
  };

  const trackClick = (event) => {
    const target = event.target.closest("a, button");
    if (!target || target.hasAttribute("data-consent-action")) {
      return;
    }

    const href = target.tagName === "A" ? target.getAttribute("href") || "" : "";
    const label = normalizeText(
      target.dataset.analyticsLabel || target.getAttribute("aria-label") || target.textContent || target.value || ""
    );
    const context = getClickContext(target);

    if (href.startsWith("mailto:")) {
      track("email_click", {
        link_domain: "mailto",
        link_location: context,
        link_text: label,
      });
      return;
    }

    if (href && isBookingLink(href, label)) {
      track("booking_click", {
        link_location: context,
        link_text: label,
        link_url: href,
      });
      return;
    }

    if (href && isDownloadLink(href, target)) {
      track("file_download", {
        file_extension: href.split(".").pop()?.toLowerCase() || "",
        file_name: href.split("/").pop() || href,
        link_location: context,
      });
      return;
    }

    if (href) {
      const url = getSafeUrl(href);
      if (url && url.origin !== window.location.origin) {
        track("outbound_click", {
          link_domain: url.hostname,
          link_location: context,
          link_text: label,
          link_url: url.href,
        });
        return;
      }
    }

    if (
      target.matches(".button, .nav-cta, .floating-book, .contact-scroll-button") ||
      target.closest(".button, .nav-cta, .floating-book, .contact-scroll-button")
    ) {
      track("cta_click", {
        cta_location: context,
        cta_text: label,
        link_url: href,
      });
    }
  };

  const emitScrollDepth = () => {
    if (state.consent !== "accepted" || !validMeasurementId) {
      return;
    }

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
      return;
    }

    const depth = Math.round((window.scrollY / scrollable) * 100);
    scrollThresholds.forEach((threshold) => {
      if (depth >= threshold && !firedScrollDepths.has(threshold)) {
        firedScrollDepths.add(threshold);
        track("scroll_depth", {
          percent_scrolled: threshold,
        });
      }
    });
  };

  const setBannerOpen = (open) => {
    if (!state.banner) {
      return;
    }

    state.banner.hidden = !open;
    state.banner.classList.toggle("is-open", open);
  };

  const syncManageButtonVisibility = () => {
    if (!state.manageButton) {
      return;
    }

    state.manageButton.hidden = state.consent === "unset";
  };

  const syncPreferenceControls = () => {
    if (!state.analyticsCheckbox) {
      return;
    }

    state.analyticsCheckbox.checked = state.consent === "accepted";
  };

  const setPanelOpen = (open) => {
    if (!state.panel) {
      return;
    }

    if (open) {
      setBannerOpen(false);
    }

    state.panel.hidden = !open;
    state.panel.classList.toggle("is-open", open);
    document.body.classList.toggle("has-cookie-panel", open);
    syncPreferenceControls();
  };

  const setConsent = async (value) => {
    state.consent = value;
    storeConsent(value);

    if (value === "accepted") {
      await configureGoogleAnalytics();
      emitScrollDepth();
    } else {
      if (state.tagRequested) {
        window.gtag("consent", "update", buildConsentPayload(false));
      }
      clearAnalyticsCookies();
    }

    setBannerOpen(false);
    setPanelOpen(false);
    syncPreferenceControls();
    syncManageButtonVisibility();
  };

  const createManageButton = () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cookie-settings-button motion-safe-transition";
    button.textContent = "Cookie settings";
    button.hidden = true;
    button.addEventListener("click", () => {
      setPanelOpen(true);
    });
    document.body.append(button);
    state.manageButton = button;
  };

  const createBanner = () => {
    const banner = document.createElement("aside");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-labelledby", "cookie-banner-title");
    banner.setAttribute("aria-describedby", "cookie-banner-copy");
    banner.hidden = true;

    banner.innerHTML = `
      <div class="cookie-banner__copy">
        <p class="eyebrow">Privacy choices</p>
        <h2 id="cookie-banner-title">Optional analytics</h2>
        <p id="cookie-banner-copy">
          MRB uses Google Analytics only after you allow analytics cookies. You can change this choice any time.
        </p>
      </div>
      <div class="cookie-banner__actions">
        <a class="cookie-banner__link" href="${privacyPolicyPath}">Read the privacy policy</a>
        <button class="button secondary cookie-banner__button" type="button" data-consent-action="customize">More options</button>
        <button class="button primary cookie-banner__button" type="button" data-consent-action="accept">Accept all</button>
      </div>
    `;

    banner.querySelector("[data-consent-action='accept']")?.addEventListener("click", () => {
      setConsent("accepted");
    });
    banner.querySelector("[data-consent-action='customize']")?.addEventListener("click", () => {
      setPanelOpen(true);
    });

    document.body.append(banner);
    state.banner = banner;
  };

  const createPreferencesPanel = () => {
    const panel = document.createElement("aside");
    panel.className = "cookie-panel";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="cookie-panel__backdrop" data-consent-action="close-panel"></div>
      <div class="cookie-panel__dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-panel-title">
        <button class="cookie-panel__close" type="button" aria-label="Close cookie settings" data-consent-action="close-panel">x</button>
        <p class="eyebrow">Cookie settings</p>
        <h2 id="cookie-panel-title">Choose what MRB can use.</h2>
        <p class="cookie-panel__intro">
          Required cookies stay on so the site works and stays secure. Analytics is optional.
        </p>
        <div class="cookie-panel__groups">
          <label class="cookie-option cookie-option--locked">
            <span class="cookie-option__copy">
              <strong>Required</strong>
              <span>Security, essential site behavior, and your saved consent choice.</span>
            </span>
            <span class="cookie-toggle">
              <input type="checkbox" checked disabled />
              <span aria-hidden="true"></span>
            </span>
          </label>
          <label class="cookie-option">
            <span class="cookie-option__copy">
              <strong>Analytics</strong>
              <span>Google Analytics to measure visits, clicks, and form conversions.</span>
            </span>
            <span class="cookie-toggle">
              <input type="checkbox" data-consent-checkbox="analytics" />
              <span aria-hidden="true"></span>
            </span>
          </label>
        </div>
        <div class="cookie-panel__actions">
          <a class="cookie-banner__link" href="${privacyPolicyPath}">Read the privacy policy</a>
          <button class="button secondary cookie-panel__button" type="button" data-consent-action="save-preferences">Save choices</button>
          <button class="button primary cookie-panel__button" type="button" data-consent-action="accept-all">Accept all</button>
        </div>
      </div>
    `;

    panel.querySelectorAll("[data-consent-action='close-panel']").forEach((element) => {
      element.addEventListener("click", () => {
        setPanelOpen(false);
        if (state.consent === "unset") {
          setBannerOpen(true);
        }
      });
    });

    panel.querySelector("[data-consent-action='accept-all']")?.addEventListener("click", () => {
      setConsent("accepted");
    });

    panel.querySelector("[data-consent-action='save-preferences']")?.addEventListener("click", () => {
      const shouldEnableAnalytics = Boolean(state.analyticsCheckbox?.checked);
      setConsent(shouldEnableAnalytics ? "accepted" : "rejected");
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
        if (state.consent === "unset") {
          setBannerOpen(true);
        }
      }
    });

    document.body.append(panel);
    state.panel = panel;
    state.analyticsCheckbox = panel.querySelector("[data-consent-checkbox='analytics']");
  };

  const initConsentUi = () => {
    createBanner();
    createPreferencesPanel();
    createManageButton();
    syncManageButtonVisibility();
    if (state.consent === "unset") {
      setBannerOpen(true);
    }
  };

  const init = async () => {
    state.consent = readStoredConsent();

    if (validMeasurementId) {
      initConsentUi();
    }

    if (state.consent === "accepted") {
      await configureGoogleAnalytics();
      emitScrollDepth();
    } else if (state.consent === "rejected") {
      clearAnalyticsCookies();
    }

    document.addEventListener("click", trackClick);
    window.addEventListener("scroll", emitScrollDepth, { passive: true });
    window.addEventListener("resize", emitScrollDepth);
  };

  window.mrbAnalytics = {
    isConfigured: () => validMeasurementId,
    getConsentState: () => state.consent,
    openConsentDialog: () => setPanelOpen(true),
    track,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
    });
  } else {
    init();
  }
})();
