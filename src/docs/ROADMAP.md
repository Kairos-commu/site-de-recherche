# KAIROS — Roadmap & Bugs

**Version :** 0.3.x — Février 2026

---

## 1. Bugs Actifs

### Bugs connus

| ID | Sévérité | Description | Notes |
|---|---|---|---|
| B001 | Moyenne | Performance >200 vignettes (rendu lent) | A008 corrigé (Map O(1)), A035 corrigé (spatial-grid). Amélioration partielle. |
| B002 | Basse | Capture webview timeout 8s sur certains providers | Fallback manuel dispo. A034 mitigé (sélecteurs centralisés). |
| B005 | ~~Basse~~ | Synthèses : "0 vignettes / Invalid Date" après rechargement. `loadSyntheses` utilisait les noms snake_case (`row.created_at`, `row.vignettes_source_ids`) sur des objets déjà formatés en camelCase par `formatRow()` du repository SQLite. | **Résolu** — Noms alignés sur le format camelCase retourné par `formatRow()`. |
| B006 | ~~Basse~~ | Animations connexions SVG (`connection-flow`) tuées par `prefers-reduced-motion: reduce` (Win 11). Le `animation-duration: 0.01ms !important` de `base.css` (`@layer base`) battait les déclarations dans `@layer components`. | **Résolu** — Override dans `reset.css` (`@layer reset`) pour `.connection-implies`, `.connection-resonance` et `.connection-glow-layer`. |
| B003 | ~~HAUTE~~ | Oxygen score instable : evaluate() et recordTurn() utilisaient deux modèles incompatibles (snapshot vs delta), double-comptage écho, stagnation exponentielle | **Résolu** — Modèle 100% snapshot. Score = `clamp(0,100, 50 + structural + echo + tagDiversity + friction)`. evaluate() et recordTurn() produisent le même score. 28 tests unitaires. |
| B004 | ~~HAUTE~~ | Score oxygen change au rechargement d'un canvas : les vignettes archivées (synthesized=true) et leurs connexions étaient incluses dans le calcul | **Résolu** — `filterActiveGraph()` dans `oxygen.ts` exclut les nœuds synthesized et leurs connexions avant calcul, comme le fait déjà `metrics.ts`. |
| B005 | ~~HAUTE~~ | Système de sauvegarde des graphes : `importGraph()` ne persistait rien en SQLite (données, oxygen, synthèses perdues après import). Canvas vides créés automatiquement à chaque démarrage "Nouveau" s'accumulaient dans la modale. `cleanupEmptyCanvases()` s'exécutait avant la création du nouveau canvas. `importSessionFile()` ne réinitialisait pas oxygen/synthèses. | **Résolu** — `importGraph()` converti en async avec chaîne de persistence complète (save + reset oxygen/synthèses/history/analyzer). `cleanupEmptyCanvases()` déplacé après le choix de session + ne protège plus le canvas `default` vide + vérifie les synthèses avant suppression. `importSessionFile()` enrichi avec reset des sous-systèmes. |
| B007 | ~~Basse~~ | Bouton "Vignette" (toolbar primaire) déclenchait `metrics.recalculateDebounced()` via le hook `createNode`, causant un recalcul oxygen non voulu. Le bouton était redondant (double-clic canvas + menu contextuel créent aussi des vignettes). | **Résolu** — Bouton supprimé de `assisted.html`, handler retiré de `toolbar.ts`, méthode `createNewNode()` retirée de ` assisted-app.ts`, CSS `#create-pole-btn` retiré de `toolbar.css`. |
| B008 | ~~Basse~~ | Panneau Prompts : section "Résultat" ne se replie/déplie pas. `.prompt-parsed-result { display: flex }` (spécificité 0,1,0, postérieur) écrasait `.prompt-detail-body { display: none }` (même spécificité). L'icône ▶ des sous-sections ne pivotait pas (sélecteur `.prompt-entry.expanded .expand-icon` ciblait toutes les icônes, pas seulement celle de l'entrée). | **Résolu** — `display: flex` retiré de `.prompt-parsed-result`, ajouté sur `.prompt-detail-section.open .prompt-detail-body.prompt-parsed-result`. Sélecteur expand-icon scopé avec `>` (entry + section). |
| B009 | ~~Moyenne~~ | Export Markdown renvoyait un fichier vide. `showSaveFilePicker` (API web) créait le fichier mais `createWritable().write()` échouait silencieusement dans Electron. Le contenu n'incluait pas le prompt log (interactions LLM), rendant l'export inutilisable pour comparer avec un fil de chat classique. | **Résolu** — IPC `file:save` ajouté (`dialog.showSaveDialog` + `fs.writeFileSync` dans main.js, exposé via `window.fgraph.saveFile`). `saveFileWithPicker` priorise l'IPC Electron avec fallbacks web. `exportMarkdown` réécrit : journal chronologique des interactions (prompt, réponse, résultat parsé avec statut import), synthèses archivées, état final du canvas. |

### Bugs de cohérence événementielle

> Identifiés lors de l'audit de cohérence (février 2026).

