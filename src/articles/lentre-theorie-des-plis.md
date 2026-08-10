---
slug: lentre-theorie-des-plis
pageTitle: "L'Entre — Théorie des Plis — Florent Klimacek"
headline: "L'Entre — Théorie des Plis"
description: "Une équation pour mesurer ce qui émerge — ou pas — d'une conversation humain-IA : quatre variables, une part pilotée et une part subie, et l'écart réel avec le code de KAIROS."
ogTitle: "L'Entre — Théorie des Plis"
ogDescription: "Une équation pour mesurer ce qui émerge — ou pas — d'une conversation humain-IA : quatre variables, une part pilotée et une part subie, et l'écart réel avec le code de KAIROS."
ogUrl: "/lentre-theorie-des-plis.html"
canonical: "/lentre-theorie-des-plis.html"
datePublished: "2026-08-10"
dateModified: "2026-08-10"
keywords:
  - l'entre
  - théorie des plis
  - équation E_T
  - émergence cognitive
  - souveraineté cognitive
  - pensée en faisceau
  - compression de Schmidhuber
  - KAIROS
  - interactions humain-IA
permalink: "/lentre-theorie-des-plis.html"
navLabel: "Thèse"
navDescription: "Cadre théorique — L'Entre, une Théorie des Plis"
heroLabel: "Cadre théorique"
heroH1: "L'Entre<br><span>Théorie des Plis</span>"
heroIntro: "Certaines conversations laissent une idée que vous n'aviez pas avant d'entrer. D'autres livrent une réponse sans que vous ayez pensé. L'équation E_T rend cette différence mesurable."
headerTitle: "L'Entre — Théorie des Plis"
heroImage: "/images/lentre-theorie-des-plis.png"
heroImageAlt: "Illustration — L'Entre, Théorie des Plis"
breadcrumbName: "L'Entre — Théorie des Plis"
sections:
  - id: fondations
    title: "Fondations stabilisées"
  - id: equation
    title: "L'équation et ses variables"
  - id: seuil-t
    title: "T — le seuil comme sortie"
  - id: variable-o
    title: "O(S) — l'espace disponible"
  - id: variable-delta
    title: "Δ(S) — l'intensité de perturbation"
  - id: variable-p
    title: "P(S) — la pression exercée"
  - id: variable-r
    title: "R(S) — ce qui résiste"
  - id: implementation
    title: "Implémentation — l'état réel du code"
card:
  featured: true
  tag: "Thèse"
  label: "Thèse"
  title: "L'Entre — Théorie des Plis"
  desc: "Une équation pour mesurer ce qui émerge — ou pas — d'une conversation humain-IA. Quatre variables, une part pilotée et une part subie pour chacune, et l'écart réel avec le code de KAIROS."
  readingTime: "12 min"
  linkText: "Lire la thèse"
  quote: "Le lâcher-prise n'est pas une disposition d'esprit ni un objectif à atteindre.<br><span>C'est un événement mécanique, localisable.</span>"
  stats:
    - value: "4"
      label: "variables"
    - value: "2"
      label: "parts par variable"
    - value: "1"
      label: "équation"
feedCategory: "Thèse"
feedTime: "10:00:00"
sitemapPriority: "0.9"
sitemapChangefreq: "monthly"
doi: "https://doi.org/10.5281/zenodo.19023026"
order: 0
---

