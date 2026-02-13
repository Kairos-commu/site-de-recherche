# KAIROS --- Registre des Bugs

**Version :** 0.3.x
**Derniere mise a jour :** 11 Fevrier 2026 (session themes + webview + friction + Porcelain warmup)

Ce document recense l'ensemble des bugs identifies, corriges ou en attente dans KAIROS.
Il est organise par session d'audit (fevrier 2026) et par categorie.

---

## Legende

| Icone | Signification |
|-------|---------------|
| :white_check_mark: | Corrige |
| :white_large_square: | En attente |
| :red_circle: | Identifie (non corrige, impact actif) |

---

## Table des matieres

- [Session 1 --- Integrite des donnees](#session-1--intégrité-des-données-critiques)
- [Session 2 --- Fuites memoire et performance](#session-2--fuites-mémoire--performance)
- [Session 3 --- UX et coherence interface](#session-3--ux--cohérence-interface)
- [Session 4 --- Design system et CSS](#session-4--design-system--css)
- [Session 5 --- Accessibilite](#session-5--accessibilité)
- [Session 6 --- Architecture et maintenabilite](#session-6--architecture--maintenabilité)
- [Session 7 --- Analyseur et metriques](#session-7--analyseur--métriques)
- [Session 8 --- UI/UX polish](#session-8--uiux-polish--nettoyage)
- [Bugs de coherence evenementielle](#bugs-de-cohérence-événementielle)
- [Workarounds Electron](#workarounds-electron)
- [Bugs connus actifs](#bugs-connus-actifs)
- [Tableau recapitulatif](#tableau-récapitulatif)

---

## Session 1 --- Integrite des donnees (critiques)

> Ces bugs pouvaient causer une **perte de donnees** ou une **corruption du graphe**.

### :white_check_mark: A001 --- `saveData()` non-awaitee (~20 endroits)

| | |
|---|---|
| **Severite** | CRITIQUE |
| **Fichier** | `src/renderer/js/assisted-app.ts` |
| **Symptome** | Perte de donnees si la page se recharge pendant une ecriture SQLite asynchrone |

**Probleme :** `this.saveData()` etait appelee sans `await` dans ~20 endroits (hooks `createNode`, `deleteNode`, `updateNode`, etc.). Seuls 2 appels faisaient correctement `await this.saveData()`.

**Correction :** Audit de tous les appels. Seul `deleteNode` utilise desormais `await this.saveData()`. Les autres hooks (`createNode`, `createConnection`, `deleteConnection`, `cycleNodeStatus`) utilisent `void this.saveData()` (fire-and-forget) car leurs appelants attendent un retour synchrone.

**:warning: Bug recurrent :** Ce pattern est documente comme piege recurrent. Rendre les autres hooks async change leur type de retour en `Promise`, ce qui casse les appelants et provoque des race conditions (test de persistence : Expected 3, Received 4).

---

### :white_check_mark: A002 --- Collision d'ID vignette

| | |
|---|---|
| **Severite** | CRITIQUE |
| **Fichier** | `src/renderer/js/canvas/nodes.ts` (lignes 61-63) |
| **Symptome** | Corruption du graphe, undo/redo casse |

**Probleme :** L'ID etait `n_{Date.now()}_{nodeIdCounter}`, mais `nodeIdCounter` se reset au rechargement. Deux creations dans la meme milliseconde (import batch) = collision possible.

**Correction :** Remplacement par `n_{crypto.randomUUID()}`.

---

### :white_check_mark: A003 --- `selectedNodes` non nettoye apres suppression

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichier** | `src/renderer/js/canvas/nodes.ts` (fonction `deleteNode`) |
| **Symptome** | Operations sur noeuds fantomes (DEVELOPPER, export partiel) |

**Probleme :** A la suppression d'un noeud, son ID restait dans `cm.interaction.selectedNodes`.

**Correction :** Ajout de `cm.interaction.selectedNodes.delete(node.id)` dans `deleteNode()`.

---

### :white_check_mark: A004 --- Variables CSS non definies

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/styles/assisted.css` |
| **Symptome** | Rendu imprevible (couleurs heritees au lieu de definies) |

**Probleme :** `--validated-color` (5 usages) et `--rejected-color` (1 usage) utilisees mais jamais definies.

**Correction :** Ajout dans `:root` : `--validated-color: #4ade80; --rejected-color: #ef4444;`

---

### :white_check_mark: A005 --- Parsing API sans try-catch

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichier** | `src/renderer/js/assisted/llm-api/executor.ts` (ligne ~88) |
| **Symptome** | Crash silencieux sur reponse API malformee (unhandled promise rejection) |

**Probleme :** `parseAPIResponse()` n'etait pas entoure d'un try-catch.

**Correction :** Try-catch ajoute avec affichage d'erreur user-friendly via `showErrorModal()`.

---

### :white_check_mark: A006 --- Pas de timeout pour les appels API

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichier** | `src/renderer/js/assisted/llm-api/executor.ts` |
| **Symptome** | Operation bloquee indefiniment si l'API ne repond pas |

**Probleme :** Contrairement au webview (8s timeout), les appels API directs via `window.fgraph.llmQuery()` n'avaient aucun timeout.

**Correction :** Wrapper avec `Promise.race([llmQuery(...), timeoutPromise(30000)])`.

---

## Session 2 --- Fuites memoire & performance

### :white_check_mark: A007 --- Fuite memoire : event listeners sur noeuds

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichier** | `src/renderer/js/canvas/nodes.ts` |
| **Symptome** | Croissance memoire en sessions longues avec beaucoup de creations/suppressions |

**Probleme :** Chaque noeud recevait ~5 event listeners (`mousedown`, `click`, `contextmenu`, etc.) via `addEventListener` dans `renderNode()`. A la suppression, `nodeDiv.remove()` retirait le DOM mais les references aux handlers etaient perdues.

**Correction :** Delegation d'evenements deplacee dans `canvas/interactions.ts`. Un seul listener sur `polesContainer` dispatche selon `e.target.closest('.pole')`.

---

### :white_check_mark: A008 --- Rendu connexions SVG O(n^2)

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichier** | `src/renderer/js/canvas/connections.ts` |
| **Symptome** | 50 noeuds x 100 connexions = 10 000 recherches par frame (pan/zoom/drag) |

**Probleme :** `updateConnections()` faisait un `Array.find()` pour chaque connexion a chaque mouvement.

**Correction :** `Map<nodeId, KairosNode>` pour lookups O(1). Dirty flag pour ne recalculer que les connexions dont un noeud endpoint a bouge.

---

### :white_check_mark: A009 --- Tri topologique O(n^2) dans sender.ts

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/js/assisted/webview/sender.ts` (lignes 119-140) |

**Probleme :** La queue etait re-triee a chaque iteration du `while` loop.

**Correction :** `sort()` deplace avant la boucle.

---

### :white_check_mark: A010 --- Minimap en `setInterval` au lieu de `requestAnimationFrame`

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/js/canvas/minimap.ts` |

**Probleme :** `setInterval(fn, 16)` hardcode a 60fps, pas synchronise avec le render loop.

**Correction :** Remplacement par `requestAnimationFrame` avec dirty flag.

---

### :white_check_mark: A011 --- Debounce selection toolbar manquant

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/js/canvas/selection.ts` |

**Probleme :** Ctrl+A sur 100 noeuds = 100 appels a `updateSelectionToolbar()`.

**Correction :** Debounce 50ms.

---

## Session 3 --- UX & coherence interface

### :white_check_mark: A012 --- Cooldown synthese invisible

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/assisted/metrics.ts` |
| **Symptome** | L'utilisateur ne comprend pas pourquoi SYNTHETISER n'est plus propose |

**Probleme :** Apres une synthese, le bandeau changeait de suggestion pendant 60s sans indiquer de cooldown.

**Correction :** Affichage "Synthese disponible dans Xs" dans le bandeau + countdown visuel.

---

### :white_check_mark: A013 --- Connexions pendantes perdues silencieusement

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichier** | `src/renderer/js/canvas/connections.ts` (lignes 199-255) |
| **Symptome** | Import 50 noeuds : connexions en attente abandonnees sans feedback |

**Probleme :** `waitForDOMStable()` timeout a 500ms. Les connexions dont les noeuds cibles n'etaient pas encore rendus etaient perdues.

**Correction :** Notification "8/10 connexions creees, 2 en attente (noeuds introuvables)" via evenement `connectionsPendingResult` + retry optionnel.

---

### :white_check_mark: A014 --- Seuil de drag trop bas (5px)

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/canvas/interactions.ts` (ligne 78) |

**Probleme :** Les utilisateurs de trackpad declenchaient des drags accidentels. Standard souris : 10px.

**Correction :** `const DRAG_THRESHOLD = 10;`

---

### :white_check_mark: A015 --- Filtre + selection : comportement confus

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/assisted/app/toolbar.ts` (ligne 181) |

**Probleme :** Filtre "neutre" desactive + clic "Selectionner neutres" = 0 resultat sans explication.

**Correction :** Notification "Aucun noeud trouve --- le filtre neutre est desactive" ou auto-activation du filtre.

---

### :white_check_mark: A016 --- Viewport (zoom/pan) non persiste

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/canvas/persistence.ts` |
| **Symptome** | Zoom a 1.5x, fermeture app, retour a 1.0x |

**Probleme :** Le zoom/pan etait sauvegarde dans `getData()` mais pas systematiquement restaure.

**Correction :** Sauvegarde viewport dans `saveData()` + restauration dans `loadData()` systematiquement.

---

### :white_check_mark: A017 --- Bouton reload webview : double listener

| | |
|---|---|
| **Severite** | BASSE |
| **Fichiers** | `src/renderer/js/assisted/app/chat.ts` + `src/renderer/js/assisted/webview/ui-controls.ts` |

**Probleme :** `#webview-reload-btn` avait un listener dans les deux fichiers (redondant).

**Correction :** Listener retire de `chat.ts`, conserve dans `ui-controls.ts`.

---

## Session 4 --- Design system & CSS

### :white_check_mark: A018 --- Z-index sans logique semantique

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichiers** | `src/renderer/styles/assisted.css`, `src/renderer/styles/canvas.css` |

**Probleme :** 10 valeurs de z-index (5, 10, 100, 500, 1000, 2000, 9999, 10000, 10001, 99999) sans hierarchie. Modal capture a 10001 (au-dessus des autres modaux a 10000).

**Correction :** Variables CSS semantiques :
```css
--z-canvas: 5; --z-nodes: 10; --z-overlays: 100; --z-floating: 500;
--z-popovers: 1000; --z-modals: 2000; --z-notifications: 2100; --z-tooltips: 2200;
```

---

### :white_check_mark: A019 --- Design tokens incoherents (spacing, radius, fonts)

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichiers** | `src/renderer/styles/assisted.css`, `src/renderer/styles/canvas.css` |

**Probleme :** Padding (4px/5px/6px/8px), border-radius (4/6/8/12px), font-size (12/13/14/16/18px) sans coherence.

**Correction :** Tokens CSS normalises :
```css
--spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 12px; --spacing-lg: 16px; --spacing-xl: 20px;
--radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px; --radius-xl: 12px;
--font-xs: 12px; --font-sm: 13px; --font-base: 14px; --font-md: 16px; --font-lg: 18px;
```

---

### :white_check_mark: A020 --- Pas de `:focus-visible` pour navigation clavier

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/styles/assisted.css` |

**Probleme :** 47 boutons icones inaccessibles au clavier, aucun ring de focus.

**Correction :** `:focus-visible { outline: 2px solid var(--assisted-primary); outline-offset: 2px; }`

---

### :white_check_mark: A021 --- `prefers-reduced-motion` non respecte

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/styles/assisted.css` |

**Probleme :** 14 animations, aucun respect des preferences utilisateur.

**Correction :** Media query `@media (prefers-reduced-motion: reduce)` avec `animation-duration: 0.01ms !important`.

---

### :white_check_mark: A022 --- Hover non uniforme sur boutons

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/styles/assisted.css` |

**Probleme :** 4 patterns differents (`translateY`, `scale`, couleur seule, `opacity`).

**Correction :** Standardise : primaire = `translateY(-1px)`, secondaire = changement couleur.

---

### :white_check_mark: A023 --- Couleur cyan inconsistante

| | |
|---|---|
| **Severite** | BASSE |
| **Fichiers** | `src/renderer/styles/canvas.css`, `src/renderer/styles/assisted.css` |

**Probleme :** `#5a9abf` dans canvas.css vs `#4db8a8` dans assisted.css pour des usages similaires.

**Correction :** Unification en variable `--color-accent-cyan: #5a9abf`.

---

### :white_check_mark: A024 --- Keyframe `friction-glow` duplique

| | |
|---|---|
| **Severite** | BASSE |
| **Fichiers** | `src/renderer/styles/canvas.css`, `src/renderer/styles/assisted.css` |

**Probleme :** Defini dans les deux fichiers, le second ecrasait le premier.

**Correction :** Consolide dans `canvas.css`.

---

### :white_check_mark: A025 --- CSS mort

| | |
|---|---|
| **Severite** | BASSE |
| **Fichiers** | `src/renderer/styles/assisted.css`, `src/renderer/styles/canvas.css` |

**Probleme :** Classes definies mais jamais utilisees : `.pole-actions`, `.show-chat-btn`, `suggested-pole`, `suggested-connections`, `.pole-checkbox`.

**Correction :** Classes supprimees ou nettoyees.

---

## Session 5 --- Accessibilite

### :white_check_mark: A026 --- ARIA labels manquants sur boutons icones

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/assisted.html` |

**Probleme :** 47 boutons avec emoji/icones (&#9974; &#9664; &#9654; etc.) sans `aria-label`. Inaccessible aux lecteurs d'ecran.

**Correction :** `aria-label="Description"` ajoute sur chaque bouton icone.

---

### :white_check_mark: A027 --- Labels manquants sur inputs/textareas

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/assisted.html` |

**Probleme :** `#search-input`, `#context-chat-input`, volume slider, progress bar sans `<label>` associe.

**Correction :** Labels ajoutes.

---

### :white_check_mark: A028 --- Pas de `aria-live` sur regions dynamiques

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/assisted.html` |

**Probleme :** `#webview-status-text`, `#metriques-texte`, `#suggestion-texte` changent sans annonce aux lecteurs d'ecran.

**Correction :** `aria-live="polite"` ajoute.

---

### :white_check_mark: A029 --- Roles semantiques manquants sur sidebar

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/assisted.html` |

**Probleme :** Onglets Syntheses/Prompts sans roles ARIA (`role="tablist"`, `role="tab"`, `role="tabpanel"`).

**Correction :** Roles semantiques ajoutes.

---

### :white_check_mark: A030 --- Connexions archivees quasi-invisibles

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/styles/canvas.css` |

**Probleme :** Couleur `#444` sur fond `#1a1a1a` (ratio contraste ~1.5:1).

**Correction :** Augmente a `#666` pour meilleur contraste.

---

## Session 6 --- Architecture & maintenabilite

### :white_check_mark: A031 --- Monitor webview toujours actif

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/assisted/webview/monitor.ts` |
| **Symptome** | Batterie drainee en sessions longues, erreurs masquees |

**Probleme :** Polling webview (3s) tournait en permanence avec `catch` vide.

**Correction :** Polling uniquement quand webview visible + activite recente. Logging des erreurs.

---

### :white_check_mark: A032 --- Schema DB != UI (4 statuts DB, 2 dans l'UI)

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichiers** | `src/database/db.js`, `src/renderer/js/canvas/nodes.ts`, `src/renderer/js/assisted/metrics.ts` |

**Probleme :** DB supporte `neutral/priority/validated/rejected` et `implies/resonance/conflicts/example`. L'UI n'expose que 2 de chaque. Metriques affichent `vignetteValidees: 0` en permanence.

**Correction :** Limite a `neutral`/`priority` dans l'UI. Champs inutilises nettoyes des metriques.

---

### :white_check_mark: A033 --- `capture.ts` monolithique (1437 lignes)

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/assisted/webview/capture.ts` |

**Probleme :** Script JS d'extraction integre comme string dans le TypeScript. 6 providers entremeles, impossible a tester unitairement.

**Correction :** Extraction partielle. Parsers isoles dans `capture-parsers.ts`.

---

### :white_check_mark: A034 --- Selecteurs DOM LLM fragiles

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichiers** | `src/renderer/js/assisted/webview/providers.ts`, `src/renderer/js/assisted/webview/capture.ts` |

**Probleme :** Claude : `.ProseMirror[contenteditable]` change regulierement. Gemini a 6 selecteurs fallback. Aucun versionnage.

**Correction :** Configuration centralisee dans `providers.ts` avec selecteurs dates.

---

### :white_check_mark: A035 --- Index spatial manquant pour collisions

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichiers** | `src/renderer/js/canvas/layout.ts`, `src/renderer/js/canvas/collisions.ts` |

**Probleme :** `findFreePosition()` est O(n^2) : 100 positions spirale x n noeuds = ~2M comparaisons pour 200 noeuds.

**Correction :** Module `spatial-grid.ts` ajoute pour indexation spatiale.

---

## Session 7 --- Analyseur & metriques

### :white_large_square: A036 --- Diversite basee tags uniquement

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/assisted/analyzer/diversity.ts` |

**Probleme :** Un noeud sans tags = diversite 1.0 (exploration) meme s'il reprend un concept existant. Aucune similarite semantique.

**Correction prevue (minimum) :** Comparaison texte du noeud aux textes existants (Jaccard sur mots-cles).
**Correction prevue (avancee) :** Cosine similarity via API embedding.

---

### :white_large_square: A037 --- Trend diversite : minimum 3 points trop bas

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/js/assisted/analyzer/diversity.ts` |

**Probleme :** 3 points d'historique = bruit domine le signal. Un noeud aleatoire fausse la tendance.

**Correction prevue :** Minimum 5-7 points + moving average au lieu de first-half/second-half.

---

### :white_large_square: A038 --- Choix manuel trop "collant"

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/js/assisted/metrics.ts` |

**Probleme :** Le choix manuel reste affiche tant qu'il n'y a pas 10% de changement. Ajouter 1 noeud sur 20 = 5% : le choix reste (deroutant).

**Correction prevue :** Reduire le seuil a 5% ou expirer le choix manuel apres 2 tours.

---

## Session 8 --- UI/UX polish & nettoyage

### :white_check_mark: A039 --- Correcteur orthographique : suggestions francaises degradees

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `main.js` |

**Probleme :** Mode bilingue `['fr', 'en-US']` melangeait les suggestions ("attrofie" -> "retrofitted" au lieu de "atrophie").

**Correction :** Defaut change a `['fr']` (francais seul) pour la session principale. Radio buttons dynamiques dans le menu contextuel. Session webview reste bilingue `['fr', 'en-US']`.

---

### :white_check_mark: A040 --- Jauge d'oxygene : refonte design vertical

| | |
|---|---|
| **Severite** | BASSE |
| **Fichiers** | `src/renderer/assisted.html`, `src/renderer/styles/assisted.css`, `src/renderer/js/assisted/app/adaptive.ts` |

**Probleme :** La jauge d'oxygene horizontale dans la toolbar comprimait les filtres/selection.

**Correction :** Deplacee en panneau flottant vertical sur le cote gauche du canvas (`position: absolute; left: 12px; top: 76px`). Barre verticale 90px, score en haut, metriques (Div/Attr/Op) en dessous.

---

### :white_check_mark: A041 --- Suppression onglet Captures (sidebar)

| | |
|---|---|
| **Severite** | BASSE |
| **Fichiers** | `src/renderer/assisted.html`, `src/renderer/js/assisted-app.ts`, `src/renderer/js/app.ts` |

**Probleme :** L'onglet Captures (import JSON) etait sous-utilise et empechait l'onglet Prompts de s'afficher (overflow sur 3 onglets en 250px).

**Correction :** Onglet supprime. `captures.ts` supprime. Logique tab-switch deplacee dans `setupAdaptiveSystem()`. Sidebar passe de 3 a 2 onglets.

---

### :white_check_mark: A042 --- ~30 couleurs hardcodees dans les styles inline JS

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichiers** | `src/renderer/js/canvas/menus.ts`, `src/renderer/js/canvas/minimap.ts`, `src/renderer/js/canvas/selection.ts`, `src/renderer/js/assisted/metrics.ts`, `src/renderer/js/assisted-app.ts`, `src/renderer/js/assisted/syntheses/rendering.ts`, `src/renderer/js/assisted/app/prompt-log.ts`, `src/renderer/js/assisted/syntheses/creation.ts` |
| **Symptome** | Changer de theme (ex. Obsidian → Porcelain) ne met pas a jour les menus contextuels, la minimap, la toolbar de selection, le bandeau metriques, les notifications |

**Probleme :** ~30 couleurs hexadecimales hardcodees dans les styles inline crees en JavaScript (`#2a2a2a`, `#3a3a3a`, `#e0e0e0`, `#333`, `#4a5a6a`, `#888`, etc.). Ces valeurs correspondaient au theme Obsidian (dark) et ne suivaient pas le systeme `--theme-*`.

**Correction :** Remplacement systematique de toutes les couleurs hardcodees par des variables CSS :
- `menus.ts` : `#2a2a2a` → `var(--theme-bg-elevated)`, `#3a3a3a` → `var(--theme-border-hover)`, `#e0e0e0` → `var(--theme-text-primary)`, `#333` → `var(--theme-bg-surface)`, hover → `var(--theme-bg-hover)`, boutons → `var(--theme-btn-success)` / `var(--theme-btn-danger)`
- `minimap.ts` : Canvas2D ne supporte pas les variables CSS → lecture dynamique via `getComputedStyle(document.documentElement).getPropertyValue('--theme-*')` avec fallbacks
- `selection.ts` : Toolbar → `var(--theme-btn-success)`, `var(--theme-btn-danger)`, `var(--theme-text-on-accent)`
- `metrics.ts` : Bandeau → `var(--theme-bg-surface)`
- `assisted-app.ts` : Notifications → `var(--theme-notification-bg)`
- `rendering.ts` : Input rename → `var(--theme-bg-surface)`, `var(--theme-text-primary)`
- `prompt-log.ts` : Tags → `var(--theme-text-muted)`
- `creation.ts` : Texte meta-synthese → `var(--theme-text-muted)`

---

### :white_check_mark: A043 --- Fond du canvas ecrase par couleurs oxygen hardcodees

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichiers** | `src/renderer/js/assisted/app/adaptive.ts`, `src/renderer/styles/canvas.css` |
| **Symptome** | Charger un fil dans la webview ou recevoir un score oxygen change le fond du canvas en noir/rouge meme en theme Porcelain (clair). Le fond reste sombre meme apres changement de theme. |

**Probleme :** La mise a jour du score d'oxygene definissait `--canvas-bg` via style inline sur `.canvas-area` avec des couleurs dark hardcodees. Cette valeur inline persistait et ecrasait le theme actif, meme apres changement manuel de theme.

**Correction (v1 — insuffisante) :** Remplacement par `color-mix()` relatif au theme. Abandonnee car la jauge d'oxygene (panneau flottant) fournit deja un feedback visuel suffisant.

**Correction (v2 — finale) :** Suppression complete de la teinte canvas-bg dans `adaptive.ts`. Nettoyage defensif `removeProperty('--canvas-bg')` a chaque tick pour supprimer les valeurs residuelles. CSS `.canvas-area` simplifie a `background-color: var(--theme-bg-main)` (sans fallback `--canvas-bg`).

---

### :white_check_mark: A044 --- Vignettes friction illisibles en theme clair

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/styles/canvas.css` |
| **Symptome** | En theme Porcelain, les vignettes friction sont quasi-identiques aux vignettes normales (fond blanc, texte trop clair). Texte illisible dans tous les themes. |

**Probleme :** Le CSS `.pole.friction-vignette` definissait seulement un `border-left` rouge et un `box-shadow` hardcode. En theme clair, la distinction visuelle etait insuffisante. Une premiere tentative via `color-mix` relative au theme restait trop subtile.

**Correction (v1 — insuffisante) :** `color-mix(in srgb, var(--theme-node-bg-start) 88%, #e74c3c 12%)`. Trop subtile en theme clair comme sombre.

**Correction (v2 — finale) :** Fond fixe dark-red independant du theme (les frictions sont intentionnellement "alarmantes") :
- Fond : `linear-gradient(145deg, #3a1a1a 0%, #2d1515 100%) !important`
- Texte : `.pole-content { color: #ffffff }` force blanc
- Icones : `rgba(255, 255, 255, 0.6)` sur `.pole-menu` et `.pole-connect-btn`
- Tags : `color: #ffcccc` sur fond `rgba(231, 76, 60, 0.35)`
- Box-shadow : `var(--theme-shadow-md)` dans les keyframes
- `border-left: 3px solid #e74c3c` conserve

---

### :white_check_mark: A045 --- Theme Porcelain trop blanc / sterile

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/styles/themes.css` |
| **Symptome** | Le theme Porcelain utilisait du blanc pur (`#ffffff`) en fond principal, donnant un rendu froid et fatiguant pour les yeux |

**Probleme :** Toute la palette Porcelain etait basee sur des blancs purs (`#ffffff`, `#f7f7f5`, `#eeeee9`). Le rendu manquait de chaleur et le contraste avec les vignettes etait insuffisant (fond blanc sur fond blanc).

**Correction :** Palette rechauffee vers des blancs casses :
- `--theme-bg-main` : `#ffffff` → `#f5f5f0`
- `--theme-bg-deep` : `#f0f0eb` → `#eeeee8`
- `--theme-bg-surface` : `#f7f7f5` → `#ededea`
- `--theme-bg-elevated` : `#eeeee9` → `#e6e6e0`
- `--theme-bg-hover` : `#e4e4df` → `#ddddd6`
- Noeuds : `#ffffff/#fafaf8` → `#f8f8f4/#f2f2ec`, bordures et ombres renforcees
- Panels, toolbar, minimap, modals, inputs, notifications tous ajustes

---

### :white_check_mark: A046 --- Bandeau suggestion indistinct + urgente hardcodee

| | |
|---|---|
| **Severite** | BASSE |
| **Fichiers** | `src/renderer/styles/canvas.css`, `src/renderer/styles/assisted.css` |
| **Symptome** | Le bandeau de suggestion se confondait avec le fond du canvas. La variante urgente utilisait des couleurs dark hardcodees (`#2a1a1a`). |

**Probleme :** Le bandeau `.bandeau-suggestion` utilisait `var(--theme-bg-elevated)` comme fond, trop proche du fond canvas. La variante `.urgente` avait un `linear-gradient` hardcode (`#2a1a1a` → `#1a1212`), invisible en theme clair.

**Correction :**
- Bandeau normal : fond passe a `var(--theme-bg-deep)` avec `border-top: 1px solid var(--theme-border-hover)` pour meilleure separation visuelle
- Bandeau urgente : `color-mix(in srgb, var(--theme-bg-deep) 85%, #ef4444 15%)` — teinte rouge relative au theme, visible en clair comme en sombre

---

## Bugs de coherence evenementielle

> Identifies lors de l'audit de coherence du mode assiste (ASSISTED_MODE_REFERENCE.md, section 18).
> Ces bugs affectent le scoring des attracteurs et le tracking comportemental.

### :red_circle: C001 --- Evenement `llmSend` jamais emis

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichiers** | `src/renderer/js/assisted/analyzer/history.ts` (ligne 238), `src/renderer/js/assisted/webview/sender.ts` (ligne 568) |
| **Impact** | `behaviorLogs.llmSends` toujours vide -> composante LLM interactions (20% du score attracteur) = 0 |

**Probleme :** `history.ts` ecoute l'evenement `llmSend` avec `{ nodeId, operation }` (singulier), mais `sender.ts` emet `llmSendTracked` avec `{ nodeIds, operation }` (pluriel). Double incoherence : nom ET structure de l'evenement.

**Correction prevue :** Reconcilier les noms et structures d'evenements.

---

### :red_circle: C002 --- `captureTracked` structure incorrecte

| | |
|---|---|
| **Severite** | HAUTE |
| **Fichiers** | `src/renderer/js/assisted/analyzer/history.ts`, `src/renderer/js/assisted/webview/capture.ts` |
| **Impact** | `trackCapture(e.detail.nodeId)` recoit `undefined` -> captures indexees par `undefined` |

**Probleme :** `history.ts` attend `e.detail.nodeId` (singulier), `capture.ts` emet `e.detail.nodeIds` (array).

**Correction prevue :** Aligner la structure de l'evenement.

---

### :red_circle: C003 --- Evenements `canvas:*` jamais emis

| | |
|---|---|
| **Severite** | MOYENNE |
| **Fichier** | `src/renderer/js/assisted/app/context-chat.ts` |
| **Impact** | Listeners context-chat jamais declenches |

**Probleme :** `context-chat.ts` ecoute `canvas:nodeAdded`, `canvas:nodeDeleted`, `canvas:connectionCreated` mais les evenements reels sont `nodeCreated`, `nodeDeleted`, `connectionCreated` (sans prefixe `canvas:`).

**Correction prevue :** Aligner les noms d'evenements (retirer le prefixe `canvas:` des listeners, ou ajouter les emissions correspondantes).

---

### :red_circle: C004 --- Code mort : `degreeHistory`

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/js/assisted/analyzer/history.ts` |

**Probleme :** Declare dans `createInitialBehaviorLogs()`, serialise/deserialise, mais **jamais alimente**. Aucun `.set()` ni `.get()` nulle part.

**Correction prevue :** Suppression.

---

### :red_circle: C005 --- Code mort : champs legacy MetricsManager

| | |
|---|---|
| **Severite** | BASSE |
| **Fichier** | `src/renderer/js/assisted/metrics.ts` |

**Probleme :** `vignetteValidees`, `vignetteEnCours`, `vignetteRejetees`, `ratioValidation` ne sont jamais assignes mais lus dans `hasSignificantChange()` et `updateMetricsDisplay()`. Affichent "0:white_check_mark: 0&#9898; 0:x:" en permanence.

**Correction prevue :** Suppression des champs et adaptation de l'affichage.

---

## Workarounds Electron

> Contournements specifiques au runtime Electron, documentes dans le code.

### :white_check_mark: E001 --- Webview vole le focus

| | |
|---|---|
| **Fichiers** | `main.js` (lignes 376-388), `preload.js` (ligne 266+) |
| **Ref Electron** | https://github.com/electron/electron/issues/19977 |

**Probleme :** La webview peut voler le focus de la fenetre principale, bloquant les evenements clavier.

**Workaround :** IPC handler `focus-main-window` : `mainWindow.blur(); mainWindow.focus(); mainWindow.webContents.focus();`

---

### :red_circle: E002 --- Selection de texte saute au conteneur parent

| | |
|---|---|
| **Fichier** | `main.js` (lignes 316-343) |

**Probleme :** La selection souris dans le contenu LLM de la webview saute au conteneur parent, creant des zones mortes. Selectionner du texte ligne par ligne fonctionne, mais remonter la souris en debut de ligne provoque la selection du conteneur entier.

**Workaround (v1 — 10 fev) :** Injection CSS via `executeJavaScript` forcant `display: block !important; width: 100% !important;` sur les elements texte. **Insuffisant** — le script peut etre bloque par CSP ou timing.

**Workaround (v2 — 11 fev) :** Migration vers `webContents.insertCSS()` (API native Electron, non affectee par CSP). Ajout de selecteurs `[class*="message"]` et `overflow-x: hidden` sur les conteneurs de reponse. **En cours de validation** — le comportement de selection depend aussi du DOM dynamique des providers LLM (Claude.ai, ChatGPT).

---

### :white_check_mark: E003 --- Suppression de noeud trop rapide

| | |
|---|---|
| **Fichier** | `src/renderer/js/canvas/nodes.ts` (lignes 473-482) |

**Probleme :** Supprimer des noeuds trop vite cause une instabilite du contexte de focus dans Electron.

**Workaround :** Cacher l'element d'abord (`visibility: hidden`, `pointerEvents: none`), puis supprimer le DOM apres 150ms de delai.

---

### :white_check_mark: E004 --- Focus webview apres suppression de noeud

| | |
|---|---|
| **Fichier** | `src/renderer/js/canvas/nodes.ts` (lignes 488-492) |

**Probleme :** La webview retient le focus apres suppression d'un noeud, bloquant le clavier.

**Workaround :** Appel `blurWebview(cm)` avec flag `skipBlurWebview` pour eviter les appels multiples en suppression batch.

---

### :white_check_mark: E005 --- Focus bloque apres clear canvas

| | |
|---|---|
| **Fichier** | `src/renderer/js/canvas/persistence.ts` (lignes 137-140) |

**Probleme :** Apres effacement du canvas, le focus peut rester bloque.

**Workaround :** `if (document.activeElement) { (document.activeElement as HTMLElement).blur(); }`

---

### :white_check_mark: B003 --- Double context menu webview

| | |
|---|---|
| **Corrige** | 9 Fevrier 2026 |
| **Fichier** | `main.js` |

**Probleme :** Deux gestionnaires `context-menu` en double pour les webviews, causant l'affichage de deux menus contextuels simultanes.

**Correction :** Suppression du handler doublon dans `web-contents-created`.

---

## Bugs connus actifs

### :white_large_square: B001 --- Performance >200 vignettes

| | |
|---|---|
| **Severite** | MOYENNE |

Le rendu devient lent au-dela de 200 vignettes. Lie a A008 (connexions O(n^2), corrige) et A035 (collisions, `spatial-grid.ts` ajoute). Amelioration partielle, optimisation supplementaire possible.

---

### :white_large_square: B002 --- Capture webview timeout

| | |
|---|---|
| **Severite** | BASSE |

La capture automatique peut echouer apres 8s sur certains providers. Fallback manuel disponible. Lie a A034 (selecteurs DOM fragiles, mitiges par configuration centralisee).

---

## Tableau recapitulatif

| Session | Categorie | Items | Corriges | En attente |
|---------|-----------|-------|----------|------------|
| 1 | Integrite donnees | A001-A006 | 6 | 0 |
| 2 | Memoire & perf | A007-A011 | 5 | 0 |
| 3 | UX & coherence | A012-A017 | 6 | 0 |
| 4 | Design system CSS | A018-A025 | 8 | 0 |
| 5 | Accessibilite | A026-A030 | 5 | 0 |
| 6 | Architecture | A031-A035 | 5 | 0 |
| 7 | Analyseur | A036-A038 | 0 | 3 |
| 8 | UI/UX polish | A039-A046 | 8 | 0 |
| --- | Coherence events | C001-C005 | 0 | 5 |
| --- | Workarounds Electron | E001-E005, B003 | 5 | 1 |
| --- | Bugs actifs | B001-B002 | 0 | 2 |
| **Total** | | **56** | **48** | **11** |

---

**Fin du registre**
