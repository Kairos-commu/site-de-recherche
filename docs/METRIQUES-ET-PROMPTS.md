# KAIROS --- Metriques & Prompts : Vue d'ensemble

Document unique pour comprendre **comment le systeme decide quoi faire** et **ce qu'il envoie au LLM**.

---

## Le flux complet (de l'action utilisateur au prompt LLM)

```
 Action utilisateur (cree, connecte, supprime, selectionne)
         |
         v
 +-----------------------+
 | MetricsManager        |  Recalcule les compteurs (debounce 100ms)
 | calculateMetrics()    |  11 metriques : vignettes, connexions, isolees, densite...
 +-----------------------+
         |
         v
 +-----------------------+
 | CanvasAnalyzer        |  Analyse le canvas en profondeur
 | diversityTrend()      |  --> converging / exploring / stable / insufficient_data
 | detectCircularity()   |  --> score 0-N (6 signaux ponderes)
 +-----------------------+
         |
         v
 +-----------------------+
 | OxygenManager         |  Jauge de vitalite cognitive (5 signaux)
 | evaluate() / record() |  --> score 0-100, frictionLevel, shouldInjectFriction
 +-----------------------+
         |
         v
 +-----------------------+
 | decideOperation()     |  Croise metriques + oxygen + diversite + circularite
 |                       |  --> { operation, subMode, raison, priorite }
 |                       |  Oxygen < 50 → force diverger (priorite 2)
 +-----------------------+
         |
         v
 +-----------------------+
 | Bandeau UI            |  Affiche la suggestion a l'utilisateur
 | "DEVELOPPER suggere"  |  L'utilisateur peut accepter ou choisir manuellement
 +-----------------------+
         |
         v  (utilisateur lance l'operation)
 +-----------------------+
 | buildAdaptivePrompt() |  Assemble le prompt en 5 couches
 |                       |  --> texte envoye au LLM
 +-----------------------+
         |
         v
 +-----------------------+
 | LLM (API ou webview)  |  Genere la reponse
 +-----------------------+
         |
         v
 +-----------------------+
 | Parsers               |  Extrait [NOUVELLE VIGNETTE], [CONNEXION], [FRICTION]
 | capture-parsers.ts    |  --> noeuds et connexions ajoutes au canvas
 +-----------------------+
```

---

## 1. Les Metriques (ce que le systeme mesure)

### 11 compteurs de base

```
 totalVignettes ─────────────┐
 vignettesActives ────────── │ (= totalVignettes, toutes actives)
 vignettePrioritaires ────── │ status === 'priority'
 vignetteNeutres ─────────── │ status === 'neutral'
 vignetteConnectees ──────── │ au moins 1 connexion (CLE DE DECISION)
 vignetteIsolees ─────────── │ 0 connexion
 connexionsTotal ─────────── │
 connexionsImplique ──────── │ type → (implies)
 connexionsResonance ─────── │ type ↔ (resonance)
 densiteConnexions ────────── connexionsTotal / vignettesActives
 ratioPriorite ────────────── prioritaires / total
```

### 3 indicateurs avances

```
 diversityTrend ────── converging | exploring | stable | insufficient_data
                       (base sur l'indice de Shannon des tags, historique 3+ points)

 circularityScore ──── 0 a N (somme ponderee de 6 signaux)
                       > 3 = friction moderee, > 4.5 = friction forte

 oxygenScore ────────── 0 a 100 (jauge de vitalite cognitive)
                        > 50 = respire, 30-50 = stagne, < 30 = asphyxie
                        Calcule au chargement (evaluate) + a chaque tour (recordTurn)
                        Score < 50 → force subMode 'diverger' dans MetricsManager
```

---

## 2. L'Arbre de Decision (comment l'operation est choisie)

### Mode global (aucune selection)