| ID | Sévérité | Problème | Impact |
|---|---|---|---|
| C001 | ~~HAUTE~~ | ~~Event name mismatch llmSend/llmSendTracked~~ | **Résolu** — code attracteur supprimé |
| C002 | ~~HAUTE~~ | ~~nodeId vs nodeIds structure mismatch~~ | **Résolu** — code attracteur supprimé |
| C003 | ~~Moyenne~~ | ~~`context-chat.ts` écoute `canvas:nodeAdded`, `canvas:nodeDeleted`, `canvas:connectionCreated` mais les événements réels n'ont pas le préfixe `canvas:`.~~ | **Résolu** — listeners corrigés dans context-chat.ts, toolbar.ts, depth-view.ts, iframe-api.ts (`canvas:nodeAdded` → `nodeCreated`, etc.) |
| C004 | ~~Basse~~ | ~~`degreeHistory` déclaré dans `createInitialBehaviorLogs()`, sérialisé/désérialisé, mais **jamais alimenté**.~~ | **Résolu** — `degreeHistory` supprimé de config.ts, history.ts et test |
| C005 | ~~Basse~~ | ~~Champs `vignetteValidees`, `vignetteEnCours`, `vignetteRejetees`, `ratioValidation` jamais assignés dans MetricsManager.~~ | **Résolu** — champs supprimés de MetricsManager |


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
| F008 | Tests unitaires Vitest | 343 tests, 13 fichiers. Script : `npm run test:unit`. |
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
| F023 | ~~Version bêta web (iframe)~~ | **Abandonné** — supprimé de la codebase. Fichiers `web.html`, `web-app.ts`, `web/`, `web.css`, `vite.web.config.js` supprimés. |
| F026 | Refonte architecture CSS | `canvas.css` monolithique (4400 lignes) → architecture modulaire : `@layer` cascade, design tokens 3 niveaux (primitives/sémantiques/composant), 11 fichiers composants avec CSS nesting natif, animations centralisées (`effects/animations.css`), mode color system (`modes/mode-common.css`), variables raccourcies (`--theme-*` → `--*`). Point d'entrée unique `index.css`. Legacy `canvas.css` + `fonts.css` supprimés. |
| F027 | Vue Profondeur (2.5D) — Phase 1 | Toggle opt-in "Profondeur" (bouton toolbar + touche D). 4 couches de profondeur simulées (scale 0.75→1.03, opacité 0.25→1.0, blur 0→1px, shadow elevation-1→4). Critère Z = récence (`modified`/`created`). Parallaxe souris ±20px + micro-rotation ±8° (perspective per-node 600px). Connexions SVG suivent la profondeur (opacity + marker-end masqué). Drag & drop préservé (snap au front). Fonction `setDepthLayerFn()` swappable pour Phase 2. Fonctionne en assisté + autonome, 4 thèmes. **Bugfix fév. 2026** : timestamps `created` corrigés (ISO string → `Date.now()`), `modified` assigné sur drag end + édition texte, `depthByRecency` robustifié (normalisation string→number, fallback index quand timestamps identiques). Fichiers : `canvas/depth-view.ts`, `canvas/nodes.ts`, `canvas/interactions.ts`, `canvas/menus.ts`, `styles/components/depth-view.css`, tokens dans `tokens.css`. |
| F029 | Connexions SVG organiques | Courbes Bézier organiques (courbure basée sur distance totale, min 30px, S-curve naturel). Couche glow (stroke 6px, opacity pulsée 0.12↔0.22). Particules SMIL animées (2 cercles/connexion, `animateMotion` + `mpath`). Implies : 2 particules vertes source→cible. Resonance : 1 particule ambrée par direction. Fix markers cassés `index.html`, ajout gradients/filtres manquants `web.html`. Fichiers : `canvas/connections.ts`, `connections.css`, `animations.css`, `reset.css`, 3 HTML. |
| F030 | Allègement toolbar assisté | Bouton "Effacer" remplacé par "Nouveau" (crée un nouveau graphe vierge, l'ancien reste en DB). Boutons "Exporter" (JSON) et "Importer" retirés du header (méthodes `exportGraph`/`importGraph` conservées en code). Exports PNG/Markdown restent dans le bandeau. Fichiers : `assisted.html`, `toolbar.ts`, `assisted-app.ts`. |
| F031 | Refonte toolbar deux niveaux | Toolbar restructurée en 2 niveaux : barre primaire (Home, Vignette, Mes graphes, nom canvas, filtres visibilité, recherche collapsible 🔍, toggle ⋯) + tiroir secondaire collapsible (Nouveau, Arbre, Profondeur, sélection par statut, posture, thème, audio). Bouton "Mode Assisté" supprimé (redondant avec Home). Zoom indicator déplacé sur la minimap. Recherche collapsible (icône → expand au clic/Ctrl+F, collapse au blur). État tiroir persisté en localStorage. Animations CSS `max-height` + overrides `prefers-reduced-motion` dans `reset.css`. Fichiers : `assisted.html`, `toolbar.css`, `reset.css`, `toolbar.ts`, `search.ts`, `assisted-app.ts`. |
| F032 | Refonte landing page (App Launcher) | Landing page transformée de "page marketing web" en "app launcher". Header compact (KAIROS 24px avec shimmer), cartes de mode compactes data-driven (icône + label + tagline, sans listes de features), bouton info (ℹ) avec popover descriptif par mode, liste des canvas récents depuis SQLite (max 7, filtrés non-vides, temps relatif), section masquée si aucun canvas. Architecture data-driven : tableau `MODES[]` = source unique, ajouter un mode = ajouter un objet. Keyboard shortcuts data-driven. Préparation F028 (3ème mode). Fichiers : `landing.html`, `landing.ts`, `landing.css`. |
| F033 | Optimisation perf vignettes + connexions SVG | `transition: all` scopé par propriété, `will-change` conditionnel (hover/drag only), cache SVG connexions (`_cachedPathD`), animations particules pausées par défaut (`animation-play-state: paused`), viewport culling particules (hors écran = pausées). Fix hover mode autonome (manquait `scale()`). 296 tests OK. |
| F034 | Design v2 : Thèmes visuels | Porcelain : fond canvas grège taupe (`#C8C3BB`), vignettes crème (`#EBE8E2`), toolbar/bandeau/panels crème clair, chat header redesigné, context-chat aligné, hover vert sauge. Dark themes (Obsidian/Aurora/Kraft) : contraste fond↔vignettes augmenté (~14pts de delta luminosité), `bg-elevated` ajusté. Accent bar (`.node-accent-bar`) supprimée sur tous les thèmes — design minimaliste. Reflet métallique sur vignettes standard : radial gradient + arête lumineuse + bande diagonale au hover, tokens `--node-sheen`/`--node-edge-light` par thème. Kraft : police Georgia → Lora (`@fontsource/lora`). |
| F035 | Intégration Ollama (LLM local) | Provider LLM local, API-only (pas de webview). Endpoint natif `/api/chat` (`stream: false`, `options.num_ctx`). Détection auto via `GET /api/tags` (timeout 2s). Sélecteur de modèle dynamique dans le config modal (dropdown peuplé depuis `/api/tags`, pastille vert/rouge, bouton refresh). Modèle persisté `localStorage('kairos_ollama_model')`. Timeout 180s (modèles locaux plus lents, premier appel charge le modèle). Erreurs spécifiques : CUDA OOM, modèle non installé, ECONNREFUSED. Pas de clé API. Code LM Studio nettoyé (fév. 2026). 7 fichiers modifiés : `main.js`, `llm.ts`, `router.ts`, `executor.ts`, `config-modal.ts`, `kairos.ts`, `ui-states.ts`. |
| F036 | Modal de démarrage = choix API (pas webview) | Le modal "Modèle LLM" sélectionne désormais le **provider API** pour les opérations (DÉVELOPPER/RELIER/SYNTHÉTISER), plus le webview. **Badges clé API** : ✓ (vert) si clé configurée, · (gris) si non — providers sans clé restent sélectionnables (fallback webview). `await llm.whenReady()` avant le modal pour connaître l'état des clés. **Résultat enrichi** : `{ provider, apiName, webviewName, model? }` avec mapping chatgpt→openai. Le modal sauvegarde `kairos_api_provider` + `kairos_api_mode_enabled` + `kairos_llm_provider`. **Dropdown webview** synchronise l'API : changer de provider en cours de graphe met aussi à jour `kairos_api_provider`. Ollama : section Local, auto-détection, dropdown modèle inline (F035-UX). 3 fichiers modifiés : `session.ts`, `assisted-app.ts`, `providers.ts`. |
| F037 | Prompt Log v2 — Parsing visuel + indicateurs import canvas | Refonte de l'onglet "Prompts" (sidebar) : séparation system/user prompt, résultat parsé auto-ouvert, cards par vignette/connexion avec indicateur ✓/– d'import canvas. Annotation `_imported` au moment de l'import (fiable, par référence). Fallback similarité Jaccard pour vieilles entrées. Fix "undefined (undefined)" dans friction signals. Event `importResultUpdated` + `refreshLatestEntry()`. Fichiers : `prompt-log.ts`, `capture.ts`, `llm-api.ts`, `assisted.css`. |
| F038 | Suppression canvas (landing page) | Suppression unitaire (bouton poubelle au hover, confirmation modale) et multiple (mode sélection avec checkboxes, barre d'action, tout-sélectionner). Canvas actif protégé. Appel `deleteCanvas()` (CASCADE SQLite). 9 fonctions ajoutées. Fichiers : `landing.ts`, `landing.css`. |
| F040 | Companion — Chat LLM comparatif | Fenêtre Electron secondaire pour exploration libre d'un sujet via chat LLM, sans structure en graphe. Comparaison avec le mode assisté de KAIROS. Même main process, même DB (`companion_sessions` + `companion_messages` dans `kairos.db`), même `preload.js`, mêmes providers LLM (`llm-query`). Isolation : seule l'intention est transmise au LLM (pas le contenu du canvas lié). UI : sidebar sessions + vue chat + formulaire création avec lien optionnel vers un canvas KAIROS. Bouton "Companion" dans le tiroir secondaire de la toolbar assistée. 6 fichiers créés : `companion.js` (repo), `companion.html`, `companion.css`, `companion-app.ts`, `companion/llm.ts`, `companion/types.ts`. 6 fichiers modifiés : `db.js`, `repositories/index.js`, `ipc-handlers.js`, `preload.js`, `main.js`, `vite.config.js`. 343 tests OK. |
| F041 | Reconfiguration providers LLM | Gemini (Google) retiré. Ajout Mistral (`api.mistral.ai`, OpenAI-compatible, modèle par défaut `mistral-large-latest`) et Groq (`api.groq.com`, OpenAI-compatible, dropdown modèles dynamique via IPC `llm-list-models`, modèle persisté `localStorage('kairos_groq_model')`). Mistral et Groq = API-only (pas de webview). Nouveau handler IPC `llm-list-models` + bridge `llmListModels` dans preload.js. Card hybride Groq dans config modal (clé API + dropdown modèles). Companion mis à jour (dropdown provider + `fetchGroqModels()`). 12 fichiers modifiés : `main.js`, `preload.js`, `llm.ts`, `config-modal.ts`, `router.ts`, `providers.ts`, `session.ts`, `assisted.html`, `index.html`, `intention.html`, `companion-app.ts`, `companion/llm.ts`. `callGemini()` supprimé (dead code). 343 tests OK. |
| F042 | Signal "Saturation tags" (jauge O₂) | 5e signal oxygen : analyse le recouvrement de tags entre paires connectées. Malus progressif -10 à -20 dès ≥50% des paires saturées (≥1 tag partagé). Seuil min 4 paires taguées. Nouvelle ligne "Saturation" dans le panneau O₂ (barre + ratio %). Fonction `evaluateTagSaturation()` dans `oxygen.ts`. 7 tests unitaires ajoutés. Fichiers : `oxygen.ts`, `assisted.html`, `oxygen-panel.ts`, `oxygen.test.ts`. |
| F043 | Tree layout robuste sans ancre | Le layout arbre fonctionnait mal sans nœud prioritaire (ancre 🎯). Fix : 1) `findConnectedComponents` utilise toutes les connexions (implies + resonance) pour garder le graphe cohésif, 2) auto-sélection du root le plus connecté par composante, 3) BFS bidirectionnel systématique (suit implies + resonance pour atteindre tous les nœuds). Nouvelle fonction `findBestRoot()`. 8 tests unitaires ajoutés (358 total). Fichiers : `tree-layout.ts`, `tree-layout.test.ts`. |
| F021 | Onglets multi-canvas (mode assisté) | Barre d'onglets navigateur au-dessus de la toolbar pour switch instantané entre canvas. Tab bar `position: absolute; top: 0` dans `.canvas-area`, toolbar décalée à `top: 42px`. State `TabBarState { tabs, activeCanvasId }` persisté `localStorage('kairos_open_tabs')`. Click tab = switch, × = close (dernier → landing.html), [+] = nouveau graphe léger, double-clic = rename inline, clic droit = menu contextuel. Raccourcis Ctrl+T/W. Protection tabs dans `cleanupEmptyCanvases()`. Synchronisation modale "Mes graphes". 11 tests unitaires (369 total, 14 fichiers). Fichiers créés : `tab-bar.ts`, `tab-bar.css`. Fichiers modifiés : `assisted.html`, `toolbar.css`, `index.css`, `reset.css`, `assisted-app.ts`, `canvas-modal.ts`, `canvas-manager.ts`. |
| F021b | Config LLM per-canvas + Fix O₂ | Chaque canvas stocke son provider/modèle LLM en SQLite (`llm_provider`, `llm_model` colonnes ajoutées à `canvases`). Au switch de tab, la config est appliquée aux clés globales localStorage (pattern "write-through global"). Le pipeline LLM (router/executor) n'est pas modifié. Badge provider (1 lettre) sur chaque onglet. Nouveau module `canvas-llm-config.ts` (3 fonctions : apply/save/get). **Fix bug O₂** : `switchToCanvas()` ne dispatchait pas `oxygenUpdated` → panneau O₂ sidebar bloqué sur l'ancien score. Fix : ajout dispatch event après `oxygen.evaluate()`. Fichiers créés : `canvas-llm-config.ts`. Fichiers modifiés : `db.js`, `canvas.js` (repo), `tab-bar.ts`, `tab-bar.css`, `assisted-app.ts`, `config-modal.ts`. |
| F021c | Tab bar style pilule | Onglets redessinés en style pilule/capsule : bordures arrondies, onglet actif avec fond accent coloré, onglet [+] en bordure pointillée (dashed) + bouton. Fichier modifié : `tab-bar.css`. |
| F022b | Refonte modale Configuration LLM | Toggle "Mode API" et dropdown provider supprimés (reliquats webview). Remplacés par cartes radio : 1 clic = sélection provider, carte sélectionnée expanded avec input clé inline + dropdown modèle (Groq/Ollama). 6 providers (Claude, ChatGPT, DeepSeek, Mistral, Groq, Ollama). **Fix bug session.ts** : `PROVIDER_MAP` manquait `mistral` et `groq` → sélectionner ces providers écrivait `apiName: 'claude'` (fallback). Fichiers modifiés : `config-modal.ts` (refonte complète), `session.ts` (fix PROVIDER_MAP). |
| F039 | Fond Ambiant Dynamique ("Âme de Kairos") | Le fond statique SVG (`neural-network.svg` + grille de points) remplacé par un fond Canvas 2D vivant réagissant à l'état du graphe, l'heure du jour, les actions utilisateur et le thème. 7 couches de rendu : géométrie sacrée (5 motifs : Fibonacci, Fleur de Vie, Métatron, Graine de Vie, Sri Yantra, attribués par canvas via hash), flow field (70 particules Simplex), wash heure du jour, fantômes topologiques, bioluminescence, effets transitoires, sillage curseur. Animation "tracé au stylo" à l'ouverture (12s), puis pulsation douce. Réactivité : ripple (création node), implosion + fantôme 30-60s (suppression), flash connexion, flash synaptique (LLM). Palette dynamique : 4 thèmes × 4 périodes jour × 2 modes. Porcelain ultra-subtil (`multiply`), thèmes sombres plus visibles (`screen`). Performance : ~13fps, <1ms/frame, pause pendant drag, pool pré-alloué (0 GC). `prefers-reduced-motion` : frame statique unique. Mode assisté : bioluminescence liée au score oxygen, flash synaptique LLM. Mode autonome : pulse radial violet (remplace CSS `breathe`). 7 modules dans `src/renderer/js/ambient/` (~1700 lignes). 35 tests unitaires ajoutés (343 total, 13 fichiers). |

