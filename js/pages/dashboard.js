/* ============================================================
   ÉLITE — Page Dashboard / Overview
   ============================================================
   Aucun chiffre fictif : statistiques, graphiques et fil d'activité
   sont dérivés des données réelles. Un espace vide affiche des
   états vides intentionnels et des actions claires.
   ============================================================ */

window.pageInit = function () {
  const user = Store.getAll().user || {};
  const hour = new Date().getHours();
  const greet = hour < 18 ? 'Bonjour' : 'Bonsoir';
  const firstName = (user.name || '').split(' ')[0] || '';
  const titleEl = document.getElementById('welcomeTitle');
  if (titleEl) titleEl.textContent = (greet + ' ' + firstName).trim();

  renderEmptyHero();
  renderStats();
  renderCharts();
  renderActivityRow();
  wireActions();

  /* ---------- Bandeau d'accueil — espace vide ---------- */
  function renderEmptyHero() {
    const statsGrid = document.getElementById('statsGrid');
    const old = document.getElementById('emptyHero');
    if (old) old.remove();
    if (!statsGrid || !Store.isEmptySpace()) return;
    const hero = document.createElement('div');
    hero.className = 'dash-hero';
    hero.id = 'emptyHero';
    hero.innerHTML = '<div class="dash-hero__icon">' + Icon('sparkles', { size: 22 }) + '</div>' +
      '<div><h2 class="dash-hero__title">Bienvenue dans votre espace ÉLITE</h2>' +
      '<p class="dash-hero__desc">Votre conciergerie est prête. Voici les premières actions pour démarrer :</p>' +
      '<div class="dash-hero__actions">' +
      '<a class="btn btn--primary" href="pages/clients.html">' + Icon('clients', { size: 15 }) + ' Ajouter un client</a>' +
      '<a class="btn btn--ghost" href="pages/prestataires.html">' + Icon('provider', { size: 15 }) + ' Ajouter un prestataire</a>' +
      '<a class="btn btn--ghost" href="pages/planning.html">' + Icon('calendar', { size: 15 }) + ' Découvrir le planning</a></div></div>';
    statsGrid.parentElement.insertBefore(hero, statsGrid);
  }

  /* ---------- Statistiques (valeurs réelles, deltas honnêtes) ---------- */
  function renderStats() {
    const clients = Store.get('clients');
    const demands = Store.get('demands');
    const reservations = Store.get('reservations');
    const urgent = demands.filter(d => d.priority === 'Urgente' && d.status !== 'Terminée').length;
    const pending = demands.filter(d => ['En cours', 'Nouvelle', 'En attente'].includes(d.status)).length;
    const todayISO = isoLocal(new Date());
    const todayRes = reservations.filter(r => r.date === todayISO).length;
    const weekRes = reservations.filter(r => {
      if (!r.date) return false;
      const diff = (Date.now() - new Date(r.date).getTime()) / 86400000;
      return diff >= 0 && diff < 7 && !isNaN(diff);
    }).length;
    const now = new Date();
    const monthJoined = clients.filter(c => {
      const d = new Date(c.joinedAt);
      return !isNaN(d) && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;

    const stats = [
      { label: 'Clients', value: clients.length, icon: 'clients', accent: '', up: monthJoined > 0, delta: monthJoined > 0 ? monthJoined + ' nouveau' + (monthJoined > 1 ? 'x' : '') + ' ce mois-ci' : (clients.length === 0 ? 'Commencez par ajouter un client' : 'Portefeuille à jour') },
      { label: 'Demandes en cours', value: pending, icon: 'demand', accent: urgent > 0 ? 'danger' : '', up: false, delta: urgent > 0 ? urgent + ' urgente' + (urgent > 1 ? 's' : '') + ' à traiter' : (demands.length === 0 ? 'Aucune demande pour le moment' : 'Aucune urgence') },
      { label: "Réservations aujourd'hui", value: todayRes, icon: 'reservation', accent: '', up: false, delta: weekRes > 0 ? weekRes + ' cette semaine' : (reservations.length === 0 ? 'Aucune réservation pour le moment' : 'Aucune ce jour') },
      { label: 'Missions urgentes', value: urgent, icon: 'urgent', accent: urgent > 0 ? 'danger' : '', up: false, delta: urgent > 0 ? 'Action requise' : 'Tout est sous contrôle' }
    ];
    document.getElementById('statsGrid').innerHTML = stats.map(st => {
      let deltaIcon = 'clock';
      if (st.label === 'Clients') deltaIcon = 'check';
      if (st.accent === 'danger') deltaIcon = 'urgent';
      const deltaCls = st.up ? 'is-up' : (st.accent === 'danger' ? 'is-down' : 'is-neutral');
      return '<div class="stat ' + (st.accent ? 'stat--' + st.accent : '') + '">' +
        '<div class="stat__accent">' + Icon(st.icon, { size: 15 }) + '</div>' +
        '<div class="stat__label">' + escapeHtml(st.label) + '</div>' +
        '<div class="stat__value">' + st.value + '</div>' +
        '<div class="stat__delta ' + deltaCls + '">' + Icon(deltaIcon, { size: 11 }) + ' ' + escapeHtml(st.delta) + '</div></div>';
    }).join('');
  }

  /* ---------- Graphiques (dérivés des données réelles) ---------- */
  function renderCharts() {
    const root = document.getElementById('chartsRow');
    if (!root) return;
    const demand = demandsActivityData();
    const week = weeklyReservationsData();
    const revenue = monthlyRevenueData();
    // Protect calls to optional chart helpers (may be absent in some builds)
    const demandChart = (typeof lineChartSvg === 'function') ? lineChartSvg(demand) : emptyChart('demand', 'Tendance des demandes', 'Ce graphique se remplira au fil de vos demandes.');
    const weekChart = (typeof barChartSvg === 'function') ? barChartSvg(week) : emptyChart('reservation', 'Réservations de la semaine', 'Ce graphique se remplira au fil de vos réservations.');
    const revenueChart = (typeof barChartSvg === 'function') ? barChartSvg(revenue, { money: true, labelsEvery: 2 }) : emptyChart('invoice', "Chiffre d\\'affaires", 'Ce graphique se remplira au fil de vos factures.');
    root.innerHTML = '<div class="card">' + chartSegment('Pilotage', 'Demandes — 12 dernières semaines', allZero(demand) ? emptyChart('demand', 'Tendance des demandes', 'Ce graphique se remplira au fil de vos demandes.') : demandChart) + '</div>' +
      '<div class="card">' + chartSegment('Activité', 'Réservations — cette semaine', allZero(week) ? emptyChart('reservation', 'Réservations de la semaine', 'Ce graphique se remplira au fil de vos réservations.') : weekChart) + '</div>' +
      '<div class="card">' + chartSegment('Finances', 'CA encaissé — 6 derniers mois', allZero(revenue) ? emptyChart('invoice', "Chiffre d\\'affaires", 'Ce graphique se remplira au fil de vos factures.') : revenueChart) + '</div>';
  }

  function allZero(data) { return data.every(d => d.value === 0); }
  function chartSegment(eyebrow, title, bodyHtml) {
    return '<div class="card__head"><div><div class="eyebrow">' + escapeHtml(eyebrow) + '</div><h3>' + escapeHtml(title) + '</h3></div></div><div class="card__body">' + bodyHtml + '</div>';
  }
  function emptyChart(icon, title, desc) {
    return '<div class="chart-empty">' + Icon(icon, { size: 20 }) + '<div><strong>' + escapeHtml(title) + '</strong><br><span>' + escapeHtml(desc) + '</span></div></div>';
  }

  function isoLocal(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function isoWeekStart(offset) {
    const d = new Date();
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day - offset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function demandsActivityData() {
    const demands = Store.get('demands');
    const out = [];
    for (let i = 11; i >= 0; i--) {
      const start = isoWeekStart(i);
      const end = new Date(start); end.setDate(end.getDate() + 7);
      const count = demands.filter(d => {
        const t = new Date(d.createdAt || d.date);
        return !isNaN(t) && t >= start && t < end;
      }).length;
      out.push({ label: 'S' + (12 - i), value: count });
    }
    return out;
  }

  function weeklyReservationsData() {
    const reservations = Store.get('reservations');
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const start = isoWeekStart(0);
    return labels.map((label, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const iso = isoLocal(d);
      return { label: label, value: reservations.filter(r => r.date === iso).length };
    });
  }

  function monthlyRevenueData() {
    const invoices = Store.get('invoices');
    const out = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const sum = invoices.filter(inv => {
        const t = new Date(inv.date);
        return !isNaN(t) && t.getFullYear() === d.getFullYear() && t.getMonth() === d.getMonth();
      }).reduce((s, inv) => s + (inv.amount || 0), 0);
      out.push({ label: d.toLocaleDateString('fr-FR', { month: 'short' }), value: sum });
    }
    return out;
  }

  /* ---------- Fil d'activité + priorités ---------- */
  function renderActivityRow() {
    const activity = Store.recentActivity(6);
    const urgent = Store.get('demands').filter(d => d.priority === 'Urgente' && d.status !== 'Terminée').slice(0, 6);
    const accentMap = { gold: 'activity-item__icon--gold', success: 'activity-item__icon--success', info: 'activity-item__icon--info', danger: 'activity-item__icon--danger' };

    const activityBody = activity.length ? activity.map(a =>
      '<div class="activity-item">' +
      '<div class="activity-item__icon ' + (accentMap[a.accent] || '') + '">' + Icon(a.icon || 'bell', { size: 15 }) + '</div>' +
      '<div class="activity-item__body">' +
      '<div class="activity-item__title">' + escapeHtml(a.title) + '</div>' +
      (a.subtitle ? '<div class="activity-item__sub">' + escapeHtml(a.subtitle) + '</div>' : '') +
      '</div><div class="activity-item__time">' + escapeHtml(fmt.dateShort(a.date)) + (a.time ? ' · ' + escapeHtml(a.time) : '') + '</div></div>'
    ).join('') :
    '<div class="empty empty--compact">' + Icon('clock', { size: 20 }) +
      '<div class="empty__title">Aucune activité pour le moment</div>' +
      '<div class="empty__desc">Les actions de votre équipe apparaîtront ici automatiquement.</div></div>';

    const urgentHtml = urgent.length ? urgent.map(d => {
      const c = Store.clientById(d.clientId);
      return '<a href="pages/demandes.html?focus=' + d.id + '" class="activity-item" style="text-decoration:none; color:inherit;">' +
        '<div class="activity-item__icon" style="background: var(--danger-soft); color: var(--danger);">' + Icon('urgent', { size: 15 }) + '</div>' +
        '<div class="activity-item__body">' +
        '<div class="activity-item__title">' + escapeHtml(d.type) + ' — ' + escapeHtml((c && c.name) || 'Client') + '</div>' +
        '<div class="activity-item__sub">' + escapeHtml(d.description.slice(0, 80)) + (d.description.length > 80 ? '…' : '') + '</div>' +
        '</div><div class="activity-item__time">' + fmt.dateShort(d.date) + (d.time ? ' · ' + d.time : '') + '</div></a>';
    }).join('') :
    '<div class="empty empty--compact">' + Icon('check', { size: 20 }) +
      '<div class="empty__title">Aucune urgence</div>' +
      '<div class="empty__desc">Toutes les demandes urgentes sont traitées.</div></div>';

    document.getElementById('activityRow').innerHTML =
      '<div class="card"><div class="card__head"><div><div class="eyebrow">Fil</div><h3>Activité récente</h3></div>' +
      (activity.length ? '<a href="pages/demandes.html" class="btn btn--subtle btn--sm">Tout voir</a>' : '') +
      '</div><div class="card__body--flush">' + activityBody + '</div></div>' +
      '<div class="card"><div class="card__head"><div><div class="eyebrow">Action requise</div><h3>Priorités</h3></div>' +
      (urgent.length ? '<span class="badge badge--danger"><span class="dot"></span>' + urgent.length + ' urgen' + (urgent.length > 1 ? 'tes' : 'te') + '</span>' : '<span class="badge badge--success"><span class="dot"></span>À jour</span>') +
      '</div><div class="card__body--flush">' + urgentHtml + '</div></div>';
  }

  function wireActions() {
    const qd = document.getElementById('quickDemand');
    if (qd) qd.addEventListener('click', () => { location.href = 'pages/demandes.html?new=1'; });
    const qr = document.getElementById('quickReservation');
    if (qr) qr.addEventListener('click', () => { location.href = 'pages/reservations.html?new=1'; });
  }
};