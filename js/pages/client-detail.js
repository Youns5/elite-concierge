/* ============================================================
   ÉLITE — Page Fiche client (détail)
   ============================================================ */

window.pageInit = function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  let client = Store.clientById(id);

  if (!client) {
    document.getElementById('clientRoot').innerHTML = `
      <div class="empty" style="padding: 80px 20px;">
        <div class="empty__icon">${Icon('clients', { size: 22 })}</div>
        <div class="empty__title">Client introuvable</div>
        <div class="empty__desc">Ce client n'existe pas ou a été supprimé.</div>
        <div class="empty__action">
          <a href="clients.html" class="btn btn--primary">Retour aux clients</a>
        </div>
      </div>`;
    return;
  }

  let activeTab = 'infos';
  render();

  function render() {
    client = Store.clientById(id); // refresh
    const root = document.getElementById('clientRoot');
    root.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom: 18px;">
        <a href="clients.html" class="btn btn--subtle btn--sm">${Icon('arrowLeft', { size: 14 })} Clients</a>
        <span class="muted-2" style="font-size:12px;">/ ${escapeHtml(client.name)}</span>
      </div>

      <div class="card">
        <div class="profile-header">
          <div class="profile-header__avatar">${escapeHtml(fmt.initials(client.name))}</div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <h2 class="profile-header__name">${escapeHtml(client.name)}</h2>
              ${tierBadge(client.tier)}
              ${statusBadge(client.status === 'active' ? 'Actif' : 'Inactif')}
            </div>
            <div class="profile-header__meta">
              <span class="muted">${escapeHtml(client.city || '—')}</span>
              <span class="divider--vertical"></span>
              <span class="muted">${escapeHtml(client.company || '—')}</span>
              <span class="divider--vertical"></span>
              <span class="muted">Client depuis ${escapeHtml(fmt.date(client.joinedAt))}</span>
            </div>
          </div>
          <div style="display:flex; gap: 8px;">
            <button class="btn btn--ghost btn--sm" id="editBtn">${Icon('edit', { size: 14 })} Modifier</button>
            <button class="btn btn--ghost btn--sm" id="newDemandFromClient">+ Demande</button>
          </div>
        </div>

        <div class="tabs" id="tabs">
          <button class="tab ${activeTab === 'infos' ? 'is-active' : ''}" data-tab="infos">Informations</button>
          <button class="tab ${activeTab === 'prefs' ? 'is-active' : ''}" data-tab="prefs">Préférences</button>
          <button class="tab ${activeTab === 'demands' ? 'is-active' : ''}" data-tab="demands">Demandes · ${Store.demandsByClient(id).length}</button>
          <button class="tab ${activeTab === 'history' ? 'is-active' : ''}" data-tab="history">Historique</button>
          <button class="tab ${activeTab === 'notes' ? 'is-active' : ''}" data-tab="notes">Notes privées</button>
        </div>

        <div id="tabContent"></div>
      </div>
    `;

    document.querySelectorAll('#tabs .tab').forEach(t => {
      t.addEventListener('click', () => {
        activeTab = t.dataset.tab;
        document.querySelectorAll('#tabs .tab').forEach(x => x.classList.toggle('is-active', x === t));
        renderTabContent();
      });
    });

    document.getElementById('editBtn').addEventListener('click', openEditModal);
    document.getElementById('newDemandFromClient').addEventListener('click', () => {
      location.href = `demandes.html?new=1&client=${id}`;
    });

    renderTabContent();
  }

  function renderTabContent() {
    const el = document.getElementById('tabContent');
    if (activeTab === 'infos') el.innerHTML = renderInfos();
    else if (activeTab === 'prefs') el.innerHTML = renderPrefs();
    else if (activeTab === 'demands') el.innerHTML = renderDemands();
    else if (activeTab === 'history') el.innerHTML = renderHistory();
    else if (activeTab === 'notes') {
      el.innerHTML = renderNotes();
      wireNotes();
    }
    if (activeTab === 'demands') wireDemands();
  }

  function renderInfos() {
    const c = client;
    return `
      <div class="kv-grid">
        <div class="kv">
          <div class="kv__label">Téléphone</div>
          <div class="kv__value">${escapeHtml(c.phone || '—')}</div>
        </div>
        <div class="kv">
          <div class="kv__label">Email</div>
          <div class="kv__value">${escapeHtml(c.email || '—')}</div>
        </div>
        <div class="kv">
          <div class="kv__label">Ville</div>
          <div class="kv__value">${escapeHtml(c.city || '—')}</div>
        </div>
        <div class="kv">
          <div class="kv__label">Société</div>
          <div class="kv__value">${escapeHtml(c.company || '—')}</div>
        </div>
        <div class="kv">
          <div class="kv__label">Langues</div>
          <div class="kv__value">${(c.languages || []).join(' · ') || '—'}</div>
        </div>
        <div class="kv">
          <div class="kv__label">Client depuis</div>
          <div class="kv__value">${escapeHtml(fmt.date(c.joinedAt))}</div>
          <div class="kv__sub">${escapeHtml(fmt.relative(c.lastActivity))} · dernière activité</div>
        </div>
      </div>
    `;
  }

  function renderPrefs() {
    const p = client.preferences || {};
    const items = [
      { icon: 'star', label: 'Restaurants préférés', value: p.restaurants },
      { icon: 'tag', label: 'Type de cuisine', value: p.cuisine },
      { icon: 'briefcase', label: 'Hôtels préférés', value: p.hotels },
      { icon: 'car', label: 'Type de véhicule', value: p.vehicle },
      { icon: 'globe', label: 'Préférences de voyage', value: p.travel }
    ];
    if (items.every(i => !i.value)) {
      return `<div class="empty" style="padding: 50px 20px;">
        <div class="empty__icon">${Icon('star', { size: 22 })}</div>
        <div class="empty__title">Aucune préférence enregistrée</div>
        <div class="empty__desc">Ajoutez des préférences via le bouton Modifier.</div>
      </div>`;
    }
    return `
      <div class="prefs-list">
        ${items.map(it => `
          <div class="prefs-list__item">
            <div class="prefs-list__icon">${Icon(it.icon, { size: 14 })}</div>
            <div>
              <div class="prefs-list__label">${escapeHtml(it.label)}</div>
              <div class="prefs-list__value">${escapeHtml(it.value || '—')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderDemands() {
    const demands = Store.demandsByClient(id);
    if (!demands.length) {
      return `<div class="empty" style="padding: 50px 20px;">
        <div class="empty__icon">${Icon('demand', { size: 22 })}</div>
        <div class="empty__title">Aucune demande</div>
        <div class="empty__desc">Ce client n'a pas encore de demande enregistrée.</div>
        <div class="empty__action">
          <button class="btn btn--primary" onclick="document.getElementById('newDemandFromClient').click()">+ Nouvelle demande</button>
        </div>
      </div>`;
    }
    return `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Priorité</th>
              <th>Responsable</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${demands.map(d => `
              <tr class="row-clickable" data-demand="${d.id}">
                <td><strong>${escapeHtml(d.type)}</strong></td>
                <td style="max-width: 320px;">${escapeHtml(d.description.slice(0, 80))}${d.description.length > 80 ? '…' : ''}</td>
                <td class="muted col-nowrap">${escapeHtml(fmt.date(d.date))}${d.time ? ' · ' + d.time : ''}</td>
                <td>${priorityBadge(d.priority)}</td>
                <td class="muted">${escapeHtml(d.assignee || '—')}</td>
                <td>${statusBadge(d.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function wireDemands() {
    document.querySelectorAll('[data-demand]').forEach(tr => {
      tr.addEventListener('click', () => {
        location.href = `demandes.html?focus=${tr.dataset.demand}`;
      });
    });
  }

  function renderHistory() {
    const history = client.history || [];
    if (!history.length) {
      return `<div class="empty" style="padding: 50px 20px;">
        <div class="empty__icon">${Icon('clock', { size: 22 })}</div>
        <div class="empty__title">Aucun historique</div>
        <div class="empty__desc">Les interactions apparaîtront ici.</div>
      </div>`;
    }
    return `
      <div class="timeline">
        ${history.map((h, i) => `
          <div class="timeline__item ${i === 0 ? 'timeline__item--gold' : ''}">
            <div class="timeline__dot"></div>
            <div class="timeline__date">${escapeHtml(fmt.date(h.date))}</div>
            <div class="timeline__title">${escapeHtml(h.title)}</div>
            <div class="timeline__desc">${escapeHtml(h.desc)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderNotes() {
    return `
      <div style="padding: 22px;">
        <div class="field__label" style="margin-bottom: 8px;">Notes privées — réservées à l'équipe</div>
        <div class="field__hint" style="margin-bottom: 12px;">Ces notes ne sont jamais partagées avec le client. Sauvegarde automatique.</div>
        <textarea class="notes-area" id="notesArea" placeholder="Ajoutez vos notes internes ici…">${escapeHtml(client.notes || '')}</textarea>
        <div style="display:flex; align-items:center; justify-content: space-between; margin-top: 10px;">
          <span class="muted-2" id="notesStatus" style="font-size:12px;"></span>
          <button class="btn btn--primary btn--sm" id="saveNotes">${Icon('check', { size: 14 })} Enregistrer</button>
        </div>
      </div>
    `;
  }

  function wireNotes() {
    const area = document.getElementById('notesArea');
    const status = document.getElementById('notesStatus');
    const saveBtn = document.getElementById('saveNotes');
    let original = area.value;
    let saveTimer = null;
    const updateStatus = () => {
      status.textContent = area.value !== original ? 'Modifié — non enregistré' : 'Enregistré';
    };
    area.addEventListener('input', () => {
      updateStatus();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => save(), 1200);
    });
    saveBtn.addEventListener('click', save);
    function save() {
      Store.update('clients', id, { notes: area.value });
      original = area.value;
      updateStatus();
      Toast.show({ title: 'Notes enregistrées', icon: 'check' });
    }
    updateStatus();
  }

  function openEditModal() {
    const c = client;
    const p = c.preferences || {};
    const body = `
      <div class="grid grid-2">
        <div class="field"><label class="field__label">Nom complet</label><input class="input" id="e_name" value="${escapeHtml(c.name)}" /></div>
        <div class="field"><label class="field__label">Niveau</label>
          <select class="select" id="e_tier">
            <option value="Private" ${c.tier === 'Private' ? 'selected' : ''}>Private</option>
            <option value="Elite" ${c.tier === 'Elite' ? 'selected' : ''}>Elite</option>
            <option value="VIP" ${c.tier === 'VIP' ? 'selected' : ''}>VIP</option>
          </select>
        </div>
        <div class="field"><label class="field__label">Email</label><input class="input" id="e_email" value="${escapeHtml(c.email)}" /></div>
        <div class="field"><label class="field__label">Téléphone</label><input class="input" id="e_phone" value="${escapeHtml(c.phone)}" /></div>
        <div class="field"><label class="field__label">Ville</label><input class="input" id="e_city" value="${escapeHtml(c.city)}" /></div>
        <div class="field"><label class="field__label">Société</label><input class="input" id="e_company" value="${escapeHtml(c.company || '')}" /></div>
        <div class="field" style="grid-column: 1 / -1;"><label class="field__label">Langues (séparées par virgules)</label><input class="input" id="e_languages" value="${escapeHtml((c.languages || []).join(', '))}" /></div>
        <div class="field"><label class="field__label">Restaurants préférés</label><input class="input" id="e_rest" value="${escapeHtml(p.restaurants || '')}" /></div>
        <div class="field"><label class="field__label">Type de cuisine</label><input class="input" id="e_cuisine" value="${escapeHtml(p.cuisine || '')}" /></div>
        <div class="field"><label class="field__label">Hôtels préférés</label><input class="input" id="e_hotels" value="${escapeHtml(p.hotels || '')}" /></div>
        <div class="field"><label class="field__label">Type de véhicule</label><input class="input" id="e_vehicle" value="${escapeHtml(p.vehicle || '')}" /></div>
        <div class="field" style="grid-column: 1 / -1;"><label class="field__label">Préférences de voyage</label><input class="input" id="e_travel" value="${escapeHtml(p.travel || '')}" /></div>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Annuler</button>
      <button class="btn btn--primary" data-save>${Icon('check', { size: 14 })} Enregistrer</button>
    `;
    const m = Modal.open({ title: 'Modifier le client', subtitle: client.name, body, footer });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-save]').addEventListener('click', () => {
      Store.update('clients', id, {
        name: m.el.querySelector('#e_name').value.trim() || c.name,
        tier: m.el.querySelector('#e_tier').value,
        email: m.el.querySelector('#e_email').value.trim(),
        phone: m.el.querySelector('#e_phone').value.trim(),
        city: m.el.querySelector('#e_city').value.trim(),
        company: m.el.querySelector('#e_company').value.trim(),
        languages: m.el.querySelector('#e_languages').value.split(',').map(s => s.trim()).filter(Boolean),
        preferences: {
          restaurants: m.el.querySelector('#e_rest').value.trim(),
          cuisine: m.el.querySelector('#e_cuisine').value.trim(),
          hotels: m.el.querySelector('#e_hotels').value.trim(),
          vehicle: m.el.querySelector('#e_vehicle').value.trim(),
          travel: m.el.querySelector('#e_travel').value.trim()
        }
      });
      m.close();
      Toast.show({ title: 'Client mis à jour', icon: 'check' });
      render();
    });
  }
};
