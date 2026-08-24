/* convert.js — Conversion d'un pack historique « jdpbc-pack » vers
 * un document universel « ducyb-parcours » v1.
 *
 * Garde-fous :
 *  - conversion pure (aucune mutation des entrées, sortie déterministe) ;
 *  - couverture totale : chaque entité héritée est représentée ;
 *  - les champs sans équivalent universel v1 sont conservés tels quels
 *    (ex. `chant`) pour éviter toute perte — ils seront universalisés plus tard.
 *
 * Table de correspondance (voir docs/DATA_MODEL.md §4) :
 *   balise            → station (+ mission type "enigme")
 *   enigmes.{niveau}  → mission.difficultyLevels[niveau] {text,answers,ages,hint,knowMore}
 *   indice / saviez   → hint / knowMore
 *   découverte        → character (+ mission type "quiz" avec questions[])
 *   quiz[]{reponse}   → questions[]{answer}
 *   notion-guide      → pedagogy.competencies[]
 *   pack.ages         → audience
 */

const now = () => new Date().toISOString().slice(0, 10);

function enigmeVersNiveau(e) {
  return {
    text: e.text,
    answers: e.reponses,
    ages: e.ages,
    hint: e.indice,
    knowMore: e.saviez,
  };
}

function decouverteVersCharacter(d) {
  const c = {
    id: d.id,
    nom: d.nom,
    latin: d.latin,
    emoji: d.emoji,
    couleur: d.couleur,
    categorie: d.categorie,
    taille: d.taille,
    img: d.img || "",
    anecdotes: d.anecdotes,
    pedagogy: {
      ages: d.pedagogie.ages,
      dureeMin: d.pedagogie.duree_min ?? null,
      objectif: d.pedagogie.objectif,
      programme: d.pedagogie.programme ?? [],
    },
  };
  /* Chant synthétisé : pas encore d'équivalent universel v1 → conservé tel quel. */
  if (d.chant) c.chant = d.chant;
  if (d.audioFile) c.audioFile = d.audioFile;
  return c;
}

export function parcoursFromPack({ pack, decouvertes, guide, balises }) {
  const characters = decouvertes.map(decouverteVersCharacter);
  const stations = [];
  const missions = [];

  for (const b of balises) {
    stations.push({
      id: b.id,
      label: b.label,
      code: b.code,
      discoveryId: b.bird,
      x: b.x ?? null,
      y: b.y ?? null,
      lat: b.lat ?? null,
      lng: b.lng ?? null,
      radius: b.radius ?? null,
      missions: [`${b.id}-enigme`],
      ...(b.hintImg ? { hintImg: b.hintImg } : {}),
    });
    missions.push({
      id: `${b.id}-enigme`,
      type: "enigme",
      stationId: b.id,
      difficultyLevels: {
        facile: enigmeVersNiveau(b.enigmes.facile),
        moyen: enigmeVersNiveau(b.enigmes.moyen),
        difficile: enigmeVersNiveau(b.enigmes.difficile),
      },
    });
  }

  for (const d of decouvertes) {
    if (!Array.isArray(d.quiz) || !d.quiz.length) continue;
    missions.push({
      id: `${d.id}-quiz`,
      type: "quiz",
      characterId: d.id,
      questions: d.quiz.map((q) => ({ q: q.q, options: q.options, answer: q.reponse })),
    });
  }

  const objectifs = [];
  for (const g of guide) {
    if (g.pedagogie?.objectif && !objectifs.includes(g.pedagogie.objectif)) {
      objectifs.push(g.pedagogie.objectif);
    }
  }
  for (const d of decouvertes) {
    if (d.pedagogie?.objectif && !objectifs.includes(d.pedagogie.objectif)) {
      objectifs.push(d.pedagogie.objectif);
    }
  }

  const doc = {
    $format: "ducyb-parcours",
    $version: 1,
    id: pack.id,
    title: pack.nom,
    metadata: {
      author: "",
      organization: "",
      language: "fr",
      license: "",
      createdAt: now(),
      updatedAt: now(),
      source: { format: "jdpbc-pack", version: pack.version ?? 1 },
    },
    description: pack.description ?? "",
    theme: pack.theme ?? "",
    audience: {
      minAge: Array.isArray(pack.ages) ? pack.ages[0] : null,
      maxAge: Array.isArray(pack.ages) ? pack.ages[1] : null,
    },
    duration: null,
    pedagogy: {
      objectives: objectifs,
      skills: [],
      competencies: guide.map((g) => ({
        id: g.id,
        nom: g.nom,
        description: g.description,
        emoji: g.emoji ?? "",
        objectif: g.pedagogie.objectif,
        ages: g.pedagogie.ages,
        programme: g.pedagogie.programme ?? [],
        ...(g.anecdotes?.length ? { anecdotes: g.anecdotes } : {}),
      })),
      evaluation: [],
    },
    game: {
      mode: "courses",
      scoring: { starsPerStation: 3, timeBonus: true },
      rules: { order: "libre" },
    },
    location: { provider: "schematic", center: null, trail: [] },
    stations,
    missions,
    characters,
    media: [],
    rewards: [],
    debriefing: { participantQuestions: [], facilitatorReport: [], skillsObserved: [] },
  };
  return doc;
}

/* Couverture : vérifie qu'aucune entité héritée n'a été perdue à la conversion. */
export function verifierCouverture(src, doc) {
  const errs = [];
  const ids = new Set();
  for (const s of [...doc.stations, ...doc.missions, ...doc.characters]) {
    if (ids.has(s.id)) errs.push(`id dupliqué dans la sortie : ${s.id}`);
    ids.add(s.id);
  }
  if (doc.stations.length !== src.balises.length)
    errs.push(`stations ${doc.stations.length} ≠ balises ${src.balises.length}`);
  if (doc.characters.length !== src.decouvertes.length)
    errs.push(`characters ${doc.characters.length} ≠ découvertes ${src.decouvertes.length}`);
  if (doc.pedagogy.competencies.length !== src.guide.length)
    errs.push(`competencies ${doc.pedagogy.competencies.length} ≠ notions ${src.guide.length}`);
  const qSrc = src.decouvertes.reduce((n, d) => n + (d.quiz?.length ?? 0), 0);
  const qDoc = doc.missions
    .filter((m) => m.type === "quiz")
    .reduce((n, m) => n + m.questions.length, 0);
  if (qDoc !== qSrc) errs.push(`questions quiz ${qDoc} ≠ source ${qSrc}`);
  const nivs = ["facile", "moyen", "difficile"];
  for (const b of src.balises) {
    const m = doc.missions.find((x) => x.id === `${b.id}-enigme`);
    if (!m) { errs.push(`mission énigme manquante pour ${b.id}`); continue; }
    for (const n of nivs) {
      const a = m.difficultyLevels[n], e = b.enigmes[n];
      if (a.text !== e.text || JSON.stringify(a.answers) !== JSON.stringify(e.reponses))
        errs.push(`énigme ${b.id}.${n} altérée`);
    }
  }
  return errs;
}
