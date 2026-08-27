# CURIOS — GOUVERNANCE ÉDUCATIVE ET AUTORITÉ ÉDITORIALE

## Mission

Faire évoluer CURIOS afin d'intégrer une gouvernance éducative forte,
éthique, transparente et techniquement vérifiable.

CURIOS n'est pas seulement un logiciel permettant de créer des jeux.

CURIOS produit et diffuse des expériences éducatives.

Par conséquent, la diffusion d'un contenu éducatif doit relever d'une
responsabilité humaine clairement identifiée.

---

## 1. PRINCIPE FONDAMENTAL

Aucun contenu éducatif ne doit être considéré comme :

- officiel ;
- validé ;
- recommandé ;
- publiable ;
- distribuable par l'édition officielle de CURIOS ;

tant qu'il n'a pas reçu une validation explicite de l'AUTORITÉ ÉDITORIALE
CURIOS.

L'autorité éditoriale est actuellement détenue par :

    LE PROPRIÉTAIRE / RESPONSABLE ÉDITORIAL DE CURIOS

Cette personne est la seule autorisée à effectuer la validation finale
des contenus éducatifs destinés à être distribués par l'édition officielle
de CURIOS.

---

## 2. OBJECTIF MORAL

La technologie ne doit jamais devenir l'autorité pédagogique.
L'IA ne doit jamais être l'autorité pédagogique.
Un algorithme ne doit jamais décider seul qu'un contenu éducatif est
acceptable.

Le logiciel peut :

- assister ;
- proposer ;
- analyser ;
- détecter des incohérences ;
- signaler des risques ;
- générer des variantes ;
- vérifier la structure ;
- vérifier la cohérence technique.

Mais le logiciel ne peut jamais remplacer la décision humaine finale.

**Principe :**

```
PROPOSITION
     ↓
ANALYSE
     ↓
CONTRÔLE
     ↓
VALIDATION HUMAINE
     ↓
PUBLICATION
```

---

## 3. STATUTS D'UN CONTENU

Chaque parcours doit posséder un état explicite :

```
DRAFT → REVIEW → APPROVED → PUBLISHED
                   ↑
              SUSPENDED
                   ↑
              ARCHIVED
```

Transitions autorisées :

- `DRAFT` → `REVIEW`
- `REVIEW` → `APPROVED`
- `REVIEW` → `DRAFT` (rejet)
- `APPROVED` → `PUBLISHED`
- `PUBLISHED` → `SUSPENDED`
- `SUSPENDED` → `PUBLISHED` (réactivation)
- `SUSPENDED` → `ARCHIVED`
- Tout statut → `ARCHIVED`

**Règle critique :** Une modification substantielle d'un contenu `APPROVED`
ou `PUBLISHED` doit automatiquement invalider sa validation précédente
et revenir en `REVIEW`.

Il est interdit qu'une modification du contenu conserve automatiquement
son statut `APPROVED`.

---

## 4. AUTORITÉ ÉDITORIALE

### Rôles

| Rôle | Droit `approve_content` | Description |
|------|------------------------|-------------|
| `AUTHOR` | Non | Auteur de contenu |
| `DESIGNER` | Non | Concepteur de parcours |
| `EDUCATOR` | Non | Éducateur consultant |
| `REVIEWER` | Non | Réviseur technique |
| `ADMINISTRATOR` | Non | Administrateur serveur |
| `EDITORIAL_OWNER` | **Oui** | Autorité éditoriale |

**IMPORTANT :** `ADMINISTRATOR ≠ EDITORIAL_OWNER`

Un administrateur technique peut administrer le serveur sans pouvoir
valider pédagogiquement un contenu.

Cela permet de séparer :

- **pouvoir technique** (administration serveur)
- **pouvoir éditorial** (validation pédagogique)

---

## 5. VALIDATION FORTE

La validation finale doit être une action explicite.

Elle doit nécessiter :

- authentification forte ;
- confirmation explicite ;
- identification du contenu ;
- numéro de version ;
- date ;
- heure ;
- identité du validateur ;
- empreinte du contenu.

