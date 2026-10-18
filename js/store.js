/* ============================================================
   ÉLITE — Store (couche données localStorage)
   ============================================================
   API publique :
     Store.init()              -> seed si vide
     Store.get(kind)           -> tableau
     Store.find(kind, id)      -> élément
     Store.add(kind, item)     -> élément créé (avec id)
     Store.update(kind, id, patch) -> élément mis à jour
     Store.remove(kind, id)    -> boolean
     Store.save()              -> persistance explicite
     Store.reset()             -> réinit démo
     Store.subscribe(fn)       -> notifie les changements
   ============================================================ */

const Store = (() => {
  const KEY = 'elite_data_v1';
  let state = null;
  const listeners = new Set();

  function uid(prefix = 'id') {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Store: load failed', e);
      return null;
    }
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Store: persist failed', e);
    }
    listeners.forEach(fn => { try { fn(state); } catch (_) {} });
  }

  function init() {
    if (!state) {
      state = load();
      if (!state) {
        state = JSON.parse(JSON.stringify(window.DEMO_DATA));
        persist();
      }
    }
    return state;
  }

  function getAll() {
    init();
    return state;
  }

  function get(kind) {
    init();
    return state[kind] || [];
  }

  function find(kind, id) {
    return get(kind).find(x => x.id === id) || null;
  }

  // Generate a human-readable, sort-stable id that matches the demo data
  // conventions: F-2026-092 for invoices, c-xxx for clients, d-xxx for
  // demands, r-xxx for reservations, p-xxx for providers, etc.
  function makeId(kind) {
    if (kind === 'invoices') {
      const year = new Date().getFullYear();
      const existing = (state.invoices || [])
        .map(i => (i.id || '').match(/^F-(\d{4})-(\d+)$/))
        .filter(Boolean)
        .map(m => parseInt(m[2], 10));
      const next = (existing.length ? Math.max(...existing) : 0) + 1;
      return `F-${year}-${String(next).padStart(3, '0')}`;
    }
    const prefix = (kind[0] || 'x').toLowerCase();
    return prefix + '-' + Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 5);
  }

  function add(kind, item) {
    init();
    if (!state[kind]) state[kind] = [];
    // Preserve any caller-provided id, otherwise mint a coherent one.
    const obj = { id: makeId(kind), ...item };
    if (kind === 'demands' || kind === 'reservations' || kind === 'invoices') {
      obj.createdAt = obj.createdAt || new Date().toISOString();
    }
    state[kind].unshift(obj);
    persist();
    return obj;
  }

  function update(kind, id, patch) {
    init();
    const list = state[kind] || [];
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...patch, id };
    persist();
    return list[i];
  }

  function remove(kind, id) {
    init();
    const list = state[kind] || [];
    const i = list.findIndex(x => x.id === id);
    if (i === -1) return false;
    list.splice(i, 1);
    persist();
    return true;
  }

  function save() { persist(); }

  function reset() {
    state = JSON.parse(JSON.stringify(window.DEMO_DATA));
    persist();
    return state;
  }

  /* ---------- Espace propre ----------
     Un espace nouvellement créé ("Créer mon espace") ne doit contenir
     AUCUNE donnée fictive. Ces helpers garantissent un état vide et
     cohérent, en préservant uniquement le profil utilisateur. */
  function blankBusinessArrays() {
    return {
      clients: [],
      demands: [],
      reservations: [],
      providers: [],
      invoices: [],
      notifications: [],
      activity: [],
      automations: [],
      monthlyRevenue: [],
      weeklyReservations: [],
      demandsActivity: []
    };
  }

  function createCleanSpace(payload = {}) {
    const base = blankBusinessArrays();
    base.user = payload.user || {};
    base.company = payload.company || {};
    base.user.preferences = base.user.preferences || {
      notifications: { push: true, email: true, urgentOnly: false },
      theme: 'light',
      language: 'fr'
    };
    state = base;
    persist();
    return state;
  }

  // Réinitialise le contenu métier d'un espace (garde le profil et l'entreprise).
  function resetSpace() {
    const user = (state && state.user) || {};
    user.onboardingCompleted = true;
    const company = (state && state.company) || {};
    const clean = createCleanSpace({ user, company });
    if (!clean.user.name) clean.user.name = 'Concierge';
    persist();
    return clean;
  }

  // Vrai si l'espace ne contient encore aucune donnée métier.
  function isEmptySpace() {
    init();
    const kinds = ['clients', 'demands', 'reservations', 'providers', 'invoices'];
    return kinds.every(k => !(state[k] || []).length);
  }

  // Fil d'activité dérivé des données réelles (demandes + réservations + factures).
  // Jamais de faux message : si rien n'existe, on retourne un tableau vide.
  function recentActivity(limit = 6) {
    init();
    const items = [];
    (state.demands || []).forEach(d => {
      const c = clientById(d.clientId);
      items.push({
        date: d.date, time: d.time || null,
        title: (c ? c.name + ' · ' : '') + d.type,
        subtitle: d.description ? d.description.slice(0, 90) : '',
        icon: 'demand',
        accent: d.priority === 'Urgente' ? 'danger' : 'info'
      });
    });
    (state.reservations || []).forEach(r => {
      const c = clientById(r.clientId);
      items.push({
        date: r.date, time: r.time || null,
        title: (c ? c.name + ' · ' : '') + r.service,
        subtitle: r.provider || '',
        icon: 'reservation',
        accent: r.status === 'Confirmée' ? 'success' : r.status === 'Annulée' ? 'danger' : ''
      });
    });
    (state.invoices || []).forEach(i => {
      const c = clientById(i.clientId);
      items.push({
        date: i.date, time: null,
        title: (c ? c.name + ' · ' : '') + (i.service || i.id || 'Facture'),
        subtitle: i.id || '',
        icon: 'invoice',
        accent: 'gold'
      });
    });
    items.sort((a, b) => {
      const ta = (a.date || '') + (a.time || '');
      const tb = (b.date || '') + (b.time || '');
      return tb.localeCompare(ta);
    });
    return items.slice(0, limit);
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  /* Helpers métier */
  function clientById(id) { return find('clients', id); }
  function providerById(id) { return find('providers', id); }
  function demandsByClient(clientId) { return get('demands').filter(d => d.clientId === clientId); }
  function reservationsByClient(clientId) { return get('reservations').filter(r => r.clientId === clientId); }
  function invoicesByClient(clientId) { return get('invoices').filter(i => i.clientId === clientId); }

  function stats() {
    const clients = get('clients');
    const demands = get('demands');
    const reservations = get('reservations');
    const invoices = get('invoices');
    const today = new Date().toISOString().slice(0, 10);
    return {
      activeClients: clients.filter(c => c.status === 'active').length,
      pendingDemands: demands.filter(d => d.status === 'En cours' || d.status === 'Nouvelle' || d.status === 'En attente').length,
      todayReservations: reservations.filter(r => r.date === today).length,
      urgentDemands: demands.filter(d => d.priority === 'Urgente' && d.status !== 'Terminée').length,
      revenue: invoices.filter(i => i.status === 'Payé').reduce((s, i) => s + i.amount, 0),
      pendingInvoices: invoices.filter(i => i.status === 'En attente' || i.status === 'En retard').length
    };
  }

  return {
    init, getAll, get, find, add, update, remove, save, reset, subscribe,
    clientById, providerById, demandsByClient, reservationsByClient, invoicesByClient, stats,
    createCleanSpace, resetSpace, isEmptySpace, recentActivity,
    _uid: uid
  };
})();

window.Store = Store;
