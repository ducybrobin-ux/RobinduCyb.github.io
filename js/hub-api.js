/* hub-api.js — CRUD API client for CURIOS Project Hub
 *
 * Projets, parcours, packs — fetch with auth token.
 * Zero dependencies.
 */
(function () {
  "use strict";

  var API = "/api/hub";

  function headers() {
    var token = null;
    try { token = localStorage.getItem("curios_hub_token"); } catch {}
    return {
      "Content-Type": "application/json",
      Authorization: token ? "Bearer " + token : "",
    };
  }

  async function request(method, path, body) {
    var opts = { method: method, headers: headers() };
    if (body) opts.body = JSON.stringify(body);
    var res = await fetch(API + path, opts);
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error(data.error || "request-failed");
    return data;
  }

  /* ---- Projets ---- */
  function getProjets() { return request("GET", "/projets"); }
  function createProjet(p) { return request("POST", "/projets", p); }
  function updateProjet(id, p) { return request("PUT", "/projets/" + id, p); }
  function deleteProjet(id) { return request("DELETE", "/projets/" + id); }

  /* ---- Parcours ---- */
  function getParcours() { return request("GET", "/parcours"); }
  function createParcours(p) { return request("POST", "/parcours", p); }
  function updateParcours(id, p) { return request("PUT", "/parcours/" + id, p); }
  function deleteParcours(id) { return request("DELETE", "/parcours/" + id); }

  /* ---- Packs ---- */
  function getPacks() { return request("GET", "/packs"); }
  function createPack(p) { return request("POST", "/packs", p); }
  function updatePack(id, p) { return request("PUT", "/packs/" + id, p); }
  function deletePack(id) { return request("DELETE", "/packs/" + id); }

  /* ---- Clients ---- */
  function getClients() { return request("GET", "/clients"); }
  function createClient(p) { return request("POST", "/clients", p); }
  function updateClient(id, p) { return request("PUT", "/clients/" + id, p); }
  function deleteClient(id) { return request("DELETE", "/clients/" + id); }

  /* ---- Materiel ---- */
  function getMateriel() { return request("GET", "/materiel"); }
  function createMateriel(p) { return request("POST", "/materiel", p); }
  function updateMateriel(id, p) { return request("PUT", "/materiel/" + id, p); }
  function deleteMateriel(id) { return request("DELETE", "/materiel/" + id); }

  /* ---- Sessions ---- */
  function getSessions() { return request("GET", "/sessions-data"); }
  function createSession(p) { return request("POST", "/sessions-data", p); }
  function updateSession(id, p) { return request("PUT", "/sessions-data/" + id, p); }
  function deleteSession(id) { return request("DELETE", "/sessions-data/" + id); }

  /* ---- Planning ---- */
  function getPlanning() { return request("GET", "/planning"); }
  function createEvent(p) { return request("POST", "/planning", p); }
  function updateEvent(id, p) { return request("PUT", "/planning/" + id, p); }
  function deleteEvent(id) { return request("DELETE", "/planning/" + id); }

  /* ---- Commercial ---- */
  function getCommercial() { return request("GET", "/commercial"); }
  function createDevis(p) { return request("POST", "/commercial", p); }
  function updateDevis(id, p) { return request("PUT", "/commercial/" + id, p); }
  function deleteDevis(id) { return request("DELETE", "/commercial/" + id); }

  /* ---- Analytics ---- */
  function getAnalytics() { return request("GET", "/analytics"); }

  window.HubAPI = {
    getProjets: getProjets,
    createProjet: createProjet,
    updateProjet: updateProjet,
    deleteProjet: deleteProjet,
    getParcours: getParcours,
    createParcours: createParcours,
    updateParcours: updateParcours,
    deleteParcours: deleteParcours,
    getPacks: getPacks,
    createPack: createPack,
    updatePack: updatePack,
    deletePack: deletePack,
    getClients: getClients,
    createClient: createClient,
    updateClient: updateClient,
    deleteClient: deleteClient,
    getMateriel: getMateriel,
    createMateriel: createMateriel,
    updateMateriel: updateMateriel,
    deleteMateriel: deleteMateriel,
    getSessions: getSessions,
    createSession: createSession,
    updateSession: updateSession,
    deleteSession: deleteSession,
    getPlanning: getPlanning,
    createEvent: createEvent,
    updateEvent: updateEvent,
    deleteEvent: deleteEvent,
    getCommercial: getCommercial,
    createDevis: createDevis,
    updateDevis: updateDevis,
    deleteDevis: deleteDevis,
    getAnalytics: getAnalytics,
  };
})();
