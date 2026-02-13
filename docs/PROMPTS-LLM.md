# KAIROS — Métriques & Prompts LLM

Document unique : **comment le système décide quoi faire** et **ce qu'il envoie au LLM**.

---

## Le flux complet (de l'action utilisateur au prompt LLM)

```
 Action utilisateur (crée, connecte, supprime, sélectionne)
         |
         v
 +-----------------------+
 | MetricsManager        |  Recalcule les compteurs (debounce 100ms)
 | calculateMetrics()    |  11 métriques : vignettes, connexions, isolées, densité...
 +-----------------------+
         |
         v
 +-----------------------+
 | CanvasAnalyzer        |  Analyse le canvas en profondeur
 | diversityTrend()      |  --> converging / exploring / stable / insufficient_data
 | detectCircularity()   |  --> score 0-N (6 signaux pondérés)
 +-----------------------+
         |
         v
 +-----------------------+
 | OxygenManager         |  Jauge de vitalité cognitive (5 signaux)
 | evaluate() / record() |  --> score 0-100, frictionLevel, shouldInjectFriction
 +-----------------------+
         |
         v
 +-----------------------+
 | decideOperation()     |  Croise métriques + oxygen + diversité + circularité
 |                       |  --> { operation, subMode, raison, priorité }
 |                       |  Oxygen < 50 → force diverger (priorité 2)
 +-----------------------+
         |
         v
 +-----------------------+
 | Bandeau UI            |  Affiche la suggestion à l'utilisateur
 | "DÉVELOPPER suggéré"  |  L'utilisateur peut accepter ou choisir manuellement
 +-----------------------+
         |
         v  (utilisateur lance l'opération)
 +-----------------------+
 | buildAdaptivePrompt() |  Assemble le prompt en 5 couches
 |                       |  --> texte envoyé au LLM
 +-----------------------+
         |
         v
 +-----------------------+
 | LLM (API ou webview)  |  Génère la réponse
 +-----------------------+
         |
         v
 +-----------------------+
 | Parsers               |  Extrait [NOUVELLE VIGNETTE], [CONNEXION], [FRICTION]
 | capture-parsers.ts    |  --> nœuds et connexions ajoutés au canvas
 +-----------------------+
```

---

## 1. Les Métriques (ce que le système mesure)

### 11 compteurs de base

```
 totalVignettes
 vignettesActives           (= totalVignettes, toutes actives)
 vignettePrioritaires       status === 'priority'
 vignetteNeutres            status === 'neutral'
 vignetteConnectees         au moins 1 connexion (CLÉ DE DÉCISION)
 vignetteIsolees            0 connexion
 connexionsTotal
 connexionsImplique         type → (implies)
 connexionsResonance        type ↔ (resonance)
 densiteConnexions          connexionsTotal / vignettesActives
 ratioPriorite              prioritaires / total
```

### 3 indicateurs avancés

```
 diversityTrend ──── converging | exploring | stable | insufficient_data
                     (indice de Shannon sur les tags, historique 5+ points)

 circularityScore ── 0 à N (somme pondérée de 6 signaux)
                     > 3 = friction modérée, > 4.5 = friction forte

 oxygenScore ─────── 0 à 100 (jauge de vitalité cognitive)
                     > 50 = respire, 30-50 = stagne, < 30 = asphyxie
                     Score < 50 → force subMode 'diverger' dans MetricsManager
```

---

## 2. L'Arbre de Décision (comment l'opération est choisie)

### Mode global (aucune sélection)

```
                  Canvas < 3 vignettes ?
                 /                       \
               OUI                       NON
                |                         |
          DÉVELOPPER               Oxygen score < 50 ?
          (haute)                  (et >= 5 vignettes)
                                  /                   \
                                OUI                   NON
                                 |                     |
                           DÉVELOPPER            Données diversité ?
                           diverger             /                   \
                           (O2 < 30 =       < 3 points           3+ points
                            urgente,            |                     |
                            sinon haute)  Fallback legacy         Quel trend ?
                                         (voir ci-dessous)      /     |      \
                                                        converging  exploring  stable
                                                            |          |         |
                                                       circ score?  >30% iso?  circ <= 1 ?
                                                      /    |    \   /     \    /       \
                                                   >seuil >1  <=1 OUI  NON  OUI      NON
                                                     |     |    |   |    |    |         |
                                                   DEVEL DEVEL DEVEL RELIER  null    DÉVELOPPER
                                                   diverg diverg diverg moy "explore approfondir
                                                   urgent haute  moy        naturel"
```

### Fallback legacy (quand diversité < 3 points)

