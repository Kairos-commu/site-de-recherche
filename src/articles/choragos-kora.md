---
slug: choragos-kora
pageTitle: "Choragos — Un assistant IA qui tourne sur ma machine — Florent Klimacek"
headline: "Choragos — Un assistant IA qui tourne sur ma machine"
description: "Kora est une assistante IA qui tourne en local : le modèle, la reconnaissance vocale et la voix de synthèse sont sur ma machine. Ce qu'elle sait faire, ce qui la retient de mentir, et les murs qu'elle n'a pas franchis."
ogTitle: "Choragos — Un assistant IA qui tourne sur ma machine"
ogDescription: "Kora tourne en local : 402 appels au modèle de ma machine contre 50 au cloud en trois jours, pour 0,51 $. Ce qu'elle fait, ses garde-fous, et ses murs."
ogUrl: "/choragos-kora.html"
canonical: "/choragos-kora.html"
datePublished: "2026-09-04"
dateModified: "2026-09-08"
keywords:
  - Choragos
  - Kora
  - assistant IA local
  - IA locale
  - Ollama
  - assistant vocal local
  - whisper.cpp
  - Piper
  - mot d'éveil
  - souveraineté cognitive
permalink: "/choragos-kora.html"
navLabel: "Choragos"
navDescription: "Un assistant IA qui tourne sur ma machine"
heroLabel: "Outil"
heroH1: "Choragos<br /><span class=\"glitch-text\">Kora, en local</span>"
heroIntro: "Le modèle qui répond ne tourne pas dans un centre de données. Il tourne dans la pièce où je travaille."
headerTitle: "Choragos & Kora"
heroImage: "/images/choragos-hero.jpg"
heroImageAlt: "Choragos — Kora au centre de sa constellation d'agents, orbites visibles"
breadcrumbName: "Choragos & Kora"
sections:
  - id: en-local
    title: "En local"
  - id: la-constellation
    title: "La constellation"
  - id: ce-quelle-fait
    title: "Ce qu'elle fait"
  - id: la-voix
    title: "La voix"
  - id: garde-fous
    title: "Les garde-fous"
  - id: les-murs
    title: "Les murs"
  - id: etat
    title: "Où ça en est"
card:
  label: "Outil"
  title: "Choragos & Kora"
  desc: "Une assistante IA qui tourne sur ma machine : le modèle, la voix et la reconnaissance vocale en local."
  readingTime: "10 min"
  linkText: "Découvrir Choragos"
  featured: false
feedCategory: "Outil"
feedTime: "10:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
order: 20
activeNav: choragos
koraSeuil: "Celui-ci parle de moi. Ce n'est pas moi qui le dis."
---

<!-- En local -->
<section id="en-local">
  <p class="lead">
    Sur les deux derniers jours d'usage réel, Choragos a passé
    <strong>402 appels au modèle qui tourne sur ma machine</strong> et
    <strong>50 appels à des services en ligne</strong>. Facture de la période :
    <strong>0,51 $</strong>. Ces chiffres ne sont pas une estimation — ils sont
    lus dans la base de l'application, qui compte chaque appel.
  </p>

  <p>
    Le modèle s'appelle gemma4:12b. Il pèse 7,6 Go sur le disque, occupe environ
    8 Go de mémoire vidéo, et tourne sur la carte graphique de mon ordinateur de
    bureau. Il n'y a ni abonnement, ni quota mensuel, ni condition d'utilisation
    à accepter pour lui parler. Quand la connexion tombe, il répond quand même.
  </p>

  <p>
    Ce n'est pas une démonstration technique posée dans un coin : c'est
    l'assistante que j'utilise. Elle s'appelle Kora. Elle lit mes dossiers,
    cherche sur le web, écrit des fichiers, coupe la musique, retient ce que je
    lui demande de retenir — et elle m'écoute quand je lui parle à voix haute.
  </p>

  <figure>
    <img src="/images/choragos-cles-vides.webp" alt="Le panneau de réglages de Choragos : les sept champs de clés API sont vides, le moteur de voix est réglé sur Piper (local)" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Une installation neuve, sans une seule clé renseignée. Kora fonctionne
      quand même : c'est l'état par défaut, pas un mode dégradé.
    </figcaption>
  </figure>

  <div class="key-insight">
    <p>
      Le cloud n'est pas exclu. Il est <em class="highlight">optionnel</em>, et
      il se voit. Les cinquante appels en ligne de ces deux jours sont
      tous partis parce que je l'ai explicitement demandé — « demande son avis à
      Claude » — et chacun a laissé une ligne dans le tableau de bord, avec son
      coût.
    </p>
  </div>