### Features planifiées

# F032 — Système de Modes KAIROS

## Contexte

KAIROS possède actuellement 2 modes : Assisté (rouge/orange) et Autonome (violet).
L'objectif est d'étendre à 6 modes-persona sans dupliquer le moteur.
Chaque mode est un **skin sémantique** : même socle technique, vocabulaire différent.

---

## Principe architectural

```
┌─────────────────────────────────────────────┐
│              MODE REGISTRY                   │
│  mode-registry.ts — point d'entrée unique   │
├─────────────────────────────────────────────┤
│                                             │
│   ModeDefinition {                          │
│     id: ModeId                              │
│     label: string                           │
│     icon: string (emoji UTF-8)              │
│     baseMode: 'assisted' | 'autonomous'     │
│     theme: ModeThemeOverrides               │
│     nodeTypes: NodeTypeDefinition[]         │
│     connectionTypes: ConnectionTypeDef[]    │
│     oxygenRules: OxygenRuleSet              │
│     frictionBehavior: FrictionProfile       │
│     exportFormats: ExportDefinition[]       │
│     canvasLayout: CanvasLayoutHint          │
│   }                                         │
│                                             │
└──────────────┬──────────────────────────────┘
               │
       registerMode(def)
               │
     ┌─────────┴─────────────┐
     │    ENGINE (inchangé)   │
     │                        │
     │  • Canvas 2D           │
     │  • SQLite + UUID       │
     │  • Oxygène (score)     │
     │  • Friction (inject)   │
     │  • Connexions SVG      │
     │  • Toolbar             │
     │  • Thèmes              │
     └────────────────────────┘
```

