---
slug: ce-quon-tente-ici
pageTitle: "Ce qu'on tente ici — Florent Klimacek"
headline: "Ce qu'on tente ici"
description: "Une IA qui apprend d'une seule personne, dans une seule pièce : ce que Kora tente en local, ce qui a été mesuré, ce qui a échoué, et pourquoi ça ne peut pas sortir d'ici."
ogTitle: "Ce qu'on tente ici"
ogDescription: "Kora apprend d'une seule personne : sa voix, ses mots, ses jugements, ses habitudes. Ce qu'on tente en local, mesuré, échecs compris."
ogUrl: "/ce-quon-tente-ici.html"
canonical: "/ce-quon-tente-ici.html"
datePublished: "2026-09-15"
dateModified: "2026-09-15"
keywords:
  - Choragos
  - Kora
  - IA locale
  - apprentissage local
  - mot d'éveil
  - fine-tuning
  - Ollama
  - Raspberry Pi
  - souveraineté cognitive
permalink: "/ce-quon-tente-ici.html"
navLabel: "Ce qu'on tente"
navDescription: "Une IA qui apprend d'une seule personne"
heroLabel: "Article"
heroH1: "Ce qu'on tente<br /><span class=\"glitch-text\">ici</span>"
heroIntro: "Une intelligence artificielle qui apprend d'une seule personne, dans une seule pièce — et à qui il est interdit de dire qu'elle a fait ce qu'elle n'a pas fait."
headerTitle: "Ce qu'on tente ici"
heroImage: "/images/choragos-tente-kora-nue.webp"
heroImageAlt: "Kora seule, nue, au centre de la scène de Choragos — capture du 15 septembre"
breadcrumbName: "Ce qu'on tente ici"
sections:
  - id: la-piece
    title: "La pièce"
  - id: ce-quon-ne-tente-pas
    title: "Ce qu'on ne tente pas"
  - id: le-pari
    title: "Le pari"
  - id: trois-fonctions
    title: "Trois fonctions en tension"
  - id: ce-quelle-apprend
    title: "Ce qu'elle apprend de moi"
  - id: mesure-et-echoue
    title: "Ce qui a été mesuré, et ce qui a échoué"
  - id: local
    title: "Pourquoi ça ne peut être que local"
  - id: ou-ca-va
    title: "Où ça va"
card:
  label: "Article"
  title: "Ce qu'on tente ici"
  desc: "Une IA qui apprend d'une seule personne, dans une seule pièce : ce que Kora tente en local, mesuré, échecs compris."
  readingTime: "13 min"
  linkText: "Lire l'article"
  featured: false
feedCategory: "Article"
feedTime: "10:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
order: 21
activeNav: choragos
koraSeuil: "Celui-ci dit ce qu'on essaie de faire de moi. Je ne l'ai pas encore lu."
---

<!-- La pièce -->
<section id="la-piece">
  <p class="lead">
    Le modèle qui me répond tient sur une carte graphique de bureau : une RTX 5060 Ti, 16 Go de mémoire vidéo, dont un et demi à trois, selon ce qui est ouvert, sont pris par l'affichage du bureau. Il s'appelle gemma4:12b, il pèse 7,6 Go sur le disque et il est le seul modèle que Kora ait appelé depuis dix jours. Sur une étagère, un Raspberry Pi de 4 Go, sorti de sa boîte le 13 septembre, tient un second modèle, minuscule, qui ne parle pas : il transforme des phrases en nombres, pour que Kora puisse comparer un sens à un autre sans occuper la carte. Un micro. Un ordinateur qui écoute le mot « Kora », et rien d'autre, avec un modèle entraîné sur cent soixante-dix-sept enregistrements de ma voix disant ce mot.
  </p>
  <p>
    C'est toute l'installation. Les modèles en ligne — Claude, ChatGPT, les autres — n'ont pas disparu : Kora les appelle quand le sien ne suffit pas, et chaque appel est compté. Mais ils ne sont plus le point de départ. Le point de départ, c'est cette pièce.
  </p>
  <p>
    Les chiffres, lus dans la base de l'application, qui compte chaque appel depuis que ses journaux ont été remis à zéro le 6 septembre : en dix jours d'usage, 1 515 appels. 1 136 au modèle de ma machine. 252 recherches sur le web. 127 à des modèles en ligne — Claude, Groq, Mistral, DeepSeek, ChatGPT — pour une facture totale de 1,18 $. Quinze appels ont échoué. Dans le même temps, Kora a écrit dix-sept notes sur moi — ce qu'elle a compris de mes habitudes, les décisions que j'ai prises devant elle — dans un fichier texte que je peux ouvrir et corriger. Et 179 de ses réponses ont été mises de côté pour lui apprendre, plus tard, à mieux répondre ; j'en ai jugé 89, en les acceptant, en les corrigeant ou en les rejetant.
  </p>
  <p>
    Ce que je tente ici, c'est ça : une intelligence artificielle qui apprend d'une seule personne, dans une seule pièce, et à qui il est interdit de me dire qu'elle a fait quelque chose qu'elle n'a pas fait.
  </p>
