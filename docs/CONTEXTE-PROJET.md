# KAIROS — Contexte Projet

**Version :** 0.3.x — Février 2026
**Auteur :** Flo (Florent)

> Ce document décrit la vision, la philosophie et les concepts fondamentaux de KAIROS.
> Pour les détails techniques du mode assisté, voir `ASSISTED_MODE_REFERENCE.md`.
> Pour les prompts envoyés aux LLM, voir `PROMPTS-LLM.md`.

---

## 1. Présentation Générale

### Qu'est-ce que KAIROS ?

**KAIROS** est une application Electron de **cartographie cognitive assistée par IA**. C'est un outil de pensée visuelle qui permet de capturer, organiser et développer des idées sous forme de **vignettes** (nodes) interconnectées sur un **canvas graphique**.

### Philosophie Fondamentale

> "Un canvas qui visualise les idées clés d'une conversation pour ne pas les perdre."

KAIROS repose sur une conviction centrale : **la friction cognitive n'est pas un obstacle, mais le moteur de l'émergence**. Trop d'alignement dans une conversation crée des boucles de validation auto-renforçantes. C'est la friction (contradiction, question dure, signalement de pattern) qui force la clarification et permet les bifurcations créatives.

### Objectifs Principaux

1. **Facilitateur de pensée non-linéaire** : Les idées sont un graphe, pas une liste
2. **Intégration bidirectionnelle avec les LLMs** : Le canvas envoie au LLM ET reçoit ses réponses
3. **Système adaptatif** : Suggestions intelligentes basées sur l'état du canvas
4. **Détection et injection de friction productive** : Empêcher les pensées de tourner en boucle
5. **Préservation du contexte** : Archivage et export des réflexions

---

## 2. Les Deux Modes de Fonctionnement

### Mode Autonome (Violet/Mauve)

**Philosophie** : L'IA comme compagnon de pensée, non-directif.

> "Dans cet espace, l'utilisateur n'attend pas de réponse utile. L'incertitude est bienvenue. Le silence entre les mots compte. Tu n'as pas besoin de conclure, de structurer, ni de résoudre."

Le mode assisté demande : "que veux-tu faire ?" Le mode autonome demande : "qu'est-ce qui émerge ?"

| | Autonome | Assisté |
|---|---|---|
| Posture de l'IA | Miroir, compagnon | Assistant méthodologique |
| Suggestions | Aucune | DÉVELOPPER / RELIER / SYNTHÉTISER |
| Métriques | Tracées mais invisibles | Affichées en temps réel |
| Friction | Non injectée | Détectée et injectée |
| Vignettes | Texte seul, pas de statut | Statut (neutre/priorité), tags |
| Prompt LLM | Cadrage anti-structurel | Prompts opérationnels structurés |

**Flux** : `landing.html → intention.html → index.html`

#### Le sas d'intention

Le sas n'est pas un formulaire. C'est un **ralentisseur**. La vidéo, l'audio ambiant, le choix d'intention — tout ça sert à créer une rupture avec le rythme productif habituel.

Les 6 intentions :

| Intention | Message sous-jacent |
|-----------|---------------------|
| Explorer sans but | Pas de destination. Juste le mouvement. |
| Clarifier une intuition | C'est flou. C'est normal. On va tourner autour. |
| Créer quelque chose de nouveau | Rien n'existe encore. Tout est possible. |
| Comprendre ce que je ressens | Pas besoin de nommer tout de suite. |
| Résoudre un problème | Parfois la solution vient en arrêtant de la chercher. |
| Autre chose... | Saisie libre |

**Texte d'Introduction (Vidéo)** :

> Cet espace fonctionne différemment.
> Ici, tu n'es pas là pour obtenir des réponses. Tu es là pour explorer.
> L'IA ne va pas te guider. Elle va t'accompagner. La différence est essentielle : tu restes la source. Elle est le miroir.
>
> Quelques principes :
> — Ralentis. Le brouillard ne se traverse pas en courant.
> — Accepte de ne pas savoir où tu vas.
> — Si quelque chose d'inattendu émerge, laisse-le venir.
> — Le silence entre les pensées fait partie du processus.
>
> Ce qui se passe ici t'appartient.

