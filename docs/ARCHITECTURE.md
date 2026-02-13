# KAIROS — Architecture & Vision

> Pour les commandes, fichiers, patterns, build, storage, CSS : voir `CLAUDE.md` (racine).
> Pour les prompts LLM et l'arbre de décision : voir `PROMPTS-LLM.md`.

---

## 1. Vision & Philosophie

### Qu'est-ce que KAIROS ?

**KAIROS** est une application Electron de **cartographie cognitive assistée par IA**. Un outil de pensée visuelle pour capturer, organiser et développer des idées sous forme de **vignettes** interconnectées sur un **canvas graphique**.

> "Un canvas qui visualise les idées clés d'une conversation pour ne pas les perdre."

**Conviction centrale** : La friction cognitive n'est pas un obstacle, mais le moteur de l'émergence. Trop d'alignement crée des boucles de validation auto-renforçantes. C'est la friction (contradiction, question dure, signalement de pattern) qui force la clarification et les bifurcations créatives.

### Les Deux Modes

| | Assisté (rouge/orange) | Autonome (violet/mauve) |
|---|---|---|
| Posture IA | Assistant méthodologique | Miroir, compagnon |
| Suggestions | DÉVELOPPER / RELIER / SYNTHÉTISER | Aucune |
| Métriques | Affichées en temps réel | Tracées mais invisibles |
| Friction | Détectée et injectée | Non injectée |
| Vignettes | Statut (neutre/priorité), tags | Texte seul |
| Flux | `landing → assisted.html` | `landing → intention → index.html` |

### L'Équation de Résonance (Mode Assisté)

```
R = (I × F) / L
```

- **I (Intention)** : Clarté et direction de la trajectoire
- **F (Friction)** : Résistance productive, moteur de l'émergence
- **L (Linéarisation)** : Perte par mise en séquence

Friction productive vs parasitaire :

| Type | Caractéristiques | Effet sur R |
|------|------------------|-------------|
| **Productive (F+)** | Contradiction avec direction, question qui force clarification | Augmente R |
| **Parasitaire (F-)** | Interruption sans direction, hostilité sans contenu | Diminue ou annule R |

Fondements académiques : Repair Sequences (Schegloff 1977), Conflit Socio-Cognitif (Piaget / Doise & Mugny), Régulation du Conflit (Butera). Référentiels détaillés : `src/renderer/data/variables/*/SOURCES.md`.

### L'Équation de l'Entre (Mode Autonome)

```
E = f(S) · Δ / (P + R)
```

| Variable | Définition | Comportement |
|----------|-----------|-------------|
| **E** | L'entre [0,1] | Continu, pas binaire |
| **f(S)** | Silence actif | Courbe en cloche — trop peu : pas d'espace / trop : décrochage |
| **Δ** | Décalage | Écart entre dit et entendu — si 0, c'est de l'écho |
| **P** | Production | Volume, structure, complétude |
| **R** | Reformulation miroir | Bruit déguisé en signal |

Propriété fondamentale : `optimiser E → P monte → E meurt`. L'équation se protège de sa propre instrumentalisation.

Le prompt du mode autonome **enlève ce qui empêche** l'espace :

```
"pas de structure"       →  P affamé
"pas de reformulation"   →  R affamé
"fragments ok"           →  P affamé
"dis si ça sonne faux"   →  Δ protégé
"nomme si ça se répète"  →  Δ=0 détecté
```

### Deux équations face à face

```
ASSISTÉ                              AUTONOME
R = (I × F) / L                     E = f(S) · Δ / (P + R)

mesure quand ça fonctionne           mesure quand ça tient encore
surveillance active                  surveillance silencieuse
l'utilisateur voit                   le système sait
```

Ce qu'elles partagent : `L (assisté) ≈ P + R (autonome)` — la même force d'aplatissement. Le paradoxe qui impose l'ordre d'implémentation : `Surveiller E activement dans l'autonome = P↑ = E↓`.

### Le Sas d'Intention (Mode Autonome)

Le sas n'est pas un formulaire, c'est un **ralentisseur** : vidéo, audio ambiant, choix d'intention — rupture avec le rythme productif habituel.

