# KAIROS — Backlog des fonctionnalités

**Version:** 0.3.x
**Dernière mise à jour:** 10 Février 2026

Ce document liste les fonctionnalités planifiées avec leurs spécifications détaillées.

---

## Statuts

| Icône | Signification |
|-------|---------------|
| ⬜ | À faire |
| 🔶 | En cours |
| ✅ | Terminé |
| ❌ | Abandonné |

---

# AUDIT INTERFACE — Février 2026

> Audit complet du mode assisté : HTML, CSS, TypeScript, UX.
> Les items ci-dessous sont **prioritaires** par rapport aux features F001-F005.

---

## SESSION 1 — Bugs critiques (intégrité données) ~2h30

Ces bugs peuvent causer une **perte de données** ou une **corruption du graphe**.

### ✅ A001 — `saveData()` non-awaitée (~20 endroits)

**Sévérité:** CRITIQUE
**Fichier:** `src/renderer/js/assisted-app.ts`
**Estimation:** 1h

`this.saveData()` est appelée sans `await` dans ~20 endroits (hooks `createNode`, `deleteNode`, `updateNode`, etc.). Si la page se recharge pendant une écriture SQLite asynchrone, les données sont perdues. Seuls 2 appels font `await this.saveData()`.

**Correction:** Auditer tous les appels à `saveData()` dans assisted-app.ts et ajouter `await`. Attention : les wrappers dans `setupMetricsHooks()` doivent devenir `async`.

---

### ✅ A002 — Risque de collision d'ID vignette

**Sévérité:** CRITIQUE
**Fichier:** `src/renderer/js/canvas/nodes.ts` (lignes 61-63)
**Estimation:** 30min

L'ID est `n_{Date.now()}_{nodeIdCounter}`, mais `nodeIdCounter` se reset au rechargement de page. Deux créations dans la même milliseconde (import batch) = collision possible → corruption du graphe, undo/redo cassé.

**Correction:** Remplacer par `crypto.randomUUID()` ou un UUID v4 avec polyfill.

---

### ✅ A003 — `selectedNodes` non nettoyé après suppression

**Sévérité:** HAUTE
**Fichier:** `src/renderer/js/canvas/nodes.ts` (fonction `deleteNode`)
**Estimation:** 15min

Quand un nœud est supprimé, son ID reste dans `cm.interaction.selectedNodes`. Les opérations suivantes (DÉVELOPPER, export partiel, etc.) tentent d'opérer sur un nœud fantôme.

**Correction:** Ajouter `cm.interaction.selectedNodes.delete(node.id)` dans `deleteNode()`.

---

### ✅ A004 — Variables CSS non définies

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/css/assisted.css`
**Estimation:** 5min

`--validated-color` (5 usages) et `--rejected-color` (1 usage) sont utilisées mais **jamais définies**. Fallback couleur héritée → rendu imprévisible.

**Correction:** Ajouter dans `:root` ou `.mode-assisted` :
```css
--validated-color: #4ade80;
--rejected-color: #ef4444;
```

---

### ✅ A005 — Parsing API sans try-catch

**Sévérité:** HAUTE
**Fichier:** `src/renderer/js/assisted/llm-api/executor.ts` (ligne ~88)
**Estimation:** 15min

`parseAPIResponse()` n'est pas wrappé dans un try-catch. Une réponse API malformée cause un crash silencieux (unhandled promise rejection).

**Correction:** Entourer de try-catch, afficher erreur user-friendly via `showErrorModal()`.

---

### ✅ A006 — Pas de timeout pour les appels API

**Sévérité:** HAUTE
**Fichier:** `src/renderer/js/assisted/llm-api/executor.ts`
**Estimation:** 30min

Contrairement au webview (8s timeout), les appels API directs via `window.fgraph.llmQuery()` n'ont aucun timeout. Si l'API ne répond pas, l'opération reste bloquée indéfiniment.

**Correction:** Wrapper avec `Promise.race([llmQuery(...), timeoutPromise(30000)])`.

---

## SESSION 2 — Fuites mémoire & performance ~3h

### ✅ A007 — Fuite mémoire : event listeners sur nœuds

**Sévérité:** HAUTE
**Fichier:** `src/renderer/js/canvas/nodes.ts`
**Estimation:** 3h (refactor event delegation)

Chaque nœud reçoit ~5 event listeners (`mousedown`, `click`, `contextmenu`, etc.) via `addEventListener` dans `renderNode()`. À la suppression, `nodeDiv.remove()` retire le DOM mais les références aux handlers sont perdues — impossible de `removeEventListener`. Sessions longues avec beaucoup de créations/suppressions = croissance mémoire.

**Correction idéale:** Passer à l'event delegation : un seul listener sur `polesContainer` qui dispatch selon `e.target.closest('.pole')`. Élimine le problème à la racine.

**Correction minimale:** Stocker les handlers dans une Map `nodeId → handlers[]` et les supprimer dans `deleteNode()`.

---

### ✅ A008 — Rendu connexions SVG O(n²)

**Sévérité:** HAUTE
**Fichier:** `src/renderer/js/canvas/connections.ts`
**Estimation:** 2h

`updateConnections()` fait un `Array.find()` pour chaque connexion à chaque pan/zoom/drag. 50 nœuds × 100 connexions = 10 000 recherches par frame.

**Correction:** Créer un `Map<nodeId, KairosNode>` pour les lookups O(1). Ne recalculer que les connexions dont un nœud endpoint a bougé (dirty flag).

---

### ✅ A009 — Tri topologique O(n²) dans sender.ts

**Sévérité:** BASSE
**Fichier:** `src/renderer/js/assisted/webview/sender.ts` (lignes 119-140)
**Estimation:** 15min

La queue est re-triée à chaque itération du `while` loop. Déplacer le `sort()` avant la boucle.

---

### ✅ A010 — Minimap en `setInterval` au lieu de `requestAnimationFrame`

**Sévérité:** BASSE
**Fichier:** `src/renderer/js/canvas/minimap.ts`
**Estimation:** 30min

Utilise `setInterval(fn, 16)` (hardcodé 60fps). Pas synchronisé avec le render loop, cause des frame drops si le thread principal est occupé.

**Correction:** Remplacer par `requestAnimationFrame` avec un flag dirty.

---

### ✅ A011 — Debounce selection toolbar manquant

**Sévérité:** BASSE
**Fichier:** `src/renderer/js/canvas/selection.ts`
**Estimation:** 15min

Ctrl+A sur 100 nœuds = 100 appels à `updateSelectionToolbar()`. Chaque appel = DOM query + render.

**Correction:** Debounce 50ms.

---

## SESSION 3 — UX & cohérence interface ~3h

### ✅ A012 — Cooldown synthèse invisible

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/assisted/metrics.ts`
**Estimation:** 1h