```
 >= 25 connectées  -->  SYNTHÉTISER urgente
 >= 15 connectées  -->  SYNTHÉTISER haute
 > 30% isolées     -->  RELIER moyenne
 densité < 0.5     -->  DÉVELOPPER moyenne
 >= 8 connectées   -->  SYNTHÉTISER basse
 cooldown actif    -->  DÉVELOPPER normale
 défaut            -->  DÉVELOPPER normale
```

### Mode sélection (vignettes sélectionnées)

```
 1-5 sélectionnées  -->  DÉVELOPPER (toujours)
 6-9 sélectionnées  -->  connectivité interne < 30% ?
                         OUI --> RELIER
                         NON --> DÉVELOPPER
 10+ sélectionnées  -->  SYNTHÉTISER (toujours)
```

---

## 3. Les 5 Signaux Oxygen

```
 Signal              Delta     Déclencheur
 ─────────────────── ───────── ─────────────────────────────────────────
 newTags              +10/tag   Tags non vus dans les 3 derniers tours (cap +20/tour)
 canvasRedundancy     -20       Jaccard all-pairs > 0.35 entre 2 vignettes
 stagnation           -15/tour  Tours consécutifs sans nouveau tag
 frictionBonus        +20       Utilisateur a accepté une [FRICTION] (cap +20/tour)
 graphStructure       -25/-10   ratio conn/nodes < 1.0 ou > 3.0 (>= 8 nodes)
                      +5        ratio 1.0-2.0 (sain), -10 par composante déconnectée

 Score = 50 (défaut) + somme des deltas, clampé [0, 100]
 - Score > 50 : respire (vert) → pas de friction
 - Score 30-50 : stagne (orange) → friction modérée + diverger forcé
 - Score < 30 : asphyxie (rouge) → friction radicale + diverger urgente
```

---

## 4. Mécanismes de Stabilité

### Cooldown synthèse

```
 Synthèse exécutée --> cooldown 60s --> SYNTHÉTISER plus suggéré
                                       bandeau affiche "Synthèse disponible dans Xs"
```

### Choix manuel

```
 Utilisateur choisit une opération manuellement
   → dernierChoixManuel mémorisé + compteur recalculs
   → Expire après 2 recalculs OU si variation métriques > 10%
```

---

## 5. Ce que l'Utilisateur Voit

### Bandeau de suggestion

```
 ┌──────────────────────────────────────────────────────────────────┐
 │ 🌱 DÉVELOPPER (diverger) suggéré : Le canvas se referme —       │
 │    explorer un territoire adjacent.                             │
 └──────────────────────────────────────────────────────────────────┘

 Emojis :  🌱 DÉVELOPPER   🔗 RELIER   📦 SYNTHÉTISER   ✦ (pas de suggestion)
```

### Jauge Oxygen (panneau flottant gauche)

```
 ┌─────┐
 │  72 │  Score (0-100)
 │ ░░░ │
 │ ░░░ │  Barre verticale (vert/orange/rouge)
 │ ███ │
 │ ███ │
 ├─────┤
 │ Div │  Indice de diversité
 │ Att │  Nb attracteurs
 │ Op  │  Dernière opération
 └─────┘
  Ctrl+Shift+D pour masquer/afficher
```

### Résumé : quand chaque opération se déclenche

```
 Canvas quasi vide (< 3)           --> DÉVELOPPER approfondir
 Oxygen stale (score < 50)         --> DÉVELOPPER diverger (haute / urgente si < 30)
 Canvas convergent (diversité ↓)   --> DÉVELOPPER diverger
 Beaucoup d'orphelins (> 30%)      --> RELIER
 Canvas dense (densité > 0.8)      --> SYNTHÉTISER
 Canvas mature (>= 15 connectées)  --> SYNTHÉTISER
 Exploration naturelle             --> Pas de suggestion (null)
 Défaut                            --> DÉVELOPPER approfondir
```

---

## 6. L'Assemblage du Prompt (les 5 couches)

```
 ┌─────────────────────────────────────────────────┐
 │  COUCHE 1 — Prompt système                      │
 │  "Tu reçois un graphe de pensée non-linéaire.   │
 │   Statuts : ○ neutre, 🎯 prioritaire..."         │
 │  (commun à toutes les opérations)               │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 0 — Cadrage structurel                  │
 │  Anti-arborescence : oblige le LLM à produire   │
 │  des boucles/remontées, pas juste des branches  │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 2 — Contexte du graphe                  │
 │  Synthèses réinjectées + vignettes triées       │
 │  topologiquement + connexions                   │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 3 — Instruction d'opération             │
 │  8 templates selon opération × subMode × régime │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 4 — Friction (optionnelle)              │
 │  Injectée si oxygen score < 50                  │
 │  Modérée (30-50) ou Forte (<30)                 │
 └─────────────────────────────────────────────────┘
```

