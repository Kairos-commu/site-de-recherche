# CLAUDE.md — site-de-recherche

Site statique **Eleventy v3 (Nunjucks)** : articles de recherche sur les interactions humain-IA,
présentation de KAIROS, état de Kora. Public sur https://mecanique-invisible.com (`src/CNAME` ;
l'alias kairos-commu.github.io/site-de-recherche redirige).

## Build, déploiement

```bash
npm run build    # _site/ (gitignored)
npm run serve    # http://localhost:8080 — jamais celui de Florent : instance isolée, autre port
npm test         # build + verifier-pages-produit.mjs (aucun mode non public mentionné)
```

- **Chaque push sur `main` déploie en production** (`.github/workflows/deploy.yml`).
- Source `src/`, config `eleventy.config.js` (passthrough, ignores, filtres, collection).
- Règles chargées à la demande : `.claude/rules/articles.md` (articles), `.claude/rules/kairos-produit.md`
  (faits KAIROS, téléchargement, présentation, `deploy-kairos.sh`).

## Comment 11ty fonctionne ici

- Chaînage par `layout:` en front matter (`article.md → article.njk → base.njk`), tout passe par
  `{{ content | safe }}` : les `{% block %}` Nunjucks ne marchent PAS avec ce système.
- `page.njk` = header + main + footer ; `article.njk` = en-tête, sommaire, marge de Kora, prev/next.
- Collection `articles` : triée par `datePublished` puis `order` ; `src/articles/articles.json`
  pose le layout et le tag. Accueil, « Lire », feed, sitemap et prev/next en dérivent.
- Méta (OG, Twitter, JSON-LD) générées par les layouts depuis le front matter
  (`partials/head-meta.njk`, `base.njk`).

## Carnet (refonte du 26/10, par-dessus l'Observatoire)

- `body.carnet` sur toutes les pages (base.njk) ; `css/carnet.css` après `observatoire.css` : grille
  de relevé, en-têtes `.kr-entete`, observations `.cn-obs`, grands chiffres, zones aveugles.
- `js/kora-scene.js` (chargé par base.njk) : Kora en `figure[data-kr-kora]`, peau puis structure
  faite de son code (`pre.kr-matiere` = lignes RÉELLES de Choragos, commit cité). Variantes :
  `--grande` (accueil), `--moyenne` (État), `--marge` (« Lire » : reste à l'écran, l'étincelle en part).
  La peau passe par `js/kora-orbe-gpu.js` (WebGPU, chargé à la demande), sinon canvas 2D.
- L'étincelle (`figure[data-compagne]` dans base.njk) écrit les `.kr-note`, seulement là où Kora
  parle déjà (seuils, marge d'article, notes de l'accueil/État) — jamais de note de Kora inventée.
- Sans JS ou en mouvement réduit : notes affichées, Kora fixe. Humeur d'une section : `data-humeur`.

## Observatoire (refonte du 03/10)

- `css/observatoire.css` sur toutes les pages après `base.css` ; `article.css` porte l'article.
  La petite Kora du header et des articles : `canvas[data-orb]` dessiné par `js/repere.js`
  (options en `data-*`, `KoraOrb.setMood`).
- **Aucun style inline calculé** : largeurs des barres → `/css/etat-barres.css`
  (`src/etat-barres-css.njk`, depuis `koraEtat.json`).
- **Front matter `orbit`** sur chaque article : `0` thèse, `1` outils et terrain, `2` analyses
  (`_data/orbites.json`). Sans `orbit`, un article n'apparaît pas dans les filtres de « Lire ».
- Une page refondue place son seuil elle-même : `seuilEnPage: true` (sinon `page.njk` le rend).

## Données de Kora — aucun nombre tapé

- `npm run kora:sync` copie depuis `~/kairos/kora` COMMITÉ (`git show HEAD:`) `state.json` →
  `koraEtat.json`, `spec/tools.json` → `koraTools.json`, ce qui est collé dans `GUIDE.md` →
  `koraGuide.json` (jamais `addenda/*.md`).
- Relevé d'état : `npm run etat:export` dans `../choragos` écrit `src/_data/koraEtat.json` (des
  COMPTES lus dans l'appli) ; commiter le JSON ; `npm run etat:fraicheur` dit son âge.
  `research.nothingEmerged` compte des **lectures**, pas des sujets.
- Guide « Building a local agent you can trust » (Notes) : source `~/kairos/kora/GUIDE.md` ;
  `npm run guide:sync` réécrit la note — ne jamais l'éditer à la main.
- Captures de Choragos : `_data/capturesKora.json` (`ou` : accueil | etat) ;
  `npm run captures:fraicheur`.
- **Comptes attestés** : `.atteste` (pointillé cyan) seulement sur un nombre lu dans les journaux
  ou `koraEtat` ; `attestes: true` en front matter fait dire la règle par la marge.

## Conventions

- **Pas de CSS inline, pas de JS inline** (sauf l'anti-FOUC du thème dans `base.njk`).
- Thème : `[data-theme]` sur `<html>`, `localStorage.theme`, `prefers-color-scheme` par défaut.
- Contenu des articles en HTML brut dans les `.md`.
- Coquilles et faits : un titre se change dans le front matter, un domaine dans
  `_data/site.json` + `src/CNAME`.

## Vigilance — site en production

### Sécurité

- Jamais de secrets ni de chemins locaux dans le code.
- Liens externes en `https://` ; `target="_blank"` toujours avec `rel="noopener"`.
- CDN avec `integrity` + `crossorigin="anonymous"`.
- Pas de `eval()`, de `innerHTML` avec des données utilisateur, de `document.write()` ;
  `postMessage` : valider `event.origin`.

### Confidentialité et IA (26/09)

- **Aucun cookie, aucune mesure d'audience, aucun script tiers** : polices auto-hébergées
  (`src/fonts/` + `css/fonts.css`). Seuls tiers au chargement : badge Zenodo, vidéo GitHub de
  `download.njk`. Tout tiers ajouté change DANS LE MÊME COMMIT la CSP de `base.njk` et
  `mentions-legales.njk` (qui les énumère).
- **Illustration générée par IA** : `heroImageAlt` commence par « Illustration générée par IA »
  et `heroImageCredit` nomme l'outil. Vérifier une image :
  `strings img | grep -i "trainedAlgorithmicMedia\|c2pa"`.

### SEO

- `og:title` = `<title>` = JSON-LD `headline` ; `og:description` 120-160 caractères ;
  `og:url` = URL canonique complète ; `og:image` depuis `heroImage`, sinon `site.ogImage`.

### Avant chaque push

1. `npm test` passe.
2. Pas de secrets, de clés API, de chemins locaux.
3. Méta cohérentes (front matter).
4. `src/CNAME` présent.
