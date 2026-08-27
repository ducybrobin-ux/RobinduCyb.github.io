/* apply-admin.js — Application des surcharges éditeur.
 *
 * Applique les modifications sauvegardées par l'éditeur (admin-data.json)
 * sur les données de base. Mutate les structures passées en paramètre.
 * Idempotent.
 *
 * Fonction pure (pas d'accès aux globals).
 */

/**
 * Applique les surcharges admin sur les données.
 * @param {object} admin — objet admin-data.json (peut être null)
 * @param {object} ctx — { site, trail, birds, guide, balises, getBird, getBalise }
 */
export function applyAdminData(admin, ctx) {
  if (!admin || typeof admin !== "object") return;

  const { site, trail, birds, guide, balises } = ctx;
  const getBird = (id) =>
    birds.concat(guide).find((b) => b.id === id);
  const getBalise = (id) => balises.find((b) => b.id === id);

  /* --- 0) Suppressions --- */
  if (Array.isArray(admin.removedBirds)) {
    const gone = new Set(admin.removedBirds);
    for (let i = birds.length - 1; i >= 0; i--) {
      if (gone.has(birds[i].id)) birds.splice(i, 1);
    }
    balises.forEach((b) => {
      if (gone.has(b.bird)) b.bird = "";
    });
  }
  if (Array.isArray(admin.removedBalises)) {
    const gone = new Set(admin.removedBalises);
    for (let i = balises.length - 1; i >= 0; i--) {
      if (gone.has(balises[i].id)) balises.splice(i, 1);
    }
  }

  /* --- 1) Site (nom, rayon, centre, photos…) --- */
  if (admin.site && typeof admin.site === "object") {
    for (const k of Object.keys(admin.site)) {
      if (
        k === "center" &&
        admin.site.center &&
        typeof admin.site.center === "object"
      ) {
        if (admin.site.center.lat != null)
          site.center.lat = Number(admin.site.center.lat);
        if (admin.site.center.lng != null)
          site.center.lng = Number(admin.site.center.lng);
      } else if (site[k] !== undefined) {
        site[k] = admin.site[k];
      }
    }
  }
  if (admin.trail && typeof admin.trail === "object") {
    if (Array.isArray(admin.trail.path)) trail.path = admin.trail.path;
    if (admin.trail.label) trail.label = admin.trail.label;
  }
  if (admin.guide && typeof admin.guide === "object") {
    for (const id of Object.keys(admin.guide)) {
      const g = guide.find((x) => x.id === id);
      if (!g) continue;
      const ov = admin.guide[id];
      if (ov && typeof ov === "object") {
        for (const k of Object.keys(ov)) g[k] = ov[k];
      }
    }
  }

  /* --- 2) Découvertes : création (id absent) + modification --- */
  if (admin.birds && typeof admin.birds === "object") {
    for (const id of Object.keys(admin.birds)) {
      const ov = admin.birds[id];
      if (!ov || typeof ov !== "object") continue;
      let bird = getBird(id);
      if (!bird) {
        bird = {
          id,
          nom: ov.nom || id,
          latin: ov.latin || "",
          emoji: ov.emoji || "\u{1F9E0}",
          couleur: ov.couleur || "#6a6a6a",
          categorie: ov.categorie || "diurne",
          taille: ov.taille || "?",
          img: ov.img || "",
          audioFile: ov.audioFile || null,
          anecdotes: Array.isArray(ov.anecdotes) ? ov.anecdotes.slice() : [],
          chant: ov.chant || null,
          quiz: Array.isArray(ov.quiz) ? ov.quiz.slice() : [],
        };
        birds.push(bird);
      }
      for (const k of Object.keys(ov)) {
        if (k === "id") continue;
        if (k === "questions" && Array.isArray(ov.questions))
          bird.quiz = ov.questions;
        else if (k === "anecdotes" && Array.isArray(ov.anecdotes))
          bird.anecdotes = ov.anecdotes.slice();
        else if (k === "quiz" && Array.isArray(ov.quiz))
          bird.quiz = ov.quiz.slice();
        else bird[k] = ov[k];
      }
    }
  }

  /* --- 3) Balises : création (id absent) + modification --- */
  if (admin.balises && typeof admin.balises === "object") {
    for (const id of Object.keys(admin.balises)) {
      const ov = admin.balises[id];
      if (!ov || typeof ov !== "object") continue;
      let bal = getBalise(id);
      if (!bal) {
        bal = {
          id,
          bird: ov.bird || "",
          code: ov.code || `JDP-${String(id).toUpperCase()}`,
          x:
            ov.x != null && isFinite(Number(ov.x)) ? Number(ov.x) : 200,
          y:
            ov.y != null && isFinite(Number(ov.y)) ? Number(ov.y) : 400,
          lat:
            ov.lat != null && isFinite(Number(ov.lat))
              ? Number(ov.lat)
              : site.center.lat,
          lng:
            ov.lng != null && isFinite(Number(ov.lng))
              ? Number(ov.lng)
              : site.center.lng,
          label: ov.label || id,
          hintImg: ov.hintImg || "",
          enigmes: {},
          enigme: ov.enigme || null,
        };
        balises.push(bal);
      }
      for (const k of Object.keys(ov)) {
        if (k === "id") continue;
        if (k === "enigmes" && ov.enigmes && typeof ov.enigmes === "object") {
          if (!bal.enigmes) bal.enigmes = {};
          for (const diff of Object.keys(ov.enigmes)) {
            if (!bal.enigmes[diff]) bal.enigmes[diff] = {};
            const eo = ov.enigmes[diff];
            if (eo && typeof eo === "object") {
              for (const ek of Object.keys(eo)) {
                bal.enigmes[diff][ek] = eo[ek];
              }
            }
          }
        } else if (
          (k === "x" || k === "y" || k === "lat" || k === "lng") &&
          ov[k] != null &&
          isFinite(Number(ov[k]))
        ) {
          bal[k] = Number(ov[k]);
        } else {
          bal[k] = ov[k];
        }
      }
    }
  }

  /* --- 4) Quiz : surcharge des questions d'une découverte --- */
  if (admin.quiz && typeof admin.quiz === "object") {
    for (const id of Object.keys(admin.quiz)) {
      const bird = getBird(id);
      if (!bird) continue;
      const ov = admin.quiz[id];
      if (ov && typeof ov === "object") {
        if (ov.q) {
          bird.quiz = [ov];
          continue;
        }
        for (const k of Object.keys(ov)) {
          if (k === "questions" && Array.isArray(ov.questions))
            bird.quiz = ov.questions;
          else bird[k] = ov[k];
        }
      }
    }
  }
}