---

# Les 8 Templates de Prompt

### Rôle des opérations

| Opération | Sortie | Rôle |
|-----------|--------|------|
| DÉVELOPPER (approfondir) | `[NOUVELLE VIGNETTE]` + `[CONNEXION]` | Générer des idées ET les relier au graphe |
| DÉVELOPPER (diverger) | `[NOUVELLE VIGNETTE]` + `[CONNEXION]` | Ouvrir des territoires adjacents (canvas convergent) |
| RELIER | `[CONNEXION]` uniquement | Connecter les nœuds isolés/orphelins — maintenance structurelle |
| SYNTHÉTISER | 3 blocs structurés (FIL ROUGE / ANGLES MORTS / QUESTION) | Produire une lecture structurée du graphe |

---

## Cadrage Structurel (Couche 0 — toujours actif)

Avant chaque prompt d'opération, un bloc de **cadrage structurel** est injecté automatiquement. Son rôle : empêcher le LLM de produire des arborescences (du général au particulier) au lieu de cartographies (boucles, rétroactions, remontées).

**Pour DÉVELOPPER :**
```
CADRE STRUCTUREL :
Un graphe sain contient des boucles de rétroaction,
pas seulement des ramifications.
Si tes vignettes ne font que descendre du général au particulier,
tu produis une arborescence, pas une cartographie.

Critères :
- Au moins une vignette doit REMONTER vers un nœud existant
  en position haute (🎯 ou fortement connecté) pour le contester,
  le nuancer, ou poser une condition à sa validité.
- Les vignettes qui prolongent sans contester sont du bruit,
  pas du développement.
- Si le graphe dépasse 15 vignettes, ce critère est OBLIGATOIRE.
  En dessous, il reste une orientation.
```

**Pour RELIER :**
```
CADRE STRUCTUREL :
Un graphe où toutes les connexions descendent
(du général au particulier) est arborescent, pas systémique.

Critères :
- Vérifie la directionnalité globale des connexions existantes.
- Propose au moins une connexion REMONTANTE :
  un nœud périphérique qui contraint, invalide,
  ou conditionne un nœud central.
- Une connexion qui redouble un lien existant
  sous une autre formulation n'est pas une connexion,
  c'est un écho.
- Si le graphe dépasse 15 vignettes et que TOUTES les connexions
  existantes sont descendantes, signale-le explicitement
  avant de proposer tes connexions.
```

**Pour SYNTHÉTISER :**
```
CADRE STRUCTUREL :
Avant de produire ton fil rouge, observe la FORME du graphe :
- Les connexions vont-elles toutes dans le même sens ?
- Y a-t-il des boucles de rétroaction ou seulement
  des ramifications ?
- Les nœuds marqués #friction sont-ils en position terminale
  (= décoratifs) ou insérés dans des boucles (= structurels) ?

Si le graphe est arborescent, nomme-le dans les angles morts.
Ne produis pas un fil rouge "complexe" d'un graphe simple.
La forme du graphe EST une information.
```

> **Fichier source :** `src/renderer/data/prompt-templates.ts` (lignes 69-114, objet `structuralFraming`)

---

## Prompt Système (commun à toutes les opérations)

```
Tu reçois un graphe de pensée non-linéaire.

Les nœuds sont des éléments simultanés, pas des étapes.
Leur ordre de présentation n'implique aucune hiérarchie.

Statuts :
- ○ neutre
- 🎯 appelle un développement prioritaire

Connexions entre nœuds :
- → implication ou dépendance
- ↔ co-conditionnement mutuel

Tags (#) : dimensions transversales du graphe.
Un tag partagé par plusieurs nœuds signale un axe qui les traverse.
Un tag isolé signale une dimension amorcée mais pas déployée.
```

---

## 1. DÉVELOPPER

DÉVELOPPER produit à la fois des **vignettes** et des **connexions**. L'idée : chaque nouvelle idée générée doit être reliée au graphe existant dès sa création, pas dans une étape séparée.

### Régime A — Graphe entier (aucune sélection)