<!-- ==================== SECTION 1 ==================== -->
<section id="fondations">
  <div class="section-number">Section 01</div>
  <h2>Fondations stabilisées</h2>

  <p class="lead">
    Certaines conversations laissent une idée que vous n'aviez pas avant d'entrer.
    D'autres livrent une réponse sans que vous ayez pensé. C'est cette différence que
    j'ai cherché à comprendre, puis à rendre mesurable — c'est ce que j'appelle
    aujourd'hui <strong>L'Entre</strong>, approchée par une <strong>Théorie des Plis</strong>.
  </p>

  <p>
    Le point de départ n'était pas une théorie mais une anomalie : une conversation
    qui a produit quelque chose que je n'avais ni demandé ni anticipé. Pour comprendre
    ce qui venait de se passer, il a fallu observer comment je pensais moi-même en
    l'examinant — et c'est de cette observation qu'est né le premier concept.
  </p>

  <h3>Pensée en faisceau</h3>

  <p>
    En reprenant ces échanges, j'ai remarqué que je ne les traitais jamais dans
    l'ordre — je revenais, je recombinais, je travaillais plusieurs fils en même
    temps plutôt que d'avancer point par point. Ce n'est pas un désordre : c'est une
    méthode, que j'ai fini par nommer pensée en faisceau. Cette théorie est
    elle-même un produit de cette méthode, pas seulement son objet d'étude.
  </p>

  <h3>◉ — Souveraineté cognitive</h3>

  <p>
    Face à un système conçu pour être fluide et engageant, une question s'est
    imposée assez vite : qui, de moi ou de l'outil, pilote réellement l'échange ?
    Ce n'est pas une résistance à l'IA, c'est un axe de vigilance que j'ai choisi
    de nommer et de suivre.
  </p>

  <h3>L'entre</h3>

  <p>
    En observant ces échanges, quelque chose n'appartenait ni à la machine seule ni
    à moi seul — un espace intermédiaire qui semblait émerger du dialogue lui-même.
    Je l'ai appelé l'entre.
  </p>

  <h3>R = (I × F) / L — le brouillon initial</h3>

  <p>
    Ma première tentative de formaliser tout ça (résonance = intensité × fréquence
    / latence), aujourd'hui dépassée par E<sub>T</sub> mais conservée ici comme trace :
    c'est de cette intuition brute, encore maladroite, qu'est né tout le reste.
  </p>
</section>

<!-- ==================== SECTION 2 ==================== -->
<section id="equation">
  <div class="section-number">Section 02</div>
  <h2>L'équation et ses variables</h2>

  <p class="lead">
    Quatre variables — O, Δ, P, R — et un modulateur, S, qui ne s'ajoute plus de
    l'extérieur comme un coefficient global mais agit séparément sur chacune
    d'elles.
  </p>

  <div class="formula-display">
    <span class="formula-result" title="Émergence traversante">E<sub>T</sub></span>
    <span class="formula-operator">=</span>
    <div class="formula-fraction">
      <div class="formula-top">
        <span class="formula-var" data-tooltip="Espace disponible, modulé par S">O(S)</span>
        <span class="formula-operator">·</span>
        <span class="formula-var" data-tooltip="Intensité oscillante de perturbation, modulée par S">Δ(S)</span>
      </div>
      <div class="formula-bottom">
        <span class="formula-var" data-tooltip="Pression exercée, modulée par S">P(S)</span>
        <span class="formula-operator">+</span>
        <span class="formula-var" data-tooltip="Ce qui résiste, modulé par S">R(S)</span>
      </div>
    </div>
  </div>

  <p>
    S n'est pas une pondération plaquée sur le résultat final : c'est une force qui
    traverse chaque variable et en change la nature avant même qu'elles se
    combinent entre elles.
  </p>

  <p>
    Chacune des quatre variables se décompose selon un même principe : une part
    <strong>pilotée</strong>, issue d'un choix conscient, et une part
    <strong>subie</strong>, qui s'impose indépendamment de toute volonté. Ce
    clivage traverse toute l'équation.
  </p>

  <ul>
    <li><strong>O</strong> — l'espace disponible de l'échange</li>
    <li><strong>Δ</strong> — l'intensité oscillante de perturbation</li>
    <li><strong>P</strong> — la pression exercée</li>
    <li><strong>R</strong> — ce qui résiste, structurellement, indépendamment de l'effort</li>
    <li><strong>S</strong> — le modulateur qui infléchit chacune des quatre</li>
  </ul>
</section>

