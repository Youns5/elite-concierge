/* ÉLITE — Visite guidée (mini-tour d'onboarding) */
const Tour = (() => {
  const TOUR_KEY = 'elite_tour_auto_v1';

  const STEPS = [
    { nav: 'overview',     title: 'Dashboard',   desc: "Votre tableau de bord vous permet de suivre l'activité de votre conciergerie en un coup d'œil." },
    { nav: 'clients',      title: 'Clients',     desc: "Gérez vos clients, leurs informations et leurs préférences depuis un seul endroit." },
    { nav: 'demandes',     title: 'Demandes',    desc: "Centralisez toutes les demandes de vos clients et suivez leur progression." },
    { nav: 'reservations', title: 'Réservations', desc: "Gérez les réservations et les prestations organisées pour vos clients." },
    { nav: 'planning',     title: 'Planning',    desc: "Retrouvez toutes vos missions et événements dans votre planning." },
    { nav: 'automations',  title: 'Automatisations & IA', desc: "Automatisez certaines tâches et utilisez l'intelligence artificielle pour gagner du temps." }
  ];

  let overlay = null, panelEl = null, spotlightEl = null;
  let running = false, phase = 'idle', stepIndex = -1;

  function lsGet() { try { return localStorage.getItem(TOUR_KEY); } catch (_) { return null; } }
  function lsSet(v) { try { localStorage.setItem(TOUR_KEY, v); } catch (_) {} }
  function isPending() { return lsGet() === 'pending'; }
  function markDone() { lsSet('done'); }

  function maybeAutoStart() {
    if (running) return;
    if (!isPending()) return;
    let completed = false;
    try {
      const s = Store.getAll();
      completed = !!(s && ((s.user && s.user.onboardingCompleted) || s.onboardingCompleted));
    } catch (_) {}
    if (!completed) return;
    start();
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'tour';
    overlay.innerHTML = '<div class="tour__spotlight" id="tourSpotlight"></div><div class="tour__panel" id="tourPanel"></div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    panelEl = overlay.querySelector('#tourPanel');
    spotlightEl = overlay.querySelector('#tourSpotlight');
    render('welcome');
  }

  function destroy() {
    if (!overlay) return;
    const sb = document.getElementById('sidebar'); if (sb) sb.classList.remove('is-open');
    const bk = document.querySelector('.mobile-backdrop'); if (bk) bk.classList.remove('is-open');
    document.body.style.overflow = '';
    overlay.remove();
    overlay = null; panelEl = null; spotlightEl = null;
    running = false; phase = 'idle'; stepIndex = -1;
  }

  function show(html, centered) {
    panelEl.innerHTML = html;
    panelEl.classList.toggle('is-centered', !!centered);
    if (centered) { panelEl.style.top = ''; panelEl.style.left = ''; }
  }

  function hideSpotlight() { spotlightEl.style.display = 'none'; spotlightEl.style.boxShadow = 'none'; }

  function render(mode, i) {
    phase = mode;
    if (mode === 'welcome') renderWelcome();
    else if (mode === 'step') renderStep(i);
    else renderFinal();
  }

  function renderWelcome() {
    hideSpotlight();
    show('<div class="tour__brand">É</div><div class="tour__eyebrow">Bienvenue</div>' +
      '<div class="tour__title">Bienvenue dans votre espace ÉLITE</div>' +
      '<div class="tour__desc">Découvrez rapidement les principales fonctionnalités de votre conciergerie.</div>' +
      '<div class="tour__actions"><button class="btn btn--subtle" id="tourSkip">' + Icon('close', { size: 14 }) + ' Passer</button>' +
      '<button class="btn btn--primary btn--lg" id="tourStart">Commencer la visite</button></div>', true);
    wireTips();
  }

  function tipHtml(step, i) {
    return '<div class="tour__dots">' +
      STEPS.map((_, d) => '<span class="' + (d === i ? 'is-active' : '') + '"></span>').join('') +
      '</div><div class="tour__eyebrow">Étape ' + (i + 1) + ' sur ' + STEPS.length + '</div>' +
      '<div class="tour__title">' + escapeHtml(step.title) + '</div>' +
      '<div class="tour__desc">' + escapeHtml(step.desc) + '</div>' +
      '<div class="tour__actions"><button class="btn btn--subtle" id="tourSkip">Passer</button>' +
      '<button class="btn btn--primary" id="tourNext">Suivant</button></div>';
  }

  function renderStep(i) {
    stepIndex = i;
    const step = STEPS[i];
    const target = document.querySelector('[data-nav="' + step.nav + '"]');
    if (!target) { hideSpotlight(); show(tipHtml(step, i), true); wireTips(); return; }
    if (window.innerWidth <= 900) {
      const sb = document.getElementById('sidebar'); if (sb) sb.classList.add('is-open');
      const bk = document.querySelector('.mobile-backdrop'); if (bk) bk.classList.add('is-open');
    }
    try { target.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'center' }); } catch (_) {}
    setTimeout(function () {
      const rect = target.getBoundingClientRect();
      if (!rect.width && !rect.height) { hideSpotlight(); show(tipHtml(step, i), true); wireTips(); return; }
      spotlightEl.style.display = 'block';
      spotlightEl.style.width = (rect.width + 16) + 'px';
      spotlightEl.style.height = (rect.height + 16) + 'px';
      spotlightEl.style.left = (rect.left - 8) + 'px';
      spotlightEl.style.top = (rect.top - 8) + 'px';
      spotlightEl.style.borderRadius = '10px';
      spotlightEl.style.boxShadow = '0 0 0 9999px rgba(10, 10, 10, 0.62)';
      panelEl.style.opacity = '0';
      show(tipHtml(step, i), false);
      const w = panelEl.offsetWidth || 300;
      const h = panelEl.offsetHeight || 200;
      let top = rect.bottom + 18;
      if (top + h > window.innerHeight - 16) top = Math.max(16, rect.top - h - 18);
      let left = rect.right - w;
      if (left < 16) left = 16;
      if (left + w > window.innerWidth - 16) left = window.innerWidth - w - 16;
      panelEl.style.top = top + 'px';
      panelEl.style.left = left + 'px';
      panelEl.style.opacity = '1';
      wireTips();
    }, Math.min(560, 380));
  }

  function renderFinal() {
    hideSpotlight();
    show('<div class="tour__brand">É</div><div class="tour__eyebrow">C\'est terminé</div>' +
      '<div class="tour__title">Vous êtes prêt.</div>' +
      '<div class="tour__desc">Votre espace est configuré. Commencez par ajouter votre premier client, puis créez vos premières demandes et réservations.</div>' +
      '<div class="tour__actions"><button class="btn btn--primary btn--lg" id="tourFinish">Accéder à mon espace</button></div>', true);
    wireTips();
  }

  function next() {
    if (phase === 'welcome') { render('step', 0); return; }
    if (phase === 'step') {
      if (stepIndex >= STEPS.length - 1) { render('final'); return; }
      render('step', stepIndex + 1);
      return;
    }
    finish();
  }

  function skip() { markDone(); destroy(); }
  function finish() { markDone(); destroy(); }

  function wireTips() {
    const startBtn = document.getElementById('tourStart');
    if (startBtn) startBtn.addEventListener('click', next);
    const nextBtn = document.getElementById('tourNext');
    if (nextBtn) nextBtn.addEventListener('click', next);
    const finishBtn = document.getElementById('tourFinish');
    if (finishBtn) finishBtn.addEventListener('click', finish);
    const skipBtn = document.getElementById('tourSkip');
    if (skipBtn) skipBtn.addEventListener('click', skip);
  }

  function start() {
    if (running) return;
    running = true;
    build();
  }

  document.addEventListener('keydown', function (e) {
    if (running && e.key === 'Escape') { e.preventDefault(); skip(); }
  });
  window.addEventListener('resize', function () {
    if (running && phase === 'step') renderStep(stepIndex);
  });

  return { start: start, maybeAutoStart: maybeAutoStart, skip: skip, TOUR_KEY: TOUR_KEY };
})();
window.Tour = Tour;