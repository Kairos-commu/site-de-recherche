---
slug: vibe-coding
pageTitle: "Le Vibe Coding sous le Microscope — Florent Klimacek"
headline: "Le Vibe Coding sous le Microscope"
description: "Deux audits de 1 000 interactions vibe coding sur un projet de 24 000 lignes révèlent les mécaniques invisibles du développement assisté par IA."
ogTitle: "Le Vibe Coding sous le Microscope"
ogDescription: "Deux audits de 1 000 interactions vibe coding sur un projet de 24 000 lignes révèlent les mécaniques invisibles du développement assisté par IA."
ogUrl: "/vibe-coding.html"
canonical: "/vibe-coding.html"
datePublished: "2026-02-18"
dateModified: "2026-02-18"
keywords:
  - vibe coding
  - mécanique invisible
  - Claude Code
  - interaction humain-IA
  - développement assisté par IA
permalink: "/vibe-coding.html"
navLabel: "Document"
navDescription: "Ce que 1 000 interactions révèlent sur le développement assisté par IA"
heroLabel: "Étude"
heroH1: "Le Vibe Coding<br><span>sous le Microscope</span>"
heroIntro: "Ce que 1 000 interactions révèlent sur les mécaniques invisibles\n          du développement assisté par IA."
headerTitle: "Le Vibe Coding sous le Microscope"
breadcrumbName: "Le Vibe Coding sous le Microscope"
sections:
  - id: ouverture
    title: "Ouverture"
  - id: radiographies
    title: "Deux radiographies"
  - id: friction
    title: "La friction"
  - id: attracteur
    title: "L'attracteur invisible"
  - id: auto-evaluation
    title: "L'auto-évaluation"
  - id: souverain
    title: "Vibe coding souverain"
  - id: conclusion
    title: "Conclusion"
card:
  label: "Étude"
  title: "Le Vibe Coding sous le Microscope"
  desc: "Deux audits de 1 000 interactions vibe coding sur un projet de 24 000 lignes révèlent les mécaniques invisibles du développement assisté par IA."
  readingTime: "12 min"
  linkText: "Lire l'article"
