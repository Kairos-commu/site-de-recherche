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
| B007 | ~~Basse~~ | Bouton "Vignette" (toolbar primaire) déclenchait `metrics.recalculateDebounced()` via le hook `createNode`, causant un recalcul oxygen non voulu. Le bouton était redondant (double-clic canvas + menu contextuel créent aussi des vignettes). | **Résolu** — Bouton supprimé de `assisted.html`, handler retiré de `toolbar.ts`, méthode `createNewNode()` retirée de `assisted-app.ts`, CSS `#create-pole-btn` retiré de `toolbar.css`. |

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
| F008 | Tests unitaires Vitest | 308 tests, 12 fichiers. Script : `npm run test:unit`. |
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

### Features planifiées

| ID | Priorité | Description | Estimation |
|---|---|---|---|
| F028 | **HAUTE** | **Mode Scientifique — Phase 2** (3ème mode, statuts sémantiques, cycle de vie des vignettes) | ⚠️ Chantier majeur — voir spec détaillée |
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

**Fichiers probables** : `canvas/tab-bar.ts` (nouveau), `assisted.html` + `index.html` (conteneur onglets), `canvas-manager.ts` (switch logic), `assisted.css` + `styles/components/` (styles tab bar).

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
