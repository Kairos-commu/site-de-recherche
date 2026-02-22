# CLAUDE.md — site-de-recherche

Site statique GitHub Pages : articles de recherche sur les interactions humain-IA + présentation du projet KAIROS.

## URL

- **Production** : https://mecanique-invisible.com (domaine custom, CNAME → GitHub Pages)
- **Alias GitHub** : https://kairos-commu.github.io/site-de-recherche/ (redirige vers le domaine custom)
- **CNAME** : fichier `CNAME` à la racine contenant `mecanique-invisible.com`

## Architecture

Site statique pur — pas de build tool, pas de framework, pas de SSG. HTML + CSS + JS servis directement par GitHub Pages.

```
site-de-recherche/
├── index.html                          # Page d'accueil (liste des articles)
├── about.html                          # Page À propos
├── contact.html                        # Page Contact
├── 404.html                            # Page 404 GitHub Pages
├── presentation_kairos.html            # Présentation interactive KAIROS
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
├── CNAME                               # Domaine custom (mecanique-invisible.com)
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

## Responsive / Breakpoints

Approche mobile-first progressive — les breakpoints sont organisés du plus large au plus étroit :

| Breakpoint | Cible | Fichiers |
|---|---|---|
| `900px` | Tablettes — grids passent en 1 colonne, sidebar article masquée | `base.css`, `article.css`, `kairos.css` |
| `768px` | Petites tablettes — header mobile | `base.css`, `article.css`, `kairos.css` |
| `600px` | Phablets — O₂ formula adapté | `kairos.css` |
| `500px` | Petits écrans — use cases et features grid 1 colonne | `kairos.css` |
| `480px` | Smartphones — paddings réduits, typo ajustée, cards 1 col, touch optimisé | `base.css`, `article.css`, `kairos.css` |

Conventions responsive :
- **`touch-action: manipulation`** — appliqué globalement sur `a, button, [role="button"], input, select, textarea` (élimine le délai 300ms sur mobile)
- **Marges fluides** — utiliser `max(0.5rem, 3vw)` plutôt que des valeurs fixes pour les marges de dialogue
- **`min-height: auto`** — les sections passent en hauteur automatique sous 480px (pas de `100vh` sur mobile)
- **Grids** — `grid-template-columns: 1fr` sur les petits écrans, pas de `minmax()` trop large

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
- **Pas de JS inline** — tout dans js/site.js (sauf anti-FOUC et presentation_kairos qui a son JS inline)
- **Meta tags obligatoires** : description, og:title, og:description, og:type, twitter:card, og:image, twitter:image
- **Anti-FOUC** : `<script>` inline dans `<head>` avant `<title>` (lit localStorage et applique data-theme)
- **Favicon** : `<link rel="icon" type="image/svg+xml" href="favicon.svg">`
- **Footer site** : `Florent Klimacek — 2026` + liens Accueil, Articles, À propos, Contact, RSS (identique sur toutes les pages non-article)
- **Footer article** : `Florent Klimacek — 2026` + lien retour accueil (identique sur tous les articles)
- **Schema.org JSON-LD** : `<script type="application/ld+json">` avant `</head>` — BlogPosting (articles), WebSite (index), Person (about)

## Vigilance — site en production

Ce site est public sur `mecanique-invisible.com`. Chaque modification est immédiatement visible. Respecter scrupuleusement les règles suivantes.

### Sécurité

- **Jamais de secrets dans le code** — pas de clés API, tokens, mots de passe, emails privés dans les fichiers commités. Vérifier chaque diff avant commit.
- **Pas de `http://`** — tous les liens externes doivent être en `https://`. Les liens internes sont relatifs (pas de protocole).
- **CSP obligatoire** — `presentation_kairos.html` a sa propre CSP `<meta>`. Ne pas ajouter de source externe sans mettre à jour la CSP.
- **SRI obligatoire** — tout `<script>` ou `<link>` chargé depuis un CDN doit avoir un attribut `integrity` (hash sha384) et `crossorigin="anonymous"`.
- **Pas de `target="_blank"` sans `rel="noopener"`** — prévient le tab-nabbing.
- **Pas de `eval()`, `innerHTML` avec données utilisateur, ou `document.write()`** — prévient XSS.
- **Source maps** — jamais déployées (`.gitignore` les exclut). Vérifier après chaque ajout de build Vite.
- **postMessage** — toujours valider `event.origin` côté récepteur, toujours spécifier l'origine cible côté émetteur (jamais `'*'`).

### URLs et liens

