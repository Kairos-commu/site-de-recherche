# Sources académiques — Variable Intention

## Fondements théoriques

### Speech Act Theory (Théorie des actes de langage)
- **Austin, J.L. (1962)**. *How to Do Things with Words*. Oxford University Press.
  - Base théorique des actes illocutoires
  - Distinction performatif/constatif

- **Searle, J.R. (1976)**. *A Classification of Illocutionary Acts*. Language in Society, 5(1), 1-23.
  - Taxonomie des actes de langage
  - **Directifs** : actes visant à faire faire quelque chose à l'auditeur
  - Utilisé pour : catégorisation des verbes directifs forts

### Processus cognitifs et linguistique

- **Pennebaker, J.W., Boyd, R.L., Jordan, K., & Blackburn, K. (2015)**. *The Development and Psychometric Properties of LIWC2015*. University of Texas at Austin.
  - Dictionnaire psycholinguistique validé
  - **Catégorie "Insight"** : comprendre, réaliser, découvrir
  - **Catégorie "Cognitive Processes"** : verbes de traitement mental
  - Utilisé pour : verbes d'insight et exploration

### Marqueurs d'hésitation

- **Tree, J.E.F., & Schrock, J.C. (2002)**. *Basic meanings of um and uh*. Journal of Memory and Language, 47(2), 320-326.
  - Marqueurs d'hésitation et incertitude linguistique
  - Utilisé pour : détection d'intention floue

## Application aux calculs

### Verbes déclaratifs
Source : Searle (1976) — Actes directifs  
Exemples : "je veux", "je dois", "il faut que"

### Verbes insight
Source : LIWC 2015 — Catégorie Insight  
Exemples : "comprendre", "réaliser", "saisir"

### Verbes exploration
Source : LIWC 2015 — Catégorie Cognitive Processes  
Exemples : "explorer", "analyser", "examiner"

### Marqueurs hésitation
Source : Tree & Schrock (2002)  
Exemples : "peut-être", "je ne sais pas", "éventuellement"

## Validation empirique

Les seuils de conversion (haute/moyenne/basse intention) sont basés sur :
- Phase 1 : Système à seuils fixes (état actuel)
- Phase 2 : Ajustement empirique après collecte 100-500 sessions
- Phase 3 : Machine learning sur données annotées

## Notes méthodologiques

**Choix de conception** :
- Mesure au **premier message uniquement** (intention initiale)
- Longueur comme proxy d'élaboration cognitive
- Combinaison de 3 critères pour robustesse

**Limites connues** :
- Dépendant du français (adaptable multilingue via traduction des patterns)
- Seuils arbitraires en Phase 1 (seront calibrés empiriquement)
- Ne capture pas l'intention implicite complexe

## Références complètes

Austin, J.L. (1962). *How to Do Things with Words*. Oxford University Press.

Pennebaker, J.W., Boyd, R.L., Jordan, K., & Blackburn, K. (2015). *The Development and Psychometric Properties of LIWC2015*. University of Texas at Austin.

Searle, J.R. (1976). A Classification of Illocutionary Acts. *Language in Society*, 5(1), 1-23.

Tree, J.E.F., & Schrock, J.C. (2002). Basic meanings of um and uh. *Journal of Memory and Language*, 47(2), 320-326.