```
[SYNTHÈSES RÉINJECTÉES — optionnel]
Explorations passées :
Synthèse "Titre" (N vignettes, JJ/MM/AAAA) :
Contenu...
---

Graphe actuel :

1. [Texte] ○ | #tag1 #tag2
2. [Texte] 🎯 | #tag3
3. [Texte] ○

CONNEXIONS :
- "Nœud A" → "Nœud B" [mécanisme textuel]
- "Nœud B" ↔ "Nœud C" [mécanisme textuel]

---

TÂCHE : Génère {targetCount} nouvelles vignettes pour ce graphe.

Observe d'abord :
- Quelles zones du graphe sont sous-explorées ?
- Quels tags n'apparaissent que sur un seul nœud ?
- Quelles tensions entre nœuds ne sont pas nommées ?
- Que suggèrent les connexions sans le dire ?

Les vignettes peuvent prolonger, contester, ou ouvrir
un territoire adjacent. Elles ne reformulent pas l'existant.

FORMAT DE RÉPONSE — chaque vignette sur ce modèle exact :
[NOUVELLE VIGNETTE] Texte concis de l'idée | #tag1 #tag2

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].

CONNEXIONS — pour chaque vignette qui prolonge, conteste
ou précise un nœud existant, indique le lien :
[CONNEXION] "Texte exact source" → "Texte exact cible" | Mécanisme précis
[CONNEXION] "Texte exact source" ↔ "Texte exact cible" | Mécanisme précis

→ = implication (A conditionne B)
↔ = co-conditionnement (A et B se contraignent mutuellement)

IMPORTANT : utilise le TEXTE EXACT des vignettes entre guillemets.
Le mécanisme nomme COMMENT les nœuds sont liés.
```

### Régime B — Branche sélectionnée

```
[SYNTHÈSES RÉINJECTÉES — optionnel]
Explorations passées :
Synthèse "Titre" (N vignettes, JJ/MM/AAAA) :
Contenu...
---

SÉLECTION (focus) :
1. [Texte] ✓ | #tag1 #tag2
2. [Texte] ✓ | #tag3
3. [Texte] ✓ | #tag1

CONNEXIONS INTERNES :
- "Nœud 1" → "Nœud 2" [mécanisme textuel]
- "Nœud 2" → "Nœud 3" [mécanisme textuel]

VOISINAGE (hors sélection mais connecté) :
4. [Texte] ○ | #tag4
   ↔ "Nœud 1" [mécanisme textuel]

---

TÂCHE : Génère {targetCount} nouvelles vignettes
qui prolongent cette branche.

Observe d'abord :
- Quelle direction cette séquence dessine-t-elle
  sans la nommer ?
- Qu'est-ce qui manquerait pour que cette branche
  tienne toute seule ?
- Les nœuds voisins signalent-ils une bifurcation
  que la sélection ignore ?
- Y a-t-il une tension interne entre ces nœuds
  que leur connexion masque ?

Les vignettes restent dans le prolongement de la branche
ou révèlent ce qu'elle présuppose sans le dire.
Elles ne reformulent pas l'existant.

FORMAT DE RÉPONSE — chaque vignette sur ce modèle exact :
[NOUVELLE VIGNETTE] Texte concis de l'idée | #tag1 #tag2

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].

CONNEXIONS — pour chaque vignette qui prolonge, conteste
ou précise un nœud de la branche, indique le lien :
[CONNEXION] "Texte exact source" → "Texte exact cible" | Mécanisme précis
[CONNEXION] "Texte exact source" ↔ "Texte exact cible" | Mécanisme précis

→ = implication (A conditionne B)
↔ = co-conditionnement (A et B se contraignent mutuellement)

IMPORTANT : utilise le TEXTE EXACT des vignettes entre guillemets.
Le mécanisme nomme COMMENT les nœuds sont liés.
```

### Sous-mode DIVERGER (canvas convergent)

Quand le MetricsManager détecte une convergence (`subMode: 'diverger'`), les prompts DÉVELOPPER utilisent des templates différents qui forcent l'ouverture vers des territoires conceptuels adjacents.

**Variable supplémentaire :** `{topKeywordsCanvas}` — les 10 mots-clés les plus fréquents sur le canvas, calculés par `canvasAnalyzer.getCanvasTopKeywords(10)`.

#### Régime A — Graphe entier (diverger)

```
Mots-clés DÉJÀ surreprésentés sur ce canvas :
{topKeywordsCanvas}

TÂCHE : Ce canvas converge autour des mêmes concepts.
Il a besoin de TERRITOIRES ADJACENTS, pas de reformulations.

Propose 2 à 4 nouvelles vignettes qui :
1. Ne réutilisent AUCUN des mots-clés surreprésentés listés ci-dessus
2. Ouvrent un CHAMP CONCEPTUEL DIFFÉRENT relié au sujet par un pont logique
3. Apportent une perspective, une discipline ou un angle
   que le canvas n'explore pas encore

Pour chaque vignette, indique le PONT CONCEPTUEL
qui la relie au canvas existant.

FORMAT DE RÉPONSE :
[NOUVELLE VIGNETTE] Texte de la vignette | #tag1 #tag2
Pont : explication du lien avec le canvas existant

[CONNEXION] "Texte vignette source" → "Texte vignette cible" | Mécanisme : le pont conceptuel

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].
```

