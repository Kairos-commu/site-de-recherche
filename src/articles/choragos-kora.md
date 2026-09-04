---
slug: choragos-kora
pageTitle: "Choragos — Une constellation d'IA autour de Kora — Florent Klimacek"
headline: "Choragos — Une constellation d'IA autour de Kora"
description: "Présentation de Choragos, une application de bureau qui réunit plusieurs modèles d'IA dans une constellation 3D, et de Kora, l'orchestratrice qui choisit qui répond."
ogTitle: "Choragos — Une constellation d'IA autour de Kora"
ogDescription: "Présentation de Choragos, une application de bureau qui réunit plusieurs modèles d'IA dans une constellation 3D, et de Kora, l'orchestratrice qui choisit qui répond."
ogUrl: "/choragos-kora.html"
canonical: "/choragos-kora.html"
datePublished: "2026-09-04"
dateModified: "2026-09-04"
keywords:
  - Choragos
  - Kora
  - orchestrateur IA
  - constellation d'IA
  - modèles de langage
  - souveraineté cognitive
  - IA locale
  - Ollama
permalink: "/choragos-kora.html"
navLabel: "Choragos"
navDescription: "Une constellation d'IA autour de Kora"
heroLabel: "Outil"
heroH1: "Choragos<br /><span class=\"glitch-text\">Constellation d'IA</span>"
heroIntro: "Quand plusieurs intelligences artificielles travaillent sous le regard d'une orchestratrice."
headerTitle: "Choragos & Kora"
heroImage: "/images/choragos.png"
heroImageAlt: "Capture d'écran de Choragos — constellation d'orbes 3D autour de Kora"
breadcrumbName: "Choragos & Kora"
sections:
  - id: le-probleme
    title: "Le problème"
  - id: la-constellation
    title: "La constellation"
  - id: kora
    title: "Kora"
  - id: memoire
    title: "Mémoire"
  - id: souverainete
    title: "Souveraineté"
  - id: kairos
    title: "Choragos et KAIROS"
  - id: etat
    title: "État actuel"
card:
  label: "Outil"
  title: "Choragos & Kora"
  desc: "Une application de bureau qui réunit plusieurs modèles d'IA dans une constellation 3D, orchestrée par Kora."
  readingTime: "6 min"
  linkText: "Découvrir Choragos"
  featured: false
feedCategory: "Outil"
feedTime: "10:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
order: 20
---

<!-- Le problème -->
<section id="le-probleme">
  <p class="lead">
    Nous avons l'habitude de parler à l'IA comme à un interlocuteur unique. Une
    fenêtre, un fil, un seul modèle. Mais chaque intelligence artificielle a ses
    angles morts, ses biais, ses façons de raconter le monde. Demander la même
    chose à Claude, à ChatGPT ou à un modèle local ne donne pas la même
    réponse — et c'est exactement le point.
  </p>

  <p>
    Le vrai risque n'est pas qu'un modèle se trompe. C'est que nous
    oublions que la réponse qu'il donne n'est qu'<em class="highlight">une</em>
    version possible. Trianguler manuellement entre plusieurs services est
    possible, mais fastidieux : on copie, on colle, on compare des fenêtres,
    on perd le fil. La friction est telle qu'on finit par reposer la question
    au même interlocuteur.
  </p>

  <div class="key-insight">
    <p>
      Choragos part d'une idée simple : rendre visibles plusieurs IA en même
      temps, pour qu'on puisse choisir qui répond, comparer, et ne plus confondre
      une perspective avec la vérité.
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
    Ouvrir Choragos, c'est entrer dans un espace où flottent plusieurs
    <strong>orbes</strong>. Au centre, une sphère plus grande, plus lumineuse :
    Kora. Autour d'elle, les autres orbes représentent les modèles disponibles —
    Claude, ChatGPT, DeepSeek, Mistral, Groq, et un worker qui tourne en local
    grâce à Ollama.
  </p>

  <p>
    Chaque orbe est un interlocuteur à part entière. Un clic ouvre un panneau de
    conversation dédié, avec son propre fil, sa propre mémoire de discussion.
    On peut poser la même question à trois modèles différents et comparer leurs
    réponses côte à côte. On peut aussi laisser un fil s'approfondir pendant que
    l'on explore autre chose ailleurs.
  </p>

  <div class="concept">
    <p class="concept-title">Constellation, pas tableau de bord</p>
    <p>
      L'interface ne ressemble pas à un centre de contrôle. Elle ressemble à un
      ciel nocturne où chaque modèle a sa place, sa couleur, son attitude. Le
      but n'est pas d'optimiser des requêtes. C'est de garder présent à l'esprit
      que l'IA est multiple.
    </p>
  </div>

  <p>
    La navigation est libre. On peut tourner autour de la scène, rapprocher une
    orbe, s'éloigner. Cette spatialisation n'est pas un gadget : elle donne une
    forme concrète à une idée abstraite — que l'intelligence artificielle n'est
    pas un monolithe, mais un ensemble de points de vue qu'il faut savoir
    articuler.
  </p>