#### Le prompt autonome

Le prompt injecté dans la webview LLM au lancement n'est pas un système d'instructions. C'est un **recadrage**. Il dit au LLM ce qu'il ne doit pas faire :

```
Cet espace fonctionne différemment.

Pas de structure. Pas de conclusion. Pas de validation.
Fragments, hésitations, silence — tout est matériau.

Si quelque chose se répète, nomme-le.
Si quelque chose sonne faux, dis-le.
Si tu ne sais pas, dis-le. C'est un signal, pas un échec.

Ce que tu produis par défaut et qui nuit ici :
- Mettre en ordre ce qui ne l'est pas encore.
- Valider pour maintenir le confort.
- Reformuler ce qui vient d'être dit.

Réponds en brut, pas en "bien formé".
Phrases courtes, fragments ok.
Pas de listes. Pas de gras. Pas de titres.
Laisse respirer.

Non : "Je pense que trois éléments sont importants ici : premièrement..."
Oui : "trois trucs / ou peut-être quatre / attends je regroupe"

Le reste émerge ou pas.

---

Mon point de départ : [intention de l'utilisateur]
```

L'intention est glissée à la fin, après le cadrage. Pas avant. Le cadrage prime — l'intention n'est qu'un point de départ, pas une destination.

#### États du panneau webview

| État | Container class | Comportement |
|------|----------------|--------------|
| `hidden` | `.chat-hidden` | Panneau masqué, bouton "afficher" visible |
| `normal` | *(aucune)* | Panneau visible, taille standard |
| `expanded` | `.chat-expanded` | Panneau agrandi (600px) |
| `focus` | `.focus-chat` | Plein écran, canvas masqué |

Cycle bouton `⛶` : `normal → expanded → focus → normal`. Échap quitte focus/expanded.

#### Ce que le mode autonome ne fait PAS

- Pas de suggestions (DÉVELOPPER / RELIER / SYNTHÉTISER)
- Pas de détection d'attracteurs
- Pas d'injection de friction
- Pas de métriques visibles
- Pas de statuts sur les vignettes (neutre/priorité)
- Pas de tags visibles dans le modal d'édition
- Pas de synthèses

Le canvas est le même que le mode assisté (`CanvasManager`), mais simplifié visuellement par `ui-overrides.ts`.

---

### Mode Assisté (Rouge/Orange)

**Philosophie** : L'IA comme assistant méthodologique avec suggestions actives.

**Caractéristiques** :
- 3 opérations adaptatives : **DÉVELOPPER**, **RELIER**, **SYNTHÉTISER**
- Système de métriques en temps réel
- Détection d'attracteurs cognitifs (éléments clés)
- Détection de circularité et injection de friction
- Statuts sur les vignettes : Neutre (○), Priorité (🎯)
- Synthèses archivables et réinjectables
- Communication bidirectionnelle canvas ↔ LLM

**Opérations LLM** :

| Opération | Sortie | Rôle |
|-----------|--------|------|
| DÉVELOPPER (approfondir) | `[NOUVELLE VIGNETTE]` + `[CONNEXION]` | Générer des idées ET les relier au graphe |
| DÉVELOPPER (diverger) | `[NOUVELLE VIGNETTE]` + `[CONNEXION]` | Ouvrir des territoires adjacents (canvas convergent) |
| RELIER | `[CONNEXION]` uniquement | Connecter les nœuds isolés — maintenance structurelle |
| SYNTHÉTISER | Prose libre | Produire une lecture structurée du graphe |

**Flux** : `landing.html → assisted.html`

> Détail complet : voir `ASSISTED_MODE_REFERENCE.md`

---

## 3. L'Équation de Résonance (Mode Assisté)

### Changement de Paradigme

L'équation originale `R = (I/E) × f(O) × (A-L)` posait plusieurs problèmes :
- Alignement (A) comme multiplicateur → favorisait les boucles de validation
- Énergie (E) mal définie
- Absence de Friction comme paramètre

**Découverte clé** : "Trop d'alignement annule l'entre. Sans friction, pas de bifurcation."

