/* ============================================================
   ÉLITE — Page Facturation
   ============================================================ */

window.pageInit = function () {
  const state = { q: '', status: 'Tous' };
  const STATUSES = ['Tous', 'Payé', 'En attente', 'En retard'];

  render();
  wireActions();

  function computeStats() {
    const invoices = Store.get('invoices');
    const revenue = invoices.filter(i => i.status === 'Payé').reduce((s, i) => s + i.amount, 0);
    const pending = invoices.filter(i => i.status === 'En attente').reduce((s, i) => s + i.amount, 0);
    const late = invoices.filter(i => i.status === 'En retard').reduce((s, i) => s + i.amount, 0);
    const total = revenue + pending + late;
    // Distinct counts so the UI can label them truthfully.
    const pendingCount = invoices.filter(i => i.status === 'En attente').length;
    const totalCount = invoices.length;
    return { revenue, pending, late, total, pendingCount, totalCount };
  }

  function render() {
    const s = computeStats();
    const revenuePct = s.total > 0 ? (s.revenue / s.total) * 100 : 0;
    const pendingPct = s.total > 0 ? ((s.pending + s.late) / s.total) * 100 : 0;
    const root = document.getElementById('facturationRoot');

    root.innerHTML = `
      <div class="dash-grid mb-4">
        <div class="stat">
          <div class="stat__accent">${Icon('trend', { size: 15 })}</div>
          <div class="stat__label">Chiffre d'affaires (encaissé)</div>
          <div class="stat__value" style="font-size: 24px;">${fmt.money(s.revenue)}</div>
          <div class="stat__delta is-up">${Icon('check', { size: 11 })} ${revenuePct.toFixed(0)}% du total</div>
        </div>
        <div class="stat">
          <div class="stat__accent">${Icon('clock', { size: 15 })}</div>
          <div class="stat__label">En attente</div>
          <div class="stat__value" style="font-size: 24px;">${fmt.money(s.pending)}</div>
          <div class="stat__delta">${Icon('info', { size: 11 })} ${s.pendingCount} facture${s.pendingCount > 1 ? 's' : ''} en attente</div>
        </div>
        <div class="stat stat--danger">
          <div class="stat__accent">${Icon('urgent', { size: 15 })}</div>
          <div class="stat__label">En retard</div>
          <div class="stat__value" style="font-size: 24px;">${fmt.money(s.late)}</div>
          <div class="stat__delta is-down">${Icon('urgent', { size: 11 })} Relances à prévoir</div>
        </div>
        <div class="stat">
          <div class="stat__accent">${Icon('invoice', { size: 15 })}</div>
          <div class="stat__label">Total facturé</div>
          <div class="stat__value" style="font-size: 24px;">${fmt.money(s.total)}</div>
          <div class="stat__delta">${Icon('invoice', { size: 11 })} ${s.totalCount} facture${s.totalCount > 1 ? 's' : ''} émise${s.totalCount > 1 ? 's' : ''}</div>
          <div class="progress mt-2"><div class="progress__bar progress__bar--gold" style="width: ${revenuePct.toFixed(1)}%;"></div></div>
        </div>
      </div>

      <div class="toolbar">
        <div class="input-group toolbar__search">
          ${Icon('search', { size: 15 })}
          <input type="text" id="searchInput" placeholder="Rechercher par facture, client, service…" />
        </div>
        <div class="toolbar__group">
          <span class="muted-2" style="font-size:12px;">Statut</span>
          <select class="select" id="statusFilter" style="width: auto; padding-right: 30px;">
            ${STATUSES.map(x => `<option value="${x}" ${x === state.status ? 'selected' : ''}>${x}</option>`).join('')}
          </select>
        </div>
        <div class="toolbar__spacer"></div>
        <div class="muted-2" id="resultCount" style="font-size:12px;"></div>
      </div>

      <div class="card" id="invoicesCard"></div>
    `;

    document.getElementById('searchInput').addEventListener('input', (e) => { state.q = e.target.value.toLowerCase().trim(); renderTable(); });
    document.getElementById('statusFilter').addEventListener('change', (e) => { state.status = e.target.value; renderTable(); });
    renderTable();
  }

  function getFiltered() {
    let list = Store.get('invoices').slice();
    if (state.q) {
      list = list.filter(inv => {
        const c = Store.clientById(inv.clientId);
        const hay = (inv.id + ' ' + inv.service + ' ' + (c?.name || '')).toLowerCase();
        return hay.includes(state.q);
      });
    }
    if (state.status !== 'Tous') list = list.filter(i => i.status === state.status);
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }

  function renderTable() {
    const list = getFiltered();
    document.getElementById('resultCount').textContent = `${list.length} facture${list.length > 1 ? 's' : ''}`;
    const card = document.getElementById('invoicesCard');

    if (!list.length) {
      card.innerHTML = `<div class="empty">
        <div class="empty__icon">${Icon('invoice', { size: 22 })}</div>
        <div class="empty__title">Aucune facture</div>
        <div class="empty__desc">Ajustez vos filtres ou créez une nouvelle facture.</div>
      </div>`;
      return;
    }

    card.innerHTML = `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Facture</th>
              <th>Client</th>
              <th>Prestation</th>
              <th>Date</th>
              <th>Règlement</th>
              <th class="col-right">Montant</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(inv => {
              const c = Store.clientById(inv.clientId);
              return `
                <tr data-invoice="${inv.id}">
                  <td><strong class="tabular">${escapeHtml(inv.id)}</strong></td>
                  <td>
                    <div class="cell-client">
                      ${avatar(c, 'sm')}
                      <div>
                        <div class="cell-client__name">${escapeHtml(c?.name || 'Client supprimé')}</div>
                        <div class="cell-client__sub">${escapeHtml(c?.city || '')}</div>
                      </div>
                    </div>
                  </td>
                  <td style="max-width: 220px;">${escapeHtml(inv.service)}</td>
                  <td class="col-nowrap muted">${escapeHtml(fmt.dateShort(inv.date))}</td>
                  <td class="muted">${escapeHtml(inv.method || '—')}</td>
                  <td class="col-right tabular"><strong>${escapeHtml(fmt.money(inv.amount))}</strong></td>
                  <td>${statusBadge(inv.status)}</td>
                  <td><button class="btn btn--icon btn--subtle btn--sm" data-menu="${inv.id}">${Icon('more', { size: 14 })}</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    card.querySelectorAll('[data-invoice]').forEach(tr => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('[data-menu]')) return;
        openInvoiceModal(tr.dataset.invoice);
      });
    });
    card.querySelectorAll('[data-menu]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openActionMenu(btn, btn.dataset.menu);
      });
    });
  }

  function openActionMenu(anchor, id) {
    const inv = Store.find('invoices', id);
    if (!inv) return;
    const pop = Popover.open({
      anchor, width: 220,
      render: () => `
        <div style="padding: 6px;">
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="view">${Icon('eye', { size: 14 })} Voir le détail</button>
          ${inv.status !== 'Payé' ? `<button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="pay">${Icon('check', { size: 14 })} Marquer payée</button>` : ''}
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start;" data-act="download">${Icon('download', { size: 14 })} Télécharger PDF</button>
          <div class="divider"></div>
          <button class="btn btn--subtle btn--block" style="justify-content: flex-start; color: var(--danger);" data-act="delete">${Icon('trash', { size: 14 })} Supprimer</button>
        </div>
      `
    });
    const el = pop.el;
    el.querySelector('[data-act="view"]').addEventListener('click', () => { Popover.close(); openInvoiceModal(id); });
    const pay = el.querySelector('[data-act="pay"]');
    if (pay) pay.addEventListener('click', () => {
      Popover.close();
      Store.update('invoices', id, { status: 'Payé' });
      Store.add('notifications', {
        icon: 'payment', accent: 'success', title: 'Paiement reçu',
        message: `${fmt.money(inv.amount)} — ${Store.clientById(inv.clientId)?.name || 'client'}.`,
        time: 'à l\'instant', unread: true
      });
      Toast.show({ title: 'Facture marquée payée', icon: 'check' });
      render();
    });
    el.querySelector('[data-act="download"]').addEventListener('click', () => {
      Popover.close();
      Toast.show({ title: 'PDF en préparation', message: 'Le fichier sera téléchargé (démo).', icon: 'download' });
    });
    el.querySelector('[data-act="delete"]').addEventListener('click', async () => {
      Popover.close();
      const ok = await Modal.confirm({ title: 'Supprimer la facture', message: 'Cette action est définitive.', confirmLabel: 'Supprimer', danger: true });
      if (ok) { Store.remove('invoices', id); Toast.show({ title: 'Facture supprimée', icon: 'trash' }); render(); }
    });
  }

  function openInvoiceModal(id) {
    const inv = Store.find('invoices', id);
    if (!inv) return;
    const c = Store.clientById(inv.clientId);
    const body = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px;">
        <div>
          <div class="eyebrow">Facture</div>
          <div style="font-size: 22px; font-weight: 600; letter-spacing: -0.01em;">${escapeHtml(inv.id)}</div>
        </div>
        ${statusBadge(inv.status)}
      </div>
      <div class="grid grid-2">
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Client</div>
          <div class="kv__value">${escapeHtml(c?.name || 'Client supprimé')}</div>
          <div class="kv__sub">${escapeHtml(c?.company || '')}</div>
        </div>
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Date d'émission</div>
          <div class="kv__value">${escapeHtml(fmt.date(inv.date))}</div>
        </div>
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Prestation</div>
          <div class="kv__value">${escapeHtml(inv.service)}</div>
        </div>
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Mode de règlement</div>
          <div class="kv__value">${escapeHtml(inv.method || '—')}</div>
        </div>
      </div>
      <div class="divider" style="margin: 18px 0;"></div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div class="eyebrow">Montant total TTC</div>
        <div style="font-size: 28px; font-weight: 600; letter-spacing: -0.02em;">${escapeHtml(fmt.money(inv.amount))}</div>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Fermer</button>
      <button class="btn btn--ghost" data-pdf>${Icon('download', { size: 14 })} Télécharger PDF</button>
      ${inv.status !== 'Payé' ? `<button class="btn btn--primary" data-pay>${Icon('check', { size: 14 })} Marquer payée</button>` : ''}
    `;
    const m = Modal.open({ title: 'Facture', subtitle: inv.id, body, footer });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-pdf]').addEventListener('click', () => {
      Toast.show({ title: 'PDF en préparation', message: 'Le fichier sera téléchargé (démo).', icon: 'download' });
    });
    const payBtn = m.el.querySelector('[data-pay]');
    if (payBtn) payBtn.addEventListener('click', () => {
      Store.update('invoices', id, { status: 'Payé' });
      m.close();
      Toast.show({ title: 'Facture marquée payée', icon: 'check' });
      render();
    });
  }

  function wireActions() {
    document.getElementById('exportBtn').addEventListener('click', () => {
      Toast.show({ title: 'Export généré', message: 'Fichier CSV en préparation (démo).', icon: 'download' });
    });
    document.getElementById('newInvoiceBtn').addEventListener('click', () => {
      const clients = Store.get('clients');
      const body = `
        <div class="grid grid-2">
          <div class="field"><label class="field__label">Client</label>
            <select class="select" id="i_client">${clients.map(c => `<option value="${c.id}">${escapeHtml(c.name)} · ${escapeHtml(c.tier)}</option>`).join('')}</select>
          </div>
          <div class="field"><label class="field__label">Date</label><input class="input" id="i_date" type="date" value="${new Date().toISOString().slice(0, 10)}" /></div>
          <div class="field" style="grid-column: 1 / -1;"><label class="field__label">Prestation</label><input class="input" id="i_service" placeholder="Ex. Séjour hôtel + transferts" /></div>
          <div class="field"><label class="field__label">Montant (€)</label><input class="input" id="i_amount" type="number" min="0" placeholder="0" /></div>
          <div class="field"><label class="field__label">Mode de règlement</label>
            <select class="select" id="i_method">
              <option>Virement</option><option>Carte</option><option>Espèces</option><option>Chèque</option>
            </select>
          </div>
          <div class="field"><label class="field__label">Statut</label>
            <select class="select" id="i_status">
              <option>En attente</option><option>Payé</option><option>En retard</option>
            </select>
          </div>
        </div>
      `;
      const footer = `
        <button class="btn btn--subtle" data-cancel>Annuler</button>
        <button class="btn btn--primary" data-save>${Icon('check', { size: 14 })} Créer la facture</button>
      `;
      const m = Modal.open({ title: 'Nouvelle facture', body, footer });
      m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
      m.el.querySelector('[data-save]').addEventListener('click', () => {
        const service = m.el.querySelector('#i_service').value.trim();
        const amount = parseInt(m.el.querySelector('#i_amount').value);
        if (!service || !amount) { Toast.show({ title: 'Champs requis', message: 'Prestation et montant sont obligatoires.', icon: 'urgent' }); return; }
        const created = Store.add('invoices', {
          clientId: m.el.querySelector('#i_client').value,
          date: m.el.querySelector('#i_date').value,
          service,
          amount,
          method: m.el.querySelector('#i_method').value,
          status: m.el.querySelector('#i_status').value
        });
        m.close();
        Toast.show({ title: 'Facture créée', message: created.id, icon: 'check' });
        render();
      });
    });
  }
};
