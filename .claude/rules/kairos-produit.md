---
paths:
  - "src/_data/kairos.json"
  - "src/download.njk"
  - "src/presentation_kairos*.njk"
  - "src/css/kairos.css"
  - "src/demo/**"
  - "src/demo_en/**"
  - "deploy-kairos.sh"
---

# KAIROS — faits produit et déploiement

- **Source unique** : `src/_data/kairos.json` (version, date, URLs et tailles des binaires,
  providers, highlights, prérequis). Lu par `download.njk`, le CTA de l'accueil, le JSON-LD
  SoftwareApplication (`base.njk`) et les présentations (copié en `_site/kairos.json`).
  Ne jamais taper la version ailleurs.
- **Pause téléchargement** : `downloadsAvailable: false` masque tous les liens binaires
  (accueil, download, présentation, JSON-LD) ; `deploy-kairos.sh` le remet à `true`.
- Présentations (`presentation_kairos*.njk`) : `css/kairos.css` seul, jeu de variables propre
  (violet), indépendant du reste du site.
- **Ne pas** recopier `doc projet/*.md` (ROADMAP, ARCHITECTURE, PROMPTS-LLM) : internes. Les
  textes publics sont les articles (`kairos-technical-overview.md`, `genese-kairos.md`…).
- Une feature visible dans l'appli : se demander si elle mérite une carte dans
  `kairos.highlights` et/ou la section features de la présentation.

## Nouvelle version

- Binaires sur **GitHub Releases** (pas dans le dépôt). `./deploy-kairos.sh X.Y.Z` — **à lancer à
  la main par Florent, jamais par un agent** (effet public : release + site prod). Il prend les
  binaires dans `../kairos-app/release/`, crée la release, met à jour `kairos.json`, build,
  commit et pousse. Prérequis : `gh` connecté.
- Changement de faits sans binaire : éditer `kairos.json` (ou la présentation), `npm test`.