</section>

<!-- Kora -->
<div class="chapter-divider" id="kora">
  <p class="label">Partie II</p>
  <h2>Kora</h2>
</div>

<section>
  <p>
    Kora est l'orchestratrice. Elle ne répond pas toujours elle-même : son
    travail, c'est de comprendre la requête, de décider quel modèle est le plus
    à même d'y répondre, puis de recomposer le résultat si nécessaire. Si une
    question demande du raisonnement lent, elle oriente vers Claude. Si elle
    nécessite une réponse rapide, elle choisit Groq. Si elle touche à un sujet
    sensible, elle peut demander confirmation avant d'agir.
  </p>

  <p>
    Cette dernière nuance change tout. Dans la plupart des outils, une action
    déclenchée par l'IA — ouvrir un fichier, lancer une recherche, appeler une
    autre application — s'exécute dès que le modèle le décide. Choragos refuse
    ce principe. Une action classée peu fiable ne s'exécute jamais sans que
    l'utilisateur approuve explicitement. Kora peut suggérer, proposer,
    recommander. Elle ne décide pas à votre place.
  </p>

  <div class="key-insight">
    <p>
      Kora est une médiation, pas une délégation. Elle ne remplace pas votre
      jugement ; elle organise les ressources pour que votre jugement soit
      mieux informé.
    </p>
  </div>

  <p>
    Quand une réponse arrive, un halo doré court autour de l'orbe concernée.
    Quand Kora délègue, un filament lumineux relie son noyau à l'orbe choisie.
    Rien n'est caché. L'orchestration est visible.
  </p>

  <figure>
    <img src="/images/kora.png" alt="Kora au centre de la constellation Choragos" class="hero-image" loading="lazy">
    <figcaption style="text-align: center; font-size: 0.9rem; opacity: 0.75; margin-top: 0.5rem;">
      Kora, l'orbe centrale de Choragos.
    </figcaption>
  </figure>
</section>

<!-- Mémoire -->
<div class="chapter-divider" id="memoire">
  <p class="label">Partie III</p>
  <h2>Mémoire</h2>
</div>

<section>
  <p>
    Une IA utile doit se souvenir de qui vous êtes. Mais la mémoire est aussi un
    risque : elle peut figer des interprétations fausses, amplifier des biais,
    réécrire votre profil à votre insu. Choragos traite cette question avec une
    règle stricte.
  </p>

  <p>
    La mémoire de Kora est partagée en deux. D'un côté, un <strong>socle
    stable</strong> que l'utilisateur écrit lui-même : qui il est, comment il
    pense, ce qu'il attend de Kora. De l'autre, des notes que Kora propose
    d'ajouter après avoir observé les échanges. Mais ces notes ne sont jamais
    écrites automatiquement. Elles arrivent sous la forme d'un contrat clair,
    que l'utilisateur lit, corrige ou refuse.
  </p>

  <p>
    Chaque écriture mémoire est confirmée visuellement. Un panneau dédié permet
    de tout consulter et de tout modifier. Kora n'apprend rien que vous n'ayez
    validé.
  </p>

  <div class="concept">
    <p class="concept-title">Mémoire sous contrôle</p>
    <p>
      L'objectif n'est pas que Kora devine qui vous êtes. C'est qu'elle vous
      propose une image de vous-même, que vous pouvez accepter, corriger ou
      effacer.
    </p>
  </div>
