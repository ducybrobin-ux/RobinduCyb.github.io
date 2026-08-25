# @curios/content-schema

Schéma et outils de contenu de Curi🧭s — **zéro dépendance**, modules ES purs.

## Trois responsabilités

1. **`legacy.js`** — chargement + validation du format historique `jdpbc-pack`
   (règles extraites telles quelles de `tools/build-data.mjs`, héritage Multi JDP).
2. **`convert.js`** — conversion déterministe pack → [`curios-parcours` v1](../../../docs/DATA_MODEL.md)
   avec vérification de couverture (aucune perte).
3. **`parcours.js`** — validation structurelle d'un document `curios-parcours`.

## Usage

```js
import { chargerContenu, parcoursFromPack, verifierCouverture, validateParcours }
  from "../packages/content-schema/src/index.js";

const contenu = chargerContenu("./content", ".");
for (const p of contenu.packsCharges) {
  const doc = parcoursFromPack(p);
  const errs = [...verifierCouverture(p, doc), ...validateParcours(doc)];
  if (errs.length) console.error(p.pack.id, errs);
}
```

Consommateurs actuels : `tools/build-data.mjs` (génération `js/data.js`),
`tools/convert-packs.mjs` (conversion vers `content/curios-parcours/`).
