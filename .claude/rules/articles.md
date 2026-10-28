---
paths:
  - "src/articles/**"
  - "src/_includes/layouts/article.njk"
  - "src/_includes/partials/article-nav.njk"
---

# Articles

- Nouvel article : créer `src/articles/<slug>.md` en copiant le front matter d'un article récent
  (`ce-quon-tente-ici.md`), puis `npm run build` : accueil, « Lire », feed, sitemap et prev/next
  suivent seuls. Supprimer un article = supprimer son `.md`.
- Champs à ne pas oublier : `orbit` (0 thèse, 1 outils et terrain, 2 analyses), `datePublished`
  + `order` (départage les articles du même jour), `permalink`/`canonical`/`ogUrl` cohérents,
  `sections` (ids = ceux des `<section>` du corps), `card.readingTime`.
- Titre : `ogTitle` et `headline` identiques, `pageTitle` = le même + « — Florent Klimacek » ;
  `ogDescription` 120-160 caractères.
- `dateModified` : à changer pour un changement de fond (fait, passage, capture), pas pour une
  passe de forme. La marge de Kora l'affiche (« l'a repris le … »).
- Corps en HTML brut, rendu SANS Markdown (`templateEngineOverride: njk` dans `articles.json`) :
  pas de syntaxe Markdown. Classes du site : `.lead`, `.key-insight`, `.chapter-divider`, `.concept`,
  `.sources-section`.
- Image générée par IA : `heroImageAlt` commence par « Illustration générée par IA »,
  `heroImageCredit` nomme l'outil. WebP dans `src/images/`.
- Une phrase de Kora dans la marge (`art-marge`) est une `.kr-note` : l'étincelle l'écrit.
