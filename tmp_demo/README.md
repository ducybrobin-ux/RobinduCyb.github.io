# packDemo — Curi🧭s

Pack de démonstration « Le GRAND DEMO PACK : France, Outre-mer & Smartphone ».

## Contenu
- 24 balises/POI métropole + Outre-mer
- 25 missions multi-matières
- scénario fil rouge
- humour et personnages
- GPS, boussole/magnétomètre, accéléromètre, gyroscope, orientation, caméra, micro, audio, luminosité, vibration, batterie, chronomètre et hors-ligne
- alternatives QR / manuel pour les appareils non équipés
- badges et débriefing
- illustrations SVG locales

## Important
Le schéma Curi🧭s v1 permet de conserver des champs d'extension inconnus, mais le dépôt actuel documente explicitement GPS/QR/manuel et l'architecture PWA/offline. Les capteurs supplémentaires décrits ici constituent donc la spécification fonctionnelle du GRAND DEMO PACK ; il faut ajouter les handlers côté moteur/client pour obtenir une exploitation matérielle réelle de chaque capteur.

## Intégration
Copier `packDemo.json` dans `content/packs/packDemo/` ou dans le répertoire de parcours prévu par la version du dépôt, puis lancer la validation du projet :
`node tools/validate-parcours.mjs`
