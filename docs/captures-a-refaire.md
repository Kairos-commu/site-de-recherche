# Captures Choragos à refaire — brief pour une session dans `~/kairos/choragos`

Inventaire fait le 26/10/2026 depuis `site-de-recherche` (grep des `src` d'images dans `src/`).
Référence chiffrée de l'écart : `src/_data/koraEtat.json` du 25/10 : 33 outils, 54 déclencheurs,
19 enchaînements, 27 interventions spontanées, R 27 · Q 110 · J 34, 9 manques + 1 prévu,
9 orbes + 2 lunes, 31 notes de mémoire, modèle `kora-ft-12b-v3b-s075`.

## Consignes de prise

- Format : WebP, largeur ~1600 px, nom `choragos-2026-MM-JJ-<sujet>.webp` (date du jour de prise).
- Déposer dans `~/kairos/site-de-recherche/src/images/` ; **ne pas** supprimer les anciennes
  (le site les retire au moment où il bascule).
- Aucune donnée personnelle visible : clés API, chemins `/home/...`, noms de fichiers privés,
  contenu de mémoire intime, notifications système.
- Pour chaque capture, noter dans ce fichier (colonne « Fait ») : le nom du fichier et ce qui est
  visible (comptes affichés, tenue, mode), pour réécrire alt et légende sans réouvrir l'image.
- Si un écran n'existe plus ou a été renommé dans l'appli, le dire ici plutôt que d'en capturer
  un autre à la place.

## A. Page d'accueil et page « État de Kora » (`src/_data/capturesKora.json`)

Remplacer l'entrée JSON entière (src, alt, legende, date). `ou` : où elle s'affiche.

| # | Sujet à capturer | Fichier actuel (date) | `ou` | Pourquoi | Fait |
|---|---|---|---|---|---|
| A1 | Kora seule au lancement, orbe au centre (large) | `choragos-2026-10-03-kora-seule` (03/10) | accueil | rendu de l'orbe à jour | |
| A2 | « Kora, entretien » : machine en hologramme + panneau des points à traiter (large) | `choragos-2026-10-03-entretien` (03/10) | accueil | idem | |
| A3 | Mode recherche (orbe violette, capsule « Recherche ») | `choragos-2026-10-03-mode-recherche` (03/10) | accueil | idem | |
| A4 | Tenue « anneaux » | `choragos-2026-10-03-tenue-anneaux` (03/10) | accueil | idem ; sert aussi d'image d'en-tête de l'article Choragos & Kora | |
| A5 | Tenue « électrique » | `choragos-2026-10-03-tenue-electrique` (03/10) | accueil | idem | |
| A6 | Recherche approfondie, « Rien n'émerge » au-dessus de Kora | `choragos-tente-rien-n-emerge` (15/09) | accueil | six semaines | |
| A7 | Cristaux de mémoire en gros plan | `choragos-tente-cristaux` (15/09) | accueil | 17 notes alors, 31 aujourd'hui | |
| A8 | Réglages d'une installation neuve : clés vides + plafond de dépense | `choragos-2026-10-03-cles-vides` (03/10) | etat | vérifier que les champs (8 clés, 1 $ / 60 crédits Tavily) n'ont pas changé | |
| A9 | Tableau de bord de consommation (local / cloud / coût / corpus) | `choragos-tente-tableau-de-bord` (15/09) | etat | corpus 506 échanges aujourd'hui | |
| A10 | Pense-bête des capacités, avec le compte par sommet en haut à droite | `choragos-tente-pense-bete` (15/09) | etat | **périmé** : l'alt dit 21 outils / R 9 · Q 52 · J 16 | |

## B. Article « Choragos & Kora » (`src/articles/choragos-kora.md`)

| # | Sujet à capturer | Fichier actuel | Ligne | Pourquoi | Fait |
|---|---|---|---|---|---|
| B1 | Constellation sur fond étoilé par défaut, Kora au centre, agents en orbite | `choragos-constellation` (08/09) | 128 | légende dit six agents ; 9 orbes + 2 lunes aujourd'hui | |
| B2 | Conversation : question machine, outil système écrit sous la réponse, puis demande d'ouverture de dossier | `choragos-conversation` (08/09) | 194 | UI de 08/09 | |
| B3 | Bulle de confirmation ambre, action refusée, Kora qui le dit | `choragos-confirmation` (08/09) | 215 | idem | |
| B4 | Capsule de commande en écoute avec vumètre | `choragos-ecoute` (08/09) | 254 | idem | |
| B5 | Réglages : entraînement du mot d'éveil, vocabulaire de dictée, plafond de dépense | `choragos-mot-eveil` (08/09) | 271 | idem (1401 enregistrements aujourd'hui) | |
| B6 | Panneau de surveillance (watchdog) : VRAM, modèle chargé, outils appelés, refus, avertissements | `choragos-watchdog` (08/09) | 382 | idem ; modèle a changé | |
| B7 | Pense-bête : une capacité avec phrase d'exemple, chemins d'accès, pastille « vu marcher » / « jamais revérifié » | `choragos-pense-bete` (08/09) | 412 | 33 outils aujourd'hui | |
| B8 | Onglet « Manques et à venir » du pense-bête | `choragos-manques` (08/09) | 487 | légende dit 17 entrées le 08/09 | |

