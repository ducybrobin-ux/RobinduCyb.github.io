# Contribuer à DUCYB

## Règle d'or

**Évolution, pas révolution.** Chaque contribution est une étape limitée,
testée et documentée (voir [docs/ROADMAP.md](docs/ROADMAP.md)).

## Workflow par étape

1. Expliquer ce qui va être modifié et pourquoi
2. Lister les fichiers concernés
3. Modification limitée au périmètre annoncé
4. Tester (`npm test` dès PHASE 3 ; `node tools/build-data.mjs --check` pour le contenu)
5. Vérifier la non-régression
6. Documenter (CHANGELOG + doc concernée)
7. Étape suivante uniquement après validation

## Interdits

- Réécriture massive non planifiée dans la ROADMAP
- Dépendance nécessitant Internet en temps de jeu
- Code d'IA sans revue humaine (l'IA n'intervient jamais dans le chemin d'exécution)
- Verrouillage fournisseur (cartes, hébergement…)
- Fusionner plusieurs étapes de la ROADMAP en une PR

## Style

- Modules ES purs sans DOM dans `packages/*`
- JSDoc sur toute fonction exportée
- Français pour la doc, anglais acceptable pour les identifiants de code
- Un commit = une intention ; message concis et descriptif

## Licence

Toute contribution est sous AGPL-3.0 (code) / CC BY-SA (doc et contenus pédagogiques).
