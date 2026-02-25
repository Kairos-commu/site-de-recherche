# CLAUDE.md — site-de-recherche

Site statique GitHub Pages construit avec **Eleventy (11ty)** : articles de recherche sur les interactions humain-IA + présentation du projet KAIROS.

## URL

- **Production** : https://mecanique-invisible.com (domaine custom, CNAME -> GitHub Pages)
- **Alias GitHub** : https://kairos-commu.github.io/site-de-recherche/ (redirige vers le domaine custom)
- **CNAME** : fichier `src/CNAME` contenant `mecanique-invisible.com`

## Build & Commandes

```bash
npm run build    # Construit le site dans _site/
npm run serve    # Serveur local avec hot reload (http://localhost:8080)
```

- **SSG** : Eleventy v3.x avec templates Nunjucks
- **Deploiement** : GitHub Actions (`.github/workflows/deploy.yml`) — build + deploy sur push `main`
- **Source** : `src/` — **Output** : `_site/` (gitignored)

## Architecture

```
site-de-recherche/
├── src/                                  # Source 11ty
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk                  # Shell HTML : head, meta, fonts, CSS, JSON-LD, site.js
│   │   │   ├── page.njk                  # Extends base : site-header + main + site-footer
│   │   │   └── article.njk               # Extends base : article header, sidebar, hero, prev/next
│   │   └── partials/
│   │       ├── head-meta.njk             # OG + Twitter meta tags
│   │       ├── site-header.njk           # Logo + nav + theme toggle
│   │       ├── site-footer.njk           # Copyright + liens + formule
│   │       └── article-nav.njk           # Prev/next auto-calcule depuis la collection
│   │
│   ├── _data/
│   │   └── site.json                     # Metadonnees globales (url, author, year, etc.)
│   │
│   ├── articles/                         # Collection d'articles (11 fichiers .md)
│   │   ├── articles.json                 # Defaults : layout article.njk, tags ["article"]
│   │   ├── mecanique-invisible.md        # Document fondateur (featured)
│   │   ├── politesse-algorithmique.md
│   │   ├── neutralite-illusion-permission.md
│   │   ├── pensee-en-faisceau.md
│   │   ├── questiologie-llm.md
│   │   ├── parler-depuis-apres.md
│   │   ├── genese-kairos.md              # Featured
│   │   ├── vibe-coding.md
│   │   ├── ia-adoption.md
│   │   ├── cout-cognitif.md
│   │   └── mort-du-clic.md
│   │
│   ├── index.njk                         # Accueil (cartes auto-generees depuis la collection)
│   ├── about.njk                         # Page A propos
│   ├── contact.njk                       # Page Contact
│   ├── 404.njk                           # Page 404
│   ├── feed.njk                          # Genere feed.xml depuis la collection
│   ├── sitemap.njk                       # Genere sitemap.xml depuis la collection
│   │
│   ├── css/                              # Passthrough copy
│   │   ├── base.css                      # Variables, reset, header, footer, dark mode, responsive
│   │   ├── article.css                   # Sidebar, progress bar, breadcrumb, contenu article
│   │   └── kairos.css                    # Styles presentation_kairos (monde isole)
│   ├── js/
│   │   └── site.js                       # Theme toggle, mobile nav, smooth scroll, progress bar
│   │
│   ├── presentation_kairos.html          # Passthrough brut (jamais traite par 11ty)
│   ├── demo/                             # App demo KAIROS (passthrough)
│   ├── docs/                             # MD synchronises depuis Kairos (passthrough)
│   ├── favicon.svg, og-image.jpg         # Passthrough
│   ├── CNAME, robots.txt                 # Passthrough
│
├── _site/                                # Output build (gitignored)
├── eleventy.config.js                    # Config 11ty
├── package.json                          # @11ty/eleventy devDependency
├── .github/workflows/deploy.yml          # CI/CD GitHub Pages
├── .gitignore
├── CLAUDE.md
└── README.md
```