Déjà à jour (03/10) dans cet article : en-tête (A4), clés vides (A8, l. 94), Kora seule (A1, l. 154).

## C. Article « Ce qu'on tente ici » (`src/articles/ce-quon-tente-ici.md`)

Légendes **datées** (« le 15 septembre », « Dix-sept notes ») : article de récit. Décision à
prendre côté site avant de remplacer : nouvelle capture + légende réécrite à la nouvelle date, ou
garder l'image d'époque. Capturer quand même, pour avoir le choix.

| # | Sujet à capturer | Fichier actuel | Ligne | Fait |
|---|---|---|---|---|
| C1 | Kora « nue » (image d'en-tête de l'article) | `choragos-tente-kora-nue` (15/09) | 30 | |
| C2 | Mode recherche : orbe violette, système solaire des agents déployé, HUD réduit | `choragos-tente-mode-recherche` (15/09) | 151 | |
| C3 | Kora habillée en nébuleuse à l'ouverture, avec sa phrase « Je me mets en nébuleuse. » | `choragos-tente-nebuleuse` (15/09) | 171 | |
| C4 | Onglet manques : manques vérifiés + capacités à revérifier + chantier décidé | `choragos-tente-manques` (15/09) | 284 | |

Partagées avec A : `rien-n-emerge` (A6, l. 121), `pense-bete` (A10, l. 161), `cristaux` (A7, l. 198),
`tableau-de-bord` (A9, l. 263) — une seule prise sert les deux endroits.

## Hors Choragos (pour mémoire, pas pour cette session)

- Captures KAIROS (autre appli) : `kairos-canvas.webp` (download, présentation FR/EN,
  kairos-technical-overview), `kairos-guide.png` (présentation), `kairos-hero.png` (poster vidéo
  download), `kairos-splash.webp` (about).
