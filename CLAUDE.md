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
│   │   ├── site.json                     # Metadonnees globales (url, author, year, etc.)
│   │   └── kairos.json                   # Source unique KAIROS (version, plateformes, highlights)
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
│   ├── manifeste.njk                     # Page Manifeste / landing (texte de filtrage)
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
│   ├── images/                           # Images articles (WebP) + vue complete
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
- `src/css/`, `src/js/`, `src/images/`, `src/demo/`, `src/docs/`
- `src/favicon.svg`, `src/og-image.jpg`, `src/CNAME`, `src/robots.txt`
- `src/presentation_kairos.html`
- `src/_data/kairos.json` → `_site/kairos.json` (lu par les pages présentation HTML)

### Fichiers ignores par 11ty
`src/docs/**`, `src/demo/**`, `src/presentation_kairos.html` sont dans `eleventyConfig.ignores` pour ne pas etre traites comme templates.

## Pages et CSS

| Page | CSS charges |
|------|------------|
| `index.njk`, `manifeste.njk`, `about.njk`, `contact.njk`, `404.njk` | `css/base.css` |
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
heroImage: "/images/mon-article.webp"
heroImageAlt: "Illustration — Titre"
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

## Pages KAIROS — source unique

Tous les faits produit (version, date, URLs de download, tailles, providers, highlights, prérequis) vivent dans `src/_data/kairos.json`.

| Consommateur | Comment |
|---|---|
| `download.njk` | 11ty injecte `kairos.*` au build |
| `index.njk` | CTA « Télécharger v{{ kairos.version }} » |
| `base.njk` | JSON-LD SoftwareApplication (page download) |
| `presentation_kairos.html` / `_en.html` | passthrough HTML ; `fetch('kairos.json')` met à jour `[data-kairos-version]` |

**Ne plus hardcoder la version** dans `download.njk` ni l'accueil. La présentation HTML garde un fallback no-JS, synchronisé par le fetch.

**Pause téléchargement** : `downloadsAvailable: false` dans `kairos.json` masque tous les boutons/liens binaires (accueil, download, présentation, JSON-LD). Remettre à `true` (le fait automatiquement `deploy-kairos.sh`) pour rouvrir.

**Ne pas** recopier `doc projet/*.md` (ROADMAP, ARCHITECTURE, PROMPTS-LLM) vers le site public. Ces fichiers sont internes. Les textes publics sont les articles 11ty (`kairos-technical-overview.md`, `genese-kairos.md`, etc.).

## Déployer une nouvelle version KAIROS

Les binaires sont hébergés via **GitHub Releases** (pas dans le repo — trop lourds pour Git, et LFS ne fonctionne pas avec GitHub Pages).

**Script** : `deploy-kairos.sh` — **à lancer à la main**, pas par un agent (effet public : release + site prod).

```bash
# depuis site-de-recherche/, binaires déjà dans ../kairos-app/release/
./deploy-kairos.sh 1.1.0
```

Le script :
1. Cherche `KAIROS-X.Y.Z.AppImage` et éventuellement `KAIROS Setup X.Y.Z.exe` dans `../kairos-app/release/`
2. Crée (ou complète) la GitHub Release `vX.Y.Z` et uploade les binaires
3. Met à jour `src/_data/kairos.json` (version, URLs, tailles, date) — **pas** de sed sur le HTML
4. Build le site
5. Commit et push

**Prérequis** : `gh` CLI installé et connecté (`gh auth login`).

**Après un changement de faits sans nouveau binaire** (highlights, providers, texte O₂) : éditer `kairos.json` et/ou la présentation HTML, `npm run build`, commit, push. Pas besoin du script.

## Ce fil / routine de mise à jour

1. Feature visible dans l'UI de l'app → se demander si elle mérite une carte dans `kairos.highlights` et/ou la section features de `presentation_kairos.html`
2. Nouveau binaire → `./deploy-kairos.sh X.Y.Z`
3. Nouvel article de recherche → `src/articles/*.md` (déjà auto-indexé)
4. Ne pas synchroniser la ROADMAP brute

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
- `og:image` — auto depuis `heroImage` si present, sinon fallback `site.ogImage`

### Coherence inter-fichiers (simplifie par 11ty)

| Donnee modifiee | Action |
|---|---|
| Titre d'un article | Modifier le frontmatter du .md — tout se propage automatiquement |
| Nouvel article | Creer un .md dans src/articles/ — index, feed, sitemap, nav auto |
| Suppression d'article | Supprimer le .md — tout se met a jour au build |
| Changement de domaine | `src/_data/site.json` + `src/CNAME` |
| Version / binaire KAIROS | `src/_data/kairos.json` (ou `./deploy-kairos.sh X.Y.Z`) |
| Guide « Building a local agent you can trust » (Notes) | SOURCE = `~/kairos/kora/GUIDE.md` (github.com/Kairos-commu/kora) ; `npm run guide:sync` réécrit la note (bandeau d'état njk, liens relatifs, dateModified = dernière révision) — ne jamais éditer la note à la main |
| État de Kora (page Choragos & Kora, bloc « Relevé du … ») | `npm run etat:export` dans `../choragos` écrit `src/_data/koraEtat.json` — des COMPTES lus dans l'appli, jamais un chiffre tapé ; commiter le JSON ; `npm run etat:fraicheur` dit son âge |

### Avant chaque push

1. `npm run build` — verifier que le build passe sans erreur
2. Pas de secrets, cles API, chemins locaux
3. Meta tags coherents (verifier le frontmatter)
4. CNAME present dans `src/`