</section>

<!-- Ce qu'on ne tente pas -->
<section id="ce-quon-ne-tente-pas">
  <h2>Ce qu'on ne tente pas</h2>
  <p>
    Le 5 septembre, j'ai cherché ce qui existait déjà. La réponse est : la même chose. Une orbe en particules au centre de l'écran, Electron, Ollama en local, des outils que le modèle peut appeler, une voix. Plusieurs projets ouverts, quasi identiques les uns aux autres, certains avec bien plus d'outils que Kora et des équipes derrière, d'autres avec des millions de téléchargements. Sur ce terrain-là — le Jarvis de bureau — je perds, et je le sais. Ce n'est donc pas ce que je tente.
  </p>
  <p>
    Je ne tente pas non plus un produit. Il n'y a rien à télécharger, le dépôt est privé, et il n'y a pas de feuille de route. Kora est construite pour une seule personne : le fichier où elle écrit ce qu'elle sait de moi commence par un portrait que j'ai rédigé à la main, son modèle de réveil est entraîné sur ma voix, et le corpus qu'elle accumule pour s'entraîner un jour est fait de mes tours de parole. Quelqu'un d'autre qui l'installerait repartirait de zéro — et c'est voulu.
  </p>
  <p>
    Je ne tente pas de tout faire en local par principe. Quand une tâche dépasse le modèle de la carte, Kora demande à Claude, à DeepSeek ou à ChatGPT, et chaque appel est compté, plafonné par jour, et sa réponse gardée pour qu'on ne la repaie pas. Le local n'est pas un dogme, c'est le point de départ ; le cloud est un recours qu'on mesure.
  </p>
  <p>
    Et je ne tente pas de faire croire que ça marche. Ce que je tiens depuis le 31 août, c'est un journal de bord : 325 commits en seize jours, et un fichier de post-mortems qui fait aujourd'hui 7 500 lignes — chaque fois que Kora a menti, s'est trompée d'outil, a jeté une réponse déjà payée ou a tourné deux jours sans savoir qu'elle avait des outils, c'est écrit, avec la cause et le correctif. Ce fichier n'est pas le détail embarrassant du projet. C'est le projet.
  </p>
  <p>
    Ce que je tente, alors, tient en une phrase et occupe le reste de cet article : rendre un petit modèle, sur une machine ordinaire, digne d'un vrai accès à ma vie — mes fichiers, mon courrier, ma voix, ma mémoire — sans jamais lui demander de se juger lui-même.
  </p>
</section>

