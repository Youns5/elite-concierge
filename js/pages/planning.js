/* ============================================================
   ÉLITE — Page Planning (calendrier Jour / Semaine / Mois)
   ============================================================ */

window.pageInit = function () {
  const state = {
    view: 'semaine', // 'jour' | 'semaine' | 'mois'
    refDate: new Date()
  };
  state.refDate.setHours(0, 0, 0, 0);

  renderToolbar();
  renderView();
  wireActions();

  function renderToolbar() {
    document.getElementById('planningToolbar').innerHTML = `
      <div class="seg" id="viewSeg">
        <button class="seg__btn ${state.view === 'jour' ? 'is-active' : ''}" data-view="jour">Jour</button>
        <button class="seg__btn ${state.view === 'semaine' ? 'is-active' : ''}" data-view="semaine">Semaine</button>
        <button class="seg__btn ${state.view === 'mois' ? 'is-active' : ''}" data-view="mois">Mois</button>
      </div>
      <div class="toolbar__group">
        <button class="btn btn--icon btn--ghost btn--sm" id="prevBtn">${Icon('arrowLeft', { size: 14 })}</button>
        <button class="btn btn--icon btn--ghost btn--sm" id="nextBtn">${Icon('arrowRight', { size: 14 })}</button>
      </div>
      <div class="toolbar__spacer"></div>
      <div class="muted-2" id="rangeLabel" style="font-size: 12px;"></div>
    `;
    document.querySelectorAll('#viewSeg .seg__btn').forEach(b => {
      b.addEventListener('click', () => {
        state.view = b.dataset.view;
        document.querySelectorAll('#viewSeg .seg__btn').forEach(x => x.classList.toggle('is-active', x === b));
        renderView();
      });
    });
    document.getElementById('prevBtn').addEventListener('click', () => { shift(-1); renderView(); });
    document.getElementById('nextBtn').addEventListener('click', () => { shift(1); renderView(); });
  }

  function shift(direction) {
    const d = new Date(state.refDate);
    if (state.view === 'jour') d.setDate(d.getDate() + direction);
    else if (state.view === 'semaine') d.setDate(d.getDate() + direction * 7);
    else d.setMonth(d.getMonth() + direction);
    state.refDate = d;
  }

  function wireActions() {
    document.getElementById('todayBtn').addEventListener('click', () => {
      state.refDate = new Date(); state.refDate.setHours(0,0,0,0);
      renderView();
    });
  }

  function getEvents() {
    // Combine reservations + demands with dates
    const events = [];
    Store.get('reservations').forEach(r => {
      events.push({
        id: r.id, date: r.date, time: r.time, type: r.service,
        client: Store.clientById(r.clientId)?.name || 'Client',
        provider: r.provider, source: 'reservation', status: r.status
      });
    });
    Store.get('demands').forEach(d => {
      if (d.date) events.push({
        id: d.id, date: d.date, time: d.time, type: d.type,
        client: Store.clientById(d.clientId)?.name || 'Client',
        provider: d.assignee, source: 'demand', status: d.status,
        priority: d.priority
      });
    });
    return events;
  }

  function eventColor(ev) {
    if (ev.source === 'demand' && ev.priority === 'Urgente') return { cls: 'cal-event--gold', bar: 'gold' };
    if (ev.type === 'Transport' || ev.type === 'Voyage') return { cls: 'cal-event--info', bar: 'info' };
    if (ev.status === 'Confirmée' || ev.status === 'Terminée') return { cls: 'cal-event--success', bar: 'success' };
    return { cls: '', bar: '' };
  }

  function renderView() {
    if (state.view === 'jour') renderDay();
    else if (state.view === 'semaine') renderWeek();
    else renderMonth();
  }

  function startOfWeek(d) {
    const x = new Date(d);
    const day = (x.getDay() + 6) % 7; // Mon=0
    x.setDate(x.getDate() - day);
    x.setHours(0,0,0,0);
    return x;
  }

  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function renderDay() {
    const date = state.refDate;
    const events = getEvents().filter(e => e.date === isoDate(date)).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    document.getElementById('rangeLabel').textContent = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('planningTitle').textContent = 'Planning · Jour';

    const root = document.getElementById('planningView');
    if (!events.length) {
      root.innerHTML = `
        <div class="card">
          <div class="empty">
            <div class="empty__icon">${Icon('calendar', { size: 22 })}</div>
            <div class="empty__title">Aucun événement ce jour</div>
            <div class="empty__desc">Le planning est vide pour cette journée.</div>
          </div>
        </div>`;
      return;
    }
    root.innerHTML = `
      <div class="card">
        <div class="card__head">
          <div>
            <div class="eyebrow">${date.toLocaleDateString('fr-FR', { weekday: 'long' })}</div>
            <h3>${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</h3>
          </div>
          <span class="badge">${events.length} événement${events.length > 1 ? 's' : ''}</span>
        </div>
        <div class="card__body">
          <div class="cal-day-list">
            ${events.map(ev => {
              const c = eventColor(ev);
              return `
                <div class="cal-day-item">
                  <div class="cal-day-item__time">
                    ${ev.time || '—'}
                    ${ev.time ? `<div class="cal-day-item__time-end">${ev.type}</div>` : ''}
                  </div>
                  <div class="cal-day-item__bar cal-day-item__bar--${c.bar}"></div>
                  <div style="flex:1;">
                    <div class="cal-day-item__title">${escapeHtml(ev.type)} — ${escapeHtml(ev.client)}</div>
                    <div class="cal-day-item__sub">${escapeHtml(ev.provider || '')}${ev.status ? ' · ' + escapeHtml(ev.status) : ''}</div>
                  </div>
                  ${ev.source === 'demand' ? `<a href="demandes.html?focus=${ev.id}" class="btn btn--subtle btn--sm">Détail</a>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderWeek() {
    const start = startOfWeek(state.refDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d;
    });
    const todayIso = isoDate(new Date());
    document.getElementById('rangeLabel').textContent = `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — ${days[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    document.getElementById('planningTitle').textContent = 'Planning · Semaine';

    const events = getEvents();
    const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7h - 20h

    const root = document.getElementById('planningView');
    root.innerHTML = `
      <div class="cal-grid">
        <div class="cal-grid__head"></div>
        ${days.map(d => `
          <div class="cal-grid__head ${isoDate(d) === todayIso ? 'is-today' : ''}">
            ${d.toLocaleDateString('fr-FR', { weekday: 'short' })}
            <div style="font-size: 13px; color: var(--ink); font-weight: 600; margin-top: 2px;">${d.getDate()}</div>
          </div>
        `).join('')}

        ${HOURS.map(h => `
          <div class="cal-grid__time-col">${String(h).padStart(2, '0')}:00</div>
          ${days.map(d => {
            const cellEvents = events.filter(e => {
              if (e.date !== isoDate(d)) return false;
              if (!e.time) return false;
              return parseInt(e.time.split(':')[0]) === h;
            });
            return `
              <div class="cal-cell" data-date="${isoDate(d)}" data-hour="${h}">
                ${cellEvents.map(ev => {
                  const c = eventColor(ev);
                  return `<div class="cal-event ${c.cls}" data-event="${ev.source}:${ev.id}" title="${escapeHtml(ev.type)} — ${escapeHtml(ev.client)}">
                    <span class="cal-event__time">${escapeHtml(ev.time)}</span>
                    <span class="cal-event__title">${escapeHtml(ev.type)} · ${escapeHtml(ev.client.split(' ')[0])}</span>
                  </div>`;
                }).join('')}
              </div>
            `;
          }).join('')}
        `).join('')}
      </div>
    `;

    // "Now" indicator: a red horizontal line across today's column at the
    // current time, only if today is in the displayed week and within 7h–20h.
    const todayIdx = days.findIndex(d => isoDate(d) === todayIso);
    if (todayIdx >= 0) {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60;
      if (hour >= 7 && hour <= 20) {
        const grid = root.querySelector('.cal-grid');
        const cellHeight = root.querySelector('.cal-cell')?.offsetHeight || 56;
        const headHeight = root.querySelector('.cal-grid__head')?.offsetHeight || 38;
        const offsetTop = headHeight + (hour - 7) * cellHeight;
        const line = document.createElement('div');
        line.className = 'cal-now-line';
        line.style.top = offsetTop + 'px';
        // Position the line over today's column only.
        line.style.gridColumn = (todayIdx + 2); // +2 because col 1 is the time gutter
        line.style.left = '0';
        line.style.right = '0';
        grid.style.position = 'relative';
        grid.appendChild(line);
      }
    }

    // Also show "all-day" events (no time)
    const allDay = days.map(d => ({
      date: d, events: events.filter(e => e.date === isoDate(d) && !e.time)
    })).filter(x => x.events.length);

    if (allDay.length) {
      root.innerHTML += `
        <div class="card mt-4">
          <div class="card__head">
            <div><div class="eyebrow">Sans heure précise</div><h3>Événements planifiés</h3></div>
          </div>
          <div class="card__body--flush">
            ${allDay.map(({date, events}) => `
              <div class="activity-item">
                <div class="activity-item__icon">${Icon('calendar', { size: 15 })}</div>
                <div class="activity-item__body">
                  <div class="activity-item__title">${escapeHtml(date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))}</div>
                  <div class="activity-item__sub">${events.map(e => escapeHtml(e.type + ' — ' + e.client)).join(' · ')}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    root.querySelectorAll('[data-event]').forEach(el => {
      el.addEventListener('click', () => {
        const [src, id] = el.dataset.event.split(':');
        if (src === 'reservation') location.href = `reservations.html?focus=${id}`;
        else location.href = `demandes.html?focus=${id}`;
      });
    });
  }

  function renderMonth() {
    const d = state.refDate;
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const startPad = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startPad);

    const cells = Array.from({ length: 42 }, (_, i) => {
      const x = new Date(gridStart); x.setDate(gridStart.getDate() + i); return x;
    });

    const todayIso = isoDate(new Date());
    const currentMonth = d.getMonth();
    document.getElementById('rangeLabel').textContent = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    document.getElementById('planningTitle').textContent = 'Planning · Mois';

    const events = getEvents();
    const root = document.getElementById('planningView');
    root.innerHTML = `
      <div class="cal-month">
        ${['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(w => `<div class="cal-month__day-head">${w}</div>`).join('')}
        ${cells.map(c => {
          const isOut = c.getMonth() !== currentMonth;
          const isToday = isoDate(c) === todayIso;
          const dayEvents = events.filter(e => e.date === isoDate(c)).slice(0, 3);
          const overflow = events.filter(e => e.date === isoDate(c)).length - dayEvents.length;
          return `
            <div class="cal-month__day ${isOut ? 'is-out' : ''} ${isToday ? 'is-today' : ''}">
              <div class="cal-month__day-num">${c.getDate()}</div>
              ${dayEvents.map(ev => {
                const c = eventColor(ev);
                const cls = c.bar === 'gold' ? 'cal-month__ev--gold' : c.bar === 'info' ? 'cal-month__ev--info' : c.bar === 'success' ? 'cal-month__ev--success' : '';
                return `<div class="cal-month__ev ${cls}" data-event="${ev.source}:${ev.id}" title="${escapeHtml(ev.type + ' — ' + ev.client)}">${escapeHtml(ev.time || '')} ${escapeHtml(ev.type)}</div>`;
              }).join('')}
              ${overflow > 0 ? `<div class="cal-month__ev" style="opacity:0.6;">+${overflow} autre${overflow > 1 ? 's' : ''}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    root.querySelectorAll('[data-event]').forEach(el => {
      el.addEventListener('click', () => {
        const [src, id] = el.dataset.event.split(':');
        if (src === 'reservation') location.href = `reservations.html?focus=${id}`;
        else location.href = `demandes.html?focus=${id}`;
      });
    });
  }
};
