---
name: nouvel-article
description: Ajouter un nouvel article de recherche au site mecanique-invisible.com. Crée le fichier HTML, la carte index, met à jour feed.xml, sitemap.xml et la navigation prev/next.
argument-hint: "titre de l'article"
disable-model-invocation: true
---

# Ajouter un nouvel article au site

Tu vas ajouter un nouvel article au site mecanique-invisible.com en suivant **scrupuleusement** la checklist du CLAUDE.md.

## Informations à collecter

Avant de commencer, demande à l'utilisateur (via AskUserQuestion) les informations manquantes parmi :

1. **Titre** de l'article (obligatoire) — fourni via `$ARGUMENTS` si présent
2. **Nom de fichier** (sans `.html`) — proposer un slug basé sur le titre
3. **Label** pour la carte index — ex: "Article", "Récit", "Analyse", "Genèse", "Étude comparative", "Dialogue"
4. **Description** (120-160 caractères) — pour les meta tags
5. **Date de publication** — par défaut aujourd'hui
6. **Temps de lecture estimé** — ex: "5 min"
7. **Contenu** — le texte de l'article (sections, titres, corps)

Si l'utilisateur a déjà fourni certaines informations dans la conversation, ne les redemande pas.

## Procédure (8 étapes)

### Étape 1 — Créer le fichier HTML

Copier `pensee-en-faisceau.html` comme template. Remplacer :

- `<title>` : `{Titre} — Florent Klimacek`
- `<meta name="description">` : la description fournie
- Tous les **Open Graph** (`og:title`, `og:description`, `og:url`, `og:type="article"`)
- Tous les **Twitter Card** (`twitter:title`, `twitter:description`)
- `<link rel="canonical">` : `https://mecanique-invisible.com/{slug}.html`
- **JSON-LD BlogPosting** : `headline`, `description`, `datePublished`, `dateModified`, `url`, `mainEntityOfPage`
- **Header article** : `site-header-article__title`
- **Breadcrumb** : dernier élément `.current`
- **Hero** : `<h1>`, `hero-label`, `hero-intro`
- **Sidebar nav** : sections numérotées selon le contenu
- **Contenu** : remplacer toutes les sections par le contenu de l'article
- **Nav prev/next** : le "prev" pointe vers le dernier article existant

CSS chargés : `css/base.css` + `css/article.css` (pas de styles inline).
JS : `js/site.js` en fin de body (pas de scripts inline).

### Étape 2 — Identifier le dernier article

Lire les fichiers articles existants pour trouver celui qui a `article-nav__empty` ou pas de lien "next" dans sa nav. C'est l'article qui précèdera le nouveau dans la chaîne.

Pour trouver le dernier article :
```
grep -l "article-nav__empty" *.html
```

### Étape 3 — Mettre à jour la nav prev/next de l'article précédent

Dans le dernier article trouvé à l'étape 2, remplacer le bloc `<div class="article-nav__empty"></div>` par un lien vers le nouvel article :

```html
<a href="{slug}.html" class="article-nav__link article-nav__link--next">
  <span class="article-nav__label">Article suivant →</span>
  <span class="article-nav__title">{Titre}</span>
</a>
```

### Étape 4 — Ajouter la carte dans index.html

Dans `index.html`, section `#articles`, à la fin du `<div class="card-grid">` (avant la balise `</div>` fermante du grid), ajouter :

```html
<article class="card">
  <p class="card__label">{Label}</p>
  <h3 class="card__title">{Titre}</h3>
  <p class="card__desc">{Description}</p>
  <p class="card__date">{Mois Année} · {temps de lecture}</p>
  <a href="{slug}.html" class="card__link">Lire l'article</a>
</article>
```

Le mois doit être en français (Janvier, Février, Mars, etc.).

### Étape 5 — Ajouter dans feed.xml

Ajouter un nouvel `<item>` **en première position** (juste après `<lastBuildDate>...</lastBuildDate>`) :

```xml
<item>
  <title>{Titre}</title>
  <description>{Description}</description>
  <link>https://mecanique-invisible.com/{slug}.html</link>
  <guid isPermaLink="true">https://mecanique-invisible.com/{slug}.html</guid>
  <pubDate>{RFC 2822 date}</pubDate>
  <category>{Catégorie}</category>
</item>
```

Mettre aussi à jour `<lastBuildDate>` avec la date du jour.

Format RFC 2822 : `Wed, 18 Feb 2026 10:00:00 +0100`

### Étape 6 — Ajouter dans sitemap.xml

Ajouter une nouvelle `<url>` (après les articles existants, avant `presentation_kairos.html`) :

```xml
<url>
  <loc>https://mecanique-invisible.com/{slug}.html</loc>
  <lastmod>{YYYY-MM-DD}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### Étape 7 — Vérifications automatiques

Après toutes les modifications, vérifier :

1. **Cohérence des titres** : `<title>` = `og:title` = JSON-LD `headline` (le `<title>` a le suffixe ` — Florent Klimacek`, les autres non)
2. **og:description** : 120-160 caractères, phrase complète
3. **Liens internes** : tous les `href` pointent vers des fichiers existants
4. **Pas de secrets** : pas de chemins locaux (`C:\`, `D:\`), pas de clés API
5. **Pas de CSS/JS inline** : seulement l'anti-FOUC dans `<head>`
6. **Navigation prev/next** : le nouvel article a un "prev", l'article précédent a maintenant un "next"
7. **Indentation** : 2 espaces partout

### Étape 8 — Résumé

Afficher un récapitulatif à l'utilisateur :

```
✅ Article créé : {slug}.html
✅ Carte ajoutée dans index.html
✅ Navigation mise à jour : {article-précédent}.html ↔ {slug}.html
✅ feed.xml mis à jour
✅ sitemap.xml mis à jour

Fichiers modifiés :
- {slug}.html (nouveau)
- index.html
- {article-précédent}.html
- feed.xml
- sitemap.xml
```

## Règles strictes

- **Jamais de `http://`** — tous les liens externes en `https://`
- **Jamais de `target="_blank"` sans `rel="noopener"`**
- **Encodage UTF-8**, indentation 2 espaces, fin de ligne LF
- **og:image** : toujours `https://mecanique-invisible.com/og-image.jpg`
- **og:site_name** : toujours `Florent Klimacek`
- **og:locale** : toujours `fr_FR`
- Le fichier DOIT contenir le script anti-FOUC dans `<head>` avant `<title>`
- Le fichier DOIT contenir la balise `google-site-verification`