Après une synthèse, le bandeau change de suggestion pendant 60s mais ne dit jamais "synthèse en cooldown". L'utilisateur ne comprend pas pourquoi SYNTHÉTISER n'est plus proposé.

**Correction:** Afficher "Synthèse disponible dans Xs" dans le bandeau + countdown visuel.

---

### ✅ A013 — Connexions pendantes perdues silencieusement

**Sévérité:** HAUTE
**Fichier:** `src/renderer/js/canvas/connections.ts` (lignes 199-255)
**Estimation:** 1h

`waitForDOMStable()` timeout à 500ms. Import de 50 nœuds → les connexions en attente qui n'ont pas trouvé leurs nœuds cibles sont abandonnées sans aucun feedback.

**Correction:** Notification "8/10 connexions créées, 2 en attente (nœuds introuvables)" + retry optionnel.

---

### ✅ A014 — Seuil de drag trop bas (5px)

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/canvas/interactions.ts` (ligne 78)
**Estimation:** 5min

Les utilisateurs de trackpad déclenchent des drags accidentels. Standard : 10px souris.

**Correction:** `const DRAG_THRESHOLD = 10;`

---

### ✅ A015 — Filtre + sélection : comportement confus

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/assisted/app/toolbar.ts` (ligne 181)
**Estimation:** 30min

Si le filtre "neutre" est désactivé et que l'utilisateur clique "Sélectionner neutres", rien ne se passe (0 résultat). Techniquement correct mais déroutant.

**Correction:** Notification "Aucun nœud trouvé — le filtre neutre est désactivé" ou auto-activation du filtre.

---

### ✅ A016 — Persistance viewport (zoom/pan)

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/canvas/persistence.ts`
**Estimation:** 1h

Le zoom/pan est sauvegardé dans `getData()` mais pas systématiquement restauré. L'utilisateur zoome à 1.5x, ferme l'app → retour à 1.0x.

**Correction:** Sauvegarder viewport dans `saveData()` + restaurer dans `loadData()` systématiquement.

---

### ✅ A017 — Bouton reload webview : double listener

**Sévérité:** BASSE
**Fichier:** `src/renderer/js/assisted/app/chat.ts` + `src/renderer/js/assisted/webview/ui-controls.ts`
**Estimation:** 15min

`#webview-reload-btn` a un listener dans `chat.ts` ET dans `ui-controls.ts`. Suppression redondante.

**Correction:** Retirer le setup de `chat.ts`, garder celui de `ui-controls.ts`.

---

## ✅ SESSION 4 — Design system & CSS ~4h

### ✅ A018 — Z-index sémantique

**Sévérité:** HAUTE
**Fichiers:** `src/renderer/css/assisted.css`, `src/renderer/css/canvas.css`
**Estimation:** 1h

10 valeurs de z-index (5, 10, 100, 500, 1000, 2000, 9999, 10000, 10001, 99999) sans logique. Modal capture manuelle à 10001 (au-dessus des autres modaux à 10000).

**Correction:** Définir des variables CSS sémantiques :
```css
--z-canvas: 10;
--z-overlays: 100;
--z-floating: 500;
--z-popovers: 1000;
--z-modals: 2000;
--z-notifications: 2100;
--z-tooltips: 2200;
```

---

### ✅ A019 — Design tokens (spacing, radius, fonts)

**Sévérité:** MOYENNE
**Fichiers:** `src/renderer/css/assisted.css`, `src/renderer/css/canvas.css`
**Estimation:** 2h

Padding incohérent (4px 8px / 5px 10px / 6px 12px / 8px 16px), border-radius variés (4/6/8/12px), font-size multiples (12/13/14/16/18px).

**Correction:** Définir et appliquer :
```css
--spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 12px; --spacing-lg: 16px; --spacing-xl: 20px;
--radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px; --radius-xl: 12px;
--font-xs: 12px; --font-sm: 13px; --font-base: 14px; --font-md: 16px; --font-lg: 18px;
```

---

### ✅ A020 — Focus visible (`:focus-visible`)

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/css/assisted.css`
**Estimation:** 30min

Aucun ring de focus pour la navigation clavier. Les 47 boutons icônes sont inaccessibles au clavier.

**Correction:**
```css
:focus-visible {
    outline: 2px solid var(--assisted-primary);
    outline-offset: 2px;
}
```

---

### ✅ A021 — `prefers-reduced-motion`

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/css/assisted.css`
**Estimation:** 15min