```
                  Canvas < 3 vignettes ?
                 /                       \
               OUI                       NON
                |                         |
          DEVELOPPER               Oxygen score < 50 ?
          (haute)                  (et >= 5 vignettes)
                                  /                   \
                                OUI                   NON
                                 |                     |
                           DEVELOPPER            Donnees diversite ?
                           diverger             /                   \
                           (O2 < 30 =       < 3 points           3+ points
                            urgente,            |                     |
                            sinon haute)  Fallback legacy         Quel trend ?
                                         (voir ci-dessous)      /     |      \
                                                        converging  exploring  stable
                                                            |       /stable\      |
                                                         Quel       |       |   circ <= 1 ?
                                                       score circ?  |       |   /       \
                                                      /    |    \   |       | OUI      NON
                                                   >seuil >1  <=1  |       |  |         |
                                                     |     |    |   |       | null    DEVELOPPER
                                              DEVELOPER DEVEL DEVEL |       | "explore  approfondir
                                              diverger  diver diver |       |  naturel"
                                              urgente   haute moyen |       |
                                                                    |       |
                                                              >30% isolees? densite>0.8
                                                              (et >=5)      (et >=12) ?
                                                              /     \       /       \
                                                           OUI     NON   OUI       NON
                                                            |       |     |         |
                                                         RELIER     | SYNTHETISER   |
                                                         moyenne    |   haute       |
                                                                    |               |
                                                              >=15 connectees ?     |
                                                              /            \        |
                                                           OUI            NON       |
                                                            |               \       |
                                                      SYNTHETISER      DEVELOPPER   |
                                                       moyenne         approfondir  |
                                                                       (defaut)     |
```

### Fallback legacy (quand diversite < 3 points)

```
 >= 25 connectees  -->  SYNTHETISER urgente
 >= 15 connectees  -->  SYNTHETISER haute
 > 30% isolees     -->  RELIER moyenne
 densite < 0.5     -->  DEVELOPPER moyenne
 >= 8 connectees   -->  SYNTHETISER basse
 cooldown actif    -->  DEVELOPPER normale
 defaut            -->  DEVELOPPER normale
```

### Mode selection (vignettes selectionnees)

```
 1-5 selectionnees  -->  DEVELOPPER (toujours)
 6-9 selectionnees  -->  connectivite interne < 30% ?
                         OUI --> RELIER
                         NON --> DEVELOPPER
 10+ selectionnees  -->  SYNTHETISER (toujours)
```

> La connectivite interne = connexions entre noeuds selectionnes / connexions max possibles.

---

## 3. Les 5 Signaux Oxygen (remplace les 6 signaux de circularite)

```
 Signal              Delta     Declencheur
 ──────────────────── ───────── ─────────────────────────────────────────
 newTags              +10/tag   Tags non vus dans les 3 derniers tours (cap +20/tour)
 canvasRedundancy     -20       Jaccard all-pairs > 0.35 entre 2 vignettes
 stagnation           -15/tour  Tours consecutifs sans nouveau tag
 frictionBonus        +20       Utilisateur a accepte une [FRICTION] (cap +20/tour)
 graphStructure       -25/-10   ratio conn/nodes < 1.0 ou > 3.0 (>= 8 nodes)
                      +5        ratio 1.0-2.0 (sain), -10 par composante deconnectee

 Score = 50 (defaut) + somme des deltas, clampe [0, 100]
 - Score > 50 : respire (vert) → pas de friction
 - Score 30-50 : stagne (orange) → friction moderee + diverger force
 - Score < 30 : asphyxie (rouge) → friction radicale + diverger urgente
 - Score recalcule au chargement (evaluate) et a chaque tour LLM (recordTurn)
 - Score NON persiste — toujours 50 au demarrage, puis ajuste par evaluate()
```

---

## 4. L'Assemblage du Prompt (les 5 couches)

Quand l'utilisateur lance une operation, le prompt est construit en 5 couches empilees :