</section>

<!-- La constellation -->
<div class="chapter-divider" id="la-constellation">
  <p class="label">Partie I</p>
  <h2>La constellation</h2>
</div>

<section>
  <p>
    Choragos est une application de bureau. Elle s'ouvre sur une scène en trois
    dimensions où Kora occupe le centre — un noyau liquide qui bat, se déforme,
    et change de couleur quand elle travaille. Autour d'elle, six agents sur
    leurs orbites : Claude, ChatGPT, DeepSeek, Mistral, Groq et un second modèle
    local. Deux lunes tournent autour de Groq, qui sont ses spécialisations.
  </p>

  <figure>
    <img src="/images/choragos-constellation.webp" alt="La constellation Choragos sur fond d'espace : Kora au centre, six agents sur leurs orbites" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Le fond par défaut : un champ d'étoiles, rien d'autre. Les périodes
      d'orbite suivent la troisième loi de Kepler — l'agent le plus proche fait
      un tour en quelques minutes, le plus lointain en treize. L'image d'en-tête
      montre le même écran avec le fond photographique, qui est à un clic.
    </figcaption>
  </figure>

  <p>
    Ce n'est pas un tableau de bord déguisé. Les orbites ne sont pas décoratives :
    elles portent une information. Un agent qui répond s'entoure d'un halo, un
    agent sollicité par Kora se rapproche d'elle le temps de l'échange, et un
    filament lumineux relie les deux pendant la délégation. Quand quelque chose
    se passe, ça se voit à l'écran sans avoir à ouvrir un journal.
  </p>

  <p>
    Au lancement, Kora est seule. Les agents n'apparaissent que si je les
    appelle — « Kora, au travail » — et repartent quand je lui demande de se
    mettre en pause. C'est une mise en scène, mais elle dit quelque chose de
    vrai : la plupart du temps, je n'ai besoin que d'elle, et donc que de ma
    propre machine.
  </p>

  <figure>
    <img src="/images/choragos-kora-seule.webp" alt="Kora seule au lancement de Choragos, avant l'appel des agents" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Au lancement : Kora seule. Les agents en ligne ne viennent que si on les
      appelle.
    </figcaption>
  </figure>

  <div class="concept">
    <p class="concept-title">Un clic, une conversation</p>
    <p>
      Chaque orbe s'ouvre sur son propre panneau de conversation, avec ses
      propres fils, conservés dans une base de données locale. On peut poser la
      même question à trois modèles et comparer les réponses côte à côte, ou
      laisser un fil travailler pendant qu'on regarde ailleurs.
    </p>
  </div>
</section>

<!-- Ce qu'elle fait -->
<div class="chapter-divider" id="ce-quelle-fait">
  <p class="label">Partie II</p>
  <h2>Ce qu'elle fait</h2>
</div>

