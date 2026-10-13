/* Tablette (compte « Sam ») : à l'ouverture de la porte d'entrée, bascule instantanément sur l'Accueil, sans recharger Home Assistant. */
(() => {
  if (window.__doorHome) return; window.__doorHome = true;
  const DOOR = 'binary_sensor.hall_dentree_porte_entree_porte', PATH = '/maison-accueil/accueil', USERS = ['sam'];
  let handled = null;
  const go = () => {
    if (location.pathname.startsWith('/maison-accueil')) return;
    history.pushState(null, '', PATH);
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
  };
  const tick = () => {
    const el = document.querySelector('home-assistant'); const h = el && el.hass;
    if (!h || !h.user || !String(h.user.name || '').toLowerCase().startsWith('sam')) return;
    const s = h.states[DOOR]; if (!s || s.state !== 'on') return;
    if (handled === s.last_changed) return;
    handled = s.last_changed;
    if (Date.now() - new Date(s.last_changed).getTime() < 30000) go();
  };
  setInterval(tick, 400);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') tick(); });
})();