```
 ┌─────────────────────────────────────────────────┐
 │  COUCHE 1 — Prompt systeme                      │
 │  "Tu recois un graphe de pensee non-lineaire.   │
 │   Statuts : ○ neutre, 🎯 prioritaire..."         │
 │  (commun a toutes les operations)               │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 0 — Cadrage structurel                  │
 │  Anti-arborescence : oblige le LLM a produire   │
 │  des boucles/remontees, pas juste des branches  │
 │  (specifique par operation)                     │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 2 — Contexte du graphe                  │
 │  [SYNTHESES REINJECTEES]  (si DEVELOPPER/SYNTH) │
 │  Graphe actuel :                                │
 │  1. [Texte] ○ | #tag1 #tag2                    │
 │  CONNEXIONS :                                   │
 │  - "A" → "B" [mecanisme]                       │
 │  (vignettes triees topologiquement)             │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 3 — Instruction d'operation             │
 │  Depend de : operation × subMode × regime       │
 │                                                 │
 │  DEVELOPPER approfondir × full  (Regime A)      │
 │  DEVELOPPER approfondir × branch (Regime B)     │
 │  DEVELOPPER diverger × full    (convergence)    │
 │  DEVELOPPER diverger × branch  (convergence)    │
 │  RELIER × full / branch                        │
 │  SYNTHETISER × full / branch                   │
 │                                                 │
 │  = 8 templates possibles                        │
 └────────────────────────┬────────────────────────┘
                          │
 ┌────────────────────────v────────────────────────┐
 │  COUCHE 4 — Friction (optionnelle)              │
 │  Injectee si oxygen score < 50 (stale/asphyxie)│
 │                                                 │
 │  Moderee (30-50) : "Ce graphe montre des signes │
 │            de circularite. Au moins 1 [FRICTION]"│
 │                                                 │
 │  Forte (<30) : "Les dernieres generations ont   │
 │           produit des vignettes proches de :     │
 │           {keywords}. Le graphe stagne."        │
 └─────────────────────────────────────────────────┘
```

---

## 5. Les 8 Templates de Prompt

### DEVELOPPER (4 variantes)

| subMode | Regime | Quand | Specifite |
|---------|--------|-------|-----------|
| **approfondir** | A (full) | Defaut, aucune selection | Explore le graphe entier en profondeur |
| **approfondir** | B (branch) | Selection 1-5 vignettes | Prolonge la branche selectionnee |
| **diverger** | A (full) | Canvas convergent | Interdit les mots-cles surrepresentes, force les territoires adjacents |
| **diverger** | B (branch) | Selection + convergence | Ouvre depuis la branche vers un champ adjacent |

**Sortie attendue :** `[NOUVELLE VIGNETTE]` + `[CONNEXION]` (+ `[FRICTION]` optionnel)

**Parametre dynamique :**

| `{targetCount}` | Condition |
|-----------------|-----------|
| 3-5 | Canvas < 10 vignettes |
| 2-3 | Canvas 10-24 |
| 1-2 | Canvas >= 25 |

### RELIER (2 variantes)

| Regime | Quand | Specifite |
|--------|-------|-----------|
| A (full) | > 30% isolees | Connecte les orphelins du graphe entier |
| B (branch) | 6-9 selectionnees, connectivite < 30% | Connecte au sein de la selection + voisinage |

**Sortie attendue :** `[CONNEXION]` uniquement

**Parametre dynamique :**

| `{connectionTarget}` | Condition |
|----------------------|-----------|
| 5-8 | > 5 noeuds isoles |
| 3-5 | 3-5 noeuds isoles |
| 2-4 | > 15 vignettes totales |
| 1-3 | Defaut |

### SYNTHETISER (2 variantes)

| Regime | Quand | Specifite |
|--------|-------|-----------|
| A (full) | >= 15 connectees ou densite > 0.8 | Lecture du graphe entier |
| B (branch) | 10+ selectionnees | Lecture de la branche |

**Sortie attendue :** Prose libre, format 4 blocs :

