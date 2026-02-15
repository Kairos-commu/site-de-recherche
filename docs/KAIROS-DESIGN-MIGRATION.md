# KAIROS — Migration Visuelle

## Principes

Ce document décrit les changements visuels à appliquer à KAIROS **par phases isolées**.
Chaque phase est indépendante et testable. Ne pas tout faire d'un coup.
Le concept de référence est dans `kairos-redesign.html`.

---

## Phase 0 — Design Tokens (CSS Custom Properties)

**Contexte** : Créer un fichier de tokens centralisé. Toutes les couleurs, ombres, rayons, et espacements passent par des variables CSS. C'est le socle — tout le reste en dépend.

**Action** : Créer `src/styles/tokens.css` (ou l'équivalent dans ta structure) avec :

```css
:root {
  /* Surfaces — gris légèrement teintés bleu/violet, PAS de gris purs */
  --surface-deep: #0f1117;
  --surface-base: #151720;
  --surface-raised: #1c1f2b;
  --surface-overlay: #232738;
  --surface-hover: #2a2f42;

  /* Bordures */
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.18);

  /* Texte */
  --text-primary: #e8e6f0;
  --text-secondary: #9a97ab;
  --text-muted: #5e5b6e;

  /* Accents — chaque couleur a une variante "soft" à 12% opacité */
  --accent-primary: #6c8aff;
  --accent-primary-soft: rgba(108,138,255,0.12);
  --accent-warm: #ff8a6c;
  --accent-warm-soft: rgba(255,138,108,0.12);
  --accent-green: #5cd4a0;
  --accent-green-soft: rgba(92,212,160,0.12);
  --accent-amber: #f0c45a;
  --accent-amber-soft: rgba(240,196,90,0.12);
  --accent-rose: #f06888;
  --accent-rose-soft: rgba(240,104,136,0.12);

  /* Ombres multicouches */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.15);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.25);
  --shadow-glow-blue: 0 0 20px rgba(108,138,255,0.15);
  --shadow-glow-warm: 0 0 20px rgba(255,138,108,0.15);

  /* Rayons */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
```

**Prompt Claude Code** :
> Crée un fichier de design tokens CSS `src/styles/tokens.css` avec le contenu ci-dessus. Importe-le dans le point d'entrée CSS de l'application. Ne remplace aucune couleur existante pour l'instant, on fait juste l'import.

**Vérification** : L'app compile et tourne exactement comme avant.

---

## Phase 1 — Typographie

**Contexte** : Remplacer les fonts par défaut par un système à 3 niveaux.

**Fonts à charger** (via Google Fonts ou fichiers locaux dans Electron) :
- **DM Sans** (300, 400, 500, 600, 700) — UI générale
- **JetBrains Mono** (300, 400, 500) — données, métriques, status bar, code
- **Instrument Serif** (italic) — branding KAIROS uniquement

**Action** :
1. Télécharger les fonts en fichiers .woff2 dans `src/assets/fonts/` (Electron = pas de CDN)
2. Créer les @font-face dans `src/styles/fonts.css`
3. Appliquer `font-family: 'DM Sans', sans-serif` au body
4. Appliquer `font-family: 'JetBrains Mono', monospace` aux éléments de données (status bar, scores O₂, valeurs de signaux)
5. Appliquer `font-family: 'Instrument Serif', serif; font-style: italic` au logo KAIROS

**Prompt Claude Code** :
> Charge les fonts DM Sans, JetBrains Mono et Instrument Serif en local (woff2) dans `src/assets/fonts/`. Crée les @font-face dans `src/styles/fonts.css`. Applique DM Sans comme font de base sur le body, JetBrains Mono sur les éléments de données numériques (status bar, score O₂, signal values), et Instrument Serif italic sur le titre/logo KAIROS. Ne touche à rien d'autre.

**Vérification** : Les fonts changent, le layout ne bouge pas.

---

## Phase 2 — Migration couleurs (le plus gros morceau)

**Contexte** : Remplacer progressivement les couleurs hardcodées par les tokens.

**Stratégie** : Fichier par fichier, composant par composant. Pas de rechercher-remplacer global.

**Ordre recommandé** :
1. Surfaces (backgrounds) — `--surface-deep`, `--surface-base`, `--surface-raised`
2. Bordures — `--border-subtle`, `--border-default`
3. Texte — `--text-primary`, `--text-secondary`, `--text-muted`
4. Accents — un par un

**Prompt Claude Code** (répéter pour chaque composant) :
> Dans le fichier `[fichier.css ou composant]`, remplace les couleurs de background hardcodées par les tokens de surface correspondants : le fond le plus sombre → `var(--surface-deep)`, fond de panneau → `var(--surface-base)`, fond d'élément surélevé → `var(--surface-raised)`. Utilise `var(--border-subtle)` pour les séparateurs et `var(--border-default)` pour les bordures de composants. Ne touche pas aux couleurs d'accent pour l'instant.

**Vérification** : Visuellement cohérent, pas de couleurs "orphelines" qui détonnent.

---

## Phase 3 — Nœuds du canvas

**Contexte** : Les nœuds sont l'élément central. Les améliorer transforme la perception de l'app.

**Changements** :
1. `border-radius: var(--radius-lg)` (14px au lieu de carrés)
2. Bande d'accent colorée en haut (3px, gradient)
3. Ombre multicouche : `var(--shadow-md)` au repos, `var(--shadow-lg)` au hover
4. Hover : léger translateY(-2px) + border-color plus fort
5. État actif : border-color accent + glow shadow
6. État priorité : border-color warm + glow warm
7. Tags : background soft (12% opacity) + texte couleur accent
8. Ports de connexion : petits cercles de 8px aux bords, s'illuminent au hover

**Prompt Claude Code** :
> Modifie le style des nœuds du canvas. Ajoute : border-radius 14px, une bande colorée de 3px en haut de chaque nœud (couleur dépend du type/statut), des ombres multicouches (`0 4px 12px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2)`). Au hover : translateY(-2px), ombre plus forte, border-color plus visible. Pour l'état actif : bordure accent-primary + glow bleu. Pour l'état priorité : bordure accent-warm + glow warm. Reformate les tags avec background semi-transparent (12% opacity de la couleur du tag) et texte de la couleur du tag. Réfère-toi au fichier `kairos-redesign.html` pour le rendu exact.

**Vérification** : Les nœuds ont du relief, les états sont distinguables, les tags sont lisibles.

---

## Phase 4 — Connexions (SVG)

**Contexte** : Passer des lignes droites aux courbes Bézier avec animation de flux.

**Changements** :
1. Remplacer les lignes droites par des `<path>` avec courbes cubiques
2. Ajouter un gradient le long de la connexion (couleur départ → couleur arrivée)
3. `stroke-dasharray` + animation `stroke-dashoffset` pour le flux directionnel
4. Filtre SVG glow subtil
5. Types visuels : "implique" = trait continu animé, "résonance" = dashed

**Prompt Claude Code** :
> Modifie le rendu des connexions entre nœuds. Remplace les lignes droites par des courbes Bézier SVG (path avec C). Ajoute un gradient SVG linéaire le long de chaque connexion. Ajoute une animation CSS `stroke-dashoffset` pour un effet de flux directionnel (dash se déplace le long de la courbe). Le type "implique" utilise un trait plus dense, le type "résonance" un trait plus espacé (dashed). Ajoute un filtre SVG feGaussianBlur léger (stdDeviation 2) pour un effet glow. Voir `kairos-redesign.html` pour référence.

---

## Phase 5 — Sidebar gauche

**Changements** :
1. Score O₂ : chiffre en gradient, barre arc-en-ciel en haut du bloc
2. Barres de signal : remplissage en gradient au lieu de couleur plate
3. Valeurs colorées sémantiquement (négatif = rose, positif = vert)
4. Cartes diagnostic : bordure gauche colorée (3px), hover state
5. Carte suggestion : background accent-soft, badge action en pill

---

## Phase 6 — Toolbar

**Changements** :
1. Mode toggle en pill (background raised, active = overlay + shadow)
2. Séparateurs entre groupes de boutons
3. Hiérarchie : bouton "+ Vignette" en accent primaire, le reste transparent
4. Theme pill avec dot coloré
5. Zoom en JetBrains Mono

---

## Phase 7 — Status bar

**Changements** :
1. Dot de statut avec glow (box-shadow coloré)
2. Boutons d'action avec hover states
3. Bouton Exporter en accent primaire

---

## Phase 8 — Finitions

1. **Grille du canvas** : points subtils (radial-gradient, 3% opacité) au lieu de fond uni
2. **Minimap** : overlay en bas à gauche, backdrop-filter blur, viewport visible
3. **Scrollbars custom** : 3px, couleur border-default
4. **Transitions globales** : ajouter `transition: all 0.2s ease` sur tous les éléments interactifs

---

## Règles pour Claude Code

À inclure dans chaque prompt :

1. **Un seul fichier/composant par commit.** Ne jamais modifier plus de 2-3 fichiers à la fois.
2. **Ne pas casser la fonctionnalité.** Changements purement visuels. Si un changement CSS nécessite une modif de structure HTML/TSX, le signaler avant de le faire.
3. **Utiliser les design tokens.** Jamais de couleur hexadécimale en dur — toujours `var(--token)`.
4. **Tester le thème sombre en priorité.** Si KAIROS a un thème clair (Porcelain), on le fait converger après.
5. **Référence visuelle** : `kairos-redesign.html` est la cible. En cas de doute, s'en rapprocher.

---

## Estimation effort

| Phase | Complexité | Temps estimé |
|-------|-----------|-------------|
| 0 — Tokens | Triviale | 15 min |
| 1 — Typo | Faible | 30 min |
| 2 — Couleurs | Moyenne | 1-2h (itératif) |
| 3 — Nœuds | Moyenne+ | 1-2h |
| 4 — Connexions | Haute | 2-3h |
| 5 — Sidebar | Faible | 45 min |
| 6 — Toolbar | Faible | 30 min |
| 7 — Status bar | Triviale | 15 min |
| 8 — Finitions | Moyenne | 1h |

**Total estimé : 7-10h de travail avec Claude Code, réparties sur plusieurs sessions.**