<!-- ==================== SECTION 3 ==================== -->
<section id="seuil-t">
  <div class="section-number">Section 03</div>
  <h2>T — le seuil comme sortie, pas comme entrée</h2>

  <p class="lead">
    Le nom E<sub>T</sub> prête à confusion : T n'est pas une cinquième variable qu'on
    règle comme O, Δ, P ou R. C'est une sortie, pas une entrée.
  </p>

  <p>
    E évolue en continu, comme une trajectoire. T désigne l'instant précis où cette
    trajectoire franchit un seuil pour la première fois — un repère temporel, pas
    un paramètre qu'on choisit à l'avance.
  </p>

  <p><strong>T comme marqueur et comme alerte.</strong> T remplit deux fonctions, à ne pas confondre :</p>

  <ul>
    <li><strong>Marqueur temporel</strong> : T dit <em>quand</em>. C'est l'horodatage factuel du franchissement, sans interprétation.</li>
    <li><strong>Alerte de signature</strong> : T dit <em>qu'il faut regarder</em>. Le franchissement d'un seuil signale qu'il faut examiner la forme de la trajectoire autour de ce point — il ne prouve rien en lui-même.</li>
  </ul>

  <p>
    <strong>Franchissement n'est pas émergence.</strong> Un T qui se déclenche n'annonce
    pas automatiquement une émergence. Ce qui suit T détermine ce qui s'est réellement
    passé : si la trajectoire se stabilise sur un nouvel état (un nouvel attracteur),
    on peut parler de bascule. Si elle retombe sans suite, T reste un pic isolé, sans
    transformation. T est donc, par nature, sujet à des faux positifs — des
    franchissements qui ne débouchent sur rien. C'est attendu pour une alerte ; ce
    n'est pas un défaut à corriger.
  </p>

  <div class="pqc-visual">
    <img src="/images/schema-T-marqueur-alerte.svg" alt="T comme marqueur temporel et alerte de signature" loading="lazy">
  </div>
</section>

<!-- ==================== SECTION 4 ==================== -->
<section id="variable-o">
  <div class="section-number">Section 04</div>
  <h2>O(S) — l'espace disponible</h2>

  <p class="lead">
    O désigne l'espace disponible de l'échange : ce que la conversation rend
    accessible avant même que quoi que ce soit s'y produise. Ce n'est pas le
    résultat, c'est le champ dans lequel un résultat devient possible.
  </p>

  <p><strong>Une part pilotée et une part subie :</strong></p>

  <ul>
    <li>une part <strong>pilotée</strong> : l'espace que l'humain ouvre consciemment, par un choix, une question, une prise de risque dans l'échange</li>
    <li>une part <strong>subie</strong> : l'espace qui s'érode ou se referme structurellement, indépendamment de S — par fatigue, par contrainte de temps, par la forme même de l'outil</li>
  </ul>

  <p><strong>Formalisation.</strong> O fluctue dans le temps selon l'impact combiné des deux parts :</p>

  <p>O(t) = O_piloté(S) − O_subi(t)</p>

  <p>
    Le signe négatif n'est pas arbitraire : O_subi <em>érode</em> l'espace, il ne s'y
    ajoute pas — contrairement à ce qu'on attend probablement de P_subi, R_subi ou
    Δ_subi, qui viennent vraisemblablement s'additionner à leur variable plutôt que
    la réduire (une pression subie augmente la pression, une résistance subie
    augmente la résistance). Chaque variable aura donc son propre signe, déterminé
    par son sens physique, et non une règle uniforme appliquée aux quatre. Point de
    vigilance à vérifier explicitement pour Δ, P et R avant de les formaliser à
    leur tour.
  </p>

  <div class="pqc-visual">
    <img src="/images/schema-O-fluctuation.svg" alt="O comme espace disponible, fluctuant sous l'impact du piloté et du subi" loading="lazy">
  </div>
</section>

