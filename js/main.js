/* ===================================================================
   Ethan Mills — Engineering Portfolio
   Nav, scroll-spy, reveal, tabs, lightbox, magnetic buttons, aero flow background
=================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      mainNav.classList.toggle('is-open', !open);
    });
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Header background on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.style.background = 'rgba(10,13,18,0.92)';
      header.style.borderBottomColor = 'var(--border)';
    } else {
      header.style.background = 'rgba(10,13,18,0.72)';
      header.style.borderBottomColor = 'var(--border-soft)';
    }
  }
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Scroll-spy (home page only — sections live on index.html) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var isActive = href === '#' + id || href === 'index.html#' + id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Year tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.year-tab'));
  var panels = {
    'tab-freshman': document.getElementById('panel-freshman'),
    'tab-sophomore': document.getElementById('panel-sophomore')
  };

  function activateTab(tab) {
    tabs.forEach(function (t) {
      var isActive = t === tab;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', String(isActive));
      t.setAttribute('tabindex', isActive ? '0' : '-1');
      var panel = panels[t.id];
      if (panel) {
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      }
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var nextIndex = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      }
    });
  });

  /* ---------- Lightbox (story-media figures) ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.collage-item').forEach(function (fig) {
    var img = fig.querySelector('img');
    var caption = fig.querySelector('figcaption');
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'View larger image');

    function trigger() {
      if (img) openLightbox(img.src, img.alt, caption ? caption.textContent : '');
    }
    fig.addEventListener('click', trigger);
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) closeLightbox();
  });

  /* ---------- Scroll cue ---------- */
  var scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Magnetic buttons (subtle, desktop only, reactive to cursor) ---------- */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.12).toFixed(1) + 'px,' + (y * 0.28 - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

})();

