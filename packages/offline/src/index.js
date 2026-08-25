/* @curios/offline — point d'entrée unique. */

export { VERSION, CACHE, RUNTIME, PRECACHE } from "./config.js";
export {
  shouldBypassCache,
  fetchStrategy,
  shouldCacheRuntime,
  offlineFallback,
  cachesToDelete,
} from "./strategy.js";
