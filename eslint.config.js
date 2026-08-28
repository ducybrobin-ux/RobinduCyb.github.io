import js from "@eslint/js";
import globals from "globals";

const CURIOS_GLOBALS = {
  // Packages (window.*)
  Store: "readonly",
  I18N: "readonly",
  AudioSys: "readonly",
  Compass: "readonly",
  Board: "readonly",
  QrScan: "readonly",
  Dictation: "readonly",
  BirdReco: "readonly",
  GeoMath: "readonly",
  CURIOS_ENGINE: "readonly",
  JDP: "writable",
  HermesToast: "writable",
  qrcode: "readonly",
  jsQR: "readonly",
  // data.js globals
  SITE: "writable",
  TRAIL: "writable",
  BIRDS: "writable",
  GUIDE: "writable",
  BALISES: "writable",
  THEMES: "readonly",
  DIFFICULTIES: "readonly",
  allBirds: "readonly",
  getBird: "readonly",
  getBalise: "readonly",
  getBaliseIndex: "readonly",
  nextBalise: "readonly",
  applyAdminData: "readonly",
  challengeTypes: "readonly",
  randomChallenge: "readonly",
  // engine.js re-exports (used in app.js, data.js)
  getEnigme: "readonly",
  checkAnswer: "readonly",
  makeQuiz: "readonly",
  normalize: "readonly",
  // sw.js globals (injected at build time)
  VERSION: "readonly",
  CACHE: "readonly",
  RUNTIME: "readonly",
  PRECACHE: "readonly",
  shouldBypassCache: "readonly",
  shouldCacheRuntime: "readonly",
  cachesToDelete: "readonly",
  // optional globals
  GeoMag: "readonly",
  L: "readonly",
  // board.js / app.js cross-file globals
  toast: "readonly",
  updateSaviez: "readonly",
  CONFIG: "readonly",
  // hub frontend (hub-shell.js, hub-pages/*.js)
  HubAuth: "readonly",
  HubShell: "readonly",
};

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...CURIOS_GLOBALS,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-constant-condition": "warn",
      eqeqeq: ["warn", "smart"],
      "no-var": "warn",
      "prefer-const": "warn",
      "prefer-template": "warn",
      "no-case-declarations": "warn",
      "no-useless-escape": "warn",
      "no-redeclare": "warn",
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "js/jsqr.js",
      "js/qrcode.js",
      "img/**",
      "content/**",
      "docs/**",
      "*.md",
    ],
  },
];
