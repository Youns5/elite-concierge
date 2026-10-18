/* ============================================================
   ÉLITE — Page Clients (liste)
   ============================================================ */

window.pageInit = function () {
  const state = {
    q: '',
    tier: 'Tous',
    status: 'Tous'
  };

  const TIERS = ['Tous', 'VIP', 'Elite', 'Private'];
  const STATUSES = ['Tous', 'Actif', 'Inactif'];

  renderToolbar();
  renderList();
  wireActions();

  function renderToolbar() {
    document.getElementById('clientsToolbar').innerHTML = `
      <div class="input-group toolbar__search">
        ${Icon('search', { size: 15 })}
        <input type="text" id="searchInput" placeholder="Rechercher par nom, ville, email…" />
      </div>
      <div class="toolbar__group">
        <span class="muted-2" style="font-size:12px;">Niveau</span>
        <div class="seg" id="tierSeg">
          ${TIERS.map(t => `<button class="seg__btn ${t === state.tier ? 'is-active' : ''}" data-tier="${t}">${t}</button>`).join('')}
        </div>
      </div>
      <div class="toolbar__group">
        <span class="muted-2" style="font-size:12px;">Statut</span>
        <div class="seg" id="statusSeg">
          ${STATUSES.map(s => `<button class="seg__btn ${s === state.status ? 'is-active' : ''}" data-status="${s}">${s}</button>`).join('')}
        </div>
      </div>
      <div class="toolbar__spacer"></div>
      <div class="muted-2" id="resultCount" style="font-size:12px;"></div>
    `;

    document.getElementById('searchInput').addEventListener('input', (e) => {
      state.q = e.target.value.toLowerCase().trim();
      renderList();
    });
    document.getElementById('tierSeg').querySelectorAll('.seg__btn').forEach(b => {
      b.addEventListener('click', () => {
        state.tier = b.dataset.tier;
        document.querySelectorAll('#tierSeg .seg__btn').forEach(x => x.classList.toggle('is-active', x === b));
        renderList();
      });
    });
    document.getElementById('statusSeg').querySelectorAll('.seg__btn').forEach(b => {
      b.addEventListener('click', () => {
        state.status = b.dataset.status;
        document.querySelectorAll('#statusSeg .seg__btn').forEach(x => x.classList.toggle('is-active', x === b));
        renderList();
      });
    });
  }

  function getFiltered() {
    let list = Store.get('clients').slice();
    if (state.q) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(state.q) ||
        c.city.toLowerCase().includes(state.q) ||
        c.email.toLowerCase().includes(state.q)
      );
    }
    if (state.tier !== 'Tous') list = list.filter(c => c.tier === state.tier);
    if (state.status !== 'Tous') {
      const want = state.status === 'Actif' ? 'active' : 'inactive';
      list = list.filter(c => c.status === want);
    }
    list.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    return list;
  }

  function renderList() {
    const list = getFiltered();
    const card = document.getElementById('clientsCard');
    document.getElementById('resultCount').textContent = `${list.length} client${list.length > 1 ? 's' : ''}`;
    document.getElementById('clientsSubtitle').textContent = `Répertoire des clients de la conciergerie · ${list.length} résultat${list.length > 1 ? 's' : ''}`;

    if (!list.length) {
      card.innerHTML = `
        <div class="empty">
          <div class="empty__icon">${Icon('clients', { size: 22 })}</div>
          <div class="empty__title">Aucun client trouvé</div>
          <div class="empty__desc">Ajustez votre recherche ou vos filtres, ou créez un nouveau client.</div>
          <div class="empty__action">
            <button class="btn btn--primary" onclick="document.getElementById('newClientBtn').click()">+ Nouveau client</button>
          </div>
        </div>`;
      return;
    }

    card.innerHTML = `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Niveau</th>
              <th>Ville</th>
              <th>Demandes</th>
              <th>Dernière activité</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(c => `
              <tr class="row-clickable" data-client="${c.id}">
                <td>
                  <div class="cell-client">
                    ${avatar(c)}
                    <div>
                      <div class="cell-client__name">${escapeHtml(c.name)}</div>
                      <div class="cell-client__sub">${escapeHtml(c.email)}</div>
                    </div>
                  </div>
                </td>
                <td>${tierBadge(c.tier)}</td>
                <td>${escapeHtml(c.city)}</td>
                <td class="tabular">${c.demands || 0}</td>
                <td class="muted">${escapeHtml(fmt.relative(c.lastActivity))}</td>
                <td>${statusBadge(c.status === 'active' ? 'Actif' : 'Inactif')}</td>
                <td class="col-right">${Icon('chevronRight', { size: 14 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    card.querySelectorAll('tr[data-client]').forEach(tr => {
      tr.addEventListener('click', () => {
        location.href = `client-detail.html?id=${tr.dataset.client}`;
      });
    });
  }

  function wireActions() {
    document.getElementById('newClientBtn').addEventListener('click', openNewClientModal);
    document.getElementById('exportBtn').addEventListener('click', () => {
      Toast.show({ title: 'Export généré', message: 'Le fichier CSV a été préparé (démo).', icon: 'download' });
    });
  }

  function openNewClientModal() {
    const body = `
      <div class="grid grid-2">
        <div class="field">
          <label class="field__label">Nom complet</label>
          <input class="input" id="f_name" placeholder="Ex. Claire Dubois" />
        </div>
        <div class="field">
          <label class="field__label">Niveau</label>
          <select class="select" id="f_tier">
            <option value="Private">Private</option>
            <option value="Elite">Elite</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label">Email</label>
          <input class="input" id="f_email" type="email" placeholder="prenom.nom@example.fr" />
        </div>
        <div class="field">
          <label class="field__label">Téléphone</label>
          <input class="input" id="f_phone" placeholder="+33 6 12 34 56 78" />
        </div>
        <div class="field">
          <label class="field__label">Ville</label>
          <input class="input" id="f_city" placeholder="Paris" />
        </div>
        <div class="field">
          <label class="field__label">Langues</label>
          <input class="input" id="f_languages" placeholder="Français, Anglais" />
        </div>
        <div class="field" style="grid-column: 1 / -1;">
          <label class="field__label">Société (optionnel)</label>
          <input class="input" id="f_company" placeholder="Groupe Dubois Holdings" />
        </div>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Annuler</button>
      <button class="btn btn--primary" data-create>${Icon('check', { size: 14 })} Créer le client</button>
    `;
    const m = Modal.open({
      title: 'Nouveau client',
      subtitle: 'Ajoutez un client au répertoire de la conciergerie.',
      body, footer,
      onClose: () => {}
    });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-create]').addEventListener('click', () => {
      const name = m.el.querySelector('#f_name').value.trim();
      if (!name) { Toast.show({ title: 'Nom requis', message: 'Le nom complet est obligatoire.', icon: 'urgent' }); return; }
      const item = {
        name,
        tier: m.el.querySelector('#f_tier').value,
        email: m.el.querySelector('#f_email').value.trim(),
        phone: m.el.querySelector('#f_phone').value.trim(),
        city: m.el.querySelector('#f_city').value.trim(),
        languages: m.el.querySelector('#f_languages').value.split(',').map(s => s.trim()).filter(Boolean),
        company: m.el.querySelector('#f_company').value.trim(),
        status: 'active',
        lastActivity: new Date().toISOString(),
        joinedAt: new Date().toISOString().slice(0, 10),
        demands: 0,
        preferences: { restaurants: '', cuisine: '', hotels: '', vehicle: '', travel: '' },
        history: [],
        notes: ''
      };
      const created = Store.add('clients', item);
      // Notification
      Store.add('notifications', {
        icon: 'client', accent: 'info', title: 'Nouveau client',
        message: `${created.name} a été ajouté au répertoire (${created.tier}).`,
        time: 'à l\'instant', unread: true
      });
      m.close();
      Toast.show({ title: 'Client créé', message: `${created.name} a été ajouté au répertoire.`, icon: 'check' });
      renderToolbar();
      renderList();
    });
  }
};