#### Régime B — Branche sélectionnée (diverger)

```
Mots-clés DÉJÀ surreprésentés sur ce canvas :
{topKeywordsCanvas}

TÂCHE : À partir des vignettes sélectionnées,
propose 1 à 3 nouvelles vignettes qui ouvrent vers
un CHAMP ADJACENT non encore exploré par le canvas.

Les nouvelles vignettes ne doivent PAS reformuler
les concepts existants. Elles doivent apporter
un ANGLE NOUVEAU relié par un pont logique.

N'utilise PAS les mots-clés surreprésentés listés ci-dessus.

FORMAT DE RÉPONSE :
[NOUVELLE VIGNETTE] Texte de la vignette | #tag1 #tag2
Pont : lien avec les vignettes sélectionnées

[CONNEXION] "Texte source" → "Texte cible" | Mécanisme : pont conceptuel

Si une vignette remet en question un présupposé du graphe,
utilise [FRICTION] au lieu de [NOUVELLE VIGNETTE].
```

### Paramètres dynamiques DÉVELOPPER

| Paramètre             | Valeur    | Condition                            |
| --------------------- | --------- | ------------------------------------ |
| `{targetCount}`       | `3-5`     | Canvas < 10 vignettes                |
| `{targetCount}`       | `2-3`     | Canvas 10-24 vignettes               |
| `{targetCount}`       | `1-2`     | Canvas ≥ 25 vignettes                |
| Régime                | A         | Aucune vignette sélectionnée         |
| Régime                | B         | Vignettes sélectionnées              |
| subMode               | approfondir | Défaut (explore en profondeur)       |
| subMode               | diverger  | Canvas convergent (ouvre de nouveaux territoires) |
| Synthèses réinjectées | Présentes | Si synthèses archivées sélectionnées |

---

## 2. RELIER

RELIER ne produit que des **connexions**. Son rôle est la **maintenance structurelle** : connecter les nœuds isolés ou orphelins dans le graphe. Depuis que DÉVELOPPER produit ses propres connexions, RELIER se concentre sur les lacunes structurelles.

### Régime A — Graphe entier (aucune sélection)

```
Graphe actuel :

1. [Texte] ○ | #tag1 #tag2
2. [Texte] 🎯 | #tag3
3. [Texte] ○ | #tag1
4. [Texte] ○

CONNEXIONS EXISTANTES :
- "Nœud 1" → "Nœud 2" [mécanisme textuel]
- "Nœud 2" ↔ "Nœud 3" [mécanisme textuel]

---

TÂCHE : Identifie des connexions manquantes dans ce graphe.

Observe d'abord :
- Quels nœuds partagent des tags sans être connectés ?
- Quels nœuds semblent éloignés mais présupposent
  la même chose ?
- Y a-t-il des nœuds isolés qui répondent à une question
  posée ailleurs dans le graphe ?
- Les connexions existantes laissent-elles un chemin
  implicite non tracé ?

Ne produis que les connexions que la structure justifie.
S'il n'y en a qu'une, n'en donne qu'une.
S'il n'y en a pas, dis-le.

FORMAT DE RÉPONSE — chaque connexion sur ce modèle exact :
[CONNEXION] "Texte exact A" → "Texte exact B" | Mécanisme précis

Le mécanisme nomme COMMENT les nœuds sont liés,
pas seulement QU'ils le sont.
Le mécanisme sera affiché dans le graphe.
Formule-le comme une phrase lisible autonome.

Exemples :
✗ "Lien thématique" / "Relation de cause à effet" / "Écho"
✓ "Le premier pose la condition que le second présuppose"
✓ "Opposition : l'un traite l'écriture comme processus,
    l'autre comme produit"
```

### Régime B — Branche sélectionnée

