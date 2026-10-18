/* ============================================================
   ÉLITE — Page ÉLITE AI (assistant — démonstration)
   ============================================================
   IMPORTANT : fonction de démonstration. Aucune IA réelle n'est
   connectée. Les réponses sont simulées localement à partir
   des données du Store.
   ============================================================ */

window.pageInit = function () {
  const root = document.getElementById('aiRoot');
  root.innerHTML = `
    <div class="ai-disclaimer mb-4">
      ${Icon('info', { size: 14 })}
      <div>
        <strong>Fonction de démonstration.</strong> Aucune IA réelle n'est connectée à cette interface.
        Les réponses sont simulées localement à partir des données fictives du système, à des fins
        d'illustration du produit. Pour activer un véritable assistant, branchez une API IA dans
        <code style="background: rgba(0,0,0,0.07); padding: 1px 5px; border-radius: 3px;">js/pages/ai.js</code>.
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr 280px; gap: 16px;">
      <div class="card">
        <div class="card__head">
          <div>
            <div class="eyebrow">Session</div>
            <h3>Assistant ÉLITE</h3>
          </div>
          <button class="btn btn--subtle btn--sm" id="clearChat">${Icon('trash', { size: 14 })} Effacer</button>
        </div>
        <div class="card__body">
          <div class="ai-chat" id="chat"></div>
          <div class="ai-suggestions mt-4" id="suggestions"></div>
          <div class="ai-input-row mt-3">
            <textarea id="aiInput" placeholder="Posez une question à ÉLITE AI…" rows="1"></textarea>
            <button class="btn btn--primary btn--icon" id="sendBtn">${Icon('send', { size: 15 })}</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <div><div class="eyebrow">Aide</div><h3>Capacités</h3></div>
        </div>
        <div class="card__body--flush">
          <div class="prefs-list">
            <div class="prefs-list__item">
              <div class="prefs-list__icon">${Icon('clients', { size: 14 })}</div>
              <div>
                <div class="prefs-list__label">Synthèse client</div>
                <div class="prefs-list__value" style="font-size: 12px; color: var(--ink-3); line-height: 1.5;">Résume préférences et historique d'un client avant une mission.</div>
              </div>
            </div>
            <div class="prefs-list__item">
              <div class="prefs-list__icon">${Icon('demand', { size: 14 })}</div>
              <div>
                <div class="prefs-list__label">Priorisation</div>
                <div class="prefs-list__value" style="font-size: 12px; color: var(--ink-3); line-height: 1.5;">Identifie les demandes urgentes et suggère un ordre de traitement.</div>
              </div>
            </div>
            <div class="prefs-list__item">
              <div class="prefs-list__icon">${Icon('star', { size: 14 })}</div>
              <div>
                <div class="prefs-list__label">Recommandations</div>
                <div class="prefs-list__value" style="font-size: 12px; color: var(--ink-3); line-height: 1.5;">Propose restaurants, hôtels ou services selon le profil client.</div>
              </div>
            </div>
            <div class="prefs-list__item">
              <div class="prefs-list__icon">${Icon('trend', { size: 14 })}</div>
              <div>
                <div class="prefs-list__label">Analyse</div>
                <div class="prefs-list__value" style="font-size: 12px; color: var(--ink-3); line-height: 1.5;">Synthétise l'activité et les tendances de la conciergerie.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const chat = document.getElementById('chat');
  const input = document.getElementById('aiInput');
  const sendBtn = document.getElementById('sendBtn');
  const suggestionsEl = document.getElementById('suggestions');

  // Welcome
  pushAssistant(`Bonjour Alexandre. Je suis <strong>ÉLITE AI</strong>, votre assistant de démonstration. Je peux vous aider à synthétiser un profil client, prioriser des demandes, ou analyser l'activité de la conciergerie. Essayez l'une des suggestions ci-dessous.`);

  const suggestions = [
    'Résume les préférences de Claire Dubois avant son prochain séjour.',
    'Quelles sont les 3 demandes les plus urgentes aujourd\'hui ?',
    'Recommande un restaurant gastronomique pour un client VIP à Paris.',
    'Analyse le chiffre d\'affaires des 6 derniers mois.'
  ];
  suggestionsEl.innerHTML = suggestions.map(s => `<button class="ai-suggestion">${escapeHtml(s)}</button>`).join('');
  suggestionsEl.querySelectorAll('.ai-suggestion').forEach(b => {
    b.addEventListener('click', () => { input.value = b.textContent; send(); });
  });

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
  document.getElementById('clearChat').addEventListener('click', () => {
    chat.innerHTML = '';
    pushAssistant(`Session effacée. Je reste à votre disposition, Alexandre.`);
  });

  function send() {
    const txt = input.value.trim();
    if (!txt) return;
    pushUser(txt);
    input.value = '';
    input.style.height = 'auto';
    respond(txt);
  }

  function pushUser(text) {
    const el = document.createElement('div');
    el.className = 'ai-msg ai-msg--user';
    el.innerHTML = `
      <div class="ai-msg__avatar">A</div>
      <div class="ai-msg__bubble">${escapeHtml(text)}</div>
    `;
    chat.appendChild(el);
    scrollChat();
  }

  function pushAssistant(html) {
    const el = document.createElement('div');
    el.className = 'ai-msg ai-msg--assistant';
    el.innerHTML = `
      <div class="ai-msg__avatar">É</div>
      <div class="ai-msg__bubble">${html}</div>
    `;
    chat.appendChild(el);
    scrollChat();
  }

  function pushTyping() {
    const el = document.createElement('div');
    el.className = 'ai-msg ai-msg--assistant';
    el.id = 'typing-indicator';
    el.innerHTML = `
      <div class="ai-msg__avatar">É</div>
      <div class="ai-msg__bubble"><div class="ai-bubble-typing"><span></span><span></span><span></span></div></div>
    `;
    chat.appendChild(el);
    scrollChat();
  }
  function clearTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }

  function scrollChat() {
    chat.scrollTop = chat.scrollHeight;
  }

  /* ---------- Simulated responses ---------- */
  function respond(q) {
    pushTyping();
    setTimeout(() => {
      clearTyping();
      pushAssistant(compose(q));
    }, 700 + Math.random() * 700);
  }

  function compose(q) {
    const lq = q.toLowerCase();

    // Client preferences
    const clientMatch = Store.get('clients').find(c => lq.includes(c.name.toLowerCase().split(' ')[0].toLowerCase()) || lq.includes(c.name.toLowerCase()));
    if (clientMatch && (lq.includes('préférence') || lq.includes('preference') || lq.includes('résume') || lq.includes('resume') || lq.includes('profil'))) {
      const p = clientMatch.preferences || {};
      const demands = Store.demandsByClient(clientMatch.id);
      return `
        <h4>Préférences principales — ${escapeHtml(clientMatch.name)}</h4>
        <ul>
          ${p.restaurants ? `<li><strong>Restaurants</strong> — ${escapeHtml(p.restaurants)}</li>` : ''}
          ${p.cuisine ? `<li><strong>Cuisine</strong> — ${escapeHtml(p.cuisine)}</li>` : ''}
          ${p.hotels ? `<li><strong>Hôtels</strong> — ${escapeHtml(p.hotels)}</li>` : ''}
          ${p.vehicle ? `<li><strong>Véhicule</strong> — ${escapeHtml(p.vehicle)}</li>` : ''}
          ${p.travel ? `<li><strong>Voyage</strong> — ${escapeHtml(p.travel)}</li>` : ''}
        </ul>
        <div style="margin-top: 10px; font-size: 12px; color: var(--ink-3);">
          Niveau <strong>${escapeHtml(clientMatch.tier)}</strong> · ${demands.length} demande${demands.length > 1 ? 's' : ''} enregistrée${demands.length > 1 ? 's' : ''} · dernière activité ${escapeHtml(fmt.relative(clientMatch.lastActivity))}.
        </div>
      `;
    }

    // Urgent demands
    if (lq.includes('urgent') || lq.includes('priorit')) {
      const urgent = Store.get('demands').filter(d => d.priority === 'Urgente' && d.status !== 'Terminée');
      if (!urgent.length) return `Aucune demande urgente en cours. L'équipe est à jour.`;
      const top = urgent.slice(0, 3);
      return `
        <h4>Top ${top.length} demandes urgentes</h4>
        <ul>
          ${top.map(d => {
            const c = Store.clientById(d.clientId);
            return `<li><strong>${escapeHtml(d.type)}</strong> — ${escapeHtml(c?.name || 'client')} · ${escapeHtml(fmt.dateShort(d.date))}${d.time ? ' ' + d.time : ''} · ${escapeHtml(d.assignee || 'non assigné')}</li>`;
          }).join('')}
        </ul>
        <div style="margin-top: 10px; font-size: 12px; color: var(--ink-3);">Je recommande de traiter en priorité les demandes transport et événementiel — ce sont les plus sensibles aux délais.</div>
      `;
    }

    // Restaurant recommendation
    if (lq.includes('restaurant') || lq.includes('déjeuner') || lq.includes('dîner') || lq.includes('gastronom')) {
      const top = Store.get('providers').filter(p => p.category === 'Restaurants' && p.rating === 5).slice(0, 3);
      return `
        <h4>Suggestions gastronomiques (Paris)</h4>
        <ul>
          ${top.map(p => `<li><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.city)} · contact ${escapeHtml(p.contact)}</li>`).join('')}
        </ul>
        <div style="margin-top: 10px; font-size: 12px; color: var(--ink-3);">Pour un client VIP, privilégiez une table en salon privé et confirmez 48h à l'avance. Je peux pré-draftier la demande si vous le souhaitez.</div>
      `;
    }

    // Revenue / CA analysis — use word boundary for the short "ca" token to
    // avoid false positives on words like "Cannes", "recommande", "carte"...
    if (lq.includes('chiffre') || lq.includes('revenu') || lq.includes('analyse') || /\bca\b/.test(lq)) {
      const rev = Store.get('monthlyRevenue');
      const total = rev.reduce((s, m) => s + m.value, 0);
      const last = rev[rev.length - 1];
      const prev = rev[rev.length - 2];
      const growth = prev ? ((last.value - prev.value) / prev.value) * 100 : 0;
      const paid = Store.get('invoices').filter(i => i.status === 'Payé').reduce((s, i) => s + i.amount, 0);
      return `
        <h4>Analyse — 6 derniers mois</h4>
        <ul>
          <li><strong>CA cumulé</strong> — ${escapeHtml(fmt.money(total))}</li>
          <li><strong>Encaissé</strong> — ${escapeHtml(fmt.money(paid))}</li>
          <li><strong>Tendance mois N</strong> — ${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% vs N-1</li>
          <li><strong>Meilleur mois</strong> — ${rev.slice().sort((a,b) => b.value - a.value)[0].month}</li>
        </ul>
        <div style="margin-top: 10px; font-size: 12px; color: var(--ink-3);">La dynamique est positive. Le segment « Transport privé » tire la croissance — à surveiller pour la capacity.</div>
      `;
    }

    // Default
    return `
      Je peux vous aider sur : <strong>synthèse client</strong>, <strong>priorisation des demandes</strong>, <strong>recommandations</strong> (restaurant, hôtel, transport) et <strong>analyse d'activité</strong>. Essayez l'une des suggestions ci-dessous pour voir un exemple concret.
    `;
  }
};
