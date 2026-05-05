/* Smooth 3D tilt for the hero stage. Single pointer listener on
   .mrb-tilt-stage feeds both the back window (.hero-window) and the
   front info panel (.hero-panel) the same target so they stay in sync.
   rAF lerp loop owns all smoothing - there is no CSS transition on
   transform, which was previously double-easing each frame and looking
   clunky. getBoundingClientRect is cached on pointerenter, not per-frame.

   This used to live as an inline <script> in index.html, but the
   production CSP (`script-src 'self'`, no 'unsafe-inline') silently
   blocked inline scripts, so the tilt worked locally but never on
   mrb.ink. Loading it as an external file from /hero-tilt.js makes
   it 'self' and CSP allows it. */
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var stage = document.querySelector(".mrb-tilt-stage");
  if (!stage) return;

  var tiltEls = stage.querySelectorAll("[data-tilt]");
  if (!tiltEls.length) return;

  var states = [];
  tiltEls.forEach(function (el) {
    var isPanel = el.classList.contains("hero-panel");
    states.push({
      el: el,
      cx: 0,
      cy: 0,
      // Back window swings wider; front card is more reserved.
      maxX: isPanel ? 9 : 12,
      maxY: isPanel ? 12 : 16
    });
  });

  var target = { tx: 0, ty: 0 };
  var rect = null;
  var raf = 0;

  function tick() {
    var stillMoving = false;
    // Lerp factor: 0.10 = floaty, 0.20 = snappy. 0.14 is the
    // sweet spot for smooth-without-laggy.
    var k = 0.14;

    for (var i = 0; i < states.length; i++) {
      var s = states[i];
      s.cx += (target.tx - s.cx) * k;
      s.cy += (target.ty - s.cy) * k;
      s.el.style.setProperty("--rx", (-s.cy * s.maxX).toFixed(2) + "deg");
      s.el.style.setProperty("--ry", (s.cx * s.maxY).toFixed(2) + "deg");
      if (Math.abs(target.tx - s.cx) > 0.0005 ||
          Math.abs(target.ty - s.cy) > 0.0005) {
        stillMoving = true;
      }
    }

    raf = stillMoving ? requestAnimationFrame(tick) : 0;
  }

  function ensureLoop() { if (!raf) raf = requestAnimationFrame(tick); }
  function refreshRect() { rect = stage.getBoundingClientRect(); }

  stage.addEventListener("pointerenter", refreshRect, { passive: true });
  window.addEventListener("scroll", function () { rect = null; }, { passive: true });
  window.addEventListener("resize", function () { rect = null; });

  stage.addEventListener("pointermove", function (e) {
    if (!rect) refreshRect();
    target.tx = (e.clientX - rect.left) / rect.width - 0.5;
    target.ty = (e.clientY - rect.top) / rect.height - 0.5;
    ensureLoop();
  }, { passive: true });

  stage.addEventListener("pointerleave", function () {
    target.tx = 0;
    target.ty = 0;
    ensureLoop();
  }, { passive: true });
})();