```
SÉLECTION (focus) :
1. [Texte] ✓ | #tag1
2. [Texte] ✓ | #tag2
3. [Texte] ✓ | #tag1 #tag3

CONNEXIONS INTERNES :
- "Nœud 1" → "Nœud 2" [mécanisme textuel]

VOISINAGE (hors sélection mais connecté) :
4. [Texte] ○ | #tag2
   ↔ "Nœud 1" [mécanisme textuel]
5. [Texte] ○ | #tag4

---

TÂCHE : Identifie des connexions manquantes
dans cette branche ou entre cette branche et son voisinage.

Observe d'abord :
- La séquence interne a-t-elle des sauts ?
  Deux nœuds qui devraient être reliés mais ne le sont pas ?
- Un nœud voisin complète-t-il ou contredit-il
  un nœud de la sélection ?
- Les tags dessinent-ils un lien transversal
  que les connexions directes ne montrent pas ?
- Y a-t-il une dépendance implicite que la branche
  traite comme acquise ?

Ne produis que les connexions que la structure justifie.
S'il n'y en a qu'une, n'en donne qu'une.
S'il n'y en a pas, dis-le.

FORMAT DE RÉPONSE — chaque connexion sur ce modèle exact :
[CONNEXION] "Texte exact A" → "Texte exact B" | Mécanisme précis

Le mécanisme nomme COMMENT les nœuds sont liés,
pas seulement QU'ils le sont.
Le mécanisme sera affiché dans le graphe.
Formule-le comme une phrase lisible autonome.

Exemples :
✗ "Lien thématique" / "Relation de cause à effet" / "Écho"
✓ "Le premier pose la condition que le second présuppose"
✓ "Opposition : l'un traite l'écriture comme processus,
    l'autre comme produit"
```

---

## 3. SYNTHÉTISER

SYNTHÉTISER produit une lecture structurée en **3 blocs obligatoires** : FIL ROUGE, ANGLES MORTS, QUESTION. Ce format remplace l'ancien format prose libre (4 blocs LECTURE/TENSIONS/ANGLES MORTS/QUESTION). TENSIONS a été supprimé car les frictions sont désormais visibles directement sur le canvas.

### Régime A — Graphe entier (aucune sélection)

```
[SYNTHÈSES RÉINJECTÉES — optionnel]
Explorations passées :
Synthèse "Titre" (N vignettes, JJ/MM/AAAA) :
Contenu...
---

Graphe actuel :

1. [Texte] ○ | #tag1 #tag2
2. [Texte] 🎯 | #tag3
3. [Texte] ○ | #tag1
4. [Texte] ○ | #tag2 #tag3

CONNEXIONS :
- "Nœud 1" → "Nœud 2" [mécanisme textuel]
- "Nœud 2" ↔ "Nœud 3" [mécanisme textuel]
- "Nœud 3" → "Nœud 4" [mécanisme textuel]

---

Tu reçois un graphe cognitif (vignettes + connexions + tags).

Produis EXACTEMENT 3 blocs. Rien d'autre. Pas d'introduction, pas de conclusion.

FIL ROUGE
Raconte le graphe comme si tu l'expliquais à quelqu'un qui ne le voit pas.
- Narration linéaire des idées principales, en ordre logique (pas l'ordre de création).
- 3 à 5 phrases en prose, pas de liste à puces.
- Ne décris pas la structure ("ce graphe dessine..."), raconte le contenu.
- Nomme les nœuds ou tags concernés quand c'est utile.

ANGLES MORTS
- Présupposés non questionnés.
- Zones sous-explorées, absences notables.
- Liens manquants entre des nœuds qui devraient se parler.

QUESTION
- Une seule question. Celle que le graphe pose sans la formuler.
- Pas une question de synthèse ou de compromis.
- Test : si on l'ajoutait comme vignette, elle forcerait à redessiner des connexions.
- Pas rhétorique, pas consensuelle.

Format strict :
FIL ROUGE
(prose)

ANGLES MORTS
- ...

QUESTION
- ...
```

### Régime B — Branche sélectionnée

```
[SYNTHÈSES RÉINJECTÉES — optionnel]
Explorations passées :
Synthèse "Titre" (N vignettes, JJ/MM/AAAA) :
Contenu...
---

SÉLECTION (focus) :
1. [Texte] ✓ | #tag1
2. [Texte] ✓ | #tag2
3. [Texte] ✓ | #tag1 #tag3

CONNEXIONS INTERNES :
- "Nœud 1" → "Nœud 2" [mécanisme]
- "Nœud 2" → "Nœud 3" [mécanisme]

VOISINAGE (hors sélection mais connecté) :
4. [Texte] ○ | #tag2
   ↔ "Nœud 1" [mécanisme]

---

Tu reçois une branche d'un graphe cognitif (vignettes sélectionnées + connexions + tags).

Produis EXACTEMENT 3 blocs. Rien d'autre. Pas d'introduction, pas de conclusion.

FIL ROUGE
Raconte cette branche comme si tu l'expliquais à quelqu'un qui ne la voit pas.
- Narration linéaire des idées principales, en ordre logique (pas l'ordre de création).
- 3 à 5 phrases en prose, pas de liste à puces.
- Ne décris pas la structure ("cette branche dessine..."), raconte le contenu.
- Nomme les nœuds ou tags concernés quand c'est utile.

ANGLES MORTS
- Présupposés non questionnés par cette branche.
- Zones sous-explorées, absences notables.
- Liens manquants entre des nœuds qui devraient se parler.
- Le voisinage signale-t-il un angle mort ?

QUESTION
- Une seule question. Celle que la branche pose sans la formuler.
- Pas une question de synthèse ou de compromis.
- Test : si on l'ajoutait comme vignette, elle forcerait à redessiner des connexions.
- Pas rhétorique, pas consensuelle.

Format strict :
FIL ROUGE
(prose)

ANGLES MORTS
- ...

QUESTION
- ...
```

