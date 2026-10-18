/* ============================================================
   ÉLITE — Page Dashboard / Overview
   Aucun chiffre fictif : stats, graphiques et activité sont dérivés
   des données réelles du store. Espace vide = états vides intentional.
   ============================================================ */
window.pageInit = function () {
  const user = Store.getAll().user || {};
  const hour = new Date().getHours();
  const greet = hour < 18 ? 'Bonjour' : 'Bonsoir';
  const firstName = (user.name || '').split(' ')[0] || '';
  const titleEl = document.getElementById('welcomeTitle');
  if (titleEl) titleEl.textContent = (greet + ' ' + firstName).trim();
  renderEmptyHero();
  renderStats();
  renderCharts();
  renderActivityRow();
  wireActions();
};