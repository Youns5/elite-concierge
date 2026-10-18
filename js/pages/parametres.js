/* ============================================================
   ÉLITE — Page Paramètres + Profil
   ============================================================ */

window.pageInit = function () {
  const user = Store.getAll().user;
  const prefs = user.preferences || { notifications: {}, theme: 'light', language: 'fr' };

  const root = document.getElementById('settingsRoot');
  root.innerHTML = `
    <div style="display: grid; grid-template-columns: 220px 1fr; gap: 24px;">
      <aside class="card" style="padding: 8px; height: fit-content; position: sticky; top: 88px;">
        <a href="#profil" class="sidebar__link is-active" data-tab="profil">${Icon('user', { size: 17 })} Mon profil</a>
        <a href="#prefs" class="sidebar__link" data-tab="prefs">${Icon('settings', { size: 17 })} Préférences</a>
        <a href="#donnees" class="sidebar__link" data-tab="donnees">${Icon('briefcase', { size: 17 })} Données & RGPD</a>
        <a href="#about" class="sidebar__link" data-tab="about">${Icon('info', { size: 17 })} À propos</a>
      </aside>

      <div style="display: flex; flex-direction: column; gap: 18px;">
        <!-- Profile -->
        <div class="card" id="profil">
          <div class="card__head">
            <div><div class="eyebrow">Compte</div><h3>Mon profil</h3></div>
            <button class="btn btn--ghost btn--sm" id="editProfileBtn">${Icon('edit', { size: 14 })} Modifier</button>
          </div>
          <div class="card__body">
            <div style="display: flex; gap: 18px; align-items: center; margin-bottom: 22px;">
              <div class="avatar avatar--xl" style="background: linear-gradient(135deg, #2A2A2A, #0A0A0A); color: var(--gold); border: none;">${escapeHtml(user.initials || 'AM')}</div>
              <div>
                <div style="font-size: 22px; font-weight: 600; letter-spacing: -0.015em;">${escapeHtml(user.name)}</div>
                <div class="muted-2" style="margin-top: 2px;">${escapeHtml(user.role)}</div>
              </div>
            </div>
            <div class="kv-grid">
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Email</div>
                <div class="kv__value">${escapeHtml(user.email)}</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Téléphone</div>
                <div class="kv__value">${escapeHtml(user.phone)}</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Rôle</div>
                <div class="kv__value">${escapeHtml(user.role)}</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Bureau</div>
                <div class="kv__value">Paris · Siège</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card" id="prefs">
          <div class="card__head">
            <div><div class="eyebrow">App</div><h3>Préférences</h3></div>
          </div>
          <div class="card__body">
            <div class="kv-grid">
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Notifications push</div>
                <div class="kv__value">
                  <label class="checkbox"><input type="checkbox" id="prefPush" ${prefs.notifications?.push ? 'checked' : ''}/> <span>Activées</span></label>
                </div>
                <div class="kv__sub">Recevoir les notifications importantes dans l'app.</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Notifications email</div>
                <div class="kv__value">
                  <label class="checkbox"><input type="checkbox" id="prefEmail" ${prefs.notifications?.email ? 'checked' : ''}/> <span>Activées</span></label>
                </div>
                <div class="kv__sub">Recevoir un récap quotidien par email.</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Urgentes uniquement</div>
                <div class="kv__value">
                  <label class="checkbox"><input type="checkbox" id="prefUrgent" ${prefs.notifications?.urgentOnly ? 'checked' : ''}/> <span>Filtrer</span></label>
                </div>
                <div class="kv__sub">Ne recevoir que les demandes prioritaires.</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Thème</div>
                <div class="kv__value">
                  <select class="select" id="prefTheme" style="width: auto;">
                    <option value="light" ${prefs.theme === 'light' ? 'selected' : ''}>Clair</option>
                    <option value="dark" disabled>Sombre (bientôt)</option>
                  </select>
                </div>
                <div class="kv__sub">Apparence de l'interface.</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Langue</div>
                <div class="kv__value">
                  <select class="select" id="prefLang" style="width: auto;">
                    <option value="fr" ${prefs.language === 'fr' ? 'selected' : ''}>Français</option>
                    <option value="en" disabled>English (bientôt)</option>
                  </select>
                </div>
                <div class="kv__sub">Langue de l'interface.</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Fuseau horaire</div>
                <div class="kv__value">Europe/Paris (CET)</div>
                <div class="kv__sub">Détection automatique.</div>
              </div>
              <div class="kv" style="padding: 14px 0; border: none;">
                <div class="kv__label">Visite guidée</div>
                <div class="kv__value">
                  <button class="btn btn--ghost btn--sm" id="replayTour">${Icon('eye', { size: 14 })} Revoir la visite guidée</button>
                </div>
                <div class="kv__sub">Rejouer la présentation des principales fonctionnalités.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data / RGPD -->
        <div class="card" id="donnees">
          <div class="card__head">
            <div><div class="eyebrow">Système</div><h3>Données & RGPD</h3></div>
          </div>
          <div class="card__body">
            <div class="prefs-list">
              <div class="prefs-list__item">
                <div class="prefs-list__icon">${Icon('download', { size: 14 })}</div>
                <div style="flex:1;">
                  <div class="prefs-list__label">Exporter les données</div>
                  <div class="prefs-list__value" style="font-size: 13px; color: var(--ink-3);">Téléchargez toutes les données de la conciergerie au format JSON.</div>
                </div>
                <button class="btn btn--ghost btn--sm" id="exportData">Exporter</button>
              </div>
              <div class="prefs-list__item">
                <div class="prefs-list__icon">${Icon('refresh', { size: 14 })}</div>
                <div style="flex:1;">
                  <div class="prefs-list__label">Réinitialiser l'espace</div>
                  <div class="prefs-list__value" style="font-size: 13px; color: var(--ink-3);">Efface clients, demandes, réservations, prestataires et factures. Votre profil est conservé.</div>
                </div>
                <button class="btn btn--ghost btn--sm" id="resetData" style="color: var(--danger);">Réinitialiser</button>
              </div>
              <div class="prefs-list__item">
                <div class="prefs-list__icon">${Icon('briefcase', { size: 14 })}</div>
                <div style="flex:1;">
                  <div class="prefs-list__label">Modifier les informations de l'entreprise</div>
                  <div class="prefs-list__value" style="font-size: 13px; color: var(--ink-3);">Mettez à jour le nom, la ville, le type et le nombre de collaborateurs.</div>
                </div>
                <button class="btn btn--ghost btn--sm" id="editCompany">Modifier</button>
              </div>
              <div class="prefs-list__item">
                <div class="prefs-list__icon">${Icon('refresh', { size: 14 })}</div>
                <div style="flex:1;">
                  <div class="prefs-list__label">Recommencer l'onboarding</div>
                  <div class="prefs-list__value" style="font-size: 13px; color: var(--ink-3);">Repasse par la configuration initiale à la prochaine ouverture.</div>
                </div>
                <button class="btn btn--ghost btn--sm" id="resetOnboarding" style="color: var(--danger);">Réinitialiser</button>
              </div>
              <div class="prefs-list__item">
                <div class="prefs-list__icon">${Icon('trash', { size: 14 })}</div>
                <div style="flex:1;">
                  <div class="prefs-list__label">Vider le localStorage</div>
                  <div class="prefs-list__value" style="font-size: 13px; color: var(--ink-3);">Supprime toutes les données locales. Action irréversible.</div>
                </div>
                <button class="btn btn--ghost btn--sm" id="clearData" style="color: var(--danger);">Vider</button>
              </div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="card" id="about">
          <div class="card__head">
            <div><div class="eyebrow">Système</div><h3>À propos</h3></div>
          </div>
          <div class="card__body">
            <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 18px;">
              <div style="width: 48px; height: 48px; border-radius: 10px; background: var(--ink); color: var(--gold); display: grid; place-items: center; font-family: var(--font-serif); font-size: 24px; font-weight: 600;">É</div>
              <div>
                <div style="font-size: 17px; font-weight: 600;">ÉLITE — Conciergerie</div>
                <div class="muted-2" style="font-size: 12px;">Version 1.0.0 · Build interne · Démo RIVOLI</div>
              </div>
            </div>
            <div class="muted" style="font-size: 13px; line-height: 1.6;">
              ÉLITE est un logiciel métier interne de conciergerie de luxe, conçu et développé
              comme projet d'entraînement par RIVOLI. Toutes les données présentées sont fictives.
              Le projet illustre la conception d'un véritable logiciel sur mesure pour une
              entreprise haut de gamme : design premium, UX rigoureuse, architecture de code
              maintenable en HTML5, CSS3 et JavaScript vanilla.
            </div>
            <div class="divider" style="margin: 18px 0;"></div>
            <div class="muted-2" style="font-size: 12px; display: flex; gap: 16px; flex-wrap: wrap;">
              <span><strong>Stack</strong> · HTML5 · CSS3 · Vanilla JS</span>
              <span><strong>Persistance</strong> · localStorage</span>
              <span><strong>Typographie</strong> · Inter · Cormorant Garamond</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Side tab nav
  root.querySelectorAll('[data-tab]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      root.querySelectorAll('[data-tab]').forEach(x => x.classList.remove('is-active'));
      a.classList.add('is-active');
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Preferences wiring
  ['prefPush', 'prefEmail', 'prefUrgent'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      const path = id === 'prefPush' ? 'push' : id === 'prefEmail' ? 'email' : 'urgentOnly';
      const cur = Store.getAll().user.preferences?.notifications || {};
      cur[path] = e.target.checked;
      Store.getAll().user.preferences = { ...(Store.getAll().user.preferences || {}), notifications: cur };
      Store.save();
      Toast.show({ title: 'Préférence enregistrée', icon: 'check' });
    });
  });
  document.getElementById('prefTheme').addEventListener('change', (e) => {
    const cur = Store.getAll().user.preferences || {};
    cur.theme = e.target.value;
    Store.getAll().user.preferences = cur;
    Store.save();
    Toast.show({ title: 'Thème enregistré', message: 'Le thème clair est le seul disponible en démo.', icon: 'check' });
  });
  document.getElementById('prefLang').addEventListener('change', (e) => {
    const cur = Store.getAll().user.preferences || {};
    cur.language = e.target.value;
    Store.getAll().user.preferences = cur;
    Store.save();
    Toast.show({ title: 'Langue enregistrée', icon: 'check' });
  });

  // Revoir la visite guidée
  const replayTourBtn = document.getElementById('replayTour');
  if (replayTourBtn) {
    replayTourBtn.addEventListener('click', () => {
      if (window.Tour && typeof window.Tour.start === 'function') {
        // Force l'état pendant, sinon le tour serait considéré comme déjà vu.
        try { localStorage.setItem(window.Tour.TOUR_KEY || 'elite_tour_auto_v1', 'pending'); } catch (_) {}
        window.Tour.start();
      } else {
        Toast.show({ title: 'Visite guidée', message: 'Rechargez la page pour relancer la visite.', icon: 'info' });
      }
    });
  }

  // Profile edit
  document.getElementById('editProfileBtn').addEventListener('click', () => {
    const body = `
      <div class="grid grid-2">
        <div class="field"><label class="field__label">Nom complet</label><input class="input" id="u_name" value="${escapeHtml(user.name)}" /></div>
        <div class="field"><label class="field__label">Rôle</label><input class="input" id="u_role" value="${escapeHtml(user.role)}" /></div>
        <div class="field"><label class="field__label">Email</label><input class="input" id="u_email" type="email" value="${escapeHtml(user.email)}" /></div>
        <div class="field"><label class="field__label">Téléphone</label><input class="input" id="u_phone" value="${escapeHtml(user.phone)}" /></div>
      </div>
    `;
    const footer = `
      <button class="btn btn--subtle" data-cancel>Annuler</button>
      <button class="btn btn--primary" data-save>${Icon('check', { size: 14 })} Enregistrer</button>
    `;
    const m = Modal.open({ title: 'Modifier mon profil', body, footer });
    m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
    m.el.querySelector('[data-save]').addEventListener('click', () => {
      const u = Store.getAll().user;
      u.name = m.el.querySelector('#u_name').value.trim() || u.name;
      u.role = m.el.querySelector('#u_role').value.trim() || u.role;
      u.email = m.el.querySelector('#u_email').value.trim();
      u.phone = m.el.querySelector('#u_phone').value.trim();
      u.initials = u.name.split(/\s+/).map(p => p[0]).slice(0,2).join('').toUpperCase();
      Store.save();
      m.close();
      Toast.show({ title: 'Profil mis à jour', icon: 'check' });
      setTimeout(() => location.reload(), 600);
    });
  });

  // Data buttons
  document.getElementById('exportData').addEventListener('click', () => {
    const data = JSON.stringify(Store.getAll(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elite-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    Toast.show({ title: 'Export téléchargé', icon: 'download' });
  });

  document.getElementById('resetData').addEventListener('click', async () => {
    const ok = await Modal.confirm({
      title: 'Réinitialiser l\'espace',
      message: 'Toutes les données de la conciergerie (clients, demandes, réservations, prestataires, factures) seront effacées. Votre profil est conservé.',
      confirmLabel: 'Réinitialiser',
      danger: true
    });
    if (ok) {
      Store.resetSpace();
      Toast.show({ title: 'Espace réinitialisé', icon: 'check' });
      setTimeout(() => location.reload(), 600);
    }
  });

  document.getElementById('clearData').addEventListener('click', async () => {
    const ok = await Modal.confirm({
      title: 'Vider le localStorage',
      message: 'Toutes les données locales seront définitivement supprimées.',
      confirmLabel: 'Vider',
      danger: true
    });
    if (ok) {
      localStorage.removeItem('elite_data_v1');
      Toast.show({ title: 'localStorage vidé', icon: 'trash' });
      setTimeout(() => location.reload(), 600);
    }
  });

  // Edit company
  const editCompanyBtn = document.getElementById('editCompany');
  if (editCompanyBtn) {
    editCompanyBtn.addEventListener('click', () => {
      const s = Store.getAll();
      const c = s.company || {};
      const body = `
        <div class="grid grid-2">
          <div class="field"><label class="field__label">Nom de la conciergerie</label><input class="input" id="c_name" value="${escapeHtml(c.name||'')}" /></div>
          <div class="field"><label class="field__label">Ville</label><input class="input" id="c_city" value="${escapeHtml(c.city||'')}" /></div>
          <div class="field"><label class="field__label">Type</label><input class="input" id="c_type" value="${escapeHtml(c.type||'')}" /></div>
          <div class="field"><label class="field__label">Nombre de collaborateurs</label><input class="input" id="c_employees" type="number" value="${escapeHtml(c.employees||'')}" /></div>
        </div>
      `;
      const m = Modal.open({ title: 'Informations de l\'entreprise', body, footer: `<button class="btn btn--subtle" data-cancel>Annuler</button><button class="btn btn--primary" data-save>Enregistrer</button>` });
      m.el.querySelector('[data-cancel]').addEventListener('click', () => m.close());
      m.el.querySelector('[data-save]').addEventListener('click', () => {
        const s = Store.getAll();
        s.company = s.company || {};
        s.company.name = m.el.querySelector('#c_name').value.trim();
        s.company.city = m.el.querySelector('#c_city').value.trim();
        s.company.type = m.el.querySelector('#c_type').value.trim();
        s.company.employees = m.el.querySelector('#c_employees').value.trim();
        Store.save();
        m.close();
        Toast.show({ title: 'Informations enregistrées', icon: 'check' });
      });
    });
  }

  // Reset onboarding
  const resetOnboardingBtn = document.getElementById('resetOnboarding');
  if (resetOnboardingBtn) {
    resetOnboardingBtn.addEventListener('click', async () => {
      const ok = await Modal.confirm({ title: 'Réinitialiser l\'espace de démonstration', message: 'Cela forcera la réexécution de l\'onboarding lors de la prochaine ouverture. Souhaitez-vous continuer ?', confirmLabel: 'Réinitialiser', danger: true });
      if (ok) {
        const s = Store.getAll();
        // mark onboarding as not completed and save
        if (s.user) s.user.onboardingCompleted = false;
        s.onboardingCompleted = false;
        Store.save();
        Toast.show({ title: 'Onboarding réinitialisé', icon: 'check' });
      }
    });
  }
};