## Comment 11ty fonctionne ici

### Layout chain (cascade de contenu)
11ty utilise `layout:` dans le frontmatter YAML (PAS `{% extends %}`). Le contenu du fichier enfant devient `{{ content }}` dans le layout parent.

```
article.md -> article.njk -> base.njk
  contenu       {{ content | safe }}    {{ content | safe }}
```

**Important** : les `{% block %}` Nunjucks ne fonctionnent PAS avec le systeme de layout 11ty. Tout passe par `{{ content | safe }}`.

### Collection articles
- Definie dans `eleventy.config.js` : triee par `datePublished` puis `order` (tiebreaker pour articles meme date)
- `src/articles/articles.json` applique automatiquement `layout: "layouts/article.njk"` et `tags: ["article"]`
- `index.njk`, `feed.njk`, `sitemap.njk` bouclent sur `collections.articles`

### Filtres custom
- `dateFr` : "2026-02-25" -> "25 fevrier 2026"
- `dateMonthFr` : "2026-02-25" -> "Fevrier 2026"
- `dateRfc822` : pour feed.xml
- `pad` : "1" -> "01" (numeros de section sidebar)

### Passthrough copy
Les fichiers suivants sont copies tels quels dans `_site/` sans traitement :
- `src/css/`, `src/js/`, `src/demo/`, `src/docs/`
- `src/favicon.svg`, `src/og-image.jpg`, `src/CNAME`, `src/robots.txt`
- `src/presentation_kairos.html`

### Fichiers ignores par 11ty
`src/docs/**`, `src/demo/**`, `src/presentation_kairos.html` sont dans `eleventyConfig.ignores` pour ne pas etre traites comme templates.

## Pages et CSS

| Page | CSS charges |
|------|------------|
| `index.njk`, `about.njk`, `contact.njk`, `404.njk` | `css/base.css` |
| 11 articles | `css/base.css` + `css/article.css` (via `extraCss` dans article.njk) |
| `presentation_kairos.html` | `css/kairos.css` uniquement (monde isole, passthrough) |

Toutes les pages chargent `js/site.js` en fin de `<body>` (via base.njk).

## Pour ajouter un nouvel article

1. Creer `src/articles/mon-article.md` avec le frontmatter YAML (copier depuis un article existant)
2. `npm run build` — l'article apparait automatiquement dans index.html, feed.xml, sitemap.xml, et la nav prev/next se met a jour

Frontmatter minimal requis :
```yaml
---
slug: mon-article
pageTitle: "Titre — Florent Klimacek"
headline: "Titre"
description: "Description 120-160 chars"
ogTitle: "Titre"
ogDescription: "Description"
ogUrl: "https://mecanique-invisible.com/mon-article.html"
canonical: "/mon-article.html"
datePublished: "2026-03-01"
keywords: ["mot-cle"]
permalink: "/mon-article.html"
order: 12
navLabel: "Sommaire"
navDescription: "Sous-titre"
heroLabel: "Article"
heroH1: "Titre <em>en italique</em>"
heroIntro: "Introduction"
headerTitle: "Titre court"
breadcrumbName: "Titre"
sections:
  - { id: "section1", title: "Section 1" }
card:
  label: "Article"
  title: "Titre carte"
  desc: "Description carte"
  readTime: "5 min"
  featured: false
---
<section id="section1">
  <h2>Section 1</h2>
  <p>Contenu HTML avec les classes CSS du site...</p>
</section>
```

## CSS Variables

Variables centralisees dans `src/css/base.css` `:root` :

```css
--bg-page, --bg-card, --bg-card-hover
--text-primary, --text-secondary, --text-muted
--accent (amber #d97706), --accent-hover, --accent-light
--border-color, --border-light
/* Sombre via [data-theme="dark"] */
```

