# Site Florent Klimacek

Site regroupant la recherche sur les interactions humain-IA : articles, analyses et le projet KAIROS.

## Structure des fichiers

```
site-de-recherche/
├── index.html                          # Page d'accueil
├── about.html                          # Page À propos
├── contact.html                        # Page Contact
├── presentation_kairos.html            # Présentation interactive KAIROS
│
├── css/
│   ├── base.css                        # Variables, reset, header, footer, dark mode, responsive
│   ├── article.css                     # Sidebar, progress bar, breadcrumb, contenu article
│   └── kairos.css                      # Styles propres à presentation_kairos.html
│
├── js/
│   └── site.js                         # Theme toggle, mobile nav, smooth scroll, progress bar
│
├── docs/                               # MD synchronisés depuis Kairos (GitHub Action)
│   ├── ARCHITECTURE.md
│   ├── PROMPTS-LLM.md
│   ├── ROADMAP.md
│   └── index.md
│
├── Articles/                           # PDFs sources
├── favicon.svg                         # Favicon SVG
├── feed.xml                            # Flux RSS
├── sitemap.xml                         # Sitemap pour moteurs de recherche
├── robots.txt                          # Instructions crawlers
│
└── [Articles HTML]
    ├── mecanique-invisible.html        # La mécanique invisible des IA conversationnelles
    ├── politesse-algorithmique.html    # La Politesse Algorithmique
    ├── pensee-en-faisceau.html         # La Pensée en Faisceau
    ├── neutralite-illusion-permission.html  # La neutralité comme illusion de permission
    ├── questiologie-llm.html           # Questiologie et LLM
    └── parler-depuis-apres.html        # Parler depuis l'après
```

## Articles disponibles

| Article | Description | Temps de lecture |
|---------|-------------|------------------|
| **La mécanique invisible** | Document fondateur — illusions cognitives, fenêtre de convergence, dynamiques structurelles | ~45 min |
| **La Politesse Algorithmique** | Comment les IA modèlent le langage critique du capitalisme | ~12 min |
| **La Pensée en Faisceau** | Convergence entre cognition humaine et intelligence artificielle | ~15 min |
| **La neutralité comme illusion** | Analyse des mécanismes créant l'impression d'ouverture du système | ~8 min |
| **Questiologie et LLM** | Influence des postures questiologiques sur les réponses (Claude vs ChatGPT) | ~10 min |
| **Parler depuis l'après** | Dialogue philosophique explorant les limites du langage | ~12 min |

## Fonctionnalités

### Mode sombre
- Toggle jour/nuit sur toutes les pages
- Persistance via localStorage
- Détection automatique (`prefers-color-scheme`)
- Transition fluide

### Navigation
- Fil d'Ariane (breadcrumb) sur les articles
- Navigation précédent/suivant entre articles
- Barre de progression de lecture
- Menu latéral avec scroll actif

### SEO & Partage
- Balises Open Graph et Twitter Card
- Sitemap XML, robots.txt
- Flux RSS

### Documentation KAIROS
- Docs viewer intégré dans `presentation_kairos.html`
- Synchronisation automatique depuis le repo Kairos via GitHub Action

## CSS

3 fichiers CSS, pas de styles inline :

| Fichier | Rôle | Utilisé par |
|---------|------|-------------|
| `css/base.css` | Variables, reset, header, footer, dark mode | Toutes les pages sauf KAIROS |
| `css/article.css` | Sidebar, progress, breadcrumb, contenu | 6 articles |
| `css/kairos.css` | Styles standalone présentation | `presentation_kairos.html` |

## JS

Un seul fichier partagé : `js/site.js` (theme toggle, mobile nav, smooth scroll, progress bar).

Le JS spécifique à la démo KAIROS et au docs viewer reste inline dans `presentation_kairos.html`.

## Pour ajouter un nouvel article

1. Copier `pensee-en-faisceau.html` comme template
2. Remplacer contenu, titre, meta tags, breadcrumb, prev/next
3. CSS : `css/base.css` + `css/article.css`
4. JS : `js/site.js` en fin de body
5. Ajouter la carte dans `index.html` section `#articles`
6. Mettre à jour la nav prev/next des articles adjacents
7. Ajouter dans `feed.xml` et `sitemap.xml`

## Hébergement

GitHub Pages — branche `main`, dossier racine.
URL : https://kairos-commu.github.io/site-de-recherche/

---

Florent Klimacek — 2026
