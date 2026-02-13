# KAIROS - Mode Assisté : Référence Technique

> Document de référence pour le développement du mode assisté.
> À charger avant toute modification pour éviter les bugs.

---

## Table des Matières

1. [Architecture Générale](#1-architecture-générale)
2. [Fichiers et Modules](#2-fichiers-et-modules)
3. [GraphApp - Orchestrateur](#3-graphapp---orchestrateur)
4. [CanvasManager](#4-canvasmanager)
5. [MetricsManager](#5-metricsmanager)
6. [SynthesesManager](#6-synthesesmanager)
7. [CapturesManager](#7-capturesmanager)
8. [WebviewHandler](#8-webviewhandler)
9. [LLMManager](#9-llmmanager)
10. [CanvasAnalyzer (Attracteurs + Friction)](#10-canvasanalyzer-attracteurs--friction)
11. [Prompt Templates & Cadrage Structurel](#11-prompt-templates--cadrage-structurel)
12. [PromptLogManager (Transparence)](#12-promptlogmanager-transparence)
13. [LLMApiManager (API directe)](#13-llmapimanager-api-directe)
14. [Flux d'Événements](#14-flux-dévénements)
15. [Patterns Critiques](#15-patterns-critiques)
16. [Persistance SQLite](#16-persistance-sqlite)
17. [Points d'Extension](#17-points-dextension)
18. [Checklist Modification](#18-checklist-modification)

---

## 1. Architecture Générale

### Hiérarchie des fichiers

```
src/renderer/
├── assisted.html                    # Page principale mode assisté
├── data/
│   ├── prompt-templates.ts          # Templates de prompts centralisés
│   └── variables/                   # Référentiels JSON (équation résonance)
│       └── friction/                # Patterns friction productive/parasitaire
├── js/
│   ├── assisted-app.ts              # GraphApp - Orchestrateur (~1300 lignes, wrappers)
│   ├── canvas.ts                    # CanvasManager (~600 lignes, wrappers)
│   ├── canvas/                      # Sous-modules canvas (ES modules)
│   │   ├── minimap.ts, persistence.ts, filters.ts, collisions.ts
│   │   ├── layout.ts, viewport.ts, connections.ts, selection.ts
│   │   ├── menus.ts, interactions.ts, nodes.ts
│   ├── history.ts                   # HistoryManager - Undo/Redo
│   ├── storage.ts                   # StorageManager - SQLite wrapper via IPC
│   ├── audio-player.ts             # Ambiance sonore
│   │
│   └── assisted/                    # Modules spécialisés
│       ├── metrics.ts               # MetricsManager - Suggestions adaptatives
│       ├── syntheses.ts             # SynthesesManager - Archivage (~125 lignes, wrappers)
│       ├── captures.ts              # CapturesManager - Import conversations
│       ├── webview-handler.ts       # WebviewHandler - Communication LLM (~240 lignes, wrappers)
│       ├── llm.ts                   # LLMManager - Prompts adaptatifs, tri topologique
│       ├── canvas-analyzer.ts       # CanvasAnalyzer - Attracteurs + Friction (~480 lignes, wrappers)
│       ├── llm-api.ts               # LLMApiManager - Appels API directe
│       │
│       ├── app/                     # Sous-modules assisted-app
│       │   ├── session.ts           # Modales session (entrée, choix contexte)
│       │   ├── export.ts            # Export PNG/Markdown
│       │   ├── search.ts            # Recherche vignettes (Ctrl+F)
│       │   ├── history.ts           # Boutons Undo/Redo
│       │   ├── toolbar.ts           # Setup toolbar, filtres, menus
│       │   ├── focus-mode.ts        # États panel chat
│       │   ├── chat.ts              # Messages, config API, suggestions UI
│       │   ├── adaptive.ts          # Opérations DÉVELOPPER/RELIER/SYNTHÉTISER
│       │   └── prompt-log.ts        # PromptLogManager - Historique prompts
│       │
│       ├── llm-api/                 # Sous-modules API directe
│       │   ├── router.ts            # Routage API/webview
│       │   ├── executor.ts          # Exécution appels API, parsing réponses
│       │   ├── ui-states.ts         # Overlay chargement, modal erreur
│       │   └── config-modal.ts      # Modal configuration clés API
│       │
│       ├── webview/                 # Sous-modules webview
│       │   ├── providers.ts         # URLs providers, sélecteurs, switch
│       │   ├── ui-controls.ts       # Status, boutons, bouton capture
│       │   ├── sender.ts            # Construction prompt, injection, envoi
│       │   ├── monitor.ts           # Polling messages, circularité
│       │   └── capture.ts           # Capture réponse, parsing vignettes/connexions
│       │
│       ├── syntheses/               # Sous-modules synthèses
│       │   ├── storage.ts           # Load/save SQLite, génération IDs
│       │   ├── creation.ts          # Création synthèse, prompts, archivage
│       │   └── rendering.ts         # Sidebar, modales, export
│       │
│       ├── analyzer/                # Sous-modules CanvasAnalyzer
│       │   ├── config.ts            # Configuration, seuils, poids, constantes
│       │   ├── history.ts           # Persistance SQLite, tracking tours
│       │   ├── attractors.ts        # Détection, scoring, badges UI
│       │   ├── friction.ts          # Circularité, stagnation, injection
│       │   └── diversity.ts         # Diversité sémantique, tendance, top keywords
│       │
│       └── friction/                # Chargement référentiels JSON
│           └── referentielsLoader.ts
│
└── styles/
    ├── assisted.css                 # Styles mode assisté
    └── canvas.css                   # Styles canvas
```

### Système de modules

**ES modules** avec `import`/`export`. Pas de globales `window.XXX` pour les classes.

Seules globales conservées :
- `window.fgraph` — Bridge IPC Electron (set par `preload.js`)
- `window.app` — Accès debug console + tests E2E

Convention d'import : extensions `.js` dans les chemins (`moduleResolution: "bundler"` résout `.js` → `.ts`).

### Pattern wrapper (modularisation)

```typescript
// Dans le module (ex: ./analyzer/attractors.ts)
export function detectAttractors(analyzer, ...) { /* implémentation */ }

// Dans la façade (ex: canvas-analyzer.ts)
import { detectAttractors as _detectAttractors } from './analyzer/attractors.js';

export class CanvasAnalyzer {
    detectAttractors() {
        return _detectAttractors(this);
    }
}
```

### Ordre d'initialisation (STRICT)

```
1. StorageManager
   ↓
2. CanvasManager (DOM + state)
   ↓
3. LLMManager (config providers, prompt templates)
   ↓
4. MetricsManager (dépend CanvasManager.state)
   ↓
5. CanvasAnalyzer (dépend CanvasManager, remplace AttractorsManager + Friction)
   ↓
6. SynthesesManager (dépend GraphApp, canvas)
   ↓
7. CapturesManager (dépend GraphApp, canvas)
   ↓
8. WebviewHandler (dépend CanvasManager)
   ↓
9. LLMApiManager (dépend LLMManager)
   ↓
10. PromptLogManager (dépend canvasId)
    ↓
11. HistoryManager (dépend tous les managers)
```

### Dépendances entre modules

```
GraphApp (assisted-app.ts)
├── StorageManager ── SQLite via IPC ────────────────────┐
├── CanvasManager ───────────────────────────────────────┤
│   └── state.nodes, state.connections                   │
├── LLMManager ──────────────────────────────────────────┤
│   └── Prompt building, tri topologique                 │
├── MetricsManager ──────────────────────────────────────┤
│   └── Dépend de CanvasManager.state                    │
├── CanvasAnalyzer ──────────────────────────────────────┤
│   └── Dépend de Canvas, analyzer/ submodules           │
├── SynthesesManager ────────────────────────────────────┤
│   └── Dépend de GraphApp, Canvas, LLM, History         │
├── CapturesManager ─────────────────────────────────────┤
│   └── Dépend de GraphApp, Canvas                       │
├── WebviewHandler ──────────────────────────────────────┤
│   └── Dépend de Canvas, LLM                            │
├── LLMApiManager ───────────────────────────────────────┤
│   └── Dépend de LLMManager                             │
├── PromptLogManager ────────────────────────────────────┤
│   └── SQLite via IPC, canvasId                         │
└── HistoryManager ──────────────────────────────────────┘
    └── Dépend de tous les managers
```

---

## 2. Fichiers et Modules

| Fichier | Classe/Objet | Responsabilité |
|---------|--------------|----------------|
| `assisted-app.ts` | `GraphApp` | Orchestration, init, events, lifecycle |
| `canvas.ts` | `CanvasManager` | Vignettes, connexions, pan/zoom, sélection |
| `canvas/*.ts` | (fonctions) | Modules canvas (nodes, connections, menus, etc.) |
| `history.ts` | `HistoryManager` | Undo/Redo (50 états max) |
| `storage.ts` | `StorageManager` | Wrapper SQLite via IPC |
| `assisted/metrics.ts` | `MetricsManager` | Calcul métriques, suggestions adaptatives |
| `assisted/syntheses.ts` | `SynthesesManager` | Archivage, restauration, export synthèses |
| `assisted/captures.ts` | `CapturesManager` | Import JSON, épinglage messages |
| `assisted/webview-handler.ts` | `WebviewHandler` | Injection/capture webview LLM |
| `assisted/llm.ts` | `LLMManager` | Prompts adaptatifs, tri topologique, cadrage structurel |
| `assisted/canvas-analyzer.ts` | `CanvasAnalyzer` | **Remplace** AttractorsManager + CircularityDetector + CanvasHistory + FrictionInjector |
| `assisted/llm-api.ts` | `LLMApiManager` | Appels API directe pour opérations structurées |
| `assisted/app/prompt-log.ts` | `PromptLogManager` | Historique prompts (transparence niveau 1) |
| `data/prompt-templates.ts` | `PromptTemplates` | Templates centralisés, cadrage structurel |
| `assisted/analyzer/config.ts` | (constantes) | Seuils, poids, patterns, stopwords |
| `assisted/analyzer/history.ts` | (fonctions) | Persistance SQLite, tracking comportemental |
| `assisted/analyzer/attractors.ts` | (fonctions) | Détection, scoring, classification, badges |
| `assisted/analyzer/friction.ts` | (fonctions) | Circularité, stagnation, injection prompts |
| `assisted/analyzer/diversity.ts` | (fonctions) | Diversité sémantique, tendance convergence/exploration, top keywords |
| `assisted/friction/referentielsLoader.ts` | `ReferentielsLoader` | Chargement JSON patterns friction |

---

## 3. GraphApp - Orchestrateur

### Propriétés principales

```typescript
class GraphApp {
    canvas: CanvasManager
    storage: StorageManager
    llm: LLMManager
    webviewHandler: WebviewHandler
    metrics: MetricsManager
    syntheses: SynthesesManager
    captures: CapturesManager
    analyzer: CanvasAnalyzer       // Remplace this.attractors
    history: HistoryManager
    llmApi: LLMApiManager          // Nouveau : API directe
    promptLog: PromptLogManager    // Nouveau : historique prompts

    currentOperation: string       // 'DÉVELOPPER' | 'RELIER' | 'SYNTHÉTISER'
    focusMode: string | null       // null | 'syntheses' | 'chat'
    chatState: string              // 'hidden' | 'normal' | 'expanded' | 'focus'
}
```

### Hook pattern (setupMetricsHooks)

`setupMetricsHooks()` wrappe les méthodes CanvasManager pour ajouter persistance + history + metrics :

```typescript
const originalDeleteNode = this.canvas.deleteNode.bind(this.canvas);
this.canvas.deleteNode = async (...args) => {
    this.history.saveState('suppression vignette');
    await originalDeleteNode(...args);
    this.metrics.recalculateDebounced();
    await this.saveData(); // MUST be awaited (race condition SQLite)
};
```

**Important** : Les sous-modules (ex: `canvas/nodes.ts`) doivent appeler `cm.deleteNode()` (la méthode hookée), pas la fonction locale `deleteNode()`.

### Flux d'initialisation

```
1. Afficher modal choix session (reprise vs nouvelle vs import)
2. Afficher modal choix contexte (cohérent vs frais)
3. Initialiser tous les modules dans l'ordre strict
4. Setup tous les event listeners
5. Restaurer session si reprise
6. Mettre à jour métriques et suggestion initiale
```

### Nettoyage session (clearGraph / nouveau canvas)

```typescript
// clearGraph() efface TOUT :
canvas.clear()                    // nodes + connections DOM
promptLog.clear()                 // prompt logs SQLite
storage.clear()                   // nodes + connections SQLite

// Nouveau canvas / Import :
await fgraph.db.syntheses.replaceAll('default', [])
await fgraph.db.captures.replaceAll('default', [])
await fgraph.db.promptLogs.removeAllByCanvas('default')
```

---

## 4. CanvasManager

### État du canvas

```typescript
this.state = {
    nodes: KairosNode[],          // Vignettes
    connections: KairosConnection[],
    pendingConnections: [],       // À rendre après DOM
    zoom: 1.0,
    panX: 0, panY: 0,
    mode: "explorer",
    statusFilters: Set(["neutral", "priority"])  // ⚠️ Pas "default"/"validated"/"rejected"
}

this.interaction = {
    isDragging: false,
    isPanning: false,
    draggedNode: null,
    draggedNodes: [],             // Multi-sélection
    connectionMode: false,
    connectionFromNode: null,
    selectedNodes: new Set()      // IDs sélectionnés
}
```

### Modèle de nœud (Node)

```typescript
interface KairosNode {
    id: string                   // "n_{timestamp}_{counter}"
    text: string
    x: number
    y: number
    status: 'neutral' | 'priority'    // ⚠️ Deux statuts seulement
    tags: string[]
    created?: number                  // Timestamp
    synthesized?: boolean             // Archivé via synthèse (style atténué)
    isFriction?: boolean              // Vignette friction (halo rouge, badge)
    newlyImported?: boolean           // Récemment importé (halo animé)
    attractorData?: {                 // Données attracteur cognitif
        type: string
        score: number
        reason: string
        suggestedAction?: string
        qualifiedAt?: number
    }
}
```

### Modèle de connexion

```typescript
interface KairosConnection {
    id: string
    from: string                 // nodeId source
    to: string                   // nodeId cible
    type: 'implies' | 'resonance'   // → ou ↔
    mechanism?: string           // Justification (tooltip SVG)
}
```

### Sous-modules canvas/

| Module | Responsabilité |
|--------|----------------|
| `nodes.ts` | Création, suppression, édition vignettes |
| `connections.ts` | Création, suppression, rendu SVG connexions |
| `selection.ts` | Sélection simple et multi-nœuds |
| `interactions.ts` | Drag, pan, zoom, événements souris |
| `viewport.ts` | Zoom, centrage, reset vue |
| `menus.ts` | Menus contextuels (fond, nœud, connexion) |
| `minimap.ts` | Carte miniature avec viewport |
| `persistence.ts` | Import/export canvas |
| `filters.ts` | Filtres de statut |
| `collisions.ts` | Détection collisions, positions libres |
| `layout.ts` | Arrangement automatique |

---

## 5. MetricsManager

> Fichier : `src/renderer/js/assisted/metrics.ts`

### Métriques calculées

```typescript
interface Metriques {
    totalVignettes: number
    vignettesActives: number          // = totalVignettes (toutes actives)
    vignettePrioritaires: number      // status === 'priority'
    vignetteNeutres: number           // status === 'neutral'
    vignetteConnectees: number        // ⚠️ Clé de décision (pas vignetteValidees)
    connexionsTotal: number
    connexionsImplique: number        // Type → (implies)
    connexionsResonance: number       // Type ↔ (resonance)
    vignetteIsolees: number           // Sans aucune connexion
    densiteConnexions: number         // connexionsTotal / vignettesActives
    ratioPriorite: number             // vignettePrioritaires / totalVignettes
}
```

### Logique fondamentale

> **Lien = validation implicite.** Le système utilise `vignetteConnectees` (vignettes ayant au moins une connexion) comme indicateur principal, pas un champ "validé". Connecter deux vignettes revient à les valider structurellement.

> **Diversité > Quantité.** Le système ne décide plus QUOI suggérer en comptant COMBIEN il y a de choses. Il observe OÙ VA le canvas (convergence vs exploration) et adapte ses suggestions en conséquence.

### Règles de suggestion (decideOperation)

**Mode global (aucune sélection) :**

Le `decideOperation()` utilise la **diversité sémantique** et la **circularité** comme critères primaires, avec fallback sur l'ancienne logique quantitative quand les données sont insuffisantes (< 3 points de diversité).

| Priorité | Condition | Opération | subMode | Priorité UI |
|----------|-----------|-----------|---------|-------------|
| 1 | < 3 vignettes | DÉVELOPPER | — | haute |
| 2 | Données diversité insuffisantes | *(fallback legacy)* | — | variable |
| 3a | Convergence + circularité > seuil | DÉVELOPPER | **diverger** | urgente |
| 3b | Convergence + circularité > 1 | DÉVELOPPER | **diverger** | haute |
| 3c | Convergence seule | DÉVELOPPER | **diverger** | moyenne |
| 4a | Exploration/stable + > 30% isolées + **>= 5 vignettes** | RELIER | — | moyenne |
| 4b | Exploration/stable + densité > 0.8 + **>= 12 vignettes** + !cooldown | SYNTHÉTISER | — | haute |
| 4c | Exploration/stable + >= 15 connectées + !cooldown | SYNTHÉTISER | — | moyenne |
| 5 | Stable + circularité <= 1 | **null** (pas de suggestion) | — | normale |
| Défaut | | DÉVELOPPER | approfondir | normale |

**subMode** : Nouveau champ ajouté au retour de `decideOperation()`. Valeurs : `'approfondir'` (défaut) ou `'diverger'` (canvas convergent). Propagé jusqu'à `buildAdaptivePrompt()` pour choisir le template de prompt.

**operation: null** : Nouveau cas — le canvas explore naturellement, pas besoin de suggestion. Le bandeau affiche un message neutre "✦ Le canvas explore naturellement. Continuez."

**Synthèse cooldown** : 60 secondes après une synthèse, le système ne re-suggère pas SYNTHÉTISER (évite boucle).

**Fallback legacy** : Quand l'analyzer n'est pas disponible ou que la diversité a < 3 points, l'ancienne logique quantitative s'applique (`_decideOperationLegacy()`). Les seuils du fallback :

| Priorité | Condition | Opération | Priorité UI |
|----------|-----------|-----------|-------------|
| 1 | >= 25 connectées + !cooldown | SYNTHÉTISER | urgente |
| 2 | >= 15 connectées + !cooldown | SYNTHÉTISER | haute |
| 3 | > 30% isolées + >= 5 vignettes | RELIER | moyenne |
| 4 | densité < 0.5 + >= 5 vignettes | DÉVELOPPER | moyenne |
| 5 | >= 8 connectées + !cooldown | SYNTHÉTISER | basse |
| 6 | cooldown actif | DÉVELOPPER | normale |
| Défaut | | DÉVELOPPER | normale |

**Mode sélection (vignettes sélectionnées) — inchangé :**

| Sélection | Opération | Condition |
|-----------|-----------|-----------|
| 1-5 vignettes | DÉVELOPPER | Toujours |
| 6-9 vignettes | RELIER | Si connectivité interne < 30% |
| 6-9 vignettes | DÉVELOPPER | Sinon |
| 10+ vignettes | SYNTHÉTISER | Toujours |

### Mécanisme de stabilité

```typescript
updateSuggestion() {
    if (dernierChoixManuel && variation < 10%) {
        return dernierChoixManuel   // Stabilité : conserve choix utilisateur
    }
    return decideOperation()        // Recalcul automatique
}
```

Le choix manuel est conservé tant que les métriques n'ont pas changé de plus de 10% (`hasSignificantChange()`).

### Calcul de connectivité pour sélection

```typescript
// Ratio de connectivité interne de la sélection
const internalConnections = connections.filter(
    c => selectedSet.has(c.from) && selectedSet.has(c.to)
).length;
const maxPossible = (count * (count - 1)) / 2;
const connectivityRatio = maxPossible > 0 ? internalConnections / maxPossible : 0;
```

### Méthodes clés

```typescript
// Propriétés
canvas: CanvasManagerLike          // Référence canvas
analyzer: any                      // Référence CanvasAnalyzer (pour diversité)

// Méthodes
calculateMetrics()                // Recalcule toutes les métriques
recalculateDebounced()            // Version debounced (100ms)
decideOperation()                 // Retourne suggestion (global ou sélection) avec subMode
decideOperationForSelection(count, selectedIds)  // Mode sélection (inchangé)
_decideOperationLegacy()          // Fallback quantitatif (private)
updateMetricsDisplay()            // Met à jour UI compteurs
updateSuggestionBanner()          // Met à jour bandeau (gère operation null + subMode)
setManualChoice(operation)        // Mémorise choix utilisateur
hasSignificantChange()            // Variation > 10% ?
markSynthesisCompleted()          // Active cooldown synthèse (60s)
isSynthesisCooldownActive()       // Cooldown actif ?
```

### Intégration Oxygen (février 2026)

Le système Oxygen (jauge de vitalité cognitive) s'intègre avec MetricsManager via `adaptive.ts`. Le résultat `OxygenResult` est converti en `CircularityResult` pour la compatibilité :

```typescript
// adaptive.ts — pont Oxygen → CircularityResult
const oxygenResult = await app.oxygen.recordTurn(...);
let circularityResult: CircularityResult;

if (oxygenResult.frictionLevel === 'radical') {
    mappedScore = threshold * 1.5 + 1;   // déclenche friction forte
} else if (oxygenResult.frictionLevel === 'moderate') {
    mappedScore = threshold + 1;          // déclenche friction modérée
}
// Fallback si Oxygen indisponible : legacy detectCircularity()
```

Ce mapping est transparent pour MetricsManager — il continue à recevoir un `CircularityResult` standard.

---

## 6. SynthesesManager

> Fichier : `src/renderer/js/assisted/syntheses.ts` + sous-modules `syntheses/`

### Modèle de synthèse

```typescript
{
    id: string
    titre: string
    texte: string                     // Réponse LLM
    dateCreation: number              // Timestamp
    tags: Record<string, number>      // {tag: count}
    vignettesSourceIds: string[]
    vignettesSource: Array<{          // Copie complète
        id, text, tags, status, x, y
    }>
    reinjected: boolean               // Dans contexte LLM ?
    isMeta: boolean                   // Méta-synthèse ?
}
```

### Persistance SQLite

```typescript
// Chargement
await window.fgraph.db.syntheses.getAllByCanvas(CANVAS_ID)

// Sauvegarde
await window.fgraph.db.syntheses.replaceAll(CANVAS_ID, toSave)
```

### Philosophie de synthèse

> **Lien = validé** : Une vignette connectée est implicitement validée.
> La synthèse est une **mise en prose du graphe**, pas une interprétation.

---

## 7. CapturesManager

> Fichier : `src/renderer/js/assisted/captures.ts`

### Modèle de capture

```typescript
{
    id: string
    platform: 'claude' | 'chatgpt' | 'openai' | 'gemini' | 'unknown'
    messages: Array<{
        role: 'user' | 'assistant' | 'thinking'
        content: string
    }>
    importedAt: number
}
```

---

## 8. WebviewHandler

> Fichier : `src/renderer/js/assisted/webview-handler.ts` + sous-modules `webview/`

### Providers supportés

```typescript
{
    claude:   'https://claude.ai',
    chatgpt:  'https://chatgpt.com',
    gemini:   'https://gemini.google.com',
    deepseek: 'https://chat.deepseek.com',
    grok:     'https://grok.com'
}
```

### Sous-modules

| Module | Responsabilité |
|--------|----------------|
| `providers.ts` | URLs, sélecteurs DOM, switch provider |
| `ui-controls.ts` | Status bar, boutons, bouton capture |
| `sender.ts` | Construction prompt, injection dans textarea |
| `monitor.ts` | Polling messages, détection circularité |
| `capture.ts` | Capture réponse, parsing vignettes/connexions |

### Parsing des réponses LLM

```typescript
// capture.ts exporte :
parseSuggestedPoles(content)          // Parse [NOUVELLE VIGNETTE] et [FRICTION]
parseSuggestedConnections(content)    // Parse [CONNEXION] (limit 20)
cleanSynthesisText(content)           // Nettoie texte synthèse
findVignetteByText(text, vignettes)   // Matching texte avec 5 stratégies
```

**`findVignetteByText`** utilise 5 stratégies de matching (par ordre de priorité) :
1. Match exact
2. Meilleur ratio includes (texte contenu)
3. Début de texte identique
4. Meilleur count de mots-clés communs
5. Similarité Jaccard sur mots-clés

---

## 9. LLMManager

> Fichier : `src/renderer/js/assisted/llm.ts`

### Pipeline de construction de prompt

`buildAdaptivePrompt(operation, contexte, syntheseReinjected, circularityResult, subMode)` construit le prompt en couches :

```
Étape 1 : Synthèses réinjectées (contexte consolidé)
   ↓
Étape 2 : Données du graphe (vignettes + connexions, triées topologiquement)
   ↓
Étape 2b : CADRAGE STRUCTUREL (anti-arborescence, toujours actif)
   ↓
Étape 3 : Instruction d'opération (selon opération + régime + subMode)
           DÉVELOPPER : deepen (défaut) ou diverge (si subMode === 'diverger')
           RELIER / SYNTHÉTISER : inchangés
   ↓
Étape 4 : Injection friction (si score > seuil)
```

### Cadrage structurel (Couche 0)

Blocs permanents injectés avant l'instruction d'opération pour empêcher le LLM de produire des arbres/DAG :

```
DÉVELOPPER : Force boucles de rétroaction, interdit le simple branchement linéaire
RELIER     : Cherche co-conditionnement mutuel, pas juste des implications
SYNTHÉTISER : Préserve les circularités et tensions, pas de résumé linéaire
```

### Variables dynamiques RELIER

```typescript
{connectionTarget}  // "1-3", "2-4", "3-5" ou "5-8" (adaptatif)
{isolatedCount}     // Nombre de nœuds sans connexion
```

Calculés par `getAdaptiveConnectionCount(totalVignettes, isolatedCount)` et `countIsolatedNodes(contexte)`.

### Tri topologique

Les vignettes sont triées par ordre topologique (Kahn's algorithm) dans `buildAdaptivePrompt` pour que le LLM voie la structure du graphe dans l'ordre des dépendances.

---

## 10. CanvasAnalyzer (Attracteurs + Friction)

> Fichier : `src/renderer/js/assisted/canvas-analyzer.ts`
> Sous-modules : `src/renderer/js/assisted/analyzer/`

### Remplacement des anciens modules

| Ancien module (supprimé) | Remplacé par |
|--------------------------|-------------|
| `AttractorsManager` (attractors.js) | `CanvasAnalyzer` → `analyzer/attractors.ts` |
| `CircularityDetector` (friction/circularityDetector.js) | `CanvasAnalyzer` → `analyzer/friction.ts` |
| `CanvasHistory` (friction/canvasHistory.js) | `CanvasAnalyzer` → `analyzer/history.ts` |
| `FrictionInjector` (friction/frictionInjector.js) | `CanvasAnalyzer` → `analyzer/friction.ts` |

`CanvasAnalyzer` est une **façade unifiée** qui délègue à 4 sous-modules via le pattern wrapper.

### Configuration (analyzer/config.ts)

```typescript
const DEFAULT_CONFIG = {
    // Circularité
    circularityThreshold: 3,          // Score minimum pour injection friction
    minTurnsBetweenFriction: 3,       // Cooldown entre injections
    stagnationThreshold: 3,           // Tours sans nouveau concept
    tagSaturationThreshold: 5,        // >5 vignettes avec même tag
    echoSimilarityThreshold: 0.6,     // Seuil similarité keywords (60%)

    // Diversité sémantique
    diversityConvergenceThreshold: -0.10,  // Tendance < -0.10 = convergence
    diversityExplorationThreshold: 0.10,   // Tendance > 0.10 = exploration
    diversityHistoryMax: 50,               // Max entrées historique diversité

    // Attracteurs
    attractorMinConnections: 4,       // Minimum connexions pour type "attractor"
    attractorMinScore: 0.1,           // Score minimum pour être candidat
    maxCandidates: 12,                // Maximum candidats retenus
    minNodesForDetection: 8,          // Minimum nodes pour lancer détection
    recentActionsWindow: 20,          // Fenêtre actions récentes

    // Poids du score composite
    weights: {
        degree: 0.30,                 // Nombre connexions
        recentAttachments: 0.25,      // Connexions récentes
        selectionFrequency: 0.25,     // Fréquence sélection
        llmInteractions: 0.20         // Envois + captures LLM
    }
}
```

### État interne

```typescript
class CanvasAnalyzer {
    // Références
    app: AppLike
    canvas: CanvasLike
    config: AnalyzerConfig           // Copie modifiable de DEFAULT_CONFIG

    // Historique (persisté en SQLite)
    history: {
        vignettes: []                // Snapshot vignettes (id, text, tags, status)
        connections: []              // Snapshot connexions (id, from, to, type)
        turns: number                // Compteur de tours
        turnsWithoutNewConcept: number  // Compteur stagnation
        lastFrictionInjection: number   // Dernier tour avec injection (-Infinity initial)
        frictionLogs: []             // Historique injections (max 50)
        frictionBonus: boolean       // Bonus anti-circularité (vignette friction ajoutée)
        attractorScores: Map<string, any>  // Scores attracteurs par nodeId
        diversityHistory: Array<{    // Historique diversité sémantique (max 50)
            currentDistance: number   // 0=identique, 1=très différent
            nodeId?: string
            timestamp: number
        }>
    }

    // Tracking comportemental (persisté en SQLite)
    behaviorLogs: {
        selections: Map<string, { count, timestamps[] }>      // Par nodeId
        llmSends: Map<string, { count, timestamps[], operations[] }>
        captures: Map<string, { count, timestamps[] }>
        degreeHistory: Map<string, Array<{ timestamp, degree }>>
        connectionEvents: Array<{ timestamp, fromId, toId, type }>  // Max 100
    }

    // Attracteurs
    candidates: AttractorCandidate[]
    qualifiedAttractors: Map<string, QualificationData>
    badgesVisible: boolean           // Toggle affichage badges

    // Détection echo LLM
    lastLLMOutput: string
    lastUserInput: string

    // Référentiels friction (chargés async)
    referentiels: Record<string, any> | null
}
```

### Persistance SQLite

```typescript
// Sauvegarde via IPC
await window.fgraph.db.attractors.upsert(CANVAS_ID, {
    history: { ...history, attractorScores: Object.fromEntries(...) },
    behaviorLogs: { selections: Object.fromEntries(...), ... }
})

// Chargement
const data = await window.fgraph.db.attractors.getData(CANVAS_ID)
// Maps reconstruites: new Map(Object.entries(data.behaviorLogs.selections))
```

### Analyse unifiée (point d'entrée principal)

```typescript
analyze(userInput?: string): AnalysisResult {
    const attractors = detectAttractors(this)
    const circularity = detectCircularity(this)
    const shouldInjectFriction = circularity.score > threshold && canInjectFriction(this)

    return {
        attractors,
        circularity,
        shouldInjectFriction,
        recommendations: generateRecommendations(this, attractors, circularity),
        history: { turns, turnsWithoutNewConcept, lastFrictionInjection }
    }
}
```

---

### 10.1 Attracteurs Cognitifs (analyzer/attractors.ts)

#### Philosophie

| Principe | Signification |
|----------|---------------|
| **Observation ≠ vérité** | Les badges sont des observations, pas des certitudes |
| **Parfois, rien** | Une session sans attracteur est normale (minCandidates: 0) |
| **Auto + Manuel** | Auto-détection silencieuse + détection manuelle avec badges |

#### Score composite (4 métriques)

| Métrique | Description | Poids | Normalisation |
|----------|-------------|-------|---------------|
| `degree` | Connexions totales du nœud | **0.30** | `degree / maxDegree` |
| `recentAttachments` | Connexions dans les 20 dernières actions | **0.25** | `min(count / 5, 1)` |
| `selectionFrequency` | Nombre de sélections utilisateur | **0.25** | `min(count / 10, 1)` |
| `llmInteractions` | Envois LLM + captures | **0.20** | `min(count / 5, 1)` |

**Formule** :
```
compositeScore = (degree_norm × 0.30) + (recentAttachments_norm × 0.25)
               + (selectionFrequency_norm × 0.25) + (llmInteractions_norm × 0.20)
```

#### Pénalité de circularité

Chaque nœud a une **contribution à la circularité** (0-4) :
- +1 si dans un cycle de connexions
- +1 si a un tag saturé (>5 occurrences)
- +2 si est une vignette friction

```
penalty = 0.30 × min(contribution / 3, 1)
finalScore = compositeScore × (1 - penalty)
```

Un nœud friction avec tag saturé dans un cycle perd jusqu'à 30% de son score.

#### Classification des attracteurs

| Type | Condition | Description |
|------|-----------|-------------|
| `loop_risk` | Nœud dans un cycle | Retour fréquent observé |
| `attractor` | degree >= 4 | Hub (point focal confirmé) |
| `candidate` | score >= 0.3 | Activité notable |
| `candidate` | score >= 0.1 | Candidat faible |

Priorité de classification : `loop_risk` > `attractor` > `candidate`

#### Détection de cycle (BFS)

```typescript
isNodeInCycle(nodeId):
    // Construit graphe dirigé (+ bidirectionnel pour resonance)
    // Pour chaque voisin : BFS pour trouver un chemin retour vers nodeId
    // Si chemin trouvé → dans un cycle
```

Les connexions `resonance` (↔) sont traitées comme bidirectionnelles dans le graphe.

#### Auto-détection vs Manuelle

- **Auto** (`runAutoDetection`) : Silencieuse, appelée après `updateHistory`. Met à jour badges si visibles, mais n'affiche pas de notification.
- **Manuelle** (`runManualDetection`) : Déclenchée par bouton. Affiche notification + badges. Option `withLLM` pour qualification.

#### Qualification LLM (optionnelle)

Étape 2 facultative qui envoie les candidats au LLM pour enrichir les données :

```
Prompt → "Analyse ces X vignettes attractrices..."
Réponse → Format structuré : ATTRACTEUR/SCORE/TYPE/RAISON/ACTION
```

Parse avec `parseQualificationResponse()`. Les qualifications LLM écrasent les scores auto-calculés dans `qualifiedAttractors`.

#### Badges UI

```typescript
// Ajout badge CSS
nodeDiv.classList.add('attractor')
nodeDiv.setAttribute('data-attractor-score', score)
nodeDiv.setAttribute('data-attractor-type', type)  // 'attractor' | 'loop_risk' | 'candidate'

// Suppression
clearBadges()  // Retire .attractor class + data-attributes
```

Toggle via `toggleBadges()` qui bascule `badgesVisible`.

---

### 10.2 Friction et Circularité (analyzer/friction.ts)

#### Philosophie

| Principe | Signification |
|----------|---------------|
| **Friction ≠ conflit** | Résistance cognitive productive, pas confrontation |
| **Sous-marin** | Injection transparente dans les prompts LLM |
| **Cooldown** | 3 tours minimum entre deux injections |
| **Opération-spécifique** | Messages différenciés par opération et niveau |

#### Les 6 signaux de circularité

| Signal | Poids | Détection | Description |
|--------|-------|-----------|-------------|
| `reformulation` | 2 × N | `isSemanticallyClose()` entre chaque paire de nœuds | Vignettes sémantiquement proches (keywords > 60%) |
| `boucle_connexion` | 3 | `hasConnectionCycle()` via DFS avec recursion stack | Cycle A → B → C → A dans le graphe |
| `stagnation` | 2 | `turnsWithoutNewConcept >= stagnationThreshold` | 3+ tours sans nouveau concept |
| `validation_vide` | 1 | Regex sur `lastUserInput` | Réponse user type "oui", "ok", "d'accord" |
| `tags_saturés` | 1 × N | Comptage tags normalisés > 5 | Même tag sur >5 vignettes |
| `echo_llm` | 2 | Overlap keywords user/LLM > 60% | LLM répète une formulation utilisateur |

**Score total** = somme pondérée des signaux détectés.
**Seuil d'injection** : `score > 3` (configurable).

#### Bonus anti-circularité

Si une vignette `[FRICTION]` est ajoutée au canvas, `frictionBonus` s'active :
```typescript
score = Math.max(0, score - 1)  // Réduction de 1 point, minimum 0
```
Le bonus est consommé une seule fois (reset après utilisation).

#### Extraction de mots-clés

```typescript
extractKeywords(text):
    // 1. Lowercase + normalize NFD (retire accents)
    // 2. Split sur \W+
    // 3. Filtre: length > 3 ET pas dans STOPWORDS (136 mots français)
```

#### Similarité sémantique

```typescript
isSemanticallyClose(text1, text2):
    kw1 = extractKeywords(text1)
    kw2 = extractKeywords(text2)
    if kw1.length < 2 || kw2.length < 2: return false
    overlap = kw1.filter(k => kw2.includes(k))
    similarity = overlap.length / max(kw1.length, kw2.length)
    return similarity > 0.6  // echoSimilarityThreshold
```

#### Injection friction v2 (opération-spécifique)

La friction v2 utilise les **templates centralisés** (`prompt-templates.ts`) :

- **SYNTHÉTISER** : Jamais de friction (ses questions d'observation remplissent ce rôle)
- **DÉVELOPPER** : Friction modérée ou forte (si `recentKeywords` disponibles)
- **RELIER** : Friction modérée ou forte (si `recentMechanisms` disponibles)

Niveaux :
- **Modéré** : `score > threshold` → message générique
- **Fort** : `score > threshold × 1.5` → message avec contexte spécifique

```typescript
injectFriction(basePrompt, circularityResult, operation):
    if !shouldInjectFriction: return basePrompt
    if operation === 'SYNTHÉTISER': return basePrompt

    // Log l'injection
    history.lastFrictionInjection = history.turns
    history.frictionLogs.push({ turn, score, signals, operation, injected: true })

    // Construire contexte pour friction forte
    context = buildFrictionContext(analyzer, operation)
    // DÉVELOPPER: recentKeywords des 5 dernières vignettes
    // RELIER: recentMechanisms des 5 dernières connexions

    return basePrompt + buildFrictionBlock(circularityResult, operation, context)
```

#### Flux de détection complet

```
1. executeAdaptiveOperation() ou sendContextualMessage()
   ↓
2. updateHistory(vignettes, connections)
   - Compare avec snapshot précédent
   - Détecte nouvelles vignettes (reset stagnation si nouveau concept)
   - Détecte nouvelles vignettes friction (active frictionBonus)
   - Incrémente turns
   - Sauvegarde SQLite
   ↓
3. detectCircularity()
   - Calcule les 6 signaux
   - Applique bonus friction si actif (-1)
   - Retourne { score, signals, shouldInjectFriction }
   ↓
4. buildAdaptivePrompt() avec circularityResult
   - Si shouldInjectFriction: injectFriction() ajoute bloc friction
   ↓
5. Envoi au LLM
```

---

### 10.3 Tracking comportemental (analyzer/history.ts)

#### Event listeners (setupEventListeners)

```typescript
// 4 événements trackés automatiquement :
document.addEventListener('nodeSelected', e => trackSelection(nodeId))
document.addEventListener('connectionCreated', e => trackConnectionEvent(fromId, toId, 'created'))
document.addEventListener('llmSend', e => trackLLMSend(nodeId, operation))
document.addEventListener('captureTracked', e => trackCapture(nodeId))
```

Chaque tracker maintient un compteur et un historique horodaté (max 50 entrées par nœud, 100 événements connexion).

#### Recommandations automatiques

`generateRecommendations(attractors, circularity)` produit des suggestions contextuelles :

| Condition | Type | Message | Priorité |
|-----------|------|---------|----------|
| Attracteur type "attractor" | `explore_hub` | "Explorer le hub X..." | medium |
| Score circularité > 0 mais ≤ seuil | `warning_circularity` | "Légère circularité — varier les angles" | low |
| Signal stagnation actif | `stagnation` | "Introduire un nouveau concept" | high |
| Attracteurs type "loop_risk" | `loop_risk` | "N node(s) dans des boucles" | medium |

---

### 10.4 Diversité sémantique (analyzer/diversity.ts)

#### Philosophie

Le canvas ne doit pas s'épaissir autour d'un seul bassin sémantique. L'indice de diversité détecte si les nouvelles vignettes CONVERGENT (reformulations) ou EXPLORENT (territoires adjacents).

#### Trois fonctions exportées

```typescript
calculateDiversity(analyzer): DiversityResult
// Mesure la distance sémantique du dernier nœud ajouté vs tous les autres.
// Réutilise extractKeywords() de friction.ts.
// Retourne { currentDistance: 0..1, nodeId?, timestamp }
// 0.0 = identique aux existants, 1.0 = très différent

diversityTrend(analyzer): 'converging' | 'exploring' | 'stable' | 'insufficient_data'
// Analyse les 5 derniers points de diversityHistory.
// Compare moyenne première moitié vs seconde moitié.
// diff < -0.10 → 'converging', diff > 0.10 → 'exploring'
// < 3 points → 'insufficient_data'

getCanvasTopKeywords(analyzer, topN = 10): TopKeyword[]
// Extrait les mots-clés les plus fréquents du canvas entier.
// Utilisé par le template DÉVELOPPER-DIVERGER pour dire au LLM "pas ça".
// Retourne [{ keyword, count }, ...]
```

#### Intégration dans le flux

```
updateHistory() (history.ts)
  ↓ (si nouveau concept détecté)
calculateDiversity()
  ↓
diversityHistory.push(result)  // max 50 entrées
  ↓
saveHistory()  // persisté en SQLite
```

Le `MetricsManager` appelle `analyzer.diversityTrend()` et `analyzer.detectCircularity()` dans `decideOperation()` pour décider si le canvas converge ou explore.

---

## 11. Prompt Templates & Cadrage Structurel

> Fichier : `src/renderer/data/prompt-templates.ts`

### Architecture

```typescript
interface PromptTemplates {
    operations: {
        DÉVELOPPER: {
            deepen: { full: string; branch: string }  // Approfondir (défaut)
            diverge: { full: string; branch: string }  // Diverger (canvas convergent)
        }
        RELIER: { full: string; branch: string }
        SYNTHÉTISER: { full: string; branch: string }
    }
    structuralFraming: {                            // Cadrage structurel (Couche 0)
        DÉVELOPPER: string
        RELIER: string
        SYNTHÉTISER: string
    }
    friction: {                                     // Templates friction v2
        develop: { moderate: string; strong: string }
        link: { moderate: string; strong: string }
    }
}
```

### DÉVELOPPER — Deux régimes de prompt

- **deepen** (approfondir) : Template par défaut, prolonge/conteste/ouvre le graphe existant.
- **diverge** (diverger) : Activé quand `subMode === 'diverger'`. Injecte les mots-clés surreprésentés et demande au LLM d'ouvrir des **territoires adjacents** différents.

Le routage se fait dans `buildOperationInstruction()` :
```typescript
if (subMode === 'diverger') → templates.operations.DÉVELOPPER.diverge
else → templates.operations.DÉVELOPPER.deepen
```

### Variables d'interpolation

```typescript
// Utilisées dans les templates via {variable}
{targetCount}         // Nombre cible de vignettes (DÉVELOPPER-deepen)
{topKeywordsCanvas}   // Top 10 mots-clés + fréquences (DÉVELOPPER-diverge)
{connectionTarget}    // Fourchette connexions adaptative (RELIER: "1-3", "5-8")
{isolatedCount}       // Nœuds sans connexion (RELIER)
{recentKeywords}      // Mots-clés récents (friction DÉVELOPPER forte)
{recentMechanisms}    // Mécanismes récents (friction RELIER forte)
```

### Personnalisation

```typescript
setCustomTemplates(custom: Partial<PromptTemplates>)
// Deep merge pour structuralFraming (pas d'écrasement complet)
```

---

## 12. PromptLogManager (Transparence)

> Fichier : `src/renderer/js/assisted/app/prompt-log.ts`

### Responsabilité

Enregistre chaque opération LLM (envoyé + reçu) dans un onglet "Prompts" de la sidebar, avec persistance SQLite.

### Modèle d'entrée

```typescript
interface PromptLogEntry {
    id: string
    canvasId: string
    timestamp: number
    operation: string              // DÉVELOPPER | RELIER | SYNTHÉTISER | CHAT_LIBRE
    regime: string                 // 'full' | 'branch'
    provider: string
    mode: string                   // 'api' | 'webview'
    vignetteCount: number
    selectedCount: number
    prompt: string                 // Prompt envoyé
    systemPrompt?: string          // System prompt (si API)
    response?: string              // Réponse LLM
    parsed?: {                     // Résultat parsé
        vignettes?: Array<{ text, tags, isFriction? }>
        connections?: Array<{ fromText, toText, type?, mechanism? }>
        synthesisText?: string
    }
    friction?: {                   // Données friction si injectée
        score: number
        threshold: number
        signals: Array<{ name, weight }>
        injected: boolean
        block?: string
    }
}
```

### Flux

```
1. recordStart(data) → crée entrée + persiste SQLite (sans réponse)
   ↓
2. Appel LLM (API ou webview)
   ↓
3. recordEnd(entryId, response, parsed) → met à jour entrée + SQLite
```

Pruning automatique : max 50 entrées par canvas.

---

## 13. LLMApiManager (API directe)

> Fichier : `src/renderer/js/assisted/llm-api.ts` + sous-modules `llm-api/`

### Responsabilité

Appels API directs pour les opérations structurées (DÉVELOPPER, RELIER, SYNTHÉTISER), en alternative au chemin webview.

### Sous-modules

| Module | Responsabilité |
|--------|----------------|
| `router.ts` | Décide API vs webview selon configuration |
| `executor.ts` | Exécution appels API via `window.fgraph.llmQuery()`, parsing réponses |
| `ui-states.ts` | Overlay chargement, modal erreur |
| `config-modal.ts` | Modal configuration clés API |

### Parsing par opération

```typescript
parseAPIResponse(content, operation):
    'DÉVELOPPER' → { type: 'vignettes', vignettes: [...], connections: [...] }
    'RELIER'     → { type: 'connections', connections: [...] }
    'SYNTHÉTISER' → { type: 'synthesis', text: cleanedText }
    default       → { type: 'raw', content }
```

---

## 14. Flux d'Événements

### Événements canvas → app

```typescript
'canvas:nodeAdded'          // Nouvelle vignette
'canvas:nodeDeleted'        // Vignette supprimée
'canvas:connectionCreated'  // Nouvelle connexion
'connectionsChanged'        // Connexions modifiées → recalcul métriques
'nodeDeleted'               // → recalcul métriques
'responseCaptured'          // Réponse LLM détectée
'llmOperationStarted'       // Opération LLM démarrée
'llmOperationCompleted'     // Opération LLM terminée
```

### Flux principal

```
User action (click, drag, etc.)
    ↓
CanvasManager → (via hooked methods)
    ↓
history.saveState() → mutation → saveData() → metrics.recalculateDebounced()
    ↓
updateSuggestionBanner()
    ↓
UI update
```

---

## 15. Patterns Critiques

### Pattern 1 : Mutation d'état (via hooks)

```typescript
// ORDRE OBLIGATOIRE dans les hooks (setupMetricsHooks) :
1. this.history.saveState('description')  // AVANT mutation
2. Appeler la méthode originale           // Mutation
3. this.metrics.recalculateDebounced()    // Suggestions
4. await this.saveData()                  // ⚠️ MUST await (SQLite race condition)
```

### Pattern 2 : Wrapper pattern (modularisation)

```typescript
// Module: import { fn as _fn } from './module.js'
// Façade: class wrapper avec this comme premier argument
// Sous-modules DOIVENT appeler cm.method() (hookée), pas fn() locale
```

### Pattern 3 : Debouncing

```typescript
recalculateDebounced() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
        this.calculateMetrics();
        this.updateMetricsDisplay();
        this.updateSuggestionBanner();
    }, 100);
}
```

### Pattern 4 : Import path convention

```typescript
// Extensions .js dans les imports
import { X } from './module.js'
// moduleResolution: "bundler" résout .js → .ts au build time
```

---

## 16. Persistance SQLite

### Architecture

- **SQLite** via better-sqlite3 (main process)
- **IPC bridge** : `window.fgraph.db.*` (exposé par `preload.js`)
- **WAL mode** activé pour performance
- **Location** : `%APPDATA%/kairos/kairos.db` (Windows) / `~/Library/Application Support/kairos/kairos.db` (macOS)

### Tables et APIs IPC

| Table | API IPC | Contenu |
|-------|---------|---------|
| `canvases` | `fgraph.db.canvas.*` | Métadonnées canvas |
| `nodes` | `fgraph.db.canvas.saveAll/loadAll` | Vignettes |
| `connections` | `fgraph.db.canvas.saveAll/loadAll` | Connexions |
| `syntheses` | `fgraph.db.syntheses.*` | Synthèses archivées |
| `captures` | `fgraph.db.captures.*` | Conversations importées |
| `attractors` | `fgraph.db.attractors.*` | Historique + tracking CanvasAnalyzer |
| `prompt_logs` | `fgraph.db.promptLogs.*` | Historique prompts (PromptLogManager) |

### Migration localStorage → SQLite

- One-time migration au premier lancement après update
- Gérée par `src/renderer/js/db-migration.ts`
- Flag : `kairos_migrated_to_sqlite` dans localStorage

### electron-store

Clés API encryptées via `safeStorage` (pas en SQLite).

---

## 17. Points d'Extension

### A. Ajouter un provider LLM

1. `llm.ts` : ajouter dans providers
2. `webview/providers.ts` : ajouter sélecteurs CSS + URL
3. `assisted.html` : ajouter `<option>` au select

### B. Ajouter une métrique

1. `metrics.ts` → `calculateMetrics()` : ajouter calcul
2. Interface `Metriques` : ajouter champ
3. `hasSignificantChange()` : si important pour stabilité
4. `updateMetricsDisplay()` : si affiché

### C. Modifier les templates de prompt

1. `data/prompt-templates.ts` → modifier `defaultTemplates`
2. Variables : `{variable}` interpolées par `interpolateTemplate()`
3. Custom templates : `setCustomTemplates()` (deep merge)

### D. Ajouter un signal de circularité

1. `analyzer/config.ts` → `SIGNALS` : ajouter signal + poids
2. `analyzer/friction.ts` → `detectCircularity()` : ajouter détection
3. Tester avec `simulateCircularity()`

### E. Modifier le scoring attracteurs

1. `analyzer/config.ts` → `DEFAULT_CONFIG.weights` : ajuster poids
2. `analyzer/attractors.ts` → `calculateAttractorScore()` : normalisation
3. `classifyAttractor()` : seuils de classification

---

## 18. Checklist Modification

### État

- [ ] Quel module gère cette fonction ?
- [ ] Quel état est modifié ?
- [ ] Respecte le wrapper pattern ? (module → façade → hook)

### Hooks

- [ ] La méthode est-elle hookée dans `setupMetricsHooks()` ?
- [ ] Les sous-modules appellent-ils `cm.method()` (hookée) ?
- [ ] `saveData()` est-il `await`ed ? (race condition SQLite)

### Historique

- [ ] `this.history.saveState()` AVANT mutation
- [ ] Tester Undo/Redo

### Métriques

- [ ] `this.metrics.recalculateDebounced()` APRÈS mutation

### Persistance

- [ ] SQLite via `window.fgraph.db.*`
- [ ] Maps sérialisées en Objects pour SQLite (`Object.fromEntries`)

### Tests

- [ ] `npm test` (6 tests E2E)
- [ ] Nouvelle session / Reprise session
- [ ] Undo/Redo / Export/Import

---

## Annexe : Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + F` | Focus recherche |
| `Suppr/Delete` | Supprimer sélection |
| `Ctrl/Cmd + A` | Sélectionner tout |
| `Ctrl/Cmd + D` | Désélectionner |
| `Ctrl/Cmd + S` | Sauvegarder |
| `Escape` | Fermer modal/désélectionner |
| `L` | Mode connexion |
| `+` / `-` | Zoom in/out |
| `0` | Reset zoom (100%) |

---

## Annexe : Variables CSS

```css
:root {
    --bg-primary: #0f0f23;
    --bg-secondary: #1a1a2e;
    --bg-tertiary: #16213e;

    --text-primary: #e4e4e7;
    --text-secondary: #a1a1aa;

    --accent-primary: #7c3aed;
    --accent-hover: #6d28d9;

    --status-neutral: #71717a;       /* ⚠️ Pas --status-default */
    --status-priority: #f59e0b;      /* Ambre */

    --conn-implies: #a89050;         /* Gold - implication */
    --conn-resonance: #4db8a8;       /* Turquoise - résonance */
}
```

### Classes CSS dynamiques (vignettes)

```css
.pole.status-neutral        /* Statut neutre */
.pole.status-priority       /* Statut prioritaire */
.pole.selected              /* Contour vert sélection */
.pole.synthesized           /* Archivée : opacity 0.35, grayscale, bordure pointillée */
.pole.friction-vignette     /* Halo rouge + badge friction */
.pole.friction-seen         /* Friction avec pulse arrêté */
.pole.newly-imported        /* Halo animé import */
.pole.attractor             /* Badge attracteur cognitif */
```

### Classes CSS dynamiques (connexions)

```css
.connection-archived        /* Connexion archivée : opacity 0.3, grayscale */
.connection-hitbox          /* Zone cliquable élargie (transparente) */
```

---

## Annexe : Sauvegarde Automatique

### Déclencheurs de Sauvegarde

| Déclencheur | Intervalle | History | SQLite |
|-------------|------------|---------|--------|
| Modification vignette | Immédiat | Avant | Après |
| Modification connexion | Immédiat | Avant | Après |
| Drag vignette | Sur dragEnd | dragStart | dragEnd |
| Édition texte | Sur blur | editStart | blur |
| Périodique | 30 secondes | Non | Oui |
| Ctrl+S | Manuel | Non | Oui + Toast |
| Fermeture fenêtre | beforeunload | Non | Oui |

**Exception drag** : `updateNodeElement()` est appelé ~60fps pendant le drag mais NE sauvegarde PAS. Seul `nodeDragEnd` déclenche `saveData()`.

---

## Annexe : Gestion des Sessions et Stockage

### Architecture Hybride

| Données | Stockage | Mode |
|---------|----------|------|
| Vignettes, Connexions | **SQLite** | Assisté |
| Synthèses, Captures | **SQLite** | Assisté |
| Attracteurs, Friction | **SQLite** | Assisté |
| Préférences utilisateur | localStorage | Tous |
| **Mode Autonome (tout)** | localStorage | Autonome |

### localStorage — Clés Actives

**Préférences (persistantes entre sessions) :**
```
fgraph_ignore_context        - Ignorer contexte LLM
kairos_llm_provider          - Provider actuel (claude, gemini, etc.)
fgraph_extended_thinking     - Mode thinking étendu
fgraph_llm_config            - Config LLM (fallback si secure storage indispo)
fgraph_audio_config          - Config audio player
fgraph_context_choice_remembered - Se souvenir du choix
fgraph_first_message_only    - Premier message seulement
fgraph_reminder_interval     - Intervalle rappels
kairos_autonomous_model      - Modèle mode autonome
fgraph_intention_audio       - Préférence audio intention
```

**Mode Autonome (NON migré vers SQLite) :**
```
fgraph_captures              - Captures conversations
fgraph_current_intention     - Intention courante
graph_canvas_data            - Données canvas autonome
```

### Nouvelle Session (Mode Assisté)

Actions automatiques :
1. Clear localStorage legacy (anciennes clés)
2. Clear SQLite via `storage.clear()`
3. Clear draft webview après chargement

Les préférences (`fgraph_ignore_context`, etc.) sont **conservées**.

### Reprise Session

1. Charger préférences depuis localStorage
2. Charger données depuis SQLite
3. Restaurer provider webview

### Fallback Configuration LLM

```
1. window.fgraph.secureGet() [Electron secure storage]
   ↓ (échec)
2. window.fgraph.storage [electron-store]
   ↓ (échec)
3. localStorage
   ↓ (échec)
4. Valeurs par défaut (null API key)
```

---

## Annexe : Alimentation Echo LLM

Sources de `lastUserInput` et `lastLLMOutput` pour la détection d'écho (friction.ts) :

**lastUserInput** alimenté par :
1. `analyze(userInput)` — canvas-analyzer.ts
2. `adaptive.ts` — avant envoi opération structurée
3. `llm.ts` — dans detectCircularity()
4. `monitor.ts` — polling webview (messages user détectés)
5. `simulateCircularity()` — test/debug

**lastLLMOutput** alimenté par :
1. `adaptive.ts` — après capture réponse
2. `llm.ts` — dans detectCircularity()
3. `llm-api.ts` — après réponse API
4. `capture.ts` — après capture webview
5. `monitor.ts` — polling webview (messages assistant détectés)

---

## Annexe : Audit de Cohérence

> Statut : reflet du code au 10 février 2026.

### BUG — Événement `llmSend` jamais émis (§6.1)

| Attendu par | Événement émis réellement | Fichier émetteur |
|-------------|--------------------------|------------------|
| `history.ts:238` écoute `llmSend` | `llmSendTracked` | `webview/sender.ts:568` |

**Impact** : `trackLLMSend()` n'est **jamais appelé** via event listener.
→ `behaviorLogs.llmSends` est toujours une Map vide.
→ La composante `llmInteractions` du score attracteur = seulement les captures (pas les envois).

**Détail** : `sender.ts` émet `llmSendTracked` avec `{ nodeIds, operation }`, mais `history.ts` écoute `llmSend` avec `{ nodeId, operation }` (singulier). Double incohérence : nom ET structure.

### BUG — `captureTracked` structure incorrecte (§6.2)

| history.ts attend | capture.ts émet |
|-------------------|-----------------|
| `e.detail.nodeId` (singulier) | `e.detail.nodeIds` (array) |

**Impact** : `trackCapture(e.detail.nodeId)` reçoit `undefined`.
→ `behaviorLogs.captures` est alimenté avec `undefined` comme clé.
→ Score `llmInteractions` cassé côté captures aussi.

### CODE MORT — `degreeHistory` (§6.3)

Déclaré dans `createInitialBehaviorLogs()`, sérialisé/désérialisé dans `saveHistory()`/`loadHistory()`, mais **jamais alimenté** par aucun tracker. Aucun `.set()` ni `.get()` nulle part.

### CODE MORT — Champs legacy MetricsManager (§6.4)

| Champ | Assigné | Utilisé en lecture |
|-------|---------|--------------------|
| `vignetteValidees` | Jamais | `hasSignificantChange()`, `updateMetricsDisplay()` |
| `vignetteEnCours` | Jamais | `updateMetricsDisplay()` |
| `vignetteRejetees` | Jamais | `updateMetricsDisplay()` |
| `ratioValidation` | Jamais | `formatMetricsForDisplay()` |

**Impact** : Pas de crash (guard `|| 0`), mais `hasSignificantChange()` ne détecte jamais de changement sur `vignetteValidees`, et `formatMetricsForDisplay()` affiche toujours "0✓ 0◌ 0✗".

### OK — `nodeSelected` fonctionne (§6.5)

Émis par `canvas/selection.ts` avec `{ nodeId, selected }`.
→ `trackSelection()` fonctionne correctement.

### OK — `connectionCreated` fonctionne (§6.6)

Émis par `canvas/connections.ts` avec `{ fromId, toId, type, mechanism }`.
→ `trackConnectionEvent()` fonctionne correctement.

### OK — `lastUserInput` / `lastLLMOutput` bien alimentés (§6.7)

14 points d'alimentation identifiés couvrant les deux chemins (webview et API).
→ La détection echo LLM et la détection de validation vide fonctionnent.

### ATTENTION — Événements `canvas:*` jamais émis (§6.8)

`context-chat.ts` écoute `canvas:nodeAdded`, `canvas:nodeDeleted`, `canvas:connectionCreated` mais **aucun de ces événements n'est émis** dans le codebase. Les événements réels sont `nodeCreated`, `nodeDeleted`, `connectionCreated` (sans préfixe `canvas:`).

### Résumé scoring attracteurs — état réel (§6.9)

| Composante (poids) | Source | Fonctionnel ? |
|--------------------|--------|---------------|
| `degree` (30%) | Graphe direct | **OUI** |
| `recentAttachments` (25%) | `connectionEvents` via `connectionCreated` | **OUI** |
| `selectionFrequency` (25%) | `selections` via `nodeSelected` | **OUI** |
| `llmInteractions` (20%) | `llmSends` + `captures` | **NON** — les deux sont cassés (§6.1, §6.2) |

→ **80% du score fonctionne**, 20% (`llmInteractions`) est toujours à 0.

---

*Dernière mise à jour : 10 Février 2026*