Chaque mode s'enregistre via `registerMode()`. Le moteur lit la définition active et adapte son comportement. **Aucune logique métier propre à un mode ne doit vivre dans le moteur.**

---

## Interfaces TypeScript

### ModeId

```typescript
type ModeId =
  | 'researcher'    // 🔬 Chercheur
  | 'creative'      // 🎨 Créatif
  | 'philosopher'   // 🧠 Philosophe
  | 'student'       // 📚 Étudiant
  | 'project-lead'  // 📋 Chef de projet
  | 'writer';       // ✍️ Rédacteur
```

### ModeDefinition

```typescript
interface ModeDefinition {
  id: ModeId;
  label: string;                    // ex: "Mode Chercheur"
  labelShort: string;               // ex: "Chercheur"
  icon: string;                     // emoji UTF-8 (jamais hex escape)
  description: string;              // tooltip / onboarding

  // Héritage du mode de base existant
  baseMode: 'assisted' | 'autonomous';

  // Surcharges visuelles
  theme: ModeThemeOverrides;

  // Sémantique
  nodeTypes: NodeTypeDefinition[];
  connectionTypes: ConnectionTypeDefinition[];

  // Comportement
  oxygenRules: OxygenRuleSet;
  frictionBehavior: FrictionProfile;

  // Canvas
  canvasLayout: CanvasLayoutHint;

  // Sortie
  exportFormats: ExportDefinition[];
}
```

### NodeTypeDefinition

