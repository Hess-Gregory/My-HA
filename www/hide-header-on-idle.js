// hide-header-on-idle.js
(function () {
  const HIDE_DELAY = 1200; // ms d'inactivité avant de recacher le header

  let hideTimer;

  function getHeader() {
    try {
      const ha = document.querySelector("home-assistant");
      const main = ha?.shadowRoot?.querySelector("home-assistant-main");
      const panelResolver = main?.shadowRoot?.querySelector("ha-drawer partial-panel-resolver");
      const lovelace = panelResolver?.querySelector("ha-panel-lovelace") ?? panelResolver?.shadowRoot?.querySelector("ha-panel-lovelace");
      const huiRoot = lovelace?.shadowRoot?.querySelector("hui-root");
      return huiRoot?.shadowRoot?.querySelector(".header");
    } catch (e) {
      console.warn("[hide-header-on-idle] header introuvable:", e);
      return null;
    }
  }

  function showHeader() {
    const header = getHeader();
    if (!header) return;

    header.style.transition = "transform 0.25s ease-out";
    header.style.transform = "translateY(0)";

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      header.style.transform = "translateY(-100%)";
    }, HIDE_DELAY);
  }

  window.addEventListener("scroll", showHeader, true);

  // masqué au chargement de la page
  setTimeout(showHeader, 500);
})();