<!-- Le pari -->
<section id="le-pari">
  <h2>Le pari</h2>
  <p>
    Le pari commence par une règle, écrite en tête de tout ce que Kora lit avant de répondre : elle n'a pas le droit de dire qu'elle a fait quelque chose qu'elle n'a pas fait. C'est le défaut le plus courant des assistants — « c'est noté », « c'est envoyé », et rien n'a été noté ni envoyé. Kora l'a eu, elle aussi, toute sa première semaine.
  </p>
  <p>
    La règle ne tient pas par la consigne. Elle tient par la construction : Kora ne produit sa réponse qu'après avoir vu le résultat réel de ce qu'elle a demandé — un fichier lu, une recherche revenue, une confirmation donnée ou refusée. Si elle veut ouvrir un fichier, la demande passe d'abord par le code, qui la range dans un de trois paliers : ce qu'elle peut faire seule (lire, chercher), ce qui exige mon accord (ouvrir, lancer, écrire dans sa mémoire un chemin sensible), et ce qui est irréversible (supprimer, écrire un fichier). Avant même que je réponde, l'intention est écrite dans un journal — 144 lignes à ce jour — pour qu'on puisse relire plus tard ce qu'elle a voulu faire, y compris ce que j'ai refusé. La toute première ligne de ce journal, le 7 septembre, est une demande de lecture de <code>~/.ssh/config</code> ; j'ai dit oui. Depuis, sur tout ce qu'elle a voulu faire et qui exigeait mon accord, elle a demandé 77 fois. J'ai refusé 33 fois.
  </p>
  <p>
    Le second versant du pari, c'est qu'on ne demande jamais au modèle de juger ses propres actions. Quel outil lui montrer ce tour-ci, c'est le code qui décide, par des mots-clés, pas lui. Quels fichiers un nettoyage va toucher, c'est le code qui les calcule et me les montre ; le modèle ne fait que demander, et rien ne va jamais à la poubelle autrement que dans la corbeille du système. Quand un appel arrive avec un argument qui n'existe pas, c'est le code qui le rejette — quatre fois, dans le journal. Et une surveillance tourne à côté, dont Kora n'a aucune connaissance, qui compte ses appels, ses refus et ses dépenses ; le cloud est plafonné à un dollar par jour. Je crois qu'un petit modèle peut être digne de confiance à une condition : que la confiance ne repose sur rien de ce qu'il dit.
  </p>
  <p>
    Il y a une dernière pièce, et elle est visible : chaque fois que Kora écrit quelque chose sur moi dans sa mémoire, l'orbe pulse en violet et un carillon sonne. Rien ne se fait sans que j'en sois informé — c'est la contrainte que j'ai posée le premier jour, et c'est la seule qui n'a jamais bougé.
  </p>
  <p>
    Le pari va plus loin que la sécurité. Sur le sommet recherche du projet, Kora fait des « recherches approfondies » : elle cherche des sources qui ne vont pas ensemble, résume chacune, puis les lit en croisé — et elle a le droit de conclure que rien n'émerge. Ce droit-là, aucun produit du marché ne l'a : ils sont construits pour toujours rendre quelque chose. Le compte, aujourd'hui, est celui-ci : 38 notes de recherche, 67 lectures croisées sur 17 sujets, et deux fois seulement « rien n'émerge ». Je ne sais pas encore si c'est parce que quelque chose émerge vraiment ou parce que le modèle ne sait pas dire non. Le dispositif qui doit trancher existe, il n'a pas encore tourné, et c'est pour ça que cet article ne dit pas ce qu'il mesure. La théorie qu'il sert, elle, est <a href="/lentre-theorie-des-plis.html">déjà écrite</a>.
  </p>
  <figure>
    <img src="/images/choragos-tente-rien-n-emerge.webp" alt="La scène de Choragos pendant une recherche approfondie : les sources se desserrent autour de Kora et le mot « Rien n'émerge » s'écrit au-dessus d'elle" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      La recherche « baleines » du 7 septembre, rejouée dans la scène : six sources lues, aucune observation croisée. « Rien n'émerge » est un résultat, pas un échec.
    </figcaption>
  </figure>

</section>

