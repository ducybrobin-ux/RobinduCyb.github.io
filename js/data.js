/* =========================================================
   Curi🧭s — Données de jeu
   Découvertes du parcours, guide, balises, énigmes et quiz.
   NOTE : la variable interne BIRDS désigne les « découvertes »
   (un biais cognitif par balise) — nom conservé pour rester
   compatible avec l'éditeur et le serveur.
   Pour ajouter une photo : remplir `img` (chemin relatif).
   Pour ajouter un vrai son : remplir `audioFile` (chemin relatif)
   sinon une signature sonore synthétique (Web Audio) est jouée.
   ========================================================= */

/* ==== DÉBUT CONTENU GÉNÉRÉ — NE PAS ÉDITER ====
   Source de vérité : content/ (config + packs JSON modulaires).
   Packs actifs : phantom-cybersecurite
   Régénérer : node tools/build-data.mjs
   Vérifier la synchro : node tools/build-data.mjs --check ==== */

const SITE = {
  "name": "Jeu de piste",
  "short": "JDP",
  "region": "Parcours découverte",
  "mapTitle": "Le sentier des découvertes",
  "center": {
    "lat": 50.6314885,
    "lng": 3.0558956
  },
  "proximityRadius": 12,
  "hintRadius": 250,
  "photos": []
};

const TRAIL = {
  "path": [
    [
      36,
      552
    ],
    [
      48,
      500
    ],
    [
      74,
      452
    ],
    [
      110,
      428
    ],
    [
      148,
      400
    ],
    [
      176,
      356
    ],
    [
      200,
      308
    ],
    [
      238,
      292
    ],
    [
      282,
      296
    ],
    [
      320,
      320
    ],
    [
      356,
      352
    ],
    [
      388,
      396
    ],
    [
      406,
      448
    ],
    [
      392,
      500
    ],
    [
      366,
      540
    ],
    [
      330,
      556
    ]
  ],
  "label": "Sentier des découvertes"
};

