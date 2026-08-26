# ACCESSIBILITY.md — Accessibilité

> Document de référence pour l'accessibilité de Curi>s.
> Basé sur les WCAG 2.1 niveau AA.

---

## Principes

1. **Perceptible** — le contenu est présentable de manière compréhensible
2. **Utilisable** — l'interface est navigable et utilisable
3. **Compréhensible** — le contenu et le fonctionnement sont compréhensibles
4. **Robuste** — le contenu est interprétable par les technologies d'assistance

---

## État actuel

### Ce qui est déjà accessible

| Élément | Accessibilité |
|---------|---------------|
| **Texte alternatif** | Images avec `alt` |
| **Contraste** | Thème sombre avec contraste élevé |
| **Navigation clavier** | Touches `←` `→` pour naviguer |
| **Multi-langue** | 6 langues supportées |
| **Offline** | Fonctionne sans connexion |

### Ce qui reste à faire

| Élément | Priorité | Action |
|---------|----------|--------|
| **Navigation vocale** | Haute | Ajouter `aria-label` sur les boutons |
| **Focus visible** | Haute | Indicateur de focus clair |
| **Lecteur d'écran** | Haute | `aria-live` pour les mises à jour |
| **Taille du texte** | Moyenne | `rem` au lieu de `px` |
| **Altérations de mouvement** | Moyenne | Respecter `prefers-reduced-motion` |
| **Mode contraste élevé** | Basse | Option dans les réglages |

---

## Adaptations par type de handicap

### Déficience visuelle

| Besoin | Solution |
|--------|----------|
| **Cécité** | Lecteur d'écran + description textuelle |
| **Malvoyance** | Contraste élevé, texte zoomable |
| **Daltonisme** | Icônes + couleurs (pas seulement couleur) |

**Mise en œuvre** :
- `alt` sur toutes les images
- `aria-label` sur les boutons
- `role` sur les éléments interactifs
- `aria-live` pour les notifications

### Déficience auditive

| Besoin | Solution |
|--------|----------|
| **Sourds** | Transcription audio, sous-titres |
| **Malentendants** | Volume adjustable |

**Mise en œuvre** :
- Transcriptions dans `media[].transcript`
- Pas d'information uniquement auditive
- Signaux visuels en plus des signaux sonores

### Déficience motrice

| Besoin | Solution |
|--------|----------|
| **Navigation clavier** | Toutes les actions accessibles au clavier |
| **GPS inaccessible** | QR codes, validation manuelle |
| **Tapotement difficile** | Zones de toucher grandes (> 44px) |

**Mise en œuvre** :
- Touches `←` `→` `↑` `↓` pour naviguer
- `Enter` pour valider
- `Escape` pour annuler

### Handicap cognitif

| Besoin | Solution |
|--------|----------|
| **Complexité** | Niveau facile avec indices |
| **Lecture** | Phrases courtes, vocabulaire simple |
| **Mémoire** | Instructions répétées, rappels |

**Mise en œuvre** :
- 3 niveaux de difficulté
- Indices progressifs (3 niveaux)
- Messages courts et clairs

---

## Checklist d'accessibilité

### Images
- [ ] Toutes les images ont un `alt`
- [ ] Les images décoratives ont `alt=""`
- [ ] Les images complexes ont une description

### Navigation
- [ ] Toutes les actions sont accessibles au clavier
- [ ] L'ordre de tabulation est logique
- [ ] Le focus est visible

- [ ] Les raccourcis clavier sont documentés

### Couleurs
- [ ] Contraste minimum 4.5:1 (texte)
- [ ] Contraste minimum 3:1 (texte large)
- [ ] L'information n'est pas transmise uniquement par la couleur

### Formulaires
- [ ] Les champs ont un `label`
- [ ] Les erreurs sont signalées
- [ ] Les messages d'erreur sont explicites

### Temps
- [ ] Pas de limite de temps (ou optionnel)
- [ ] Les animations peuvent être arrêtées
- [ ] `prefers-reduced-motion` respecté

### Texte
- [ ] Taille de texte modifiable (zoom navigateur)
- [ ] Interligne suffisant (1.5)
- [ ] Largeur de colonne limitée (80 caractères)

---

## Tests d'accessibilité

### Outils

| Outil | Usage |
|-------|-------|
| **Lighthouse** | Audit automatique Chrome |
| **axe-core** | Tests automatisés |
| **NVDA / VoiceOver** | Tests lecteur d'écran |
| **Clavier uniquement** | Tests navigation |

### Procédure

1. Lancer Lighthouse → score accessibilité > 90
2. Naviguer au clavier uniquement
3. Tester avec NVDA (Windows) / VoiceOver (Mac)
4. Vérifier le contraste avec WebAIM

---

## Roadmap d'accessibilité

| Phase | Action | Priorité |
|-------|--------|----------|
| 1 | Ajouter `aria-label` sur les boutons | Haute |
| 1 | Indicateur de focus visible | Haute |
| 2 | `aria-live` pour les notifications | Haute |
| 2 | Respecter `prefers-reduced-motion` | Moyenne |
| 3 | Mode contraste élevé | Basse |
| 3 | Taille de texte adjustable | Basse |

---

*Document à compléter lors de l'audit d'accessibilité.*