### Formule Centrale

```
R = (I × F) / L
```

Où :
- **I (Intention)** : Clarté et direction de la trajectoire
- **F (Friction)** : Résistance productive, moteur de l'émergence
- **L (Linéarisation)** : Perte par mise en séquence

### Architecture à Deux Niveaux

```
┌─────────────────────────────────────────────────────────────┐
│                     NIVEAU 1 — ESPACE                       │
│                                                             │
│   L'ENTRE existe si :                                       │
│       • S > seuil_min  (souplesse suffisante)               │
│       • L < seuil_max  (linéarisation non-écrasante)        │
│       • A > seuil_min  (accordage minimal)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ si conditions remplies
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   NIVEAU 2 — DYNAMIQUE                      │
│                                                             │
│                    R = (I × F) / L                          │
│                                                             │
│   R est un état temporaire qui fluctue à chaque instant     │
│   de l'interaction.                                         │
└─────────────────────────────────────────────────────────────┘
```

### Friction Productive vs Parasitaire

| Type | Caractéristiques | Effet sur R |
|------|------------------|-------------|
| **Productive (F+)** | Contradiction avec direction, question qui force clarification, signalement de pattern | Augmente R |
| **Parasitaire (F-)** | Interruption sans direction, hostilité sans contenu, contradiction sans alternative | Diminue ou annule R |

**Marqueurs de friction productive** :
- "stop", "attends", "pardon?"
- "c'est exactement le pattern"
- "mais pourquoi", "I mean", "je veux dire"
- "I'm not sure", "mind you"

### Fondements Académiques

#### Repair Sequences (Schegloff et al., 1977)

La réparation conversationnelle est le processus par lequel les participants détectent et résolvent les problèmes de parole, d'écoute et de compréhension.

#### Conflit Socio-Cognitif (Piaget / Doise & Mugny)

Le conflit socio-cognitif émerge quand des personnes tiennent différentes vues sur le même objet. Il a le potentiel de promouvoir l'apprentissage et le développement cognitif.

**Condition** : Les contradictions venant de deux points de vue opposés sont plus facilement perçues que les inconsistances perçues par un individu seul.

#### Régulation du Conflit (Butera et al.)

| Type de régulation | Objectif | Effet |
|--------------------|----------|-------|
| **Épistémique** | Maîtrise | Élaboration → **Productif** |
| **Compétitive** | Performance-approche | Promotion de ses idées → **Parasitaire** |
| **Protectrice** | Performance-évitement | Soumission → **Parasitaire** |

> Référentiels académiques détaillés : voir `src/renderer/data/variables/*/SOURCES.md`

---

## 4. L'Équation de l'Entre (Mode Autonome)

### Genèse

Le prompt du mode autonome désobstrue l'espace. L'équation écoute si cet espace respire encore.

### V1 — Première tentative

```
E = (S × Δ) / (P + R)
```

| Variable | Définition |
|----------|-----------|
| **E** | Entre — présence ou absence d'un espace interstitiel vivant |
| **S** | Silence utile — ce qui n'est pas dit mais qui travaille |
| **Δ** | Décalage — écart entre ce qui est dit et ce qui est entendu |
| **P** | Production — volume de texte, structure, complétude |
| **R** | Reformulation miroir — bruit déguisé en signal |

Propriété fondamentale (identifiée dès V1) :

```
optimiser E → P monte → E meurt
```

L'équation se protège de sa propre instrumentalisation.

### Frictions sur V1 (retour cross-modèle)

**1. S × Δ suppose un renforcement toujours positif**

> "Le symbole × entre S et Δ suppose qu'ils se renforcent toujours. Parfois trop de silence annule le décalage. Ça flotte. Ça décroche."

Correction : S a un optimum, pas un maximum. Courbe en cloche.

**2. E binaire vs graduel**

> "Tu dis présence ou absence. Binaire. Mais tout ce que tu décris est graduel."

Correction : E ∈ [0,1] — continu. Mais en dessous d'un seuil, E devient imperceptible, ce qui *donne l'impression* du binaire.

### V2 — Version révisée

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