```typescript
interface NodeTypeDefinition {
  id: string;                       // ex: 'hypothesis', 'idea', 'task'
  label: string;                    // affiché dans le menu création
  icon: string;                     // emoji UTF-8
  color: string;                    // CSS custom property ou hex
  defaultStatus?: string;           // statut initial (ex: 'pending')
  availableStatuses?: StatusDef[];  // statuts possibles pour ce type
}

interface StatusDef {
  id: string;                       // ex: 'validated', 'refuted', 'blocked'
  label: string;
  icon: string;
  color: string;
}
```

### ConnectionTypeDefinition

```typescript
interface ConnectionTypeDefinition {
  id: string;                       // ex: 'implies', 'resonance', 'supports'
  label: string;
  color: string;                    // couleur du trait SVG
  style: 'solid' | 'dashed' | 'dotted';
  animated: boolean;                // particules SMIL oui/non
  directional: boolean;             // flèche oui/non
  glowColor?: string;              // override glow pulsé
}
```

### OxygenRuleSet

```typescript
interface OxygenRuleSet {
  // Le score reste 0-100, calcul snapshot.
  // Chaque mode définit le POIDS de chaque facteur.
  weights: {
    structural: number;             // poids composante structurelle
    echo: number;                   // poids détection répétition
    tagDiversity: number;           // poids diversité tags/types
    friction: number;               // poids friction acceptée
  };

  // Seuils personnalisés par mode
  thresholds: {
    breathe: number;                // défaut 50
    stale: number;                  // défaut 30
  };

  // Descriptions contextuelles pour l'UI
  zoneLabels: {
    breathe: string;                // ex: "Exploration active" / "Argumentation solide"
    stale: string;                  // ex: "Convergence prématurée" / "Pas de preuve nouvelle"
    asphyxia: string;               // ex: "Fixation détectée" / "Structure déséquilibrée"
  };
}
```

### FrictionProfile

```typescript
interface FrictionProfile {
  // Type de friction dominant
  style: 'counter-argument'         // Chercheur : injecter l'objection
       | 'anti-convergence'         // Créatif : empêcher la fixation
       | 'socratic'                 // Philosophe : questionner les prémisses
       | 'pedagogic'               // Étudiant : guider sans donner la réponse
       | 'stress-test'             // Chef de projet : tester la robustesse
       | 'gap-detection';          // Rédacteur : repérer les trous

  // Intensité de base (0-1), modulable par F001 slider si implémenté
  baseIntensity: number;

  // Prompts système injectés quand oxygène < stale
  promptTemplates: {
    mild: string;                   // oxygène entre stale et breathe
    strong: string;                 // oxygène < stale (asphyxia)
  };

  // Trigger conditions spécifiques au mode
  triggers: FrictionTrigger[];
}

interface FrictionTrigger {
  condition: string;                // description lisible (pour doc + LLM)
  detector: string;                 // nom de la fonction détecteur à appeler
  response: string;                 // template de friction à injecter
}
```

### CanvasLayoutHint

```typescript
interface CanvasLayoutHint {
  // Suggestion de disposition initiale
  defaultLayout: 'freeform'         // Créatif, Philosophe : canvas vide
                | 'tree'            // Chercheur, Rédacteur : structure arborescente
                | 'timeline'        // Chef de projet : axe temporel
                | 'columns';        // Étudiant : colonnes par statut

  // Activation parallax (F027 vue profondeur)
  depthViewEnabled: boolean;

  // Grille d'accroche optionnelle
  snapToGrid: boolean;
  gridSize?: number;                // px
}
```

### ExportDefinition

```typescript
interface ExportDefinition {
  id: string;                       // ex: 'academic-graph', 'outline-md'
  label: string;                    // affiché dans le menu export
  format: 'markdown' | 'json' | 'html' | 'docx' | 'png' | 'svg';
  generator: string;                // nom du module d'export à appeler
  description: string;
}
```

---

## Stockage SQLite

### Nouvelle table `modes`

```sql
CREATE TABLE IF NOT EXISTS modes (
  id TEXT PRIMARY KEY,              -- ModeId
  definition TEXT NOT NULL,         -- JSON sérialisé de ModeDefinition
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Extension table `nodes`

```sql
-- Ajout colonnes (migration)
ALTER TABLE nodes ADD COLUMN mode_id TEXT REFERENCES modes(id);
ALTER TABLE nodes ADD COLUMN node_type TEXT DEFAULT 'default';
ALTER TABLE nodes ADD COLUMN status TEXT DEFAULT NULL;
```

### Extension table `connections`

```sql
-- Ajout colonne (migration)
ALTER TABLE connections ADD COLUMN connection_type TEXT DEFAULT 'implies';
```

### Extension table `canvas` (ou équivalent)

```sql
-- Chaque canvas est lié à un mode
ALTER TABLE canvas ADD COLUMN mode_id TEXT REFERENCES modes(id);
```

> **Note migration** : les nœuds/connexions existants reçoivent `mode_id = NULL` (rétrocompatible). Le moteur traite `NULL` comme le comportement actuel (assisté/autonome classique).

---

## Fichiers à créer

```
src/
├── modes/
│   ├── mode-registry.ts            # registerMode(), getActiveMode(), switchMode()
│   ├── mode-types.ts               # toutes les interfaces ci-dessus
│   ├── mode-defaults.ts            # les 6 définitions de mode
│   ├── mode-migration.ts           # migration SQLite (ajout colonnes)
│   └── definitions/
│       ├── researcher.ts            # ModeDefinition chercheur
│       ├── creative.ts              # ModeDefinition créatif
│       ├── philosopher.ts           # ModeDefinition philosophe
│       ├── student.ts               # ModeDefinition étudiant
│       ├── project-lead.ts          # ModeDefinition chef de projet
│       └── writer.ts                # ModeDefinition rédacteur
```

### Fichiers existants à modifier

| Fichier | Modification |
|---------|-------------|
| `canvas-manager.ts` | Lire `getActiveMode()` pour filtrer `nodeTypes` et `connectionTypes` disponibles |
| `oxygen-gauge.ts` | Lire `oxygenRules` du mode actif pour les poids et seuils |
| `friction-engine.ts` (ou équivalent) | Lire `frictionBehavior` du mode actif pour style + prompts |
| `connection-renderer.ts` | Lire `connectionTypes` du mode actif pour couleur/style/animation |
| `toolbar.ts` | Adapter les boutons de création au `nodeTypes` du mode actif |
| `export-manager.ts` (ou à créer) | Lire `exportFormats` du mode actif |
| CSS mode files | Chaque mode peut surcharger via `ModeThemeOverrides` (couleur accent, etc.) |

---

## Mode Registry — API

```typescript
// mode-registry.ts

