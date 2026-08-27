/* hub-pages/planning.js — Planning / Calendar page */
/* global HubShell, HubAPI */

var renderPlanning = (function () {
  "use strict";

  var esc = HubShell.escHtml;

  function renderList(items) {
    if (!items.length) {
      return (
        '<div class="hub-card"><div class="hub-empty">' +
        '<div class="hub-empty-icon">📅</div>' +
        '<div class="hub-empty-title">Aucun événement planifié</div>' +
        '<div class="hub-empty-desc">Planifiez vos sessions et suivez votre agenda.</div>' +
        '<button class="hub-btn hub-btn-primary" data-page-action="new-event">➕ Planifier</button>' +
        "</div></div>"
      );
    }
    var sorted = items.slice().sort(function (a, b) {
      return (a.date || "").localeCompare(b.date || "");
    });
    var rows = sorted.map(function (e) {
      return (
        '<tr><td><strong>' + esc(e.name) + "</strong></td>" +
        "<td>" + esc(e.date || "—") + "</td>" +
        "<td>" + esc(e.time || "—") + "</td>" +
        "<td>" + esc(e.location || "—") + "</td>" +
        '<td class="hub-table-actions"><button class="hub-btn-icon" data-delete-event="' + esc(e.id) + '" title="Supprimer">🗑️</button></td></tr>'
      );
    }).join("");
    return (
      '<div class="hub-card"><table class="hub-table"><thead><tr>' +
      "<th>Événement</th><th>Date</th><th>Heure</th><th>Lieu</th><th></th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>"
    );
  }

  async function render(user) {
    var html =
      '<div class="hub-page-header">' +
      '<div><h1 class="hub-page-title">📅 Planning</h1>' +
      '<p class="hub-page-sub">Calendrier des sessions et événements</p></div>' +
      '<div class="hub-page-actions"><button class="hub-btn hub-btn-primary" data-page-action="new-event">➕ Planifier</button></div></div>' +
      '<div id="hub-planning-list" class="hub-loading">Chargement…</div>';
    setTimeout(loadData, 50);
    return html;
  }

  async function loadData() {
    var el = document.getElementById("hub-planning-list");
    if (!el) return;
    try {
      var data = await HubAPI.getPlanning();
      el.innerHTML = renderList(data.items || []);
      bindEvents();
    } catch (err) {
      el.innerHTML = '<div class="hub-alert hub-alert-red">Erreur: ' + esc(err.message) + "</div>";
    }
  }

  function bindEvents() {
    document.querySelectorAll("[data-delete-event]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var id = this.getAttribute("data-delete-event");
        if (!confirm("Supprimer cet événement ?")) return;
        try {
          await HubAPI.deleteEvent(id);
          HubShell.toast("Événement supprimé");
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
      '<div class="hub-modal-header"><h2>Planifier un événement</h2>' +
      '<button class="hub-btn-icon hub-modal-close" data-close-modal>✕</button></div>' +
      '<div class="hub-modal-body">' +
      '<div class="hub-form-group"><label class="hub-form-label">Nom</label>' +
      '<input class="hub-form-input" type="text" id="m-name" placeholder="Session découverte"></div>' +
      '<div class="hub-form-row">' +
      '<div class="hub-form-group"><label class="hub-form-label">Date</label>' +
      '<input class="hub-form-input" type="date" id="m-date"></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Heure</label>' +
      '<input class="hub-form-input" type="time" id="m-time"></div></div>' +
      '<div class="hub-form-group"><label class="hub-form-label">Lieu</label>' +
      '<input class="hub-form-input" type="text" id="m-loc" placeholder="École, parc, salle…"></div>' +
      "</div>" +
      '<div class="hub-modal-footer">' +
      '<button class="hub-btn hub-btn-outline" data-close-modal>Annuler</button>' +
      '<button class="hub-btn hub-btn-primary" id="m-save">Planifier</button></div></div>';
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-close-modal]").forEach(function (b) {
      b.addEventListener("click", function () { modal.remove(); });
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById("m-save").addEventListener("click", async function () {
      var name = document.getElementById("m-name").value.trim();
      if (!name) { HubShell.toast("Nom requis"); return; }
      try {
        await HubAPI.createEvent({
          name: name,
          date: document.getElementById("m-date").value,
          time: document.getElementById("m-time").value,
          location: document.getElementById("m-loc").value.trim(),
          status: "planned",
        });
        modal.remove();
        HubShell.toast("Événement planifié !");
        loadData();
      } catch (err) {
        HubShell.toast("Erreur: " + err.message);
      }
    });
  }

  window.hubAction_new_event = showModal;

  return render;
})();
