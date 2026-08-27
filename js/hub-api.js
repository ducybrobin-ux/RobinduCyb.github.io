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
  };
})();
