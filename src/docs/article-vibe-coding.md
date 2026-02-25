# Le Vibe Coding sous le Microscope : Ce que 1 000 interactions révèlent sur les mécaniques invisibles du développement assisté par IA

**Publication : mecanique-invisible.com**
**Auteur : Florent — Recherche indépendante en interaction humain-IA**
**Statut : Structure + noyaux rédactionnels**

---

## Accroche (2-3 paragraphes)

Le vibe coding — coder en langage naturel, laisser l'IA générer, itérer par conversation — est présenté comme une révolution. Mais que se passe-t-il réellement quand on construit une application de 24 000 lignes sur plusieurs mois avec cette méthode ? Pas un prototype de week-end. Un vrai projet, avec des migrations de base de données, 296 tests unitaires, du TypeScript strict, et un déploiement multi-dépôts.

KAIROS est cet objet : un outil de cartographie cognitive développé presque entièrement en vibe coding avec Claude Code. Deux audits automatisés (/insight), espacés d'un mois, fournissent des données quantitatives rares sur ce que cette pratique produit — et ce qu'elle masque.

Cet article n'est pas un retour d'expérience de développeur. C'est une observation de chercheur sur les mécaniques invisibles qui opèrent quand un humain et une IA co-construisent du logiciel.

---

## 1. Les données brutes : deux radiographies à un mois d'intervalle

> Tableau comparatif des deux rapports /insight (jan vs fév)
> Visualisation : barres horizontales comparatives

| Métrique | Rapport 1 (jan) | Rapport 2 (fév) | Évolution |
|---|---|---|---|
| Messages | 538 | 395 | -27% |
| Sessions | 46 | 54 | +17% |
| Commits | 7 | 13 | +86% |
| Heures totales* | 378 | 166 | -56% |
| Messages/session | ~11.7 | ~7.3 | -38% |
| Wrong Approach | 17 | 22 | +29% |
| Buggy Code | 14 | 21 | +50% |
| Misunderstood | 5 | 10 | +100% |

*\* Heures mesurées par /insight entre le premier et le dernier message de chaque session, temps d'inactivité inclus. Ces chiffres surestiment le temps de travail réel mais restent comparables entre eux.*

**Noyau :** Les métriques de productivité s'améliorent (moins de temps, plus de commits). Les métriques de friction augmentent. Ce n'est pas contradictoire — c'est le signal central de l'article.

---

## 2. La friction ne disparaît pas, elle se déplace

