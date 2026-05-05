(() => {
  const config = window.MRB_ANALYTICS_CONFIG || {};
  const debugEnabled = Boolean(config.debug) || new URLSearchParams(window.location.search).get("debug_ga") === "1";
  const measurementId = typeof config.measurementId === "string" ? config.measurementId.trim() : "";
  const consentCookieName = config.consentCookieName || "mrb_cookie_consent";
  const consentStorageKey = config.consentStorageKey || "mrb_cookie_consent";
  const privacyPolicyPath = config.privacyPolicyPath || "privacy.html";
  const consentMaxAgeSeconds = 60 * 60 * 24 * 180;
  const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);
  const scrollThresholds = [25, 50, 75, 90];
  const videoProgressThresholds = [10, 25, 50, 75, 90];
  const maxTrackedErrorsPerPage = 5;
  const webVitalsScriptUrl = "https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js";
  const lemonScriptUrl = "https://app.lemonsqueezy.com/js/lemon.js";
  const firedScrollDepths = new Set();
  const viewedItems = new Set();
  const viewedSections = new Set();
  const observedSections = new WeakSet();
  const startedForms = new WeakSet();
  const boundDetails = new WeakSet();
  const boundVideos = new WeakSet();
  const videoStates = new WeakMap();

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
    tagRequested: false,
    tagLoaded: false,
    webVitalsRequested: false,
    webVitalsLoaded: false,
    lemonRequested: false,
    lemonLoaded: false,
    lemonSetupComplete: false,
    bannerSeenThisPage: false,
    panelSource: "panel",
    jsErrorsTracked: 0,
    pendingCheckoutItem: null,
    sectionObserver: null,
    mutationObserver: null,
    bindingFrame: null,
  };

  const normalizeText = (value, maxLength = 120) => {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
  };

  const roundMetricValue = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    if (Math.abs(numericValue) >= 10) {
      return Math.round(numericValue);
    }

    return Number(numericValue.toFixed(4));
  };

  const sanitizeUrl = (value) => {
    if (!value) {
      return "";
    }

    const rawValue = String(value).trim();
    if (!rawValue) {
      return "";
    }

    if (/^mailto:/i.test(rawValue)) {
      return "mailto";
    }

    if (/^tel:/i.test(rawValue)) {
      return "tel";
    }

    try {
      const url = new URL(rawValue, window.location.href);
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch (error) {
      void error;
      return rawValue.split("#")[0].split("?")[0];
    }
  };

  const sanitizeErrorText = (value, maxLength = 150) =>
    normalizeText(
      String(value || "")
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
        .replace(/https?:\/\/[^\s)]+/gi, (match) => sanitizeUrl(match)),
      maxLength
    );

  const sanitizeParams = (params) => {
    const sanitizeValue = (key, value) => {
      if (value === null || value === undefined) {
        return value;
      }

      if (Array.isArray(value)) {
        return value.map((entry) => sanitizeValue(key, entry));
      }

      if (typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value)
            .map(([entryKey, entryValue]) => [entryKey, sanitizeValue(entryKey, entryValue)])
            .filter(([, entryValue]) => entryValue !== undefined)
        );
      }

      if (typeof value === "string") {
        if (/^(page_location|page_referrer|link_url)$/i.test(key)) {
          return sanitizeUrl(value);
        }

        if (key === "error_message") {
          return sanitizeErrorText(value);
        }

        return normalizeText(value, 200);
      }

      return value;
    };

    return Object.fromEntries(
      Object.entries(params)
        .map(([key, value]) => [key, sanitizeValue(key, value)])
        .filter(([, value]) => value !== undefined)
    );
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

  const getPageLocation = () => sanitizeUrl(window.location.href);
  const getPageReferrer = () => sanitizeUrl(document.referrer || "");
  const getCurrentPath = () => window.location.pathname.replace(/^\//, "") || "index.html";
  const isFaqPage = () => /(^|\/)faq\.html$/i.test(window.location.pathname);
  const isShopPage = () => /(^|\/)shop\.html$/i.test(window.location.pathname);
  const isProductPage = () => /(^|\/)product-[^.]+\.html$/i.test(window.location.pathname);

  const getViewportBucket = () => {
    if (window.innerWidth < 768) {
      return "mobile";
    }

    if (window.innerWidth < 1024) {
      return "tablet";
    }

    return "desktop";
  };

  const setUserProperty = (name, value) => {
    const safeName = String(name || "").trim().replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 24);
    if (!safeName || state.consent !== "accepted" || !validMeasurementId) {
      return;
    }

    window.gtag("set", "user_properties", {
      [safeName]: normalizeText(value, 36),
    });
  };

  const syncUserProperties = () => {
    if (state.consent !== "accepted") {
      return;
    }

    setUserProperty("consent_state", state.consent);
    setUserProperty("viewport_bucket", getViewportBucket());
  };

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

  const loadWebVitals = () =>
    new Promise((resolve, reject) => {
      if (state.webVitalsLoaded && window.webVitals) {
        resolve(window.webVitals);
        return;
      }

      const existing = document.querySelector("script[data-web-vitals-script='true']");
      if (existing) {
        if (window.webVitals) {
          state.webVitalsLoaded = true;
          resolve(window.webVitals);
          return;
        }

        existing.addEventListener(
          "load",
          () => {
            if (window.webVitals) {
              state.webVitalsLoaded = true;
              resolve(window.webVitals);
              return;
            }

            reject(new Error("web-vitals did not initialize"));
          },
          { once: true }
        );
        existing.addEventListener("error", () => reject(new Error("web-vitals failed to load")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = webVitalsScriptUrl;
      script.dataset.webVitalsScript = "true";
      script.addEventListener(
        "load",
        () => {
          if (window.webVitals) {
            state.webVitalsLoaded = true;
            resolve(window.webVitals);
            return;
          }

          reject(new Error("web-vitals did not initialize"));
        },
        { once: true }
      );
      script.addEventListener("error", () => reject(new Error("web-vitals failed to load")), { once: true });
      document.head.append(script);
    });

  const loadLemonSqueezy = () =>
    new Promise((resolve, reject) => {
      if (state.lemonLoaded && window.LemonSqueezy) {
        resolve(window.LemonSqueezy);
        return;
      }

      const existing = document.querySelector("script[data-lemon-squeezy-script='true']");
      if (existing) {
        if (window.LemonSqueezy) {
          state.lemonLoaded = true;
          resolve(window.LemonSqueezy);
          return;
        }

        existing.addEventListener(
          "load",
          () => {
            if (window.LemonSqueezy) {
              state.lemonLoaded = true;
              resolve(window.LemonSqueezy);
              return;
            }

            reject(new Error("Lemon.js did not initialize"));
          },
          { once: true }
        );
        existing.addEventListener("error", () => reject(new Error("Lemon.js failed to load")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.defer = true;
      script.src = lemonScriptUrl;
      script.dataset.lemonSqueezyScript = "true";
      script.addEventListener(
        "load",
        () => {
          if (window.LemonSqueezy) {
            state.lemonLoaded = true;
            resolve(window.LemonSqueezy);
            return;
          }

          reject(new Error("Lemon.js did not initialize"));
        },
        { once: true }
      );
      script.addEventListener("error", () => reject(new Error("Lemon.js failed to load")), { once: true });
      document.head.append(script);
    });

  const buildCommercePayload = (itemData, extra = {}) => {
    if (!itemData) {
      return extra;
    }

    return {
      currency: itemData.currency,
      value: itemData.price,
      item_id: itemData.item_id,
      item_name: itemData.item_name,
      item_category: itemData.item_category,
      price: itemData.price,
      items: [
        {
          item_id: itemData.item_id,
          item_name: itemData.item_name,
          item_category: itemData.item_category,
          price: itemData.price,
          quantity: 1,
        },
      ],
      ...extra,
    };
  };

  const track = (eventName, params = {}) => {
    if (!eventName || state.consent !== "accepted" || !validMeasurementId) {
      return;
    }

    const payload = sanitizeParams({
      page_location: getPageLocation(),
      page_path: window.location.pathname,
      page_referrer: getPageReferrer(),
      page_title: document.title,
      ...params,
    });

    window.gtag("event", eventName, payload);
  };

  const configureGoogleAnalytics = async () => {
    if (!validMeasurementId) {
      return;
    }

    if (state.tagRequested) {
      window.gtag("consent", "update", buildConsentPayload(true));
      syncUserProperties();
      return;
    }

    state.tagRequested = true;

    try {
      await loadGoogleTag();
      window.gtag("consent", "default", buildConsentPayload(false));
      window.gtag("consent", "update", buildConsentPayload(true));
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_flags: window.location.protocol === "https:" ? "SameSite=Lax;Secure" : "SameSite=Lax",
        debug_mode: debugEnabled,
        send_page_view: true,
        transport_type: "beacon",
      });

      syncUserProperties();

      if (debugEnabled) {
        console.info("[MRB analytics] GA4 configured", {
          consent: state.consent,
          measurementId,
        });
      }
    } catch (error) {
      state.tagRequested = false;
      if (debugEnabled) {
        console.warn(error);
      }
    }
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

  const getNavLocation = (element) => {
    if (element.closest("[data-mobile-menu], .mobile-menu, .mobile-nav")) {
      return "mobile_menu";
    }

    if (element.closest("footer") || element.closest(".footer-grid") || element.closest(".legal-nav")) {
      return "footer";
    }

    if (element.closest("header") && element.closest(".nav")) {
      return "header";
    }

    return "";
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

  const getProductData = (element) => {
    const candidates = [];
    if (element instanceof Element) {
      candidates.push(element.closest("[data-item-id]"));
    }
    if (document.body?.hasAttribute("data-item-id")) {
      candidates.push(document.body);
    }

    const source = candidates.find((candidate) => candidate && candidate.hasAttribute("data-item-id"));
    if (!source) {
      return null;
    }

    const price = Number.parseFloat(source.dataset.itemPrice || "");
    return {
      item_id: normalizeText(source.dataset.itemId || "", 80),
      item_name: normalizeText(source.dataset.itemName || "", 120),
      item_category: normalizeText(source.dataset.itemCategory || "", 80),
      price: Number.isFinite(price) ? price : 0,
      currency: normalizeText(source.dataset.itemCurrency || "USD", 12),
    };
  };

  const isLemonCheckoutTarget = (target) => {
    const href = target.tagName === "A" ? target.getAttribute("href") || "" : target.dataset.checkoutUrl || "";
    const url = getSafeUrl(href);
    return Boolean(url && /\.lemonsqueezy\.com$/i.test(url.hostname));
  };

  const trackProductSelection = (target) => {
    if (!(target instanceof Element)) {
      return;
    }

    const itemData = getProductData(target);
    if (!itemData) {
      return;
    }

    const commerceAction = target.dataset.commerceAction || target.closest("[data-commerce-action]")?.dataset.commerceAction;

    if (commerceAction === "select_item") {
      track(
        "select_item",
        buildCommercePayload(itemData, {
          item_list_id: "shop",
          item_list_name: "shop",
        })
      );
      return;
    }

    if (commerceAction === "begin_checkout" && isLemonCheckoutTarget(target)) {
      state.pendingCheckoutItem = itemData;
      track("select_item", buildCommercePayload(itemData));
      track("begin_checkout", buildCommercePayload(itemData));
    }
  };

  const trackNavigationClick = (target, label) => {
    if (!target.closest("nav")) {
      return;
    }

    const navLocation = getNavLocation(target);
    if (!navLocation) {
      return;
    }

    track("nav_click", {
      nav_item: label || "Navigation link",
      nav_location: navLocation,
    });
  };

  const trackCarouselAdvance = (target) => {
    const control =
      target.closest("[data-carousel-direction]") ||
      target.closest("[data-carousel-dot]") ||
      target.closest(".carousel-button--next") ||
      target.closest(".carousel-button--prev");

    if (!control) {
      return;
    }

    const carousel = control.closest("[data-carousel-id], .carousel");
    const direction =
      control.dataset.carouselDirection ||
      (control.hasAttribute("data-carousel-dot") ? "dot" : control.classList.contains("carousel-button--prev") ? "prev" : "next");
    const slideIndex = Number.parseInt(control.dataset.slideIndex || control.getAttribute("data-slide-index") || "", 10);

    track("carousel_advance", {
      carousel_id: normalizeText(carousel?.dataset.carouselId || carousel?.id || "carousel", 80),
      direction: normalizeText(direction, 16),
      slide_index: Number.isFinite(slideIndex) ? slideIndex : undefined,
    });
  };

  const trackMobileMenuToggle = (target) => {
    const toggle = target.closest("[data-mobile-menu-toggle], .mobile-menu-toggle, .nav-toggle, .menu-toggle");
    if (!toggle) {
      return;
    }

    window.requestAnimationFrame(() => {
      const expanded = toggle.getAttribute("aria-expanded");
      const isOpen = expanded === "true";

      track("mobile_menu_toggle", {
        state: isOpen ? "open" : "closed",
      });
    });
  };

  const trackClick = (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const target = event.target.closest("a, button");
    if (!target || target.hasAttribute("data-consent-action")) {
      return;
    }

    const href = target.tagName === "A" ? target.getAttribute("href") || "" : "";
    const label = normalizeText(
      target.dataset.analyticsLabel || target.getAttribute("aria-label") || target.textContent || target.value || ""
    );
    const context = getClickContext(target);

    trackNavigationClick(target, label);
    trackProductSelection(target);
    trackCarouselAdvance(target);
    trackMobileMenuToggle(target);

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

    if (open) {
      state.bannerSeenThisPage = true;
    }

    state.banner.hidden = !open;
    state.banner.classList.toggle("is-open", open);
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

  const trackConsentState = (value, interactionSource, previousConsent) => {
    if (state.bannerSeenThisPage) {
      track("consent_banner_view", {});
      state.bannerSeenThisPage = false;
    }

    track("consent_set", {
      consent_state: value,
      interaction_source: interactionSource,
    });

    if (previousConsent !== "unset" && previousConsent !== value) {
      track("consent_changed", {
        consent_state: value,
        interaction_source: interactionSource,
      });
    }
  };

  const trackVisibleCommerceItems = () => {
    if (state.consent !== "accepted") {
      return;
    }

    if (isProductPage()) {
      const itemData = getProductData(document.body);
      const key = itemData ? `${getCurrentPath()}::${itemData.item_id}` : "";
      if (itemData && key && !viewedItems.has(key)) {
        viewedItems.add(key);
        track("view_item", buildCommercePayload(itemData));
      }
    }

    if (isShopPage()) {
      document.querySelectorAll("[data-commerce-view='true'][data-item-id]").forEach((element) => {
        const itemData = getProductData(element);
        const key = itemData ? `${getCurrentPath()}::${itemData.item_id}` : "";
        if (!itemData || !key || viewedItems.has(key)) {
          return;
        }

        viewedItems.add(key);
        track(
          "view_item",
          buildCommercePayload(itemData, {
            item_list_id: "shop",
            item_list_name: "shop",
          })
        );
      });
    }
  };

  const getTrackableSections = () =>
    Array.from(document.querySelectorAll("main section")).filter((section) => !section.closest("aside"));

  const getSectionIndex = (section) => getTrackableSections().indexOf(section);

  const getSectionName = (section, index) =>
    normalizeText(
      section.dataset.analyticsLabel ||
        section.getAttribute("aria-label") ||
        section.querySelector("h1, h2, h3, .eyebrow")?.textContent ||
        section.id ||
        `Section ${index + 1}`,
      80
    );

  const trackSectionView = (section) => {
    if (state.consent !== "accepted") {
      return;
    }

    const index = getSectionIndex(section);
    if (index < 0) {
      return;
    }

    const sectionId = normalizeText(section.id || "", 80);
    const key = `${getCurrentPath()}::${sectionId || `section-${index + 1}`}`;
    if (viewedSections.has(key)) {
      return;
    }

    viewedSections.add(key);
    track("section_view", {
      section_id: sectionId,
      section_name: getSectionName(section, index),
      section_index: index + 1,
    });
  };

  const trackVisibleSectionsNow = () => {
    if (state.consent !== "accepted") {
      return;
    }

    getTrackableSections().forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const sectionHeight = Math.max(rect.height, 1);
      if (visibleHeight / sectionHeight >= 0.35) {
        trackSectionView(section);
      }
    });
  };

  const initSectionTracking = () => {
    if ("IntersectionObserver" in window && !state.sectionObserver) {
      state.sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || state.consent !== "accepted") {
              return;
            }

            trackSectionView(entry.target);
            state.sectionObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px -12% 0px" }
      );
    }

    if (state.sectionObserver) {
      getTrackableSections().forEach((section) => {
        if (!observedSections.has(section)) {
          observedSections.add(section);
          state.sectionObserver.observe(section);
        }
      });
    }

    trackVisibleSectionsNow();
  };

  const reportWebVital = (metric) => {
    track("web_vital", {
      metric_name: metric.name,
      metric_value: roundMetricValue(metric.value),
      metric_rating: metric.rating,
      metric_delta: roundMetricValue(metric.delta),
      metric_id: metric.id,
    });
  };

  const initWebVitals = async () => {
    if (state.consent !== "accepted" || state.webVitalsRequested || !validMeasurementId) {
      return;
    }

    state.webVitalsRequested = true;

    try {
      const webVitals = await loadWebVitals();
      if (!webVitals) {
        return;
      }

      webVitals.onCLS(reportWebVital);
      webVitals.onFCP(reportWebVital);
      webVitals.onINP(reportWebVital);
      webVitals.onLCP(reportWebVital);
      webVitals.onTTFB(reportWebVital);
    } catch (error) {
      state.webVitalsRequested = false;
      if (debugEnabled) {
        console.warn(error);
      }
    }
  };

  const extractErrorSource = (value) => {
    const sanitized = sanitizeUrl(value);
    if (!sanitized) {
      return "";
    }

    try {
      const url = new URL(sanitized, window.location.href);
      return normalizeText(url.pathname.split("/").pop() || "", 80);
    } catch (error) {
      void error;
      const parts = sanitized.split(/[\\/]/);
      return normalizeText(parts[parts.length - 1] || "", 80);
    }
  };

  const trackJavascriptError = (payload) => {
    if (state.consent !== "accepted" || state.jsErrorsTracked >= maxTrackedErrorsPerPage) {
      return;
    }

    state.jsErrorsTracked += 1;
    track("js_error", payload);
  };

  const initErrorTracking = () => {
    window.addEventListener("error", (event) => {
      trackJavascriptError({
        error_message: event.message || event.error?.message || "Unknown error",
        error_source: extractErrorSource(event.filename || event.error?.fileName || ""),
        error_line: Number.isFinite(event.lineno) ? event.lineno : undefined,
        error_column: Number.isFinite(event.colno) ? event.colno : undefined,
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason?.message || reason?.stack || "Unhandled promise rejection";

      trackJavascriptError({
        error_message: message,
        error_source: extractErrorSource(reason?.fileName || ""),
      });
    });
  };

  const describeForm = (form) => ({
    form_name: normalizeText(
      form.dataset.formName || form.getAttribute("aria-label") || form.getAttribute("name") || form.id || "form",
      80
    ),
    form_id: normalizeText(form.id || form.getAttribute("name") || "", 80),
  });

  const getFieldName = (field) =>
    normalizeText(
      field.getAttribute("name") ||
        field.id ||
        field.getAttribute("aria-label") ||
        field.closest(".field")?.querySelector("label")?.textContent ||
        "field",
      80
    );

  const getValidationErrorType = (field) => {
    const validity = field.validity;
    if (!validity) {
      return "validation";
    }

    if (validity.valueMissing) {
      return "required";
    }
    if (validity.typeMismatch) {
      return "type_mismatch";
    }
    if (validity.patternMismatch) {
      return "pattern_mismatch";
    }
    if (validity.tooShort) {
      return "too_short";
    }
    if (validity.tooLong) {
      return "too_long";
    }
    if (validity.rangeUnderflow) {
      return "range_underflow";
    }
    if (validity.rangeOverflow) {
      return "range_overflow";
    }
    if (validity.stepMismatch) {
      return "step_mismatch";
    }
    if (validity.badInput) {
      return "bad_input";
    }
    if (validity.customError) {
      return "custom_error";
    }

    return "validation";
  };

  const initFormTracking = () => {
    document.addEventListener(
      "focusin",
      (event) => {
        const field = event.target;
        if (!(field instanceof Element)) {
          return;
        }

        const form = field.closest("form");
        if (!form || startedForms.has(form) || state.consent !== "accepted") {
          return;
        }

        startedForms.add(form);
        track("form_start", describeForm(form));
      },
      true
    );

    document.addEventListener(
      "invalid",
      (event) => {
        const field = event.target;
        if (!(field instanceof HTMLElement) || !field.form) {
          return;
        }

        const meta = describeForm(field.form);
        track("form_field_error", {
          form_name: meta.form_name,
          field_name: getFieldName(field),
          error_type: getValidationErrorType(field),
        });
      },
      true
    );
  };

  const getVideoLabel = (video) =>
    normalizeText(
      video.dataset.analyticsLabel ||
        video.getAttribute("aria-label") ||
        video.closest("figure")?.querySelector("figcaption")?.textContent ||
        video.currentSrc.split("/").pop() ||
        video.id ||
        "video",
      120
    );

  const bindVideoTracking = (video) => {
    if (boundVideos.has(video)) {
      return;
    }

    boundVideos.add(video);
    videoStates.set(video, {
      progressEvents: new Set(),
      completed: false,
      isPlaying: false,
    });

    const buildVideoPayload = (extra = {}) => ({
      video_label: getVideoLabel(video),
      video_id: normalizeText(video.id || "", 80),
      ...extra,
    });

    video.addEventListener("play", () => {
      const videoState = videoStates.get(video);
      if (videoState && !videoState.isPlaying) {
        videoState.isPlaying = true;
        track("video_play", buildVideoPayload());
      }
    });

    video.addEventListener("pause", () => {
      const videoState = videoStates.get(video);
      if (videoState) {
        videoState.isPlaying = false;
      }
      if (!video.ended) {
        track("video_pause", buildVideoPayload());
      }
    });

    video.addEventListener("ended", () => {
      const videoState = videoStates.get(video);
      if (!videoState || videoState.completed) {
        return;
      }

      videoState.isPlaying = false;
      videoState.completed = true;
      track("video_complete", buildVideoPayload());
    });

    video.addEventListener("timeupdate", () => {
      const duration = Number(video.duration);
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const percent = Math.floor((video.currentTime / duration) * 100);
      const videoState = videoStates.get(video);
      if (!videoState) {
        return;
      }

      videoProgressThresholds.forEach((threshold) => {
        if (percent >= threshold && !videoState.progressEvents.has(threshold)) {
          videoState.progressEvents.add(threshold);
          track(
            "video_progress",
            buildVideoPayload({
              progress_percent: threshold,
            })
          );
        }
      });
    });

    if (!video.paused && !video.ended) {
      const videoState = videoStates.get(video);
      if (videoState && !videoState.isPlaying) {
        videoState.isPlaying = true;
        track("video_play", buildVideoPayload());
      }
    }
  };

  const bindDetailsTracking = (details) => {
    if (boundDetails.has(details)) {
      return;
    }

    boundDetails.add(details);
    details.addEventListener("toggle", () => {
      const summary = normalizeText(details.querySelector("summary")?.textContent || details.dataset.analyticsLabel || "", 80);
      const toggleState = details.open ? "open" : "closed";

      if (isFaqPage()) {
        track("faq_toggle", {
          question_text: summary,
          state: toggleState,
        });
        return;
      }

      track("accordion_toggle", {
        accordion_label: summary || "Accordion",
        accordion_id: normalizeText(details.id || "", 80),
        state: toggleState,
      });
    });
  };

  const handleLemonEvent = (event) => {
    const eventName = event?.event || "";
    const orderData = event?.data || {};
    const orderAttributes = orderData.attributes || {};

    if (eventName === "Checkout.Success") {
      const itemData = state.pendingCheckoutItem || getProductData(document.body);
      const totalInCents = Number(orderData.total ?? orderAttributes.total);
      const itemPriceInCents = Number(
        orderData.first_order_item?.price ??
          orderAttributes.first_order_item?.price ??
          (itemData ? Math.round(itemData.price * 100) : 0)
      );
      const quantity = Number(orderData.first_order_item?.quantity ?? orderAttributes.first_order_item?.quantity ?? 1) || 1;

      track("purchase", {
        transaction_id: normalizeText(orderData.identifier || orderAttributes.identifier || "", 80),
        value: Number.isFinite(totalInCents) ? totalInCents / 100 : itemData?.price || 0,
        currency: normalizeText(orderData.currency || orderAttributes.currency || itemData?.currency || "USD", 12),
        items: [
          {
            item_id: itemData?.item_id || "",
            item_name: itemData?.item_name || "",
            price: Number.isFinite(itemPriceInCents) ? itemPriceInCents / 100 : itemData?.price || 0,
            quantity,
          },
        ],
      });

      state.pendingCheckoutItem = null;
      return;
    }

    if (eventName === "PaymentMethodUpdate.Success" || eventName === "PaymentMethodUpdate.Updated") {
      track("payment_info_update", {
        checkout_provider: "lemon_squeezy",
      });
      return;
    }

    if (/error|failed/i.test(eventName)) {
      track("purchase_error", {
        error_type: normalizeText(eventName, 80),
      });
    }
  };

  const initLemonSqueezy = async () => {
    const hasLemonLink = Array.from(document.querySelectorAll("a[href], a[data-checkout-url]")).some((element) =>
      isLemonCheckoutTarget(element)
    );

    if (!hasLemonLink || state.lemonRequested) {
      return;
    }

    state.lemonRequested = true;

    try {
      await loadLemonSqueezy();
      window.createLemonSqueezy?.();
      if (window.LemonSqueezy && !state.lemonSetupComplete) {
        window.LemonSqueezy.Setup({
          eventHandler: handleLemonEvent,
        });
        state.lemonSetupComplete = true;
      }
    } catch (error) {
      state.lemonRequested = false;
      if (debugEnabled) {
        console.warn(error);
      }
    }
  };

  const bindDynamicElements = () => {
    document.querySelectorAll("details").forEach(bindDetailsTracking);
    document.querySelectorAll("video").forEach(bindVideoTracking);

    if (isShopPage() || isProductPage()) {
      initLemonSqueezy();
    }
  };

  const scheduleDynamicBinding = () => {
    if (state.bindingFrame) {
      return;
    }

    state.bindingFrame = window.requestAnimationFrame(() => {
      state.bindingFrame = null;
      bindDynamicElements();
    });
  };

  const initMutationObserver = () => {
    if (!document.body || state.mutationObserver) {
      return;
    }

    state.mutationObserver = new MutationObserver(() => {
      scheduleDynamicBinding();
    });

    state.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  const setConsent = async (value, interactionSource = "panel") => {
    const previousConsent = state.consent;

    if (previousConsent === "accepted" && value !== "accepted") {
      trackConsentState(value, interactionSource, previousConsent);
    }

    state.consent = value;
    storeConsent(value);

    if (value === "accepted") {
      await configureGoogleAnalytics();
      emitScrollDepth();
      syncUserProperties();
      trackConsentState(value, interactionSource, previousConsent);
      trackVisibleCommerceItems();
      initSectionTracking();
      initWebVitals();
    } else {
      if (state.tagRequested) {
        window.gtag("consent", "update", buildConsentPayload(false));
      }
      clearAnalyticsCookies();
    }

    setBannerOpen(false);
    setPanelOpen(false);
    syncPreferenceControls();
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
        <button class="button primary cookie-banner__button" type="button" data-consent-action="accept">Accept analytics</button>
        <button class="button secondary cookie-banner__button" type="button" data-consent-action="customize">More options</button>
        <a class="cookie-banner__link" href="${privacyPolicyPath}">Read the privacy policy</a>
      </div>
    `;

    banner.querySelector("[data-consent-action='accept']")?.addEventListener("click", () => {
      setConsent("accepted", "banner");
    });
    banner.querySelector("[data-consent-action='customize']")?.addEventListener("click", () => {
      state.panelSource = "banner";
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
      setConsent("accepted", state.panelSource || "panel");
    });

    panel.querySelector("[data-consent-action='save-preferences']")?.addEventListener("click", () => {
      const shouldEnableAnalytics = Boolean(state.analyticsCheckbox?.checked);
      setConsent(shouldEnableAnalytics ? "accepted" : "rejected", state.panelSource || "panel");
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
      syncUserProperties();
      trackVisibleCommerceItems();
      initSectionTracking();
      initWebVitals();
    } else if (state.consent === "rejected") {
      clearAnalyticsCookies();
    }

    bindDynamicElements();
    initSectionTracking();
    initMutationObserver();
    initErrorTracking();
    initFormTracking();

    document.addEventListener("click", trackClick);
    window.addEventListener("scroll", emitScrollDepth, { passive: true });
    window.addEventListener("resize", () => {
      emitScrollDepth();
      syncUserProperties();
    });
  };

  window.mrbAnalytics = {
    isConfigured: () => validMeasurementId,
    getConsentState: () => state.consent,
    openConsentDialog: () => {
      state.panelSource = "panel";
      setPanelOpen(true);
    },
    clearAnalyticsCookies,
    describeForm,
    getDiagnostics: () => ({
      consent: state.consent,
      debugEnabled,
      measurementId,
      tagRequested: state.tagRequested,
      tagLoaded: state.tagLoaded,
      webVitalsLoaded: state.webVitalsLoaded,
    }),
    getProductData,
    setUserProperty,
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