const registry = new Map<ModeId, ModeDefinition>();

export function registerMode(def: ModeDefinition): void {
  registry.set(def.id, def);
}

export function getMode(id: ModeId): ModeDefinition {
  const mode = registry.get(id);
  if (!mode) throw new Error(`Mode inconnu: ${id}`);
  return mode;
}

export function getActiveMode(): ModeDefinition {
  // Lit le mode actif depuis le state manager / localStorage / canvas courant
  const activeId = getCurrentModeId();
  return getMode(activeId);
}

export function switchMode(id: ModeId): void {
  // 1. Valider que le mode existe
  // 2. Sauvegarder état canvas courant
  // 3. Appliquer ModeThemeOverrides (CSS custom properties)
  // 4. Recharger toolbar (nodeTypes du nouveau mode)
  // 5. Recharger connexions disponibles
  // 6. Recalculer oxygène avec nouveaux poids
  // 7. Émettre event 'mode:switched'
}

export function getAllModes(): ModeDefinition[] {
  return Array.from(registry.values());
}
```

---

## Intégration avec l'existant

### Assisté / Autonome → baseMode

Les 2 modes actuels deviennent le **socle comportemental**. Chaque mode-persona hérite de l'un des deux :

| Mode persona | baseMode | Raison |
|-------------|----------|--------|
| Chercheur | `assisted` | Besoin de guidance, validation active |
| Créatif | `autonomous` | Canvas libre, pas d'interférence |
| Philosophe | `autonomous` | Exploration profonde, pas de suggestion |
| Étudiant | `assisted` | Besoin de guidage pédagogique |
| Chef de projet | `assisted` | Structure imposée, alertes actives |
| Rédacteur | `assisted` | Détection de trous, suggestions structure |

### CSS

Chaque mode ajoute une classe sur le conteneur racine :

```css
/* Le body ou #app reçoit la classe du mode */
.mode-researcher { /* surcharges */ }
.mode-creative { /* surcharges */ }
/* etc. */
```

Les fichiers `assisted.css` et `autonomous.css` existants (non-layered, priorité max) continuent de fonctionner. Les surcharges mode viennent AVANT dans la cascade (via `ModeThemeOverrides` injectées en CSS custom properties).

### Events

Nouvel event à émettre :

```typescript
// Quand le mode change
eventBus.emit('mode:switched', { from: oldModeId, to: newModeId });

// Les sous-modules écoutent et se reconfigurent
eventBus.on('mode:switched', ({ to }) => {
  const mode = getMode(to);
  // reconfigurer avec mode.oxygenRules, mode.frictionBehavior, etc.
});
```

> **Attention C003** : vérifier que le préfixe d'event est cohérent. Utiliser `mode:` comme namespace.

---

## Sélecteur de mode — UX

### Point d'entrée

À la création d'un nouveau canvas (ou au premier lancement), l'utilisateur choisit son mode. Grille de 6 cartes identique au design actuel du site (screenshot).

### Changement en cours de session

Un indicateur compact dans la toolbar (icône + label court) permet de voir le mode actif. Le changement de mode en cours de canvas est **possible mais avec avertissement** : les nœuds existants dont le type n'existe pas dans le nouveau mode deviennent `type: 'generic'` (pas de perte de données).

---

## Ordre d'implémentation recommandé

```
Phase 1 — Fondation (cette feature F032)
  ├── mode-types.ts (interfaces)
  ├── mode-registry.ts (register/get/switch)
  ├── mode-migration.ts (ALTER TABLE)
  ├── 6 fichiers definitions/ (squelettes, contenu minimal)
  ├── Intégration toolbar (sélecteur de mode)
  └── Tests unitaires (registre, switch, migration)

Phase 2 — Câblage moteur
  ├── canvas-manager lit nodeTypes du mode actif
  ├── oxygen-gauge lit oxygenRules du mode actif
  ├── friction-engine lit frictionBehavior du mode actif
  ├── connection-renderer lit connectionTypes du mode actif
  └── Tests intégration

Phase 3 — Enrichissement par mode (itératif)
  ├── Chercheur (prioritaire, aligne avec F028)
  ├── Rédacteur
  ├── Chef de projet
  ├── Créatif
  ├── Philosophe
  └── Étudiant

Phase 4 — Exports spécifiques
  ├── export-manager.ts
  └── Un générateur par format listé dans ExportDefinition
