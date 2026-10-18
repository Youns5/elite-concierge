/* ============================================================
   ÉLITE — Page Demandes
   ============================================================ */

window.pageInit = function () {
  const TYPES = ['Tous', 'Restaurant', 'Hôtel', 'Transport', 'Voyage', 'Shopping', 'Événement', 'Billetterie', 'Spa', 'Autre'];
  const STATUSES = ['Tous', 'Nouvelle', 'En cours', 'En attente', 'Confirmée', 'Terminée'];
  const PRIORITIES = ['Tous', 'Normale', 'Importante', 'Urgente'];

  const state = {
    q: '',
    type: 'Tous',
    status: 'Tous',
    priority: 'Tous'
  };

  // URL params
  const params = new URLSearchParams(location.search);
  const focusId = params.get('focus');
  if (params.get('new') === '1') {
    history.replaceState(null, '', location.pathname);
    setTimeout(() => openNewDemandModal(params.get('client')), 300);
  }
  if (focusId) {
    history.replaceState(null, '', location.pathname);
  }

  renderToolbar();
  renderList();
  wireActions();

  function renderToolbar() {
    document.getElementById('demandsToolbar').innerHTML = `
      <div class="input-group toolbar__search">
        ${Icon('search', { size: 15 })}
        <input type="text" id="searchInput" placeholder="Rechercher une demande, un client…" />
      </div>
      <div class="toolbar__group">
        <span class="muted-2" style="font-size:12px;">Type</span>
        <select class="select" id="typeFilter" style="width: auto; padding-right: 30px;">
          ${TYPES.map(t => `<option value="${t}" ${t === state.type ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar__group">
        <span class="muted-2" style="font-size:12px;">Priorité</span>
        <select class="select" id="prioFilter" style="width: auto; padding-right: 30px;">
          ${PRIORITIES.map(p => `<option value="${p}" ${p === state.priority ? 'selected' : ''}>${p}</option>`).join('')}
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

    document.getElementById('searchInput').addEventListener('input', (e) => {
      state.q = e.target.value.toLowerCase().trim();
      renderList();
    });
    document.getElementById('typeFilter').addEventListener('change', (e) => { state.type = e.target.value; renderList(); });
    document.getElementById('prioFilter').addEventListener('change', (e) => { state.priority = e.target.value; renderList(); });
    document.getElementById('statusFilter').addEventListener('change', (e) => { state.status = e.target.value; renderList(); });
  }

  function getFiltered() {
    let list = Store.get('demands').slice();
    if (state.q) {
      list = list.filter(d => {
        const c = Store.clientById(d.clientId);
        const hay = (d.description + ' ' + d.type + ' ' + (c?.name || '')).toLowerCase();
        return hay.includes(state.q);
      });
    }
    if (state.type !== 'Tous') list = list.filter(d => d.type === state.type);
    if (state.status !== 'Tous') list = list.filter(d => d.status === state.status);
    if (state.priority !== 'Tous') list = list.filter(d => d.priority === state.priority);
    list.sort((a, b) => {
      // Urgente first, then by date desc
      const prio = { 'Urgente': 0, 'Importante': 1, 'Normale': 2 };
      if (prio[a.priority] !== prio[b.priority]) return prio[a.priority] - prio[b.priority];
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return list;
  }

  function renderList() {
    const list = getFiltered();
    document.getElementById('resultCount').textContent = `${list.length} demande${list.length > 1 ? 's' : ''}`;
    document.getElementById('demandsSubtitle').textContent = `Suivi des demandes clients · ${list.length} résultat${list.length > 1 ? 's' : ''}`;

    const root = document.getElementById('demandsList');
    if (!list.length) {
      root.innerHTML = `
        <div class="card">
          <div class="empty">
            <div class="empty__icon">${Icon('demand', { size: 22 })}</div>
            <div class="empty__title">Aucune demande trouvée</div>
            <div class="empty__desc">Ajustez vos filtres ou créez une nouvelle demande.</div>
            <div class="empty__action">
              <button class="btn btn--primary" onclick="document.getElementById('newDemandBtn').click()">+ Nouvelle demande</button>
            </div>
          </div>
        </div>`;
      return;
    }

    root.innerHTML = `
      <div class="card">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Priorité</th>
                <th>Responsable</th>
                <th>Budget</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${list.map(d => {
                const c = Store.clientById(d.clientId);
                return `
                <tr data-demand="${d.id}" class="${focusId === d.id ? 'is-highlighted' : ''}">
                  <td>
                    <div class="cell-client">
                      ${avatar(c, 'sm')}
                      <div>
                        <div class="cell-client__name">${escapeHtml(c?.name || 'Client supprimé')}</div>
                        <div class="cell-client__sub">${escapeHtml(c?.city || '')}</div>
                      </div>
                    </div>
                  </td>
                  <td><strong>${escapeHtml(d.type)}</strong></td>
                  <td style="max-width: 260px;">${escapeHtml(d.description.slice(0, 80))}${d.description.length > 80 ? '…' : ''}</td>
                  <td class="col-nowrap muted">${escapeHtml(fmt.dateShort(d.date))}${d.time ? ' · ' + d.time : ''}</td>
                  <td>${priorityBadge(d.priority)}</td>
                  <td class="muted">${escapeHtml(d.assignee || '—')}</td>
                  <td class="tabular">${d.budget ? escapeHtml(fmt.money(d.budget)) : '—'}</td>
                  <td>${statusBadge(d.status)}</td>
                  <td>
                    <button class="btn btn--icon btn--subtle btn--sm" data-menu="${d.id}">${Icon('more', { size: 14 })}</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Row click → open detail modal
    root.querySelectorAll('tr[data-demand]').forEach(tr => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('[data-menu]')) return;
        openDemandModal(tr.dataset.demand);
      });
    });

    // Action menus
    root.querySelectorAll('[data-menu]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openActionMenu(btn, btn.dataset.menu);
      });
    });
  }

  function openActionMenu(anchor, demandId) {
    const d = Store.find('demands', demandId);
    if (!d) return;
    const pop = Popover.open({
      anchor,
      width: 220,
      render: () => `
        <div style="padding: 6px;">
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="view">${Icon('eye', { size: 14 })} Voir le détail</button>
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="status">${Icon('check', { size: 14 })} Changer le statut</button>
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="edit">${Icon('edit', { size: 14 })} Modifier</button>
          <div class="divider"></div>
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start; color: var(--danger);" data-act="delete">${Icon('trash', { size: 14 })} Supprimer</button>
        </div>
      `
    });
    const el = pop.el;
    el.querySelector('[data-act="view"]').addEventListener('click', () => { Popover.close(); openDemandModal(demandId); });
    el.querySelector('[data-act="status"]').addEventListener('click', () => { Popover.close(); openStatusModal(demandId); });
    el.querySelector('[data-act="edit"]').addEventListener('click', () => { Popover.close(); openEditDemandModal(demandId); });
    el.querySelector('[data-act="delete"]').addEventListener('click', async () => {
      Popover.close();
      const ok = await Modal.confirm({
        title: 'Supprimer la demande',
        message: 'Cette action est définitive. La demande sera supprimée du système.',
        confirmLabel: 'Supprimer',
        danger: true
      });
      if (ok) {
        Store.remove('demands', demandId);
        Toast.show({ title: 'Demande supprimée', icon: 'trash' });
        renderList();
      }
    });
  }

  function openStatusModal(demandId) {
    const d = Store.find('demands', demandId);
    const statuses = ['Nouvelle', 'En cours', 'En attente', 'Confirmée', 'Terminée'];
    const body = `
      <div class="field">
        <label class="field__label">Statut actuel</label>
        <div>${statusBadge(d.status)}</div>
      </div>
      <div class="field mt-3">
        <label class="field__label">Nouveau statut</label>
        <select class="select" id="newStatus">
          ${statuses.map(s => `<option value="${s}" ${s === d.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Annuler</button>
      <button class="btn btn--primary" data-save>${Icon('check', { size: 14 })} Mettre à jour</button>
    `;
    const m = Modal.open({ title: 'Changer le statut', subtitle: d.type, body, footer, size: 'sm' });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-save]').addEventListener('click', () => {
      const ns = m.el.querySelector('#newStatus').value;
      Store.update('demands', demandId, { status: ns });
      m.close();
      Toast.show({ title: 'Statut mis à jour', message: `La demande est maintenant « ${ns} ».`, icon: 'check' });
      renderList();
    });
  }

  function openDemandModal(demandId) {
    const d = Store.find('demands', demandId);
    if (!d) return;
    const c = Store.clientById(d.clientId);
    const body = `
      <div style="display:flex; flex-direction:column; gap: 16px;">
        <div style="display:flex; gap: 12px; align-items: center;">
          ${avatar(c)}
          <div>
            <div style="font-weight:600;">${escapeHtml(c?.name || 'Client supprimé')}</div>
            <div class="muted-2" style="font-size: 12px;">${escapeHtml(c?.city || '')} · ${tierBadge(c?.tier || 'Private')}</div>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="kv" style="padding: 0; border: none;">
            <div class="kv__label">Type</div>
            <div class="kv__value">${escapeHtml(d.type)}</div>
          </div>
          <div class="kv" style="padding: 0; border: none;">
            <div class="kv__label">Date & heure</div>
            <div class="kv__value">${escapeHtml(fmt.date(d.date))}${d.time ? ' · ' + d.time : ''}</div>
          </div>
          <div class="kv" style="padding: 0; border: none;">
            <div class="kv__label">Priorité</div>
            <div class="kv__value">${priorityBadge(d.priority)}</div>
          </div>
          <div class="kv" style="padding: 0; border: none;">
            <div class="kv__label">Statut</div>
            <div class="kv__value">${statusBadge(d.status)}</div>
          </div>
          <div class="kv" style="padding: 0; border: none;">
            <div class="kv__label">Responsable</div>
            <div class="kv__value">${escapeHtml(d.assignee || '—')}</div>
          </div>
          <div class="kv" style="padding: 0; border: none;">
            <div class="kv__label">Budget indicatif</div>
            <div class="kv__value">${d.budget ? escapeHtml(fmt.money(d.budget)) : '—'}</div>
          </div>
        </div>
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Description</div>
          <div class="kv__value" style="line-height: 1.6;">${escapeHtml(d.description)}</div>
        </div>
        ${d.notes ? `<div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Notes internes</div>
          <div class="kv__value" style="line-height: 1.6; color: var(--ink-3);">${escapeHtml(d.notes)}</div>
        </div>` : ''}
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Fermer</button>
      <button class="btn btn--ghost" data-edit>${Icon('edit', { size: 14 })} Modifier</button>
      <button class="btn btn--primary" data-status>${Icon('check', { size: 14 })} Changer le statut</button>
    `;
    const m = Modal.open({ title: 'Demande', subtitle: d.type, body, footer, size: 'lg' });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-edit]').addEventListener('click', () => { m.close(); openEditDemandModal(demandId); });
    m.el.querySelector('[data-status]').addEventListener('click', () => { m.close(); openStatusModal(demandId); });
  }

  function openEditDemandModal(demandId) {
    const d = Store.find('demands', demandId);
    if (!d) return;
    const m = openDemandForm({
      title: 'Modifier la demande',
      submitLabel: 'Enregistrer',
      demand: d,
      onsubmit: (data) => {
        Store.update('demands', demandId, data);
        Toast.show({ title: 'Demande mise à jour', icon: 'check' });
        renderList();
      }
    });
  }

  function openNewDemandModal(preselectClientId) {
    const m = openDemandForm({
      title: 'Nouvelle demande',
      submitLabel: 'Créer la demande',
      demand: null,
      preselectClientId,
      onsubmit: (data) => {
        const created = Store.add('demands', data);
        Store.add('notifications', {
          icon: 'demand', accent: 'gold', title: 'Nouvelle demande',
          message: `${created.type} pour ${Store.clientById(created.clientId)?.name || 'client'}.`,
          time: 'à l\'instant', unread: true
        });
        if (created.priority === 'Urgente') {
          Store.add('notifications', {
            icon: 'urgent', accent: 'danger', title: 'Demande urgente',
            message: `Une nouvelle demande urgente a été créée — assignée à ${created.assignee}.`,
            time: 'à l\'instant', unread: true
          });
        }
        Toast.show({ title: 'Demande créée avec succès', message: `${created.type} · ${Store.clientById(created.clientId)?.name || ''}`, icon: 'check' });
        renderList();
      }
    });
  }

  function openDemandForm({ title, submitLabel, demand, preselectClientId, onsubmit }) {
    const clients = Store.get('clients');
    const types = ['Restaurant', 'Hôtel', 'Transport', 'Voyage', 'Shopping', 'Événement', 'Billetterie', 'Spa', 'Autre'];
    const priorities = ['Normale', 'Importante', 'Urgente'];
    const assignees = ['Alexandre Martin', 'Sophie Leroy', 'Marc Dubois'];
    const d = demand || {};
    const clientId = preselectClientId || d.clientId || clients[0]?.id;
    const body = `
      <div class="grid grid-2">
        <div class="field">
          <label class="field__label">Client</label>
          <select class="select" id="f_client">
            ${clients.map(c => `<option value="${c.id}" ${c.id === clientId ? 'selected' : ''}>${escapeHtml(c.name)} · ${escapeHtml(c.tier)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="field__label">Type de demande</label>
          <select class="select" id="f_type">
            ${types.map(t => `<option value="${t}" ${t === d.type ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="grid-column: 1 / -1;">
          <label class="field__label">Description</label>
          <textarea class="textarea" id="f_desc" placeholder="Décrivez la demande en détail…">${escapeHtml(d.description || '')}</textarea>
        </div>
        <div class="field">
          <label class="field__label">Date</label>
          <input class="input" id="f_date" type="date" value="${d.date || new Date().toISOString().slice(0, 10)}" />
        </div>
        <div class="field">
          <label class="field__label">Heure</label>
          <input class="input" id="f_time" type="time" value="${d.time || ''}" />
        </div>
        <div class="field">
          <label class="field__label">Priorité</label>
          <select class="select" id="f_prio">
            ${priorities.map(p => `<option value="${p}" ${p === d.priority ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="field__label">Concierge responsable</label>
          <select class="select" id="f_assignee">
            ${assignees.map(a => `<option value="${a}" ${a === d.assignee ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="field__label">Budget indicatif (€)</label>
          <input class="input" id="f_budget" type="number" min="0" value="${d.budget || ''}" placeholder="0" />
        </div>
        <div class="field" style="grid-column: 1 / -1;">
          <label class="field__label">Notes internes</label>
          <textarea class="textarea" id="f_notes" placeholder="Notes réservées à l'équipe…" style="min-height: 60px;">${escapeHtml(d.notes || '')}</textarea>
        </div>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Annuler</button>
      <button class="btn btn--primary" data-submit>${Icon('check', { size: 14 })} ${escapeHtml(submitLabel)}</button>
    `;
    const m = Modal.open({ title, subtitle: demand ? null : 'Une notification sera envoyée au concierge assigné.', body, footer });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-submit]').addEventListener('click', () => {
      const desc = m.el.querySelector('#f_desc').value.trim();
      if (!desc) { Toast.show({ title: 'Description requise', icon: 'urgent' }); return; }
      const data = {
        clientId: m.el.querySelector('#f_client').value,
        type: m.el.querySelector('#f_type').value,
        description: desc,
        date: m.el.querySelector('#f_date').value,
        time: m.el.querySelector('#f_time').value || null,
        priority: m.el.querySelector('#f_prio').value,
        assignee: m.el.querySelector('#f_assignee').value,
        budget: parseInt(m.el.querySelector('#f_budget').value) || 0,
        notes: m.el.querySelector('#f_notes').value.trim(),
        status: demand ? demand.status : 'Nouvelle'
      };
      m.close();
      onsubmit(data);
    });
    return m;
  }

  function wireActions() {
    document.getElementById('newDemandBtn').addEventListener('click', () => openNewDemandModal());
  }
};