`src/css/kairos.css` a son propre jeu de variables (purple/violet) — independant de base.css.

## Responsive / Breakpoints

Approche mobile-first progressive :

| Breakpoint | Cible | Fichiers |
|---|---|---|
| `900px` | Tablettes — grids 1 col, sidebar masquee | `base.css`, `article.css`, `kairos.css` |
| `768px` | Petites tablettes — header mobile | `base.css`, `article.css`, `kairos.css` |
| `600px` | Phablets | `kairos.css` |
| `500px` | Petits ecrans — grids 1 col | `kairos.css` |
| `480px` | Smartphones — paddings reduits, touch | `base.css`, `article.css`, `kairos.css` |

## Dark Mode

- Toggle dans le header (toutes les pages)
- Persistance : `localStorage.theme` (`light` ou `dark`)
- Detection automatique : `prefers-color-scheme: dark`
- Attribut : `[data-theme="dark"]` sur `<html>`
- Anti-FOUC : script inline dans base.njk `<head>` (applique avant le premier paint)
- `js/site.js` gere le toggle cote runtime

## Docs Viewer (presentation_kairos.html)

Fichier passthrough — jamais traite par 11ty. Charge `docs/*.md` via `fetch()` + `marked.js` (CDN).

- JS inline dans la page (specifique, pas dans site.js)
- Ne fonctionne PAS en `file://` (CORS)

## Sync depuis Kairos

Le repo Kairos a une GitHub Action qui copie `doc projet/*.md` -> `src/docs/` ici.
**Note** : si le workflow Kairos ecrit encore dans `docs/` a la racine, le mettre a jour pour ecrire dans `src/docs/`.

## Conventions

- **Pas de CSS inline** — tout dans src/css/base.css ou src/css/article.css
- **Pas de JS inline** — tout dans src/js/site.js (sauf anti-FOUC dans base.njk et presentation_kairos)
- **Meta tags** — geres automatiquement par les layouts (head-meta.njk) depuis le frontmatter
- **JSON-LD** — BlogPosting auto-genere pour les articles (via base.njk), WebSite/Person via `jsonLdRaw` dans frontmatter des pages
- **Contenu article en HTML** — les fichiers .md contiennent du HTML brut (classes CSS specifiques : `.lead`, `.key-insight`, `.chapter-divider`, `.concept`, `.sources-section`)

## Vigilance — site en production

Ce site est public sur `mecanique-invisible.com`. Chaque push declenche un build + deploy automatique.

### Securite

- **Jamais de secrets dans le code**
- **Pas de `http://`** — liens externes en `https://`
- **CSP** — `presentation_kairos.html` a sa propre CSP `<meta>`
- **SRI** — CDN avec `integrity` + `crossorigin="anonymous"`
- **`target="_blank"`** -> toujours avec `rel="noopener"`
- **Pas de `eval()`, `innerHTML` avec donnees utilisateur, `document.write()`**
- **postMessage** — toujours valider `event.origin`

### SEO et meta tags

Geres automatiquement par les layouts depuis le frontmatter. Verifier :
- `og:title` = `<title>` = JSON-LD `headline` (coherence stricte)
- `og:description` — 120-160 caracteres
- `og:url` — URL canonique complete
- `og:image` — URL absolue existante

### Coherence inter-fichiers (simplifie par 11ty)

| Donnee modifiee | Action |
|---|---|
| Titre d'un article | Modifier le frontmatter du .md — tout se propage automatiquement |
| Nouvel article | Creer un .md dans src/articles/ — index, feed, sitemap, nav auto |
| Suppression d'article | Supprimer le .md — tout se met a jour au build |
| Changement de domaine | `src/_data/site.json` + `src/CNAME` |

### Avant chaque push

1. `npm run build` — verifier que le build passe sans erreur
2. Pas de secrets, cles API, chemins locaux
3. Meta tags coherents (verifier le frontmatter)
4. CNAME present dans `src/`