/* ===================================================================
   Aero flow background — a site-wide streamline field (potential flow
   around a circular "cursor obstacle"), replacing the old hero-only
   airfoil/particle canvas. Fixed behind all page content; the cursor
   acts as the obstacle, so the flow splits and accelerates around it.
=================================================================== */
(() => {
  'use strict';
  window.destroyAeroFlow?.();
  const canvas = document.getElementById('aero-flow-background');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const CONFIG = {
    COLOR: '79,195,255',  // site accent blue (--accent-rgb)
    RADIUS: 32,           // Cursor obstacle radius in CSS pixels
    SPEED: 95,            // Undisturbed flow speed, pixels/second
    SPACING: 30,          // Vertical streamline spacing
    WAKE_LENGTH: 330,
    LINE_ALPHA: 0.13,
    HIGHLIGHT_ALPHA: 0.45
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const listeners = [];
  let w = 0, h = 0, rows = [], frame = 0, previous = 0;
  const cursor = { x: 0, y: 0, tx: 0, ty: 0, active: false, strength: 0 };
  const rgba = a => `rgba(${CONFIG.COLOR},${a})`;
  function listen(target, event, fn) {
    target.addEventListener(event, fn);
    listeners.push(() => target.removeEventListener(event, fn));
  }
  function resize() {
    w = innerWidth; h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rows = [];
    const gap = Math.max(CONFIG.SPACING, h / 44);
    for (let y = gap / 2; y < h; y += gap) {
      const phase = ((rows.length * 0.61803398875) % 1) * 180;
      rows.push({ y, markers: Array.from({length: Math.ceil(w / 180) + 3}, (_, i) => i * 180 + phase) });
    }
    if (reduced.matches) render(0);
  }
  // Streamfunction for uniform flow around a cylinder:
  // psi/U = y * (1 - a^2 / (x^2 + y^2)).
  // Solve for the exterior branch; no swirls or procedural noise.
  function ordinate(x, baseline, a) {
    if (a < 0.1) return baseline;
    const dx = x - cursor.x;
    const b = baseline - cursor.y;
    const sign = b < 0 ? -1 : 1;
    const target = Math.max(Math.abs(b), 0.04);
    let lo = Math.sqrt(Math.max(0, a * a - dx * dx));
    let hi = target + a + 1;
    for (let i = 0; i < 15; i++) {
      const mid = (lo + hi) / 2;
      const psi = mid * (1 - a * a / Math.max(dx * dx + mid * mid, 0.001));
      if (psi < target) lo = mid; else hi = mid;
    }
    return cursor.y + sign * (lo + hi) / 2;
  }
  function speedAt(x, y, a) {
    if (a < 0.1) return CONFIG.SPEED;
    const dx = x - cursor.x, dy = y - cursor.y;
    const r2 = Math.max(dx * dx + dy * dy, a * a, 0.001);
    const u = 1 - a * a * (dx * dx - dy * dy) / (r2 * r2);
    const v = -2 * a * a * dx * dy / (r2 * r2);
    return CONFIG.SPEED * Math.hypot(u, v);
  }
  function wake(a) {
    if (a < 0.1) return;
    // An elongated Gaussian wake, exclusively downstream (right).
    // No cursor halo and no glow extending upstream.
    const start = cursor.x + a;
    const length = CONFIG.WAKE_LENGTH;
    for (let s = 0; s < length; s += 4) {
      const fade = Math.sin(Math.PI * s / length) * Math.exp(-s / length * 2);
      const halfWidth = a * 0.7 + s * 0.09;
      const g = ctx.createLinearGradient(0, cursor.y - halfWidth, 0, cursor.y + halfWidth);
      g.addColorStop(0, rgba(0));
      g.addColorStop(0.5, rgba(0.14 * fade * cursor.strength));
      g.addColorStop(1, rgba(0));
      ctx.fillStyle = g;
      ctx.fillRect(start + s, cursor.y - halfWidth, 4, halfWidth * 2);
    }
  }
  function render(dt) {
    ctx.clearRect(0, 0, w, h);
    const a = reduced.matches ? 0 : CONFIG.RADIUS * cursor.strength;
    wake(a);
    for (const row of rows) {
      const points = [];
      let distance = 0;
      // Extra resolution near the obstacle preserves clean curvature.
      for (let x = -80; x <= w + 84;) {
        const y = ordinate(x, row.y, a);
        const last = points[points.length - 1];
        if (last) distance += Math.hypot(x - last.x, y - last.y);
        points.push({x, y, distance});
        x += a > 0.1 && Math.abs(x - cursor.x) < a * 4 ? 3 : 12;
      }
      ctx.beginPath();
      points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      ctx.strokeStyle = rgba(CONFIG.LINE_ALPHA);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      if (reduced.matches) continue;
      // Highlights advect along each curve; local speed rises at the sides
      // and falls near the front/rear stagnation regions.
      for (let i = 0; i < row.markers.length; i++) {
        let arc = row.markers[i] % distance;
        let low = 1, high = points.length - 1;
        while (low < high) {
          const mid = (low + high) >> 1;
          if (points[mid].distance < arc) low = mid + 1; else high = mid;
        }
        const p = points[low - 1], q = points[low];
        const t = (arc - p.distance) / (q.distance - p.distance);
        const x = p.x + (q.x - p.x) * t, y = p.y + (q.y - p.y) * t;
        row.markers[i] = (arc + speedAt(x, y, a) * dt) % distance;
        const norm = Math.hypot(q.x - p.x, q.y - p.y);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (q.x - p.x) / norm * 8, y + (q.y - p.y) / norm * 8);
        ctx.strokeStyle = rgba(CONFIG.HIGHLIGHT_ALPHA);
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }
    }
  }
  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, 0.035) : 0;
    previous = now;
    const blend = 1 - Math.exp(-14 * dt);
    cursor.x += (cursor.tx - cursor.x) * blend;
    cursor.y += (cursor.ty - cursor.y) * blend;
    cursor.strength += ((cursor.active ? 1 : 0) - cursor.strength) * blend;
    render(dt);
    frame = requestAnimationFrame(tick);
  }
  function restart() {
    cancelAnimationFrame(frame); previous = 0;
    if (document.hidden) return;
    if (reduced.matches) render(0);
    else frame = requestAnimationFrame(tick);
  }
  listen(window, 'pointermove', e => {
    if (!fine.matches || e.pointerType === 'touch') return;
    if (!cursor.active) { cursor.x = e.clientX; cursor.y = e.clientY; }
    cursor.tx = e.clientX; cursor.ty = e.clientY; cursor.active = true;
  });
  listen(document.documentElement, 'pointerleave', () => { cursor.active = false; });
  listen(window, 'blur', () => { cursor.active = false; });
  listen(window, 'resize', resize);
  listen(document, 'visibilitychange', restart);
  listen(reduced, 'change', restart);
  window.destroyAeroFlow = () => {
    cancelAnimationFrame(frame);
    listeners.forEach(remove => remove());
    ctx.clearRect(0, 0, w, h);
    delete window.destroyAeroFlow;
  };
  resize(); restart();
})();