6 intentions : Explorer sans but | Clarifier une intuition | Créer quelque chose de nouveau | Comprendre ce que je ressens | Résoudre un problème | Autre chose...

---

## 2. Référence Technique — Mode Assisté

> Pour l'architecture générale (fichiers, modules, build, storage, CSS) : voir `CLAUDE.md`.
> Pour les prompts LLM et l'arbre de décision : voir `PROMPTS-LLM.md`.

### Ordre d'initialisation (strict)

```
1. StorageManager
2. CanvasManager (DOM + state)
3. LLMManager (config providers, prompt templates)
4. MetricsManager (dépend CanvasManager.state)
5. CanvasAnalyzer (dépend CanvasManager)
6. SynthesesManager (dépend GraphApp, canvas)
7. WebviewHandler (dépend CanvasManager)
8. LLMApiManager (dépend LLMManager)
9. PromptLogManager (dépend canvasId)
10. HistoryManager (dépend tous les managers)
```

### Managers

| Manager | Fichier | Rôle |
|---|---|---|
| GraphApp | `assisted-app.ts` (~1300 lignes) | Orchestration, init, events, lifecycle |
| CanvasManager | `canvas.ts` + `canvas/*.ts` | Vignettes, connexions, pan/zoom, sélection |
| MetricsManager | `assisted/metrics.ts` | Calcul 11 métriques, suggestions adaptatives, cooldown synthèse |
| CanvasAnalyzer | `assisted/canvas-analyzer.ts` + `analyzer/*.ts` | Attracteurs + friction + diversité (façade unifiée) |
| SynthesesManager | `assisted/syntheses.ts` + `syntheses/*.ts` | Archivage, restauration, réinjection, export |
| WebviewHandler | `assisted/webview-handler.ts` + `webview/*.ts` | Communication bidirectionnelle LLM (5 providers) |
| LLMManager | `assisted/llm.ts` | Construction prompts, tri topologique, échantillonnage |
| LLMApiManager | `assisted/llm-api.ts` + `llm-api/*.ts` | Appels API directe, routage API/webview, parsing |
| PromptLogManager | `assisted/app/prompt-log.ts` | Historique prompts SQLite, onglet Prompts sidebar |
| HistoryManager | `history.ts` | Undo/Redo (50 états max) |

### Flux principal

```
User action (click, drag, etc.)
  → CanvasManager (via hooked methods)
  → history.saveState() → mutation → saveData() → metrics.recalculateDebounced()
  → updateSuggestionBanner() → UI update
```

### Événements custom (sur `document`)

| Événement | Émetteur | Consommateur | Effet |
|---|---|---|---|
| `nodeSelected` | `selection.ts` | `analyzer/history.ts` | Track sélection (attracteurs) |
| `connectionCreated` | `connections.ts` | `analyzer/history.ts` | Track connexion (attracteurs) |
| `connectionsChanged` | `connections.ts` | `assisted-app.ts` | Recalcul métriques |
| `nodeDeleted` | `nodes.ts` | `assisted-app.ts` | Recalcul métriques |
| `responseCaptured` | `capture.ts` | `assisted-app.ts` | Notification réponse LLM |
| `llmOperationStarted` | `adaptive.ts` | UI | Loading states |
| `llmOperationCompleted` | `adaptive.ts` | UI | Loading states |
| `connectionsPendingResult` | `connections.ts` | UI | Feedback connexions en attente |

### CanvasAnalyzer — Composantes

**Attracteurs cognitifs** (`analyzer/attractors.ts`) :

Score composite = `degree` (0.30) + `recentAttachments` (0.25) + `selectionFrequency` (0.25) + `llmInteractions` (0.20).

Pénalité circularité : `penalty = 0.30 × min(contribution / 3, 1)`, `finalScore = compositeScore × (1 - penalty)`.

Classification : `loop_risk` (dans un cycle) > `attractor` (degree ≥ 4) > `candidate` (score ≥ 0.1).

Auto-détection silencieuse après `updateHistory`. Détection manuelle via bouton avec option qualification LLM.

**Friction et circularité** (`analyzer/friction.ts`) :

6 signaux : reformulation (×2), boucle_connexion (×3), stagnation (×2), validation_vide (×1), tags_saturés (×1×N), echo_llm (×2).