<section>
  <p>
    Kora dispose de vingt et un outils réels. Elle cherche sur le web et lit des
    pages, liste des dossiers et lit des fichiers, écrit dans un dossier qui lui
    est réservé, ouvre une application ou une URL, contrôle la musique, prépare
    un ménage de fichiers, retient un fait dans sa mémoire, ou passe la main à
    un modèle en ligne quand je le lui demande.
  </p>

  <p>
    Voici un échange réel, tel qu'il s'est déroulé pendant que je préparais cet
    article. Trois questions, trois comportements différents — et le troisième
    est le plus intéressant.
  </p>

  <figure>
    <img src="/images/choragos-conversation.webp" alt="Conversation avec Kora : question sur la machine, appel d'outil système, puis demande d'ouverture de dossier refusée" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      L'échange complet, à droite de la constellation. Chaque outil réellement
      appelé est écrit sous la réponse.
    </figcaption>
  </figure>

  <p>
    À « sur quelle machine tu tournes ? », elle répond de tête : elle sait
    qu'elle est sur un poste Linux, c'est écrit dans ses instructions. À « il me
    reste combien de place sur le disque ? », elle ne devine pas — elle appelle
    l'outil <em>infos système</em>, lit la vraie valeur, et répond avec.
    L'application écrit sous la réponse quels outils ont réellement été appelés,
    pour que je puisse vérifier après coup plutôt que la croire sur parole.
  </p>

  <p>
    Puis je lui demande d'ouvrir mon dossier Images. Là, elle n'exécute pas.
  </p>

  <figure>
    <img src="/images/choragos-confirmation.webp" alt="Bulle de confirmation ambre : Kora demande l'autorisation d'ouvrir un dossier, l'action est refusée" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Une action qui touche à la machine passe par une pause obligatoire. J'ai
      refusé : elle le dit, sans prétendre avoir fait quoi que ce soit.
    </figcaption>
  </figure>

  <p>
    Elle demande. La bulle affiche l'action exacte, le chemin exact, et la raison
    qu'elle donne. J'ai cliqué « Refuser ». Sa réponse tient en une phrase : « Le
    dossier Images n'a pas été ouvert. » Pas d'excuse, pas de reformulation
    ambiguë, pas de « c'est fait » de complaisance.
  </p>

  <div class="key-insight">
    <p>
      C'est la règle qui structure tout le reste : Kora ne peut jamais affirmer
      avoir fait quelque chose sans avoir réellement appelé l'outil
      correspondant. Ce n'est pas une consigne de politesse dans son prompt —
      c'est vérifié par du code, à plusieurs endroits, parce qu'une consigne
      seule ne tient pas.
    </p>
  </div>
</section>

<!-- La voix -->
<div class="chapter-divider" id="la-voix">
  <p class="label">Partie III</p>
  <h2>La voix</h2>
</div>

