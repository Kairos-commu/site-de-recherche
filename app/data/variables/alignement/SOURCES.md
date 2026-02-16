# Sources academiques - Variable Alignement

## Changement de paradigme v2.0 (2026-02-01)

> **IMPORTANT** : Dans l'equation de resonance v2, l'Alignement (A) n'est plus un multiplicateur mais une **condition de seuil binaire**.

### Avant (v1)
- Equation : `R = (I/E) x f(O) x (A-L)`
- A etait un score gradue (0 a 1) qui multipliait la resonance
- Probleme : Trop d'alignement favorisait les boucles de validation

### Apres (v2)
- Equation : `R = (I x F) / L` avec conditions prealables
- A fait partie des **conditions d'existence de l'espace** (Niveau 1)
- Si A > seuil_min, l'espace peut exister (booleen)
- A ne maximise plus rien, il ouvre juste la porte

### Implications
- Les marqueurs de validation/correction sont conserves pour **detection de presence**
- Plus de calcul de score gradue
- Les poids ont ete retires des fichiers JSON
- Certains marqueurs de correction sont reutilises dans friction/ comme initiateurs

---

## Fondements theoriques

### Interactive Alignment Model
- **Pickering, M.J., & Garrod, S. (2004)**. *Toward a mechanistic psychology of dialogue*. Behavioral and Brain Sciences, 27(2), 169-226.
  - Modele central de l'alignement interactif en dialogue
  - Mecanismes d'alignement lexical, syntaxique, et situationnel
  - **Principe** : Les interlocuteurs alignent automatiquement leurs representations
  - Utilise pour : cadre theorique general de la variable Alignement

### Grounding Theory
- **Clark, H.H., & Brennan, S.E. (1991)**. *Grounding in communication*. In L.B. Resnick, J.M. Levine, & S.D. Teasley (Eds.), *Perspectives on socially shared cognition* (pp. 127-149). American Psychological Association.
  - Theorie de l'ancrage conversationnel (grounding)
  - **Common ground** : connaissances mutuelles partagees
  - Signaux de grounding (acknowledgments, back-channels)
  - Utilise pour : marqueurs de validation et back-channeling

- **Brennan, S.E., & Clark, H.H. (1996)**. *Conceptual pacts in conversation*. Journal of Experimental Psychology: Learning, Memory, and Cognition, 22(6), 1482-1493.
  - **Pactes conceptuels** : accords implicites sur les termes utilises
  - **Lexical entrainment** : reprise du vocabulaire de l'interlocuteur
  - Utilise pour : detection de reprise conceptuelle

### Conversation Analysis
- **Schegloff, E.A. (1982)**. *Discourse as an interactional achievement: Some uses of 'uh huh' and other things that come between sentences*. In D. Tannen (Ed.), *Analyzing Discourse: Text and Talk* (pp. 71-93). Georgetown University Press.
  - Analyse des marqueurs discursifs (back-channels)
  - Signaux minimaux d'engagement conversationnel
  - Utilise pour : categorisation back-channeling

- **Schegloff, E.A., Jefferson, G., & Sacks, H. (1977)**. *The preference for self-correction in the organization of repair in conversation*. Language, 53(2), 361-382.
  - Mecanismes de reparation conversationnelle
  - Corrections et reformulations
  - Utilise pour : patterns de correction nuancee
  - **Note v2** : Ces patterns sont aussi utilises dans friction/

### Agreement/Disagreement
- **Pomerantz, A. (1984)**. *Agreeing and disagreeing with assessments: Some features of preferred/dispreferred turn shapes*. In J.M. Atkinson & J. Heritage (Eds.), *Structures of Social Action* (pp. 57-101). Cambridge University Press.
  - Structures preferees/dispreferrees de l'accord/desaccord
  - Formes attenuees du desaccord
  - Utilise pour : typologie validations/corrections

### Collaborative Learning
- **Roschelle, J. (1992)**. *Learning by collaborating: Convergent conceptual change*. Journal of the Learning Sciences, 2(3), 235-276.
  - Convergence conceptuelle dans apprentissage collaboratif
  - Emergence de comprehensions partagees
  - Utilise pour : detection d'emergence de concepts

### Computational Conversation Analysis
- **Danescu-Niculescu-Mizil, C., Lee, L., Pang, B., & Kleinberg, J. (2012)**. *Echoes of power: Language effects and power differences in social interaction*. Proceedings of WWW 2012.
  - Marqueurs conversationnels computationnels
  - Longueur reponse comme proxy d'engagement
  - Utilise pour : metrique engagement minimal

---

## Application v2 : Detection de seuil

### Methode
La detection de A > seuil_min utilise la methode `any_of` :
- Si **validation detectee** (n'importe quelle categorie) -> seuil atteint
- Si **reprise conceptuelle** (similarite > 0.3) -> seuil atteint
- Si **engagement minimal** (> 10 mots substantiels) -> seuil atteint

### Interpretation
| Resultat | Signification |
|----------|---------------|
| `true` | Direction commune presente, l'espace peut exister |
| `false` | Pas d'accordage minimal, R ne s'applique pas |

---

## Notes methodologiques v2

**Ce qui change** :
- Plus de calcul de score gradue
- Plus de poids par categorie
- Detection binaire (presence/absence)
- Corrections ne soustraient plus du score

**Ce qui reste** :
- Les marqueurs sont conserves pour analyse qualitative
- Les sources academiques restent valides
- La distinction entre categories est utile pour le diagnostic

---

## References completes

Brennan, S.E., & Clark, H.H. (1996). Conceptual pacts in conversation. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 22(6), 1482-1493.

Clark, H.H., & Brennan, S.E. (1991). Grounding in communication. In L.B. Resnick, J.M. Levine, & S.D. Teasley (Eds.), *Perspectives on socially shared cognition* (pp. 127-149). American Psychological Association.

Danescu-Niculescu-Mizil, C., Lee, L., Pang, B., & Kleinberg, J. (2012). Echoes of power: Language effects and power differences in social interaction. *Proceedings of WWW 2012*.

Pickering, M.J., & Garrod, S. (2004). Toward a mechanistic psychology of dialogue. *Behavioral and Brain Sciences*, 27(2), 169-226.

Pomerantz, A. (1984). Agreeing and disagreeing with assessments. In J.M. Atkinson & J. Heritage (Eds.), *Structures of Social Action* (pp. 57-101). Cambridge University Press.

Roschelle, J. (1992). Learning by collaborating: Convergent conceptual change. *Journal of the Learning Sciences*, 2(3), 235-276.

Schegloff, E.A. (1982). Discourse as an interactional achievement. In D. Tannen (Ed.), *Analyzing Discourse: Text and Talk* (pp. 71-93). Georgetown University Press.

Schegloff, E.A., Jefferson, G., & Sacks, H. (1977). The preference for self-correction in the organization of repair in conversation. *Language*, 53(2), 361-382.

---

## Changelog

### v2.0 (2026-02-01)
- Alignement transforme en condition de seuil binaire
- Suppression des poids gradues
- Ajout section changement de paradigme
- Mise a jour de l'application aux calculs

### v1.0 (2026-01-24)
- Version initiale avec scores gradues