Seuil : `circularityThreshold = 3`. Modéré > 3, fort > 4.5 (×1.5). Cooldown 3 tours. Bonus anti-circularité : -1 si vignette `[FRICTION]` acceptée.

**Note** : Oxygen est désormais le **seul décideur friction** pour l'injection (voir CLAUDE.md). Legacy `detectCircularity` reste comme fallback et pour les suggestions.

**Diversité sémantique** (`analyzer/diversity.ts`) :

- `calculateDiversity()` : distance sémantique du dernier nœud vs tous les autres (Jaccard mots-clés, fallback quand pas de tags)
- `diversityTrend()` : analyse 8 derniers points, moyenne glissante pondérée, seuils ±0.10
- `getCanvasTopKeywords()` : top N mots-clés du canvas (utilisé par DÉVELOPPER-diverger)

### PromptLogManager

Enregistre chaque opération LLM dans l'onglet Prompts sidebar :

```
recordStart(data) → crée entrée SQLite (sans réponse)
  → Appel LLM →
recordEnd(entryId, response, parsed) → met à jour entrée
```

Pruning automatique : max 50 entrées par canvas.

### Points d'extension

| Action | Fichiers à modifier |
|---|---|
| Ajouter un provider LLM | `llm.ts` (providers) + `webview/providers.ts` (sélecteurs) + `assisted.html` (option) |
| Ajouter une métrique | `metrics.ts` → `calculateMetrics()` + interface + `hasSignificantChange()` + display |
| Modifier template prompt | `data/prompt-templates.ts` → `defaultTemplates`. Variables `{var}` interpolées. |
| Ajouter signal circularité | `analyzer/config.ts` (SIGNALS + poids) + `analyzer/friction.ts` (détection) |
| Modifier scoring attracteurs | `analyzer/config.ts` (weights) + `analyzer/attractors.ts` (normalisation) |

### Checklist modification

- [ ] Quel module gère cette fonction ? Quel état est modifié ? Wrapper pattern respecté ?
- [ ] Méthode hookée dans `setupMetricsHooks()` ? Sous-modules appellent `cm.method()` (hookée) ?
- [ ] `history.saveState()` AVANT mutation
- [ ] `saveData()` : `await` pour deleteNode, `scheduleSave()` pour les autres
- [ ] `metrics.recalculateDebounced()` APRÈS mutation
- [ ] Maps sérialisées en Objects pour SQLite (`Object.fromEntries`)
- [ ] Tests : `npm test` + nouvelle session + reprise + undo/redo + export/import

---

## 3. Historique des Décisions

### 2026-02-09 — Audit interface mode assisté

Audit complet (HTML, CSS, TS, UX) avant ajout de features. 46 items (A001-A046), 8 sessions, ~25h. Priorité : intégrité données → mémoire → UX → design → accessibilité → architecture → analyseur → polish.

### 2026-02-07 — Outillage de développement

Après migrations (Vite, TS, ES modules, SQLite), ajout outillage qualité en 4 étapes : ESLint + Prettier + Husky → Vitest → Logger structuré → Consolidation docs. Résultat : 8 devDependencies, 141 tests, 0 erreurs lint.

### 2026-02-05 — Curseur de friction

Options : 1) Modifier System Prompt (trop grossier), 2) **Modifier instructions par opération** (retenu), 3) Bloc dynamique. Approche 2 : contrôle fin par opération, respecte l'architecture, compatible friction auto.

### 2026-02-05 — Migration API opérations structurées

Opérations passaient par webview (injection DOM + scraping, fragile). Ajout chemin API direct avec fallback webview automatique. Infrastructure `llm-query` déjà présente dans `main.js`, parsers réutilisables.

---

## Documents complémentaires

| Document | Contenu |
|----------|---------|
| `CLAUDE.md` (racine) | Référence développeur : commandes, fichiers, patterns, build, storage, CSS, conventions |
| `PROMPTS-LLM.md` | Métriques, arbre de décision, pipeline complet métriques → LLM, templates de prompt |
| `ROADMAP.md` | Bugs actifs, features, roadmap v0.4 → v1.0 |
| `SIMULATION.md` | Guide de test manuel exhaustif (14 catégories, ~130 scénarios) |