- **Domaine canonique** : `https://mecanique-invisible.com/` — utilisé dans les meta `og:url`, JSON-LD, sitemap, feed.xml.
- **Pas de liens morts** — vérifier que chaque `href` pointe vers une page existante. Tester après renommage ou suppression de page.
- **Liens relatifs en interne** — `index.html`, pas `https://mecanique-invisible.com/index.html`.
- **Liens externes en `https://`** — avec `target="_blank" rel="noopener"`.
- **Ancres** — vérifier que les `id` ciblés existent bien (`href="#articles"` → `<section id="articles">`).

### SEO et meta tags

Chaque page DOIT contenir dans `<head>` :

```html
<!-- Obligatoire -->
<title>Titre — Florent Klimacek</title>
<meta name="description" content="...">

<!-- Open Graph -->
<meta property="og:type" content="article|website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://mecanique-invisible.com/...">
<meta property="og:image" content="https://mecanique-invisible.com/og-image.jpg">
<meta property="og:site_name" content="Florent Klimacek">
<meta property="og:locale" content="fr_FR">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://mecanique-invisible.com/og-image.jpg">

<!-- Technique -->
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="alternate" type="application/rss+xml" title="Florent Klimacek — Articles" href="feed.xml">
<link rel="canonical" href="https://mecanique-invisible.com/...">
```

Vérifications :
- **`og:title`** = `<title>` = JSON-LD `headline` (cohérence stricte)
- **`og:description`** — phrase complète, 120-160 caractères, pas tronquée
- **`og:url`** — URL canonique complète avec domaine
- **`og:image`** — URL absolue, image existante (pas de 404)

### Cohérence inter-fichiers

À chaque modification, vérifier la propagation :

| Donnée modifiée | Fichiers à mettre à jour |
|---|---|
| Titre d'un article | `<title>`, `og:title`, `twitter:title`, JSON-LD `headline`, carte dans `index.html`, `feed.xml`, `sitemap.xml` |
| Nouvel article | Suivre la checklist "Pour ajouter un nouvel article" (8 étapes) |
| Suppression de page | `sitemap.xml`, `feed.xml`, nav prev/next des articles adjacents, liens depuis `index.html` |
| Changement de domaine | `CNAME`, toutes les `og:url`, JSON-LD `url`, `sitemap.xml`, `feed.xml`, `robots.txt`, CSP `frame-ancestors` |
| Mise à jour CDN | Version épinglée + nouveau hash SRI + vérifier CSP `script-src` |

### Format et qualité du code

- **Indentation** — 2 espaces en HTML/CSS/JS (pas de tabs)
- **Encodage** — UTF-8 sans BOM, fin de ligne LF
- **HTML valide** — pas de balises non fermées, attributs `alt` sur toutes les `<img>`, attributs `lang` sur `<html>`
- **CSS** — pas de `!important` sauf nécessité absolue, pas de sélecteurs trop spécifiques
- **Accessibilité** — attributs `aria-label` sur les boutons sans texte, `title` sur les liens ambigus, contraste suffisant (WCAG AA)
- **Performance** — pas de ressources bloquantes inutiles, `loading="lazy"` sur les images et iframes below-the-fold
- **Pas de console.log en production** — sauf dans les blocs iframe debug (KAIROS)

### Avant chaque push

Checklist mentale :

1. `git diff` — relire chaque ligne modifiée
2. Pas de secrets, clés API, chemins locaux (`C:\`, `D:\`, `/Users/`)
3. Liens internes valides (pas de `href="#"` placeholder)
4. Meta tags cohérents (titre, description, og, JSON-LD)
5. Sitemap et feed.xml à jour si ajout/suppression de page
6. CSS/JS : pas d'inline ajouté (sauf anti-FOUC)
7. Fichier CNAME toujours présent (GitHub Pages le supprime parfois lors de reconfiguration)

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

### Sécurité iframe KAIROS (fait)
- [x] Valider `event.origin` dans le listener postMessage du parent (presentation_kairos.html)
- [x] Remplacer `'*'` par l'origine cible spécifique dans `postMessage()`
- [x] Ajouter une CSP `<meta>` sur presentation_kairos.html
- [x] Ajouter un hash SRI sur le `<script>` marked.js (CDN) — v15.0.12 épinglée
- [x] Exclure le fichier `.map` du déploiement (source map via .gitignore + référence retirée du bundle)

### Améliorations possibles
- [ ] Lazy-loading des images (peu urgent — pas beaucoup d'images)
- [ ] Sitemap automatique (actuellement maintenu à la main)
- [x] Schema.org / JSON-LD pour les articles (fait — BlogPosting sur 6 articles, WebSite sur index, Person sur about)
