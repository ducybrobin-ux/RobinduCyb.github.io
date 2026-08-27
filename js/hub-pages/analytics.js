/* hub-pages/analytics.js — Analytics page */
/* global HubShell, HubAPI */

var renderAnalytics = (function () {
  "use strict";

  var esc = HubShell.escHtml;

  function bar(label, value, max, color) {
    var pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
      '<div class="hub-analytics-row">' +
      '<div class="hub-analytics-label">' + esc(label) + "</div>" +
      '<div class="hub-analytics-bar"><div class="hub-analytics-fill" style="width:' + pct + "%;background:" + color + ';"></div></div>' +
      '<div class="hub-analytics-value">' + value + "</div></div>"
    );
  }

  function statCard(icon, color, value, label) {
    return (
      '<div class="hub-stat">' +
      '<div class="hub-stat-icon ' + color + '">' + icon + "</div>" +
      "<div><div class=\"hub-stat-value\">" + value + "</div>" +
      '<div class="hub-stat-label">' + label + "</div></div></div>"
    );
  }

  async function render(user) {
    var html =
      '<div class="hub-page-header">' +
      '<div><h1 class="hub-page-title">📈 Analytics</h1>' +
      '<p class="hub-page-sub">Tableaux de bord et métriques</p></div></div>' +
      '<div id="hub-analytics-content" class="hub-loading">Chargement…</div>';
    setTimeout(load, 50);
    return html;
  }

  async function load() {
    var el = document.getElementById("hub-analytics-content");
    if (!el) return;
    try {
      var data = await HubAPI.getAnalytics();
      var t = data.totals || {};
      var r = data.recent || {};
      var s = data.byStatus || {};

      html =
        '<div class="hub-stats">' +
        statCard("📁", "blue", t.projets || 0, "Projets") +
        statCard("🗺️", "green", t.parcours || 0, "Parcours") +
        statCard("📦", "gold", t.packs || 0, "Packs") +
        statCard("👥", "red", t.clients || 0, "Clients") +
        statCard("🎯", "red", t.sessions || 0, "Sessions") +
        statCard("💰", "blue", t.devis || 0, "Devis") +
        "</div>" +

        '<div class="hub-grid"><div class="hub-card">' +
        '<div class="hub-card-header"><h2>📈 Activité récente</h2></div>' +
        '<div class="hub-analytics">' +
        bar("Projets (7 jours)", r.projetsThisWeek || 0, Math.max(1, r.projetsThisWeek), "#073B5C") +
        bar("Sessions (30 jours)", r.sessionsThisMonth || 0, Math.max(1, r.sessionsThisMonth), "#00A6A6") +
        bar("Devis (30 jours)", r.devisThisMonth || 0, Math.max(1, r.devisThisMonth), "#F5A623") +
        "</div></div>" +

        '<div class="hub-card">' +
        '<div class="hub-card-header"><h2>📊 Projets par statut</h2></div>' +
        '<div class="hub-analytics">' +
        bar("Actifs", s.projetsActive || 0, Math.max(1, s.projetsActive), "#20B878") +
        bar("Brouillons", s.projetsDraft || 0, Math.max(1, s.projetsDraft), "#94a3b8") +
        "</div></div></div>";

      el.innerHTML = html;
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Serveur non connecté: ' + esc(err.message) + "</div>";
    }
  }

  return render;
})();