```

---

## Règles pour Claude Code

- IDs : `crypto.randomUUID()` uniquement
- Emojis CSS : littéral UTF-8 (`'🔬'`), jamais hex escape
- Hooks : appeler via `cm.method()`, jamais la fonction locale
- Hover `.pole` : garder `scale(max(var(--node-scale, 1), 1.08))`
- SVG : jamais `feGaussianBlur` sur éléments animés
- Event prefix : `mode:` pour tous les events du système de modes
- Après implémentation : lancer les 343+ tests Vitest existants
- Nouvelles interfaces dans `mode-types.ts`, pas dispersées

---

## Résumé en une phrase

> Un registre de modes branché sur le moteur existant via 7 interfaces typées. Chaque mode déclare ses types de nœuds, connexions, règles d'oxygène, profil de friction et formats d'export. Le moteur lit la définition active — aucune logique métier par mode dans le moteur.

| ID | Priorité | Description | Estimation |
|---|---|---|---|
| F028 | **HAUTE** | **Mode Scientifique — Phase 2** (3ème mode, statuts sémantiques, cycle de vie des vignettes) | ⚠️ Chantier majeur — voir spec détaillée |
| F021 | ~~Haute~~ | ~~Onglets multi-canvas~~ | **Implémenté** — voir Features terminées |
| F001 | Moyenne | Curseur de friction (contrôle utilisateur du niveau) | Après stabilisation Oxygen |
| F002 | Moyenne | Export PDF/SVG avancé (multi-pages, vectoriel, zone au choix) | 3-4h |
| F003 | Moyenne | Pôles conteneurs (groupement, réduction/extension, drag groupé) | 6-8h |
| F004 | Basse | Auto-layout force-directed (type D3.js, animation fluide) | 4-5h |
| F011 | Basse | Documentation intégrée (5ème entry point HTML, rendu markdown, recherche) | 6-8h |

---

### Specs détaillées — Features planifiées

#### F021 — Onglets multi-canvas ✓ IMPLÉMENTÉ (22 fév. 2026)

Barre d'onglets navigateur au-dessus de la toolbar en mode assisté. Switch instantané entre canvas ouverts.

**Implémenté** :
- Tab bar (`tab-bar.ts` ~300 lignes, `tab-bar.css` ~100 lignes) : click switch, × ferme, [+] nouveau, double-clic renomme inline
- Menu contextuel clic droit (Renommer, Fermer, Fermer les autres, Mes graphes)
- Middle-click ferme l'onglet. Dernier onglet → retour landing
- Raccourcis Ctrl+T (nouveau) / Ctrl+W (fermer)
- État persisté `localStorage('kairos_open_tabs')`, validé contre SQLite au démarrage
- Synchronisé avec la modale "Mes graphes" (ouvrir/nouveau/dupliquer/supprimer/renommer)
- `cleanupEmptyCanvases()` protège les canvas avec onglets ouverts
- 11 tests unitaires (369 total, tous passent)
- Override `prefers-reduced-motion` dans `reset.css`

**Fichiers** : `assisted/app/tab-bar.ts` (nouveau), `styles/components/tab-bar.css` (nouveau), `assisted.html`, `toolbar.css`, `assisted-app.ts`, `canvas-modal.ts`, `canvas-manager.ts` (modifiés)

**Non implémenté (v2)** : drag & drop entre onglets, mode autonome (assisté uniquement pour l'instant)

#### F023 — Version bêta web (abandonné)

**Supprimé.** Version allégée de KAIROS pour intégration iframe — fonctionnalité abandonnée. Tous les fichiers web supprimés (web.html, web-app.ts, web/, web.css, vite.web.config.js).

#### F028 — Mode Scientifique (Phase 2) ⚠️ VIGILANCE ACCRUE

> **Chantier majeur** — touche au modèle de données, à la BDD, à la landing page, et crée un 3ème mode complet. Chaque étape doit être testée en isolation. Ne pas mélanger avec d'autres features. Migrations BDD irréversibles : tester sur une copie de la base avant tout.

**Vision** : Un 3ème mode conçu pour la recherche et l'investigation méthodique. Contrairement au mode Assisté (vignettes libres), le mode Scientifique structure le cycle de vie de chaque vignette via des **statuts sémantiques**.

**Statuts sémantiques** (cycle de vie d'une vignette) :
| Statut | Sens | Couche Z (Vue Profondeur) | Limite |
|---|---|---|---|
| `focus` | Ce sur quoi l'utilisateur travaille maintenant | Layer 3 (premier plan) | 2-3 max |
| `active` | Chantier en cours, investigation ouverte | Layer 2 | Illimité |
| `validated` | Contenu stabilisé, confirmé, socle de référence | Layer 2 | Illimité |
| `archived` | Idées abandonnées, brouillons dépassés, hypothèses réfutées | Layer 0 (fond) | Illimité |
| `absorbed` | Intégrée dans une synthèse. Lien vers synthèse parent | Layer 0 | Auto via SYNTHÉTISER |

Statuts potentiels futurs : `hypothesis`, `contradicted`, `pending-review`.

**Impact BDD** :
- Nouveau champ `depth_status TEXT DEFAULT 'active'` sur la table `nodes` (migration ALTER TABLE)
- Contrainte CHECK sur les valeurs autorisées
- La colonne `status` existante (`neutral`/`priority`) reste indépendante (ancre structurelle)
- `depth_status` n'existe que pour les canvas en mode `scientific` (les canvas assisté/autonome l'ignorent)

**Landing page** :
- 3ème carte mode "Scientifique" (nom/icône/description à définir)
- Nouveau mode dans la table `canvases` : `mode: 'assisted' | 'autonomous' | 'scientific'`

**Fichiers à créer** :
- `src/renderer/scientific.html` — 5ème entry point HTML
- `src/renderer/js/scientific-app.ts` — Orchestrateur du mode (pattern de assisted-app.ts)
- `src/renderer/js/scientific/` — Sous-modules (statut-manager, transitions, metrics)
- `src/renderer/styles/scientific.css` — Styles mode-spécifiques (non-layered, accent couleur à définir)

**Fichiers à modifier** :
- `src/database/db.js` — Migration `depth_status` + nouveau CHECK
- `src/database/repositories/nodes.js` — CRUD depth_status
- `src/renderer/js/types/kairos.ts` — `KairosNode.depthStatus?: DepthStatus`
- `src/renderer/js/canvas/depth-view.ts` — Nouvelle `depthBySemantic()` utilisant `depth_status`
- `src/renderer/landing.html` + `styles/landing.css` — 3ème carte
- `main.js` — Nouveau entry point dans loadURL/loadFile
- `vite.config.js` — Nouveau entry point multi-page
- `preload.js` — Potentiellement de nouvelles API IPC

**Intégration Vue Profondeur (F027)** :
- En mode Scientifique, le critère Z par défaut = `depthBySemantic` (statut détermine la couche)
- `setDepthLayerFn(depthBySemantic)` appelé à l'init du mode
- Les tokens CSS de profondeur sont réutilisés tel quel

**Transitions entre statuts** :
- `active → focus` : action utilisateur (max 2-3 focus simultanés, enforce côté TS)
- `focus → active` : action utilisateur (ou auto quand un autre nœud prend le focus)
- `active → validated` : action utilisateur (confirmation explicite)
- `validated → active` : action utilisateur (réouverture)
- `any → archived` : action utilisateur
- `active → absorbed` : automatique via SYNTHÉTISER (lien vers synthèse parent stocké)
- Pas de transition directe `archived → focus` (obliger à passer par `active`)

**UI de gestion des statuts** :
- Menu contextuel enrichi (clic droit sur vignette → section "Statut")
- Raccourcis clavier (1=focus, 2=active, 3=validated, 4=archived)
- Éventuellement : drag & drop vers des zones de dépôt (drop zones latérales par statut)
- Indicateur visuel par statut (icône + couleur de bordure + badge)

**Métriques spécifiques au mode** :
- Taux de validation (validated / total non-archived)
- Couverture (ratio de l'espace conceptuel exploré)
- Progression (combien de vignettes ont avancé dans le cycle)
- Intégration Oxygen : le score pourrait pondérer les statuts

**⚠️ Points de vigilance** :
1. **Migration BDD** : `ALTER TABLE nodes ADD COLUMN depth_status` — tester sur copie, prévoir rollback
2. **Rétrocompatibilité** : Les canvas assisté/autonome existants ne doivent PAS être affectés par le nouveau champ
3. **Performance** : Avec >100 vignettes + statuts + Vue Profondeur, surveiller les recalculs
4. **Complexité UI** : Pas tout implémenter d'un coup — commencer par les statuts de base (focus/active/validated/archived), ajouter absorbed + transitions auto après
5. **Tests** : Écrire des tests unitaires pour les transitions de statut AVANT d'implémenter l'UI
6. **Pas de régression** : Les modes assisté et autonome doivent être 100% identiques avant/après

**Stratégie de branche** : Développer sur `feature/scientific-mode` (branche dédiée depuis `main`).
- **Isolable** (nouveaux fichiers, pas de conflit) : `scientific.html`, `scientific-app.ts`, `scientific/`, `scientific.css`, `depthBySemantic()` dans `depth-view.ts`
- **Touche à l'existant** (merge attentif) : `db.js` (migration), `repositories/nodes.js`, `types/kairos.ts`, `landing.html`, `landing.css`, `main.js`, `vite.config.js`
- Merge vers `main` uniquement après validation complète de chaque étape sur la branche

**Plan d'exécution suggéré** (par étapes indépendantes) :
1. Migration BDD + types TS + repository (sans UI)
2. `depthBySemantic()` dans depth-view.ts (testable isolément)
3. Landing page : 3ème carte + entry point HTML minimal
4. scientific-app.ts : orchestrateur squelette (canvas + toolbar + statuts)
5. UI de changement de statut (menu contextuel + raccourcis)
6. Indicateurs visuels par statut (CSS)
7. Transitions automatiques (absorbed via SYNTHÉTISER)
8. Métriques spécifiques

### Roadmap future

---

## 3. Version Bêta — Plan de lancement

### Phase A — Bêta privée (10-20 testeurs) — Priorité immédiate

**Objectif** : Quelqu'un d'autre que le créateur peut installer l'app, comprendre ce qu'elle fait, et l'utiliser sans assistance.

#### A1. Onboarding (priorité n°1)

| ID | Tâche | Approche | Estimation |
|---|---|---|---|
| BETA-01 | **Premier démarrage** | Écran/flow dédié au tout premier lancement : explication du concept KAIROS, choix du provider LLM, canvas démo optionnel | 6-8h |
| BETA-02 | **Canvas démo pré-rempli** | 5-6 vignettes + connexions, montre DÉVELOPPER/RELIER/SYNTHÉTISER en action. Chargeable depuis le premier démarrage ou depuis la landing page | 2-3h |
| BETA-03 | **Tooltips contextuels** | Coach marks légers au premier lancement du mode assisté : boutons opérations, jauge O₂, bandeau suggestion, tiroir toolbar | 4-6h |
| BETA-04 | **Guide config LLM** | Améliorer le modal de configuration : instructions claires par provider ("Où trouver ma clé API ?"), liens directs, validation de clé avec feedback visuel | 3-4h |

#### A2. Robustesse (priorité n°2)

| ID | Tâche | Approche | Estimation |
|---|---|---|---|
| BETA-05 | **Error boundaries** | Catch des erreurs critiques (LLM timeout, SQLite fail, DOM crash) avec message utilisateur clair au lieu d'un écran blanc | 3-4h |
| BETA-06 | **Backup automatique SQLite** | Copie périodique de `kairos.db` (toutes les 30 min ou à la fermeture) dans un dossier `backups/` avec rotation (5 derniers) | 2-3h |
| BETA-07 | **Logs exportables** | Bouton "Exporter les logs" dans les settings pour faciliter le debug des retours testeurs | 1-2h |
| BETA-08 | **Validation clé API au démarrage** | Test de connexion silencieux au provider configuré, notification si la clé est invalide/expirée | 2-3h |

#### A3. Build & Distribution (priorité n°3)

| ID | Tâche | Approche | Estimation |
|---|---|---|---|
| BETA-09 | **Build Windows propre** | Vérifier electron-builder, icône, metadata, installeur NSIS. Tester sur une machine vierge | 2-3h |
| BETA-10 | **GitHub Releases** | Publier le `.exe` sur GitHub Releases (privé ou public). README d'installation avec screenshots | 1-2h |
| BETA-11 | **Formulaire retours** | Google Form ou equivalent, lien accessible depuis l'app (menu aide ou footer landing) | 1h |

**Total estimé Phase A** : ~25-40h

### Phase B — Bêta semi-publique (50-100 utilisateurs) — Après retours Phase A

| ID | Tâche | Notes |
|---|---|---|
| BETA-12 | Signature Windows (certificat code signing) | Supprime l'avertissement SmartScreen |
| BETA-13 | Auto-updater (electron-updater + GitHub Releases) | Indispensable pour itérer vite |
| BETA-14 | Build Mac `.dmg` | Signature Apple ($99/an) si budget |
| BETA-15 | Landing page web (vitrine, pas l'app) | Présentation + lien téléchargement |
| BETA-16 | Analytics d'usage basiques (opt-in) | Comprendre ce que les gens utilisent vraiment |
| BETA-17 | Onboarding enrichi selon retours Phase A | Itérer sur les points de friction identifiés |

### Phase C — Bêta publique — Après stabilisation Phase B

| ID | Tâche | Notes |
|---|---|---|
| BETA-18 | Mode scientifique (F028) comme différenciateur | Feature flagship |
| BETA-19 | 2-3 canvas templates thématiques | Recherche, rédaction, brainstorming |
| BETA-20 | Vidéo démo 2 min | Pour Product Hunt / réseaux |
| BETA-21 | Site web avec documentation | Docs utilisateur, pas juste dev |

---

**v0.4.x (Q2 2026)** — Après bêta privée
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