---

## Injection de Friction (DÉVELOPPER et RELIER)

La friction fonctionne en 3 niveaux, pilotés par la surveillance de circularité.
SYNTHÉTISER n'a pas de friction injectée — ses questions d'observation
remplissent ce rôle structurellement.

### Signaux de circularité (6 signaux)

Le score de circularité est calculé par `detectCircularity()` dans `friction.ts`. Chaque signal détecté ajoute son poids au score total :

| Signal | Poids | Condition de déclenchement |
|--------|-------|---------------------------|
| `reformulation` | 2 | Vignette sémantiquement proche d'une existante (Jaccard > seuil) |
| `boucle_connexion` | 3 | Cycle détecté dans les connexions (A → B → C → A) |
| `stagnation` | 2 | 3+ tours sans concept nouveau |
| `validation_vide` | 1 | Réponse utilisateur type "oui", "ok", "d'accord" |
| `tags_saturés` | 1 (x nb tags) | Même tag sur >5 vignettes |
| `echo_llm` | 2 | LLM répète une formulation de l'utilisateur (similarité > 0.6) |

**Seuil de friction :** `circularityThreshold = 3` (config). Si score > 3 → friction modérée. Si score > 4.5 (seuil × 1.5) → friction forte.

**Cooldown :** Minimum 3 tours entre deux injections de friction (`minTurnsBetweenFriction`).

**Bonus anti-circularité :** Quand l'utilisateur accepte une vignette `[FRICTION]`, le score est réduit de 1 au tour suivant.

> **Fichier source :** `src/renderer/js/assisted/analyzer/friction.ts` (lignes 23-86) + `config.ts` (lignes 44-51)

### Niveau 0 — Aucune circularité détectée

Pas d'injection. Le prompt fonctionne tel quel.

- DÉVELOPPER : le modèle peut utiliser `[FRICTION]` s'il le juge pertinent
- RELIER : les questions d'observation contiennent déjà de la friction structurelle

### Niveau 1 — Circularité modérée

Ajout en fin de prompt :

**Pour DÉVELOPPER :**

```
⚠️ Ce graphe montre des signes de circularité.
Au moins une vignette DOIT être marquée [FRICTION].
```

**Pour RELIER :**

```
⚠️ Ce graphe montre des signes de circularité.
Vérifie que les connexions proposées ne redoublent pas
des liens déjà présents sous une autre formulation.
```

### Niveau 2 — Circularité forte

Ajout en fin de prompt avec information temporelle :

**Pour DÉVELOPPER :**

```
⚠️ Les dernières générations ont produit des vignettes
proches de : "{résumé ou mots-clés des vignettes récentes}"

Le graphe stagne dans cette zone.
Tes vignettes DOIVENT sortir de ce périmètre sémantique.
Au moins une DOIT être marquée [FRICTION].
```

**Pour RELIER :**

```
⚠️ Les dernières connexions produites utilisaient
des mécanismes proches de : "{résumé des mécanismes récents}"

Propose des connexions dont le mécanisme est structurellement
différent de ceux déjà présents.
```

## Format des Vignettes en Entrée

```
{index}. [{text}] {status} | {tags}
```

| Élément  | Format                                               | Exemple                         |
| -------- | ---------------------------------------------------- | ------------------------------- |
| `index`  | Numéro séquentiel                                    | `1.`, `2.`, `3.`                |
| `text`   | Texte de la vignette                                 | `L'attention est une ressource` |
| `status` | `○` (neutre) ou `🎯` (priorité) ou `✓` (sélectionné) | `○`                             |
| `tags`   | `#tag1 #tag2` si présents                            | `#cognition #attention`         |

## Format des Connexions en Entrée

