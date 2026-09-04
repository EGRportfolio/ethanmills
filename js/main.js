/* ===================================================================
   Ethan Mills — Engineering Portfolio
   Nav, scroll-spy, reveal, tabs, lightbox, magnetic buttons, flow-field canvas
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

  /* ---------- Flow-field canvas (hero background) ---------- */
  var canvas = document.getElementById('flowCanvas');
  if (canvas && canvas.getContext) {
    initFlowField(canvas);
  }

  function initFlowField(canvas) {
    var ctx = canvas.getContext('2d');
    var container = canvas.parentElement;
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var PARTICLE_COUNT = 0;
    var mouse = { x: -9999, y: -9999, active: false };
    var running = false;
    var rafId = null;

    // Airfoil obstacle — a simple teardrop shape positioned in the flow.
    var obstacle = { cx: 0, cy: 0, w: 0, h: 0 };

    function resize() {
      var rect = container.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      obstacle.w = Math.min(W * 0.34, 420);
      obstacle.h = obstacle.w * 0.22;
      obstacle.cx = W * 0.66;
      obstacle.cy = H * 0.5;

      var area = W * H;
      PARTICLE_COUNT = Math.max(40, Math.min(160, Math.round(area / 9000)));
      seedParticles();
    }

    function inAirfoil(x, y) {
      // approximate teardrop: wide rounded front, tapered tail
      var dx = (x - obstacle.cx) / (obstacle.w / 2);
      var dy = (y - obstacle.cy) / (obstacle.h / 2);
      if (dx < -1 || dx > 1) return false;
      var t = (dx + 1) / 2; // 0..1 front to back
      var thickness = Math.sin(Math.PI * Math.pow(t, 0.6)) * (1 - t * 0.15);
      return Math.abs(dy) < thickness;
    }

    function seedParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(makeParticle(Math.random() * W));
      }
    }

    function makeParticle(xStart) {
      var y;
      var tries = 0;
      do {
        y = Math.random() * H;
        tries++;
      } while (inAirfoil(xStart, y) && tries < 6);
      return {
        x: xStart,
        y: y,
        baseY: y,
        speed: 0.55 + Math.random() * 0.9,
        life: Math.random() * 200,
        trail: []
      };
    }

    function fieldAt(x, y) {
      // Base rightward flow, deflected around the obstacle (simple potential-flow-ish push).
      var vx = 1, vy = 0;
      var dx = x - obstacle.cx;
      var dy = y - obstacle.cy;
      var halfW = obstacle.w / 2 + 26;
      var halfH = obstacle.h / 2 + 26;
      var nx = dx / halfW;
      var ny = dy / halfH;
      var dist2 = nx * nx + ny * ny;
      if (dist2 < 2.4) {
        var influence = Math.max(0, 1 - dist2 / 2.4);
        var dirY = ny === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(ny);
        vy += dirY * influence * 1.9;
        vx += influence * 0.35; // slight acceleration over the top/bottom, CFD-style speedup
      }
      // Mouse repulsion for a reactive feel.
      if (mouse.active) {
        var mdx = x - mouse.x, mdy = y - mouse.y;
        var mdist2 = mdx * mdx + mdy * mdy;
        var radius = 140;
        if (mdist2 < radius * radius) {
          var f = (1 - mdist2 / (radius * radius)) * 1.4;
          var mdist = Math.sqrt(mdist2) || 1;
          vx += (mdx / mdist) * f;
          vy += (mdy / mdist) * f;
        }
      }
      return { vx: vx, vy: vy };
    }

    function speedColor(sp) {
      // Jet gradient: blue (slow) -> red (mid) -> amber (fast) — the same
      // blue/red/amber progression as the Goals section's flow-viz graphic.
      var t = Math.max(0, Math.min(1, (sp - 0.8) / 1.6));
      var stops = t < 0.5
        ? { a: [79, 195, 255], b: [255, 77, 109], u: t / 0.5 }
        : { a: [255, 77, 109], b: [255, 179, 71], u: (t - 0.5) / 0.5 };
      var r = Math.round(stops.a[0] + stops.u * (stops.b[0] - stops.a[0]));
      var g = Math.round(stops.a[1] + stops.u * (stops.b[1] - stops.a[1]));
      var b = Math.round(stops.a[2] + stops.u * (stops.b[2] - stops.a[2]));
      return 'rgba(' + r + ',' + g + ',' + b + ',';
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      // faint obstacle silhouette
      ctx.save();
      ctx.beginPath();
      var steps = 40;
      for (var s = 0; s <= steps; s++) {
        var t = s / steps;
        var px = obstacle.cx - obstacle.w / 2 + t * obstacle.w;
        var thickness = Math.sin(Math.PI * Math.pow(t, 0.6)) * (1 - t * 0.15) * (obstacle.h / 2);
        if (s === 0) ctx.moveTo(px, obstacle.cy - thickness); else ctx.lineTo(px, obstacle.cy - thickness);
      }
      for (var s2 = steps; s2 >= 0; s2--) {
        var t2 = s2 / steps;
        var px2 = obstacle.cx - obstacle.w / 2 + t2 * obstacle.w;
        var thickness2 = Math.sin(Math.PI * Math.pow(t2, 0.6)) * (1 - t2 * 0.15) * (obstacle.h / 2);
        ctx.lineTo(px2, obstacle.cy + thickness2);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,138,76,0.07)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,138,76,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var f = fieldAt(p.x, p.y);
        var sp = Math.hypot(f.vx, f.vy);
        p.x += f.vx * p.speed;
        p.y += f.vy * p.speed;
        p.life++;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 16) p.trail.shift();

        if (p.x > W + 20 || p.life > 900 || p.y < -40 || p.y > H + 40) {
          var np = makeParticle(-20 - Math.random() * 60);
          particles[i] = np;
          continue;
        }

        // draw trail
        var col = speedColor(sp);
        for (var j = 1; j < p.trail.length; j++) {
          var a = (j / p.trail.length) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.trail[j - 1].x, p.trail[j - 1].y);
          ctx.lineTo(p.trail[j].x, p.trail[j].y);
          ctx.strokeStyle = col + a.toFixed(2) + ')';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = col + '0.9)';
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    }

    resize();
    window.addEventListener('resize', debounce(resize, 150));

    container.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    });
    container.addEventListener('mouseleave', function () { mouse.active = false; });

    if (prefersReducedMotion) {
      // Render a single static frame — no continuous animation.
      step();
      stop();
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start(); else stop();
        });
      }, { threshold: 0.05 });
      io.observe(canvas);

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else if (isInViewport(canvas)) start();
      });
    }
  }

  function isInViewport(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      var args = arguments, ctx = this;
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

})();