const BIRDS = [
  {
    "type": "decouverte",
    "version": 1,
    "id": "alerte",
    "nom": "Le Message Suspect",
    "latin": "Social Engineering · Phishing",
    "emoji": "🚨",
    "couleur": "#e74c3c",
    "categorie": "diurne",
    "taille": "Antidote : ne jamais agir sous la pression",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Les attaquants créent un sentiment d'urgence pour court-circuiter ta réflexion.",
      "Un message qui te pousse à agir « maintenant » est presque toujours suspect.",
      "La première règle : une urgence n'est jamais une preuve de légitimité."
    ],
    "chant": {
      "tempo": 120,
      "notes": [
        {
          "f": 440,
          "fEnd": 440,
          "d": 0.1,
          "g": 0.05,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 520,
          "fEnd": 520,
          "d": 0.1,
          "g": 0.05,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 660,
          "fEnd": 660,
          "d": 0.15,
          "g": 0.1,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 10,
      "objectif": "Identifier les techniques de manipulation dans les messages suspects",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Quel est le premier réflexe face à un message urgent ?",
        "options": [
          "Cliquer immédiatement",
          "Vérifier l'expéditeur et le contenu",
          "Transmettre à un ami",
          "Ignorer"
        ],
        "reponse": 1
      },
      {
        "q": "Une urgence dans un message prouve-t-elle qu'il est légitime ?",
        "options": [
          "Oui toujours",
          "Non, c'est souvent une manipulation",
          "Parfois",
          "Seulement si c'est de la banque"
        ],
        "reponse": 1
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "phishing",
    "nom": "Le Phishing",
    "latin": "Phishing · Hameçonnage",
    "emoji": "🎣",
    "couleur": "#3498db",
    "categorie": "diurne",
    "taille": "Antidote : toujours vérifier l'URL",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Le phishing utilise de faux sites qui ressemblent aux vrais pour voler tes identifiants.",
      "Le cadenas (HTTPS) ne suffit pas : il faut vérifier le nom de domaine.",
      "Un vrai site ne te demandera jamais ton mot de passe par message."
    ],
    "chant": {
      "tempo": 110,
      "notes": [
        {
          "f": 330,
          "fEnd": 330,
          "d": 0.12,
          "g": 0.06,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 440,
          "fEnd": 440,
          "d": 0.12,
          "g": 0.06,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 550,
          "fEnd": 550,
          "d": 0.1,
          "g": 0.15,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 12,
      "objectif": "Identifier les fausses pages de connexion et comprendre le mécanisme du phishing",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Qu'est-ce qui identifie un site de phishing ?",
        "options": [
          "Le cadenas vert",
          "L'URL incorrecte",
          "Le design moderne",
          "La vitesse du site"
        ],
        "reponse": 1
      },
      {
        "q": "Que donner à un site suspect qui te demande ton mot de passe ?",
        "options": [
          "Ton vrai mot de passe",
          "Un mot de passe faux",
          "Rien du tout",
          "Ton email"
        ],
        "reponse": 2
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "qr-piege",
    "nom": "Le QR Code Piégé",
    "latin": "QR Code · Redirection",
    "emoji": "📷",
    "couleur": "#9b59b6",
    "categorie": "diurne",
    "taille": "Antidote : inspecter avant de scanner",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Un QR code peut mener n'importe où : un site officiel ou un piège.",
      "PHANTOM ne te force jamais à scanner. Il te pousse à le faire sans réfléchir.",
      "La règle d'or : inspecter la destination avant de faire confiance."
    ],
    "chant": {
      "tempo": 100,
      "notes": [
        {
          "f": 392,
          "fEnd": 392,
          "d": 0.1,
          "g": 0.08,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 523,
          "fEnd": 523,
          "d": 0.1,
          "g": 0.08,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 659,
          "fEnd": 659,
          "d": 0.12,
          "g": 0.12,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 10,
      "objectif": "Comprendre les risques des QR codes et inspecter avant de scanner",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Que faire AVANT de scanner un QR code inconnu ?",
        "options": [
          "Le scanner directement",
          "Vérifier l'URL affichée",
          "Demander à un ami",
          "Tourner le téléphone"
        ],
        "reponse": 1
      },
      {
        "q": "Un QR code peut-il mener vers un site malveillant ?",
        "options": [
          "Non jamais",
          "Oui c'est possible",
          "Seulement si on le fabrique",
          "Seulement sur Android"
        ],
        "reponse": 1
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "traces",
    "nom": "Les Traces Numériques",
    "latin": "Metadata · EXIF · OSINT",
    "emoji": "📍",
    "couleur": "#e67e22",
    "categorie": "diurne",
    "taille": "Antidote : minimiser les traces laissées",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Une photo contient des métadonnées invisibles : date, heure, lieu, appareil.",
      "Les métadonnées EXIF peuvent révéler beaucoup plus que ce qu'on montre.",
      "Ce qu'on peut savoir n'est pas toujours ce qu'on devrait utiliser."
    ],
    "chant": {
      "tempo": 95,
      "notes": [
        {
          "f": 294,
          "fEnd": 294,
          "d": 0.12,
          "g": 0.06,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 392,
          "fEnd": 392,
          "d": 0.12,
          "g": 0.06,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 494,
          "fEnd": 494,
          "d": 0.15,
          "g": 0.1,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 10,
      "objectif": "Comprendre les métadonnées et leur impact sur la vie privée",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Que contiennent les métadonnées d'une photo ?",
        "options": [
          "Rien de spécial",
          "Date, heure, lieu, appareil",
          "Uniquement la taille",
          "Le mot de passe du téléphone"
        ],
        "reponse": 1
      },
      {
        "q": "Une information disponible est-forcément une information à utiliser ?",
        "options": [
          "Oui toujours",
          "Non, ça dépend du contexte",
          "Seulement en ligne",
          "Seulement pour la police"
        ],
        "reponse": 1
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "permissions",
    "nom": "Les Permissions",
    "latin": "Privacy · Permissions · Moindre Privilège",
    "emoji": "📱",
    "couleur": "#1abc9c",
    "categorie": "diurne",
    "taille": "Antidote : donner le minimum nécessaire",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "La sécurité n'est pas tout autoriser ou tout interdire. C'est donner le bon accès, au bon moment.",
      "Le principe du moindre privilège : seulement ce qui est nécessaire.",
      "Refuser toutes les permissions peut casser le fonctionnement d'une application."
    ],
    "chant": {
      "tempo": 105,
      "notes": [
        {
          "f": 330,
          "fEnd": 330,
          "d": 0.1,
          "g": 0.07,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 415,
          "fEnd": 415,
          "d": 0.1,
          "g": 0.07,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 523,
          "fEnd": 523,
          "d": 0.12,
          "g": 0.1,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 10,
      "objectif": "Comprendre les permissions et le principe du moindre privilège",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Quelle est la meilleure approche pour les permissions ?",
        "options": [
          "Tout autoriser",
          "Tout refuser",
          "Donner le minimum nécessaire",
          "Demander à un adulte"
        ],
        "reponse": 2
      },
      {
        "q": "Pourquoi une application a-t-elle besoin de permissions ?",
        "options": [
          "Pour espionner",
          "Pour fonctionner correctement",
          "Pour vendre tes données",
          "Pour ralentir ton téléphone"
        ],
        "reponse": 1
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "mots-de-passe",
    "nom": "Les Mots de Passe",
    "latin": "Passphrase · Hashing · Brute Force",
    "emoji": "🔐",
    "couleur": "#2ecc71",
    "categorie": "diurne",
    "taille": "Antidote : utiliser une phrase secrète",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "La longueur est plus importante que la complexité.",
      "Une passphrase (phrase secrète) est à la fois mémorisable et difficile à craquer.",
      "Ne jamais utiliser son nom + année de naissance."
    ],
    "chant": {
      "tempo": 115,
      "notes": [
        {
          "f": 262,
          "fEnd": 262,
          "d": 0.1,
          "g": 0.05,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 330,
          "fEnd": 330,
          "d": 0.1,
          "g": 0.05,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 392,
          "fEnd": 392,
          "d": 0.15,
          "g": 0.1,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 10,
      "objectif": "Comprendre les principes d'un mot de passe sûr",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Qu'est-ce qui rend un mot de passe sûr ?",
        "options": [
          "Uniquement les majuscules",
          "La longueur et la variété",
          "Uniquement les chiffres",
          "Le nom de famille"
        ],
        "reponse": 1
      },
      {
        "q": "Pourquoi « MonChien » est un mauvais mot de passe ?",
        "options": [
          "Trop court",
          "Trop commun",
          "Pas de chiffres",
          "Toutes ces réponses"
        ],
        "reponse": 3
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "identite",
    "nom": "L'Identité Numérique",
    "latin": "OSINT · Identité · Puzzle",
    "emoji": "🧬",
    "couleur": "#9b59b6",
    "categorie": "diurne",
    "taille": "Antidote : minimiser le partage d'informations",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Chaque information publique est un puzzle qui peut être assemblé.",
      "On n'a pas besoin d'un mot de passe pour en savoir beaucoup sur quelqu'un.",
      "L'OSINT utilise les données publiques pour reconstituer une identité."
    ],
    "chant": {
      "tempo": 100,
      "notes": [
        {
          "f": 349,
          "fEnd": 349,
          "d": 0.1,
          "g": 0.06,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 440,
          "fEnd": 440,
          "d": 0.1,
          "g": 0.06,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 523,
          "fEnd": 523,
          "d": 0.12,
          "g": 0.1,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 10,
      "objectif": "Comprendre comment les informations personnelles peuvent être utilisées",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Avec quelles informations peut-on retrouver quelqu'un ?",
        "options": [
          "Uniquement avec le nom",
          "Nom + ville + école",
          "Uniquement avec la photo",
          "Aucune info ne suffit"
        ],
        "reponse": 1
      },
      {
        "q": "Qu'est-ce que l'OSINT ?",
        "options": [
          "Un type de virus",
          "Du renseignement à partir de sources publiques",
          "Un réseau social",
          "Un logiciel de sécurité"
        ],
        "reponse": 1
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "reseau",
    "nom": "Le Réseau Wi-Fi",
    "latin": "Wi-Fi · HTTPS · VPN",
    "emoji": "📡",
    "couleur": "#34495e",
    "categorie": "diurne",
    "taille": "Antidote : vérifier et sécuriser la connexion",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "Un réseau Wi-Fi ouvert n'est pas forcément malveillant, mais il faut rester vigilant.",
      "HTTPS chiffre les données entre ton navigateur et le site.",
      "Un VPN peut protéger ta connexion sur un réseau public."
    ],
    "chant": {
      "tempo": 108,
      "notes": [
        {
          "f": 294,
          "fEnd": 294,
          "d": 0.12,
          "g": 0.05,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 370,
          "fEnd": 370,
          "d": 0.12,
          "g": 0.05,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 440,
          "fEnd": 440,
          "d": 0.1,
          "g": 0.12,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 10,
      "objectif": "Comprendre les risques des réseaux Wi-Fi publics",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Un réseau Wi-Fi gratuit est-il forcément sûr ?",
        "options": [
          "Oui toujours",
          "Non, il faut rester vigilant",
          "Seulement le matin",
          "Seulement avec un iPhone"
        ],
        "reponse": 1
      },
      {
        "q": "Que signifie le cadenas dans la barre d'adresse ?",
        "options": [
          "Le site est officiel",
          "La connexion est chiffrée (HTTPS)",
          "Le site est rapide",
          "Le site est français"
        ],
        "reponse": 1
      }
    ]
  },
  {
    "type": "decouverte",
    "version": 1,
    "id": "phantom",
    "nom": "PHANTOM",
    "latin": "Ingénierie Sociale · Vulnérabilité Humaine",
    "emoji": "👻",
    "couleur": "#1a1a2e",
    "categorie": "diurne",
    "taille": "Antidote : esprit critique et réflexion",
    "img": "",
    "audioFile": null,
    "anecdotes": [
      "PHANTOM n'est pas un pirate informatique. C'est un protocole automatisé qui exploite les erreurs humaines.",
      "Le véritable ennemi n'est pas la technologie, c'est l'imprévoyance.",
      "PHANTOM n'est pas dans votre téléphone. PHANTOM est dans les décisions que vous prenez lorsque quelqu'un vous pousse à agir trop vite."
    ],
    "chant": {
      "tempo": 90,
      "notes": [
        {
          "f": 220,
          "fEnd": 220,
          "d": 0.15,
          "g": 0.08,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 277,
          "fEnd": 277,
          "d": 0.15,
          "g": 0.08,
          "type": "sine",
          "v": 0.5
        },
        {
          "f": 330,
          "fEnd": 330,
          "d": 0.2,
          "g": 0.15,
          "type": "sine",
          "v": 0.4
        }
      ]
    },
    "pedagogie": {
      "ages": [
        12,
        18
      ],
      "duree_min": 15,
      "objectif": "Comprendre que la sécurité informatique repose sur les décisions humaines",
      "programme": [
        "cycle 4",
        "lycée"
      ]
    },
    "quiz": [
      {
        "q": "Qui est PHANTOM ?",
        "options": [
          "Un pirate humain",
          "Un protocole automatisé",
          "Un virus informatique",
          "Un agent secret"
        ],
        "reponse": 1
      },
      {
        "q": "Où se trouve真正的 PHANTOM ?",
        "options": [
          "Dans un ordinateur",
          "Dans les décisions que nous prenons",
          "Sur Internet",
          "Dans un centre de données"
        ],
        "reponse": 1
      }
    ]
  }
];

const GUIDE = [
  {
    "type": "guide",
    "version": 1,
    "id": "ingenerie-sociale",
    "nom": "L'ingénierie sociale",
    "description": "Techniques utilisées par les attaquants pour manipuler les humains plutôt que d'attaquer les ordinateurs.",
    "pedagogie": {
      "objectif": "Comprendre comment les humains peuvent être manipulés",
      "ages": [
        12,
        18
      ],
      "duree_min": 8
    }
  },
  {
    "type": "guide",
    "version": 1,
    "id": "osint",
    "nom": "Le renseignement d'ouverture",
    "description": "L'OSINT utilise les données publiques pour reconstituer des informations sur une personne ou une organisation.",
    "pedagogie": {
      "objectif": "Comprendre que les données publiques peuvent être utilisées pour reconstituer une identité",
      "ages": [
        14,
        18
      ],
      "duree_min": 10
    }
  },
  {
    "type": "guide",
    "version": 1,
    "id": "chiffrement",
    "nom": "Le chiffrement",
    "description": "Le chiffrement protège les données en les rendant illisibles sans la clé de déchiffrement.",
    "pedagogie": {
      "objectif": "Comprendre le rôle du chiffrement dans la sécurité",
      "ages": [
        14,
        18
      ],
      "duree_min": 8
    }
  },
  {
    "type": "guide",
    "version": 1,
    "id": " phishing-avance",
    "nom": "Le phishing avancé",
    "description": "Techniques sophistiquées : spear phishing, whaling, BEC (Business Email Compromise).",
    "pedagogie": {
      "objectif": "Reconnaître les formes avancées de phishing",
      "ages": [
        16,
        18
      ],
      "duree_min": 10
    }
  }
];

const BALISES = [
  {
    "type": "balise",
    "version": 1,
    "id": "B1",
    "bird": "alerte",
    "code": "PH-B1",
    "lat": 50.3110118,
    "lng": 3.3298823,
    "label": "Le Message",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Tu reçois 3 notifications. Laquelle est la plus suspecte ?\nA : « Votre compte nécessite une vérification. Cliquez ici immédiatement. »\nB : « Votre administrateur vous demande de confirmer votre identité. Rendez-vous dans l'application. »\nC : « ALERTE !! Votre téléphone sera supprimé dans 5 minutes !!! »",
        "reponses": [
          "C",
          "la C",
          "la troisième",
          "la troisième notification",
          "ALERTE"
        ],
        "indice": "Regarde le ton : menace, ponctuation excessive, urgence.",
        "saviez": "L'ingénierie sociale utilise la peur et l'urgence pour te faire agir sans réfléchir.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Quel élément rend un message suspect ?\nA : L'urgence artificielle\nB : Le nom de l'expéditeur\nC : L'heure d'envoi",
        "reponses": [
          "A",
          "l'urgence artificielle",
          "l'urgence",
          "l'urgence artificielle"
        ],
        "indice": "Un message qui te pousse à agir « maintenant » est presque toujours suspect.",
        "saviez": "Les attaquants créent un sentiment d'urgence pour court-circuiter ta réflexion.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Identifie les 3 techniques de manipulation utilisées dans un message de phishing classique.",
        "reponses": [
          "urgence, autorité, peur",
          "urgence autorité peur",
          "peur autorité urgence",
          "urgence, peur, autorité"
        ],
        "indice": "Pense à ce que le message te fait ressentir : pression, menace, obligation.",
        "saviez": "Les 3 piliers du phishing : l'autorité (qui parle), l'urgence (agis vite), la peur (conséquences).",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 74,
    "y": 452
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B2",
    "bird": "phishing",
    "code": "PH-B2",
    "lat": 50.3115907,
    "lng": 3.3300398,
    "label": "Le Piège",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Tu vois une page de connexion bancaire. L'adresse est « secure-curos-login.com ». C'est fiable ?",
        "reponses": [
          "non",
          "non c'est faux",
          "c'est un faux",
          "faux",
          "non c'est pas fiable",
          "non fiable"
        ],
        "indice": "Compare le nom de domaine avec le vrai nom du service.",
        "saviez": "Les pirates créent des noms de domaine qui ressemblent aux vrais pour te tromper.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Un site te demande ton mot de passe. Que dois-tu vérifier EN PREMIER ?",
        "reponses": [
          "l'adresse du site",
          "l'URL",
          "le nom de domaine",
          "l'adresse URL"
        ],
        "indice": "Regarde la barre d'adresse : est-ce le bon site ?",
        "saviez": "Le cadenas (HTTPS) ne suffit pas : il faut aussi vérifier le nom de domaine.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "On te donne 3 domaines : secure-curos-login.com, curios-security.example, curios.local. Lequel est le plus probablement un piège ?",
        "reponses": [
          "secure-curos-login.com",
          "le premier",
          "secure-curos-login"
        ],
        "indice": "Un vrai site n'a pas besoin de mots comme « secure » ou « login » dans son adresse.",
        "saviez": "Les pirates ajoutent des mots rassurants (secure, login, verify) pour tromper.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 110,
    "y": 428
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B3",
    "bird": "qr-piege",
    "code": "PH-B3",
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "Le QR Code Piégé",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Tu trouves un QR code sur un mur. Que dois-tu faire AVANT de le scanner ?",
        "reponses": [
          "vérifier",
          "analyser",
          "regarder",
          "inspector",
          "vérifier le code",
          "analyser le code"
        ],
        "indice": "Un QR code peut mener n'importe où : vérifie d'abord.",
        "saviez": "PHANTOM ne te force jamais à scanner. Il te pousse à le faire sans réfléchir.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Un QR code contient l'URL « https://curios.local@phantom... ». Que remarques-tu ?",
        "reponses": [
          "l'URL est modifiée",
          "il y a un @",
          "l'adresse est différente",
          "phantom"
        ],
        "indice": "Le symbole @ dans une URL peut cacher une redirection.",
        "saviez": "Le format URL peut être manipulé pour rediriger vers un autre site.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Quelle est la règle d'or concernant les QR codes inconnus ?",
        "reponses": [
          "ne jamais scanner sans vérifier",
          "toujours vérifier avant",
          "ne pas scanner aveuglément",
          "vérifier l'URL avant de scanner"
        ],
        "indice": "Le QR code est un raccourci : il peut aussi être un piège.",
        "saviez": "PHANTOM ne te force jamais à cliquer. Il te pousse à cliquer.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 148,
    "y": 400
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B4",
    "bird": "traces",
    "code": "PH-B4",
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "Les Traces",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Tu reçois une photo. Que peut révéler une simple photographie ?\nA : La date et l'heure\nB : La localisation\nC : L'appareil utilisé\nD : Toutes ces réponses",
        "reponses": [
          "D",
          "toutes ces réponses",
          "toutes",
          "tout"
        ],
        "indice": "Une photo contient plus d'informations que ce qu'on voit.",
        "saviez": "Les métadonnées EXIF d'une photo peuvent révéler date, heure, lieu, appareil.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "On appelle « métadonnées » les informations cachées dans un fichier. Quelles métadonnées une photo peut-elle contenir ?",
        "reponses": [
          "date, heure, lieu, appareil",
          "date heure lieu appareil",
          "lieu date appareil",
          "metadata"
        ],
        "indice": "Pense à tout ce que l'appareil enregistre automatiquement.",
        "saviez": "Les métadonnées sont invisibles mais accessibles à quiconque sait où regarder.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Quel principe éthique relie cybersécurité et respect de la vie privée concernant les métadonnées ?",
        "reponses": [
          "une information disponible n'est pas forcément à utiliser",
          "pas parce qu'on peut on doit",
          "respect de la vie privée",
          "limitation"
        ],
        "indice": "Ce qu'on peut savoir n'est pas toujours ce qu'on devrait utiliser.",
        "saviez": "La cybersécurité rejoint l'éthique : la技术能力 ne justifie pas l'usage.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 186,
    "y": 356
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B5",
    "bird": "permissions",
    "code": "PH-B5",
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "Le Téléphone Vous Trahit",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Une application demande l'accès à ta localisation. Laquelle de ces options est la plus sûre ?\nA : Toujours\nB : Pendant l'utilisation\nC : Refuser",
        "reponses": [
          "B",
          "pendant l'utilisation",
          "pendant l'utilisation de l'application"
        ],
        "indice": "Donne le minimum nécessaire, le minimum de temps.",
        "saviez": "La sécurité n'est pas tout autoriser ou tout interdire. C'est donner le bon accès, au bon moment.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Pourquoi « Refuser toutes les permissions » n'est pas toujours la meilleure solution ?",
        "reponses": [
          "certaines apps en ont besoin",
          "ça peut casser le fonctionnement",
          "pas toujours adapté"
        ],
        "indice": "Certaines applications ont besoin de permissions pour fonctionner.",
        "saviez": "L'équilibre entre sécurité et fonctionnalité est la clé.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Quel principe guide le choix des permissions sur un smartphone ?",
        "reponses": [
          "le minimum nécessaire",
          "principe du moindre privilège",
          "donner le moins possible",
          "minimum vital"
        ],
        "indice": "Le principe du moindre privilège : seulement ce qui est nécessaire.",
        "saviez": "En sécurité informatique, on donne le minimum de permissions nécessaires au fonctionnement.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 212,
    "y": 308
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B6",
    "bird": "mots-de-passe",
    "code": "PH-B6",
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "Le Coffre Numérique",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Lequel de ces mots de passe est le plus sûr ?\nA : Lucas2009\nB : Mon-Chien-Mange-7-Pizzas!\nC : Azerty123",
        "reponses": [
          "B",
          "le deuxième",
          "Mon-Chien-Mange-7-Pizzas!",
          "Mon-Chien-Mange-7-Pizzas"
        ],
        "indice": "Un mot de passe long et avec des caractères variés est plus sûr.",
        "saviez": "La longueur est plus importante que la complexité. Une phrase est plus sûre qu'un mot.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Pourquoi « Lucas2009 » est un mauvais mot de passe ?",
        "reponses": [
          "prédicible",
          "contient une année",
          "nom + année",
          "facile à deviner",
          "trop court"
        ],
        "indice": "Combien de personnes utilisent leur nom + année de naissance ?",
        "saviez": "Les pirates testent d'abord les combinaisons les plus courantes : nom + année.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Quelle est la meilleure stratégie pour créer un mot de passe mémorisable et sûr ?",
        "reponses": [
          "phrase secrète",
          "passphrase",
          "phrase aléatoire",
          "3 mots aléatoires"
        ],
        "indice": "Pense à une phrase que toi seul connais, avec des mots aléatoires.",
        "saviez": "Une passphrase (phrase secrète) est à la fois mémorisable et difficile à craquer.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 250,
    "y": 292
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B7",
    "bird": "identite",
    "code": "PH-B7",
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "L'Identité Numérique",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "On te donne une fausse identité : Léa, 16 ans, photo, ville, sport, école. Quelle info permet de retrouver son établissement ?",
        "reponses": [
          "l'école",
          "le nom de l'école",
          "l'établissement",
          "école"
        ],
        "indice": "Le nom de l'école suffit à la localiser.",
        "saviez": "Une identité numérique se construit pièce par pièce : chaque info rétrécit l'anonymat.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Avec le nom d'une ville, le sport pratiqué et une photo d'école, que peut-on déduire ?",
        "reponses": [
          "l'identité",
          "qui c'est",
          "l'établissement",
          "la personne"
        ],
        "indice": "Croise les informations : ville + école = identité.",
        "saviez": "L'OSINT (renseignement d'ouverture) utilise les données publiques pour reconstituer une identité.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Quel est le risque principal de partager beaucoup d'informations personnelles en ligne ?",
        "reponses": [
          "reconstruction de l'identité",
          "usurpation",
          "harcèlement",
          "vol d'identité",
          "traque"
        ],
        "indice": "Chaque information publique est un puzzle qui peut être assemblé.",
        "saviez": "On n'a pas besoin d'un mot de passe pour en savoir beaucoup sur quelqu'un.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 320,
    "y": 296
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B8",
    "bird": "reseau",
    "code": "PH-B8",
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "Le Réseau",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Tu vois 3 réseaux Wi-Fi : CURIOS-WIFI, CURIOS-GUEST, PHANTOM_FREE_WIFI. Lequel est le plus suspect ?",
        "reponses": [
          "PHANTOM_FREE_WIFI",
          "le troisième",
          "PHANTOM"
        ],
        "indice": "Un réseau avec un nom accrocheur et gratuit est souvent suspect.",
        "saviez": "Un réseau Wi-Fi ouvert n'est pas forcément malveillant, mais un réseau inconnu ne doit pas être considéré comme fiable.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Qu'est-ce que le HTTPS ?",
        "reponses": [
          "une connexion sécurisée",
          "un protocole sécurisé",
          "chiffrement",
          "protection"
        ],
        "indice": "C'est ce qui active le cadenas dans la barre d'adresse.",
        "saviez": "HTTPS chiffre les données entre ton navigateur et le site. Sans HTTPS, tout est en clair.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Un réseau Wi-Fi public peut-il être utilisé en toute sécurité ?",
        "reponses": [
          "oui avec précautions",
          "avec un VPN",
          "jamais en toute sécurité",
          "ça dépend"
        ],
        "indice": "La réponse n'est pas binaire : il y a des précautions à prendre.",
        "saviez": "Un VPN, le HTTPS et la mise à jour sont les protections de base sur un réseau public.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 356,
    "y": 352
  },
  {
    "type": "balise",
    "version": 1,
    "id": "B9",
    "bird": "phantom",
    "code": "PH-B9",
    "lat": 48.8566,
    "lng": 2.3522,
    "label": "PHANTOM",
    "hintImg": "",
    "enigmes": {
      "facile": {
        "text": "Qui est PHANTOM ?\nA : Un pirate informatique\nB : Un protocole automatisé\nC : Un virus",
        "reponses": [
          "B",
          "un protocole",
          "un protocole automatisé",
          "le protocole"
        ],
        "indice": "PHANTOM n'est pas une personne...",
        "saviez": "PHANTOM exploite les erreurs humaines, pas les failles informatiques.",
        "ages": [
          12,
          14
        ]
      },
      "moyen": {
        "text": "Pourquoi dit-on que PHANTOM est « dans les décisions que vous prenez » ?",
        "reponses": [
          "parce que c'est l'humain qui décide",
          "c'est nos erreurs",
          "la vulnérabilité humaine",
          "nos choix"
        ],
        "indice": "L'ordinateur ne se fait pas pirater. C'est l'utilisateur qui est manipulé.",
        "saviez": "L'ingénierie sociale exploite la confiance, l'urgence et la peur.",
        "ages": [
          14,
          16
        ]
      },
      "difficile": {
        "text": "Quelle est la leçon principale de l'opération PHANTOM ?",
        "reponses": [
          "la sécurité est dans nos décisions",
          "réfléchir avant d'agir",
          "ne pas se faire manipuler",
          "l'esprit critique"
        ],
        "indice": "Le véritable ennemi n'est pas la技术, c'est la imprévoyance.",
        "saviez": "PHANTOM n'est pas dans votre téléphone. PHANTOM est dans les décisions que vous prenez lorsque quelqu'un vous pousse à agir trop vite.",
        "ages": [
          16,
          18
        ]
      }
    },
    "enigme": null,
    "x": 388,
    "y": 448
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

/* ---- Moteur de jeu externalisé ----
 * normalize, checkAnswer, makeQuiz, getEnigme vivent désormais dans
 * packages/game-engine/src/ (importables en Node.js, testables).
 * js/engine.js (généré par tools/build-engine.mjs) expose ces fonctions
 * via window.CURIOS_ENGINE.
 */
const { normalize, checkAnswer, makeQuiz, getEnigme } = window.CURIOS_ENGINE;

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
          code: ov.code || `JDP-${  String(id).toUpperCase()}`,
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