```
 LECTURE       Observations factuelles, nomme les noeuds/tags
 TENSIONS      Frictions non resolues, contradictions, dependances fragiles
 ANGLES MORTS  Presupposes non questionnes, absences, zones sous-explorees
 QUESTION      Une question structurelle que le graphe pose sans formuler
```

**Synthese hierarchique (>15 vignettes) :** Decoupe en groupes de 6, mini-syntheses par groupe, puis meta-synthese assemblant le tout.

---

## 6. Mecanismes de Stabilite

### Cooldown synthese

```
 Synthese executee --> cooldown 60s --> SYNTHETISER plus suggere
                                       bandeau affiche "Synthese disponible dans Xs"
```

### Choix manuel

```
 Utilisateur choisit une operation manuellement
         |
         v
 dernierChoixManuel memorise + metriques a ce moment
         |
         v
 Prochain recalcul : variation des metriques > 10% ?
    /              \
  NON              OUI
   |                |
 Conserve le      Recalcule
 choix manuel     normalement
```

### Debounce

```
 Mutation rapide (ex: Ctrl+A selectionne 100 noeuds)
         |
         v
 recalculateDebounced() : attend 100ms sans nouvelle mutation
         |
         v
 calculateMetrics() + updateMetricsDisplay() + updateSuggestionBanner()
```

---

## 7. Ce que l'Utilisateur Voit

### Bandeau de suggestion

```
 ┌──────────────────────────────────────────────────────────────────┐
 │ 🌱 DEVELOPPER (diverger) suggere : Le canvas se referme —       │
 │    explorer un territoire adjacent.                             │
 └──────────────────────────────────────────────────────────────────┘

 Emojis :  🌱 DEVELOPPER   🔗 RELIER   📦 SYNTHETISER   ✦ (pas de suggestion)
 Couleurs : urgente (sombre rouge), haute (sombre orange),
            moyenne (sombre bleu), normale (neutre)
```

### Compteurs metriques

```
 12 vignettes, 8 connexions (3 prioritaires) . 2 isolees
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
 │ Div │  Indice de diversite
 │ Att │  Nb attracteurs
 │ Op  │  Derniere operation
 └─────┘
  Ctrl+Shift+D pour masquer/afficher
```

---

## 8. Resume : Quand Chaque Operation se Declenche

```
 Canvas quasi vide (< 3)           --> DEVELOPPER approfondir
 Oxygen stale (score < 50)         --> DEVELOPPER diverger (haute / urgente si < 30)
 Canvas convergent (diversite ↓)   --> DEVELOPPER diverger
 Beaucoup d'orphelins (> 30%)      --> RELIER
 Canvas dense (densite > 0.8)      --> SYNTHETISER
 Canvas mature (>= 15 connectees)  --> SYNTHETISER
 Exploration naturelle             --> Pas de suggestion (null)
 Defaut                            --> DEVELOPPER approfondir
```

---

## Fichiers sources

| Fichier | Role |
|---------|------|
| `src/renderer/js/assisted/metrics.ts` | MetricsManager : calcul, decision, affichage |
| `src/renderer/js/assisted/analyzer/diversity.ts` | Trend de diversite (Shannon) |
| `src/renderer/js/assisted/analyzer/friction.ts` | 6 signaux de circularite, injection friction |
| `src/renderer/js/assisted/analyzer/config.ts` | Seuils et poids |
| `src/renderer/js/assisted/app/adaptive.ts` | Orchestration operation, pont Oxygen |
| `src/renderer/js/assisted/llm.ts` | Construction contexte, tri topologique, echantillonnage |
| `src/renderer/data/prompt-templates.ts` | 8 templates + cadrage structurel + friction |
| `src/renderer/js/assisted/webview/sender.ts` | Prompts webview (fallback) |
| `src/renderer/js/assisted/syntheses/creation.ts` | Synthese simple et hierarchique |
| `src/renderer/js/oxygen/oxygen.ts` | Jauge de vitalite cognitive |
