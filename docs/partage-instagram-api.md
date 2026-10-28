# Publication directe sur Instagram — piste en attente (28/10/2026)

Demande d'Holotheia : un bouton « Publier sur Instagram » qui envoie le visuel
de l'article directement sur le compte connecté, par l'API officielle de Meta.
**En attente** : ce qui est en ligne (commit 011cbc0, `partials/partage.njk`,
`js/partage.js`) couvre le reste de la demande : copier le lien, story à
télécharger puis sticker « Lien » ajouté à la main, carte à intégrer, méta.

## Ce que ça demanderait

1. **Un backend.** La connexion (Business Login for Instagram) exige la clé
   secrète de l'app et la garde de jetons d'accès : impossible dans le site
   statique (GitHub Pages). Piste : un petit Worker à côté (connexion, jetons,
   appel `/<IG_ID>/media` puis `/media_publish`, lecture du permalink).
   Conséquences sur le site : cookie de session, CSP élargie (`connect-src`,
   redirection Instagram), mentions légales à reprendre (règle du CLAUDE.md :
   tout tiers change la CSP et les mentions dans le même commit).
2. **Comptes professionnels seulement** (Business ou Creator) : un compte
   personnel ne peut pas publier par l'API.
3. **Niveau d'accès selon qui publie.**
   - Florent, et quelques comptes ajoutés comme testeurs de l'app (Holotheia) :
     accès standard, pas de validation Meta.
   - N'importe quel visiteur : accès avancé, donc App Review (démonstration
     vidéo, politique de confidentialité, URL de suppression des données) et
     vérification d'entreprise. Des semaines, issue non garantie.
4. **Image hébergée.** L'API va chercher l'image à une URL publique (JPEG, à
   confirmer). Le visuel dessiné en canvas dans le navigateur ne suffit pas :
   générer un visuel par article au build.
5. **Pas de lien cliquable possible.** Lien dans la légende d'un post : non
   cliquable. Story par l'API : pas de sticker « Lien » (aucune entrée du
   changelog Meta ne l'ajoute ; sources tierces concordantes), légende
   ignorée selon ces mêmes sources. Le seul accès direct à l'article reste le
   sticker posé à la main : la publication automatique serait une option en
   plus, jamais un remplacement.

## Pour reprendre

- Trancher d'abord : publication pour Florent (et testeurs) ou pour tous.
- Éléments Meta à fournir alors : App ID, App Secret (côté serveur seulement),
  URI de redirection, compte Instagram professionnel, rôle testeur pour chaque
  compte hors App Review.
- Revérifier la doc Meta à la reprise (permissions `instagram_business_*`,
  sticker « Lien », formats d'image) : rien n'a été testé contre l'API.

## Sources (consultées le 28/10/2026)

- https://developers.facebook.com/docs/instagram-platform/content-publishing
- https://developers.facebook.com/documentation/instagram-platform/overview
- https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/business-login
- https://developers.secure.facebook.com/documentation/instagram-platform/changelog
- https://storrito.com/resources/instagram-story-api/
- https://agorapulse.com/video-tutorials/scheduling-instagram-link-stickers
