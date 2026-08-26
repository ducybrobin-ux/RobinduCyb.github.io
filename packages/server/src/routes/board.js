/* routes/board.js — Endpoints /api/board, /api/answer, /api/answers
 *
 * Tableau de bord : messages diffusés, épreuves, réponses.
 * Logique identique à server.ps1 (seq numbers, purge, etc.).
 */
import { sendJson, sendOk, sendError, readBody, parseJson } from "../http.js";

export function handleBoard(method, req, res, state) {
  if (method === "GET") {
    let challenge = state.boardChallenge;
    if (challenge) {
      challenge = { ...challenge };
      delete challenge.answer;
    }

    // Purge des logouts trop anciens (> 10 min)
    const now = Date.now();
    for (const [key, ts] of Object.entries(state.boardLogout)) {
      if (now - ts > 10 * 60 * 1000) delete state.boardLogout[key];
    }

    return sendJson(res, 200, {
      seq: state.boardSeq,
      message: state.boardMessage,
      challenge,
      challengeSeq: state.challengeSeq,
      logoutTeams: Object.keys(state.boardLogout),
      logoutSeq: state.logoutSeq,
    });
  }

  if (method === "POST") {
    return handleBoardPost(req, res, state);
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleBoardPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload) return sendError(res, 400, "invalid-payload");

  const { action } = payload;

  if (action === "message") {
    const msg = { fr: "", en: "", nl: "", de: "", zh: "", ja: "" };
    const provided = { fr: false, en: false, nl: false, de: false, zh: false, ja: false };

    if (payload.messages) {
      for (const k of ["fr", "en", "nl", "de", "zh", "ja"]) {
        if (payload.messages[k] != null) {
          msg[k] = String(payload.messages[k]);
          provided[k] = msg[k].trim() !== "";
        }
      }
    } else {
      msg.fr = String(payload.text || "");
      provided.fr = msg.fr.trim() !== "";
    }

    state.boardMessage = msg;
    state.boardSeq++;

    return sendOk(res, { seq: state.boardSeq });
  }

  if (action === "logout" && payload.team) {
    const teamKey = String(payload.team).trim().toLowerCase();
    if (teamKey) {
      state.boardLogout[teamKey] = Date.now();
      state.logoutSeq++;
      return sendOk(res, { logoutSeq: state.logoutSeq });
    }
  }

  if (action === "logoutAck" && payload.team) {
    const teamKey = String(payload.team).trim().toLowerCase();
    if (teamKey) delete state.boardLogout[teamKey];
    return sendOk(res);
  }

  if (action === "challenge" && payload.challenge) {
    const ch = { ...payload.challenge };
    delete ch.answer;
    state.boardChallenge = ch;
    state.challengeSeq++;
    state.boardSeq++;
    return sendOk(res, { challengeSeq: state.challengeSeq });
  }

  if (action === "clear") {
    state.boardMessage = {};
    state.boardChallenge = null;
    state.boardSeq++;
    state.challengeSeq++;
    return sendOk(res);
  }

  sendError(res, 400, "bad-action");
}

export function handleAnswer(method, req, res, state) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");

  return handleAnswerPost(req, res, state);
}

async function handleAnswerPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload || !payload.text) return sendError(res, 400, "empty");

  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 8);

  state.answers.push({
    team: String(payload.team || ""),
    text: String(payload.text),
    challengeId: String(payload.challengeId || ""),
    at: timeStr,
  });

  if (state.answers.length > 60) {
    state.answers = state.answers.slice(-60);
  }

  return sendOk(res);
}

export function handleAnswers(method, req, res, state) {
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");
  return sendJson(res, 200, { answers: [...state.answers] });
}
