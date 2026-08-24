/* =========================================================
   JDP — Jeu de piste « Esprit piège »
   Thème : neurosciences & biais cognitifs.
   Découvertes du parcours, guide, balises, énigmes et quiz.
   NOTE : la variable interne BIRDS désigne les « découvertes »
   (un biais cognitif par balise) — nom conservé pour rester
   compatible avec l'éditeur et le serveur.
   Pour ajouter une photo : remplir `img` (chemin relatif).
   Pour ajouter un vrai son : remplir `audioFile` (chemin relatif)
   sinon une signature sonore synthétique (Web Audio) est jouée.
   ========================================================= */

const SITE = {
  name: "Jeu de piste",
  short: "JDP",
  region: "Parcours découverte",
  mapTitle: "Le sentier des découvertes",
  // Position du centre du site (GPS) — À RÉGLER via l'éditeur
  // (« Ma position GPS » sur chaque balise) avant le terrain.
  center: { lat: 50.6314885, lng: 3.0558956 },
  proximityRadius: 12, // en mètres : distance pour valider par GPS
  hintRadius: 250,     // en mètres : à partir d'où le signal sonore guide
  photos: [],
};

const TRAIL = {
  // Le tracé du sentier (x, y dans la vue de la carte)
  path: [
    [36, 552], [48, 500], [74, 452], [110, 428], [148, 400],
    [176, 356], [200, 308], [238, 292], [282, 296], [320, 320],
    [356, 352], [388, 396], [406, 448], [392, 500], [366, 540], [330, 556],
  ],
  label: "Sentier des découvertes",
};

/* ---- Découvertes (biais cognitifs) --------------------------------
   chant : phrase musicale répétée (Web Audio), signature unique.
   notes : [ { f, fEnd, d, g, type, v } ]
     f = fréquence de départ (Hz), fEnd = fréquence d'arrivée,
     d = durée (s), g = pause après la note (s),
     type = 'sine' | 'square' | 'sawtooth' | 'noise', v = volume relatif.
------------------------------------------------------------------- */

/* ==== DÉBUT CONTENU GÉNÉRÉ — NE PAS ÉDITER ====
   Source de vérité : content/ (packs JSON modulaires).
   Packs actifs : biais-cognitifs, cemea-education-populaire
   Régénérer : node tools/build-data.mjs
   Vérifier la synchro : node tools/build-data.mjs --check ==== */

