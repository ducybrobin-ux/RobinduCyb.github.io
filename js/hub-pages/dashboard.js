/* hub-pages/dashboard.js — Dashboard CURIOS Project Hub
 *
 * Stats from server, dernières sessions, accès rapides, alertes.
 */
(function () {
  "use strict";

  function renderDashboard(user) {
    var now = new Date();
    var greeting = getGreeting(now);
    var dateStr = now.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    var html =
      '<div class="hub-page-header">' +
      "<div>" +
      '<h1 class="hub-page-title">' + greeting + " " + HubShell.escHtml(user ? user.name : "") + "</h1>" +
      '<p class="hub-page-sub">' + dateStr + "</p>" +
      "</div>" +
      "</div>" +

      '<div class="hub-stats">' +
      '<div class="hub-stat"><div class="hub-stat-icon blue">📁</div><div><div class="hub-stat-value" id="stat-projets">—</div><div class="hub-stat-label">Projets</div></div></div>' +
      '<div class="hub-stat"><div class="hub-stat-icon green">🗺️</div><div><div class="hub-stat-value" id="stat-parcours">—</div><div class="hub-stat-label">Parcours</div></div></div>' +
      '<div class="hub-stat"><div class="hub-stat-icon gold">📦</div><div><div class="hub-stat-value" id="stat-packs">—</div><div class="hub-stat-label">Packs</div></div></div>' +
      '<div class="hub-stat"><div class="hub-stat-icon red">🎯</div><div><div class="hub-stat-value" id="stat-sessions">—</div><div class="hub-stat-label">Sessions</div></div></div>' +
      "</div>" +

      '<div class="hub-grid">' +

      '<div class="hub-card">' +
      '<div class="hub-card-header"><h2>🚀 Accès rapides</h2></div>' +
      '<div class="hub-quick-actions">' +
      quickAction("📁", "Nouveau projet", "new-projet") +
      quickAction("🗺️", "Nouveau parcours", "new-parcours") +
      quickAction("🧩", "Créer un pack", "create-pack") +
      quickAction("🎯", "Lancer une session", "new-session") +
      "</div></div>" +

      '<div class="hub-card">' +
      '<div class="hub-card-header"><h2>📋 Projets récents</h2></div>' +
      '<div id="hub-recent-projets">' +
      '<div class="hub-loading" style="padding:16px;">Chargement…</div>' +
      "</div></div>" +

      '<div class="hub-card">' +
      '<div class="hub-card-header"><h2>⚡ Alertes</h2></div>' +
      '<div id="hub-alerts">' +
      '<div style="padding:8px 0;color:var(--hub-ink-dim);font-size:14px;">' +
      "✅ Aucune alerte pour le moment." +
      "</div></div></div>" +

      "</div>" +

      '<div class="hub-card">' +
      '<div class="hub-card-header"><h2>🔗 Outils de création</h2></div>' +
      '<div class="hub-quick-actions">' +
      '<a class="hub-quick-action" href="../player/studio.html"><span class="qa-icon">🎨</span><span class="qa-label">Studio de création<span style="display:block;font-size:12px;font-weight:400;color:var(--hub-ink-dim);">Workflow guidé en 8 étapes</span></span></a>' +
      '<a class="hub-quick-action" href="../player/editeur.html"><span class="qa-icon">✏️</span><span class="qa-label">Éditeur de contenu<span style="display:block;font-size:12px;font-weight:400;color:var(--hub-ink-dim);">Modifier balises, découvertes, quiz</span></span></a>' +
      '<a class="hub-quick-action" href="../player/atelier.html"><span class="qa-icon">🧩</span><span class="qa-label">Atelier de packs<span style="display:block;font-size:12px;font-weight:400;color:var(--hub-ink-dim);">Créer et exporter des bundles</span></span></a>' +
      '<a class="hub-quick-action" href="../player/dashboard.html"><span class="qa-icon">🎛️</span><span class="qa-label">Dashboard organisateur<span style="display:block;font-size:12px;font-weight:400;color:var(--hub-ink-dim);">Suivi en direct des équipes</span></span></a>' +
      "</div></div>";

    setTimeout(loadStats, 50);
    return html;
  }

  async function loadStats() {
    try {
      var projets = await HubAPI.getProjets();
      var parcours = await HubAPI.getParcours();
      var packs = await HubAPI.getPacks();

      setText("stat-projets", (projets.items || []).length);
      setText("stat-parcours", (parcours.items || []).length);
      setText("stat-packs", (packs.items || []).length);
      setText("stat-sessions", "—");

      renderRecentProjets(projets.items || []);
    } catch (err) {
      // Server not connected — show placeholders
    }
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderRecentProjets(items) {
    var el = document.getElementById("hub-recent-projets");
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<div style="padding:16px;color:var(--hub-ink-dim);font-size:14px;">Aucun projet. <a href="#/projets" style="color:var(--hub-accent);">Créer un projet</a></div>';
      return;
    }
    var recent = items.slice(-5).reverse();
    var html = '<div class="hub-list">';
    recent.forEach(function (p) {
      var d = new Date(p.created);
      var dateStr = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      html +=
        '<div class="hub-list-item">' +
        '<div><strong>' + HubShell.escHtml(p.name) + '</strong>' +
        '<div style="font-size:12px;color:var(--hub-ink-dim);">' + dateStr + '</div></div>' +
        '<span class="hub-badge hub-badge-' + (p.status === "active" ? "green" : "gray") + '">' + HubShell.escHtml(p.status || "draft") + '</span>' +
        '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function quickAction(icon, label, action) {
    return (
      '<a class="hub-quick-action" href="#" data-page-action="' + action + '">' +
      '<span class="qa-icon">' + icon + "</span>" +
      '<span class="qa-label">' + label + "</span></a>"
    );
  }

  function getGreeting(date) {
    var h = date.getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  }

  window.renderDashboard = renderDashboard;
})();
