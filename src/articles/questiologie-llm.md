---
slug: questiologie-llm
pageTitle: "Questiologie et LLM — Florent Klimacek"
headline: "Questiologie et LLM"
description: "Étude comparative de l'influence des postures questiologiques sur les réponses de Claude et ChatGPT — six types de questions analysés."
ogTitle: "Questiologie et LLM"
ogDescription: "Étude comparative de l'influence des postures questiologiques sur les réponses de Claude et ChatGPT — six types de questions analysés."
ogUrl: "/questiologie-llm.html"
canonical: "/questiologie-llm.html"
datePublished: "2026-01-20"
dateModified: "2026-01-20"
keywords:
  - questiologie
  - LLM
  - postures questiologiques
  - Claude
  - ChatGPT
  - prompt engineering
permalink: "/questiologie-llm.html"
navLabel: "Étude"
navDescription: "Influence des postures questiologiques sur les réponses des LLM"
heroLabel: "Analyse comparative empirique"
heroH1: "Influence des postures <span>questiologiques</span> sur les LLM"
heroIntro: "Comment la formulation d'une question oriente la génération —\nune étude comparative entre Claude et ChatGPT."
headerTitle: "Questiologie et LLM"
breadcrumbName: "Questiologie et LLM"
sections:
  - id: introduction
    title: "Introduction"
  - id: postures
    title: "Les quatre postures"
  - id: resultats
    title: "Résultats"
  - id: modeles
    title: "Claude vs ChatGPT"
  - id: discussion
    title: "Discussion"
  - id: conclusion
    title: "Conclusion"
card:
  label: "Étude comparative"
  title: "Questiologie et LLM"
  desc: "Influence des postures questiologiques sur les réponses des modèles — comparaison Claude vs ChatGPT sur six types de questions."
  readingTime: "3 min"
  linkText: "Lire l'article"