Afficher avant validation :

```
"Vous êtes sur le point de valider la version X.Y
 de ce parcours comme contenu éducatif officiel."
```

Puis :

```
[VALIDER OFFICIELLEMENT]
```

La validation ne doit jamais être déclenchée :

- automatiquement ;
- par l'IA ;
- par un workflow ;
- par une importation ;
- par une API publique ;
- par une tâche planifiée.

---

## 6. SIGNATURE DU CONTENU

Chaque version approuvée doit être associée à :

```json
{
  "content_hash": "sha256:...",
  "version": "1.3",
  "approved_at": "2026-08-25T14:30:00Z",
  "approved_by": "editorial_owner_id",
  "signature": "base64:..."
}
```

Le système doit permettre de vérifier :

> "Cette version est-elle exactement celle qui a été validée ?"

Si le contenu change après validation :

```
HASH ≠ HASH_VALIDÉ
```

alors le contenu doit être considéré comme **NON VALIDÉ**.

---

## 7. CLÉ DE VALIDATION

La clé permettant de signer officiellement un contenu doit être séparée
des clés techniques du serveur.

**Ne jamais stocker la clé privée :**

- dans Git ;
- dans le code source ;
- dans le navigateur ;
- dans un fichier public ;
- dans une variable frontend exposée.

Prévoir une architecture permettant à terme une clé hors ligne ou un
dispositif matériel de signature.

La perte ou le vol de la clé doit pouvoir entraîner une procédure de
révocation.

---

## 8. VÉRIFICATION AU LANCEMENT

Lorsqu'un parcours officiel est chargé :

```
charger contenu
     ↓
calculer empreinte
     ↓
vérifier signature
     ↓
vérifier version
     ↓
vérifier statut
     ↓
AUTORISER OU REFUSER
```

Si la signature est invalide :

> NE PAS présenter le contenu comme officiellement validé.

Afficher :

> "Ce contenu n'est pas reconnu comme contenu éducatif officiel CURIOS."

---

## 9. MODE CRÉATION

Les utilisateurs doivent pouvoir créer librement des contenus personnels.

Ils peuvent :

- créer ;
- modifier ;
- tester ;
- jouer ;
- exporter ;
- partager leurs brouillons.

Mais ces contenus doivent clairement porter le statut :

- **NON OFFICIEL**
- ou **NON VALIDÉ**

Ils ne doivent jamais être présentés comme ayant reçu la validation
éditoriale CURIOS.

---

## 10. IA

L'IA peut intervenir uniquement comme assistant.

**Exemples autorisés :**

- générer une proposition ;
- améliorer une formulation ;
- créer des variantes ;
- proposer des énigmes ;
- détecter des incohérences ;
- analyser la difficulté ;
- vérifier la structure.

**MAIS :**

```
IA → PROPOSITION
```

et **jamais** :

```
IA → APPROBATION
```

L'IA ne possède aucun droit `approve_content`.

---

## 11. MODIFICATION D'UN CONTENU VALIDÉ

Une modification quelconque doit créer une nouvelle version.

**Exemple :**

```
CURIOS-CYBER version 1.3
     ↓ modification
version 1.4
     ↓ validation précédente invalidée
nouvelle validation nécessaire
```

Conserver l'historique complet : `1.0 → 1.1 → 1.2 → 1.3 → 1.4`

Une version validée doit rester consultable.

---

## 12. JOURNAL DE GOUVERNANCE

Créer un journal immuable des décisions éditoriales.

Chaque événement doit enregistrer :

- contenu ;
- version ;
- action ;
- auteur de l'action ;
- date ;
- hash ;
- résultat.

**Actions tracées :**

- `CREATED`
- `MODIFIED`
- `SUBMITTED_FOR_REVIEW`
- `REJECTED`
- `APPROVED`
- `PUBLISHED`
- `SUSPENDED`
- `REVOKED`
- `ARCHIVED`

Ne jamais enregistrer de données personnelles inutiles.

---

## 13. DROIT DE SUSPENSION

