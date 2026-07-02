# Legacy Android Export Inventory

- `app/src/main/assets/index.html`
  - Single-file source of truth for current UI, sort game rules, scanner flow, skins, score, reward modals, and local storage keys such as `matchamatch_level`, `matchamatch_score`, `matchamatch_streak`, `matchamatch_skins`, `matchamatch_active_skin`, and `matchamatch_captures`.
- `app/src/main/java/com/example/MainActivity.kt`
  - Thin Android `WebView` host that requests camera permission and loads `file:///android_asset/index.html`.
- `app/src/main/AndroidManifest.xml`
  - Current wrapper permissions and app manifest for internet and camera access.
- `app/build.gradle.kts`
  - Legacy Android-only packaging config with application id, signing, build types, and Android dependency setup.

## Extraction Map

- `LEVELS` constants -> `packages/game-core/src/catalog.ts`
- sort game state and pour rules -> `packages/game-core/src/sort-engine.ts`
- score, skins, capture counts, active skin -> `packages/game-core/src/profile.ts`
- green-pixel scanner analysis -> `packages/game-core/src/scanner-analysis.ts`
- DOM rendering, audio, camera, overlays -> `apps/web/src/components/*` and `apps/web/src/hooks/*`