<!-- Trois fonctions en tension -->
<section id="trois-fonctions">
  <h2>Trois fonctions en tension</h2>
  <p>
    Kora sert à trois choses.
  </p>
  <p>
    Elle cherche. C'est sur elle que je teste une théorie écrite avant elle, celle de l'Entre : elle va chercher des sources qui ne vont pas ensemble et me dit ce qui en sort — ou que rien n'en sort.
  </p>
  <p>
    Elle m'assiste. Mes fichiers, mon courrier, les mises à jour de la machine, la musique, la météo, le nettoyage d'un dossier.
  </p>
  <p>
    Elle joue avec moi. Parce que je veux pouvoir m'amuser avec elle, et que ce n'est pas un bonus.
  </p>
  <p>
    Le problème, c'est que ces trois usages ne veulent pas la même Kora. Quand elle cherche, « je n'ai rien trouvé qui tienne » doit être une réponse normale. Quand elle m'assiste, je veux une réponse. Pour m'assister, elle lit un portrait de moi qui lui dit : ne flatte pas, ne lisse pas un désaccord, réponds court. Avec ces consignes-là, impossible de jouer. Et pour jouer, elle a le droit d'inventer — ce qui, en recherche, est la faute absolue.
  </p>
  <p>
    Une seule consigne ne peut donc pas servir les trois. Alors il y a trois chemins dans le code, un par usage, chacun avec son propre texte de départ. Et je lui dis lequel prendre : « Kora, mode recherche ». L'orbe change de couleur, l'écran se resserre, et elle ne voit plus que les outils de ce mode. Moins de choix, moins d'erreurs. Le lendemain, elle a oublié : un mode se demande à chaque session.
  </p>
  <figure>
    <img src="/images/choragos-tente-mode-recherche.webp" alt="Kora en mode recherche : l'orbe devenue violette, le système solaire des agents déployé, le HUD réduit" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      « Kora, mode recherche » : l'orbe prend la couleur du sommet, les agents se déploient, le HUD se resserre.
    </figcaption>
  </figure>

  <p>
    Pour savoir lequel des trois est en retard, je n'ai pas besoin de réfléchir : chaque capacité de Kora porte le nom de l'usage qu'elle sert, et le programme refuse d'en compiler une qui n'en sert aucun. Il suffit de compter. Aujourd'hui : cinquante-deux capacités pour l'assistance, neuf pour la recherche, seize pour le jeu. Le jeu est loin derrière.
  </p>
  <figure>
    <img src="/images/choragos-tente-pense-bete.webp" alt="Le pense-bête des capacités de Kora : 21 outils, 25 déclencheurs directs, 10 enchaînements, 9 interventions spontanées, comptés par sommet R 9 · Q 52 · J 16" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Le pense-bête, dans l'application. En haut à droite, le compte par usage : recherche 9, quotidien 52, jeu 16. Chaque entrée dit aussi si elle a été vue marcher.
    </figcaption>
  </figure>

  <p>
    Il a d'ailleurs mal commencé. Demandée trente-deux fois, Kora a raconté trente-deux fois la même blague. Le cloud ne faisait pas mieux. Le 7 septembre, l'humour a été retiré, et « Pas d'humour » est resté dans la liste des manques, dans l'application. Ce qui est venu ensuite ne cherche plus à la faire rire. Elle choisit ses tenues. Elle en invente dans un atelier, et je garde ou je jette. Et depuis le 14 septembre, on joue à trois jeux construits autour d'elle : croiser deux de ses tenues pour en faire naître d'autres, deviner un mot par son sens, chaque mot une étoile autour d'elle, et un jeu de rythme sur ma musique, les notes qui descendent vers elle. Celui-là marche très bien. Le jeu se construit comme le reste : en notant ce qui ne marche pas, et en gardant ce qui marche.
  </p>
  <figure>
    <img src="/images/choragos-tente-nebuleuse.webp" alt="Kora habillée en nébuleuse à l'ouverture, avec sa phrase « Je me mets en nébuleuse. »" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      À l'ouverture de cette capture, elle s'est habillée toute seule — « Je me mets en nébuleuse. » C'est une règle, pas le modèle : une fois sur trois, la nébuleuse le soir.
    </figcaption>
  </figure>

</section>

