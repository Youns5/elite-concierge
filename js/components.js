/* ============================================================
   ÉLITE — Composants UI réutilisables
   ============================================================
   - Modal
   - Toast
   - Popover / Notifications
   - Command palette
   - Helpers (formatDate, formatMoney, escapeHtml)
   ============================================================ */

/* ---------- Helpers ---------- */
const fmt = {
  money(n) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);
  },
  moneyExact(n) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
  },
  date(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  },
  dateShort(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  },
  time(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  },
  relative(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff/3600)} h`;
    return `il y a ${Math.floor(diff/86400)} j`;
  },
  initials(name) {
    if (!name) return '?';
    return name.split(/\s+/).map(p => p[0]).slice(0,2).join('').toUpperCase();
  }
};

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ---------- Tier badge ---------- */
function tierBadge(tier) {
  const cls = tier === 'VIP' ? 'tag-vip' : tier === 'Elite' ? 'tag-elite' : 'tag-private';
  return `<span class="badge ${cls}">${escapeHtml(tier)}</span>`;
}

/* ---------- Status badge ---------- */
function statusBadge(status) {
  const map = {
    'Nouvelle':     'badge--info',
    'En cours':     'badge--warning',
    'En attente':   'badge--neutral',
    'Confirmée':    'badge--success',
    'Terminée':     'badge--success',
    'Annulée':      'badge--danger',
    'Payé':         'badge--success',
    'En retard':    'badge--danger',
    'Actif':        'badge--success',
    'Inactif':      'badge--neutral'
  };
  const cls = map[status] || 'badge--neutral';
  return `<span class="badge ${cls}"><span class="dot"></span>${escapeHtml(status)}</span>`;
}

function priorityBadge(p) {
  if (p === 'Urgente') return `<span class="badge badge--danger"><span class="dot"></span>Urgente</span>`;
  if (p === 'Importante') return `<span class="badge badge--warning"><span class="dot"></span>Importante</span>`;
  return `<span class="badge badge--neutral"><span class="dot"></span>Normale</span>`;
}

/* ---------- Avatar ---------- */
function avatar(client, size = '') {
  const cls = ['avatar'];
  if (size) cls.push('avatar--' + size);
  if (client && client.tier === 'VIP') cls.push('avatar--gold');
  const name = (client && client.name) ? client.name : '?';
  return `<div class="${cls.join(' ')}">${escapeHtml(fmt.initials(name))}</div>`;
}

/* ---------- Empty state (état vide professionnel) ----------
   Utilisé partout où aucune donnée ne doit être présentée comme une
   erreur : un espace vide est un état normal et intentionnel. */
function emptyState({ icon = 'info', title = 'Aucune donnée', desc = '', action = '' } = {}) {
  return `
    <div class="empty">
      <div class="empty__icon">${Icon(icon, { size: 22 })}</div>
      <div class="empty__title">${escapeHtml(title)}</div>
      ${desc ? `<div class="empty__desc">${escapeHtml(desc)}</div>` : ''}
      ${action ? `<div class="empty__action">${action}</div>` : ''}
    </div>`;
}

/* ---------- Modal ---------- */
const Modal = (() => {
  function open({ title, subtitle, body, footer, size = '', onClose }) {
    let closed = false;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    const cls = ['modal'];
    if (size) cls.push('modal--' + size);
    overlay.innerHTML = `
      <div class="${cls.join(' ')}" role="dialog" aria-modal="true">
        <div class="modal__head">
          <div>
            <div class="modal__title">${title || ''}</div>
            ${subtitle ? `<div class="modal__sub">${subtitle}</div>` : ''}
          </div>
          <button class="modal__close" data-modal-close aria-label="Fermer">${Icon('close', { size: 16 })}</button>
        </div>
        ${body ? `<div class="modal__body">${body}</div>` : ''}
        ${footer ? `<div class="modal__foot">${footer}</div>` : ''}
      </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
    };
    const handleClose = () => close();

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleClose();
    });
    overlay.querySelector('[data-modal-close]').addEventListener('click', handleClose);
    document.addEventListener('keydown', handleKey);

    function close(silent = false) {
      if (closed) return; closed = true;
      overlay.style.opacity = '0';
      const m = overlay.querySelector('.modal');
      if (m) m.style.transform = 'translateY(8px) scale(0.98)';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
        if (!silent && typeof onClose === 'function') onClose();
      }, 180);
    }

    // Focus the first useful field: prefer a form input in the body, then a
    // primary action button in the footer, only fall back to the close button.
    setTimeout(() => {
      const f = overlay.querySelector('.modal__body input, .modal__body textarea, .modal__body select')
             || overlay.querySelector('.modal__foot button:not([data-cancel])')
             || overlay.querySelector('[data-modal-close]');
      if (f) f.focus();
    }, 80);

    return { close, el: overlay };
  }

  function confirm({ title = 'Confirmer', message = '', confirmLabel = 'Confirmer', danger = false }) {
    return new Promise((resolve) => {
      const m = open({
        title,
        subtitle: null,
        body: `<div style="padding: 4px 0; color: var(--ink-3); font-size: 14px; line-height: 1.55;">${escapeHtml(message)}</div>`,
        footer: `
          <button class="btn btn--subtle" data-cancel>${Icon('close', { size: 14 })} Annuler</button>
          <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-confirm>${Icon('check', { size: 14 })} ${escapeHtml(confirmLabel)}</button>
        `,
        size: 'sm',
        onClose: () => resolve(false)
      });
      m.el.querySelector('[data-cancel]').addEventListener('click', () => { m.close(); resolve(false); });
      m.el.querySelector('[data-confirm]').addEventListener('click', () => { m.close(); resolve(true); });
    });
  }

  return { open, confirm };
})();

