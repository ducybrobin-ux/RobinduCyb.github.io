/* parcours.js — Validation structurelle d'un document « ducyb-parcours » v1.
 * Retourne un tableau d'erreurs (vide si le document est valide).
 */

export function validateParcours(doc) {
  const errs = [];
  const err = (m) => errs.push(m);

  if (doc.$format !== "ducyb-parcours") err(`$format attendu "ducyb-parcours", reçu "${doc.$format}"`);
  if (doc.$version !== 1) err(`$version 1 attendue, reçue ${doc.$version}`);
  if (!doc.id) err("id requis");
  if (!doc.title) err("title requis");

  for (const k of ["metadata", "pedagogy", "game", "location"]) {
    if (typeof doc[k] !== "object" || doc[k] === null || Array.isArray(doc[k]))
      err(`bloc ${k} requis`);
  }
  if (errs.length) return errs;

  /* audience */
  if (doc.audience) {
    const { minAge, maxAge } = doc.audience;
    if (minAge != null && maxAge != null && !(minAge <= maxAge))
      err("audience : minAge > maxAge");
  }

  /* unicité des ids sur l'ensemble des entités */
  const ids = new Set();
  const unique = (id, kind) => {
    if (ids.has(id)) err(`${kind} « ${id} » : id déjà utilisé`);
    ids.add(id);
  };

  /* stations */
  if (!Array.isArray(doc.stations)) err("stations[] requise");
  else {
    for (const s of doc.stations) {
      for (const k of ["id", "label", "code"]) if (!s[k]) err(`station : champ requis manquant (${k})`);
      unique(s.id, "station");
      if (s.lat == null && s.x == null) err(`station ${s.id} : ni GPS (lat/lng) ni schématique (x/y)`);
      if (!Array.isArray(s.missions)) err(`station ${s.id} : missions[] requise`);
    }
  }

  /* missions */
  if (!Array.isArray(doc.missions)) err("missions[] requise");
  else {
    for (const m of doc.missions) {
      if (!m.id) { err("mission sans id"); continue; }
      unique(m.id, "mission");
      if (!["enigme", "quiz", "observation", "enquete", "media"].includes(m.type))
        err(`mission ${m.id} : type inconnu « ${m.type} »`);
      if (m.type === "enigme") {
        if (!m.stationId) err(`mission ${m.id} : stationId requis`);
        const nivs = m.difficultyLevels ?? {};
        for (const n of ["facile", "moyen", "difficile"]) {
          const e = nivs[n];
          if (!e) { err(`mission ${m.id} : difficultyLevels.${n} manquant`); continue; }
          if (!e.text) err(`mission ${m.id}.${n} : text requis`);
          if (!Array.isArray(e.answers) || e.answers.length < 1)
            err(`mission ${m.id}.${n} : answers[] requis (>=1)`);
          if (!Array.isArray(e.ages)) err(`mission ${m.id}.${n} : ages requis ([min,max])`);
        }
      }
      if (m.type === "quiz") {
        if (!m.characterId) err(`mission ${m.id} : characterId requis`);
        if (!Array.isArray(m.questions) || !m.questions.length)
          err(`mission ${m.id} : questions[] requise (>=1)`);
        (m.questions ?? []).forEach((q, i) => {
          if (!q.q || !Array.isArray(q.options) || q.options.length < 2)
            err(`mission ${m.id}.questions[${i}] incomplète`);
          if (!(q.answer >= 0 && q.answer < (q.options?.length ?? 0)))
            err(`mission ${m.id}.questions[${i}].answer hors limites`);
        });
      }
    }
  }

  /* characters */
  if (!Array.isArray(doc.characters)) err("characters[] requise");
  else for (const c of doc.characters) {
    if (!c.id || !c.nom) err(`character : id/nom requis (${c.id || "?"})`);
    unique(c.id, "character");
  }

  /* cohérence croisée des références */
  const sids = new Set((doc.stations ?? []).map((s) => s.id));
  const cids = new Set((doc.characters ?? []).map((c) => c.id));
  const mids = new Set((doc.missions ?? []).map((m) => m.id));
  for (const s of doc.stations ?? []) {
    for (const mid of s.missions ?? [])
      if (!mids.has(mid)) err(`station ${s.id} → mission inconnue « ${mid} »`);
    if (s.discoveryId && !cids.has(s.discoveryId))
      err(`station ${s.id} → character inconnu « ${s.discoveryId} »`);
  }
  for (const m of doc.missions ?? []) {
    if (m.stationId && !sids.has(m.stationId)) err(`mission ${m.id} → station inconnue « ${m.stationId} »`);
    if (m.characterId && !cids.has(m.characterId)) err(`mission ${m.id} → character inconnu « ${m.characterId} »`);
  }

  /* debriefing */
  if (doc.debriefing && typeof doc.debriefing !== "object") err("debriefing doit être un objet");

  return errs;
}