```
"Texte exact nœud A" → "Texte exact nœud B" [mécanisme textuel]
```

| Symbole | Type        | Signification             |
| ------- | ----------- | ------------------------- |
| `→`     | `implies`   | Implication, dépendance   |
| `↔`     | `resonance` | Co-conditionnement mutuel |

Le mécanisme textuel entre crochets est le texte affiché
en infobulle sur la connexion dans le graphe.

---

## Échantillonnage des Vignettes

Si plus de 15 vignettes, échantillonnage appliqué :

1. Vignettes sélectionnées / prioritaires conservées en priorité
2. Vignettes restantes triées par **date de création** (les plus récentes en premier)
3. Limite à 15 vignettes maximum

> **Fichier source :** `src/renderer/js/assisted/llm.ts` (méthode `echantillonner`, lignes 461-469)

---

## Détection de régime

| Condition                    | Régime            |
| ---------------------------- | ----------------- |
| Aucune vignette sélectionnée | A (graphe entier) |
| 1+ vignettes sélectionnées   | B (branche)       |

En régime B, les vignettes non sélectionnées mais connectées
à la sélection sont incluses en VOISINAGE.

---

## Tri Topologique des Vignettes

Avant d'être envoyées au LLM, les vignettes sont triées par l'algorithme de **Kahn** (tri topologique) pour que les sources (nœuds sans dépendances entrantes) apparaissent en premier dans le prompt.

Règles :
- Seules les connexions **implies** (`→`) définissent l'ordre. Les **resonance** (`↔`) sont ignorées.
- Les nœuds de même niveau sont départagés par timestamp de création.
- Les nœuds dans des cycles ou isolés sont ajoutés à la fin.
- Si aucune connexion, fallback sur l'ordre de création.

> **Fichier source :** `src/renderer/js/assisted/llm.ts` (méthode `sortNodesTopologically`, lignes 162-237)

---

## Filtrage des Vignettes Archivées

Les vignettes marquées `synthesized: true` (archivées via synthèse) sont **exclues** de toutes les opérations. Elles ne sont jamais envoyées au LLM comme contexte de graphe actif.

Les synthèses archivées peuvent cependant être **réinjectées** séparément (bloc `[SYNTHÈSES RÉINJECTÉES]`) si elles sont marquées `reinjected: true`. Cette réinjection ne s'applique qu'à DÉVELOPPER et SYNTHÉTISER, pas à RELIER.

---

## Synthèse Hiérarchique (>15 vignettes)

Quand le nombre de vignettes dépasse 15, la synthèse passe en mode **hiérarchique** automatiquement :

1. **Découpage** : Les vignettes sont découpées en groupes de 6
2. **Mini-synthèses** : Chaque groupe fait l'objet d'une mini-synthèse séparée (template `mini`)
3. **Méta-synthèse** : Les mini-synthèses sont assemblées en un document cohérent (template `meta`)

| Vignettes | Mode | Appels LLM |
|-----------|------|------------|
| ≤ 15 | Simple | 1 |
| 16-30 | Hiérarchique | 3-5 mini + 1 méta |
| 31+ | Hiérarchique | 6+ mini + 1 méta |

> **Fichier source :** `src/renderer/js/assisted/syntheses/creation.ts` (lignes 98-163)

---

## Paramètres Adaptatifs RELIER

Le nombre de connexions demandées (`{connectionTarget}`) est dynamique :

| Condition | Valeur |
|-----------|--------|
| > 5 nœuds isolés | `5-8` |
| 3-5 nœuds isolés | `3-5` |
| > 15 vignettes totales | `2-4` |
| Défaut | `1-3` |

> **Fichier source :** `src/renderer/js/assisted/llm.ts` (méthode `getAdaptiveConnectionCount`, lignes 778-788)

---

## Prompts Webview (fallback)

Les opérations lancées depuis la webview utilisent des **prompts inline simplifiés** (hardcodés dans `sender.ts`), pas le système de templates de `prompt-templates.ts`. Les différences principales :

| Aspect | API (templates) | Webview (sender.ts) |
|--------|-----------------|---------------------|
| Système | Template interpolé | Hardcodé inline |
| DÉVELOPPER `{targetCount}` | Dynamique (3-5 / 2-3 / 1-2) | Fixe : "2-3" |
| RELIER section PRIORITÉ | Présente | Omise (version courte) |
| SYNTHÉTISER | Identique | Identique |
| Cadrage structurel | Injecté | Non injecté |
| Friction | Injectée si détectée | Injectée si détectée |

> **Fichier source :** `src/renderer/js/assisted/webview/sender.ts` (lignes 245-388)
