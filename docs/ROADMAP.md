# KAIROS — Roadmap & Bugs

**Version :** 0.3.x — Février 2026

---

## 1. Bugs Actifs

### Bugs connus

| ID | Sévérité | Description | Notes |
|---|---|---|---|
| B001 | Moyenne | Performance >200 vignettes (rendu lent) | A008 corrigé (Map O(1)), A035 corrigé (spatial-grid). Amélioration partielle. |
| B002 | Basse | Capture webview timeout 8s sur certains providers | Fallback manuel dispo. A034 mitigé (sélecteurs centralisés). |
| B003 | ~~HAUTE~~ | Oxygen score instable : evaluate() et recordTurn() utilisaient deux modèles incompatibles (snapshot vs delta), double-comptage écho, stagnation exponentielle | **Résolu** — Modèle 100% snapshot. Score = `clamp(0,100, 50 + structural + echo + tagDiversity + friction)`. evaluate() et recordTurn() produisent le même score. 28 tests unitaires. |

### Bugs de cohérence événementielle

> Identifiés lors de l'audit de cohérence (février 2026).

| ID | Sévérité | Problème | Impact |
|---|---|---|---|
| C001 | ~~HAUTE~~ | ~~Event name mismatch llmSend/llmSendTracked~~ | **Résolu** — code attracteur supprimé |
| C002 | ~~HAUTE~~ | ~~nodeId vs nodeIds structure mismatch~~ | **Résolu** — code attracteur supprimé |
| C003 | Moyenne | `context-chat.ts` écoute `canvas:nodeAdded`, `canvas:nodeDeleted`, `canvas:connectionCreated` mais les événements réels n'ont pas le préfixe `canvas:`. | Listeners context-chat jamais déclenchés |
| C004 | Basse | `degreeHistory` déclaré dans `createInitialBehaviorLogs()`, sérialisé/désérialisé, mais **jamais alimenté**. | Code mort à supprimer |
| C005 | Basse | Champs `vignetteValidees`, `vignetteEnCours`, `vignetteRejetees`, `ratioValidation` jamais assignés dans MetricsManager. | Affichent "0✓ 0◌ 0✗" en permanence |

### Workaround Electron actif

| ID | Description |
|---|---|
| E002 | Sélection de texte saute au conteneur parent dans la webview. Mitigé via `webContents.insertCSS()` (non affecté par CSP). En cours de validation — dépend du DOM dynamique des providers LLM. |

---

## 2. Features & Roadmap

### Audit Février 2026 — Résolu

> **46 items (A001-A046)** corrigés en 8 sessions (~25h) : intégrité données (A001-A006), mémoire/perf (A007-A011), UX/cohérence (A012-A017), design system CSS (A018-A025), accessibilité (A026-A030), architecture (A031-A035), analyseur (A036-A038), UI/UX polish (A039-A046). Détails dans l'historique git.

### Features terminées (Février 2026)

