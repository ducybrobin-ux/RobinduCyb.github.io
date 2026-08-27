/* hub-pages/clients.js — Clients CRUD page */
/* global HubShell, HubAPI */

var renderClients = (function () {
  "use strict";

  var esc = HubShell.escHtml;

  function renderList(items) {
    if (!items.length) {
      return (
        '<div class="hub-card"><div class="hub-empty">' +
        '<div class="hub-empty-icon">👥</div>' +
        '<div class="hub-empty-title">Aucun client</div>' +
        '<div class="hub-empty-desc">Ajoutez vos établissements, collectivités et associations.</div>' +
        '<button class="hub-btn hub-btn-primary" data-page-action="new-client">➕ Ajouter un client</button>' +
        "</div></div>"
      );
    }
    var rows = items.map(function (c) {
      return (
        '<tr><td><strong>' + esc(c.name) + "</strong></td>" +
        "<td>" + esc(c.contact || "—") + "</td>" +
        "<td>" + esc(c.email || "—") + "</td>" +
        "<td>" + esc(c.phone || "—") + "</td>" +
        "<td>" + formatTime(c.created) + "</td>" +
        '<td class="hub-table-actions"><button class="hub-btn-icon" data-delete-client="' + esc(c.id) + '" title="Supprimer">🗑️</button></td></tr>'
      );
    }).join("");
    return (
      '<div class="hub-card"><table class="hub-table"><thead><tr>' +
      "<th>Nom</th><th>Contact</th><th>Email</th><th>Tél.</th><th>Créé</th><th></th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>"
    );
  }

  function formatTime(ts) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  async function render(user) {
    var html =
      '<div class="hub-page-header">' +
      '<div><h1 class="hub-page-title">👥 Clients & Prescripteurs</h1>' +
      '<p class="hub-page-sub">Vos contacts professionnels</p></div>' +
      '<div class="hub-page-actions"><button class="hub-btn hub-btn-primary" data-page-action="new-client">➕ Ajouter un client</button></div></div>' +
      '<div id="hub-clients-list" class="hub-loading">Chargement…</div>';
    setTimeout(loadData, 50);
    return html;
  }

  async function loadData() {
    var el = document.getElementById("hub-clients-list");
    if (!el) return;
    try {
      var data = await HubAPI.getClients();
      el.innerHTML = renderList(data.items || []);
      bindEvents();
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Erreur: ' + esc(err.message) + "</div>";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-delete-client]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = this.getAttribute("data-delete-client");
        if (!confirm("Supprimer ce client ?")) return;
        try {
          await HubAPI.deleteClient(id);
          HubShell.toast("Client supprimé");
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
      '<div class="hub-modal-header"><h2>Nouveau client</h2>' +
      '<button class="hub-btn-icon hub-modal-close" data-close-modal>✕</button></div>' +
      '<div class="hub-modal-body">' +
      '<div class="hub-form-group"><label class="hub-form-label">Nom</label>' +
      '<input class="hub-form-input" type="text" id="m-name" placeholder="Nom du client"></div>' +
      '<div class="hub-form-row">' +
      '<div class="hub-form-group"><label class="hub-form-label">Contact</label>' +
      '<input class="hub-form-input" type="text" id="m-contact" placeholder="Personne contact"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Email</label>' +
      '<input class="hub-form-input" type="email" id="m-email" placeholder="email@exemple.fr"></div></div>' +
      '<div class="hub-form-row">' +
      '<div class="hub-form-group"><label class="hub-form-label">Téléphone</label>' +
      '<input class="hub-form-input" type="text" id="m-phone" placeholder="06…"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Type</label>' +
      '<select class="hub-form-input" id="m-type"><option value="école">École</option>' +
      '<option value="collectivité">Collectivité</option><option value="associations">Association</option>' +
      '<option value="entreprise">Entreprise</option></select></div></div>' +
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
        await HubAPI.createClient({
          name: name,
          contact: document.getElementById("m-contact").value.trim(),
          email: document.getElementById("m-email").value.trim(),
          phone: document.getElementById("m-phone").value.trim(),
          type: document.getElementById("m-type").value,
          status: "active",
        });
        modal.remove();
        HubShell.toast("Client ajouté !");
        loadData();
      } catch (err) {
        HubShell.toast("Erreur: " + err.message);
      }
    });
  }

  window.hubAction_new_client = showModal;

  return render;
})();
