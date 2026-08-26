/* routes/validations.js — Endpoints /api/validations, /api/validations/remove,
 *                          /api/validations/team
 *
 * Validations de balises par équipe.
 */
import { sendJson, sendOk, sendError, readBody, parseJson } from "../http.js";

export function handleValidations(method, req, res, state) {
  if (method === "POST") return handleValidationsPost(req, res, state);

  if (method === "GET") {
    return sendJson(res, 200, { validations: state.validations });
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleValidationsPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const name = payload ? String(payload.team || "") : "";
  const balise = payload ? String(payload.balise || "") : "";

  if (!name || !balise) return sendError(res, 400, "missing-fields");

  if (!state.validations[name]) state.validations[name] = [];
  if (!state.validations[name].includes(balise)) {
    state.validations[name].push(balise);
  }

  state.saveValidations();
  return sendOk(res, { balises: [...state.validations[name]] });
}

export function handleValidationsRemove(method, req, res, state) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");

  return handleRemovePost(req, res, state);
}

async function handleRemovePost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const name = payload ? String(payload.team || "") : "";
  const balise = payload ? String(payload.balise || "") : "";

  if (!name || !state.validations[name]) {
    return sendError(res, 400, "missing-fields");
  }

  state.validations[name] = state.validations[name].filter((b) => b !== balise);
  state.saveValidations();
  return sendOk(res, { balises: [...state.validations[name]] });
}

export function handleValidationsTeam(method, req, res, state) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");

  return handleTeamPost(req, res, state);
}

async function handleTeamPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const name = payload ? String(payload.team || "") : "";
  if (!name) return sendError(res, 400, "missing-team");

  if (!state.validations[name]) {
    state.validations[name] = [];
    state.saveValidations();
  }

  return sendOk(res);
}
