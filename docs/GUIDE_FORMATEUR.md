# Guide Formateur — Organiser une session Curi🧭s

Ce guide explique comment préparer, lancer et animer une session de parcours éducatif avec Curi🧭s.

---

## 1. Préparation (1-2 semaines avant)

### 1.1 Choisir le parcours

| Parcours | Thème | Durée | Public |
|----------|-------|-------|--------|
| **Biais cognitifs** | Sciences humaines | 90-120 min | 10-16 ans |
| **CEMÉA NPDC** | Éducation populaire | 60-90 min | 8-14 ans |
| **Cristaux de Balto** | Nature / animaux | 60-90 min | 6-12 ans |
| **TSLE1 ornithologie** | Sciences naturelles | 90-120 min | 10-16 ans |

**Conseil** : testez le parcours vous-même avant de l'animer. Utilisez le mode « Joueur » sur votre téléphone.

### 1.2 Préparer le matériel

| Matériel | Quantité | Usage |
|----------|----------|-------|
| **Smartphone** par équipe | 1 minimum | Appareil de jeu |
| **Routeur Wi-Fi** portable | 1 | Réseau local (sans Internet) |
| **Ordinateur** (laptop/RPi) | 1 | Serveur + dashboard |
| **Imprimante** | 1 optionnel | QR codes, cartes |
| **Crayons + cahiers** | 1 par équipe | Énigmes papier de secours |
| **Kit de premiers secours** | 1 | Sécurité |

### 1.3 Tester l'infrastructure

```bash
# 1. Lancer le serveur
node packages/server

# 2. Vérifier le dashboard
# → http://localhost:8080/dashboard.html

# 3. Scanner le QR code d'accès
# → Vérifier que le jeu se charge

# 4. Vérifier le mode hors-ligne
# → Couper le Wi-Fi, recharger la page
```

### 1.4 Créer les équipes (optionnel)

Vous pouvez pré-créer les équipes via le dashboard ou laisser les participants en créer.

**Recommandation** : 2-5 participants par équipe, mixte âge/niveau.

---

## 2. Jour J — Mise en place

### 2.1 Installation (30 min avant)

1. **Brancher l'ordinateur** et lancer le serveur
2. **Configurer le routeur Wi-Fi** (SSID + mot de passe notés)
3. **Vérifier le dashboard** : les équipes apparaissent
4. **Imprimer les QR codes** d'accès Wi-Fi (si besoin)
5. **Préparer les consignes** de sécurité

### 2.2 Accueil des participants (15 min)

1. **Présenter le parcours** : thème, objectifs, durée
2. **Expliquer les règles** :
   - Comment scanner les QR codes
   - Comment répondre aux énigmes
   - Le système d'étoiles (1-3 par balise)
   - Les indices disponibles (3 niveaux)
3. **Former les chefs d'équipe** : 2 min de démonstration
4. **Distribuer les smartphones** (si fournis)

### 2.3 Lancement (5 min)

1. Les équipes scannent le QR code d'accès
2. Elles choisissent un nom d'équipe
3. Le dashboard affiche les équipes connectées
4. **Go !**

---

## 3. Pendant la session

### 3.1 Rôle de l'animateur

| Tâche | Outils | Fréquence |
|-------|--------|-----------|
| **Surveiller les équipes** | Dashboard | Permanent |
| **Gérer les blocages** | Mode validateur | À la demande |
| **Envoyer des messages** | Tableau d'annonces | Toutes les 15 min |
| **Gérer les urgences** | Alerte urgence | Si besoin |
| **Valider les validations** | Dashboard | En temps réel |

### 3.2 Gérer les blocages

Si une équipe stagne sur une balise :

1. **Vérifier le dashboard** : combien de tentatives ?
2. **Envoyer un indice** (si le système ne l'a pas fait)
3. **Valider manuellement** (si l'énigme est trop difficile)
4. **Proposer une aide** en personne (dernier recours)

### 3.3 Envoyer des messages

Via le dashboard, vous pouvez envoyer :
- Des indices généraux
- Des encouragements
- Des informations complémentaires
- Des alertes météo/sécurité

### 3.4 Gérer les urgences

1. Un participant signale un problème (bouton urgence dans l'app)
2. Le dashboard affiche l'alerte avec la localisation
3. **Se rendre sur place** si nécessaire
4. **Résoudre l'urgence** via le dashboard

---

## 4. Fin de session

### 4.1 Clôturer le jeu

1. **Annoncer la fin** (10 min avant : signal clair)
2. **Bloquer les nouvelles validations** (optionnel)
3. **Exporter les résultats** via le dashboard

### 4.2 Débriefing (15-20 min)

1. **Résultats** : podium des équipes
2. **Réponses** : parcours des balises avec les bonnes réponses
3. **Échanges** : qu'avez-vous appris ?
4. **Feedback** : questionnaire court (optionnel)

### 4.3 Nettoyage

1. **Arrêter le serveur**
2. **Sauvegarder les données** (fichiers JSON)
3. **Rendre le matériel**

---

## 5. Conseils pratiques

### Adapter au terrain

| Situation | Adaptation |
|-----------|------------|
| **Pas de Wi-Fi** | Mode hors-ligne, QR codes imprimés |
| **Peu de smartphones** | Équipes de 4-5, rotations |
| **Météo mauvaise** | Parcours intérieur possible |
| **Âges mélangés** | Équipes hétérogènes, indices adaptés |
| **Handicap** | Alternative GPS → QR → manuel |

### Erreurs courantes

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| Pas testé le parcours | Énigmes incompréhensibles | Toujours tester avant |
| Mauvaise connexion Wi-Fi | Frustration | Test de couverture |
| Trop peu de temps | Parcours incomplet | Réduire le nombre de balises |
| Pas de plan B | Panique si panne | Prévoir des activités papier |

### Sécurité

- **Espace délimité** : balises dans une zone sûre
- **Interdiction de circuler** : rester dans la zone définie
- **Kit de secours** : accessible en permanence
- **Numéro d'urgence** : communiqué à tous
- **Surveillance** : un adulte pour 2-3 équipes minimum

---

## 6. Créer votre propre parcours

### Option 1 : Utiliser le Studio

1. Ouvrir `studio.html` dans un navigateur
2. Suivre le workflow guidé :
   - **Objectifs** : que doivent apprendre les participants ?
   - **Public** : quel âge, quel niveau ?
   - **Territoire** : où se déroule le parcours ?
   - **Missions** : énigmes, quiz, observations
   - **Tests** : validation du parcours
   - **Publication** : export JSON

### Option 2 : Écrire le JSON directement

1. Partir de l'[exemple canonique](content/examples/exemple-quartier.json)
2. Suivre le [schéma DATA_MODEL](docs/DATA_MODEL.md)
3. Valider avec `node tools/validate-parcours.mjs`

---

## 7. Ressources

| Document | Usage |
|----------|-------|
| [README.md](README.md) | Installation et overview |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Schéma technique d'un parcours |
| [docs/GUIDE_PEDAGOGIQUE.md](docs/GUIDE_PEDAGOGIQUE.md) | Objectifs et compétences |
| [docs/SECURITY.md](docs/SECURITY.md) | Politique de sécurité |

---

*Version 1.0 — Curi🧭s*