feedCategory: "Analyse"
feedTime: "10:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
order: 0
---

      <!-- Introduction -->
      <section id="introduction">
        <p class="lead">
          Les grands modèles de langage sont souvent interrogés comme des moteurs de recherche améliorés : on leur pose une question, ils fournissent une réponse. Cette approche ignore un phénomène que les praticiens expérimentés observent intuitivement : la manière de formuler une question influence profondément la nature de la réponse générée.
        </p>

        <p>
          Non seulement son ton ou sa longueur, mais les contenus qu'elle mobilise, les angles qu'elle explore, les dimensions qu'elle ignore.
        </p>

        <p>
          La <em class="highlight">Questiologie</em>, cadre théorique développé par Frédéric Falisse, propose une grille de lecture pour ce phénomène. Conçue initialement pour les interactions humaines, elle postule que différentes formulations de questions induisent différentes « postures cognitives » chez l'interlocuteur.
        </p>

        <div class="concept">
          <p class="concept-title">Hypothèse centrale</p>
          <p>
            Les postures questiologiques s'appliquent également aux LLM. Si tel est le cas, la formulation d'une question ne serait pas un détail stylistique mais un <strong>levier d'orientation de la génération</strong> — un outil permettant d'activer différents « <a href="pensee-en-faisceau.html">faisceaux</a> » de contextes dans le modèle.
          </p>
        </div>
      </section>

      <!-- Les quatre postures -->
      <section id="postures">
        <div class="section-header">
          <span class="section-number">02</span>
          <h2>Les quatre postures questiologiques</h2>
          <p class="subtitle">Une question, quatre orientations cognitives</p>
        </div>

        <div class="postures-grid">
          <div class="posture-card action">
            <h4>ACTION</h4>
            <p>Pousse à l'action concrète, aux conseils procéduraux.</p>
            <p class="question">« Comment faire pour... ? »</p>
          </div>
          <div class="posture-card introspectif">
            <h4>INTROSPECTIF</h4>
            <p>Oriente vers l'exploration émotionnelle et sensorielle.</p>
            <p class="question">« Qu'est-ce que je ressens quand... ? »</p>
          </div>
          <div class="posture-card reflexif">
            <h4>RÉFLEXIF</h4>
            <p>Invite à la métacognition et à questionner les présupposés.</p>
            <p class="question">« Sur quelles hypothèses repose... ? »</p>
          </div>
          <div class="posture-card recul">
            <h4>RECUL</h4>
            <p>Pousse à observer un processus de l'extérieur, description mécaniste.</p>
            <p class="question">« Qu'est-ce qui se passe quand... ? »</p>
          </div>
        </div>

        <p>
          Pour tester l'hypothèse, six questions identiques ont été soumises à deux modèles : <strong>Claude Sonnet 4.5</strong> (Anthropic) et <strong>ChatGPT</strong> (OpenAI). Quatre questions portaient sur la procrastination, chacune formulée selon une posture pure. Deux questions portaient sur la solitude, formulées selon des postures hybrides combinant deux orientations.
        </p>
      </section>

      <!-- Résultats -->
      <section id="resultats">
        <div class="section-header">
          <span class="section-number">03</span>
          <h2>Résultats</h2>
          <p class="subtitle">Confirmation des quatre hypothèses de départ</p>
        </div>

        <ul class="results-list">
          <li>
            <span>Les deux modèles <strong>adaptent clairement leur génération</strong> selon la posture questionnante : Action produit des conseils procéduraux, Introspective génère une exploration émotionnelle, Réflexive déclenche une déconstruction des présupposés, Recul active une description mécaniste.</span>
          </li>
          <li>
            <span>Les postures <strong>Réflexive et Recul activent davantage de faisceaux</strong> que la posture Action. Là où Action génère une liste de conseils relativement linéaire, Réflexif et Recul convoquent simultanément des dimensions philosophiques, sociologiques et cognitives.</span>
          </li>
          <li>
            <span>Les <strong>postures hybrides génèrent des faisceaux plus larges</strong>. Face à une question combinant Action et Introspection, les deux modèles structurent explicitement leur réponse en deux volets et activent des registres habituellement séparés.</span>
          </li>
          <li>
            <span>Chaque modèle présente une <strong>signature distinctive</strong> : Claude adopte un registre conversationnel-empathique, ChatGPT adopte un registre analytique-structuré.</span>
          </li>
        </ul>

        <div class="key-insight">
          <p>Cette différenciation n'est pas cosmétique — elle touche le <em>registre lexical</em>, la <em>structure argumentative</em> et le <em>type de contenus mobilisés</em>.</p>
        </div>
      </section>

      <!-- Modèles -->
      <section id="modeles">
        <div class="section-header">
          <span class="section-number">04</span>
          <h2>Claude vs ChatGPT</h2>
          <p class="subtitle">Deux épistémologies face aux mêmes questions</p>
        </div>

        <div class="model-comparison">
          <div class="model-box claude">
            <h4>Claude</h4>
            <p class="model-trait">Phénoménologique</p>
            <p class="model-trait">Empathique</p>
            <p class="model-trait">Questions de relance</p>
            <p class="model-trait">Prose fluide, tutoiement</p>
            <p class="model-trait">Tend à réhabiliter ce qu'il analyse</p>
          </div>
          <div class="model-box chatgpt">
            <h4>ChatGPT</h4>
            <p class="model-trait">Mécaniste</p>
            <p class="model-trait">Analytique</p>
            <p class="model-trait">Synthèses structurées</p>
            <p class="model-trait">Numérotation, titres</p>
            <p class="model-trait">Position d'observateur externe</p>
          </div>
        </div>

        <p>
          Sur le fond, Claude est plus phénoménologique, ChatGPT plus mécaniste — deux épistémologies différentes face aux mêmes questions. Cette divergence ne relève pas de la qualité mais du <em class="highlight">style cognitif</em>.
        </p>

        <p>
          Elle suggère que le choix du modèle — une dimension explorée dans <a href="politesse-algorithmique.html">La Politesse Algorithmique</a> — combiné au choix de la posture, constitue un <strong>double levier d'orientation</strong>.
        </p>
      </section>

      <!-- Discussion -->
      <section id="discussion">
        <div class="section-header">
          <span class="section-number">05</span>
          <h2>Discussion</h2>
        </div>

        <p>
          Ces résultats suggèrent que les LLM ne traitent pas les questions comme de simples requêtes d'information. La structure syntaxique et l'orientation implicite d'une question activent des chemins de génération distincts.
        </p>

        <div class="concept">
          <p class="concept-title">Implication pratique</p>
          <p>
            Formuler une question, c'est déjà orienter la réponse. Plutôt que de poser des questions simples et d'itérer, un utilisateur averti peut formuler d'emblée une question combinant deux orientations pour obtenir une réponse plus riche.
          </p>
        </div>

        <p>
          L'efficacité particulière des postures hybrides ouvre une piste pratique. La Questiologie, conçue pour l'humain, révèle ainsi une pertinence inattendue dans l'interaction avec les agents conversationnels.
        </p>
      </section>

      <!-- Conclusion -->
      <section id="conclusion">
        <div class="section-header">
          <span class="section-number">06</span>
          <h2>Conclusion</h2>
        </div>

        <p>
          Cette étude démontre empiriquement que la formulation d'une question n'est pas neutre face aux LLM. Les postures questiologiques de Falisse — Action, Introspective, Réflexive, Recul — produisent des réponses structurellement différentes, tant dans leur forme que dans leur contenu.
        </p>

        <p>
          <strong>Les modèles ne se contentent pas de répondre : ils répondent <em>depuis</em> une orientation cognitive induite par la question elle-même.</strong>
        </p>

        <p>
          Pour l'utilisateur, c'est un levier concret :
        </p>

        <ul class="results-list">
          <li><span>Vouloir des solutions appelle une <strong>posture Action</strong></span></li>
          <li><span>Explorer un vécu appelle une <strong>posture Introspective</strong></span></li>
          <li><span>Déconstruire un présupposé appelle une <strong>posture Réflexive</strong></span></li>
          <li><span>Comprendre un mécanisme appelle une <strong>posture Recul</strong></span></li>
        </ul>

        <div class="key-insight">
          <p>La question n'est plus seulement <em>quoi</em> demander,<br>mais <em>comment</em> le demander.</p>
        </div>
      </section>
