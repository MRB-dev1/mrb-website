(() => {
  const progress = document.querySelector(".scroll-progress");
  const storylines = Array.from(document.querySelectorAll("[data-storyline]"));

  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

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
      video.closest(".hero-media-shell")?.classList.add("is-hydrated");
      video.load();

      const playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {});
      }
    };

    if (prefersReducedMotion) {
      mediaLoops.forEach((video) => {
        video.closest(".hero-media-shell")?.classList.add("is-static");
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
    message.textContent = "Here is the summary. We will get back to you in 5h-48h.";

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

  let turnstileLoader;
  const TURNSTILE_LOAD_TIMEOUT_MS = 12000;
  const TURNSTILE_POLL_INTERVAL_MS = 50;

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

  const setupTurnstile = async (form, status) => {
    const field = form.querySelector("[data-turnstile-field]");
    const widgetHost = form.querySelector("[data-turnstile-widget]");
    const note = form.querySelector("[data-turnstile-note]");
    const retryButton = form.querySelector("[data-turnstile-retry]");
    const submitButton = form.querySelector("button[type='submit']");

    form.dataset.turnstileEnabled = "false";
    form.dataset.turnstileToken = "";
    form.dataset.turnstileWidgetId = "";

    if (!field || !widgetHost || !note) {
      return;
    }

    if (retryButton && retryButton.dataset.turnstileBound !== "true") {
      retryButton.dataset.turnstileBound = "true";
      retryButton.addEventListener("click", () => {
        turnstileLoader = undefined;
        form.dataset.turnstileToken = "";
        form.dataset.turnstileWidgetId = "";
        widgetHost.replaceChildren();
        setupTurnstile(form, status);
      });
    }

    const endpoint = window.location.protocol === "file:" ? "http://localhost:3000/api/contact" : "/api/contact";

    try {
      field.hidden = true;
      if (retryButton) {
        retryButton.hidden = true;
      }

      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.turnstile?.enabled || !result.turnstile?.siteKey) {
        field.hidden = true;
        note.textContent = "Cloudflare Turnstile is not configured yet.";
        if (retryButton) {
          retryButton.hidden = true;
        }
        return;
      }

      field.hidden = false;
      form.dataset.turnstileEnabled = "true";
      if (submitButton) {
        submitButton.disabled = true;
      }

      note.textContent = "Loading Cloudflare Turnstile…";
      widgetHost.replaceChildren();
      await loadTurnstileScript();

      const widgetId = window.turnstile.render(widgetHost, {
        sitekey: result.turnstile.siteKey,
        theme: "dark",
        appearance: "always",
        callback: (token) => {
          form.dataset.turnstileToken = token || "";
          note.textContent = "Verification complete.";
          if (submitButton) {
            submitButton.disabled = false;
          }
        },
        "expired-callback": () => {
          form.dataset.turnstileToken = "";
          note.textContent = "Verification expired. Please confirm again.";
          if (submitButton) {
            submitButton.disabled = true;
          }
        },
        "error-callback": () => {
          form.dataset.turnstileToken = "";
          note.textContent = "Could not load the Cloudflare Turnstile check. Refresh and try again.";
          if (submitButton) {
            submitButton.disabled = true;
          }
        },
      });

      form.dataset.turnstileWidgetId = String(widgetId);
      note.textContent = "Please complete the Cloudflare Turnstile check.";
    } catch (error) {
      field.hidden = false;
      note.textContent = "Cloudflare Turnstile did not finish loading. Retry the check.";
      if (retryButton) {
        retryButton.hidden = false;
      }
      if (submitButton) {
        submitButton.disabled = false;
      }
      if (status) {
        status.textContent = "Could not load the Cloudflare Turnstile check right now.";
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

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    setupTurnstile(form, status);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (status) {
        status.textContent = "Sending...";
      }

      const submitButton = form.querySelector("button[type='submit']");
      if (submitButton) {
        submitButton.disabled = true;
      }

      const formData = new FormData(form);
      formData.set("Form", form.dataset.formName || "Website inquiry");
      const summary = summarizeSubmission(formData);
      const endpoint = window.location.protocol === "file:" ? "http://localhost:3000/api/contact" : form.action;

      try {
        const emailInput = form.querySelector("input[name='Email']");

        if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value.trim())) {
          emailInput.setCustomValidity("Enter a full email address, for example name@example.com.");
          emailInput.reportValidity();
          throw new Error("Invalid email");
        }

        if (emailInput) {
          emailInput.setCustomValidity("");
        }

        if (form.dataset.turnstileEnabled === "true") {
          const widgetId = form.dataset.turnstileWidgetId;
          const token =
            window.turnstile && widgetId !== ""
              ? window.turnstile.getResponse(widgetId)
              : form.dataset.turnstileToken || "";

          if (!token) {
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
          throw error;
        }

        form.reset();
        form.querySelectorAll(".topic-field select[name='Topic']").forEach((select) => {
          select.dispatchEvent(new Event("change", { bubbles: true }));
        });
        if (form.dataset.turnstileEnabled === "true" && window.turnstile && form.dataset.turnstileWidgetId !== "") {
          window.turnstile.reset(form.dataset.turnstileWidgetId);
          form.dataset.turnstileToken = "";
          const note = form.querySelector("[data-turnstile-note]");
          if (note) {
            note.textContent = "Please complete the Cloudflare Turnstile check.";
          }
        }
        if (status) {
          status.textContent =
            result.email?.sent === false && result.discord?.sent
              ? "Message sent to MRB Discord. Confirmation email is not configured yet."
              : "Message sent. MRB will reply within 5h-48h.";
        }
        showInquiryModal(summary);
        fireConfetti();
      } catch (error) {
        if (status) {
          const isFilePreview = window.location.protocol === "file:";

          if (error.message === "Invalid email") {
            status.textContent = "Use a full email address before sending.";
          } else if (error.message === "Turnstile incomplete") {
            status.textContent = "Please complete the Cloudflare Turnstile check before sending.";
          } else if (error.result?.message) {
            status.textContent = error.result.message;
          } else {
            status.textContent = isFilePreview
              ? "Start the backend with npm start, then open http://localhost:3000/contact.html. For now, email hello@mrb.ink or Robin@mrb.ink."
              : "Could not reach the form backend. Email hello@mrb.ink or Robin@mrb.ink.";
          }
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });

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