L'autorité éditoriale doit pouvoir suspendre immédiatement un contenu
officiel.

```
contenu publié
     ↓ problème découvert
SUSPENDED
     ↓ contenu retiré de la distribution officielle
```

La suspension doit être possible sans supprimer l'historique.

---

## 14. TRANSPARENCE

Chaque contenu officiel doit permettre de connaître :

- version ;
- date de validation ;
- statut ;
- autorité de validation.

Ne pas afficher inutilement de données personnelles.

---

## 15. RESPONSABILITÉ

Ajouter dans la documentation CURIOS cette charte :

> **CURIOS EDUCATIONAL GOVERNANCE CHARTER**

Cette charte doit expliquer :

- pourquoi une validation humaine est obligatoire ;
- ce que signifie "contenu officiel" ;
- le rôle de l'IA ;
- la distinction entre administration technique et responsabilité
  pédagogique ;
- le fonctionnement de la validation ;
- le processus de révocation ;
- la gestion des versions ;
- les limites de la garantie pédagogique.

---

## 16. OPEN SOURCE

CURIOS étant open source, ne jamais prétendre empêcher techniquement
les forks ou modifications externes.

La gouvernance doit distinguer :

```
CURIOS OPEN SOURCE ≠ ÉDITION OFFICIELLE CURIOS
```

Un fork peut exister librement.
Mais seule l'édition officielle doit reconnaître les signatures de
l'autorité éditoriale officielle.

Documenter clairement cette distinction.

---

## 17. SÉCURITÉ ET ÉTHIQUE

Le système ne doit jamais transformer l'autorité éditoriale en pouvoir
incontrôlé.

**Prévoir :**

- journalisation ;
- historique ;
- révocation ;
- sauvegardes ;
- procédure de récupération ;
- possibilité de vérifier publiquement une version ;
- documentation de la gouvernance.

L'autorité éditoriale doit être forte mais traçable.

---

## 18. ARCHITECTURE

```
Content
   ↓
Version
   ↓
Validation
   ↓
Signature
   ↓
Publication
   ↓
Verification
```

### Module `@curios/editorial-governance`

```
packages/editorial-governance/src/
├── content-status.js    —枚举 ContentStatus (DRAFT, REVIEW, etc.)
├── content-version.js   — gestion des versions
├── approval.js          — validation éditoriale
├── signature.js         — signature numérique (hash + vérification)
├── audit-log.js         — journal immuable
├── permissions.js       — rôles et droits
└── index.js             — point d'entrée unique
```

---

## 19. TESTS OBLIGATOIRES

1. Un brouillon ne peut pas être publié officiellement.
2. Un auteur ne peut pas valider son contenu.
3. Un administrateur technique ne peut pas valider un contenu.
4. L'IA ne peut pas valider un contenu.
5. Une modification invalide une signature.
6. Une signature incorrecte empêche la reconnaissance officielle.
7. Une version suspendue n'est plus distribuée comme officielle.
8. Une ancienne version validée reste identifiable.
9. Une nouvelle version nécessite une nouvelle validation.
10. Un contenu externe peut être utilisé comme contenu non officiel.
11. Un fork ne doit pas être confondu avec l'édition officielle.

---

## 20. INTERFACE

Dans CURIOS Studio, créer une zone :

> **GOUVERNANCE ÉDITORIALE**

**Pour les utilisateurs standards :**

```
Statut : NON VALIDÉ
```

ou :

```
Statut : OFFICIEL — VALIDÉ
```

**Pour l'autorité éditoriale :**

```
[VALIDER LA VERSION]
[REFUSER]
[SUSPENDRE]
[RÉVOQUER]
```

**Pour les autres utilisateurs :**

> "Validation éditoriale requise."

---

## 21. RÈGLE ABSOLUE

Ne jamais contourner l'autorité éditoriale par :

- une API ;
- une commande serveur ;
- une importation JSON ;
- une génération IA ;
- une modification de base de données ;
- une synchronisation ;
- une tâche automatique.

Toute voie permettant de publier officiellement un contenu doit passer
par la même politique de gouvernance.