14 animations, aucun respect des préférences utilisateur.

**Correction:**
```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

### ✅ A022 — Hover uniforme sur boutons

**Sévérité:** BASSE
**Fichier:** `src/renderer/css/assisted.css`
**Estimation:** 30min

4 patterns différents (`translateY`, `scale`, couleur seule, `opacity`). Standardiser : primaire = `translateY(-1px)`, secondaire = changement couleur.

---

### ✅ A023 — Couleur cyan inconsistante

**Sévérité:** BASSE
**Fichiers:** `src/renderer/css/canvas.css`, `src/renderer/css/assisted.css`
**Estimation:** 15min

`#5a9abf` dans canvas.css vs `#4db8a8` dans assisted.css pour des usages similaires. Unifier en une variable `--color-accent-cyan`.

---

### ✅ A024 — Keyframe `friction-glow` dupliqué

**Sévérité:** BASSE
**Fichiers:** `src/renderer/css/canvas.css`, `src/renderer/css/assisted.css`
**Estimation:** 10min

Défini dans les deux fichiers. Le second écrase le premier. Consolider dans `canvas.css`.

---

### ✅ A025 — CSS mort à nettoyer

**Sévérité:** BASSE
**Fichiers:** `src/renderer/css/assisted.css`, `src/renderer/css/canvas.css`
**Estimation:** 30min

Classes définies mais jamais utilisées : `.pole-actions`, `.show-chat-btn` (legacy), `suggested-pole`, `suggested-connections`, `.pole-checkbox`.

---

## ✅ SESSION 5 — Accessibilité ~2h

### ✅ A026 — ARIA labels sur boutons icônes

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/assisted.html`
**Estimation:** 1h

Les 47 boutons avec emoji/icônes (⛶ ◀ ▶ 📥 🔧 ↻ etc.) n'ont aucun `aria-label`. Inaccessible aux lecteurs d'écran.

**Correction:** Ajouter `aria-label="Description"` sur chaque bouton icône.

---

### ✅ A027 — Labels sur inputs/textareas

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/assisted.html`
**Estimation:** 30min

`#search-input`, `#context-chat-input`, volume slider, progress bar — aucun `<label>` associé.

---

### ✅ A028 — `aria-live` sur régions dynamiques

**Sévérité:** BASSE
**Fichier:** `src/renderer/assisted.html`
**Estimation:** 15min

`#webview-status-text`, `#metriques-texte`, `#suggestion-texte` changent dynamiquement mais ne sont pas annoncés aux lecteurs d'écran.

**Correction:** Ajouter `aria-live="polite"` sur ces éléments.

---

### ✅ A029 — `role="tablist"` sur sidebar

**Sévérité:** BASSE
**Fichier:** `src/renderer/assisted.html`
**Estimation:** 15min

Les onglets Synthèses/Captures/Prompts utilisent `data-tab` sans sémantique. Ajouter `role="tablist"`, `role="tab"`, `role="tabpanel"`.

---

### ✅ A030 — Connexions archivées quasi-invisibles

**Sévérité:** BASSE
**Fichier:** `src/renderer/css/canvas.css`
**Estimation:** 15min

Couleur `#444` sur fond `#1a1a1a` (ratio contraste ~1.5:1). Augmenter à `#666` ou ajouter un pattern SVG.

---

## ✅ SESSION 6 — Architecture & maintenabilité ~6h

### ✅ A031 — Monitor webview toujours actif

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/assisted/webview/monitor.ts`
**Estimation:** 1h

Le polling webview (3s) tourne en permanence. Le `catch` vide masque toutes les erreurs. Batterie drainée en sessions longues.

**Correction:** Polling uniquement quand webview visible + activité récente. Logging des erreurs.

---

### ✅ A032 — Schéma DB ≠ UI (4 statuts DB, 2 dans l'UI)

**Sévérité:** MOYENNE
**Fichiers:** `src/database/db.js`, `src/renderer/js/canvas/nodes.ts`, `src/renderer/js/assisted/metrics.ts`
**Estimation:** 2h

La DB supporte `neutral/priority/validated/rejected` pour les statuts et `implies/resonance/conflicts/example` pour les connexions. L'UI ne propose que 2 de chaque. Les métriques affichent `vignetteValidees: 0` en permanence.

**Correction:** Soit exposer les 4 statuts dans l'UI, soit retirer les statuts inutilisés du schéma et des métriques.

---

### ✅ A033 — `capture.ts` monolithique (1437 lignes)

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/assisted/webview/capture.ts`
**Estimation:** 4h

Le script JavaScript d'extraction est intégré comme string dans le TypeScript. 6 providers entremêlés, impossible à tester unitairement, pas de coloration syntaxique IDE.

**Correction:** Extraire le JS injecté en fichiers séparés par provider (comme `conversation-capture.js`), chargés via `fetch()` en dev ou inline en prod.

---

### ✅ A034 — Sélecteurs DOM LLM fragiles

**Sévérité:** HAUTE
**Fichiers:** `src/renderer/js/assisted/webview/providers.ts`, `src/renderer/js/assisted/webview/capture.ts`
**Estimation:** 2h

Claude : `.ProseMirror[contenteditable]` change régulièrement. Gemini a 6 sélecteurs fallback. Aucun versionnage.

**Correction:** Fichier de config JSON par provider avec sélecteurs datés + version. Permet de mettre à jour sans toucher au code.

