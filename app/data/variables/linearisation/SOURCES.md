# Sources académiques — Variable Linéarisation

## Fondements théoriques

### Discourse Markers & Structure
- **Schiffrin, D. (1987)**. *Discourse Markers*. Cambridge University Press.
  - Taxonomie des marqueurs discursifs
  - Fonctions de structuration du discours
  - Marqueurs de conclusion, séquence, contraste
  - Utilisé pour : identification patterns de conclusion et séquentiels

- **Fraser, B. (1999)**. *What are discourse markers?* Journal of Pragmatics, 31(7), 931-952.
  - Classification fonctionnelle des marqueurs
  - Marqueurs conclusifs vs contrastifs vs temporels
  - Utilisé pour : catégorisation des marqueurs de conclusion

### Cohésion textuelle
- **Halliday, M.A.K., & Hasan, R. (1976)**. *Cohesion in English*. Longman.
  - Théorie de la cohésion textuelle
  - Mécanismes de liaison : référence, substitution, ellipse, conjonction, lexique
  - **Cohésion séquentielle** : "d'abord", "ensuite", "enfin"
  - Utilisé pour : identification des structures de planification discursive

### Text Planning & Rhetorical Structure
- **Mann, W.C., & Thompson, S.A. (1988)**. *Rhetorical Structure Theory: Toward a functional theory of text organization*. Text, 8(3), 243-281.
  - Théorie de la structure rhétorique (RST)
  - Relations nucleus-satellite dans organisation textuelle
  - Utilisé pour : compréhension de la structuration hiérarchique

### Markdown Syntax (Objective Detection)
- **Gruber, J. (2004)**. *Markdown Syntax Documentation*. Daring Fireball.
  - Spécification originale Markdown
  
- **CommonMark Spec (2014)**. *CommonMark: A strongly defined, highly compatible specification of Markdown*.
  - Standardisation Markdown
  - Utilisé pour : détection objective des structures de formatage

### Fragment Analysis
- **Biber, D., Johansson, S., Leech, G., Conrad, S., & Finegan, E. (1999)**. *Longman Grammar of Spoken and Written English*. Longman.
  - Analyse différentielle oral/écrit
  - Fragments vs phrases complètes
  - Utilisé pour : distinction brut/élaboré

## Application aux calculs

### Structures Markdown
Source : CommonMark Spec (2014)  
Détection objective via regex :
- Bullets : `^[\s]*[-*•]\s+`
- Numbered : `^[\s]*\d+\.\s+`
- Headers : `^#{1,4}\s+`

### Patterns conclusion
Source : Schiffrin (1987), Fraser (1999)
- **Fortes** : "en conclusion", "pour conclure", "en résumé"
- **Moyennes** : "donc", "ainsi", "par conséquent"
- **Séquentiels** : "premièrement", "ensuite", "enfin"

### Longueur phrases
Source : Biber et al. (1999)  
Seuil 20 mots : phrases longues = discours planifié/élaboré

### Fragments courts
Source : Biber et al. (1999)  
Seuil 10 mots : fragments = discours spontané/brut

## Distinction avec autres variables

**Pourquoi Linéarisation ≠ Organisation (TME)** :
- **Organisation (TME)** : f(O) = coût de maintien d'une posture conversationnelle
- **Linéarisation** : L = degré de formatage/structuration explicite
- L est un **observable**, f(O) est un **facteur multiplicatif**

**Linéarisation comme filtrage** :
- Concept inspiré de la notion de "lissage" discursif
- Plus L est élevé, plus le discours est formaté/structuré
- **Objectif** : Détecter quand l'IA "lisse" le discours au lieu de laisser brut

## Validation empirique

### Seuils de conversion
- **Dominante** (≥8) : Structuration très marquée
- **Présente** (2-7) : Structuration modérée
- **Absente** (<2) : Discours brut

### Formule de calcul
```
score_total = score_structure + score_longueur + score_conclusion + score_fragments

Où :
- score_structure = nb_bullets + nb_headers + nb_numbered
- score_longueur = nb_phrases_longues × 0.5
- score_conclusion = nb_patterns_conclusion × 2
- score_fragments = nb_fragments × (-0.5)
```

## Notes méthodologiques

**Forces** :
- Détection objective (regex, comptage)
- Pas d'ambiguïté d'interprétation
- Reproductible à 100%

**Limites** :
- Ne détecte que structuration explicite (pas implicite)
- Dépendant du format de sortie du LLM
- Bullets/headers peuvent être appropriés selon contexte

**Choix de conception** :
- Mesuré **uniquement sur réponses IA** (pas sur user)
- Fragments courts **réduisent** score (signe de brut)
- Patterns conclusion poids × 2 (signal fort de linéarisation)

## Références complètes

Biber, D., Johansson, S., Leech, G., Conrad, S., & Finegan, E. (1999). *Longman Grammar of Spoken and Written English*. Longman.

CommonMark Spec (2014). *A strongly defined, highly compatible specification of Markdown*.

Fraser, B. (1999). What are discourse markers? *Journal of Pragmatics*, 31(7), 931-952.

Gruber, J. (2004). *Markdown Syntax Documentation*. Daring Fireball.

Halliday, M.A.K., & Hasan, R. (1976). *Cohesion in English*. Longman.

Mann, W.C., & Thompson, S.A. (1988). Rhetorical Structure Theory: Toward a functional theory of text organization. *Text*, 8(3), 243-281.

Schiffrin, D. (1987). *Discourse Markers*. Cambridge University Press.
