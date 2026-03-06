---
slug: variable-manquante
pageTitle: "La variable manquante — Florent Klimacek"
headline: "La variable manquante"
description: "72 000 lignes en 33 jours : le vibe coding n'a pas de problème de résultat, il a un problème de méthode. Ce qui fait la différence, c'est ce que l'humain apporte avant la première ligne de code."
ogTitle: "La variable manquante"
ogDescription: "72 000 lignes en 33 jours : le vibe coding n'a pas de problème de résultat, il a un problème de méthode."
ogUrl: "/variable-manquante.html"
canonical: "/variable-manquante.html"
datePublished: "2026-03-06"
dateModified: "2026-03-06"
keywords:
  - vibe coding
  - méthodologie
  - Claude Code
  - KAIROS
  - développement assisté par IA
  - architecture logicielle
  - productivité
permalink: "/variable-manquante.html"
navLabel: "Article"
navDescription: "La variable manquante"
heroLabel: "Article"
heroH1: "La variable<br><span>manquante</span>"
heroIntro: "72 000 lignes, 33 jours, un développeur, zéro équipe. Le vibe coding n'a pas de problème de résultat. Il a un problème de méthode."
headerTitle: "La variable manquante"
heroImage: "/images/variable-manquante.webp"
heroImageAlt: "Illustration — La variable manquante : direction stratégique humaine et exécution accélérée par l'IA"
breadcrumbName: "La variable manquante"
sections:
  - id: mesures
    title: "Les mesures"
  - id: debat
    title: "Le débat tourne mal"
  - id: acceleration
    title: "Ce que l'IA fait vite"
  - id: limites
    title: "Ce que l'IA ne fait pas"
  - id: variable
    title: "La variable ignorée"
  - id: deplacement
    title: "Ce qui change vraiment"
card:
  label: "Article"
  title: "La variable manquante"
  desc: "72 000 lignes en 33 jours : le vibe coding n'a pas de problème de résultat, il a un problème de méthode."
  readingTime: "7 min"
  linkText: "Lire l'article"
  featured: false
