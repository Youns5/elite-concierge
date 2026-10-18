/* ============================================================
   ÉLITE — Shell applicatif
   ============================================================
   Injecte sidebar + topbar sur chaque page.
   Gère navigation, recherche globale (⌘K), notifications, profil.
   ============================================================ */

const App = (() => {

  const NAV = [
    { group: 'Pilotage', items: [
      { id: 'overview',     label: 'Overview',     icon: 'dashboard',   href: 'index.html' },
      { id: 'clients',      label: 'Clients',      icon: 'clients',     href: 'pages/clients.html', count: () => Store.get('clients').length },
      { id: 'demandes',     label: 'Demandes',     icon: 'demand',      href: 'pages/demandes.html', count: () => Store.get('demands').filter(d => d.status !== 'Terminée').length, urgent: () => Store.get('demands').filter(d => d.priority === 'Urgente' && d.status !== 'Terminée').length },
      { id: 'reservations', label: 'Réservations', icon: 'reservation', href: 'pages/reservations.html' },
      { id: 'planning',     label: 'Planning',     icon: 'calendar',    href: 'pages/planning.html' }
    ]},
    { group: 'Opérations', items: [
      { id: 'prestataires', label: 'Prestataires', icon: 'provider', href: 'pages/prestataires.html' },
      { id: 'facturation',  label: 'Facturation',  icon: 'invoice',  href: 'pages/facturation.html' }
    ]},
    { group: 'Intelligence', items: [
      { id: 'ai',            label: 'ÉLITE AI',     icon: 'sparkles', href: 'pages/ai.html' },
      { id: 'automations',   label: 'Automatisations', icon: 'flow', href: 'pages/automatisations.html' }
    ]}
  ];

  function currentPath() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  // Whether the current document lives in /pages/ (true) or at the root (false).
  function isInPagesDir() {
    return /\/pages\/[^/]*$/.test(location.pathname);
  }

  // Resolve a logical href ('index.html' or 'pages/clients.html') to a
  // path that works from the CURRENT document, regardless of whether we
  // are at the root or inside /pages/.
  function resolveHref(logicalHref) {
    const inPages = isInPagesDir();
    if (logicalHref === 'index.html') {
      return inPages ? '../index.html' : 'index.html';
    }
    // logicalHref starts with 'pages/...'
    if (inPages) {
      // We're already in /pages/, strip the 'pages/' prefix
      return logicalHref.replace(/^pages\//, '');
    }
    return logicalHref;
  }

  function isActive(href) {
    const cur = currentPath();
    if (href === 'index.html') return cur === 'index.html' || cur === '';
    return cur === href.split('/').pop();
  }

  function isSubpage(pageId) {
    const cur = currentPath();
    if (pageId === 'clients') return cur === 'clients.html' || cur === 'client-detail.html';
    return false;
  }

  function buildSidebar() {
    const user = Store.getAll().user || { name: 'Alexandre Martin', role: 'Concierge Manager', initials: 'AM' };
    let navHtml = '';
    NAV.forEach(group => {
      navHtml += `<div class="sidebar__group-label">${escapeHtml(group.group)}</div>`;
      group.items.forEach(item => {
        const active = isActive(item.href) || isSubpage(item.id);
        const cls = 'sidebar__link' + (active ? ' is-active' : '');
        const href = resolveHref(item.href);
        let badge = '';
        if (item.urgent && item.urgent() > 0) badge = `<span class="badge-urgent">${item.urgent()}</span>`;
        else if (item.count && item.count() > 0) badge = `<span class="badge-count">${item.count()}</span>`;
        navHtml += `
          <a href="${href}" class="${cls}" data-nav="${item.id}">
            ${Icon(item.icon, { size: 17 })}
            <span>${escapeHtml(item.label)}</span>
            ${badge}
          </a>`;
      });
    });

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar__brand">
          <div class="sidebar__brand-mark">É</div>
          <div>
            <div class="sidebar__brand-name">ÉLITE</div>
            <div class="sidebar__brand-tag">Conciergerie</div>
          </div>
        </div>
        <nav class="sidebar__nav">${navHtml}</nav>
        <a href="${resolveHref('pages/parametres.html')}" class="sidebar__user" id="userMenu">
          <div class="sidebar__user-avatar">${escapeHtml(user.initials || 'AM')}</div>
          <div class="sidebar__user-info">
            <div class="sidebar__user-name">${escapeHtml(user.name)}</div>
            <div class="sidebar__user-role">${escapeHtml(user.role)}</div>
          </div>
          <span class="sidebar__user-chev">${Icon('chevronRight', { size: 14 })}</span>
        </a>
      </aside>`;
  }

  function buildTopbar(pageTitle) {
    return `
      <header class="topbar">
        <div class="topbar__crumb">
          <span>ÉLITE</span>
          ${Icon('chevronRight', { size: 14 })}
          <span class="is-current">${escapeHtml(pageTitle || 'Overview')}</span>
        </div>
        <div class="topbar__spacer"></div>
        <button class="topbar__search" id="topbarSearch" aria-label="Recherche globale">
          ${Icon('search', { size: 15 })}
          <span>Rechercher</span>
          <span class="shortcut">⌘ K</span>
        </button>
        <button class="topbar__icon-btn" id="topbarNotif" aria-label="Notifications">
          ${Icon('bell', { size: 17 })}
          <span class="dot"></span>
        </button>
      </header>`;
  }

  function buildMobileTopbar(pageTitle) {
    return `
      <header class="mobile-topbar">
        <button class="mobile-topbar__menu-btn" id="mobileMenuBtn" aria-label="Menu">${Icon('menu', { size: 20 })}</button>
        <div class="mobile-topbar__brand">ÉLITE</div>
        <div class="mobile-topbar__spacer"></div>
        <button class="topbar__icon-btn" id="mobileSearchBtn" aria-label="Recherche">${Icon('search', { size: 18 })}</button>
        <button class="topbar__icon-btn" id="mobileNotifBtn" aria-label="Notifications">
          ${Icon('bell', { size: 18 })}
          <span class="dot"></span>
        </button>
      </header>`;
  }

  function wireSearch() {
    const handler = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        CommandPalette.toggle();
      }
    };
    document.addEventListener('keydown', handler);

    const searchBtn = document.getElementById('topbarSearch');
    if (searchBtn) searchBtn.addEventListener('click', () => CommandPalette.open());
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', () => CommandPalette.open());
  }

  function wireNotifications() {
    // Update the "unread" dot indicator on every bell icon (desktop + mobile).
    const updateDots = () => {
      const unread = Store.get('notifications').filter(n => n.unread).length;
      document.querySelectorAll('.topbar__icon-btn .dot').forEach(d => {
        d.style.display = unread > 0 ? '' : 'none';
      });
    };

    const renderNotifs = () => {
      const notifs = Store.get('notifications');
      // Keep dots in sync whenever we render the panel content.
      updateDots();
      if (!notifs.length) {
        return `<div class="empty" style="padding: 40px 20px;">
          <div class="empty__icon">${Icon('bell', { size: 22 })}</div>
          <div class="empty__title">Aucune notification</div>
        </div>`;
      }
      const accentMap = { gold: 'notif-item__icon--gold', success: 'notif-item__icon--success', danger: 'notif-item__icon--danger' };
      return notifs.map(n => `
        <div class="notif-item ${n.unread ? 'is-unread' : ''}" data-notif="${n.id}">
          <div class="notif-item__icon ${accentMap[n.accent] || ''}">${Icon(n.icon || 'bell', { size: 14 })}</div>
          <div style="flex:1; min-width:0;">
            <div class="notif-item__title">${escapeHtml(n.title)}</div>
            <div class="notif-item__msg">${escapeHtml(n.message)}</div>
            <div class="notif-item__time">${escapeHtml(n.time)}</div>
          </div>
        </div>
      `).join('');
    };

    const openPanel = (anchor) => {
      Popover.open({
        anchor,
        width: 380,
        render: () => `
          <div class="popover__head">
            <div class="popover__title">Notifications</div>
            <button class="btn btn--subtle btn--sm" id="markAllRead">Tout marquer lu</button>
          </div>
          <div class="popover__body">${renderNotifs()}</div>
        `,
        onClose: () => {}
      });
      const markAll = document.getElementById('markAllRead');
      if (markAll) {
        markAll.addEventListener('click', () => {
          const notifs = Store.get('notifications');
          notifs.forEach(n => { if (n.unread) Store.update('notifications', n.id, { unread: false }); });
          // Reflect the change immediately on the bell icon before closing.
          updateDots();
          Toast.show({ title: 'Notifications marquées comme lues', icon: 'check' });
          Popover.close();
        });
      }
      document.querySelectorAll('[data-notif]').forEach(el => {
        el.addEventListener('click', () => {
          const id = el.dataset.notif;
          Store.update('notifications', id, { unread: false });
          // Reflect the change immediately on the bell icon before closing.
          updateDots();
          Popover.close();
        });
      });
    };

    const tb = document.getElementById('topbarNotif');
    if (tb) tb.addEventListener('click', (e) => { e.stopPropagation(); openPanel(tb); });
    const mb = document.getElementById('mobileNotifBtn');
    if (mb) mb.addEventListener('click', (e) => { e.stopPropagation(); openPanel(mb); });

    // Initialise dot state on first paint.
    updateDots();
  }

  function wireMobileNav() {
    const btn = document.getElementById('mobileMenuBtn');
    if (!btn) return;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let backdrop = document.querySelector('.mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-backdrop';
      document.body.appendChild(backdrop);
    }
    const open = () => {
      sidebar.classList.add('is-open');
      backdrop.classList.add('is-open');
    };
    const close = () => {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-open');
    };
    btn.addEventListener('click', open);
    backdrop.addEventListener('click', close);
    sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  function wireUserMenu() {
    const user = document.getElementById('userMenu');
    if (!user) return;
    // Direct link to settings
  }

  function init({ pageTitle }) {
    Store.init();
    // If onboarding not completed, redirect user to onboarding page on first open
    try {
      const state = Store.getAll();
      const completed = (state && state.user && state.user.onboardingCompleted) || state.onboardingCompleted;
      const cur = currentPath();
      if (!completed && cur !== 'onboarding.html') {
        // Resolve path depending on whether current document is in /pages/
        const target = isInPagesDir() ? 'onboarding.html' : 'pages/onboarding.html';
        window.location.href = target;
        return; // prevent normal init on onboarding redirect
      }
    } catch (e) {
      // ignore and continue
    }
    const root = document.getElementById('app') || document.body;
    // Ensure the grid layout class is applied (HTML only sets id="app")
    if (root.id === 'app' && !root.classList.contains('app')) {
      root.classList.add('app');
    }

    const sidebarHtml = buildSidebar();
    const topbarHtml = buildTopbar(pageTitle);
    const mobileTopbarHtml = buildMobileTopbar(pageTitle);

    // Build app shell. Existing page content is wrapped into <main>.
    const pageContent = root.querySelector('[data-page-content]') || root.querySelector('main') || null;
    const contentHtml = pageContent ? pageContent.innerHTML : '';
    const pageCls = (pageContent && pageContent.className) ? pageContent.className : 'page';

    root.innerHTML = `
      ${sidebarHtml}
      <div class="main">
        ${mobileTopbarHtml}
        ${topbarHtml}
        <main class="${pageCls}" data-page-content>${contentHtml}</main>
      </div>
    `;

    wireSearch();
    wireNotifications();
    wireMobileNav();
    wireUserMenu();

    // Trigger page init
    if (typeof window.pageInit === 'function') {
      try { window.pageInit(); } catch (e) { console.error('pageInit error', e); }
    }

    // Mini tour guidé : auto-démarre une seule fois après l'onboarding.
    if (typeof window.Tour !== 'undefined' && typeof window.Tour.maybeAutoStart === 'function') {
      setTimeout(() => { try { window.Tour.maybeAutoStart(); } catch (e) { console.error('Tour error', e); } }, 400);
    }
  }

  return { init, NAV, isActive, currentPath, resolveHref, isInPagesDir };
})();

window.App = App;

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const titleEl = document.querySelector('[data-page-title]');
  const title = titleEl ? titleEl.getAttribute('data-page-title') : 'Overview';
  App.init({ pageTitle: title });
});