---

### ✅ A035 — Index spatial (quadtree) pour collisions

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/canvas/layout.ts`, `src/renderer/js/canvas/collisions.ts`
**Estimation:** 4h

`findFreePosition()` est O(n²) : 100 positions spirale × n nœuds. Import 200 nœuds = ~2M comparaisons.

**Correction:** Implémenter un quadtree ou grid spatial pour des lookups O(log n).

---

## ✅ SESSION 7 — Diversité & analyseur ~2h

### ✅ A036 — Diversité basée tags uniquement

**Sévérité:** MOYENNE
**Fichier:** `src/renderer/js/assisted/analyzer/diversity.ts`

Un nœud sans tags = diversité 1.0 (exploration) même s'il reprend un concept existant. La similarité sémantique est absente.

**Correction:** Fallback Jaccard sur mots-clés du texte quand pas de tags. Fonctions `extractKeywords()` (réutilise `STOPWORDS` de config.ts) et `jaccardDistance()` ajoutées. Appliqué dans `calculateDiversity()` et `bootstrapDiversityHistory()`.

**Bug corrigé en bonus:** Le tri par timestamp parsé depuis l'ID (`parseInt(id.split('_')[1])`) était cassé depuis A002 (UUID). Remplacé par l'index du tableau `nodes` (ordre d'insertion SQLite rowid).

---

### ✅ A037 — Trend diversité : minimum 3 points trop bas

**Sévérité:** BASSE
**Fichier:** `src/renderer/js/assisted/analyzer/diversity.ts`

3 points d'historique = bruit domine le signal. Un nœud aléatoire fausse la tendance.

**Correction:** Minimum passé de 3 à 5 points, fenêtre de 5 à 8 derniers points, moyenne glissante pondérée (poids linéaires croissants — récent pèse plus) au lieu du split first-half/second-half.

---

### ✅ A038 — Choix manuel trop "collant"

**Sévérité:** BASSE
**Fichier:** `src/renderer/js/assisted/metrics.ts`

Le choix manuel reste affiché tant qu'il n'y a pas 10% de changement. Ajouter 1 nœud sur 20 = 5% → le choix reste, c'est déroutant.

**Correction:** Le choix manuel expire après 2 recalculs (compteur `_manualChoiceRecalcCount`). Plus simple et plus prévisible qu'un seuil en pourcentage. Le seuil 10% reste comme condition de reset immédiat.

---

## SESSION 8 — UI/UX polish & nettoyage ~2h

### ✅ A039 — Correcteur orthographique : suggestions françaises dégradées

**Sévérité:** MOYENNE
**Fichier:** `main.js`

Le mode bilingue `['fr', 'en-US']` mélangeait les suggestions, rendant le français inutile ("attrofie" → "retrofitted" au lieu de "atrophie").

**Correction:** Défaut changé à `['fr']` (français seul) pour la session principale. Radio buttons dynamiques dans le menu contextuel. Session webview reste bilingue.

---

### ✅ A040 — Jauge d'oxygène : refonte design vertical

**Sévérité:** BASSE
**Fichiers:** `src/renderer/assisted.html`, `src/renderer/styles/assisted.css`, `src/renderer/js/assisted/app/adaptive.ts`

La jauge d'oxygène dans la toolbar (horizontale) prenait trop de place et comprimait les filtres/sélection.

**Correction:** Déplacée en panneau flottant vertical sur le côté gauche du canvas (`position: absolute; left: 12px; top: 76px`). Barre verticale 90px, score en haut, métriques (Div/Attr/Op) en dessous. Design discret avec `backdrop-filter: blur`.

---

### ✅ A041 — Suppression onglet Captures (sidebar)

**Sévérité:** BASSE
**Fichiers:** `src/renderer/assisted.html`, `src/renderer/js/assisted-app.ts`, `src/renderer/js/app.ts`

L'onglet Captures (import JSON de conversations) était sous-utilisé et empêchait l'onglet Prompts de s'afficher (overflow sur 3 onglets en 250px).

**Correction:** Onglet supprimé. `captures.ts` supprimé. Logique tab-switch déplacée dans `setupAdaptiveSystem()`. Sidebar passe de 3 à 2 onglets : Synthèses + Prompts.

---

# FONCTIONNALITÉS PLANIFIÉES

---

## ⬜ F001 — Curseur de friction dynamique

**Priorité:** Haute
**Complexité:** Moyenne
**Estimation:** 2-3h

### Contexte

L'utilisateur veut contrôler le niveau de friction (0-100%) dans le mode assisté.

**Principe clé** : Le curseur ne change pas CE QUE l'IA dit, il change CE QU'ELLE S'AUTORISE À DIRE. Plus le curseur est haut, moins l'IA retient.

### Zones du curseur

| Plage | Mode | Comportement |
|-------|------|--------------|
| 0-20% | Exploration | Accompagnement libre, pas de friction |
| 20-60% | Nommer | L'IA nomme les tensions qu'elle voit |
| 60-85% | Pousser | L'IA pousse les tensions jusqu'au bout |
| 85-100% | Radical | Toutes les vignettes doivent fracturer |

### Approche retenue

**Approche 2 : Modifier les instructions par opération**

Modification de la section "Observe d'abord" dans chaque fonction `build*Instruction*()` selon le niveau du curseur. Compatible avec le système de friction automatique existant (qui reste pour la détection de circularité).

### Fichiers à modifier

| Fichier | Modifications |
|---------|--------------|
| `src/renderer/js/assisted/llm.ts` | Ajouter `frictionLevel`, `getFrictionMode()`, modifier les 6 fonctions `build*Instruction*()` |
| `src/renderer/js/assisted/analyzer/config.ts` | Ajouter `frictionLevel: 40` dans DEFAULT_CONFIG |
| `src/renderer/assisted.html` | Ajouter le slider dans la toolbar |
| `src/renderer/css/assisted.css` | Styles du slider |
| `src/renderer/js/assisted/app/toolbar.ts` | Event listener, sauvegarde localStorage |

### Implémentation détaillée

#### 1. Stockage (config.ts)

```javascript
// Ajouter dans DEFAULT_CONFIG
frictionLevel: 40,  // Valeur par défaut (milieu de la zone "nommer")
```

#### 2. Helper (llm.ts)

```javascript
/**
 * Retourne le niveau de friction (0-3) selon le curseur
 * 0 = exploration (0-20%)
 * 1 = nommer (20-60%)
 * 2 = pousser (60-85%)
 * 3 = radical (85-100%)
 */