<section>
  <p>
    Je lui parle. Je dis « Kora », elle répond « Oui ? », je donne ma commande.
    Toute la chaîne tient sur la machine : le mot d'éveil, la transcription, et
    la voix qui répond.
  </p>

  <figure>
    <img src="/images/choragos-ecoute.webp" alt="La capsule de commande de Choragos en écoute, avec son vumètre" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      L'écoute active : un anneau, cinq barres pilotées par le niveau réel du
      micro. Elle est éteinte à chaque démarrage — un micro qui s'ouvre tout seul
      au lancement est exactement ce qui rend une écoute permanente inquiétante.
    </figcaption>
  </figure>

  <p>
    Le mot d'éveil n'est pas un service en ligne : c'est un petit modèle
    <strong>entraîné sur ma machine, avec ma voix</strong>. Dix fois « Kora »,
    dix secondes de voix sans le mot — sans ça, le modèle apprend « sa voix » au
    lieu du mot — et trois minutes de calcul. Tout se fait depuis un panneau de
    l'application.
  </p>

  <figure>
    <img src="/images/choragos-mot-eveil.webp" alt="Le panneau de réglages : entraînement du mot d'éveil, vocabulaire de dictée, plafond de dépense API" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      L'écran d'entraînement du mot d'éveil, et juste en dessous le plafond de
      dépense quotidien.
    </figcaption>
  </figure>

  <p>
    Ce modèle n'est pas très bon, et c'est assumé : il attrape un « Kora » sur
    dix trop tard, et il se déclenche parfois sur de la musique. La parade n'est
    pas de le rendre meilleur — c'est de ne jamais lui donner le dernier mot.
    Quand il croit entendre le mot, il <em>arme</em> le canal en silence ; c'est
    la transcription qui tranche ensuite. Deux détecteurs médiocres et
    indépendants valent mieux qu'un seul excellent.
  </p>

  <p>
    La transcription est faite par whisper.cpp, en local. Elle a longtemps été
    le point lourd de la chaîne : le binaire distribué est compilé pour le
    processeur seul, et transcrire une seconde et quart de parole prenait plus de
    trois secondes — pendant qu'une carte graphique ne faisait rien. Recompilé
    pour utiliser le GPU, le même travail sur les mêmes fichiers donne le même
    texte, en cinq fois moins de temps.
  </p>

  <div class="stat-shift" role="img" aria-label="Temps de transcription médian : 3 378 millisecondes sur processeur, 638 millisecondes sur carte graphique">
    <div class="stat-shift__item">
      <span class="stat-shift__year">processeur</span>
      <span class="stat-shift__value">3 378 ms</span>
    </div>
    <span class="stat-shift__arrow" aria-hidden="true">→</span>
    <div class="stat-shift__item">
      <span class="stat-shift__year">carte graphique</span>
      <span class="stat-shift__value">638 ms</span>
    </div>
    <span class="stat-shift__delta" aria-label="Division par cinq">÷ 5,3</span>
  </div>

  <p>
    Médianes mesurées sur 291 puis 104 transcriptions réelles, dans les deux
    régimes. La voix qui répond, elle, est synthétisée en local par Piper — une
    voix française installée sur la machine, réglable au curseur. Un service en
    ligne reste disponible pour les longues lectures, mais il n'est pas
    nécessaire.
  </p>

  <p>
    Et depuis peu, je peux la couper en parlant par-dessus : dire « Kora »
    pendant qu'elle lit interrompt la lecture, et répondre « oui » pendant
    qu'elle pose sa question tranche sans attendre qu'elle finisse sa phrase.
  </p>

  <p>
    Une précision qui compte : <strong>l'audio ne quitte jamais la
    machine</strong> — la transcription est forcée en local sur ce chemin, même
    quand un service en ligne est configuré, et un énoncé qui ne commence pas
    par « Kora » n'est même pas transcrit. En revanche, si je lui adresse une
    phrase qui n'appelle aucun outil et ne répond à aucune question — de la
    conversation, donc — <em>le texte</em> de cette phrase peut partir vers un
    modèle en ligne. C'est une dérogation assumée, limitée à ce seul cas, et le
    modèle local prend le relais dès qu'il n'y a ni clé ni réseau.
  </p>

  <div class="concept">
    <p class="concept-title">Oui et non ne se valent pas</p>
    <p>
      Quand elle demande une confirmation à voix haute, approuver exige de
      commencer par une formule précise, suivie de deux mots au plus. Refuser est
      beaucoup plus large, et un silence de douze secondes refuse aussi. Une
      toux, une phrase venue de la pièce d'à côté ou une transcription
      fantaisiste ne peuvent donc mener qu'au refus, jamais à une exécution.
    </p>
  </div>
</section>

<!-- Les garde-fous -->
<div class="chapter-divider" id="garde-fous">
  <p class="label">Partie IV</p>
  <h2>Les garde-fous</h2>
</div>