</section>

<!-- Souveraineté -->
<div class="chapter-divider" id="souverainete">
  <p class="label">Partie IV</p>
  <h2>Souveraineté</h2>
</div>

<section>
  <p>
    Choragos est une application de bureau. Elle s'installe sur votre machine,
    pas dans un navigateur. Vos conversations restent dans une base de données
    locale. Vos clés API sont chiffrées par le système d'exploitation. Même les
    modèles cloud ne voient que les messages que vous leur envoyez explicitement.
  </p>

  <p>
    Le worker Ollama, lui, ne sort pas de l'ordinateur. Il tourne en local,
    sans clé, sans abonnement, sans serveur distant. Cela permet de traiter des
    sujets ou des documents sans les envoyer chez un prestataire. Ce n'est pas
    une garantie absolue, mais c'est une posture : privilégier le local quand
    c'est possible, et ne pas rendre l'utilisateur dépendant d'un seul fournisseur.
  </p>

  <p>
    Un tableau de bord suit le coût et le volume de requêtes par modèle. L'idée
    est simple : ce qui est mesuré devient visible. Quand on voit combien on
    dépense et où, on reprend un peu de maîtrise.
  </p>
</section>

<!-- Choragos et KAIROS -->
<div class="chapter-divider" id="kairos">
  <p class="label">Partie V</p>
  <h2>Choragos et KAIROS</h2>
</div>

<section>
  <p>
    Choragos et KAIROS sont des outils sœurs. KAIROS vous aide à penser sur un
    canvas : des vignettes, des connexions, une cartographie de votre pensée.
    Choragos vous aide à parler à plusieurs IA sans en faire votre seule fenêtre
    sur le monde.
  </p>

  <p>
    Les deux partagent la même intuition : l'intelligence artificielle est
    utile quand elle reste <em class="highlight">à sa place</em>. Chez KAIROS,
    cette place est un miroir qui rend visibles les dynamiques de votre pensée.
    Chez Choragos, c'est une constellation où chaque modèle garde son identité.
  </p>

  <div class="key-insight">
    <p>
      KAIROS organise les idées. Choragos organise les interlocuteurs. Les deux
      tentent de répondre à la même angoisse : ne plus confondre l'outil avec
      notre propre jugement.
    </p>
  </div>
</section>

<!-- État actuel -->
<section id="etat">
  <div class="section-header">
    <span class="section-number">Conclusion</span>
    <h2>État actuel</h2>
  </div>

  <p>
    Choragos est un projet personnel, en développement actif. Il n'est pas un
    produit fini, ni un assistant générique prêt à tout faire. C'est un
    environnement de travail pour qui veut expérimenter avec plusieurs modèles
    d'IA en gardant le contrôle.
  </p>

  <p>
    Aujourd'hui, trois orbes sont visibles dans la constellation : Kora, Claude,
    et le worker Ollama local. D'autres modèles sont configurés mais restent
    masqués tant que Kora ne les sollicite pas réellement. L'interface, les
    conversations, la mémoire et le tableau de bord fonctionnent. Le reste
    continue de se construire.
  </p>

  <blockquote>
    <p>
      Choragos ne promet pas de tout savoir. Il promet seulement de montrer
      qu'il y a plusieurs voix — et de vous laisser choisir laquelle écouter.
    </p>
  </blockquote>
</section>
