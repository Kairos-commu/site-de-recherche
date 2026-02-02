# Site Florent Klimacek

Structure du site regroupant la recherche sur les interactions humain-IA.

## Structure des fichiers

```
site/
├── index.html              # Page d'accueil principale
├── assets/
│   └── styles.css          # Styles CSS partagés
├── articles/
│   └── mecanique-invisible.html  # Document "La mécanique invisible"
└── kairos/
    └── index.html          # Page de présentation KAIROS
```

## Pour ajouter un nouvel article

1. Créer le fichier HTML dans `articles/`
2. Utiliser la structure de base suivante :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titre — Florent Klimacek</title>
  <link rel="stylesheet" href="../assets/styles.css">
  <!-- Ajouter les fonts Google si nécessaire -->
</head>
<body>
  <!-- Contenu -->
</body>
</html>
```

3. Ajouter un lien sur la page d'accueil (`index.html`) dans la section `#articles`

## Classes CSS disponibles

### Layout
- `.container` - Conteneur max 1200px
- `.container--narrow` - Conteneur max 720px
- `.container--wide` - Conteneur max 1400px

### Composants
- `.card` - Carte de base
- `.card--featured` - Carte mise en avant (2 colonnes)
- `.card--dark` - Carte fond sombre
- `.btn` - Bouton de base
- `.btn--primary` - Bouton accent
- `.btn--secondary` - Bouton outline
- `.tag` - Badge/étiquette
- `.section` - Section de page
- `.section--dark` - Section fond sombre

### Typographie
- `.hero__title` - Titre principal
- `.section__title` - Titre de section
- `.section__label` - Label au-dessus du titre (mono, uppercase)

## Hébergement sur GitHub Pages

1. Créer un repo sur GitHub
2. Pusher le contenu du dossier `site/`
3. Activer GitHub Pages dans Settings > Pages
4. Sélectionner la branche `main` et le dossier racine

## Couleurs principales

- Accent : `#d97706` (ambre)
- Fond page : `#e7e5e4` (stone-200)
- Fond sombre : `#1c1917` (stone-900)
- Texte : `#292524` (stone-800)

---

Florent Klimacek — 2025