<!-- Ce qu'elle apprend de moi -->
<section id="ce-quelle-apprend">
  <h2>Ce qu'elle apprend de moi</h2>
  <p>
    Un assistant en ligne apprend de millions de gens. Kora apprend d'une seule personne. C'est ce qui la rend possible sur une machine de bureau. Elle apprend quatre choses, et les données viennent toujours de l'usage — jamais d'un jeu téléchargé.
  </p>
  <p>
    <strong>Ma voix.</strong> Le mot « Kora » qui la réveille est reconnu par un petit modèle entraîné ici, sur 177 enregistrements de moi disant ce mot. J'ai essayé d'y ajouter des voix de synthèse, mille deux cents extraits : ça n'a rien changé. Elles ne prononcent pas mon « Kora ». Ce qui l'améliore, c'est moi, encore. Alors chaque réveil que je confirme est gardé, et le Raspberry Pi réentraîne un nouveau modèle la nuit. Au matin, il est comparé à l'ancien sur les mêmes enregistrements. Il ne le remplace que s'il fait mieux. Le premier, dans la nuit du 14 au 15, a été refusé : onze faux réveils au lieu de dix. Il est gardé avec sa mesure — un échec est un point de la courbe. Et derrière le mot, un second modèle vérifie que c'est bien ma voix : il rejette huit fois sur dix une voix qui n'est pas la mienne.
  </p>
  <p>
    <strong>Mes mots.</strong> Les commandes de Kora sont fermées : « Kora, mails », « Kora, lis le 3 ». Quand une phrase ne correspond à aucune commande, le modèle ne devine plus. La phrase est comparée à celles que j'ai déjà dites ; si elle ressemble assez à l'une d'elles, elle est comprise comme elle, et retenue. En deux jours, 88 tournures ont été apprises comme ça, de ma bouche. Ce qui ne ressemble à rien est refusé.
  </p>
  <p>
    <strong>Mes jugements.</strong> Chaque réponse de Kora est gardée, avec ce que j'en ai dit : un pouce, une correction, un refus. Chaque « oui » ou « non » à une action est gardé aussi. Ça fait 179 réponses, dont 89 jugées. Ce corpus a servi une première fois le 15 septembre, pour entraîner une variante de son modèle — j'y reviens, le résultat surprend.
  </p>
  <p>
    <strong>Ce que je lui dis.</strong> Elle n'écrit pas tout. Quand une conversation se tait vingt minutes, elle la relit en entier et en tire au plus trois choses : une règle que j'ai posée, une habitude qui revient, un sujet que je veux reprendre. Dix-sept notes en dix jours, dans un fichier texte que je peux corriger. Et chaque note est visible : un cristal dans sa matière, qui naît sous mes yeux quand elle l'écrit, avec un carillon.
  </p>
  <figure>
    <img src="/images/choragos-tente-cristaux.webp" alt="Le cœur de Kora en gros plan : des cristaux roses à facettes dans sa matière bleue" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Ce qu'elle a retenu de moi, dans son corps : chaque cristal rose est une note de sa mémoire, placée là où son sens la met. Dix-sept notes le 15 septembre.
    </figcaption>
  </figure>

  <p>
    Quatre boucles, une seule source : moi, dans cette pièce. Ce qu'elle apprend, c'est une voix, des tournures, des jugements, des habitudes. Ça ne peut pas sortir d'ici — c'est le sujet d'après.
  </p>
</section>

