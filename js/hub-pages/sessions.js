/* hub-pages/sessions.js — Sessions page */
/* global HubShell, HubAPI */

var renderSessions = (function () {
  "use strict";

  var esc = HubShell.escHtml;

  function renderList(items) {
    if (!items.length) {
      return (
        '<div class="hub-card"><div class="hub-empty">' +
        '<div class="hub-empty-icon">🎯</div>' +
        '<div class="hub-empty-title">Aucune session</div>' +
        '<div class="hub-empty-desc">Les sessions apparaissent ici quand des équipes jouent.</div>' +
        '<button class="hub-btn hub-btn-primary" data-page-action="new-session">➕ Lancer une session</button>' +
        "</div></div>"
      );
    }
    var rows = items.map(function (s) {
      var badge = s.status === "active"
        ? '<span class="hub-badge hub-badge-green">En cours</span>'
        : '<span class="hub-badge hub-badge-gray">' + esc(s.status || "terminée") + "</span>";
      return (
        '<tr><td><strong>' + esc(s.name) + "</strong></td>" +
        "<td>" + (s.teamCount != null ? s.teamCount : (s.teams ? s.teams.length : "—")) + "</td>" +
        "<td>" + (s.parcoursName ? esc(s.parcoursName) : "—") + "</td>" +
        "<td>" + badge + "</td>" +
        '<td class="hub-table-actions"><button class="hub-btn-icon" data-delete-session="' + esc(s.id) + '" title="Supprimer">🗑️</button></td></tr>'
      );
    }).join("");
    return (
      '<div class="hub-card"><table class="hub-table"><thead><tr>' +
      "<th>Session</th><th>Équipes</th><th>Parcours</th><th>Statut</th><th></th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>"
    );
  }

  async function render(user) {
    var html =
      '<div class="hub-page-header">' +
      '<div><h1 class="hub-page-title">🎯 Sessions</h1>' +
      '<p class="hub-page-sub">Sessions de jeu en cours ou terminées</p></div>' +
      '<div class="hub-page-actions"><button class="hub-btn hub-btn-primary" data-page-action="new-session">➕ Lancer une session</button></div></div>' +
      '<div id="hub-sessions-list" class="hub-loading">Chargement…</div>';
    setTimeout(loadData, 50);
    return html;
  }

  async function loadData() {
    var el = document.getElementById("hub-sessions-list");
    if (!el) return;
    try {
      var data = await HubAPI.getSessions();
      el.innerHTML = renderList(data.items || []);
      bindEvents();
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Erreur: ' + esc(err.message) + "</div>";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-delete-session]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = this.getAttribute("data-delete-session");
        if (!confirm("Supprimer cette session ?")) return;
        try {
          await HubAPI.deleteSession(id);
          HubShell.toast("Session supprimée");
          loadData();
        } catch (err) {
          HubShell.toast("Erreur: " + err.message);
        }
      });
    });
  }

  function showModal() {
    var modal = document.createElement("div");
    modal.className = "hub-modal-overlay";
    modal.innerHTML =
      '<div class="hub-modal">' +
      '<div class="hub-modal-header"><h2>Lancer une session</h2>' +
      '<button class="hub-btn-icon hub-modal-close" data-close-modal>✕</button></div>' +
      '<div class="hub-modal-body">' +
      '<div class="hub-form-group"><label class="hub-form-label">Nom de la session</label>' +
      '<input class="hub-form-input" type="text" id="m-name" placeholder="Session classe de CM2"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Parcours</label>' +
      '<input class="hub-form-input" type="text" id="m-parcours" placeholder="Nom du parcours"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Nombre d\'équipes</label>' +
      '<input class="hub-form-input" type="number" id="m-teams" value="4" min="1"></div>' +
      "</div>" +
      '<div class="hub-modal-footer">' +
      '<button class="hub-btn hub-btn-outline" data-close-modal>Annuler</button>' +
      '<button class="hub-btn hub-btn-primary" id="m-save">Lancer</button></div></div>';
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-close-modal]").forEach(function (b) {
      b.addEventListener("click", function () { modal.remove(); });
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById("m-save").addEventListener("click", async function () {
      var name = document.getElementById("m-name").value.trim();
      if (!name) { HubShell.toast("Nom requis"); return; }
      try {
        await HubAPI.createSession({
          name: name,
          parcoursName: document.getElementById("m-parcours").value.trim(),
          teamCount: parseInt(document.getElementById("m-teams").value, 10) || 4,
          status: "active",
          teams: [],
        });
        modal.remove();
        HubShell.toast("Session lancée !");
        loadData();
      } catch (err) {
        HubShell.toast("Erreur: " + err.message);
      }
    });
  }

  window.hubAction_new_session = showModal;

  return render;
})();