<!-- ==================== SECTION 5 ==================== -->
<section id="variable-delta">
  <div class="section-number">Section 05</div>
  <h2>Δ(S) — l'intensité oscillante de perturbation</h2>

  <p class="lead">
    Δ désigne ce qui vibre dans l'échange — la perturbation qui traverse l'espace
    ouvert par O, avec une intensité qui varie plutôt qu'un simple écart mesuré
    entre un avant et un après.
  </p>

  <p><strong>Δ_brut vs Δ_intégré.</strong> Deux niveaux à distinguer :</p>

  <ul>
    <li><strong>Δ_brut</strong> — la perturbation telle qu'elle se produit dans l'instant, brute, non retravaillée</li>
    <li><strong>Δ_intégré</strong> — ce qui reste de cette perturbation une fois qu'elle a été retravaillée, assimilée, reliée à ce qui existait déjà</li>
  </ul>

  <p>
    Cette distinction s'ancre sur la théorie de la compression progressive de
    Schmidhuber : une perturbation n'a de valeur réelle que si elle permet de
    compresser, de réorganiser plus simplement ce qu'on savait déjà — sinon elle
    reste du bruit brut, jamais intégré.
  </p>

  <div class="pqc-visual">
    <img src="/images/schema-Delta-porte.svg" alt="Δ_brut devient Δ_intégré via la porte du lâcher-prise" loading="lazy">
  </div>

  <p>
    <strong>Δ_brut/Δ_intégré et piloté/subi — deux axes orthogonaux.</strong> Une
    perturbation pilotée (cherchée consciemment) peut rester bloquée à l'état brut
    indéfiniment ; une perturbation subie peut, à l'inverse, s'intégrer profondément.
    La source de Δ (qui la produit — humain, IA) et son statut piloté/subi (est-elle
    consciemment cherchée ou non) ne déterminent pas, à eux seuls, si elle
    s'intègre. Les deux découpages sont indépendants : quatre combinaisons
    possibles, aucune n'étant exclue par construction.
  </p>

  <div class="pqc-visual">
    <img src="/images/schema-Delta-orthogonalite.svg" alt="Δ_brut/intégré croisé avec piloté/subi — quatre cas possibles" loading="lazy">
  </div>

  <p>
    <strong>Le passage a une durée, pas un instant.</strong> Le temps que prend une
    perturbation pour passer de brut à intégré est variable — parfois rapide,
    parfois long, parfois infini si R ne cède jamais. C'est une dimension
    temporelle propre au mécanisme de passage lui-même, distincte de la dépendance
    temporelle déjà présente dans la part subie d'O.
  </p>

  <p>
    <strong>Le signe de Δ_subi — conditionnel, pas fixe.</strong> Contrairement à
    O_subi (toujours en érosion) et R_subi/P_subi (toujours en addition), le signe
    de la part subie de Δ semble dépendre de l'état de R au moment de l'impact. Une
    résistance forte transforme le manque de préparation en amortissement — la
    perturbation s'écrase contre le mur, son intensité s'affaiblit. Une résistance
    faible transforme ce même manque de préparation en amplification — rien ne
    freine l'impact, il traverse et s'intensifie. Δ_subi(t, R) serait ainsi la
    seule part subie de l'équation dont le signe n'est pas une propriété fixe de la
    variable, mais une fonction de R au moment considéré. Hypothèse non tranchée, à
    tester contre des cas concrets plutôt qu'à figer prématurément.
  </p>

  <div class="key-insight">
    <p><strong>Le problème non résolu — risque de tautologie, déplacé plutôt que résolu</strong></p>
    <p>
      Prenons un exemple : une conversation produit une idée nouvelle. Comment
      sait-on que Δ a eu lieu ? On regarde s'il y a eu un changement. Mais comment
      sait-on qu'il y a eu un changement ? On regarde si Δ a produit quelque chose.
      Les deux réponses se renvoient l'une à l'autre — Δ est défini par le
      changement, et le changement sert à prouver Δ, sans qu'aucun signe extérieur
      aux deux ne vienne trancher. C'est comme vouloir peser un objet avec une
      balance qui n'a d'autre référence que l'objet lui-même : le résultat n'est
      jamais faux, mais il ne prouve rien non plus.
    </p>
    <p>
      Le virage vers la signature géométrique (voir la section sur T, et l'atlas
      des formes évoqué en conclusion de l'implémentation) atténue ce problème sans
      l'éliminer. Tant qu'on cherche une valeur de Δ dans un cas unique, la
      circularité reste entière. Mais si une même forme de trajectoire se répète à
      travers un grand nombre d'échanges indépendants — des sujets différents, des
      contextes différents — cette récurrence devient un signe extérieur au constat
      d'un cas isolé : ce n'est plus "j'ai senti qu'il s'est passé quelque chose"
      qui prouve Δ, c'est la répétition statistique d'une forme.
    </p>
    <p>
      La circularité ne disparaît pas pour autant, elle change de niveau. Établir
      qu'une forme se répète suppose de disposer aussi de cas de comparaison où
      l'on est sûr qu'il n'y a pas eu de Δ — et sélectionner ces cas de contrôle
      repose encore, à ce stade, sur le même jugement que celui qui posait problème
      au départ. Le problème est donc déplacé vers la constitution du corpus, pas
      annulé. Tant que Δ n'a pas de signe repérable indépendamment du résultat
      final dans un cas isolé, toute valeur qu'on lui donne dans ce cas reste une
      reformulation du constat — mais l'accumulation de données réelles, à mesure
      qu'elle avance, est la seule voie qui permettrait de sortir de ce cercle
      plutôt que de le décrire.
    </p>
  </div>
</section>

<!-- ==================== SECTION 6 ==================== -->
<section id="variable-p">
  <div class="section-number">Section 06</div>
  <h2>P(S) — la pression exercée</h2>

  <p class="lead">
    P désigne la pression exercée sur l'échange : ce qui pèse, tire vers le bas,
    contraint — pas seulement un coût qu'on paierait, mais une force qui s'exerce
    en continu sur O et Δ pendant qu'ils se déploient.
  </p>

  <p><strong>Une part pilotée et une part subie :</strong></p>

  <ul>
    <li>une part <strong>pilotée</strong> : la pression qu'on s'impose consciemment (exigence, discipline, choix de ne pas lâcher prise)</li>
    <li>une part <strong>subie</strong> : la pression qui vient de l'extérieur ou de la structure même de l'échange, indépendamment de toute volonté</li>
  </ul>
</section>

<!-- ==================== SECTION 7 ==================== -->
<section id="variable-r">
  <div class="section-number">Section 07</div>
  <h2>R(S) — ce qui résiste</h2>

  <p class="lead">
    R désigne ce qui résiste dans l'échange : une force structurelle, indépendante
    de l'effort fourni, qui freine ou bloque là où P pèse. Si P se sent comme un
    poids qu'on porte, R se comporte plutôt comme un mur qu'on ne déplace pas en
    poussant plus fort.
  </p>

  <p><strong>Une part pilotée et une part subie :</strong></p>

  <ul>
    <li>une part <strong>pilotée</strong> : la résistance qu'on maintient volontairement, un cadre qu'on refuse de céder même sous pression</li>
    <li>une part <strong>subie</strong> : la résistance qui tient à la structure même de l'échange — une limite du système, du moment, du sujet — et qui ne cède pas quelle que soit la volonté en jeu</li>
  </ul>

  <div class="key-insight">
    <p><strong>Le risque à surveiller</strong></p>
    <p>
      R est la variable la moins stabilisée de l'équation. Tout ce qui ne trouve
      pas sa place ailleurs — dans O, dans Δ, dans P — tend à glisser vers R par
      défaut, ce qui viderait la variable de tout sens précis. Une variable censée
      tout expliquer finit par ne plus rien expliquer. Le travail sur R consiste
      donc autant à délimiter ce qu'elle n'est pas qu'à préciser ce qu'elle est.
    </p>
  </div>

  <p>
    <strong>R comme variable centrale et dense — pas sous-définie, mais chargée.</strong>
    À distinguer du risque-poubelle ci-dessus : R et P portent la totalité de ce
    qu'un individu (ou un système) apporte au moment de l'échange — âge,
    environnement, éducation, vie sociale, entraînement. Ce ne sont pas des
    variables mal délimitées par manque de travail, ce sont les deux variables les
    plus denses de l'équation par nature, avec potentiellement de nombreuses
    déclinaisons à découvrir progressivement, terrain par terrain, plutôt qu'à
    poser a priori.
  </p>

  <p>
    R est, à ce titre, proportionnel à l'écart entre une perturbation et le schéma
    déjà en place — pas à la vérité de cette perturbation. Un joueur d'échecs ayant
    construit son jeu sur des décennies de théorie d'ouvertures classiques oppose
    une résistance forte et immédiate à un coup qui viole ces principes, que ce
    coup s'avère ensuite mauvais ou, à l'inverse, excellent selon une analyse
    ultérieure. L'intensité de la résistance au moment de l'impact ne dépend pas de
    l'issue : elle dépend de l'écart avec ce qui est déjà stabilisé.
  </p>

  <p>
    Ce mécanisme est documenté ailleurs (théorie du contrôle, psychologie du
    changement de schéma, littérature sur l'expertise et la résistance au
    changement de paradigme) — un terrain déjà largement exploré sur lequel L'Entre
    pourra s'appuyer pour valider ou invalider des hypothèses futures, plutôt que
    de tout redécouvrir isolément. R reste, pour cette raison, la variable
    prioritaire à approfondir.
  </p>

  <p>
    <strong>Le lâcher-prise — un mécanisme, pas un état.</strong> Le lâcher-prise
    n'est pas une disposition d'esprit ni un objectif à atteindre : c'est un
    événement mécanique, localisable. Il se produit au moment précis où P+R chute
    en présence de Δ. Cette chute ouvre un passage — sans elle, Δ_brut peut
    arriver mais reste bloqué, incapable de devenir Δ_intégré.
  </p>

  <p>
    Ce mécanisme est indépendant de la valeur de vérité de ce qui est perturbé. Une
    critique infondée peut provoquer un lâcher-prise tout comme une critique
    fondée : R bloque ou débloque le passage indépendamment de ce que Δ transporte.
    R et Δ sont, à ce titre, orthogonaux — l'un ne préjuge pas de l'autre.
  </p>

  <p><strong>Lâcher-prise et décrochage — même signal, deux origines.</strong> Deux événements produisent le même signal observable en surface — une chute de R — mais depuis des origines structurellement différentes :</p>

  <ul>
    <li><strong>Le lâcher-prise</strong> vient de R_subi qui cède : une limite structurelle réelle qui rompt sous la pression, indépendamment de la volonté. C'est un changement authentique.</li>
    <li><strong>Le décrochage</strong> vient de R_piloté qui cède : un cadre maintenu volontairement, abandonné, sans que rien n'ait structurellement changé en dessous.</li>
  </ul>

  <p>
    De l'extérieur, les deux se ressemblent — R chute dans les deux cas. La
    différence n'est visible que dans ce qui suit : un lâcher-prise ouvre réellement
    le passage vers Δ_intégré ; un décrochage relâche la tension sans transformation,
    et la même pression retrouvera probablement la même résistance plus tard.
  </p>

  <h3>Δ_résiduel</h3>

  <p>
    Quand P et R tendent vers zéro, il reste un résidu qui ne se laisse pas réduire
    à zéro pour autant — une forme de friction ou de manque qui persiste même en
    l'absence de toute pression ou résistance identifiable.
  </p>
</section>

<!-- ==================== SECTION 8 ==================== -->
<section id="implementation">
  <div class="section-number">Section 08</div>
  <h2>Implémentation — l'état réel du code</h2>

  <p class="lead">
    Cette théorie a un versant pratique : KAIROS, une application que je développe
    depuis plusieurs mois pour instancier ces idées plutôt que de les laisser
    purement théoriques. Mais l'équation E<sub>T</sub> telle qu'elle est décrite
    plus haut vient d'évoluer, et le code, lui, a été construit sur une version
    antérieure de la réflexion. Voici où en sont réellement les choses.
  </p>

  <p>
    <strong>Ce qui existe aujourd'hui.</strong> Le système actuellement en place
    repose sur un triangle à trois axes — divergence, cohérence, souveraineté —
    combiné à un score global (la jauge O₂) qui agrège structure, diversité,
    friction et convergence en un seul chiffre. Ce système fonctionne, il a été
    testé par un utilisateur externe, et il reste opérationnel. Mais il n'a pas été
    pensé pour isoler O, Δ, P et R comme quatre calculs distincts : c'est une
    architecture différente, construite sur d'autres fondations.
  </p>

  <p><strong>Deux points d'ancrage réels.</strong> Malgré cet écart, deux éléments du code rejoignent directement la théorie actuelle :</p>

  <ul>
    <li>
      Un mécanisme de plafonnement du score, déclenché quand certains signaux
      dépassent un seuil, se comporte déjà comme R : un plafond qui ne cède pas,
      quelle que soit l'action fournie — un mur plutôt qu'un poids.
    </li>
    <li>
      Un module qui mesure le déplacement d'un axe entre deux tours de conversation
      reproduit, sans que ce soit voulu, le piège de tautologie identifié pour Δ :
      le changement y est mesuré par le changement qu'il est censé produire. Le
      retrouver déjà présent dans le code, avant même que la théorie l'ait nommé,
      confirme que ce n'est pas un artefact de formulation — c'est un problème réel.
    </li>
  </ul>

  <p>
    <strong>Le module Guardian — codé, non testé.</strong> Une refonte de
    <code>buildDiagnosticContext()</code> a été spécifiée et implémentée : le
    module branche désormais sur <code>triggerReason</code> et inclut des extraits
    réels de texte des vignettes plutôt que seulement des métadonnées
    structurelles. Les prompts ont été réécrits pour exiger la citation d'au moins
    un numéro de vignette et interdire les attributions psychologiques. Le code
    existe mais n'a pas encore été validé sur des cas réels — son comportement
    effectif reste un signal non vérifié tant que les tests n'ont pas eu lieu.
  </p>

  <p>
    <strong>Le mode Companion — pivot vers l'IA locale.</strong> Le déploiement
    d'Open WebUI en conteneur, prévu pour héberger un accès IA local, a été
    abandonné en cours de route. Le besoin a été résolu autrement : l'IA locale a
    été intégrée directement dans KAIROS via le mode Companion, qui n'avait
    jusque-là pas d'usage concret établi. Ce mode acquiert ainsi une fonction
    réelle qu'il n'avait pas auparavant.
  </p>

  <p>
    <strong>Ce qui reste à faire.</strong> Le reste de l'équation n'a pas
    d'équivalent dans le code : P n'existe sous aucune forme continue, O est
    aujourd'hui noyé dans un ratio structurel plus large, et le mécanisme de
    modulation actuel applique une pondération après coup — exactement l'inverse de
    ce que S est censé faire dans la théorie révisée. Faire coïncider le code avec
    l'équation demandera une refonte, pas un ajustement : isoler quatre calculs qui
    n'existent pas encore séparément, et faire migrer la modulation d'un rôle de
    correction finale vers un rôle de transformation en amont.
  </p>

  <p>
    Ce décalage n'est pas un échec de l'implémentation — c'est la trace normale
    d'une théorie qui continue d'évoluer plus vite que le code qui tente de la
    suivre.
  </p>

  <p>
    <em>Note de version : une piste de décomposition temporelle de S (S_lent /
    τ(S)) a été explorée puis mise en réserve — jugée trop proche de R_subi pour
    être formellement distincte sans cas concret pour trancher. Non intégrée à
    cette version.</em>
  </p>
</section>