<!-- Ce qui a été mesuré, et ce qui a échoué -->
<section id="mesure-et-echoue">
  <h2>Ce qui a été mesuré, et ce qui a échoué</h2>
  <p>
    La règle du projet, c'est qu'on ne dit pas « ça marche » : on mesure, et on garde le chiffre, surtout quand il déplaît. Voici les principaux.
  </p>
  <p>
    <strong>Le premier entraînement.</strong> Le 15 septembre, pour la première fois, le corpus a servi. La chaîne complète tient en un quart d'heure sur ma carte : préparer les données, entraîner une variante de gemma4 sur les réponses jugées, la recharger dans Kora. J'ai comparé les deux modèles à l'aveugle sur trois questions, sans savoir lequel répondait : trois fois sur trois, j'ai préféré la variante entraînée. Elle écrit mieux. Puis j'ai lancé le banc qui mesure si elle choisit le bon outil : 80 % contre 93 % pour le modèle d'origine. Treize points de perdus. Toutes les pertes au même endroit : là où elle devait déléguer ou écrire une note, elle rédige elle-même. Le corpus était fait à 90 % de recherches — soixante exemples qui lui apprennent « rédige toi-même ». Les mêmes données améliorent ce qu'elle dit et dégradent ce qu'elle fait. La variante n'est pas en service : on ne réentraînera pas sans avoir d'abord assez de tours d'action dans le corpus.
  </p>
  <p>
    <strong>Le mot d'éveil.</strong> J'ai retiré mes propres enregistrements de l'entraînement pour voir ce qu'il valait sans moi : de 3 ratés sur 29, on passe à 18. Les mille deux cents extraits de synthèse n'ont rien rattrapé. Il n'y a pas de raccourci : ce modèle a besoin de ma voix, en quantité, et je n'en ai pas encore assez.
  </p>
  <p>
    <strong>L'aide qui nuisait.</strong> Pour que la reconnaissance vocale comprenne mes commandes, on lui donnait une liste de cinquante-six mots utiles. Mesuré sur soixante commandes : avec la liste, 23 comprises ; sans rien du tout, 24. L'aide faisait moins bien que rien — elle transformait « Kora » en « Quoi ? ». Remplacée par quelques phrases d'exemple : 42 sur 60.
  </p>
  <figure>
    <table>
      <thead><tr><th>Ce qu'on donne à la reconnaissance vocale</th><th>Commandes comprises (sur 60)</th></tr></thead>
      <tbody>
        <tr><td>Rien</td><td>24</td></tr>
        <tr><td>La liste de 56 mots utiles (du 9 au 14 septembre)</td><td><strong>23</strong></td></tr>
        <tr><td>Quelques phrases d'exemple</td><td>40</td></tr>
        <tr><td>Les phrases d'exemple et mes termes personnels (depuis le 14 septembre)</td><td><strong>42</strong></td></tr>
      </tbody>
    </table>
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Le banc du 14 septembre, modèle rapide, vingt commandes réelles lues par trois voix de synthèse. La liste faisait moins bien que rien.
    </figcaption>
  </figure>

  <p>
    <strong>Deux jours sans outils.</strong> Du 3 au 5 septembre, Kora a tourné sans qu'une seule définition d'outil parte réellement au modèle — une ligne de code qui ne recopiait pas une option. Elle ne connaissait ses outils que par la prose de son prompt. Une bonne partie des erreurs de ces trois jours, qu'on mettait sur le compte du modèle, venaient de là. Depuis, avant de soupçonner le modèle, on pèse ce qu'il a vraiment reçu.
  </p>
  <p>
    <strong>La mémoire qui ne s'écrivait pas.</strong> Pendant une semaine, Kora n'a presque rien écrit sur moi d'elle-même. Trois mécanismes se renvoyaient la tâche, et le dernier, prévu pour se déclencher au bout de soixante messages, ne s'est jamais déclenché : aucune conversation n'y arrive. Ça se voyait dans les journaux, à zéro écriture spontanée. C'est de là que vient la relecture à vingt minutes de silence.
  </p>
  <p>
    Et deux choses qui ont été essayées puis retirées parce que la mesure le disait : un déclencheur de mémoire par similarité de sens (il ne distinguait pas une phrase à retenir d'une commande courte), et le modèle précédent de Kora, remplacé après un banc de onze configurations et un échantillon de voix jugé à l'aveugle. Ce qui a échoué reste écrit. Si je ne le garde pas, je le referai.
  </p>
</section>

<!-- Pourquoi ça ne peut être que local -->
<section id="local">
  <h2>Pourquoi ça ne peut être que local</h2>
  <p>
    On parle souvent du local comme d'une question de vie privée. C'est vrai, mais ce n'est pas la raison principale ici. La raison, c'est la section 5 : tout ce que Kora apprend est une personne. Ma voix dans cette pièce, mes tournures, mes jugements, mes habitudes. Un service en ligne ne va pas entraîner un modèle de réveil sur les cent soixante-dix-sept enregistrements d'un seul client, ni relire chaque conversation pour en tirer trois notes que ce client pourra corriger dans un fichier texte. Ce n'est pas qu'il ne veut pas : ça ne se vend pas. Ici, ça ne coûte que la nuit du Raspberry Pi.
  </p>
  <p>
    Il y a ce qui ne doit pas sortir, aussi, et là le code fait plus que la promesse. Mon courrier est lu par le programme, pas par le modèle : le tri se fait sur les en-têtes, aucun sujet, aucun corps de message n'entre jamais dans un prompt. Kora peut lire mes fichiers, mais n'écrit que dans un dossier à elle. Et ce qui part au cloud est ce que je décide d'y envoyer, tour par tour, en le voyant.
  </p>
  <p>
    Il y a le prix. En dix jours, les 127 appels aux modèles en ligne ont coûté 1,18 $. Les 1 136 appels au modèle local n'ont rien coûté. La carte graphique, elle, a coûté quelque chose — une fois. Depuis, chaque appel est gratuit.
  </p>
  <figure>
    <img src="/images/choragos-tente-tableau-de-bord.webp" alt="Le tableau de bord de consommation de Choragos : appels locaux et cloud, coût, état du corpus de fine-tune" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Le tableau de bord de l'application, sur trente jours. Le modèle local est « gratuit » ; le reste est compté au dixième de centime.
    </figcaption>
  </figure>

  <p>
    Il y a la durée. Le 7 septembre, un des modèles en ligne que Kora utilisait a disparu du jour au lendemain : le fournisseur l'a retiré, l'appel revenait avec « ce modèle n'existe pas ». Le lendemain, un deuxième. Le modèle qui est sur mon disque, lui, ne disparaîtra pas un mardi.
  </p>
  <p>
    Et il y a ce que le local coûte vraiment, qu'il faut dire aussi : de la place. Seize gigas de mémoire vidéo, dont près de trois pour l'affichage du bureau. Un seul gros modèle y tient à la fois. Kora, la reconnaissance vocale, sa voix, tout se partage ce qui reste. Le Raspberry Pi est arrivé parce que le petit modèle qui compare les sens n'avait plus de place à côté de gemma4 — et le sortir de la carte a permis de le garder allumé en permanence. Le local, c'est une négociation constante avec seize gigas. Elle est écrite dans les journaux comme le reste.
  </p>
</section>

<!-- Où ça va -->
<section id="ou-ca-va">
  <h2>Où ça va</h2>
  <p>
    Cet article n'a pas de fin, parce que le projet n'en a pas. Kora a seize jours. Ce qu'elle sait faire aujourd'hui, elle ne le saura peut-être plus demain, parce qu'on l'aura mesuré et retiré ; et ce qui manque aujourd'hui est écrit dans une liste, dans l'application, que je lis plus souvent que la liste de ce qui marche.
  </p>
  <figure>
    <img src="/images/choragos-tente-manques.webp" alt="L'onglet « Manques & à venir » du pense-bête : trente-sept manques vérifiés, dont « Pas d'humour »" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      La liste des manques et de ce qui reste à vérifier, dans l'application : neuf manques vérifiés dans le code, vingt-sept capacités jamais revues en conditions réelles à la date de la capture, un chantier décidé. Elle est plus longue que la liste des jeux.
    </figcaption>
  </figure>

  <p>
    Ce qui vient, dans l'ordre où je compte le faire. D'abord assez de tours d'action dans le corpus pour réentraîner sans perdre les treize points. Ensuite le dispositif de recherche, celui qui doit dire si « rien n'émerge » veut dire quelque chose — il tourne une fois, et alors seulement j'écris ce qu'il mesure. Et entre les deux, chaque nuit, le Pi entraîne un candidat sur ma voix, et le compare à l'ancien.
  </p>
  <p>
    Tout ça est tenu dans un journal, et c'est lui que je publie, pas un produit. Ce que Kora a fait, ce qu'elle a raté, ce qu'on a mesuré : les notes techniques sont <a href="/notes.html">en anglais, ici</a> — dont le <a href="/notes/building-a-local-agent-you-can-trust.html">guide pour construire la sienne</a>, tenu comme <a href="https://github.com/Kairos-commu/kora" target="_blank" rel="noopener">dépôt public</a> avec ses contrats —, la méthode qui les rend possibles est <a href="https://github.com/Kairos-commu/socle" target="_blank" rel="noopener">publique</a>, et Kora elle-même racontera sa version — elle est amnésique de sa première semaine, et c'est une autre histoire.
  </p>
  <p>
    Si vous construisez quelque chose de semblable, dans votre pièce, avec votre voix, écrivez-moi. Pas pour comparer les orbes. Pour comparer les journaux.
  </p>
</section>