getFrictionMode() {
    const level = this.frictionLevel || 40;
    if (level < 20) return 0;
    if (level < 60) return 1;
    if (level < 85) return 2;
    return 3;
}
```

#### 3. Modification de buildOperationInstruction()

Ajouter `frictionMode` comme paramètre à chaque fonction d'instruction.

#### 4. Instructions par niveau — DÉVELOPPER (Régime A)

**Mode 0 (Exploration)** :
```
Observe d'abord :
- Quelles zones du graphe sont sous-explorées ?
- Quels tags n'apparaissent que sur un seul nœud ?
- Que suggèrent les connexions sans le dire ?

Les vignettes prolongent ou ouvrent un territoire adjacent.
(pas de mention de friction)
```

**Mode 1 (Nommer)** :
```
Observe d'abord :
- Quelles zones du graphe sont sous-explorées ?
- Quels tags n'apparaissent que sur un seul nœud ?
- Quelles tensions entre nœuds ne sont pas nommées ?
- Que suggèrent les connexions sans le dire ?

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].
```

**Mode 2 (Pousser)** :
```
Observe d'abord :
- Quelles tensions entre nœuds ne sont pas nommées ?
- Quels présupposés implicites structurent ce graphe ?
- Qu'est-ce que ces vignettes évitent de formuler ?

Les vignettes doivent nommer ce que le graphe présuppose.
Au moins une vignette DOIT être marquée [FRICTION].
```

**Mode 3 (Radical)** :
```
Observe d'abord :
- Quels présupposés implicites structurent ce graphe ?
- Où le graphe se ment-il à lui-même ?
- Quelle direction ce graphe refuse-t-il d'emprunter ?

Les vignettes doivent fracturer les évidences du graphe.
TOUTES les vignettes doivent être marquées [FRICTION].
```

#### 5. Instructions par niveau — RELIER

**Mode 0-1** : Questions sur tags partagés, chemins implicites
**Mode 2-3** : Questions sur contradictions, oppositions non nommées

Ajout en mode 2-3 :
```
Privilégie les connexions qui révèlent des tensions
plutôt que celles qui confirment des proximités.
```

#### 6. Instructions par niveau — SYNTHÉTISER

Section "Ce qui t'intéresse" modifiée :

**Mode 0** : Convergence, patterns, récurrences
**Mode 1** : + ce qui manque, présupposés
**Mode 2** : Focus sur contradictions, questions évitées
**Mode 3** : Contradictions, refus de penser, vérités désagréables

Ajout en mode 2-3 :
```
Termine OBLIGATOIREMENT par une tension non résolue
ou une question que le graphe évite.
```

#### 7. UI (assisted.html)

```html
<div class="friction-slider-container">
    <input type="range" id="friction-slider" min="0" max="100" value="40" step="5">
    <span id="friction-slider-label">40%</span>
</div>
```

#### 8. Styles (assisted.css)

```css
.friction-slider-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
}

#friction-slider {
    width: 80px;
    accent-color: var(--friction-color, #e74c3c);
}

#friction-slider-label {
    font-size: 11px;
    min-width: 30px;
}
```

#### 9. Event listener (toolbar.ts)

```javascript
// Initialisation
const slider = document.getElementById('friction-slider');
const label = document.getElementById('friction-slider-label');

const savedLevel = localStorage.getItem('kairos_friction_level') || 40;
slider.value = savedLevel;
label.textContent = `${savedLevel}%`;
app.llm.frictionLevel = parseInt(savedLevel);

