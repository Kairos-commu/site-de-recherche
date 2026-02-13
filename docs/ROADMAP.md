# KAIROS — Roadmap & Bugs

**Version :** 0.3.x — Février 2026

---

## 1. Bugs Actifs

### Bugs connus

| ID | Sévérité | Description | Notes |
|---|---|---|---|
| B001 | Moyenne | Performance >200 vignettes (rendu lent) | A008 corrigé (Map O(1)), A035 corrigé (spatial-grid). Amélioration partielle. |
| B002 | Basse | Capture webview timeout 8s sur certains providers | Fallback manuel dispo. A034 mitigé (sélecteurs centralisés). |

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
| F008 | Tests unitaires Vitest | 218 tests, 8 fichiers. Script : `npm run test:unit`. |
| F015 | Suppression attracteurs + Diagnostic structurel | Attracteurs (scoring, badges, qualification LLM) supprimés (~1000 lignes). Remplacés par `graph-diagnostic.ts` : diagnostic structurel (dominance, ponts, redondances, trous) affiché dans le popup de synthèse. |
| F014 | Tests pipeline LLM → connexions | 69 tests (unit) + 6 tests (e2e). Couvre parsing, matching 5 niveaux, orchestration, validation, intégration bout-en-bout. |
| F009 | Logging structuré | `createLogger(tag)` avec niveaux DEBUG/INFO/WARN/ERROR/SILENT. |
| F010 | Documentation architecture | Consolidation docs en `doc projet/`. |
| F012 | Thèmes visuels | 4 thèmes (Obsidian/Porcelain/Aurora/Kraft), CSS tokens `--theme-*`, anti-FOUC. |

### Features planifiées

| ID | Priorité | Description | Estimation |
|---|---|---|---|
| F001 | Moyenne | Curseur de friction (contrôle utilisateur du niveau) | Après stabilisation Oxygen |
| F002 | Moyenne | Export PDF/SVG avancé (multi-pages, vectoriel, zone au choix) | 3-4h |
| F003 | Moyenne | Pôles conteneurs (groupement, réduction/extension, drag groupé) | 6-8h |
| F004 | Basse | Auto-layout force-directed (type D3.js, animation fluide) | 4-5h |
| F011 | Basse | Documentation intégrée (5ème entry point HTML, rendu markdown, recherche) | 6-8h |
| F013 | Moyenne | Layout arbre hiérarchique (détails ci-dessous) | 3-4h |

### F013 — Layout arbre hiérarchique (spec)

Bouton "Arbre" qui réorganise les vignettes en arbre top-down via connexions `implies`.

**Algorithme** : Graphe dirigé `implies` → racines = nœuds sans parent → BFS profondeur → barycentre par couche → positionnement (`LAYER_GAP=200px`, `NODE_GAP=350px`). `resonance` ignorées pour la hiérarchie. Composantes déconnectées côte à côte.

**Fichiers** : `canvas/tree-layout.ts` (nouveau), `canvas.ts` (wrapper), `assisted.html` + `index.html` (boutons), `toolbar.ts` (setup), `canvas.css` (style disabled).

**Comportement** : Disabled tant qu'une vignette a `newlyImported === true` (assisté). Toujours actif en autonome. CSS transition 0.5s + RAF pour connexions SVG. `history.saveState()` avant → Ctrl+Z revient.

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
