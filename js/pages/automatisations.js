/* ============================================================
   ÉLITE — Page Automatisations
   ============================================================ */

window.pageInit = function () {
  const flows = Store.get('automations');
  const root = document.getElementById('flowsRoot');

  const iconMap = {
    assign: 'assign',
    bell: 'bell',
    calendar: 'calendar',
    task: 'task'
  };

  root.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      ${flows.map(f => `
        <div class="card">
          <div class="card__head">
            <div>
              <div class="eyebrow">Workflow</div>
              <h3>${escapeHtml(f.name)}</h3>
              <div class="muted-2" style="font-size: 12px; margin-top: 2px;">${escapeHtml(f.description)}</div>
            </div>
            <label class="checkbox" style="margin: 0;">
              <input type="checkbox" checked />
              <span style="font-size: 12px; color: var(--ink-3);">Actif</span>
            </label>
          </div>
          <div class="card__body">
            <div class="flow">
              <div class="flow__step flow__step--trigger">
                <div class="flow__step-icon">${Icon('spark', { size: 18 })}</div>
                <div class="flow__step-label">${escapeHtml(f.trigger.label)}</div>
                <div class="flow__step-title">${escapeHtml(f.trigger.title)}</div>
                <div class="flow__step-desc">${escapeHtml(f.trigger.desc)}</div>
              </div>
              ${f.steps.map(step => `
                <div class="flow__arrow">${Icon('arrowRight', { size: 16 })}</div>
                <div class="flow__step flow__step--action">
                  <div class="flow__step-icon">${Icon(iconMap[step.icon] || 'flow', { size: 18 })}</div>
                  <div class="flow__step-label">${escapeHtml(step.label)}</div>
                  <div class="flow__step-title">${escapeHtml(step.title)}</div>
                  <div class="flow__step-desc">${escapeHtml(step.desc)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}

      <div class="card">
        <div class="card__head">
          <div>
            <div class="eyebrow">À venir</div>
            <h3>Workflows en préparation</h3>
          </div>
          <span class="badge badge--outline">Bientôt</span>
        </div>
        <div class="card__body">
          <div class="grid grid-2">
            <div style="padding: 16px; border: 1px dashed var(--line-2); border-radius: var(--r-md);">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                ${Icon('clock', { size: 16 })}
                <strong style="font-size: 14px;">Relance automatique</strong>
              </div>
              <div class="muted-2" style="font-size: 12px; line-height: 1.5;">Facture en retard de plus de 7 jours → relance client + notification comptabilité.</div>
            </div>
            <div style="padding: 16px; border: 1px dashed var(--line-2); border-radius: var(--r-md);">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                ${Icon('globe', { size: 16 })}
                <strong style="font-size: 14px;">Anniversaire client</strong>
              </div>
              <div class="muted-2" style="font-size: 12px; line-height: 1.5;">J-3 de l'anniversaire → commande fleurs + message personnalisé au concierge référent.</div>
            </div>
            <div style="padding: 16px; border: 1px dashed var(--line-2); border-radius: var(--r-md);">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                ${Icon('star', { size: 16 })}
                <strong style="font-size: 14px;">Post-stay</strong>
              </div>
              <div class="muted-2" style="font-size: 12px; line-height: 1.5;">Fin de séjour → email de remerciement + demande de feedback + MAJ préférences.</div>
            </div>
            <div style="padding: 16px; border: 1px dashed var(--line-2); border-radius: var(--r-md);">
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                ${Icon('trend', { size: 16 })}
                <strong style="font-size: 14px;">Rapport hebdomadaire</strong>
              </div>
              <div class="muted-2" style="font-size: 12px; line-height: 1.5;">Chaque vendredi 17h → synthèse activité + KPI envoyée au manager.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('newFlowBtn').addEventListener('click', () => {
    Toast.show({ title: 'Concept en préparation', message: 'Le constructeur de workflows sera bientôt disponible.', icon: 'info' });
  });

  // Wire checkboxes
  root.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      Toast.show({ title: cb.checked ? 'Workflow activé' : 'Workflow désactivé', icon: cb.checked ? 'check' : 'close' });
    });
  });
};
