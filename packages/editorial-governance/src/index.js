/* @curios/editorial-governance — point d'entrée unique. */
export { ContentStatus, canTransition, possibleTransitions, transition } from "./content-status.js";
export { Roles, hasRight, getRights, canApprove, isAI, canValidate } from "./permissions.js";
export { computeHash, signContent, verifySignature } from "./signature.js";
export { AuditAction, createAuditLog } from "./audit-log.js";
export { createContentVersion } from "./content-version.js";