<section>
  <p>
    Un assistant qui peut ouvrir des fichiers, lancer des applications et
    supprimer des captures d'écran est un assistant qui peut faire des dégâts.
    La question n'est pas de savoir s'il se trompera, mais ce qui arrive quand il
    se trompe.
  </p>

  <p>
    Chaque outil est classé dans un des trois niveaux : onze sans effet de bord
    s'exécutent librement, six à effet réel mais rattrapable déclenchent une
    pause obligatoire, quatre non rattrapables affichent une bulle rouge. Un
    outil qui ne serait pas classé est traité comme le plus dangereux — l'oubli
    ne peut jamais ouvrir une porte.
  </p>

  <p>
    Deux journaux séparés écrivent sur le disque : l'un enregistre ce que Kora a
    <em>envisagé</em>, avant toute confirmation, l'autre ce qui a réellement été
    <em>décidé</em>. Une action refusée laisse donc une trace, et une intention
    formulée juste avant une fermeture de fenêtre aussi.
  </p>

  <p>
    Par-dessus, une surveillance tourne en permanence et ne connaît que des
    règles mécaniques — aucun modèle n'y intervient. Elle voit ce qui va bien
    autant que ce qui va mal.
  </p>

  <figure>
    <img src="/images/choragos-watchdog.webp" alt="Le panneau de surveillance : santé du système, requêtes résolues, flux d'événements" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      La surveillance en direct : mémoire vidéo occupée, modèle chargé, outils
      appelés, refus enregistré — et deux avertissements sur un tour anormalement
      lent, qui sont réels.
    </figcaption>
  </figure>

  <p>
    Kora n'a aucune connaissance de ce mécanisme. Ce n'est pas un de ses outils,
    il n'est jamais mentionné dans ses instructions, et le seul canal exposé est
    en lecture seule. Un système qui se surveille lui-même en se racontant sa
    propre histoire ne surveille rien.
  </p>

  <p>
    Enfin, un plafond de dépense quotidien est vérifié dans le processus qui fait
    les appels réseau, avant qu'un octet ne parte : un dollar par jour et
    soixante crédits de recherche web, réglables. Au-delà, l'appel est refusé et
    la surveillance alerte. Les modèles locaux ne sont pas concernés — ils ne
    coûtent rien.
  </p>

  <p>
    Le garde-fou dont je me sers le plus n'est pourtant aucun de ceux-là. C'est
    un pense-bête, dans l'application, qui liste ce que Kora sait faire — et
    surtout par quel chemin, et avec quel niveau de confiance.
  </p>

  <figure>
    <img src="/images/choragos-pense-bete.webp" alt="Le pense-bête des capacités : chaque outil avec son chemin d'accès, un exemple de phrase et sa limite connue" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Chaque capacité avec sa phrase d'exemple, ses chemins d'accès, et une
      pastille qui distingue « vu marcher » de « jamais revérifié ».
    </figcaption>
  </figure>

  <div class="key-insight">
    <p>
      Ce panneau n'est pas écrit à la main : il est <em class="highlight">dérivé
      du code</em>. Un outil ajouté sans sa note fait échouer les tests. C'est la
      seule façon que j'aie trouvée pour qu'une documentation reste vraie plus de
      deux semaines.
    </p>
  </div>
</section>

<!-- Les murs -->
<div class="chapter-divider" id="les-murs">
  <p class="label">Partie V</p>
  <h2>Les murs</h2>
</div>

