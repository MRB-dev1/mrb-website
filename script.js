(() => {
  const progress = document.querySelector(".scroll-progress");
  const storylines = Array.from(document.querySelectorAll("[data-storyline]"));

  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const getAnalyticsApi = () =>
    window.mrbAnalytics && typeof window.mrbAnalytics.track === "function" ? window.mrbAnalytics : null;
  const trackAnalyticsEvent = (eventName, params = {}) => {
    const analytics = getAnalyticsApi();
    if (analytics) {
      analytics.track(eventName, params);
    }
  };
  const describeForm = (form) => {
    const analytics = getAnalyticsApi();
    if (analytics && typeof analytics.describeForm === "function") {
      return analytics.describeForm(form);
    }

    return {
      form_name: form.dataset.formName || form.getAttribute("aria-label") || form.id || "form",
      form_id: form.id || "",
    };
  };

  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress = scrollable > 0 ? window.scrollY / scrollable : 0;

    if (progress) {
      progress.style.transform = `scaleX(${clamp(pageProgress)})`;
    }

    storylines.forEach((storyline) => {
      const rect = storyline.getBoundingClientRect();
      const centerLine = window.innerHeight * 0.5;
      const storyProgress = clamp((centerLine - rect.top) / rect.height);
      const storySection = storyline.closest(".storyline-section");
      storyline.style.setProperty("--story-progress", `${(storyProgress * 100).toFixed(1)}%`);

      if (storySection) {
        const shifted = (storyProgress - 0.5) * 36;
        storySection.style.setProperty("--story-shift", `${shifted.toFixed(1)}%`);
        storySection.style.setProperty("--story-cyan-alpha", (0.045 + storyProgress * 0.105).toFixed(3));
        storySection.style.setProperty("--story-lime-alpha", (0.03 + storyProgress * 0.08).toFixed(3));
      }

      storyline.querySelectorAll("[data-parallax-card]").forEach((card, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        const travel = (storyProgress - 0.5) * 84 * direction;
        card.style.setProperty("--float-y", `${travel.toFixed(1)}px`);
      });

      storyline.querySelectorAll(".timeline-item").forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const connectorY = itemRect.top - rect.top + 34;
        const hasPassed = storyProgress * rect.height >= connectorY + 10;
        item.classList.toggle("is-passed", hasPassed);
      });

      if (storySection) {
        const processCta = storySection.querySelector(".process-cta");

        if (processCta) {
          const ctaRect = processCta.getBoundingClientRect();
          processCta.classList.toggle("is-inverted", ctaRect.top <= centerLine);
        }
      }
    });
  };

  document.querySelectorAll(".reveal-sequence").forEach((group) => {
    Array.from(group.children).forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 120}ms`);
    });
  });

  document.querySelectorAll(".hero-headline [data-reveal]").forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * 140}ms`);
  });

  const initMrbHomeHero = () => {
    const hero = document.querySelector(".mrb-hero");

    if (!hero) {
      return;
    }

    const revealItems = Array.from(hero.querySelectorAll("[data-reveal]"));
    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 60}ms`);
    });

    hero.querySelectorAll(".mrb-btn").forEach((button) => {
      button.addEventListener("click", () => {
        button.dataset.clicked = "true";
      });
    });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          revealItems.forEach((item) => item.classList.add("is-visible"));
        });
      });
      return;
    }

    revealItems.forEach((item) => item.classList.add("is-visible"));

    hero.querySelectorAll(".mrb-hero__video").forEach((video) => {
      video.pause();
      video.removeAttribute("autoplay");
    });
  };

  initMrbHomeHero();

  const initFaqPage = () => {
    const faqPage = document.querySelector(".faq-page");

    if (!faqPage) {
      return;
    }

    const filterLinks = Array.from(faqPage.querySelectorAll("[data-faq-filter]"));
    const sections = filterLinks
      .map((link) => {
        const href = link.getAttribute("href");
        return href && href.startsWith("#") ? document.querySelector(href) : null;
      })
      .filter(Boolean);

    const setActiveFilter = (id) => {
      filterLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    faqPage.querySelectorAll(".faq-risk-strip > *").forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 60}ms`);
    });

    faqPage.querySelectorAll("#legal .reveal-sequence > *").forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 60}ms`);
    });

    if (!sections.length) {
      return;
    }

    const syncHashState = () => {
      const hashId = window.location.hash ? window.location.hash.slice(1) : sections[0].id;

      if (sections.some((section) => section.id === hashId)) {
        setActiveFilter(hashId);
      }
    };

    syncHashState();
    window.addEventListener("hashchange", syncHashState);

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const filterObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveFilter(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-32% 0px -48% 0px",
        threshold: [0.2, 0.35, 0.55],
      }
    );

    sections.forEach((section) => filterObserver.observe(section));
  };

  initFaqPage();

  document.querySelectorAll("[data-scroll-center]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.dataset.scrollCenter);

      if (!target) {
        return;
      }

      event.preventDefault();
      const rect = target.getBoundingClientRect();
      const targetTop = rect.top + window.scrollY - Math.max((window.innerHeight - rect.height) / 2, 96);

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth",
      });
    });
  });

  const hydrateHeroMedia = () => {
    const mediaLoops = Array.from(document.querySelectorAll(".hero-media-loop"));

    if (!mediaLoops.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loadLoop = (video) => {
      if (video.dataset.loaded === "true") {
        return;
      }

      const source = video.querySelector("source[data-src]");

      if (!source) {
        return;
      }

      source.src = source.dataset.src;
      video.dataset.loaded = "true";
      video.closest(".hero-media-shell, .mrb-hero__frame")?.classList.add("is-hydrated");
      video.load();

      const playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {});
      }
    };

    if (prefersReducedMotion) {
      mediaLoops.forEach((video) => {
        video.closest(".hero-media-shell, .mrb-hero__frame")?.classList.add("is-static");
      });
      return;
    }

    if ("IntersectionObserver" in window) {
      const mediaObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            loadLoop(entry.target);
            mediaObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );

      mediaLoops.forEach((video) => mediaObserver.observe(video));
    } else {
      mediaLoops.forEach(loadLoop);
    }
  };

  const initShopRequestAccess = () => {
    if (!document.body.classList.contains("shop-page")) {
      return;
    }

    const requestLinks = Array.from(document.querySelectorAll(".shop-request-access"));

    if (!requestLinks.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resetTimers = new Map();

    const resetLink = (link) => {
      window.clearTimeout(resetTimers.get(link));
      resetTimers.delete(link);
      link.classList.remove("is-routing");
      link.removeAttribute("aria-busy");

      const label = link.querySelector("[data-button-label]");
      if (label && link.dataset.defaultLabel) {
        label.textContent = link.dataset.defaultLabel;
      }
    };

    requestLinks.forEach((link) => {
      const label = link.querySelector("[data-button-label]");

      if (label) {
        link.dataset.defaultLabel = label.textContent.trim();
      }

      link.addEventListener("click", () => {
        window.clearTimeout(resetTimers.get(link));
        link.classList.add("is-routing");
        link.setAttribute("aria-busy", "true");

        if (label) {
          label.textContent = link.dataset.loadingLabel || "Routing brief...";
        }

        const timeout = window.setTimeout(() => {
          resetLink(link);
        }, prefersReducedMotion ? 600 : 1400);

        resetTimers.set(link, timeout);
      });
    });

    window.addEventListener("focus", () => {
      requestLinks.forEach(resetLink);
    });

    window.addEventListener("pageshow", () => {
      requestLinks.forEach(resetLink);
    });
  };

  const createInquiryModal = () => {
    const modal = document.createElement("div");
    modal.className = "inquiry-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "inquiry-modal-title");
    modal.hidden = true;

    const panel = document.createElement("div");
    panel.className = "inquiry-modal__panel";

    const closeButton = document.createElement("button");
    closeButton.className = "inquiry-modal__close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close inquiry confirmation");
    closeButton.textContent = "x";

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Inquiry sent";

    const title = document.createElement("h2");
    title.id = "inquiry-modal-title";
    title.textContent = "MRB has your message.";

    const message = document.createElement("p");
    message.className = "inquiry-modal__message";
    message.textContent = "Here is the summary. MRB will reply within one business day.";

    const list = document.createElement("dl");
    list.className = "inquiry-summary";

    const doneButton = document.createElement("button");
    doneButton.className = "button primary";
    doneButton.type = "button";
    doneButton.textContent = "Done";

    panel.append(closeButton, eyebrow, title, message, list, doneButton);
    modal.append(panel);
    document.body.append(modal);

    const close = () => {
      modal.classList.remove("is-open");
      window.setTimeout(() => {
        modal.hidden = true;
      }, 220);
    };

    closeButton.addEventListener("click", close);
    doneButton.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        close();
      }
    });
    window.addEventListener("keydown", (event) => {
      if (!modal.hidden && event.key === "Escape") {
        close();
      }
    });

    return { modal, list, closeButton };
  };

  let inquiryModal;

  const summarizeSubmission = (formData) => {
    const hiddenFields = new Set(["website", "cf-turnstile-response"]);

    return Array.from(formData.entries())
      .map(([key, value]) => [key, String(value).trim()])
      .filter(([key, value]) => value && !hiddenFields.has(key))
      .map(([key, value]) => ({
        label: key,
        value: value.length > 180 ? `${value.slice(0, 177)}...` : value,
      }));
  };

  const showInquiryModal = (summary) => {
    if (!inquiryModal) {
      inquiryModal = createInquiryModal();
    }

    inquiryModal.list.replaceChildren();
    summary.forEach((item) => {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const detail = document.createElement("dd");

      term.textContent = item.label;
      detail.textContent = item.value;
      row.append(term, detail);
      inquiryModal.list.append(row);
    });

    inquiryModal.modal.hidden = false;
    requestAnimationFrame(() => {
      inquiryModal.modal.classList.add("is-open");
      inquiryModal.closeButton.focus();
    });
  };

  const CONTACT_FORM_ID = "contact-form";
  const CONTACT_LOADING_MESSAGE = "Routing brief\u2026";
  const CONTACT_VALIDATION_MESSAGE = "Complete the highlighted field before sending.";
  const CONTACT_BLOCKED_MESSAGE =
    "Something blocked the send. Your brief is still worth sending \u2014 use the email option on this page and include your launch window.";
  const CONTACT_CLIENT_ERRORS = new Set([
    CONTACT_VALIDATION_MESSAGE,
    "Use a full email address before sending.",
    "Please complete bot verification before sending.",
  ]);

  const getFormControl = (target) =>
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
      ? target
      : null;

  const setFieldInvalidState = (target, invalid = true) => {
    const control = getFormControl(target);

    if (!control) {
      return;
    }

    const field = control.closest(".field");
    if (field) {
      field.classList.toggle("is-invalid", invalid);
      if (invalid) {
        field.classList.remove("is-complete");
      }
    }

    if (invalid) {
      control.setAttribute("aria-invalid", "true");
    } else {
      control.removeAttribute("aria-invalid");
    }
  };

  const setFieldCompleteState = (target, complete = true) => {
    const control = getFormControl(target);

    if (!control) {
      return;
    }

    const field = control.closest(".field");
    if (field) {
      field.classList.toggle("is-complete", complete);
    }
  };

  const setSectionInvalidState = (element, invalid = true) => {
    if (element instanceof HTMLElement) {
      element.classList.toggle("is-invalid", invalid);
    }
  };

  const markControlInteracted = (target) => {
    const control = getFormControl(target);

    if (!control) {
      return;
    }

    control.dataset.interacted = "true";
  };

  const isControlCompleted = (target) => {
    const control = getFormControl(target);

    if (!control) {
      return false;
    }

    const value = String(control.value || "").trim();

    if (!value) {
      return false;
    }

    return typeof control.checkValidity === "function" ? control.checkValidity() : true;
  };

  const syncContactFieldState = (target, { commit = false } = {}) => {
    const control = getFormControl(target);

    if (!control) {
      return;
    }

    if (commit) {
      markControlInteracted(control);
    }

    if (control.dataset.interacted !== "true") {
      setFieldCompleteState(control, false);
      return;
    }

    const completed = isControlCompleted(control);
    setFieldCompleteState(control, completed);

    if (completed) {
      setFieldInvalidState(control, false);
    }
  };

  const clearContactInvalidState = (form) => {
    form
      .querySelectorAll(".field.is-invalid, [data-turnstile-field].is-invalid")
      .forEach((element) => element.classList.remove("is-invalid"));
    form.querySelectorAll("[aria-invalid='true']").forEach((element) => element.removeAttribute("aria-invalid"));
  };

  const hasContactInvalidState = (form) =>
    Boolean(form.querySelector(".field.is-invalid, [data-turnstile-field].is-invalid"));

  const updateFormStatus = (status, message, state = "info") => {
    if (!status) {
      return;
    }

    status.textContent = message;
    status.dataset.state = state;
    status.setAttribute("role", state === "error" ? "alert" : "status");
  };

  const getContactFormUi = (form, status = form.querySelector("[data-form-status]")) => {
    if (form.id !== CONTACT_FORM_ID) {
      return null;
    }

    return {
      shell: form.querySelector("[data-form-shell]"),
      success: form.querySelector("[data-form-success]"),
      submitButton: form.querySelector(".contact-submit"),
      turnstileField: form.querySelector("[data-turnstile-field]"),
      status,
    };
  };

  const setContactSubmitLoading = (button, isLoading) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const label = button.querySelector("[data-button-label]");
    const defaultLabel = button.dataset.defaultLabel || label?.textContent?.trim() || button.textContent.trim();
    const loadingLabel = button.dataset.loadingLabel || CONTACT_LOADING_MESSAGE;

    button.dataset.defaultLabel = defaultLabel;
    button.classList.toggle("is-loading", isLoading);
    button.setAttribute("aria-busy", isLoading ? "true" : "false");

    if (label) {
      label.textContent = isLoading ? loadingLabel : defaultLabel;
    } else {
      button.textContent = isLoading ? loadingLabel : defaultLabel;
    }
  };

  const revealContactSuccess = (form, contactUi) => {
    if (!contactUi?.shell || !contactUi.success) {
      return;
    }

    form.classList.remove("is-error", "is-loading");
    contactUi.success.hidden = false;
    contactUi.success.classList.remove("is-visible");
    contactUi.shell.hidden = true;
    form.dataset.formState = "success";

    requestAnimationFrame(() => {
      contactUi.success.classList.add("is-visible");
      contactUi.success.focus();
    });
  };

  const closeContactSelect = (root, { focusTrigger = false } = {}) => {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const trigger = root.querySelector("[data-contact-select-trigger]");
    const menu = root.querySelector("[data-contact-select-menu]");
    const field = root.closest(".field");

    root.classList.remove("is-open");
    if (field) {
      field.classList.remove("is-open");
    }
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
    if (menu) {
      menu.hidden = true;
    }
    if (focusTrigger && trigger instanceof HTMLButtonElement) {
      trigger.focus();
    }
  };

  const closeAllContactSelects = (exceptRoot) => {
    document.querySelectorAll("[data-contact-select].is-open").forEach((openRoot) => {
      if (openRoot !== exceptRoot) {
        closeContactSelect(openRoot);
      }
    });
  };

  const syncContactSelect = (root) => {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const select = root.querySelector("[data-contact-select-native]");
    const valueNode = root.querySelector("[data-contact-select-value]");
    const optionButtons = Array.from(root.querySelectorAll(".contact-select__option"));

    if (!(select instanceof HTMLSelectElement) || !(valueNode instanceof HTMLElement)) {
      return;
    }

    const selectedOption = Array.from(select.options).find((option) => option.value && option.selected);
    const emptyLabel = root.dataset.emptyLabel || select.options[0]?.textContent?.trim() || "Select an option";

    valueNode.textContent = selectedOption ? selectedOption.textContent.trim() : emptyLabel;
    root.classList.toggle("has-value", Boolean(selectedOption));

    optionButtons.forEach((button) => {
      const isSelected = button.dataset.value === select.value;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
      if (isSelected) {
        button.dataset.selected = "true";
      } else {
        button.removeAttribute("data-selected");
      }
    });
  };

  const focusContactSelectOption = (root, mode = "selected") => {
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const optionButtons = Array.from(root.querySelectorAll(".contact-select__option"));

    if (!optionButtons.length) {
      return;
    }

    const selectedIndex = optionButtons.findIndex((button) => button.dataset.value === root.querySelector("[data-contact-select-native]")?.value);
    const fallbackIndex = mode === "last" ? optionButtons.length - 1 : 0;
    const nextIndex = mode === "selected" && selectedIndex >= 0 ? selectedIndex : fallbackIndex;

    optionButtons[nextIndex]?.focus();
  };

  const setupContactSelect = (root) => {
    const select = root.querySelector("[data-contact-select-native]");
    const trigger = root.querySelector("[data-contact-select-trigger]");
    const menu = root.querySelector("[data-contact-select-menu]");
    const field = root.closest(".field");
    const form = root.closest("form");
    const optionButtons = Array.from(root.querySelectorAll(".contact-select__option"));

    if (
      !(select instanceof HTMLSelectElement) ||
      !(trigger instanceof HTMLButtonElement) ||
      !(menu instanceof HTMLElement) ||
      !optionButtons.length
    ) {
      return;
    }

    const open = (focusMode = "selected") => {
      closeAllContactSelects(root);
      root.classList.add("is-open");
      if (field) {
        field.classList.add("is-open");
      }
      trigger.setAttribute("aria-expanded", "true");
      menu.hidden = false;
      focusContactSelectOption(root, focusMode);
    };

    trigger.addEventListener("click", () => {
      if (root.classList.contains("is-open")) {
        closeContactSelect(root);
        return;
      }

      open("selected");
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open("selected");
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        open("last");
      }

      if (event.key === "Escape" && root.classList.contains("is-open")) {
        event.preventDefault();
        closeContactSelect(root);
      }
    });

    optionButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        markControlInteracted(select);
        select.value = button.dataset.value || select.value;
        syncContactSelect(root);
        select.dispatchEvent(new Event("change", { bubbles: true }));
        closeContactSelect(root, { focusTrigger: true });
      });

      button.addEventListener("keydown", (event) => {
        const previousIndex = index === 0 ? optionButtons.length - 1 : index - 1;
        const nextIndex = index === optionButtons.length - 1 ? 0 : index + 1;

        if (event.key === "ArrowDown") {
          event.preventDefault();
          optionButtons[nextIndex]?.focus();
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          optionButtons[previousIndex]?.focus();
        }

        if (event.key === "Home") {
          event.preventDefault();
          optionButtons[0]?.focus();
        }

        if (event.key === "End") {
          event.preventDefault();
          optionButtons[optionButtons.length - 1]?.focus();
        }

        if (event.key === "Escape") {
          event.preventDefault();
          closeContactSelect(root, { focusTrigger: true });
        }

        if (event.key === "Tab") {
          closeContactSelect(root);
        }
      });
    });

    select.addEventListener("change", () => {
      syncContactSelect(root);
    });

    form?.addEventListener("reset", () => {
      window.requestAnimationFrame(() => {
        select.dataset.interacted = "";
        syncContactSelect(root);
        setFieldCompleteState(select, false);
        closeContactSelect(root);
      });
    });

    document.addEventListener("pointerdown", (event) => {
      if (!root.contains(event.target)) {
        closeContactSelect(root);
      }
    });

    syncContactSelect(root);
  };

  let turnstileLoader;
  let turnstileConfigLoader;
  const TURNSTILE_LOAD_TIMEOUT_MS = 12000;
  const TURNSTILE_POLL_INTERVAL_MS = 50;
  const TURNSTILE_BOOT_RETRY_DELAY_MS = 1500;
  const TURNSTILE_MAX_BOOT_ATTEMPTS = 3;

  const getTurnstileEndpoint = (form) =>
    window.location.protocol === "file:" ? "http://localhost:3000/api/contact" : form.action || "/api/contact";

  const waitForTurnstileApi = (timeoutMs = TURNSTILE_LOAD_TIMEOUT_MS) =>
    new Promise((resolve, reject) => {
      const startedAt = Date.now();

      const check = () => {
        if (window.turnstile && typeof window.turnstile.render === "function") {
          resolve(window.turnstile);
          return;
        }

        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error("Turnstile timed out"));
          return;
        }

        window.setTimeout(check, TURNSTILE_POLL_INTERVAL_MS);
      };

      check();
    });

  const loadTurnstileScript = () => {
    if (window.turnstile) {
      return Promise.resolve(window.turnstile);
    }

    if (turnstileLoader) {
      return turnstileLoader;
    }

    turnstileLoader = new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-turnstile-script]");

      if (existing) {
        if (window.turnstile) {
          resolve(window.turnstile);
          return;
        }

        existing.addEventListener(
          "load",
          () => {
            waitForTurnstileApi().then(resolve).catch(reject);
          },
          { once: true }
        );
        existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
        window.setTimeout(() => {
          waitForTurnstileApi().then(resolve).catch(reject);
        }, 0);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = "true";
      script.addEventListener(
        "load",
        () => {
          waitForTurnstileApi().then(resolve).catch(reject);
        },
        { once: true }
      );
      script.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
      document.head.append(script);
    });

    return turnstileLoader;
  };

  const loadTurnstileConfig = (form) => {
    if (turnstileConfigLoader) {
      return turnstileConfigLoader;
    }

    turnstileConfigLoader = fetch(getTurnstileEndpoint(form), {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => ({
        ok: response.ok,
        result: await response.json().catch(() => ({})),
      }))
      .catch((error) => {
        turnstileConfigLoader = undefined;
        throw error;
      });

    return turnstileConfigLoader;
  };

  const primeTurnstile = (form) => {
    loadTurnstileConfig(form)
      .then(({ ok, result }) => {
        if (ok && result.turnstile?.enabled && result.turnstile?.siteKey) {
          return loadTurnstileScript();
        }

        return undefined;
      })
      .catch(() => {});
  };

  const setupTurnstile = async (form, status) => {
    const field = form.querySelector("[data-turnstile-field]");
    const widgetHost = form.querySelector("[data-turnstile-widget]");
    const note = form.querySelector("[data-turnstile-note]");
    const submitButton = form.querySelector("button[type='submit']");
    const attemptCount = Number(form.dataset.turnstileAttemptCount || "0");

    form.dataset.turnstileEnabled = "false";
    form.dataset.turnstilePending = "true";
    form.dataset.turnstileToken = "";
    form.dataset.turnstileWidgetId = "";

    if (!field || !widgetHost || !note) {
      form.dataset.turnstilePending = "false";
      return;
    }

    try {
      field.hidden = true;
      note.hidden = true;

      const { ok, result } = await loadTurnstileConfig(form);

      if (!ok || !result.turnstile?.enabled || !result.turnstile?.siteKey) {
        field.hidden = true;
        note.hidden = true;
        form.dataset.turnstilePending = "false";
        return;
      }

      form.dataset.turnstileEnabled = "true";
      form.dataset.turnstileAttemptCount = "0";
      if (submitButton) {
        submitButton.disabled = true;
      }

      widgetHost.replaceChildren();
      await loadTurnstileScript();

      const widgetId = window.turnstile.render(widgetHost, {
        sitekey: result.turnstile.siteKey,
        theme: "dark",
        appearance: "always",
        callback: (token) => {
          form.dataset.turnstileToken = token || "";
          form.dataset.turnstilePending = "false";
          note.textContent = "Verification complete.";
          setSectionInvalidState(field, false);
          if (form.id === CONTACT_FORM_ID && !hasContactInvalidState(form) && status && CONTACT_CLIENT_ERRORS.has(status.textContent.trim())) {
            form.classList.remove("is-error");
            updateFormStatus(status, "Replies within one business day.");
          }
          if (submitButton) {
            submitButton.disabled = false;
          }
        },
        "expired-callback": () => {
          form.dataset.turnstileToken = "";
          form.dataset.turnstilePending = "false";
          note.textContent = "Verification expired. Please confirm again.";
          if (submitButton) {
            submitButton.disabled = true;
          }
        },
        "error-callback": () => {
          form.dataset.turnstileToken = "";
          form.dataset.turnstilePending = "false";
          note.textContent = "Could not load bot verification. Refresh and try again.";
          if (submitButton) {
            submitButton.disabled = true;
          }
        },
      });

      form.dataset.turnstileWidgetId = String(widgetId);
      form.dataset.turnstilePending = "false";
      field.hidden = false;
      note.hidden = false;
      note.textContent = "Please complete bot verification.";
    } catch (error) {
      note.hidden = false;
      turnstileLoader = undefined;
      form.dataset.turnstileAttemptCount = String(attemptCount + 1);

      if (attemptCount + 1 < TURNSTILE_MAX_BOOT_ATTEMPTS) {
        field.hidden = true;
        note.hidden = true;
        window.setTimeout(() => {
          form.dataset.turnstileToken = "";
          form.dataset.turnstileWidgetId = "";
          widgetHost.replaceChildren();
          setupTurnstile(form, status);
        }, TURNSTILE_BOOT_RETRY_DELAY_MS);
      } else {
        field.hidden = false;
        form.dataset.turnstilePending = "false";
        note.textContent = "Bot verification did not load. Refresh the page and try again.";
        if (submitButton) {
          submitButton.disabled = false;
        }
      }

      if (status) {
        updateFormStatus(status, "Could not load bot verification right now.");
      }
    }
  };

  const fireConfetti = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const layer = document.createElement("div");
    layer.className = "confetti-layer";
    document.body.append(layer);

    const colors = ["#ffffff", "#d8f89a", "#b8c7d9", "#ffd37a"];
    const pieces = 42;

    for (let index = 0; index < pieces; index += 1) {
      const piece = document.createElement("span");
      piece.style.setProperty("--x", `${Math.random() * 100}vw`);
      piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
      piece.style.setProperty("--spin", `${Math.random() * 680 - 340}deg`);
      piece.style.setProperty("--delay", `${Math.random() * 180}ms`);
      piece.style.setProperty("--fall", `${900 + Math.random() * 760}ms`);
      piece.style.background = colors[index % colors.length];
      layer.append(piece);
    }

    window.setTimeout(() => {
      layer.remove();
    }, 1900);
  };

  const setupTopicChips = (select) => {
    const field = select.closest(".topic-field");

    if (!field) {
      return;
    }

    const chips = Array.from(field.querySelectorAll("[data-topic-chip]"));

    if (!chips.length) {
      return;
    }

    const setSelected = (value) => {
      chips.forEach((chip) => {
        const isSelected = chip.dataset.topicChip === value;
        chip.classList.toggle("is-selected", isSelected);
        chip.setAttribute("aria-pressed", String(isSelected));
      });
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        markControlInteracted(select);
        select.value = chip.dataset.topicChip || select.value;
        setSelected(select.value);
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    select.addEventListener("change", () => {
      setSelected(select.value);
    });

    setSelected(select.value || chips[0]?.dataset.topicChip || "");
  };

  document
    .querySelectorAll(".topic-field select[name='Topic']")
    .forEach((select) => setupTopicChips(select));

  document.querySelectorAll("[data-contact-select]").forEach((root) => setupContactSelect(root));

  const contactForms = Array.from(document.querySelectorAll("[data-contact-form]"));

  contactForms.forEach((form) => {
    primeTurnstile(form);
  });

  contactForms.forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const contactUi = getContactFormUi(form, status);
    setupTurnstile(form, status);

    if (contactUi) {
      const resetContactFieldState = (event) => {
        const control = getFormControl(event.target);

        if (!control) {
          return;
        }

        if (event.type === "input") {
          markControlInteracted(control);
          if (!isControlCompleted(control)) {
            setFieldCompleteState(control, false);
          }
        } else {
          syncContactFieldState(control, { commit: true });
        }

        if (control.validity.valid) {
          setFieldInvalidState(control, false);
        }

        if (!hasContactInvalidState(form) && status && CONTACT_CLIENT_ERRORS.has(status.textContent.trim())) {
          form.classList.remove("is-error");
          updateFormStatus(status, "Replies within one business day.");
        }
      };

      form.addEventListener(
        "invalid",
        (event) => {
          const control = getFormControl(event.target);

          if (!control) {
            return;
          }

          setFieldInvalidState(control, true);
          form.classList.add("is-error");
          updateFormStatus(status, CONTACT_VALIDATION_MESSAGE, "error");
        },
        true
      );

      form.addEventListener("input", resetContactFieldState);
      form.addEventListener("change", resetContactFieldState);
      form.addEventListener("blur", resetContactFieldState, true);
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formMeta = describeForm(form);
      trackAnalyticsEvent("form_submit_attempt", {
        form_name: formMeta.form_name,
      });

      if (contactUi) {
        form.classList.remove("is-error");
        clearContactInvalidState(form);
      }

      if (form.dataset.turnstilePending === "true") {
        if (status) {
          updateFormStatus(status, "Verification is still getting ready. Try again in a moment.");
        }
        return;
      }

      if (status) {
        updateFormStatus(status, contactUi ? CONTACT_LOADING_MESSAGE : "Sending...");
      }

      const submitButton = form.querySelector("button[type='submit']");
      if (contactUi) {
        setContactSubmitLoading(contactUi.submitButton || submitButton, true);
        form.classList.add("is-loading");
      }
      if (submitButton) {
        submitButton.disabled = true;
      }
      form.setAttribute("aria-busy", "true");

      const formData = new FormData(form);
      formData.set("Form", form.dataset.formName || "Website inquiry");
      const summary = summarizeSubmission(formData);
      const endpoint = getTurnstileEndpoint(form);

      try {
        const emailInput = form.querySelector("input[name='Email']");

        if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value.trim())) {
          if (contactUi) {
            setFieldInvalidState(emailInput, true);
            form.classList.add("is-error");
          }
          emailInput.setCustomValidity("Enter a full email address, for example name@example.com.");
          emailInput.reportValidity();
          throw new Error("Invalid email");
        }

        if (emailInput) {
          emailInput.setCustomValidity("");
          if (contactUi) {
            setFieldInvalidState(emailInput, false);
          }
        }

        if (form.dataset.turnstileEnabled === "true") {
          const widgetId = form.dataset.turnstileWidgetId;
          const token =
            window.turnstile && widgetId !== ""
              ? window.turnstile.getResponse(widgetId)
              : form.dataset.turnstileToken || "";

          if (!token) {
            if (contactUi) {
              setSectionInvalidState(contactUi.turnstileField, true);
              form.classList.add("is-error");
            }
            throw new Error("Turnstile incomplete");
          }

          formData.set("cf-turnstile-response", token);
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new URLSearchParams(formData),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const error = new Error(result.message || "Submission failed");
          error.result = result;
          error.statusCode = response.status;
          throw error;
        }

        form.reset();
        form.querySelectorAll("[data-contact-select-native], .topic-field select[name='Topic']").forEach((select) => {
          select.dispatchEvent(new Event("change", { bubbles: true }));
        });
        if (form.dataset.turnstileEnabled === "true" && window.turnstile && form.dataset.turnstileWidgetId !== "") {
          window.turnstile.reset(form.dataset.turnstileWidgetId);
          form.dataset.turnstileToken = "";
          const note = form.querySelector("[data-turnstile-note]");
          if (note) {
            note.textContent = "Please complete bot verification.";
          }
        }
        if (status) {
          updateFormStatus(
            status,
            result.email?.sent === false && result.discord?.sent
              ? "Message sent to MRB Discord. Confirmation email is not configured yet."
              : "Message sent. MRB will reply within one business day."
          );
        }
        if (form.id === "contact-form") {
          trackAnalyticsEvent("generate_lead", {
            form_name: formMeta.form_name,
            lead_type: String(formData.get("Topic") || "General inquiry"),
            method: "website_form",
          });
        } else {
          trackAnalyticsEvent("form_submit_success", {
            form_name: formMeta.form_name,
          });
        }
        if (contactUi) {
          revealContactSuccess(form, contactUi);
        } else {
          showInquiryModal(summary);
          fireConfetti();
        }
      } catch (error) {
        const errorCode =
          error.statusCode ||
          (error.message === "Invalid email"
            ? "validation"
            : error.message === "Turnstile incomplete"
              ? "turnstile"
              : "network");

        trackAnalyticsEvent("form_submit_failure", {
          form_name: formMeta.form_name,
          error_code: String(errorCode),
        });

        if (status) {
          const isFilePreview = window.location.protocol === "file:";

          if (error.message === "Invalid email") {
            if (contactUi) {
              const emailInput = form.querySelector("input[name='Email']");
              setFieldInvalidState(emailInput, true);
              form.classList.add("is-error");
            }
            updateFormStatus(status, "Use a full email address before sending.", "error");
          } else if (error.message === "Turnstile incomplete") {
            if (contactUi) {
              setSectionInvalidState(contactUi.turnstileField, true);
              form.classList.add("is-error");
            }
            updateFormStatus(status, "Please complete bot verification before sending.", "error");
          } else if (contactUi && /missing required fields/i.test(error.result?.message || "")) {
            form.classList.add("is-error");
            updateFormStatus(status, CONTACT_VALIDATION_MESSAGE, "error");
          } else if (contactUi && /turnstile/i.test(error.result?.message || "")) {
            setSectionInvalidState(contactUi.turnstileField, true);
            form.classList.add("is-error");
            updateFormStatus(status, "Please complete bot verification before sending.", "error");
          } else if (contactUi && /temporary or disposable email/i.test(error.result?.message || "")) {
            const emailInput = form.querySelector("input[name='Email']");
            setFieldInvalidState(emailInput, true);
            form.classList.add("is-error");
            updateFormStatus(status, error.result.message, "error");
          } else if (contactUi) {
            form.classList.add("is-error");
            updateFormStatus(status, CONTACT_BLOCKED_MESSAGE, "error");
          } else if (error.result?.message) {
            updateFormStatus(status, error.result.message, "error");
          } else {
            updateFormStatus(
              status,
              isFilePreview
                ? "Start the local form server with node server.js, then open http://localhost:3000/contact.html. For now, email hello@mrb.ink."
                : "Could not reach the form backend. Email hello@mrb.ink.",
              "error"
            );
          }
        }
      } finally {
        form.setAttribute("aria-busy", "false");
        if (contactUi) {
          setContactSubmitLoading(contactUi.submitButton || submitButton, false);
          form.classList.remove("is-loading");
        }
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });

  initShopRequestAccess();

  const revealTargets = Array.from(
    document.querySelectorAll("[data-reveal], .reveal-sequence > *, .timeline-item")
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((item) => observer.observe(item));
  } else {
    revealTargets.forEach((item) => item.classList.add("is-visible"));
  }

  hydrateHeroMedia();
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
})();