/* ---------- Toast ---------- */
const Toast = (() => {
  let stack = null;
  function getStack() {
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    return stack;
  }
  function show({ title, message, icon = 'check', duration = 3200 }) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <div class="toast__icon">${Icon(icon, { size: 18 })}</div>
      <div>
        <div class="toast__title">${escapeHtml(title)}</div>
        ${message ? `<div class="toast__msg">${escapeHtml(message)}</div>` : ''}
      </div>`;
    getStack().appendChild(el);
    setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 220);
    }, duration);
  }
  return { show };
})();

/* ---------- Popover (notifications, menus) ---------- */
const Popover = (() => {
  let current = null;
  function open({ anchor, render, onClose, width }) {
    close();
    const pop = document.createElement('div');
    pop.className = 'popover';
    if (width) pop.style.width = width + 'px';
    pop.innerHTML = render();
    document.body.appendChild(pop);
    const rect = anchor.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.right - pop.offsetWidth;
    if (left < 12) left = 12;
    if (top + pop.offsetHeight > window.innerHeight - 12) top = rect.top - pop.offsetHeight - 8;
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
    current = { el: pop, onClose };

    const handleKey = (e) => { if (e.key === 'Escape') close(); };
    const handleOutside = (e) => {
      if (!pop.contains(e.target) && !anchor.contains(e.target)) close();
    };
    setTimeout(() => {
      document.addEventListener('click', handleOutside);
      document.addEventListener('keydown', handleKey);
    }, 0);

    function close() {
      if (!current) return;
      const c = current; current = null;
      c.el.style.opacity = '0';
      c.el.style.transform = 'translateY(-4px) scale(0.98)';
      setTimeout(() => c.el.remove(), 140);
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('keydown', handleKey);
      if (typeof c.onClose === 'function') c.onClose();
    }
    return { close, el: pop };
  }
  function close() {
    if (current) {
      const c = current; current = null;
      c.el.remove();
      if (typeof c.onClose === 'function') c.onClose();
    }
  }
  return { open, close };
})();

/* ---------- Command palette ---------- */
const CommandPalette = (() => {
  let isOpen = false;
  let panel = null;
  let activeIndex = 0;
  let items = [];

  function build() {
    const overlay = document.createElement('div');
    overlay.className = 'cmdk';
    overlay.innerHTML = `
      <div class="cmdk__panel" role="dialog" aria-modal="true" aria-label="Recherche globale">
        <div class="cmdk__input-row">
          ${Icon('search', { size: 17 })}
          <input class="cmdk__input" type="text" placeholder="Rechercher un client, une demande, une réservation…" autocomplete="off" />
          <span class="cmdk__esc">ESC</span>
        </div>
        <div class="cmdk__list"></div>
        <div class="cmdk__foot">
          <span><span class="kbd">↑↓</span> naviguer</span>
          <span><span class="kbd">↵</span> ouvrir</span>
          <span><span class="kbd">esc</span> fermer</span>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const input = overlay.querySelector('.cmdk__input');
    const list = overlay.querySelector('.cmdk__list');

    input.addEventListener('input', () => render(list, input.value));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    const handleKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, items.length - 1); paint(list); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); paint(list); }
      else if (e.key === 'Enter')     { e.preventDefault(); const it = items[activeIndex]; if (it) { it.action(); close(); } }
    };
    document.addEventListener('keydown', handleKey);

    function render(list, q) {
      q = (q || '').trim().toLowerCase();
      const matches = computeItems(q);
      items = matches;
      activeIndex = 0;
      paint(list);
    }

    function paint(list) {
      if (!items.length) {
        let emptyHtml;
        const hasData = Store.get('clients').length || Store.get('demands').length ||
          Store.get('reservations').length || Store.get('providers').length;
        if (!hasData) {
          emptyHtml = `
            <div class="cmdk__empty">
              <div class="cmdk__empty-icon">${Icon('sparkles', { size: 18 })}</div>
              <div class="cmdk__empty-title">Votre espace est encore vide</div>
              <div class="cmdk__empty-desc">Ajoutez votre premier client pour commencer à utiliser ÉLITE.</div>
            </div>`;
        } else {
          emptyHtml = `
            <div class="cmdk__empty">
              <div class="cmdk__empty-icon">${Icon('search', { size: 18 })}</div>
              <div class="cmdk__empty-title">Aucun résultat</div>
              <div class="cmdk__empty-desc">Essayez un nom, un type de demande, un prestataire ou une ville.</div>
            </div>`;
        }
        list.innerHTML = emptyHtml;
        return;
      }
      // Group items
      const groups = {};
      items.forEach((it, i) => {
        const g = it.group || 'Résultats';
        if (!groups[g]) groups[g] = [];
        groups[g].push({ ...it, _i: i });
      });
      let html = '';
      Object.keys(groups).forEach(g => {
        html += `<div class="cmdk__group-label">${escapeHtml(g)}</div>`;
        groups[g].forEach(it => {
          html += `
            <div class="cmdk__item ${it._i === activeIndex ? 'is-active' : ''}" data-idx="${it._i}">
              <div class="cmdk__item-icon">${Icon(it.icon || 'search', { size: 14 })}</div>
              <div>
                <div class="cmdk__item-label">${escapeHtml(it.label)}</div>
                ${it.hint ? `<div class="cmdk__item-hint">${escapeHtml(it.hint)}</div>` : ''}
              </div>
              ${Icon('chevronRight', { size: 14, class: 'cmdk__item-arrow' })}
            </div>`;
        });
      });
      list.innerHTML = html;
      list.querySelectorAll('.cmdk__item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.idx, 10);
          const it = items[idx];
          if (it) { it.action(); close(); }
        });
        el.addEventListener('mouseenter', () => {
          activeIndex = parseInt(el.dataset.idx, 10);
          list.querySelectorAll('.cmdk__item').forEach(x => x.classList.remove('is-active'));
          el.classList.add('is-active');
        });
      });
    }

    render(list, '');
    setTimeout(() => input.focus(), 60);

    return {
      close() {
        overlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
      }
    };
  }

  // Local path resolver — mirrors App.resolveHref so CommandPalette works
  // from any page (root or /pages/). Falls back gracefully if App is missing.
  function resolveHref(logicalHref) {
    const inPages = /\/pages\/[^/]*$/.test(location.pathname);
    if (logicalHref === 'index.html') {
      return inPages ? '../index.html' : 'index.html';
    }
    if (inPages) {
      return logicalHref.replace(/^pages\//, '');
    }
    return logicalHref;
  }

  function computeItems(q) {
    const out = [];
    const clients = Store.get('clients');
    const demands = Store.get('demands');
    const reservations = Store.get('reservations');
    const providers = Store.get('providers');

    if (!q) {
      // Show suggestions
      out.push({ group: 'Navigation', icon: 'dashboard', label: 'Aller à l\'Overview', action: () => location.href = resolveHref('index.html') });
      out.push({ group: 'Navigation', icon: 'clients', label: 'Aller aux Clients', action: () => location.href = resolveHref('pages/clients.html') });
      out.push({ group: 'Navigation', icon: 'demand', label: 'Aller aux Demandes', action: () => location.href = resolveHref('pages/demandes.html') });
      out.push({ group: 'Navigation', icon: 'reservation', label: 'Aller aux Réservations', action: () => location.href = resolveHref('pages/reservations.html') });
      out.push({ group: 'Navigation', icon: 'calendar', label: 'Aller au Planning', action: () => location.href = resolveHref('pages/planning.html') });

      // Recent clients
      clients.slice(0, 4).forEach(c => {
        out.push({ group: 'Clients récents', icon: 'clients', label: c.name, hint: `${c.tier} · ${c.city}`, action: () => location.href = `${resolveHref('pages/client-detail.html')}?id=${c.id}` });
      });
      return out;
    }

    clients.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) {
        out.push({ group: 'Clients', icon: 'clients', label: c.name, hint: `${c.tier} · ${c.city}`, action: () => location.href = `${resolveHref('pages/client-detail.html')}?id=${c.id}` });
      }
    });
    demands.forEach(d => {
      const client = Store.clientById(d.clientId);
      const hay = (d.description + ' ' + d.type + ' ' + (client?.name || '')).toLowerCase();
      if (hay.includes(q)) {
        out.push({ group: 'Demandes', icon: 'demand', label: d.type + ' — ' + (client?.name || 'Client'), hint: d.description.slice(0, 60), action: () => location.href = `${resolveHref('pages/demandes.html')}?focus=${d.id}` });
      }
    });
    reservations.forEach(r => {
      const client = Store.clientById(r.clientId);
      const hay = (r.service + ' ' + r.provider + ' ' + (client?.name || '')).toLowerCase();
      if (hay.includes(q)) {
        out.push({ group: 'Réservations', icon: 'reservation', label: r.service + ' — ' + (client?.name || 'Client'), hint: `${r.provider} · ${fmt.dateShort(r.date)}`, action: () => location.href = `${resolveHref('pages/reservations.html')}?focus=${r.id}` });
      }
    });
    providers.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)) {
        out.push({ group: 'Prestataires', icon: 'provider', label: p.name, hint: `${p.category} · ${p.city}`, action: () => location.href = `${resolveHref('pages/prestataires.html')}?focus=${p.id}` });
      }
    });
    return out.slice(0, 14);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    panel = build();
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    if (panel) panel.close();
    panel = null;
  }
  function toggle() { isOpen ? close() : open(); }
  return { open, close, toggle };
})();

window.helpers = { fmt, escapeHtml, tierBadge, statusBadge, priorityBadge, avatar, emptyState };
/* Compatibilité : certains snippets utilisent `icon(...)` (minuscule).
   On s'assure que TPS  a une valeur même si une faute de frappe subsiste. */
if (typeof window.icon !== 'function') { window.icon = window.Icon || function () { return ''; }; }
window.Modal = Modal;
window.Toast = Toast;
window.Popover = Popover;
window.CommandPalette = CommandPalette;