| ID | Feature | Détails |
|---|---|---|
| F005 | Multi-canvas | Save/load/switch via modal "Mes graphes". IDs `canvas_{uuid}`, default `'default'`. |
| F006 | Migration API | Opérations DÉVELOPPER/RELIER/SYNTHÉTISER via API directe + fallback webview. Multi-provider. |
| F007 | ESLint + Prettier + Husky | Flat config `.mjs`, 0 erreurs, lint-staged pre-commit. |
| F008 | Tests unitaires Vitest | 296 tests, 11 fichiers. Script : `npm run test:unit`. |
| F015 | Suppression attracteurs + Diagnostic structurel | Attracteurs (scoring, badges, qualification LLM) supprimés (~1000 lignes). Remplacés par `graph-diagnostic.ts` : diagnostic structurel (dominance, ponts, redondances, trous) affiché dans le popup de synthèse. |
| F014 | Tests pipeline LLM → connexions | 69 tests (unit) + 6 tests (e2e). Couvre parsing, matching 5 niveaux, orchestration, validation, intégration bout-en-bout. |
| F009 | Logging structuré | `createLogger(tag)` avec niveaux DEBUG/INFO/WARN/ERROR/SILENT. |
| F010 | Documentation architecture | Consolidation docs en `doc projet/`. |
| F012 | Thèmes visuels | 4 thèmes (Obsidian/Porcelain/Aurora/Kraft), CSS tokens `--theme-*`, anti-FOUC. |
| F016 | Priorité = Ancre structurelle | 1 seule vignette prioritaire par canvas (ancre/objectif). Contrainte enforcée dans `cycleNodeStatus` + select. Notification à l'activation. Bloc `ANCRE DU GRAPHE` injecté dans les prompts LLM (API + webview). Le LLM structure ses réponses autour de l'ancre. |
| F017 | Validateur d'intégrité canvas | `validateCanvasState()` : 8 invariants (orphelines, doublons, auto-connexions, types invalides, multi-priority). Mode repair auto. Intégré au save (storage.ts) et au load (persistence.ts). 23 tests unitaires. |
| F018 | Fix clearGraph | Bouton "Effacer" : await sur les opérations async, refresh UI (métriques + bandeau suggestion), try/catch global. |
| F019 | Panneau diagnostic O₂ | Onglet sidebar "O₂" : score avec couleur par niveau, barres de signaux center-origin (structure/écho/tags/friction), sparkline historique CSS (20 tours), diagnostic structurel en français (ponts/dominance/gaps/redondances via `graph-diagnostic.ts`), suggestion courante. Fichier : `assisted/app/oxygen-panel.ts`. |
| F020 | Fix posture refresh | `applyPosture()` ne déclenchait aucun refresh visuel après changement de posture. Ajout `oxygen.evaluate()` + `metrics.recalculateDebounced()` → bandeau et debug strip mis à jour immédiatement. |
| F022 | Refonte UX suggestions | Bandeau informatif (plus prescriptif), menu 3 opérations principal (DÉVELOPPER/RELIER/SYNTHÉTISER), SYNTHÉTISER retiré des suggestions (badge subtil conditionné par O₂ > 60 + ≥8 connectées), sélection = contexte libre, cap targetCount supprimé, cooldown supprimé. 10 fichiers modifiés. |
| F013 | Layout arbre hiérarchique | Bouton "Arbre" : réorganisation top-down via connexions `implies`. Algorithme Sugiyama (BFS layering, barycentre, centrage). Animation CSS 0.5s + RAF SVG. `fitViewportToNodes()` recadre après layout. Guard `newlyImported` en assisté. Composantes déconnectées côte à côte, isolés en bas. 23 tests unitaires. |
| F024 | Smart import LLM | Les vignettes importées par DÉVELOPPER sont positionnées près de leur cible de connexion (au lieu de la grille au bas du viewport). Fallback `getVisibleBottomPosition()` si pas de cible. |
| F025 | Relocalisation post-synthèse | Après archivage, les vignettes synthétisées glissent en colonne à droite de la zone active (animation 400ms). Garder la zone de travail dégagée. |
| F023 | Version bêta web (iframe) | Version allégée de KAIROS pour intégration iframe dans un site de recherche. Core partagé (canvas, LLM API, Oxygen, métriques, undo/redo) + shim `window.fgraph` (DB no-op, LLM fetch direct, clés API en mémoire). 2 thèmes (Obsidian/Porcelain), 2 opérations (DÉVELOPPER/RELIER), API iframe postMessage. 6 fichiers créés : `web.html`, `web-app.ts`, `fgraph-shim.ts`, `api-key-ui.ts`, `iframe-api.ts`, `vite.web.config.js`. Build : `npm run dev:web` / `npm run build:web`. |

### Features planifiées