// Event listener
slider.addEventListener('input', (e) => {
    const value = e.target.value;
    label.textContent = `${value}%`;
    app.llm.frictionLevel = parseInt(value);
    localStorage.setItem('kairos_friction_level', value);
});
```

### Coexistence avec friction automatique

Le curseur et la friction automatique coexistent :

| Curseur | Circularité détectée | Résultat |
|---------|---------------------|----------|
| 20% | Oui | Friction injectée (automatique) |
| 20% | Non | Instructions exploration |
| 80% | Non | Instructions exigeantes (pas de bloc friction) |
| 80% | Oui | Instructions exigeantes + bloc friction |

### Tests à prévoir

- [ ] Slider visible et fonctionnel
- [ ] Valeur persistée en localStorage
- [ ] Instructions DÉVELOPPER varient selon le mode
- [ ] Instructions RELIER varient selon le mode
- [ ] Instructions SYNTHÉTISER varient selon le mode
- [ ] Coexistence avec friction automatique

---

## ✅ F012 — Système de thèmes visuels

**Terminé:** Février 2026

4 thèmes complets (Obsidian, Porcelain, Aurora, Kraft) avec sélecteur toolbar dropdown. Architecture CSS tokens `--theme-*` dans `themes.css`, overrides via `[data-theme]` sur `<html>`. ~300 couleurs hardcodées migrées vers variables. Anti-FOUC inline script. Persistence localStorage. Séparation thème (environnement) / mode (accent). Module `theme-manager.ts`.

---

## ✅ F006 — Migration API pour Opérations Structurées

**Terminé:** Février 2026

Opérations DÉVELOPPER/RELIER/SYNTHÉTISER migrées vers appels API directs (`llm-api/`) avec fallback webview automatique. Format texte retenu (parsers existants). Multi-provider supporté. LM Studio inclus. Modal configuration clés API ajouté.

---

## ✅ F007 — ESLint + Prettier + Git Hook

**Terminé:** Février 2026

ESLint 9+ (flat config `.mjs`), Prettier (4 spaces, single quotes, 120 cols), Husky pre-commit + lint-staged. 0 erreurs, 38 warnings (`no-unused-vars`). Scripts : `npm run lint`, `npm run format`.

---

## ✅ F008 — Tests Unitaires Vitest

**Terminé:** Février 2026

Vitest avec config séparée (`vitest.config.ts`), 125 tests dans 6 fichiers : capture-parsing (32), friction (39), analyzer-config (17), layout (14), attractors (12), logger (11). Script : `npm run test:unit`. Intégré dans `npm test`.

---

## ✅ F009 — Logging Structuré

**Terminé:** Février 2026

Module `src/renderer/js/logger.ts` : `createLogger(tag)` avec niveaux DEBUG/INFO/WARN/ERROR/SILENT. Migration pilote sur 3 fichiers (collisions, attractors, capture — 57 appels migrés). ~470 appels restants à migrer progressivement.

---

## ✅ F010 — Documentation Architecture

**Terminé:** Février 2026

`doc projet/ARCHITECTURE.md` créé. Consolidation : `ROADMAP.md` → `CONTEXTE-PROJET.md` (élagué des doublons), `Prompt/` → `doc projet/PROMPTS-LLM.md`. 7 documents spécialisés dans `doc projet/`.

---

## ⬜ F011 — Documentation intégrée

**Priorité:** Basse
**Complexité:** Moyenne
**Estimation:** 6-8h

### Description

5ème entry point HTML dans KAIROS : un espace documentation navigable 
qui rend les fichiers `doc projet/*.md` avec recherche full-text, 
sidebar auto-générée et table des matières par page.

### Intérêt

- Ne plus quitter l'app pour chercher une info projet
- Lien possible vers le site de recherche (kairos-commu.github.io)
- À terme : liens bidirectionnels documentation ↔ canvas

### Prérequis

- Session 6 terminée
- Oxygène stabilisé

### Fichiers concernés

- Nouveau : `src/renderer/docs.html` + `docs-app.ts`
- `main.js` : ajout entry point
- Dépendance : markdown-it ou équivalent pour le rendering

## ⬜ F002 — Export PDF/SVG avancé

**Priorité:** Moyenne
**Complexité:** Moyenne
**Estimation:** 3-4h

### Description

Export du canvas en PDF ou SVG haute qualité avec options de mise en page.

### Fonctionnalités

- Export PDF multi-pages si canvas trop grand
- Export SVG vectoriel éditable
- Options : inclure/exclure minimap, légende, métadonnées
- Choix de la zone à exporter (tout / sélection)

### Fichiers concernés

- `src/renderer/js/assisted/app/export.ts`
- Nouvelle dépendance : jsPDF ou pdfmake

---

## ⬜ F003 — Pôles conteneurs (groupement)

**Priorité:** Moyenne
**Complexité:** Haute
**Estimation:** 6-8h

### Description

Permettre de grouper des vignettes dans un conteneur visuel qui peut être réduit/étendu.

### Comportement

- Drag & drop de vignettes dans un conteneur
- Double-clic pour réduire/étendre
- Le conteneur peut être déplacé avec son contenu
- Les connexions traversent les conteneurs

### Impact base de données

Nouvelle table `groups` ou champ `parent_id` sur `nodes`.

---

## ⬜ F004 — Auto-layout force-directed

**Priorité:** Basse
**Complexité:** Moyenne
**Estimation:** 4-5h

### Description

Algorithme de positionnement automatique basé sur les forces (comme D3.js force layout).

### Comportement

- Bouton "Réorganiser" dans toolbar
- Animation fluide vers les nouvelles positions
- Respecte les contraintes (conteneurs, vignettes épinglées)

---

## ⬜ F013 — Layout arbre hiérarchique (1 clic)

**Priorité:** Moyenne
**Complexité:** Moyenne
**Estimation:** 3-4h

### Description

Bouton "Arbre" dans la toolbar qui réorganise toutes les vignettes en arbre top-down, en exploitant les connexions `implies` (→) comme relation parent→enfant. Disponible uniquement quand toutes les vignettes importées ont été consultées (`newlyImported === false`).

### Algorithme

1. Construire le graphe dirigé depuis les connexions `implies` uniquement (`resonance` ignorées pour la hiérarchie)
2. Racines = nœuds sans parent `implies`. Si aucune (cycles) : nœud avec le plus de sorties. Orphelins : racines séparées
3. BFS pour assigner la profondeur de chaque nœud. Nœuds reliés uniquement par `resonance` : même profondeur que leur voisin
4. Heuristique barycentre pour ordonner chaque couche (réduit les croisements)
5. Positionnement : `LAYER_GAP = 200px` vertical, `NODE_GAP = 350px` horizontal, chaque couche centrée. Composantes déconnectées côte à côte

### Comportement

| Aspect | Détail |
|--------|--------|
| Bouton | `#tree-layout-btn` dans toolbar-left des deux modes |
| Condition (assisté) | `disabled` tant qu'une vignette a `newlyImported === true`. S'active dynamiquement |
| Condition (autonome) | Toujours actif (pas de concept `newlyImported`) |
| Animation | CSS transition 0.5s sur `.pole`, boucle RAF pour connexions SVG pendant la transition |
| Undo | `history.saveState()` avant layout → Ctrl+Z revient aux positions d'avant |
| Edge cases | 0-1 vignette = no-op, que des `resonance` = tout au même niveau, cycles = cassés par le nœud le plus connecté |

### Fichiers concernés

| Fichier | Action |
|---------|--------|
| `src/renderer/js/canvas/tree-layout.ts` | NOUVEAU — algorithme + animation + condition `allVignettesSeen` |
| `src/renderer/js/canvas.ts` | Wrapper `applyTreeLayout()` |
| `src/renderer/assisted.html` | Bouton dans toolbar-left (disabled par défaut) |
| `src/renderer/index.html` | Bouton dans toolbar-left |
| `src/renderer/js/assisted/app/toolbar.ts` | Setup bouton + update dynamique état disabled |
| `src/renderer/js/autonomous/app/toolbar.ts` | Setup bouton (toujours actif) |
| `src/renderer/styles/canvas.css` | Style disabled du bouton |

### Relation avec F004

F004 (force-directed) et F013 (arbre) sont complémentaires. L'arbre est déterministe et exploite la sémantique des connexions `implies`. Le force-directed est organique et convient mieux aux graphes denses sans hiérarchie claire. Les deux pourraient coexister dans un dropdown "Réorganiser" à terme.

---

## ✅ F005 — Multi-canvas (gestion de graphes)

**Priorité:** Moyenne → URGENT (demande utilisateur)
**Complexité:** Haute
**Réalisé:** 13 Février 2026

### Description

Sauvegarder, charger et naviguer entre plusieurs graphes.

### Prérequis

- ✅ Infrastructure SQLite (table `canvases` déjà prête)

### Implémentation

**3 fichiers créés :**
- `canvas-id-store.ts` — Singleton `getCanvasId()`/`setCanvasId()`, persisté localStorage
- `canvas-manager.ts` — CRUD : listCanvases, createCanvas, renameCanvas, deleteCanvas, saveCurrentAs
- `canvas-modal.ts` — Modal "Mes graphes" (overlay, liste, actions)

**Comportement :**
- Bouton "Mes graphes" dans la toolbar → ouvre le modal
- Liste tous les canvas avec stats (vignettes, connexions, date)
- "Nouveau graphe" crée un canvas vide et bascule dessus
- "Sauvegarder sous..." duplique le graphe actif (IDs re-générés)
- "Ouvrir" charge un autre graphe (sauvegarde automatique de l'actif)
- "Renommer" via icône crayon, "Supprimer" via icône ✕ (sauf canvas actif)
- `switchToCanvas()` : save → guard `_switching` → clear → set ID → reload all → recalc
- "Nouveau" au démarrage crée un nouveau canvas (ancien graphe préservé)
- Canvas par défaut `'default'` créé automatiquement par la DB
- `#canvas-name-display` dans toolbar affiche le nom du graphe actif

**Pas implémenté (scope réduit) :**
- Pas d'onglets (modal à la place)
- Pas de Ctrl+T/Ctrl+W
- Pas de drag & drop entre canvas

---

## ⬜ F014 — Onglets canvas + provider par onglet

**Priorité:** Haute
**Complexité:** Moyenne
**Estimation:** 3-4h

### Contexte

F005 (multi-canvas) permet de sauvegarder/charger plusieurs graphes via le modal "Mes graphes". Mais pour comparer le même sujet avec deux LLM différents (Claude vs GPT par ex.), il manque une navigation rapide et une association provider ↔ canvas.

### Description

Barre d'onglets entre la toolbar et le canvas. Chaque onglet = un canvas ouvert avec son provider LLM associé. Cliquer sur un onglet switche instantanément. Fermer un onglet ne supprime pas le canvas.

### Comportement

| Aspect | Détail |
|--------|--------|
| Barre | `<div class="canvas-tabs">` entre `.main-toolbar` et le canvas |
| Onglet | Nom du canvas + badge provider (C/G/D/L) + bouton fermer |
| Clic onglet | Appelle `switchToCanvas(id)` existant |
| Bouton "+" | Crée un nouveau canvas vide + ouvre un onglet |
| Fermer onglet | Retire de la barre (canvas préservé en DB). Dernier onglet non fermable |
| Provider | Mémorisé par canvas dans `localStorage.kairos_canvas_provider_{canvasId}` |
| Switch | Restaure automatiquement le provider associé à l'onglet cible |
| Persistance | `localStorage.kairos_open_tabs` = liste ordonnée des IDs ouverts |
| "Mes graphes" | "Ouvrir" ajoute un onglet en plus de switcher |
| "Sauvegarder sous" | Duplique et ouvre dans un nouvel onglet |

### Principe clé — ne rien casser

L'infrastructure F005 reste intacte. Les onglets sont une **couche UI** qui appelle `switchToCanvas()`. Aucun changement dans :
- `canvas-id-store.ts`, `canvas-manager.ts` (CRUD inchangé)
- `switchToCanvas()` dans `assisted-app.ts` (logique de switch inchangée)
- Tous les managers (oxygen, metrics, history) — déjà reload au switch

### Fichiers concernés

| Fichier | Action |
|---------|--------|
| `src/renderer/js/assisted/app/canvas-tabs.ts` | NOUVEAU — état tabs, rendu, events, provider par canvas |
| `src/renderer/assisted.html` | Ajouter `<div id="canvas-tabs">` après `.main-toolbar` |
| `src/renderer/js/assisted-app.ts` | Init tabs, update onglet actif après `switchToCanvas()` |
| `src/renderer/js/assisted/app/canvas-modal.ts` | "Ouvrir" ajoute aussi un onglet |
| `src/renderer/styles/canvas.css` | Styles barre d'onglets (~40 lignes) |

### Workflow utilisateur

1. Ouvre Kairos → 1 onglet "Mon exploration" (Claude)
2. Clic "+" → nouveau canvas, 2e onglet, choisit GPT comme provider
3. "Sauvegarder sous..." depuis onglet 1 → copie du graph dans un 3e onglet
4. Clic entre onglets → switch instantané, chaque onglet retrouve son provider
5. Ferme un onglet → le canvas reste accessible via "Mes graphes"

---

# FONCTIONNALITÉS FUTURES (non spécifiées)

## v0.4.x (Q2 2026)

- ⬜ Recherche avancée dans synthèses (tags, date, contenu)
- ⬜ Templates de canvas prédéfinis
- ⬜ Mode présentation (navigation guidée)

## v0.5.x (Q3-Q4 2026)

- ⬜ Backend API + Cloud sync
- ⬜ Collaboration temps réel
- ⬜ Historique des versions (git-like)

## v1.0.x (2027)

- ⬜ Extensions/Plugins
- ⬜ Mobile (React Native)
- ⬜ Marketplace de templates

## UTILITÉS POSSIBLES FURURES 

- Outil d'aide au dev 
---

# BUGS CONNUS

## ⬜ B001 — Performance >200 vignettes

**Sévérité:** Moyenne

Le rendu devient lent au-delà de 200 vignettes. Lié à A008 (connexions O(n²)) et A035 (collisions O(n²)). Solution prévue : cache + index spatial.

## ⬜ B002 — Capture webview timeout

**Sévérité:** Basse

La capture automatique peut échouer après 8s sur certains providers. Fallback manuel disponible. Lié à A034 (sélecteurs DOM fragiles).

## ✅ B003 — Double context menu webview

**Corrigé:** 9 Février 2026

Deux gestionnaires `context-menu` en double pour les webviews dans `main.js`. Causait l'affichage de deux menus contextuels simultanés. Corrigé en supprimant le handler doublon dans `web-contents-created`.

---

# HISTORIQUE DES DÉCISIONS

## 2026-02-09 — Audit interface mode assisté

**Contexte** : Audit complet de l'interface (HTML, CSS, TS, UX) avant d'ajouter des features.

**Résultat** : 38 items identifiés (A001-A038), organisés en 7 sessions de correction. Priorité donnée à l'intégrité des données (session 1) et aux fuites mémoire (session 2) avant les améliorations UX et design.

**Plan de correction** :
| Session | Focus | Effort | Items |
|---------|-------|--------|-------|
| 1 | Bugs critiques (données) | 2h30 | A001-A006 |
| 2 | Mémoire & performance | 3h | A007-A011 |
| 3 | UX & cohérence | 3h | A012-A017 |
| 4 | Design system & CSS | 4h | A018-A025 |
| 5 | Accessibilité | 2h | A026-A030 |
| 6 | Architecture | 6h | A031-A035 |
| 7 | ✅ Analyseur & métriques | 2h | A036-A038 |
| **Total** | | **~22h** | **38 items** |

## 2026-02-05 — Curseur de friction

**Contexte** : L'utilisateur veut contrôler le niveau de friction.

**Options évaluées** :
1. Modifier le System Prompt — Trop grossier, même effet sur toutes les opérations
2. **Modifier les instructions par opération** — Retenu
3. Bloc friction dynamique — Mélange deux concepts (circularité vs posture)

**Décision** : Approche 2 retenue car :
- Contrôle fin par opération
- Respecte l'architecture existante
- Compatible avec friction automatique

## 2026-02-05 — Migration API opérations structurées

**Contexte** : Les opérations DÉVELOPPER/RELIER/SYNTHÉTISER passent par webview (injection DOM + scraping). Fragile car dépend du DOM des providers.

**Décision** : Ajouter un chemin API direct avec fallback webview automatique.

**Raisons** :
- Infrastructure API déjà présente dans `main.js` (handler `llm-query`)
- Parsers existants réutilisables
- Fallback webview préserve la compatibilité
- Le dialogue libre reste sur webview (pas de changement UX)

## 2026-02-07 — Outillage de développement

**Contexte** : Après les migrations (Vite, TypeScript, ES modules, SQLite), le projet manquait d'outillage qualité.

**Décision** : Implémenter en 4 étapes séquentielles :
1. ESLint + Prettier + Husky (formatage d'abord pour isoler le diff)
2. Vitest (tests unitaires sur fonctions pures)
3. Logger structuré (remplace `console.log` bruts)
4. ARCHITECTURE.md + consolidation docs

**Résultat** : 8 devDependencies, 125 tests, 0 erreurs lint, 3 fichiers migrés logger.

---

**Fin du backlog**
