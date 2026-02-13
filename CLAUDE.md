# CLAUDE.md — site-de-recherche

Site statique GitHub Pages : articles de recherche sur les interactions humain-IA + présentation du projet KAIROS.

## URL

https://kairos-commu.github.io/site-de-recherche/

## Architecture

Site statique pur — pas de build tool, pas de framework, pas de SSG. HTML + CSS + JS servis directement par GitHub Pages.

```
site-de-recherche/
├── index.html                          # Page d'accueil (liste des articles)
├── about.html                          # Page À propos
├── contact.html                        # Page Contact
├── 404.html                            # Page 404 GitHub Pages
├── presentation_kairos.html            # Présentation interactive KAIROS (standalone)
│
├── mecanique-invisible.html            # Article : La mécanique invisible
├── politesse-algorithmique.html        # Article : La Politesse Algorithmique
├── pensee-en-faisceau.html             # Article : La Pensée en Faisceau
├── neutralite-illusion-permission.html # Article : La neutralité comme illusion
├── questiologie-llm.html              # Article : Questiologie et LLM
├── parler-depuis-apres.html           # Article : Parler depuis l'après
│
├── css/
│   ├── base.css                        # Variables, reset, header, footer, dark mode, responsive
│   ├── article.css                     # Sidebar, progress bar, breadcrumb, contenu article
│   └── kairos.css                      # Styles propres à presentation_kairos.html
│
├── js/
│   └── site.js                         # Theme toggle, mobile nav, smooth scroll, progress bar
│
├── docs/                               # MD synchronisés depuis Kairos via GitHub Action
│   ├── ARCHITECTURE.md
│   ├── PROMPTS-LLM.md
│   ├── ROADMAP.md
│   └── index.md
│
├── Articles/                           # PDFs sources (gitignored)
├── favicon.svg
├── og-image.jpg                        # Image OG partagée (deux silhouettes humain-IA)
├── feed.xml                            # Flux RSS
├── sitemap.xml                         # Sitemap SEO
├── robots.txt
└── README.md
```

## Pages et CSS

| Page | CSS chargés |
|------|------------|
| `index.html`, `about.html`, `contact.html`, `404.html` | `css/base.css` |
| 6 articles | `css/base.css` + `css/article.css` |
| `presentation_kairos.html` | `css/kairos.css` uniquement (monde isolé) |

Toutes les pages chargent `js/site.js` en fin de `<body>`.

## CSS Variables

Variables centralisées dans `css/base.css` `:root` :

```css
/* Couleurs principales */
--bg-page, --bg-card, --bg-card-hover
--text-primary, --text-secondary, --text-muted
--accent (amber #d97706), --accent-hover, --accent-light
--border-color, --border-light
/* Sombre via [data-theme="dark"] */
```

`css/kairos.css` a son propre jeu de variables (purple/violet) — indépendant de base.css.

## Dark Mode

- Toggle dans le header (toutes les pages)
- Persistance : `localStorage.theme` (`light` ou `dark`)
- Détection automatique : `prefers-color-scheme: dark`
- Attribut : `[data-theme="dark"]` sur `<html>`
- Anti-FOUC : script inline en `<head>` de chaque page (lit localStorage avant le premier paint) — présent sur les 10 pages (pas presentation_kairos qui est isolé)
- `js/site.js` gère le toggle et la persistance côté runtime

## Docs Viewer (presentation_kairos.html)

La section "Documentation" (#documentation) charge les fichiers `docs/*.md` via `fetch()` + `marked.js` (CDN).

- 3 boutons sidebar : Architecture, Métriques & Prompts, Roadmap
- JS inline dans la page (pas dans site.js — spécifique à cette page)
- Ne fonctionne PAS en `file://` (CORS) — uniquement sur serveur HTTP

## Sync depuis Kairos

Le repo Kairos a une GitHub Action (`.github/workflows/sync-docs.yml`) qui copie `doc projet/*.md` → `docs/` ici quand les MD changent sur `main`.

## Pour ajouter un nouvel article

1. Copier `pensee-en-faisceau.html` comme template
2. Remplacer contenu, titre, meta tags, breadcrumb, prev/next
3. CSS : `css/base.css` + `css/article.css` (pas de styles inline)
4. JS : `js/site.js` en fin de body (pas de scripts inline)
5. Ajouter la carte dans `index.html` section `#articles`
6. Mettre à jour la nav prev/next des articles adjacents
7. Ajouter dans `feed.xml` et `sitemap.xml`
8. Ajouter le bloc `<script type="application/ld+json">` BlogPosting dans `<head>` (copier depuis un article existant, adapter les données)

## Conventions

- **Pas de CSS inline** — tout dans css/base.css ou css/article.css
- **Pas de JS inline** — tout dans js/site.js (sauf anti-FOUC et presentation_kairos)
- **Meta tags obligatoires** : description, og:title, og:description, og:type, twitter:card, og:image, twitter:image
- **Anti-FOUC** : `<script>` inline dans `<head>` avant `<title>` (lit localStorage et applique data-theme)
- **Favicon** : `<link rel="icon" type="image/svg+xml" href="favicon.svg">`
- **Footer site** : `Florent Klimacek — 2026` + liens Accueil, Articles, À propos, Contact, RSS (identique sur toutes les pages non-article)
- **Footer article** : `Florent Klimacek — 2026` + lien retour accueil (identique sur tous les articles)
- **Schema.org JSON-LD** : `<script type="application/ld+json">` avant `</head>` — BlogPosting (articles), WebSite (index), Person (about)

## Roadmap

### Court terme
- [x] Ajouter `<link rel="alternate" type="application/rss+xml">` dans toutes les pages (fait — 9 pages ajoutées)
- [x] Créer une page 404.html pour GitHub Pages (fait)
- [x] Nettoyer le CSS mort (anciennes classes `.captures-*` dans article.css) — déjà absent, rien à supprimer

### Moyen terme
- [x] Ajouter un og:image pour chaque page (fait — `og-image.jpg` à la racine, référencé dans les 11 pages + JSON-LD)
- [ ] Considérer un SSG (11ty, Hugo) si le site dépasse 15 pages (header/footer dupliqués dans 10 fichiers)
- [x] Ajouter des dates de publication visibles sur les cartes articles (index.html) — déjà présentes via `.card__date`

### Cohérence & qualité (fait)
- [x] Anti-FOUC script ajouté sur 10 pages (lit localStorage avant le premier paint)
- [x] Footers standardisés sur toutes les pages (format, liens, copyright)
- [x] Inline CSS migré de index.html vers base.css (`.section__actions`, `.about-intro`, `.card--dark .card__icon`, etc.)
- [x] Titres alignés (og:title, JSON-LD headline, `<title>`) pour mecanique-invisible et questiologie-llm
- [x] JetBrains Mono ajouté à mecanique-invisible.html (manquait par rapport aux autres articles)
- [x] Lien mort "Accéder à l'application" corrigé (pointait vers `#`, redirige maintenant vers presentation_kairos)

### Améliorations possibles
- [ ] Lazy-loading des images (peu urgent — pas beaucoup d'images)
- [ ] Sitemap automatique (actuellement maintenu à la main)
- [x] Schema.org / JSON-LD pour les articles (fait — BlogPosting sur 6 articles, WebSite sur index, Person sur about)
