/* ============================================================
   ÉLITE — Page Réservations
   ============================================================ */

window.pageInit = function () {
  const SERVICES = ['Tous', 'Restaurant', 'Hôtel', 'Transport', 'Voyage', 'Shopping', 'Événement', 'Billetterie', 'Spa'];
  const STATUSES = ['Tous', 'En attente', 'Confirmée', 'Annulée', 'Terminée'];

  const state = { q: '', service: 'Tous', status: 'Tous' };

  const params = new URLSearchParams(location.search);
  if (params.get('new') === '1') {
    history.replaceState(null, '', location.pathname);
    setTimeout(() => openForm(null), 300);
  }
  const focusId = params.get('focus');
  if (focusId) history.replaceState(null, '', location.pathname);

  renderToolbar();
  renderList();
  wireActions();

  function renderToolbar() {
    document.getElementById('resToolbar').innerHTML = `
      <div class="input-group toolbar__search">
        ${Icon('search', { size: 15 })}
        <input type="text" id="searchInput" placeholder="Rechercher par client, prestataire…" />
      </div>
      <div class="toolbar__group">
        <span class="muted-2" style="font-size:12px;">Service</span>
        <select class="select" id="serviceFilter" style="width: auto; padding-right: 30px;">
          ${SERVICES.map(s => `<option value="${s}" ${s === state.service ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar__group">
        <span class="muted-2" style="font-size:12px;">Statut</span>
        <select class="select" id="statusFilter" style="width: auto; padding-right: 30px;">
          ${STATUSES.map(s => `<option value="${s}" ${s === state.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar__spacer"></div>
      <div class="muted-2" id="resultCount" style="font-size:12px;"></div>
    `;
    document.getElementById('searchInput').addEventListener('input', (e) => { state.q = e.target.value.toLowerCase().trim(); renderList(); });
    document.getElementById('serviceFilter').addEventListener('change', (e) => { state.service = e.target.value; renderList(); });
    document.getElementById('statusFilter').addEventListener('change', (e) => { state.status = e.target.value; renderList(); });
  }

  function getFiltered() {
    let list = Store.get('reservations').slice();
    if (state.q) {
      list = list.filter(r => {
        const c = Store.clientById(r.clientId);
        const hay = (r.service + ' ' + r.provider + ' ' + (c?.name || '')).toLowerCase();
        return hay.includes(state.q);
      });
    }
    if (state.service !== 'Tous') list = list.filter(r => r.service === state.service);
    if (state.status !== 'Tous') list = list.filter(r => r.status === state.status);
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }

  function renderList() {
    const list = getFiltered();
    document.getElementById('resultCount').textContent = `${list.length} réservation${list.length > 1 ? 's' : ''}`;
    document.getElementById('resSubtitle').textContent = `Toutes les réservations · ${list.length} résultat${list.length > 1 ? 's' : ''}`;

    const root = document.getElementById('resList');
    if (!list.length) {
      root.innerHTML = `<div class="card"><div class="empty">
        <div class="empty__icon">${Icon('reservation', { size: 22 })}</div>
        <div class="empty__title">Aucune réservation</div>
        <div class="empty__desc">Ajustez vos filtres ou créez une nouvelle réservation.</div>
        <div class="empty__action"><button class="btn btn--primary" onclick="document.getElementById('newResBtn').click()">+ Nouvelle réservation</button></div>
      </div></div>`;
      return;
    }

    // Stats line
    const total = list.reduce((s, r) => s + (r.price || 0), 0);
    const confirmed = list.filter(r => r.status === 'Confirmée').length;

    root.innerHTML = `
      <div class="dash-grid mb-4" style="grid-template-columns: repeat(3, 1fr);">
        <div class="stat">
          <div class="stat__accent">${Icon('reservation', { size: 15 })}</div>
          <div class="stat__label">Total réservations</div>
          <div class="stat__value">${list.length}</div>
        </div>
        <div class="stat stat--gold">
          <div class="stat__accent">${Icon('check', { size: 15 })}</div>
          <div class="stat__label">Confirmées</div>
          <div class="stat__value">${confirmed}</div>
        </div>
        <div class="stat">
          <div class="stat__accent">${Icon('payment', { size: 15 })}</div>
          <div class="stat__label">Montant cumulé</div>
          <div class="stat__value" style="font-size: 22px;">${fmt.money(total)}</div>
        </div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Prestataire</th>
                <th>Date</th>
                <th class="col-right">Prix</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${list.map(r => {
                const c = Store.clientById(r.clientId);
                return `
                <tr data-res="${r.id}" class="row-clickable ${focusId === r.id ? 'is-highlighted' : ''}">
                  <td>
                    <div class="cell-client">
                      ${avatar(c, 'sm')}
                      <div>
                        <div class="cell-client__name">${escapeHtml(c?.name || 'Client supprimé')}</div>
                        <div class="cell-client__sub">${escapeHtml(c?.city || '')}</div>
                      </div>
                    </div>
                  </td>
                  <td><strong>${escapeHtml(r.service)}</strong></td>
                  <td class="muted">${escapeHtml(r.provider)}</td>
                  <td class="col-nowrap muted">${escapeHtml(fmt.dateShort(r.date))}${r.time ? ' · ' + r.time : ''}</td>
                  <td class="col-right tabular">${r.price ? escapeHtml(fmt.money(r.price)) : '—'}</td>
                  <td>${statusBadge(r.status)}</td>
                  <td><button class="btn btn--icon btn--subtle btn--sm" data-menu="${r.id}">${Icon('more', { size: 14 })}</button></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    root.querySelectorAll('tr[data-res]').forEach(tr => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('[data-menu]')) return;
        openForm(tr.dataset.res);
      });
    });
    root.querySelectorAll('[data-menu]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openActionMenu(btn, btn.dataset.menu);
      });
    });
  }

  function openActionMenu(anchor, resId) {
    const r = Store.find('reservations', resId);
    if (!r) return;
    const pop = Popover.open({
      anchor, width: 220,
      render: () => `
        <div style="padding: 6px;">
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="edit">${Icon('edit', { size: 14 })} Modifier</button>
          ${r.status !== 'Confirmée' ? `<button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="confirm">${Icon('check', { size: 14 })} Marquer confirmée</button>` : ''}
          ${r.status !== 'Annulée' ? `<button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="cancel">${Icon('close', { size: 14 })} Annuler</button>` : ''}
          <div class="divider"></div>
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start; color: var(--danger);" data-act="delete">${Icon('trash', { size: 14 })} Supprimer</button>
        </div>
      `
    });
    const el = pop.el;
    el.querySelector('[data-act="edit"]').addEventListener('click', () => { Popover.close(); openForm(resId); });
    const c = el.querySelector('[data-act="confirm"]');
    if (c) c.addEventListener('click', () => {
      Popover.close();
      Store.update('reservations', resId, { status: 'Confirmée' });
      Store.add('notifications', {
        icon: 'check', accent: 'success', title: 'Réservation confirmée',
        message: `${r.service} pour ${Store.clientById(r.clientId)?.name || 'client'} — ${r.provider}.`,
        time: 'à l\'instant', unread: true
      });
      Toast.show({ title: 'Réservation confirmée', icon: 'check' });
      renderList();
    });
    const x = el.querySelector('[data-act="cancel"]');
    if (x) x.addEventListener('click', () => {
      Popover.close();
      Store.update('reservations', resId, { status: 'Annulée' });
      Toast.show({ title: 'Réservation annulée', icon: 'close' });
      renderList();
    });
    el.querySelector('[data-act="delete"]').addEventListener('click', async () => {
      Popover.close();
      const ok = await Modal.confirm({ title: 'Supprimer la réservation', message: 'Cette action est définitive.', confirmLabel: 'Supprimer', danger: true });
      if (ok) { Store.remove('reservations', resId); Toast.show({ title: 'Réservation supprimée', icon: 'trash' }); renderList(); }
    });
  }

  function openForm(resId) {
    const r = resId ? Store.find('reservations', resId) : null;
    const clients = Store.get('clients');
    const providers = Store.get('providers');
    const services = ['Restaurant', 'Hôtel', 'Transport', 'Voyage', 'Shopping', 'Événement', 'Billetterie', 'Spa'];
    const statuses = ['En attente', 'Confirmée', 'Annulée', 'Terminée'];

    const body = `
      <div class="grid grid-2">
        <div class="field">
          <label class="field__label">Client</label>
          <select class="select" id="r_client">
            ${clients.map(c => `<option value="${c.id}" ${r?.clientId === c.id ? 'selected' : ''}>${escapeHtml(c.name)} · ${escapeHtml(c.tier)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="field__label">Service</label>
          <select class="select" id="r_service">
            ${services.map(s => `<option value="${s}" ${r?.service === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="grid-column: 1 / -1;">
          <label class="field__label">Prestataire</label>
          <input class="input" id="r_provider" list="providersList" value="${escapeHtml(r?.provider || '')}" placeholder="Le Cinq — Four Seasons" />
          <datalist id="providersList">
            ${providers.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.category)} · ${escapeHtml(p.city)}</option>`).join('')}
          </datalist>
        </div>
        <div class="field">
          <label class="field__label">Date</label>
          <input class="input" id="r_date" type="date" value="${r?.date || new Date().toISOString().slice(0, 10)}" />
        </div>
        <div class="field">
          <label class="field__label">Heure</label>
          <input class="input" id="r_time" type="time" value="${r?.time || ''}" />
        </div>
        <div class="field">
          <label class="field__label">Prix (€)</label>
          <input class="input" id="r_price" type="number" min="0" value="${r?.price || ''}" placeholder="0" />
        </div>
        <div class="field">
          <label class="field__label">Statut</label>
          <select class="select" id="r_status">
            ${statuses.map(s => `<option value="${s}" ${r?.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Annuler</button>
      ${r ? `<button class="btn btn--ghost" data-delete style="color: var(--danger);">${Icon('trash', { size: 14 })} Supprimer</button>` : ''}
      <button class="btn btn--primary" data-save>${Icon('check', { size: 14 })} ${r ? 'Enregistrer' : 'Créer la réservation'}</button>
    `;
    const m = Modal.open({ title: r ? 'Modifier la réservation' : 'Nouvelle réservation', body, footer });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-save]').addEventListener('click', () => {
      const data = {
        clientId: m.el.querySelector('#r_client').value,
        service: m.el.querySelector('#r_service').value,
        provider: m.el.querySelector('#r_provider').value.trim() || '—',
        date: m.el.querySelector('#r_date').value,
        time: m.el.querySelector('#r_time').value || null,
        price: parseInt(m.el.querySelector('#r_price').value) || 0,
        status: m.el.querySelector('#r_status').value
      };
      if (r) {
        Store.update('reservations', resId, data);
        Toast.show({ title: 'Réservation mise à jour', icon: 'check' });
      } else {
        const created = Store.add('reservations', data);
        if (created.status === 'Confirmée') {
          Store.add('notifications', {
            icon: 'check', accent: 'success', title: 'Réservation confirmée',
            message: `${created.service} pour ${Store.clientById(created.clientId)?.name || 'client'}.`,
            time: 'à l\'instant', unread: true
          });
        }
        Toast.show({ title: 'Réservation créée', icon: 'check' });
      }
      m.close();
      renderList();
    });
    const delBtn = m.el.querySelector('[data-delete]');
    if (delBtn) delBtn.addEventListener('click', async () => {
      m.close();
      const ok = await Modal.confirm({ title: 'Supprimer la réservation', message: 'Cette action est définitive.', confirmLabel: 'Supprimer', danger: true });
      if (ok) { Store.remove('reservations', resId); Toast.show({ title: 'Réservation supprimée', icon: 'trash' }); renderList(); }
    });
  }

  function wireActions() {
    document.getElementById('newResBtn').addEventListener('click', () => openForm(null));
  }
};