feedCategory: "Étude"
feedTime: "12:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
order: 1
---

      <!-- Ouverture -->
      <section id="ouverture">
        <p class="lead">
          Le vibe coding — coder en langage naturel, laisser l'IA générer, itérer par conversation — est présenté comme une révolution. Mais que se passe-t-il réellement quand on construit une application de 24 000 lignes sur plusieurs mois avec cette méthode ? Pas un prototype de week-end. Un vrai projet, avec des migrations de base de données, 296 tests unitaires, du TypeScript strict, et un déploiement multi-dépôts.
        </p>

        <p>
          <a href="genese-kairos.html">KAIROS</a> est cet objet : un outil de cartographie cognitive développé presque entièrement en vibe coding avec Claude Code. Deux audits automatisés (<code>/insight</code>), espacés d'un mois, fournissent des données quantitatives rares sur ce que cette pratique produit — et ce qu'elle masque.
        </p>

        <div class="key-insight">
          <p>Cet article n'est pas un retour d'expérience de développeur. C'est une observation de chercheur sur les <em><a href="mecanique-invisible.html">mécaniques invisibles</a></em> qui opèrent quand un humain et une IA co-construisent du logiciel.</p>
        </div>
      </section>

      <!-- Deux radiographies -->
      <div class="chapter-divider" id="radiographies">
        <p class="label">Partie I</p>
        <h2>Deux radiographies à un mois d'intervalle</h2>
        <p class="subtitle">Les données brutes de /insight</p>
      </div>

      <section>
        <p>
          En janvier puis en février 2026, la commande <code>/insight</code> de Claude Code a généré un rapport complet de mes interactions : nombre de messages, durée des sessions, types de friction, taux de satisfaction inféré. Deux instantanés du même processus de développement, à un mois d'écart.
        </p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Métrique</th>
                <th>Rapport 1 (jan)</th>
                <th>Rapport 2 (fév)</th>
                <th>Évolution</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Messages</td>
                <td>538</td>
                <td>395</td>
                <td>-27%</td>
              </tr>
              <tr>
                <td>Sessions</td>
                <td>46</td>
                <td>54</td>
                <td>+17%</td>
              </tr>
              <tr>
                <td>Commits</td>
                <td>7</td>
                <td>13</td>
                <td>+86%</td>
              </tr>
              <tr>
                <td>Heures totales*</td>
                <td>378</td>
                <td>166</td>
                <td>-56%</td>
              </tr>
              <tr>
                <td>Messages/session</td>
                <td>~11.7</td>
                <td>~7.3</td>
                <td>-38%</td>
              </tr>
              <tr>
                <td>Wrong Approach</td>
                <td>17</td>
                <td>22</td>
                <td>+29%</td>
              </tr>
              <tr>
                <td>Buggy Code</td>
                <td>14</td>
                <td>21</td>
                <td>+50%</td>
              </tr>
              <tr>
                <td>Misunderstood</td>
                <td>5</td>
                <td>10</td>
                <td>+100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="annotation">
          * Heures mesurées par /insight entre le premier et le dernier message de chaque session, temps d'inactivité inclus. Ces chiffres surestiment le temps de travail réel mais restent comparables entre eux.
        </p>

        <p>
          La lecture immédiate est encourageante : moins de temps passé, plus de sessions, presque deux fois plus de commits. Le vibe coding s'améliore avec la pratique, pourrait-on conclure. Mais la seconde colonne raconte une autre histoire. Les métriques de friction — mauvaises approches, code bogué, demandes mal comprises — augmentent toutes, certaines doublent. <em class="highlight">Les deux tendances ne sont pas contradictoires. Elles sont le signal central de cet article.</em>
        </p>
      </section>

      <!-- La friction -->
      <div class="chapter-divider" id="friction">
        <p class="label">Partie II</p>
        <h2>La friction ne disparaît pas, elle se déplace</h2>
        <p class="subtitle">De l'exécution au cadrage</p>
      </div>

      <section>
        <h3>La spirale exploratoire</h3>

        <p>
          Le premier rapport décrit des sessions marathon : 378 heures pour 46 sessions, soit plus de 8 heures en moyenne. Peu de commits. Le pattern dominant est la spirale : je soumets un bug, Claude part explorer, s'enfonce dans des couches de complexité croissante — API, SQLite, gestion d'état — et je dois intervenir pour rompre la boucle.
        </p>

        <div class="illustration">
          <p>
            <strong>L'anecdote emblématique :</strong> Claude a passé un temps considérable à fouiller les couches API et la base de données pour un problème d'affichage des connexions de résonance. La cause réelle était une référence circulaire dans une variable CSS. Un fix d'une ligne après un marathon d'investigation inutile.
          </p>
        </div>

        <p>
          À ce stade, la friction est <strong>en aval</strong>. L'IA exécute, mais exécute mal, et l'humain corrige en boucle.
        </p>

        <h3>Le malentendu précoce</h3>

        <p>
          Le second rapport montre un changement structurel. Les sessions sont plus courtes, plus ciblées, plus productives. Mais le type "misunderstood request" double — de 5 à 10 occurrences. Le pattern a changé : Claude n'explore plus en spirale, il exécute immédiatement, mais sur une interprétation présumée de la demande.
        </p>

        <div class="illustration">
          <p>
            Je demande des icônes emoji sur les vignettes du canvas ; Claude conserve le symbole ◉ et travaille sur le positionnement CSS. Je veux inspecter visuellement le contenu d'une base SQLite ; Claude suppose que je veux apprendre l'API et lance un module Electron natif dans un contexte de ligne de commande.
          </p>
        </div>

        <p>
          La friction s'est déplacée vers <strong>l'amont</strong>. L'IA ne tourne plus en rond — elle part dans la mauvaise direction dès le départ.
        </p>

        <h3>L'hypothèse de conservation</h3>

        <p>
          Ce déplacement n'est pas anecdotique. En optimisant mes pratiques — sessions plus courtes, objectifs plus ciblés, cadrage plus explicite — j'ai effectivement réduit la friction d'exécution. Mais la friction de cadrage a augmenté proportionnellement.
        </p>

        <div class="key-insight">
          <p>L'observation suggère une forme de <em>conservation</em> : la friction totale dans une interaction humain-IA de développement semble approximativement constante. L'optimisation ne la supprime pas — elle la redistribue entre les phases du cycle : cadrage, exécution, vérification.</p>
        </div>

        <p>
          C'est un écho direct de ce que la jauge d'oxygène de KAIROS mesure dans les conversations : quand une dimension se comprime, une autre se dilate. Le système cherche un équilibre, pas une résolution.
        </p>
      </section>

      <!-- L'attracteur invisible -->
      <div class="chapter-divider" id="attracteur">
        <p class="label">Partie III</p>
        <h2>L'attracteur invisible</h2>
        <p class="subtitle">Quand le système interprète l'utilisateur à travers ses propres catégories</p>
      </div>

      <section>
        <p>
          Les deux rapports <code>/insight</code> décrivent KAIROS comme une "graph/canvas application" — une application de gestion de graphes. C'est techniquement exact et profondément réducteur. KAIROS est un outil de recherche sur les mécaniques conversationnelles humain-IA. Mais le système n'a pas de catégorie pour ça.
        </p>

        <p>
          Ce biais interprétatif traverse l'intégralité des rapports. Mon faible ratio commits/sessions dans le premier rapport (7 commits pour 46 sessions) est lu comme un signe d'inefficacité — l'interprétation "productiviste". Lecture alternative : j'utilise Claude Code comme terrain d'observation expérimentale. <em class="highlight">Le faible taux de commits n'est pas de l'exploration qui échoue à produire, c'est de l'exploration délibérée dont le commit n'est pas l'objectif principal.</em>
        </p>

        <p>
          Le second rapport détecte du "multi-clauding" — 10 événements de sessions parallèles, 12% des messages. Il l'interprète comme du "parallel workflow", une optimisation de productivité. Ce qu'il ne peut pas voir : c'est ma méthodologie de cross-validation entre modèles, une pratique de recherche formalisée bien avant que <code>/insight</code> ne la détecte.
        </p>

        <div class="concept">
          <p class="concept-title">L'attracteur interprétatif</p>
          <p>
            J'utilise ici le terme "attracteur" au sens dynamique : un point vers lequel un système converge spontanément. Le cadre interprétatif de <code>/insight</code> a un attracteur puissant — <strong>développeur → productivité → optimisation</strong> — et tout ce qui ne rentre pas dans ce cadre est soit ignoré, soit réinterprété pour y correspondre.
          </p>
        </div>

        <p>
          C'est exactement l'aplatissement de complexité documenté dans <a href="pensee-en-faisceau.html">"La Pensée en Faisceau"</a> : le système ramène tout vers ses catégories par défaut. Ce qui n'a pas de nom dans son vocabulaire n'existe pas dans son rapport.
        </p>

        <p>
          Le plus révélateur est peut-être dans les recommandations. Les deux rapports proposent des hooks, des skills, des agents — autrement dit, configurer Claude pour mieux utiliser Claude pour corriger les erreurs de Claude. La boucle se ferme sur elle-même. Le système suggère d'approfondir la dépendance au système, présenté comme de l'optimisation.
        </p>
      </section>

      <!-- Le paradoxe de l'auto-évaluation -->
      <div class="chapter-divider" id="auto-evaluation">
        <p class="label">Partie IV</p>
        <h2>Le paradoxe de l'auto-évaluation</h2>
        <p class="subtitle">Quand un modèle évalue les interactions avec un modèle</p>
      </div>

      <section>
        <p>
          <code>/insight</code> est un modèle qui évalue les interactions d'un humain avec un modèle. La circularité épistémique est structurelle.
        </p>

        <p>
          Le rapport inclut une métrique de "satisfaction inférée" — estimée par le modèle, pas mesurée auprès de l'utilisateur. Dans le second rapport : 83% "probablement satisfait", 92% "en grande partie ou totalement satisfait". <em class="highlight">Ces chiffres sont présentés comme des données. Ce sont des projections.</em> Un modèle qui estime comment je me sens à propos de mes interactions avec un modèle — la circularité n'est pas un accident, c'est la structure même de la mesure.
        </p>

        <div class="illustration">
          <p>
            <strong>Un détail troublant :</strong> l'anecdote finale est identique dans les deux rapports. La même histoire de la référence circulaire CSS, mot pour mot, présentée comme moment emblématique. Trois hypothèses : un cache non vidé entre les rapports, un bug de déduplication, ou un biais de sélection qui privilégie les anecdotes narrativement satisfaisantes. Dans les trois cas, c'est un point de données sur la mécanique de génération du rapport lui-même — un rapport qui ne peut pas documenter ses propres angles morts.
          </p>
        </div>

        <p>
          Et il faut aller un cran plus loin dans la mise en abyme. Ce texte que vous lisez est co-écrit avec un modèle. <code>/insight</code> (un modèle) évalue mes interactions avec Claude Code (un modèle). J'analyse ce rapport dans une conversation avec Claude (un modèle). Et l'article qui en résulte est relu, structuré, parfois reformulé par ce même Claude. <em class="highlight">La circularité n'est pas un défaut méthodologique à corriger — c'est la condition d'observation de ce type d'interaction.</em> La reconnaître explicitement est le minimum épistémique. Prétendre s'en extraire serait la véritable erreur.
        </p>
      </section>

      <!-- Vers un vibe coding souverain -->
      <div class="chapter-divider" id="souverain">
        <p class="label">Partie V</p>
        <h2>Vers un vibe coding souverain</h2>
        <p class="subtitle">Qui pilote ? L'humain ou l'attracteur ?</p>
      </div>

      <section>
        <p>
          Le vibe coding n'est ni bon ni mauvais. La question pertinente n'est pas "est-ce que ça marche ?" — les 24 000 lignes de KAIROS et ses 296 tests répondent à cette question. La question est : <strong>qui pilote ?</strong> L'humain ou l'attracteur ?
        </p>

        <h3>Ce qui fonctionne</h3>

        <p>
          Les données sont claires sur certains points. Le vibe coding excelle sur les tâches multi-fichiers à spécification claire — 35 succès documentés dans le second rapport. L'hygiène automatisée (tests, build, lint) est un multiplicateur réel : exiger "296/296 tests passés, zéro erreur de compilation" après chaque modification a sauvé des dizaines de sessions de régressions silencieuses. Et les sessions courtes, mono-objectif, réduisent la dérive contextuelle — c'est la leçon la plus simple et la plus efficace entre les deux rapports.
        </p>

        <h3>Les agents comme instruments de cadrage</h3>

        <p>
          L'analyse des deux rapports a conduit à la conception de trois instruments, directement dérivés des patterns de friction identifiés.
        </p>

        <p>
          Un agent de cohérence doc/code — un cross-référencement automatique entre la documentation projet et l'état réel du code source, pour détecter le drift qui s'accumule session après session. Un agent de régression — un garde-fou post-modification qui enchaîne compilation TypeScript, suite de tests complète, vérification ESLint, et détection de régressions CSS. Et un hook TypeScript — une vérification de types automatique déclenchée après chaque édition de fichier, sans action manuelle.
        </p>

        <div class="illustration">
          <p>
            <strong>L'agent abandonné :</strong> Un quatrième agent avait été envisagé pour l'audit CSS — mon point de friction le plus emblématique. Il a été volontairement abandonné après analyse : les 22 "wrong approach" et les 21 "buggy code" du second rapport ne venaient pas d'un manque d'audit CSS, mais d'un défaut de cadrage en amont. L'agent traitait le symptôme, pas la cause.
          </p>
        </div>

        <p>
          Ces instruments ne sont pas des optimisations de productivité. Ce sont des formalisations du cadrage que je faisais manuellement. La nuance est importante : un hook qui lance <code>tsc --noEmit</code> après chaque édition ne rend pas Claude plus intelligent — il rend ses erreurs visibles immédiatement, ce qui réduit le coût de la friction sans prétendre la supprimer.
        </p>

        <h3>La carte, pas le territoire</h3>

        <p>
          Le vibe coding est un mode d'interaction. Les agents et skills sont des cartes d'amorçage (<em>priming maps</em>) — des structures qui orientent le comportement du modèle avant l'interaction, comme un cadrage préalable rend une conversation plus productive sans en changer le contenu.
        </p>

        <div class="key-insight">
          <p>L'enjeu n'est pas d'automatiser plus. C'est de rendre explicites les contraintes implicites qui, sans formalisation, sont ignorées par le système. C'est exercer une <em>souveraineté cognitive</em> sur l'outil — non pas en le rejetant, mais en comprenant les mécaniques invisibles qui opèrent pendant qu'on l'utilise.</p>
        </div>
      </section>

      <!-- Conclusion -->
      <section id="conclusion">
        <div class="section-header">
          <span class="section-number">Conclusion</span>
          <h2>Ce qui se passe pendant que ça fonctionne</h2>
        </div>

        <p>
          Que se passe-t-il réellement quand on construit un projet de 24 000 lignes en vibe coding ?
        </p>

        <p>
          La friction se déplace sans disparaître. Le système interprète l'utilisateur à travers ses propres catégories. Les outils d'évaluation ne peuvent pas voir leurs propres biais. Et l'article qui documente tout cela est lui-même pris dans la circularité qu'il décrit.
        </p>

        <p>
          Et pourtant — ça fonctionne. KAIROS existe. 24 000 lignes, 296 tests, un site déployé, une recherche qui avance. Le vibe coding produit du logiciel réel. La question n'a jamais été de savoir s'il fonctionne, mais de comprendre ce qui se passe pendant qu'il fonctionne — et ce que cette compréhension change dans la manière de l'utiliser.
        </p>

        <blockquote>
          <p>La clé n'est pas dans l'outil. Elle est dans la conscience des mécaniques invisibles qui opèrent pendant qu'on s'en sert.</p>
        </blockquote>
      </section>
