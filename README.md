# Site Florent Klimacek

Site de recherche sur les interactions humain-IA : articles, analyses et le projet KAIROS.

**URL** : https://mecanique-invisible.com

## Stack

- **SSG** : [Eleventy (11ty)](https://www.11ty.dev/) v3.x avec templates Nunjucks
- **Deploiement** : GitHub Actions → GitHub Pages
- **CSS/JS** : vanilla, pas de framework

## Commandes

```bash
npm install          # Installer les dependances
npm run build        # Construire le site dans _site/
npm run serve        # Serveur local avec hot reload (localhost:8080)
```

## Structure

```
site-de-recherche/
├── src/                          # Source 11ty
│   ├── _includes/
│   │   ├── layouts/              # base.njk, page.njk, article.njk
│   │   └── partials/             # head-meta, site-header, site-footer, article-nav
│   ├── _data/site.json           # Metadonnees globales
│   ├── articles/                 # 11 articles (.md avec frontmatter YAML)
│   ├── css/                      # base.css, article.css, kairos.css
│   ├── js/site.js                # Theme toggle, nav, scroll, progress bar
│   ├── index.njk                 # Accueil (cartes auto-generees)
│   ├── about.njk, contact.njk, 404.njk
│   ├── feed.njk, sitemap.njk    # RSS et sitemap auto-generes
│   ├── presentation_kairos.html  # Presentation KAIROS (passthrough)
│   └── demo/                     # App demo KAIROS (passthrough)
│
├── eleventy.config.js            # Config 11ty
├── package.json
├── .github/workflows/deploy.yml  # CI/CD
└── CLAUDE.md                     # Instructions pour Claude Code
```

## Articles

| Article | Description | Lecture |
|---------|-------------|---------|
| **La mecanique invisible** | Document fondateur — illusions cognitives, fenetre de convergence | ~45 min |
| **La Politesse Algorithmique** | Comment les IA modelent le langage critique du capitalisme | ~4 min |
| **La Pensee en Faisceau** | Convergence entre cognition humaine et IA | ~4 min |
| **La neutralite comme illusion** | Mecanismes creant l'impression d'ouverture du systeme | ~3 min |
| **Questiologie et LLM** | Postures questiologiques et reponses Claude vs ChatGPT | ~3 min |
| **Parler depuis l'apres** | Dialogue philosophique sur les limites du langage | ~5 min |
| **Genese de KAIROS** | De l'impossibilite theorique a la construction concrete | ~6 min |
| **Le Vibe Coding sous le Microscope** | Audit de 1 000 interactions vibe coding | ~12 min |
| **L'IA est partout. Sauf dans les mains des gens.** | Adoption reelle de l'IA vs discours | ~10 min |
| **La friction productive** | Deskilling par l'IA et cout cognitif | ~8 min |
| **La mort du clic** | Cannibalisation du contenu web par l'IA | ~8 min |

## Ajouter un article

1. Creer `src/articles/mon-article.md` avec frontmatter YAML (copier un existant)
2. `npm run build` — index, feed, sitemap et nav prev/next se mettent a jour automatiquement

## Deploiement

Chaque push sur `main` declenche le workflow GitHub Actions :
1. `npm ci` + `npm run build`
2. Deploy `_site/` sur GitHub Pages

Configuration GitHub Pages : **Settings > Pages > Source > GitHub Actions**

---

Florent Klimacek — 2026
