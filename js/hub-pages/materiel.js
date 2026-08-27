/* hub-pages/materiel.js — Materiel & Kits CRUD page */
/* global HubShell, HubAPI */

var renderMateriel = (function () {
  "use strict";

  var esc = HubShell.escHtml;

  function renderList(items) {
    if (!items.length) {
      return (
        '<div class="hub-card"><div class="hub-empty">' +
        '<div class="hub-empty-icon">🔧</div>' +
        '<div class="hub-empty-title">Aucun matériel enregistré</div>' +
        '<div class="hub-empty-desc">Gérez vos balises, kits et équipements.</div>' +
        '<button class="hub-btn hub-btn-primary" data-page-action="new-materiel">➕ Ajouter du matériel</button>' +
        "</div></div>"
      );
    }
    var rows = items.map(function (m) {
      var qty = m.quantity != null ? m.quantity : 1;
      return (
        '<tr><td><strong>' + esc(m.name) + "</strong></td>" +
        "<td>" + esc(m.category || "—") + "</td>" +
        "<td>" + qty + "</td>" +
        "<td>" + (m.available ? '<span class="hub-badge hub-badge-green">Dispo</span>' : '<span class="hub-badge hub-badge-red">En usage</span>') + "</td>" +
        '<td class="hub-table-actions"><button class="hub-btn-icon" data-delete-materiel="' + esc(m.id) + '" title="Supprimer">🗑️</button></td></tr>'
      );
    }).join("");
    return (
      '<div class="hub-card"><table class="hub-table"><thead><tr>' +
      "<th>Nom</th><th>Catégorie</th><th>Qté</th><th>Statut</th><th></th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>"
    );
  }

  async function render(user) {
    var html =
      '<div class="hub-page-header">' +
      '<div><h1 class="hub-page-title">🔧 Matériel & Kits</h1>' +
      '<p class="hub-page-sub">Inventaire et réservation de matériel</p></div>' +
      '<div class="hub-page-actions"><button class="hub-btn hub-btn-primary" data-page-action="new-materiel">➕ Ajouter du matériel</button></div></div>' +
      '<div id="hub-materiel-list" class="hub-loading">Chargement…</div>';
    setTimeout(loadData, 50);
    return html;
  }

  async function loadData() {
    var el = document.getElementById("hub-materiel-list");
    if (!el) return;
    try {
      var data = await HubAPI.getMateriel();
      el.innerHTML = renderList(data.items || []);
      bindEvents();
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Erreur: ' + esc(err.message) + "</div>";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-delete-materiel]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = this.getAttribute("data-delete-materiel");
        if (!confirm("Supprimer ce matériel ?")) return;
        try {
          await HubAPI.deleteMateriel(id);
          HubShell.toast("Matériel supprimé");
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
      '<div class="hub-modal-header"><h2>Nouveau matériel</h2>' +
      '<button class="hub-btn-icon hub-modal-close" data-close-modal>✕</button></div>' +
      '<div class="hub-modal-body">' +
      '<div class="hub-form-group"><label class="hub-form-label">Nom</label>' +
      '<input class="hub-form-input" type="text" id="m-name" placeholder="Nom du matériel"></div>' +
      '<div class="hub-form-row">' +
      '<div class="hub-form-group"><label class="hub-form-label">Catégorie</label>' +
      '<select class="hub-form-input" id="m-cat"><option value="balise">Balise</option>' +
      '<option value="kit">Kit</option><option value="tablette">Tablette</option>' +
      '<option value="accessoire">Accessoire</option></select></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Quantité</label>' +
      '<input class="hub-form-input" type="number" id="m-qty" value="1" min="1"></div></div>' +
      "</div>" +
      '<div class="hub-modal-footer">' +
      '<button class="hub-btn hub-btn-outline" data-close-modal>Annuler</button>' +
      '<button class="hub-btn hub-btn-primary" id="m-save">Ajouter</button></div></div>';
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-close-modal]").forEach(function (b) {
      b.addEventListener("click", function () { modal.remove(); });
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById("m-save").addEventListener("click", async function () {
      var name = document.getElementById("m-name").value.trim();
      if (!name) { HubShell.toast("Nom requis"); return; }
      try {
        await HubAPI.createMateriel({
          name: name,
          category: document.getElementById("m-cat").value,
          quantity: parseInt(document.getElementById("m-qty").value, 10) || 1,
          available: true,
          status: "active",
        });
        modal.remove();
        HubShell.toast("Matériel ajouté !");
        loadData();
      } catch (err) {
        HubShell.toast("Erreur: " + err.message);
      }
    });
  }

  window.hubAction_new_materiel = showModal;

  return render;
})();