const BIRDS = [
  {
    "type": "decouverte",
    "version": 1,
    "id": "confirmation",
    "nom": "Biais de confirmation",
    "latin": "Confirmation bias · Wason, 1960",
    "emoji": "🔍",
    "couleur": "#2e6fb3",
    "categorie": "diurne",
    "taille": "Antidote : chercher ce qui te contredit",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Notre cerveau adore avoir raison : il collectionne les preuves qui lui plaisent et jette les autres.",
      "Sur les réseaux sociaux, on voit surtout les messages qui confirment ce qu'on pense déjà : le biais adore ça !",
      "Pour le contrer, pose-toi la question : « Qu'est-ce qui pourrait prouver que j'ai tort ? »"
    ],
    "chant": {
      "tempo": 90,
      "notes": [
        {
          "f": 880,
          "fEnd": 880,
          "d": 0.12,
          "g": 0.08,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 880,
          "fEnd": 880,
          "d": 0.12,
          "g": 0.08,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 1100,
          "fEnd": 1100,
          "d": 0.1,
          "g": 0.3,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Chercher activement ce qui pourrait contredire une opinion avant de la croire",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Que fait le biais de confirmation ?",
        "options": [
          "Il ne retient que les preuves qui nous donnent raison",
          "Il rend myope",
          "Il traduit les langues"
        ],
        "reponse": 0
      },
      {
        "q": "Quel est le meilleur antidote ?",
        "options": [
          "Chercher ce qui pourrait nous contredire",
          "Répéter plus fort son opinion",
          "Fermer les yeux"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "ancrage",
    "nom": "Effet d'ancrage",
    "latin": "Anchoring effect · Tversky & Kahneman, 1974",
    "emoji": "⚓",
    "couleur": "#5a4fcf",
    "categorie": "diurne",
    "taille": "Antidote : comparer avec tes propres repères",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Le premier nombre entendu devient une ancre : notre estimation reste collée dessus, même si elle est absurde.",
      "« Au lieu de 100 €, seulement 39 € ! » : le prix barré est une ancre qui donne l'impression d'une bonne affaire.",
      "Même les experts se font piéger : une roue de loterie truquée a suffi à fausser leurs estimations en labo."
    ],
    "chant": {
      "tempo": 45,
      "notes": [
        {
          "f": 220,
          "fEnd": 220,
          "d": 0.3,
          "g": 0.15,
          "type": "sine",
          "v": 0.55
        },
        {
          "f": 330,
          "fEnd": 440,
          "d": 0.25,
          "g": 0.5,
          "type": "sine",
          "v": 0.45
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Reconnaître l'influence du premier chiffre reçu et recalculer avec ses propres repères",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Qu'est-ce qu'une « ancre » dans notre tête ?",
        "options": [
          "La première information reçue, qui influence toute la suite",
          "Un bijou",
          "Une chanson qui reste dans la tête"
        ],
        "reponse": 0
      },
      {
        "q": "« Barré à 100 €, vendu 39 € » joue sur…",
        "options": [
          "L'effet d'ancrage",
          "La météo",
          "Notre faim"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "disponibilite",
    "nom": "Biais de disponibilité",
    "latin": "Availability heuristic · Tversky & Kahneman, 1973",
    "emoji": "📺",
    "couleur": "#c2452e",
    "categorie": "diurne",
    "taille": "Antidote : chercher les vrais chiffres",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Ce qui revient souvent à la télé ou dans les discussions semble plus fréquent qu'il ne l'est vraiment.",
      "On craint parfois l'avion plus que la voiture, parce que les accidents d'avion marquent les mémoires.",
      "Astuce : avant de juger « c'est plein d'accidents », demande-toi « ai-je des chiffres ou juste des souvenirs ? »"
    ],
    "chant": {
      "tempo": 160,
      "notes": [
        {
          "f": 1200,
          "fEnd": 1400,
          "d": 0.07,
          "g": 0.04,
          "type": "square",
          "v": 0.4
        },
        {
          "f": 1500,
          "fEnd": 1300,
          "d": 0.07,
          "g": 0.04,
          "type": "square",
          "v": 0.4
        },
        {
          "f": 1800,
          "fEnd": 1600,
          "d": 0.09,
          "g": 0.35,
          "type": "square",
          "v": 0.38
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Distinguer ce qui est facile à se rappeler de ce qui est réellement fréquent",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Pourquoi craint-on parfois l'avion plus que la voiture ?",
        "options": [
          "Les accidents d'avion sont très médiatisés, donc faciles à se rappeler",
          "L'avion va moins vite",
          "Parce qu'on y est assis longtemps"
        ],
        "reponse": 0
      },
      {
        "q": "Quel est l'antidote du biais de disponibilité ?",
        "options": [
          "Regarder les statistiques",
          "Regarder plus la télé",
          "Oublier vite"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "dunning",
    "nom": "Effet Dunning-Kruger",
    "latin": "Dunning-Kruger effect · Kruger & Dunning, 1999",
    "emoji": "🎢",
    "couleur": "#d98e04",
    "categorie": "diurne",
    "taille": "Antidote : s'entraîner et demander des avis",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Débutants, on se croit souvent très fort ; en progressant, on découvre enfin l'étendue de ce qu'on ignore.",
      "Les chercheurs ont testé des étudiants : les moins bons s'estimaient au-dessus de la moyenne !",
      "La vraie compétence commence quand on sait mesurer ce qu'on ne sait pas encore."
    ],
    "chant": {
      "tempo": 70,
      "notes": [
        {
          "f": 520,
          "fEnd": 900,
          "d": 0.18,
          "g": 0.06,
          "type": "triangle",
          "v": 0.5
        },
        {
          "f": 900,
          "fEnd": 1300,
          "d": 0.16,
          "g": 0.06,
          "type": "triangle",
          "v": 0.5
        },
        {
          "f": 1300,
          "fEnd": 600,
          "d": 0.22,
          "g": 0.55,
          "type": "triangle",
          "v": 0.45
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Mesurer ses progrès pour évaluer son niveau réel et accueillir les retours",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Que fait souvent un grand débutant, selon cet effet ?",
        "options": [
          "Il se surestime car il ne voit pas encore ses lacunes",
          "Il devient champion tout de suite",
          "Il n'apprend jamais rien"
        ],
        "reponse": 0
      },
      {
        "q": "Comment progresse-t-on malgré cet effet ?",
        "options": [
          "En s'entraînant et en écoutant les retours",
          "En évitant de pratiquer",
          "En se comparant aux débutants"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "cout",
    "nom": "Sophisme du coût irrécupérable",
    "latin": "Sunk cost fallacy · Arkes & Blumer, 1985",
    "emoji": "🕳️",
    "couleur": "#6b4a8a",
    "categorie": "diurne",
    "taille": "Antidote : raisonner sur l'avenir, pas le passé",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Rester jusqu'au bout d'un film ennuyeux « puisque le billet est payé » : l'argent dépensé ne reviendra pas !",
      "Continuer simplement parce qu'on a déjà beaucoup investi, c'est jeter bon argent après mauvais.",
      "La bonne question : « En partant de maintenant, qu'est-ce qui est le mieux pour la suite ? »"
    ],
    "chant": {
      "tempo": 40,
      "notes": [
        {
          "f": 700,
          "fEnd": 480,
          "d": 0.3,
          "g": 0.2,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 600,
          "fEnd": 400,
          "d": 0.3,
          "g": 0.2,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 500,
          "fEnd": 300,
          "d": 0.35,
          "g": 0.6,
          "type": "sine",
          "v": 0.45
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Décider d'après les gains futurs possibles, sans se laisser enfermer par le passé",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Le film est nul mais tu restes « parce que le billet est payé ». C'est…",
        "options": [
          "Le sophisme du coût irrécupérable",
          "Un bon calcul",
          "De la patience"
        ],
        "reponse": 0
      },
      {
        "q": "Que faut-il prendre en compte pour bien décider ?",
        "options": [
          "Seulement ce qui peut encore arriver",
          "Tout ce qu'on a déjà dépensé",
          "Ce que les autres pensent"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "halo",
    "nom": "Effet halo",
    "latin": "Halo effect · Thorndike, 1920",
    "emoji": "😇",
    "couleur": "#0f9b8e",
    "categorie": "diurne",
    "taille": "Antidote : juger chaque point séparément",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Une seule qualité illumine tout le reste : on trouve quelqu'un « sympa », et voilà qu'on le croit intelligent et honnête.",
      "Edward Thorndike l'a observé chez des officiers notés par leurs supérieurs : une bonne note entraînait toutes les autres.",
      "La publicité l'utilise beaucoup : une star souriante prête son « halo » au produit."
    ],
    "chant": {
      "tempo": 80,
      "notes": [
        {
          "f": 523,
          "fEnd": 523,
          "d": 0.14,
          "g": 0.05,
          "type": "sine",
          "v": 0.45
        },
        {
          "f": 659,
          "fEnd": 659,
          "d": 0.14,
          "g": 0.05,
          "type": "sine",
          "v": 0.45
        },
        {
          "f": 784,
          "fEnd": 784,
          "d": 0.2,
          "g": 0.45,
          "type": "sine",
          "v": 0.45
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Évaluer chaque qualité séparément avant de juger un ensemble",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "On trouve quelqu'un sympathique, alors on le croit aussi intelligent. C'est…",
        "options": [
          "L'effet halo",
          "Un superpouvoir",
          "De la télépathie"
        ],
        "reponse": 0
      },
      {
        "q": "Comment éviter l'effet halo ?",
        "options": [
          "Évaluer chaque qualité séparément",
          "Ne regarder qu'un seul détail",
          "Suivre la foule"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "verite",
    "nom": "Illusion de la vérité",
    "latin": "Illusory truth effect · Hasher, Goldstein & Toppino, 1977",
    "emoji": "🔁",
    "couleur": "#3d4a6b",
    "categorie": "nocturne",
    "taille": "Antidote : vérifier la source",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Plus une information est répétée, plus elle paraît vraie — même si elle est fausse !",
      "Les rumeurs et la désinformation exploitent cette répétition pour s'installer dans nos têtes.",
      "Avant de croire, demande-toi : « Qui le dit ? Où est la preuve ? » Une répétition n'est pas une preuve."
    ],
    "chant": {
      "tempo": 60,
      "notes": [
        {
          "f": 440,
          "fEnd": 440,
          "d": 0.14,
          "g": 0.1,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 440,
          "fEnd": 440,
          "d": 0.14,
          "g": 0.1,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 440,
          "fEnd": 440,
          "d": 0.14,
          "g": 0.9,
          "type": "sine",
          "v": 0.5
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Vérifier source et preuve avant de croire une information répétée",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Une info répétée dix fois paraît…",
        "options": [
          "Plus vraie, même si elle est fausse",
          "Toujours fausse",
          "Plus longue"
        ],
        "reponse": 0
      },
      {
        "q": "Quel est le meilleur réflexe face à une info surprenante ?",
        "options": [
          "Vérifier la source",
          "La partager tout de suite",
          "La répéter encore"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "barnum",
    "nom": "Effet Barnum",
    "latin": "Barnum (Forer) effect · Forer, 1949",
    "emoji": "🔮",
    "couleur": "#7a3b8f",
    "categorie": "nocturne",
    "taille": "Antidote : demander une description précise",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "« Tu es parfois timide, mais très sociable avec ceux que tu aimes » : ça te ressemble ? Ça ressemble à tout le monde !",
      "Les horoscopes et faux tests de personnalité utilisent des phrases floues valables pour presque tous.",
      "Bertram Forer a donné exactement le même « portrait » à tous ses étudiants : ils y ont cru à 4/5 !"
    ],
    "chant": {
      "tempo": 50,
      "notes": [
        {
          "f": 600,
          "fEnd": 750,
          "d": 0.35,
          "g": 0.15,
          "type": "sawtooth",
          "v": 0.32
        },
        {
          "f": 700,
          "fEnd": 550,
          "d": 0.35,
          "g": 0.6,
          "type": "sawtooth",
          "v": 0.3
        }
      ]
    },
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 8,
      "objectif": "Exiger des descriptions précises et vérifiables plutôt que des phrases universelles",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Un horoscope décrit « ta personnalité unique ». En fait, il…",
        "options": [
          "Décrit tout le monde avec des phrases floues",
          "Lit vraiment dans ton esprit",
          "Connaît ton avenir"
        ],
        "reponse": 0
      },
      {
        "q": "Comment reconnaître un effet Barnum ?",
        "options": [
          "Une description vague qui conviendrait à presque tout le monde",
          "Des chiffres précis et vérifiables",
          "Une recette de cuisine"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Identifier des situations où coopérer fait mieux apprendre que rivaliser",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "cooperation",
    "nom": "Coopération",
    "latin": "Pédagogie coopérative · Freinet, 1924",
    "emoji": "🤝",
    "couleur": "#0f9b8e",
    "categorie": "diurne",
    "taille": "Réflexe : chercher ce qui fait avancer tout le groupe",
    "anecdotes": [
      "En coopération, chacun apporte un morceau de la réussite : personne n'est « nul », chacun est utile.",
      "Le tutorat entre pairs : expliquer à un camarade est l'un des meilleurs moyens d'apprendre soi-même.",
      "La coopération traverse les frontières : en juin 2026, les CEMÉA Nord-Pas-de-Calais ont accueilli huit enseignantes italiennes dans le cadre d'un projet Erasmus+."
    ],
    "quiz": [
      {
        "q": "Dans une pédagogie coopérative, on apprend surtout…",
        "options": [
          "En travaillant ensemble et en s'entraidant",
          "Chacun seul dans son coin",
          "En compétition permanente"
        ],
        "reponse": 0
      },
      {
        "q": "Expliquer une notion à un camarade, c'est…",
        "options": [
          "Un excellent moyen de mieux la comprendre soi-même",
          "Perdre son temps",
          "Interdit pendant la classe"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Comprendre que l'expérience directe ancre durablement les savoirs",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "methode-active",
    "nom": "Apprendre en faisant",
    "latin": "Éducation active · CEMÉA, 1937",
    "emoji": "✋",
    "couleur": "#2e6fb3",
    "categorie": "diurne",
    "taille": "Réflexe : essayer, se tromper, recommencer",
    "anecdotes": [
      "Fondés en 1937, les CEMÉA (Centres d'entraînement aux méthodes d'éducation active) forment animateurs et éducateurs en pratiquant, pas en récitant.",
      "Chaque année, la Journée de l'Éducation du Dehors organisée par le secteur École réunit à Lille une centaine d'enseignant·es, éducateur·rice·s et chercheur·se·s.",
      "L'erreur y est une étape normale de l'apprentissage, pas une faute à punir."
    ],
    "quiz": [
      {
        "q": "Une « méthode active », c'est apprendre…",
        "options": [
          "En faisant soi-même, par l'expérience",
          "En écoutant sans bouger",
          "En récitant par cœur uniquement"
        ],
        "reponse": 0
      },
      {
        "q": "Dans les centres d'entraînement (CEMÉA), on forme…",
        "options": [
          "Des animateurs et des éducateurs, en pratiquant",
          "Seulement des professeurs",
          "Des sportifs de haut niveau"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Oser s'exprimer devant le groupe et écouter la parole des autres",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "expression",
    "nom": "Expression libre",
    "latin": "Textes libres & théâtre-forum · Boal, 1971",
    "emoji": "🗣️",
    "couleur": "#d97b1f",
    "categorie": "diurne",
    "taille": "Réflexe : donner la parole à celles et ceux qui ne la prennent pas",
    "anecdotes": [
      "Texte libre, journal de classe… aujourd'hui, les jeunes publient aussi sur Yakamédia, le média des CEMÉA : toujours de vrais lecteurs pour leur parole.",
      "Le théâtre-forum joue une situation puis demande au public de changer la fin : s'entraîner à agir.",
      "Parler devant les autres s'apprend aussi : c'est une compétence, pas un don."
    ],
    "quiz": [
      {
        "q": "Le théâtre-forum consiste à…",
        "options": [
          "Rejouer une scène et proposer d'autres issues",
          "Regarder une pièce en silence",
          "Réciter des vers"
        ],
        "reponse": 0
      },
      {
        "q": "Publier les textes libres des élèves sert à…",
        "options": [
          "Leur donner de vrais lecteurs et de la confiance",
          "Les corriger sans pitié",
          "Remplir le bureau du directeur"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Relier apprentissages et capacité d'agir sur sa vie",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "emancipation",
    "nom": "Émancipation",
    "latin": "Instruction pour tous · Condorcet, 1792",
    "emoji": "⚖️",
    "couleur": "#5a4fcf",
    "categorie": "nocturne",
    "taille": "Réflexe : comprendre le monde pour pouvoir le transformer",
    "anecdotes": [
      "L'éducation populaire vise l'émancipation : devenir libre par la compréhension, pas subir les décisions des autres.",
      "Condorcet rêvait dès 1792 d'une instruction vraiment universelle et gratuite.",
      "Les CEMÉA sont aussi une entreprise de l'économie sociale et solidaire et un terrain d'expérimentation : une autre économie mise au service de l'éducation."
    ],
    "quiz": [
      {
        "q": "S'émanciper par la connaissance, c'est…",
        "options": [
          "Devenir plus libre de penser et d'agir",
          "Mémoriser sans comprendre",
          "Suivre sans discuter"
        ],
        "reponse": 0
      },
      {
        "q": "Qui rêvait d'une instruction universelle dès 1792 ?",
        "options": [
          "Condorcet",
          "Napoléon",
          "Jules Ferry"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Repérer les inégalités d'accès à la culture et imaginer des solutions",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "acces-tous",
    "nom": "Pour toutes et tous",
    "latin": "Loisirs populaires · Léo Lagrange, 1936",
    "emoji": "🌍",
    "couleur": "#c2452e",
    "categorie": "diurne",
    "taille": "Réflexe : se demander qui manque à l'appel",
    "anecdotes": [
      "Avec les congés payés de 1936, Léo Lagrange invente les loisirs encadrés pour celles et ceux qui n'en avaient jamais eu.",
      "À Lille, les locaux des CEMÉA Nord-Pas-de-Calais sont pensés pour l'accessibilité de toutes et tous : l'accueil commence par la porte.",
      "Une question clé de l'éducation populaire : qui n'a pas accès ? Comment ouvrir la porte ?"
    ],
    "quiz": [
      {
        "q": "En 1936, avec les congés payés, Léo Lagrange développe…",
        "options": [
          "Les loisirs populaires encadrés pour toutes et tous",
          "Les vacances réservées aux riches",
          "L'école le samedi"
        ],
        "reponse": 0
      },
      {
        "q": "La démocratie culturelle veut dire que la culture est…",
        "options": [
          "Un droit pour chacun",
          "Une marchandise rare",
          "Réservée aux experts"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Utiliser le jeu comme espace d'essai et de réflexion",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "jeu-role",
    "nom": "Jouer pour apprendre",
    "latin": "Mises en situation · CEMÉA",
    "emoji": "🎭",
    "couleur": "#7a3b8f",
    "categorie": "nocturne",
    "taille": "Réflexe : essayer des rôles avant de vivre les situations",
    "anecdotes": [
      "Jouer un entretien, un débat ou un conflit permet de s'entraîner sans risque avant la vraie vie.",
      "Théâtre, expositions ouvertes à toutes et tous, veillées : la culture vit au cœur des actions des CEMÉA, comme les vernissages de Lille.",
      "Après le jeu, le débriefing compte autant que la partie : qu'ai-je ressenti ? Qu'ai-je appris ?"
    ],
    "quiz": [
      {
        "q": "Le jeu de rôle pédagogique sert à…",
        "options": [
          "S'entraîner à des situations réelles sans risque",
          "Perdre du temps",
          "Éliminer les plus faibles"
        ],
        "reponse": 0
      },
      {
        "q": "Après un jeu d'apprentissage, l'étape importante est…",
        "options": [
          "Le débriefing : ce qu'on a ressenti et appris",
          "Range vite les chaises",
          "Aucune"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Expliquer en quoi apprendre dehors change la façon d'apprendre",
      "programme": [
        "cycle 2",
        "cycle 3"
      ]
    },
    "id": "journee-dehors",
    "nom": "Éducation du Dehors",
    "latin": "Journée Éducation du Dehors · Lille",
    "emoji": "🌳",
    "couleur": "#2e8f5a",
    "categorie": "diurne",
    "taille": "Repère : dehors, on apprend avec tout son corps",
    "anecdotes": [
      "Chaque année, la Journée Éducation du Dehors réunit plus d'une centaine de participant·es à Lille, animée par les CEMÉA Nord-Pas-de-Calais.",
      "Apprendre dehors stimule l'attention, la motricité et la mémoire : le corps fait partie de la leçon.",
      "L'éducation du dehors relie les « forest schools » nordiques à la pédagogie nouvelle née en France."
    ],
    "quiz": [
      {
        "q": "Apprendre dehors, c'est…",
        "options": [
          "Utiliser le lieu et le corps comme supports d'apprentissage",
          "Une simple récréation prolongée",
          "Réservé aux maternelles"
        ],
        "reponse": 0
      },
      {
        "q": "La Journée Éducation du Dehors de Lille rassemble…",
        "options": [
          "Des professionnel·les, des familles et des curieux",
          "Uniquement des élus",
          "Personne : elle est virtuelle"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Relier coopération pédagogique et ouverture européenne",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    },
    "id": "erasmus",
    "nom": "Erasmus+",
    "latin": "Mobilité européenne · accueil à Lille, 2026",
    "emoji": "🇪🇺",
    "couleur": "#0c6e8f",
    "categorie": "diurne",
    "taille": "Repère : voyager pour apprendre, accueillir pour transmettre",
    "anecdotes": [
      "En juin 2026, les CEMÉA Nord-Pas-de-Calais ont accueilli une délégation italienne : huit enseignantes des écoles Margherita Fasolo.",
      "Erasmus+ finance des mobilités pour que les pratiques pédagogiques circulent entre pays.",
      "Observer une classe d'ailleurs oblige à s'interroger sur ses propres habitudes."
    ],
    "quiz": [
      {
        "q": "Erasmus+, c'est un programme européen qui permet…",
        "options": [
          "De se former et d'observer ailleurs",
          "De partir en vacances",
          "De financer uniquement les universités"
        ],
        "reponse": 0
      },
      {
        "q": "En 2026, les CEMÉA NPDC ont accueilli des enseignantes venues de…",
        "options": [
          "Italie",
          "Portugal",
          "Suède"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Découvrir la presse jeune et l'expression médiatique des enfants",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "yakamedia",
    "nom": "Yakamédia",
    "latin": "Média jeunesse des CEMÉA · revue Yak, 1955",
    "emoji": "🎙️",
    "couleur": "#d97b1f",
    "categorie": "diurne",
    "taille": "Réflexe : s'exprimer, créer et publier librement",
    "anecdotes": [
      "Yakamédia est la plateforme média des CEMÉA : des contenus créés par et pour les jeunes.",
      "Dès 1955, la revue Yak donnait la parole aux enfants — une révolution à l'époque.",
      "Fabriquer un journal développe l'esprit critique, l'écriture et la coopération."
    ],
    "quiz": [
      {
        "q": "Qui écrit et choisit les contenus de Yakamédia ?",
        "options": [
          "Les jeunes, accompagnés par des journalistes",
          "Uniquement des adultes",
          "Un algorithme"
        ],
        "reponse": 0
      },
      {
        "q": "La revue Yak a été créée par les CEMÉA en…",
        "options": [
          "1955",
          "1989",
          "2005"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Comprendre ce qu'est une entreprise de l'ESS et son utilité sociale",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "id": "ess",
    "nom": "Économie sociale",
    "latin": "ESS & utilité publique · mouvement CEMÉA",
    "emoji": "🤲",
    "couleur": "#7a3b8f",
    "categorie": "nocturne",
    "taille": "Repère : les bénéfices servent le projet, pas l'inverse",
    "anecdotes": [
      "Les CEMÉA sont une association reconnue d'utilité publique ET une entreprise de l'économie sociale et solidaire.",
      "Dans l'ESS, ce ne sont pas les actionnaires qui décident mais les sociétaires : une personne = une voix.",
      "Le réseau CEMÉA est décentralisé : chaque tête régionale agit au plus près de son territoire."
    ],
    "quiz": [
      {
        "q": "Dans une coopérative de l'ESS, la règle de vote est…",
        "options": [
          "Une personne = une voix",
          "Un euro = une voix",
          "Seuls les fondateurs votent"
        ],
        "reponse": 0
      },
      {
        "q": "« Reconnue d'utilité publique » signifie que l'association…",
        "options": [
          "Poursuit un intérêt général reconnu par l'État",
          "Est gérée par l'État",
          "Ne paie aucun impôt"
        ],
        "reponse": 0
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "img": "",
    "audioFile": null,
    "chant": null,
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 8,
      "objectif": "Identifier les conditions concrètes d'un accueil accessible à tous",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "locaux-accessibles",
    "nom": "Accueillir tout·es",
    "latin": "Locaux accessibles · rue Ernest Deconynck, Lille",
    "emoji": "♿",
    "couleur": "#444a6b",
    "categorie": "diurne",
    "taille": "Repère : chacun·e a sa place autour du feu",
    "anecdotes": [
      "Les locaux lillois des CEMÉA Nord-Pas-de-Calais sont pensés pour être accessibles à toutes et tous.",
      "L'accessibilité n'est pas une option : c'est une condition de la démocratie culturelle.",
      "Bien accueillir commence par des portes larges, des consignes claires et du temps."
    ],
    "quiz": [
      {
        "q": "Un lieu « accessible » est un lieu que peuvent utiliser…",
        "options": [
          "Tout le monde, y compris en situation de handicap",
          "Seules les personnes valides",
          "Uniquement sur rendez-vous"
        ],
        "reponse": 0
      },
      {
        "q": "Pour l'éducation populaire, l'accueil de toutes et tous est…",
        "options": [
          "Un principe fondateur",
          "Un détail pratique",
          "Une contrainte légale seulement"
        ],
        "reponse": 0
      }
    ]
  }
];

const GUIDE = [
  {
    "type": "notion-guide",
    "version": 1,
    "id": "reciprocite",
    "nom": "Biais de réciprocité",
    "latin": "Reciprocity norm · Cialdini",
    "emoji": "🤝",
    "couleur": "#b05f2a",
    "categorie": "diurne",
    "taille": "Antidote : accepter sans se sentir redevable",
    "img": "",
    "description": "Recevoir un petit cadeau crée une dette invisible : on dit alors oui à de grosses demandes.",
    "anecdotes": [
      "C'est la technique du « échantillon gratuit ».",
      "Offrir d'abord, demander ensuite : ça marche trop bien."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Reconnaître la dette invisible créée par un cadeau et choisir librement",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "joueur",
    "nom": "Erreur du joueur",
    "latin": "Gambler's fallacy",
    "emoji": "🎲",
    "couleur": "#2a6e5a",
    "categorie": "diurne",
    "taille": "Antidote : chaque tirage est indépendant",
    "img": "",
    "description": "Croire que « ça doit bien tomber maintenant » après une série de pile, alors que les chances n'ont pas bougé.",
    "anecdotes": [
      "La pièce n'a pas de mémoire.",
      "Les casinos adorent cette erreur."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Comprendre que chaque tirage aléatoire est indépendant des précédents",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "apophenie",
    "nom": "Apophénie",
    "latin": "Apophenia · Conrad, 1958",
    "emoji": "👀",
    "couleur": "#5c5c8a",
    "categorie": "nocturne",
    "taille": "Antidote : tester avant de croire",
    "img": "",
    "description": "Voir des formes ou des liens là où il n'y en a pas : visages dans les nuages, « coïncidences » partout.",
    "anecdotes": [
      "Pareidolie : voir un visage dans une prise électrique.",
      "Notre cerveau détecteur de motifs, parfois trop zélé."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Tester une coïncidence avant d'y voir un motif réel",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "optimisme",
    "nom": "Biais d'optimisme",
    "latin": "Optimism bias · Weinstein, 1980",
    "emoji": "🌈",
    "couleur": "#d97b1f",
    "categorie": "diurne",
    "taille": "Antidote : prévoir une marge de sécurité",
    "img": "",
    "description": "« Ça n'arrivera qu'aux autres. » On sous-estime ses risques et on surestime ses chances.",
    "anecdotes": [
      "La plupart des conducteurs se disent « au-dessus de la moyenne ».",
      "Les projets dépassent toujours leur délai prévu : loi de Hofstadter."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Estimer ses risques avec une marge de sécurité au lieu d'un optimisme aveugle",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "paille",
    "nom": "Homme de paille",
    "latin": "Straw man fallacy",
    "emoji": "🎯",
    "couleur": "#8a3b3b",
    "categorie": "diurne",
    "taille": "Antidote : reformuler l'argument d'autrui",
    "img": "",
    "description": "Déformer l'argument de l'autre pour le réfuter plus facilement, puis attaquer cette version affaiblie.",
    "anecdotes": [
      "Classique des débats en ligne.",
      "Contre-pied : l'homme d'acier — reformuler au plus juste."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Reformuler fidèlement l'argument d'autrui avant de le discuter",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "statuquo",
    "nom": "Biais du statu quo",
    "latin": "Status quo bias · Samuelson & Zeckhauser, 1988",
    "emoji": "🛋️",
    "couleur": "#4a5a6a",
    "categorie": "diurne",
    "taille": "Antidote : imaginer qu'on choisit aujourd'hui",
    "img": "",
    "description": "Préférer ce qui existe déjà, par simple habitude, même quand une meilleure option est disponible.",
    "anecdotes": [
      "Le « fait comme d'habitude » qui coûte cher.",
      "Tester : « Si je découvrais tout aujourd'hui, je choisirais quoi ? »"
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Réévaluer les options existantes comme si le choix se faisait aujourd'hui",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "exposition",
    "nom": "Simple exposition",
    "latin": "Mere exposure effect · Zajonc, 1968",
    "emoji": "💿",
    "couleur": "#7a5c9a",
    "categorie": "diurne",
    "taille": "Antidote : juger la chose, pas sa familiarité",
    "img": "",
    "description": "À force d'être vu ou entendu, quelque chose nous plaît davantage — sans aucune autre raison.",
    "anecdotes": [
      "Pourquoi les pubs passent en boucle.",
      "Une chanson « moyenne » devient favorite après quelques écoutes."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Distinguer la familiarité d'une chose de sa qualité réelle",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "controle",
    "nom": "Illusion de contrôle",
    "latin": "Illusion of control · Langer, 1975",
    "emoji": "🎮",
    "couleur": "#2a5a8a",
    "categorie": "diurne",
    "taille": "Antidote : distinguer habileté et hasard",
    "img": "",
    "description": "Croire qu'on maîtrise des événements purement aléatoires : lancer fort les dés pour faire un six !",
    "anecdotes": [
      "Les loteries vendent le choix des numéros comme un pouvoir.",
      "Souffler sur les dés ne change pas les probabilités."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Distinguer ce qui relève de l'habileté de ce qui relève du hasard",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "groupe",
    "nom": "Pensée de groupe",
    "latin": "Groupthink · Janis, 1972",
    "emoji": "🐑",
    "couleur": "#6a7a3a",
    "categorie": "nocturne",
    "taille": "Antidote : garder un avocat du diable",
    "img": "",
    "description": "Dans un groupe soudé, l'envie d'être d'accord écrase le doute : personne n'ose dire « attention ».",
    "anecdotes": [
      "Décisions célèbres ratées faute de contradiction.",
      "Une voix discordante améliore la décision collective."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Protéger la parole dissidente pour garder une décision collective lucide",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "id": "recence",
    "nom": "Biais de récence",
    "latin": "Recency bias",
    "emoji": "⏱️",
    "couleur": "#8a6a2a",
    "categorie": "diurne",
    "taille": "Antidote : regagner la vue d'ensemble",
    "img": "",
    "description": "Donner trop de poids aux derniers événements : la dernière réponse d'un élève colore toute sa note.",
    "anecdotes": [
      "Après un accident médiatisé, tous les risques semblent imminents.",
      "Tenir un journal aide à se souvenir de tout, pas juste de la fin."
    ],
    "pedagogie": {
      "ages": [
        6,
        99
      ],
      "duree_min": 5,
      "objectif": "Remettre les derniers événements dans leur contexte global",
      "programme": [
        "cycle 3",
        "cycle 4",
        "lycée"
      ]
    }
  },
  {
    "type": "notion-guide",
    "version": 1,
    "img": "",
    "categorie": "diurne",
    "anecdotes": [
      "« Les Ceméa » : Centres d'entraînement aux méthodes d'éducation active.",
      "Reconnus nationalement d'utilité publique, les CEMÉA fêtent leurs 89 ans en 2026.",
      "Le réseau est décentralisé : une association nationale tête de réseau et des associations régionales, en métropole comme en outre-mer."
    ],
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 5,
      "objectif": "Situer l'éducation populaire dans son contexte historique",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "histoire",
    "nom": "Repères historiques",
    "latin": "1936-1937 · le tournant populaire",
    "emoji": "📜",
    "couleur": "#3d4a6b",
    "taille": "Repère : congés payés → éducation pour tous",
    "description": "1936 : congés payés et front populaire. 1937 : naissance des CEMÉA. Puis Peuple et Culture, les MJC, les maisons de jeunes : tout un mouvement pour l'accès de tous à l'éducation et à la culture."
  },
  {
    "type": "notion-guide",
    "version": 1,
    "img": "",
    "categorie": "diurne",
    "anecdotes": [
      "Le BAFA permet d'encadrer des enfants en accueil collectif de mineurs.",
      "Chaque année, les CEMÉA Nord-Pas-de-Calais proposent entre 60 et 85 stages BAFA et BAFD.",
      "Le Service d'Aide au Placement (cemea-sap.fr) met en relation animateurs, directeurs et organisateurs d'accueils collectifs de mineurs."
    ],
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 5,
      "objectif": "Découvrir les parcours vers les métiers de l'animation",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "metiers-animation",
    "nom": "Métiers de l'animation",
    "latin": "BPJEPS · animation socio-éducative",
    "emoji": "🎓",
    "couleur": "#2a6e5a",
    "taille": "Piste : du BAFA au BPJEPS",
    "description": "Animateur ou animatrice, éducateur ou éducatrice, directeur de colo : ces métiers se préparent par la pratique — BAFA/BAFD dès 17 ans, BPJEPS, diplômes d'État — souvent en alternance."
  },
  {
    "type": "notion-guide",
    "version": 1,
    "img": "",
    "categorie": "diurne",
    "anecdotes": [
      "La typographie à l'école : les enfants imprimaient leurs propres textes.",
      "Son héritage vit dans des centaines de classes coopératives actuelles."
    ],
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 5,
      "objectif": "Connaître quelques outils Freinet transposables en classe",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "freinet",
    "nom": "La pédagogie Freinet",
    "latin": "École moderne · Célestin Freinet",
    "emoji": "🔧",
    "couleur": "#b05f2a",
    "taille": "Astuce : outils concrets, classe coopérative",
    "description": "Célestin Freinet, instituteur, invente des outils simples et puissants : texte libre, correspondance scolaire, journal de classe, conseil coopératif, fichiers autocorrectifs. Sa devise implicite : les enfants font eux-mêmes."
  },
  {
    "type": "notion-guide",
    "version": 1,
    "img": "",
    "categorie": "diurne",
    "anecdotes": [
      "Pour beaucoup d'enfants, la première colo reste un souvenir fondateur.",
      "Les séjours suivent une réglementation stricte (encadrement, projet pédagogique)."
    ],
    "pedagogie": {
      "ages": [
        8,
        99
      ],
      "duree_min": 5,
      "objectif": "Relier vacances et apprentissages informels",
      "programme": [
        "cycle 3",
        "cycle 4"
      ]
    },
    "id": "colos",
    "nom": "Vacances apprenantes",
    "latin": "Accueil collectif de mineurs",
    "emoji": "🏕️",
    "couleur": "#d98e04",
    "taille": "Idée : partir loin, grandir beaucoup",
    "description": "Colos et séjours « vacances apprenantes » mêlent jeu, découverte et renforcement des acquis : on y pratique les méthodes actives sans même s'en rendre compte. Encadrées par des équipes formées aux pédagogies de l'engagement."
  }
];

const BALISES = [
  {
    "type": "balise",
    "version": 1,
    "id": "B1",
    "bird": "confirmation",
    "code": "JDP-B1",
    "x": 74,
    "y": 452,
    "lat": 50.7258178,
    "lng": 3.1329639,
    "label": "La cabane à idées",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Je ne vois que les preuves qui me donnent raison, et je ferme les yeux sur les autres. Quel biais suis-je ?",
        "reponses": [
          "confirmation",
          "biais de confirmation",
          "le biais de confirmation",
          "biais de confirmations"
        ],
        "indice": "Mon nom parle de « confirmer » une idée déjà en place.",
        "saviez": "Peter Wason l'a démontré avec une suite de nombres : presque personne n'osait tester une hypothèse qui pouvait la détruire.",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "Quand tu cherches des arguments, je ne te montre que ceux qui flattent ton opinion. Ton idée a toujours raison avec moi. Qui suis-je ?",
        "reponses": [
          "confirmation",
          "biais de confirmation",
          "le biais de confirmation"
        ],
        "indice": "Je porte le nom d'un accord : « oui, oui, c'est confirmé ! »",
        "saviez": "Les réseaux sociaux montrent surtout des contenus qui nous ressemblent : notre biais adore s'y nourrir.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Née dans les laboratoires de Peter Wason en 1960, je fais tester les hypothèses dans un seul sens : celui qui arrange mon propriétaire. Quel biais suis-je ?",
        "reponses": [
          "confirmation",
          "biais de confirmation",
          "le biais de confirmation"
        ],
        "indice": "Chercher à confirmer plutôt qu'à infirmer : me voilà.",
        "saviez": "Le meilleur réflexe scientifique : essayer de se tromper. Une hypothèse qui survit à tous les tests gagne notre confiance.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B2",
    "bird": "ancrage",
    "code": "JDP-B2",
    "x": 148,
    "y": 400,
    "lat": 48.8567,
    "lng": 2.3523,
    "label": "Le quai des ancres",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Le premier nombre que tu entends me devient une chaîne : tes estimations restent accrochées dessus. Quel effet suis-je ?",
        "reponses": [
          "ancrage",
          "effet d ancrage",
          "l effet d ancrage",
          "effet d'ancrage",
          "l'effet d'ancrage"
        ],
        "indice": "Mon nom vient du gros objet lourd qui empêche le bateau de bouger.",
        "saviez": "Même un nombre tiré au sort sous vos yeux influence ensuite vos estimations : l'ancre tient bon.",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "« Barré à 100 €, aujourd'hui 39 € ! » Grâce à moi, 100 € est resté dans ta tête et l'affaire te paraît imbattable. Qui suis-je ?",
        "reponses": [
          "ancrage",
          "effet d ancrage",
          "l effet d ancrage",
          "effet d'ancrage",
          "l'effet d'ancrage"
        ],
        "indice": "Le prix barré sert de… point de départ à ton jugement.",
        "saviez": "Kahneman et Tversky ont montré qu'une roue de loterie truquée changeait les estimations des participants, experts compris.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Amiral des premiers chiffres, je mouille devant ta pensée : tout ce qui suit se mesure à ma chaîne, même quand je suis absurde. Nommez-moi.",
        "reponses": [
          "ancrage",
          "effet d ancrage",
          "l effet d ancrage",
          "effet d'ancrage",
          "l'effet d'ancrage"
        ],
        "indice": "Tversky & Kahneman, 1974 : la première valeur capture l'estimation.",
        "saviez": "En négociation, celui qui annonce le premier prix pose souvent l'ancre : connaître l'effet permet de le contrer.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B3",
    "bird": "disponibilite",
    "code": "JDP-B3",
    "x": 238,
    "y": 292,
    "lat": 48.8565,
    "lng": 2.3521,
    "label": "L'écran géant",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Ce que tu vois souvent aux infos te semble arriver tout le temps. Je juge la fréquence par la facilité de s'en souvenir. Quel biais suis-je ?",
        "reponses": [
          "disponibilite",
          "biais de disponibilite",
          "le biais de disponibilite",
          "disponibilité",
          "biais de disponibilité",
          "le biais de disponibilité"
        ],
        "indice": "Mon nom parle de ce qui est facilement « disponible » dans ta mémoire.",
        "saviez": "Après un accident d'avion médiatisé, beaucoup ont peur de voler… alors que la route reste bien plus risquée.",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "Images choc, titres fracassants : je transforme les souvenirs faciles en statistiques imaginaires. Qui suis-je ?",
        "reponses": [
          "disponibilite",
          "biais de disponibilite",
          "le biais de disponibilite",
          "disponibilité",
          "biais de disponibilité",
          "le biais de disponibilité"
        ],
        "indice": "Facile à retrouver en mémoire ≠ fréquent dans la réalité.",
        "saviez": "Tversky et Kahneman (1973) : on estime la fréquence d'un mot selon la vitesse à laquelle on retrouve des exemples.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Archiviste paresseux, je classe « fréquent » ce qui remonte vite à la surface, et « rare » ce que la mémoire peine à retrouver. Mon nom ?",
        "reponses": [
          "disponibilite",
          "biais de disponibilite",
          "le biais de disponibilite",
          "disponibilité",
          "biais de disponibilité",
          "le biais de disponibilité"
        ],
        "indice": "Heuristique de… : la mémoire comme raccourci de jugement.",
        "saviez": "L'antidote : demander les chiffres. Les vraies statistiques corrigent les impressions créées par les médias.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B4",
    "bird": "dunning",
    "code": "JDP-B4",
    "x": 320,
    "y": 320,
    "lat": 48.8568,
    "lng": 2.3524,
    "label": "La grande montagne russe",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Plus on débute, plus on se croit fort ; plus on apprend, plus on voit ses lacunes. Quel effet suis-je ?",
        "reponses": [
          "dunning kruger",
          "effet dunning kruger",
          "l effet dunning kruger",
          "dunning-kruger",
          "effet dunning-kruger",
          "kruger dunning"
        ],
        "indice": "Mon nom est composé de deux noms de chercheurs.",
        "saviez": "Chez les étudiants testés, les moins bons résultats s'accompagnaient des estimations les plus élevées.",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "Je suis la bosse de confiance du débutant : elle monte vite, puis redescend à mesure que la vraie compétence apparaît. Qui suis-je ?",
        "reponses": [
          "dunning kruger",
          "effet dunning kruger",
          "l effet dunning kruger",
          "dunning-kruger",
          "effet dunning-kruger"
        ],
        "indice": "Deux psychologues de Cornell, Kruger et Dunning, m'ont décrit en 1999.",
        "saviez": "Courbe célèbre : la « vallée de la mort » arrive quand on réalise enfin tout ce qu'il reste à apprendre.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Double incompétence : celle qui échoue, et celle qui ne permet pas de voir l'échec. Mes deux pères portent des noms de chercheurs. Qui suis-je ?",
        "reponses": [
          "dunning kruger",
          "effet dunning kruger",
          "l effet dunning kruger",
          "dunning-kruger",
          "effet dunning-kruger"
        ],
        "indice": "Il faut être un minimum compétent pour mesurer son incompétence.",
        "saviez": "L'humilité épistémique — savoir qu'on peut se tromper — est la marque des vrais experts.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B5",
    "bird": "cout",
    "code": "JDP-B5",
    "x": 406,
    "y": 448,
    "lat": 48.8564,
    "lng": 2.352,
    "label": "Le puits aux pièces",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Tu continues un jeu ennuyeux juste parce que tu as déjà payé. L'argent perdu te pousse à en perdre plus. Quel sophisme suis-je ?",
        "reponses": [
          "cout irrecuperable",
          "coût irrécupérable",
          "le coût irrécupérable",
          "sophisme du coût irrécupérable",
          "sunk cost"
        ],
        "indice": "Mon nom parle d'une dépense qui ne reviendra jamais.",
        "saviez": "Restez jusqu'au bout d'un film nul « puisque le billet est payé » : classique ! Le billet ne reviendra pas pour autant.",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "« J'ai déjà investi tant de temps, je ne peux pas arrêter maintenant ! » Je transforme le passé en prison. Qui suis-je ?",
        "reponses": [
          "cout irrecuperable",
          "coût irrécupérable",
          "le coût irrécupérable",
          "sophisme du coût irrécupérable",
          "sunk cost"
        ],
        "indice": "Seuls les gains futurs devraient compter dans une décision.",
        "saviez": "Le projet Concorde a été poursuivi des années « à cause des milliards déjà dépensés » : le sophisme porte aussi son nom.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Comptable de l'impossible, j'exige qu'on paye deux fois la même erreur sous prétexte qu'elle a déjà coûté. Les économistes m'appellent sunk cost. Mon nom français ?",
        "reponses": [
          "cout irrecuperable",
          "coût irrécupérable",
          "le coût irrécupérable",
          "sophisme du coût irrécupérable"
        ],
        "indice": "Irrécupérable : ce qui est perdu ne se récupère pas.",
        "saviez": "La bonne question : « En partant de maintenant, quelle est la meilleure option ? » Le passé n'a pas de vote.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B6",
    "bird": "halo",
    "code": "JDP-B6",
    "x": 388,
    "y": 396,
    "lat": 48.8569,
    "lng": 2.3525,
    "label": "Le jardin lumineux",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Une seule qualité illumine tout : « Il est sympa, donc intelligent et honnête ! » Quel effet suis-je ?",
        "reponses": [
          "halo",
          "effet halo",
          "l effet halo",
          "effet de halo"
        ],
        "indice": "Mon nom est le cercle de lumière que les peintres mettent autour des saints.",
        "saviez": "Edward Thorndike l'a observé en 1920 : une bonne note d'un officier entraînait toutes les autres.",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "Une star sourit à la télé et voilà qu'on croit que son produit est génial. Sa lumière colorie tout ce qu'elle touche. Qui suis-je ?",
        "reponses": [
          "halo",
          "effet halo",
          "l effet halo",
          "effet de halo"
        ],
        "indice": "La publicité exploite la renommée : c'est mon royaume.",
        "saviez": "À l'inverse, le « horn effect » (effet corne) : un seul défaut, et tout le dossier devient sombre.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Auréole trompeuse, je fais déborder une vertu sur toutes les autres : jugez-moi en 1920 chez les officiers de Thorndike. Mon nom ?",
        "reponses": [
          "halo",
          "effet halo",
          "l effet halo",
          "effet de halo"
        ],
        "indice": "Un rayon de lumière qui aveugle le jugement.",
        "saviez": "Antidote : noter chaque critère séparément, avant de se faire une opinion globale.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B7",
    "bird": "verite",
    "code": "JDP-B7",
    "x": 320,
    "y": 500,
    "lat": 48.857,
    "lng": 2.3526,
    "label": "L'écho sans fin",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Répétée dix fois, une fausse information finit par paraître vraie. Quelle illusion suis-je ?",
        "reponses": [
          "illusion de la verite",
          "l illusion de la verite",
          "verite illusoire",
          "illusion de vérité",
          "la illusion de la vérité",
          "vérité illusoire"
        ],
        "indice": "Mon nom associe « illusion » et une grande mot à 5 lettres : la vérité.",
        "saviez": "Hasher, Goldstein et Toppino (1977) ont montré que la répétition suffit à créer un sentiment de vérité.",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "Je ne suis ni preuve ni source : je ne suis qu'une répétition. Et pourtant, plus on m'entend, plus on me croit. Qui suis-je ?",
        "reponses": [
          "illusion de la verite",
          "l illusion de la verite",
          "verite illusoire",
          "illusion de vérité",
          "vérité illusoire"
        ],
        "indice": "Les rumeurs prospèrent grâce à moi.",
        "saviez": "Le réflexe : vérifier la source et la date avant de partager. Une répétition n'est pas une preuve.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Sœur jumelle du mensonge, je gagne ma force à chaque écho. Trois chercheurs de 1977 m'ont donnée un nom. Lequel ?",
        "reponses": [
          "illusion de la verite",
          "verite illusoire",
          "illusory truth"
        ],
        "indice": "Illusory truth effect en anglais.",
        "saviez": "Même des gens avertis retombent dans le panneau : la familiarité agit avant la réflexion.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B8",
    "bird": "barnum",
    "code": "JDP-B8",
    "x": 148,
    "y": 560,
    "lat": 48.8571,
    "lng": 2.3527,
    "label": "La roulotte du devin",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "« Tu as besoin que les autres t'estiment, mais tu doutes de toi parfois. » Ça te ressemble ? À moi aussi ! Quel effet suis-je ?",
        "reponses": [
          "barnum",
          "effet barnum",
          "l effet barnum",
          "forer",
          "effet forer"
        ],
        "indice": "Mon nom vient du directeur de cirque P.T. Barnum : un spectacle pour tous !",
        "saviez": "En 1949, Bertram Forer a donné le même portrait astrologique à toute sa classe : note moyenne de vérité, 4/5 !",
        "ages": [
          6,
          9
        ]
      },
      "moyen": {
        "text": "Horoscopes et faux tests me servent de scène : mes phrases floues semblent faites sur mesure… pour tout le monde. Qui suis-je ?",
        "reponses": [
          "barnum",
          "effet barnum",
          "l effet barnum",
          "forer",
          "effet forer"
        ],
        "indice": "Une description vague qui convient à presque tout le monde.",
        "saviez": "Test Barnum : si la phrase marcherait pour n'importe qui, elle ne décrit personne en particulier.",
        "ages": [
          10,
          13
        ]
      },
      "difficile": {
        "text": "Charlatan des généralités, je peins des portraits universels que chacun prend pour son reflet. Mon second nom est celui du psychologue de 1949. Qui suis-je ?",
        "reponses": [
          "barnum",
          "forer",
          "effet barnum",
          "effet forer"
        ],
        "indice": "Deux noms possibles : un cirque et un psychologue.",
        "saviez": "L'antidote : exiger de la précision. Une vraie description personnelle comporte des détails vérifiables.",
        "ages": [
          14,
          99
        ]
      }
    },
    "enigme": null
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C1",
    "bird": "cooperation",
    "code": "JDP-C1",
    "label": "Le cercle d'entraide",
    "x": 240,
    "y": 105,
    "lat": 50.7258178,
    "lng": 3.1329639,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Ici, personne ne gagne seul : on avance en tirant tous dans le même sens. Quel principe suis-je ?",
        "reponses": [
          "cooperation",
          "la cooperation",
          "coopérer",
          "cooperer"
        ],
        "indice": "Mon nom commence comme « opérer »… mais ensemble.",
        "saviez": "Freinet appelait cela la « classe coopérative » : les élèves gèrent leur journal, leurs responsabilités, leur budget.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Je transforme un groupe d'élèves en équipe : tutorat, conseils, projets communs. La victoire de l'un devient celle de tous. Qui suis-je ?",
        "reponses": [
          "cooperation",
          "pedagogie cooperative",
          "la pedagogie cooperative"
        ],
        "indice": "On m'oppose souvent à la compétition.",
        "saviez": "Expliquer à un pair oblige à organiser sa pensée : c'est pourquoi le tutorat profite aussi à celui qui explique.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Instituée par un maître d'école du Bar-sur-Loup, je remplace la rangée silencieuse par un atelier solidaire. Mon nom complet ?",
        "reponses": [
          "pedagogie cooperative freinet",
          "la pedagogie cooperativa",
          "cooperation"
        ],
        "indice": "Pensez à Célestin Freinet et à son École moderne.",
        "saviez": "Le conseil de coopérative existe encore aujourd'hui dans de nombreuses classes françaises.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C10",
    "bird": "ess",
    "code": "JDP-C10",
    "label": "La monnaie du sens",
    "x": 87,
    "y": 225,
    "lat": 50.6315014,
    "lng": 3.0558671,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Ici, l'argent gagné retourne dans le projet, pas dans les poches d'actionnaires. Comment appelle-t-on cette économie ?",
        "reponses": [
          "l'economie sociale et solidaire",
          "economie sociale et solidaire",
          "ess",
          "l ess",
          "l'ess",
          "economie solidaire"
        ],
        "indice": "Trois initiales : E-S-S.",
        "saviez": "Les CEMÉA relèvent à la fois de l'utilité publique et de l'économie sociale et solidaire.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Coopératives, associations, mutuelles : mon principe est simple, une personne = une voix. Quel secteur suis-je ?",
        "reponses": [
          "l'economie sociale et solidaire",
          "economie sociale et solidaire",
          "ess",
          "l ess",
          "l'ess"
        ],
        "indice": "On la surnomme souvent par trois lettres.",
        "saviez": "Dans une coopérative, ce sont les sociétaires qui votent, pas les actionnaires majoritaires.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Association reconnue d'utilité publique ET entreprise de l'ESS, le mouvement CEMÉA s'appuie sur un réseau décentralisé. Sur quoi repose sa gouvernance ?",
        "reponses": [
          "une personne une voix",
          "1 personne 1 voix",
          "une personne egale une voix",
          "une personne = une voix",
          "une tete regionale par territoire"
        ],
        "indice": "Pensez au suffrage… coopératif.",
        "saviez": "Chaque tête régionale CEMÉA adapte les formations aux besoins de son territoire.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C11",
    "bird": "locaux-accessibles",
    "code": "JDP-C11",
    "label": "La porte large",
    "x": 149,
    "y": 138,
    "lat": 50.6315107,
    "lng": 3.0558901,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Mes portes sont larges, mes couloirs sans marches : ici, tout le monde peut entrer et apprendre. De quoi parle-t-on ?",
        "reponses": [
          "l'accessibilite",
          "accessibilite",
          "accessibilité",
          "un lieu accessible",
          "locaux accessibles"
        ],
        "indice": "Le mot vient de « accéder » : pouvoir entrer.",
        "saviez": "Les locaux lillois des CEMÉA NPDC sont conçus pour être accessibles à toutes et tous.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Rampes, signalétique claire, temps adapté : je désigne l'ensemble des conditions qui permettent à chacun de participer. Suis-je ?",
        "reponses": [
          "l'accessibilite",
          "accessibilite",
          "accessibilite universelle",
          "l accessibilite"
        ],
        "indice": "Universelle, même.",
        "saviez": "L'accessibilité est une condition de la démocratie culturelle défendue par l'éducation populaire.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Siège des CEMÉA Nord-Pas-de-Calais, ce lieu lillois illustre leur principe d'accueil inconditionnel. Dans quelle rue se trouve-t-il ?",
        "reponses": [
          "rue ernest deconynck",
          "ernest deconynck",
          "11 rue ernest deconynck",
          "rue deconynck"
        ],
        "indice": "Un prénom et un nom lillois : Ernest …",
        "saviez": "Bien accueillir commence par l'architecture : portes larges, cheminements clairs, temps laissés.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C2",
    "bird": "methode-active",
    "code": "JDP-C2",
    "label": "L'atelier des mains",
    "x": 331,
    "y": 138,
    "lat": 50.6314952,
    "lng": 3.0559003,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "On ne m'apprend pas en écoutant seulement : il faut me toucher, me tester, me rater puis me réussir. Comment appelle-t-on cette façon d'apprendre ?",
        "reponses": [
          "methode active",
          "methodes actives",
          "apprendre en faisant",
          "education active"
        ],
        "indice": "Mes mains ! Le corps participe.",
        "saviez": "Les CEMÉA ont été créés en 1937 précisément pour entraîner aux méthodes d'éducation ACTIVE.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Je suis l'inverse du cours magistral pur : ici on expérimente, on cherche, on prouve. Mon nom ?",
        "reponses": [
          "methode active",
          "pedagogie active",
          "l education active"
        ],
        "indice": "Adjectif opposé à « passif ».",
        "saviez": "Faire soi-même multiplie la mémorisation : c'est prouvé par les recherches en sciences cognitives.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Créés en 1937 pour former les cadres des colonies et des mouvements de jeunesse, ces centres portent mon nom dans leur intitulé. Lesquels ?",
        "reponses": [
          "cemea",
          "les cemea",
          "centres d entrainement aux methodes d education active"
        ],
        "indice": "Quatre lettres majuscules.",
        "saviez": "Les CEMÉA forment toujours aujourd'hui animateurs, éducateurs et enseignants, en France et à l'international.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C3",
    "bird": "expression",
    "code": "JDP-C3",
    "label": "La scène ouverte",
    "x": 393,
    "y": 225,
    "lat": 50.631502,
    "lng": 3.0559154,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Écris, dessine, dis : ici ta parole vaut sans note ni sanction. Comment nomme-t-on cette liberté de s'exprimer ?",
        "reponses": [
          "expression libre",
          "l expression libre",
          "expression"
        ],
        "indice": "Libre comme l'oiseau — mais c'est ta voix qui s'envole.",
        "saviez": "Le journal de classe imprimait les textes des élèves pour de vrais lecteurs : parents, correspondants, autres classes.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "On rejoue une dispute devant vous, puis on arrête tout : à vous de changer le cours de l'histoire. Quelle technique suis-je ?",
        "reponses": [
          "theatre forum",
          "theatre-forum",
          "le theatre forum"
        ],
        "indice": "Augusto Boal l'appelait aussi « théâtre des opprimés ».",
        "saviez": "Le théâtre-forum est utilisé pour travailler citoyenneté, harcèlement, égalité : on répète à agir autrement.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "De Freinet à Boal, je suis le fil rouge : faire entendre celles et ceux qu'on n'écoute jamais. En deux mots ?",
        "reponses": [
          "expression libre",
          "libre expression"
        ],
        "indice": "Deux mots : un verbe nominalisé + un adjectif.",
        "saviez": "Prendre la parole en public figure parmi les compétences psychosociales recommandées par l'OMS.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C4",
    "bird": "emancipation",
    "code": "JDP-C4",
    "label": "Le conseil des libres",
    "x": 406,
    "y": 339,
    "lat": 50.6314986,
    "lng": 3.0559328,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Grâce à moi, tu comprends mieux le monde et tu décides toi-même au lieu de subir. Que deviens-tu ainsi ?",
        "reponses": [
          "emancipe",
          "émancipé",
          "emancipee",
          "plus libre",
          "autonome"
        ],
        "indice": "Presque « mancipé »… mais débarrassé des chaînes de l'ignorance.",
        "saviez": "« Émanciper » vient du droit romain : affranchir un enfant de l'autorité du père.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Lire un contrat, vérifier une info, argumenter calmement : ces savoirs-là rendent difficile à duper. Quel but poursuit l'éducation populaire à travers eux ?",
        "reponses": [
          "l emancipation",
          "emancipation",
          "rendre libre"
        ],
        "indice": "C'est le titre même de cette découverte.",
        "saviez": "Condorcet proposait dès 1792 une instruction publique gratuite et égale pour toutes et tous.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Ni dressage ni remplissage : je suis le projet qui traverse de Condorcet aux CEMÉA — former des esprits libres capables de transformer leur monde. Un mot ?",
        "reponses": [
          "emancipation",
          "l emancipation",
          "emanciper"
        ],
        "indice": "Sept syllabes… presque une révolution.",
        "saviez": "Pour l'éducation populaire, on n'apprend pas seulement pour l'école, mais pour agir dans la société.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C5",
    "bird": "acces-tous",
    "code": "JDP-C5",
    "label": "La grande porte ouverte",
    "x": 367,
    "y": 444,
    "lat": 50.6314833,
    "lng": 3.0559315,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Depuis 1936, les vacances ne sont plus un privilège : elles deviennent un droit pour toutes et tous. Qui a organisé ces premiers loisirs populaires ?",
        "reponses": [
          "leo lagrange",
          "lagrange"
        ],
        "indice": "Prénom d'un lion, nom d'un mathématicien célèbre.",
        "saviez": "Léo Lagrange fut sous-secrétaire d'État aux Sports et à l'Organisation des Loisirs dès 1936.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Colos, MJC, bibliothèques de quartier : je veille à ce que la culture ne soit pas une marchandise de luxe. Comment appelle-t-on cet idéal ?",
        "reponses": [
          "democratie culturelle",
          "la democratie culturelle",
          "acces pour tous",
          "culture pour tous"
        ],
        "indice": "Démocratie… mais côté culture.",
        "saviez": "Les colonies de vacances ont accueilli des millions d'enfants depuis les années 1930.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Ma question rituelle : « Qui n'est pas venu ? Pourquoi ? Comment rouvrir la porte ? » Je suis la boussole de toute action d'éducation populaire. Quel principe ?",
        "reponses": [
          "acces de tous",
          "l acces de tous a la culture",
          "pour toutes et tous",
          "democratie culturelle"
        ],
        "indice": "Cette découverte s'intitule « Pour … et … ».",
        "saviez": "Ce souci d'accès irrigue aussi les politiques publiques : tarif réduit, transport solidaire, matériel prêté.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C6",
    "bird": "jeu-role",
    "code": "JDP-C6",
    "label": "Le terrain des possibles",
    "x": 287,
    "y": 507,
    "lat": 50.6314782,
    "lng": 3.0559141,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Je te fais vivre un entretien ou un débat… pour de faux ! Demain, tu sauras le faire pour de vrai. Que pratique-t-on ici ?",
        "reponses": [
          "jeu de role",
          "le jeu de role",
          "mise en situation"
        ],
        "indice": "On endosse un personnage, comme au théâtre.",
        "saviez": "Les pilotes s'entraînent sur simulateur : c'est le même principe pour les situations humaines.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Avant, je joue ; après, j'analyse : qu'ai-je ressenti, décidé, appris ? Comment s'appelle cette phase essentielle ?",
        "reponses": [
          "debriefing",
          "le debriefing",
          "debrief",
          "retour d experience"
        ],
        "indice": "Mot anglais adopté en formation…",
        "saviez": "Sans débriefing, le jeu reste un divertissement ; avec lui, il devient apprentissage.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Simuler pour ne pas subir : je suis la méthode signature des formations CEMÉA, où l'on éprouve les situations avant de les vivre. De quelle méthode parle-t-on ?",
        "reponses": [
          "mises en situation",
          "mise en situation",
          "jeux de role",
          "simulation"
        ],
        "indice": "Pluriel conseillé : on n'éprouve jamais qu'une seule fois.",
        "saviez": "Ces mises en situation préparent aux métiers de l'animation, du social et de l'éducation spécialisée.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C7",
    "bird": "journee-dehors",
    "code": "JDP-C7",
    "label": "La salle sans murs",
    "x": 193,
    "y": 507,
    "lat": 50.6314652,
    "lng": 3.0558846,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Ma salle n'a ni plafond ni murs : les feuilles servent de cahier et le vent de messager. Où apprend-on ainsi ?",
        "reponses": [
          "dehors",
          "en exterieur",
          "à l'extérieur",
          "exterieur",
          "la nature",
          "nature",
          "en pleine air",
          "plein air"
        ],
        "indice": "Levez les yeux : le plafond est bleu (ou gris).",
        "saviez": "La Journée Éducation du Dehors réunit chaque année un peu plus d'une centaine de participant·es à Lille.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Forest schools au nord, classes vertes au sud : je désigne toutes les pratiques où l'on apprend hors des murs. Qui suis-je ?",
        "reponses": [
          "l'education du dehors",
          "education du dehors",
          "education dehors",
          "l education du dehors"
        ],
        "indice": "Trois mots : éducation … du …",
        "saviez": "Apprendre dehors mobilise le corps : on retient mieux quand on bouge, touche et explore.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Organisée à Lille par les CEMÉA NPDC, cette journée annuelle rassemble plus de cent professionnels de l'enfance autour du jeu et de la nature. Son nom ?",
        "reponses": [
          "journee education du dehors",
          "la journee education du dehors",
          "journee de l education du dehors",
          "journée éducation du dehors"
        ],
        "indice": "Elle célèbre un lieu : le « dehors ».",
        "saviez": "Les forest schools scandinaves inspirent directement les pratiques françaises d'éducation du dehors.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C8",
    "bird": "erasmus",
    "code": "JDP-C8",
    "label": "Le pont de l'Europe",
    "x": 113,
    "y": 444,
    "lat": 50.6314701,
    "lng": 3.0558641,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Huit maîtresses italiennes ont traversé la mer pour découvrir comment on fait la classe à la française. Quel programme européen paie le voyage ?",
        "reponses": [
          "erasmus",
          "erasmus+",
          "erasmus plus",
          "le programme erasmus"
        ],
        "indice": "Ce prénom grec est devenu LE mot des échanges d'étudiants.",
        "saviez": "En juin 2026, les CEMÉA NPDC accueillaient huit enseignantes des écoles Margherita Fasolo (Italie).",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Je finance les mobilités des apprentis, des élèves et des enseignants pour que les savoirs voyagent en Europe. Je suis…",
        "reponses": [
          "erasmus+",
          "erasmus plus",
          "erasmus"
        ],
        "indice": "Ajoutez un « + » au nom le plus connu d'Europe.",
        "saviez": "Observer une classe étrangère oblige à repenser ses propres routines pédagogiques.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Juin 2026, Lille : une délégation italienne découvre la pédagogie active grâce aux CEMÉA NPDC. Quelles écoles représentait-elle ?",
        "reponses": [
          "ecoles margherita fasolo",
          "les ecoles margherita fasolo",
          "margherita fasolo",
          "ecole margherita fasolo"
        ],
        "indice": "Un prénom et un nom : Margherita …",
        "saviez": "Les mobilités Erasmus+ concernent aussi bien les élèves que les professionnel·les de l'éducation.",
        "ages": [
          14,
          99
        ]
      }
    }
  },
  {
    "type": "balise",
    "version": 1,
    "id": "C9",
    "bird": "yakamedia",
    "code": "JDP-C9",
    "label": "La voix des jeunes",
    "x": 74,
    "y": 339,
    "lat": 50.6314852,
    "lng": 3.0558591,
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Journal, radio, vidéo : ici, ce sont les jeunes qui tiennent la plume et le micro. Comment s'appelle leur média ?",
        "reponses": [
          "yakamedia",
          "yaka media",
          "yak"
        ],
        "indice": "Ça commence comme « Y a ka »… comprendre : il y a quoi !",
        "saviez": "Yakamédia publie des contenus créés par et pour les jeunes, accompagnés par les CEMÉA.",
        "ages": [
          8,
          10
        ]
      },
      "moyen": {
        "text": "Née en 1955 sous forme de revue, je donne la parole aux enfants depuis bientôt un siècle de médias. Mon petit nom ?",
        "reponses": [
          "yak",
          "la revue yak",
          "revue yak"
        ],
        "indice": "Trois lettres, ça veut dire « il y a quoi ? ».",
        "saviez": "Faire son journal apprend à vérifier, hiérarchiser et raconter : le socle de l'esprit critique.",
        "ages": [
          11,
          13
        ]
      },
      "difficile": {
        "text": "Plateforme des CEMÉA dédiée aux médias jeunesse, je prolonge une revue pionnière créée en 1955. Mon nom complet ?",
        "reponses": [
          "yakamedia",
          "yaka media",
          "yakamedia cemea",
          "la plateforme yakamedia"
        ],
        "indice": "Yak + média.",
        "saviez": "En 1955, laisser les enfants écrire leur propre revue était une vraie révolution culturelle.",
        "ages": [
          14,
          99
        ]
      }
    }
  }
];

const DIFFICULTIES = [
  { id: "facile", label: "Facile" },
  { id: "moyen", label: "Moyen" },
  { id: "difficile", label: "Difficile" },
];

/* Thèmes visuels sélectionnables dans Réglages (content/themes/) */
const THEMES = [
  {
    "id": "defaut",
    "nom": "Nuit étoilée",
    "emoji": "🌙",
    "description": "L'ambiance d'origine : nuit bleutée sous les étoiles.",
    "meta": "#101822",
    "fond": null,
    "vars": {
      "--bg": "#101822",
      "--bg-soft": "#15202c",
      "--card": "#1b2735",
      "--card-soft": "#22303f",
      "--ink": "#e8f0f5",
      "--text-muted": "#b9c8d4",
      "--primary": "#2fb97c",
      "--primary-dark": "#1d8a5b",
      "--gold": "#ffce3d",
      "--err": "#ff7878",
      "--ok": "#5fd68f",
      "--line": "#33465a",
      "--shadow": "0 6px 22px rgba(0, 0, 0, 0.45)"
    }
  },
  {
    "id": "nature",
    "nom": "Nature",
    "emoji": "🌿",
    "description": "Sous-bois vert et mousse, pour les sentiers en forêt.",
    "meta": "#122b18",
    "fond": "radial-gradient(1200px 600px at 80% -10%, rgba(67, 196, 99, 0.14), transparent 60%), radial-gradient(900px 500px at -10% 100%, rgba(255, 210, 61, 0.08), transparent 55%)",
    "vars": {
      "--bg": "#0d2013",
      "--bg-soft": "#122b1a",
      "--card": "#173524",
      "--card-soft": "#1d4029",
      "--ink": "#eaf6ec",
      "--text-muted": "#b2cfba",
      "--primary": "#43c463",
      "--primary-dark": "#2b9a48",
      "--gold": "#ffd23d",
      "--err": "#ff7878",
      "--ok": "#71dd8f",
      "--line": "#2c5038",
      "--shadow": "0 6px 22px rgba(0, 0, 0, 0.45)"
    }
  },
  {
    "id": "espace",
    "nom": "Espace",
    "emoji": "🚀",
    "description": "Cosmos profond, nébuleuses et constellations.",
    "meta": "#0d1030",
    "fond": "radial-gradient(1000px 520px at 75% -5%, rgba(129, 106, 255, 0.22), transparent 60%), radial-gradient(800px 420px at 10% 110%, rgba(64, 156, 255, 0.16), transparent 55%)",
    "vars": {
      "--bg": "#0a0e26",
      "--bg-soft": "#101636",
      "--card": "#171f47",
      "--card-soft": "#1f2a58",
      "--ink": "#ecf0ff",
      "--text-muted": "#b7c1ea",
      "--primary": "#6f8cff",
      "--primary-dark": "#4c66d9",
      "--gold": "#ffd76e",
      "--err": "#ff8080",
      "--ok": "#7ee2a8",
      "--line": "#303c72",
      "--shadow": "0 6px 24px rgba(0, 0, 10, 0.55)"
    }
  },
  {
    "id": "futuriste",
    "nom": "Futuriste",
    "emoji": "⚡",
    "description": "Néons cyan et magenta sur asphalte nocturne.",
    "meta": "#08131c",
    "fond": "radial-gradient(900px 480px at 85% -10%, rgba(0, 229, 255, 0.16), transparent 60%), radial-gradient(700px 400px at 0% 105%, rgba(255, 45, 170, 0.13), transparent 55%)",
    "vars": {
      "--bg": "#071119",
      "--bg-soft": "#0b1926",
      "--card": "#0f2334",
      "--card-soft": "#142d42",
      "--ink": "#e6faff",
      "--text-muted": "#9fc9da",
      "--primary": "#00e5ff",
      "--primary-dark": "#00a8bd",
      "--gold": "#ffe066",
      "--err": "#ff5d7a",
      "--ok": "#3dffc0",
      "--line": "#1d4058",
      "--shadow": "0 6px 24px rgba(0, 20, 30, 0.6)"
    }
  },
  {
    "id": "retro",
    "nom": "Rétro",
    "emoji": "📼",
    "description": "Sepia chaud des soirées diapo et cassettes VHS.",
    "meta": "#241a0e",
    "fond": "radial-gradient(1000px 520px at 80% -10%, rgba(255, 170, 60, 0.14), transparent 60%), radial-gradient(800px 460px at 5% 105%, rgba(200, 90, 40, 0.12), transparent 55%)",
    "vars": {
      "--bg": "#221708",
      "--bg-soft": "#2c1f0d",
      "--card": "#382713",
      "--card-soft": "#44301a",
      "--ink": "#fdf3dd",
      "--text-muted": "#d3bd97",
      "--primary": "#ffab40",
      "--primary-dark": "#d98a25",
      "--gold": "#ffd76e",
      "--err": "#ff8674",
      "--ok": "#ffd76e",
      "--line": "#5a4326",
      "--shadow": "0 6px 22px rgba(20, 10, 0, 0.5)"
    }
  }
];
/* ==== FIN CONTENU GÉNÉRÉ ==== */

/* Toutes les découvertes : celles du parcours + celles du guide embarqué */
function allBirds() { return BIRDS.concat(GUIDE); }

function getBird(id) { return allBirds().find((b) => b.id === id); }
function getBalise(id) { return BALISES.find((b) => b.id === id); }
function getBaliseIndex(id) { return BALISES.findIndex((b) => b.id === id); }
function nextBalise(id) { const i = getBaliseIndex(id); return i >= 0 && i < BALISES.length - 1 ? BALISES[i + 1] : null; }

/* Retourne l'énigme d'une balise selon la difficulté choisie */
function getEnigme(balise, difficulty) {
  if (!balise) return null;
  const d = difficulty || "facile";
  if (balise.enigmes && balise.enigmes[d]) return balise.enigmes[d];
  return balise.enigme || null;
}

/* Normalisation d'une réponse : minuscules, sans accents ni espaces doubles */
function normalize(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[''\u2019]/g, " ").replace(/\s+/g, " ").trim();
}

function checkAnswer(enigme, answer) {
  const a = normalize(answer);
  if (!a) return false;
  return enigme.reponses.some((r) => normalize(r) === a || normalize(r) === a.replace(/^(le |la |un |une |l )/, ""));
}

/* Quiz ---------------------------------------------------------------- */
function makeQuiz(bird) {
  return bird.quiz.map((q, i) => {
    const entries = q.options.map((opt, j) => ({ opt, j }));
    entries.sort(() => Math.random() - 0.5);
    return {
      bird: bird.id,
      num: i,
      q: q.q,
      options: entries.map((e) => e.opt),
      reponse: entries.findIndex((e) => e.j === q.reponse),
    };
  });
}

/* ---- Surcharges éditables (admin-data.json) -------------------------
   Applique les modifications sauvegardées par l'éditeur (serveur ou god
   mode) sur les données de base. Mutate les structures SITE / TRAIL /
   BALISES / BIRDS / GUIDE.
   Supporte : modification, AJOUT (balises/découvertes absentes créés) et
   SUPPRESSION (removedBalises / removedBirds). Idempotent. */
function applyAdminData(admin) {
  if (!admin || typeof admin !== "object") return;

  /* --- 0) Suppressions --- */
  if (Array.isArray(admin.removedBirds)) {
    const gone = new Set(admin.removedBirds);
    for (let i = BIRDS.length - 1; i >= 0; i--) {
      if (gone.has(BIRDS[i].id)) BIRDS.splice(i, 1);
    }
    BALISES.forEach((b) => { if (gone.has(b.bird)) b.bird = ""; });
  }
  if (Array.isArray(admin.removedBalises)) {
    const gone = new Set(admin.removedBalises);
    for (let i = BALISES.length - 1; i >= 0; i--) {
      if (gone.has(BALISES[i].id)) BALISES.splice(i, 1);
    }
  }

  /* --- 1) Site (nom, rayon, centre, photos…) --- */
  if (admin.site && typeof admin.site === "object") {
    for (const k of Object.keys(admin.site)) {
      if (k === "center" && admin.site.center && typeof admin.site.center === "object") {
        if (admin.site.center.lat != null) SITE.center.lat = Number(admin.site.center.lat);
        if (admin.site.center.lng != null) SITE.center.lng = Number(admin.site.center.lng);
      } else if (SITE[k] !== undefined) {
        SITE[k] = admin.site[k];
      }
    }
  }
  if (admin.trail && typeof admin.trail === "object") {
    if (Array.isArray(admin.trail.path)) TRAIL.path = admin.trail.path;
    if (admin.trail.label) TRAIL.label = admin.trail.label;
  }
  if (admin.guide && typeof admin.guide === "object") {
    for (const id of Object.keys(admin.guide)) {
      const g = GUIDE.find((x) => x.id === id);
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
          id: id,
          nom: ov.nom || id,
          latin: ov.latin || "",
          emoji: ov.emoji || "🧠",
          couleur: ov.couleur || "#6a6a6a",
          categorie: ov.categorie || "diurne",
          taille: ov.taille || "?",
          img: ov.img || "",
          audioFile: ov.audioFile || null,
          anecdotes: Array.isArray(ov.anecdotes) ? ov.anecdotes.slice() : [],
          chant: ov.chant || null,
          quiz: Array.isArray(ov.quiz) ? ov.quiz.slice() : [],
        };
        BIRDS.push(bird);
      }
      for (const k of Object.keys(ov)) {
        if (k === "id") continue;
        if (k === "questions" && Array.isArray(ov.questions)) bird.quiz = ov.questions;
        else if (k === "anecdotes" && Array.isArray(ov.anecdotes)) bird.anecdotes = ov.anecdotes.slice();
        else if (k === "quiz" && Array.isArray(ov.quiz)) bird.quiz = ov.quiz.slice();
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
          id: id,
          bird: ov.bird || "",
          code: ov.code || "JDP-" + String(id).toUpperCase(),
          x: (ov.x != null && isFinite(Number(ov.x))) ? Number(ov.x) : 200,
          y: (ov.y != null && isFinite(Number(ov.y))) ? Number(ov.y) : 400,
          lat: (ov.lat != null && isFinite(Number(ov.lat))) ? Number(ov.lat) : SITE.center.lat,
          lng: (ov.lng != null && isFinite(Number(ov.lng))) ? Number(ov.lng) : SITE.center.lng,
          label: ov.label || id,
          hintImg: ov.hintImg || "",
          enigmes: {},
          enigme: ov.enigme || null,
        };
        BALISES.push(bal);
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
        } else if ((k === "x" || k === "y" || k === "lat" || k === "lng") && ov[k] != null && isFinite(Number(ov[k]))) {
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
        if (ov.q) { bird.quiz = [ov]; continue; }
        for (const k of Object.keys(ov)) {
          if (k === "questions" && Array.isArray(ov.questions)) bird.quiz = ov.questions;
          else bird[k] = ov[k];
        }
      }
    }
  }
}