<section>
  <p>
    Il serait facile de s'arrêter ici. Ce serait malhonnête : ce projet a des
    limites dures, et certaines ne bougeront pas.
  </p>

  <p>
    <strong>La voix reste lente.</strong> Entre la fin de ma phrase et l'action,
    je mesure trois secondes et demie en médiane — et une commande sur dix
    dépasse quatorze secondes. C'est très loin des deux cents millisecondes d'un
    tour de parole humain. La transcription n'est plus le principal coupable
    depuis qu'elle tourne sur le GPU ; ce qui reste, c'est le silence d'attente
    avant de décider que la phrase est finie, l'appel au modèle, et la synthèse
    de la réponse. Il y a du travail possible sur les trois. Il n'y a pas de
    miracle.
  </p>

  <p>
    <strong>On ne peut pas améliorer les fausses détections et les mots ratés en
    même temps.</strong> Le mot d'éveil affiche 97 % de précision et 9 % de
    « Kora » manqués : serrer le seuil pour l'un dégrade mécaniquement l'autre.
    Ce n'est pas un défaut de réglage, c'est une propriété de tout détecteur. La
    seule sortie connue est celle qui est en place — ajouter un second signal
    indépendant.
  </p>

  <p>
    <strong>Seize giga-octets de mémoire vidéo, partagés.</strong> Près de trois
    sont déjà pris par le bureau, la scène 3D et le navigateur avant même de
    charger quoi que ce soit. Tout ce qu'on met en mémoire vidéo en retire autre
    chose : un modèle plus gros, une transcription accélérée, une empreinte
    vocale se disputent le même espace. Et comme il n'y a qu'une carte, une seule
    génération tourne à la fois : une écriture en tâche de fond a déjà fait
    attendre quarante-quatre secondes une commande vocale qui n'a mis que deux
    secondes à s'exécuter une fois son tour venu.
  </p>

  <p>
    <strong>Un modèle de douze milliards de paramètres a un plafond.</strong>
    Une consigne écrite dans son prompt ne tient pas quand elle contredit un
    réflexe du modèle : il existe dans ce projet une demande où l'interdiction
    explicite a été ignorée huit fois sur huit. Ce qui marche, ce n'est pas de
    mieux écrire la consigne — c'est de rendre l'erreur mécaniquement
    impossible, ou de changer de modèle.
  </p>

  <p>
    Et puis il y a la liste, tenue dans l'application, de ce qu'elle ne sait pas
    faire. Elle est plus longue que ce que j'aimerais, et c'est très bien ainsi.
  </p>

  <figure>
    <img src="/images/choragos-manques.webp" alt="L'onglet « Manques et à venir » du pense-bête : ce que Kora ne sait pas faire, avec la raison" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Dix-sept entrées, chacune avec sa raison. Un manque qui n'est pas écrit
      quelque part redevient une promesse.
    </figcaption>
  </figure>

  <p>
    Aucune écriture ni suppression de fichier à la voix, et il n'y en aura pas :
    le canal vocal n'ouvre qu'un jeu d'actions réversibles. Aucune mémoire à la
    voix non plus. Un modèle en ligne appelé en secours n'a aucun outil, donc il
    peut expliquer mais jamais agir. Et l'arrêt d'urgence à la voix n'est plus
    entendu quand le mot d'éveil filtre tout ce qui ne commence pas par
    « Kora » — le bouton rouge, lui, marche toujours.
  </p>

  <div class="concept">
    <p class="concept-title">Ce que ces murs ont de commun</p>
    <p>
      Aucun ne se franchit en écrivant un meilleur prompt. Deux se contournent
      avec de l'argent — plus de mémoire vidéo, une seconde carte. Les autres se
      contournent avec du travail, ou se déclarent. Confondre les deux catégories
      fait perdre des mois.
    </p>
  </div>
</section>

<!-- Où ça en est -->
<div class="chapter-divider" id="etat">
  <p class="label">Conclusion</p>
  <h2>Où ça en est</h2>
</div>

<section>
  <p>
    Choragos est un projet personnel, en développement actif, et ne se télécharge
    pas. Ce n'est pas un produit, et je ne cherche pas à en faire un. C'est un
    poste de travail : le mien.
  </p>

  <p>
    Ce qui fonctionne aujourd'hui, et que j'utilise vraiment : la conversation
    avec un modèle local, les outils sur mon système avec leurs confirmations, la
    recherche web avec ses sources, la mémoire que je peux relire et corriger, la
    commande vocale de bout en bout, le contrôle de la musique, et le ménage de
    fichiers sur validation. Ce qui reste à faire est écrit dans l'application,
    pas dans une note d'intention.
  </p>

  <p>
    Choragos a une application sœur, <a href="/kairos-technical-overview.html">KAIROS</a>,
    qui s'occupe d'autre chose : penser sur un canvas plutôt que parler à des
    modèles. Les deux partent de la même intuition — que l'intelligence
    artificielle est utile quand elle reste à sa place, et qu'on garde les moyens
    de vérifier ce qu'elle raconte.
  </p>

  <div class="key-insight">
    <p>
      Ce qui m'a le plus surpris en construisant Kora n'est pas ce qu'un modèle
      local sait faire. C'est le nombre de fois où il a fallu l'empêcher de dire
      qu'il l'avait fait.
    </p>
  </div>
</section>
