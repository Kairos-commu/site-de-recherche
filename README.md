# Site Florent Klimacek

Site regroupant la recherche sur les interactions humain-IA : articles, analyses et le projet KAIROS.

## Structure des fichiers

```
Site internet/
├── index.html                          # Page d'accueil
├── about.html                          # Page À propos
├── styles.css                          # Styles CSS partagés (page d'accueil)
├── article-styles.css                  # Styles CSS partagés (articles)
├── presentation_kairos.html            # Présentation du projet KAIROS
├── favicon.svg                         # Favicon SVG du site
├── feed.xml                            # Flux RSS des articles
├── sitemap.xml                         # Sitemap pour les moteurs de recherche
├── robots.txt                          # Instructions pour les crawlers
│
├── Articles/                           # PDFs sources
│   ├── La_Politesse_Algorithmique.pdf
│   ├── neutralite_illusion_permission.pdf
│   ├── La_Pensee_en_Faisceau_COMPLET.pdf
│   ├── Questiologie_LLM.pdf
│   └── Parler_depuis_lapres.pdf
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
- Toggle jour/nuit disponible sur toutes les pages
- Persistance via localStorage
- Détection automatique de la préférence système (`prefers-color-scheme`)
- Transition fluide de 0.3s

### Navigation
- Fil d'Ariane (breadcrumb) sur tous les articles
- Navigation précédent/suivant entre articles
- Barre de progression de lecture
- Menu latéral avec scroll actif

### SEO & Partage
- Balises Open Graph et Twitter Card
- Sitemap XML pour l'indexation
- robots.txt configuré
- Flux RSS pour la syndication

## Variables CSS

### Mode clair (défaut)
```css
--bg-page: #e7e5e4;
--bg-card: #ffffff;
--text-primary: #292524;
--text-secondary: #57534e;
--accent: #d97706;
```

### Mode sombre
```css
--bg-page: #1c1917;
--bg-card: #292524;
--text-primary: #fafaf9;
--text-secondary: #d6d3d1;
--accent: #d97706;
```

## Pour ajouter un nouvel article

1. Créer le fichier HTML à la racine (ex: `mon-article.html`)
2. Utiliser `pensee-en-faisceau.html` comme template de référence
3. Ajouter une carte dans `index.html` section `#articles`
4. Mettre à jour la navigation prev/next des articles adjacents
5. Ajouter l'entrée dans `feed.xml` et `sitemap.xml`

### Structure type d'un article

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titre — Florent Klimacek</title>
  <meta name="description" content="Description de l'article">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="Titre">
  <!-- ... -->

  <link rel="stylesheet" href="article-styles.css">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
</head>
<body>
  <!-- Site header avec toggle thème -->
  <div class="site-header-article">
    <a href="index.html" class="site-header-article__back">← Retour</a>
    <span class="site-header-article__title">Titre</span>
    <button class="theme-toggle-article" id="themeToggle">...</button>
  </div>

  <!-- Breadcrumb -->
  <nav class="breadcrumb">...</nav>

  <!-- Contenu -->
  <main>...</main>

  <!-- Navigation articles -->
  <nav class="article-nav">...</nav>

  <!-- Script thème -->
  <script>
    const savedTheme = localStorage.getItem('theme');
    // ...
  </script>
</body>
</html>
```

## Classes CSS disponibles

### Layout (styles.css)
- `.container` — Conteneur max 1200px
- `.container--narrow` — Conteneur max 720px
- `.container--wide` — Conteneur max 1400px

### Composants communs
- `.card` — Carte de base
- `.card--featured` — Carte mise en avant (2 colonnes)
- `.card--dark` — Carte fond sombre
- `.btn` / `.btn--primary` / `.btn--secondary` — Boutons
- `.tag` — Badge/étiquette
- `.section` / `.section--dark` — Sections de page
- `.theme-toggle` — Bouton toggle thème (accueil)
- `.theme-toggle-article` — Bouton toggle thème (articles)

### Articles (article-styles.css)
- `.site-header-article` — Barre de navigation fixe
- `.breadcrumb` — Fil d'Ariane
- `.article-nav` — Navigation prev/next
- `.concept` — Encadré concept
- `.key-insight` — Citation mise en avant
- `.model-card` — Carte modèle IA
- `.dialogue` — Style dialogue

## Hébergement GitHub Pages

1. Pusher le contenu vers le repo GitHub
2. Settings > Pages > Source: branche `main`, dossier racine
3. Le site sera accessible à `https://kairos-commu.github.io/site-de-recherche/`

## Historique des modifications

### Phase 6 — Contenu additionnel (02/02/2026)
- Page "À propos" (`about.html`)
- Flux RSS (`feed.xml`)
- Favicon SVG (`favicon.svg`)
- Liens favicon et RSS sur toutes les pages

### Phase 5 — Mode sombre (02/02/2026)
- Variables CSS dark mode dans `styles.css` et `article-styles.css`
- Toggle jour/nuit sur page d'accueil et tous les articles
- Persistance localStorage + détection `prefers-color-scheme`
- Transition fluide sur le changement de thème

### Phase 4 — Navigation améliorée (02/02/2026)
- Fil d'Ariane (breadcrumb) sur tous les articles
- Navigation précédent/suivant entre articles
- Classes `.breadcrumb` et `.article-nav`

### Phase 3 — Factorisation CSS (02/02/2026)
- Création de `article-styles.css` pour les styles partagés des articles
- Remplacement des styles inline dans les 6 articles

### Phase 2 — SEO & Partage social (02/02/2026)
- Balises Open Graph complètes
- Twitter Card sur toutes les pages
- `sitemap.xml` et `robots.txt`

### Phase 1 — Corrections initiales (02/02/2026)
- Correction des chemins de fichiers
- Mise à jour des dates

---

Florent Klimacek — 2026
