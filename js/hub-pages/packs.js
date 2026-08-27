/* hub-pages/packs.js — Packs CRUD page */
/* global HubShell, HubAPI */

var renderPacks = (function () {
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
        '<div class="hub-empty-icon">📦</div>' +
        '<div class="hub-empty-title">Aucun pack</div>' +
        '<div class="hub-empty-desc">Importez un pack depuis l\'Atelier.</div>' +
        '<a class="hub-btn hub-btn-outline" href="../player/atelier.html">🧩 Ouvrir l\'Atelier</a>' +
        "</div></div>"
      );
    }

    var rows = items.map(function (p) {
      return (
        '<tr class="hub-table-row">' +
        '<td><strong>' + esc(p.name) + "</strong></td>" +
        "<td>" + statusBadge(p.status) + "</td>" +
        "<td>" + esc(p.description ? p.description.substring(0, 60) : "") + "</td>" +
        "<td>" + formatTime(p.created) + "</td>" +
        '<td class="hub-table-actions">' +
        '<button class="hub-btn-icon" data-delete-pack="' + esc(p.id) + '" title="Supprimer">🗑️</button>' +
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
      '<div><h1 class="hub-page-title">📦 Packs</h1>' +
      '<p class="hub-page-sub">Bundles de contenu éducatif</p></div>' +
      '<div class="hub-page-actions">' +
      '<button class="hub-btn hub-btn-primary" data-page-action="import-pack">📤 Importer un pack</button>' +
      "</div></div>" +
      '<div id="hub-packs-list" class="hub-loading">Chargement…</div>';

    setTimeout(loadData, 50);
    return html;
  }

  async function loadData() {
    var el = document.getElementById("hub-packs-list");
    if (!el) return;
    try {
      var data = await HubAPI.getPacks();
      el.innerHTML = renderList(data.items || []);
      bindEvents();
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Erreur: ' + esc(err.message) + "</div>";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-delete-pack]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = this.getAttribute("data-delete-pack");
        if (!confirm("Supprimer ce pack ?")) return;
        try {
          await HubAPI.deletePack(id);
          HubShell.toast("Pack supprimé");
          loadData();
        } catch (err) {
          HubShell.toast("Erreur: " + err.message);
        }
      });
    });
  }

  function showImportModal() {
    var modal = document.createElement("div");
    modal.className = "hub-modal-overlay";
    modal.id = "hub-modal-pack";
    modal.innerHTML =
      '<div class="hub-modal">' +
      '<div class="hub-modal-header"><h2>Importer un pack</h2>' +
      '<button class="hub-btn-icon hub-modal-close" data-close-modal>✕</button></div>' +
      '<div class="hub-modal-body">' +
      '<div class="hub-form-group"><label class="hub-form-label">Nom du pack</label>' +
      '<input class="hub-form-input" type="text" id="modal-pack-name" placeholder="Mon pack"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Description</label>' +
      '<textarea class="hub-form-input" id="modal-pack-desc" rows="3" placeholder="Description du pack…"></textarea></div>' +
      "</div>" +
      '<div class="hub-modal-footer">' +
      '<button class="hub-btn hub-btn-outline" data-close-modal>Annuler</button>' +
      '<button class="hub-btn hub-btn-primary" id="modal-pack-save">Importer</button></div>' +
      "</div>";
    document.body.appendChild(modal);

    modal.querySelector("[data-close-modal]").addEventListener("click", function () {
      modal.remove();
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.remove();
    });

    document.getElementById("modal-pack-save").addEventListener("click", async function () {
      var name = document.getElementById("modal-pack-name").value.trim();
      if (!name) { HubShell.toast("Nom requis"); return; }
      try {
        await HubAPI.createPack({
          name: name,
          description: document.getElementById("modal-pack-desc").value.trim(),
        });
        modal.remove();
        HubShell.toast("Pack importé !");
        loadData();
      } catch (err) {
        HubShell.toast("Erreur: " + err.message);
      }
    });
  }

  window.hubAction_import_pack = showImportModal;
  window.hubAction_create_pack = showImportModal;

  return render;
})();