**Noyau :** Le vibe coding ne réduit pas la friction humain-IA. Il la déplace de l'aval (correction en boucle) vers l'amont (cadrage de l'intention).

### 2.1 Phase 1 : la spirale exploratoire

- Rapport 1 : sessions marathon (378h pour 46 sessions), peu de commits
- Pattern dominant : Claude explore en spirale, l'humain doit rompre la boucle
- Illustration : l'anecdote CSS (Claude fouille API + SQLite, cause réelle = référence circulaire CSS)

### 2.2 Phase 2 : le malentendu précoce

- Rapport 2 : sessions courtes, plus productives, mais "misunderstood request" double
- Pattern dominant : Claude exécute sur une interprétation présumée avant vérification
- Illustration : emojis 🎯🧲 demandés → Claude conserve ◉ et travaille sur le positionnement

### 2.3 L'hypothèse de conservation de la friction

> Observation (N=2, à confirmer sur un échantillon plus large) : dans une interaction humain-IA de développement, la friction totale semble approximativement constante. L'optimisation des processus ne la réduit pas — elle la redistribue entre les phases du cycle (cadrage → exécution → vérification).

Lien avec la jauge d'oxygène et le concept de convergence circulaire déjà documentés dans les travaux KAIROS.

---

## 3. L'attracteur invisible : quand le système interprète le chercheur comme développeur

> Note : le terme "attracteur" est utilisé ici au sens dynamique (point vers lequel un système converge), pas au sens de la feature KAIROS du même nom (qui a été supprimée au profit d'un diagnostic structurel).

**Noyau :** Les rapports /insight révèlent un biais interprétatif systémique. Le système ne peut pas voir ce qu'il n'a pas de catégorie pour nommer.

- KAIROS décrit comme "graph/canvas application" — jamais comme outil de recherche
- Le faible ratio commits/sessions lu comme "inefficacité" — pas comme exploration délibérée
- Le multi-clauding lu comme "parallel workflows" — pas comme cross-validation méthodologique
- Les suggestions du rapport forment une boucle auto-référentielle : configurer Claude pour mieux utiliser Claude pour corriger les erreurs de Claude

**Lien conceptuel :** C'est exactement l'aplatissement de complexité et l'attracteur convergent documentés dans "La Pensée en Faisceau". Le système ramène tout vers son cadre interprétatif par défaut.

---

## 4. Le paradoxe de l'auto-évaluation : un modèle qui juge ses propres interactions

**Noyau :** /insight est un modèle qui évalue les interactions d'un humain avec un modèle. Circularité épistémique.

- "Inferred satisfaction" — estimée par le modèle, pas mesurée
- L'anecdote finale identique dans les deux rapports : cache, bug de déduplication, ou sélection biaisée ?
- Les recommandations du système renforcent la dépendance au système (hooks, skills, agents = plus de Claude pour gérer Claude)
- Le rapport ne peut pas documenter ses propres angles morts

**La mise en abyme à trois niveaux :** Ce texte même en est l'illustration. /insight (un modèle) évalue les interactions d'un humain avec un modèle. Et l'article qui analyse ce rapport est co-écrit avec un modèle. La circularité n'est pas un défaut méthodologique à corriger — c'est la condition d'observation de ce type d'interaction. La reconnaître explicitement est le minimum épistémique.

**Question ouverte :** Peut-on utiliser un outil pour évaluer objectivement les interactions avec ce même outil ? Quelles seraient les conditions d'une évaluation réellement externe ?

---

## 5. Vers un vibe coding souverain : agents, skills et souveraineté cognitive

**Noyau :** Le vibe coding n'est ni bon ni mauvais. La question est : qui pilote ? L'humain ou l'attracteur ?

### 5.1 Ce qui fonctionne

- Le vibe coding excelle sur les tâches multi-fichiers à spécification claire (35 succès dans le rapport 2)
- L'hygiène automatisée (tests, build, lint) est un multiplicateur réel
- Les sessions courtes mono-objectif réduisent la dérive contextuelle

### 5.2 Les agents comme instruments de souveraineté

Trois agents conçus à partir des patterns de friction identifiés dans les rapports :

- **Agent Cohérence Doc/Code** (`/audit`) — cross-référencement automatique documentation vs code, détection de drift
- **Agent Régression** (`/check`) — garde-fou post-modification : TypeScript, tests, ESLint, détection de régressions CSS
- **Hook TypeScript** — vérification de types automatique après chaque édition de fichier, sans action manuelle

Le troisième (Agent Audit CSS) a été conçu mais volontairement non déployé — l'analyse du rapport a montré qu'il ne répondait pas aux frictions réelles (22 "wrong approach" et 21 "buggy code"), contrairement aux hooks et aux règles de cadrage.

> Ces instruments ne sont pas des optimisations de productivité. Ce sont des formalisations du cadrage que l'humain faisait manuellement. La nuance est importante : un hook qui lance `tsc --noEmit` après chaque édition ne rend pas Claude plus intelligent — il rend ses erreurs visibles immédiatement, ce qui réduit le coût de la friction sans prétendre la supprimer.

### 5.3 La carte, pas le territoire

Le vibe coding est un mode d'interaction. Les agents et skills sont des **cartes d'amorçage** (*priming maps*) — des structures qui orientent le comportement du modèle avant l'interaction, comme un cadrage préalable rend une conversation plus productive sans en changer le contenu. L'enjeu n'est pas d'automatiser plus — c'est de rendre explicites les contraintes implicites qui, sans formalisation, sont ignorées par le système.

---

## Conclusion (2-3 paragraphes)

Retour à la question initiale : que se passe-t-il vraiment quand on construit un projet réel en vibe coding ?

La friction se déplace sans disparaître. Le système interprète l'utilisateur à travers ses propres catégories. Les outils d'évaluation ne peuvent pas voir leurs propres biais. Et pourtant — ça fonctionne. KAIROS existe, 24 000 lignes, 296 tests, déployé.

La clé n'est pas dans l'outil. Elle est dans la conscience des mécaniques invisibles qui opèrent pendant qu'on l'utilise.

---

## Métadonnées article

- **Tags :** vibe-coding, mécanique-invisible, souveraineté-cognitive, Claude Code, interaction humain-IA
- **Liens internes :** La Pensée en Faisceau, jauge d'oxygène, cartes d'amorçage
- **Données source :** rapports /insight jan-2026, fév-2026
- **Longueur cible :** ~2500 mots
- **Illustrations :** tableau comparatif, schéma déplacement de friction, schéma boucle auto-référentielle