feedCategory: "Article"
feedTime: "10:00:00"
sitemapPriority: "0.8"
sitemapChangefreq: "monthly"
order: 0
---

      <!-- 1. Les mesures -->
      <section id="mesures">
        <p class="lead">
          39 400 lignes de TypeScript applicatif. 17 100 lignes de CSS — quatre thèmes, architecture @layer, animations, accessibilité. 633 tests unitaires. Sept fournisseurs LLM intégrés. Une base SQLite avec undo/redo, multi-canvas, persistance complète. Un système de scoring cognitif en temps réel. Un design system modulaire avec douze fichiers composants.
        </p>

        <p>
          72 000 lignes au total. 33 jours de développement. Un seul développeur.
        </p>

        <p>
          L'outil s'appelle KAIROS. C'est une application Electron de cartographie cognitive assistée par IA. Je l'ai construite presque entièrement en vibe coding avec Claude Code.
        </p>

        <p>
          Estimation d'un développeur senior solo, sans IA, pour le même périmètre : 12 à 18 mois à temps plein. Le facteur d'accélération se situe entre x10 et x15.
        </p>

        <div class="key-insight">
          <p>Ce ne sont pas des projections. Ce sont des mesures.</p>
        </div>
      </section>

      <!-- 2. Le débat tourne mal -->
      <div class="chapter-divider" id="debat">
        <p class="label">Constat</p>
        <h2>Le débat tourne, mais pas autour du bon axe</h2>
        <p class="subtitle">Le vibe coding divise. Les deux camps ont raison — sur leurs exemples respectifs.</p>
      </div>

      <section>
        <p>
          D'un côté, les enthousiastes brandissent la vitesse : des prototypes en quelques heures, des MVP en un week-end, des démos spectaculaires. De l'autre, les développeurs expérimentés pointent — à raison — les dégâts : du code fragile, des architectures incohérentes, des produits qui s'effondrent dès qu'on pousse au-delà de la démo.
        </p>

        <p>
          Ce qui manque, ce n'est pas un arbitre. C'est une variable.
        </p>

        <p>
          Le débat pose la question « est-ce que le vibe coding fonctionne ? » comme s'il s'agissait d'une propriété de l'outil. Oui ou non. Mais le vibe coding n'est pas une méthode unique — c'est un spectre. À une extrémité, un prompt vague lancé dans le vide, itéré par essai-erreur jusqu'à ce que quelque chose tienne. À l'autre, une architecture documentée, des contraintes explicites, un contexte structuré qui nourrit chaque interaction.
        </p>

        <p>
          Les résultats entre ces deux pôles n'ont rien en commun. Les mettre dans la même catégorie revient à comparer un croquis sur un coin de table et un plan d'architecte sous prétexte que les deux utilisent un crayon.
        </p>

        <div class="key-insight">
          <p>La question n'est pas <em>est-ce que ça marche</em>. La question est <em>sous quelles conditions</em>.</p>
        </div>
      </section>

      <!-- 3. Ce que l'IA fait vite -->
      <div class="chapter-divider" id="acceleration">
        <p class="label">Accélération</p>
        <h2>Ce que l'IA fait vite — et ce qu'elle fait vraiment</h2>
        <p class="subtitle">La répétition structurée est exactement ce que le modèle accélère.</p>
      </div>

      <section>
        <p>
          17 000 lignes de CSS cohérent. Quatre thèmes (Obsidian, Porcelain, Aurora, Kraft), chacun avec ses tokens de couleur, ses variantes de composants, ses adaptations au mode sombre et clair. Une architecture @layer en sept niveaux — reset, tokens, thèmes, base, composants, modes, pages, utilitaires. Le support <code>prefers-reduced-motion</code>. Les animations Bézier sur les connexions SVG.
        </p>

        <p>
          Un humain ferait ce travail. Il le ferait bien. Il le ferait en quatre à six semaines, parce que le CSS à cette échelle est un travail de moine : répétitif dans sa structure, exigeant dans ses détails, punitif à la moindre incohérence. Claude Code l'a fait en trois jours. Pas parce qu'il est meilleur — parce que la répétition structurée est exactement ce que le modèle accélère.
        </p>

        <p>
          Même constat sur le boilerplate. Les handlers IPC entre le processus principal et le renderer, les repositories CRUD, les types TypeScript, les migrations de base de données — du code nécessaire, souvent identique dans sa forme, variable dans ses détails. L'IA génère, l'humain vérifie. Le ratio s'inverse par rapport au développement classique : au lieu d'écrire 80% et relire 20%, on relit 80% et on écrit 20%.
        </p>

        <p>
          Les tests, aussi. 633 tests, 22 fichiers, avec les bons mocks, les edge cases, les scénarios de régression. Écrire des tests est un acte de discipline que la plupart des développeurs solo repoussent indéfiniment. L'IA ne repousse rien — elle n'a pas de préférence. Tu demandes, elle écrit.
        </p>

        <p>
          Et le refactoring. Quand une décision d'architecture change, les conséquences cascadent sur dix, quinze, vingt fichiers. En développement classique, c'est le moment où tu hésites à faire le changement, parce que le coût de propagation est élevé. Avec l'IA, le coût chute. Tu changes l'architecture <em>parce que c'est la bonne décision</em>, pas parce que c'est la décision compatible avec l'état actuel du code. Cette différence est plus importante qu'elle n'en a l'air.
        </p>
      </section>

      <!-- 4. Ce que l'IA ne fait pas -->
      <div class="chapter-divider" id="limites">
        <p class="label">Limites</p>
        <h2>Ce que l'IA ne fait pas du tout</h2>
        <p class="subtitle">L'IA a écrit le code. Elle n'a pas inventé l'idée qu'une conversation pouvait s'asphyxier.</p>
      </div>

      <section>
        <p>
          KAIROS repose sur des concepts qui n'existent dans aucun dataset d'entraînement. Un système de scoring cognitif en temps réel, des postures d'interaction adaptatives, des mécaniques de friction qui forcent la pensée à se repositionner quand la conversation tourne en rond. Tout cela vient d'un cerveau humain qui a passé des mois à observer ce que personne ne mesurait.
        </p>

        <p>
          Et puis il y a l'autre face invisible : ce qui n'a pas été construit. Deux features avaient été conçues, prototypées, parfois même partiellement codées. F057 — les vignettes latentes — et F060 — le signal surprise. Elles ont été abandonnées. Pas par manque de temps. Par décision. Parce qu'après analyse, elles traitaient des symptômes et non des causes. L'IA aurait construit les deux sans sourciller. C'est l'humain qui a dit non.
        </p>

        <div class="key-insight">
          <p>Savoir ne pas construire ne fait partie d'aucun benchmark de productivité. C'est pourtant la compétence la plus coûteuse à acquérir et la plus rentable à exercer. Le vibe coding accélère la construction. Il n'accélère pas le jugement. Et un outil construit sans jugement est un outil qui encombre.</p>
        </div>
      </section>

      <!-- 5. La variable ignorée -->
      <div class="chapter-divider" id="variable">
        <p class="label">Analyse</p>
        <h2>La variable que personne ne mesure</h2>
        <p class="subtitle">Le facteur x15 n'est pas une propriété de Claude Code. C'est le produit d'une interaction entre l'IA et un contexte préparé.</p>
      </div>

      <section>
        <p>
          KAIROS a été développé avec une documentation structurée maintenue en continu : un registre technique à jour, des guides d'architecture, des conventions explicites (IDs en <code>crypto.randomUUID()</code>, jamais <code>Date.now()</code> ; CSS emoji en UTF-8 littéral, jamais en escape hex ; hooks centralisés, jamais de fonctions locales directes). Chaque session de développement commence avec un contexte chargé — pas un prompt en roue libre.
        </p>

        <p>
          La différence entre le vibe coding qui produit du bruit et celui qui produit un système tient dans ce que l'humain apporte <em>avant</em> que l'IA écrive la première ligne. L'architecture posée sur papier. Les contraintes nommées. Les erreurs passées documentées pour ne pas les reproduire. Ce n'est pas du prompt engineering — c'est de l'ingénierie tout court, appliquée à un outil différent.
        </p>

        <p>
          Les développeurs seniors qui critiquent le vibe coding ont raison quand ils décrivent des projets construits sans cette rigueur. Le code est fragile, l'architecture est incohérente, le produit s'effondre. Mais la conclusion qu'ils en tirent — que le vibe coding est intrinsèquement déficient — confond l'absence de méthode avec une limite de l'outil.
        </p>

        <blockquote>
          <p>Un marteau ne construit pas de maison. Un marteau dans la main de quelqu'un qui sait lire un plan, si.</p>
        </blockquote>
      </section>

      <!-- 6. Ce qui change vraiment -->
      <section id="deplacement">
        <h2>Ce qui change vraiment</h2>

        <p>
          Le métier ne disparaît pas. Il se déplace.
        </p>

        <p>
          En 33 jours, j'ai écrit peut-être 5% du code de KAIROS à la main. Les 95% restants ont été générés, revus, parfois régénérés, parfois jetés. Mon travail n'a pas été d'écrire — il a été de décider. Décider quoi construire, dans quel ordre, avec quelles contraintes. Décider quand le résultat était suffisant et quand il fallait recommencer. Décider ce qu'il ne fallait pas construire du tout.
        </p>

        <p>
          C'est un changement de nature, pas de degré. Le développeur qui refuse le vibe coding protège un savoir-faire réel — écrire du code propre, maintenable, testé — mais ce savoir-faire migre. Il ne s'exerce plus dans l'écriture. Il s'exerce dans le cadrage, la relecture, la décision d'architecture. Les mêmes compétences, un autre point d'application.
        </p>

        <div class="key-insight">
          <p>Le vibe coding sans rigueur produit des ruines. Le vibe coding avec rigueur produit 72 000 lignes en 33 jours.</p>
        </div>

        <p>
          Ce n'est pas l'outil qui fait la différence. C'est ce que tu sais avant de l'ouvrir.
        </p>
      </section>