- `og-kora.jpg` (image de partage de l'accueil) : à refaire si l'orbe a changé d'aspect.
- Images référencées nulle part (candidates au retrait, à confirmer) : `choragos-cles-vides.webp`,
  `choragos-hero.jpg`, `choragos-kora-seule.webp`, `choragos.png`, `kora.png`,
  `kairos-canvas-construction.webp`, `pqc.webp`, `vue complète.webp`.

## Retour côté site (session suivante dans `site-de-recherche`)

1. A : réécrire les entrées de `capturesKora.json` (alt avec les comptes **visibles sur l'image**).
2. B, C : changer `src`, `alt` et la `figcaption` ; les nombres de légende doivent être ceux de la
   capture, pas de `koraEtat.json` s'ils diffèrent.
3. `npm run build`, puis contrôle visuel sur une instance isolée.

## Prise du 26/10/2026 (session Choragos) — résultat

Dossier dédié : `captures-choragos-2026-10-26/` à la racine du site (hors `src/`, rien n'est
encore publié ; à déplacer dans `src/images/` au moment de basculer). WebP 1600 px de large.
Instance isolée, copie des données de Florent sans les clés API ; vue en instance isolée seulement.
Dans toutes les captures : le bandeau du haut (icônes + « CHORAGOS · Kora prête ») et la capsule « Kora » en bas.

| # | Fichier | Ce qui est visible |
|---|---|---|
| A1, C1 | `choragos-2026-10-26-kora-seule.webp` | Kora sans tenue au centre : orbe dorée, anneaux d'orbite fins, filaments roses autour. La Kora « nue » bleue des captures de septembre n'existe plus dans ce rendu : une seule image sert A1 et C1 |
| A2 | `…-entretien.webp` | Machine en hologramme (Corsair Frame 4000, sondes réseau/CPU/RAM/GPU, « qui consomme »), panneau « Kora, entretien » à 4 points : whisper-cli planté 343 fois, 10 mises à jour, 1 jeu Steam qui dort (14 Go), mémoire à 30 entrées |
| A3 | `…-mode-recherche.webp` | Orbe violette (tenue électrique), HUD réduit, lueur violette en bordure. La pastille « Recherche » n'apparaît pas au repos |
| A4 | `…-tenue-anneaux.webp` | Tenue anneaux : grand anneau ambre et deux traînées de grain. Elle est **rangée** dans la roue de Florent et ne s'y voit plus (sortie pour la prise, dans la copie seulement) |
| A5 | `…-tenue-electrique.webp` | Tenue électrique : orbe bleue, éclairs roses et blancs |
| A6 | `…-rien-n-emerge.webp` | « RIEN N'ÉMERGE » au-dessus de Kora, deux sources : theconversation.com et clair-obscur.fandom.com. **Rejeu** dans la scène de la vraie recherche « lune » du 19/09 (juge Mistral, aucune émergence), sans nouvelle recherche web |
| A7 | `…-cristaux.webp` | Gros plan de l'orbe dorée. Les cristaux de mémoire sont **à peine visibles** dans la matière actuelle : la légende « chaque cristal rose » ne tient plus telle quelle |
| A9 | `…-tableau-de-bord-24h.webp` / `…-30j.webp` | Consommation. Sur 24 h : 0,0139 $, 220 requêtes, 217 locales / 3 cloud. Sur 30 jours : 0,5479 $, 4390 requêtes, 4141 / 249. Bloc dataset : 102 acceptées · 82 corrigées · 17 rejetées · 308 sans retour. Le compte « corpus 506 échanges » ne figure pas dans ce panneau |
| A10, B7 | `…-pense-bete.webp` | **Renommé** : le pense-bête est devenu la vue « À éprouver » (23 à éprouver · 111 éprouvées). Lignes avec pastille de sommet et boutons ✓/✗. Il n'y a plus de compte par sommet ni d'onglets |
| B2 | `…-conversation.webp` | Panneau de conversation ouvert, fil vide (« Kora écoute. »), modèle kora-ft-12b-v3b-s075. Aucun échange : le panneau de chat échouait ce soir-là dans le code en cours |
| B6 | `…-watchdog.webp` | Surveillance : kora-ft-12b-v3b-s075 en VRAM (7,8 Go), VRAM 11,7/15,9 Go, 2 requêtes résolues (outils search_corpus, set_outfit), flux d'événements |

Non faits :
- **N'existent plus**, rien capturé à leur place :
  - B1 : la constellation à 9 orbes, retirée le 14/10 ; la scène ne porte plus que Kora.
  - C2 : le système solaire des agents en mode recherche.
  - C3 : la tenue nébuleuse, retirée par Florent le 19/09.
  - B8 et C4 : les onglets « Manques et à venir » du pense-bête, remplacés le 29/09.
- **Pas pris**, faute de temps (le poste était demandé) :
  - A8 : clés vides, sur une instance neuve.
  - B3 : la bulle ambre, qui demande un vrai tour de chat.
  - B4 : l'écoute avec vumètre.
  - B5 : les réglages du mot d'éveil.
