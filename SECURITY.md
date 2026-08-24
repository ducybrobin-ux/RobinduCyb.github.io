# Security Policy

## Menaces connues héritées (dette à traiter)

1. **Aucune authentification `/api`** : via un tunnel public, quiconque connaît l'URL
   peut kicker une équipe, valider une balise ou déclencher une urgence.
   → Traité à l'étape ROADMAP #8 (token session organisateur).
2. Serveur mono-thread PowerShell : DoS trivial par requêtes concurrentes.
3. Télémétrie familles : données minimales mais sensibles → optionnelle, purgeable.

## Principes du projet

- **Sécurité par minimisation** : pseudonymes, sessions temporaires, aucune donnée
  personnelle inutile ; tout reste local sauf choix explicite.
- Offline-first : aucune dépendance service externe obligatoire.
- Le serveur ne doit jamais être exposé directement sur Internet sans tunnel
  maîtrisé + authentification.

## Signaler une vulnérabilité

Ouvrir une issue GitHub en évitant les détails exploitables publics, ou contacter
le mainteneur directement. Correctif documenté dans CHANGELOG.
