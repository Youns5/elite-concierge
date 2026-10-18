/* ============================================================
   ÉLITE — Bibliothèque d'icônes (SVG inline, trait 1.5px)
   ============================================================ */

const Icon = (() => {
  const paths = {
    dashboard: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>',
    clients:   '<path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.7 0-6 1.3-6 4v3h8v-3c0-1 .4-1.9 1-2.6A7 7 0 0 0 8 14zm8 0c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4z"/>',
    // Alias: singular form used in a few activity/notification entries.
    client:    '<path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.7 0-6 1.3-6 4v3h8v-3c0-1 .4-1.9 1-2.6A7 7 0 0 0 8 14zm8 0c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4z"/>',
    demand:    '<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor" stroke="none"/>',
    reservation: '<path d="M7 3v2h10V3h2v2h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V3h2zm14 6H4v10h17V9zM7 11h4v4H7v-4z" fill="currentColor" stroke="none"/>',
    calendar:  '<path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 15H5V9h14v10z" fill="currentColor" stroke="none"/><path d="M5 9h14v10H5z" fill="none"/>',
    provider:  '<path d="M12 2L3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5zm0 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="currentColor" stroke="none"/>',
    invoice:   '<path d="M6 2h12a1 1 0 0 1 1 1v18l-3-2-3 2-3-2-3 2V3a1 1 0 0 1 1-1zm3 5h6v2H9V7zm0 4h6v2H9v-2z" fill="currentColor" stroke="none"/>',
    settings:  '<circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" fill="currentColor" stroke="none"/>',
    ai:        '<path d="M12 2l2.4 5.6L20 9l-5.6 2.4L12 17l-2.4-5.6L4 9l5.6-2.4L12 2z" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r="2" fill="currentColor" stroke="none"/>',
    flow:      '<path d="M4 5h6v6H4V5zm10 0h6v6h-6V5zM4 15h6v6H4v-6zm13 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-7-7l4 0m-4 9l4 0M14 8h3v7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
    search:    '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/>',
    bell:      '<path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2zM10 21a2 2 0 0 0 4 0" stroke-linecap="round" stroke-linejoin="round"/>',
    plus:      '<path d="M12 5v14M5 12h14" stroke-linecap="round"/>',
    arrowRight:'<path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>',
    arrowDown: '<path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>',
    chevronDown: '<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>',
    chevronRight: '<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>',
    check:     '<path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/>',
    close:     '<path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/>',
    car:       '<path d="M5 17h14M5 17v3M19 17v3M3 17l1.5-6h15L21 17M3 17h18" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="17" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="17" r="1.5" fill="currentColor" stroke="none"/><path d="M6 11l1.5-4h9L18 11" stroke-linecap="round" stroke-linejoin="round"/>',
    menu:      '<path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"/>',
    more:      '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
    user:      '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0" stroke-linecap="round"/>',
    star:      '<path d="M12 2l3 7 7 .6-5.3 4.6L18 22l-6-4-6 4 1.3-7.8L2 9.6 9 9l3-7z" fill="currentColor" stroke="none"/>',
    urgent:    '<path d="M12 2L2 22h20L12 2zM12 9v6M12 18v0.5" stroke-linecap="round" stroke-linejoin="round"/>',
    payment:   '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" stroke-linecap="round"/>',
    edit:      '<path d="M14 4l6 6-9 9H5v-6l9-9z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6l6 6" stroke-linecap="round"/>',
    trash:     '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-9 0l1 14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-14" stroke-linecap="round" stroke-linejoin="round"/>',
    assign:    '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0" stroke-linecap="round"/>',
    task:      '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6" stroke-linecap="round" stroke-linejoin="round"/>',
    phone:     '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" stroke-linecap="round" stroke-linejoin="round"/>',
    mail:      '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7L22 6" stroke-linecap="round" stroke-linejoin="round"/>',
    map:       '<path d="M9 2L3 4v18l6-2 6 2 6-2V2l-6 2-6-2zM9 2v18M15 4v18" stroke-linecap="round" stroke-linejoin="round"/>',
    globe:     '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a14 14 0 0 1 0 20M12 2a14 14 0 0 0 0 20" stroke-linecap="round"/>',
    clock:     '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"/>',
    sparkles:  '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" fill="currentColor" stroke="none"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" fill="currentColor" stroke="none"/>',
    trend:     '<path d="M3 17l6-6 4 4 8-8M21 7v6m0-6h-6" stroke-linecap="round" stroke-linejoin="round"/>',
    filter:    '<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" stroke-linecap="round" stroke-linejoin="round"/>',
    download:  '<path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke-linecap="round" stroke-linejoin="round"/>',
    upload:    '<path d="M12 21V9m0 0l-4 4m4-4l4 4M5 3h14" stroke-linecap="round" stroke-linejoin="round"/>',
    eye:       '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/>',
    logout:    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round"/>',
    spark:     '<path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1L12 2z" fill="currentColor" stroke="none"/>',
    flag:      '<path d="M4 21V4m0 0h12l-2 4 2 4H4" stroke-linecap="round" stroke-linejoin="round"/>',
    info:      '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v0.5" stroke-linecap="round"/>',
    tag:       '<path d="M2 12V3h9l11 11-9 9L2 12zM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke-linejoin="round"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-linecap="round" stroke-linejoin="round"/>',
    pin:       '<path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z" stroke-linejoin="round"/><circle cx="12" cy="9" r="3"/>',
    moon:      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke-linejoin="round"/>',
    send:      '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  return function (name, opts = {}) {
    const body = paths[name];
    if (!body) return '';
    const size = opts.size || 18;
    const stroke = opts.stroke || 1.6;
    const cls = opts.class ? ` class="${opts.class}"` : '';
    // SVG root fill: 'none' so strokes render correctly. Individual <path>
    // elements that need to be filled set their own fill="currentColor".
    const fill = 'none';
    return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  };
})();

window.Icon = Icon;
