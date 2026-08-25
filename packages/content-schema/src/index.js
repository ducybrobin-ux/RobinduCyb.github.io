/* @curios/content-schema — point d'entrée unique.
 * Une seule source de vérité pour :
 *  1. charger/valider le contenu historique jdpbc-pack (legacy.js),
 *  2. le convertir en curios-parcours v1 (convert.js),
 *  3. valider un document curios-parcours (parcours.js).
 */
export {
  readJson, setRelBase,
  validerDecouverte, validerGuide, validerBalise, validerTheme,
  sortedJsonFiles, chargerPack, chargerThemes, chargerContenu,
} from "./legacy.js";

export { parcoursFromPack, verifierCouverture } from "./convert.js";

export { validateParcours } from "./parcours.js";
