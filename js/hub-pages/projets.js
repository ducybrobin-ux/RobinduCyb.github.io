/* hub-pages/projets.js — Projets CRUD page */
/* global HubShell, HubAPI */

var renderProjets = (function () {
  "use strict";

  var esc = HubShell.escHtml;

  function statusBadge(s) {
    var cls = "hub-badge";
    if (s === "active") cls += " hub-badge-green";
    else if (s === "draft") cls += " hub-badge-gray";
    else if (s === "archived") cls += " hub-badge-red";
    return '<span class="' + cls + '">' + esc(s || "draft") + "</span>";
  }

  function renderList(items) {
    if (!items.length) {
      return (
        '<div class="hub-card"><div class="hub-empty">' +
        '<div class="hub-empty-icon">📁</div>' +
        '<div class="hub-empty-title">Aucun projet</div>' +
        '<div class="hub-empty-desc">Créez votre premier projet.</div>' +
        '<button class="hub-btn hub-btn-primary" data-page-action="new-projet">➕ Créer</button>' +
        "</div></div>"
      );
    }

    var rows = items.map(function (p) {
      return (
        '<tr class="hub-table-row" data-projet-id="' + esc(p.id) + '">' +
        '<td><strong>' + esc(p.name) + "</strong></td>" +
        "<td>" + statusBadge(p.status) + "</td>" +
        "<td>" + esc(p.description ? p.description.substring(0, 60) : "") + "</td>" +
        "<td>" + formatTime(p.created) + "</td>" +
        '<td class="hub-table-actions">' +
        '<button class="hub-btn-icon" data-edit-projet="' + esc(p.id) + '" title="Modifier">✏️</button>' +
        '<button class="hub-btn-icon" data-delete-projet="' + esc(p.id) + '" title="Supprimer">🗑️</button>' +
        "</td></tr>"
      );
    }).join("");

    return (
      '<div class="hub-card">' +
      '<table class="hub-table"><thead><tr>' +
      "<th>Nom</th><th>Statut</th><th>Description</th><th>Créé</th><th></th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>"
    );
  }

  function formatTime(ts) {
    if (!ts) return "—";
    var d = new Date(ts);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  async function render(user) {
    var html =
      '<div class="hub-page-header">' +
      '<div><h1 class="hub-page-title">📁 Projets</h1>' +
      '<p class="hub-page-sub">Gérez vos projets éducatifs</p></div>' +
      '<div class="hub-page-actions">' +
      '<button class="hub-btn hub-btn-primary" data-page-action="new-projet">➕ Nouveau projet</button>' +
      "</div></div>" +
      '<div id="hub-projets-list" class="hub-loading">Chargement…</div>';

    setTimeout(loadData, 50);
    return html;
  }

  async function loadData() {
    var el = document.getElementById("hub-projets-list");
    if (!el) return;
    try {
      var data = await HubAPI.getProjets();
      el.innerHTML = renderList(data.items || []);
      bindEvents();
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Erreur: ' + esc(err.message) + "</div>";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-delete-projet]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = this.getAttribute("data-delete-projet");
        if (!confirm("Supprimer ce projet ?")) return;
        try {
          await HubAPI.deleteProjet(id);
          HubShell.toast("Projet supprimé");
          loadData();
        } catch (err) {
          HubShell.toast("Erreur: " + err.message);
        }
      });
    });

    document.querySelectorAll("[data-edit-projet]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = this.getAttribute("data-edit-projet");
        HubShell.toast("Édition de " + id);
      });
    });
  }

  function showCreateModal() {
    var modal = document.createElement("div");
    modal.className = "hub-modal-overlay";
    modal.id = "hub-modal-projet";
    modal.innerHTML =
      '<div class="hub-modal">' +
      '<div class="hub-modal-header"><h2>Nouveau projet</h2>' +
      '<button class="hub-btn-icon hub-modal-close" data-close-modal>✕</button></div>' +
      '<div class="hub-modal-body">' +
      '<div class="hub-form-group"><label class="hub-form-label">Nom</label>' +
      '<input class="hub-form-input" type="text" id="modal-projet-name" placeholder="Mon projet"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Description</label>' +
      '<textarea class="hub-form-input" id="modal-projet-desc" rows="3" placeholder="Description du projet…"></textarea></div>' +
      "</div>" +
      '<div class="hub-modal-footer">' +
      '<button class="hub-btn hub-btn-outline" data-close-modal>Annuler</button>' +
      '<button class="hub-btn hub-btn-primary" id="modal-projet-save">Créer</button></div>' +
      "</div>";
    document.body.appendChild(modal);

    modal.querySelector("[data-close-modal]").addEventListener("click", function () {
      modal.remove();
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.remove();
    });

    document.getElementById("modal-projet-save").addEventListener("click", async function () {
      var name = document.getElementById("modal-projet-name").value.trim();
      if (!name) { HubShell.toast("Nom requis"); return; }
      try {
        await HubAPI.createProjet({
          name: name,
          description: document.getElementById("modal-projet-desc").value.trim(),
        });
        modal.remove();
        HubShell.toast("Projet créé !");
        loadData();
      } catch (err) {
        HubShell.toast("Erreur: " + err.message);
      }
    });
  }

  window.hubAction_new_projet = showCreateModal;

  return render;
})();
