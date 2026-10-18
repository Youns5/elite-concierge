/* ============================================================
   ÉLITE — Page Prestataires
   ============================================================ */

window.pageInit = function () {
  const CATEGORIES = ['Tous', 'Hôtels', 'Restaurants', 'Transport', 'Spa', 'Événementiel', 'Shopping', 'Billetterie'];
  const state = { q: '', category: 'Tous' };

  const params = new URLSearchParams(location.search);
  const focusId = params.get('focus');
  if (focusId) history.replaceState(null, '', location.pathname);

  renderToolbar();
  renderList();
  wireActions();

  function renderToolbar() {
    document.getElementById('provToolbar').innerHTML = `
      <div class="input-group toolbar__search">
        ${Icon('search', { size: 15 })}
        <input type="text" id="searchInput" placeholder="Rechercher un prestataire, une ville…" />
      </div>
      <div class="toolbar__group">
        <span class="muted-2" style="font-size:12px;">Catégorie</span>
        <select class="select" id="catFilter" style="width: auto; padding-right: 30px;">
          ${CATEGORIES.map(c => `<option value="${c}" ${c === state.category ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar__spacer"></div>
      <div class="muted-2" id="resultCount" style="font-size:12px;"></div>
    `;
    document.getElementById('searchInput').addEventListener('input', (e) => { state.q = e.target.value.toLowerCase().trim(); renderList(); });
    document.getElementById('catFilter').addEventListener('change', (e) => { state.category = e.target.value; renderList(); });
  }

  function getFiltered() {
    let list = Store.get('providers').slice();
    if (state.q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(state.q) ||
        p.city.toLowerCase().includes(state.q) ||
        p.contact.toLowerCase().includes(state.q)
      );
    }
    if (state.category !== 'Tous') list = list.filter(p => p.category === state.category);
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }

  function renderList() {
    const list = getFiltered();
    document.getElementById('resultCount').textContent = `${list.length} prestataire${list.length > 1 ? 's' : ''}`;
    document.getElementById('provSubtitle').textContent = `Répertoire des prestataires · ${list.length} résultat${list.length > 1 ? 's' : ''}`;

    const root = document.getElementById('provList');
    if (!list.length) {
      root.innerHTML = `<div class="card"><div class="empty">
        <div class="empty__icon">${Icon('provider', { size: 22 })}</div>
        <div class="empty__title">Aucun prestataire</div>
        <div class="empty__desc">Ajustez vos filtres ou ajoutez un nouveau prestataire.</div>
      </div></div>`;
      return;
    }

    root.innerHTML = `
      <div class="card">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Prestataire</th>
                <th>Catégorie</th>
                <th>Ville</th>
                <th>Contact</th>
                <th>Statut</th>
                <th>Note</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${list.map(p => `
                <tr class="row-clickable ${focusId === p.id ? 'is-highlighted' : ''}" data-prov="${p.id}">
                  <td>
                    <div class="cell-client">
                      <div class="avatar avatar--sm" style="background: var(--ink); color: var(--gold); border:none;">${escapeHtml(p.name[0])}</div>
                      <div>
                        <div class="cell-client__name">${escapeHtml(p.name)}</div>
                        <div class="cell-client__sub">${escapeHtml(p.email || '')}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge--outline">${escapeHtml(p.category)}</span></td>
                  <td class="muted">${escapeHtml(p.city)}</td>
                  <td>
                    <div>${escapeHtml(p.contact)}</div>
                    <div class="cell-client__sub">${escapeHtml(p.phone)}</div>
                  </td>
                  <td>${statusBadge(p.status)}</td>
                  <td>
                    <div style="display: flex; gap: 1px; color: var(--gold);">
                      ${Array.from({length: 5}, (_, i) => i < p.rating ? Icon('star', { size: 12 }) : '').join('')}
                    </div>
                  </td>
                  <td>${Icon('chevronRight', { size: 14 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    root.querySelectorAll('tr[data-prov]').forEach(tr => {
      tr.addEventListener('click', () => openProviderModal(tr.dataset.prov));
    });
  }

  function openProviderModal(id) {
    const p = Store.find('providers', id);
    if (!p) return;
    const body = `
      <div style="display:flex; gap: 14px; align-items: center; margin-bottom: 18px;">
        <div class="avatar avatar--lg" style="background: linear-gradient(135deg, #2A2A2A, #0A0A0A); color: var(--gold); border: none;">${escapeHtml(p.name[0])}</div>
        <div>
          <div style="font-size: 18px; font-weight: 600;">${escapeHtml(p.name)}</div>
          <div class="muted-2" style="font-size: 13px;">${escapeHtml(p.category)} · ${escapeHtml(p.city)}</div>
          <div style="margin-top: 6px; display:flex; gap: 1px; color: var(--gold);">
            ${Array.from({length: 5}, (_, i) => i < p.rating ? Icon('star', { size: 13 }) : '').join('')}
          </div>
        </div>
      </div>
      <div class="grid grid-2">
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Contact</div>
          <div class="kv__value">${escapeHtml(p.contact)}</div>
        </div>
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Téléphone</div>
          <div class="kv__value">${escapeHtml(p.phone)}</div>
        </div>
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Email</div>
          <div class="kv__value">${escapeHtml(p.email)}</div>
        </div>
        <div class="kv" style="padding: 0; border: none;">
          <div class="kv__label">Statut</div>
          <div class="kv__value">${statusBadge(p.status)}</div>
        </div>
      </div>
      <div class="kv" style="padding: 16px 0 0; border: none; margin-top: 12px;">
        <div class="kv__label">Note interne</div>
        <div class="kv__value" style="line-height: 1.6; color: var(--ink-2);">${escapeHtml(p.note || '—')}</div>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Fermer</button>
      <button class="btn btn--ghost" data-edit>${Icon('edit', { size: 14 })} Modifier la note</button>
    `;
    const m = Modal.open({ title: 'Prestataire', subtitle: p.category, body, footer, size: 'lg' });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-edit]').addEventListener('click', () => {
      m.close();
      const editBody = `
        <div class="field">
          <label class="field__label">Note interne (réservée à l'équipe)</label>
          <textarea class="textarea" id="prov_note" style="min-height: 140px;">${escapeHtml(p.note || '')}</textarea>
        </div>
      `;
      const editFoot = `
        <button class="btn btn--subtle" data-cancel>Annuler</button>
        <button class="btn btn--primary" data-save>${Icon('check', { size: 14 })} Enregistrer</button>
      `;
      const em = Modal.open({ title: 'Modifier la note', subtitle: p.name, body: editBody, footer: editFoot });
      em.el.querySelector('[data-cancel]').addEventListener('click', () => em.close());
      em.el.querySelector('[data-save]').addEventListener('click', () => {
        Store.update('providers', id, { note: em.el.querySelector('#prov_note').value.trim() });
        em.close();
        Toast.show({ title: 'Note mise à jour', icon: 'check' });
        renderList();
      });
    });
  }

  function wireActions() {
    document.getElementById('newProvBtn').addEventListener('click', () => {
      const body = `
        <div class="grid grid-2">
          <div class="field" style="grid-column: 1 / -1;"><label class="field__label">Nom du prestataire</label><input class="input" id="p_name" placeholder="Le Cinq — Four Seasons" /></div>
          <div class="field"><label class="field__label">Catégorie</label>
            <select class="select" id="p_cat">
              ${CATEGORIES.filter(c => c !== 'Tous').map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label class="field__label">Ville</label><input class="input" id="p_city" placeholder="Paris" /></div>
          <div class="field"><label class="field__label">Contact</label><input class="input" id="p_contact" placeholder="Jean Dupont" /></div>
          <div class="field"><label class="field__label">Téléphone</label><input class="input" id="p_phone" placeholder="+33 1 23 45 67 89" /></div>
          <div class="field" style="grid-column: 1 / -1;"><label class="field__label">Email</label><input class="input" id="p_email" type="email" placeholder="contact@example.fr" /></div>
          <div class="field" style="grid-column: 1 / -1;"><label class="field__label">Note interne</label><textarea class="textarea" id="p_note" placeholder="Informations réservées à l'équipe…" style="min-height: 80px;"></textarea></div>
        </div>
      `;
      const footer = `
        <button class="btn btn--subtle" data-cancel>Annuler</button>
        <button class="btn btn--primary" data-save>${Icon('check', { size: 14 })} Créer</button>
      `;
      const m = Modal.open({ title: 'Nouveau prestataire', body, footer });
      m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
      m.el.querySelector('[data-save]').addEventListener('click', () => {
        const name = m.el.querySelector('#p_name').value.trim();
        if (!name) { Toast.show({ title: 'Nom requis', icon: 'urgent' }); return; }
        Store.add('providers', {
          name,
          category: m.el.querySelector('#p_cat').value,
          city: m.el.querySelector('#p_city').value.trim(),
          contact: m.el.querySelector('#p_contact').value.trim(),
          phone: m.el.querySelector('#p_phone').value.trim(),
          email: m.el.querySelector('#p_email').value.trim(),
          status: 'Actif',
          rating: 5,
          note: m.el.querySelector('#p_note').value.trim()
        });
        m.close();
        Toast.show({ title: 'Prestataire ajouté', icon: 'check' });
        renderList();
      });
    });
  }
};