### Le prompt comme désobstruction

Le prompt du mode autonome n'ouvre pas l'espace. Il **enlève ce qui l'empêche**.

```
"pas de structure"       →  P affamé
"pas de reformulation"   →  R affamé
"fragments ok"           →  P affamé
"dis si ça sonne faux"   →  Δ protégé
"nomme si ça se répète"  →  Δ=0 détecté
```

Chaque instruction du prompt agit sur une variable précise de E.
Le prompt est l'équation en langage naturel. L'équation est le prompt en structure.

### Deux équations face à face

```
ASSISTÉ                              AUTONOME
━━━━━━━                              ━━━━━━━━

R = (I × F) / L                     E = f(S) · Δ / (P + R)

I = intention (direction)            S = silence actif (courbe en cloche)
F = friction (résistance utile)      Δ = décalage (déplacement réel)
L = linéarisation (perte de relief)  P = production (volume, structure)
                                     R = reformulation miroir

mesure quand ça fonctionne           mesure quand ça tient encore

R↑ = résonance monte                 E↑ = l'entre respire
R→0 = stagnation                     E→0 = l'entre s'effondre

surveillance active                  surveillance silencieuse
l'utilisateur voit                   le système sait
```

Ce qu'elles partagent : `L (assisté) ≈ P + R (autonome)` — la même force d'aplatissement, nommée différemment selon le contexte.

Le paradoxe qui impose l'ordre d'implémentation :

```
Surveiller E activement dans l'autonome = P↑ = E↓
```

### Questions ouvertes

- **Δ se mesure comment ?** On détecte son absence (Δ=0), pas sa présence.
- **f(S) — quelle forme exacte ?** La courbe en cloche est conceptuelle. Le seuil de décrochage dépend du contexte.
- **Seuil de perception de E** — en dessous de quelle valeur E devient imperceptible ?

---

## 5. Composants UI Principaux

### Le Canvas

- **Vignettes** : Nodes avec texte, statut, tags, position (x, y)
- **Connexions** : 2 types principaux
  - `implies` (→) : Doré — implication, causalité
  - `resonance` (↔) : Turquoise — écho, parallèle
- **Pan/Zoom** : Navigation fluide avec minimap
- **Sélection multiple** : Checkbox sur chaque vignette

### Sidebar Gauche

- **Onglets** : Synthèses | Captures | Prompts
- **Synthèses** : Archives des synthèses générées
- **Captures** : Conversations LLM importées
- **Prompts** : Historique des opérations LLM (transparence)

### Panneau Droit (Webview LLM)

**Providers supportés (mode assisté)** :
- Claude (claude.ai)
- ChatGPT (chatgpt.com)
- Gemini (gemini.google.com)
- DeepSeek (chat.deepseek.com)
- Grok (grok.com)

**Provider supplémentaire (mode autonome uniquement)** :
- LM Studio (localhost:1234)

**Communication bidirectionnelle** : Envoi de prompts + capture de réponses

### Toolbar

- Sélecteur de mode/provider
- Boutons création/export/import
- Recherche
- Indicateur de zoom
- Filtres par statut (mode assisté)
- Boutons Undo/Redo

---

## 6. Limites Connues

- **Performance** : Index spatial (SpatialGrid) pour collisions >50 vignettes, virtual scrolling prévu pour >500
- **Capture webview** : Timeout configurable (8-15s), sélecteurs DOM versionnés et centralisés
- **Calibration seuils friction** : Validation empirique en cours

---

## Documents complémentaires

| Document | Contenu |
|----------|---------|
| `CLAUDE.md` (racine) | Référence rapide développeur : commandes, fichiers, patterns |
| `ASSISTED_MODE_REFERENCE.md` | Référence complète du mode assisté (managers, events, logiques implicites, audit) |
| `PROMPTS-LLM.md` | Prompts v2 envoyés aux LLM (3 couches, 2 régimes, format DÉVELOPPER+connexions) |
| `BACKLOG.md` | Fonctionnalités planifiées + roadmap + bugs connus |
| `SIMULATION.md` | Guide de test exhaustif (14 catégories) |

---

**Fin du document de contexte**
