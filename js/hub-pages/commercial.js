/* hub-pages/commercial.js — Commercial (Devis/Factures) page */
/* global HubShell, HubAPI */

var renderCommercial = (function () {
  "use strict";

  var esc = HubShell.escHtml;

  function money(n) {
    if (n == null) return "—";
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
  }

  function renderList(items) {
    if (!items.length) {
      return (
        '<div class="hub-card"><div class="hub-empty">' +
        '<div class="hub-empty-icon">💰</div>' +
        '<div class="hub-empty-title">Aucun devis ou facture</div>' +
        '<div class="hub-empty-desc">Créez des devis et factures pour vos clients.</div>' +
        '<button class="hub-btn hub-btn-primary" data-page-action="new-devis">➕ Nouveau devis</button>' +
        "</div></div>"
      );
    }
    var rows = items.map(function (d) {
      var badge = d.status === "payée" || d.status === "paid"
        ? '<span class="hub-badge hub-badge-green">Payé</span>'
        : '<span class="hub-badge hub-badge-gray">' + esc(d.status || "brouillon") + "</span>";
      return (
        '<tr><td><strong>' + esc(d.name) + "</strong></td>" +
        "<td>" + (d.clientName ? esc(d.clientName) : "—") + "</td>" +
        "<td>" + money(d.amount) + "</td>" +
        "<td>" + badge + "</td>" +
        '<td class="hub-table-actions"><button class="hub-btn-icon" data-delete-devis="' + esc(d.id) + '" title="Supprimer">🗑️</button></td></tr>'
      );
    }).join("");
    return (
      '<div class="hub-card"><table class="hub-table"><thead><tr>' +
      "<th>Devis</th><th>Client</th><th>Montant</th><th>Statut</th><th></th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>"
    );
  }

  async function render(user) {
    var html =
      '<div class="hub-page-header">' +
      '<div><h1 class="hub-page-title">💰 Commercial</h1>' +
      '<p class="hub-page-sub">Devis, factures et suivi commercial</p></div>' +
      '<div class="hub-page-actions"><button class="hub-btn hub-btn-primary" data-page-action="new-devis">➕ Nouveau devis</button></div></div>' +
      '<div id="hub-commercial-list" class="hub-loading">Chargement…</div>';
    setTimeout(loadData, 50);
    return html;
  }

  async function loadData() {
    var el = document.getElementById("hub-commercial-list");
    if (!el) return;
    try {
      var data = await HubAPI.getCommercial();
      el.innerHTML = renderList(data.items || []);
      bindEvents();
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Erreur: ' + esc(err.message) + "</div>";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-delete-devis]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = this.getAttribute("data-delete-devis");
        if (!confirm("Supprimer ce devis ?")) return;
        try {
          await HubAPI.deleteDevis(id);
          HubShell.toast("Devis supprimé");
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
      '<div class="hub-modal-header"><h2>Nouveau devis</h2>' +
      '<button class="hub-btn-icon hub-modal-close" data-close-modal>✕</button></div>' +
      '<div class="hub-modal-body">' +
      '<div class="hub-form-group"><label class="hub-form-label">Libellé</label>' +
      '<input class="hub-form-input" type="text" id="m-name" placeholder="Devis parcours scolaire"></div>' +
      '<div class="hub-form-row">' +
      '<div class="hub-form-group"><label class="hub-form-label">Client</label>' +
      '<input class="hub-form-input" type="text" id="m-client" placeholder="Nom du client"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Montant (€)</label>' +
      '<input class="hub-form-input" type="number" id="m-amount" value="0" min="0" step="0.01"></div></div>' +
      "</div>" +
      '<div class="hub-modal-footer">' +
      '<button class="hub-btn hub-btn-outline" data-close-modal>Annuler</button>' +
      '<button class="hub-btn hub-btn-primary" id="m-save">Créer</button></div></div>';
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-close-modal]").forEach(function (b) {
      b.addEventListener("click", function () { modal.remove(); });
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById("m-save").addEventListener("click", async function () {
      var name = document.getElementById("m-name").value.trim();
      if (!name) { HubShell.toast("Libellé requis"); return; }
      try {
        await HubAPI.createDevis({
          name: name,
          clientName: document.getElementById("m-client").value.trim(),
          amount: parseFloat(document.getElementById("m-amount").value) || 0,
          status: "brouillon",
        });
        modal.remove();
        HubShell.toast("Devis créé !");
        loadData();
      } catch (err) {
        HubShell.toast("Erreur: " + err.message);
      }
    });
  }

  window.hubAction_new_devis = showModal;

  return render;
})();
