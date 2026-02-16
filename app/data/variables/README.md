# Referentiels de Variables - Equation de Resonance v2

Ce dossier contient les referentiels JSON et la documentation academique pour l'equation de resonance.

## Equation v2

```
NIVEAU 1 - CONDITIONS D'EXISTENCE DE L'ESPACE (L'ENTRE)
  - S > seuil_souplesse_min
  - L < seuil_linearisation_max
  - A > seuil_alignement_min

NIVEAU 2 - DYNAMIQUE (si conditions remplies)
  R = (I x F) / L
```

**Variables principales (Niveau 2)** :
- **I** = Intention (trajectoire, direction)
- **F** = Friction (resistance productive) [NOUVEAU]
- **L** = Linearisation (perte par mise en sequence)

**Variables de condition (Niveau 1)** :
- **S** = Souplesse (a definir)
- **A** = Alignement (seuil binaire)

## Structure

```
variables/
├── README.md (ce fichier)
├── intention/
│   ├── verbes_declaratifs.json
│   ├── seuils.json
│   └── SOURCES.md
├── friction/                    [NOUVEAU - v2]
│   ├── initiateurs_friction.json
│   ├── reponses_friction.json
│   ├── friction_parasitaire.json
│   ├── seuils.json
│   └── SOURCES.md
├── alignement/                  [SIMPLIFIE - v2]
│   ├── validations.json         (sans poids)
│   ├── corrections.json         (sans poids)
│   ├── seuils.json              (binaire)
│   └── SOURCES.md
├── linearisation/
│   ├── patterns_markdown.json
│   ├── patterns_conclusion.json
│   ├── seuils.json
│   └── SOURCES.md
└── _archive/                    [ARCHIVE - v2]
    └── energie/                 (absorbe dans L)
        ├── coefficients.json
        └── SOURCES.md
```

## Changements v2 (2026-02-01)

### Friction (NOUVEAU)
Variable centrale de la v2. La friction productive est le moteur de l'emergence.

```python
# Calcul de F
F = max(0, F_positive - F_negative) * reception_modifier
```

### Alignement (SIMPLIFIE)
A n'est plus un multiplicateur mais une condition de seuil binaire.

```python
# Ancienne methode (v1)
points += validation_poids  # Score gradue

# Nouvelle methode (v2)
if any_validation_detectee:
    A_condition = True  # Binaire
```

### Energie (ARCHIVE)
E est absorbe dans L (Linearisation). Les fichiers sont conserves dans `_archive/`.

## Utilisation v2

### 1. Verifier conditions d'espace (Niveau 1)

```python
def espace_existe(conversation):
    S = measure_souplesse(conversation)
    L_global = measure_linearisation_globale(conversation)
    A = detect_alignement_minimal(conversation)  # Binaire

    return (
        S > SEUILS["souplesse_min"] and
        L_global < SEUILS["linearisation_max"] and
        A == True
    )
```

### 2. Calculer resonance (Niveau 2)

```python
def calculate_resonance(conversation):
    if not espace_existe(conversation):
        return {"espace_ouvert": False, "resonance": None}

    I = measure_intention(conversation)
    F = measure_friction(conversation)
    L = measure_linearisation_locale(conversation)

    R = (I * F) / L if L > 0 else float('inf')

    return {"espace_ouvert": True, "resonance": R}
```

### 3. Exemple : Detection friction

```python
class FrictionAnalyzer:
    def __init__(self):
        with open('variables/friction/initiateurs_friction.json') as f:
            self.initiateurs = json.load(f)
        with open('variables/friction/reponses_friction.json') as f:
            self.reponses = json.load(f)
        with open('variables/friction/friction_parasitaire.json') as f:
            self.parasitaire = json.load(f)

    def analyze(self, message, context):
        F_positive = 0
        F_negative = 0

        # Detecter initiateurs
        for pattern in self.initiateurs['desaccord_oriente']['items']:
            if pattern in message.lower():
                F_positive += 1.0

        # Detecter friction parasitaire
        for pattern in self.parasitaire['attaques_personnelles']['items']:
            if pattern in message.lower():
                F_negative += 2.0

        return max(0, F_positive - F_negative)
```

### 4. Exemple : Detection alignement (v2 - binaire)

```python
class AlignementAnalyzer:
    def __init__(self):
        with open('variables/alignement/validations.json') as f:
            self.validations = json.load(f)

    def detect_seuil(self, message):
        """Retourne True si alignement minimal detecte"""
        message_lower = message.lower()

        # Verifier chaque categorie
        for category in ['validations_fortes', 'validations_moyennes',
                         'validations_nuancees', 'back_channeling']:
            for item in self.validations[category]['items']:
                if item in message_lower:
                    return True

        # Verifier engagement minimal (longueur)
        if len(message.split()) > 10:
            return True

        return False
```

## Fondements academiques

Chaque variable dispose d'un fichier `SOURCES.md` documentant les fondements theoriques.

### Principales sources

**Intention** :
- Speech Act Theory (Austin, Searle)
- LIWC 2015 (Pennebaker et al.)

**Friction** [NOUVEAU]:
- Repair Sequences (Schegloff et al., 1977)
- Dispreferred Turn Shapes (Conversation Analysis)
- Conflit socio-cognitif (Piaget, Doise & Mugny)
- Regulation du conflit (Butera et al.)

**Alignement** :
- Interactive Alignment Model (Pickering & Garrod, 2004)
- Grounding Theory (Clark & Brennan, 1991)

**Linearisation** :
- Discourse Markers (Schiffrin, 1987)
- Cohesion in English (Halliday & Hasan, 1976)

## Integration KAIROS

Ce dossier est integre directement dans KAIROS (`kairos/src/renderer/data/variables/`).

Les referentiels `friction/` sont utilises par le module de detection de circularite :

```
kairos/src/renderer/
├── data/variables/          # Ce dossier (referentiels JSON)
│   └── friction/
└── js/assisted/friction/    # Module de detection
    ├── referentielsLoader.js
    ├── circularityDetector.js
    ├── frictionInjector.js
    └── canvasHistory.js
```

**Fonctionnement** :
1. KAIROS detecte quand le canvas tourne en boucle (reformulations, cycles, stagnation)
2. Si score de circularite > 3, un bloc de friction est injecte dans le prompt LLM
3. Le LLM est force a proposer des bifurcations plutot que des prolongements lineaires

Voir `../js/assisted/friction/README.md` pour details techniques.

## Changelog

### Version 2.0.1 (2026-02-01)
- Integration complete dans KAIROS (detection circularite + injection friction)
- Indicateur visuel debug dans la toolbar
- Utilitaires `FrictionDebug` pour tests

### Version 2.0 (2026-02-01)
- **Friction** : Nouveau referentiel (variable centrale v2)
- **Alignement** : Simplifie en detection binaire (condition de seuil)
- **Energie** : Archive dans `_archive/` (absorbe dans L)
- Mise a jour architecture selon `equation_resonance_v2.md`

### Version 1.0 (2026-01-24)
- Creation initiale des 4 referentiels
- Equation : R = (I/E) x f(O) x (A-L)

## Contact & Contribution

**Auteur** : Flo (Florent)
**Projet** : KAIROS / F-Graph Canvas
**Date** : Fevrier 2026

Pour proposer modifications :
1. Verifier coherence avec `docs/equation_resonance_v2.md`
2. Documenter justification academique
3. Tester sur conversations reelles