| ID | Priorité | Description | Estimation |
|---|---|---|---|
| F021 | Haute | Onglets multi-canvas (barre d'onglets, Ctrl+T/W, drag entre canvas) | 8-10h |
| F001 | Moyenne | Curseur de friction (contrôle utilisateur du niveau) | Après stabilisation Oxygen |
| F002 | Moyenne | Export PDF/SVG avancé (multi-pages, vectoriel, zone au choix) | 3-4h |
| F003 | Moyenne | Pôles conteneurs (groupement, réduction/extension, drag groupé) | 6-8h |
| F004 | Basse | Auto-layout force-directed (type D3.js, animation fluide) | 4-5h |
| F011 | Basse | Documentation intégrée (5ème entry point HTML, rendu markdown, recherche) | 6-8h |

---

### Specs détaillées — Features planifiées

#### F021 — Onglets multi-canvas

Évolution de F005 (modal "Mes graphes") vers une navigation par onglets. Prévu après stabilisation Oxygen + tests.

**Comportement** : Barre d'onglets en haut du canvas. Ctrl+T = nouveau canvas. Ctrl+W = fermer l'onglet courant. Drag & drop de vignettes entre canvas (onglets).

**Prérequis** : Infrastructure SQLite déjà prête (table `canvases`). F005 (multi-canvas modal) déjà implémenté.

**Fichiers probables** : `canvas/tab-bar.ts` (nouveau), `assisted.html` + `index.html` (conteneur onglets), `canvas-manager.ts` (switch logic), `assisted.css` + `canvas.css` (styles tab bar).

#### F023 — Version bêta web ✓

**Implémentée.** Version allégée de KAIROS pour intégration iframe dans un site de recherche. Full web, pas Electron.

**Architecture** : Core partagé (même code TS que l'app Electron) + shim `window.fgraph` (DB no-op, LLM fetch direct multi-provider, clés API en mémoire session). Polyfill `CircularityDetector` pour compatibilité modules existants.

**Inclus** : Canvas engine complet, mode assisté, 2 opérations LLM (DÉVELOPPER + RELIER), pipeline prompt 5 couches, Oxygen + friction, métriques + bandeau, ancre structurelle, undo/redo, 2 thèmes (Obsidian + Porcelain), validateur d'intégrité.

**Coupé** : Mode autonome, webview LLM, synthèses, multi-canvas, minimap, PromptLogManager, panneau O₂ détaillé, filtres avancés, export/import JSON, recherche, audio.

**Fichiers créés** : `web.html`, `web-app.ts`, `web/fgraph-shim.ts`, `web/api-key-ui.ts`, `web/iframe-api.ts`, `styles/web.css`, `vite.web.config.js`.

**Sécurité** : Clés API en mémoire uniquement, proxy URL whitelisted, origins iframe filtrées, erreurs sanitizées, jamais de persistence credentials.

**Build** : `npm run dev:web` / `npm run build:web` (Vite, output `dist/web/`, ~197KB JS).

### Roadmap future

**v0.4.x (Q2 2026)**
- Recherche avancée dans synthèses (tags, date, contenu)
- Templates de canvas prédéfinis
- Mode présentation (navigation guidée)

**v0.5.x (Q3-Q4 2026)**
- Backend API + Cloud sync
- Collaboration temps réel
- Historique des versions (git-like)

**v1.0.x (2027)**
- Extensions/Plugins
- Mobile (React Native)
- Marketplace de templates

---

## Documents complémentaires

| Document | Contenu |
|----------|---------|
| `CLAUDE.md` (racine) | Référence développeur : commandes, fichiers, patterns, build, storage, CSS, conventions |
| `ARCHITECTURE.md` | Vision, philosophie, équations, référence technique mode assisté, historique décisions |
| `PROMPTS-LLM.md` | Métriques, arbre de décision, pipeline complet métriques → LLM, templates de prompt |
| `SIMULATION.md` | Guide de test manuel exhaustif (14 catégories, ~130 scénarios) |
