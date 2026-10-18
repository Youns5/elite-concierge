/* Onboarding multi-step pour ÉLITE
   - Sauvegarde du brouillon dans localStorage
   - Import JSON/CSV basique
   - Création espace : 4 étapes (identité, entreprise, besoins, finalisation)
*/
(function () {
  const DRAFT_KEY = 'elite_onboard_draft_v1';
  const IMPORT_TMP = '__elite_import_tmp__';

  function qs(sel, root=document) { return root.querySelector(sel); }
  function qsa(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

  const progressEl = document.getElementById('onboardProgress');
  const stepLabel = document.getElementById('onboardStepLabel');

  // File import handlers
  document.getElementById('importPreviewBtn').addEventListener('click', async () => {
    const f = document.getElementById('importFile').files[0];
    const preview = document.getElementById('importPreview');
    preview.textContent = '';
    if (!f) { preview.textContent = 'Aucun fichier sélectionné.'; return; }
    try {
      const text = await f.text();
      if (f.type === 'application/json' || f.name.endsWith('.json')) {
        const obj = JSON.parse(text);
        // Store temporary parsed object for confirmation
        localStorage.setItem(IMPORT_TMP, JSON.stringify(obj));
        const counts = Object.keys(obj).filter(k => Array.isArray(obj[k])).map(k => `${k}: ${obj[k].length}`).join(', ');
        preview.innerHTML = `Fichier JSON détecté — Contenu: <strong>${counts || 'Aucun tableau trouvé'}</strong> ` +
          `<div style="margin-top:8px"><button class='btn btn--primary' id='confirmImport'>Importer</button> <button class='btn btn--subtle' id='cancelImport'>Annuler</button></div>`;
        qs('#confirmImport', preview).addEventListener('click', applyImport);
        qs('#cancelImport', preview).addEventListener('click', () => { localStorage.removeItem(IMPORT_TMP); preview.textContent = ''; });
      } else {
        // try simple CSV parser
        const rows = text.trim().split(/\r?\n/).map(r => r.split(','));
        const headers = rows.shift().map(h => h.trim());
        if (!headers.includes('kind')) {
          preview.textContent = 'CSV non compatible : il faut une colonne "kind" indiquant le type (clients,demandes,reservations,providers).';
          return;
        }
        const grouped = {};
        rows.forEach(r => {
          const obj = {};
          headers.forEach((h,i) => obj[h] = (r[i] || '').trim());
          const k = obj.kind;
          delete obj.kind;
          if (!grouped[k]) grouped[k] = [];
          grouped[k].push(obj);
        });
        localStorage.setItem(IMPORT_TMP, JSON.stringify(grouped));
        const counts = Object.keys(grouped).map(k => `${k}: ${grouped[k].length}`).join(', ');
        preview.innerHTML = `Fichier CSV détecté — Contenu: <strong>${counts}</strong> <div style="margin-top:8px"><button class='btn btn--primary' id='confirmImport'>Importer</button> <button class='btn btn--subtle' id='cancelImport'>Annuler</button></div>`;
        qs('#confirmImport', preview).addEventListener('click', applyImport);
        qs('#cancelImport', preview).addEventListener('click', () => { localStorage.removeItem(IMPORT_TMP); preview.textContent = ''; });
      }
    } catch (e) {
      preview.textContent = 'Erreur lors de la lecture du fichier.';
      console.error(e);
    }
  });

  function markTourPending() {
    try {
      const key = (window.Tour && window.Tour.TOUR_KEY) || 'elite_tour_auto_v1';
      localStorage.setItem(key, 'pending');
    } catch (_) { /* ignore */ }
  }

  function applyImport() {
    const raw = localStorage.getItem(IMPORT_TMP);
    if (!raw) return;
    const obj = JSON.parse(raw);
    // On premier import, on part d'un espace PROPRE (aucune donnée fictive).
    const state = Store.createCleanSpace({
      user: { name: 'Concierge', role: 'Manager', email: '', phone: '' }
    });
    // Importer les tableaux détectés dans l'espace vide.
    ['clients','demands','reservations','providers','invoices'].forEach(kind => {
      if (Array.isArray(obj[kind])) {
        state[kind] = obj[kind].map(x => ({ ...x, id: x.id || Store._uid(kind[0] + '_') }));
      }
    });
    // Save and mark onboarding completed
    state.user.onboardingCompleted = true;
    Store.save();
    localStorage.removeItem(IMPORT_TMP);
    markTourPending();
    // Short success then redirect to dashboard
    Toast.show({ title: 'Import terminé', message: 'Vos données ont été importées dans votre espace.', icon: 'check' });
    setTimeout(() => { window.location.href = '../index.html'; }, 500);
  }

  // Onboarding flow
  document.getElementById('startOnboard').addEventListener('click', () => {
    startFlow();
  });

  function startFlow() {
    // Replace card with flow UI
    const card = document.querySelector('.onboard__card');
    const draft = loadDraft();
    card.innerHTML = renderFlow(draft);
    wireFlow();
    updateProgress(1);
  }

  function loadDraft() { try { return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {}; } catch(e){return {}; } }
  function saveDraft(d) { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); }
  function clearDraft(){ localStorage.removeItem(DRAFT_KEY); }

  function renderFlow(d) {
    return `
      <div style="padding:28px 36px">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
          <div>
            <div class="eyebrow">Onboarding</div>
            <h2 style="margin:6px 0 0;">Configuration de votre espace</h2>
            <div class="muted-2">Simple, rapide et sécurisé — vous pouvez revenir en arrière.</div>
          </div>
          <div style="width:240px">
            <div class="progress"><div class="progress__bar" id="flowProgress"></div></div>
            <div style="font-size:12px; color:var(--ink-3); margin-top:6px; text-align:right;" id="flowStep">1 — Identité</div>
          </div>
        </div>
        <div id="flowContent">
          ${renderStep1(d)}
        </div>
        <div style="display:flex; justify-content:space-between; gap:12px; margin-top:18px;">
          <button class="btn btn--subtle" id="btnPrev" disabled>Précédent</button>
          <div style="margin-left:auto; display:flex; gap:8px;"><button class="btn btn--ghost" id="btnCancel">Annuler</button><button class="btn btn--primary" id="btnNext">Suivant</button></div>
        </div>
      </div>
    `;
  }

  function renderStep1(d){ return `
    <div>
      <h3>1 — Votre identité</h3>
      <div class="grid grid-2" style="margin-top:12px; gap:12px;">
        <div class="field"><label class="field__label">Prénom</label><input class="input" id="f_first" value="${escape(d.first||'')}" /></div>
        <div class="field"><label class="field__label">Nom</label><input class="input" id="f_last" value="${escape(d.last||'')}" /></div>
        <div class="field"><label class="field__label">Email</label><input class="input" id="f_email" type="email" value="${escape(d.email||'')}" /></div>
        <div class="field"><label class="field__label">Téléphone</label><input class="input" id="f_phone" value="${escape(d.phone||'')}" /></div>
      </div>
    </div>`; }

  function renderStep2(d){ return `
    <div>
      <h3>2 — Votre entreprise</h3>
      <div class="grid grid-2" style="margin-top:12px; gap:12px;">
        <div class="field"><label class="field__label">Nom de la conciergerie</label><input class="input" id="c_name" value="${escape(d.company?.name||'')}" /></div>
        <div class="field"><label class="field__label">Profession / fonction</label><input class="input" id="c_role" value="${escape(d.company?.role||'')}" /></div>
        <div class="field"><label class="field__label">Nombre de collaborateurs</label><input class="input" id="c_employees" type="number" value="${escape(d.company?.employees||'')}" /></div>
        <div class="field"><label class="field__label">Ville</label><input class="input" id="c_city" value="${escape(d.company?.city||'')}" /></div>
        <div class="field" style="grid-column:1 / -1"><label class="field__label">Type de conciergerie</label>
          <select class="select" id="c_type">
            <option value="Conciergerie privée">Conciergerie privée</option>
            <option value="Conciergerie de luxe">Conciergerie de luxe</option>
            <option value="Conciergerie d'entreprise">Conciergerie d'entreprise</option>
            <option value="Travel concierge">Travel concierge</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>
    </div>`; }

  function renderStep3(d){
    const services = d.services || [];
    const opts = ['Gestion des clients','Gestion des demandes','Réservations','Planning','Automatisation','IA','Facturation'];
    return `
      <div>
        <h3>3 — Vos besoins</h3>
        <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
          ${opts.map(o => `
            <label class="checkbox" style="margin-right:8px;"><input type="checkbox" data-service value="${o}" ${services.includes(o)?'checked':''}/> <span>${o}</span></label>
          `).join('')}
        </div>
      </div>`;
  }

  function renderStep4(d){
    const name = (d.first||'') + ' ' + (d.last||'');
    const comp = d.company || {};
    const services = (d.services||[]).join(', ');
    return `
      <div>
        <h3>4 — Finalisation</h3>
        <div style="margin-top:12px;">
          <div class="kv-grid">
            <div class="kv"><div class="kv__label">Identité</div><div class="kv__value">${escape(name.trim()||'—')}</div></div>
            <div class="kv"><div class="kv__label">Email</div><div class="kv__value">${escape(d.email||'—')}</div></div>
            <div class="kv"><div class="kv__label">Entreprise</div><div class="kv__value">${escape(comp.name||'—')}</div></div>
            <div class="kv"><div class="kv__label">Type</div><div class="kv__value">${escape(comp.type||'—')}</div></div>
            <div class="kv" style="grid-column:1 / -1"><div class="kv__label">Besoins</div><div class="kv__value">${escape(services||'—')}</div></div>
          </div>
        </div>
      </div>`;
  }

  function escape(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function wireFlow(){
    let step = 1;
    const total = 4;
    const flowProgress = document.getElementById('flowProgress');
    const flowStep = document.getElementById('flowStep');
    const content = document.getElementById('flowContent');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnCancel = document.getElementById('btnCancel');

    const draft = loadDraft();

    // set selected type if exists
    if (draft.company && draft.company.type) {
      setTimeout(()=>{ const sel = document.getElementById('c_type'); if(sel) sel.value = draft.company.type; },50);
    }

    btnPrev.addEventListener('click', () => { if (step>1) { step--; renderStep(); } });
    btnCancel.addEventListener('click', () => { if (confirm('Annuler la configuration ? Les données non enregistrées seront perdues.')) { clearDraft(); window.location.href = '../index.html'; } });

    btnNext.addEventListener('click', () => {
      if (!validateStep(step)) return;
      saveStepValues(step);
      if (step < total) { step++; renderStep(); }
      else { finishOnboarding(); }
    });

    function renderStep(){
      flowProgress.style.width = `${(step/total)*100}%`;
      flowStep.textContent = `${step} — ${step===1?'Identité':step===2?'Entreprise':step===3?'Besoins':'Terminé'}`;
      if (step===1) content.innerHTML = renderStep1(loadDraft());
      if (step===2) content.innerHTML = renderStep2(loadDraft());
      if (step===3) content.innerHTML = renderStep3(loadDraft());
      if (step===4) content.innerHTML = renderStep4(loadDraft());
      btnPrev.disabled = step===1;
      btnNext.textContent = step===4 ? 'Créer mon espace' : 'Suivant';
      // wire simple inputs saving on change
      qsa('input, select', content).forEach(i => i.addEventListener('change', () => saveStepValues(step)));
    }

    function validateStep(s){
      const c = document.getElementById('flowContent');
      if (s===1) {
        const first = c.querySelector('#f_first'); const last = c.querySelector('#f_last'); const email = c.querySelector('#f_email');
        if (!first.value.trim() || !last.value.trim() || !email.value.trim()) { alert('Veuillez compléter prénom, nom et email.'); return false; }
      }
      return true;
    }

    function saveStepValues(s){
      const c = document.getElementById('flowContent');
      const d = loadDraft();
      if (s===1) {
        d.first = (c.querySelector('#f_first')||{}).value || d.first;
        d.last = (c.querySelector('#f_last')||{}).value || d.last;
        d.email = (c.querySelector('#f_email')||{}).value || d.email;
        d.phone = (c.querySelector('#f_phone')||{}).value || d.phone;
      }
      if (s===2) {
        d.company = d.company || {};
        d.company.name = (c.querySelector('#c_name')||{}).value || d.company.name;
        d.company.role = (c.querySelector('#c_role')||{}).value || d.company.role;
        d.company.employees = (c.querySelector('#c_employees')||{}).value || d.company.employees;
        d.company.city = (c.querySelector('#c_city')||{}).value || d.company.city;
        const t = (c.querySelector('#c_type')||{}).value; if (t) d.company.type = t;
      }
      if (s===3) {
        const list = Array.from(c.querySelectorAll('[data-service]')).filter(i => i.checked).map(i => i.value);
        d.services = list;
      }
      saveDraft(d);
    }

    function finishOnboarding(){
      const d = loadDraft();
      const name = `${d.first||''} ${d.last||''}`.trim() || 'Utilisateur';
      const initials = name.split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase();
      const company = d.company || {};
      const preferences = {
        notifications: { push: true, email: true, urgentOnly: false },
        theme: 'light',
        language: 'fr'
      };
      // NOUVEL ESPACE = ESPACE PROPRE :
      // on repart d'un état vide, uniquement avec l'identité fournie.
      // Aucun client, demande, réservation, prestataire ni facture fictive.
      const state = Store.createCleanSpace({
        user: {
          name,
          email: d.email || '',
          phone: d.phone || '',
          role: company.role || 'Manager',
          initials,
          preferences,
          onboardingCompleted: true
        },
        company: {
          name: company.name || '',
          role: company.role || '',
          employees: company.employees || '',
          city: company.city || '',
          type: company.type || ''
        }
      });
      state.user.services = d.services || [];
      Store.save();
      clearDraft();
      markTourPending();
      // show short loading then redirect
      const flow = document.getElementById('flowContent');
      flow.innerHTML = `<div style="padding:18px;"><h3>Préparation de votre espace...</h3><div class='muted-2'>Cela prend quelques instants.</div></div>`;
      setTimeout(()=>{ window.location.href = '../index.html'; }, 900);
    }

    // initial render
    renderStep();
  }

  // If user landed with an existing draft, show subtle restore? For brevity, keep implicit.

})();
